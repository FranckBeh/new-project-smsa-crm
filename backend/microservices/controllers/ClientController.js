
const Societe = require('../models/societe'); 
const TypeClient = require('../models/typeClient');
const  Client  = require('../models/client');
const { Op } = require('sequelize');
const { Sequelize } = require('sequelize');
const { Contact } = require('../models/contact');
require('../models/association_clients');

const moment = require('moment');


class ClientController {
    async getClientCount(req, res) {
        try {
          // Compter le nombre total de clients
          const count = await Client.count();
      
          // Renvoyer le nombre total de clients en réponse à la requête HTTP
          res.json(count);
        } catch (error) {
          // Si une erreur se produit, renvoyer une réponse avec le code d'état HTTP 500 et l'erreur
          res.status(500).send(error);
        }
      }
      
      

      async getLastId(req, res, next) {
        try {
          const lastClient = await Client.findOne({
            attributes: [
              [Sequelize.fn('MAX', Sequelize.col('IdClient')), 'lastId']
            ]
          });
          res.json(lastClient);
        } catch (error) {
          next(error);
        }
    }
    

  async getNextLogin() {
    try {
      const minLogin = await Client.min('login');
      return minLogin - 1;
    } catch (error) {
      throw error;
    }
  }

  async getClientList(req, res) {
    try {
      const page = parseInt(req.query.page) || 0;
      const pageSize = parseInt(req.query.pageSize) || 10;
      const { count, rows } = await Client.findAndCountAll({
        where: {
          expiration: {
            [Op.gt]: new Date()
          }
        },
        include: [
            { model: TypeClient, as: 'typeclient', attributes: ['NomType'] },
            { model: Societe, as: 'societe', attributes: ['nom'] }

        ],
        order: [['nom', 'ASC']],
        limit: pageSize,
        offset: page * pageSize,
      });
  
      res.json({ totalClients: count, clients: rows });
    } catch (error) {
      res.status(500).send(error);
    }
  }

