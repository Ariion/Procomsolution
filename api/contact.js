/**
 * contact — réception du formulaire de contact.
 *
 * Le site avait deux formulaires, et aucun des deux n'envoyait quoi que ce
 * soit. Celui de l'accueil n'avait aucun gestionnaire : « Envoyer » rechargeait
 * la page. Celui de la barre latérale, présent sur dix-huit pages, affichait
 * « ✅ Envoyé ! » puis se vidait — sans rien transmettre. Un visiteur croyait
 * avoir écrit, et n'avait jamais de réponse.
 *
 *   POST  {prenom, nom, email, sujet, message, page}  → {envoye: true}
 *
 * L'envoi passe par un fournisseur d'e-mail, choisi par la variable
 * d'environnement présente. Aucun n'est imposé :
 *
 *   RESEND_API_KEY   https://resend.com — gratuit jusqu'à 3 000 envois/mois
 *   BREVO_API_KEY    https://brevo.com  — gratuit jusqu'à 300 envois/jour
 *
 *   CONTACT_TO       destinataire        (défaut : procomsolution23@gmail.com)
 *   CONTACT_FROM     expéditeur technique, sur un domaine vérifié chez le
 *                    fournisseur        (défaut : onboarding@resend.dev)
 *
 * Tant qu'aucune clé n'est posée, l'endpoint répond 503 avec un message clair.
 * La page le comprend et bascule sur le client de messagerie du visiteur, tout
 * pré-rempli : on perd le confort, jamais le message.
 */

const DESTINATAIRE = process.env.CONTACT_TO || 'procomsolution23@gmail.com';
const EXPEDITEUR = process.env.CONTACT_FROM || 'onboarding@resend.dev';
const MAX = { court: 120, long: 4000 };

/** Coupe, nettoie, et refuse ce qui n'a pas sa place dans un en-tête d'e-mail. */
function texte(valeur, max) {
  return String(valeur ?? '').replace(/[\r\n]+/g, ' ').trim().slice(0, max);
}

function echapper(v) {
  return String(v ?? '').replace(/[&<>"]/g, (c) => (
    { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));
}

const EMAIL = /^[^\s@]+@[^\s@]+\.[a-z]{2,}$/i;

async function envoyerParResend(sujet, html, repondreA) {
  const reponse = await fetch('https://api.resend.com/emails', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${process.env.RESEND_API_KEY}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      from: `Procom Solution <${EXPEDITEUR}>`,
      to: [DESTINATAIRE],
      reply_to: repondreA,
      subject: sujet,
      html,
    }),
  });
  if (!reponse.ok) throw new Error(`Resend : ${reponse.status} ${(await reponse.text()).slice(0, 180)}`);
}

async function envoyerParBrevo(sujet, html, repondreA, nom) {
  const reponse = await fetch('https://api.brevo.com/v3/smtp/email', {
    method: 'POST',
    headers: { 'api-key': process.env.BREVO_API_KEY, 'Content-Type': 'application/json' },
    body: JSON.stringify({
      sender: { name: 'Procom Solution', email: EXPEDITEUR },
      to: [{ email: DESTINATAIRE }],
      replyTo: { email: repondreA, name: nom },
      subject: sujet,
      htmlContent: html,
    }),
  });
  if (!reponse.ok) throw new Error(`Brevo : ${reponse.status} ${(await reponse.text()).slice(0, 180)}`);
}

module.exports = async function handler(req, res) {
  res.setHeader('Cache-Control', 'no-store');
  if (req.method === 'OPTIONS') return res.status(204).end();
  if (req.method !== 'POST') return res.status(405).json({ error: 'Méthode non autorisée.' });

  const corps = typeof req.body === 'string' ? JSON.parse(req.body || '{}') : (req.body || {});

  // Piège à robots : un champ caché qu'un humain ne remplit jamais. On répond
  // comme si tout allait bien — inutile de renseigner le robot sur sa chute.
  if (texte(corps.site, 20)) return res.status(200).json({ envoye: true });

  const prenom = texte(corps.prenom, MAX.court);
  const nom = texte(corps.nom, MAX.court);
  const email = texte(corps.email, MAX.court);
  const sujet = texte(corps.sujet, MAX.court) || 'Message depuis le site';
  const message = String(corps.message ?? '').trim().slice(0, MAX.long);
  const page = texte(corps.page, 200);

  if (!email || !EMAIL.test(email)) return res.status(400).json({ error: 'Adresse e-mail invalide.' });
  if (!message) return res.status(400).json({ error: 'Le message est vide.' });

  const expediteur = [prenom, nom].filter(Boolean).join(' ') || email;
  const html = `
    <p><strong>${echapper(expediteur)}</strong> &lt;${echapper(email)}&gt;</p>
    <p><em>Sujet :</em> ${echapper(sujet)}</p>
    <hr>
    <p style="white-space:pre-wrap">${echapper(message)}</p>
    ${page ? `<hr><p style="color:#888;font-size:12px">Envoyé depuis ${echapper(page)}</p>` : ''}`;

  try {
    if (process.env.RESEND_API_KEY) {
      await envoyerParResend(`[Site] ${sujet} — ${expediteur}`, html, email);
    } else if (process.env.BREVO_API_KEY) {
      await envoyerParBrevo(`[Site] ${sujet} — ${expediteur}`, html, email, expediteur);
    } else {
      // Rien n'est configuré. On le dit franchement : la page sait alors
      // basculer sur le client de messagerie du visiteur.
      return res.status(503).json({
        error: 'Envoi non configuré.',
        repli: 'mailto',
        destinataire: DESTINATAIRE,
      });
    }
    return res.status(200).json({ envoye: true });
  } catch (err) {
    console.error('[contact]', err);
    return res.status(502).json({
      error: "Le message n'a pas pu être envoyé.",
      repli: 'mailto',
      destinataire: DESTINATAIRE,
    });
  }
};
