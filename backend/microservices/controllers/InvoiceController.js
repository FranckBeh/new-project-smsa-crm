const Listinvart = require("../models/listinvart");
const Societe = require("../models/societe");
const Utilisateur = require("../models/utilisateur");
const ParametreCompanie = require("../models/companie");
const Invoice = require("../models/invoice");
const { Op } = require("sequelize");
const { QueryTypes } = require("sequelize");
const { Sequelize } = require("sequelize");
const sequelize = require("../../config/database.js");
const { validationResult } = require('express-validator');
require("../models/association");

if (Invoice) {
  console.log("Le modèle Invoice a été correctement défini.");
} else {
  console.log("Erreur : Le modèle Invoice n'a pas été défini.");
}

class InvoiceController {
  async getInvoiceCount(req, res, next) {
    try {
      const invoiceCount = await Invoice.count();
      // console.log(`Total invoices: ${invoiceCount}`);
      res.json(invoiceCount);
      //return invoiceCount;
    } catch (error) {
      const errorMessage = `Error retrieving invoice count: ${error.message}`;
      switch (error.name) {
        case "SequelizeConnectionError":
          console.error(errorMessage, "Database connection error");
          break;
        case "SequelizeError":
          console.error(errorMessage, "Sequelize-specific error");
          res.status(500).send(error);
          break;
        default:
          console.error(errorMessage, "Unknown error");
          res.status(500).send(error);
      }
      throw error;
    }
  }

  async getLastId(req, res, next) {
    try {
      const lastInvoice = await Invoice.findOne({
        attributes: [[Sequelize.fn("MAX", Sequelize.col("idInv")), "lastId"]],
      });
      res.json(lastInvoice);
    } catch (error) {
      next(error);
    }
  }

  async getInvoiceList(req, res) {
    try {
      const invoices = await Invoice.findAll({
        limit: 5,
        order: [["idSociete", "ASC"]],
      });

      res.json(invoices);
    } catch (error) {
      console.error("Erreur lors de la récupération des factures:", error);
      res.status(500).send(error);
    }
  }

  // async getInvoiceById(id) {
  //   try {
  //     return await Invoice.findByPk(id);
  //    } catch (error) {
  //        throw error;
  //    }
  // }

  async getInvoiceById(req, res) {
    try {
      const id = req.params.id; // Assurez-vous que l'ID est passé en tant que paramètre dans la requête

      const invoice = await Invoice.findOne({
        where: { idInv: id },
        include: [
          {
            model: Societe,
            as: "societe",
            attributes: ["nom"],
          },
          {
            model: Listinvart,
            as: "listinvart",
            attributes: ["quantite", "autreQuantite", "postPrixUnit"],
          },
          {
            model: Utilisateur,
            as: "utilisateur",
            attributes: ["login"],
          },
        ],
        attributes: { exclude: ["IdSociete", "idInv", "idUser"] },
      });

      if (!invoice) {
        return res.status(404).json({ message: "Facture non trouvée" });
      }

      return res.json(invoice);
    } catch (error) {
      console.error(error);
      return res
        .status(500)
        .json({
          message:
            "Une erreur est survenue lors de la récupération de la facture",
        });
    }
  }
  async searchInvoicesOld(req, res) {
    try {
      const { company, type, etat, reference, dateCreation } = req.query;
      console.log("Valeurs envoyées depuis le frontend : ", req.query);
      // Construisez votre requête en fonction des critères de recherche
      const whereClause = {};
      if (company) {
        whereClause.major = company; // Assurez-vous que 'major' est la clé étrangère de l'entreprise dans la table 'Invoice'
      }
      if (type) {
        whereClause.type = type;
      }
      if (etat) {
        whereClause.etat = etat;
      }
      if (reference) {
        whereClause.reference = reference;
      }
      if (dateCreation) {
        whereClause.date = dateCreation;
      }
  
      // Obtenir les factures correspondantes
      const invoices = await Invoice.findAll({
        include: [
          {
            model: Societe,
            as: "societe",
            attributes: ["nom"],
          },
        ],
        attributes: [
          "idInv",
          "reference",
          [
            Sequelize.literal(
              "(case when (Invoice.idSociete=0) then 1 else Invoice.idSociete end)"
            ),
            "nc",
          ],
          "date",
          "tva",
          "paymentDate",
          "paymentMode",
        ],
        where: whereClause, // Utilisation des clauses où conditionnelles
        order: [["date", "DESC"]],
      });
  
      // Pour chaque facture, obtenir les articles et calculer le nombre d'articles et le total TTC
      for (const invoice of invoices) {
        const articlesData = await Listinvart.findAll({
          where: { idInv: invoice.idInv },
          attributes: [
            [Sequelize.fn("sum", Sequelize.col("quantite")), "totalQuantite"],
            [
              Sequelize.fn("sum", Sequelize.literal("quantite * postPrixUnit")),
              "totalTTC",
            ],
          ],
          raw: true,
          group: ["idInv"],
        });
  
        // Ajouter le nombre d'articles et le total TTC à l'objet de la facture
        invoice.dataValues.totalQuantite = articlesData[0]
          ? articlesData[0].totalQuantite
          : 0;
        invoice.dataValues.totalTTC =
          (articlesData[0] ? articlesData[0].totalTTC : 0) + invoice.tva;
        invoice.dataValues.totalTVA = invoice.tva;
      }
  
      // Envoyer la réponse
      res.json(invoices);
    } catch (error) {
      console.error("Erreur lors de la recherche des factures :", error);
      res.status(500).send(error);
    }
  }

