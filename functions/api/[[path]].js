// SoCialBr API (Cloudflare Pages Function + D1 binding "DB"). O servidor só guarda texto já criptografado.
const J=(o,s=200)=>new Response(JSON.stringify(o),{status:s,headers:{'Content-Type':'application/json','Cache-Control':'no-store'}});
const rid=()=>[...crypto.getRandomValues(new Uint8Array(16))].map(b=>b.toString(16).padStart(2,'0')).join('');
const hex=async t=>[...new Uint8Array(await crypto.subtle.digest('SHA-256',new TextEncoder().encode(t)))].map(b=>b.toString(16).padStart(2,'0')).join('');
const ok=(v,n)=>typeof v==='string'&&v.length>0&&v.length<=n;

export async function onRequest({request,env}){
  const db=env.DB;
  if(!db)return J({erro:'Banco D1 não conectado (variável DB).'},500);
  const u=new URL(request.url),p=u.pathname.replace(/^\/api\//,''),m=request.method;
  let b={};
  if(m!=='GET'){try{b=await request.json()}catch{return J({erro:'Pedido inválido'},400)}}
  try{
    if(p==='criar'&&m==='POST'){
      if(!ok(b.nome,300))return J({erro:'Nome inválido'},400);
      const id=rid();
      await db.prepare('INSERT INTO grupos(id,nome,t) VALUES(?,?,?)').bind(id,b.nome,Date.now()).run();
      return J({gid:id});
    }
    if(p==='entrar'&&m==='POST'){
      if(!ok(b.gid,64)||!ok(b.nome,300)||typeof b.sobre!=='string'||b.sobre.length>1200)return J({erro:'Dados inválidos'},400);
      const g=await db.prepare('SELECT id FROM grupos WHERE id=?').bind(b.gid).first();
      if(!g)return J({erro:'Grupo não existe. Peça um link novo.'},404);
      const n=await db.prepare('SELECT COUNT(*) c FROM membros WHERE gid=?').bind(b.gid).first();
      if(n.c>=200)return J({erro:'Grupo cheio.'},400);
      const mid=rid(),token=rid();
      await db.prepare('INSERT INTO membros(id,gid,nome,sobre,token,t) VALUES(?,?,?,?,?,?)').bind(mid,b.gid,b.nome,b.sobre,await hex(token),Date.now()).run();
      return J({mid,token});
    }
    const [mid,token]=(request.headers.get('X-Token')||'').split('.');
    const gid=u.searchParams.get('gid')||b.gid;
    const me=mid&&token&&gid&&await db.prepare('SELECT id FROM membros WHERE id=? AND gid=? AND token=?').bind(mid,gid,await hex(token)).first();
    if(!me)return J({erro:'Acesso negado'},401);
    if(p==='dados'&&m==='GET'){
      const g=await db.prepare('SELECT nome FROM grupos WHERE id=?').bind(gid).first();
      const ms=await db.prepare('SELECT id,nome,sobre FROM membros WHERE gid=? ORDER BY t').bind(gid).all();
      const rs=await db.prepare('SELECT id,para,de,texto,t FROM recados WHERE gid=? ORDER BY t DESC LIMIT 300').bind(gid).all();
      return J({grupo:g.nome,membros:ms.results,recados:rs.results});
    }
    if(p==='recado'&&m==='POST'){
      if(!ok(b.texto,1500)||typeof b.para!=='string')return J({erro:'Recado inválido'},400);
      if(b.para!==''){
        const a=await db.prepare('SELECT id FROM membros WHERE id=? AND gid=?').bind(b.para,gid).first();
        if(!a)return J({erro:'Amigo não encontrado'},404);
      }
      await db.prepare('INSERT INTO recados(id,gid,para,de,texto,t) VALUES(?,?,?,?,?,?)').bind(rid(),gid,b.para,mid,b.texto,Date.now()).run();
      return J({ok:true});
    }
    if(p==='perfil'&&m==='PUT'){
      if(!ok(b.nome,300)||typeof b.sobre!=='string'||b.sobre.length>1200)return J({erro:'Dados inválidos'},400);
      await db.prepare('UPDATE membros SET nome=?,sobre=? WHERE id=?').bind(b.nome,b.sobre,mid).run();
      return J({ok:true});
    }
    return J({erro:'Não encontrado'},404);
  }catch(e){return J({erro:'Falha no servidor'},500)}
}
