const Note = require("../models/note");
const DomaineActivite = require('../models/domaineActivite');
const Client = require('../models/client');
const Utilisateur = require("../models/utilisateur");
const Prestataire = require("../models/prestataire");
const Ville = require("../models/ville");
const Product = require("../models/product");
const Societe = require("../models/societe");
const ActionNote = require("../models/actionnote");

const { Op } = require('sequelize');
require("../models/association_note");

class NoteController {
    async createNote(req, res) {
        const { actions, ...noteData } = req.body; // Séparer les données de la note et des actions
        let createdNote;

        try {
            console.log('createNote - noteData:', noteData);

            // Créer la note principale
            createdNote = await Note.create(noteData);

            // Ajouter les actions si fournies
            if (actions && actions.length > 0) {
                const actionPromises = actions.map(action => {
                    return ActionNote.create({
                        idNote: createdNote.IdNote,
                        idUser: action.idUser,
                        dateAction: action.dateAction,
                        description: action.description
                    });
                });

                await Promise.all(actionPromises);
            }

            res.status(201).json(createdNote);
        } catch (error) {
            console.error('createNote - error:', error);

            // En cas d'erreur, supprimer la note créée si elle existe
            if (createdNote) {
                await Note.destroy({ where: { IdNote: createdNote.IdNote } });
            }

            res.status(500).json({ error: 'Une erreur est survenue lors de la création de la note' });
        }
    }

    async getLastId(req, res) {
        try {
            console.log('getLastId - start');
            const lastNote = await Note.findOne({
                attributes: ['IdNote'],
                order: [['IdNote', 'DESC']],
            });
            console.log('getLastId - lastNote:', lastNote);
            res.status(200).json(lastNote);
        } catch (error) {
            console.error('getLastId - error:', error);
            res.status(500).json({ error: 'Une erreur est survenue' });
        }
    }

    async getList(req, res) {
        try {
            const page = req.query.page ? parseInt(req.query.page) : 1;
            const pageSize = req.query.pageSize ? parseInt(req.query.pageSize) : 10;

            const offset = (page - 1) * pageSize;

            const notes = await Note.findAndCountAll({
                include: [
                    { model: Client, as: 'client', attributes: ['nom', 'prenom', 'login'] },
                    { model: Utilisateur, as: 'utilisateur', attributes: ['login'] },
                    { model: Prestataire, as: 'prestataire', attributes: ['nom'] },
                    { model: Product, as: 'product', attributes: ['nom'] },
                    { model: Societe, as: 'societe', attributes: ['nom'] },
                    { model: Ville, as: 'villeNote', attributes: ['nomville'] },
                    { model: DomaineActivite, as: 'domaineActivite', attributes: ['nom'] },
                ],
                order: [['datenote', 'DESC']],
                offset: offset,
                limit: pageSize,
            });

            res.status(200).json(notes);
        } catch (error) {
            console.error('getList - error:', error);
            res.status(500).json({ error: 'Une erreur est survenue' });
        }
    }

    async searchNotes(req, res) {
        try {
             const { ...filters } = req.query;
            const page = parseInt(req.query.page, 10) || 1;
            const limit = parseInt(req.query.pageSize, 10) || 10;
            const offset = (page - 1) * limit;
    
            const whereClause = {};
    
            // Ajouter le filtre de l'état
            if (etat) {
                whereClause.etat = etat === 'En cours' ? etat : { [Op.ne]: 'En cours' };
            }
    
            // Construire la clause WHERE en fonction des filtres
            if (filters.date) {
                whereClause.datenote = {
                    [Op.like]: `%${filters.date}%`
                };
            }
    
            if (filters.societe) {
                whereClause['$societe.nom$'] = {
                    [Op.like]: `%${filters.societe}%`
                };
            }
    
            if (filters.freelance) {
                whereClause['$societe.nom$'] = {
                    [Op.like]: `%${filters.freelance}%`
                };
            }
    
            if (filters.prestataire) {
                whereClause['$prestataire.nom$'] = {
                    [Op.like]: `%${filters.prestataire}%`
                };
            }
    
            if (filters.priorite) {
                whereClause.priorite = {
                    [Op.like]: `%${filters.priorite}%`
                };
            }
    
            if (filters.utilisateur) {
                whereClause['$utilisateur.login$'] = {
                    [Op.like]: `%${filters.utilisateur}%`
                };
            }
    
            if (filters.domaineActivite) {
                whereClause['$domaineActivite.nom$'] = {
                    [Op.like]: `%${filters.domaineActivite}%`
                };
            }
    
            if (filters.contexte) {
                whereClause.contexte = {
                    [Op.like]: `%${filters.contexte}%`
                };
            }
    
            if (filters.login) {
                whereClause['$utilisateur.login$'] = {
                    [Op.like]: `%${filters.login}%`
                };
            }
    
            const notes = await Note.findAndCountAll({
                where: whereClause,
                include: [
                    { model: Client, as: 'client', attributes: ['nom', 'prenom', 'login'] },
                    { model: Utilisateur, as: 'utilisateur', attributes: ['login'] },
                    { model: Prestataire, as: 'prestataire', attributes: ['nom'] },
                    { model: Product, as: 'product', attributes: ['nom'] },
                    { model: Societe, as: 'societe', attributes: ['nom'] },
                    { model: Ville, as: 'villeNote', attributes: ['nomville'] },
                    { model: DomaineActivite, as: 'domaineActivite', attributes: ['nom'] },
                ],
                order: [['datenote', 'DESC']],
                offset: offset,
                limit: limit,
            });
    
            res.status(200).json(notes);
        } catch (error) {
            console.error('searchNotes - error:', error);
            res.status(500).json({ error: 'Une erreur est survenue' });
        }
    }
    

