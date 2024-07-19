const Note = require('../models/note');
const Client = require('../models/client');
const Prestataire = require('../models/prestataire');
const Utilisateur = require('../models/utilisateur');
const Product = require('../models/product');
const Societe = require('../models/societe');
const Ville = require('../models/ville');
const DomaineActivite = require('../models/domaineActivite');
const ActionNote = require('../models/actionnote');

// Associations
Note.belongsTo(Client, { foreignKey: 'IdClient', as: 'client' });
Note.belongsTo(Prestataire, { foreignKey: 'IdPrest', as: 'prestataire' });
Note.belongsTo(Utilisateur, { foreignKey: 'idUser', as: 'utilisateur' });
Note.belongsTo(Product, { foreignKey: 'IdProd', as: 'product' });
Note.belongsTo(Societe, { foreignKey: 'IdFree', as: 'societe' });
Note.belongsTo(Ville, { foreignKey: 'ville', as: 'villeNote' });
Note.belongsTo(DomaineActivite, { foreignKey: 'domaine', as: 'domaineActivite' });
Note.hasMany(ActionNote, { foreignKey: 'idNote', as: 'actions' });

// Relation many-to-many entre Note et Utilisateur via ActionNote
Note.belongsToMany(Utilisateur, { through: ActionNote, foreignKey: 'idNote', as: 'utilisateurs' });
Utilisateur.belongsToMany(Note, { through: ActionNote, foreignKey: 'idUser', as: 'notes' });
