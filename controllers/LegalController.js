// Controller pour les pages légales (mentions légales, politique de confidentialité)
import { editorInfo } from '../config/legal.js';

class LegalController {
  // Contenu statique
  legalNotice = (req, res) => {
    res.render('legal-notice', { editorInfo });
  };

  privacyPolicy = (req, res) => {
    res.render('privacy-policy', { editorInfo });
  };
}

export default new LegalController();