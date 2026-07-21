// Router pour la page de Peigne et Blabla

import { Router } from "express";
import HomeController from "../controllers/HomeController.js";

const routerHome = Router();

// Route pour la page d'accueil
routerHome.get("/", HomeController.home);

export default routerHome;
