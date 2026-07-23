// Service : construit et envoie l'email de contact via l'API Resend.

import 'dotenv/config';
import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY);


export async function emailSend(name, phone, message) {

  const { data, error } = await resend.emails.send({
    from: 'Peigne et Blabla <onboarding@resend.dev>',
    to: process.env.CONTACT_EMAIL_TO,
    subject: `Nouveau contact`,
    html: `<h4>Nom du client : ${name}</h4><h4>Tel : ${phone}</h4><h4>${message}</h4>`,
  });

  if (error) {
    // Si l'envoi a échoué, déclanche une instance erreur.
    throw new Error(`Échec de l'envoi via Resend : ${error.message}`);
  }

  console.log({ data });
}