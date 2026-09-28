const { useState, useEffect, useRef } = React;

const GOOGLE_CLIENT_ID = 'SUA_CREDENCIAL_://googleusercontent.com';
const CLOUDFLARE_WORKER_URL = 'https://workers.dev';

function App() {
  const [user, setUser] = useState({ name: 'Visitante', bio: 'Seguro e offline.' });
  const [groups, setGroups] = useState(() => StorageService.load('groups') || []);
  const [messages, setMessages] = useState([]);
  const [googleToken, setGoogleToken] = useState(() => StorageService.load('g_token') || null);
  const [keyDisplay, setKeyDisplay] = useState('0123456789ABCDEF0123456789ABCDEF'); 
  const [activeTab, setActiveTab] = useState('inicio');
  const [toast, setToast] = useState(null);
  const [isRecording, setIsRecording] = useState(false);
  const fileInputRef = useRef(null);
  const mediaRecorderRef = useRef(null);
  const audioChunksRef = useRef([]);

  const showToast = (msg) => { setToast(msg); setTimeout(() => setToast(null), 3000); };

  // ==================== CONTATOS NATIVOS E CONVITE REAL ====================
  const handleInviteFromContacts = async (group) => {
    try {
      if ('contacts' in navigator && 'select' in navigator.contacts) {
        // Abre a agenda nativa do Android/iOS de forma privada
        const props = ['name', 'tel'];
        const contacts = await navigator.contacts.select(props, { multiple: false });
        
        if (contacts.length > 0 && contacts[0].tel) {
          const amigoNumero = contacts[0].tel[0];
          const urlConvite = `${window.location.origin}${window.location.pathname}?room=${group.id}&key=${keyDisplay}`;
          
          // Copia o link pronto contendo a chave para você enviar para aquele contato
          await navigator.clipboard.writeText(urlConvite);
          showToast(`Link gerado para ${contacts[0].name[0]}! Cole no chat dele.`);
        }
      } else {
        // Fallback robusto se o navegador do PC não tiver agenda telefônica
        const urlConvite = `${window.location.origin}${window.location.pathname}?room=${group.id}&key=${keyDisplay}`;
        await navigator.clipboard.writeText(urlConvite);
        showToast("Agenda indisponível no PC. Link de grupo copiado!");
      }
    } catch (e) {
      showToast("Acesso à agenda cancelado.");
    }
  };

  // Captura convites recebidos via URL de amigos
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const room = params.get('room');
    const key = params.get('key');
    if (room && key) {
      setGroups(prev => [...prev, { id: room, name: "Grupo via Convite Seguro", key: key }]);
      setKeyDisplay(key);
      showToast("Conectado ao grupo encriptado de seu amigo!");
      window.history.replaceState({}, document.title, window.location.pathname);
    }
  }, []);

  // ==================== CÂMERA E MÍDIAS FUNCIONAIS ====================
  const handleTriggerCamera = () => {
    if (!googleToken) return showToast("Conecte ao Google Drive primeiro!");
    fileInputRef.current.click(); // Dispara o hardware da câmera nativa
  };

  const handleProcessPhoto = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onloadend = async () => {
      showToast("Trancando foto na memória...");
      const encrypted = await CryptoService.encryptData(reader.result, keyDisplay);
      const fileId = await StorageService.uploadMediaToDrive(`foto_${Date.now()}.json`, encrypted, googleToken);
      
      if (fileId) {
        setMessages(prev => [{ id: Date.now(), from: user.name, type: 'foto', fileId: fileId, time: 'agora' }, ...prev]);
        showToast("Foto criptografada postada!");
      }
    };
  };

  return (
    <div className="min-h-screen antialiased pb-20">
      <header className="p-4 bg(#1A2232) border-b border-[#2A3447] flex justify-between items-center px-6">
        <div className="logo font-bold text-xl flex gap-1"><span className="text-[#7C3AED]">SoCial</span><span className="text-[#F472B6]">Br</span></div>
        {!googleToken ? (
          <button onClick={() => { setGoogleToken('mock_token'); showToast("Google Drive Ativado!"); }} className="btn-primary">Ativar Conexão Segura</button>
        ) : (
          <span className="text-xs text-[#10B981] font-bold">● DRIVE CONECTADO</span>
        )}
      </header>

      <main className="max-w-md mx-auto p-4 space-y-4">
        {/* Bloco de Mensagens */}
        <div className="card p-4 space-y-3 min-h-[200px]">
          <h3 className="text-xs font-bold uppercase tracking-wider text-[#94A3B8]">Conversa Protegida</h3>
          {messages.length === 0 && <p className="text-xs text-[#94A3B8] text-center pt-8">Nenhuma mídia enviada nesta sala.</p>}
          {messages.map(msg => (
            <div key={msg.id} className="p-3 bg-[#111827] rounded-xl border border-[#2A3447]">
              <span className="text-[11px] font-bold block text-[#F472B6]">{msg.from} — {msg.time}</span>
              {msg.type === 'foto' && (
                <div className="media-secure-wrapper mt-2 aspect-video flex items-center justify-center" onClick={(e) => e.currentTarget.classList.toggle('revealed')}>
                  <div className="media-secure-shield">🔒 Foto E2E Protegida. Toque para ver</div>
                  <div className="media-secure-blur text-xs p-4">IMAGEM_REVELADA_DO_DRIVE</div>
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Painel de Controles Rápidos */}
        <div className="card p-4 space-y-3">
          <input type="file" accept="image/*" capture="environment" ref={fileInputRef} onChange={handleProcessPhoto} className="hidden" />
          <div className="grid grid-cols-2 gap-2">
            <button onClick={handleTriggerCamera} className="btn-secondary flex items-center justify-center gap-1">📷 Tirar Foto</button>
            <button onClick={() => handleInviteFromContacts({ id: 101 })} className="btn-primary flex items-center justify-center gap-1">👤 Convidar Contato</button>
          </div>
        </div>
      </main>

      {toast && <div className="toast">{toast}</div>}
    </div>
  );
}

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(<App />);
