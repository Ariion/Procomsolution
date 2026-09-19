/**
 * Module Admin — configuration du site procomsolution.fr
 *
 * Ce fichier est servi à TOUS les visiteurs. N'y mettez jamais de secret :
 * les clés Firebase ci-dessous sont publiques par conception (c'est le rôle
 * des règles Firestore de protéger l'écriture), mais une clé d'API facturée
 * — rédaction assistée, par exemple — n'a rien à faire ici.
 *
 * Ouvrir l'éditeur : https://procomsolution.fr/?admin
 */
window.ADMIN_CONFIG = {
  siteId: 'procomsolution',

  // ─────────────────────────────────────────────────────────────────────
  // À RENSEIGNER : console Firebase → Paramètres du projet → Vos applications
  // Tant que ces clés sont vides, le site s'affiche normalement (le contenu
  // est dans le HTML) mais l'édition reste indisponible.
  // ─────────────────────────────────────────────────────────────────────
  backend: 'firebase',
  firebase: {
    apiKey: '',
    authDomain: '',
    projectId: '',
    storageBucket: '',
    appId: '',
  },

  lang: 'fr',
  debug: false,

  scan: {
    // Le menu, le pied de page et le formulaire restent pilotés par le code :
    // les rendre éditables exposerait Audrey à casser la navigation du site.
    exclude: [
      '#nav-links-desktop',
      '#mobileMenu',
      '.hamburger',
      '#footer-nav',
      '#contactForm',
      '.carousel-controls',
      '.filter-btn',
      '[data-admin-script]',
    ],
  },

  // Réécriture du fichier .html à chaque publication.
  //
  // Vercel n'a ni PHP ni disque inscriptible : tools/admin-endpoint.php ne
  // peut pas y tourner. Sans endpoint, le contenu publié vit dans Firestore
  // et n'est appliqué que côté navigateur — donc invisible pour Google.
  //
  // Pour retrouver le HTML régénéré, porter admin-endpoint.php en fonction
  // Vercel (/api/admin-endpoint) qui écrit dans le dépôt GitHub. Le contrat
  // est court : actions `source`, `page`, `create`, `config`.
  // host: { endpoint: '/api/admin-endpoint' },

  media: {
    // 'firebase'  → Firebase Storage (demande le plan Blaze)
    // 'endpoint'  → dossier du site (demande l'endpoint ci-dessus)
    // 'url'       → aucun téléversement : la bibliothèque se remplit par adresse
    adapter: 'url',
  },
};
