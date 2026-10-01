const DIA=864e5;

export default {
  async scheduled(event, env, ctx) {
    const now=Date.now();
    await env.DB.batch([
      env.DB.prepare("UPDATE invites SET status='expirado' WHERE status='novo' AND expira_em<=?").bind(now),
      env.DB.prepare("UPDATE members SET status='inativo' WHERE status='despedida' AND despedida_ate IS NOT NULL AND despedida_ate<=?").bind(now),
      env.DB.prepare("UPDATE grupos SET status='inativo' WHERE status='despedida' AND despedida_ate IS NOT NULL AND despedida_ate<=?").bind(now)
    ]);
  }
};