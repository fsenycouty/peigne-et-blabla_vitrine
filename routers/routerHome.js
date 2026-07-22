// Router pour la page de Peigne et Blabla

import { Router } from "express";
import homeController from "../controllers/HomeController.js";

const router = Router();

// Route pour la page d'accueil
router.get("/", homeController.home);

export default router;
