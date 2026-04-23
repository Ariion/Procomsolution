/* =====================================================
   PROCOM SOLUTION – site.js
   Lit les données depuis localStorage (clé "procom_data")
   sauvegardées par l'admin via cms.js.
   Fallback sur config.json si rien n'est sauvegardé.
   ===================================================== */

window.PROCOM = {

  cfg: null,

  /* ── CHARGEMENT ── */
  async load() {
    // 1. localStorage – clé utilisée par cms.js / admin.html
    const saved = localStorage.getItem('procom_data');
    if (saved) {
      try { this.cfg = JSON.parse(saved); } catch(e) { this.cfg = null; }
    }

    // 2. Fallback → config.json
    if (!this.cfg) {
      try {
        const r = await fetch('config.json?' + Date.now());
        if (r.ok) this.cfg = await r.json();
      } catch(e) {}
    }

    if (!this.cfg) { console.warn('PROCOM: aucune config chargée'); return; }

    this.applyColors();
    this.renderPage();
  },

  /* ── COULEURS CSS ── */
  applyColors() {
    const c = this.cfg.colors || {};
    const root = document.documentElement;
    const map = {
      '--turquoise': c.turquoise || '#509ea4',
      '--navy':      c.navy      || '#112338',
      '--white':     c.white     || '#ffffff',
      '--light-bg':  c.lightBg   || '#f4f8f9',
      '--text-dark': c.textDark  || '#112338',
      '--text-mid':  c.textMid   || '#3a5068',
      '--text-light':c.textLight || '#6b8a9a',
    };
    Object.entries(map).forEach(([k,v]) => root.style.setProperty(k, v));
  },

  /* ── ROUTING ── */
  renderPage() {
    const page = document.body.dataset.page;
    if (page === 'index')      this.renderIndex();
    if (page === 'portfolio')  this.renderPortfolio();
    if (page === 'ressources') this.renderRessources();
    if (page === 'article')    this.renderArticle();
  },

  /* ── UTILS ── */
  stars(n) {
    return '★'.repeat(n) + '☆'.repeat(5 - n);
  },

  set(id, html, prop = 'innerHTML') {
    const el = document.getElementById(id);
    if (el) el[prop] = html;
  },

  setText(id, text) {
    const el = document.getElementById(id);
    if (el) el.textContent = text;
  },

  /* Accès unifié aux articles : supporte le format CMS {sectionLabel, title, items}
     et l'ancien format config.json (tableau direct) */
  getArticles() {
    const a = this.cfg.articles;
    if (!a) return [];
    if (Array.isArray(a)) return a;
    return a.items || [];
  },

  /* ─────────────────────────────────────────────────
     INDEX
  ───────────────────────────────────────────────── */
  renderIndex() {
    const c = this.cfg;

    /* HERO */
    const h = c.hero || {};
    this.set('hero-badge', h.badge || '');

    // Supporte titleAccent (config.json) et titleSpan (CMS)
    const accent = h.titleAccent || h.titleSpan || '';
    this.set('hero-title', `${h.title || ''}<br/><span>${accent}</span><br/>${h.titleEnd || ''}`);
    this.set('hero-subtitle', h.subtitle || '');

    const b1 = document.getElementById('hero-btn1');
    if (b1) { b1.textContent = h.btn1Text || ''; b1.href = h.btn1Link || h.btn1Href || '#'; }
    const b2 = document.getElementById('hero-btn2');
    if (b2) { b2.textContent = h.btn2Text || ''; b2.href = h.btn2Link || h.btn2Href || '#'; }

    const img = document.getElementById('hero-img');
    if (img && h.image) img.src = h.image;

    this.set('hero-tag-emoji', h.tagEmoji || '');
    this.set('hero-tag-title', h.tagTitle || '');
    this.set('hero-tag-sub',   h.tagSub   || '');

    /* HERO STATS */
    const statsEl = document.getElementById('hero-stats');
    if (statsEl && h.stats) {
      statsEl.innerHTML = h.stats.map(s => `
        <div class="stat">
          <strong>${s.value}</strong>
          <span>${(s.label || '').replace(/\n/g,'<br/>')}</span>
        </div>`).join('');
    }

    /* OFFRES */
    const o = c.offres || {};
    this.set('offres-label', o.sectionLabel || '');
    // Supporte sectionTitle (config.json) et title (CMS)
    const offresTitle = (o.sectionTitle || o.title || '').replace(/\n/g,'<br/>');
    this.set('offres-title', offresTitle);
    this.set('offres-sub',   o.sectionSub || o.subtitle || '');

    const offresGrid = document.getElementById('offres-grid');
    if (offresGrid && o.items) {
      offresGrid.innerHTML = o.items.map(item => `
        <div class="offre-card${item.featured ? ' featured' : ''}">
          ${item.badge ? `<div class="badge-recommande">${item.badge}</div>` : ''}
          <div class="offre-icon">${item.icon}</div>
          <p class="offre-tag">${item.tag}</p>
          <h3>${item.title || item.name || ''}</h3>
          <p>${item.desc}</p>
          <ul>${(item.features || []).map(f => `<li>${f}</li>`).join('')}</ul>
          <a href="${item.btnLink || '#contact'}" class="btn-${item.btnStyle || 'outline'}">${item.btnText}</a>
        </div>`).join('');
    }

    /* À PROPOS */
    const a = c.apropos || {};
    this.set('apropos-label', a.sectionLabel || '');
    const aproposTitle = (a.sectionTitle || a.title || '').replace(/\n/g,'<br/>');
    this.set('apropos-title', aproposTitle);

    // Supporte paragraphs (config.json) et content (CMS)
    const aproposContent = document.getElementById('apropos-content') || document.getElementById('apropos-paragraphs');
    if (aproposContent) {
      const paras = a.paragraphs || a.content || [];
      aproposContent.innerHTML = paras.map(p => `<p>${p}</p>`).join('');
    }

    const aproposTags = document.getElementById('apropos-tags');
    if (aproposTags && a.tags) {
      aproposTags.innerHTML = a.tags.map(t => `<span class="tag">${t}</span>`).join('');
    }

    const aproposBtn = document.getElementById('apropos-btn');
    if (aproposBtn) {
      aproposBtn.textContent = a.btnText || '';
      aproposBtn.href = a.btnLink || a.btnHref || '#';
    }

    const aproposImg = document.getElementById('apropos-img');
    if (aproposImg && a.image) aproposImg.src = a.image;

    /* TÉMOIGNAGES */
    const t = c.temoignages || {};
    this.set('temoignages-label', t.sectionLabel || '');
    this.set('temoignages-title', t.sectionTitle || t.title || '');

    const temGrid = document.getElementById('temoignages-grid');
    if (temGrid && t.items) {
      temGrid.innerHTML = t.items.map(item => `
        <div class="temoignage-card">
          <div class="stars">${this.stars(item.stars)}</div>
          <blockquote>"${item.text}"</blockquote>
          <div class="temoignage-author">
            <div class="avatar">${item.initials}</div>
            <div class="author-info">
              <strong>${item.name}</strong>
              <span>${item.role}</span>
            </div>
          </div>
        </div>`).join('');
    }

    // Note Google
    const gnEl = document.getElementById('google-note') || document.getElementById('google-rating');
    if (gnEl) gnEl.textContent = t.googleRating || t.googleNote || '5.0 / 5';
    const gcEl = document.getElementById('google-count');
    if (gcEl) gcEl.textContent = 'Basée sur ' + (t.googleCount || '2');
    const glEl = document.getElementById('linkedin-btn') || document.getElementById('google-all-link');
    if (glEl) glEl.href = t.googleLink || t.linkedinHref || '#';

    /* RESSOURCES CAROUSEL */
    const r = c.ressources || {};
    this.set('ressources-label', r.sectionLabel || '');
    const ressTitle = (r.sectionTitle || r.title || '').replace(/\n/g,'<br/>');
    this.set('ressources-title', ressTitle);
    this.set('ressources-sub',   r.sectionSub || r.subtitle || '');

    const carouselTrack = document.getElementById('carouselTrack');
    if (carouselTrack && r.items) {
      carouselTrack.innerHTML = r.items.map(item => `
        <div class="carousel-slide">
          <div class="carousel-slide-img">
            <img src="${item.image}" alt="${item.title}" onerror="this.style.display='none'"/>
            <span class="carousel-slide-badge">${item.badge}</span>
          </div>
          <div class="carousel-slide-body">
            <h4>${item.title}</h4>
            <p>${item.desc}</p>
            <a href="${item.file}" download>Télécharger le guide →</a>
          </div>
        </div>`).join('');
      initCarousel();
    }

    /* ARTICLES (3 derniers) */
    const articles = this.getArticles().slice(0, 3);
    const blogGrid = document.getElementById('blog-grid');
    if (blogGrid) {
      blogGrid.innerHTML = articles.map(art => `
        <a href="article.html?id=${art.id}" class="blog-card">
          <div class="blog-card-img">
            <img src="${art.image || ''}" alt="${art.title}"
              onerror="this.parentElement.style.background='linear-gradient(135deg,#112338,#1a3a5c)';this.style.display='none'"/>
          </div>
          <div class="blog-card-body">
            <div class="blog-meta">
              <span class="blog-tag">${art.categoryLabel || art.category || ''}</span>
              <span class="blog-date">${art.dateLabel || art.date || ''}</span>
            </div>
            <h3>${art.title}</h3>
            <p>${art.excerpt}</p>
            <span class="blog-card-link">Lire l'article →</span>
          </div>
        </a>`).join('');

      document.querySelectorAll('.blog-card').forEach(el => {
        el.style.opacity='0'; el.style.transform='translateY(28px)';
        el.style.transition='opacity 0.5s ease, transform 0.5s ease';
        scrollObserver.observe(el);
      });
    }

    /* CONTACT */
    const ct = c.contact || {};
    this.set('contact-label',   ct.sectionLabel || '');
    this.set('contact-title',   ct.sectionTitle || ct.title || '');
    this.set('contact-sub',     ct.sectionSub   || ct.subtitle || '');

    const emailLink = document.getElementById('contact-email-link') || document.querySelector('#contact-items a[href^="mailto"]');
    if (emailLink) { emailLink.textContent = ct.email; emailLink.href = 'mailto:' + ct.email; }
    const phoneLink = document.getElementById('contact-phone-link') || document.querySelector('#contact-items a[href^="tel"]');
    if (phoneLink) { phoneLink.textContent = ct.phone; phoneLink.href = 'tel:' + (ct.phone||'').replace(/\s/g,''); }
    const linkedinLink = document.getElementById('contact-linkedin-link');
    if (linkedinLink) linkedinLink.href = ct.linkedin || '#';

    /* Contact items block (index.html structure) */
    const contactItemsEl = document.getElementById('contact-items');
    if (contactItemsEl && ct.email) {
      contactItemsEl.innerHTML = `
        <div class="contact-item"><div class="contact-icon">📧</div><div><strong>Email</strong><a href="mailto:${ct.email}">${ct.email}</a></div></div>
        <div class="contact-item"><div class="contact-icon">📞</div><div><strong>Téléphone</strong><a href="tel:${(ct.phone||'').replace(/\s/g,'')}">${ct.phone}</a></div></div>
        <div class="contact-item"><div class="contact-icon">💼</div><div><strong>LinkedIn</strong><a href="${ct.linkedin}" target="_blank">${ct.linkedinLabel || 'Audrey Duval-Lebret'}</a></div></div>
      `;
    }

    /* FOOTER */
    const f = c.footer || {};
    this.set('footer-desc',      f.description || f.tagline || '');
    this.set('footer-copy',      f.copyright || '');
    this.set('footer-tagline',   f.tagline || f.description || '');
    this.set('footer-copyright', f.copyright || '');

    const fbLink = document.getElementById('footer-fb') || document.getElementById('footer-socials')?.querySelector('a:nth-child(1)');
    if (fbLink) fbLink.href = f.facebook || ct.facebook || '#';
    const liLink = document.getElementById('footer-li') || document.getElementById('footer-socials')?.querySelector('a:nth-child(2)');
    if (liLink) liLink.href = f.linkedin || ct.linkedin || '#';
    const gmLink = document.getElementById('footer-gm') || document.getElementById('footer-socials')?.querySelector('a:nth-child(3)');
    if (gmLink) gmLink.href = f.gmaps || ct.googleMaps || '#';

    /* Footer socials complet (index.html) */
    const footerSocialsEl = document.getElementById('footer-socials');
    if (footerSocialsEl) {
      footerSocialsEl.innerHTML = `
        <a href="${f.facebook || ct.facebook || '#'}" target="_blank" class="social-btn">f</a>
        <a href="${f.linkedin || ct.linkedin || '#'}" target="_blank" class="social-btn">in</a>
        <a href="${f.gmaps || ct.googleMaps || '#'}" target="_blank" class="social-btn">G</a>
      `;
    }

    /* Footer nav */
    const footerNavEl = document.getElementById('footer-nav');
    if (footerNavEl && c.nav && c.nav.links) {
      footerNavEl.innerHTML = c.nav.links.map(l => `<li><a href="${l.href}">${l.label}</a></li>`).join('');
      footerNavEl.innerHTML += `<li><a href="${c.nav.ctaHref || '#contact'}">Contact</a></li>`;
    }

    /* Nav logo */
    if (c.nav) {
      const navLogoImg = document.getElementById('nav-logo-img');
      if (navLogoImg && c.nav.logo) navLogoImg.src = c.nav.logo;

      const navLinksDesktop = document.getElementById('nav-links-desktop');
      const mobileMenu = document.getElementById('mobileMenu');
      if (navLinksDesktop && c.nav.links) {
        navLinksDesktop.innerHTML = c.nav.links.map(l =>
          `<li><a href="${l.href}">${l.label}</a></li>`
        ).join('');
        navLinksDesktop.innerHTML += `<li><a href="${c.nav.ctaHref}" class="btn-nav">${c.nav.ctaText}</a></li>`;
      }
      if (mobileMenu && c.nav.links) {
        mobileMenu.innerHTML = c.nav.links.map(l =>
          `<a href="${l.href}" onclick="toggleMenu()">${l.label}</a>`
        ).join('');
        mobileMenu.innerHTML += `<a href="${c.nav.ctaHref}" class="btn-nav" onclick="toggleMenu()">${c.nav.ctaText}</a>`;
      }
    }

    /* META */
    if (c.meta) {
      const metaTitle = document.getElementById('meta-title');
      if (metaTitle) metaTitle.textContent = c.meta.title || '';
      const metaDesc = document.getElementById('meta-desc');
      if (metaDesc) metaDesc.content = c.meta.description || '';
    }
  },

  /* ─────────────────────────────────────────────────
     PORTFOLIO
  ───────────────────────────────────────────────── */
  renderPortfolio() {
    const articles = this.getArticles();
    const grid = document.getElementById('articlesGrid');
    if (!grid) return;
    grid.innerHTML = articles.map(art => `
      <div class="article-card" data-category="${art.category || ''}">
        <div class="article-card-img-placeholder" data-initials="${(art.title||'').slice(0,2).toUpperCase()}">
          ${art.image ? `<img src="${art.image}" alt="${art.title}" class="article-card-img" onerror="this.style.display='none'"/>` : ''}
          <span class="tag-overlay">${art.categoryLabel || art.category || ''}</span>
        </div>
        <div class="article-card-body">
          <span class="article-tag">${art.categoryLabel || art.category || ''}</span>
          <h3>${art.title}</h3>
          <p>${art.excerpt}</p>
          <div class="article-meta">
            <span>${art.author || 'Audrey Duval-Lebret'}</span>
            <span class="dot"></span>
            <span>${art.dateLabel || art.date || ''}</span>
            <span class="dot"></span>
            <span>${art.readTime || ''}</span>
          </div>
          <a href="article.html?id=${art.id}" class="read-more">Lire l'article →</a>
        </div>
      </div>`).join('');

    document.querySelectorAll('.article-card').forEach(el => {
      el.style.opacity='0'; el.style.transform='translateY(24px)';
      el.style.transition='opacity 0.5s ease, transform 0.5s ease';
      scrollObserver.observe(el);
    });
  },

  /* ─────────────────────────────────────────────────
     RESSOURCES PAGE
  ───────────────────────────────────────────────── */
  renderRessources() {
    const r = this.cfg.ressources || {};
    this.set('ressources-page-label', r.sectionLabel || '');
    const t = (r.sectionTitle || r.title || '').replace(/\n/g,'<br/>');
    this.set('ressources-page-title', t);
    this.set('ressources-page-sub',   r.sectionSub || r.subtitle || '');

    const grid = document.getElementById('ressources-grid');
    if (!grid || !r.items) return;
    grid.innerHTML = r.items.map(item => `
      <div class="ressource-card">
        <div class="ressource-cover">
          <img src="${item.image}" alt="${item.title}" onerror="this.style.display='none';this.nextElementSibling.style.display='flex'"/>
          <div class="ressource-cover-placeholder" style="display:none;">
            <div class="cover-title">${item.title}</div>
            <div class="cover-sub">Guide pratique</div>
          </div>
          <span class="ressource-badge">Gratuit</span>
        </div>
        <div class="ressource-body">
          <h3>${item.title}</h3>
          <p>${item.desc}</p>
          <a href="${item.file}" download class="btn-download">
            <svg viewBox="0 0 24 24"><path d="M12 16l-5-5h3V4h4v7h3l-5 5zm-7 2h14v2H5v-2z"/></svg>
            Télécharger
          </a>
        </div>
      </div>`).join('');

    document.querySelectorAll('.ressource-card').forEach(el => {
      el.style.opacity='0'; el.style.transform='translateY(24px)';
      el.style.transition='opacity 0.5s ease, transform 0.5s ease';
      scrollObserver.observe(el);
    });
  },

  /* ─────────────────────────────────────────────────
     ARTICLE PAGE
  ───────────────────────────────────────────────── */
  renderArticle() {
    const params = new URLSearchParams(window.location.search);
    const id = params.get('id');
    const articles = this.getArticles();
    const art = articles.find(a => String(a.id) === String(id)) || articles[0];
    if (!art) return;

    document.title = art.title + ' – Procom Solution';

    this.set('article-category',  art.categoryLabel || art.category || '');
    this.set('article-title',     art.title);
    this.set('article-badge',     art.author || 'Audrey Duval-Lebret');
    this.set('article-date',      art.dateLabel || art.date || '');
    this.set('article-read-time', art.readTime || '5 min');
    this.set('article-author',    art.author || 'Audrey Duval-Lebret');
    this.set('cat-label',         art.categoryLabel || art.category || '');
    this.set('bc-title',          art.title);

    const heroImg = document.getElementById('article-hero-img');
    if (heroImg && art.image) heroImg.src = art.image;

    const body = document.getElementById('article-body');
    if (body) body.innerHTML = art.content || '';

    const tagsWrap = document.getElementById('article-tags-wrap');
    if (tagsWrap && art.tags) {
      tagsWrap.innerHTML = `<span>Tags :</span>` +
        art.tags.map(t => `<span class="tag-chip">${t}</span>`).join('');
    }

    // Partage
    const url   = encodeURIComponent(window.location.href);
    const title = encodeURIComponent(art.title);
    const shareLinks = {
      fb: `https://www.facebook.com/sharer/sharer.php?u=${url}`,
      tw: `https://twitter.com/intent/tweet?url=${url}&text=${title}`,
      li: `https://www.linkedin.com/sharing/share-offsite/?url=${url}`,
      wa: `https://wa.me/?text=${title}%20${url}`,
    };
    ['fb','tw','li','wa'].forEach(net => {
      ['share-','sw-'].forEach(prefix => {
        const el = document.getElementById(prefix + net);
        if (el) el.href = shareLinks[net];
      });
    });

    // Articles similaires
    const others = articles.filter(a => String(a.id) !== String(art.id));
    const related = others.filter(a => a.category === art.category).slice(0,3)
      .concat(others.filter(a => a.category !== art.category)).slice(0,3);

    const relGrid = document.getElementById('related-grid');
    if (relGrid) {
      relGrid.innerHTML = related.map(ra => `
        <a href="article.html?id=${ra.id}" class="related-card">
          <div class="related-card-img">
            ${ra.image ? `<img src="${ra.image}" alt="${ra.title}"/>` : ''}
            <span class="related-card-img-icon">${ra.category === 'interview' ? '🎙' : ra.category === 'portrait' ? '👤' : ra.category === 'conseil' ? '💡' : '📝'}</span>
          </div>
          <div class="related-card-body">
            <div class="related-card-cat">${ra.categoryLabel || ra.category || ''}</div>
            <div class="related-card-title">${ra.title}</div>
          </div>
        </a>`).join('');
    }

    // Sidebar – autres articles
    const moreEl = document.getElementById('more-posts');
    if (moreEl) {
      moreEl.innerHTML = articles.filter(a => String(a.id) !== String(art.id)).slice(0,5).map(ma => `
        <a href="article.html?id=${ma.id}" class="more-post-item">
          <div class="more-post-thumb">
            ${ma.image ? `<img src="${ma.image}" alt="${ma.title}"/>` : '🎧'}
          </div>
          <div class="more-post-info">
            <div class="more-post-cat">${ma.categoryLabel || ma.category || ''}</div>
            <div class="more-post-title">${ma.title}</div>
            <div class="more-post-date">${ma.dateLabel || ma.date || ''}</div>
          </div>
        </a>`).join('');
    }
  }
};

