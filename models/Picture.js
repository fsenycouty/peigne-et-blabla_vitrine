// Définition de l'entité Picture pour Sequelize

// Importation la connexion à la base de données avec Sequelize
import sequelize from '../database/sequelize-client.js';
// Importation de DataTypes pour définir les types de données des colonnes
import { DataTypes } from 'sequelize';

const Picture = sequelize.define("Picture", {
  url: {
    type: DataTypes.TEXT,
    allowNull: false,
  }
}, 
{
  tableName: "pictures",
});

export default Picture;