  // searchInvoices function in your backend
  async searchInvoices(req, res) {
    try {
      const { company, type, etat, reference, startDate, endDate, fixedDate, societeName } = req.query;
  
      // Définir les clauses where et include
      const whereClause = [];
      const includeClause = [];
  
      if (company) {
        whereClause.push({ major: company }); // 'major' est la clé étrangère de l'entreprise dans la table 'Invoice'
      }
      if (type) {
        whereClause.push({ type: type });
      }
      if (etat) {
        whereClause.push({ etat: etat });
      }
      if (reference) {
        whereClause.push({ reference: reference });
      }
      if (fixedDate) {
        whereClause.push({ date: fixedDate });
      } else if (startDate && endDate) {
        whereClause.push({
          dateCreation: {
            [Sequelize.Op.between]: [startDate, endDate]
          }
        });
      } else if (startDate) {
        whereClause.push({
          date: {
            [Sequelize.Op.gte]: startDate
          }
        });
      } else if (endDate) {
        whereClause.push({
          date: {
            [Sequelize.Op.lte]: endDate
          }
        });
      }
  
      // Condition pour la recherche par nom de société
      if (societeName) {
        includeClause.push({
          model: Societe,
          as: 'societe',
          attributes: ['nom'],
          where: {
            nom: {
              [Sequelize.Op.like]: `%${societeName}%`
            }
          },
          required: false, // Inclure uniquement les factures avec une correspondance dans 'Societe'
        });
      
        whereClause.push({
          [Sequelize.Op.or]: [
            { autreSociete: { [Sequelize.Op.like]: `%${societeName}%` } },
            { '$societe.nom$': { [Sequelize.Op.like]: `%${societeName}%` } }
          ]
        });
      } else {
        includeClause.push({
          model: Societe,
          as: 'societe',
          attributes: ['nom'],
          required: false, // Inclure les factures même sans correspondance dans 'Societe'
        });
      }
      
      
  
      // Obtenir les factures correspondantes
      const invoices = await Invoice.findAll({
        include: includeClause,
        attributes: [
          'idInv',
          'reference',
          [
            Sequelize.literal(
              '(case when (Invoice.idSociete=0) then 1 else Invoice.idSociete end)'
            ),
            'nc',
          ],
          'date',
          'tva',
          'paymentDate',
          'paymentMode',
          'autreSociete', // Inclure 'autreSociete' dans les attributs sélectionnés
        ],
        where: {
          [Sequelize.Op.and]: whereClause // Utilisation des clauses where combinées
        },
        order: [['date', 'DESC']],
      });
  
      // Pour chaque facture, obtenir les articles et calculer le nombre d'articles et le total TTC
      for (const invoice of invoices) {
        const articlesData = await Listinvart.findAll({
          where: { idInv: invoice.idInv },
          attributes: [
            [Sequelize.fn("sum", Sequelize.col("quantite")), "totalQuantite"],
            [
              Sequelize.fn("sum", Sequelize.literal("quantite * postPrixUnit")),
              "totalTTC",
            ],
          ],
          raw: true,
          group: ["idInv"],
        });
  
        // Ajouter le nombre d'articles et le total TTC à l'objet de la facture
        invoice.dataValues.totalQuantite = articlesData[0]
          ? articlesData[0].totalQuantite
          : 0;
        invoice.dataValues.totalTTC =
          (articlesData[0] ? articlesData[0].totalTTC : 0) + invoice.tva;
        invoice.dataValues.totalTVA = invoice.tva;
      }
  
      // Envoyer la réponse
      res.json(invoices);
    } catch (error) {
      console.error('Erreur lors de la recherche des factures :', error);
      res.status(500).send(error);
    }
  }
  