/* ─────────────────────────────────────────────────
   CAROUSEL (index)
───────────────────────────────────────────────── */
let carouselCurrent = 0, carouselTimer = null;

function initCarousel() {
  const track   = document.getElementById('carouselTrack');
  const dotsEl  = document.getElementById('carouselDots');
  const prevBtn = document.getElementById('prevBtn');
  const nextBtn = document.getElementById('nextBtn');
  if (!track || !dotsEl) return;

  const slides = track.querySelectorAll('.carousel-slide');
  carouselCurrent = 0;

  function getVisible() {
    return window.innerWidth <= 600 ? 1 : window.innerWidth <= 900 ? 2 : 3;
  }
  function totalPages() { return Math.max(1, slides.length - getVisible() + 1); }

  function buildDots() {
    dotsEl.innerHTML = '';
    for (let i = 0; i < totalPages(); i++) {
      const d = document.createElement('button');
      d.className = 'carousel-dot' + (i === carouselCurrent ? ' active' : '');
      d.addEventListener('click', () => goTo(i));
      dotsEl.appendChild(d);
    }
  }

  function updateDots() {
    dotsEl.querySelectorAll('.carousel-dot').forEach((d,i) =>
      d.classList.toggle('active', i === carouselCurrent));
  }

  function goTo(idx) {
    carouselCurrent = Math.max(0, Math.min(idx, totalPages() - 1));
    const w = slides[0] ? slides[0].getBoundingClientRect().width + 24 : 0;
    track.style.transform = `translateX(-${carouselCurrent * w}px)`;
    updateDots();
  }

  function next() { goTo(carouselCurrent + 1 >= totalPages() ? 0 : carouselCurrent + 1); }
  function prev() { goTo(carouselCurrent - 1 < 0 ? totalPages() - 1 : carouselCurrent - 1); }

  if (prevBtn) prevBtn.onclick = () => { clearInterval(carouselTimer); prev(); startAuto(); };
  if (nextBtn) nextBtn.onclick = () => { clearInterval(carouselTimer); next(); startAuto(); };

  function startAuto() { carouselTimer = setInterval(next, 4000); }

  const wrapper = track.parentElement;
  if (wrapper) {
    wrapper.addEventListener('mouseenter', () => clearInterval(carouselTimer));
    wrapper.addEventListener('mouseleave', startAuto);
  }

  let touchStartX = 0;
  track.addEventListener('touchstart', e => { touchStartX = e.touches[0].clientX; }, { passive: true });
  track.addEventListener('touchend', e => {
    const diff = touchStartX - e.changedTouches[0].clientX;
    if (Math.abs(diff) > 40) { clearInterval(carouselTimer); diff > 0 ? next() : prev(); startAuto(); }
  });

  buildDots(); goTo(0); startAuto();
  window.addEventListener('resize', () => { buildDots(); goTo(0); });
}

