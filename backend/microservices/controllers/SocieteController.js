const { Op } = require('sequelize');
const { Sequelize } = require('sequelize');
const Societe = require('../models/societe');


class SocieteController{

  async  createSociete(req, res) {
    try {
      const { nom, ice, adresse } = req.body; // Récupérez les données du corps de la requête
  
      const newSociete = await Societe.create({
        nom,
        ice,
        adresse,
      });
  
      res.status(201).json(newSociete);
    } catch (error) {
      console.error('Erreur lors de la création de la société :', error);
      res.status(500).json({ message: 'Erreur lors de la création de la société' });
    }
  }
  
  // Mettre à jour une société par son ID
  async  updateSociete(req, res) {
    try {
      const { idSociete } = req.params;
      const { nom, ice, adresse } = req.body;
  
      const updatedSociete = await Societe.update(
        { nom, ice, adresse },
        { where: { idSociete } }
      );
  
      if (updatedSociete[0] === 0) {
        res.status(404).json({ message: 'Société introuvable' });
      } else {
        res.status(200).json({ message: 'Société mise à jour avec succès' });
      }
    } catch (error) {
      console.error('Erreur lors de la mise à jour de la société :', error);
      res.status(500).json({ message: 'Erreur lors de la mise à jour de la société' });
    }
  }
  
  // Supprimer une société par son ID
  async  deleteSociete(req, res) {
    try {
      const { idSociete } = req.params;
      const deletedSociete = await Societe.destroy({ where: { idSociete } });
  
      if (!deletedSociete) {
        res.status(404).json({ message: 'Société introuvable' });
      } else {
        res.status(200).json({ message: 'Société supprimée avec succès' });
      }
    } catch (error) {
      console.error('Erreur lors de la suppression de la société :', error);
      res.status(500).json({ message: 'Erreur lors de la suppression de la société' });
    }
  }
  async getAllSocietes (req, res) {
    try {
      const societes = await Societe.findAll();
      res.json(societes);
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Une erreur s\'est produite lors de la récupération des sociétés.' });
    }
  }
  
  async getSocieteList(req, res) {
    try {
      const page = parseInt(req.query.page) || 0;
      const pageSize = parseInt(req.query.pageSize) || 10;
  
      // Vérifiez si l'utilisateur a fourni un paramètre de recherche
      const search = req.query.search || ''; // Valeur par défaut : chaîne vide
  
      const whereCondition = search
        ? {
            [Op.or]: [
              { nom: { [Op.like]: `%${search}%` } },
              { ice: { [Op.like]: `%${search}%` } },
              { adresse: { [Op.like]: `%${search}%` } },
            ],
          }
        : {}; // Si pas de recherche, renvoie un objet vide
  
      const { count, rows } = await Societe.findAndCountAll({
        where: whereCondition, // Utilisez la condition de recherche
        order: [['nom', 'ASC']],
        limit: pageSize,
        offset: page * pageSize,
      });
  
      res.json({ totalSocietes: count, societes: rows });
    } catch (error) {
      res.status(500).send(error);
    }
  }
  

}

module.exports = new SocieteController();