/* ===========================================================
   ADMIN.JS — Back-office Procom Solution
   Éditeur universel de toute la configuration site.
   =========================================================== */

const PWD_KEY = 'procom-admin-pwd';
const DEFAULT_PWD = 'audrey2026';
let DATA = null;
let DIRTY = false;
let MEDIA_LIB = []; // bibliothèque locale d'URLs d'images uploadées

/* --------- AUTH --------- */
function checkAuth(){
  const ok = sessionStorage.getItem('procom-auth')==='1';
  if(ok){ document.getElementById('login').style.display='none'; document.getElementById('app').style.display='grid'; init(); }
}
function doLogin(e){
  e.preventDefault();
  const pwd = document.getElementById('pwd').value;
  const stored = localStorage.getItem(PWD_KEY) || DEFAULT_PWD;
  if(pwd===stored){
    sessionStorage.setItem('procom-auth','1');
    document.getElementById('login').style.display='none';
    document.getElementById('app').style.display='grid';
    init();
  } else {
    document.getElementById('login-err').style.display='block';
  }
}
function logout(){ sessionStorage.removeItem('procom-auth'); location.reload(); }

/* --------- INIT --------- */
async function init(){
  // Charge config (LS prioritaire)
  const ls = localStorage.getItem('procom_data');
  if(ls){
    try{ DATA = JSON.parse(ls); }catch{}
  }
  if(!DATA){
    try{
      const r = await fetch('config.json'); DATA = await r.json();
    }catch{ DATA = {}; }
  }
  // structure défensive
  DATA.colors = DATA.colors || {};
  DATA.fonts = DATA.fonts || {};
  DATA.nav = DATA.nav || {links:[],ctaText:'',ctaHref:''};
  DATA.hero = DATA.hero || {};
  DATA.offres = DATA.offres || {items:[]};
  DATA.apropos = DATA.apropos || {};
  DATA.temoignages = DATA.temoignages || {items:[]};
  DATA.ressources = DATA.ressources || {items:[]};
  DATA.articles = DATA.articles || {items:[]};
  DATA.sections = DATA.sections || [];
  DATA.contact = DATA.contact || {};
  DATA.footer = DATA.footer || {};
  DATA.legal = DATA.legal || {mentions:'', confidentialite:''};
  DATA.seo = DATA.seo || {};

  // Media lib
  try{ MEDIA_LIB = JSON.parse(localStorage.getItem('procom-media')||'[]'); }catch{}

  // Tabs
  document.querySelectorAll('.nav-tab').forEach(t=>t.onclick=()=>switchTab(t.dataset.tab));
  renderAll();

  // Beforeunload
  window.addEventListener('beforeunload',(e)=>{ if(DIRTY){ e.preventDefault(); e.returnValue=''; }});
}

function switchTab(tab){
  document.querySelectorAll('.nav-tab').forEach(t=>t.classList.toggle('active',t.dataset.tab===tab));
  document.querySelectorAll('.tab-content').forEach(c=>c.classList.toggle('active',c.id===tab));
  const titles={general:'Général & SEO',design:'Design (couleurs, typographie)',nav:'Menu & navigation',hero:'Hero (page accueil)',offres:'Offres',apropos:'À propos',temoignages:'Témoignages',ressources:'Ressources (PDF)',articles:'Articles & blog',sections:'Sections personnalisées',contact:'Contact',footer:'Footer',legal:'Mentions légales',media:'Bibliothèque médias',messages:'Messages reçus'};
  document.getElementById('tab-title').textContent = titles[tab]||tab;
}

function renderAll(){
  renderGeneral();
  renderDesign();
  renderNav();
  renderHero();
  renderOffres();
  renderApropos();
  renderTemoignages();
  renderRessources();
  renderArticles();
  renderSections();
  renderContact();
  renderFooter();
  renderLegal();
  renderMedia();
  renderMessages();
}

/* --------- HELPERS --------- */
function markDirty(){ DIRTY=true; const b=document.getElementById('save-badge'); b.textContent='● Modifications non sauvegardées'; b.classList.remove('saved'); }
function markClean(){ DIRTY=false; const b=document.getElementById('save-badge'); b.textContent='✓ Tout est sauvegardé'; b.classList.add('saved'); }

