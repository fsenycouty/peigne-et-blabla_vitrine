// Importation de Sequelize
import { Sequelize } from "sequelize";
// Pour charger les variables d'environnement
import 'dotenv/config';

// Instance de Sequelize
const sequelize = new Sequelize(process.env.DATABASE_URL, {
  // postgres est le dialecte utilisé pour Supabase
  dialect: 'postgres',
  // Nécessaire pour se connecter à Supabase (connexion chiffrée obligatoire)
  dialectOptions: {
    ssl: {
      require: true,
      rejectUnauthorized: false
    }
  },
  // Options de connexions à la BDD
  define: {
    // Désactive les colonnes createdAt et updatedAt
    timestamps: false,
    // Utilise les conventions du snake_case
    underscored: true,
  }
});

export default sequelize;

// Test de la connexion avec la base de donnée (node database/sequelize-client.js)
try {
  // Pour se connecter, l'ORM Sequelize utilise la méthode "authenticate()" qui renvoie une promesse
  await sequelize.authenticate();
  console.log(
    "✅ Connection to the database has been established successfully."
  );
} catch (error) {
  console.error("❌ Unable to connect to the database:", error);
}