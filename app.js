const { useState, useEffect, useRef } = React;

// ==================== ÍCONES ====================
const Icon = ({ path, size = 24, className = "" }) => (
  <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>{path}</svg>
);
const Icons = {
  Eye: <><path d="M2.062 12.348a1 1 0 0 1 0-.696 10.75 10.75 0 0 1 19.876 0 1 1 0 0 1 0 .696 10.75 10.75 0 0 1-19.876 0"/><circle cx="12" cy="12" r="3"/></>,
  House: <><path d="M15 21v-8a1 1 0 0 0-1-1h-4a1 1 0 0 0-1 1v8"/><path d="M3 10a2 2 0 0 1 .709-1.528l7-5.999a2 2 0 0 1 2.582 0l7 5.999A2 2 0 0 1 21 10v9a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/></>,
  Key: <><path d="M2.586 17.414A2 2 0 0 0 2 18.828V21a1 1 0 0 0 1 1h3a1 1 0 0 0 1-1v-1a1 1 0 0 1 1-1h1a1 1 0 0 0 1-1v-1a1 1 0 0 1 1-1h.172a2 2 0 0 0 1.414-.586l.814-.814a6.5 6.5 0 1 0-4-4z"/><circle cx="16.5" cy="7.5" r=".5" fill="currentColor"/></>,
  Lock: <><rect width="18" height="11" x="3" y="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></>,
  Menu: <><line x1="4" x2="20" y1="12" y2="12"/><line x1="4" x2="20" y1="6" y2="6"/><line x1="4" x2="20" y1="18" y2="18"/></>,
  Message: <><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/></>,
  Pen: <><path d="M21.174 6.812a1 1 0 0 0-3.986-3.987L3.842 16.174a2 2 0 0 0-.5.83l-1.321 4.352a.5.5 0 0 0 .623.622l4.353-1.32a2 2 0 0 0 .83-.497z"/></>,
  Send: <><path d="M14.536 21.686a.5.5 0 0 0 .937-.024l6.5-19a.496.496 0 0 0-.635-.635l-19 6.5a.5.5 0 0 0-.024.937l7.93 3.18a2 2 0 0 1 1.112 1.11z"/><path d="m21.854 2.147-10.94 10.939"/></>,
  Shield: <><path d="M20 13c0 5-3.5 7.5-7.66 8.95a1 1 0 0 1-.67-.01C7.5 20.5 4 18 4 13V6a1 1 0 0 1 1-1c2 0 4.5-1.2 6.24-2.72a1.17 1.17 0 0 1 1.52 0C14.51 3.81 17 5 19 5a1 1 0 0 1 1 1z"/><path d="m9 12 2 2 4-4"/></>,
  Smile: <><circle cx="12" cy="12" r="10"/><path d="M8 14s1.5 2 4 2 4-2 4-2"/><line x1="9" x2="9.01" y1="9" y2="9"/><line x1="15" x2="15.01" y1="9" y2="9"/></>,
  User: <><path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></>,
  Users: <><path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M22 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></>,
  X: <><path d="M18 6 6 18"/><path d="m6 6 12 12"/></>,
  Zap: <><path d="M4 14a1 1 0 0 1-.78-1.63l9.9-10.2a.5.5 0 0 1 .86.46l-1.92 6.02A1 1 0 0 0 13 10h7a1 1 0 0 1 .78 1.63l-9.9 10.2a.5.5 0 0 1-.86-.46l1.92-6.02A1 1 0 0 0 11 14z"/></>,
  Heart: <><path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z"/></>,
  Scale: <><path d="m16 16 3-8 3 8c-.87.65-1.92 1-3 1s-2.13-.35-3-1Z"/><path d="m2 16 3-8 3 8c-.87.65-1.92 1-3 1s-2.13-.35-3-1Z"/><path d="M7 21h10"/><path d="M12 3v18"/><path d="M3 7h2c2 0 5-1 7-2 2 1 5 2 7 2h2"/></>,
  AlertCircle: <><circle cx="12" cy="12" r="10"/><line x1="12" x2="12" y1="8" y2="12"/><line x1="12" x2="12.01" y1="16" y2="16"/></>,
  Database: <><ellipse cx="12" cy="5" rx="9" ry="3"/><path d="M3 5V19A9 3 0 0 0 21 19V5"/><path d="M3 12A9 3 0 0 0 21 12"/></>,
  LogOut: <><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/><polyline points="16 17 21 12 16 7"/><line x1="21" x2="9" y1="12" y2="12"/></>,
  Megaphone: <><path d="m3 11 18-5v12L3 14v-3z"/><path d="M11.6 16.8a3 3 0 1 1-5.8-1.6"/></>,
  Image: <><rect width="18" height="18" x="3" y="3" rx="2" ry="2"/><circle cx="9" cy="9" r="2"/><path d="m21 15-3.086-3.086a2 2 0 0 0-2.828 0L6 21"/></>,
};

// ==================== MODERAÇÃO BLINDADA ====================
const ModerationService = {
  bannedConcepts: [
    'morte', 'morto', 'matou', 'assassinato', 'feminicídio', 'feminicidio', 
    'violência', 'violencia', 'arma', 'tiroteio', 'ódio', 'odio', 'racismo',
    'nudez', 'nu', 'nua', 'sexo', 'pornografia', 'pedofilia', 'pedófilo', 'pedofilo',
    'política', 'politica', 'partido', 'eleição', 'presidente', 'governo', 
    'religião', 'religiao', 'igreja', 'deus', 'bíblia', 'biblia', 'culto',
    'tigrinho', 'jogo do tigre', 'fortune tiger', 'bet', 'bets', 'aposta', 'apostas', 
    'cassino', 'casino', 'roleta', 'blaze', 'ganhar dinheiro fácil', 'renda extra fácil', 
    'pix grátis', 'golpe do pix', 'urubu do pix', 'aviator', 'mines'
  ],
  
  check(text) {
    const lowerText = text.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "");
    const normalizedBanned = this.bannedConcepts.map(word => 
      word.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "")
    );
    for (let word of normalizedBanned) {
      if (lowerText.includes(word)) {
        return { 
          safe: false, 
          reason: "⛔ Conteúdo bloqueado: Viola as regras da comunidade (tema proibido: violência, conteúdo impróprio, política, religião ou jogos de azar)." 
        };
      }
    }
    return { safe: true };
  }
};

