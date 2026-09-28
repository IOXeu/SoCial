const { useState, useEffect } = React;

// ==================== CONFIG ====================
const API_URL = 'http://localhost:3000/api';
const USE_SERVER = true; // Mude para true quando o servidor estiver rodando

// ==================== ÍCONES ====================
const Icon = ({ path, size = 24, className = "" }) => (
  <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>{path}</svg>
);
const Icons = {
  House: <><path d="M15 21v-8a1 1 0 0 0-1-1h-4a1 1 0 0 0-1 1v8"/><path d="M3 10a2 2 0 0 1 .709-1.528l7-5.999a2 2 0 0 1 2.582 0l7 5.999A2 2 0 0 1 21 10v9a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/></>,
  Key: <><path d="M2.586 17.414A2 2 0 0 0 2 18.828V21a1 1 0 0 0 1 1h3a1 1 0 0 0 1-1v-1a1 1 0 0 1 1-1h1a1 1 0 0 0 1-1v-1a1 1 0 0 1 1-1h.172a2 2 0 0 0 1.414-.586l.814-.814a6.5 6.5 0 1 0-4-4z"/><circle cx="16.5" cy="7.5" r=".5" fill="currentColor"/></>,
  Lock: <><rect width="18" height="11" x="3" y="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></>,
  Message: <><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/></>,
  Pen: <><path d="M21.174 6.812a1 1 0 0 0-3.986-3.987L3.842 16.174a2 2 0 0 0-.5.83l-1.321 4.352a.5.5 0 0 0 .623.622l4.353-1.32a2 2 0 0 0 .83-.497z"/></>,
  Send: <><path d="M14.536 21.686a.5.5 0 0 0 .937-.024l6.5-19a.496.496 0 0 0-.635-.635l-19 6.5a.5.5 0 0 0-.024.937l7.93 3.18a2 2 0 0 1 1.112 1.11z"/><path d="m21.854 2.147-10.94 10.939"/></>,
  Shield: <><path d="M20 13c0 5-3.5 7.5-7.66 8.95a1 1 0 0 1-.67-.01C7.5 20.5 4 18 4 13V6a1 1 0 0 1 1-1c2 0 4.5-1.2 6.24-2.72a1.17 1.17 0 0 1 1.52 0C14.51 3.81 17 5 19 5a1 1 0 0 1 1 1z"/><path d="m9 12 2 2 4-4"/></>,
  User: <><path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></>,
  Users: <><path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M22 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></>,
  X: <><path d="M18 6 6 18"/><path d="m6 6 12 12"/></>,
  Zap: <><path d="M4 14a1 1 0 0 1-.78-1.63l9.9-10.2a.5.5 0 0 1 .86.46l-1.92 6.02A1 1 0 0 0 13 10h7a1 1 0 0 1 .78 1.63l-9.9 10.2a.5.5 0 0 1-.86-.46l1.92-6.02A1 1 0 0 0 11 14z"/></>,
  Heart: <><path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z"/></>,
  Scale: <><path d="m16 16 3-8 3 8c-.87.65-1.92 1-3 1s-2.13-.35-3-1Z"/><path d="m2 16 3-8 3 8c-.87.65-1.92 1-3 1s-2.13-.35-3-1Z"/><path d="M7 21h10"/><path d="M12 3v18"/><path d="M3 7h2c2 0 5-1 7-2 2 1 5 2 7 2h2"/></>,
  Database: <><ellipse cx="12" cy="5" rx="9" ry="3"/><path d="M3 5V19A9 3 0 0 0 21 19V5"/><path d="M3 12A9 3 0 0 0 21 12"/></>,
  Megaphone: <><path d="m3 11 18-5v12L3 14v-3z"/><path d="M11.6 16.8a3 3 0 1 1-5.8-1.6"/></>,
  Image: <><rect width="18" height="18" x="3" y="3" rx="2" ry="2"/><circle cx="9" cy="9" r="2"/><path d="m21 15-3.086-3.086a2 2 0 0 0-2.828 0L6 21"/></>,
  Sun: <><circle cx="12" cy="12" r="4"/><path d="M12 2v2M12 20v2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M2 12h2M20 12h2M6.34 17.66l-1.41 1.41M19.07 4.93l-1.41 1.41"/></>,
  Moon: <><path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/></>,
  Cloud: <><path d="M17.5 19c2.485 0 4.5-2.015 4.5-4.5S19.985 10 17.5 10c-.185 0-.365.015-.545.035C16.47 6.37 13.23 4 9.5 4 4.805 4 1 7.805 1 12.5c0 .34.025.675.07 1.005C.435 13.67.1 13.83.1 14c0 1.657 1.343 3 3 3h14.4z"/></>,
  Download: <><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" x2="12" y1="15" y2="3"/></>,
  Upload: <><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="17 8 12 3 7 8"/><line x1="12" x2="12" y1="3" y2="15"/></>,
};

