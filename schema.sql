PRAGMA foreign_keys=ON;

CREATE TABLE IF NOT EXISTS users (id TEXT PRIMARY KEY,nome TEXT NOT NULL,token_hash TEXT NOT NULL UNIQUE,criado_em INTEGER NOT NULL);
CREATE TABLE IF NOT EXISTS grupos (id TEXT PRIMARY KEY,nome TEXT NOT NULL,dono_id TEXT NOT NULL,status TEXT NOT NULL DEFAULT 'ativo',despedida_ate INTEGER,criado_em INTEGER NOT NULL,FOREIGN KEY(dono_id) REFERENCES users(id));
CREATE TABLE IF NOT EXISTS members (group_id TEXT NOT NULL,user_id TEXT NOT NULL,invited_by TEXT,status TEXT NOT NULL DEFAULT 'ativo',entrou_em INTEGER NOT NULL,despedida_ate INTEGER,despedida_por TEXT,PRIMARY KEY(group_id,user_id),FOREIGN KEY(group_id) REFERENCES grupos(id),FOREIGN KEY(user_id) REFERENCES users(id),FOREIGN KEY(invited_by) REFERENCES users(id));
CREATE INDEX IF NOT EXISTS idx_members_user ON members(user_id);
CREATE INDEX IF NOT EXISTS idx_members_group_status ON members(group_id,status);
CREATE INDEX IF NOT EXISTS idx_members_invited_by ON members(group_id,invited_by);
CREATE TABLE IF NOT EXISTS invites (id TEXT PRIMARY KEY,group_id TEXT NOT NULL,invited_by TEXT NOT NULL,token_hash TEXT NOT NULL UNIQUE,expira_em INTEGER NOT NULL,status TEXT NOT NULL DEFAULT 'novo',usado_por TEXT,FOREIGN KEY(group_id) REFERENCES grupos(id),FOREIGN KEY(invited_by) REFERENCES users(id),FOREIGN KEY(usado_por) REFERENCES users(id));
CREATE INDEX IF NOT EXISTS idx_invites_group ON invites(group_id);
CREATE INDEX IF NOT EXISTS idx_invites_expira ON invites(expira_em,status);
CREATE TABLE IF NOT EXISTS posts (id TEXT PRIMARY KEY,group_id TEXT NOT NULL,author_id TEXT NOT NULL,conteudo_cifrado TEXT NOT NULL,criado_em INTEGER NOT NULL,FOREIGN KEY(group_id) REFERENCES grupos(id),FOREIGN KEY(author_id) REFERENCES users(id));
CREATE INDEX IF NOT EXISTS idx_posts_group_date ON posts(group_id,criado_em DESC);
CREATE TABLE IF NOT EXISTS bans (id TEXT PRIMARY KEY,user_id TEXT NOT NULL,fim INTEGER NOT NULL,motivo TEXT,criado_em INTEGER NOT NULL,FOREIGN KEY(user_id) REFERENCES users(id));
CREATE INDEX IF NOT EXISTS idx_bans_user_fim ON bans(user_id,fim);
CREATE TABLE IF NOT EXISTS audit_log (id INTEGER PRIMARY KEY AUTOINCREMENT,evento TEXT NOT NULL,ator TEXT NOT NULL,alvo TEXT NOT NULL,quando INTEGER NOT NULL,FOREIGN KEY(ator) REFERENCES users(id),FOREIGN KEY(alvo) REFERENCES users(id));
CREATE INDEX IF NOT EXISTS idx_audit_quando ON audit_log(quando);