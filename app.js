const $=s=>document.querySelector(s),app=$('#app');
const esc=s=>String(s??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const b64=b=>btoa(String.fromCharCode(...new Uint8Array(b)));
const unb64=s=>Uint8Array.from(atob(s),c=>c.charCodeAt(0));
const b64u=b=>b64(b).replace(/\+/g,'-').replace(/\//g,'_').replace(/=/g,'');
const unb64u=s=>unb64(s.replace(/-/g,'+').replace(/_/g,'/'));
const keys={};
const K=async k=>keys[k]||(keys[k]=await crypto.subtle.importKey('raw',unb64u(k),'AES-GCM',false,['encrypt','decrypt']));
async function enc(t,k){const iv=crypto.getRandomValues(new Uint8Array(12));const c=await crypto.subtle.encrypt({name:'AES-GCM',iv},await K(k),new TextEncoder().encode(t));const o=new Uint8Array(12+c.byteLength);o.set(iv);o.set(new Uint8Array(c),12);return b64(o)}
async function dec(s,k){try{const o=unb64(s);return new TextDecoder().decode(await crypto.subtle.decrypt({name:'AES-GCM',iv:o.slice(0,12)},await K(k),o.slice(12)))}catch{return '…'}}

let S=JSON.parse(localStorage.getItem('sb')||'{"s":[],"cur":0}'),cur,data,tab='mural',fr=null,raw='',timer;
const save=()=>localStorage.setItem('sb',JSON.stringify(S));
let tt;const toast=m=>{const t=$('#toast');t.textContent=m;t.hidden=false;clearTimeout(tt);tt=setTimeout(()=>t.hidden=true,3500)};
async function api(path,body,s,method){
  const r=await fetch('/api/'+path,{method:method||(body?'POST':'GET'),headers:{'Content-Type':'application/json',...(s?{'X-Token':s.mid+'.'+s.token}:{})},body:body?JSON.stringify(body):undefined});
  const j=await r.json().catch(()=>({}));if(!r.ok)throw new Error(j.erro||'Erro '+r.status);return j}
async function run(e,fn){e.preventDefault();const b=e.target.querySelector('button');b.disabled=true;try{await fn()}catch(x){toast(x.message)}b.disabled=false}
const shell=h=>{clearInterval(timer);app.innerHTML=`<header><b class=logo><img src=logo-icone.png alt="">SoCial<i>Br</i></b></header><main>${h}</main>`};

function welcome(){
  shell(`<img class=hero src=logo-grande.png alt=SoCialBr><form id=f class=card><h2>Crie o seu grupo de amigos</h2><p>Só entra quem receber o seu link. Tudo é criptografado no seu aparelho.</p><label>Seu nome<input id=n maxlength=40 required></label><label>Nome do grupo<input id=g maxlength=40 required placeholder="Ex.: Galera da escola"></label><button>Criar grupo</button></form>`);
  $('#f').onsubmit=e=>run(e,async()=>{const key=b64u(crypto.getRandomValues(new Uint8Array(32))),g=$('#g').value.trim(),n=$('#n').value.trim();
    const {gid}=await api('criar',{nome:await enc(g,key)});await join(gid,key,n,g)});
}
function invite(h){
  shell(`<img class=hero src=logo-grande.png alt=SoCialBr><form id=f class=card><h2>Você foi convidado!</h2><p>Escolha o nome que seus amigos vão ver.</p><label>Seu nome<input id=n maxlength=40 required></label><button>Entrar no grupo</button></form>`);
  $('#f').onsubmit=e=>run(e,()=>join(h.g,h.k,$('#n').value.trim()));
}
async function join(gid,key,n,gname){
  const r=await api('entrar',{gid,nome:await enc(n,key),sobre:await enc('',key)});
  S.s=S.s.filter(x=>x.gid!=gid).concat({gid,key,gname:gname||'Grupo',...r});S.cur=S.s.length-1;save();
  history.replaceState(null,'',location.pathname);start();
}
function start(){cur=S.s[S.cur];tab='mural';edit=false;raw='';data=null;clearInterval(timer);refresh();timer=setInterval(refresh,5000)}

async function refresh(){
  const me=cur;
  try{
    const d=await api('dados?gid='+me.gid,null,me),r=JSON.stringify(d);
    if(me!==cur||(r==raw&&$('#main')))return;raw=r;const k=me.key;me.gname=await dec(d.grupo,k);save();
    data={m:await Promise.all(d.membros.map(async x=>({id:x.id,nome:await dec(x.nome,k),sobre:await dec(x.sobre,k),foto:await fotoOk(x.foto,k)}))),
      r:await Promise.all(d.recados.map(async x=>({...x,texto:await dec(x.texto,k)})))};
    render(true);
  }catch(e){if(!data)toast(e.message)}
}
let edit=false;
const COR=['#ffd6e8;#a81e5d','#d6e9ff;#1a4da6','#dcfce7;#14532d','#fef9c3;#854d0e','#e0e7ff;#3730a3'];
const fotoOk=async(t,k)=>{if(!t)return'';const f=await dec(t,k);return/^data:image\/jpeg;base64,[A-Za-z0-9+\/=]+$/.test(f)?f:''};
function av(m,z){const n=m.nome||'?',i=n.split(' ').map(w=>w[0]).slice(0,2).join('').toUpperCase(),c=COR[[...n].reduce((q,h)=>q+h.charCodeAt(0),0)%5].split(';');
  return m.foto?`<img class=av src="${m.foto}" style="width:${z}px;height:${z}px" alt="">`:`<span class=av style="width:${z}px;height:${z}px;background:${c[0]};color:${c[1]};font-size:${z/2.8}px">${esc(i)}</span>`}
const small=f=>new Promise((ok,no)=>{const i=new Image();i.onload=()=>{const c=document.createElement('canvas');c.width=c.height=128;const s=Math.min(i.width,i.height);c.getContext('2d').drawImage(i,(i.width-s)/2,(i.height-s)/2,s,s,0,0,128,128);ok(c.toDataURL('image/jpeg',.7))};i.onerror=no;i.src=URL.createObjectURL(f)});
function render(keep){
  const v=keep?$('#tx')?.value||'':'',by=id=>data.m.find(x=>x.id==id)||{nome:'Alguém'};
  const me=data.m.find(x=>x.id==cur.mid)||{nome:'',sobre:'',foto:''},a=data.m.find(x=>x.id==fr);
  const list=id=>data.r.filter(x=>x.para==id).map(x=>{const u=by(x.de);return `<li class=rec>${av(u,38)}<div><b>${esc(u.nome)}</b> <small>${new Date(x.t).toLocaleString('pt-BR',{dateStyle:'short',timeStyle:'short'})}</small><p>${esc(x.texto)}</p></div></li>`}).join('')||'<li class=vazio>Nenhum recado ainda. Seja o primeiro!</li>';
  const box=ph=>`<form id=f class=card><textarea id=tx maxlength=400 required placeholder="${esc(ph)}"></textarea><button>Publicar recado</button></form>`;
  const left=edit?`<form id=p class="card pfb"><label>Foto de perfil<input type=file id=ph accept="image/*"></label><label>Seu nome<input id=pn maxlength=40 required value="${esc(me.nome)}"></label><label>Sobre mim<textarea id=ps maxlength=300>${esc(me.sobre)}</textarea></label><button>Salvar perfil</button></form>`
    :`<div class="card pf"><div class=ban></div><div class=pfb>${av(me,72)}<h2>${esc(me.nome)}</h2><p>${esc(me.sobre)||'<span class=vazio>Conte algo sobre você.</span>'}</p><button class="btn alt" id=ed>Editar perfil e foto</button></div></div>`;
  const mid=tab=='amigo'&&a?`<button class=link data-t=amigos>‹ Voltar aos amigos</button><div class="card pfb">${av(a,64)}<h2>${esc(a.nome)}</h2><p>${esc(a.sobre)||'<span class=vazio>Sem descrição ainda.</span>'}</p></div>${box('Deixe um recado para '+a.nome)}<ul class=card>${list(a.id)}</ul>`:box('Escreva para o grupo todo')+`<ul class=card>${list('')}</ul>`;
  const right=`<button id=inv class="btn alt">Convidar amigo da agenda</button><div class="card pfb"><h3>Amigos (${data.m.length})</h3><div class=grid>${data.m.map(x=>`<button class=fr data-f="${x.id}">${av(x,64)}<small>${esc(x.nome)}</small></button>`).join('')}</div></div>`;
  app.innerHTML=`<header><b class=logo><img src=logo-icone.png alt="">SoCial<i>Br</i></b><span class=hr><select id=sel aria-label="Meus grupos">${S.s.map((x,i)=>`<option value=${i} ${i==S.cur?'selected':''}>${esc(x.gname)}</option>`).join('')}<option value=n>+ Criar outro grupo</option></select>${av(me,36)}</span></header>
<nav>${[['mural','Mural'],['amigos','Amigos'],['eu','Meu perfil']].map(([t,l])=>`<button data-t=${t} class="${tab==t||(tab=='amigo'&&t=='amigos')?'on':''}">${l}</button>`).join('')}</nav>
<main id=main data-tab=${tab=='amigo'?'mural':tab}><div class="col cp">${left}</div><div class="col cm">${mid}</div><div class="col ca">${right}</div></main>`;
  if(v&&$('#tx'))$('#tx').value=v;
  $('#sel').onchange=e=>{if(e.target.value=='n')welcome();else{S.cur=+e.target.value;save();start()}};
  $('#inv').onclick=convidar;
  if($('#ed'))$('#ed').onclick=()=>{edit=true;tab='eu';render()};
  document.querySelectorAll('[data-t]').forEach(b=>b.onclick=()=>{tab=b.dataset.t;render()});
  document.querySelectorAll('[data-f]').forEach(b=>b.onclick=()=>{tab='amigo';fr=b.dataset.f;render()});
  if($('#f'))$('#f').onsubmit=e=>run(e,async()=>{await api('recado',{gid:cur.gid,para:tab=='amigo'?fr:'',texto:await enc($('#tx').value.trim(),cur.key)},cur);$('#tx').value='';raw='';await refresh();toast('Recado publicado!')});
  if($('#p'))$('#p').onsubmit=e=>run(e,async()=>{let foto=me.foto||'';const f=$('#ph').files[0];if(f)foto=await small(f);
    await api('perfil',{gid:cur.gid,nome:await enc($('#pn').value.trim(),cur.key),sobre:await enc($('#ps').value.trim(),cur.key),foto:await enc(foto,cur.key)},cur,'PUT');edit=false;raw='';await refresh();toast('Perfil salvo!')});
}
async function convidar(){
  const msg=`Entre no meu grupo "${cur.gname}" no SoCialBr: ${location.origin}/#g=${cur.gid}&k=${cur.key}`;
  try{
    if('contacts' in navigator&&navigator.contacts.select){
      const c=await navigator.contacts.select(['name','tel'],{multiple:false}),t=(c[0]?.tel?.[0]||'').replace(/\D/g,'');
      if(t)return void window.open(`https://wa.me/${t.length<=11?'55'+t:t}?text=${encodeURIComponent(msg)}`,'_blank');
    }
    if(navigator.share)return await navigator.share({text:msg});
    await navigator.clipboard.writeText(msg);toast('Link copiado. Cole no WhatsApp.');
  }catch(e){if(e.name!='AbortError')toast('Não deu para abrir. Tente de novo.')}
}
const h=(p=>({g:p.get('g'),k:p.get('k')}))(new URLSearchParams(location.hash.slice(1))),ex=S.s.findIndex(x=>x.gid==h.g);
if(h.g&&h.k&&ex<0)invite(h);else{if(ex>=0){S.cur=ex;history.replaceState(null,'',location.pathname)}S.s[S.cur]?start():welcome()}