  async searchClients(req, res) {
    try {
        const page = parseInt(req.query.page) || 0;
        const pageSize = parseInt(req.query.pageSize) || 10;
        const { searchQuery } = req.query;

        const { count, rows } = await Client.findAndCountAll({
            where: {
                [Op.and]: [
                    {
                        [Op.or]: [
                            { nom: { [Op.like]: `%${searchQuery}%` } },
                            { prenom: { [Op.like]: `%${searchQuery}%` } },
                            { fonction: { [Op.like]: `%${searchQuery}%` } },
                            { '$typeclient.NomType$': { [Op.like]: `%${searchQuery}%` } }, // Recherche par nom de type client
                            { '$societe.nom$': { [Op.like]: `%${searchQuery}%` } }, // Recherche par nom de société
                            { login: { [Op.like]: `%${searchQuery}%` } },
                            { adressePro: { [Op.like]: `%${searchQuery}%` } },
                            { fixePerso: { [Op.like]: `%${searchQuery}%` } },
                            { fixePro: { [Op.like]: `%${searchQuery}%` } },
                            { gsmPerso: { [Op.like]: `%${searchQuery}%` } },
                            { gsmPro: { [Op.like]: `%${searchQuery}%` } },
                            { mailPerso: { [Op.like]: `%${searchQuery}%` } },
                            { mailPro: { [Op.like]: `%${searchQuery}%` } },
                            // Ajoutez d'autres champs à rechercher ici selon vos besoins
                        ]
                    },
                    {
                        expiration: {
                            [Op.gt]: new Date()
                        }
                    }
                ]
            },
            include: [
                { model: TypeClient, as: 'typeclient', attributes: ['NomType'] },
                { model: Societe, as: 'societe', attributes: ['nom'] }
            ],
            order: [['nom', 'ASC']],
            limit: pageSize,
            offset: page * pageSize,
        });

        res.json({ totalClients: count, clients: rows });
    } catch (error) {
        res.status(500).send(error);
    }
}

  
  
  
  async getClientById(req, res) {
    try {
        const id = req.params.id;
        const client = await Client.findOne({
            attributes: [
                'IdClient',
                'nom',
                'anniversaire',
                'civilite',
                'fonction',
                'satisfaction',
                'context',
                'situation',
                'prenom',
                'expiration',
                'inactif',
                'isFixed',
                'keyWords',
                'allKeyWords',
                'password',
                'plain_pwd',
                'progress',
                'login',
                'latitude',
                'longitude',
                'newsletter_date',
                'image_id',
                'adressePro', 
                'fixePerso', 
                'fixePro',
                'gsmPerso',
                'gsmPro',
                'mailPerso',
                'mailPro',
                'createdAt',
                'updatedAt',
            ],
            where: { IdClient: id }
        });
        res.json(client);
    } catch (error) {
        console.error(`Une erreur s'est produite lors de la récupération du client : ${error}`);
    }
}

async getClientByAttributes(attributes) {
    const client = await Client.findOne({
        where: {
            [Op.or]: [
                { nom: attributes.nom },
                { anniversaire: attributes.anniversaire },
                { fonction: attributes.fonction },
                { prenom: attributes.prenom },
                { expiration: attributes.expiration },
                { login: attributes.login },
                { adressePro: attributes.adressePro },
                { fixePerso: attributes.fixePerso },
                { fixePro: attributes.fixePro },
                { gsmPerso: attributes.gsmPerso },
                { gsmPro: attributes.gsmPro },
                { mailPerso: attributes.mailPerso },
                { mailPro: attributes.mailPro },
                // Ajoutez d'autres attributs à rechercher ici selon vos besoins
            ]
        }
    });

    return client;
}


async getClientByAttributesHandler(req, res) {
    try {
        const { nom, anniversaire, fonction, prenom, expiration, login, adressePro, fixePerso, fixePro, gsmPerso, gsmPro, mailPerso, mailPro } = req.query;

        // Vérifiez si au moins un attribut est fourni dans la requête
        if (!nom && !anniversaire && !fonction && !prenom && !expiration && !login && !adressePro && !fixePerso && !fixePro && !gsmPerso && !gsmPro && !mailPerso && !mailPro) {
            return res.status(400).json({ message: 'Au moins un attribut de recherche doit être fourni.' });
        }

        // Construisez un objet contenant uniquement les attributs fournis et non vides
        const attributes = {};
        if (nom) attributes.nom = nom;
        if (anniversaire) attributes.anniversaire = anniversaire;
        if (fonction) attributes.fonction = fonction;
        if (prenom) attributes.prenom = prenom;
        if (expiration) attributes.expiration = expiration;
        if (login) attributes.login = login;
        if (adressePro) attributes.adressePro = adressePro;
        if (fixePerso) attributes.fixePerso = fixePerso;
        if (fixePro) attributes.fixePro = fixePro;
        if (gsmPerso) attributes.gsmPerso = gsmPerso;
        if (gsmPro) attributes.gsmPro = gsmPro;
        if (mailPerso) attributes.mailPerso = mailPerso;
        if (mailPro) attributes.mailPro = mailPro;

        const client = await this.getClientByAttributes(attributes);
        res.json(client);
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Une erreur est survenue lors de la recherche du client.' });
    }
}

async getClientListWithAssociations(req, res) {
    try {
        const clients = await Client.findAll({
            include: [
                { model: TypeClient, as: 'typeclient', attributes: ['NomType'] },
                { model: Societe, as: 'societe', attributes: ['nom'] }

            ],
            order: [['nom', 'ASC']]
        });

        res.json(clients);
    } catch (error) {
        console.error('Error in getClientListWithAssociations:', error);
        res.status(500).send(error);
    }
}




  async clientListExp() {
    try {
      const dt = new Date();
      return await Client.findAll({
        where: {
          expiration: {
            [Op.lte]: dt
          }
        },
        order: [['nom', 'ASC']],
        limit: 50
      });
    } catch (error) {
      throw error;
    }
  }

   async getListBy(where, byPrest = false, byNotes = false, byDomaine = false, byDomGen = false, limit = '', orderby = '', params = [], datatableSort = '') {
    const dt = moment().format('YYYY-MM-DD 00:00:00');
    return this.getListPrestBy({ expiration: { [Op.gt]: dt }, inactif: 0, ...where }, byPrest, byNotes, byDomaine, byDomGen, limit, orderby, params, datatableSort);
}

 async getListExpBy(where, byPrest = false, byNotes = false, byDomaine = false, byDomGen = false, limit = '', orderby = '', params = [], datatableSort = '') {
    const dt = moment().format('YYYY-MM-DD 00:00:00');
    return this.getListPrestBy({ expiration: { [Op.lte]: dt }, inactif: 0, ...where }, byPrest, byNotes, byDomaine, byDomGen, limit, orderby, params, datatableSort);
}

 async getListInactifBy(where, byPrest = false, byNotes = false, byDomaine = false, byDomGen = false, limit = '', orderby = '', params = [], datatableSort = '') {
    return this.getListPrestBy({ inactif: 1, ...where }, byPrest, byNotes, byDomaine, byDomGen, limit, orderby, params, datatableSort);
}

