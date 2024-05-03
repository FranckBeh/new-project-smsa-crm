const { Op } = require('sequelize');
const { Prestataire } = require('../models/prestataire');

class PrestataireController {
  // Récupérer tous les prestataires
  async getAll(req, res) {
    try {
      const prestataires = await Prestataire.findAll();
      res.json(prestataires);
    } catch (error) {
      res.status(500).send(error);
    }
  }

  // Récupérer un prestataire par ID
  async getById(req, res) {
    try {
      const id = req.params.id;
      const prestataire = await Prestataire.findByPk(id);
      res.json(prestataire);
    } catch (error) {
      res.status(500).send(error);
    }
  }

  // Créer un nouveau prestataire
  async create(req, res) {
    try {
      const newPrestataire = await Prestataire.create(req.body);
      res.json(newPrestataire);
    } catch (error) {
      res.status(500).send(error);
    }
  }

  // Mettre à jour un prestataire
  async update(req, res) {
    try {
      const id = req.params.id;
      const updatedPrestataire = await Prestataire.update(req.body, {
        where: { IdPrest: id }
      });
      res.json(updatedPrestataire);
    } catch (error) {
      res.status(500).send(error);
    }
  }

  // Supprimer un prestataire
  async delete(req, res) {
    try {
      const id = req.params.id;
      await Prestataire.destroy({
        where: { IdPrest: id }
      });
      res.json({ message: 'Prestataire supprimé avec succès.' });
    } catch (error) {
      res.status(500).send(error);
    }
  }

  // Recherche de prestataires
  async search(req, res) {
    try {
      const { nom } = req.query;
      const prestataires = await Prestataire.findAll({
        where: { nom: { [Op.like]: `%${nom}%` } }
      });
      res.json(prestataires);
    } catch (error) {
      res.status(500).send(error);
    }
  }

  // Pagination
  async paginate(req, res) {
    try {
      const page = parseInt(req.query.page) || 1;
      const pageSize = parseInt(req.query.pageSize) || 10;
      const { count, rows } = await Prestataire.findAndCountAll({
        offset: (page - 1) * pageSize,
        limit: pageSize
      });
      res.json({ totalPrestataires: count, prestataires: rows });
    } catch (error) {
      res.status(500).send(error);
    }
  }
}

module.exports = new PrestataireController();
