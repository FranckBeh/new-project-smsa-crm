// associations.js
const Prestataire = require('./prestataire');
const Ville = require('./ville');
const DomaineActivite = require('./domaineActivite');
const Note = require('./note');
const ListDomPres = require('./listDomPres');
const ListTagPres = require('./listTagPres');
const Tag = require('./tag');
const Document = require('./document');
const AutresPrest = require('./autresPrest');

// Définition des associations

// Prestataire associations
Prestataire.belongsTo(Ville, { foreignKey: 'ville', as: 'villeAssociation' });
Prestataire.hasMany(Note, { foreignKey: 'IdPrest', as: 'notes' });
Prestataire.hasMany(Note, { foreignKey: 'idprest' });
Prestataire.belongsToMany(DomaineActivite, { through: ListDomPres, foreignKey: 'IdPrest', as: 'domainesActivite' });
Prestataire.belongsToMany(Tag, { through: ListTagPres, foreignKey: 'IdPrest', as: 'tags' });
Prestataire.hasMany(Document, { foreignKey: 'IdPrest', as: 'documents' });
Prestataire.hasMany(AutresPrest, { foreignKey: 'IdPrest', as: 'autresPrest' });

// Ville associations
Ville.hasMany(Prestataire, { foreignKey: 'ville', as: 'prestataires' });

// DomaineActivite associations
DomaineActivite.belongsToMany(Prestataire, { through: ListDomPres, foreignKey: 'iddomaine', as: 'prestataires' });

// Tag associations
Tag.belongsToMany(Prestataire, { through: ListTagPres, foreignKey: 'idTag', as: 'prestataires' });

// Document associations
Document.belongsTo(Prestataire, { foreignKey: 'idprest', as: 'prestataire' });

// AutresPrest associations
AutresPrest.belongsTo(Prestataire, { foreignKey: 'idprest', as: 'prestataire' });