    async getCurrentNotes(req, res) {
        try {
            const page = parseInt(req.query.page, 10) || 1;
            const limit = parseInt(req.query.pageSize, 10) || 10;
            const offset = (page - 1) * limit;
    
            const notes = await Note.findAndCountAll({
                where: { etat: 'En cours' },
                include: [
                    { model: Client, as: 'client', attributes: ['nom', 'prenom', 'login'] },
                    { model: Utilisateur, as: 'utilisateur', attributes: ['login'] },
                    { model: Prestataire, as: 'prestataire', attributes: ['nom'] },
                    { model: Product, as: 'product', attributes: ['nom'] },
                    { model: Societe, as: 'societe', attributes: ['nom'] },
                    { model: Ville, as: 'villeNote', attributes: ['nomville'] },
                    { model: DomaineActivite, as: 'domaineActivite', attributes: ['nom'] },
                ],
                order: [['datenote', 'DESC']],
                offset: offset,
                limit: limit,
            });
    
            res.status(200).json(notes);
        } catch (error) {
            console.error('getCurrentNotes - error:', error);
            res.status(500).json({ error: 'Une erreur est survenue' });
        }
    }
    
    async getFinlizedNotes(req, res) {
        const page = parseInt(req.query.page, 10) || 1;
            const limit = parseInt(req.query.pageSize, 10) || 10;
            const offset = (page - 1) * limit;
        try {
            console.log('getFinlizedNotes - start');
            const { count, rows } = await Note.findAndCountAll({
                where: { etat: { [Op.ne]: 'En cours' } },
                include: [
                    { model: Client, as: 'client', attributes: ['nom', 'prenom', 'login'] },
                    { model: Utilisateur, as: 'utilisateur', attributes: ['login'] },
                    { model: Prestataire, as: 'prestataire', attributes: ['nom'] },
                    { model: Product, as: 'product', attributes: ['nom'] },
                    { model: Societe, as: 'societe', attributes: ['nom'] },
                    { model: Ville, as: 'villeNote', attributes: ['nomville'] },
                    { model: DomaineActivite, as: 'domaineActivite', attributes: ['nom'] },
                ],
                order: [['datenote', 'DESC']],
                offset: offset,
                limit: limit,
            });
    
            console.log('getFinlizedNotes - count:', count);
            console.log('getFinlizedNotes - rows:', rows);
    
            res.status(200).json({ count, rows });
        } catch (error) {
            console.error('getFinlizedNotes - error:', error);
            res.status(500).json({ error: 'Une erreur est survenue' });
        }
    }
    

    async getCurrentNotesBy(req, res) {
        try {
            const { page = 1, pageSize = 10, search, value } = req.query; // Valeurs par défaut: page = 1, pageSize = 10
            const offset = (page - 1) * pageSize;
    
            const whereClause = { etat: 'En cours' };
            if (search && value) {
                whereClause[search] = { [Op.like]: `%${value}%` };
            }
    
            const notes = await Note.findAndCountAll({
                where: whereClause,
                include: [
                    { model: Client, as: 'client', attributes: ['nom', 'prenom', 'login'] },
                    { model: Utilisateur, as: 'utilisateur', attributes: ['login'] },
                    { model: Prestataire, as: 'prestataire', attributes: ['nom'] },
                    { model: Product, as: 'product', attributes: ['nom'] },
                    { model: Societe, as: 'societe', attributes: ['nom'] },
                    { model: Ville, as: 'villeNote', attributes: ['nomville'] },
                    { model: DomaineActivite, as: 'domaineActivite', attributes: ['nom'] },
                ],
                order: [['datenote', 'DESC']],
                offset: offset,
                limit: pageSize,
            });
    
            res.status(200).json(notes);
        } catch (error) {
            console.error('getCurrentNotesBy - error:', error);
            res.status(500).json({ error: 'Une erreur est survenue' });
        }
    }
    
