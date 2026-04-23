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
          id: "a1", category: "Interview", date: "Mai 2025",
          image: "",
          title: "Entretien avec Xavier CARRIOU – Fondateur d'Acouphénia",
          excerpt: "\"J'invente le futur.\" Rencontre avec le fondateur d'Acouphénia, pionnier de la prise en charge des acouphènes en France.",
          content: `<div class="highlight-box"><p>"J'invente le futur." — Xavier CARRIOU</p></div>
<h2>L'homme derrière la vision</h2>
<p>Très tôt dans sa carrière, Xavier CARRIOU a été frappé par le désarroi de patients souffrant d'acouphènes pour lesquels la médecine classique apportait peu ou pas de solutions. Cela lui a donné une profonde envie d'agir concrètement et de ne pas laisser ces patients seuls face à leur souffrance.</p>
<p>Il veut aujourd'hui accompagner la profession vers une nouvelle spécialisation indispensable : celle d'<strong>Acouphéniste®</strong> — un audioprothésiste expert de l'acouphène.</p>
<div class="highlight-box"><p>"Ne pas laisser ces patients seuls face à leur souffrance."</p></div>
<h2>La genèse d'Acouphénia</h2>
<p>Le besoin était évident : il n'existait aucune approche standardisée ni réseau structuré pour prendre en charge les acouphènes de manière sérieuse et reproductible. Xavier CARRIOU a voulu combler ce vide. La première version du Tinnitometer était un outil simple mais révolutionnaire pour l'époque, permettant de modéliser l'acouphène avec bien plus de précision qu'avec les méthodes traditionnelles.</p>
<p>L'évidence s'est imposée : un outil, aussi performant soit-il, ne suffit pas. Il fallait former des praticiens, partager une méthode commune, et créer une communauté d'entraide. C'est ainsi qu'est née <strong>Acouphénia</strong>.</p>
<h2>Une approche différente du métier</h2>
<p>Traditionnellement, l'audioprothésiste pense « audition ». Chez Acouphénia, on pense d'abord « acouphène », en identifiant précisément l'origine sonore perçue par le patient avant même de parler de correction auditive. Les éléments clés pour une prise en charge réussie :</p>
<div class="info-box"><div class="info-box-title">Les 4 piliers d'Acouphénia</div><ul><li>Une acouphénométrie de précision</li><li>Une correction auditive adaptée</li><li>Un protocole homogène pour tous les professionnels</li><li>Une écoute attentive et bienveillante du patient</li></ul></div>
<h2>Vision et perspectives</h2>
<p>Une patiente est passée en 15 jours d'un THI de 90 à une sensation d'acouphène quasi nulle. Elle a repris sa vie sociale et professionnelle. C'est pour cela que ce métier existe.</p>
<p>Les projets à venir : le déploiement international du réseau Acouphénia®, la finalisation du Tinnitometer V3® et le lancement de Tinnitag®.</p>
<div class="highlight-box"><p>"Seul on va plus vite, ensemble on va plus loin." — L'esprit d'Acouphénia</p></div>
<div class="article-cta"><h3>Tu veux en savoir plus ?</h3><p>Découvre toutes les ressources sur l'audiologie</p><a href="ressources.html" class="btn-cta">Voir les ressources →</a></div>`,
          tags: ["acouphènes", "interview", "audiologie", "Acouphénia"]
        },
        {
          id: "a2", category: "Interview", date: "Fév. 2025",
          image: "assets/azdine-ezzahti.jpg",
          title: "Entretien avec Azdine Ezzahti – L'audioprothésiste qui casse les codes",
          excerpt: "\"Je ne suis pas tombé dans l'audiologie par hasard, mais presque.\" Un parcours hors du commun, entre Belgique et France.",
          content: `<div class="highlight-box"><p>"Je ne suis pas tombé dans l'audiologie par hasard, mais presque." — Azdine Ezzahti</p></div>
<h2>Un métier où rigueur et passion se rencontrent</h2>
<p>Monsieur Ezzahti, votre parcours est riche et varié. Avant l'audiologie, vous aviez entrepris des études d'ingénieur de gestion, puis d'herboriste, puis de taximan — à l'époque où il fallait encore étudier par cœur les rues de Bruxelles. C'est en rencontrant un ami d'enfance que vous avez entendu parler de l'audiologie pour la première fois.</p>
<p>Après plus de dix ans dans le domaine, ce qui l'anime toujours : <strong>apprendre et se sentir utile</strong>. L'audiologie est un domaine sans frontières fixes, allant de la psychologie à l'électronique, en passant par la physique ou la biologie. Pour un esprit curieux, c'est un terrain de jeu fantastique.</p>
<div class="highlight-box"><p>"Écouter, comprendre, accompagner… C'est là que réside la vraie valeur de notre profession."</p></div>
<h2>La transmission comme moteur</h2>
<p>Maître de stage très impliqué, Azdine Ezzahti est retourné à l'ULB pour donner des cours de méthodologie aux étudiants issus d'écoles défavorisées. Transmettre, pour lui, ce n'est pas seulement partager un savoir. C'est donner aux autres les outils pour progresser.</p>
<h2>La vision de l'audiologie</h2>
<p>Son combat : <strong>l'indépendance des audioprothésistes vis-à-vis des fabricants</strong>. Un bon audioprothésiste doit savoir remettre en question les arguments commerciaux. La profession doit servir la science et les patients, pas les dogmes.</p>
<p>Il a exercé en Belgique et en France. La différence principale : la formation belge accorde une place plus importante à la clinique, avec une approche plus médicale du discours.</p>
<div class="article-cta"><h3>Envie d'échanger ?</h3><p>Contacte Audrey pour en discuter</p><a href="index.html#contact" class="btn-cta">Me contacter →</a></div>`,
          tags: ["audioprothésiste", "interview", "indépendance", "Belgique"]
        },
        {
          id: "a3", category: "Portrait", date: "Jan. 2025",
          image: "assets/arnaud-deveze-darrouzet.jpg",
          title: "Portrait : Pr Vincent DARROUZET – Un homme de vision",
          excerpt: "\"Je n'avais qu'à m'inscrire dans leurs traces. Jean-Pierre Bébéar fut mon guide !\" Portrait d'une figure majeure de l'ORL française.",
          content: `<div class="highlight-box"><p>"Je n'avais qu'à m'inscrire dans leurs traces. Jean-Pierre Bébéar fut mon guide !" — Pr Vincent Darrouzet</p></div>
<h2>L'homme derrière le médecin</h2>
<p>Le Professeur Darrouzet est né dans une famille médicale : son père était ORL thermaliste et chercheur à l'INSERM sur la toxicité cochléaire. Faire médecine lui est apparu une évidence. Reçu interne des hôpitaux, c'est vers l'ORL qu'il se tourne, poussé par l'envie de devenir chirurgien.</p>
<p>Il a eu des maîtres prestigieux (les Professeurs Portmann, Bébéar et Dauman) qui avaient une très grande notoriété internationale. Puis vient la révélation pour l'otologie.</p>
<div class="highlight-box"><p>"Sans certains freins étatiques, il est clair que nous aurions été les premiers à expérimenter avec succès la thérapie génique de la surdité à l'Otoferline chez l'homme."</p></div>
<h2>Valeurs et engagement</h2>
<p>Ce qui le guide : un attachement viscéral aux valeurs éthiques du médecin et à la qualité du dialogue singulier médecin/malade. Comme disait Georges Canguilhem : <em>"On ne soigne pas des maladies mais des malades."</em></p>
<p>Il a été 16 ans chef de service, 8 ans chef de pôle, membre de la CME du CHU de Bordeaux pendant 30 ans. Président du Conseil National Professionnel d'ORL de 2020 à 2023.</p>
<h2>La vision de l'audiologie en France</h2>
<p>La France a un grand renom dans la recherche en audiologie. Le dynamisme de l'Institut de l'Audition en lien avec l'Institut Pasteur est à souligner, ainsi que la naissance récente du CERIAH (Centre de Recherche et d'Innovation en Audiologie Humaine) sous la houlette du Pr Paul Avan.</p>
<p>Ces ambitions, le CNP les partage avec les audioprothésistes <em>sans lesquels rien ne sera possible</em>.</p>
<div class="article-cta"><h3>Découvre toutes nos interviews</h3><p>Des rencontres inspirantes avec les acteurs de l'audiologie</p><a href="portfolio.html" class="btn-cta">Voir tous les articles →</a></div>`,
          tags: ["ORL", "portrait", "CHU Bordeaux", "recherche"]
        },
        {
          id: "a4", category: "Portrait", date: "Oct. 2024",
          image: "assets/arnaud-deveze.jpg",
          title: "Portrait : Dr Arnaud DEVEZE – ORL & chirurgien de l'oreille",
          excerpt: "\"Pouvoir réséquer une tumeur du nerf auditif en préservant l'audition n'est pas toujours possible, mais lorsqu'on y parvient, c'est extraordinaire.\"",
          content: `<div class="highlight-box"><p>"Pouvoir réséquer une tumeur du nerf auditif en préservant l'audition n'est pas toujours possible, mais lorsqu'on y parvient, c'est extraordinaire pour le patient." — Dr Arnaud Devèze</p></div>
<h2>L'homme derrière le professionnel</h2>
<p>Le Dr Arnaud Devèze guide sa pratique par le souci d'apporter des réponses aux problématiques que rencontrent les patients dans leurs parcours de soins. Il adopte une communication très directe, simple, proche des patients, centrée sur leur problème. Il leur parle de leur mode de vie, leur vie professionnelle et personnelle — et a l'habitude de dessiner ou schématiser leur pathologie pour qu'ils conservent un document simple.</p>
<p>En dehors du travail : le sport, la cuisine et les amis. Faire du sport est indispensable dans l'équilibre global face au rythme exigé par les activités chirurgicales.</p>
<div class="highlight-box"><p>"Un audioprothésiste est un professionnel de santé qui a à cœur d'améliorer la vie de ses patients. Les échanges avec les ORL sont toujours indispensables."</p></div>
<h2>Parcours en ORL</h2>
<p>C'est la rencontre avec le Pr Chays et le Pr Magnan, lors des conférences d'internat au CHU de Marseille, qui l'a convaincu. Il a découvert des gens passionnés et passionnants, qui sublimaient leur spécialité.</p>
<p>Son cas le plus marquant : un patient a pu reprendre son activité de pianiste semi-professionnel 20 ans après, grâce à la chirurgie d'implantation auditive. Il a dit : <em>"Vous ne m'avez pas rendu la seconde oreille, mais vous m'avez redonné ma seconde main."</em></p>
<h2>Innovation : le projet Audya</h2>
<p>Ses recherches en biomécanique acoustique influencent énormément sa pratique quotidienne. Les travaux sur les couplages ossiculaires et le modèle de conduit auditif sont de vrais guides. L'innovation qui l'a le plus marqué : la mise au point des microphones implantables de l'implant Carina. L'invisibilité des dispositifs auditifs implantables est une absolue nécessité.</p>
<p>Ses 3 enfants font médecine — preuve peut-être qu'ils ne sont pas si traumatisés par la passion envahissante de leur père !</p>
<div class="article-cta"><h3>Tu veux en savoir plus ?</h3><p>Découvre toutes nos ressources sur l'audiologie</p><a href="ressources.html" class="btn-cta">Voir les ressources →</a></div>`,
          tags: ["ORL", "portrait", "chirurgie", "implant auditif"]
        },
        {
          id: "a5", category: "Portrait", date: "Août 2024",
          image: "assets/yann-nguyen.jpg",
          title: "Portrait : Pr Yann NGUYEN – Chirurgien ORL & chercheur",
          excerpt: "Un parcours entre passion chirurgicale, recherche académique et transmission du savoir au cœur de l'AP-HP.",
          content: `<div class="highlight-box"><p>Le Pr Yann Nguyen, figure de l'otologie et de l'implantologie cochléaire à l'AP-HP.</p></div>
<h2>Origines et formation</h2>
<p>Le Pr Nguyen a découvert l'ORL comme tous les étudiants en médecine, en deuxième cycle, plus précisément au cours d'un stage de 2 mois réalisé dans l'équipe du professeur Olivier Sterkers à Beaujon. Depuis plus jeune, il cherchait un métier sans routine, où son goût pour les matières scientifiques pourrait s'exprimer.</p>
<p>Un stage de 3e dans un service d'orthopédie l'a définitivement convaincu : il a été fasciné par une journée passée au bloc opératoire.</p>
<h2>Pourquoi l'ORL ?</h2>
<p>Au sortir du concours de l'internat, l'ORL l'a définitivement convaincu après ses deux premiers stages : il a beaucoup aimé le caractère à la fois médical et chirurgical du métier, avec des techniques opératoires très différentes. Le choix d'une spécialité se fait aussi par identification aux personnalités — et il s'est senti beaucoup plus proche des ORL qu'il avait côtoyés.</p>
<div class="highlight-box"><p>Savoir quand ne pas opérer est une des compétences les plus longues à acquérir.</p></div>
<h2>Carrière académique et hospitalière</h2>
<p>Ce qui a motivé son choix : conjuguer la recherche et le soin, avec la possibilité d'appliquer les résultats de ses recherches aux patients. Le travail en CHU offre une diversité par le soin, la recherche, l'enseignement, dans laquelle aucune routine ne peut s'installer.</p>
<p>Ses années de formation à la faculté de médecine de Bichat lui ont permis de tisser des liens forts avec ses camarades de promotion — une d'entre elles est d'ailleurs devenue ORL.</p>
<div class="article-cta"><h3>Découvre toutes nos interviews</h3><p>Des rencontres avec les acteurs de l'audiologie</p><a href="portfolio.html" class="btn-cta">Voir tous les articles →</a></div>`,
          tags: ["ORL", "portrait", "implant cochléaire", "AP-HP"]
        },
        {
          id: "a6", category: "Prévention", date: "Oct. 2024",
          image: "assets/ressource-synaptopathie.jpg",
          title: "Surdité cachée et acouphènes : un lien plus pertinent qu'il n'y paraît",
          excerpt: "Ces bourdonnements ne sont jamais anodins. Les acouphènes sont souvent le signe d'une perte auditive, visible ou cachée.",
          content: `<div class="highlight-box"><p>Les acouphènes sont souvent le signe d'une perte auditive, visible ou cachée. Pourtant, la réponse la plus fréquente reste : "Il faut vivre avec."</p></div>
<h2>Trois types de surdité : ce qu'il faut savoir</h2>
<div class="info-box"><div class="info-box-title">Les 3 types de surdité</div><ul><li><strong>Surdité conductrice</strong> : résulte d'obstructions dans l'oreille externe ou moyenne. Souvent résolue médicalement ou chirurgicalement.</li><li><strong>Surdité neurosensorielle</strong> : causée par des dommages à l'oreille interne ou au nerf auditif. Compensée par des aides auditives ou implants.</li><li><strong>Surdité mixte</strong> : un mélange des deux, nécessitant des approches combinées.</li></ul></div>
<h2>La surdité cachée : une forme souvent négligée</h2>
<p>La surdité dite "cachée" est difficilement détectable lors des tests auditifs classiques. Les audiogrammes ne captent que les pertes auditives supérieures à 25-30 dB, laissant les pertes légères non diagnostiquées. On parle aussi de <strong>synaptopathie cochléaire</strong>, une dégradation des synapses auditives qui rend la compréhension dans le bruit difficile, même si l'audition semble normale en environnement calme.</p>
<h2>La prise en charge des acouphènes</h2>
<p>L'identification précise de la perte auditive en présence d'acouphènes demande une approche plus approfondie que les tests standardisés. Il est essentiel de prévoir :</p>
<div class="info-box"><div class="info-box-title">Tests recommandés</div><ul><li>Des discussions approfondies avec les professionnels de santé</li><li>Les potentiels évoqués auditifs du tronc cérébral</li><li>Les otoémissions acoustiques</li><li>L'audiométrie de haute fréquence</li></ul></div>
<p>Ces méthodes permettent de détecter des pertes auditives qui échappent aux tests standards. Il est même possible, grâce à l'audiométrie, de repérer les fréquences des acouphènes et de configurer des appareils auditifs pour les atténuer.</p>
<div class="article-cta"><h3>Découvre nos ressources gratuites</h3><p>Guide complet sur la synaptopathie cochléaire</p><a href="ressources.html" class="btn-cta">Télécharger gratuitement →</a></div>`,
          tags: ["acouphènes", "surdité cachée", "synaptopathie", "prévention"]
        },
        {
          id: "a7", category: "Conseil", date: "Juin 2024",
          image: "assets/hyperacousie.jpg",
          title: "Hyperacousie ou la dualité du silence : entre refuge et isolement",
          excerpt: "\"Chaque bruit, même le plus léger, devient une lame de rasoir qui s'enfonce dans ma tête. J'ai dû apprendre à vivre avec.\"",
          content: `<div class="highlight-box"><p>"Chaque bruit, même le plus léger, devient une lame de rasoir qui s'enfonce dans ma tête. J'ai dû apprendre."</p></div>
<h2>Qu'est-ce que l'hyperacousie ?</h2>
<p>L'hyperacousie, c'est cette hypersensibilité aux sons du quotidien qui transforme la vie ordinaire en véritable épreuve. Les bruits — une voiture qui passe, une conversation normale, de la musique — deviennent douloureux, voire insupportables.</p>
<p>Ce n'est pas "dans la tête". C'est une condition neurologique réelle, souvent mal comprise et mal prise en charge. Le silence devient à la fois refuge et prison.</p>
<h2>La dualité du silence</h2>
<p>Le silence protège — il calme, il apaise. Mais il isole aussi. Les personnes souffrant d'hyperacousie se retrouvent souvent à éviter les restaurants, les transports, les réunions familiales. Leur cercle social rétrécit, leur qualité de vie se dégrade.</p>
<p>Cette dualité est au cœur de la souffrance : chercher le silence pour survivre, mais s'y retrouver prisonnier.</p>
<div class="info-box"><div class="info-box-title">Signes de l'hyperacousie</div><ul><li>Douleur ou inconfort face aux sons du quotidien</li><li>Évitement des lieux bruyants (restaurants, transports…)</li><li>Fatigue intense après exposition sonore</li><li>Isolement social progressif</li><li>Acouphènes associés dans de nombreux cas</li></ul></div>
<h2>Les pistes de traitement</h2>
<p>La thérapie sonore progressive, la TCC (thérapie cognitive et comportementale) et un accompagnement audiologique spécialisé permettent dans de nombreux cas de retrouver une vie normale. La désensibilisation progressive — exposer l'oreille à des sons de plus en plus intenses — est au cœur du protocole.</p>
<div class="article-cta"><h3>Tu souffres d'hyperacousie ?</h3><p>N'hésite pas à consulter un professionnel de l'audition</p><a href="index.html#contact" class="btn-cta">Prendre contact →</a></div>`,
          tags: ["hyperacousie", "santé auditive", "isolement", "traitement"]
        },
        {
          id: "a8", category: "Conseil", date: "Juin 2024",
          image: "",
          title: "Les 3 types d'otites – Ce qu'il faut savoir",
          excerpt: "Ton enfant pleure en se frottant l'oreille ? Rassure-toi, l'otite n'est pas contagieuse. Mais l'infection qui l'a provoquée peut l'être.",
          content: `<div class="highlight-box"><p>Rassure-toi, l'otite n'est pas contagieuse. Mais attention, l'infection qui l'a provoquée peut l'être !</p></div>
<p>Savais-tu qu'il existe trois types d'otites différents ? Enfin, on pourrait même en trouver 6 ! Mais on va faire simple et les répartir en 3. On garde les explications simples et accessibles, mais ne néglige pas les symptômes.</p>
<div class="info-box"><div class="info-box-title">Les 3 types d'otites</div><ul><li><strong>L'otite externe</strong> : infection du conduit auditif externe. Souvent liée à l'eau (otite du baigneur). Douleur à la pression du pavillon.</li><li><strong>L'otite moyenne aiguë</strong> : infection de l'oreille moyenne, fréquente chez l'enfant. Douleur intense, fièvre possible.</li><li><strong>L'otite séreuse</strong> : accumulation de liquide derrière le tympan sans infection. Sensation d'oreille bouchée, baisse d'audition.</li></ul></div>
<h2>Les symptômes à surveiller</h2>
<p>Une douleur à l'oreille ou une sensation d'oreille bouchée ? Il est temps de consulter ton médecin. Chez les nourrissons, les signes peuvent être moins évidents : irritabilité, troubles du sommeil, fièvre légère ou tendance à se tirer l'oreille.</p>
<h2>Quand consulter en urgence ?</h2>
<p>Si ton enfant présente une forte fièvre (au-dessus de 39°C), des pleurs intenses et inconsolables, ou un écoulement de l'oreille, consulte rapidement un médecin. Ne tarde pas — une otite mal traitée peut entraîner des complications auditives.</p>
<div class="article-cta"><h3>Des questions sur la santé auditive ?</h3><p>Contacte Audrey pour en discuter</p><a href="index.html#contact" class="btn-cta">Me contacter →</a></div>`,
          tags: ["otite", "enfant", "pédiatrie", "prévention"]
        },
        {
          id: "a9", category: "Conseil", date: "Nov. 2024",
          image: "assets/ressource-google-my-business.jpg",
          title: "Optimiser votre fiche Google My Business",
          excerpt: "Votre fiche Google My Business est-elle vraiment optimisée ? Découvrez les étapes concrètes pour attirer plus de patients localement.",
          content: `<div class="highlight-box"><p>Votre fiche Google My Business est souvent le premier contact d'un patient avec votre cabinet. Faites-en votre meilleur commercial.</p></div>
<h2>Pourquoi optimiser votre fiche Google My Business ?</h2>
<p>Quand un patient cherche un audioprothésiste près de chez lui, Google My Business est sa première étape. Une fiche bien optimisée, c'est plus de visibilité, plus d'appels et plus de rendez-vous — sans publicité payante.</p>
<div class="info-box"><div class="info-box-title">Les éléments essentiels à compléter</div><ul><li>Nom exact de votre cabinet (cohérent partout)</li><li>Adresse précise et horaires à jour</li><li>Numéro de téléphone direct</li><li>Catégorie principale : Audioprothésiste</li><li>Photos professionnelles de votre cabinet</li><li>Description avec vos spécialités</li></ul></div>
<h2>Les photos : un élément souvent négligé</h2>
<p>Les fiches avec photos reçoivent en moyenne 42% de demandes d'itinéraire de plus et 35% de clics vers le site web de plus. Publiez des photos de votre accueil, de votre espace de soin, de votre équipe (avec accord). Montrez un environnement chaleureux et professionnel.</p>
<h2>Les avis patients : votre meilleur atout</h2>
<p>Demandez à vos patients satisfaits de laisser un avis Google. Répondez à TOUS les avis, positifs comme négatifs — cela montre votre professionnalisme et rassure les futurs patients. Un cabinet avec 10 avis à 4,8★ fera toujours plus confiance qu'un cabinet sans aucun avis.</p>
<div class="article-cta"><h3>Télécharge le mini-guide complet</h3><p>Toutes les étapes détaillées en PDF gratuit</p><a href="assets/guide-google-my-business.pdf" download class="btn-cta">Télécharger gratuitement →</a></div>`,
          tags: ["Google My Business", "visibilité", "conseils", "patients"]
        },
        {
          id: "a10", category: "Conseil", date: "2024",
          image: "",
          title: "Presbyacousie – Tout comprendre sur la perte auditive liée à l'âge",
          excerpt: "1 senior sur 3 est touché par la presbyacousie. Une perte auditive progressive, souvent acceptée à tort comme une fatalité.",
          content: `<div class="highlight-box"><p>1 senior sur 3 est touché par la presbyacousie. Pourtant, seul 1 sur 5 est appareillé. Comprendre pour mieux agir.</p></div>
<h2>Qu'est-ce que la presbyacousie ?</h2>
<p>La presbyacousie est la perte auditive naturellement liée au vieillissement. Elle touche progressivement les deux oreilles de manière symétrique, en commençant par les fréquences aiguës. C'est la cause la plus fréquente de surdité chez les personnes de plus de 60 ans.</p>
<div class="info-box"><div class="info-box-title">Signes caractéristiques</div><ul><li>Difficulté à comprendre dans le bruit ou en groupe</li><li>Impression que les gens "ne parlent pas assez fort"</li><li>Besoin de faire répéter fréquemment</li><li>Télévision ou téléphone à volume élevé</li><li>Fatigue en fin de journée due à l'effort d'écoute</li></ul></div>
<h2>Pourquoi ne pas "faire avec" ?</h2>
<p>La perte auditive non traitée est aujourd'hui reconnue comme l'un des facteurs de risque modifiables les plus importants dans le développement de la démence et du déclin cognitif. S'isoler progressivement à cause d'une audition défaillante entraîne aussi dépression et perte de lien social.</p>
<h2>Les solutions disponibles</h2>
<p>Les aides auditives modernes sont discrètes, performantes et connectées (Bluetooth, rechargeable). La réforme "100% Santé" permet depuis 2021 d'accéder à des appareils auditifs sans reste à charge. Un audioprothésiste vous accompagnera pour trouver la solution adaptée à votre mode de vie.</p>
<div class="article-cta"><h3>Télécharge le guide gratuit</h3><p>Briser le Silence — Comprendre la presbyacousie</p><a href="assets/briser-le-silence.pdf" download class="btn-cta">Télécharger gratuitement →</a></div>`,
          tags: ["presbyacousie", "seniors", "perte auditive", "prévention"]
        },
        {
          id: "a11", category: "Conseil", date: "2024",
          image: "",
          title: "Décuple ta marque avec 7 astuces pro",
          excerpt: "7 astuces concrètes pour booster ta visibilité en ligne en tant que professionnel de l'audiologie. Applicables dès aujourd'hui.",
          content: `<div class="highlight-box"><p>Ta marque personnelle, c'est ce que les gens disent de toi quand tu n'es pas dans la pièce. Voici comment la construire intelligemment.</p></div>
<h2>Pourquoi construire ta marque personnelle ?</h2>
<p>En audiologie, la relation de confiance est primordiale. Les patients choisissent leur audioprothésiste non seulement pour ses compétences, mais pour sa personnalité, ses valeurs, son approche. Ta présence en ligne doit refléter tout ça.</p>
<div class="info-box"><div class="info-box-title">7 astuces pour booster ta marque</div><ul><li><strong>1. Définis ta niche</strong> : enfants, seniors, musiciens, acouphènes… spécialise-toi</li><li><strong>2. Soigne ta photo de profil</strong> : professionnelle, souriante, à jour</li><li><strong>3. Publie régulièrement</strong> : 2-3 fois/semaine minimum sur LinkedIn ou Instagram</li><li><strong>4. Partage ton expertise</strong> : conseils, coulisses, cas patients (anonymisés)</li><li><strong>5. Interagis</strong> : commente les posts de tes confrères et partenaires</li><li><strong>6. Collecte des avis</strong> : Google, LinkedIn, Doctolib</li><li><strong>7. Reste cohérent</strong> : même ton, mêmes couleurs, même message partout</li></ul></div>
<h2>Le contenu qui fonctionne</h2>
<p>Ce qui génère le plus d'engagement pour les audioprothésistes : les témoignages patients (avec accord), les explications vulgarisées ("Qu'est-ce qu'un audiogramme ?"), les coulisses du cabinet, et les actualités du secteur commentées avec ton point de vue.</p>
<div class="article-cta"><h3>Tu veux aller plus loin ?</h3><p>Audrey t'accompagne dans ta stratégie de communication</p><a href="index.html#contact" class="btn-cta">Prendre rendez-vous →</a></div>`,
          tags: ["marque personnelle", "réseaux sociaux", "conseils", "communication"]
        },
        {
          id: "a12", category: "Conseil", date: "2024",
          image: "",
          title: "Refonte feed Instagram – Avant / Après",
          excerpt: "Décryptage d'une refonte complète d'un compte Instagram audiologie : stratégie visuelle, cohérence de marque et résultats.",
          content: `<div class="highlight-box"><p>Un feed Instagram cohérent, c'est la première impression que tu donnes à tes futurs patients. Elle doit être irréprochable.</p></div>
<h2>Pourquoi refondre son feed ?</h2>
<p>Un feed incohérent — mélange de photos personnelles, de visuels mal cadrés, de couleurs qui changent à chaque post — nuit à la crédibilité professionnelle. En audiologie, la confiance est tout. Ton Instagram doit inspirer confiance dès le premier regard.</p>
<h2>Les étapes d'une refonte réussie</h2>
<div class="info-box"><div class="info-box-title">La méthode en 5 étapes</div><ul><li><strong>Audit de l'existant</strong> : identifier ce qui ne fonctionne pas</li><li><strong>Définir une charte visuelle</strong> : 2-3 couleurs, 1-2 polices, 1 style photo</li><li><strong>Créer des templates</strong> : pour que chaque post soit cohérent sans effort</li><li><strong>Planifier le contenu</strong> : au moins 2 semaines d'avance</li><li><strong>Mesurer les résultats</strong> : portée, engagement, nouveaux abonnés</li></ul></div>
<h2>Les résultats observés</h2>
<p>Après une refonte bien menée, les cabinets partenaires constatent en général une augmentation de l'engagement de 40 à 60% sur les 3 premiers mois, et une meilleure qualité des demandes reçues — des patients qui correspondent vraiment aux valeurs du cabinet.</p>
<div class="article-cta"><h3>Tu veux refondre ton Instagram ?</h3><p>Audrey t'accompagne de A à Z</p><a href="index.html#contact" class="btn-cta">En discuter →</a></div>`,
          tags: ["Instagram", "réseaux sociaux", "branding", "visual"]
        },
        {
          id: "a13", category: "Conseil", date: "2024",
          image: "",
          title: "Palettes de couleurs – Comment choisir pour ton cabinet",
          excerpt: "Les couleurs de ta communication ne sont pas anodines. Elles véhiculent des émotions et des valeurs. Voici comment choisir intelligemment.",
          content: `<div class="highlight-box"><p>Les couleurs parlent avant même que tu ne dises un mot. En audiologie, le bon choix de palette peut faire toute la différence.</p></div>
<h2>Pourquoi les couleurs sont-elles importantes ?</h2>
<p>Les études montrent que la couleur influence jusqu'à 85% des décisions d'achat et 80% de la reconnaissance de marque. En santé, les couleurs doivent simultanément inspirer confiance, calme et professionnalisme — tout en restant mémorables.</p>
<h2>Les palettes qui fonctionnent en audiologie</h2>
<div class="info-box"><div class="info-box-title">Palettes recommandées</div><ul><li><strong>Bleu + Blanc</strong> : confiance, propreté, médical. La référence en santé.</li><li><strong>Vert + Beige</strong> : naturel, bien-être, douceur. Parfait pour une approche holistique.</li><li><strong>Turquoise + Navy</strong> : moderne, spécialisé, expert. Idéal pour se démarquer.</li><li><strong>Violet + Or</strong> : premium, luxe, excellence. Pour les cabinets haut de gamme.</li></ul></div>
<h2>Les couleurs à éviter</h2>
<p>Le rouge (urgence, danger), le jaune vif (agressif), le noir seul (trop froid). Ces couleurs peuvent inconsciemment mettre les patients mal à l'aise dans un contexte médical.</p>
<h2>Comment créer ta palette</h2>
<p>Commence par 1 couleur principale (celle qui te représente), 1 couleur secondaire (complémentaire), et 1 couleur neutre (blanc, beige, gris clair). Utilise-les de manière cohérente sur tous tes supports : site web, réseaux sociaux, cartes de visite, documents internes.</p>
<div class="article-cta"><h3>Besoin d'aide pour ton identité visuelle ?</h3><p>Audrey crée des visuels sur mesure pour les audioprothésistes</p><a href="index.html#contact" class="btn-cta">Prendre rendez-vous →</a></div>`,
          tags: ["design", "couleurs", "identité visuelle", "branding"]
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
