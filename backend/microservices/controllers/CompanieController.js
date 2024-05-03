const { Op } = require('sequelize');
const ParametreCompanie  = require('../models/companie');

class ParametreCompanieController {
  // Récupérer tous les paramètres des compagnies
  async getAll(req, res) {
    try {
      const parametreCompanies = await ParametreCompanie.findAll();
      res.json(parametreCompanies);
    } catch (error) {
        console.error(`Une erreur s'est produite lors de la récupération du de la compagnie : ${error}`);
    }
  }

  // Récupérer un paramètre de compagnie par ID
  async getById(req, res) {
    try {
      const id = req.params.id;
      const parametreCompanie = await ParametreCompanie.findByPk(id);
      if (parametreCompanie) {
        res.json(parametreCompanie);
      } else {
        res.status(404).send({ message: 'Paramètre de compagnie introuvable.' });
      }
    } catch (error) {
      res.status(500).send(error);
    }
  }

  // Recherche de paramètres de compagnie
  async search(req, res) {
    try {
      const { query } = req.params;
      const parametreCompanies = await ParametreCompanie.findAll({
        where: {
          [Op.or]: [
            { nomCompanie: { [Op.like]: `%${query}%` } },
            { adresseCompanie: { [Op.like]: `%${query}%` } },
            { tel1Companie: { [Op.like]: `%${query}%` } },
            // Ajoutez d'autres champs de recherche ici si nécessaire
          ]
        }
      });
      res.json(parametreCompanies);
    } catch (error) {
      res.status(500).send(error);
    }
  }

  // Créer un nouveau paramètre de compagnie
  async create(req, res) {
    try {
      const newParametreCompanie = await ParametreCompanie.create(req.body);
      res.status(201).json(newParametreCompanie);
    } catch (error) {
      res.status(500).send(error);
    }
  }

  // Mettre à jour un paramètre de compagnie
  async update(req, res) {
    try {
      const id = req.params.id;
      const updatedParametreCompanie = await ParametreCompanie.update(req.body, {
        where: { idCompanie: id }
      });
      if (updatedParametreCompanie[0] !== 0) {
        res.json({ message: 'Paramètre de compagnie mis à jour avec succès.' });
      } else {
        res.status(404).send({ message: 'Aucun paramètre de compagnie trouvé avec cet ID.' });
      }
    } catch (error) {
      res.status(500).send(error);
    }
  }

  // Supprimer un paramètre de compagnie
  async delete(req, res) {
    try {
      const id = req.params.id;
      const deleted = await ParametreCompanie.destroy({
        where: { idCompanie: id }
      });
      if (deleted) {
        res.json({ message: 'Paramètre de compagnie supprimé avec succès.' });
      } else {
        res.status(404).send({ message: 'Aucun paramètre de compagnie trouvé avec cet ID.' });
      }
    } catch (error) {
      res.status(500).send(error);
    }
  }

  // Pagination des paramètres des compagnies
  async paginate(req, res) {
    try {
      const page = parseInt(req.query.page) || 1;
      const pageSize = parseInt(req.query.pageSize) || 10;
      const { count, rows } = await ParametreCompanie.findAndCountAll({
        offset: (page - 1) * pageSize,
        limit: pageSize
      });
      res.json({ totalParametreCompanies: count, parametreCompanies: rows });
    } catch (error) {
      res.status(500).send(error);
    }
  }
}

module.exports = new ParametreCompanieController();