 async validateInvoiceById(req, res) {
  try {
    console.log('Requête reçue avec les données suivantes:', req.body); // Affiche les données du corps de la requête

    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { idInv } = req.params;
    console.log('Validation de la facture avec idInv:', idInv); // Affiche l'ID de la facture

    // Mettre à jour la facture spécifique avec isValided à 1 si etat est égal à 1
    const result = await Invoice.update(
      { isValidated: 1 },
      { where: { idInv: idInv, etat: 1 } }
    );

    console.log('Résultat de la mise à jour:', result); // Affiche le résultat de la mise à jour

    if (result[0] > 0) {
      res.json({ message: 'La facture a été validée avec succès.' });
    } else {
      res.status(404).json({ message: 'Facture non trouvée ou déjà validée.' });
    }
  } catch (error) {
    console.error('Erreur lors de la validation de la facture :', error);
    res.status(500).json({ message: 'Erreur serveur.' });
  }
}
  
  
  
  

  async getInvoiceData1(req, res) {
    try {
      const invoices = await Invoice.findAll({
        include: [
          {
            model: Societe,
            as: "societe",
            attributes: ["nom"],
          },
          {
            model: Listinvart,
            as: "listinvart",
            attributes: [
              "designation",
              [Sequelize.literal("sum(quantite*autreQuantite)"), "nbrArticles"],
              "quantite",
              "postPrixUnit",
              "autreQuantite",
            ],
          },
        ],
        attributes: [
          "idInv",
          "reference",
          [
            Sequelize.literal(
              "(case when (Invoice.idSociete=0) then 1 else Invoice.idSociete end)"
            ),
            "nc",
          ],
          "date",
          "tva",
          "paymentDate",
          "paymentMode",
          [
            Sequelize.literal(
              "sum(listinvart.quantite*listinvart.autreQuantite*listinvart.postPrixUnit)"
            ),
            "totalTTC",
          ],
        ],
        group: ["idInv", "listinvart.idArticle"],
        order: [["date", "DESC"]],
      });

      res.json(invoices);
    } catch (error) {
      console.error("Error getting invoice data:", error);
      res.status(500).send(error);
    }
  }

