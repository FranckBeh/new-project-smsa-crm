const sequelize = require("../../config/database.js");
const { Sequelize } = require('sequelize');
const Societe = require('../models/societe');
const TypeClient = require('../models/typeClient');
const Client = require('../models/client');
const fs = require('fs');
const path = require('path');
const csv = require('csv-parser');
const nodemailer = require('nodemailer');
const bcrypt = require('bcrypt');
const cron = require('node-cron');
require('../models/association_clients');

const transporter = nodemailer.createTransport({
  host: 'mail.smsa-crm.com',
  port: 465,
  secure: true,
  auth: {
    user: 'test@smsa-crm.com',
    pass: 'smsa@@2024', // Remplacez par votre mot de passe réel
  },
});

// Fonction pour envoyer un e-mail
async function sendEmail(to, subject, html, attachments) {
  const mailOptions = {
    from: 'noreplaytest@smsa-crm.com',
    to,
    subject,
    html,
    attachments,
  };

  try {
    const info = await transporter.sendMail(mailOptions);
    console.log('E-mail envoyé : ', info.response);
  } catch (error) {
    console.error('Erreur lors de l\'envoi de l\'e-mail : ', error);
  }
}

// Fonction de hachage de mot de passe
function hashPassword(password) {
  const saltRounds = 10;
  return bcrypt.hashSync(password, saltRounds);
}

async function getCardTypeId(cardName, transaction) {
  let typeClient = await TypeClient.findOne({
    where: { NomType: cardName },
    transaction
  });

  if (!typeClient) {
    typeClient = await TypeClient.create({ NomType: cardName }, { transaction });
  }

  return typeClient.NumType;
}

// Fonction pour générer le contenu CSV à partir des clients
function generateCsvContent(clients) {
  let csvContent = "Card;SocieteName;Name;Gsm;Email;Expiration;Login;Action\n";

  clients.forEach(client => {
    const { card, societeName, name, gsm, email, expiration, login, action } = client;
    csvContent += `${card};${societeName};${name};${gsm};${email};${expiration};${login};${action}\n`;
  });

  return csvContent;
}

