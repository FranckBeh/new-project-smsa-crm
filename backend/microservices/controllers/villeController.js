const Ville = require('../models/ville');
const { Op, fn, col, literal, QueryTypes } = require('sequelize');
const sequelize = require('../../config/database');
const { Sequelize } = require('sequelize');

class villeController{
async getAllVilles( req, res ) {
    try {
        const villes = await Ville.findAll();
        res.json(villes);
    } catch (error) {
        res.status(500).json({ error: 'Une erreur est survenue' });
    }
};

async getVilleById( req, res ) {
    try {
        const ville = await Ville.findByPk(req.params.id);
        if (ville) {
            res.json(ville);
        } else {
            res.status(404).json({ error: 'Ville non trouvée' });
        }
    } catch (error) {
        res.status(500).json({ error: 'Une erreur est survenue' });
    }
};

async createVille( req, res ) {
    try {
        const ville = await Ville.create(req.body);
        res.status(201).json(ville);
    } catch (error) {
        res.status(500).json({ error: 'Une erreur est survenue' });
    }
};

async updateVille( req, res ) {
    try {
        const [updated] = await Ville.update(req.body, { where: { NumVille: req.params.id } });
        if (updated) {
            const updatedVille = await Ville.findByPk(req.params.id);
            res.json(updatedVille);
        } else {
            res.status(404).json({ error: 'Ville non trouvée' });
        }
    } catch (error) {
        res.status(500).json({ error: 'Une erreur est survenue' });
    }
};

async deleteVille( req, res ) {
    try {
        const deleted = await Ville.destroy({ where: { NumVille: req.params.id } });
        if (deleted) {
            res.status(204).send();
        } else {
            res.status(404).json({ error: 'Ville non trouvée' });
        }
    } catch (error) {
        res.status(500).json({ error: 'Une erreur est survenue' });
    }
};

}

module.exports = new villeController ();