  async getInvoiceData(req, res) {
    try {
      // Obtenir toutes les factures
      const invoices = await Invoice.findAll({
        include: [
          {
            model: Societe,
            as: "societe",
            attributes: ["nom"],
          },
        ],
        attributes: [
          "idInv",
          "reference",
          [
            Sequelize.literal(
              "(case when (Invoice.idSociete=0) then 1 else Invoice.idSociete end)"
            ),
            "nc",
          ],
          "date",
          "tva",
          "paymentDate",
          "paymentMode",
        ],
        order: [["date", "DESC"]],
      });

      // Pour chaque facture, obtenir les articles et calculer le nombre d'articles et le total TTC
      // Pour chaque facture, calculer le nombre d'articles et le total TTC
      for (const invoice of invoices) {
        const articlesData = await Listinvart.findAll({
          where: { idInv: invoice.idInv },
          attributes: [
            [Sequelize.fn("sum", Sequelize.col("quantite")), "totalQuantite"],
            [
              Sequelize.fn("sum", Sequelize.literal("quantite * postPrixUnit")),
              "totalTTC",
            ],
          ],
          raw: true,
          group: ["idInv"],
        });

        // Ajouter le nombre d'articles et le total TTC à l'objet de la facture
        invoice.dataValues.totalQuantite = articlesData[0]
          ? articlesData[0].totalQuantite
          : 0;
        invoice.dataValues.totalTTC =
          (articlesData[0] ? articlesData[0].totalTTC : 0) + invoice.tva;
        invoice.dataValues.totalTVA = invoice.tva; // Utiliser la valeur de la TVA directement depuis l'attribut tva de la facture
        //  invoice.dataValues.totalTTC += invoice.dataValues.totalTVA;
      }

      // Envoyer la réponse
      res.json(invoices);
    } catch (error) {
      console.error("Error getting invoice data:", error);
      res.status(500).send(error);
    }
  }

  async getInvoiceDataById1(req, res) {
    try {
      const idInv = req.params.id; // L'ID de la facture est récupéré de l'URL

      const invoice = await Invoice.findOne({
        where: { idInv },
        attributes: [
          "idInv",
          "reference",
          [
            Sequelize.literal(
              "(case when (Invoice.idSociete=0) then 1 else Invoice.idSociete end)"
            ),
            "nc",
          ],
          "date",
          "tva",
          "paymentDate",
          "paymentMode",
        ],
        include: [
          {
            model: Societe,
            as: "societe",
            attributes: ["nom", "ice", "adresse"],
          },
          {
            model: Listinvart,
            as: "listinvart",
            attributes: [
              "designation",
              "quantite",
              "postPrixUnit",
              "autreQuantite",
              // Ajoutez d'autres attributs des articles si nécessaire
            ],
          },
          {
            model: ParametreCompanie,
            as: "parametreCompanie",
            attributes: [
              "nomCompanie",
              "adresseCompanie",
              "tel1Companie",
              "email1Compagnie",
              "ice",
              "tel2Compnie",
              "email2Compagnie",
              "sitewebCompagnie",
              "registreCommerce",
              "patente",
              "identifiantFiscal",
            ],
          },
          {
            model: Utilisateur,
            as: "utilisateur",
            attributes: ["login"], // Assurez-vous que 'login' est l'attribut correct pour le nom d'utilisateur
          },
        ],
        order: [["date", "DESC"]],
      });

      if (!invoice) {
        return res.status(404).send("Facture non trouvée.");
      }

      // Obtenir les articles et calculer le nombre d'articles et le total TTC
      const articles = await Listinvart.findAll({
        where: { idInv: invoice.idInv },
        attributes: [
          [Sequelize.literal("sum(quantite*autreQuantite)"), "nbrArticles"],
          [
            Sequelize.literal(
              "sum(quantite*autreQuantite*postPrixUnit)+Invoice.tva "
            ),
            "totalTTC",
          ],
        ],
        group: ["Listinvart.idInv"], // Groupez par ID de facture pour obtenir des totaux par facture
      });

      // Ajoutez les articles et les totaux à l'objet de la facture
      invoice.dataValues.articles = articles;

      res.json(invoice);
    } catch (error) {
      console.error("Erreur lors de la récupération de la facture:", error);
      res.status(500).send(error);
    }
  }

