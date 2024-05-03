const Listinvart = require('../models/listinvart');
const Societe = require('../models/societe');
const Utilisateur = require('../models/utilisateur');
const Invoice  = require('../models/invoice');
const { Op } = require('sequelize');
const { QueryTypes } = require('sequelize');
const {Sequelize} = require('sequelize');
const sequelize = require('../../config/database.js');
require('../models/association');

if (Invoice) {
    console.log('Le modèle Invoice a été correctement défini.');
} else {
    console.log('Erreur : Le modèle Invoice n\'a pas été défini.');
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
            case 'SequelizeConnectionError':
              console.error(errorMessage, 'Database connection error');
              break;
            case 'SequelizeError':
              console.error(errorMessage, 'Sequelize-specific error');
              res.status(500).send(error);
              break;
            default:
              console.error(errorMessage, 'Unknown error');
              res.status(500).send(error);
          }
          throw error;
        }
      }

      async getLastId(req, res, next) {
        try {
          const lastInvoice = await Invoice.findOne({
            attributes: [
              [Sequelize.fn('MAX', Sequelize.col('idInv')), 'lastId']
            ]
          });
          res.json(lastInvoice);
        } catch (error) {
          next(error);
        }
    }

    async getInvoiceList(req, res) {
        try {
            const invoices = await Invoice.findAll({ limit: 5, order: [['idSociete', 'ASC']] });
            
            res.json(invoices);
        } catch (error) {
            console.error('Erreur lors de la récupération des factures:', error);
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
                as: 'societe',
                attributes: ['nom']
              },
              {
                model: Listinvart,
                as: 'listinvart',
                attributes: ['quantite', 'autreQuantite', 'postPrixUnit']
              },
              {
                model: Utilisateur,
                as: 'utilisateur',
                attributes: ['login']
              }
            ],
            attributes: { exclude: ['IdSociete', 'idInv', 'idUser'] }
          });
    
          if (!invoice) {
            return res.status(404).json({ message: 'Facture non trouvée' });
          }
    
          return res.json(invoice);
        } catch (error) {
          console.error(error);
          return res.status(500).json({ message: 'Une erreur est survenue lors de la récupération de la facture' });
        }
      }

      async getInvoiceData(req, res) {
        try {
          const invoices = await Invoice.findAll({
            include: [
              {
                model: Societe,
                as: 'societe',
                attributes: ['nom']
              },
              {
                model: Listinvart,
                as: 'listinvart',
                attributes: [
                  'designation',
                  [Sequelize.literal('sum(quantite*autreQuantite)'), 'nbrArticles'],
                  'quantite',
                  'postPrixUnit',
                  'autreQuantite'
                ]
              }
            ],
            attributes: [
               'idInv',
              'reference',
              [Sequelize.literal('(case when (Invoice.idSociete=0) then 1 else Invoice.idSociete end)'), 'nc'],
              'date',
              'tva',
              [Sequelize.literal('round(sum(quantite*autreQuantite*postPrixUnit),2)'), 'totalTTC'],
              'paymentDate',
              'paymentMode'
            ],
            group: ['idInv', 'listinvart.idArticle'],
            order: [['date', 'DESC']]
          });
      
          res.json(invoices);
        } catch (error) {
          console.error('Error getting invoice data:', error);
          res.status(500).send(error);
        }
      }
      
    
    
    
    

      async createInvoice(req, res) {
        try {
            const data = req.body;
    
            const newInvoice = await Invoice.create(data);
    
            if (data.articles && Array.isArray(data.articles)) {
                await Promise.all(data.articles.map(async (article) => {
                    const newArticle = await Listinvart.create(article);
                    await newInvoice.addListinvart(newArticle);
                }));
            }
    
            res.json(newInvoice);
        } catch (error) {
            console.error('Error creating invoice:', error);
            res.status(500).send(error);
        }
    }
    
    async updateInvoice(req, res) {
        try {
            const data = req.body;
            if (!data.reference) {
                return res.status(400).send({ message: "La propriété 'reference' est manquante ou indéfinie." });
            }
    
            const invoice = await Invoice.findByPk(req.params.id);
            if (!invoice) {
                return res.status(404).send({ message: 'Facture non trouvée' });
            }
    
            const updatedInvoice = await invoice.update(data);
    
            if (data.articles && Array.isArray(data.articles)) {
                await Promise.all(data.articles.map(async (article) => {
                    const existingArticle = await Listinvart.findOne({ where: { idArticle: article.idArticle, idInv: invoice.idInv } });
                    if (existingArticle) {
                        await existingArticle.update(article);
                    } else {
                        const newArticle = await Listinvart.create(article);
                        await updatedInvoice.addListinvart(newArticle);
                    }
                }));
            }
    
            res.json(updatedInvoice);
        } catch (error) {
            console.error('Error updating invoice:', error);
            res.status(500).send(error);
        }
    }
    
    

    async deleteInvoice(req, res) {
        try {
            // Trouver la facture à supprimer
            const invoice = await Invoice.findByPk(req.params.id);
    
            if (!invoice) {
                return res.status(404).send({ message: 'Facture non trouvée' });
            }
    
            // Supprimer les articles associés
            const articles = await Listinvart.findAll({ where: { idInv: invoice.idInv } });
            for (let article of articles) {
                await article.destroy();
            }
    
            // Supprimer la facture
            await invoice.destroy();
    
            // Envoyer la réponse
            res.json({ message: 'Facture supprimée avec succès' });
        } catch (error) {
            console.error('Error deleting invoice:', error);
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
                    validationDate: { [sequelize.Op.between]: [dateFrom, dateTo] }
                },
                include: [
                    { model: Societe },
                    { model: ListInvart },
                    { model: Utilisateur }
                ],
                group: ['idInv'],
                order: [['validationDate', 'DESC']]
            });
            return invoices;
        } catch (error) {
            throw error;
        }
    }

    async getTotalRows() {
        try {
            const { count } = await sequelize.query('SELECT FOUND_ROWS() AS totalRows');
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
                group: 'idInv',
                order: orderby ? [orderby] : [],
                limit: limit ? limit : null
            };
    
            if (whereByTTC) {
                queryOptions.attributes = [
                    [sequelize.fn('SUM', sequelize.col('quantite*autreQuantite')), 'nbrArticles'],
                    [sequelize.fn('ROUND', sequelize.fn('SUM', sequelize.col('quantite*autreQuantite*postPrixUnit')), 2), 'totalTTC'],
                    [sequelize.col('tva'), 'totalTVA']
                ];
                queryOptions.having = sequelize.literal(whereByTTC);
            }
    
            const invoices = await Invoice.findAll(queryOptions);
    
            // Renvoyer les factures en réponse
            res.json(invoices);
        } catch (error) {
            console.error('Erreur lors de la récupération des factures:', error);
    
            // Renvoyer une erreur en réponse
            res.status(500).json({ message: 'Une erreur est survenue lors de la récupération des factures' });
        }
    }
    

    async getFirstAvailableRef1(type, year = null, ref = 1) {
        try {
            const yearClause = year ? { [sequelize.Op.and]: sequelize.where(sequelize.fn('YEAR', sequelize.col('date')), year) } : {};
            const [results] = await sequelize.query(`
                SELECT IFNULL(MIN(t1.reference + 1), ${ref}) AS nextRef
                FROM (
                    (SELECT reference, YEAR(date) AS year FROM invoices)
                    UNION
                    (SELECT ${ref - 1} AS reference, ${year || 'YEAR(CURDATE())'} AS year)
                ) t1
                LEFT JOIN invoices t2 ON (
                    t1.reference + 1 = t2.reference
                    AND t1.year = YEAR(t2.date)
                )
                WHERE
                    t2.reference IS NULL
                    AND (t1.reference + 1) >= ${ref}
            `, { type: sequelize.QueryTypes.SELECT });
            return results[0].nextRef;
        } catch (error) {
            throw error;
        }
    }

    async getFirstAvailableRef (req, res)  {
        try {
          const type = parseInt(req.params.type);
          const year = req.params.year ? parseInt(req.params.year) : new Date().getFullYear();
      
          const invoices = await Invoice.findAll({
            where: {
              type: type,
              date: {
                [Op.between]: [`${year}-01-01`, `${year}-12-31`]
              }
            },
            order: [['reference', 'ASC']], // Triez par référence dans l'ordre croissant
            limit: 1 // Limitez les résultats à 1 ligne
          });
      
          if (invoices.length > 0) {
            res.json({ nextRef: invoices[0].reference });
          } else {
            res.status(404).json({ message: 'Aucune référence disponible trouvée.' });
          }
        } catch (error) {
          console.error('Erreur lors de la récupération de la première référence disponible:', error);
          res.status(500).json({ message: 'Erreur lors de la récupération de la première référence disponible.' });
        }
      }
    
      
      

      async  getLastAvailableRef(req, res) {
        try {
          const type = parseInt(req.params.type);
          const year = req.params.year ? parseInt(req.params.year) : new Date().getFullYear();
      
          const lastInvoice = await Invoice.findOne({
            attributes: [
              [sequelize.fn('IFNULL', sequelize.fn('MAX', sequelize.col('reference')), 0), 'lastRef']
            ],
            where: {
              type: type,
              date: {
                [Op.between]: [new Date(year, 0, 1), new Date(year, 11, 31)]
              }
            },
            raw: true,
          });
      
          // Calculer la prochaine référence disponible
          const nextRef = lastInvoice.lastRef ? lastInvoice.lastRef + 1 : 1;
      
          res.json(nextRef);
        } catch (error) {
          console.error('Erreur lors de la récupération de la dernière référence disponible:', error);
          res.status(500).json({ message: 'Erreur lors de la récupération de la dernière référence disponible.' });
        }
      }


    async getArticles(id) {
        try {
            return await Article.findAll({
                where: { idInv: id },
                order: [['idArticle', 'ASC']]
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
                order: [['idCommentaire', 'ASC']]
            });
        } catch (error) {
            throw error;
        }
    }

    async addArticle(idInv, designation, postPrixUnit, prePrixUnit, quantite, autreQuantite = 1) {
        try {
            await Article.create({
                idInv,
                designation,
                postPrixUnit,
                prePrixUnit,
                quantite,
                autreQuantite
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
                commentaire
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
            await Invoice.update({ etat: 1, paymentDate: sequelize.fn('CURDATE') }, {
                where: { idInv }
            });
        } catch (error) {
            throw error;
        }
    }

    async getLastAvailableRef2(type, year = null) {
        year = year || new Date().getFullYear();
        const query = `
          SELECT IFNULL(MAX(t1.reference+1), 1) AS nextRef
          FROM invoice t1
          WHERE type = :type AND YEAR(date) = :year
        `;
        const result = await sequelize.query(query, {
          replacements: { type, year },
          type: QueryTypes.SELECT
        });
        return result;
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
          type: QueryTypes.SELECT
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
          type: QueryTypes.SELECT
        });
        return result;
      }
    
      async getDocuments(idInv) {
        const query = "SELECT * FROM document WHERE idInv = :idInv";
        const result = await sequelize.query(query, {
          replacements: { idInv },
          type: QueryTypes.SELECT
        });
        return result;
      }
    
      async deleteAllDocuments(idInv) {
        const query = "DELETE FROM document WHERE idInv = :idInv";
        const result = await sequelize.query(query, {
          replacements: { idInv },
          type: QueryTypes.DELETE
        });
        return result;
      }
}

module.exports = new InvoiceController();