    async getFinlizedNotesBy(req, res) {
        try {
            const { page = 1, pageSize = 10, search, value } = req.query; // Valeurs par défaut: page = 1, pageSize = 10
            const offset = (page - 1) * pageSize;
    
            const whereClause = { etat: { [Op.ne]: 'En cours' } };
            if (search && value) {
                whereClause[search] = { [Op.like]: `%${value}%` };
            }
    
            const notes = await Note.findAndCountAll({
                where: whereClause,
                include: [
                    { model: Client, as: 'client', attributes: ['nom', 'prenom', 'login'] },
                    { model: Utilisateur, as: 'utilisateur', attributes: ['login'] },
                    { model: Prestataire, as: 'prestataire', attributes: ['nom'] },
                    { model: Product, as: 'product', attributes: ['nom'] },
                    { model: Societe, as: 'societe', attributes: ['nom'] },
                    { model: Ville, as: 'villeNote', attributes: ['nomville'] },
                    { model: DomaineActivite, as: 'domaineActivite', attributes: ['nom'] },
                ],
                order: [['datenote', 'DESC']],
                offset: offset,
                limit: pageSize,
            });
    
            res.status(200).json(notes);
        } catch (error) {
            console.error('getFinlizedNotesBy - error:', error);
            res.status(500).json({ error: 'Une erreur est survenue' });
        }
    }
    
    async updateNote(req, res) {
        try {
            const { id } = req.params;
            const { actions, ...noteData } = req.body; // Séparer les données de la note et des actions

            // Mettre à jour la note
            await Note.update(noteData, {
                where: { IdNote: id }
            });

            // Mettre à jour les actions de la note si fournies
            if (actions && actions.length > 0) {
                // Supprimer les anciennes actions associées à la note
                await ActionNote.destroy({
                    where: { idNote: id }
                });

                // Ajouter les nouvelles actions
                const actionPromises = actions.map(action => {
                    return ActionNote.create({
                        idNote: id,
                        idUser: action.idUser,
                        dateAction: action.dateAction,
                        description: action.description
                    });
                });

                await Promise.all(actionPromises);
            }

            res.status(200).json({ message: 'Note mise à jour avec succès' });
        } catch (error) {
            console.error('updateNote - error:', error);
            res.status(500).json({ error: 'Une erreur est survenue lors de la mise à jour de la note' });
        }
    }

    async deleteNote(req, res) {
        try {
            const { id } = req.params;
            await Note.destroy({ where: { IdNote: id } });
            res.status(200).json({ message: 'Note supprimée avec succès' });
        } catch (error) {
            console.error('deleteNote - error:', error);
            res.status(500).json({ error: 'Une erreur est survenue lors de la suppression de la note' });
        }
    }

    async getDetailsNote(req, res) {
        try {
            const { id } = req.params;

            const note = await Note.findByPk(id, {
                include: [
                    { model: Client, as: 'client', attributes: ['nom', 'prenom', 'login'] },
                    { model: Utilisateur, as: 'utilisateur', attributes: ['login'] },
                    { model: Prestataire, as: 'prestataire', attributes: ['nom'] },
                    { model: Product, as: 'product', attributes: ['nom'] },
                    { model: Societe, as: 'societe', attributes: ['nom'] },
                    { model: Ville, as: 'villeNote', attributes: ['nomville'] },
                    { model: DomaineActivite, as: 'domaineActivite', attributes: ['nom'] },
                    { model: ActionNote, as: 'actions' } // Inclure les actions de la note
                ]
            });

            if (!note) {
                res.status(404).json({ error: 'Note non trouvée' });
                return;
            }

            res.status(200).json(note);
        } catch (error) {
            console.error('getDetailsNote - error:', error);
            res.status(500).json({ error: 'Une erreur est survenue lors de la récupération des détails de la note' });
        }
    }
}

module.exports = new NoteController();
