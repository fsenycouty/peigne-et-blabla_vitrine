// Définition de l'entité Picture pour Sequelize

// Importation la connexion à la base de données avec Sequelize
import sequelize from '../database/sequelize-client.js';
// Importation de DataTypes pour définir les types de données des colonnes
import { DataTypes } from 'sequelize';

const Picture = sequelize.define("Picture", {
  beforeUrl: {
    type: DataTypes.TEXT,
    allowNull: false,
  },
  beforePublicId: {
    type: DataTypes.TEXT,
    allowNull: false,
  },
  afterUrl: {
    type: DataTypes.TEXT,
    allowNull: false,
  },
  afterPublicId: {
    type: DataTypes.TEXT,
    allowNull: false,
  },
  position: {
    type: DataTypes.INTEGER,
    allowNull: false,
    defaultValue: 0,
  },
}, {
  tableName: "pictures",
});

export default Picture;