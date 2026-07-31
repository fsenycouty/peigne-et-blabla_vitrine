// Définition de l'entité Before_After_Picutre pour Sequelize

// Importation la connexion à la base de données avec Sequelize
import sequelize from '../database/sequelize-client.js';
// Importation de DataTypes pour définir les types de données des colonnes
import { DataTypes } from 'sequelize';

const BeforeAfterPicture = sequelize.define("BeforeAfterPicture", {
  position: {
    type: DataTypes.INTEGER,
    allowNull: false,
    defaultValue: 0,
  }
},
{
  tableName: "beforeAfterPictures",
});

export default BeforeAfterPicture;