/* =====================================================
   PROCOM SOLUTION – site.js v2
   Moteur de rendu partagé par toutes les pages.
   Lit depuis localStorage "procom_data" (écrit par admin).
   ===================================================== */

window.PROCOM = {
  cfg: null,

  async load() {
    const saved = localStorage.getItem('procom_data');
    if (saved) { try { this.cfg = JSON.parse(saved); } catch(e) {} }
    if (!this.cfg) {
      try {
        const r = await fetch('config.json?' + Date.now());
        if (r.ok) this.cfg = await r.json();
      } catch(e) {}
    }
    if (!this.cfg) { console.warn('PROCOM: aucune config'); return; }
    this.applyColors();
    this.renderNav();
    this.renderFooter();
    this.renderPage();
  },

  applyColors() {
    const c = this.cfg.colors || {};
    const r = document.documentElement;
    r.style.setProperty('--turquoise', c.turquoise || '#509ea4');
    r.style.setProperty('--navy',      c.navy      || '#112338');
    r.style.setProperty('--white',     c.white     || '#ffffff');
    r.style.setProperty('--light-bg',  c.lightBg   || '#f4f8f9');
    r.style.setProperty('--text-dark', c.textDark  || '#112338');
    r.style.setProperty('--text-mid',  c.textMid   || '#3a5068');
    r.style.setProperty('--text-light',c.textLight || '#6b8a9a');
  },

  /* ── NAV (commune à toutes les pages) ── */
  renderNav() {
    const nav = this.cfg.nav || {};
    const logoImg = document.getElementById('nav-logo-img');
    if (logoImg && nav.logo) logoImg.src = nav.logo;

    const desktop = document.getElementById('nav-links-desktop');
    const mobile  = document.getElementById('mobileMenu');
    if (!desktop || !nav.links) return;

    desktop.innerHTML = nav.links.map(l =>
      `<li><a href="${l.href}">${l.label}</a></li>`
    ).join('') + `<li><a href="${nav.ctaHref || '#contact'}" class="btn-nav">${nav.ctaText || 'Prendre RDV'}</a></li>`;

    if (mobile) {
      mobile.innerHTML = nav.links.map(l =>
        `<a href="${l.href}" onclick="toggleMenu()">${l.label}</a>`
      ).join('') + `<a href="${nav.ctaHref || '#contact'}" class="btn-nav" onclick="toggleMenu()">${nav.ctaText || 'Prendre RDV'}</a>`;
    }
  },

  /* ── FOOTER (commun à toutes les pages) ── */
  renderFooter() {
    const f  = this.cfg.footer  || {};
    const ct = this.cfg.contact || {};
    const nav = this.cfg.nav    || {};

    const descEl = document.getElementById('footer-desc');
    if (descEl) descEl.textContent = f.description || f.tagline || '';
    const copyEl = document.getElementById('footer-copy') || document.getElementById('footer-copyright');
    if (copyEl) copyEl.textContent = f.copyright || '';

    const socialsEl = document.getElementById('footer-socials');
    if (socialsEl) {
      socialsEl.innerHTML = `
        <a href="${f.facebook || '#'}" target="_blank" class="social-btn">f</a>
        <a href="${f.linkedin || ct.linkedin || '#'}" target="_blank" class="social-btn">in</a>
        <a href="${f.gmaps || '#'}" target="_blank" class="social-btn">G</a>`;
    }

    const footerNav = document.getElementById('footer-nav');
    if (footerNav && nav.links) {
      footerNav.innerHTML = nav.links.map(l =>
        `<li><a href="${l.href}">${l.label}</a></li>`
      ).join('') + `<li><a href="${nav.ctaHref || '#contact'}">Contact</a></li>`;
    }
  },

  /* ── ROUTING ── */
  renderPage() {
    const page = document.body.dataset.page;
    const meta = this.cfg.meta || {};
    const titleEl = document.getElementById('meta-title');
    if (titleEl) titleEl.textContent = meta.title || 'Procom Solution';
    const descEl = document.getElementById('meta-desc');
    if (descEl) descEl.content = meta.description || '';

    if (page === 'index')      this.renderIndex();
    if (page === 'portfolio')  this.renderPortfolio();
    if (page === 'ressources') this.renderRessources();
    if (page === 'article')    this.renderArticle();
  },

  /* ── helpers ── */
  $: (id) => document.getElementById(id),
  set(id, html) { const el = this.$(id); if (el) el.innerHTML = html; },
  txt(id, t)   { const el = this.$(id); if (el) el.textContent = t; },
  stars(n)     { return '★'.repeat(n) + '☆'.repeat(5 - n); },
  getArticles() {
    const a = this.cfg.articles;
    if (!a) return [];
    return Array.isArray(a) ? a : (a.items || []);
  },

  /* ════════════════════════════════════════
     INDEX
  ════════════════════════════════════════ */
  renderIndex() {
    const c = this.cfg;

    /* META */
    const m = c.meta || {};
    const titleEl = document.getElementById('meta-title');
    if (titleEl) titleEl.textContent = m.title || 'Procom Solution';

    /* HERO */
    const h = c.hero || {};
    this.set('hero-badge', h.badge || '');
    this.set('hero-title', `${h.title||''}<br/><span>${h.titleSpan||h.titleAccent||''}</span><br/>${h.titleEnd||''}`);
    this.txt('hero-subtitle', h.subtitle || '');

    const b1 = this.$('hero-btn1');
    if (b1) { b1.textContent = h.btn1Text || ''; b1.href = h.btn1Href || h.btn1Link || '#contact'; }
    const b2 = this.$('hero-btn2');
    if (b2) { b2.textContent = h.btn2Text || ''; b2.href = h.btn2Href || h.btn2Link || '#offres'; }

    const hImg = this.$('hero-img');
    if (hImg && h.image) { hImg.src = h.image; hImg.alt = h.imageAlt || ''; }

    this.txt('hero-tag-emoji', h.tagEmoji || '');
    this.txt('hero-tag-title', h.tagTitle || '');
    this.txt('hero-tag-sub',   h.tagSub   || '');

    const statsEl = this.$('hero-stats');
    if (statsEl && h.stats) {
      statsEl.innerHTML = h.stats.map(s =>
        `<div class="stat"><strong>${s.value}</strong><span>${(s.label||'').replace(/\n/g,'<br/>')}</span></div>`
      ).join('');
    }

    /* OFFRES */
    const o = c.offres || {};
    this.txt('offres-label', o.sectionLabel || '');
    this.set('offres-title', (o.title||o.sectionTitle||'').replace(/\n/g,'<br/>'));
    this.txt('offres-sub',   o.subtitle || o.sectionSub || '');
    const og = this.$('offres-grid');
    if (og && o.items) {
      og.innerHTML = o.items.map(item => `
        <div class="offre-card${item.featured?' featured':''}">
          ${item.badge?`<div class="badge-recommande">${item.badge}</div>`:''}
          <div class="offre-icon">${item.icon}</div>
          <p class="offre-tag">${item.tag}</p>
          <h3>${item.title||item.name||''}</h3>
          <p>${item.desc}</p>
          <ul>${(item.features||[]).map(f=>`<li>${f}</li>`).join('')}</ul>
          <a href="${item.btnLink||item.btnHref||'#contact'}" class="btn-${item.btnStyle||'outline'}">${item.btnText}</a>
        </div>`).join('');
    }

    /* À PROPOS */
    const a = c.apropos || {};
    this.txt('apropos-label', a.sectionLabel || '');
    this.set('apropos-title', (a.title||a.sectionTitle||'').replace(/\n/g,'<br/>'));
    const aImg = this.$('apropos-img');
    if (aImg && a.image) { aImg.src = a.image; aImg.alt = a.imageAlt || ''; }
    const aC = this.$('apropos-content');
    if (aC) aC.innerHTML = (a.content||a.paragraphs||[]).map(p=>`<p>${p}</p>`).join('');
    const aT = this.$('apropos-tags');
    if (aT) aT.innerHTML = (a.tags||[]).map(t=>`<span class="tag">${t}</span>`).join('');
    const aBtn = this.$('apropos-btn');
    if (aBtn) { aBtn.textContent = a.btnText||''; aBtn.href = a.btnHref||a.btnLink||'#contact'; }

    /* TÉMOIGNAGES */
    const t = c.temoignages || {};
    this.txt('temoignages-label', t.sectionLabel||'');
    this.txt('temoignages-title', t.title||t.sectionTitle||'');
    const tg = this.$('temoignages-grid');
    if (tg && t.items) {
      tg.innerHTML = t.items.map(item=>`
        <div class="temoignage-card">
          <div class="stars">${this.stars(item.stars)}</div>
          <blockquote>"${item.text}"</blockquote>
          <div class="temoignage-author">
            <div class="avatar">${item.initials}</div>
            <div class="author-info"><strong>${item.name}</strong><span>${item.role}</span></div>
          </div>
        </div>`).join('');
    }
    const gnEl = this.$('google-note');
    if (gnEl) gnEl.textContent = t.googleNote || t.googleRating || '5.0 / 5';
    const gcEl = this.$('google-count');
    if (gcEl) gcEl.textContent = 'Basée sur ' + (t.googleCount||'2');
    const liBtn = this.$('linkedin-btn');
    if (liBtn) liBtn.href = t.linkedinHref||t.googleLink||'#';

    /* RESSOURCES CAROUSEL */
    const r = c.ressources || {};
    this.txt('ressources-label', r.sectionLabel||'');
    this.set('ressources-title', (r.title||r.sectionTitle||'').replace(/\n/g,'<br/>'));
    this.txt('ressources-sub',   r.subtitle||r.sectionSub||'');
    const ct = this.$('carouselTrack');
    if (ct && r.items) {
      ct.innerHTML = r.items.map(item=>`
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

    /* ARTICLES – 3 derniers */
    const articles = this.getArticles().slice(0,3);
    const bg = this.$('blog-grid');
    if (bg) {
      const artSection = c.articles || {};
      this.txt('articles-label', artSection.sectionLabel||'Articles');
      this.txt('articles-title', artSection.title||'Ressources & conseils');
      bg.innerHTML = articles.map(art=>`
        <a href="article.html?id=${art.id}" class="blog-card">
          <div class="blog-card-img">
            ${art.image?`<img src="${art.image}" alt="${art.title}" onerror="this.parentElement.style.background='linear-gradient(135deg,#112338,#1a3a5c)';this.style.display='none'"/>`:''}
          </div>
          <div class="blog-card-body">
            <div class="blog-meta">
              <span class="blog-tag">${art.categoryLabel||art.category||''}</span>
              <span class="blog-date">${art.dateLabel||art.date||''}</span>
            </div>
            <h3>${art.title}</h3>
            <p class="excerpt">${art.excerpt}</p>
            <span class="blog-card-link">Lire l'article →</span>
          </div>
        </a>`).join('');
      document.querySelectorAll('.blog-card').forEach(el => {
        el.style.opacity='0'; el.style.transform='translateY(28px)';
        el.style.transition='opacity 0.5s ease,transform 0.5s ease';
        scrollObserver.observe(el);
      });
    }

    /* CONTACT */
    const con = c.contact || {};
    this.txt('contact-label',   con.sectionLabel||'');
    this.txt('contact-title',   con.title||'');
    this.txt('contact-sub',     con.subtitle||'');
    const ciEl = this.$('contact-items');
    if (ciEl) {
      ciEl.innerHTML = `
        <div class="contact-item"><div class="contact-icon">📧</div><div><strong>Email</strong><a href="mailto:${con.email}">${con.email}</a></div></div>
        <div class="contact-item"><div class="contact-icon">📞</div><div><strong>Téléphone</strong><a href="tel:${(con.phone||'').replace(/\s/g,'')}">${con.phone}</a></div></div>
        <div class="contact-item"><div class="contact-icon">💼</div><div><strong>LinkedIn</strong><a href="${con.linkedin}" target="_blank">${con.linkedinLabel||'Audrey Duval-Lebret'}</a></div></div>`;
    }
  },

  /* ════════════════════════════════════════
     PORTFOLIO
  ════════════════════════════════════════ */
  renderPortfolio() {
    const articles = this.getArticles();
    const artSection = this.cfg.articles || {};
    const grid = this.$('articlesGrid');
    if (!grid) return;

    grid.innerHTML = articles.map(art=>`
      <div class="article-card" data-category="${(art.category||'').toLowerCase()}">
        <div class="article-card-img-placeholder" data-initials="${(art.title||'').slice(0,2).toUpperCase()}">
          ${art.image?`<img src="${art.image}" alt="${art.title}" class="article-card-img" onerror="this.style.display='none'"/>`:''}
          <span class="tag-overlay">${art.categoryLabel||art.category||''}</span>
        </div>
        <div class="article-card-body">
          <span class="article-tag">${art.categoryLabel||art.category||''}</span>
          <h3>${art.title}</h3>
          <p>${art.excerpt}</p>
          <div class="article-meta">
            <span>${art.author||'Audrey Duval-Lebret'}</span>
            <span class="dot"></span>
            <span>${art.dateLabel||art.date||''}</span>
            <span class="dot"></span>
            <span>${art.readTime||''}</span>
          </div>
          <a href="article.html?id=${art.id}" class="read-more">Lire l'article →</a>
        </div>
      </div>`).join('');

    document.querySelectorAll('.article-card').forEach(el=>{
      el.style.opacity='0'; el.style.transform='translateY(24px)';
      el.style.transition='opacity 0.5s ease,transform 0.5s ease';
      scrollObserver.observe(el);
    });
  },

  /* ════════════════════════════════════════
     RESSOURCES PAGE
  ════════════════════════════════════════ */
  renderRessources() {
    const r = this.cfg.ressources || {};
    this.txt('ressources-page-label', r.sectionLabel||'');
    this.set('ressources-page-title', (r.title||r.sectionTitle||'').replace(/\n/g,'<br/>'));
    this.txt('ressources-page-sub',   r.subtitle||r.sectionSub||'');
    const grid = this.$('ressources-grid');
    if (!grid||!r.items) return;
    grid.innerHTML = r.items.map(item=>`
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
    document.querySelectorAll('.ressource-card').forEach(el=>{
      el.style.opacity='0'; el.style.transform='translateY(24px)';
      el.style.transition='opacity 0.5s ease,transform 0.5s ease';
      scrollObserver.observe(el);
    });
  },

  /* ════════════════════════════════════════
     ARTICLE PAGE
  ════════════════════════════════════════ */
  renderArticle() {
    const params = new URLSearchParams(window.location.search);
    const id = params.get('id');
    const articles = this.getArticles();
    const art = articles.find(a => String(a.id) === String(id)) || articles[0];
    if (!art) { document.getElementById('article-body').innerHTML = '<p>Article introuvable.</p>'; return; }

    document.title = art.title + ' – Procom Solution';
    this.txt('article-category',  art.categoryLabel||art.category||'');
    this.txt('cat-label',         art.categoryLabel||art.category||'');
    this.set('article-title',     art.title);
    this.txt('article-badge',     art.author||'Audrey Duval-Lebret');
    this.txt('article-date',      art.dateLabel||art.date||'');
    this.txt('article-read-time', art.readTime||'5 min');
    this.txt('article-author',    art.author||'Audrey Duval-Lebret');
    this.set('bc-title',          art.title);

    const hImg = this.$('article-hero-img');
    if (hImg && art.image) hImg.src = art.image;

    const body = this.$('article-body');
    if (body) body.innerHTML = art.content || '';

    const tagsWrap = this.$('article-tags-wrap');
    if (tagsWrap && art.tags) {
      tagsWrap.innerHTML = `<span>Tags :</span>` + (art.tags||[]).map(t=>`<span class="tag-chip">${t}</span>`).join('');
    }

    // Partage
    const url = encodeURIComponent(window.location.href);
    const title = encodeURIComponent(art.title);
    const links = {
      fb: `https://www.facebook.com/sharer/sharer.php?u=${url}`,
      tw: `https://twitter.com/intent/tweet?url=${url}&text=${title}`,
      li: `https://www.linkedin.com/sharing/share-offsite/?url=${url}`,
      wa: `https://wa.me/?text=${title}%20${url}`
    };
    ['fb','tw','li','wa'].forEach(net => {
      ['share-','sw-'].forEach(pfx => { const el = this.$(pfx+net); if(el) el.href = links[net]; });
    });

    // Articles liés
    const others = articles.filter(a => String(a.id) !== String(art.id));
    const related = others.filter(a=>a.category===art.category).concat(others.filter(a=>a.category!==art.category)).slice(0,3);
    const rg = this.$('related-grid');
    if (rg) {
      rg.innerHTML = related.map(ra=>`
        <a href="article.html?id=${ra.id}" class="related-card">
          <div class="related-card-img">
            ${ra.image?`<img src="${ra.image}" alt="${ra.title}"/>`:''}
            <span class="related-card-img-icon">${{interview:'🎙',portrait:'👤',conseil:'💡',prevention:'🦻'[ra.category]||'📝'}[ra.category]||'📝'}</span>
          </div>
          <div class="related-card-body">
            <div class="related-card-cat">${ra.categoryLabel||ra.category||''}</div>
            <div class="related-card-title">${ra.title}</div>
          </div>
        </a>`).join('');
    }

    // Sidebar
    const mp = this.$('more-posts');
    if (mp) {
      mp.innerHTML = articles.filter(a=>String(a.id)!==String(art.id)).slice(0,5).map(ma=>`
        <a href="article.html?id=${ma.id}" class="more-post-item">
          <div class="more-post-thumb">${ma.image?`<img src="${ma.image}" alt="${ma.title}"/>`:'🎧'}</div>
          <div class="more-post-info">
            <div class="more-post-cat">${ma.categoryLabel||ma.category||''}</div>
            <div class="more-post-title">${ma.title}</div>
            <div class="more-post-date">${ma.dateLabel||ma.date||''}</div>
          </div>
        </a>`).join('');
    }
  }
};

/* ── CAROUSEL ── */
let carouselCurrent=0, carouselTimer=null;
function initCarousel(){
  const track=document.getElementById('carouselTrack');
  const dotsEl=document.getElementById('carouselDots');
  const prevBtn=document.getElementById('prevBtn');
  const nextBtn=document.getElementById('nextBtn');
  if(!track||!dotsEl) return;
  const slides=track.querySelectorAll('.carousel-slide');
  carouselCurrent=0;
  function vis(){ return window.innerWidth<=600?1:window.innerWidth<=900?2:3; }
  function pages(){ return Math.max(1,slides.length-vis()+1); }
  function dots(){
    dotsEl.innerHTML='';
    for(let i=0;i<pages();i++){
      const d=document.createElement('button');
      d.className='carousel-dot'+(i===carouselCurrent?' active':'');
      d.addEventListener('click',()=>go(i));
      dotsEl.appendChild(d);
    }
  }
  function go(i){
    if(!slides.length) return;
    carouselCurrent=Math.max(0,Math.min(i,pages()-1));
    const w=slides[0].getBoundingClientRect().width+24;
    track.style.transform=`translateX(-${carouselCurrent*w}px)`;
    dotsEl.querySelectorAll('.carousel-dot').forEach((d,j)=>d.classList.toggle('active',j===carouselCurrent));
  }
  function next(){ go(carouselCurrent+1>=pages()?0:carouselCurrent+1); }
  function prev(){ go(carouselCurrent-1<0?pages()-1:carouselCurrent-1); }
  if(prevBtn) prevBtn.onclick=()=>{clearInterval(carouselTimer);prev();start();};
  if(nextBtn) nextBtn.onclick=()=>{clearInterval(carouselTimer);next();start();};
  function start(){ carouselTimer=setInterval(next,4000); }
  const wrapper=track.parentElement;
  if(wrapper){ wrapper.addEventListener('mouseenter',()=>clearInterval(carouselTimer)); wrapper.addEventListener('mouseleave',start); }
  let tx=0;
  track.addEventListener('touchstart',e=>{tx=e.touches[0].clientX;},{passive:true});
  track.addEventListener('touchend',e=>{const d=tx-e.changedTouches[0].clientX;if(Math.abs(d)>40){clearInterval(carouselTimer);d>0?next():prev();start();}});
  window.addEventListener('resize',()=>{dots();go(0);});
  dots(); go(0); start();
}

/* ── SCROLL OBSERVER ── */
const scrollObserver=new IntersectionObserver(entries=>{
  entries.forEach(e=>{
    if(e.isIntersecting){e.target.style.opacity='1';e.target.style.transform='translateY(0)';}
  });
},{threshold:0.1});

/* ── NAV ── */
function toggleMenu(){ const m=document.getElementById('mobileMenu'); if(m) m.classList.toggle('open'); }
window.addEventListener('scroll',()=>{
  const h=document.querySelector('header');
  if(h) h.style.boxShadow=window.scrollY>20?'0 4px 24px rgba(17,35,56,0.12)':'none';
});

/* ── CONTACT FORM ── */
function handleContactForm(e){
  e.preventDefault();
  const fd=new FormData(e.target);
  const msgs=JSON.parse(localStorage.getItem('procom_messages')||'[]');
  msgs.unshift({ date:new Date().toLocaleString('fr-FR'), prenom:fd.get('prenom'), nom:fd.get('nom'), email:fd.get('email'), sujet:fd.get('sujet'), message:fd.get('message') });
  localStorage.setItem('procom_messages',JSON.stringify(msgs));
  e.target.reset();
  const ok=document.getElementById('form-success');
  if(ok){ ok.style.display='block'; setTimeout(()=>ok.style.display='none',5000); }
}

/* ── PORTFOLIO FILTER ── */
function filterCards(cat, btn){
  document.querySelectorAll('.filter-btn').forEach(b=>b.classList.remove('active'));
  btn.classList.add('active');
  document.querySelectorAll('.article-card').forEach(card=>{
    const cardCat=(card.dataset.category||'').toLowerCase();
    const filterCat=cat.toLowerCase();
    card.style.display=(filterCat==='tous'||cardCat===filterCat)?'block':'none';
  });
}

/* ── BOOT ── */
document.addEventListener('DOMContentLoaded',()=>{
  PROCOM.load();
  setTimeout(()=>{
    document.querySelectorAll('.offre-card,.temoignage-card,.blog-card').forEach(el=>{
      el.style.opacity='0'; el.style.transform='translateY(28px)';
      el.style.transition='opacity 0.5s ease,transform 0.5s ease';
      scrollObserver.observe(el);
    });
  },100);
  const form=document.getElementById('contactForm');
  if(form) form.addEventListener('submit',handleContactForm);
});