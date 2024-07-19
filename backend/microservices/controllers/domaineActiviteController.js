const DomaineActivite = require('../models/domaineActivite');
const { Op, fn, col, literal, QueryTypes } = require('sequelize');
const sequelize = require('../../config/database');
const { Sequelize } = require('sequelize');

class domaineActiviteController{
    async getAllDomaines (req, res) {
        try {
            const domaines = await DomaineActivite.findAll();
            res.json(domaines);
        } catch (error) {
            res.status(500).json({ error: 'Une erreur est survenue' });
        }
    }
    
  async getDomaineById (req, res) {
        try {
            const domaine = await DomaineActivite.findByPk(req.params.id);
            if (domaine) {
                res.json(domaine);
            } else {
                res.status(404).json({ error: 'Domaine non trouvé' });
            }
        } catch (error) {
            res.status(500).json({ error: 'Une erreur est survenue' });
        }
    }
    
   async createDomaine (req, res) {
        try {
            const domaine = await DomaineActivite.create(req.body);
            res.status(201).json(domaine);
        } catch (error) {
            res.status(500).json({ error: 'Une erreur est survenue' });
        }
    };
    
async updateDomaine (req, res)  {
        try {
            const [updated] = await DomaineActivite.update(req.body, { where: { IdDomaine: req.params.id } });
            if (updated) {
                const updatedDomaine = await DomaineActivite.findByPk(req.params.id);
                res.json(updatedDomaine);
            } else {
                res.status(404).json({ error: 'Domaine non trouvé' });
            }
        } catch (error) {
            res.status(500).json({ error: 'Une erreur est survenue' });
        }
    };
    
async deleteDomaine (req, res) {
        try {
            const deleted = await DomaineActivite.destroy({ where: { IdDomaine: req.params.id } });
            if (deleted) {
                res.status(204).send();
            } else {
                res.status(404).json({ error: 'Domaine non trouvé' });
            }
        } catch (error) {
            res.status(500).json({ error: 'Une erreur est survenue' });
        }
    };
    
}

module.exports = new domaineActiviteController();