  async getInvoiceDataById(req, res) {
    try {
      const idInv = req.params.id; // L'ID de la facture est récupéré de l'URL

      const invoice = await Invoice.findOne({
        where: { idInv },
        attributes: [
          "idInv",
          "reference",
          "type",
          "etat",
          "isProFormat",
          "isValidated",
          [
            Sequelize.literal(
              "(case when (Invoice.idSociete=0) then 1 else Invoice.idSociete end)"
            ),
            "nc",
          ],
          "date",
          "tva",
          "paymentDate",
          "paymentMode",

          "validationDate",
          "paymentComment",
          "autreSociete",
          "adresseSociete",
          "dateCreation",
          // Ajoutez d'autres attributs de la facture si nécessaire
        ],
        include: [
          {
            model: Societe,
            as: "societe",
            attributes: ["nom", "ice", "adresse"],
          },
          {
            model: Listinvart,
            as: "listinvart",
            attributes: [
              "idArticle",
              "designation",
              "quantite",
              "postPrixUnit",
              "autreQuantite",
              // Ajoutez d'autres attributs des articles si nécessaire
            ],
          },
          {
            model: ParametreCompanie,
            as: "parametreCompanie",
            attributes: [
              "nomCompanie",
              "adresseCompanie",
              "tel1Companie",
              "email1Compagnie",
              "ice",
              "tel2Compnie",
              "email2Compagnie",
              "sitewebCompagnie",
              "registreCommerce",
              "patente",
              "identifiantFiscal",
            ],
          },
          {
            model: Utilisateur,
            as: "utilisateur",
            attributes: ["login"],
          },
          // Incluez d'autres associations si nécessaire
        ],
        order: [["date", "DESC"]],
      });

      if (!invoice) {
        return res.status(404).send("Facture non trouvée.");
      }

      // Calculer le nombre total d'articles et le total TTC pour la facture
      let nbrArticles = 0;
      let totalTTC = 0;

      for (const article of invoice.listinvart) {
        nbrArticles += article.quantite * article.autreQuantite;
        totalTTC +=
          article.quantite * article.autreQuantite * article.postPrixUnit;
      }

      // Arrondir le nombre total d'articles et le total TTC à deux décimales
      invoice.dataValues.nbrArticles = Number(nbrArticles.toFixed(2));
      invoice.dataValues.totalTTC = Number((totalTTC + invoice.tva).toFixed(2));

      res.json(invoice);
    } catch (error) {
      console.error("Erreur lors de la récupération de la facture:", error);
      res.status(500).send(error);
    }
  }

