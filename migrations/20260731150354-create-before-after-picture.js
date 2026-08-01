// migrations/20260731150354-create-before-after-picture.js

'use strict';

// Migration : création de la table "before_after_pictures" (entité BEFORE_AFTER_PICTURE).
// Une ligne = une paire, reliée à deux lignes de "pictures" via deux clés étrangères
// distinctes (rôle "avant" / rôle "après"). À exécuter APRÈS create-picture.

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  /**
   * Applique la migration : crée la table "before_after_pictures"
   * avec ses deux clés étrangères vers "pictures".
   * @param {import('sequelize').QueryInterface} queryInterface
   * @param {import('sequelize').Sequelize} Sequelize
   */
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('before_after_pictures', {
      id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      position: {
        type: Sequelize.INTEGER,
        allowNull: false,
        defaultValue: 0,
      },
      before_picture_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: 'pictures',
          key: 'id',
        },
        onDelete: 'RESTRICT',
        onUpdate: 'CASCADE',
      },
      after_picture_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: 'pictures',
          key: 'id',
        },
        onDelete: 'RESTRICT',
        onUpdate: 'CASCADE',
      },
    });
  },

  /**
   * Annule la migration : supprime la table "before_after_pictures".
   * @param {import('sequelize').QueryInterface} queryInterface
   */
  async down(queryInterface) {
    await queryInterface.dropTable('before_after_pictures');
  },
};