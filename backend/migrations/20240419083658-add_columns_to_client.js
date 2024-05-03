'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {

    await queryInterface.addColumn('client', 'adressePerso', {
      type: Sequelize.STRING,
      allowNull: true
    });

    await queryInterface.addColumn('client', 'adressePro', {
      type: Sequelize.STRING,
      allowNull: true
    });
    await queryInterface.addColumn('client', 'fixePerso', {
      type: Sequelize.STRING,
      allowNull: true
    });
    
    await queryInterface.addColumn('client', 'fixePro', {
      type: Sequelize.STRING,
      allowNull: true
    });
    
    await queryInterface.addColumn('client', 'gsmPerso', {
      type: Sequelize.STRING,
      allowNull: true
    });
    
    await queryInterface.addColumn('client', 'gsmPro', {
      type: Sequelize.STRING,
      allowNull: true
    });
    
    await queryInterface.addColumn('client', 'mailPerso', {
      type: Sequelize.STRING,
      allowNull: true
    });
    
    await queryInterface.addColumn('client', 'mailPro', {
      type: Sequelize.STRING,
      allowNull: true
    });
  },
  

  async down (queryInterface, Sequelize) {
    /**
     * Add reverting commands here.
     *
     * Example:
     * await queryInterface.dropTable('users');
     */
  }
};