  async createInvoice(req, res) {
    try {
      const data = req.body;

      const newInvoice = await Invoice.create(data);

      if (data.articles && Array.isArray(data.articles)) {
        await Promise.all(
          data.articles.map(async (article) => {
            const newArticle = await Listinvart.create({
              ...article,
              idInv: newInvoice.idInv, // Ajoutez l'ID de la facture ici
            });
            await newInvoice.addListinvart(newArticle);
          })
        );
      }

      res.json(newInvoice);
    } catch (error) {
      console.error("Error creating invoice:", error);
      res.status(500).send(error);
    }
  }
  async updateInvoice(req, res) {
    const { idInv } = req.params.id; // Récupérez idInv à partir des paramètres de la requête
    const data = req.body;
  
    const t = await sequelize.transaction(); // Démarrez une transaction
  
    try {
      // Récupérez la facture à mettre à jour
      const invoice = await Invoice.findByPk(req.params.id, { transaction: t });
  
      if (!invoice) {
        await t.rollback(); // Annulez la transaction en cas d'échec
        return res.status(404).json({ error: "Invoice not found" });
      }
  
      // Mettez à jour les détails de la facture
      await invoice.update(data, { transaction: t });
  
      // Obtenez tous les articles existants pour cette facture
      const existingArticles = await Listinvart.findAll({
        where: { idInv: req.params.id },
        transaction: t
      });
  
      // Créez un ensemble des ID des articles existants pour une recherche rapide
      const existingArticleIds = new Set(existingArticles.map(article => article.idArticle));
  
      // Traitez les articles reçus pour la mise à jour ou l'ajout
      const articlesToUpdate = [];
      const articlesToAdd = [];
      data.articles.forEach(article => {
        if (article.idArticle && existingArticleIds.has(article.idArticle)) {
          articlesToUpdate.push(article);
        } else {
          articlesToAdd.push({ ...article, idInv: req.params.id });
        }
      });
  
      // Mettez à jour les articles existants
      await Promise.all(articlesToUpdate.map(article => {
        return Listinvart.update(article, {
          where: { idArticle: article.idArticle, idInv: req.params.id },
          transaction: t
        });
      }));
  
      // Ajoutez de nouveaux articles
      await Promise.all(articlesToAdd.map(article => {
        return Listinvart.create(article, { transaction: t });
      }));
  
      // Supprimez les articles qui ne sont plus présents
      const receivedArticleIds = new Set(data.articles.map(article => article.idArticle));
      await Promise.all(existingArticles.map(dbArticle => {
        if (!receivedArticleIds.has(dbArticle.idArticle)) {
          return dbArticle.destroy({ transaction: t });
        }
      }));
  
      await t.commit(); // Validez la transaction si tout s'est bien passé
      res.json(invoice); // Renvoyez la facture mise à jour avec les articles associés
    } catch (error) {
      await t.rollback(); // Annulez la transaction en cas d'erreur
      res.status(500).json({ error: "Error updating invoice", details: error });
    }
  }
  
  

  async updateInvoiceOld(req, res) {
    const t = await sequelize.transaction(); // Commencez une nouvelle transaction
    try {
      const { idInv, updatedInvoiceData, newArticles } = req.body;
  
      // Récupération de la facture existante par son ID
      const invoiceToUpdate = await Invoice.findByPk(req.params.id, { transaction: t });
      if (!invoiceToUpdate) {
        await t.rollback(); // Annulez la transaction si la facture n'est pas trouvée
        return res.status(404).send('Facture non trouvée');
      }
  
      // Mise à jour des données de la facture
      await invoiceToUpdate.update(updatedInvoiceData, { transaction: t });
  
      // Mise à jour des articles existants
      if (updatedInvoiceData.listinvart && Array.isArray(updatedInvoiceData.listinvart)) {
        await Promise.all(
          updatedInvoiceData.listinvart.map(async (article) => {
            const articleToUpdate = await Listinvart.findByPk(article.idArticle, { transaction: t });
            if (articleToUpdate) {
              await articleToUpdate.update(article, { transaction: t });
            }
          })
        );
      }
  
      // Ajout de nouveaux articles
      if (newArticles && Array.isArray(newArticles)) {
        await Promise.all(
          newArticles.map(async (article) => {
            await Listinvart.create({
              ...article,
              idInv: req.params.id, // Associer le nouvel article à la facture
            }, { transaction: t });
          })
        );
      }
  
      await t.commit(); // Validez la transaction si tout s'est bien passé
      const updatedInvoiceWithArticles = await Invoice.findByPk(req.params.id, {
        include: [{ model: Listinvart, as: 'listinvart' }],
        transaction: t
      });
      res.json(updatedInvoiceWithArticles);
    } catch (error) {
      await t.rollback(); // Annulez la transaction en cas d'erreur
      console.error("Erreur lors de la mise à jour de la facture:", error);
      res.status(500).send(error);
    }
  }
  
  

  async deleteInvoice(req, res) {
    try {
      // Trouver la facture à supprimer
      const invoice = await Invoice.findByPk(req.params.id);

      if (!invoice) {
        return res.status(404).send({ message: "Facture non trouvée" });
      }

      // Supprimer les articles associés
      const articles = await Listinvart.findAll({
        where: { idInv: invoice.idInv },
      });
      for (let article of articles) {
        await article.destroy();
      }

      // Supprimer la facture
      await invoice.destroy();

      // Envoyer la réponse
      res.json({ message: "Facture supprimée avec succès" });
    } catch (error) {
      console.error("Error deleting invoice:", error);
      res.status(500).send(error);
    }
  }

