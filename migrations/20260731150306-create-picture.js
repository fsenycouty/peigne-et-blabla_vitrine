// migrations/20260731150306-create-picture.js

'use strict';

// Migration : création de la table "pictures" (entité PICTURE du MCD/MLD).
// Une ligne = une photo (avant OU après), jamais les deux à la fois.
// Note : ce fichier reste en CommonJS (module.exports), pas en ESM, car
// sequelize-cli charge les migrations avec require() — voir migrations/package.json.

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  /**
   * Applique la migration : crée la table "pictures".
   * @param {import('sequelize').QueryInterface} queryInterface
   * @param {import('sequelize').Sequelize} Sequelize
   */
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('pictures', {
      id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      url: {
        type: Sequelize.TEXT,
        allowNull: false,
      },
    });
  },

  /**
   * Annule la migration : supprime la table "pictures".
   * @param {import('sequelize').QueryInterface} queryInterface
   */
  async down(queryInterface) {
    await queryInterface.dropTable('pictures');
  },
};