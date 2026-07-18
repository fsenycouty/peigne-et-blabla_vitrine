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

// test de la connexion à la base de données
sequelize.authenticate()
  .then(() => console.log('Connexion à Supabase réussie ✅'))
  .catch((err) => console.error('Erreur de connexion :', err));