 async getListPrestBy(exp, where, byPrest = false, byNotes = false, byDomaine = false, byDomGen = false, limit = '', orderby = 'order by c1.type desc, c2.type desc', inactif = '1', params = [], datatableSort = '') {
    let query = '';
    if (byPrest == true) {
        query = await Client.findAll({
            include: [
                { model: Societe, as: 'societe', attributes: ['nom'] },
                { model: TypeClient, as: 'type', attributes: ['numtype'] },
                { model: Note, as: 'note' },
                { model: Prestataire, as: 'prestataire' },
                { model: Contact, as: 'contact', where: { type: { [Op.in]: ['FIXE PERSO', 'FIXE PRO', 'GSM PERSO', 'GSM PRO'] } } }
            ],
            where: { ...exp, inactif: 0, ...where },
            order: [orderby]
        });
    } else if (byNotes == true) {
        query = await Client.findAll({
            include: [
                { model: Societe, as: 'societe', attributes: ['nom'] },
                { model: TypeClient, as: 'type', attributes: ['numtype'] },
                { model: Note, as: 'note' },
                { model: Contact, as: 'contact', where: { type: { [Op.in]: ['FIXE PERSO', 'FIXE PRO', 'GSM PERSO', 'GSM PRO'] } } }
            ],
            where: { ...exp, inactif: 0 },
            group: ['client.idclient'],
            having: Sequelize.where(Sequelize.fn('count', Sequelize.col('note.idnote')), '=', where),
            order: [orderby]
        });
    } else if (byDomaine == true) {
        query = await Client.findAll({
            include: [
                { model: Societe, as: 'societe', attributes: ['nom'] },
                { model: TypeClient, as: 'type', attributes: ['numtype'] },
                { model: Note, as: 'note' },
                { model: Contact, as: 'contact', where: { type: { [Op.in]: ['FIXE PERSO', 'FIXE PRO', 'GSM PERSO', 'GSM PRO'] } } }
            ],
            where: { ...exp, inactif: 0, ...where },
            group: ['client.idclient'],
            order: [[Sequelize.fn('count', Sequelize.col('note.idnote')), 'DESC']]
        });
    }
    return query;
}

async getContacts(req, res) {
    try {
      // Récupérer l'ID du client à partir des paramètres de la requête
      const id = req.params.id;
  
      // Trouver tous les contacts pour ce client
      const contacts = await Contact.findAll({ where: { IdClient: id }, order: [['type', 'DESC']] });
  
      // Renvoyer les contacts en réponse à la requête HTTP
      res.json(contacts);
    } catch (error) {
      // Si une erreur se produit, renvoyer une réponse avec le code d'état HTTP 500 et l'erreur
      res.status(500).send(error);
    }
  }
  

 async getConjoint(id) {
    return await Conjoint.findAll({ where: { IdClient: id } });
}

 async getEnfants(id) {
    return await Enfant.findAll({ where: { IdClient: id } });
}

 async getAutres(id) {
    return await Autres.findAll({ where: { IdClient: id } });
}

 async create(data) {
    const client = await Client.findOne({ where: { login: data.login } });
    if (!client) {
        return await Client.create(data);
    }
    return 0;
}

 async isLoginAvailable(idClient, login) {
    const count = await Client.count({ where: { login: login, IdClient: { [Op.ne]: idClient } } });
    return count === 0;
}

 async createOrUpdate(data) {
    let client = await Client.findOne({ where: { login: data.login } });
    if (!client) {
        client = await Client.create(data);
    } else {
        delete data.situation;
        await client.update(data);
    }
    return client.IdClient;
}

 async update(data) {
    const client = await Client.findByPk(data.IdClient);
    if (client) {
        return await client.update(data);
    }
    return null;
}

 async addContact(data) {
    return await Contact.create(data);
}

 async deleteContacts(idClient) {
    return await Contact.destroy({ where: { IdClient: idClient } });
}

 async deleteConjoint(idClient) {
    return await Conjoint.destroy({ where: { idclient: idClient } });
}

 async deleteEnfants(idClient) {
    return await Enfant.destroy({ where: { idclient: idClient } });
}

 async deleteAutres(idClient) {
    return await Autres.destroy({ where: { idclient: idClient } });
}

 async delete(id) {
    await Note.update({ idclient: 0 }, { where: { idclient: id } });
    await Reclamation.update({ idclient: 0 }, { where: { idclient: id } });
    return await Client.destroy({ where: { IdClient: id } });
}

 async getAnnivClients() {
    const today = moment().format('DD-MM');
    return await Client.findAll({
        include: [
            { model: Contact, as: 'contact', where: { type: { [Op.in]: ['MAIL PERSO', 'MAIL PRO'] } } },
            { model: Enfant, as: 'enfant' },
            { model: Conjoint, as: 'conjoint' }
        ],
        where: Sequelize.literal(`DATE_FORMAT(client.anniversaire,'%d-%m') = ${today} OR DATE_FORMAT(conjoint.anniversaire,'%d-%m') = ${today} OR DATE_FORMAT(enfant.anniversaire,'%d-%m') = ${today}`),
        group: ['enfant.IdEnfant', 'client.idClient']
    });
}

