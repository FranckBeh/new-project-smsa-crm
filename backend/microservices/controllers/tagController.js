const Tag = require('../models/tag');
const { Op, fn, col, literal, QueryTypes } = require('sequelize');
const sequelize = require('../../config/database');
const { Sequelize } = require('sequelize');

class tagController {

 async getAllTags (req, res) {
    try {
        const tags = await Tag.findAll();
        res.json(tags);
    } catch (error) {
        res.status(500).json({ error: 'Une erreur est survenue' });
    }
};

 async getTagById (req, res) {
    try {
        const tag = await Tag.findByPk(req.params.id);
        if (tag) {
            res.json(tag);
        } else {
            res.status(404).json({ error: 'Tag non trouvé' });
        }
    } catch (error) {
        res.status(500).json({ error: 'Une erreur est survenue' });
    }
};

 async createTag (req, res) {
    try {
        const tag = await Tag.create(req.body);
        res.status(201).json(tag);
    } catch (error) {
        res.status(500).json({ error: 'Une erreur est survenue' });
    }
};

 async updateTag (req, res) {
    try {
        const [updated] = await Tag.update(req.body, { where: { idTag: req.params.id } });
        if (updated) {
            const updatedTag = await Tag.findByPk(req.params.id);
            res.json(updatedTag);
        } else {
            res.status(404).json({ error: 'Tag non trouvé' });
        }
    } catch (error) {
        res.status(500).json({ error: 'Une erreur est survenue' });
    }
};

 async deleteTag (req, res) {
    try {
        const deleted = await Tag.destroy({ where: { idTag: req.params.id } });
        if (deleted) {
            res.status(204).send();
        } else {
            res.status(404).json({ error: 'Tag non trouvé' });
        }
    } catch (error) {
        res.status(500).json({ error: 'Une erreur est survenue' });
    }
};

}

module.exports = new tagController();