// Fonction pour importer les clients BP
async function importBpClients() {
  console.log("### importBpClients START ###");

  const srcPath = path.join(__dirname, 'private/bp_imports/attachments');
  const dstPath = path.join(__dirname, 'private/bp_imports/attachments/imported');
  console.log(`srcPath=${srcPath}`);
  console.log(`dstPath=${dstPath}`);

  if (!fs.existsSync(dstPath)) {
    fs.mkdirSync(dstPath, { recursive: true });
  }

  const clients = [];
  const files = fs.readdirSync(srcPath).filter(file => file.endsWith('.csv'));
  console.log(`${files.length} csv files found`);

  for (const file of files) {
    console.log(`Parsing file=${file} START`);
    const filePath = path.join(srcPath, file);
    const fileStream = fs.createReadStream(filePath);
    let isFirstRow = true;
    await new Promise((resolve, reject) => {
      fileStream.pipe(csv({ separator: ';' }))
        .on('data', (row) => {
          if (isFirstRow) {
            isFirstRow = false;
            return; // Ignorer la première ligne
          }

          const keys = Object.keys(row);
          const card = keys[0] ? row[keys[0]].trim() : '';
          const societeName = keys[1] ? row[keys[1]].trim() : '';
          const name = keys[2] ? row[keys[2]].trim() : '';
          const gsm = keys[3] ? row[keys[3]].trim() : '';
          const email = keys[4] ? row[keys[4]].trim() : '';
          const expiration = keys[5] ? row[keys[5]].trim() : '';
          const action = keys[6] ? row[keys[6]].trim() : '';

          clients.push({
            card,
            societeName,
            name,
            gsm,
            email,
            expiration,
            action
          });
        })
        .on('end', resolve)
        .on('error', reject);
    });

    console.log(`Parsing file=${file} END`);
  }

  console.log(`${clients.length} clients found in csv files`);

  for (const clientRow of clients) {
    if (!clientRow.name) continue;

    try {
      await sequelize.transaction(async (transaction) => {
        const cardTypeId = await getCardTypeId(clientRow.card, transaction);
        const whereClause = Sequelize.literal(`
          (LOWER(TRIM(CONCAT(Client.nom, ' ', Client.prenom))) = '${clientRow.name.toLowerCase()}'
          OR LOWER(TRIM(CONCAT(Client.prenom, ' ', Client.nom))) = '${clientRow.name.toLowerCase()}')
          AND TypeClient.NomType = '${clientRow.card}'
        `);

        const clientData = await Client.findOne({
          where: whereClause,
          include: [{ model: TypeClient, as: 'typeclient' }, { model: Societe, as: 'societe' }],
          transaction
        });

        if (clientData) {
          if (clientRow.action === 'C') {
            await Client.update({ expiration: '1970-01-01 00:00:01' }, { where: { IdClient: clientData.IdClient }, transaction });
          } else if (clientRow.action === 'N') {
            const updates = { expiration: '2030-01-01 00:00:00' };
            if (clientRow.gsm) updates.gsmPro = clientRow.gsm;
            if (clientRow.email) updates.mailPro = clientRow.email;
            await Client.update(updates, { where: { IdClient: clientData.IdClient }, transaction });
          }
        } else if (clientRow.action === 'N') {
          let societeId;
          const societeData = await Societe.findOne({ where: { nom: clientRow.societeName }, transaction });
          if (societeData) {
            societeId = societeData.idSociete;
          } else {
            const newSociete = await Societe.create({ nom: clientRow.societeName }, { transaction });
            societeId = newSociete.idSociete;
          }

          const nextBpLogin = await getNextBpLogin(transaction);
          const password = randomPassword();

          const newClient = await Client.create({
            nom: '',
            prenom: clientRow.name,
            login: nextBpLogin,
            typeclient_id: cardTypeId,
            societe_id: societeId,
            expiration: '2030-01-01 00:00:00',
            password: hashPassword(password),
            plain_pwd: password,
            mailPro: clientRow.email,
            gsmPro: clientRow.gsm
          }, { transaction });

          clientRow.login = nextBpLogin;
          clientRow.password = password;
        }
        // Définir l'action
        clientRow.action = clientRow.action === 'N' ? 'Ajouté' : 'Annulé';
      });
    } catch (error) {
      console.error('Error importing client:', clientRow, error);
    }
  }

  console.log("Sending email notification START");

  const receptionDate = new Date().toISOString().split('T')[0]; // Date au format YYYY-MM-DD
  const fileName = `liste_card_ben_conciergerie_${receptionDate}.csv`;
  const outputPath = path.join(__dirname, `private/bp_imports/attachments/imported/${fileName}`);
  const csvContent = generateCsvContent(clients);

  fs.writeFileSync(outputPath, csvContent);
  console.log(`New CSV file created: ${fileName}`);

  const mailOptions = {
    from: 'noreplytest@smsa-crm.com',
    to: 'franck@smsa.ma',
    subject: `[TEST Clients BCP NEW CRM] Automated import on ${new Date().toLocaleDateString()}`,
    html: generateEmailBody(clients),
    attachments: [{ filename: fileName, path: outputPath }]
  };

  try {
    await sendEmail(mailOptions.to, mailOptions.subject, mailOptions.html, mailOptions.attachments);
  } catch (error) {
    console.error('Error sending email notification:', error);
  }

  console.log("Sending email notification END");

   // Déplacer les fichiers importés
   console.log("Moving attachments START");
   for (const file of files) {
     fs.renameSync(path.join(srcPath, file), path.join(dstPath, file));
   }
   console.log("Moving attachments END");

  console.log("### importBpClients END ###");
}

function randomPassword() {
  const alphabet = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ1234567890';
  return Array.from({ length: 8 }, () => alphabet[Math.floor(Math.random() * alphabet.length)]).join('');
}

async function getNextBpLogin(transaction) {
  const result = await Client.findOne({
    attributes: [
      [sequelize.literal(`CONCAT('EXE', CAST(REPLACE(login, 'EXE', '') AS UNSIGNED) + 1)`), 'nextLogin']
    ],
    where: { login: { [Sequelize.Op.like]: 'EXE%' } },
    order: [[sequelize.literal('CAST(REPLACE(login, "EXE", "") AS UNSIGNED)'), 'DESC']],
    transaction,
    limit: 1
  });

  return result ? result.getDataValue('nextLogin') : 'EXE1000';
}

function generateEmailBody(clients) {
    let html = '<p>Bonjour,</p><p>Voici les clients importés:</p><table border="1" cellspacing="0" cellpadding="5"><thead><tr><th>Card</th><th>SocieteName</th><th>Name</th><th>Gsm</th><th>Email</th><th>Expiration</th><th>Login</th><th>Action</th><th>Password</th></tr></thead><tbody>';
  
    clients.forEach(client => {
      // Définir l'action avant de construire la ligne HTML
      client.action = client.action === 'Ajouté' ? 'Ajouté' : 'Annulé';
      const { card, societeName, name, gsm, email, expiration, login, action, password } = client;
      html += `<tr><td>${card}</td><td>${societeName}</td><td>${name}</td><td>${gsm}</td><td>${email}</td><td>${expiration}</td><td>${login}</td><td>${action}</td><td>${password}</td></tr>`;
    });
  
    html += '</tbody></table><p>Cordialement,</p><p>Votre équipe CRM</p>';
    return html;
  }
  

// Planification de la tâche avec node-cron
cron.schedule('* * * * *', () => {  // Exécute toutes les minutes pour les tests
    importBpClients();
  }, {
    scheduled: true,
    timezone: "Europe/Paris"
  });

module.exports = importBpClients;