// ==================== CONTEÚDO LEGAL ====================
const LegalContent = {
  lgpd: `# Política de Privacidade — SoCialBr
**Última atualização: 27 de setembro de 2026**

O SoCialBr é uma plataforma de interação social e bate-papo, desenvolvida para permitir que usuários se conectem e conversem pela internet, com foco em privacidade e segurança.

## 1. Dados que podemos tratar
* Dados de cadastro e identificação, como nome de exibição.
* Mensagens e conteúdos enviados pelos usuários.
* Informações técnicas necessárias ao funcionamento.

## 2. Login e serviços do Google
Caso o usuário conecte o Google Drive para backups:
* O aplicativo solicitará autorização explícita.
* Poderá criar uma pasta própria para os backups no Drive do usuário.
* Não utilizará esses dados para publicidade ou venda de informações.

## 3. Mensagens e privacidade
O SoCialBr implementa criptografia AES-256 para proteger mensagens.

## 4. Finalidade do tratamento
* Criar e administrar contas.
* Permitir conversas e interações.
* Manter a segurança do serviço.
* Realizar backups quando solicitados.

## 5. Compartilhamento de dados
O SoCialBr não comercializa dados pessoais dos usuários.

## 6. Direitos dos usuários (LGPD)
* Acesso, Correção, Exclusão e Portabilidade dos dados.

## 7. Contato
**Responsável:** HDMicro
**E-mail:** hdmicromicro@gmail.com
**Site:** https://socialbr.pages.dev/`,

  termos: `# Termos de Uso — SoCialBr
**Última atualização: 27 de setembro de 2026**

## 1. Finalidade da plataforma
O SoCialBr é destinado à comunicação e interação entre usuários.

## 2. Cadastro e responsabilidade
O usuário é responsável pelas informações fornecidas e pela proteção de suas credenciais.

## 3. Conduta dos usuários
É proibido utilizar o SoCialBr para:
* Praticar fraudes, golpes ou atividades ilícitas.
* Ameaçar, perseguir, assediar ou intimidar.
* Violar direitos autorais ou privacidade de terceiros.

## 4. Conteúdo Proibido (Tolerância Zero)
* Pedofilia ou exploração infantil.
* Nudez, pornografia ou conteúdo sexual explícito.
* Temas de cunho político ou religioso.
* Incitação à violência, feminicídio, morte.
* Jogos de azar, bets, cassinos ou golpes financeiros.

## 5. Google Drive e backups
* A conexão dependerá da autorização do usuário.
* Os backups serão armazenados em pasta criada no Drive do usuário.

## 6. Contato
**Responsável:** HDMicro
**E-mail:** hdmicro@gmail.com
**Site:** https://socialbr.pages.dev/`,

  responsabilidade: `# Responsabilidade de Uso — SoCialBr
**Última atualização: 27 de setembro de 2026**

## 1. Uso Ético
* Use para comunicação legítima entre pessoas reais.
* Não use para harassment, bullying ou difamação.

## 2. Conteúdo Proibido (Tolerância Zero)
* Pedofilia ou exploração infantil.
* Nudez, pornografia ou conteúdo sexual explícito.
* Palavras ou temas de cunho político ou religioso.
* Incitação à violência, feminicídio, morte ou homicídio.
* Jogos de azar, bets, cassinos ou golpes financeiros.

## 3. Segurança da Chave
* Sua chave AES-256 é sua responsabilidade.
* Se perder a chave, as mensagens criptografadas serão irrecuperáveis.

## 4. Backup e Dados
* Recomendamos exportar backup regularmente.
* Limpar dados do navegador = perder tudo.

## 5. Denúncias
**E-mail:** hdmicro@gmail.com
**Site:** https://socialbr.pages.dev/

Lembre-se: privacidade é um direito, mas também uma responsabilidade.`
};

