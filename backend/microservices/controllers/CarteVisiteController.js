const { Op } = require('sequelize');
const { Sequelize } = require('sequelize');
const  CarteVisite  = require('../models/cartevisite');

class CarteVisiteController {
  // Récupérer toutes les cartes de visite
  async getAllCartes(req, res) {
    try {
      const carteVisites = await CarteVisite.findAll();
      res.json(carteVisites);
    } catch (error) {
      res.status(500).send(error);
    }
  }

  // Récupérer une carte de visite par ID
  async getById(req, res) {
    try {
      const id = req.params.id;
      const carteVisite = await CarteVisite.findByPk(id);
      res.json(carteVisite);
    } catch (error) {
      res.status(500).send(error);
    }
  }
  async search(req, res) {
    try {
      const { query } = req.params;
      const carteVisites = await CarteVisite.findAll({
        where: {
          [Op.or]: [
            { nom: { [Op.like]: `%${query}%` } },
            { fonction: { [Op.like]: `%${query}%` } },
            { adresse: { [Op.like]: `%${query}%` } },
            { tel: { [Op.like]: `%${query}%` } },
            { gsm: { [Op.like]: `%${query}%` } },
            { fax: { [Op.like]: `%${query}%` } },
            { email: { [Op.like]: `%${query}%` } },
            { web: { [Op.like]: `%${query}%` } },
            { societe: { [Op.like]: `%${query}%` } },
            { remarques: { [Op.like]: `%${query}%` } },
            // Ajoutez d'autres champs ici si nécessaire
          ]
        }
      });
      res.json(carteVisites);
    } catch (error) {
      res.status(500).send(error);
    }
  }

  // Créer une nouvelle carte de visite
  async create(req, res) {
    try {
      const newCarteVisite = await CarteVisite.create(req.body);
      res.json(newCarteVisite);
     // console.log('Nouvelle carte de visite ajoutée avec succès.');
    } catch (error) {
      res.status(500).send(error);
    }
  }

  // Mettre à jour une carte de visite
// Mettre à jour une carte de visite
async update(req, res) {
    try {
      const id = req.params.id;
      const updatedCarteVisite = await CarteVisite.update(req.body, {
        where: { IdCarte: id }
      });
      if (updatedCarteVisite[0] !== 0) { // Si la mise à jour a réussi
        res.json({ message: 'Carte de visite mise à jour avec succès.' });
      } else { // Si la mise à jour a échoué
        res.json({ message: 'La mise à jour a échoué. Aucune carte de visite trouvée avec cet ID.' });
      }
    } catch (error) {
      res.status(500).send(error);
    }
  }
  

  // Supprimer une carte de visite
  async delete(req, res) {
    try {
      const id = req.params.id;
      await CarteVisite.destroy({
        where: { IdCarte: id }
      });
      res.json({ message: 'Carte de visite supprimée avec succès.' });
    } catch (error) {
      res.status(500).send(error);
    }
  }

  

  // Pagination
  async paginate(req, res) {
    try {
      const page = parseInt(req.query.page) || 1;
      const pageSize = parseInt(req.query.pageSize) || 10;
      const { count, rows } = await CarteVisite.findAndCountAll({
        offset: (page - 1) * pageSize,
        limit: pageSize
      });
      res.json({ totalCarteVisites: count, carteVisites: rows });
    } catch (error) {
      res.status(500).send(error);
    }
  }
}

module.exports = new CarteVisiteController();
