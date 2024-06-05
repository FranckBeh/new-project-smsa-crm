const { Op } = require('sequelize');
const TypeClient  = require('../models/typeClient');

class TypeClientController {
  // Récupérer tous les types de clients
  async getAll(req, res) {
    try {
      const typeClients = await TypeClient.findAll();
      return res.status(200).json(typeClients);
    } catch (error) {
      console.error('Erreur lors de la récupération des types de clients :', error);
      return res.status(500).json({ error: 'Erreur serveur' });
    }
  }

  // Récupérer un type de client par ID
  async getById(req, res) {
    try {
      const id = req.params.id;
      const typeClient = await TypeClient.findByPk(id);
      res.json(typeClient);
    } catch (error) {
      res.status(500).send(error);
    }
  }

  // Créer un nouveau type de client
  async create(req, res) {
    try {
      const newTypeClient = await TypeClient.create(req.body);
      res.json(newTypeClient);
    } catch (error) {
      res.status(500).send(error);
    }
  }

  // Mettre à jour un type de client
  async update(req, res) {
    try {
      const id = req.params.id;
      const updatedTypeClient = await TypeClient.update(req.body, {
        where: { NumType: id }
      });
      res.json(updatedTypeClient);
    } catch (error) {
      res.status(500).send(error);
    }
  }

  // Supprimer un type de client
  async delete(req, res) {
    try {
      const id = req.params.id;
      await TypeClient.destroy({
        where: { NumType: id }
      });
      res.json({ message: 'Type de client supprimé avec succès.' });
    } catch (error) {
      res.status(500).send(error);
    }
  }

  // Recherche de types de clients
  async search(req, res) {
    try {
      const { NomType } = req.query;
      const typeClients = await TypeClient.findAll({
        where: { NomType: { [Op.like]: `%${NomType}%` } }
      });
      res.json(typeClients);
    } catch (error) {
      res.status(500).send(error);
    }
  }

  // Pagination
  async paginate(req, res) {
    try {
      const page = parseInt(req.query.page) || 1;
      const pageSize = parseInt(req.query.pageSize) || 10;
      const { count, rows } = await TypeClient.findAndCountAll({
        offset: (page - 1) * pageSize,
        limit: pageSize
      });
      res.json({ totalTypeClients: count, typeClients: rows });
    } catch (error) {
      res.status(500).send(error);
    }
  }
}

module.exports = new TypeClientController();