// ==================== STORAGE ====================
const StorageService = {
  save(key, data) { try { localStorage.setItem(`socialbr_${key}`, JSON.stringify(data)); return true; } catch (e) { return false; } },
  load(key) { try { const data = localStorage.getItem(`socialbr_${key}`); return data ? JSON.parse(data) : null; } catch (e) { return null; } },
  exportAll() { const data = {}; for (let i = 0; i < localStorage.length; i++) { const key = localStorage.key(i); if (key.startsWith('socialbr_')) data[key] = localStorage.getItem(key); } return JSON.stringify(data, null, 2); },
  importAll(jsonString) { try { const data = JSON.parse(jsonString); Object.keys(data).forEach(key => localStorage.setItem(key, data[key])); return true; } catch (e) { return false; } }
};

// ==================== GOOGLE DRIVE ====================
const GoogleDriveService = {
  CLIENT_ID: 'SEU_CLIENT_ID_AQUI.apps.googleusercontent.com',
  API_KEY: 'SUA_API_KEY_AQUI',
  SCOPES: 'https://www.googleapis.com/auth/drive.file',
  
  isConfigured() {
    return this.CLIENT_ID !== 'SEU_CLIENT_ID_AQUI.apps.googleusercontent.com';
  },
  
  async loadGapi() {
    return new Promise((resolve, reject) => {
      if (window.gapi) { resolve(window.gapi); return; }
      const script = document.createElement('script');
      script.src = 'https://apis.google.com/js/api.js';
      script.onload = () => resolve(window.gapi);
      script.onerror = reject;
      document.body.appendChild(script);
    });
  },
  
  async loadGis() {
    return new Promise((resolve, reject) => {
      if (window.google?.accounts?.oauth2) { resolve(window.google.accounts.oauth2); return; }
      const script = document.createElement('script');
      script.src = 'https://accounts.google.com/gsi/client';
      script.onload = () => resolve(window.google.accounts.oauth2);
      script.onerror = reject;
      document.body.appendChild(script);
    });
  },
  
  async authenticate() {
    if (!this.isConfigured()) throw new Error('Google Drive não configurado');
    const gis = await this.loadGis();
    const tokenClient = gis.initTokenClient({
      client_id: this.CLIENT_ID,
      scope: this.SCOPES,
      callback: (response) => {
        if (response.error) throw new Error(response.error);
        return response.access_token;
      }
    });
    return new Promise((resolve, reject) => {
      tokenClient.callback = (response) => {
        if (response.error) reject(new Error(response.error));
        else resolve(response.access_token);
      };
      tokenClient.requestAccessToken();
    });
  },
  
  async saveToDrive(data, token) {
    const gapi = await this.loadGapi();
    await new Promise(resolve => gapi.load('client', resolve));
    await gapi.client.init({ apiKey: this.API_KEY });
    
    const fileMetadata = {
      name: `socialbr_backup_${new Date().toISOString().slice(0, 10)}.json`,
      mimeType: 'application/json',
    };
    
    const formData = new FormData();
    formData.append('metadata', new Blob([JSON.stringify(fileMetadata)], { type: 'application/json' }));
    formData.append('file', new Blob([JSON.stringify(data)], { type: 'application/json' }));
    
    const response = await fetch('https://www.googleapis.com/upload/drive/v3/files?uploadType=multipart', {
      method: 'POST',
      headers: new Headers({ 'Authorization': 'Bearer ' + token }),
      body: formData
    });
    
    return await response.json();
  }
};

// ==================== COMPONENTES UI ====================
const Avatar = ({ name, size = "md", online = false }) => {
  const initials = name.split(' ').map(n => n[0]).slice(0, 2).join('').toUpperCase();
  const colors = ['bg-[#FFD6E8] text-[#A81E5D]', 'bg-[#D6E9FF] text-[#1A4DA6]', 'bg-[#DCFCE7] text-[#14532D]', 'bg-[#FEF9C3] text-[#854D0E]'];
  const hash = name.split('').reduce((acc, c) => acc + c.charCodeAt(0), 0) % colors.length;
  const sizes = { sm: 'w-8 h-8 text-[11px]', md: 'w-9 h-9 text-[12px]', xl: 'w-[76px] h-[76px] text-[20px]' };
  return (
    <div className={`relative shrink-0 rounded-full border border-[#B8D4FF] grid place-items-center font-bold ${colors[hash]} ${sizes[size]}`}>
      {initials}
      {online && <span className="absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-[#22C55E] rounded-full border-2 border-white"></span>}
    </div>
  );
};

