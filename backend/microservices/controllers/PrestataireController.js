const { Op, fn, col, literal, QueryTypes } = require("sequelize");
const { Sequelize } = require("sequelize"); // Assurez-vous d'importer Sequelize et sequelize
const fs = require("fs");
const path = require("path");
const { v4: uuidv4 } = require("uuid");
const sequelize = require("../../config/database");
const Prestataire = require("../models/prestataire");
const Ville = require("../models/ville");
const DomaineActivite = require("../models/domaineActivite");
const Note = require("../models/note");
const ListDomPres = require("../models/listDomPres");
const Tag = require("../models/tag");
const ListTagPres = require("../models/listTagPres");
const Document = require("../models/document");
const AutresPrest = require("../models/autresPrest");
require("../models/association_prestataire");

const photoDir = path.join(__dirname, "..", "uploads", "photo_prestataire");
const documentDir = path.join(
  __dirname,
  "..",
  "uploads",
  "document_prestataire"
);
class PrestataireController {
  async getPrestCount(req, res) {
    try {
      const count = await Prestataire.count();
      res.json({ count });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }

  async getAllPrestataires(req, res) {
    try {
        const prestataires = await Prestataire.findAll();
        res.json(prestataires);
    } catch (error) {
        res.status(500).json({ error: 'Error fetching prestataires' });
    }
}

  async getLastId(req, res) {
    try {
      const lastPrestataire = await Prestataire.findOne({
        order: [["IdPrest", "DESC"]],
        attributes: ["IdPrest"],
      });
      res.json(lastPrestataire);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }
  async createPrestataire(req, res) {
    const transaction = await sequelize.transaction();
    try {
      const prestataireData = req.body;
      const { photo, documents } = req.files;

      // Vérification des fichiers reçus
      if (!photo || !photo.length) {
        console.error("No photo received");
      }
      if (!documents || !documents.length) {
        console.error("No documents received");
      }

      // Parser les domaines et les tags
      const selectedDomaines = JSON.parse(prestataireData.selectedDomaines);
      const selectedTags = JSON.parse(prestataireData.selectedTags);
      const infosSupplementaires = JSON.parse(prestataireData.infosSupplementaires);

      const newPrestataire = await Prestataire.create(
        {
          nom: prestataireData.nom,
          ville: prestataireData.ville,
          fix: prestataireData.telephone,
          fax: prestataireData.fax,
          email: prestataireData.email,
          adresse: prestataireData.adresse,
          nomResponsable: prestataireData.nomResponsable,
          fonctionResponsable: prestataireData.fonctionResponsable,
          gsmResponsable: prestataireData.gsmResponsable,
          mailResponsable: prestataireData.emailResponsable,
          remarques: prestataireData.remarques,
          validite: prestataireData.validite === "true",
          aviscons: prestataireData.avis,
          infonet: prestataireData.internet,
        },
        { transaction }
      );

      // Insertion des domaines sélectionnés
      if (selectedDomaines && selectedDomaines.length > 0) {
        for (const domaineId of selectedDomaines) {
          await ListDomPres.create(
            {
              IdPrest: newPrestataire.IdPrest,
              IdDomaine: domaineId,
            },
            { transaction }
          );
        }
      }

      // Insertion des tags sélectionnés
      if (selectedTags && selectedTags.length > 0) {
        for (const tagId of selectedTags) {
          await ListTagPres.create(
            {
              IdPrest: newPrestataire.IdPrest,
              idTag: tagId,
            },
            { transaction }
          );
        }
      }

      // Gestion des informations supplémentaires
      if (infosSupplementaires && infosSupplementaires.length > 0) {
        for (const info of infosSupplementaires) {
          await AutresPrest.create(
            {
              IdPrest: newPrestataire.IdPrest,
              cle: info.libelle,
              valeur: info.information,
              infoSecu: 0, // Set any default value for infoSecu if required
            },
            { transaction }
          );
        }
      }

      // Gestion de la photo
      if (photo && photo.length > 0) {
        const photoFile = photo[0];
        const photoPath = path.join(photoDir, photoFile.filename);

        await Document.create(
          {
            IdPrest: newPrestataire.IdPrest,
            nom: `Photo de ${newPrestataire.nom}`,
            nomFichier: photoFile.filename,
            idFree: null,
            idInv: null,
            cheminFichier: photoPath,
          },
          { transaction }
        );
      }

      // Gestion des documents
      if (documents && documents.length > 0) {
        for (const doc of documents) {
          const docPath = path.join(documentDir, doc.filename);

          await Document.create(
            {
              IdPrest: newPrestataire.IdPrest,
              nom: `Document de ${newPrestataire.nom}`,
              nomFichier: doc.filename,
              idFree: null,
              idInv: null,
              cheminFichier: docPath,
            },
            { transaction }
          );
        }
      }

      await transaction.commit();

      res.status(201).json({
        message: "Prestataire créé avec succès",
        prestataire: newPrestataire,
      });
    } catch (error) {
      await transaction.rollback();
      console.error("Erreur lors de la création du prestataire:", error);
      res.status(500).json({
        message: "Erreur lors de la création du prestataire",
        error
      });
    }
  }
  async updatePrestataire(req, res) {
    const transaction = await sequelize.transaction();
    try {
      const prestataireId = req.params.id;
      const prestataireData = req.body;
      const files = req.files || {};
      const photo = files.photo || [];
      const documents = files.documents || [];
  
      // Vérification des fichiers reçus
      if (!photo || !photo.length) {
        console.error("No photo received");
      }
      if (!documents || !documents.length) {
        console.error("No documents received");
      }
  
      // Parser les domaines, tags, et infosSupplementaires
      const selectedDomaines = JSON.parse(prestataireData.selectedDomaines);
      const selectedTags = JSON.parse(prestataireData.selectedTags);
      const infosSupplementaires = JSON.parse(prestataireData.infosSupplementaires);
  
      // Mise à jour du prestataire
      await Prestataire.update(
        {
          nom: prestataireData.nom,
          ville: prestataireData.ville,
          fix: prestataireData.telephone,
          fax: prestataireData.fax,
          email: prestataireData.email,
          adresse: prestataireData.adresse,
          nomResponsable: prestataireData.nomResponsable,
          fonctionResponsable: prestataireData.fonctionResponsable,
          gsmResponsable: prestataireData.gsmResponsable,
          mailResponsable: prestataireData.emailResponsable,
          remarques: prestataireData.remarques,
          validite: prestataireData.validite === "true",
          aviscons: prestataireData.avis,
          infonet: prestataireData.internet,
        },
        {
          where: { IdPrest: prestataireId },
          transaction,
        }
      );
  
      // Mise à jour des domaines sélectionnés
      await ListDomPres.destroy({ where: { IdPrest: prestataireId }, transaction });
      if (selectedDomaines && selectedDomaines.length > 0) {
        for (const domaineId of selectedDomaines) {
          await ListDomPres.create(
            {
              IdPrest: prestataireId,
              IdDomaine: domaineId,
            },
            { transaction }
          );
        }
      }
  
      // Mise à jour des tags sélectionnés
      await ListTagPres.destroy({ where: { IdPrest: prestataireId }, transaction });
      if (selectedTags && selectedTags.length > 0) {
        for (const tagId of selectedTags) {
          await ListTagPres.create(
            {
              IdPrest: prestataireId,
              idTag: tagId,
            },
            { transaction }
          );
        }
      }
  
      // Mise à jour des infos supplémentaires
      await AutresPrest.destroy({ where: { IdPrest: prestataireId }, transaction });
      if (infosSupplementaires && infosSupplementaires.length > 0) {
        for (const info of infosSupplementaires) {
          await AutresPrest.create(
            {
              IdPrest: prestataireId,
              cle: info.libelle,
              valeur: info.information,
            },
            { transaction }
          );
        }
      }
  
      // Gestion de la photo
      if (photo && photo.length > 0) {
        const photoFile = photo[0];
        const photoPath = path.join(photoDir, photoFile.filename);
  
        await Document.create(
          {
            IdPrest: prestataireId,
            nom: `Photo de ${prestataireData.nom}`,
            nomFichier: photoFile.filename,
            idFree: null,
            idInv: null,
            cheminFichier: photoPath,
          },
          { transaction }
        );
      }
  
      // Gestion des documents
      if (documents && documents.length > 0) {
        for (const doc of documents) {
          const docPath = path.join(documentDir, doc.filename);
  
          await Document.create(
            {
              IdPrest: prestataireId,
              nom: `Document de ${prestataireData.nom}`,
              nomFichier: doc.filename,
              idFree: null,
              idInv: null,
              cheminFichier: docPath,
            },
            { transaction }
          );
        }
      }
  
      await transaction.commit();
  
      res.status(200).json({
        message: "Prestataire mis à jour avec succès",
        prestataire: prestataireData,
      });
    } catch (error) {
      await transaction.rollback();
      console.error("Erreur lors de la mise à jour du prestataire:", error);
      res.status(500).json({ message: "Erreur lors de la mise à jour du prestataire", error });
    }
  }
  async searchPrestataires(req, res) {
    const page = parseInt(req.query.page, 10) || 1;
    const limit = parseInt(req.query.pageSize, 10) || 10;
    const offset = (page - 1) * limit;
    const searchTerm = req.query.query || '';
    const searchOption = req.query.option || 'nom';
  
    // Mapping des options de recherche aux champs de la base de données
    const searchFields = {
      nom: 'nom',
      nomResponsable: 'nomResponsable',
      email: 'email',
      fonctionResponsable: 'fonctionResponsable',
      gsmResponsable: 'gsmResponsable',
      remarques: 'remarques',
      ville: '$villeAssociation.nomville$',
      domainesActivite: '$domainesActivite.nom$',
      tags: '$tags.nom$'
    };
  
    const searchField = searchFields[searchOption];
  
    try {
      const { count, rows: prestataires } = await Prestataire.findAndCountAll({
        where: {
          blacklist: 0,
          [Op.or]: [
            { [searchField]: { [Op.like]: `%${searchTerm}%` } }
          ]
        },
        include: [
          {
            model: Ville,
            as: 'villeAssociation',
            attributes: ['nomville', 'numville'],
          },
          {
            model: DomaineActivite,
            as: 'domainesActivite',
            through: { attributes: [] },
          },
          {
            model: Tag,
            as: 'tags',
            through: { attributes: [] },
          },
          {
            model: Note,
            attributes: [],
          },
        ],
        attributes: {
          include: [[fn('COUNT', col('Notes.IdNote')), 'noteCount']],
        },
        order: [['nom', 'ASC']],
        limit,
        offset,
        group: ['Prestataire.IdPrest', 'villeAssociation.numville', 'domainesActivite.IdDomaine', 'tags.idTag'],
        subQuery: false,
      });
  
      const totalItems = count.length;
      const totalPages = Math.ceil(totalItems / limit);
  
      res.status(200).json({
        data: prestataires,
        pagination: {
          totalItems,
          totalPages,
          currentPage: page,
        },
      });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }

  async getList(req, res) {
    const page = parseInt(req.query.page, 10) || 1;
    const limit = parseInt(req.query.pageSize, 10) || 10;
    const offset = (page - 1) * limit;

    try {
      const { count, rows: prestataires } = await Prestataire.findAndCountAll({
        where: { blacklist: 0 },
        include: [
          {
            model: Ville,
            as: "villeAssociation",
            attributes: ["nomville", "numville"],
          },
          {
            model: Note,
            attributes: [],
          },
        ],
        attributes: {
          include: [[fn("COUNT", col("Notes.IdNote")), "noteCount"]],
        },
        order: [["updatedAt", "DESC"]],
        limit,
        offset,
        group: ["Prestataire.IdPrest", "villeAssociation.numville"],
        subQuery: false,
      });

      // `count` is an array when grouping
      const totalItems = count.length;
      const totalPages = Math.ceil(totalItems / limit);

      res.status(200).json({
        data: prestataires,
        pagination: {
          totalItems,
          totalPages,
          currentPage: page,
        },
      });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }


  async getPrestataireById(req, res) {
    try {
      const prestataireId = req.params.id;
  
      const prestataire = await Prestataire.findByPk(prestataireId, {
        include: [
          { model: Ville, as: "villeAssociation" },
          { model: Note, as: "notes" },
          {
            model: DomaineActivite,
            through: { model: ListDomPres },
            as: "domainesActivite",
          },
          {
            model: Tag,
            through: { model: ListTagPres },
            as: "tags",
          },
          { model: Document, as: "documents" },
          { model: AutresPrest, as: "autresPrest" },
        ],
      });
  
      if (!prestataire) {
        return res.status(404).json({ message: "Prestataire non trouvé" });
      }
  
      // Construire la réponse avec les attributs associés
      const response = {
        id: prestataire.IdPrest,
        nom: prestataire.nom,
        adresse: prestataire.adresse,
        villeId: prestataire.villeAssociation
          ? prestataire.villeAssociation.NumVille
          : null,
        villeNom: prestataire.villeAssociation
          ? prestataire.villeAssociation.NomVille
          : null,
        priorite: prestataire.priorite, // Attribut manquant
        fix: prestataire.fix, // Attribut manquant
        prioritaire: prestataire.prioritaire, // Attribut manquant
        fonctionResponsable: prestataire.fonctionResponsable, // Attribut manquant
        mailResponsable: prestataire.mailResponsable, // Attribut manquant
        document: prestataire.document, // Attribut manquant
        gsmResponsable: prestataire.gsmResponsable, // Attribut manquant
        notes: prestataire.notes.map((note) => ({
          id: note.IdNote,
          dateNote: note.dateNote,
          context: note.context,
          // Ajoutez d'autres attributs de Note selon les besoins
        })),
        domainesActivite: prestataire.domainesActivite.map((domaine) => ({
          id: domaine.IdDomaine,
          nom: domaine.nom,
          // Ajoutez d'autres attributs de DomaineActivite selon les besoins
        })),
        tags: prestataire.tags.map((tag) => ({
          id: tag.idTag,
          nom: tag.nom,
          // Ajoutez d'autres attributs de Tag selon les besoins
        })),
        documents: prestataire.documents.map((document) => ({
          id: document.IdDocument,
          nom: document.nom,
          nomFichier: document.nomFichier,
          // Ajoutez d'autres attributs de Document selon les besoins
        })),
        autresPrest: prestataire.autresPrest.map((autre) => ({
          id: autre.IdAutres,
          cle: autre.cle,
          valeur: autre.valeur,
          // Ajoutez d'autres attributs de AutresPrest selon les besoins
        })),
        note: prestataire.note, // Attribut manquant
        nomResponsable: prestataire.nomResponsable, // Attribut manquant
        blacklist: prestataire.blacklist, // Attribut manquant
        email: prestataire.email, // Attribut manquant
        fax: prestataire.fax, // Attribut manquant
        remarques: prestataire.remarques, // Attribut manquant
        aviscons: prestataire.aviscons, // Attribut manquant
        infonet: prestataire.infonet, // Attribut manquant
        commission: prestataire.commission, // Attribut manquant
      };
  
      res.json(response);
    } catch (error) {
      console.error("Erreur lors de la récupération du prestataire :", error);
      res.status(500).json({ message: "Erreur serveur" });
    }
  }
  

  async getListBlack(req, res) {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const offset = (page - 1) * limit;

    try {
      const { count, rows: prestataires } = await Prestataire.findAndCountAll({
        where: { blacklist: 1 },
        order: [["nom", "ASC"]],
        limit,
        offset,
        include: [
          {
            model: Ville,
            as: "villeAssociation",
            attributes: ["nomville", "numville"],
          },
          {
            model: Note,
            attributes: [],
          },
        ],
        attributes: {
          include: [[fn("COUNT", col("Notes.IdNote")), "noteCount"]],
        },
        group: ["Prestataire.IdPrest", "villeAssociation.numville"],
        subQuery: false,
      });

      const totalPages = Math.ceil(count.length / limit);

      res.status(200).json({
        data: prestataires,
        pagination: {
          totalItems: count.length,
          totalPages,
          currentPage: page,
        },
      });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }

  async getListByDomVille(req, res) {
    const { idDom, ville } = req.params;
    try {
      const prestataires = await Prestataire.findAll({
        include: [
          {
            model: ListDomPres,
            where: { iddomaine: idDom },
          },
          {
            model: Ville,
            where: { ville: ville },
          },
        ],
      });
      res.json(prestataires);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }

  async getListByTag(req, res) {
    const { idTag } = req.params;
    try {
      const prestataires = await Prestataire.findAll({
        include: [
          {
            model: ListTagPres,
            where: { idTag: idTag },
          },
        ],
      });
      res.json(prestataires);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }

  async getListBy(req, res) {
    const { where, by, limit, params, datatableSort } = req.body;
    try {
      let query = {};
      if (by === "byDomaine") {
        query = {
          include: [
            {
              model: DomaineActivite,
              where: where,
            },
            {
              model: Ville,
            },
            {
              model: Note,
              attributes: [[fn("count", col("idnote")), "nbrNotes"]],
              group: ["IdPrest"],
            },
          ],
          where: {
            blacklist: 0,
            ...params,
          },
          order: datatableSort,
          limit: limit,
        };
      } else if (by === "byTag") {
        query = {
          include: [
            {
              model: Tag,
              where: where,
            },
            {
              model: Ville,
            },
            {
              model: Note,
              attributes: [[fn("count", col("idnote")), "nbrNotes"]],
              group: ["IdPrest"],
            },
          ],
          where: {
            blacklist: 0,
            ...params,
          },
          order: datatableSort,
          limit: limit,
        };
      } else {
        query = {
          include: [
            {
              model: Ville,
            },
            {
              model: Note,
              attributes: [[fn("count", col("idnote")), "nbrNotes"]],
              group: ["IdPrest"],
            },
          ],
          where: {
            blacklist: 0,
            ...params,
          },
          order: datatableSort,
          limit: limit,
        };
      }

      const prestataires = await Prestataire.findAll(query);
      res.json(prestataires);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }

  async getListByDomForClient(req, res) {
    const { idDom, idVille, idClient } = req.params;
    try {
      const prestataires = await Prestataire.findAll({
        include: [
          {
            model: Ville,
            where: { numville: idVille },
          },
          {
            model: DomaineActivite,
            where: { iddomaine: idDom },
          },
          {
            model: Note,
            attributes: [
              "idprest",
              [
                fn(
                  "SUM",
                  literal(
                    `((ABS(IFNULL(note.satisfaction, 0))*2-1)*(case when note.domaine=${idDom} then 1 else 0 end))*(case when note.IdClient=${idClient} then 3 else 1 end)`
                  )
                ),
                "nbrNotes",
              ],
            ],
            group: ["IdPrest"],
          },
        ],
        where: {
          [Op.or]: [
            { IdPrest: 0 },
            {
              blacklist: 0,
              "$domaineactivite.iddomaine$": idDom,
              "$ville.numville$": idVille,
            },
          ],
        },
        order: [
          ["isAutre", "ASC"],
          ["nbrNotes", "DESC"],
          ["priorite", "DESC"],
        ],
      });
      res.json(prestataires);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }

  async getPrestataire(req, res) {
    const { id } = req.params;
    try {
      const prestataire = await Prestataire.findOne({
        where: { IdPrest: id },
        include: [
          {
            model: Ville,
            attributes: ["nomville", "numville"],
          },
        ],
      });
      res.json(prestataire);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }

  async getDomaines(req, res) {
    const { id } = req.params;
    try {
      const domaines = await DomaineActivite.findAll({
        include: [
          {
            model: ListDomPres,
            where: { idprest: id },
          },
        ],
      });
      res.json(domaines);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }

  async getTags(req, res) {
    const { id } = req.params;
    try {
      const tags = await Tag.findAll({
        include: [
          {
            model: ListTagPres,
            where: { idprest: id },
          },
        ],
      });
      res.json(tags);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }

  async getIdNom(req, res) {
    const { name, page } = req.params;
    const offset = (page - 1) * 30;
    try {
      const prestataires = await Prestataire.findAll({
        where: {
          nom: {
            [Op.like]: `%${name}%`,
          },
        },
        order: [["nom", "ASC"]],
        limit: 30,
        offset: offset,
      });
      res.json(prestataires);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }

  async getDocuments(req, res) {
    const { id } = req.params;
    try {
      const documents = await Document.findAll({
        where: { idprest: id },
      });
      res.json(documents);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }

  async getAutres(req, res) {
    const { id } = req.params;
    try {
      const autres = await AutresPrest.findAll({
        where: { IdPrest: id },
      });
      res.json(autres);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }

  async create(req, res) {
    try {
      const prestataire = await Prestataire.create(req.body);
      res.json(prestataire);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }

  async addToListDom(req, res) {
    const { idPrest, idDom } = req.body;
    try {
      const listDomPres = await ListDomPres.create({
        IdPrest: idPrest,
        iddomaine: idDom,
      });
      res.json(listDomPres);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }

  async deleteAllDomaines(req, res) {
    const { idPrest } = req.params;
    try {
      await ListDomPres.destroy({ where: { idprest: idPrest } });
      res.json({ message: "Domaines deleted successfully" });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }

  async addToListTag(req, res) {
    const { idPrest, idTag } = req.body;
    try {
      const listTagPres = await ListTagPres.create({
        IdPrest: idPrest,
        idTag: idTag,
      });
      res.json(listTagPres);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }

  async deleteAllTags(req, res) {
    const { idPrest } = req.params;
    try {
      await ListTagPres.destroy({ where: { idprest: idPrest } });
      res.json({ message: "Tags deleted successfully" });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }

  async deleteAllDocuments(req, res) {
    const { idPrest } = req.params;
    try {
      await Document.destroy({ where: { idprest: idPrest } });
      res.json({ message: "Documents deleted successfully" });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }

  async deleteAutres(req, res) {
    const { idPrest } = req.params;
    try {
      await AutresPrest.destroy({ where: { IdPrest: idPrest } });
      res.json({ message: "Autres deleted successfully" });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }

  async update(req, res) {
    const { id } = req.params;
    try {
      await Prestataire.update(req.body, { where: { IdPrest: id } });
      res.json({ message: "Prestataire updated successfully" });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }

  async delete(req, res) {
    const { id } = req.params;
    try {
      await Note.update({ idprest: 0 }, { where: { idprest: id } });
      await Prestataire.destroy({ where: { IdPrest: id } });
      res.json({ message: "Prestataire deleted successfully" });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }

  async setPriorite(req, res) {
    const { idPrest, newPriorite } = req.body;
    try {
      await Prestataire.update(
        { priorite: newPriorite },
        { where: { IdPrest: idPrest } }
      );
      res.json({ message: "Priorité updated successfully" });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }

  async getHotelNuites(req, res) {
    const { idPrest, dt1, dt2 } = req.params;
    try {
      const query = `
        SELECT SUM(hotelnote.nbrnuits) AS nbrNuits, DATE_FORMAT(note.dateNote, '%m/%Y') AS mois
        FROM hotelnote
        INNER JOIN note ON hotelnote.idNote = note.IdNote
        INNER JOIN prestataire ON prestataire.IdPrest = note.IdPrest
        WHERE prestataire.IdPrest = :idPrest
        AND note.dateNote BETWEEN :dt1 AND :dt2
        AND note.etat = 'Finalisée et consommée par le client'
        GROUP BY CONCAT(YEAR(note.dateNote), '-', MONTH(note.dateNote))
        ORDER BY note.dateNote
      `;
      const hotelNuites = await sequelize.query(query, {
        replacements: { idPrest, dt1, dt2 },
        type: QueryTypes.SELECT,
      });
      res.json(hotelNuites);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }

  async getSuggestions(req, res) {
    const { strSearch } = req.params;
    try {
      const where = `(0 ${strSearch
        .split("")
        .map(
          (_, i) =>
            `OR nom LIKE '${strSearch.slice(0, i)}%${strSearch.slice(i + 1)}'`
        )
        .join(" ")})`;

      const suggestions = await sequelize.query(
        `
        SELECT DISTINCT(nom)
        FROM prestataire
        WHERE ${where}
        ORDER BY nom
        LIMIT 5
      `,
        {
          type: QueryTypes.SELECT,
        }
      );

      res.json(suggestions);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }
}

module.exports = new PrestataireController();
