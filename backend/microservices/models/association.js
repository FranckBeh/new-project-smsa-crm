const Invoice = require('./invoice');
const Societe = require('./societe');
const Listinvart = require('./listinvart');
const Utilisateur = require('./utilisateur');
const ParametreCompanie = require('./companie');

Invoice.belongsTo(Societe, { foreignKey: 'idSociete', as: 'societe' });
Invoice.hasMany(Listinvart, { foreignKey: 'idInv', as: 'listinvart' });
Invoice.belongsTo(Utilisateur, { foreignKey: 'idUser', as: 'utilisateur' });

Listinvart.belongsTo(Invoice, { foreignKey: 'idInv', as: 'invoice' });

// Après la définition des modèles Invoice et ParametreCompanie
Invoice.belongsTo(ParametreCompanie, { foreignKey: 'major', as: 'parametreCompanie' });


//assocition client

//Client.belongsTo(Societe, { foreignKey: 'societe_id', as: 'societe' });
//Client.belongsTo(TypeClient, { foreignKey: 'typeclient_id', as: 'typeclient' });