// ==================== APP PRINCIPAL ====================
function App() {
  const [user, setUser] = useState(() => StorageService.load('user') || { name: '', bio: 'Vivendo offline por opção. Sem algoritmo, só amigos.' });
  const [isLoggedIn, setIsLoggedIn] = useState(() => !!StorageService.load('user'));
  const [loginName, setLoginName] = useState('');
  const [messages, setMessages] = useState(() => StorageService.load('messages') || [
    { id: 1, from: "Marina L.", text: "Saudades do tempo que rede social era pra gente se encontrar. Amando o SoCialBr!", encrypted: false, time: "2h atrás", likes: 3 },
  ]);
  const [ads, setAds] = useState(() => StorageService.load('ads') || [
    { id: 99, title: "Curso de Privacidade Digital", description: "Aprenda a proteger seus dados. Sem rastreamento, sem pegadinhas.", mediaUrl: "", link: "#", expiresAt: Date.now() + 30*24*60*60*1000 }
  ]);
  const [groups, setGroups] = useState(() => StorageService.load('groups') || []);
  const [newMessage, setNewMessage] = useState('');
  const [encryptEnabled, setEncryptEnabled] = useState(true);
  const [activeTab, setActiveTab] = useState('inicio');
  const [showMobileMenu, setShowMobileMenu] = useState(false);
  const [showEditProfile, setShowEditProfile] = useState(false);
  const [editName, setEditName] = useState('');
  const [editBio, setEditBio] = useState('');
  const [likedMessages, setLikedMessages] = useState(() => new Set(StorageService.load('liked') || []));
  const [toast, setToast] = useState(null);
  const [showLegalModal, setShowLegalModal] = useState(null);
  const [showAdModal, setShowAdModal] = useState(false);
  const [showGroupModal, setShowGroupModal] = useState(false);
  const [adForm, setAdForm] = useState({ title: '', description: '', mediaUrl: '', link: '' });
  const [groupForm, setGroupForm] = useState({ name: '', description: '', isEncrypted: true });
  const [cryptoKey, setCryptoKey] = useState(null);
  const [keyDisplay, setKeyDisplay] = useState('GERANDO...');
  const [backupStatus, setBackupStatus] = useState(null);

  useEffect(() => {
    (async () => {
      try {
        const key = await window.crypto.subtle.generateKey({ name: "AES-GCM", length: 256 }, true, ["encrypt", "decrypt"]);
        setCryptoKey(key);
        const raw = await window.crypto.subtle.exportKey("raw", key);
        const bytes = new Uint8Array(raw);
        const hex = Array.from(bytes).map(b => b.toString(16).padStart(2, '0')).join('').toUpperCase();
        setKeyDisplay(hex.match(/.{1,4}/g)?.join(' ') || hex);
      } catch (e) { setKeyDisplay('ERRO'); }
    })();
  }, []);

  useEffect(() => { if (user.name) StorageService.save('user', user); }, [user]);
  useEffect(() => { StorageService.save('messages', messages); }, [messages]);
  useEffect(() => { StorageService.save('ads', ads); }, [ads]);
  useEffect(() => { StorageService.save('groups', groups); }, [groups]);
  useEffect(() => { StorageService.save('liked', Array.from(likedMessages)); }, [likedMessages]);
  useEffect(() => { if (toast) { const t = setTimeout(() => setToast(null), 3000); return () => clearTimeout(t); } }, [toast]);

  const showToast = (message, type = "success") => setToast({ message, type });

  const handleLogin = () => {
    if (!loginName.trim()) return;
    setUser(prev => ({ ...prev, name: loginName.trim() }));
    setIsLoggedIn(true);
    showToast(`Bem-vindo ao SoCialBr, ${loginName.trim()}!`);
  };

  const handleSendMessage = () => {
    if (!newMessage.trim()) return;
    const moderationCheck = ModerationService.check(newMessage);
    if (!moderationCheck.safe) {
      showToast(moderationCheck.reason, "error");
      setNewMessage('');
      return;
    }
    const msg = { id: Date.now(), from: user.name, text: newMessage.trim(), encrypted: encryptEnabled, time: "agora", likes: 0 };
    setMessages(prev => [msg, ...prev]);
    setNewMessage('');
    showToast('Recado enviado com sucesso!');
  };

  const handleLike = (msgId) => {
    if (likedMessages.has(msgId)) {
      setLikedMessages(prev => { const n = new Set(prev); n.delete(msgId); return n; });
      setMessages(prev => prev.map(m => m.id === msgId ? { ...m, likes: m.likes - 1 } : m));
    } else {
      setLikedMessages(prev => new Set([...prev, msgId]));
      setMessages(prev => prev.map(m => m.id === msgId ? { ...m, likes: m.likes + 1 } : m));
    }
  };

  const handleCreateAd = () => {
    if (!adForm.title.trim() || !adForm.description.trim()) {
      showToast("Preencha título e descrição do anúncio.", "error");
      return;
    }
    const modTitle = ModerationService.check(adForm.title);
    const modDesc = ModerationService.check(adForm.description);
    if (!modTitle.safe || !modDesc.safe) {
      showToast("O conteúdo do anúncio viola as regras da comunidade.", "error");
      return;
    }
    
    showToast("Pagamento via PIX simulado com sucesso! Anúncio ativado por 30 dias.", "success");
    const newAd = {
      id: Date.now(),
      title: adForm.title.trim(),
      description: adForm.description.trim(),
      mediaUrl: adForm.mediaUrl.trim(),
      link: adForm.link.trim() || "#",
      expiresAt: Date.now() + (30 * 24 * 60 * 60 * 1000)
    };
    setAds(prev => [newAd, ...prev]);
    setAdForm({ title: '', description: '', mediaUrl: '', link: '' });
    setShowAdModal(false);
  };

  const handleCreateGroup = () => {
    if (!groupForm.name.trim()) {
      showToast("Nome do grupo é obrigatório.", "error");
      return;
    }
    const modCheck = ModerationService.check(groupForm.name + ' ' + groupForm.description);
    if (!modCheck.safe) {
      showToast("Conteúdo do grupo viola as regras.", "error");
      return;
    }
    
    const newGroup = {
      id: Date.now(),
      name: groupForm.name.trim(),
      description: groupForm.description.trim(),
      isEncrypted: groupForm.isEncrypted,
      createdBy: user.name,
      members: [user.name],
      createdAt: Date.now()
    };
    setGroups(prev => [newGroup, ...prev]);
    setGroupForm({ name: '', description: '', isEncrypted: true });
    setShowGroupModal(false);
    showToast(`Grupo "${newGroup.name}" criado! Você é o criador e pode convidar membros.`);
  };

  const handleExportData = () => {
    const data = StorageService.exportAll();
    const blob = new Blob([data], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `socialbr_backup_${new Date().toISOString().slice(0, 10)}.json`;
    a.click();
    URL.revokeObjectURL(url);
    showToast('Backup exportado!');
  };

  const handleImportData = (event) => {
    const file = event.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (e) => {
      const success = StorageService.importAll(e.target.result);
      if (success) {
        showToast('Dados importados com sucesso!');
        setTimeout(() => window.location.reload(), 1000);
      } else {
        showToast('Erro ao importar dados', 'error');
      }
    };
    reader.readAsText(file);
  };

  const handleGoogleDriveBackup = async () => {
    if (!GoogleDriveService.isConfigured()) {
      showToast('Configure o Google Drive primeiro (CLIENT_ID e API_KEY no app.js)', 'error');
      return;
    }
    
    try {
      setBackupStatus({ type: 'syncing', message: 'Conectando...' });
      const token = await GoogleDriveService.authenticate();
      setBackupStatus({ type: 'syncing', message: 'Enviando...' });
      const data = StorageService.exportAll();
      await GoogleDriveService.saveToDrive(JSON.parse(data), token);
      setBackupStatus({ type: 'success', message: 'Backup salvo!' });
      showToast('Backup salvo no Google Drive!');
      setTimeout(() => setBackupStatus(null), 3000);
    } catch (e) {
      setBackupStatus({ type: 'error', message: 'Erro: ' + e.message });
      showToast('Erro no backup', 'error');
      setTimeout(() => setBackupStatus(null), 3000);
    }
  };

  const navigateTo = (tab) => { setActiveTab(tab); setShowMobileMenu(false); window.scrollTo({ top: 0, behavior: 'smooth' }); };

  const renderContent = () => {
    if (activeTab === 'inicio' || activeTab === 'recados') {
      const feedItems = [];
      let msgIndex = 0;
      let adIndex = 0;
      
      while (msgIndex < messages.length || adIndex < ads.length) {
        if (adIndex < ads.length && (msgIndex === 0 || msgIndex % 3 === 0)) {
          const ad = ads[adIndex];
          if (ad.expiresAt > Date.now()) {
            feedItems.push({ type: 'ad', data: ad });
          }
          adIndex++;
        }
        if (msgIndex < messages.length) {
          feedItems.push({ type: 'msg', data: messages[msgIndex] });
          msgIndex++;
        }
      }

      return (
        <section className="md:col-span-6 flex flex-col gap-4 min-w-0">
          <div className="card p-4">
            <div className="flex items-center gap-2.5 mb-3">
              <Avatar name={user.name} size="sm" />
              <div className="text-[13px] font-semibold">Deixar um recado</div>
              <div className="ml-auto">
                <label className="checkbox-wrapper bg-[#EFF6FF] border border-[#B8D4FF] px-2.5 py-1 rounded-full">
                  <input type="checkbox" checked={encryptEnabled} onChange={(e) => setEncryptEnabled(e.target.checked)} />
                  <span className="inline-flex items-center gap-1 text-[11px] font-medium"><Icon path={Icons.Lock} size={12} /> Criptografar</span>
                </label>
              </div>
            </div>
            <textarea value={newMessage} onChange={(e) => setNewMessage(e.target.value)} placeholder="Escreva algo que importa..." className="input-field min-h-[92px] resize-none" />
            <div className="mt-3 flex flex-col md:flex-row items-start md:items-center justify-between gap-3">
              <div className="text-[11px] text-[#1A2B4D]/60 flex items-center gap-1.5 max-w-full">
                <Icon path={Icons.Shield} size={14} className="shrink-0" />
                <span className="text-break">Ambiente 100% seguro e moderado.</span>
              </div>
              <button onClick={handleSendMessage} className="btn-primary inline-flex items-center gap-1.5"><Icon path={Icons.Send} size={14} /> Enviar</button>
            </div>
            <div className="moderation-notice">
              <Icon path={Icons.AlertCircle} size={14} />
              <span>Proibido: violência, política, religião, nudez, jogos de azar (bets/tigrinho) e golpes.</span>
            </div>
          </div>

          <div className="flex flex-col gap-3.5">
            {feedItems.map((item, idx) => {
              if (item.type === 'ad') {
                return (
                  <div key={`ad-${item.data.id}`} className="card p-4 min-w-0 fade-in border-l-4 border-l-[#FCD34D]">
                    <div className="flex items-center justify-between mb-2">
                      <span className="ad-badge flex items-center gap-1"><Icon path={Icons.Megaphone} size={10} /> Patrocinado</span>
                      <span className="text-[10px] text-[#1A2B4D]/40">30 dias de destaque</span>
                    </div>
                    <h3 className="font-bold text-[15px] mb-1">{item.data.title}</h3>
                    <p className="text-[13px] text-[#1A2B4D]/70 leading-[1.5] mb-2 text-break">{item.data.description}</p>
                    {item.data.mediaUrl && (
                      <div className="mb-3 rounded-lg overflow-hidden border border-[#B8D4FF] bg-[#F8FBFF] aspect-video grid place-items-center text-[#1A2B4D]/30">
                        <Icon path={Icons.Image} size={32} />
                        <span className="text-[10px] mt-1">Mídia (Foto/Vídeo)</span>
                      </div>
                    )}
                    <a href={item.data.link} target="_blank" rel="noopener noreferrer" className="btn-secondary inline-flex items-center gap-1.5 w-full justify-center text-[12px]">
                      Saiba mais <Icon path={Icons.Send} size={12} />
                    </a>
                  </div>
                );
              } else {
                const msg = item.data;
                return (
                  <div key={`msg-${msg.id}`} className="card p-3.5 min-w-0 fade-in">
                    <div className="flex gap-3 min-w-0">
                      <Avatar name={msg.from} size="md" />
                      <div className="min-w-0 flex-1">
                        <div className="flex items-center gap-2 flex-wrap">
                          <span className="font-bold text-[13px]">{msg.from}</span>
                          <span className="text-[11px] text-[#1A2B4D]/40">• {msg.time}</span>
                        </div>
                        <div className="mt-2 text-[13px] leading-[1.6] text-break whitespace-pre-wrap min-w-0">{msg.text}</div>
                        <div className="mt-3 flex items-center gap-3 text-[11px] text-[#1A2B4D]/50">
                          <button onClick={() => handleLike(msg.id)} className="flex items-center gap-1 hover:text-[#FF2E93] transition"><Icon path={Icons.Heart} size={12} /> {msg.likes}</button>
                          <span>responder</span>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              }
            })}
          </div>
        </section>
      );
    }
    return <div className="md:col-span-9 flex flex-col gap-4 min-w-0"><div className="card p-8 text-center text-[#1A2B4D]/60">Seção em construção</div></div>;
  };

  return (
    <div className="min-h-screen bg-[#D6E9FF] text-[#1A2B4D] antialiased overflow-x-hidden">
      {/* Header */}
      <header className="sticky z-40 bg-white border-b border-[#B8D4FF] shadow-[0_2px_0_0_#B8D4FF] w-full">
        <div className="max-w-[1280px] mx-auto h-[56px] md:h-[64px] px-3 md:px-6 flex items-center justify-between gap-2 md:gap-4">
          <div className="flex items-center gap-2 md:gap-3 min-w-0">
            <button onClick={() => setShowMobileMenu(!showMobileMenu)} className="md:hidden w-9 h-9 grid place-items-center rounded-full hover:bg-[#D6E9FF] transition shrink-0">
              <Icon path={showMobileMenu ? Icons.X : Icons.Menu} size={20} />
            </button>
            <div className="logo text-[26px] md:text-[30px] font-bold tracking-tight leading-none flex items-baseline shrink-0">
              <span className="text-[#FF2E93]">S</span><span className="text-[#1A2B4D]">o</span><span className="text-[#2C5DFA]">C</span><span className="text-[#1A2B4D]">ialBr</span>
              <span className="ml-2 hidden lg:inline text-[10px] font-semibold tracking-[0.2em] text-[#2C5DFA] bg-[#D6E9FF] px-2 py-0.5 rounded-full border border-[#B8D4FF]">SEGURO • E2E</span>
            </div>
          </div>
          <nav className="hidden md:flex items-center gap-1 text-[13px] font-medium shrink-0">
            {[['Início', 'inicio'], ['Perfil', 'perfil'], ['Recados', 'recados'], ['Grupos', 'grupos']].map(([label, tab]) => (
              <button key={tab} onClick={() => navigateTo(tab)} className={`px-3 py-1.5 rounded-full transition ${activeTab === tab ? "bg-[#1A2B4D] text-white" : "hover:bg-[#D6E9FF] text-[#1A2B4D]/70"}`}>{label}</button>
            ))}
          </nav>
          <div className="flex items-center gap-2 md:gap-3 shrink-0">
            {isLoggedIn && <Avatar name={user.name} size="md" online={true} />}
          </div>
        </div>
      </header>

      {/* Barra de Transparência */}
      <div className="bg-white border-b border-[#B8D4FF] w-full overflow-hidden">
        <div className="max-w-[1280px] mx-auto px-3 md:px-6 min-h-[40px] py-2 flex flex-wrap items-center gap-2 text-[11px] md:text-[12px]">
          <span className="inline-flex items-center gap-1.5 bg-[#E6F4EA] text-[#1B6B2F] border border-[#A8DAB5] px-2.5 py-1 rounded-full font-medium">✓ 100% sem rastreamento</span>
          <span className="inline-flex items-center gap-1.5 bg-[#FEF2F2] text-[#991B1B] border border-[#FECACA] px-2.5 py-1 rounded-full font-medium">️ Moderação Ativa (Zero Bets/Política)</span>
          <button onClick={() => setShowAdModal(true)} className="inline-flex items-center gap-1.5 bg-[#1A2B4D] text-white px-2.5 py-1 rounded-full font-medium hover:bg-black transition ml-auto">
            <Icon path={Icons.Megaphone} size={12} /> Anuncie Aqui
          </button>
        </div>
      </div>

      {/* Conteúdo Principal */}
      <main className="max-w-[1280px] mx-auto px-3 md:px-4 py-4 md:py-6 pb-[80px] md:pb-6 grid grid-cols-1 md:grid-cols-12 gap-4 md:gap-5">
        {/* Sidebar Esquerda */}
        <aside className="md:col-span-3 flex flex-col gap-4 min-w-0">
          <div className="card overflow-hidden">
            <div className="gradient-header">
              <div className="avatar-xl"><Avatar name={user.name} size="xl" /></div>
              <div className="status-badge"><span className="status-dot"></span> ONLINE</div>
            </div>
            <div className="pt-12 pb-4 px-4">
              <div className="flex items-start justify-between gap-2">
                <div className="min-w-0">
                  <h2 className="font-bold text-[18px] leading-tight text-truncate">{user.name || 'Visitante'}</h2>
                  <p className="text-[12px] text-[#1A2B4D]/60 mt-0.5 text-truncate">@{(user.name || 'visitante').toLowerCase().replace(/\s/g, '')}.socialbr</p>
                </div>
                <button onClick={() => { setEditName(user.name); setEditBio(user.bio); setShowEditProfile(true); }} className="w-8 h-8 grid place-items-center rounded-full border border-[#B8D4FF] hover:bg-[#D6E9FF] transition shrink-0"><Icon path={Icons.Pen} size={14} /></button>
              </div>
              <p className="mt-3 text-[13px] leading-[1.6] bg-[#F8FBFF] border border-[#D6E9FF] rounded-xl p-3 text-break">{user.bio}</p>
              <div className="mt-4 grid grid-cols-3 text-center border-y border-[#E6F0FF] py-3">
                <div><div className="font-bold text-[16px]">{messages.length}</div><div className="text-[10px] uppercase tracking-wide text-[#1A2B4D]/50">recados</div></div>
                <div className="border-x border-[#E6F0FF]"><div className="font-bold text-[16px]">{groups.length}</div><div className="text-[10px] uppercase tracking-wide text-[#1A2B4D]/50">grupos</div></div>
                <div><div className="font-bold text-[16px]">4.9★</div><div className="text-[10px] uppercase tracking-wide text-[#1A2B4D]/50">confiável</div></div>
              </div>
            </div>
          </div>

          <div className="card p-4">
            <h3 className="font-bold text-[13px] flex items-center gap-1.5 mb-2"><Icon path={Icons.Key} size={14} /> Sua Chave AES-256</h3>
            <div className="text-[10px] font-mono bg-[#F8FBFF] border border-[#D6E9FF] rounded-lg p-2 break-all text-[#1A2B4D]/70">{keyDisplay}</div>
            <p className="text-[10px] text-[#1A2B4D]/50 mt-2">Guarde esta chave. Sem ela, suas mensagens criptografadas são perdidas para sempre.</p>
          </div>

          <div className="card p-4">
            <h3 className="font-bold text-[13px] flex items-center gap-1.5 mb-3"><Icon path={Icons.Database} size={14} /> Backup de Dados</h3>
            <div className="flex flex-col gap-2">
              <button onClick={handleExportData} className="btn-secondary inline-flex items-center gap-2 justify-center">
                <Icon path={Icons.Send} size={14} /> Exportar backup (JSON)
              </button>
              <label className="btn-secondary inline-flex items-center gap-2 justify-center cursor-pointer">
                <Icon path={Icons.Send} size={14} /> Importar backup
                <input type="file" accept=".json" onChange={handleImportData} className="hidden" />
              </label>
              <button onClick={handleGoogleDriveBackup} className="btn-secondary inline-flex items-center gap-2 justify-center" disabled={!GoogleDriveService.isConfigured()}>
                <Icon path={Icons.Megaphone} size={14} /> Salvar no Google Drive
              </button>
            </div>
            {backupStatus && (
              <div className={`mt-3 p-2 rounded-lg text-[11px] font-semibold ${backupStatus.type === 'success' ? 'bg-green-100 text-green-700' : backupStatus.type === 'error' ? 'bg-red-100 text-red-700' : 'bg-blue-100 text-blue-700'}`}>
                {backupStatus.message}
              </div>
            )}
          </div>
        </aside>

        {/* Centro */}
        {renderContent()}

        {/* Sidebar Direita */}
        <aside className="md:col-span-3 flex flex-col gap-4 min-w-0">
          <div className="card p-4">
            <h3 className="font-bold text-[13px] flex items-center gap-1.5 mb-3"><Icon path={Icons.Scale} size={14} /> Regras da Comunidade</h3>
            <ul className="text-[11px] text-[#1A2B4D]/70 space-y-2 leading-[1.5]">
              <li className="flex gap-2"><span className="text-red-500 font-bold">✕</span> Nudez e conteúdo sexual</li>
              <li className="flex gap-2"><span className="text-red-500 font-bold">✕</span> Violência, morte ou feminicídio</li>
              <li className="flex gap-2"><span className="text-red-500 font-bold">✕</span> Política e religião</li>
              <li className="flex gap-2"><span className="text-red-500 font-bold">✕</span> Jogos de azar, bets e golpes</li>
              <li className="flex gap-2"><span className="text-green-500 font-bold">✓</span> Respeito e privacidade</li>
            </ul>
          </div>

          <div className="bg-[#1A2B4D] text-white rounded-[14px] p-4 border border-[#1A2B4D]">
            <div className="text-[11px] font-bold tracking-widest opacity-60">TRANSPARÊNCIA</div>
            <div className="mt-2 text-[12px] leading-[1.6] text-break">Código 100% aberto. Você pode auditar o WebCrypto e verificar que não há rastreamento.</div>
            <div className="mt-3 flex flex-wrap gap-1.5">
              <span className="text-[10px] px-2.5 py-1 rounded-full bg-white/10 border border-white/20">MIT License</span>
              <span className="text-[10px] px-2.5 py-1 rounded-full bg-white/10 border border-white/20">LGPD Compliant</span>
            </div>
            <a href="https://github.com/IOXeu/SoCial.git" target="_blank" rel="noreferrer" className="mt-4 block text-center h-9 leading-9 rounded-full bg-white text-[#1A2B4D] text-[11px] font-bold hover:bg-[#D6E9FF] transition">
              Ver no GitHub →
            </a>
          </div>
        </aside>
      </main>

      {/* Navegação Mobile */}
      <nav className="md:hidden bottom-nav">
        {[{ id: 'inicio', label: 'Início', icon: Icons.House }, { id: 'perfil', label: 'Perfil', icon: Icons.User }, { id: 'recados', label: 'Recados', icon: Icons.Message }, { id: 'grupos', label: 'Grupos', icon: Icons.Users }].map(item => (
          <button key={item.id} onClick={() => navigateTo(item.id)} className={`nav-item ${activeTab === item.id ? 'active' : ''}`}>
            <Icon path={item.icon} size={18} strokeWidth={activeTab === item.id ? 2.5 : 2} /><span>{item.label}</span>
          </button>
        ))}
      </nav>

      {/* Modal Login */}
      {!isLoggedIn && (
        <div className="modal-overlay">
          <div className="modal-content">
            <div className="logo text-[32px] font-bold"><span className="text-[#FF2E93]">S</span>o<span className="text-[#2C5DFA]">C</span>ialBr</div>
            <div className="text-[12px] text-[#1A2B4D]/60 mt-1">Entre sem e-mail, sem senha, sem rastreamento.</div>
            <div className="mt-4 flex flex-col gap-3">
              <input value={loginName} onChange={(e) => setLoginName(e.target.value)} placeholder="Seu nome" className="input-field h-11 rounded-full px-4" onKeyPress={(e) => e.key === 'Enter' && handleLogin()} />
              <button onClick={handleLogin} className="btn-primary h-11 rounded-full w-full">Entrar no SoCialBr →</button>
              <div className="text-[10px] text-center text-[#1A2B4D]/40">🔒 AES-256 • Sem cookies • Código aberto</div>
            </div>
          </div>
        </div>
      )}

      {/* Modal Editar Perfil */}
      {showEditProfile && (
        <div className="modal-overlay" onClick={() => setShowEditProfile(false)}>
          <div className="modal-content" onClick={e => e.stopPropagation()}>
            <div className="flex items-center justify-between"><h3 className="font-bold text-[16px]">Editar perfil</h3><button onClick={() => setShowEditProfile(false)} className="w-8 h-8 grid place-items-center rounded-full border border-[#B8D4FF]"><Icon path={Icons.X} size={16} /></button></div>
            <div className="mt-4 flex flex-col gap-3">
              <label className="text-[11px] font-semibold uppercase tracking-wide">Nome</label>
              <input value={editName} onChange={(e) => setEditName(e.target.value)} className="input-field h-11 rounded-full px-4" />
              <label className="text-[11px] font-semibold uppercase tracking-wide">Bio</label>
              <textarea value={editBio} onChange={(e) => setEditBio(e.target.value)} className="input-field min-h-[80px] rounded-[12px] p-3 resize-none" />
              <button onClick={() => { setUser(prev => ({ ...prev, name: editName.trim() || prev.name, bio: editBio.trim() || prev.bio })); setShowEditProfile(false); showToast('Perfil atualizado!'); }} className="btn-primary h-11 rounded-full w-full">Salvar</button>
            </div>
          </div>
        </div>
      )}

      {/* Modal Anunciar */}
      {showAdModal && (
        <div className="modal-overlay" onClick={() => setShowAdModal(false)}>
          <div className="modal-content" onClick={e => e.stopPropagation()}>
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-bold text-[16px] flex items-center gap-2"><Icon path={Icons.Megaphone} size={18} className="text-[#2C5DFA]" /> Anuncie no SoCialBr</h3>
              <button onClick={() => setShowAdModal(false)} className="w-8 h-8 grid place-items-center rounded-full border border-[#B8D4FF]"><Icon path={Icons.X} size={16} /></button>
            </div>
            
            <div className="bg-[#EFF6FF] border border-[#B8D4FF] rounded-xl p-3 mb-4">
              <div className="text-[12px] font-bold text-[#1A2B4D] mb-1"> Pacote Único de Destaque</div>
              <div className="text-[24px] font-bold text-[#2C5DFA]">R$ 190,00</div>
              <div className="text-[11px] text-[#1A2B4D]/60 mt-1">• 30 dias de exibição no feed principal<br/>• Selo "Patrocinado" verificado<br/>• Suporte a link e mídia (foto/vídeo)<br/>• Moderação ética obrigatória</div>
            </div>

            <div className="flex flex-col gap-3">
              <input value={adForm.title} onChange={(e) => setAdForm({...adForm, title: e.target.value})} placeholder="Título do Anúncio" className="input-field h-11 rounded-full px-4" />
              <textarea value={adForm.description} onChange={(e) => setAdForm({...adForm, description: e.target.value})} placeholder="Descrição clara e objetiva" className="input-field min-h-[80px] rounded-[12px] p-3 resize-none" />
              <input value={adForm.mediaUrl} onChange={(e) => setAdForm({...adForm, mediaUrl: e.target.value})} placeholder="URL da Mídia (Foto/Vídeo) - Opcional" className="input-field h-11 rounded-full px-4 text-[12px]" />
              <input value={adForm.link} onChange={(e) => setAdForm({...adForm, link: e.target.value})} placeholder="Link de destino (https://...)" className="input-field h-11 rounded-full px-4 text-[12px]" />
              
              <button onClick={handleCreateAd} className="btn-primary h-11 rounded-full w-full flex items-center justify-center gap-2">
                <Icon path={Icons.Zap} size={16} /> Gerar PIX e Ativar (R$ 190,00)
              </button>
              <p className="text-[10px] text-center text-[#1A2B4D]/40">Ao ativar, você concorda com os Termos de Uso e confirma que o conteúdo não viola as regras da comunidade.</p>
            </div>
          </div>
        </div>
      )}

      {/* Modal Criar Grupo */}
      {showGroupModal && (
        <div className="modal-overlay" onClick={() => setShowGroupModal(false)}>
          <div className="modal-content" onClick={e => e.stopPropagation()}>
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-bold text-[16px] flex items-center gap-2"><Icon path={Icons.Users} size={18} className="text-[#2C5DFA]" /> Criar Grupo</h3>
              <button onClick={() => setShowGroupModal(false)} className="w-8 h-8 grid place-items-center rounded-full border border-[#B8D4FF]"><Icon path={Icons.X} size={16} /></button>
            </div>
            
            <div className="bg-[#EFF6FF] border border-[#B8D4FF] rounded-xl p-3 mb-4">
              <div className="text-[12px] font-bold text-[#1A2B4D] mb-1"> Grupos Privados</div>
              <div className="text-[11px] text-[#1A2B4D]/60">• Você é o criador e pode convidar membros<br/>• Chave única de criptografia passa pelo criador<br/>• Grupos podem ser criptografados E2E<br/>• Moderação automática ativa</div>
            </div>

            <div className="flex flex-col gap-3">
              <input value={groupForm.name} onChange={(e) => setGroupForm({...groupForm, name: e.target.value})} placeholder="Nome do grupo" className="input-field h-11 rounded-full px-4" />
              <textarea value={groupForm.description} onChange={(e) => setGroupForm({...groupForm, description: e.target.value})} placeholder="Descrição do grupo" className="input-field min-h-[80px] rounded-[12px] p-3 resize-none" />
              <label className="checkbox-wrapper bg-[#EFF6FF] border border-[#B8D4FF] px-3 py-2 rounded-lg">
                <input type="checkbox" checked={groupForm.isEncrypted} onChange={(e) => setGroupForm({...groupForm, isEncrypted: e.target.checked})} />
                <span className="text-[12px] font-medium"><Icon path={Icons.Lock} size={14} /> Criptografar grupo (E2E)</span>
              </label>
              
              <button onClick={handleCreateGroup} className="btn-primary h-11 rounded-full w-full flex items-center justify-center gap-2">
                <Icon path={Icons.Users} size={16} /> Criar Grupo
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal Legal */}
      {showLegalModal && (
        <div className="modal-overlay" onClick={() => setShowLegalModal(null)}>
          <div className="modal-content" onClick={e => e.stopPropagation()}>
            <div className="flex items-center justify-between mb-4"><h3 className="font-bold text-[16px]">{showLegalModal === 'lgpd' ? 'Política de Privacidade (LGPD)' : showLegalModal === 'termos' ? 'Termos de Uso' : 'Responsabilidade de Uso'}</h3><button onClick={() => setShowLegalModal(null)} className="w-8 h-8 grid place-items-center rounded-full border border-[#B8D4FF]"><Icon path={Icons.X} size={16} /></button></div>
            <div className="text-[12px] leading-[1.6] whitespace-pre-wrap text-[#1A2B4D]/80">
              {showLegalModal === 'lgpd' ? `O SoCialBr foi desenvolvido com privacidade como princípio fundamental.\n\n1. DADOS COLETADOS\n• Nome de exibição (opcional)\n• Bio/perfil (opcional)\n• Mensagens e recados (criptografados localmente)\n\n2. DADOS NÃO COLETADOS\n• Endereço IP, Localização, Cookies de rastreamento.\n\n3. ARMAZENAMENTO\nTodos os dados são armazenados exclusivamente no localStorage do seu navegador usando WebCrypto API (AES-GCM 256 bits).\n\n4. SEUS DIREITOS (LGPD)\n• Acesso, Correção, Exclusão e Portabilidade dos seus dados a qualquer momento.` : showLegalModal === 'termos' ? `Ao usar o SoCialBr, você concorda com os seguintes termos:\n\n1. CONTEÚDO PROIBIDO (TOLERÂNCIA ZERO)\nÉ estritamente proibido publicar ou compartilhar:\n• Conteúdo de pedofilia ou exploração infantil.\n• Nudez, pornografia ou conteúdo sexual explícito.\n• Palavras ou temas de cunho político ou religioso.\n• Incitação à violência, feminicídio, morte ou homicídio.\n• Jogos de azar, bets, cassinos ou golpes financeiros.\n\n2. MODERAÇÃO\nO SoCialBr possui um filtro automático de moderação. Conteúdos que violem as regras acima serão bloqueados imediatamente.\n\n3. ANÚNCIOS\nAnúncios são cobrados em pacote único (30 dias por R$ 190,00). O conteúdo do anúncio também está sujeito à moderação.` : `O SoCialBr é uma ferramenta de comunicação privada. Com grande privacidade vem grande responsabilidade:\n\n1. USO ÉTICO\n• Use para comunicação legítima entre pessoas reais.\n• Não use para harassment, bullying ou difamação.\n\n2. SEGURANÇA DA CHAVE\n• Sua chave AES-256 é sua responsabilidade.\n• Se perder a chave, as mensagens criptografadas serão irrecuperáveis.\n\n3. LIMITAÇÕES TÉCNICAS\n• Dados são armazenados apenas no navegador local.\n• Limpar dados do navegador = perder tudo.\n\nLembre-se: privacidade é um direito, mas também uma responsabilidade.`}
            </div>
          </div>
        </div>
      )}

      {/* Toast */}
      {toast && <div className={`toast toast-${toast.type}`}>{toast.message}</div>}

      {/* Footer */}
      <footer className="max-w-[1280px] mx-auto px-4 pb-6 md:pb-8">
        <div className="card p-4 md:p-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6">
            <div>
              <h4 className="font-bold text-[13px] mb-2">Legal</h4>
              <div className="flex flex-col gap-1.5 text-[12px]">
                <button onClick={() => setShowLegalModal('lgpd')} className="footer-link text-left">📋 Política de Privacidade (LGPD)</button>
                <button onClick={() => setShowLegalModal('termos')} className="footer-link text-left">📜 Termos de Uso e Conduta</button>
                <button onClick={() => setShowLegalModal('responsabilidade')} className="footer-link text-left">⚖️ Responsabilidade de Uso</button>
              </div>
            </div>
            <div>
              <h4 className="font-bold text-[13px] mb-2">Segurança</h4>
              <div className="text-[11px] text-[#1A2B4D]/60 leading-[1.6]">
                <p>✓ Zero rastreamento</p>
                <p>✓ Criptografia AES-256</p>
                <p>✓ Moderação automática (Anti-Bets/Política)</p>
                <p>✓ Conformidade LGPD</p>
              </div>
            </div>
            <div>
              <h4 className="font-bold text-[13px] mb-2">Projeto</h4>
              <div className="text-[11px] text-[#1A2B4D]/60 leading-[1.6]">
                <p>🆔 ID: 91c71bb9-46e4-4052-b7e5-7572ec26d857</p>
                <p>📧 privacy@socialbr.example</p>
                <p className="mt-2">
                  <a href="https://github.com/IOXeu/SoCial.git" target="_blank" rel="noreferrer" className="footer-link">
                    GitHub Oficial →
                  </a>
                </p>
              </div>
            </div>
          </div>
          <div className="mt-4 pt-4 border-t border-[#E6F0FF] text-[10px] text-[#1A2B4D]/40 text-center leading-[1.6] text-break">
            SoCialBr • Ambiente seguro, limpo e privado. Feito para GitHub Pages • WebCrypto real (AES-GCM 256) • 100% responsivo.
            <br /><br />
            © {new Date().getFullYear()} SoCialBr. Todos os direitos reservados. Conformidade LGPD (Lei 13.709/2018).
          </div>
        </div>
      </footer>
    </div>
  );
}

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(<App />);