// ==================== MODERAÇÃO ====================
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
        return { safe: false, reason: "⛔ Conteúdo bloqueado: Viola as regras da comunidade." };
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

// ==================== API SERVICE ====================
const ApiService = {
  async request(method, endpoint, data = null) {
    if (!USE_SERVER) return null;
    try {
      const options = { method, headers: { 'Content-Type': 'application/json' } };
      if (data) options.body = JSON.stringify(data);
      const response = await fetch(`${API_URL}${endpoint}`, options);
      return await response.json();
    } catch (e) {
      console.error('API Error:', e);
      return null;
    }
  },
  createUser: (data) => ApiService.request('POST', '/users', data),
  getUsers: (search) => ApiService.request('GET', `/users${search ? `?search=${search}` : ''}`),
  createMessage: (data) => ApiService.request('POST', '/messages', data),
  getMessages: (userId, limit = 50) => ApiService.request('GET', `/messages${userId ? `?user_id=${userId}&limit=${limit}` : `?limit=${limit}`}`),
  createGroup: (data) => ApiService.request('POST', '/groups', data),
  getGroups: () => ApiService.request('GET', '/groups'),
  createAd: (data) => ApiService.request('POST', '/ads', data),
  getAds: () => ApiService.request('GET', '/ads'),
};

// ==================== COMPONENTES UI ====================
const Avatar = ({ name, photo, size = "md", online = false }) => {
  const initials = name.split(' ').map(n => n[0]).slice(0, 2).join('').toUpperCase();
  const colors = ['bg-[#FFD6E8] text-[#A81E5D]', 'bg-[#D6E9FF] text-[#1A4DA6]', 'bg-[#DCFCE7] text-[#14532D]', 'bg-[#FEF9C3] text-[#854D0E]'];
  const hash = name.split('').reduce((acc, c) => acc + c.charCodeAt(0), 0) % colors.length;
  const sizes = { sm: 'w-8 h-8 text-[11px]', md: 'w-9 h-9 text-[12px]', xl: 'w-[76px] h-[76px] text-[20px]' };

  if (photo) {
    return (
      <div className={`relative shrink-0 rounded-full border-2 border-[#B8D4FF] overflow-hidden ${sizes[size]}`}>
        <img src={photo} alt={name} className="w-full h-full object-cover" />
        {online && <span className="absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-[#22C55E] rounded-full border-2 border-white"></span>}
      </div>
    );
  }

  return (
    <div className={`relative shrink-0 rounded-full border border-[#B8D4FF] grid place-items-center font-bold ${colors[hash]} ${sizes[size]}`}>
      {initials}
      {online && <span className="absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-[#22C55E] rounded-full border-2 border-white"></span>}
    </div>
  );
};

