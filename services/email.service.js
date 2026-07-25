// Service : construit et envoie l'email de contact via l'API Resend.
import 'dotenv/config';
// Module pour échapper le HTML avant insertion pour éviter les injections HTML/JS dans l'email
import escapeHTML from 'escape-html';
import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY);

export async function emailSend(name, phone, message) {

  const { data, error } = await resend.emails.send({
    from: 'Peigne et Blabla <onboarding@resend.dev>',
    to: process.env.CONTACT_EMAIL_TO,
    subject: `Nouveau contact`,
    html: `<h4>Nom du client : ${name}</h4><h4>Tel : ${phone}</h4><h4>${escapeHTML(message).replace(/\n/g, '<br>')}</h4>`,
  });

  if (error) {
    // Si l'envoi a échoué, déclenche une instance de Error.
    throw new Error(`Échec de l'envoi via Resend : ${error.message}`);
  }
}