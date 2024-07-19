
const bcrypt = require('bcrypt');
const { Op } = require('sequelize');
const { QueryTypes } = require('sequelize');
const {Sequelize} = require('sequelize');
const sequelize = require('../../config/database.js');

const Utilisateur = require('../models/utilisateur.js');


class UtilisateurController {
  // Créer un nouvel utilisateur avec mot de passe hashé
  async create(req, res) {
    try {
      // Récupérer les données de la requête
      const { nom, prenom, email, role, password } = req.body;

      // Hasher le mot de passe
      const hashedPassword = await bcrypt.hash(password, 10);

      // Créer un nouvel utilisateur avec les données fournies
      const utilisateur = await Utilisateur.create({
        nom,
        prenom,
        email,
        role,
        password: hashedPassword,
        online: 1, // Définir online à 1 lors de la création
        active: 1 // Définir active à 1 lors de la création
      });

      res.status(201).json(utilisateur);
    } catch (err) {
      res.status(500).json({ message: err.message });
    }
  }

  async getAllUser(req, res) {
    try {
        const utilisateurs = await Utilisateur.findAll();
        res.json(utilisateurs);
    } catch (error) {
        res.status(500).json({ error: 'Error fetching utilisateur' });
    }
}

  // Obtenir tous les utilisateurs
  async getAll(req, res) {
    try {
      const page = parseInt(req.query.page) || 1;
      const limit = parseInt(req.query.limit) || 10;
      const offset = (page - 1) * limit;

      const { count, rows } = await Utilisateur.findAndCountAll({
        offset: offset,
        limit: limit,
      });

      const totalPages = Math.ceil(count / limit);

      res.status(200).json({
        totalPages: totalPages,
        currentPage: page,
        utilisateurs: rows,
      });
    } catch (err) {
      res.status(500).json({ message: err.message });
    }
}

  

  // Obtenir un utilisateur par ID
  async getById(req, res) {
    try {
      const utilisateur = await Utilisateur.findByPk(req.params.id);
      res.status(200).json(utilisateur);
    } catch (err) {
      res.status(500).json({ message: err.message });
    }
  }

  // Mettre à jour un utilisateur
  async update(req, res) {
    try {
        // Récupérer les données de la requête
        const { login, email, tel, prenom, nom, role, password, online, active } = req.body;

        // Vérifier si un nouveau mot de passe est fourni
        let updatedData = { login, email, tel, prenom, nom, role, online, active };
        if (password) {
            // Hasher le nouveau mot de passe
            const hashedPassword = await bcrypt.hash(password, 10);
            updatedData.password = hashedPassword;
        } else {
            // Si aucun nouveau mot de passe n'est fourni, ne pas inclure le mot de passe dans les données mises à jour
            delete updatedData.password;
        }

        // Mettre à jour l'utilisateur avec les données mises à jour
        await Utilisateur.update(updatedData, { where: { IdUser: req.params.id } });

        res.status(200).json({ message: 'Utilisateur mis à jour' });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
}



  // Supprimer un utilisateur
  async delete(req, res) {
    try {
      await Utilisateur.destroy({ where: { IdUser: req.params.id } });
      res.status(200).json({ message: 'Utilisateur supprimé' });
    } catch (err) {
      res.status(500).json({ message: err.message });
    }
  }

  // Activer un utilisateur
  async activate(req, res) {
    try {
      await Utilisateur.update({ active: 1 }, { where: { IdUser: req.params.id } });
      res.status(200).json({ message: 'Utilisateur activé' });
    } catch (err) {
      res.status(500).json({ message: err.message });
    }
  }

  // Mettre un utilisateur en ligne
  async setOnline(req, res) {
    try {
      await Utilisateur.update({ online: 1 }, { where: { IdUser: req.params.id } });
      res.status(200).json({ message: 'Utilisateur mis en ligne' });
    } catch (err) {
      res.status(500).json({ message: err.message });
    }
  }

  // Mettre un utilisateur hors ligne
  async setOffline(req, res) {
    try {
      await Utilisateur.update({ online: 0 }, { where: { IdUser: req.params.id } });
      res.status(200).json({ message: 'Utilisateur mis hors ligne' });
    } catch (err) {
      res.status(500).json({ message: err.message });
    }
  }

  // Obtenir un utilisateur par ID
  async getUserById(req, res) {
    try {
      const utilisateur = await Utilisateur.findByPk(req.params.id);
      res.status(200).json(utilisateur);
    } catch (err) {
      res.status(500).json({ message: err.message });
    }
  }

  // Rechercher des utilisateurs
  async searchUsers(req, res) {
    try {
      const page = parseInt(req.query.page) || 0;
      const pageSize = parseInt(req.query.pageSize) || 10;
      const { searchQuery } = req.query;

      const { count, rows } = await Utilisateur.findAndCountAll({
        where: {
          [Op.or]: [
            { nom: { [Op.like]: `%${searchQuery}%` } },
            { prenom: { [Op.like]: `%${searchQuery}%` } },
            { email: { [Op.like]: `%${searchQuery}%` } },
            { role: { [Op.like]: `%${searchQuery}%` } },
            // Ajoutez d'autres champs à rechercher ici selon vos besoins
          ]
        },
        order: [['nom', 'ASC']],
        limit: pageSize,
        offset: page * pageSize,
      });

      res.json({ totalUsers: count, users: rows });
    } catch (error) {
      res.status(500).send(error);
    }
  }
}

module.exports = new UtilisateurController();

