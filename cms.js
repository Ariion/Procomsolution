/* ═══════════════════════════════════════════════
   PROCOM CMS — Moteur central v2
   Clé localStorage unique : "procom_data"
   site.js lit depuis cette même clé.
═══════════════════════════════════════════════ */

const CMS = (() => {

  const DEFAULTS = {
    meta: {
      title: "Procom Solution – Community Manager Audiologie",
      description: "Communication digitale sur mesure pour les audioprothésistes indépendants.",
      keywords: "community manager, audiologie, réseaux sociaux",
      author: "Audrey Duval-Lebret"
    },
    colors: {
      turquoise: "#509ea4", navy: "#112338", white: "#ffffff",
      lightBg: "#f4f8f9", textDark: "#112338", textMid: "#3a5068", textLight: "#6b8a9a"
    },
    nav: {
      logo: "assets/logo-long.png", logoAlt: "Procom Solution",
      links: [
        { label: "Nos offres",  href: "#offres" },
        { label: "À propos",    href: "#apropos" },
        { label: "Témoignages", href: "#temoignages" },
        { label: "Articles",    href: "portfolio.html" },
        { label: "Ressources",  href: "ressources.html" }
      ],
      ctaText: "Prendre RDV", ctaHref: "#contact"
    },
    hero: {
      badge: "🎧 Community Manager Audiologie",
      title: "Booste ta", titleSpan: "patientèle", titleEnd: "dès aujourd'hui",
      subtitle: "Communication digitale sur mesure pour les audioprothésistes indépendants. Fidélise tes patients et génère de nouveaux rendez-vous grâce à une com qui te ressemble.",
      btn1Text: "Prendre rendez-vous", btn1Href: "#contact",
      btn2Text: "Découvrir les offres", btn2Href: "#offres",
      image: "assets/Audrey-01.png", imageAlt: "Audrey – Community Manager Audiologie",
      tagEmoji: "🎧", tagTitle: "Ton oreille attentive", tagSub: "Communication éthique & personnalisée",
      stats: [
        { value: "15+",  label: "Ans d'expérience\nrelation client" },
        { value: "5",    label: "Années dans\nle paramédical" },
        { value: "100%", label: "Spécialisée\naudiologie" }
      ]
    },
    offres: {
      sectionLabel: "Nos offres",
      title: "La solution adaptée\nà tes besoins",
      subtitle: "Des formules pensées pour les audioprothésistes indépendants, de la création de contenu à la gestion complète de ta communication.",
      items: [
        { id:"starter", icon:"🚀", tag:"Starter", title:"Ear Me Up", desc:"LE kit pour démarrer ton activité sur les réseaux sociaux.", features:["Kit de démarrage réseaux sociaux","Visuels personnalisés à tes couleurs","Templates prêts à l'emploi","Guide de publication"], btnText:"En savoir plus", btnLink:"#contact", btnStyle:"outline", featured:false, badge:"" },
        { id:"mesure", icon:"✨", tag:"Sur mesure", title:"Ta com sur mesure", desc:"Une communication 100% personnalisée, unique et éthique.", features:["Stratégie de contenu personnalisée","Création & publication de posts","Gestion des réseaux sociaux","Reporting mensuel","Accompagnement dédié"], btnText:"Prendre RDV", btnLink:"#contact", btnStyle:"primary", featured:true, badge:"✨ Recommandé" },
        { id:"contenu", icon:"🎨", tag:"Contenu", title:"Visuels & Articles", desc:"Création de visuels professionnels et rédaction d'articles.", features:["Bannières LinkedIn & réseaux","Infographies patients","Articles de blog","Fiches conseils"], btnText:"En savoir plus", btnLink:"#contact", btnStyle:"outline", featured:false, badge:"" }
      ]
    },
    apropos: {
      sectionLabel: "Qui suis-je ?",
      title: "La community manager\nspécialisée dans l'audiologie",
      content: [
        "Assistante audioprothésiste pendant 3 ans, je me suis reconvertie comme Community Manager spécialisée dans l'audiologie en ayant constaté un réel besoin de la part des patients et un manque important de communication dans ce secteur.",
        "Plus de 15 ans d'expérience en relation client et 5 années dans le paramédical font de moi <strong>ton oreille attentive</strong> et ton alliée pour une communication au plus près de ton patient et de tes valeurs."
      ],
      image: "assets/Audrey-01.png", imageAlt: "Audrey Duval-Lebret",
      tags: ["Audiologie","Community Management","Relation patient","Communication éthique","Paramédical"],
      btnText: "Travaillons ensemble", btnHref: "#contact"
    },
    temoignages: {
      sectionLabel: "Témoignages", title: "Ceux qui en parlent le mieux",
      googleNote: "5.0 / 5", googleCount: "2",
      linkedinHref: "https://www.linkedin.com/in/audrey-duval-lebret/details/recommendations/",
      items: [
        { id:"t1", initials:"NS", name:"Nahman Sroussi",   role:"Audioprothésiste – Audition Lefeuvre · Jan. 2024",  stars:5, text:"Audrey m'a proposé plusieurs visuels répondant à mes demandes et le tout avec un délai record. Talentueuse et professionnelle, je recommande." },
        { id:"t2", initials:"TM", name:"Tifheret Mamou",   role:"Audioprothésiste D.E. · Mars 2024",                 stars:5, text:"Audrey a réalisé une superbe bannière pour mon profil LinkedIn. Je trouve que ça met en valeur ma vision des choses ! Merci beaucoup !" },
        { id:"t3", initials:"LB", name:"Léa Besnainou",    role:"Étudiante Audioprothésiste · Mars 2024",            stars:5, text:"Audrey a réalisé ma bannière LinkedIn. Elle a été très à l'écoute de mes demandes et très réactive. Je recommande son travail." },
        { id:"t4", initials:"BQ", name:"Benoit Quinette",  role:"Google Review · Juil. 2024",                        stars:5, text:"Efficacité, réactivité, très professionnel. On recommande." },
        { id:"t5", initials:"DT", name:"Damien Tomasella", role:"Google Review · Juil. 2024",                        stars:5, text:"Toujours impliquée, Audrey sait comment communiquer avec une équipe de 9 personnes. Elle a de très bonnes idées et sait mettre en avant nos entreprises." }
      ]
    },
    ressources: {
      sectionLabel: "Ressources gratuites",
      title: "Guides & fiches pratiques\nofferts par Audrey",
      subtitle: "Des ressources concrètes pour mieux comprendre l'audiologie et développer ta communication. Téléchargement libre, sans inscription.",
      items: [
        { id:"r1", image:"assets/ressource-mini-fiches.jpg",        badge:"📄 PDF Gratuit", title:"Collection Mini Fiches – Vocabulaire Audiologie",    desc:"Toutes les définitions essentielles pour parler audiologie avec tes patients sans jargon inaccessible.", file:"assets/mini-fiches-vocabulaire.pdf" },
        { id:"r2", image:"assets/ressource-briser-silence.jpg",     badge:"📄 PDF Gratuit", title:"Briser le Silence – Comprendre la presbyacousie",     desc:"Un guide complet pour accompagner tes patients et leur entourage face à la perte auditive liée à l'âge.", file:"assets/briser-le-silence.pdf" },
        { id:"r3", image:"assets/ressource-synaptopathie.jpg",      badge:"📄 PDF Gratuit", title:"Synaptopathie cochléaire ou Surdité cachée",          desc:"Tout comprendre sur cette pathologie encore méconnue.", file:"assets/synaptopathie-cochleaire.pdf" },
        { id:"r4", image:"assets/ressource-cholesteatome.jpg",      badge:"📄 PDF Gratuit", title:"Le Cholestéatome – Ce qu'il faut savoir",            desc:"Fiche pratique pour expliquer simplement cette pathologie à tes patients.", file:"assets/cholesteatome.pdf" },
        { id:"r5", image:"assets/ressource-google-my-business.jpg", badge:"📄 PDF Gratuit", title:"Mini Guide – Booster ta fiche Google My Business",   desc:"Les étapes concrètes pour optimiser ta visibilité locale.", file:"assets/guide-google-my-business.pdf" }
      ]
    },
    articles: {
      sectionLabel: "Articles", title: "Ressources & conseils",
      items: [
        { id:"a1", category:"interview", categoryLabel:"Interview", date:"2025-05-01", dateLabel:"Mai 2025", author:"Audrey Duval-Lebret", readTime:"6 min", image:"", title:"Entretien avec Xavier CARRIOU – Fondateur d'Acouphénia", excerpt:"\"J'invente le futur.\" Rencontre avec le fondateur d'Acouphénia, pionnier de la prise en charge des acouphènes en France.", tags:["acouphènes","interview","audiologie"], content:`<div class="highlight-box"><p>"J'invente le futur." — Xavier CARRIOU</p></div><h2>L'homme derrière la vision</h2><p>Très tôt dans sa carrière, Xavier CARRIOU a été frappé par le désarroi de patients souffrant d'acouphènes pour lesquels la médecine classique apportait peu ou pas de solutions. Cela lui a donné une profonde envie d'agir concrètement.</p><div class="article-cta"><h3>Tu veux en savoir plus ?</h3><p>Découvre toutes les ressources sur l'audiologie</p><a href="ressources.html" class="btn-cta">Voir les ressources →</a></div>` },
        { id:"a2", category:"interview", categoryLabel:"Interview", date:"2025-02-10", dateLabel:"Fév. 2025", author:"Audrey Duval-Lebret", readTime:"7 min", image:"assets/azdine-ezzahti.jpg", title:"Entretien avec Azdine Ezzahti – L'audioprothésiste qui casse les codes", excerpt:"\"Je ne suis pas tombé dans l'audiologie par hasard, mais presque.\" Un parcours hors du commun.", tags:["audioprothésiste","interview"], content:`<div class="highlight-box"><p>"Je ne suis pas tombé dans l'audiologie par hasard, mais presque." — Azdine Ezzahti</p></div><h2>Un métier où rigueur et passion se rencontrent</h2><p>Après plus de dix ans dans le domaine, ce qui l'anime toujours : apprendre et se sentir utile.</p><div class="article-cta"><h3>Envie d'échanger ?</h3><p>Contacte Audrey</p><a href="index.html#contact" class="btn-cta">Me contacter →</a></div>` },
        { id:"a3", category:"portrait", categoryLabel:"Portrait", date:"2025-01-15", dateLabel:"Jan. 2025", author:"Audrey Duval-Lebret", readTime:"6 min", image:"", title:"Portrait : Pr Vincent DARROUZET – Un homme de vision", excerpt:"\"Je n'avais qu'à m'inscrire dans leurs traces.\" Portrait d'une figure majeure de l'ORL française.", tags:["ORL","portrait"], content:`<div class="highlight-box"><p>"Jean-Pierre Bébéar fut mon guide !" — Pr Vincent Darrouzet</p></div><h2>L'homme derrière le médecin</h2><p>Le Professeur Darrouzet est né dans une famille médicale : son père était ORL thermaliste et chercheur à l'INSERM.</p><div class="article-cta"><h3>Découvre toutes nos interviews</h3><a href="portfolio.html" class="btn-cta">Voir tous les articles →</a></div>` },
        { id:"a4", category:"conseil", categoryLabel:"Conseil", date:"2024-06-01", dateLabel:"Juin 2024", author:"Audrey Duval-Lebret", readTime:"4 min", image:"", title:"Les 3 types d'otites – Ce qu'il faut savoir", excerpt:"Ton enfant pleure en se frottant l'oreille ? Rassure-toi, l'otite n'est pas contagieuse.", tags:["otite","enfant","prévention"], content:`<div class="highlight-box"><p>Rassure-toi, l'otite n'est pas contagieuse. Mais attention, l'infection qui l'a provoquée peut l'être !</p></div><div class="info-box"><div class="info-box-title">Les 3 types d'otites</div><ul><li>L'otite externe : infection du conduit auditif externe</li><li>L'otite moyenne aiguë : infection de l'oreille moyenne</li><li>L'otite séreuse : accumulation de liquide sans infection</li></ul></div><div class="article-cta"><h3>Des questions ?</h3><a href="index.html#contact" class="btn-cta">Me contacter →</a></div>` },
        { id:"a5", category:"prevention", categoryLabel:"Prévention", date:"2024-10-01", dateLabel:"Oct. 2024", author:"Audrey Duval-Lebret", readTime:"5 min", image:"assets/ressource-synaptopathie.jpg", title:"Surdité cachée et acouphènes : un lien plus pertinent qu'il n'y paraît", excerpt:"Ces bourdonnements ne sont jamais anodins. Les acouphènes sont souvent le signe d'une perte auditive, visible ou cachée.", tags:["acouphènes","surdité cachée","synaptopathie"], content:`<div class="highlight-box"><p>Les acouphènes sont souvent le signe d'une perte auditive, visible ou cachée.</p></div><h2>La surdité cachée : une forme souvent négligée</h2><p>La surdité dite "cachée" est difficilement détectable lors des tests auditifs classiques. On parle aussi de synaptopathie cochléaire.</p><div class="article-cta"><h3>Découvre nos ressources gratuites</h3><a href="ressources.html" class="btn-cta">Télécharger gratuitement →</a></div>` }
      ]
    },
    contact: {
      sectionLabel: "Contact", title: "Prenons rendez-vous !",
      subtitle: "Tu veux booster ta communication et attirer plus de patients ? Réserve un créneau directement dans mon agenda.",
      email: "procomsolution23@gmail.com", phone: "06 09 05 56 56",
      linkedin: "https://www.linkedin.com/in/audrey-duval-lebret/", linkedinLabel: "Audrey Duval-Lebret"
    },
    footer: {
      description: "Community Manager spécialisée dans l'audiologie. Pour une communication qui te ressemble, unique et éthique.",
      facebook: "https://fr-fr.facebook.com/ProcomSolution23",
      linkedin: "https://www.linkedin.com/in/audrey-duval-lebret/",
      gmaps: "https://maps.app.goo.gl/aod8rv7fQEcLkwMe7",
      copyright: "© 2026 Procom Solution. Tous droits réservés."
    }
  };

  const KEY = 'procom_data';
  const IMG_KEY = 'procom_images';

  function load() {
    try {
      const raw = localStorage.getItem(KEY);
      if (!raw) return deepClone(DEFAULTS);
      return deepMerge(deepClone(DEFAULTS), JSON.parse(raw));
    } catch(e) { return deepClone(DEFAULTS); }
  }

  function save(data) {
    // Normalise articles.items : category toujours en minuscules
    if (data.articles && data.articles.items) {
      data.articles.items = data.articles.items.map(a => ({
        ...a,
        category:      (a.category || '').toLowerCase(),
        categoryLabel: a.categoryLabel || capitalize(a.category || ''),
        dateLabel:     a.dateLabel || a.date || ''
      }));
    }
    localStorage.setItem(KEY, JSON.stringify(data));
  }

  function reset() {
    localStorage.removeItem(KEY);
    return deepClone(DEFAULTS);
  }

  // ── IMAGE LIBRARY ──
  function loadImages() {
    try { return JSON.parse(localStorage.getItem(IMG_KEY) || '[]'); }
    catch(e) { return []; }
  }
  function saveImages(imgs) {
    localStorage.setItem(IMG_KEY, JSON.stringify(imgs));
  }
  function addImage(img) {
    const imgs = loadImages();
    imgs.unshift({ id: 'img_' + Date.now(), ...img, addedAt: new Date().toISOString() });
    saveImages(imgs);
    return imgs[0];
  }
  function deleteImage(id) {
    saveImages(loadImages().filter(i => i.id !== id));
  }
  function updateImage(id, patch) {
    saveImages(loadImages().map(i => i.id === id ? { ...i, ...patch } : i));
  }

  function applyColors(colors) {
    const r = document.documentElement;
    r.style.setProperty('--turquoise', colors.turquoise || '#509ea4');
    r.style.setProperty('--navy',      colors.navy      || '#112338');
    r.style.setProperty('--white',     colors.white     || '#ffffff');
    r.style.setProperty('--light-bg',  colors.lightBg   || '#f4f8f9');
    r.style.setProperty('--text-dark', colors.textDark  || '#112338');
    r.style.setProperty('--text-mid',  colors.textMid   || '#3a5068');
    r.style.setProperty('--text-light',colors.textLight || '#6b8a9a');
  }

  function deepClone(o) { return JSON.parse(JSON.stringify(o)); }
  function capitalize(s) { return s ? s.charAt(0).toUpperCase() + s.slice(1) : ''; }
  function deepMerge(target, source) {
    for (const key in source) {
      if (source[key] && typeof source[key] === 'object' && !Array.isArray(source[key])) {
        if (!target[key] || typeof target[key] !== 'object') target[key] = {};
        deepMerge(target[key], source[key]);
      } else { target[key] = source[key]; }
    }
    return target;
  }

  return { load, save, reset, applyColors, DEFAULTS, loadImages, saveImages, addImage, deleteImage, updateImage };
})();