// ==================== TUTORIAL GOOGLE DRIVE ====================
function TutorialGoogleDrive({ onClose, onComplete }) {
  const [step, setStep] = useState(0);
  const [folderName, setFolderName] = useState('SoCialBr_save');

  const steps = [
    { title: " Vamos salvar seus dados!", text: "Seus recados e fotos são importantes. Vamos guardá-los no Google Drive, que é como um 'baú' na nuvem.", emoji: "🎒", balloon: "Não se preocupe, é fácil!" },
    { title: "📱 Passo 1: Abra o Google Drive", text: "No seu celular, procure o ícone do Google Drive. É um triângulo colorido (verde, amarelo e azul).", emoji: "📲", balloon: "Se não tiver, baixe na Play Store ou App Store" },
    { title: "👤 Passo 2: Entre na sua conta", text: "Toque em 'Fazer login' e use o mesmo e-mail que você usa no Gmail. Provavelmente já está conectado!", emoji: "👤", balloon: "Se aparecer 'Continuar como [seu nome]', é só clicar!" },
    { title: "➕ Passo 3: Crie uma pasta", text: "Toque no botão '+' (mais) no canto inferior direito. Depois escolha 'Pasta'.", emoji: "➕", balloon: "O botão '+' está bem fácil de ver!" },
    { title: "✏️ Passo 4: Dê um nome", text: "Digite o nome da pasta. Sugerimos 'SoCialBr_save' para você achar fácil depois.", emoji: "✏️", balloon: "Pode mudar o nome se quiser!" },
    { title: "✅ Passo 5: Pronto!", text: "Agora é só tocar em 'Criar'. Sua pasta está pronta para receber o backup!", emoji: "", balloon: "Você conseguiu! 👏" }
  ];

  const currentStep = steps[step];

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={e => e.stopPropagation()}>
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-bold text-[16px] flex items-center gap-2">
            <span className="text-[24px]">{currentStep.emoji}</span>
            {currentStep.title}
          </h3>
          <button onClick={onClose} className="w-8 h-8 grid place-items-center rounded-full border border-[#B8D4FF]">
            <Icon path={Icons.X} size={16} />
          </button>
        </div>

        <div className="flex gap-1 mb-4">
          {steps.map((_, i) => (
            <div key={i} className={`h-1 flex-1 rounded-full ${i <= step ? 'bg-[#2C5DFA]' : 'bg-[#D6E9FF]'}`} />
          ))}
        </div>

        <div className="tutorial-step mb-4">
          <div className="tutorial-balloon">💡 {currentStep.balloon}</div>
          <p className="text-[13px] leading-[1.6] text-[#1A2B4D] mt-2">{currentStep.text}</p>
          <div className="tutorial-emoji">{currentStep.emoji}</div>
        </div>

        {step === 4 && (
          <div className="mb-4">
            <label className="text-[11px] font-semibold uppercase tracking-wide block mb-2">Nome da pasta:</label>
            <input value={folderName} onChange={(e) => setFolderName(e.target.value)} className="input-field h-11 rounded-full px-4" placeholder="SoCialBr_save" />
          </div>
        )}

        <div className="flex gap-2">
          {step > 0 && <button onClick={() => setStep(step - 1)} className="btn-secondary flex-1">← Voltar</button>}
          {step < steps.length - 1 ? (
            <button onClick={() => setStep(step + 1)} className="btn-primary flex-1">Próximo →</button>
          ) : (
            <button onClick={() => onComplete(folderName)} className="btn-primary flex-1">✅ Entendi! Baixar backup</button>
          )}
        </div>

        <p className="text-[10px] text-center text-[#1A2B4D]/40 mt-3">Este tutorial é do SoCialBr. O Google Drive é um serviço do Google.</p>
      </div>
    </div>
  );
}

// ==================== MODAL LEGAL ====================
function LegalModal({ type, onClose }) {
  const content = LegalContent[type] || '';
  const titles = {
    lgpd: '📋 Política de Privacidade (LGPD)',
    termos: ' Termos de Uso',
    responsabilidade: '⚖️ Responsabilidade de Uso'
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={e => e.stopPropagation()}>
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-bold text-[16px]">{titles[type]}</h3>
          <button onClick={onClose} className="w-8 h-8 grid place-items-center rounded-full border border-[#B8D4FF]">
            <Icon path={Icons.X} size={16} />
          </button>
        </div>
        <div className="text-[12px] leading-[1.6] whitespace-pre-wrap text-[#1A2B4D]/80 max-h-[60vh] overflow-y-auto">
          {content}
        </div>
      </div>
    </div>
  );
}

