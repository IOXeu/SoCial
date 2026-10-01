const app = document.querySelector('#app');
const T = 'sb_token';
const G = 'sb_groups';
const AV = 'sb_avatar';
const CV = 'sb_cover';
const AP = 'sb_appearance';
let me = null, groups = [], cur = null, data = null, tab = 'mural';
let appearance = JSON.parse(localStorage.getItem(AP) || '{"theme":0,"model":"classico"}');
const THEMES = ['Roxo Clássico','Rosa Imperial','Azul Noturno','Verde Jardim','Dourado Antigo','Vinho','Céu','Lavanda','Turquesa','Grafite','Cobre','Amanhecer'];
const MODELS = {classico:'Clássico',compacto:'Compacto',largo:'Painel Largo'};

const $ = s => document.querySelector(s);
const esc = s => String(s ?? '').replace(/[&<>"']/g, c => ({
  '&':'&amp;', '<':'&lt;', '>':'&gt;', '"':'&quot;', "'":'&#39;'
}[c]));
const av = n => '<span class="av">' +
  esc(String(n || '?').trim().split(/\s+/).map(x => x[0]).slice(0,2).join('').toUpperCase() || '?') +
  '</span>';

function applyAppearance(){
  document.body.dataset.theme = String(appearance.theme || 0);
  document.body.dataset.model = appearance.model || 'classico';
}
function saveAppearance(){ localStorage.setItem(AP,JSON.stringify(appearance)); applyAppearance(); }

function toast(x) {
  const t = $('#toast');
  t.textContent = x;
  t.hidden = false;
  clearTimeout(toast.t);
  toast.t = setTimeout(() => t.hidden = true, 3500);
}

async function api(p, b, m) {
  const r = await fetch('/api/' + p, {
    method: m || (b ? 'POST' : 'GET'),
    headers: {
      'content-type':'application/json',
      ...(localStorage[T] ? {authorization:'Bearer ' + localStorage[T]} : {})
    },
    body: b ? JSON.stringify(b) : undefined
  });
  const d = await r.json().catch(() => ({}));
  if (!r.ok) throw Error(d.erro || 'HTTP ' + r.status);
  return d;
}

