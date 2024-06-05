
const Societe = require('./societe'); 
const TypeClient = require('./typeClient'); 
const Conjoint = require('./conjoint');
const Enfant = require('./enfant');
const Client = require('./client');

// Associations entre Client et Societe
Client.belongsTo(Societe, { foreignKey: 'societe_id', as: 'societe' });

// Associations entre Client et TypeClient
Client.belongsTo(TypeClient, { foreignKey: 'typeclient_id', as: 'typeclient' });

// Associations entre Client et Conjoint
Client.hasOne(Conjoint, { foreignKey: 'IdClient', as: 'conjoint' });
Conjoint.belongsTo(Client, { foreignKey: 'IdClient', as: 'client' });

// Associations entre Client et Enfant
Client.hasMany(Enfant, { foreignKey: 'IdClient', as: 'enfants' });
Enfant.belongsTo(Client, { foreignKey: 'IdClient', as: 'client' });