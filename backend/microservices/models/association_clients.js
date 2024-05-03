
const Societe = require('./societe'); 
const TypeClient = require('./typeClient'); 
const Client = require('./client');

//assocition client

Client.belongsTo(Societe, { foreignKey: 'societe_id', as: 'societe' });
Client.belongsTo(TypeClient, { foreignKey: 'typeclient_id', as: 'typeclient' });