  async getExportInvoices(type, dateFrom, dateTo) {
    try {
      const invoices = await Invoice.findAll({
        where: {
          type: type,
          etat: 1,
          isValidated: 1,
          validationDate: { [sequelize.Op.between]: [dateFrom, dateTo] },
        },
        include: [
          { model: Societe },
          { model: ListInvart },
          { model: Utilisateur },
        ],
        group: ["idInv"],
        order: [["validationDate", "DESC"]],
      });
      return invoices;
    } catch (error) {
      throw error;
    }
  }

  async getTotalRows() {
    try {
      const { count } = await sequelize.query(
        "SELECT FOUND_ROWS() AS totalRows"
      );
      return count;
    } catch (error) {
      throw error;
    }
  }

  async getListBy(req, res) {
    const { where, limit, params, orderby, whereByTTC } = req.body; // Assurez-vous que ces valeurs sont passées dans le corps de la requête

    try {
      let queryOptions = {
        where: where,
        group: "idInv",
        order: orderby ? [orderby] : [],
        limit: limit ? limit : null,
      };

      if (whereByTTC) {
        queryOptions.attributes = [
          [
            sequelize.fn("SUM", sequelize.col("quantite*autreQuantite")),
            "nbrArticles",
          ],
          [
            sequelize.fn(
              "ROUND",
              sequelize.fn(
                "SUM",
                sequelize.col("quantite*autreQuantite*postPrixUnit")
              ),
              2
            ),
            "totalTTC",
          ],
          [sequelize.col("tva"), "totalTVA"],
        ];
        queryOptions.having = sequelize.literal(whereByTTC);
      }

      const invoices = await Invoice.findAll(queryOptions);

      // Renvoyer les factures en réponse
      res.json(invoices);
    } catch (error) {
      console.error("Erreur lors de la récupération des factures:", error);

      // Renvoyer une erreur en réponse
      res
        .status(500)
        .json({
          message:
            "Une erreur est survenue lors de la récupération des factures",
        });
    }
  }

  async getFirstAvailableRef(req, res) {
    try {
      const type = parseInt(req.params.type);
      const year = req.params.year
        ? parseInt(req.params.year)
        : new Date().getFullYear();

      const invoices = await Invoice.findAll({
        where: {
          type: type,
          date: {
            [Op.between]: [`${year}-01-01`, `${year}-12-31`],
          },
        },
        order: [["reference", "ASC"]], // Triez par référence dans l'ordre croissant
        limit: 1, // Limitez les résultats à 1 ligne
      });

      if (invoices.length > 0) {
        res.json({ nextRef: invoices[0].reference });
      } else {
        res
          .status(404)
          .json({ message: "Aucune référence disponible trouvée." });
      }
    } catch (error) {
      console.error(
        "Erreur lors de la récupération de la première référence disponible:",
        error
      );
      res
        .status(500)
        .json({
          message:
            "Erreur lors de la récupération de la première référence disponible.",
        });
    }
  }

  async getLastAvailableRef(req, res) {
    try {
      const type = parseInt(req.params.type);
      const year = req.params.year
        ? parseInt(req.params.year)
        : new Date().getFullYear();

      const lastInvoice = await Invoice.findOne({
        attributes: [
          [
            sequelize.fn(
              "IFNULL",
              sequelize.fn("MAX", sequelize.col("reference")),
              0
            ),
            "lastRef",
          ],
        ],
        where: {
          type: type,
          date: {
            [Op.between]: [new Date(year, 0, 1), new Date(year, 11, 31)],
          },
        },
        raw: true,
      });

      // Calculer la prochaine référence disponible
      const nextRef = lastInvoice.lastRef ? lastInvoice.lastRef + 1 : 1;

      res.json(nextRef);
    } catch (error) {
      console.error(
        "Erreur lors de la récupération de la dernière référence disponible:",
        error
      );
      res
        .status(500)
        .json({
          message:
            "Erreur lors de la récupération de la dernière référence disponible.",
        });
    }
  }

