const { Op } = require('sequelize');
const { Sequelize } = require('sequelize');
const Societe = require('../models/societe');


class SocieteController{

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
      const { count, rows } = await Societe.findAndCountAll({
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