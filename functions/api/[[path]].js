// SoCialBR API v1 (savepoint v2). Binding D1 obrigatorio: DB
const MAX_MEMBROS_GRUPO = 100; // TESTE, provisorio
const DESPEDIDA_DIAS = 30, CONVITE_DIAS = 7, DIA = 864e5;
const J = (d, s = 200) => new Response(JSON.stringify(d), { status: s, headers: { 'content-type': 'application/json' } });
const E = (m, s = 400) => J({ erro: m }, s);
const hex = b => [...new Uint8Array(b)].map(x => x.toString(16).padStart(2, '0')).join('');
const rnd = () => hex(crypto.getRandomValues(new Uint8Array(24)));
const sha = async t => hex(await crypto.subtle.digest('SHA-256', new TextEncoder().encode(t)));
const ARV = `WITH RECURSIVE t(u) AS (SELECT ?2 UNION SELECT m.user_id FROM members m JOIN t ON m.invited_by=t.u WHERE m.group_id=?1)`;

export async function onRequest({ request, env }) {
  const db = env.DB; if (!db) return E('Banco D1 nao conectado (variavel DB)', 500);
  const p = new URL(request.url).pathname.replace(/^\/api\/?/, '').split('/').filter(Boolean), m = request.method, now = Date.now();
  const body = m === 'POST' ? await request.json().catch(() => ({})) : {};

  if (p[0] === 'registrar' && m === 'POST') {
    const nome = String(body.nome || '').trim().slice(0, 40); if (!nome) return E('Diga seu nome');
    const id = rnd(), token = rnd();
    await db.prepare('INSERT INTO users(id,nome,token_hash,criado_em) VALUES(?,?,?,?)').bind(id, nome, await sha(token), now).run();
    return J({ token, id, nome });
  }
  const tk = (request.headers.get('authorization') || '').replace('Bearer ', '');
  const me = tk ? await db.prepare('SELECT id,nome FROM users WHERE token_hash=?').bind(await sha(tk)).first() : null;
  if (!me) return E('Entre primeiro', 401);
  if (p[0] === 'eu') return J(me);

  if (p[0] === 'grupos' && !p[1]) {
    if (m === 'GET') return J((await db.prepare(`SELECT g.id,g.nome,g.status,m.status AS meu_status,m.despedida_ate FROM members m JOIN grupos g ON g.id=m.group_id WHERE m.user_id=? ORDER BY g.criado_em`).bind(me.id).all()).results);
    const nome = String(body.nome || '').trim().slice(0, 50); if (!nome) return E('Diga o nome do grupo');
    const id = rnd();
    await db.batch([db.prepare('INSERT INTO grupos(id,nome,dono_id,criado_em) VALUES(?,?,?,?)').bind(id, nome, me.id, now),
      db.prepare('INSERT INTO members(group_id,user_id,invited_by,entrou_em) VALUES(?,?,NULL,?)').bind(id, me.id, now)]);
    return J({ id });
  }

  if (p[0] === 'convites' && p[1] === 'aceitar' && m === 'POST') {
    const inv = await db.prepare('SELECT * FROM invites WHERE token_hash=?').bind(await sha(String(body.token || ''))).first();
    if (!inv || inv.status !== 'novo' || inv.expira_em < now) return E('Convite invalido ou vencido');
    const g = await db.prepare('SELECT status FROM grupos WHERE id=?').bind(inv.group_id).first();
    if (!g || g.status !== 'ativo') return E('Grupo indisponivel');
    if (await db.prepare('SELECT 1 FROM members WHERE group_id=? AND user_id=?').bind(inv.group_id, me.id).first()) return E('Voce ja esta neste grupo');
    const n = (await db.prepare('SELECT COUNT(*) c FROM members WHERE group_id=?').bind(inv.group_id).first()).c;
    if (n >= MAX_MEMBROS_GRUPO) return E('Grupo cheio');
    await db.batch([db.prepare('INSERT INTO members(group_id,user_id,invited_by,entrou_em) VALUES(?,?,?,?)').bind(inv.group_id, me.id, inv.invited_by, now),
      db.prepare("UPDATE invites SET status='usado',usado_por=? WHERE id=?").bind(me.id, inv.id)]);
    return J({ group_id: inv.group_id });
  }

  if (p[0] === 'grupos' && p[1]) {
    const g = p[1], mem = await db.prepare('SELECT * FROM members WHERE group_id=? AND user_id=?').bind(g, me.id).first();
    const grp = await db.prepare('SELECT * FROM grupos WHERE id=?').bind(g).first();
    if (!mem || !grp) return E('Grupo nao encontrado', 404);
    const ativo = mem.status === 'ativo' && grp.status === 'ativo', a = p[2];

    if (a === 'posts' && m === 'GET') {
      const posts = (await db.prepare('SELECT p.id,p.conteudo_cifrado AS texto,p.criado_em,u.nome FROM posts p JOIN users u ON u.id=p.author_id WHERE p.group_id=? ORDER BY p.criado_em DESC LIMIT 100').bind(g).all()).results;
      const membros = (await db.prepare("SELECT m.user_id,u.nome,m.invited_by,m.status FROM members m JOIN users u ON u.id=m.user_id WHERE m.group_id=?").bind(g).all()).results;
      return J({ grupo: { nome: grp.nome, status: grp.status }, eu: { status: mem.status, despedida_ate: mem.despedida_ate, despedida_por: mem.despedida_por }, posts, membros });
    }
    if (a === 'posts' && m === 'POST') {
      if (!ativo) return E('Voce esta so em modo leitura');
      const t = String(body.texto || '').trim().slice(0, 2000); if (!t) return E('Escreva algo');
      await db.prepare('INSERT INTO posts(id,group_id,author_id,conteudo_cifrado,criado_em) VALUES(?,?,?,?,?)').bind(rnd(), g, me.id, t, now).run();
      return J({ ok: 1 });
    }
    if (a === 'convites' && m === 'POST') {
      if (!ativo) return E('Voce nao pode convidar agora');
      if (await db.prepare('SELECT 1 FROM bans WHERE user_id=? AND fim>?').bind(me.id, now).first()) return E('Voce esta sem poder convidar por um periodo');
      const token = rnd();
      await db.prepare('INSERT INTO invites(id,group_id,invited_by,token_hash,expira_em) VALUES(?,?,?,?,?)').bind(rnd(), g, me.id, await sha(token), now + CONVITE_DIAS * DIA).run();
      return J({ token });
    }
    if (a === 'saida' && m === 'GET') {
      const r = await db.prepare(`${ARV} SELECT COUNT(*) c FROM t`).bind(g, me.id).first();
      return J({ afetados: r.c - 1 });
    }
    if ((a === 'sair' || a === 'remover') && m === 'POST') {
      if (!ativo) return E('Nada a fazer agora');
      let alvo = me.id;
      if (a === 'remover') { // R4: so quem convidou remove
        alvo = String(body.user_id || '');
        const t = await db.prepare('SELECT invited_by FROM members WHERE group_id=? AND user_id=?').bind(g, alvo).first();
        if (!t || t.invited_by !== me.id) return E('So quem convidou pode retirar', 403);
      }
      const ate = now + DESPEDIDA_DIAS * DIA;
      const st = [db.prepare(`UPDATE members SET status='despedida',despedida_ate=?3,despedida_por=?4 WHERE group_id=?1 AND status='ativo' AND user_id IN (${ARV.replace('?2', '?2')} SELECT u FROM t)`).bind(g, alvo, ate, me.id)];
      if (a === 'sair' && grp.dono_id === me.id) st.push(db.prepare("UPDATE grupos SET status='despedida',despedida_ate=? WHERE id=?").bind(ate, g));
      st.push(db.prepare('INSERT INTO audit_log(evento,ator,alvo,quando) VALUES(?,?,?,?)').bind(a, me.id, alvo, now));
      await db.batch(st); return J({ ok: 1, ate });
    }
    if (a === 'voltar' && m === 'POST') { // desfaz saida/remocao feita por mim dentro dos 30 dias
      const r = await db.prepare("UPDATE members SET status='ativo',despedida_ate=NULL,despedida_por=NULL WHERE group_id=? AND despedida_por=? AND despedida_ate>?").bind(g, me.id, now).run();
      if (!r.meta.changes) return E('Nada para restaurar');
      if (grp.dono_id === me.id) await db.prepare("UPDATE grupos SET status='ativo',despedida_ate=NULL WHERE id=?").bind(g).run();
      return J({ ok: 1 });
    }
  }
  return E('Rota nao encontrada', 404);
}