function field(label,id,value,opts={}){
  const v = (value||'').toString().replace(/"/g,'&quot;');
  if(opts.type==='textarea') return `<div class="field"><label>${label}</label><textarea id="${id}" rows="${opts.rows||3}" placeholder="${opts.ph||''}">${value||''}</textarea></div>`;
  if(opts.type==='select') return `<div class="field"><label>${label}</label><select id="${id}">${opts.options.map(o=>`<option value="${o.v}" ${o.v===value?'selected':''}>${o.l}</option>`).join('')}</select></div>`;
  return `<div class="field"><label>${label}</label><input type="${opts.type||'text'}" id="${id}" value="${v}" placeholder="${opts.ph||''}"/></div>`;
}
function color(label,id,v){
  return `<div class="field"><label>${label}</label><div class="field-color"><input type="color" id="${id}" value="${v||'#000000'}"/><input type="text" id="${id}-h" value="${v||''}"/></div></div>`;
}
function imgField(label,id,v){
  return `<div class="field"><label>${label}</label>
    <div class="field-img">
      <div class="preview"${v?` style="background-image:url('${v}')"`:''}></div>
      <div class="controls">
        <input type="text" id="${id}" value="${v||''}" placeholder="URL ou chemin (ex: assets/photo.jpg)"/>
        <div style="display:flex;gap:6px">
          <button type="button" onclick="pickMedia('${id}')">📁 Bibliothèque</button>
          <button type="button" onclick="uploadFor('${id}')">⬆ Uploader</button>
        </div>
      </div>
    </div>
  </div>`;
}
function bindField(id,setter){
  const el=document.getElementById(id); if(!el) return;
  el.addEventListener('input',()=>{ setter(el.value); markDirty(); });
}
function bindColor(id,setter){
  const c=document.getElementById(id), h=document.getElementById(id+'-h');
  if(!c) return;
  c.addEventListener('input',()=>{ h.value=c.value; setter(c.value); markDirty(); });
  h.addEventListener('input',()=>{ try{ c.value=h.value; }catch{}; setter(h.value); markDirty(); });
}
function bindImg(id,setter){
  const el=document.getElementById(id); if(!el) return;
  el.addEventListener('input',()=>{
    setter(el.value); markDirty();
    const p = el.closest('.field-img').querySelector('.preview');
    p.style.backgroundImage = el.value?`url('${el.value}')`:'';
  });
}

/* --------- TAB: GÉNÉRAL & SEO --------- */
function renderGeneral(){
  const s = DATA.seo, c = DATA;
  document.getElementById('general').innerHTML = `
    <div class="card">
      <h2>Informations générales</h2>
      <p class="hint">Ces infos apparaissent dans l'onglet du navigateur et lors du partage sur les réseaux.</p>
      ${field('Titre du site (onglet)','seo-title',s.title)}
      ${field('Description (méta)','seo-desc',s.desc,{type:'textarea',rows:2})}
      ${field('Mots-clés (séparés par virgule)','seo-keywords',s.keywords)}
      ${field('Auteur','seo-author',s.author)}
      ${field('URL du site (canonical)','seo-canonical',s.canonical,{ph:'https://procomsolution.fr/'})}
    </div>
    <div class="card">
      <h2>Partage sur réseaux sociaux (OpenGraph)</h2>
      <p class="hint">L'aperçu affiché quand votre site est partagé sur Facebook, LinkedIn, etc.</p>
      ${field('Titre OG','seo-og-title',s.ogTitle)}
      ${field('Description OG','seo-og-desc',s.ogDesc,{type:'textarea',rows:2})}
      ${imgField('Image de partage (1200×630 recommandé)','seo-og-image',s.ogImage)}
    </div>`;
  bindField('seo-title',v=>s.title=v);
  bindField('seo-desc',v=>s.desc=v);
  bindField('seo-keywords',v=>s.keywords=v);
  bindField('seo-author',v=>s.author=v);
  bindField('seo-canonical',v=>s.canonical=v);
  bindField('seo-og-title',v=>s.ogTitle=v);
  bindField('seo-og-desc',v=>s.ogDesc=v);
  bindImg('seo-og-image',v=>s.ogImage=v);
}

/* --------- TAB: DESIGN --------- */
function renderDesign(){
  const c = DATA.colors, f = DATA.fonts;
  const fontOptions = [
    {v:'Inter',l:'Inter (moderne)'},{v:'Helvetica Neue',l:'Helvetica'},
    {v:'Poppins',l:'Poppins'},{v:'Montserrat',l:'Montserrat'},{v:'Lato',l:'Lato'},
    {v:'Playfair Display',l:'Playfair (serif)'},{v:'Lora',l:'Lora (serif)'},
    {v:'Merriweather',l:'Merriweather (serif)'},{v:'Cormorant Garamond',l:'Cormorant'}
  ];
  document.getElementById('design').innerHTML = `
    <div class="card">
      <h2>Palette de couleurs</h2>
      <p class="hint">Modifiez les couleurs principales. Les changements s'appliquent partout sur le site.</p>
      <div class="row-3">
        ${color('Turquoise (accent)','col-turq',c.turquoise)}
        ${color('Marine (foncé)','col-navy',c.navy)}
        ${color('Blanc','col-white',c.white)}
      </div>
      <div class="row-3">
        ${color('Fond clair','col-lbg',c.lightBg)}
        ${color('Texte foncé','col-tdark',c.textDark)}
        ${color('Texte moyen','col-tmid',c.textMid)}
      </div>
      ${color('Texte clair','col-tlight',c.textLight)}
    </div>
    <div class="card">
      <h2>Typographie</h2>
      <p class="hint">Choisissez les polices utilisées sur le site.</p>
      <div class="row-3">
        ${field('Police titres','font-h',f.heading,{type:'select',options:fontOptions})}
        ${field('Police corps','font-b',f.body,{type:'select',options:fontOptions})}
        ${field('Police articles','font-a',f.article,{type:'select',options:fontOptions})}
      </div>
    </div>`;
  bindColor('col-turq',v=>c.turquoise=v);
  bindColor('col-navy',v=>c.navy=v);
  bindColor('col-white',v=>c.white=v);
  bindColor('col-lbg',v=>c.lightBg=v);
  bindColor('col-tdark',v=>c.textDark=v);
  bindColor('col-tmid',v=>c.textMid=v);
  bindColor('col-tlight',v=>c.textLight=v);
  bindField('font-h',v=>f.heading=v);
  bindField('font-b',v=>f.body=v);
  bindField('font-a',v=>f.article=v);
}

/* --------- TAB: NAV --------- */
function renderNav(){
  const n = DATA.nav;
  document.getElementById('nav').innerHTML = `
    <div class="card">
      <h2>Logo</h2>
      ${imgField('Logo (header)','nav-logo',DATA.logo)}
    </div>
    <div class="card">
      <h2>Liens du menu</h2>
      <p class="hint">Ces liens apparaissent dans la barre de navigation.</p>
      <div id="nav-list">
        ${(n.links||[]).map((l,i)=>navItem(l,i)).join('')}
      </div>
      <button class="add-btn" onclick="addNavLink()">+ Ajouter un lien</button>
    </div>
    <div class="card">
      <h2>Bouton CTA (call-to-action)</h2>
      ${field('Texte du bouton','nav-cta-t',n.ctaText,{ph:'Devis gratuit'})}
      ${field('Lien du bouton','nav-cta-h',n.ctaHref,{ph:'#contact'})}
    </div>`;
  (n.links||[]).forEach((_,i)=>bindNavItem(i));
  bindImg('nav-logo',v=>DATA.logo=v);
  bindField('nav-cta-t',v=>n.ctaText=v);
  bindField('nav-cta-h',v=>n.ctaHref=v);
}
function navItem(l,i){
  return `<div class="list-item open"><div class="list-item-head" onclick="toggleItem(this)">
    <span class="title">${l.text||'(lien)'}</span>
    <div class="acts">
      <button onclick="event.stopPropagation();moveNav(${i},-1)">↑</button>
      <button onclick="event.stopPropagation();moveNav(${i},1)">↓</button>
      <button class="btn-danger" onclick="event.stopPropagation();delNav(${i})" style="background:#fef2f2;color:#dc2626">×</button>
    </div></div>
    <div class="list-item-body">
      <div class="row">
        ${field('Texte','navi-t-'+i,l.text)}
        ${field('Lien (#section ou URL)','navi-h-'+i,l.href)}
      </div>
    </div></div>`;
}
function bindNavItem(i){
  bindField('navi-t-'+i,v=>{DATA.nav.links[i].text=v;});
  bindField('navi-h-'+i,v=>{DATA.nav.links[i].href=v;});
}
function addNavLink(){ DATA.nav.links.push({text:'Nouveau lien',href:'#'}); markDirty(); renderNav(); }
function delNav(i){ DATA.nav.links.splice(i,1); markDirty(); renderNav(); }
function moveNav(i,d){ const l=DATA.nav.links; const j=i+d; if(j<0||j>=l.length) return; [l[i],l[j]]=[l[j],l[i]]; markDirty(); renderNav(); }

/* --------- TAB: HERO --------- */
function renderHero(){
  const h = DATA.hero;
  document.getElementById('hero').innerHTML = `
    <div class="card">
      <h2>Section principale (hero)</h2>
      <p class="hint">Le grand bandeau en haut de la page d'accueil.</p>
      ${field('Étiquette (au-dessus du titre)','h-label',h.label,{ph:'Community manager • Spécialiste audiologie'})}
      ${field('Titre principal','h-title',h.title,{ph:'Votre voix dans l\'univers de l\'audition'})}
      ${field('Sous-titre','h-sub',h.subtitle,{type:'textarea',rows:3})}
      <div class="row">
        ${field('Texte bouton principal','h-cta1-t',h.cta1Text)}
        ${field('Lien bouton principal','h-cta1-h',h.cta1Href)}
      </div>
      <div class="row">
        ${field('Texte bouton secondaire','h-cta2-t',h.cta2Text)}
        ${field('Lien bouton secondaire','h-cta2-h',h.cta2Href)}
      </div>
      ${imgField('Image / portrait','h-img',h.image)}
    </div>
    <div class="card">
      <h2>Statistiques (chiffres clés)</h2>
      <p class="hint">Petites stats affichées sous le hero.</p>
      <div id="h-stats">${(h.stats||[]).map((s,i)=>statItem(s,i)).join('')}</div>
      <button class="add-btn" onclick="addStat()">+ Ajouter une stat</button>
    </div>`;
  bindField('h-label',v=>h.label=v);
  bindField('h-title',v=>h.title=v);
  bindField('h-sub',v=>h.subtitle=v);
  bindField('h-cta1-t',v=>h.cta1Text=v);
  bindField('h-cta1-h',v=>h.cta1Href=v);
  bindField('h-cta2-t',v=>h.cta2Text=v);
  bindField('h-cta2-h',v=>h.cta2Href=v);
  bindImg('h-img',v=>h.image=v);
  (h.stats||[]).forEach((_,i)=>{
    bindField('hs-v-'+i,v=>{h.stats[i].value=v;});
    bindField('hs-l-'+i,v=>{h.stats[i].label=v;});
  });
}
function statItem(s,i){
  return `<div class="list-item open"><div class="list-item-head" onclick="toggleItem(this)">
    <span class="title">${s.value||''} — ${s.label||''}</span>
    <div class="acts"><button class="btn-danger" onclick="event.stopPropagation();delStat(${i})" style="background:#fef2f2;color:#dc2626">×</button></div>
    </div><div class="list-item-body"><div class="row">
      ${field('Valeur','hs-v-'+i,s.value)}
      ${field('Label','hs-l-'+i,s.label)}
    </div></div></div>`;
}
function addStat(){ DATA.hero.stats=DATA.hero.stats||[]; DATA.hero.stats.push({value:'100%',label:'…'}); markDirty(); renderHero(); }
function delStat(i){ DATA.hero.stats.splice(i,1); markDirty(); renderHero(); }

/* --------- helpers list-item --------- */
function toggleItem(el){ el.parentElement.classList.toggle('open'); }

/* --------- TAB: OFFRES --------- */
function renderOffres(){
  const o = DATA.offres;
  document.getElementById('offres').innerHTML = `
    <div class="card">
      <h2>En-tête de la section Offres</h2>
      ${field('Étiquette','o-label',o.sectionLabel)}
      ${field('Titre','o-title',o.title)}
      ${field('Sous-titre','o-sub',o.subtitle,{type:'textarea',rows:2})}
    </div>
    <div class="card">
      <h2>Liste des offres</h2>
      <div id="o-list">${(o.items||[]).map((it,i)=>offreItem(it,i)).join('')}</div>
      <button class="add-btn" onclick="addOffre()">+ Ajouter une offre</button>
    </div>`;
  bindField('o-label',v=>o.sectionLabel=v);
  bindField('o-title',v=>o.title=v);
  bindField('o-sub',v=>o.subtitle=v);
  (o.items||[]).forEach((_,i)=>bindOffreItem(i));
}
function offreItem(it,i){
  const feats = (it.features||[]).join('\n');
  return `<div class="list-item"><div class="list-item-head" onclick="toggleItem(this)">
    <span class="title">${it.title||'(offre)'} ${it.featured?'⭐':''}</span>
    <div class="acts">
      <button onclick="event.stopPropagation();moveOffre(${i},-1)">↑</button>
      <button onclick="event.stopPropagation();moveOffre(${i},1)">↓</button>
      <button class="btn-danger" onclick="event.stopPropagation();delOffre(${i})" style="background:#fef2f2;color:#dc2626">×</button>
    </div></div>
    <div class="list-item-body">
      ${field('Étiquette (ex: Essentiel)','of-l-'+i,it.label)}
      ${field('Titre','of-t-'+i,it.title)}
      ${field('Description','of-d-'+i,it.description,{type:'textarea',rows:2})}
      ${field('Prix','of-p-'+i,it.price,{ph:'À partir de 350€/mois'})}
      ${field('Inclus (une ligne par item)','of-f-'+i,feats,{type:'textarea',rows:5})}
      ${field('Texte bouton','of-bt-'+i,it.btnText)}
      ${field('Lien bouton','of-bh-'+i,it.btnHref)}
      <div class="field"><label><input type="checkbox" id="of-fe-${i}" ${it.featured?'checked':''}/> Mettre en avant (style spécial)</label></div>
    </div></div>`;
}
function bindOffreItem(i){
  const it=DATA.offres.items[i];
  bindField('of-l-'+i,v=>it.label=v);
  bindField('of-t-'+i,v=>it.title=v);
  bindField('of-d-'+i,v=>it.description=v);
  bindField('of-p-'+i,v=>it.price=v);
  bindField('of-f-'+i,v=>it.features=v.split('\n').filter(x=>x.trim()));
  bindField('of-bt-'+i,v=>it.btnText=v);
  bindField('of-bh-'+i,v=>it.btnHref=v);
  const fe=document.getElementById('of-fe-'+i); if(fe) fe.onchange=()=>{it.featured=fe.checked; markDirty();};
}
function addOffre(){ DATA.offres.items.push({title:'Nouvelle offre',description:'',price:'',features:[],btnText:'Demander',btnHref:'#contact'}); markDirty(); renderOffres(); }
function delOffre(i){ DATA.offres.items.splice(i,1); markDirty(); renderOffres(); }
function moveOffre(i,d){ const a=DATA.offres.items, j=i+d; if(j<0||j>=a.length)return; [a[i],a[j]]=[a[j],a[i]]; markDirty(); renderOffres(); }

/* --------- TAB: À PROPOS --------- */
function renderApropos(){
  const a = DATA.apropos;
  document.getElementById('apropos').innerHTML = `
    <div class="card">
      <h2>En-tête</h2>
      ${field('Étiquette','a-label',a.sectionLabel)}
      ${field('Titre','a-title',a.title)}
    </div>
    <div class="card">
      <h2>Contenu</h2>
      ${field('Paragraphe 1','a-p1',a.p1,{type:'textarea',rows:3})}
      ${field('Paragraphe 2','a-p2',a.p2,{type:'textarea',rows:3})}
      ${field('Paragraphe 3','a-p3',a.p3,{type:'textarea',rows:3})}
      ${field('Citation','a-quote',a.quote,{type:'textarea',rows:2})}
      ${imgField('Photo','a-img',a.image)}
    </div>
    <div class="card">
      <h2>Compétences / valeurs</h2>
      <div id="a-skills">${(a.skills||[]).map((s,i)=>skillItem(s,i)).join('')}</div>
      <button class="add-btn" onclick="addSkill()">+ Ajouter</button>
    </div>`;
  bindField('a-label',v=>a.sectionLabel=v);
  bindField('a-title',v=>a.title=v);
  bindField('a-p1',v=>a.p1=v);
  bindField('a-p2',v=>a.p2=v);
  bindField('a-p3',v=>a.p3=v);
  bindField('a-quote',v=>a.quote=v);
  bindImg('a-img',v=>a.image=v);
  (a.skills||[]).forEach((_,i)=>{
    bindField('sk-t-'+i,v=>{a.skills[i].title=v;});
    bindField('sk-d-'+i,v=>{a.skills[i].description=v;});
    bindField('sk-i-'+i,v=>{a.skills[i].icon=v;});
  });
}
function skillItem(s,i){
  return `<div class="list-item"><div class="list-item-head" onclick="toggleItem(this)">
    <span class="title">${s.icon||'•'} ${s.title||''}</span>
    <div class="acts"><button class="btn-danger" onclick="event.stopPropagation();delSkill(${i})" style="background:#fef2f2;color:#dc2626">×</button></div>
    </div><div class="list-item-body">
      ${field('Icône (emoji)','sk-i-'+i,s.icon)}
      ${field('Titre','sk-t-'+i,s.title)}
      ${field('Description','sk-d-'+i,s.description,{type:'textarea',rows:2})}
    </div></div>`;
}
function addSkill(){ DATA.apropos.skills=DATA.apropos.skills||[]; DATA.apropos.skills.push({icon:'✨',title:'',description:''}); markDirty(); renderApropos(); }
function delSkill(i){ DATA.apropos.skills.splice(i,1); markDirty(); renderApropos(); }

/* --------- TAB: TÉMOIGNAGES --------- */
function renderTemoignages(){
  const t = DATA.temoignages;
  document.getElementById('temoignages').innerHTML = `
    <div class="card">
      <h2>En-tête</h2>
      ${field('Étiquette','t-label',t.sectionLabel)}
      ${field('Titre','t-title',t.title)}
      ${field('Sous-titre','t-sub',t.subtitle,{type:'textarea',rows:2})}
    </div>
    <div class="card">
      <h2>Témoignages</h2>
      <div id="t-list">${(t.items||[]).map((it,i)=>temoItem(it,i)).join('')}</div>
      <button class="add-btn" onclick="addTemo()">+ Ajouter un témoignage</button>
    </div>`;
  bindField('t-label',v=>t.sectionLabel=v);
  bindField('t-title',v=>t.title=v);
  bindField('t-sub',v=>t.subtitle=v);
  (t.items||[]).forEach((_,i)=>{
    bindField('te-q-'+i,v=>{t.items[i].quote=v;});
    bindField('te-a-'+i,v=>{t.items[i].author=v;});
    bindField('te-r-'+i,v=>{t.items[i].role=v;});
    bindImg('te-i-'+i,v=>{t.items[i].image=v;});
  });
}
function temoItem(it,i){
  return `<div class="list-item"><div class="list-item-head" onclick="toggleItem(this)">
    <span class="title">"${(it.quote||'').slice(0,40)}…" — ${it.author||''}</span>
    <div class="acts"><button class="btn-danger" onclick="event.stopPropagation();delTemo(${i})" style="background:#fef2f2;color:#dc2626">×</button></div>
    </div><div class="list-item-body">
      ${field('Citation','te-q-'+i,it.quote,{type:'textarea',rows:3})}
      ${field('Auteur','te-a-'+i,it.author)}
      ${field('Fonction / lieu','te-r-'+i,it.role)}
      ${imgField('Photo','te-i-'+i,it.image)}
    </div></div>`;
}
function addTemo(){ DATA.temoignages.items.push({quote:'',author:'',role:''}); markDirty(); renderTemoignages(); }
function delTemo(i){ DATA.temoignages.items.splice(i,1); markDirty(); renderTemoignages(); }

/* --------- TAB: RESSOURCES --------- */
function renderRessources(){
  const r = DATA.ressources;
  document.getElementById('ressources').innerHTML = `
    <div class="card">
      <h2>En-tête</h2>
      ${field('Étiquette','r-label',r.sectionLabel)}
      ${field('Titre','r-title',r.title)}
      ${field('Sous-titre','r-sub',r.subtitle,{type:'textarea',rows:2})}
    </div>
    <div class="card">
      <h2>Ressources téléchargeables</h2>
      <div id="r-list">${(r.items||[]).map((it,i)=>resItem(it,i)).join('')}</div>
      <button class="add-btn" onclick="addRes()">+ Ajouter une ressource</button>
    </div>`;
  bindField('r-label',v=>r.sectionLabel=v);
  bindField('r-title',v=>r.title=v);
  bindField('r-sub',v=>r.subtitle=v);
  (r.items||[]).forEach((_,i)=>{
    bindField('rs-t-'+i,v=>{r.items[i].title=v;});
    bindField('rs-d-'+i,v=>{r.items[i].description=v;});
    bindField('rs-tp-'+i,v=>{r.items[i].type=v;});
    bindField('rs-h-'+i,v=>{r.items[i].href=v;});
    bindImg('rs-i-'+i,v=>{r.items[i].image=v;});
  });
}
function resItem(it,i){
  return `<div class="list-item"><div class="list-item-head" onclick="toggleItem(this)">
    <span class="title">${it.title||'(ressource)'}</span>
    <div class="acts"><button class="btn-danger" onclick="event.stopPropagation();delRes(${i})" style="background:#fef2f2;color:#dc2626">×</button></div>
    </div><div class="list-item-body">
      ${field('Titre','rs-t-'+i,it.title)}
      ${field('Description','rs-d-'+i,it.description,{type:'textarea',rows:2})}
      ${field('Type (PDF, Guide, etc.)','rs-tp-'+i,it.type)}
      ${field('Lien de téléchargement','rs-h-'+i,it.href)}
      ${imgField('Image vignette','rs-i-'+i,it.image)}
    </div></div>`;
}
function addRes(){ DATA.ressources.items.push({title:'',description:'',type:'PDF',href:'#'}); markDirty(); renderRessources(); }
function delRes(i){ DATA.ressources.items.splice(i,1); markDirty(); renderRessources(); }

/* --------- TAB: ARTICLES --------- */
function renderArticles(){
  const ar = DATA.articles;
  document.getElementById('articles').innerHTML = `
    <div class="card">
      <h2>En-tête</h2>
      ${field('Étiquette','ar-label',ar.sectionLabel)}
      ${field('Titre','ar-title',ar.title)}
      ${field('Sous-titre','ar-sub',ar.subtitle,{type:'textarea',rows:2})}
    </div>
    <div class="card">
      <h2>Articles</h2>
      <div id="ar-list">${(ar.items||[]).map((it,i)=>artItem(it,i)).join('')}</div>
      <button class="add-btn" onclick="addArt()">+ Ajouter un article</button>
    </div>`;
  bindField('ar-label',v=>ar.sectionLabel=v);
  bindField('ar-title',v=>ar.title=v);
  bindField('ar-sub',v=>ar.subtitle=v);
  (ar.items||[]).forEach((_,i)=>{
    bindField('art-t-'+i,v=>{ar.items[i].title=v;});
    bindField('art-e-'+i,v=>{ar.items[i].excerpt=v;});
    bindField('art-d-'+i,v=>{ar.items[i].date=v;});
    bindField('art-c-'+i,v=>{ar.items[i].category=v;});
    bindField('art-rt-'+i,v=>{ar.items[i].readTime=v;});
    bindField('art-bd-'+i,v=>{ar.items[i].body=v;});
    bindImg('art-i-'+i,v=>{ar.items[i].image=v;});
  });
}
function artItem(it,i){
  return `<div class="list-item"><div class="list-item-head" onclick="toggleItem(this)">
    <span class="title">${it.title||'(article)'}</span>
    <div class="acts"><button class="btn-danger" onclick="event.stopPropagation();delArt(${i})" style="background:#fef2f2;color:#dc2626">×</button></div>
    </div><div class="list-item-body">
      ${field('Titre','art-t-'+i,it.title)}
      ${field('Extrait','art-e-'+i,it.excerpt,{type:'textarea',rows:2})}
      <div class="row-3">
        ${field('Date','art-d-'+i,it.date)}
        ${field('Catégorie','art-c-'+i,it.category)}
        ${field('Temps de lecture','art-rt-'+i,it.readTime)}
      </div>
      ${imgField('Image','art-i-'+i,it.image)}
      ${field('Contenu complet (HTML autorisé)','art-bd-'+i,it.body,{type:'textarea',rows:8})}
    </div></div>`;
}
function addArt(){ DATA.articles.items.push({title:'',excerpt:'',date:new Date().toLocaleDateString('fr-FR'),category:'Conseils',readTime:'5 min',body:''}); markDirty(); renderArticles(); }
function delArt(i){ DATA.articles.items.splice(i,1); markDirty(); renderArticles(); }

/* --------- TAB: SECTIONS PERSONNALISÉES --------- */
function renderSections(){
  const list = DATA.sections;
  document.getElementById('sections').innerHTML = `
    <div class="card">
      <h2>Sections personnalisées</h2>
      <p class="hint">Ajoutez de nouvelles sections sur votre site sans toucher au code. Elles apparaîtront avant la section Contact.</p>
      <div id="cs-list">${list.map((s,i)=>secItem(s,i)).join('')}</div>
      <button class="add-btn" onclick="addSec()">+ Ajouter une section</button>
    </div>`;
  list.forEach((_,i)=>{
    bindField('cs-id-'+i,v=>{list[i].id=v;});
    bindField('cs-l-'+i,v=>{list[i].label=v;});
    bindField('cs-t-'+i,v=>{list[i].title=v;});
    bindField('cs-s-'+i,v=>{list[i].subtitle=v;});
    bindField('cs-c-'+i,v=>{list[i].content=v;});
    bindField('cs-bg-'+i,v=>{list[i].background=v;});
    bindField('cs-al-'+i,v=>{list[i].align=v;});
    bindField('cs-bt-'+i,v=>{list[i].btnText=v;});
    bindField('cs-bh-'+i,v=>{list[i].btnHref=v;});
  });
}
function secItem(s,i){
  return `<div class="list-item"><div class="list-item-head" onclick="toggleItem(this)">
    <span class="title">${s.title||'(section)'}</span>
    <div class="acts">
      <button onclick="event.stopPropagation();moveSec(${i},-1)">↑</button>
      <button onclick="event.stopPropagation();moveSec(${i},1)">↓</button>
      <button class="btn-danger" onclick="event.stopPropagation();delSec(${i})" style="background:#fef2f2;color:#dc2626">×</button>
    </div></div>
    <div class="list-item-body">
      <div class="row">
        ${field('ID (ancre)','cs-id-'+i,s.id,{ph:'partenaires'})}
        ${field('Étiquette','cs-l-'+i,s.label)}
      </div>
      ${field('Titre','cs-t-'+i,s.title)}
      ${field('Sous-titre','cs-s-'+i,s.subtitle,{type:'textarea',rows:2})}
      ${field('Contenu (HTML autorisé)','cs-c-'+i,s.content,{type:'textarea',rows:5})}
      <div class="row-3">
        ${field('Fond','cs-bg-'+i,s.background||'white',{type:'select',options:[{v:'white',l:'Blanc'},{v:'light',l:'Gris clair'},{v:'dark',l:'Marine foncé'},{v:'turquoise',l:'Turquoise'}]})}
        ${field('Alignement','cs-al-'+i,s.align||'left',{type:'select',options:[{v:'left',l:'Gauche'},{v:'center',l:'Centré'}]})}
      </div>
      <div class="row">
        ${field('Texte bouton (optionnel)','cs-bt-'+i,s.btnText)}
        ${field('Lien bouton','cs-bh-'+i,s.btnHref)}
      </div>
    </div></div>`;
}
function addSec(){ DATA.sections.push({id:'section-'+(DATA.sections.length+1),title:'Nouvelle section',background:'white',align:'left'}); markDirty(); renderSections(); }
function delSec(i){ DATA.sections.splice(i,1); markDirty(); renderSections(); }
function moveSec(i,d){ const a=DATA.sections, j=i+d; if(j<0||j>=a.length)return; [a[i],a[j]]=[a[j],a[i]]; markDirty(); renderSections(); }

/* --------- TAB: CONTACT --------- */
function renderContact(){
  const c = DATA.contact;
  document.getElementById('contact').innerHTML = `
    <div class="card">
      <h2>Section Contact</h2>
      ${field('Étiquette','c-label',c.sectionLabel)}
      ${field('Titre','c-title',c.title)}
      ${field('Sous-titre','c-sub',c.subtitle,{type:'textarea',rows:2})}
      <h3>Coordonnées</h3>
      ${field('Email','c-email',c.email,{type:'email'})}
      ${field('Téléphone','c-phone',c.phone)}
      ${field('LinkedIn (URL)','c-li',c.linkedin)}
      ${field('Texte LinkedIn','c-lil',c.linkedinLabel)}
    </div>`;
  bindField('c-label',v=>c.sectionLabel=v);
  bindField('c-title',v=>c.title=v);
  bindField('c-sub',v=>c.subtitle=v);
  bindField('c-email',v=>c.email=v);
  bindField('c-phone',v=>c.phone=v);
  bindField('c-li',v=>c.linkedin=v);
  bindField('c-lil',v=>c.linkedinLabel=v);
}

/* --------- TAB: FOOTER --------- */
function renderFooter(){
  const f = DATA.footer;
  document.getElementById('footer').innerHTML = `
    <div class="card">
      <h2>Pied de page</h2>
      ${field('Description','f-desc',f.description,{type:'textarea',rows:2})}
      ${field('Copyright','f-cr',f.copyright)}
      ${field('Mentions liens (séparés par |)','f-links',(f.links||[]).map(l=>l.text+'>'+l.href).join(' | '),{ph:'Mentions légales>mentions.html | Confidentialité>confidentialite.html'})}
    </div>`;
  bindField('f-desc',v=>f.description=v);
  bindField('f-cr',v=>f.copyright=v);
  bindField('f-links',v=>{
    f.links = v.split('|').map(s=>{const [text,href]=s.split('>').map(x=>(x||'').trim()); return {text,href};}).filter(l=>l.text);
  });
}

/* --------- TAB: LEGAL --------- */
function renderLegal(){
  const l = DATA.legal;
  document.getElementById('legal').innerHTML = `
    <div class="card">
      <h2>Mentions légales</h2>
      <p class="hint">Le contenu de la page mentions.html (HTML autorisé).</p>
      ${field('Contenu HTML','lg-m',l.mentions,{type:'textarea',rows:14})}
    </div>
    <div class="card">
      <h2>Politique de confidentialité</h2>
      ${field('Contenu HTML','lg-c',l.confidentialite,{type:'textarea',rows:14})}
    </div>`;
  bindField('lg-m',v=>l.mentions=v);
  bindField('lg-c',v=>l.confidentialite=v);
}

/* --------- TAB: MEDIA LIBRARY --------- */
function renderMedia(){
  document.getElementById('media').innerHTML = `
    <div class="card">
      <h2>Bibliothèque médias</h2>
      <p class="hint">Uploadez vos images ici. Elles seront stockées localement (en base64) et utilisables partout sur le site.</p>
      <button class="btn btn-primary" onclick="document.getElementById('media-upload').click()">⬆ Uploader des images</button>
      <input type="file" id="media-upload" accept="image/*" multiple style="display:none" onchange="uploadMedia(this)"/>
      <div class="media-grid" style="margin-top:20px">
        ${MEDIA_LIB.map((m,i)=>`
          <div class="media-item">
            <img src="${m.url}" alt=""/>
            <button onclick="delMedia(${i})">×</button>
            <div class="info">
              <input type="text" value="${m.name}" onchange="MEDIA_LIB[${i}].name=this.value;saveMedia()"/>
              <button onclick="copyUrl('${m.url}')" style="margin-top:4px;background:var(--turquoise);color:#fff;padding:4px 8px;border-radius:4px;width:100%;font-size:11px">📋 Copier URL</button>
            </div>
          </div>
        `).join('')}
      </div>
    </div>`;
}
function uploadMedia(input){
  const files = [...input.files];
  let loaded = 0;
  files.forEach(f=>{
    const r = new FileReader();
    r.onload = ()=>{
      MEDIA_LIB.push({name:f.name,url:r.result});
      loaded++;
      if(loaded===files.length){ saveMedia(); renderMedia(); toast('✓ '+files.length+' image(s) ajoutée(s)','success'); }
    };
    r.readAsDataURL(f);
  });
}
function delMedia(i){ if(!confirm('Supprimer cette image ?')) return; MEDIA_LIB.splice(i,1); saveMedia(); renderMedia(); }
function saveMedia(){ try{ localStorage.setItem('procom-media',JSON.stringify(MEDIA_LIB)); }catch(e){ toast('⚠ Stockage plein','error'); } }
function copyUrl(url){ navigator.clipboard.writeText(url); toast('✓ URL copiée','success'); }
function pickMedia(targetId){
  if(MEDIA_LIB.length===0){ toast('Bibliothèque vide. Uploadez des images d\'abord.','error'); return; }
  const html = '<h3>Choisir une image</h3><div class="media-grid" style="margin-top:16px">'+
    MEDIA_LIB.map((m,i)=>`<div class="media-item" style="cursor:pointer" onclick="selectMedia('${targetId}',${i})"><img src="${m.url}"/><div class="info">${m.name}</div></div>`).join('')+
    '</div><div class="acts" style="margin-top:16px"><button class="btn btn-ghost" onclick="closeModal()">Annuler</button></div>';
  showModal(html);
}
function selectMedia(targetId,i){
  const url = MEDIA_LIB[i].url;
  const el = document.getElementById(targetId);
  el.value = url;
  el.dispatchEvent(new Event('input'));
  closeModal();
}
function uploadFor(targetId){
  const inp = document.createElement('input');
  inp.type='file'; inp.accept='image/*';
  inp.onchange=()=>{
    const f = inp.files[0]; if(!f) return;
    const r = new FileReader();
    r.onload=()=>{
      MEDIA_LIB.push({name:f.name,url:r.result});
      saveMedia();
      const el = document.getElementById(targetId);
      el.value = r.result;
      el.dispatchEvent(new Event('input'));
      toast('✓ Image uploadée','success');
    };
    r.readAsDataURL(f);
  };
  inp.click();
}

/* --------- TAB: MESSAGES --------- */
function renderMessages(){
  const msgs = JSON.parse(localStorage.getItem('procom-messages')||'[]');
  document.getElementById('messages').innerHTML = `
    <div class="card">
      <h2>Messages reçus via le formulaire de contact</h2>
      <p class="hint">Les messages envoyés depuis le site apparaissent ici. Ils sont aussi envoyés par email.</p>
      ${msgs.length===0 ? '<p style="text-align:center;padding:40px;color:var(--text-light)">Aucun message pour l\'instant.</p>' : msgs.slice().reverse().map((m,i)=>`
        <div class="msg">
          <div class="msg-head">
            <span class="msg-from">${m.name||'(anonyme)'} • ${m.email||''}</span>
            <span>${new Date(m.date).toLocaleString('fr-FR')}</span>
          </div>
          <div style="font-size:12px;color:var(--text-mid)">📞 ${m.phone||'—'} • 🏢 ${m.company||'—'}</div>
          <div class="msg-body">${(m.message||'').replace(/</g,'&lt;')}</div>
          <div style="margin-top:10px;display:flex;gap:8px">
            <a href="mailto:${m.email}" class="btn btn-ghost" style="font-size:12px;padding:6px 12px">↩ Répondre</a>
            <button class="btn btn-danger" style="font-size:12px;padding:6px 12px" onclick="delMsg(${msgs.length-1-i})">Supprimer</button>
          </div>
        </div>
      `).join('')}
    </div>`;
}
function delMsg(i){
  if(!confirm('Supprimer ?')) return;
  const m = JSON.parse(localStorage.getItem('procom-messages')||'[]');
  m.splice(i,1); localStorage.setItem('procom-messages',JSON.stringify(m));
  renderMessages();
}

/* --------- SAVE / EXPORT / IMPORT --------- */
function saveAll(){
  try{ localStorage.setItem('procom_data',JSON.stringify(DATA)); markClean(); toast('✓ Sauvegardé','success'); }
  catch(e){ toast('⚠ Erreur de sauvegarde','error'); }
}
function exportData(){
  const blob = new Blob([JSON.stringify(DATA,null,2)],{type:'application/json'});
  const a = document.createElement('a');
  a.href = URL.createObjectURL(blob);
  a.download = 'procom-config-'+new Date().toISOString().slice(0,10)+'.json';
  a.click();
  toast('✓ Configuration exportée','success');
}
function importData(input){
  const f = input.files[0]; if(!f) return;
  const r = new FileReader();
  r.onload = ()=>{
    try{
      DATA = JSON.parse(r.result);
      saveAll();
      renderAll();
      toast('✓ Configuration importée','success');
    }catch(e){ toast('⚠ Fichier invalide','error'); }
  };
  r.readAsText(f);
}
function resetAll(){
  if(!confirm('Tout réinitialiser ? Cette action est irréversible.')) return;
  localStorage.removeItem('procom_data');
  location.reload();
}

/* --------- TOAST / MODAL --------- */
function toast(msg,kind){
  const t = document.getElementById('toast');
  t.textContent = msg;
  t.className = 'toast show '+(kind||'');
  clearTimeout(window._tt); window._tt=setTimeout(()=>{ t.className='toast'; },2400);
}
function showModal(html){
  document.getElementById('modal').innerHTML = html;
  document.getElementById('modal-bg').classList.add('show');
}
function closeModal(){ document.getElementById('modal-bg').classList.remove('show'); }
document.getElementById('modal-bg').onclick = (e)=>{ if(e.target.id==='modal-bg') closeModal(); };

/* Init */
checkAuth();
