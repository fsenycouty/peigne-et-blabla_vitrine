// Router pour les pages mentions légales et politique de confidentialité

import { Router } from "express";
import legalController from "../controllers/LegalController.js";

const router = Router();

// Route pour la page mentions légales
router.get("/legal-notice", legalController.legalNotice);
router.get("/privacy-policy", legalController.privacyPolicy);

export default router;