  async getArticles(id) {
    try {
      return await Article.findAll({
        where: { idInv: id },
        order: [["idArticle", "ASC"]],
      });
    } catch (error) {
      throw error;
    }
  }

  async getCommentaires(id) {
    try {
      return await Commentaire.findAll({
        where: { idInv: id },
        include: { model: Utilisateur },
        order: [["idCommentaire", "ASC"]],
      });
    } catch (error) {
      throw error;
    }
  }

  async addArticle(
    idInv,
    designation,
    postPrixUnit,
    prePrixUnit,
    quantite,
    autreQuantite = 1
  ) {
    try {
      await Article.create({
        idInv,
        designation,
        postPrixUnit,
        prePrixUnit,
        quantite,
        autreQuantite,
      });
    } catch (error) {
      throw error;
    }
  }

  async addCommentaire(idInv, IdUser, dateCommentaire, commentaire) {
    try {
      await Commentaire.create({
        idInv,
        IdUser,
        dateCommentaire,
        commentaire,
      });
    } catch (error) {
      throw error;
    }
  }

  async deleteAllArticles(idInv) {
    try {
      await Article.destroy({ where: { idInv } });
    } catch (error) {
      throw error;
    }
  }

  async deleteAllCommentaires(idInv) {
    try {
      await Commentaire.destroy({ where: { idInv } });
    } catch (error) {
      throw error;
    }
  }

  async pay(idInv) {
    try {
      await Invoice.update(
        { etat: 1, paymentDate: sequelize.fn("CURDATE") },
        {
          where: { idInv },
        }
      );
    } catch (error) {
      throw error;
    }
  }

  async getAllTimesStat() {
    const query = `
          SELECT *, SUM(ttc) as totalTTC, SUM(tva) as totalTVA
          FROM (
              SELECT
              type,
              etat,
              COUNT(DISTINCT idInv) as nbrInv,
              ROUND(SUM(quantite*autreQuantite*postPrixUnit), 2) as ttc,
              tva,
              CASE WHEN idSociete != 0 THEN 1 ELSE 0 END as isClient
              FROM invoice LEFT JOIN listinvart USING(idInv)
              WHERE type > 0
              GROUP BY idInv
          ) t
          GROUP BY etat, isClient
        `;
    const result = await sequelize.query(query, {
      type: QueryTypes.SELECT,
    });
    return result;
  }

  async getTotals(select, where, params = []) {
    const query = `
          SELECT *, SUM(ttc) as totalTTC, SUM(tva) as totalTVA, COUNT(DISTINCT idInv) as nbrInv
          FROM (
              SELECT
              ${select} as timeUnit,
              idInv,
              ROUND(SUM(quantite*autreQuantite*postPrixUnit), 2) as ttc,
              tva
              FROM invoice LEFT JOIN listinvart USING(idInv)
              WHERE ${where}
              GROUP BY idInv
          ) t
          GROUP BY timeUnit
          ORDER BY timeUnit ASC
        `;
    const result = await sequelize.query(query, {
      replacements: params,
      type: QueryTypes.SELECT,
    });
    return result;
  }

  async getDocuments(idInv) {
    const query = "SELECT * FROM document WHERE idInv = :idInv";
    const result = await sequelize.query(query, {
      replacements: { idInv },
      type: QueryTypes.SELECT,
    });
    return result;
  }

  async deleteAllDocuments(idInv) {
    const query = "DELETE FROM document WHERE idInv = :idInv";
    const result = await sequelize.query(query, {
      replacements: { idInv },
      type: QueryTypes.DELETE,
    });
    return result;
  }
}

module.exports = new InvoiceController();
