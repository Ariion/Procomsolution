/* =====================================================
   PROCOM SOLUTION – site.js
   Charge config.json (ou localStorage) et hydrate les pages
   ===================================================== */

window.PROCOM = {

  cfg: null,

  /* ── CHARGEMENT ── */
  async load() {
    // 1. localStorage (admin saves here)
    const saved = localStorage.getItem('procom_config');
    if (saved) { try { this.cfg = JSON.parse(saved); } catch(e){} }

    // 2. fallback → config.json
    if (!this.cfg) {
      try {
        const r = await fetch('config.json?' + Date.now());
        if (r.ok) this.cfg = await r.json();
      } catch(e) {}
    }

    if (!this.cfg) { console.warn('PROCOM: aucune config chargée'); return; }

    this.applyColors();
    this.applyFont();
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

  applyFont() {
    const t = this.cfg.typography || {};
    if (t.font && t.font !== 'Inter') {
      const link = document.createElement('link');
      link.rel = 'stylesheet';
      link.href = `https://fonts.googleapis.com/css2?family=${t.font.replace(/ /,'+')}:wght@300;400;500;600;700&display=swap`;
      document.head.appendChild(link);
      document.body.style.fontFamily = `'${t.font}', sans-serif`;
    }
    if (t.sizeBase) document.documentElement.style.fontSize = t.sizeBase;
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

  /* ─────────────────────────────────────────────────
     INDEX
  ───────────────────────────────────────────────── */
  renderIndex() {
    const c = this.cfg;

    /* HERO */
    const h = c.hero || {};
    this.set('hero-badge',      h.badge || '');
    this.set('hero-title',      `${h.title || ''}<br/><span>${h.titleAccent || ''}</span><br/>${h.titleEnd || ''}`);
    this.set('hero-subtitle',   h.subtitle || '');
    if (h.btn1Text) {
      const b1 = document.getElementById('hero-btn1');
      if (b1) { b1.textContent = h.btn1Text; b1.href = h.btn1Link || '#'; }
    }
    if (h.btn2Text) {
      const b2 = document.getElementById('hero-btn2');
      if (b2) { b2.textContent = h.btn2Text; b2.href = h.btn2Link || '#'; }
    }
    const img = document.getElementById('hero-img');
    if (img && h.image) img.src = h.image;
    if (h.tagTitle) this.set('hero-tag-title', h.tagTitle);
    if (h.tagSub)   this.set('hero-tag-sub',   h.tagSub);

    /* HERO STATS */
    const statsEl = document.getElementById('hero-stats');
    if (statsEl && h.stats) {
      statsEl.innerHTML = h.stats.map(s => `
        <div class="stat">
          <strong>${s.value}</strong>
          <span>${s.label.replace(/\n/g,'<br/>')}</span>
        </div>`).join('');
    }

    /* OFFRES */
    const o = c.offres || {};
    this.set('offres-label',    o.sectionLabel || '');
    this.set('offres-title',    o.sectionTitle ? o.sectionTitle.replace(/\n/g,'<br/>') : '');
    this.set('offres-sub',      o.sectionSub   || '');
    const offresGrid = document.getElementById('offres-grid');
    if (offresGrid && o.items) {
      offresGrid.innerHTML = o.items.map(item => `
        <div class="offre-card${item.featured ? ' featured' : ''}">
          ${item.badge ? `<div class="badge-recommande">${item.badge}</div>` : ''}
          <div class="offre-icon">${item.icon}</div>
          <p class="offre-tag">${item.tag}</p>
          <h3>${item.title}</h3>
          <p>${item.desc}</p>
          <ul>${item.features.map(f => `<li>${f}</li>`).join('')}</ul>
          <a href="${item.btnLink}" class="btn-${item.btnStyle}">${item.btnText}</a>
        </div>`).join('');
    }

    /* À PROPOS */
    const a = c.apropos || {};
    this.set('apropos-label', a.sectionLabel || '');
    this.set('apropos-title', a.sectionTitle ? a.sectionTitle.replace(/\n/g,'<br/>') : '');
    const aproposText = document.getElementById('apropos-paragraphs');
    if (aproposText && a.paragraphs) {
      aproposText.innerHTML = a.paragraphs.map(p => `<p>${p}</p>`).join('');
    }
    const aproposTags = document.getElementById('apropos-tags');
    if (aproposTags && a.tags) {
      aproposTags.innerHTML = a.tags.map(t => `<span class="tag">${t}</span>`).join('');
    }
    const aproposBtn = document.getElementById('apropos-btn');
    if (aproposBtn) { aproposBtn.textContent = a.btnText || ''; aproposBtn.href = a.btnLink || '#'; }
    const aproposImg = document.getElementById('apropos-img');
    if (aproposImg && a.image) aproposImg.src = a.image;

    /* TÉMOIGNAGES */
    const t = c.temoignages || {};
    this.set('temoignages-label', t.sectionLabel || '');
    this.set('temoignages-title', t.sectionTitle || '');
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
              <span>${item.role} · ${item.date}</span>
            </div>
          </div>
        </div>`).join('');
    }
    if (t.googleRating) this.set('google-rating', t.googleRating);
    if (t.googleCount)  this.set('google-count',  t.googleCount);
    const googleLink = document.getElementById('google-all-link');
    if (googleLink && t.googleLink) googleLink.href = t.googleLink;

    /* RESSOURCES CAROUSEL */
    const r = c.ressources || {};
    this.set('ressources-label', r.sectionLabel || '');
    this.set('ressources-title', r.sectionTitle ? r.sectionTitle.replace(/\n/g,'<br/>') : '');
    this.set('ressources-sub',   r.sectionSub   || '');
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
    const articles = (c.articles || []).slice(0, 3);
    const blogGrid = document.getElementById('blog-grid');
    if (blogGrid) {
      blogGrid.innerHTML = articles.map(art => `
        <a href="article.html?id=${art.id}" class="blog-card">
          <div class="blog-card-img">
            <img src="${art.image || ''}" alt="${art.title}"
              onerror="this.style.background='linear-gradient(135deg,#112338,#1a3a5c)';this.style.display='none'"/>
          </div>
          <div class="blog-card-body">
            <div class="blog-meta">
              <span class="blog-tag">${art.categoryLabel}</span>
              <span class="blog-date">${art.dateLabel}</span>
            </div>
            <h3>${art.title}</h3>
            <p>${art.excerpt}</p>
            <span class="blog-card-link">Lire l'article →</span>
          </div>
        </a>`).join('');
      // ré-observer les nouvelles cartes
      document.querySelectorAll('.blog-card').forEach(el => {
        el.style.opacity='0'; el.style.transform='translateY(28px)';
        el.style.transition='opacity 0.5s ease, transform 0.5s ease';
        scrollObserver.observe(el);
      });
    }

    /* CONTACT */
    const ct = c.contact || {};
    this.set('contact-label',    ct.sectionLabel || '');
    this.set('contact-title',    ct.sectionTitle || '');
    this.set('contact-sub',      ct.sectionSub   || '');
    const emailLink = document.getElementById('contact-email-link');
    if (emailLink) { emailLink.textContent = ct.email; emailLink.href = 'mailto:' + ct.email; }
    const phoneLink = document.getElementById('contact-phone-link');
    if (phoneLink) { phoneLink.textContent = ct.phone; phoneLink.href = 'tel:' + (ct.phone||'').replace(/\s/g,''); }
    const linkedinLink = document.getElementById('contact-linkedin-link');
    if (linkedinLink) linkedinLink.href = ct.linkedin || '#';

    /* FOOTER */
    const f = c.footer || {};
    this.set('footer-tagline',   f.tagline   || '');
    this.set('footer-copyright', f.copyright || '');
    const fbLink = document.getElementById('footer-fb');
    if (fbLink && ct.facebook) fbLink.href = ct.facebook;
    const liLink = document.getElementById('footer-li');
    if (liLink && ct.linkedin) liLink.href = ct.linkedin;
    const gmLink = document.getElementById('footer-gm');
    if (gmLink && ct.googleMaps) gmLink.href = ct.googleMaps;
  },

  /* ─────────────────────────────────────────────────
     PORTFOLIO
  ───────────────────────────────────────────────── */
  renderPortfolio() {
    const articles = this.cfg.articles || [];
    const grid = document.getElementById('articlesGrid');
    if (!grid) return;
    grid.innerHTML = articles.map(art => `
      <div class="article-card" data-category="${art.category}">
        <div class="article-card-img-placeholder" data-initials="${art.title.slice(0,2).toUpperCase()}">
          ${art.image ? `<img src="${art.image}" alt="${art.title}" class="article-card-img" onerror="this.style.display='none'"/>` : ''}
          <span class="tag-overlay">${art.categoryLabel}</span>
        </div>
        <div class="article-card-body">
          <span class="article-tag">${art.categoryLabel}</span>
          <h3>${art.title}</h3>
          <p>${art.excerpt}</p>
          <div class="article-meta">
            <span>${art.author}</span>
            <span class="dot"></span>
            <span>${art.dateLabel}</span>
            <span class="dot"></span>
            <span>${art.readTime}</span>
          </div>
          <a href="article.html?id=${art.id}" class="read-more">Lire l'article →</a>
        </div>
      </div>`).join('');

    // Observer
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
    this.set('ressources-page-title', r.sectionTitle ? r.sectionTitle.replace(/\n/g,'<br/>') : '');
    this.set('ressources-page-sub',   r.sectionSub   || '');
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
    const articles = this.cfg.articles || [];
    const art = articles.find(a => a.id === id) || articles[0];
    if (!art) return;

    document.title = art.title + ' – Procom Solution';

    this.set('article-category',  art.categoryLabel);
    this.set('article-title',     art.title);
    this.set('article-badge',     art.author);
    this.set('article-date',      art.dateLabel);
    this.set('article-read-time', art.readTime);
    this.set('article-author',    art.author);
    this.set('cat-label',         art.categoryLabel);
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
    const url = encodeURIComponent(window.location.href);
    const title = encodeURIComponent(art.title);
    ['fb','tw','li','wa'].forEach(net => {
      const el = document.getElementById('share-' + net);
      if (!el) return;
      const links = {
        fb: `https://www.facebook.com/sharer/sharer.php?u=${url}`,
        tw: `https://twitter.com/intent/tweet?url=${url}&text=${title}`,
        li: `https://www.linkedin.com/sharing/share-offsite/?url=${url}`,
        wa: `https://wa.me/?text=${title}%20${url}`,
      };
      el.href = links[net];
    });

    // Articles similaires
    const related = articles.filter(a => a.id !== art.id && a.category === art.category).slice(0,3)
      .concat(articles.filter(a => a.id !== art.id && a.category !== art.category)).slice(0,3);
    const relGrid = document.getElementById('related-grid');
    if (relGrid) {
      relGrid.innerHTML = related.slice(0,3).map(ra => `
        <a href="article.html?id=${ra.id}" class="related-card">
          <div class="related-card-img">
            ${ra.image ? `<img src="${ra.image}" alt="${ra.title}"/>` : ''}
            <span class="related-card-img-icon">${ra.category === 'interview' ? '🎙' : ra.category === 'portrait' ? '👤' : ra.category === 'conseil' ? '💡' : '📝'}</span>
          </div>
          <div class="related-card-body">
            <div class="related-card-cat">${ra.categoryLabel}</div>
            <div class="related-card-title">${ra.title}</div>
            <div class="related-card-meta">${ra.author} · ${ra.dateLabel}</div>
          </div>
        </a>`).join('');
    }

    // Autres articles sidebar
    const moreEl = document.getElementById('more-posts');
    if (moreEl) {
      moreEl.innerHTML = articles.filter(a => a.id !== art.id).slice(0,5).map(ma => `
        <a href="article.html?id=${ma.id}" class="more-post-item">
          <div class="more-post-thumb">
            ${ma.image ? `<img src="${ma.image}" alt="${ma.title}"/>` : '🎧'}
          </div>
          <div class="more-post-info">
            <div class="more-post-cat">${ma.categoryLabel}</div>
            <div class="more-post-title">${ma.title}</div>
            <div class="more-post-date">${ma.dateLabel}</div>
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
    dotsEl.querySelectorAll('.carousel-dot').forEach((d,i) => d.classList.toggle('active', i === carouselCurrent));
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
    if (e.isIntersecting) { e.target.style.opacity='1'; e.target.style.transform='translateY(0)'; }
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
  if (h) h.style.boxShadow = window.scrollY > 20 ? '0 4px 24px rgba(17,35,56,0.12)' : 'none';
});

/* ─────────────────────────────────────────────────
   CONTACT FORM
───────────────────────────────────────────────── */
function handleContactForm(e) {
  e.preventDefault();
  const btn = e.target.querySelector('[type=submit]') || e.target.querySelector('.form-submit');
  if (btn) { btn.textContent = '✅ Message envoyé !'; btn.disabled = true; }
  setTimeout(() => {
    if (btn) { btn.textContent = '→ Envoyer le message'; btn.disabled = false; }
    e.target.reset();
  }, 3000);
}

/* ─────────────────────────────────────────────────
   BOOT
───────────────────────────────────────────────── */
document.addEventListener('DOMContentLoaded', () => {
  PROCOM.load();

  // Observer cartes statiques
  document.querySelectorAll('.offre-card, .temoignage-card, .blog-card').forEach(el => {
    el.style.opacity='0'; el.style.transform='translateY(28px)';
    el.style.transition='opacity 0.5s ease, transform 0.5s ease';
    scrollObserver.observe(el);
  });

  // Form
  const form = document.querySelector('.contact-form');
  if (form) form.addEventListener('submit', handleContactForm);
});
