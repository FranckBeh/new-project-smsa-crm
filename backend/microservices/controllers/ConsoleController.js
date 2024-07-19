const sequelize = require("../../config/database.js");
const { Sequelize } = require('sequelize');
const Societe = require('../models/societe'); 
const TypeClient = require('../models/typeClient');
const  Client  = require('../models/client');
const fs = require('fs');
const path = require('path');
const csv = require('csv-parser');
const nodemailer = require('nodemailer');
const bcrypt = require('bcrypt');
const cron = require('node-cron');
require('../models/association_clients');
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

  return typeClient.id;
}

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
    console.log(`parsing file=${file} START`);
    const filePath = path.join(srcPath, file);
    const fileStream = fs.createReadStream(filePath);

    await new Promise((resolve, reject) => {
      fileStream.pipe(csv({ separator: ';' }))
        .on('data', (row) => {
          clients.push({
            card: row[0].trim(),
            societeName: row[1].trim(),
            name: row[2].trim(),
            gsm: row[3].trim(),
            email: row[4].trim(),
            expiration: row[5].trim(),
            action: row[6].trim()
          });
        })
        .on('end', resolve)
        .on('error', reject);
    });

    console.log(`parsing file=${file} END`);
  }

  console.log(`${clients.length} clients present in csv files`);

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
          include: [{ model: TypeClient }, { model: Societe }],
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
            idTypeClient: cardTypeId,
            idSociete: societeId,
            expiration: '2030-01-01 00:00:00',
            password: hashPassword(password),
            plain_pwd: password,
          }, { transaction });

          const updates = {};
          if (clientRow.gsm) updates.gsmPro = clientRow.gsm;
          if (clientRow.email) updates.mailPro = clientRow.email;
          if (Object.keys(updates).length > 0) {
            await Client.update(updates, { where: { IdClient: newClient.IdClient }, transaction });
          }
        }
      });
    } catch (error) {
      console.error('Erreur lors de l\'importation du client:', clientRow, error);
    }
  }

  console.log("Send email notification START");

  const transporter = nodemailer.createTransport({
    host: 'mail.smsa-crm.com',
    port: 465,
    secure: true,
    auth: {
      user: 'crm@smsa-crm.com',
      pass: 'bmypro123smsa',
    },
  });

  const mailOptions = {
    from: 'noreplay@smsa-crm.com',
    to: 'direction@smsa.ma, equipe@smsa.ma',
    subject: `[Clients BCP] Import automatique du ${new Date().toLocaleDateString()}`,
    html: generateEmailBody(clients),
    attachments: files.map(file => ({ path: path.join(srcPath, file) })),
  };

  transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
      console.log('Error: ', error);
    } else {
      console.log('Email sent: ', info.response);
    }
  });

  console.log("Send email notification END");

  console.log("Move attachments START");
  for (const file of files) {
    fs.renameSync(path.join(srcPath, file), path.join(dstPath, file));
  }
  console.log("Move attachments END");

  console.log("### importBpClients END ###");
}

function randomPassword() {
  const alphabet = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ1234567890';
  return Array.from({ length: 8 }, () => alphabet[Math.floor(Math.random() * alphabet.length)]).join('');
}

async function getNextBpLogin(transaction) {
  const result = await Client.findOne({
    attributes: [
      [sequelize.literal(`CONCAT('EXE', CAST(REPLACE(login, 'EXE', '') AS UNSIGNED) + 1)`), 'nextBpLogin']
    ],
    where: {
      login: { [Sequelize.Op.regexp]: 'EXE\\d*' }
    },
    order: [[sequelize.literal(`CAST(REPLACE(login, 'EXE', '') AS UNSIGNED)`), 'DESC']],
    transaction
  });
  return result ? result.get('nextBpLogin') : 'EXE1';
}

function getCardType(card) {
  switch (card) {
    case 'INTER BUS CARD':
      return 'BCP EXECUTIVE';
    case 'Pack Bladi Prestige':
      return 'BLADI PRESTIGE BCP';
    default:
      return 'BCP EXECUTIVE';
  }
}

function generateEmailBody(clients) {
  let body = `
    <table style='border-collapse: collapse;width: 100%;'>
      <tr>
        <th style='border: 1px solid #dddddd; text-align: left; padding: 8px;'>Carte</th>
        <th style='border: 1px solid #dddddd; text-align: left; padding: 8px;'>Societe</th>
        <th style='border: 1px solid #dddddd; text-align: left; padding: 8px;'>Nom complet</th>
        <th style='border: 1px solid #dddddd; text-align: left; padding: 8px;'>GSM</th>
        <th style='border: 1px solid #dddddd; text-align: left; padding: 8px;'>Mail</th>
        <th style='border: 1px solid #dddddd; text-align: left; padding: 8px;'>Date d'expiration</th>
        <th style='border: 1px solid #dddddd; text-align: left; padding: 8px;'>Action</th>
      </tr>
  `;
  for (const client of clients) {
    body += `
      <tr>
        <td style='border: 1px solid #dddddd; text-align: left; padding: 8px;'>${client.card}</td>
        <td style='border: 1px solid #dddddd; text-align: left; padding: 8px;'>${client.societeName}</td>
        <td style='border: 1px solid #dddddd; text-align: left; padding: 8px;'>${client.name}</td>
        <td style='border: 1px solid #dddddd; text-align: left; padding: 8px;'>${client.gsm}</td>
        <td style='border: 1px solid #dddddd; text-align: left; padding: 8px;'>${client.email}</td>
        <td style='border: 1px solid #dddddd; text-align: left; padding: 8px;'>${client.expiration}</td>
        <td style='border: 1px solid #dddddd; text-align: left; padding: 8px;'>${client.action}</td>
      </tr>
    `;
  }
  body += `</table>`;
  return body;
}

// Planification de la tâche avec node-cron
cron.schedule('0 6 * * *', () => {
  importBpClients();
}, {
  scheduled: true,
  timezone: "Europe/Paris"
});

// Exécution immédiate lors du démarrage
importBpClients();