 async setFixed(idClient, isFixed) {
    return await Client.update({ isFixed: (isFixed == 'true') }, { where: { IdClient: idClient } });
}

 async addToListTen(idClient, idTen) {
    return await ListClientTend.create({ defaultTend: true, IdClient: idClient, IdTendType: idTen });
}

 async addOrUpdateListTen(idClient, idTen) {
    const listClientTend = await ListClientTend.findOne({ where: { IdClient: idClient, IdTendType: idTen } });
    if (listClientTend) {
        return await listClientTend.update({ defaultTend: true });
    } else {
        return await ListClientTend.create({ IdClient: idClient, IdTendType: idTen, defaultTend: true });
    }
}

 async getTendances(id) {
    return await TendType.findAll({
        include: [
            { model: ListClientTend, as: 'listclienttend', where: { IdClient: id, defaultTend: true } },
            { model: Client, as: 'client' }
        ]
    });
}

 async deleteAllTendances(idClient) {
    return await ListClientTend.destroy({ where: { IdClient: idClient } });
}

 async cleanDummyTendances(idClient) {
    return await ListClientTend.destroy({ where: { IdClient: idClient, defaultTend: false, oldCounter: 0, ratio: 0 } });
}

 async initAllTendances(idClient) {
    return await ListClientTend.update({ defaultTend: 0 }, { where: { IdClient: idClient } });
}

 async generateClientAllKeyWords(idClient) {
    return await Note.findAll({
        attributes: [
            'client.IdClient',
            [Sequelize.fn('concat', Sequelize.col('client.keyWords'), ' ', Sequelize.fn('IFNULL', Sequelize.fn('group_concat', Sequelize.fn('concat', Sequelize.col('note.keyWords'), ' ', Sequelize.col('product.keyWords')), ' '), '')), 'allKeyWords']
        ],
        include: [
            { model: Client, as: 'client' },
            { model: Product, as: 'product' }
        ],
        where: { 'client.IdClient': idClient },
        group: ['client.IdClient']
    });
}

 async generateClientsAllKeyWordsByProd(idProd) {
    return await Note.findAll({
        attributes: [
            'IdClient',
            [Sequelize.fn('concat', Sequelize.col('client.keyWords'), ' ', Sequelize.fn('group_concat', Sequelize.fn('concat', Sequelize.col('note.keyWords'), ' ', Sequelize.col('product.keyWords')), ' ')), 'allKeyWords']
        ],
        include: [
            { model: Client, as: 'client' },
            { model: Product, as: 'product' }
        ],
        where: { 'client.IdClient': { [Op.in]: Sequelize.literal('(select distinct IdClient from note where IdProd=' + idProd + ')') } },
        group: ['IdClient']
    });
}

 async updateClientAllKeyWords(idClient, allKeyWords) {
    return await Client.update({ allKeyWords: allKeyWords }, { where: { IdClient: idClient } });
}

 async initPwd(idClient, hashedPwd) {
    return await Client.update({ password: hashedPwd }, { where: { IdClient: idClient } });
}

async getClientByWhere(mailPro, mailPerso) {
    return await Client.findOne({
        attributes: [
            'IdClient',
            'nom',
            'type',
            'anniversaire',
            'societe',
            'civilite',
            'fonction',
            'satisfaction',
            'context',
            'situation',
            'prenom',
            'expiration',
            'inactif',
            'isFixed',
            'keyWords',
            'allKeyWords',
            'password',
            'plain_pwd',
            'adressePro',
            'fixePerso',
            'fixePro',
            'gsmPerso',
            'gsmPro',
            'mailPerso',
            'mailPro',
            'createdAt',
            'updatedAt',
            [Sequelize.col('typeclient.NumType'), 'idType'],
            [Sequelize.col('typeclient.nomtype'), 'type'],
            [Sequelize.col('societe.nom'), 'societe'],
            [Sequelize.col('societe.idsociete'), 'idSociete']
        ],
        include: [
            { model: TypeClient, as: 'typeclient' },
            { model: Societe, as: 'societe' }
        ],
        where: { [Op.or]: [{ mailPro: mailPro }, { mailPerso: mailPerso }] }
    });
}




 async getNextBpLogin() {
    const result = await Client.findOne({
        attributes: [[Sequelize.literal("CONCAT('EXE',CAST(REPLACE(login,'EXE','') AS UNSIGNED)+1)"), 'nextBpLogin']],
        where: Sequelize.literal("login REGEXP 'EXE\\d*'"),
        order: [[Sequelize.literal("CAST(REPLACE(login,'EXE','') AS UNSIGNED)"), 'DESC']],
        limit: 1
    });
    return result ? result.nextBpLogin : null;
}


}

module.exports = new ClientController();