// ==================== APP PRINCIPAL ====================
function App() {
  const [darkMode, setDarkMode] = useState(false);
  const [user, setUser] = useState(() => StorageService.load('user') || { name: '', bio: 'Vivendo offline por opção. Sem algoritmo, só amigos.' });
  const [userPhoto, setUserPhoto] = useState(() => StorageService.load('userPhoto') || null);
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
  const [activeCard, setActiveCard] = useState(null);
  const [showEditProfile, setShowEditProfile] = useState(false);
  const [editName, setEditName] = useState('');
  const [editBio, setEditBio] = useState('');
  const [likedMessages, setLikedMessages] = useState(() => new Set(StorageService.load('liked') || []));
  const [toast, setToast] = useState(null);
  const [showLegalModal, setShowLegalModal] = useState(null);
  const [showAdModal, setShowAdModal] = useState(false);
  const [showGroupModal, setShowGroupModal] = useState(false);
  const [showTutorial, setShowTutorial] = useState(false);
  const [adForm, setAdForm] = useState({ title: '', description: '', mediaUrl: '', link: '' });
  const [groupForm, setGroupForm] = useState({ name: '', description: '', isEncrypted: true });
  const [cryptoKey, setCryptoKey] = useState(null);
  const [keyDisplay, setKeyDisplay] = useState('GERANDO...');

  useEffect(() => {
    if (darkMode) document.body.classList.add('dark');
    else document.body.classList.remove('dark');
  }, [darkMode]);

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
  useEffect(() => { if (userPhoto) StorageService.save('userPhoto', userPhoto); }, [userPhoto]);
  useEffect(() => { StorageService.save('messages', messages); }, [messages]);
  useEffect(() => { StorageService.save('ads', ads); }, [ads]);
  useEffect(() => { StorageService.save('groups', groups); }, [groups]);
  useEffect(() => { StorageService.save('liked', Array.from(likedMessages)); }, [likedMessages]);
  useEffect(() => { if (toast) { const t = setTimeout(() => setToast(null), 3000); return () => clearTimeout(t); } }, [toast]);

  const showToast = (message, type = "success") => setToast({ message, type });

  const handleLogin = async () => {
    if (!loginName.trim()) return;
    
    if (USE_SERVER) {
      const result = await ApiService.createUser({ name: loginName.trim() });
      if (result) {
        setUser(result);
        setIsLoggedIn(true);
        showToast(`Bem-vindo ao SoCialBr, ${result.name}!`);
        return;
      }
    }
    
    setUser(prev => ({ ...prev, name: loginName.trim() }));
    setIsLoggedIn(true);
    showToast(`Bem-vindo ao SoCialBr, ${loginName.trim()}!`);
  };

  const handlePhotoUpload = (event) => {
    const file = event.target.files[0];
    if (!file) return;
    if (file.size > 5 * 1024 * 1024) {
      showToast("Foto muito grande! Máximo 5MB.", "error");
      return;
    }
    const reader = new FileReader();
    reader.onload = (e) => {
      setUserPhoto(e.target.result);
      showToast("Foto atualizada!");
    };
    reader.readAsDataURL(file);
  };

  const handleSendMessage = async () => {
    if (!newMessage.trim()) return;
    const moderationCheck = ModerationService.check(newMessage);
    if (!moderationCheck.safe) {
      showToast(moderationCheck.reason, "error");
      setNewMessage('');
      return;
    }
    
    const msg = { id: Date.now(), from: user.name, text: newMessage.trim(), encrypted: encryptEnabled, time: "agora", likes: 0 };
    
    if (USE_SERVER && user.id) {
      const result = await ApiService.createMessage({ user_id: user.id, text: newMessage.trim(), encrypted: encryptEnabled });
      if (result) {
        setMessages(prev => [result, ...prev]);
      } else {
        setMessages(prev => [msg, ...prev]);
      }
    } else {
      setMessages(prev => [msg, ...prev]);
    }
    
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

  const handleCreateAd = async () => {
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
    
    const newAd = {
      id: Date.now(),
      title: adForm.title.trim(),
      description: adForm.description.trim(),
      mediaUrl: adForm.mediaUrl.trim(),
      link: adForm.link.trim() || "#",
      expiresAt: Date.now() + (30 * 24 * 60 * 60 * 1000)
    };
    
    if (USE_SERVER) {
      const result = await ApiService.createAd(newAd);
      if (result) {
        setAds(prev => [result, ...prev]);
      } else {
        setAds(prev => [newAd, ...prev]);
      }
    } else {
      setAds(prev => [newAd, ...prev]);
    }
    
    setAdForm({ title: '', description: '', mediaUrl: '', link: '' });
    setShowAdModal(false);
    showToast("Anúncio ativado por 30 dias!");
  };

  const handleCreateGroup = async () => {
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
    
    if (USE_SERVER && user.id) {
      const result = await ApiService.createGroup({ ...newGroup, created_by: user.id });
      if (result) {
        setGroups(prev => [result, ...prev]);
      } else {
        setGroups(prev => [newGroup, ...prev]);
      }
    } else {
      setGroups(prev => [newGroup, ...prev]);
    }
    
    setGroupForm({ name: '', description: '', isEncrypted: true });
    setShowGroupModal(false);
    showToast(`Grupo "${newGroup.name}" criado!`);
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

  const handleGoogleDriveBackup = () => {
    setShowTutorial(true);
  };

  const handleTutorialComplete = (folderName) => {
    setShowTutorial(false);
    const data = StorageService.exportAll();
    const blob = new Blob([data], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${folderName}_backup_${new Date().toISOString().slice(0, 10)}.json`;
    a.click();
    URL.revokeObjectURL(url);
    showToast(`Backup salvo! Pasta sugerida: ${folderName}`);
  };

  const navigateTo = (tab) => { setActiveTab(tab); window.scrollTo({ top: 0, behavior: 'smooth' }); };

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
              <Avatar name={user.name} photo={userPhoto} size="sm" />
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
    <div className="min-h-screen antialiased overflow-x-hidden">
      {/* Header */}
      <header className="sticky z-40 bg-white border-b border-[#B8D4FF] shadow-[0_2px_0_0_#B8D4FF] w-full">
        <div className="max-w-[1280px] mx-auto h-[56px] md:h-[64px] px-3 md:px-6 flex items-center justify-between gap-2 md:gap-4">
          <div className="flex items-center gap-2 md:gap-3 min-w-0">
            <div className="flex items-center gap-2 shrink-0">
              <img src="logo-socialbr.png" alt="SoCialBr" className="logo-img" />
              <div className="logo text-[26px] md:text-[30px] font-bold tracking-tight leading-none flex items-baseline">
                <span className="texto-social">SoCial</span>
                <span className="texto-br">Br</span>
              </div>
              <span className="ml-2 hidden lg:inline text-[10px] font-semibold tracking-[0.2em] text-[#2C5DFA] bg-[#D6E9FF] px-2 py-0.5 rounded-full border border-[#B8D4FF]">SEGURO • E2E</span>
            </div>
          </div>
          <nav className="hidden md:flex items-center gap-1 text-[13px] font-medium shrink-0">
            {[['Início', 'inicio'], ['Perfil', 'perfil'], ['Recados', 'recados'], ['Grupos', 'grupos']].map(([label, tab]) => (
              <button key={tab} onClick={() => navigateTo(tab)} className={`px-3 py-1.5 rounded-full transition ${activeTab === tab ? "bg-[#1A2B4D] text-white" : "hover:bg-[#D6E9FF] text-[#1A2B4D]/70"}`}>{label}</button>
            ))}
          </nav>
          <div className="flex items-center gap-2 md:gap-3 shrink-0">
            <button onClick={() => setDarkMode(!darkMode)} className="w-9 h-9 grid place-items-center rounded-full border border-[#B8D4FF] hover:bg-[#D6E9FF] transition">
              <Icon path={darkMode ? Icons.Sun : Icons.Moon} size={16} />
            </button>
            {isLoggedIn && <Avatar name={user.name} photo={userPhoto} size="md" online={true} />}
          </div>
        </div>
      </header>

      {/* Barra de Transparência */}
      <div className="bg-white border-b border-[#B8D4FF] w-full overflow-hidden">
        <div className="max-w-[1280px] mx-auto px-3 md:px-6 min-h-[40px] py-2 flex flex-wrap items-center gap-2 text-[11px] md:text-[12px]">
          <span className="inline-flex items-center gap-1.5 bg-[#E6F4EA] text-[#1B6B2F] border border-[#A8DAB5] px-2.5 py-1 rounded-full font-medium">✓ 100% sem rastreamento</span>
          <span className="inline-flex items-center gap-1.5 bg-[#FEF2F2] text-[#991B1B] border border-[#FECACA] px-2.5 py-1 rounded-full font-medium">🛡️ Moderação Ativa</span>
          <button onClick={() => setShowAdModal(true)} className="inline-flex items-center gap-1.5 bg-[#1A2B4D] text-white px-2.5 py-1 rounded-full font-medium hover:bg-black transition ml-auto">
            <Icon path={Icons.Megaphone} size={12} /> Anuncie Aqui
          </button>
        </div>
      </div>

      {/* Conteúdo Principal */}
      <main className="max-w-[1280px] mx-auto px-3 md:px-4 py-4 md:py-6 pb-[80px] md:pb-6 grid grid-cols-1 md:grid-cols-12 gap-4 md:gap-5">
        {/* Sidebar Esquerda */}
        <aside className="md:col-span-3 flex flex-col gap-4 min-w-0">
          {/* Card Perfil */}
          <div className={`card overflow-hidden ${activeCard === 'perfil' ? 'card-glow' : ''}`} onClick={() => setActiveCard('perfil')}>
            <div className="gradient-header">
              <div className="avatar-xl">
                {userPhoto ? (
                  <img src={userPhoto} alt={user.name} className="w-full h-full object-cover" />
                ) : (
                  <Avatar name={user.name} size="xl" />
                )}
              </div>
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

          {/* Card Chave AES-256 */}
          <div className={`card p-4 ${activeCard === 'chave' ? 'card-glow' : ''}`} onClick={() => setActiveCard('chave')}>
            <h3 className="font-bold text-[13px] flex items-center gap-1.5 mb-2"><Icon path={Icons.Key} size={14} /> Sua Chave AES-256</h3>
            <div className="text-[10px] font-mono bg-[#F8FBFF] border border-[#D6E9FF] rounded-lg p-2 break-all text-[#1A2B4D]/70">{keyDisplay}</div>
            <p className="text-[10px] text-[#1A2B4D]/50 mt-2">Guarde esta chave. Sem ela, suas mensagens criptografadas são perdidas para sempre.</p>
          </div>

          {/* Card Backup */}
          <div className={`card p-4 ${activeCard === 'backup' ? 'card-glow' : ''}`} onClick={() => setActiveCard('backup')}>
            <h3 className="font-bold text-[13px] flex items-center gap-1.5 mb-3"><Icon path={Icons.Database} size={14} /> Backup de Dados</h3>
            <div className="flex flex-col gap-2">
              <button onClick={handleExportData} className="btn-secondary inline-flex items-center gap-2 justify-center">
                <Icon path={Icons.Download} size={14} /> Exportar backup (JSON)
              </button>
              <label className="btn-secondary inline-flex items-center gap-2 justify-center cursor-pointer">
                <Icon path={Icons.Upload} size={14} /> Importar backup
                <input type="file" accept=".json" onChange={handleImportData} className="hidden" />
              </label>
              <button onClick={handleGoogleDriveBackup} className="btn-secondary inline-flex items-center gap-2 justify-center">
                <Icon path={Icons.Cloud} size={14} /> Salvar no Google Drive
              </button>
            </div>
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

          <div className="card p-4">
            <h3 className="font-bold text-[13px] flex items-center gap-1.5 mb-3"><Icon path={Icons.Users} size={14} /> Grupos</h3>
            <button onClick={() => setShowGroupModal(true)} className="btn-primary w-full mb-3">+ Criar Grupo</button>
            <div className="space-y-2 max-h-[200px] overflow-y-auto">
              {groups.length === 0 ? (
                <p className="text-[11px] text-[#1A2B4D]/50">Nenhum grupo criado ainda.</p>
              ) : groups.map(g => (
                <div key={g.id} className="p-2 bg-[#F8FBFF] rounded-lg border border-[#D6E9FF]">
                  <div className="text-[12px] font-semibold">{g.name}</div>
                  <div className="text-[10px] text-[#1A2B4D]/50">{g.members.length} membro(s) {g.isEncrypted && ''}</div>
                </div>
              ))}
            </div>
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

      {/* Banner de Parcerias */}
      <div className="parcerias-banner">
        <div className="parcerias-track">
          <a href="https://mpago.la/1S9wisH" className="parceria-item" target="_blank" rel="noopener noreferrer">🤝 Parceiro 1 - Marca Ética</a>
          <a href="https://mpago.la/1S9wisH" className="parceria-item" target="_blank" rel="noopener noreferrer">🌱 Parceiro 2 - Sustentável</a>
          <a href="https://mpago.la/1S9wisH" className="parceria-item" target="_blank" rel="noopener noreferrer">🔒 Parceiro 3 - Privacidade</a>
          <a href="https://mpago.la/1S9wisH" className="parceria-item" target="_blank" rel="noopener noreferrer">💡 Parceiro 4 - Inovação</a>
          <a href="https://mpago.la/1S9wisH" className="parceria-item" target="_blank" rel="noopener noreferrer">🎨 Parceiro 5 - Criativo</a>
          <a href="https://mpago.la/1S9wisH" className="parceria-item" target="_blank" rel="noopener noreferrer">🤝 Parceiro 1 - Marca Ética</a>
          <a href="https://mpago.la/1S9wisH" className="parceria-item" target="_blank" rel="noopener noreferrer">🌱 Parceiro 2 - Sustentável</a>
          <a href="https://mpago.la/1S9wisH" className="parceria-item" target="_blank" rel="noopener noreferrer">🔒 Parceiro 3 - Privacidade</a>
          <a href="https://mpago.la/1S9wisH" className="parceria-item" target="_blank" rel="noopener noreferrer">💡 Parceiro 4 - Inovação</a>
          <a href="https://mpago.la/1S9wisH" className="parceria-item" target="_blank" rel="noopener noreferrer">🎨 Parceiro 5 - Criativo</a>
        </div>
      </div>

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
            <div className="logo text-[32px] font-bold"><span className="text-[#FF2E93]">S</span>o<span className="text-[#2C5DFA]">C</span>ial<span className="text-[#22C55E]">Br</span></div>
            <div className="text-[12px] text-[#1A2B4D]/60 mt-1">Entre sem e-mail, sem senha, sem rastreamento.</div>
            <div className="mt-4 flex flex-col gap-3">
              <input value={loginName} onChange={(e) => setLoginName(e.target.value)} placeholder="Seu nome" className="input-field h-11 rounded-full px-4" onKeyPress={(e) => e.key === 'Enter' && handleLogin()} />
              <button onClick={handleLogin} className="btn-primary h-11 rounded-full w-full">Entrar no SoCialBr →</button>
              <div className="text-[10px] text-center text-[#1A2B4D]/40"> AES-256 • Sem cookies • Código aberto</div>
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
              <label className="text-[11px] font-semibold uppercase tracking-wide">Foto de Perfil</label>
              <div className="flex items-center gap-3 mb-2">
                {userPhoto ? (
                  <img src={userPhoto} alt="Foto" className="w-16 h-16 rounded-full object-cover border-2 border-[#B8D4FF]" />
                ) : (
                  <div className="w-16 h-16 rounded-full bg-[#D6E9FF] border-2 border-[#B8D4FF] grid place-items-center">
                    <Icon path={Icons.User} size={24} className="text-[#1A2B4D]/40" />
                  </div>
                )}
                <label className="btn-secondary cursor-pointer inline-flex items-center gap-2">
                  <Icon path={Icons.Upload} size={14} /> Enviar Foto
                  <input type="file" accept="image/*" onChange={handlePhotoUpload} className="hidden" />
                </label>
                {userPhoto && (
                  <button onClick={() => setUserPhoto(null)} className="text-[11px] text-red-500 hover:underline">
                    Remover
                  </button>
                )}
              </div>
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
              <div className="text-[12px] font-bold text-[#1A2B4D] mb-1">📦 Pacote Único de Destaque</div>
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
              <div className="text-[12px] font-bold text-[#1A2B4D] mb-1">🔒 Grupos Privados</div>
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

      {/* Tutorial Google Drive */}
      {showTutorial && (
        <TutorialGoogleDrive
          onClose={() => setShowTutorial(false)}
          onComplete={handleTutorialComplete}
        />
      )}

      {/* Modal Legal */}
      {showLegalModal && (
        <LegalModal type={showLegalModal} onClose={() => setShowLegalModal(null)} />
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
                <button onClick={() => setShowLegalModal('responsabilidade')} className="footer-link text-left">️ Responsabilidade de Uso</button>
              </div>
            </div>
            <div>
              <h4 className="font-bold text-[13px] mb-2">Segurança</h4>
              <div className="text-[11px] text-[#1A2B4D]/60 leading-[1.6]">
                <p>✓ Zero rastreamento</p>
                <p>✓ Criptografia AES-256</p>
                <p>✓ Moderação automática</p>
                <p>✓ Conformidade LGPD</p>
              </div>
            </div>
            <div>
              <h4 className="font-bold text-[13px] mb-2">Projeto</h4>
              <div className="text-[11px] text-[#1A2B4D]/60 leading-[1.6]">
                <p>🆔 ID: 91c71bb9-46e4-4052-b7e5-7572ec26d857</p>
                <p>📧 hdmicromicro@gmail.com</p>
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
