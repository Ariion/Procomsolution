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

  // Projet Firebase « procom-solution ». Ces clés identifient le projet et
  // n'ouvrent aucun droit : ce sont les règles Firestore qui protègent la
  // base. Elles sont donc publiques par conception.
  backend: 'firebase',
  firebase: {
    apiKey: 'AIzaSyB5C9yqjC0jMcnEQwmGus8X5_F5qkXlDno',
    authDomain: 'procom-solution.firebaseapp.com',
    projectId: 'procom-solution',
    storageBucket: 'procom-solution.firebasestorage.app',
    appId: '1:160726685039:web:d6b6bc43f4d8c1ac8c849a',
  },

  lang: 'fr',
  debug: false,

  // Types de contenu.
  //
  // Sur la page Articles, le panneau Éléments ouvre une rubrique « Articles »
  // avec ces quatre formes. Un clic demande le titre, copie la page modèle,
  // pose la carte en tête de galerie et ouvre la page à écrire — Audrey n'a
  // jamais à savoir qu'elle crée un fichier.
  //
  // Les modèles sont de vraies pages du site, dans modeles/, servies en
  // noindex. Les modifier revient à changer la trame de tous les futurs
  // articles de ce type.
  types: [
    {
      id: 'article',
      nom: 'Articles',
      index: 'portfolio.html',
      collection: '.articles-grid',
      sousTypes: [
        { id: 'interview', nom: 'Interview', icone: 'text', modele: 'modeles/interview.html' },
        { id: 'portrait', nom: 'Portrait', icone: 'image', modele: 'modeles/portrait.html' },
        { id: 'conseil', nom: 'Conseil', icone: 'list', modele: 'modeles/conseil.html' },
        { id: 'actualite', nom: 'Actualité', icone: 'template', modele: 'modeles/actualite.html' },
      ],
    },
  ],

  // Couleurs proposées quand on colore un mot dans un texte. Ce sont celles
  // du site : mieux vaut six teintes justes qu'un sélecteur libre, qui laisse
  // poser du jaune fluo sur un titre.
  texte: {
    couleurs: ['#112338', '#509ea4', '#3a5068', '#6b8a9a', '#b3261e', '#1d7a3e'],
  },

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
  // Vercel n'a ni PHP ni disque inscriptible : admin-endpoint.php ne peut pas
  // y tourner. api/admin-endpoint.js en reprend le contrat et écrit dans le
  // dépôt GitHub — le push relance le déploiement, la page est en ligne une
  // trentaine de secondes plus tard.
  //
  // Demande quatre variables d'environnement côté Vercel : GITHUB_TOKEN,
  // GITHUB_REPO, FIREBASE_PROJECT_ID et SITE_ID. Voir le README.
  host: { endpoint: '/api/admin-endpoint' },

  media: {
    // 'firebase'  → Firebase Storage (demande le plan Blaze)
    // 'endpoint'  → dossier du site (demande l'endpoint ci-dessus)
    // 'url'       → aucun téléversement : la bibliothèque se remplit par adresse
    adapter: 'url',
  },
};
