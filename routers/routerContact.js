// Router pour le formulaire de contact de Peigne et Blabla

import { Router } from "express";
import contactController from "../controllers/ContactController.js";
import { validForm } from "../middlewares/validForm.js";

const router = Router();

// Route pour récupérer les données du formulaire
router.post("/", validForm, contactController.form);

export default router;