/* ─────────────────────────────────────────────────
   SCROLL OBSERVER
───────────────────────────────────────────────── */
const scrollObserver = new IntersectionObserver(entries => {
  entries.forEach(e => {
    if (e.isIntersecting) {
      e.target.style.opacity = '1';
      e.target.style.transform = 'translateY(0)';
    }
  });
}, { threshold: 0.1 });

/* ─────────────────────────────────────────────────
   NAV
───────────────────────────────────────────────── */
function toggleMenu() {
  const m = document.getElementById('mobileMenu');
  if (m) m.classList.toggle('open');
}
window.addEventListener('scroll', () => {
  const h = document.querySelector('header');
  if (h) h.style.boxShadow = window.scrollY > 20
    ? '0 4px 24px rgba(17,35,56,0.12)' : 'none';
});

/* ─────────────────────────────────────────────────
   CONTACT FORM
───────────────────────────────────────────────── */
function handleContactForm(e) {
  e.preventDefault();
  const fd = new FormData(e.target);
  const msgs = JSON.parse(localStorage.getItem('procom_messages') || '[]');
  msgs.unshift({
    date: new Date().toLocaleString('fr-FR'),
    prenom: fd.get('prenom'),
    nom: fd.get('nom'),
    email: fd.get('email'),
    sujet: fd.get('sujet'),
    message: fd.get('message')
  });
  localStorage.setItem('procom_messages', JSON.stringify(msgs));
  e.target.reset();
  const ok = document.getElementById('form-success');
  if (ok) { ok.style.display = 'block'; setTimeout(() => ok.style.display = 'none', 5000); }
}

/* ─────────────────────────────────────────────────
   BOOT
───────────────────────────────────────────────── */
document.addEventListener('DOMContentLoaded', () => {
  PROCOM.load();

  // Observer cartes statiques
  setTimeout(() => {
    document.querySelectorAll('.offre-card, .temoignage-card, .blog-card').forEach(el => {
      el.style.opacity='0'; el.style.transform='translateY(28px)';
      el.style.transition='opacity 0.5s ease, transform 0.5s ease';
      scrollObserver.observe(el);
    });
  }, 100);

  // Form contact
  const form = document.getElementById('contactForm') || document.querySelector('.contact-form');
  if (form) form.addEventListener('submit', handleContactForm);
});