const b64 = b => btoa(String.fromCharCode(...new Uint8Array(b)));
const ub = s => Uint8Array.from(atob(s), c => c.charCodeAt(0));
const u64 = b => b64(b).replace(/\+/g,'-').replace(/\//g,'_').replace(/=/g,'');
const uu = s => ub(s.replace(/-/g,'+').replace(/_/g,'/'));
const KC = {};

function key(k) {
  return KC[k] || (KC[k] = crypto.subtle.importKey(
    'raw', uu(k), 'AES-GCM', false, ['encrypt','decrypt']
  ));
}

async function enc(t,k) {
  const iv = crypto.getRandomValues(new Uint8Array(12));
  const c = await crypto.subtle.encrypt(
    {name:'AES-GCM',iv},
    await key(k),
    new TextEncoder().encode(t)
  );
  const o = new Uint8Array(12 + c.byteLength);
  o.set(iv);
  o.set(new Uint8Array(c),12);
  return b64(o);
}

async function dec(s,k) {
  try {
    const o = ub(s);
    return new TextDecoder().decode(await crypto.subtle.decrypt(
      {name:'AES-GCM',iv:o.slice(0,12)},
      await key(k),
      o.slice(12)
    ));
  } catch {
    return '…';
  }
}

function save() {
  localStorage.setItem(G, JSON.stringify(groups));
}

function photo(type) {
  return localStorage.getItem(type === 'avatar' ? AV : CV) || '';
}

function avatar(n) {
  const src = photo('avatar');
  return src ? '<img class="av av-photo" src="' + src + '" alt="Avatar">' : av(n);
}

function photoInput(type) {
  return '<label class="photo-btn">' + (type === 'avatar' ? '📷 Foto do perfil' : '🖼️ Foto da capa') +
    '<input type="file" accept="image/*" data-photo="' + type + '" hidden></label>';
}

function readPhoto(file, type) {
  return new Promise((resolve,reject) => {
    const r = new FileReader();
    r.onload = () => {
      const img = new Image();
      img.onload = () => {
        const max = type === 'avatar' ? 512 : 1400;
        const scale = Math.min(1, max / Math.max(img.width,img.height));
        const c = document.createElement('canvas');
        c.width = Math.max(1, Math.round(img.width * scale));
        c.height = Math.max(1, Math.round(img.height * scale));
        c.getContext('2d').drawImage(img,0,0,c.width,c.height);
        resolve(c.toDataURL('image/jpeg',0.82));
      };
      img.onerror = reject;
      img.src = r.result;
    };
    r.onerror = reject;
    r.readAsDataURL(file);
  });
}

function bindPhotos() {
  document.querySelectorAll('[data-photo]').forEach(input => {
    input.onchange = async () => {
      const file = input.files?.[0];
      if (!file) return;
      try {
        localStorage.setItem(input.dataset.photo === 'avatar' ? AV : CV, await readPhoto(file,input.dataset.photo));
        await render();
        toast('Foto atualizada');
      } catch { toast('Não foi possível carregar a foto'); }
    };
  });
}

function loadGroups() {
  try { groups = JSON.parse(localStorage.getItem(G) || '[]'); }
  catch { groups = []; }
}

function shell(x) {
  app.innerHTML =
    '<header class="top"><div class="topi">' +
    '<div class="brand"><img src="logo-icone.png">SoCial<i>Br</i></div>' +
    '<div class="search"><input placeholder="Pesquisar no SoCialBr" disabled></div>' +
    '<div class="tu">' + (me ? avatar(me.nome) : '') +
    '<span>' + esc(me?.nome || '') + '</span></div>' +
    '</div></header>' + x;
}

function login() {
  shell(
    '<main class="hero"><section class="hero-card">' +
    '<img class="hero-logo" src="logo-grande.png">' +
    '<h1>Bem-vindo ao SoCialBr</h1>' +
    '<p>Sua rede, seu espaço. Uma interface inspirada nas comunidades clássicas.</p>' +
    '<form class="form" id="f">' +
    '<label>Seu nome<input id="n" maxlength="40" required></label>' +
    '<button class="primary">Entrar no SoCialBr</button>' +
    '</form><small>Sem e-mail e sem senha.</small>' +
    '</section></main>'
  );
  $('#f').onsubmit = async e => {
    e.preventDefault();
    try {
      const r = await api('registrar',{nome:$('#n').value.trim()});
      localStorage[T] = r.token;
      await applyAppearance();
start();
    } catch (x) { toast(x.message); }
  };
}

async function start() {
  loadGroups();
  if (!localStorage[T]) return login();

  try {
    me = await api('eu');
    const gs = await api('grupos');

    const oldGroups = groups.filter(g => g && g.id);
    groups = gs.map(x => {
      const old = oldGroups.find(g => g.id === x.id);
      return old ? {...x, key:old.key} : x;
    }).filter(g => g && g.id);
    save();

    const u = new URL(location.href);
    const it = u.searchParams.get('convite');
    const k = u.hash.startsWith('#k=') ? u.hash.slice(3) : '';

    if (it) {
      if (!k) throw Error('Convite sem a chave do grupo.');
      const r = await api('convites/aceitar',{token:it});
      const g = gs.find(x => x.id === r.group_id) || {id:r.group_id,nome:'Grupo'};
      groups.push({...g,key:k});
      save();
      history.replaceState(null,'',location.pathname);
      return load(r.group_id);
    }

    if (!groups.length) return createPage();
    const first = groups.find(g => g && g.id);
    if (!first) { groups = []; save(); return createPage(); }
    await load(first.id);
  } catch (x) {
    shell(
      '<main class="hero"><section class="hero-card">' +
      '<h1>Erro</h1><p>' + esc(x.message) + '</p>' +
      '<button class="primary" onclick="location.reload()">Tentar novamente</button>' +
      '</section></main>'
    );
  }
}

async function load(id) {
  if (!id) { groups = groups.filter(g => g && g.id); save(); return groups.length ? load(groups[0].id) : createPage(); }
  try {
    const g = groups.find(x => x.id === id) || {};
    const d = await api('grupos/' + id + '/posts');
    cur = {...g,...d.grupo,id,key:g.key};
    data = d;
    await render();
  } catch (x) {
    toast(x.message);
  }
}

function nav() {
  return '<nav class="nav">' +
    '<button class="' + (tab==='mural'?'active':'') + '" data-t="mural">Mural</button>' +
    '<button class="' + (tab==='perfil'?'active':'') + '" data-t="perfil">Meu perfil</button>' +
    '<button class="' + (tab==='amigos'?'active':'') + '" data-t="amigos">Amigos</button>' +
    '<button class="' + (tab==='grupo'?'active':'') + '" data-t="grupo">Comunidade</button>' +
    '<button class="' + (tab==='grupos'?'active':'') + '" data-t="grupos">Meus grupos</button>' +
    '<button class="' + (tab==='aparencia'?'active':'') + '" data-t="aparencia">🎨 Aparência</button>' +
    '</nav>';
}

function left() {
  return '<div class="card pf">' + avatar(me.nome) +
    '<h2>' + esc(me.nome) + '</h2><p>membro do SoCialBr</p></div>' +
    '<div class="card menu">' +
    '<button data-t="mural">🏠 Início</button>' +
    '<button data-t="perfil">👤 Meu perfil</button>' +
    '<button data-t="amigos">👥 Amigos</button>' +
    '<button data-t="grupo">💬 Comunidade</button>' +
    '</div>' +
    '<div class="card"><div class="title"><strong>Comunidade</strong></div>' +
    '<b>' + esc(cur.nome) + '</b><p class="muted">Até 100 participantes.</p></div>';
}

function right() {
  const ms = (data?.membros || []).filter(x => x.status === 'ativo');
  return '<div class="card invite"><h3>Convidar amigos</h3>' +
    '<p>Convite individual. A chave do grupo segue no fragmento do link e não é enviada à API.</p>' +
    '<button class="primary" id="inv">Gerar convite</button></div>' +
    '<div class="card"><div class="title"><strong>Membros</strong><small>' + ms.length + '</small></div>' +
    ms.slice(0,10).map(x => '<div class="member">' + av(x.nome) +
    '<span>' + esc(x.nome) + '</span></div>').join('') + '</div>';
}

async function mural() {
  const ps = data.posts || [];
  const shown = await Promise.all(ps.map(async p => ({
    ...p,
    texto: cur.key ? await dec(p.texto,cur.key) : '…'
  })));

  return '<div class="gb"><div><small>COMUNIDADE</small><br><strong>' +
    esc(cur.nome) + '</strong></div><select id="gs">' +
    groups.map(g => '<option value="' + g.id + '" ' +
      (g.id===cur.id?'selected':'') + '>' + esc(g.nome) + '</option>').join('') +
    '</select></div>' +
    '<div class="card composer"><div class="title"><strong>O que você está pensando?</strong><small>Mural</small></div>' +
    '<textarea id="tx" maxlength="2000" placeholder="Escreva uma novidade..."></textarea>' +
    '<div class="act"><button class="primary" id="pub">Publicar</button></div></div>' +
    shown.map(p => '<article class="card post"><div class="ph">' + av(p.nome) +
      '<div><b>' + esc(p.nome) + '</b><small>' +
      new Date(p.criado_em).toLocaleString('pt-BR') + '</small></div></div>' +
      '<p class="body">' + esc(p.texto) + '</p></article>').join('') +
    (shown.length ? '' : '<div class="card muted" style="text-align:center">Ainda não há publicações.</div>');
}

function perfil() {
  const cover = photo('cover');
  return '<div class="card profile-card"><div class="cover" style="' + (cover ? 'background-image:url(\\'' + cover + '\\')' : '') + '">' +
    photoInput('cover') + '</div><div class="pm">' + avatar(me.nome) +
    '<div><h1>' + esc(me.nome) + '</h1><small>Seu perfil no SoCialBr</small></div>' + photoInput('avatar') + '</div></div>';
}

function amigos() {
  return '<h1>Amigos</h1><div class="card"><div class="people">' +
    (data.membros || []).filter(x => x.status === 'ativo').map(x =>
      '<div class="person">' + av(x.nome) + '<div><b>' +
      esc(x.nome) + '</b><small>Membro</small></div></div>'
    ).join('') + '</div></div>';
}

function grupo() {
  return '<h1>Comunidade</h1><div class="card"><div class="title"><strong>' +
    esc(cur.nome) + '</strong><small>máximo 100</small></div>' +
    '<p>Convites individuais com validade de 7 dias.</p></div>';
}

function aparencia() {
  return '<h1>Aparência</h1>' +
    '<div class="card appearance"><div class="title"><strong>Escolha seu modelo</strong><small>Você pode trocar quando quiser</small></div>' +
    '<div class="appearance-grid">' + Object.entries(MODELS).map(([id,nome]) =>
      '<button class="model-card ' + (appearance.model===id?'selected':'') + '" data-model="' + id + '"><span class="model-preview ' + id + '"></span><b>' + nome + '</b></button>'
    ).join('') + '</div>' +
    '<div class="title theme-title"><strong>Escolha sua capa de cores</strong><small>12 opções</small></div>' +
    '<div class="theme-grid">' + THEMES.map((x,i) => '<button class="theme-card t' + i + ' ' + (Number(appearance.theme)===i?'selected':'') + '" data-theme="' + i + '"><span></span><b>' + x + '</b></button>').join('') + '</div></div>';
}

function groupsPage() {
  return '<h1>Meus grupos</h1><div class="card">' +
    groups.map(g => '<div class="member"><b>' + esc(g.nome) +
      '</b> <button class="secondary" data-open="' + g.id + '">Abrir</button></div>').join('') +
    '</div>';
}

function createPage() {
  shell(
    '<main class="hero"><section class="hero-card">' +
    '<img class="hero-logo" src="logo-grande.png"><h1>Crie sua comunidade</h1>' +
    '<form class="form" id="cg"><label>Nome<input id="gn" maxlength="50" required></label>' +
    '<button class="primary">Criar grupo</button></form></section></main>'
  );

  $('#cg').onsubmit = async e => {
    e.preventDefault();
    try {
      const name = $('#gn').value.trim();
      const k = u64(crypto.getRandomValues(new Uint8Array(32)));
      const r = await api('grupos',{nome:name});
      groups.push({id:r.id,nome:name,key:k});
      save();
      await load(r.id);
    } catch (x) { toast(x.message); }
  };
}

async function render() {
  let body;
  if (tab === 'perfil') body = perfil();
  else if (tab === 'amigos') body = amigos();
  else if (tab === 'grupo') body = grupo();
  else if (tab === 'grupos') body = groupsPage();
  else if (tab === 'aparencia') body = aparencia();
  else body = await mural();

  shell(
    nav() +
    '<main class="page"><div class="layout">' +
    '<aside class="col left">' + left() + '</aside>' +
    '<section class="col">' + body + '</section>' +
    '<aside class="col right">' + right() + '</aside>' +
    '</div></main>'
  );

  document.querySelectorAll('[data-t]').forEach(b => {
    b.onclick = () => { tab = b.dataset.t; render(); };
  });

  $('#gs')?.addEventListener('change', e => load(e.target.value));

  $('#pub')?.addEventListener('click', async () => {
    const t = $('#tx').value.trim();
    if (!t) return toast('Escreva algo');
    if (!cur.key) return toast('Chave local do grupo não encontrada');

    try {
      await api('grupos/' + cur.id + '/posts',{texto:await enc(t,cur.key)});
      await load(cur.id);
      toast('Publicado');
    } catch (x) { toast(x.message); }
  });

  $('#inv')?.addEventListener('click',invite);
  bindPhotos();

  document.querySelectorAll('[data-open]').forEach(b => {
    b.onclick = () => load(b.dataset.open);
  });

  document.querySelectorAll('[data-model]').forEach(b => {
    b.onclick = () => { appearance.model = b.dataset.model; saveAppearance(); render(); };
  });
  document.querySelectorAll('[data-theme]').forEach(b => {
    b.onclick = () => { appearance.theme = Number(b.dataset.theme); saveAppearance(); render(); };
  });
}

async function invite() {
  try {
    if (!cur.key) return toast('Chave local do grupo não encontrada');
    const r = await api('grupos/' + cur.id + '/convites',{});
    const url = location.origin + '/?convite=' +
      encodeURIComponent(r.token) + '#k=' + cur.key;
    await navigator.clipboard.writeText(url);
    toast('Convite copiado');
  } catch (x) { toast(x.message); }
}

start();
