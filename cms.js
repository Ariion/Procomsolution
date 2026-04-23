/* ═══════════════════════════════════════════════
   PROCOM CMS — Moteur central
   Toutes les pages chargent ce fichier.
   Les données vivent dans localStorage sous
   la clé "procom_data".
═══════════════════════════════════════════════ */

const CMS = (() => {

  /* ── DONNÉES PAR DÉFAUT ── */
  const DEFAULTS = {
    meta: {
      title: "Procom Solution – Community Manager Audiologie",
      description: "Communication digitale sur mesure pour les audioprothésistes indépendants.",
      keywords: "community manager, audiologie, réseaux sociaux",
      author: "Audrey Duval-Lebret"
    },
    colors: {
      turquoise: "#509ea4",
      navy:      "#112338",
      white:     "#ffffff",
      lightBg:   "#f4f8f9",
      textDark:  "#112338",
      textMid:   "#3a5068",
      textLight: "#6b8a9a"
    },
    nav: {
      logo: "assets/logo-long.png",
      logoAlt: "Procom Solution",
      links: [
        { label: "Nos offres",    href: "#offres" },
        { label: "À propos",      href: "#apropos" },
        { label: "Témoignages",   href: "#temoignages" },
        { label: "Articles",      href: "portfolio.html" },
        { label: "Ressources",    href: "ressources.html" }
      ],
      ctaText: "Prendre RDV",
      ctaHref: "#contact"
    },
    hero: {
      badge:    "🎧 Community Manager Audiologie",
      title:    "Booste ta",
      titleSpan:"patientèle",
      titleEnd: "dès aujourd'hui",
      subtitle: "Communication digitale sur mesure pour les audioprothésistes indépendants. Fidélise tes patients et génère de nouveaux rendez-vous grâce à une com qui te ressemble.",
      btn1Text: "Prendre rendez-vous",
      btn1Href: "#contact",
      btn2Text: "Découvrir les offres",
      btn2Href: "#offres",
      image:    "assets/Audrey-01.png",
      imageAlt: "Audrey – Community Manager Audiologie",
      tagEmoji: "🎧",
      tagTitle: "Ton oreille attentive",
      tagSub:   "Communication éthique & personnalisée",
      stats: [
        { value: "15+",  label: "Ans d'expérience\nrelation client" },
        { value: "5",    label: "Années dans\nle paramédical" },
        { value: "100%", label: "Spécialisée\naudiologie" }
      ]
    },
    offres: {
      sectionLabel: "Nos offres",
      title:    "La solution adaptée\nà tes besoins",
      subtitle: "Des formules pensées pour les audioprothésistes indépendants, de la création de contenu à la gestion complète de ta communication.",
      items: [
        {
          id: "starter",
          icon: "🚀",
          tag: "Starter",
          name: "Ear Me Up",
          desc: "LE kit pour démarrer ton activité sur les réseaux sociaux et gagner en visibilité rapidement.",
          features: ["Kit de démarrage réseaux sociaux","Visuels personnalisés à tes couleurs","Templates prêts à l'emploi","Guide de publication"],
          btnText: "En savoir plus",
          btnStyle: "outline",
          featured: false
        },
        {
          id: "mesure",
          icon: "✨",
          tag: "Sur mesure",
          name: "Ta com sur mesure",
          desc: "Une communication 100% personnalisée, unique et éthique, au plus près de tes patients et de tes valeurs.",
          features: ["Stratégie de contenu personnalisée","Création & publication de posts","Gestion des réseaux sociaux","Reporting mensuel","Accompagnement dédié"],
          btnText: "Prendre RDV",
          btnStyle: "primary",
          featured: true,
          badge: "✨ Recommandé"
        },
        {
          id: "contenu",
          icon: "🎨",
          tag: "Contenu",
          name: "Visuels & Articles",
          desc: "Création de visuels professionnels et rédaction d'articles pour valoriser ton expertise.",
          features: ["Bannières LinkedIn & réseaux","Infographies patients","Articles de blog","Fiches conseils"],
          btnText: "En savoir plus",
          btnStyle: "outline",
          featured: false
        }
      ]
    },
    apropos: {
      sectionLabel: "Qui suis-je ?",
      title:    "La community manager\nspécialisée dans l'audiologie",
      content:  ["Assistante audioprothésiste pendant 3 ans, je me suis reconvertie comme Community Manager spécialisée dans l'audiologie en ayant constaté un réel besoin de la part des patients et un manque important de communication dans ce secteur.","Plus de 15 ans d'expérience en relation client et 5 années dans le paramédical font de moi <strong>ton oreille attentive</strong> et ton alliée pour une communication au plus près de ton patient et de tes valeurs."],
      image:    "assets/Audrey-01.png",
      imageAlt: "Audrey Duval-Lebret",
      tags:     ["Audiologie","Community Management","Relation patient","Communication éthique","Paramédical"],
      btnText:  "Travaillons ensemble",
      btnHref:  "#contact"
    },
    temoignages: {
      sectionLabel: "Témoignages",
      title:    "Ceux qui en parlent le mieux",
      googleNote: "5.0 / 5",
      googleCount: "2 avis vérifiés",
      linkedinHref: "https://www.linkedin.com/in/audrey-duval-lebret/details/recommendations/",
      items: [
        { id: "t1", initials: "NS", name: "Nahman Sroussi",   role: "Audioprothésiste – Audition Lefeuvre · Jan. 2024",    stars: 5, text: "Audrey m'a proposé plusieurs visuels répondant à mes demandes et le tout avec un délai record. Talentueuse et professionnelle, je recommande." },
        { id: "t2", initials: "TM", name: "Tifheret Mamou",   role: "Audioprothésiste D.E. · Mars 2024",                   stars: 5, text: "Audrey a réalisé une superbe bannière pour mon profil LinkedIn. Je trouve que ça met en valeur ma vision des choses ! Merci beaucoup !" },
        { id: "t3", initials: "LB", name: "Léa Besnainou",    role: "Étudiante Audioprothésiste · Mars 2024",              stars: 5, text: "Audrey a réalisé ma bannière LinkedIn. Elle a été très à l'écoute de mes demandes et très réactive. Je recommande son travail." },
        { id: "t4", initials: "BQ", name: "Benoit Quinette",  role: "Google Review · Juil. 2024",                          stars: 5, text: "Efficacité, réactivité, très professionnel. On recommande." },
        { id: "t5", initials: "DT", name: "Damien Tomasella", role: "Google Review · Juil. 2024",                          stars: 5, text: "Toujours impliquée, Audrey sait comment communiquer avec une équipe de 9 personnes. Elle a de très bonnes idées et sait mettre en avant nos entreprises." }
      ]
    },
    ressources: {
      sectionLabel: "Ressources gratuites",
      title:    "Guides & fiches pratiques\nofferts par Audrey",
      subtitle: "Des ressources concrètes pour mieux comprendre l'audiologie et développer ta communication. Téléchargement libre, sans inscription.",
      items: [
        { id: "r1", image: "assets/ressource-mini-fiches.jpg",       badge: "📄 PDF Gratuit", title: "Collection Mini Fiches – Vocabulaire Audiologie",      desc: "Toutes les définitions essentielles pour parler audiologie avec tes patients sans jargon inaccessible.", file: "assets/mini-fiches-vocabulaire.pdf" },
        { id: "r2", image: "assets/ressource-briser-silence.jpg",    badge: "📄 PDF Gratuit", title: "Briser le Silence – Comprendre la presbyacousie",       desc: "Un guide complet pour accompagner tes patients et leur entourage face à la perte auditive liée à l'âge.", file: "assets/briser-le-silence.pdf" },
        { id: "r3", image: "assets/ressource-synaptopathie.jpg",     badge: "📄 PDF Gratuit", title: "Synaptopathie cochléaire ou Surdité cachée",            desc: "Tout comprendre sur cette pathologie encore méconnue qui touche pourtant de nombreux patients.", file: "assets/synaptopathie-cochleaire.pdf" },
        { id: "r4", image: "assets/ressource-cholesteatome.jpg",     badge: "📄 PDF Gratuit", title: "Le Cholestéatome – Ce qu'il faut savoir",              desc: "Fiche pratique pour expliquer simplement cette pathologie à tes patients et les rassurer.", file: "assets/cholesteatome.pdf" },
        { id: "r5", image: "assets/ressource-google-my-business.jpg",badge: "📄 PDF Gratuit", title: "Mini Guide – Booster ta fiche Google My Business",     desc: "Les étapes concrètes pour optimiser ta visibilité locale et attirer plus de patients depuis Google.", file: "assets/guide-google-my-business.pdf" }
      ]
    },
    articles: {
      sectionLabel: "Articles",
      title:    "Ressources & conseils",
      items: [
        {
          id: "a1", category: "Interview", date: "2024",
          image: "assets/xavier-carriou.jpg",
          title: "Entretien avec Xavier CARRIOU – Fondateur d'Acouphénia",
          excerpt: "Rencontre avec un homme qui a décidé de tout changer pour aider les personnes souffrant d'acouphènes.",
          content: `<div class="highlight-box"><p>Une rencontre inspirante avec le fondateur d'Acouphénia.</p></div>
<p>Xavier CARRIOU a fondé Acouphénia après avoir lui-même souffert d'acouphènes invalidants. Son parcours témoigne d'une résilience extraordinaire et d'une volonté de transformer sa souffrance en solution pour des milliers de patients.</p>
<h2>Qu'est-ce qui vous a amené à créer Acouphénia ?</h2>
<p>Après des années de galère avec mes propres acouphènes, j'ai réalisé qu'il manquait une vraie solution globale. Les traitements existaient mais la prise en charge psychologique et le suivi au quotidien faisaient défaut.</p>
<h2>Comment fonctionne votre approche ?</h2>
<p>Acouphénia propose un accompagnement holistique : thérapie sonore, soutien psychologique, et une communauté de patients qui s'entraident. C'est cette dimension collective qui fait vraiment la différence.</p>
<div class="article-cta"><h3>Tu veux en savoir plus ?</h3><p>Découvre toutes les ressources sur l'audiologie</p><a href="ressources.html" class="btn-cta">Voir les ressources →</a></div>`,
          tags: ["acouphènes", "interview", "audiologie"]
        },
        {
          id: "a2", category: "Interview", date: "2024",
          image: "assets/azdine-ezzahti.jpg",
          title: "Entretien avec Azdine Ezzahti – L'audioprothésiste qui casse les codes",
          excerpt: "\"Je ne suis pas tombé dans l'audiologie par hasard, mais par passion.\" Une rencontre inspirante.",
          content: `<div class="highlight-box"><p>"Je ne suis pas tombé dans l'audiologie par hasard, mais par passion."</p></div>
<p>Azdine Ezzahti représente une nouvelle génération d'audioprothésistes qui réinventent leur métier, notamment grâce aux réseaux sociaux et à une communication moderne avec leurs patients.</p>
<h2>Votre parcours vers l'audioprothèse ?</h2>
<p>Tout a commencé par une fascination pour la technologie et la relation humaine. L'audioprothèse combine les deux de façon unique : on utilise des technologies de pointe pour améliorer la qualité de vie des gens. Qu'est-ce qu'on peut vouloir de plus ?</p>
<h2>Comment gérez-vous votre communication ?</h2>
<p>Les réseaux sociaux sont devenus incontournables. Mes patients, même les seniors, sont sur Facebook et YouTube. C'est là qu'il faut être présent, avec du contenu qui leur parle vraiment.</p>`,
          tags: ["audioprothésiste", "interview", "réseaux sociaux"]
        },
        {
          id: "a3", category: "Portrait", date: "2024",
          image: "assets/arnaud-deveze.jpg",
          title: "Portrait : Dr Arnaud DEVEZE – ORL & chirurgien de l'oreille",
          excerpt: "Rencontre avec un spécialiste passionné par la chirurgie de l'oreille et la prise en charge des surdités.",
          content: `<div class="highlight-box"><p>Le Dr Deveze, une passion pour la chirurgie de l'oreille au service des patients.</p></div>
<p>Le Dr Arnaud Deveze est l'un des chirurgiens ORL les plus reconnus de sa génération. Spécialisé dans la chirurgie de l'oreille, il consacre une grande partie de son travail à la recherche et à l'innovation thérapeutique.</p>
<h2>Pourquoi avoir choisi la chirurgie de l'oreille ?</h2>
<p>C'est une spécialité qui touche directement à la qualité de vie. L'ouïe est un sens social — quand on la perd, c'est souvent l'isolement qui suit. Pouvoir redonner cette capacité aux gens, c'est un privilège énorme.</p>`,
          tags: ["ORL", "portrait", "chirurgie"]
        },
        {
          id: "a4", category: "Article", date: "2024",
          image: "",
          title: "Hyperacousie ou la dualité du silence : entre refuge et isolement",
          excerpt: "Chaque bruit, même le plus léger, devient une lame de rasoir. J'ai dû apprendre à vivre avec.",
          content: `<div class="highlight-box"><p>"Chaque bruit, même le plus léger, devient une lame de rasoir que j'entends dans ma tête."</p></div>
<p>L'hyperacousie est une pathologie méconnue qui transforme les sons du quotidien en véritables agressions. Pour ceux qui en souffrent, le silence devient à la fois refuge et prison.</p>
<h2>Qu'est-ce que l'hyperacousie ?</h2>
<p>C'est une hypersensibilité aux sons de l'environnement ordinaire. Un klaxon, une conversation dans un restaurant, la musique d'un magasin — des sons que la plupart ignorent deviennent insupportables, voire douloureux.</p>
<h2>Les traitements disponibles</h2>
<p>La thérapie sonore progressive, la TCC (thérapie cognitive et comportementale) et un accompagnement audiologique spécialisé permettent dans de nombreux cas de retrouver une vie normale.</p>`,
          tags: ["hyperacousie", "santé auditive", "article"]
        },
        {
          id: "a5", category: "Conseil", date: "2024",
          image: "",
          title: "Ton enfant pleure en se frottant l'oreille ? Pas de panique, ça pourrait être une otite !",
          excerpt: "Rassure-toi, l'otite n'est pas contagieuse. Mais l'infection qui l'a provoquée peut l'être.",
          content: `<div class="highlight-box"><p>Rassure-toi, l'otite n'est pas contagieuse. Mais attention, l'infection qui l'a provoquée peut l'être.</p></div>
<p>Savais-tu qu'il existe trois types d'otites différents ? On garde les explications simples et accessibles, mais ne néglige pas les symptômes.</p>
<div class="info-box"><div class="info-box-title">Les 3 types d'otites</div><ul><li>L'otite externe : infection du conduit auditif externe</li><li>L'otite moyenne aiguë : infection de l'oreille moyenne</li><li>L'otite séreuse : accumulation de liquide sans infection</li></ul></div>
<h2>Les symptômes à surveiller</h2>
<p>Une douleur à l'oreille ou une sensation d'oreille bouchée ? Il est temps de consulter ton médecin. Chez les nourrissons : irritabilité, troubles du sommeil, fièvre légère ou tendance à se tirer l'oreille.</p>`,
          tags: ["otite", "enfant", "conseil", "pédiatrie"]
        },
        {
          id: "a6", category: "Portrait", date: "2024",
          image: "",
          title: "Portrait : Pr Vincent DARROUZET",
          excerpt: "Un homme de vision. \"Je n'avais qu'à m'inscrire dans tous les trous.\"",
          content: `<div class="highlight-box"><p>"Je n'avais qu'à m'inscrire dans tous les trous." — Pr Vincent DARROUZET</p></div>
<p>Le Professeur Vincent Darrouzet est une figure incontournable de l'ORL française. Chef de service au CHU de Bordeaux, il a contribué à de nombreuses avancées dans la chirurgie de l'oreille.</p>`,
          tags: ["ORL", "portrait", "CHU Bordeaux"]
        }
      ]
    },
    contact: {
      sectionLabel: "Contact",
      title:    "Prenons rendez-vous !",
      subtitle: "Tu veux booster ta communication et attirer plus de patients ? Réserve un créneau directement dans mon agenda pour qu'on discute de ton projet ensemble, sans engagement.",
      email:    "procomsolution23@gmail.com",
      phone:    "06 09 05 56 56",
      linkedin: "https://www.linkedin.com/in/audrey-duval-lebret/",
      linkedinLabel: "Audrey Duval-Lebret"
    },
    footer: {
      description: "Community Manager spécialisée dans l'audiologie. Pour une communication qui te ressemble, unique et éthique.",
      facebook:  "https://fr-fr.facebook.com/ProcomSolution23",
      linkedin:  "https://www.linkedin.com/in/audrey-duval-lebret/",
      gmaps:     "https://maps.app.goo.gl/aod8rv7fQEcLkwMe7",
      copyright: "© 2026 Procom Solution. Tous droits réservés."
    }
  };

  /* ── STORAGE KEY ── */
  const KEY = 'procom_data';

  /* ── LOAD / SAVE ── */
  function load() {
    try {
      const raw = localStorage.getItem(KEY);
      if (!raw) return JSON.parse(JSON.stringify(DEFAULTS));
      // Deep merge defaults + saved
      return deepMerge(JSON.parse(JSON.stringify(DEFAULTS)), JSON.parse(raw));
    } catch(e) {
      return JSON.parse(JSON.stringify(DEFAULTS));
    }
  }

  function save(data) {
    localStorage.setItem(KEY, JSON.stringify(data));
  }

  function reset() {
    localStorage.removeItem(KEY);
    return JSON.parse(JSON.stringify(DEFAULTS));
  }

  function deepMerge(target, source) {
    for (const key in source) {
      if (source[key] && typeof source[key] === 'object' && !Array.isArray(source[key])) {
        if (!target[key]) target[key] = {};
        deepMerge(target[key], source[key]);
      } else {
        target[key] = source[key];
      }
    }
    return target;
  }

  /* ── APPLY COLORS to :root ── */
  function applyColors(colors) {
    const r = document.documentElement;
    r.style.setProperty('--turquoise', colors.turquoise);
    r.style.setProperty('--navy',      colors.navy);
    r.style.setProperty('--white',     colors.white);
    r.style.setProperty('--light-bg',  colors.lightBg);
    r.style.setProperty('--text-dark', colors.textDark);
    r.style.setProperty('--text-mid',  colors.textMid);
    r.style.setProperty('--text-light',colors.textLight);
  }

  /* ── PUBLIC API ── */
  return { load, save, reset, applyColors, DEFAULTS };

})();
