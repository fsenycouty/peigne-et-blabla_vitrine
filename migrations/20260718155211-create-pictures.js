'use strict';

/**
 * Migration : création de la table "pictures" (galerie avant/après).
 * Traduction exécutable du MPD validé (docs/conception/bdd/MPD.sql).
 * @type {import('sequelize-cli').Migration}
 */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('pictures', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER,
      },
      before_url: {
        type: Sequelize.TEXT,
        allowNull: false,
      },
      before_public_id: {
        type: Sequelize.TEXT,
        allowNull: false,
      },
      after_url: {
        type: Sequelize.TEXT,
        allowNull: false,
      },
      after_public_id: {
        type: Sequelize.TEXT,
        allowNull: false,
      },
      position: {
        type: Sequelize.INTEGER,
        allowNull: false,
        defaultValue: 0,
      },
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('pictures');
  },
};