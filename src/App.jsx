import { useState, useEffect } from 'react';
import { 
  Cloud, CloudOff, Plus, Trash2, Edit2, FileText, Image as ImageIcon, 
  Calendar as CalendarIcon, CheckCircle, ChevronLeft, ChevronRight, 
  Save, Printer, Link as LinkIcon, Settings, Layout, 
  GripVertical, BarChart2, AlertCircle, TrendingUp, Target, Flag, X,
  Share2, Copy, ExternalLink, ShieldCheck, MessageSquare, Columns, Menu,
  Moon, Sun, CheckSquare, FileBox, Instagram, Database, LogOut,
  Briefcase, Compass, Palette, BookOpen, Swords, UserSquare, Users
} from 'lucide-react';
import { initializeApp, getApps } from 'firebase/app';
import { getAuth, signInAnonymously, signInWithCustomToken, onAuthStateChanged, GoogleAuthProvider, signInWithPopup, signOut } from 'firebase/auth';
import { getFirestore, doc, setDoc, getDoc } from 'firebase/firestore';

// =====================================================================
// 🔴 CONFIGURACIÓN DE FIREBASE (PARA TU ENTORNO LOCAL) 🔴
// =====================================================================
const isLocal = typeof __firebase_config === 'undefined';
const localFirebaseConfig = {
  apiKey: "AIzaSyAaGg6ADF5KKsIfoT62QJ_OmVi_cjXotn0",
  authDomain: "mycampaigns-8b19f.firebaseapp.com",
  projectId: "mycampaigns-8b19f",
  storageBucket: "mycampaigns-8b19f.firebasestorage.app",
  messagingSenderId: "740399108727",
  appId: "1:740399108727:web:7b20c7e49b1fadbdcc2c72",
  measurementId: "G-FETX6PKL1F"
};

const firebaseConfig = !isLocal ? JSON.parse(__firebase_config) : localFirebaseConfig;
const appId = typeof __app_id !== 'undefined' ? __app_id : 'miscampanas-app';

// Inicialización Segura
let app, auth, db;
let configError = false;

try {
  if (!firebaseConfig.apiKey) {
    configError = true;
  } else {
    app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApps()[0];
    auth = getAuth(app);
    db = getFirestore(app);
  }
} catch (e) {
  configError = true;
  console.error("Error inicializando Firebase:", e);
}

// --- DATOS INICIALES DE PRUEBA ---
const initialData = {
  profile: { name: "Mi Agencia", logoUrl: "" },
  projects: [
    {
      id: 'p1',
      name: 'Proyecto de Ejemplo',
      type: 'Político',
      status: 'Activo',
      briefUrl: 'https://drive.google.com/ejemplo',
      identity: { 
        mission: 'Mejorar la calidad de vida a través de la gestión transparente.', 
        vision: 'Ser el gobierno municipal más innovador del estado.', 
        values: 'Honestidad, Cercanía, Innovación', 
        voiceTone: 'Cercano, firme y esperanzador', 
        targetAudience: 'Jóvenes de 18 a 35 años desencantados con la política tradicional y jefas de familia preocupadas por la seguridad.',
        colors: ['#10b981', '#1e293b'] 
      },
      swot: { strengths: ['Candidato carismático', 'Estructura territorial sólida'], weaknesses: ['Presupuesto limitado en digital', 'Poco tiempo de preparación'], opportunities: ['Descontento social con la oposición', 'Voto joven indeciso'], threats: ['Campaña sucia en redes sociales', 'Desinformación'] },
      campaigns: [
        {
          id: 'c1',
          name: 'CAMPAÑA DE EJEMPLO',
          description: 'Esta es una descripción genérica para mostrar cómo se ve una campaña de prueba.',
          objectives: [
            {
              id: 'obj1',
              title: 'Objetivo de Ejemplo',
              general: 'Aumentar la visibilidad y probar el funcionamiento de la plataforma de MisCampañas.',
              specific: 'Llegar a la audiencia objetivo a través de diferentes redes sociales.',
              measurable: 'Conseguir 1,000 interacciones de prueba.',
              achievable: 'Utilizando las herramientas de gestión integradas.',
              relevant: 'Para validar el flujo de trabajo con clientes.',
              timeBound: 'Durante el primer mes de prueba.',
              kpis: ['+1k Interacciones']
            }
          ],
          documents: [
            { 
              id: 'd1', 
              title: 'ESTRATEGIA DE EJEMPLO', 
              blocks: [
                { id: 'b1', type: 'h1', content: 'Fase 1: Preparación' },
                { id: 'b2', type: 'p', content: 'Aquí puedes detallar los pasos de tu estrategia usando bloques de texto.' },
                { id: 'b3', type: 'task', content: 'Tarea de prueba completada', completed: true },
                { id: 'b4', type: 'task', content: 'Tarea de prueba pendiente', completed: false }
              ] 
            },
            { 
              id: 'd2', 
              title: 'GUIÓN DE VIDEO: EL PULSO', 
              blocks: [
                { id: 'b1_2', type: 'h1', content: 'Video Promocional: El Pulso' },
                { id: 'b2_2', type: 'p', content: 'Escena 1: Toma en primera persona entrando al estadio. Sonido de latidos de fondo.' },
                { id: 'b3_2', type: 'p', content: 'Locución: "Llegó el momento que todos esperábamos..."' },
                { id: 'b4_2', type: 'task', content: 'Grabar tomas de apoyo del estadio', completed: true },
                { id: 'b5_2', type: 'task', content: 'Añadir subtítulos automáticos', completed: true }
              ] 
            }
          ],
          posts: [
            { id: 'post1', network: 'FB', type: 'Imagen', date: new Date().toISOString().split('T')[0], title: 'Post de Ejemplo (Hoy)', status: 'Pendiente', docRef: 'd1', assetUrl: '', finalUrl: '', metrics: { likes: 0, comments: 0, shares: 0 }, comments: [] },
            { id: 'post2', network: 'IG', type: 'Video', date: '2026-05-01', title: 'Video de Ejemplo', status: 'En Revisión', docRef: '', assetUrl: '', finalUrl: '', metrics: { likes: 0, comments: 0, shares: 0 }, comments: [] },
            { id: 'post3', network: 'TK', type: 'Video', date: '2026-03-15', title: 'TikTok: El Pulso', status: 'Publicado', docRef: 'd2', assetUrl: '', finalUrl: 'https://tiktok.com', metrics: { likes: 1450, comments: 312, shares: 89 }, comments: [{id:'cm1', author: 'Cliente', text: '¡Quedó espectacular el video!', date: '2026-03-16'}] }
          ]
        }
      ]
    }
  ]
};

export default function App() {
  const [user, setUser] = useState(null);
  const [isAuthReady, setIsAuthReady] = useState(false);
  const [syncStatus, setSyncStatus] = useState('offline');
  const [appData, setAppData] = useState(initialData);
  
  // Memoria del Modo Oscuro
  const [isDarkMode, setIsDarkMode] = useState(() => localStorage.getItem('theme') === 'dark');
  
  const [isProfileModalOpen, setIsProfileModalOpen] = useState(false);
  const [currentView, setCurrentView] = useState('projects'); 
  const [activeProject, setActiveProject] = useState(null);
  const [activeCampaign, setActiveCampaign] = useState(null);
  const [sharedToken, setSharedToken] = useState(null);

  // Efecto para guardar preferencia de modo oscuro
  useEffect(() => {
    localStorage.setItem('theme', isDarkMode ? 'dark' : 'light');
  }, [isDarkMode]);

  // Efecto para manejar URLs compartidas
  useEffect(() => {
    const hash = window.location.hash;
    if (hash.startsWith('#shared=')) {
      const token = hash.split('=')[1];
      setSharedToken(token);
      setCurrentView('shared_client');
    }

    const handleHashChange = () => {
      const newHash = window.location.hash;
      if (newHash.startsWith('#shared=')) {
        setSharedToken(newHash.split('=')[1]);
        setCurrentView('shared_client');
      } else {
        setSharedToken(null);
        if (currentView === 'shared_client') setCurrentView('projects');
      }
    };
    window.addEventListener('hashchange', handleHashChange);
    return () => window.removeEventListener('hashchange', handleHashChange);
  }, [currentView]);

  // Efecto de Autenticación
  useEffect(() => {
    if (configError || !auth) return;

    const initAuth = async () => {
      try {
        if (typeof __initial_auth_token !== 'undefined' && __initial_auth_token) {
          await signInWithCustomToken(auth, __initial_auth_token);
        }
      } catch (error) {
        console.error("Auth error:", error);
      }
    };
    initAuth();

    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      setIsAuthReady(true);
      if (currentUser) loadDataFromCloud(currentUser.uid);
    });
    return () => unsubscribe();
  }, []);

  const loadDataFromCloud = async (userId) => {
    if (configError || !db) return;
    setSyncStatus('syncing');
    try {
      const docRef = doc(db, 'artifacts', appId, 'users', userId, 'workspace', 'main');
      const docSnap = await getDoc(docRef);
      if (docSnap.exists()) setAppData(docSnap.data().appData);
      setSyncStatus('synced');
    } catch (error) {
      setSyncStatus('error');
    }
  };

  const saveDataToCloud = async () => {
    if (configError || !user || !db) return;
    setSyncStatus('syncing');
    try {
      const docRef = doc(db, 'artifacts', appId, 'users', user.uid, 'workspace', 'main');
      await setDoc(docRef, { appData, lastSync: new Date().toISOString() });
      setTimeout(() => setSyncStatus('synced'), 800);
    } catch (error) {
      setSyncStatus('error');
    }
  };

  const handleLogout = async () => {
    try {
      await signOut(auth);
      setIsProfileModalOpen(false);
      setAppData(initialData);
    } catch (error) {
      console.error("Error al cerrar sesión:", error);
    }
  };

  useEffect(() => {
    if (syncStatus === 'synced') setSyncStatus('offline');
  }, [appData, syncStatus]);

  if (configError) return <FirebaseSetupScreen />;

  if (!isAuthReady) {
    return (
      <div className={`min-h-screen flex items-center justify-center ${isDarkMode ? 'bg-gray-950' : 'bg-gray-50'}`}>
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
      </div>
    );
  }

  if (!user && currentView !== 'shared_client') {
    return <AuthScreen onLoginAnonymously={() => signInAnonymously(auth)} isDarkMode={isDarkMode} />;
  }

  return (
    <div className={`${isDarkMode ? 'dark' : ''} min-h-screen font-sans flex flex-col selection:bg-emerald-200 transition-colors duration-300`}>
      <div className="flex-1 flex flex-col bg-[#F3F4F6] dark:bg-gray-950 text-gray-800 dark:text-gray-100 transition-colors duration-300">
        
        {/* HEADER PRINCIPAL */}
        <header className="bg-white dark:bg-gray-900 px-6 py-4 flex justify-between items-center border-b border-gray-200 dark:border-gray-800 shadow-sm sticky top-0 z-50 transition-colors duration-300">
          <div className="flex items-center gap-3">
            <img src="./icon.png" alt="Logo MisCampañas" className="w-9 h-9 rounded-lg shadow-sm object-cover" />
            <span className="font-extrabold text-xl tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-gray-900 to-gray-600 dark:from-white dark:to-gray-300">
              MisCampañas
            </span>
          </div>
          <div className="flex items-center gap-4">
            <button 
              onClick={() => setIsDarkMode(!isDarkMode)} 
              className="p-2 text-gray-500 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white bg-gray-100 dark:bg-gray-800 rounded-full transition-colors"
              title="Alternar Modo Oscuro"
            >
              {isDarkMode ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
            </button>
            
            {/* PERFIL / MARCA */}
            {currentView !== 'shared_client' && (
              <button 
                onClick={() => setIsProfileModalOpen(true)}
                className="flex items-center gap-2 px-3 py-1 bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 rounded-full transition-colors cursor-pointer border border-transparent hover:border-gray-300 dark:hover:border-gray-600"
                title="Configurar Perfil de Agencia"
              >
                {appData.profile.logoUrl ? (
                  <img src={appData.profile.logoUrl} alt="Logo" className="w-6 h-6 rounded-full object-cover" />
                ) : (
                  <div className="w-6 h-6 rounded-full bg-indigo-500 text-white flex items-center justify-center text-xs font-bold">
                    {appData.profile.name.substring(0,1)}
                  </div>
                )}
                <span className="text-sm font-bold text-gray-700 dark:text-gray-300 hidden sm:inline">
                  {appData.profile.name}
                </span>
              </button>
            )}

            {currentView !== 'shared_client' && (
              <button 
                onClick={saveDataToCloud}
                disabled={syncStatus === 'syncing'}
                className={`flex items-center gap-2 px-5 py-2 rounded-full text-sm font-semibold transition-all shadow-sm hover:shadow-md
                  ${syncStatus === 'synced' ? 'bg-emerald-50 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-800' : 
                    syncStatus === 'syncing' ? 'bg-blue-50 text-blue-700 opacity-70 cursor-wait' : 
                    'bg-blue-600 text-white hover:bg-blue-700 hover:-translate-y-0.5 dark:bg-indigo-600 dark:hover:bg-indigo-500'}`}
              >
                {syncStatus === 'syncing' ? <Cloud className="w-4 h-4 animate-pulse" /> : 
                 syncStatus === 'synced' ? <Cloud className="w-4 h-4" /> : 
                 <CloudOff className="w-4 h-4" />}
                <span className="hidden sm:inline">
                  {syncStatus === 'syncing' ? 'Sincronizando...' : syncStatus === 'synced' ? 'Al día' : 'Guardar Nube'}
                </span>
              </button>
            )}
          </div>
        </header>

        {/* MODAL DE PERFIL / MARCA */}
        {isProfileModalOpen && (
          <div className="absolute inset-0 z-[100] flex items-center justify-center p-4 bg-gray-900/60 backdrop-blur-sm">
             <div className="bg-white dark:bg-gray-900 rounded-3xl shadow-2xl p-8 w-full max-w-sm animate-in fade-in zoom-in border border-gray-200 dark:border-gray-800">
                <h3 className="text-2xl font-black mb-6 dark:text-white flex items-center gap-2">
                  <Layout className="w-6 h-6 text-indigo-500"/> Tu Marca
                </h3>
                
                <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">Nombre de la Agencia</label>
                <input 
                  value={appData.profile.name} 
                  onChange={e => setAppData({...appData, profile: {...appData.profile, name: e.target.value}})} 
                  className="w-full border border-gray-200 dark:border-gray-700 p-3 rounded-xl mb-5 dark:bg-gray-800 dark:text-white focus:ring-2 focus:ring-indigo-500 outline-none transition-all" 
                />
                
                <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">URL del Logo (Opcional)</label>
                <input 
                  value={appData.profile.logoUrl || ''} 
                  onChange={e => setAppData({...appData, profile: {...appData.profile, logoUrl: e.target.value}})} 
                  className="w-full border border-gray-200 dark:border-gray-700 p-3 rounded-xl mb-2 dark:bg-gray-800 dark:text-white focus:ring-2 focus:ring-indigo-500 outline-none transition-all" 
                  placeholder="https://tudominio.com/logo.png" 
                />
                <p className="text-xs text-gray-400 mb-8">Pega un enlace a la imagen de tu logo. Se mostrará en la Vista de Cliente y en los Reportes PDF.</p>
                
                <div className="flex justify-between items-center gap-2 mt-2">
                   <button onClick={handleLogout} className="px-4 py-3 bg-red-50 text-red-600 dark:bg-red-900/30 dark:text-red-400 rounded-xl hover:bg-red-100 dark:hover:bg-red-900/50 font-bold transition-colors flex items-center gap-2 shadow-sm">
                     <LogOut className="w-4 h-4" /> Salir
                   </button>
                   <button onClick={() => setIsProfileModalOpen(false)} className="px-6 py-3 bg-gray-900 dark:bg-emerald-600 text-white rounded-xl hover:bg-gray-800 dark:hover:bg-emerald-500 font-bold transition-colors shadow-md">
                     Guardar Cambios
                   </button>
                </div>
             </div>
          </div>
        )}

        <main className="flex-1 overflow-hidden flex flex-col relative">
          {currentView === 'shared_client' ? (
             <SharedClientView token={sharedToken} />
          ) : currentView === 'projects' ? (
             <ProjectsDashboard appData={appData} setAppData={setAppData} onSelectProject={(p) => { setActiveProject(p); setCurrentView('campaigns'); }} />
          ) : currentView === 'campaigns' ? (
             <ProjectWorkspace project={activeProject} appData={appData} setAppData={setAppData} onBack={() => setCurrentView('projects')} onSelectCampaign={(c) => { setActiveCampaign(c); setCurrentView('workspace'); }} />
          ) : (
             <CampaignWorkspace project={activeProject} campaign={activeCampaign} appData={appData} setAppData={setAppData} onBack={() => { setCurrentView('campaigns'); setActiveCampaign(null); }} />
          )}
        </main>
      </div>
    </div>
  );
}

// ==========================================
// PANTALLA DE AUTENTICACIÓN
// ==========================================
function AuthScreen({ onLoginAnonymously, isDarkMode }) {
  const [isLoading, setIsLoading] = useState(false);

  const handleGoogleLogin = async () => {
    setIsLoading(true);
    const provider = new GoogleAuthProvider();
    try {
      await signInWithPopup(auth, provider);
    } catch (error) {
      console.error(error);
      alert("Para que el login con Google funcione, asegúrate de haberlo habilitado en 'Authentication' dentro de Firebase.");
      setIsLoading(false);
    }
  };

  return (
    <div className={`min-h-screen flex flex-col justify-center items-center p-4 selection:bg-emerald-200 ${isDarkMode ? 'dark bg-gray-950' : 'bg-gray-50'}`}>
      <div className="bg-white dark:bg-gray-900 p-8 sm:p-10 rounded-3xl shadow-xl border border-gray-100 dark:border-gray-800 w-full max-w-md flex flex-col items-center animate-in fade-in zoom-in duration-300">
         <img src="./icon.png" alt="Logo MisCampañas" className="w-20 h-20 rounded-2xl shadow-md mb-6 object-cover" />
         <h1 className="text-3xl font-black text-gray-900 dark:text-white mb-2 tracking-tight">MisCampañas</h1>
         <p className="text-gray-500 dark:text-gray-400 text-center mb-8 font-medium">Inicia sesión para gestionar tus estrategias y sincronizar tus datos en la nube.</p>

         <button 
           onClick={handleGoogleLogin} 
           disabled={isLoading}
           className="w-full bg-white dark:bg-gray-800 border-2 border-gray-200 dark:border-gray-700 text-gray-800 dark:text-white px-4 py-3 rounded-xl font-bold flex justify-center items-center gap-3 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors mb-4 shadow-sm disabled:opacity-50"
         >
           <svg className="w-5 h-5" viewBox="0 0 24 24"><path fill="currentColor" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" /><path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" /><path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" /><path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" /><path fill="none" d="M1 1h22v22H1z" /></svg>
           Continuar con Google
         </button>

         <button 
           onClick={() => { setIsLoading(true); onLoginAnonymously(); }}
           disabled={isLoading}
           className="w-full bg-indigo-600 text-white px-4 py-3 rounded-xl font-bold flex justify-center items-center gap-2 hover:bg-indigo-700 transition-colors shadow-md disabled:opacity-50"
         >
           {isLoading ? 'Iniciando...' : 'Entrar de Prueba (Invitado)'}
         </button>
         
         <div className="mt-8 pt-6 border-t border-gray-100 dark:border-gray-800 w-full text-center flex flex-col items-center">
           <p className="text-[10px] font-black text-gray-400 dark:text-gray-500 uppercase tracking-widest mb-3">Diseñado por</p>
           <a 
             href="https://www.instagram.com/byfjoel?igsh=MXNlbG1ibHA2ZnoxNw==" 
             target="_blank" 
             rel="noopener noreferrer" 
             className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-purple-500 via-pink-500 to-orange-500 text-white rounded-full text-sm font-black tracking-wider hover:shadow-lg hover:shadow-pink-500/30 hover:-translate-y-0.5 transition-all"
           >
             <Instagram className="w-5 h-5"/> Francisco Joel
           </a>
         </div>
      </div>
    </div>
  );
}

// ==========================================
// COMPONENTE: PANTALLA DE ALERTA FIREBASE
// ==========================================
function FirebaseSetupScreen() {
  return (
    <div className="min-h-screen bg-[#F8FAFC] flex flex-col items-center justify-center p-6 selection:bg-indigo-200">
      <div className="bg-white p-8 md:p-12 rounded-3xl shadow-xl border border-gray-200 w-full max-w-2xl text-center">
        <div className="w-20 h-20 bg-amber-100 text-amber-500 rounded-full flex items-center justify-center mx-auto mb-6">
          <Database className="w-10 h-10" />
        </div>
        <h1 className="text-3xl font-black text-gray-900 mb-4">¡Tu aplicación necesita una Base de Datos!</h1>
        <p className="text-gray-600 text-lg mb-8 leading-relaxed">
          Revisa la consola para configurar Firebase.
        </p>
      </div>
    </div>
  );
}

// ==========================================
// MODO CLIENTE COMPARTIDO (CON LOGO Y MARCA)
// ==========================================
function SharedClientView({ token }) {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [sharedData, setSharedData] = useState(null);
  const [activeTab, setActiveTab] = useState(null);

  useEffect(() => {
    const fetchSharedData = async () => {
      if (!db) { setError("Base de datos no conectada"); return; }
      try {
        const docRef = doc(db, 'artifacts', appId, 'public', 'data', 'sharedCampaigns', token);
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          const data = docSnap.data();
          setSharedData(data);
          if (data.visibleTabs && data.visibleTabs.length > 0) setActiveTab(data.visibleTabs[0]);
        } else {
          setError("Este enlace ha expirado o no existe.");
        }
      } catch (err) {
        setError("Error al cargar la campaña.");
      } finally {
        setLoading(false);
      }
    };
    fetchSharedData();
  }, [token]);

  const updateSharedCampaign = async (updatedCampaign) => {
    try {
      const docRef = doc(db, 'artifacts', appId, 'public', 'data', 'sharedCampaigns', token);
      await setDoc(docRef, { ...sharedData, campaign: updatedCampaign }, { merge: true });
      setSharedData({ ...sharedData, campaign: updatedCampaign });
    } catch (err) {
      console.error("Error guardando comentario:", err);
      alert("No se pudo guardar el comentario.");
    }
  };

  if (loading) return <div className="flex-1 flex items-center justify-center"><div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div></div>;
  if (error) return <div className="flex-1 flex flex-col items-center justify-center text-red-500"><AlertCircle className="w-12 h-12 mb-4" /><h2 className="text-xl font-bold">{error}</h2><button onClick={() => window.location.hash = ''} className="mt-4 text-gray-500 underline">Volver al inicio</button></div>;
  if (!sharedData) return null;

  const { campaign, agencyName, agencyLogo, visibleTabs } = sharedData;

  const allTabs = [
    { id: 'objetivos', label: 'Objetivos', icon: <Target className="w-4 h-4"/> },
    { id: 'estrategias', label: 'Estrategias', icon: <FileText className="w-4 h-4"/> },
    { id: 'deck', label: 'Deck Posts', icon: <Layout className="w-4 h-4"/> },
    { id: 'calendario', label: 'Calendario', icon: <CalendarIcon className="w-4 h-4"/> },
    { id: 'publicadas', label: 'Publicadas', icon: <CheckCircle className="w-4 h-4"/> },
    { id: 'metricas', label: 'Métricas', icon: <TrendingUp className="w-4 h-4"/> }
  ];

  const allowedTabs = allTabs.filter(t => visibleTabs.includes(t.id));
  const mockAppDataForPrint = { profile: { name: agencyName, logoUrl: agencyLogo } };

  return (
    <div className="flex flex-col h-full w-full bg-[#F8FAFC] dark:bg-gray-950 transition-colors overflow-hidden">
      <div className="bg-white dark:bg-gray-900 px-6 py-5 border-b dark:border-gray-800 shadow-sm z-10 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-indigo-50 text-indigo-700 dark:bg-indigo-900/30 dark:text-indigo-400 text-xs font-bold mb-3 border border-indigo-100 dark:border-indigo-800">
             <ShieldCheck className="w-3.5 h-3.5"/> Vista de Cliente Seguro
          </span>
          <h2 className="text-3xl font-black text-gray-900 dark:text-white">{campaign.name}</h2>
          <div className="flex items-center gap-2 mt-2">
            <span className="text-gray-500 dark:text-gray-400 font-medium text-sm">Gestionado por:</span>
            {agencyLogo && <img src={agencyLogo} alt="Logo" className="w-5 h-5 rounded-full object-cover border border-gray-200 dark:border-gray-700" />}
            <span className="text-gray-800 dark:text-gray-200 font-bold text-sm">{agencyName}</span>
          </div>
        </div>
        <button onClick={() => window.location.hash = ''} className="text-sm font-bold text-gray-500 hover:text-gray-900 dark:hover:text-white transition-colors">Salir de la vista</button>
      </div>

      <div className="bg-white dark:bg-gray-900 px-6 border-b dark:border-gray-800 flex gap-2 overflow-x-auto no-scrollbar pt-2 pb-2">
        {allowedTabs.map(tab => (
          <button 
            key={tab.id} 
            onClick={() => setActiveTab(tab.id)} 
            className={`flex items-center gap-2 px-5 py-2.5 rounded-full text-sm font-bold whitespace-nowrap transition-all
              ${activeTab === tab.id ? 'bg-indigo-600 text-white shadow-md' : 'bg-gray-50 dark:bg-gray-800 text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700'}`}
          >
            {tab.icon} {tab.label}
          </button>
        ))}
      </div>

      <div className="flex-1 overflow-auto p-4 sm:p-6 lg:p-8 relative">
        {activeTab === 'objetivos' && <TabObjetivos campaign={campaign} isReadOnly={true} />}
        {activeTab === 'estrategias' && <TabEstrategias campaign={campaign} isReadOnly={true} />}
        {activeTab === 'deck' && <TabDeck campaign={campaign} updateCampaign={updateSharedCampaign} isReadOnly={true} isClient={true} onNavigateToDoc={() => setActiveTab('estrategias')} />}
        {activeTab === 'calendario' && <TabCalendario campaign={campaign} />}
        {activeTab === 'publicadas' && <TabPublicadas campaign={campaign} />}
        {activeTab === 'metricas' && <TabMetricas campaign={campaign} appData={mockAppDataForPrint} isReadOnly={true} />}
        
        {/* CRÉDITOS EN VISTA CLIENTE */}
        <div className="mt-16 pb-4 w-full text-center flex flex-col items-center justify-center gap-3">
           <p className="text-sm font-medium text-gray-500 dark:text-gray-400">
             Diseñado y desarrollado por <span className="font-black text-gray-900 dark:text-white">Francisco Joel</span>
           </p>
        </div>
      </div>
    </div>
  );
}

// ==========================================
// VISTAS 1 y 2: DASHBOARDS
// ==========================================
function ProjectsDashboard({ appData, setAppData, onSelectProject }) {
  const [newProjName, setNewProjName] = useState('');

  const addProject = (e) => {
    e.preventDefault();
    if (!newProjName.trim()) return;
    const newProj = { 
      id: Math.random().toString(), 
      name: newProjName, 
      type: 'Empresa',
      status: 'Activo', // Estado inicial
      briefUrl: '',
      identity: { mission: '', vision: '', values: '', voiceTone: '', targetAudience: '', colors: [] }, // Agregado targetAudience
      swot: { strengths: [], weaknesses: [], opportunities: [], threats: [] },
      campaigns: [] 
    };
    setAppData({ ...appData, projects: [...appData.projects, newProj] });
    setNewProjName('');
  };

  return (
    <div className="p-6 sm:p-10 max-w-7xl mx-auto w-full overflow-y-auto">
      <div className="mb-10">
        <h1 className="text-4xl font-black text-gray-900 dark:text-white mb-2">Mis Proyectos</h1>
        <p className="text-gray-500 dark:text-gray-400 text-lg">Gestiona todos tus clientes y marcas desde un solo lugar.</p>
      </div>
      
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white dark:bg-gray-900 rounded-2xl border border-dashed border-gray-300 dark:border-gray-700 p-6 flex flex-col justify-center items-center text-center transition-all hover:bg-gray-50 dark:hover:bg-gray-800 hover:border-emerald-400 group h-64">
          <div className="bg-emerald-50 dark:bg-emerald-900/30 p-4 rounded-full mb-4 group-hover:scale-110 transition-transform duration-300">
            <Plus className="w-8 h-8 text-emerald-600 dark:text-emerald-400" />
          </div>
          <form onSubmit={addProject} className="w-full flex flex-col gap-3">
            <input 
              type="text" placeholder="Nombre del proyecto..." 
              className="border-b-2 border-gray-200 dark:border-gray-700 focus:border-emerald-500 bg-transparent p-2 text-sm w-full outline-none text-center dark:text-white placeholder-gray-400"
              value={newProjName} onChange={(e) => setNewProjName(e.target.value)}
            />
            <button type="submit" className="bg-gray-900 dark:bg-emerald-600 text-white py-2 rounded-xl text-sm font-medium hover:bg-emerald-600 dark:hover:bg-emerald-500 transition-colors">Crear Proyecto</button>
          </form>
        </div>

        {appData.projects.map(proj => (
          <div key={proj.id} className="bg-white dark:bg-gray-900 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-800 p-6 flex flex-col hover:shadow-xl hover:-translate-y-1 transition-all cursor-pointer relative overflow-hidden group h-64" onClick={() => onSelectProject(proj)}>
            
            {/* Badge de Estado del Proyecto */}
            <div className="absolute top-4 left-4">
              <span className={`text-[10px] font-bold px-2 py-1 rounded-md uppercase tracking-wider
                ${proj.status === 'Activo' ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/50 dark:text-emerald-400' : 
                  proj.status === 'Pausado' ? 'bg-amber-100 text-amber-700 dark:bg-amber-900/50 dark:text-amber-400' : 
                  'bg-gray-100 text-gray-500 dark:bg-gray-800 dark:text-gray-400'}`}>
                {proj.status || 'Activo'}
              </span>
            </div>

            <div className="absolute top-0 right-0 p-4 opacity-0 group-hover:opacity-100 transition-opacity">
              <button onClick={(e) => { e.stopPropagation(); setAppData({ ...appData, projects: appData.projects.filter(p => p.id !== proj.id) }); }} className="bg-red-50 dark:bg-red-900/30 text-red-500 p-2 rounded-lg hover:bg-red-500 hover:text-white transition-colors">
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
            <div className="flex-1 flex flex-col justify-center items-center text-center mt-4">
               <div className="w-20 h-20 bg-gradient-to-br from-gray-100 to-gray-200 dark:from-gray-800 dark:to-gray-700 rounded-2xl flex items-center justify-center text-3xl font-black text-gray-400 dark:text-gray-500 mb-6 shadow-inner">
                 {proj.name.substring(0,2).toUpperCase()}
               </div>
               <h3 className="text-xl font-bold text-gray-800 dark:text-gray-100 mb-2">{proj.name}</h3>
               <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-50 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400 text-xs font-semibold">
                 <CalendarIcon className="w-3 h-3"/> {proj.campaigns?.length || 0} Campañas
               </span>
            </div>
          </div>
        ))}
      </div>

      {/* CRÉDITOS */}
      <div className="mt-16 pb-8 text-center flex flex-col items-center justify-center gap-3">
         <p className="text-sm font-medium text-gray-500 dark:text-gray-400">
           Diseñado y desarrollado por <span className="font-black text-gray-900 dark:text-white">Francisco Joel</span>
         </p>
         <a 
           href="https://www.instagram.com/byfjoel?igsh=MXNlbG1ibHA2ZnoxNw==" 
           target="_blank" 
           rel="noopener noreferrer" 
           className="inline-flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-purple-500 via-pink-500 to-orange-500 text-white rounded-full text-xs font-black tracking-widest hover:shadow-lg hover:shadow-pink-500/30 hover:-translate-y-0.5 transition-all"
         >
           <Instagram className="w-4 h-4"/> SÍGUEME EN INSTAGRAM
         </a>
      </div>
    </div>
  );
}

function ProjectWorkspace({ project, appData, setAppData, onBack, onSelectCampaign }) {
  const [activeTab, setActiveTab] = useState('campañas');
  const currentProject = appData.projects.find(p => p.id === project.id) || project;

  const updateProject = (updates) => {
    const updatedProjects = appData.projects.map(p => p.id === project.id ? { ...p, ...updates } : p);
    setAppData({ ...appData, projects: updatedProjects });
  };

  const tabs = [
    { id: 'campañas', label: 'Campañas', icon: <Briefcase className="w-4 h-4"/> },
    { id: 'perfil', label: 'Perfil e Identidad', icon: <UserSquare className="w-4 h-4"/> },
    { id: 'foda', label: 'Análisis FODA', icon: <Swords className="w-4 h-4"/> }
  ];

  return (
    <div className="flex flex-col h-full w-full bg-[#F8FAFC] dark:bg-gray-950 relative transition-colors">
       <div className="bg-white dark:bg-gray-900 px-6 py-5 border-b dark:border-gray-800 shadow-sm z-10 shrink-0">
         <button onClick={onBack} className="text-xs text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white mb-4 flex items-center gap-1 font-medium">
           <ChevronLeft className="w-4 h-4" /> Volver a Proyectos
         </button>
         <div className="flex items-center justify-between mb-6 gap-4">
           <div className="flex items-center gap-4">
              <div className="w-16 h-16 bg-gray-900 dark:bg-emerald-600 rounded-2xl flex items-center justify-center text-2xl font-black text-white shadow-lg shrink-0">
                 {currentProject.name.substring(0,2).toUpperCase()}
              </div>
              <div>
                 <span className="text-xs font-bold text-emerald-600 dark:text-emerald-400 uppercase tracking-widest bg-emerald-50 dark:bg-emerald-900/30 px-2 py-1 rounded-md mb-1 inline-block border border-emerald-100 dark:border-emerald-800">
                   {currentProject.type || 'Proyecto'}
                 </span>
                 <h1 className="text-3xl font-black text-gray-900 dark:text-white leading-none">{currentProject.name}</h1>
              </div>
           </div>
           
           {/* Selector de Estado del Proyecto */}
           <div>
              <select 
                value={currentProject.status || 'Activo'} 
                onChange={e => updateProject({ status: e.target.value })}
                className={`text-sm font-bold px-4 py-2 rounded-xl outline-none cursor-pointer border shadow-sm transition-colors
                  ${currentProject.status === 'Activo' ? 'bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-900/30 dark:text-emerald-400 dark:border-emerald-800' : 
                    currentProject.status === 'Pausado' ? 'bg-amber-50 text-amber-700 border-amber-200 dark:bg-amber-900/30 dark:text-amber-400 dark:border-amber-800' : 
                    'bg-gray-100 text-gray-600 border-gray-200 dark:bg-gray-800 dark:text-gray-400 dark:border-gray-700'}`}
              >
                <option value="Activo">🟢 Proyecto Activo</option>
                <option value="Pausado">🟡 Proyecto Pausado</option>
                <option value="Completado">⚪ Proyecto Completado</option>
              </select>
           </div>
         </div>
         <div className="flex gap-2 overflow-x-auto no-scrollbar pb-1">
            {tabs.map(tab => (
              <button 
                key={tab.id} 
                onClick={() => setActiveTab(tab.id)} 
                className={`flex items-center gap-2 px-5 py-2.5 rounded-full text-sm font-bold whitespace-nowrap transition-all border border-transparent
                  ${activeTab === tab.id ? 'bg-gray-900 dark:bg-emerald-600 text-white shadow-md' : 'bg-white dark:bg-gray-800 text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700 hover:border-gray-200 dark:hover:border-gray-600'}`}
              >
                {tab.icon} {tab.label}
              </button>
            ))}
         </div>
       </div>
       
       <div className="flex-1 overflow-auto p-4 sm:p-6 lg:p-8">
          {activeTab === 'campañas' && <TabCampañas currentProject={currentProject} updateProject={updateProject} onSelectCampaign={onSelectCampaign} />}
          {activeTab === 'perfil' && <TabPerfil currentProject={currentProject} updateProject={updateProject} />}
          {activeTab === 'foda' && <TabFODA currentProject={currentProject} updateProject={updateProject} />}
       </div>
    </div>
  );
}

// --- SUB-TABS DEL PROYECTO ---

function TabCampañas({ currentProject, updateProject, onSelectCampaign }) {
  const [newCampName, setNewCampName] = useState('');
  const [editingCampaign, setEditingCampaign] = useState(null);

  const addCampaign = (e) => {
    e.preventDefault();
    if (!newCampName.trim()) return;
    const newCamp = { id: Math.random().toString(), name: newCampName, description: '', objectives: [], documents: [], posts: [] };
    updateProject({ campaigns: [...(currentProject.campaigns||[]), newCamp] });
    setNewCampName('');
  };

  return (
    <div className="max-w-7xl mx-auto w-full">
      <div className="bg-white dark:bg-gray-900 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-800 p-3 mb-8 flex gap-4 items-center focus-within:ring-2 focus-within:ring-emerald-500 transition-all">
        <div className="bg-emerald-50 dark:bg-emerald-900/30 p-3 rounded-xl ml-2">
          <Plus className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
        </div>
        <form onSubmit={addCampaign} className="flex-1 flex gap-3 pr-2">
          <input 
            type="text" placeholder="Ej: Especial Día de Muertos..." 
            className="border-none outline-none p-2 flex-1 text-lg bg-transparent dark:text-white placeholder-gray-400"
            value={newCampName} onChange={(e) => setNewCampName(e.target.value)}
          />
          <button type="submit" className="bg-emerald-600 text-white px-8 py-3 rounded-xl font-bold hover:bg-emerald-700 transition-all shadow-md shadow-emerald-200 dark:shadow-none">Crear Campaña</button>
        </form>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {(currentProject.campaigns || []).map(camp => (
          <div key={camp.id} onClick={() => onSelectCampaign(camp)} className="bg-white dark:bg-gray-900 p-6 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-800 cursor-pointer hover:shadow-xl hover:-translate-y-1 transition-all group flex flex-col justify-between h-48 relative overflow-hidden">
            <div className="absolute top-0 right-0 p-3 opacity-0 group-hover:opacity-100 transition-opacity flex gap-2">
              <button onClick={(e) => { e.stopPropagation(); setEditingCampaign(camp); }} className="bg-blue-50 dark:bg-blue-900/30 text-blue-500 p-2 rounded-lg hover:bg-blue-500 hover:text-white transition-colors" title="Editar Campaña">
                <Edit2 className="w-4 h-4" />
              </button>
              <button onClick={(e) => { 
                e.stopPropagation(); 
                updateProject({ campaigns: currentProject.campaigns.filter(c => c.id !== camp.id) });
              }} className="bg-red-50 dark:bg-red-900/30 text-red-500 p-2 rounded-lg hover:bg-red-500 hover:text-white transition-colors" title="Eliminar Campaña">
                <Trash2 className="w-4 h-4" />
              </button>
            </div>

            <div>
              <div className="flex justify-between items-start mb-3 pr-16">
                 <h3 className="text-2xl font-bold text-gray-900 dark:text-gray-100 group-hover:text-emerald-600 dark:group-hover:text-emerald-400 transition-colors truncate">{camp.name}</h3>
                 <div className="bg-gray-50 dark:bg-gray-800 p-2 rounded-lg group-hover:bg-emerald-50 dark:group-hover:bg-emerald-900/50 transition-colors shrink-0">
                   <BarChart2 className="w-5 h-5 text-gray-400 group-hover:text-emerald-500" />
                 </div>
              </div>
              <p className="text-gray-500 dark:text-gray-400 text-sm line-clamp-2">{camp.description || 'Sin descripción configurada.'}</p>
            </div>
            <div className="flex gap-3 text-sm font-medium">
               <span className="flex items-center gap-1.5 bg-gray-50 dark:bg-gray-800 text-gray-600 dark:text-gray-300 px-3 py-1.5 rounded-lg"><FileText className="w-4 h-4 text-blue-500"/> {camp.documents?.length || 0} Docs</span>
               <span className="flex items-center gap-1.5 bg-gray-50 dark:bg-gray-800 text-gray-600 dark:text-gray-300 px-3 py-1.5 rounded-lg"><CalendarIcon className="w-4 h-4 text-purple-500"/> {camp.posts?.length || 0} Posts</span>
            </div>
          </div>
        ))}
        {(currentProject.campaigns || []).length === 0 && (
          <div className="col-span-full py-16 flex flex-col items-center justify-center text-gray-400 border-2 border-dashed border-gray-200 dark:border-gray-800 rounded-3xl">
             <Briefcase className="w-16 h-16 mb-4 text-gray-300 dark:text-gray-700"/>
             <p className="text-lg font-medium">No hay campañas en este proyecto aún.</p>
          </div>
        )}
      </div>

      {editingCampaign && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-gray-900/60 backdrop-blur-sm">
          <div className="bg-white dark:bg-gray-900 rounded-3xl shadow-2xl border border-gray-200 dark:border-gray-800 w-full max-w-md p-6 animate-in fade-in zoom-in duration-200">
             <div className="flex justify-between items-center mb-6">
               <h3 className="text-xl font-black text-gray-900 dark:text-white">Editar Campaña</h3>
               <button onClick={() => setEditingCampaign(null)} className="text-gray-400 hover:text-gray-900 dark:hover:text-white bg-gray-100 dark:bg-gray-800 p-1.5 rounded-full transition-colors"><X className="w-5 h-5"/></button>
             </div>
             <div className="space-y-4">
               <div>
                 <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">Nombre</label>
                 <input type="text" value={editingCampaign.name} onChange={e => setEditingCampaign({...editingCampaign, name: e.target.value})} className="w-full border border-gray-200 dark:border-gray-700 p-3 rounded-xl dark:bg-gray-800 dark:text-white focus:ring-2 focus:ring-emerald-500 outline-none" />
               </div>
               <div>
                 <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">Descripción</label>
                 <textarea value={editingCampaign.description || ''} onChange={e => setEditingCampaign({...editingCampaign, description: e.target.value})} rows="3" className="w-full border border-gray-200 dark:border-gray-700 p-3 rounded-xl dark:bg-gray-800 dark:text-white focus:ring-2 focus:ring-emerald-500 outline-none resize-none" placeholder="Añade una descripción a esta campaña..."></textarea>
               </div>
               <button onClick={() => {
                 updateProject({ campaigns: currentProject.campaigns.map(c => c.id === editingCampaign.id ? editingCampaign : c) });
                 setEditingCampaign(null);
               }} className="w-full bg-emerald-600 text-white py-3 rounded-xl font-bold hover:bg-emerald-700 transition-colors shadow-md mt-4">
                 Guardar Cambios
               </button>
             </div>
          </div>
        </div>
      )}
    </div>
  );
}

function TabPerfil({ currentProject, updateProject }) {
  const identity = currentProject.identity || { mission: '', vision: '', values: '', voiceTone: '', targetAudience: '', colors: [] };
  const [newColor, setNewColor] = useState('');

  const updateIdentity = (field, value) => {
    updateProject({ identity: { ...identity, [field]: value } });
  };

  const addColor = (e) => {
    e.preventDefault();
    if (/^#[0-9A-F]{6}$/i.test(newColor) && !identity.colors.includes(newColor)) {
      updateIdentity('colors', [...identity.colors, newColor]);
      setNewColor('');
    } else {
      alert("Introduce un código Hexadecimal válido (Ej: #FF0000)");
    }
  };

  const removeColor = (col) => {
    updateIdentity('colors', identity.colors.filter(c => c !== col));
  };

  return (
    <div className="max-w-5xl mx-auto w-full space-y-8 pb-10">
       
       <div className="bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800 rounded-3xl p-6 shadow-sm">
         <h3 className="text-lg font-black text-gray-900 dark:text-white mb-6 flex items-center gap-2">
           <Compass className="w-5 h-5 text-indigo-500"/> Información General
         </h3>
         <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div>
              <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">Tipo de Cliente</label>
              <select value={currentProject.type || 'Empresa'} onChange={e => updateProject({ type: e.target.value })} className="w-full border border-gray-200 dark:border-gray-700 p-3 rounded-xl bg-gray-50 dark:bg-gray-800 dark:text-white outline-none focus:ring-2 focus:ring-indigo-500 transition-all font-medium text-sm">
                <option value="Empresa">Empresa / Corporativo</option>
                <option value="Político">Candidato / Político</option>
                <option value="Gobierno">Institución de Gobierno</option>
                <option value="Figura Pública">Figura Pública / Artista</option>
                <option value="ONG">ONG / Asociación</option>
              </select>
            </div>
            <div className="md:col-span-2">
              <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">Enlace al Brief General (Drive, Notion, etc.)</label>
              <div className="flex gap-2">
                <input type="text" value={currentProject.briefUrl || ''} onChange={e => updateProject({ briefUrl: e.target.value })} placeholder="https://..." className="flex-1 border border-gray-200 dark:border-gray-700 p-3 rounded-xl bg-gray-50 dark:bg-gray-800 dark:text-white outline-none focus:ring-2 focus:ring-indigo-500 transition-all font-medium text-sm" />
                {currentProject.briefUrl && (
                  <a href={currentProject.briefUrl} target="_blank" rel="noopener noreferrer" className="bg-indigo-50 text-indigo-600 dark:bg-indigo-900/30 dark:text-indigo-400 p-3 rounded-xl hover:bg-indigo-100 dark:hover:bg-indigo-900/50 transition-colors flex items-center justify-center" title="Abrir Brief">
                    <ExternalLink className="w-5 h-5"/>
                  </a>
                )}
              </div>
            </div>
            <div className="md:col-span-3 border-t border-gray-100 dark:border-gray-800 pt-6 mt-2">
              <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2 flex items-center gap-2"><Users className="w-4 h-4 text-indigo-500"/> Público Objetivo / Buyer Persona</label>
              <textarea value={identity.targetAudience || ''} onChange={e => updateIdentity('targetAudience', e.target.value)} rows="2" placeholder="¿A quién le estamos hablando? (Ej: Jóvenes de 18 a 35 años, clase media, preocupados por la seguridad...)" className="w-full border border-gray-200 dark:border-gray-700 p-3 rounded-xl bg-gray-50 dark:bg-gray-800 dark:text-white outline-none focus:ring-2 focus:ring-indigo-500 resize-none text-sm font-medium"></textarea>
            </div>
         </div>
       </div>

       <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
         <div className="lg:col-span-2 bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800 rounded-3xl p-6 shadow-sm flex flex-col gap-6">
            <h3 className="text-lg font-black text-gray-900 dark:text-white flex items-center gap-2">
              <BookOpen className="w-5 h-5 text-emerald-500"/> Plataforma Filosófica
            </h3>
            
            <div>
              <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">Misión / Propósito Principal</label>
              <textarea value={identity.mission} onChange={e => updateIdentity('mission', e.target.value)} rows="2" placeholder="¿Qué hacemos y para quién?" className="w-full border border-gray-200 dark:border-gray-700 p-3 rounded-xl bg-gray-50 dark:bg-gray-800 dark:text-white outline-none focus:ring-2 focus:ring-emerald-500 resize-none text-sm font-medium"></textarea>
            </div>
            <div>
              <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">Visión / Meta a Largo Plazo</label>
              <textarea value={identity.vision} onChange={e => updateIdentity('vision', e.target.value)} rows="2" placeholder="¿A dónde queremos llegar?" className="w-full border border-gray-200 dark:border-gray-700 p-3 rounded-xl bg-gray-50 dark:bg-gray-800 dark:text-white outline-none focus:ring-2 focus:ring-emerald-500 resize-none text-sm font-medium"></textarea>
            </div>
            <div>
              <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">Valores Fundamentales</label>
              <textarea value={identity.values} onChange={e => updateIdentity('values', e.target.value)} rows="2" placeholder="Ej: Honestidad, Innovación, Trabajo en equipo..." className="w-full border border-gray-200 dark:border-gray-700 p-3 rounded-xl bg-gray-50 dark:bg-gray-800 dark:text-white outline-none focus:ring-2 focus:ring-emerald-500 resize-none text-sm font-medium"></textarea>
            </div>
            <div>
              <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">Tono de Comunicación / Eje Discursivo</label>
              <input type="text" value={identity.voiceTone} onChange={e => updateIdentity('voiceTone', e.target.value)} placeholder="Ej: Cercano, empático, firme, institucional..." className="w-full border border-gray-200 dark:border-gray-700 p-3 rounded-xl bg-gray-50 dark:bg-gray-800 dark:text-white outline-none focus:ring-2 focus:ring-emerald-500 transition-all font-medium text-sm" />
            </div>
         </div>

         <div className="bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800 rounded-3xl p-6 shadow-sm">
            <h3 className="text-lg font-black text-gray-900 dark:text-white mb-6 flex items-center gap-2">
              <Palette className="w-5 h-5 text-pink-500"/> Colores de Marca
            </h3>
            <p className="text-xs text-gray-500 dark:text-gray-400 mb-6">Añade los códigos hexadecimales de la identidad visual de tu cliente o candidato.</p>
            
            <form onSubmit={addColor} className="flex gap-2 mb-6">
              <div className="relative flex-1">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 font-bold">#</span>
                <input 
                  type="text" 
                  value={newColor.replace('#','')} 
                  onChange={e => setNewColor('#' + e.target.value)} 
                  maxLength="6"
                  placeholder="FFFFFF" 
                  className="w-full border border-gray-200 dark:border-gray-700 p-3 pl-7 rounded-xl bg-gray-50 dark:bg-gray-800 dark:text-white outline-none focus:ring-2 focus:ring-pink-500 text-sm font-bold uppercase tracking-widest" 
                />
              </div>
              <button type="submit" className="bg-gray-900 dark:bg-pink-600 text-white p-3 rounded-xl hover:bg-gray-800 dark:hover:bg-pink-500 transition-colors"><Plus className="w-5 h-5"/></button>
            </form>

            <div className="flex flex-wrap gap-3">
               {identity.colors.length === 0 && <span className="text-sm text-gray-400">Sin colores definidos.</span>}
               {identity.colors.map(col => (
                 <div key={col} className="group relative flex items-center gap-2 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 p-1.5 pr-3 rounded-full shadow-sm">
                   <div className="w-6 h-6 rounded-full shadow-inner border border-gray-200/50" style={{ backgroundColor: col }}></div>
                   <span className="text-xs font-bold text-gray-600 dark:text-gray-300 uppercase">{col}</span>
                   <button onClick={() => removeColor(col)} className="absolute -top-1 -right-1 bg-red-500 text-white p-0.5 rounded-full opacity-0 group-hover:opacity-100 transition-opacity shadow-md"><X className="w-3 h-3"/></button>
                 </div>
               ))}
            </div>
         </div>
       </div>
    </div>
  );
}

function TabFODA({ currentProject, updateProject }) {
  const swot = currentProject.swot || { strengths: [], weaknesses: [], opportunities: [], threats: [] };

  const updateQuadrant = (type, newArray) => {
    updateProject({ swot: { ...swot, [type]: newArray } });
  };

  return (
    <div className="max-w-6xl mx-auto w-full space-y-6 pb-10">
      <div className="mb-4">
         <h2 className="text-2xl font-black text-gray-900 dark:text-white flex items-center gap-3">
           <div className="bg-amber-100 dark:bg-amber-900/30 p-2 rounded-xl text-amber-600 dark:text-amber-400"><Target className="w-6 h-6"/></div>
           Análisis de Contexto (FODA)
         </h2>
         <p className="text-gray-500 dark:text-gray-400 mt-2 font-medium">Evalúa la situación actual para definir estrategias precisas de comunicación.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <FodaQuadrant title="Fortalezas" subtitle="Atributos positivos internos" type="strengths" items={swot.strengths} updateItems={(arr) => updateQuadrant('strengths', arr)} color="text-emerald-700 dark:text-emerald-400" bg="bg-emerald-50 dark:bg-emerald-900/10" border="border-emerald-200 dark:border-emerald-800/50" />
        <FodaQuadrant title="Oportunidades" subtitle="Factores externos a favor" type="opportunities" items={swot.opportunities} updateItems={(arr) => updateQuadrant('opportunities', arr)} color="text-blue-700 dark:text-blue-400" bg="bg-blue-50 dark:bg-blue-900/10" border="border-blue-200 dark:border-blue-800/50" />
        <FodaQuadrant title="Debilidades" subtitle="Carencias o riesgos internos" type="weaknesses" items={swot.weaknesses} updateItems={(arr) => updateQuadrant('weaknesses', arr)} color="text-amber-700 dark:text-amber-400" bg="bg-amber-50 dark:bg-amber-900/10" border="border-amber-200 dark:border-amber-800/50" />
        <FodaQuadrant title="Amenazas" subtitle="Riesgos del entorno exterior" type="threats" items={swot.threats} updateItems={(arr) => updateQuadrant('threats', arr)} color="text-rose-700 dark:text-rose-400" bg="bg-rose-50 dark:bg-rose-900/10" border="border-rose-200 dark:border-rose-800/50" />
      </div>
    </div>
  );
}

function FodaQuadrant({ title, subtitle, items, updateItems, color, bg, border }) {
  const [newItem, setNewItem] = useState('');

  const handleAdd = (e) => {
    e.preventDefault();
    if (newItem.trim()) {
      updateItems([...items, newItem.trim()]);
      setNewItem('');
    }
  };

  const handleRemove = (idx) => {
    const arr = [...items];
    arr.splice(idx, 1);
    updateItems(arr);
  };

  return (
    <div className={`p-6 rounded-3xl border ${border} ${bg} shadow-sm flex flex-col h-full min-h-[300px]`}>
       <div className="mb-6">
         <h3 className={`text-xl font-black ${color}`}>{title}</h3>
         <span className="text-xs font-bold text-gray-500 uppercase tracking-widest">{subtitle}</span>
       </div>
       
       <div className="flex-1 space-y-2 overflow-y-auto mb-4">
         {items.length === 0 && <p className="text-sm text-gray-400 font-medium italic opacity-70">Aún no hay elementos añadidos.</p>}
         {items.map((item, idx) => (
           <div key={idx} className="flex justify-between items-start gap-2 bg-white dark:bg-gray-900 p-3 rounded-xl shadow-sm border border-gray-100 dark:border-gray-800 group">
             <span className="text-sm font-medium text-gray-800 dark:text-gray-200 leading-tight">{item}</span>
             <button onClick={() => handleRemove(idx)} className="text-gray-300 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-opacity shrink-0"><X className="w-4 h-4"/></button>
           </div>
         ))}
       </div>

       <form onSubmit={handleAdd} className="relative mt-auto">
         <input 
           type="text" 
           value={newItem} 
           onChange={e => setNewItem(e.target.value)} 
           placeholder={`Añadir a ${title.toLowerCase()}...`}
           className="w-full bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 p-3 pr-10 rounded-xl text-sm font-medium outline-none focus:ring-2 focus:ring-gray-300 dark:focus:ring-gray-600 dark:text-white shadow-sm"
         />
         <button type="submit" className={`absolute right-2 top-1/2 -translate-y-1/2 p-1.5 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors ${color}`}>
           <Plus className="w-4 h-4"/>
         </button>
       </form>
    </div>
  );
}

// ==========================================
// VISTA 3: WORKSPACE DE LA CAMPAÑA
// ==========================================
function CampaignWorkspace({ project, campaign, appData, setAppData, onBack }) {
  const [activeTab, setActiveTab] = useState('objetivos');
  const [targetDoc, setTargetDoc] = useState({ id: null, highlight: false });
  
  const [isShareModalOpen, setIsShareModalOpen] = useState(false);
  const [shareConfig, setShareConfig] = useState({
    objetivos: true, estrategias: true, deck: true, calendario: true, publicadas: true, metricas: false
  });
  const [shareLink, setShareLink] = useState('');
  const [generatedToken, setGeneratedToken] = useState(null);
  const [isPublishing, setIsPublishing] = useState(false);

  const currentProject = appData.projects.find(p => p.id === project.id);
  const currentCampaign = currentProject.campaigns.find(c => c.id === campaign.id);

  const updateCampaignData = (newData) => {
    const updatedProjects = appData.projects.map(p => {
      if (p.id !== project.id) return p;
      return { ...p, campaigns: p.campaigns.map(c => c.id === campaign.id ? { ...c, ...newData } : c) };
    });
    setAppData({ ...appData, projects: updatedProjects });
  };

  const navigateToDoc = (docId) => {
    setActiveTab('estrategias');
    setTargetDoc({ id: docId, highlight: true });
    setTimeout(() => setTargetDoc({ id: docId, highlight: false }), 2500);
  };

  const tabs = [
    { id: 'objetivos', label: 'Objetivos', icon: <Target className="w-4 h-4"/> },
    { id: 'estrategias', label: 'Estrategias', icon: <FileText className="w-4 h-4"/> },
    { id: 'deck', label: 'Deck Posts', icon: <Layout className="w-4 h-4"/> },
    { id: 'calendario', label: 'Calendario', icon: <CalendarIcon className="w-4 h-4"/> },
    { id: 'publicadas', label: 'Publicadas', icon: <CheckCircle className="w-4 h-4"/> },
    { id: 'metricas', label: 'Métricas', icon: <TrendingUp className="w-4 h-4"/> }
  ];

  const totalPosts = currentCampaign.posts?.length || 0;
  const publishedPosts = currentCampaign.posts?.filter(p => p.status === 'Publicado').length || 0;
  const pendingPosts = totalPosts - publishedPosts;

  const handleGenerateShareLink = async () => {
    if (!db) { alert("Conecta tu Firebase para compartir"); return; }
    setIsPublishing(true);
    try {
      const selectedTabs = Object.keys(shareConfig).filter(k => shareConfig[k]);
      const token = Math.random().toString(36).substr(2, 12);
      
      const shareDoc = doc(db, 'artifacts', appId, 'public', 'data', 'sharedCampaigns', token);
      await setDoc(shareDoc, {
        campaign: currentCampaign,
        visibleTabs: selectedTabs,
        agencyName: appData.profile.name,
        agencyLogo: appData.profile.logoUrl || '',
        createdAt: new Date().toISOString()
      });
      
      let baseUrl = window.location.href.split('#')[0];
      if (baseUrl.endsWith('/')) baseUrl = baseUrl.slice(0, -1);
      const newUrl = baseUrl + '#shared=' + token;
      
      setGeneratedToken(token);
      setShareLink(newUrl);
    } catch (error) {
      console.error("Error al compartir:", error);
      alert("Hubo un error al generar el enlace.");
    } finally {
      setIsPublishing(false);
    }
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(shareLink).then(() => {
        alert("¡Enlace copiado al portapapeles!");
    }).catch(() => {
        const textArea = document.createElement("textarea");
        textArea.value = shareLink;
        document.body.appendChild(textArea);
        textArea.select();
        document.execCommand("copy");
        document.body.removeChild(textArea);
        alert("¡Enlace copiado al portapapeles!");
    });
  };

  return (
    <div className="flex flex-col h-full w-full bg-[#F8FAFC] dark:bg-gray-950 relative transition-colors">
      <div className="bg-white dark:bg-gray-900 px-6 py-5 border-b dark:border-gray-800 shadow-sm z-10">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <button onClick={onBack} className="text-xs text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white mb-2 flex items-center gap-1 font-medium">
               <ChevronLeft className="w-4 h-4" /> Volver a {project.name}
            </button>
            <h2 className="text-3xl font-black text-gray-900 dark:text-white">
               {currentCampaign.name}
            </h2>
          </div>
          
          <div className="flex items-center gap-4 flex-wrap">
            <div className="bg-gray-50 dark:bg-gray-800 px-4 py-2 rounded-xl border border-gray-100 dark:border-gray-700 flex items-center gap-3">
               <div className="bg-amber-100 dark:bg-amber-900/30 p-2 rounded-lg text-amber-600 dark:text-amber-400"><Settings className="w-4 h-4" /></div>
               <div>
                 <p className="text-xs text-gray-500 dark:text-gray-400 font-bold uppercase tracking-wider">Pendientes</p>
                 <p className="text-xl font-black leading-none">{pendingPosts}</p>
               </div>
            </div>
            <div className="bg-gray-50 dark:bg-gray-800 px-4 py-2 rounded-xl border border-gray-100 dark:border-gray-700 flex items-center gap-3 hidden sm:flex">
               <div className="bg-emerald-100 dark:bg-emerald-900/30 p-2 rounded-lg text-emerald-600 dark:text-emerald-400"><CheckCircle className="w-4 h-4" /></div>
               <div>
                 <p className="text-xs text-gray-500 dark:text-gray-400 font-bold uppercase tracking-wider">Publicados</p>
                 <p className="text-xl font-black leading-none">{publishedPosts}</p>
               </div>
            </div>
            <div className="h-10 w-px bg-gray-200 dark:bg-gray-700 hidden md:block"></div>
            <button 
               onClick={() => setIsShareModalOpen(true)}
               className="bg-indigo-50 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-400 border border-indigo-200 dark:border-indigo-800 px-4 py-2 rounded-xl font-bold flex items-center gap-2 hover:bg-indigo-600 hover:text-white transition-all shadow-sm"
            >
               <Share2 className="w-4 h-4" /> Compartir Cliente
            </button>
          </div>
        </div>

        <div className="flex gap-2 mt-6 overflow-x-auto no-scrollbar pb-1">
          {tabs.map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-2 px-5 py-2.5 rounded-full text-sm font-bold whitespace-nowrap transition-all
                ${activeTab === tab.id 
                  ? 'bg-gray-900 dark:bg-emerald-600 text-white shadow-md' 
                  : 'bg-white dark:bg-gray-800 text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700 hover:text-gray-900 dark:hover:text-white border border-transparent hover:border-gray-200 dark:hover:border-gray-700'}`}
            >
              {tab.icon} {tab.label}
            </button>
          ))}
        </div>
      </div>

      <div className="flex-1 overflow-auto p-4 sm:p-6 lg:p-8">
        {activeTab === 'objetivos' && (
          <TabObjetivos campaign={currentCampaign} updateCampaign={updateCampaignData} />
        )}
        {activeTab === 'estrategias' && (
          <TabEstrategias campaign={currentCampaign} updateCampaign={updateCampaignData} targetDoc={targetDoc} />
        )}
        {activeTab === 'deck' && (
          <TabDeck campaign={currentCampaign} updateCampaign={updateCampaignData} onNavigateToDoc={navigateToDoc} />
        )}
        {activeTab === 'calendario' && (
          <TabCalendario campaign={currentCampaign} />
        )}
        {activeTab === 'publicadas' && (
          <TabPublicadas campaign={currentCampaign} />
        )}
        {activeTab === 'metricas' && (
          <TabMetricas campaign={currentCampaign} updateCampaign={updateCampaignData} appData={appData} />
        )}
      </div>

      {isShareModalOpen && (
        <div className="absolute inset-0 z-50 flex items-center justify-center p-4 bg-gray-900/60 backdrop-blur-sm">
          <div className="bg-white dark:bg-gray-900 rounded-3xl shadow-2xl border border-gray-200 dark:border-gray-800 w-full max-w-md overflow-hidden flex flex-col animate-in fade-in zoom-in duration-200">
             <div className="p-6 border-b dark:border-gray-800 flex justify-between items-center bg-gray-50 dark:bg-gray-800/50">
               <h3 className="text-xl font-black text-gray-900 dark:text-white flex items-center gap-2">
                 <Share2 className="w-5 h-5 text-indigo-500"/> Compartir Campaña
               </h3>
               <button onClick={() => setIsShareModalOpen(false)} className="text-gray-400 hover:text-gray-900 dark:hover:text-white bg-gray-200/50 dark:bg-gray-700 p-1 rounded-full"><X className="w-5 h-5"/></button>
             </div>
             
             <div className="p-6">
                <p className="text-sm text-gray-500 dark:text-gray-400 font-medium mb-4">
                  Genera un enlace de <strong>solo lectura</strong> con soporte de comentarios. Selecciona qué pestañas podrá ver tu cliente:
                </p>
                
                <div className="grid grid-cols-2 gap-3 mb-6 bg-gray-50 dark:bg-gray-800 p-4 rounded-xl border border-gray-100 dark:border-gray-700">
                   {Object.keys(shareConfig).map(key => (
                     <label key={key} className="flex items-center gap-2 cursor-pointer group">
                       <input 
                         type="checkbox" 
                         checked={shareConfig[key]}
                         onChange={(e) => setShareConfig({...shareConfig, [key]: e.target.checked})}
                         className="w-4 h-4 text-indigo-600 rounded border-gray-300 dark:border-gray-600 dark:bg-gray-700 focus:ring-indigo-500"
                       />
                       <span className="text-sm font-bold text-gray-700 dark:text-gray-300 capitalize group-hover:text-indigo-600 dark:group-hover:text-indigo-400">{key}</span>
                     </label>
                   ))}
                </div>

                {shareLink ? (
                  <div className="animate-in slide-in-from-bottom-4">
                    <label className="block text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-2">Enlace Generado</label>
                    <div className="flex items-center gap-2 mb-4">
                      <input type="text" readOnly value={shareLink} className="flex-1 border-2 border-emerald-100 dark:border-emerald-800 bg-emerald-50 dark:bg-emerald-900/20 text-emerald-800 dark:text-emerald-300 p-2.5 rounded-xl text-xs font-mono outline-none" />
                      <button onClick={copyToClipboard} className="bg-gray-900 dark:bg-gray-700 text-white p-2.5 rounded-xl hover:bg-gray-800 dark:hover:bg-gray-600 transition-colors" title="Copiar"><Copy className="w-4 h-4"/></button>
                    </div>
                    <button 
                      onClick={() => {
                        setIsShareModalOpen(false);
                        window.location.hash = 'shared=' + generatedToken;
                      }} 
                      className="w-full bg-emerald-600 text-white px-4 py-3 rounded-xl font-bold flex justify-center items-center gap-2 hover:bg-emerald-700 transition-colors shadow-md"
                    >
                      <ExternalLink className="w-4 h-4"/> Simular Vista de Cliente
                    </button>
                  </div>
                ) : (
                  <button 
                    onClick={handleGenerateShareLink} 
                    disabled={isPublishing}
                    className="w-full bg-indigo-600 text-white px-4 py-3 rounded-xl font-bold flex justify-center items-center gap-2 hover:bg-indigo-700 transition-colors shadow-md disabled:opacity-70 disabled:cursor-wait"
                  >
                    {isPublishing ? 'Generando...' : 'Generar Enlace'}
                  </button>
                )}
             </div>
          </div>
        </div>
      )}
    </div>
  );
}

// --- TAB OBJETIVOS SMART ---
function TabObjetivos({ campaign, updateCampaign, isReadOnly = false }) {
  const objectives = campaign.objectives || [];
  const [activeObjId, setActiveObjId] = useState(objectives[0]?.id || null);
  const activeObj = objectives.find(o => o.id === activeObjId);

  const addObjective = () => {
    if (isReadOnly) return;
    const newObj = {
      id: Math.random().toString(),
      title: 'Nuevo Objetivo', general: '', specific: '', measurable: '', achievable: '', relevant: '', timeBound: '', kpis: []
    };
    updateCampaign({ objectives: [...objectives, newObj] });
    setActiveObjId(newObj.id);
  };

  const updateActiveObj = (updates) => {
    if (isReadOnly) return;
    const updated = objectives.map(o => o.id === activeObjId ? { ...o, ...updates } : o);
    updateCampaign({ objectives: updated });
  };

  const addKPI = (e) => {
    if (isReadOnly) return;
    if (e.key === 'Enter' && e.target.value.trim() !== '') {
      updateActiveObj({ kpis: [...(activeObj.kpis || []), e.target.value.trim()] });
      e.target.value = '';
    }
  };

  const removeKPI = (idx) => {
    if (isReadOnly) return;
    const newKpis = [...(activeObj.kpis || [])];
    newKpis.splice(idx, 1);
    updateActiveObj({ kpis: newKpis });
  };

  return (
    <div className="flex flex-col md:flex-row gap-6 h-[calc(100vh-230px)] max-h-[800px] w-full max-w-7xl mx-auto">
      <div className="w-full md:w-72 bg-white dark:bg-gray-900 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-800 flex flex-col h-1/3 md:h-full overflow-hidden shrink-0">
        <div className="p-4 border-b dark:border-gray-800 flex justify-between items-center bg-gray-50/50 dark:bg-gray-800/50">
          <span className="font-bold text-xs uppercase text-gray-500 dark:text-gray-400 tracking-widest">Mis Objetivos</span>
          {!isReadOnly && (
            <button onClick={addObjective} className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 text-gray-700 dark:text-gray-300 p-1.5 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors shadow-sm">
              <Plus className="w-4 h-4" />
            </button>
          )}
        </div>
        <div className="overflow-y-auto flex-1 p-3 space-y-1">
          {objectives.length === 0 && <div className="text-center p-4 text-sm text-gray-400">No hay objetivos definidos.</div>}
          {objectives.map(obj => (
            <button
              key={obj.id}
              onClick={() => setActiveObjId(obj.id)}
              className={`w-full text-left px-3 py-3 text-sm rounded-xl flex items-center gap-3 transition-all truncate border
                ${activeObjId === obj.id 
                  ? 'bg-gray-900 dark:bg-emerald-600 text-white border-transparent font-medium shadow-md' 
                  : 'bg-white dark:bg-gray-900 text-gray-600 dark:text-gray-400 border-transparent hover:bg-gray-50 dark:hover:bg-gray-800'}`}
            >
              <Target className={`w-4 h-4 shrink-0 ${activeObjId === obj.id ? 'text-gray-300 dark:text-white' : 'text-gray-400'}`} />
              <span className="truncate">{obj.title}</span>
            </button>
          ))}
        </div>
      </div>

      <div className="flex-1 bg-white dark:bg-gray-900 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-800 flex flex-col h-full overflow-hidden transition-all duration-500">
        {activeObj ? (
          <div className="flex flex-col h-full">
            <div className="p-6 border-b border-gray-100 dark:border-gray-800 bg-white dark:bg-gray-900 shrink-0">
              {isReadOnly ? (
                <h3 className="text-3xl font-black text-gray-900 dark:text-white">{activeObj.title}</h3>
              ) : (
                <input
                  type="text"
                  value={activeObj.title}
                  onChange={(e) => updateActiveObj({ title: e.target.value })}
                  className="w-full text-3xl font-black border-none focus:ring-0 outline-none text-gray-900 dark:text-white bg-transparent placeholder-gray-300 dark:placeholder-gray-600"
                  placeholder="Título del Objetivo..."
                />
              )}
            </div>
            
            <div className="p-6 overflow-y-auto space-y-6 flex-1 bg-[#F8FAFC] dark:bg-gray-950">
               <div className="bg-white dark:bg-gray-900 p-5 rounded-2xl border border-gray-100 dark:border-gray-800 shadow-sm">
                 <label className="block text-xs font-black text-gray-400 uppercase tracking-widest mb-3 flex items-center gap-2">
                   <Target className="w-4 h-4 text-indigo-500 dark:text-indigo-400"/> Objetivo General
                 </label>
                 {isReadOnly ? (
                    <p className="text-gray-800 dark:text-gray-200 text-lg font-medium leading-relaxed">{activeObj.general || 'No definido.'}</p>
                 ) : (
                    <textarea 
                       value={activeObj.general} 
                       onChange={(e) => updateActiveObj({ general: e.target.value })}
                       placeholder="Describe el objetivo a grandes rasgos..."
                       className="w-full border-none p-0 text-gray-800 dark:text-gray-200 text-lg font-medium outline-none resize-none focus:ring-0 bg-transparent placeholder-gray-300 dark:placeholder-gray-600"
                       rows="2"
                    />
                 )}
               </div>

               <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <SmartField letter="S" name="Específico" desc="¿Qué queremos lograr?" value={activeObj.specific} onChange={(v) => updateActiveObj({ specific: v })} color="text-blue-600 dark:text-blue-400" bg="bg-blue-50 dark:bg-blue-900/20" isReadOnly={isReadOnly} />
                  <SmartField letter="M" name="Medible" desc="¿Cómo mediremos el progreso?" value={activeObj.measurable} onChange={(v) => updateActiveObj({ measurable: v })} color="text-emerald-600 dark:text-emerald-400" bg="bg-emerald-50 dark:bg-emerald-900/20" isReadOnly={isReadOnly} />
                  <SmartField letter="A" name="Alcanzable" desc="¿Es realista con recursos?" value={activeObj.achievable} onChange={(v) => updateActiveObj({ achievable: v })} color="text-amber-600 dark:text-amber-400" bg="bg-amber-50 dark:bg-amber-900/20" isReadOnly={isReadOnly} />
                  <SmartField letter="R" name="Relevante" desc="¿Por qué importa?" value={activeObj.relevant} onChange={(v) => updateActiveObj({ relevant: v })} color="text-purple-600 dark:text-purple-400" bg="bg-purple-50 dark:bg-purple-900/20" isReadOnly={isReadOnly} />
               </div>
               <SmartField letter="T" name="Temporal" desc="¿Cuándo se debe lograr?" value={activeObj.timeBound} onChange={(v) => updateActiveObj({ timeBound: v })} color="text-rose-600 dark:text-rose-400" bg="bg-rose-50 dark:bg-rose-900/20" fullWidth isReadOnly={isReadOnly} />

               <div className="pt-6 border-t border-gray-200 dark:border-gray-800">
                 <label className="block text-xs font-black text-gray-400 uppercase tracking-widest mb-4 flex items-center gap-2">
                   <Flag className="w-4 h-4 text-indigo-500 dark:text-indigo-400"/> KPIs Resultantes
                 </label>
                 <div className="flex flex-wrap gap-2 mb-4">
                    {(activeObj.kpis || []).length === 0 && isReadOnly && <span className="text-gray-400 text-sm font-medium">Ningún KPI registrado.</span>}
                    {(activeObj.kpis || []).map((kpi, idx) => (
                      <span key={idx} className="bg-white dark:bg-gray-800 border border-indigo-100 dark:border-indigo-900 shadow-sm text-indigo-700 dark:text-indigo-300 px-3 py-1.5 rounded-xl text-sm font-bold flex items-center gap-2">
                         {kpi}
                         {!isReadOnly && (
                           <button onClick={() => removeKPI(idx)} className="hover:bg-indigo-100 dark:hover:bg-indigo-900/50 text-indigo-400 hover:text-indigo-800 dark:hover:text-indigo-200 rounded-full p-0.5 transition-colors"><X className="w-3 h-3"/></button>
                         )}
                      </span>
                    ))}
                 </div>
                 {!isReadOnly && (
                   <input 
                      type="text" 
                      placeholder="Escribe un KPI medible y presiona Enter..." 
                      onKeyDown={addKPI}
                      className="border border-gray-200 dark:border-gray-700 rounded-xl p-3 text-sm font-medium focus:ring-2 focus:ring-indigo-500 outline-none bg-white dark:bg-gray-800 dark:text-white w-full md:w-2/3 shadow-sm placeholder-gray-400"
                   />
                 )}
               </div>
            </div>
          </div>
        ) : (
          <div className="flex-1 flex flex-col items-center justify-center text-gray-400">
            <Target className="w-16 h-16 mb-4 text-gray-200 dark:text-gray-700" />
            <p className="text-lg font-medium">Ningún objetivo seleccionado.</p>
          </div>
        )}
      </div>
    </div>
  );
}

function SmartField({ letter, name, desc, value, onChange, color, bg, fullWidth, isReadOnly }) {
  return (
    <div className={`border border-gray-100 dark:border-gray-800 rounded-2xl p-4 bg-white dark:bg-gray-900 shadow-sm flex flex-col gap-3 transition-shadow focus-within:ring-2 focus-within:ring-gray-200 dark:focus-within:ring-gray-700 ${fullWidth ? 'md:col-span-2' : ''}`}>
       <div className="flex items-center gap-3">
         <div className={`w-10 h-10 rounded-xl flex items-center justify-center font-black text-xl ${bg} ${color}`}>
           {letter}
         </div>
         <div>
           <h4 className="font-bold text-gray-900 dark:text-white leading-tight">{name}</h4>
           <span className="text-[10px] text-gray-400 font-bold uppercase tracking-widest">{desc}</span>
         </div>
       </div>
       {isReadOnly ? (
          <p className="text-sm text-gray-700 dark:text-gray-300 font-medium px-1 bg-gray-50/50 dark:bg-gray-800/50 p-3 rounded-xl border border-transparent min-h-[48px]">{value || '---'}</p>
       ) : (
          <textarea
             value={value || ''}
             onChange={(e) => onChange(e.target.value)}
             className="w-full bg-gray-50 dark:bg-gray-800 border border-transparent focus:border-gray-200 dark:focus:border-gray-700 focus:bg-white dark:focus:bg-gray-900 rounded-xl p-3 text-sm text-gray-700 dark:text-gray-200 outline-none resize-none transition-all placeholder-gray-300 dark:placeholder-gray-600 font-medium"
             rows="2"
             placeholder="Escribe aquí..."
          />
       )}
    </div>
  );
}

// --- TAB 1: ESTRATEGIAS (Bloques Estilo Notion) ---
function TabEstrategias({ campaign, updateCampaign, targetDoc, isReadOnly = false }) {
  const docs = campaign.documents || [];
  const [activeDocId, setActiveDocId] = useState(docs[0]?.id || null);

  useEffect(() => {
    if (targetDoc?.id) setActiveDocId(targetDoc.id);
  }, [targetDoc?.id]);

  const activeDoc = docs.find(d => d.id === activeDocId);

  const addDocument = () => {
    if (isReadOnly) return;
    const newDoc = { 
      id: Math.random().toString(), 
      title: 'Nueva Estrategia', 
      blocks: [{ id: Math.random().toString(), type: 'p', content: '' }]
    };
    updateCampaign({ documents: [...docs, newDoc] });
    setActiveDocId(newDoc.id);
  };

  const updateActiveDoc = (updates) => {
    if (isReadOnly) return;
    const updatedDocs = docs.map(d => d.id === activeDocId ? { ...d, ...updates } : d);
    updateCampaign({ documents: updatedDocs });
  };

  const updateBlock = (blockId, newContent, newType, newCompleted) => {
    if (isReadOnly) return;
    const newBlocks = (activeDoc.blocks || []).map(b => {
      if (b.id === blockId) {
        return { ...b, content: newContent !== undefined ? newContent : b.content, type: newType || b.type, completed: newCompleted !== undefined ? newCompleted : b.completed };
      }
      return b;
    });
    updateActiveDoc({ blocks: newBlocks });
  };

  const handleBlockKeyDown = (e, index, blockId, content) => {
    if (isReadOnly) return;
    if (e.key === 'Enter') {
      e.preventDefault();
      const newBlocks = [...(activeDoc.blocks || [])];
      newBlocks.splice(index + 1, 0, { id: Math.random().toString(), type: 'p', content: '' });
      updateActiveDoc({ blocks: newBlocks });
      setTimeout(() => document.getElementById(`block-${newBlocks[index+1].id}`)?.focus(), 50);
    } else if (e.key === 'Backspace' && content === '' && index > 0) {
      e.preventDefault();
      const newBlocks = [...(activeDoc.blocks || [])];
      newBlocks.splice(index, 1);
      updateActiveDoc({ blocks: newBlocks });
      setTimeout(() => {
        const prevInput = document.getElementById(`block-${newBlocks[index-1].id}`);
        if(prevInput) { prevInput.focus(); prevInput.selectionStart = prevInput.value.length; }
      }, 50);
    }
  };

  const handleBlockInput = (e, blockId) => {
    if (isReadOnly) return;
    let val = e.target.value;
    let newType = undefined;

    if (val.startsWith('/h1 ')) { newType = 'h1'; val = val.substring(4); }
    else if (val.startsWith('/h2 ')) { newType = 'h2'; val = val.substring(4); }
    else if (val.startsWith('/ul ')) { newType = 'ul'; val = val.substring(4); }
    else if (val.startsWith('/task ')) { newType = 'task'; val = val.substring(6); }

    e.target.style.height = 'auto';
    e.target.style.height = e.target.scrollHeight + 'px';

    updateBlock(blockId, val, newType);
  };

  const isHighlighted = targetDoc?.id === activeDocId && targetDoc?.highlight;
  const blocks = activeDoc?.blocks || [];

  return (
    <div className="flex flex-col md:flex-row gap-6 h-[calc(100vh-230px)] max-h-[800px] w-full max-w-7xl mx-auto">
      <div className="w-full md:w-72 bg-white dark:bg-gray-900 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-800 flex flex-col h-1/3 md:h-full overflow-hidden shrink-0">
        <div className="p-4 border-b dark:border-gray-800 flex justify-between items-center bg-gray-50/50 dark:bg-gray-800/50">
          <span className="font-bold text-xs uppercase text-gray-500 dark:text-gray-400 tracking-widest">Documentos</span>
          {!isReadOnly && (
            <button onClick={addDocument} className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 text-gray-700 dark:text-gray-300 p-1.5 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors shadow-sm">
              <Plus className="w-4 h-4" />
            </button>
          )}
        </div>
        <div className="overflow-y-auto flex-1 p-3 space-y-1">
          {docs.length === 0 && <div className="text-center p-4 text-sm text-gray-400">No hay documentos.</div>}
          {docs.map(doc => {
            const isTarget = targetDoc?.id === doc.id && targetDoc?.highlight;
            return (
              <button
                key={doc.id}
                onClick={() => setActiveDocId(doc.id)}
                className={`w-full text-left px-3 py-3 text-sm rounded-xl flex items-center gap-3 transition-all truncate border
                  ${activeDocId === doc.id 
                    ? 'bg-gray-900 dark:bg-emerald-600 text-white border-transparent font-medium shadow-md' 
                    : 'bg-white dark:bg-gray-900 text-gray-600 dark:text-gray-400 border-transparent hover:bg-gray-50 dark:hover:bg-gray-800'}
                  ${isTarget ? 'ring-4 ring-emerald-400 ring-opacity-50 animate-pulse' : ''}`}
              >
                <FileText className={`w-4 h-4 shrink-0 ${activeDocId === doc.id ? 'text-gray-300 dark:text-white' : 'text-gray-400'}`} />
                <span className="truncate">{doc.title}</span>
              </button>
            )
          })}
        </div>
      </div>

      <div className={`flex-1 bg-white dark:bg-gray-900 rounded-2xl shadow-sm border flex flex-col h-full overflow-hidden transition-all duration-500
        ${isHighlighted ? 'border-emerald-400 shadow-emerald-100 dark:shadow-none' : 'border-gray-100 dark:border-gray-800'}`}>
        {activeDoc ? (
          <div className="flex flex-col h-full">
            <div className="p-8 pb-4 border-b border-gray-100 dark:border-gray-800 bg-white dark:bg-gray-900 shrink-0">
              {isReadOnly ? (
                <h3 className="text-4xl font-black text-gray-900 dark:text-white">{activeDoc.title}</h3>
              ) : (
                <input
                  type="text"
                  value={activeDoc.title}
                  onChange={(e) => updateActiveDoc({ title: e.target.value })}
                  className="w-full text-4xl font-black border-none focus:ring-0 outline-none text-gray-900 dark:text-white bg-transparent placeholder-gray-300 dark:placeholder-gray-600"
                  placeholder="Título del Documento..."
                />
              )}
            </div>
            
            <div className="flex-1 p-8 overflow-y-auto bg-white dark:bg-gray-900">
               {!isReadOnly && (
                 <p className="text-xs text-gray-400 dark:text-gray-500 mb-6 font-medium bg-gray-50 dark:bg-gray-800 p-3 rounded-xl border border-gray-100 dark:border-gray-700">
                   💡 <strong>Tip:</strong> Escribe <kbd className="bg-white dark:bg-gray-700 px-1 rounded shadow-sm border dark:border-gray-600">/h1</kbd>, <kbd className="bg-white dark:bg-gray-700 px-1 rounded shadow-sm border dark:border-gray-600">/h2</kbd>, <kbd className="bg-white dark:bg-gray-700 px-1 rounded shadow-sm border dark:border-gray-600">/ul</kbd> o <kbd className="bg-white dark:bg-gray-700 px-1 rounded shadow-sm border dark:border-gray-600">/task</kbd> al inicio de un bloque. Enter para nuevo bloque.
                 </p>
               )}

               <div className="space-y-1 max-w-3xl">
                 {blocks.length === 0 && !isReadOnly && (
                   <button onClick={() => updateActiveDoc({ blocks: [{id:'init', type:'p', content:''}] })} className="text-gray-400 text-sm hover:text-indigo-500">
                     Hacer clic para escribir...
                   </button>
                 )}
                 {blocks.map((block, idx) => (
                   <div key={block.id} className="group flex items-start gap-2 relative">
                      {!isReadOnly && (
                        <div className="w-6 opacity-0 group-hover:opacity-100 flex items-center justify-center pt-2 cursor-pointer text-gray-300 hover:text-gray-500 transition-opacity select-none" title="Bloque">
                          <GripVertical className="w-4 h-4" />
                        </div>
                      )}
                      
                      {block.type === 'ul' && <div className="pt-2 text-gray-800 dark:text-gray-200 px-1">•</div>}
                      {block.type === 'task' && (
                        <button 
                          onClick={() => updateBlock(block.id, undefined, undefined, !block.completed)} 
                          disabled={isReadOnly}
                          className={`pt-1.5 px-1 ${isReadOnly ? 'cursor-default' : 'cursor-pointer'}`}
                        >
                          {block.completed ? <CheckSquare className="w-5 h-5 text-emerald-500" /> : <div className="w-5 h-5 border-2 border-gray-300 dark:border-gray-600 rounded"></div>}
                        </button>
                      )}

                      {isReadOnly ? (
                         <div className={`w-full py-1.5 outline-none dark:text-gray-200
                           ${block.type === 'h1' ? 'text-3xl font-black mt-4 mb-2 text-gray-900 dark:text-white' : ''}
                           ${block.type === 'h2' ? 'text-xl font-bold mt-3 mb-1 text-gray-800 dark:text-gray-100' : ''}
                           ${block.type === 'p' ? 'text-base font-medium text-gray-600 dark:text-gray-300' : ''}
                           ${block.type === 'task' && block.completed ? 'line-through text-gray-400 dark:text-gray-500' : ''}
                           ${block.type === 'ul' ? 'text-base font-medium' : ''}
                         `}>
                           {block.content || <span className="text-transparent select-none">.</span>}
                         </div>
                      ) : (
                        <textarea
                          id={`block-${block.id}`}
                          value={block.content}
                          onChange={(e) => handleBlockInput(e, block.id)}
                          onKeyDown={(e) => handleBlockKeyDown(e, idx, block.id, block.content)}
                          placeholder={block.type === 'h1' ? 'Título Principal' : block.type === 'h2' ? 'Subtítulo' : "Escribe algo..."}
                          className={`w-full resize-none overflow-hidden outline-none bg-transparent py-1.5 transition-colors placeholder-gray-300 dark:placeholder-gray-700
                            ${block.type === 'h1' ? 'text-3xl font-black mt-4 mb-2 text-gray-900 dark:text-white' : ''}
                            ${block.type === 'h2' ? 'text-xl font-bold mt-3 mb-1 text-gray-800 dark:text-gray-100' : ''}
                            ${block.type === 'p' ? 'text-base font-medium text-gray-600 dark:text-gray-300' : ''}
                            ${block.type === 'task' ? 'text-base font-medium' : ''}
                            ${block.type === 'task' && block.completed ? 'line-through text-gray-400 dark:text-gray-500' : ''}
                            ${block.type === 'ul' ? 'text-base font-medium' : ''}
                          `}
                          rows={1}
                        />
                      )}
                   </div>
                 ))}
               </div>
            </div>
          </div>
        ) : (
          <div className="flex-1 flex flex-col items-center justify-center text-gray-400 dark:text-gray-600">
            <FileText className="w-16 h-16 mb-4 text-gray-200 dark:text-gray-700" />
            <p className="text-lg font-medium">Ningún documento seleccionado.</p>
          </div>
        )}
      </div>
    </div>
  );
}

// --- TAB 2: DECK DE PUBLICACIONES (CON KANBAN Y COMENTARIOS) ---
function TabDeck({ campaign, updateCampaign, onNavigateToDoc, isReadOnly = false, isClient = false }) {
  const posts = campaign.posts || [];
  const docs = campaign.documents || [];
  
  const [newPost, setNewPost] = useState({ network: 'FB', type: 'Imagen', date: '', title: '', status: 'Pendiente', docRef: '', assetUrl: '' });
  const [editingId, setEditingId] = useState(null);
  const [viewMode, setViewMode] = useState('table'); 
  const [activeCommentPost, setActiveCommentPost] = useState(null); 
  const [newComment, setNewComment] = useState('');
  const [errorMsg, setErrorMsg] = useState('');

  const todayStr = new Date().toISOString().split('T')[0];
  const isUrgent = (date, status) => date === todayStr && status === 'Pendiente';

  const handleSavePost = () => {
    if (isReadOnly) return;
    if (!newPost.title || !newPost.date) {
      setErrorMsg("Falta título o fecha");
      setTimeout(() => setErrorMsg(''), 3000);
      return;
    }
    
    if (editingId) {
      const updated = posts.map(p => p.id === editingId ? { ...p, ...newPost } : p);
      updateCampaign({ posts: updated });
      setEditingId(null);
    } else {
      updateCampaign({ posts: [...posts, { ...newPost, id: Math.random().toString(), metrics: { likes: 0, comments: 0, shares: 0 }, comments: [] }] });
    }
    setNewPost({ network: 'FB', type: 'Imagen', date: '', title: '', status: 'Pendiente', docRef: '', assetUrl: '' });
    setErrorMsg('');
  };

  const startEdit = (post) => {
    if (isReadOnly) return;
    setNewPost(post);
    setEditingId(post.id);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const cancelEdit = () => {
    setNewPost({ network: 'FB', type: 'Imagen', date: '', title: '', status: 'Pendiente', docRef: '', assetUrl: '' });
    setEditingId(null);
  };

  const deletePost = (id) => {
    if (isReadOnly) return;
    updateCampaign({ posts: posts.filter(p => p.id !== id) });
  };
  
  const updatePostField = (id, field, value) => {
    if (isReadOnly) return;
    const updated = posts.map(p => p.id === id ? { ...p, [field]: value } : p);
    updateCampaign({ posts: updated });
  };

  const handleAddComment = () => {
    if (!newComment.trim()) return;
    const updated = posts.map(p => {
      if (p.id === activeCommentPost) {
        return { 
          ...p, 
          comments: [...(p.comments || []), { id: Math.random().toString(), author: isClient ? 'Cliente' : 'Agencia', text: newComment.trim(), date: new Date().toISOString().split('T')[0] }] 
        };
      }
      return p;
    });
    updateCampaign({ posts: updated }); 
    setNewComment('');
  };

  const handleDragStart = (e, postId) => {
    if (isReadOnly) return;
    e.dataTransfer.setData('postId', postId);
  };
  
  const handleDrop = (e, newStatus) => {
    if (isReadOnly) return;
    const postId = e.dataTransfer.getData('postId');
    updatePostField(postId, 'status', newStatus);
  };

  const networkColors = { 
    'FB': 'bg-[#1877F2]', 
    'IG': 'bg-gradient-to-tr from-[#FFDC80] via-[#F56040] to-[#833AB4]', 
    'TW': 'bg-black', 
    'TK': 'bg-gray-900', 
    'LI': 'bg-[#0A66C2]' 
  };

  return (
    <div className="max-w-[1400px] mx-auto flex flex-col gap-6 relative">
      <div className="flex justify-between items-end gap-4 mb-2">
        <div className="flex bg-gray-100 dark:bg-gray-800 p-1 rounded-xl w-max border border-gray-200 dark:border-gray-700 shadow-inner">
           <button onClick={() => setViewMode('table')} className={`px-4 py-2 rounded-lg text-sm font-bold flex items-center gap-2 transition-all ${viewMode === 'table' ? 'bg-white dark:bg-gray-900 text-indigo-600 dark:text-indigo-400 shadow-sm' : 'text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white'}`}>
             <Menu className="w-4 h-4"/> Tabla
           </button>
           <button onClick={() => setViewMode('kanban')} className={`px-4 py-2 rounded-lg text-sm font-bold flex items-center gap-2 transition-all ${viewMode === 'kanban' ? 'bg-white dark:bg-gray-900 text-indigo-600 dark:text-indigo-400 shadow-sm' : 'text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white'}`}>
             <Columns className="w-4 h-4"/> Kanban
           </button>
        </div>
      </div>

      {!isReadOnly && viewMode === 'table' && (
        <div className="bg-white dark:bg-gray-900 p-5 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-800 flex flex-wrap gap-4 items-end">
          <div>
            <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">Red</label>
            <select value={newPost.network} onChange={e=>setNewPost({...newPost, network: e.target.value})} className="border border-gray-200 dark:border-gray-700 p-2.5 rounded-xl text-sm font-medium bg-gray-50 dark:bg-gray-800 outline-none focus:ring-2 focus:ring-blue-500 dark:text-white">
              <option value="FB">Facebook</option>
              <option value="IG">Instagram</option>
              <option value="TW">X (Twitter)</option>
              <option value="TK">TikTok</option>
              <option value="LI">LinkedIn</option>
            </select>
          </div>
          <div className="flex-1 min-w-[200px]">
            <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">Título de la Publicación</label>
            <input type="text" placeholder="Ej: Reel detrás de cámaras..." value={newPost.title} onChange={e=>setNewPost({...newPost, title: e.target.value})} className="border border-gray-200 dark:border-gray-700 p-2.5 rounded-xl text-sm w-full bg-gray-50 dark:bg-gray-800 dark:text-white outline-none focus:ring-2 focus:ring-blue-500" />
          </div>
          <div>
            <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">Formato</label>
            <select value={newPost.type} onChange={e=>setNewPost({...newPost, type: e.target.value})} className="border border-gray-200 dark:border-gray-700 p-2.5 rounded-xl text-sm font-medium bg-gray-50 dark:bg-gray-800 outline-none focus:ring-2 focus:ring-blue-500 dark:text-white">
              <option value="Imagen">Imagen</option>
              <option value="Video">Video</option>
              <option value="Carrusel">Carrusel</option>
              <option value="Historia">Historia</option>
              <option value="Texto">Texto</option>
            </select>
          </div>
          <div className="w-[150px]">
            <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">Documento</label>
            <select value={newPost.docRef} onChange={e=>setNewPost({...newPost, docRef: e.target.value})} className="border border-gray-200 dark:border-gray-700 p-2.5 rounded-xl text-sm font-medium bg-gray-50 dark:bg-gray-800 outline-none focus:ring-2 focus:ring-blue-500 dark:text-white w-full truncate">
              <option value="">Ninguno</option>
              {docs.map(d => <option key={d.id} value={d.id}>{d.title}</option>)}
            </select>
          </div>
          <div>
            <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">Fecha Programada</label>
            <input type="date" value={newPost.date} onChange={e=>setNewPost({...newPost, date: e.target.value})} className="border border-gray-200 dark:border-gray-700 p-2.5 rounded-xl text-sm font-medium bg-gray-50 dark:bg-gray-800 outline-none focus:ring-2 focus:ring-blue-500 dark:text-white" />
          </div>
          <div className="flex gap-2">
            <button onClick={handleSavePost} className={`${editingId ? 'bg-emerald-600 hover:bg-emerald-700' : 'bg-gray-900 dark:bg-emerald-600 hover:bg-gray-800 dark:hover:bg-emerald-500'} text-white px-6 py-2.5 rounded-xl font-bold transition-colors flex items-center gap-2 h-[42px]`}>
              {editingId ? <Save className="w-4 h-4" /> : <Plus className="w-4 h-4" />} 
              {editingId ? 'Guardar' : 'Agregar'}
            </button>
            {editingId && (
              <button onClick={cancelEdit} className="bg-gray-100 text-gray-600 px-4 py-2.5 rounded-xl font-bold hover:bg-gray-200 transition-colors h-[42px]">
                Cancelar
              </button>
            )}
          </div>
          {errorMsg && <span className="text-red-500 text-sm font-medium flex items-center gap-1"><AlertCircle className="w-4 h-4"/>{errorMsg}</span>}
        </div>
      )}

      {viewMode === 'table' ? (
        <div className="bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800 rounded-2xl shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm text-left">
              <thead className="text-[10px] text-gray-500 dark:text-gray-400 uppercase bg-gray-50 dark:bg-gray-800 font-black tracking-wider border-b border-gray-100 dark:border-gray-700">
                <tr>
                  <th className="px-5 py-4 w-12 text-center">Red</th>
                  <th className="px-5 py-4">Post & Fecha</th>
                  <th className="px-5 py-4 text-center">Docs/Links</th>
                  <th className="px-5 py-4 text-center">Estado</th>
                  <th className="px-5 py-4 text-center">Revisión</th>
                  {!isReadOnly && <th className="px-5 py-4 text-center">Acciones</th>}
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 dark:divide-gray-800">
                {posts.map(post => {
                  const urgent = isUrgent(post.date, post.status);
                  return (
                    <tr key={post.id} className="hover:bg-gray-50/50 dark:hover:bg-gray-800/50 transition-colors relative">
                      <td className="px-5 py-4 text-center">
                        <div className={`w-8 h-8 mx-auto rounded-lg flex items-center justify-center font-bold text-[10px] text-white shadow-sm ${networkColors[post.network] || 'bg-gray-500'}`}>
                          {post.network}
                        </div>
                      </td>
                      <td className="px-5 py-4 relative">
                        <div className="flex items-center gap-2">
                           <p className={`font-bold text-base ${urgent ? 'text-rose-600 dark:text-rose-400' : 'text-gray-900 dark:text-white'}`}>{post.title}</p>
                           {urgent && <span className="flex h-3 w-3 relative"><span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-rose-400 opacity-75"></span><span className="relative inline-flex rounded-full h-3 w-3 bg-rose-500"></span></span>}
                        </div>
                        <p className="text-gray-500 dark:text-gray-400 text-xs font-medium flex items-center gap-1 mt-1">
                          <CalendarIcon className="w-3 h-3"/>{post.date} • {post.type}
                        </p>
                      </td>
                      <td className="px-5 py-4 text-center">
                        <div className="flex items-center justify-center gap-2">
                          {post.docRef && (
                            <button onClick={() => onNavigateToDoc && onNavigateToDoc(post.docRef)} title="Abrir Documento Enlazado" className="text-blue-500 hover:text-blue-700 transition-colors bg-blue-50 dark:bg-blue-900/30 p-1.5 rounded-lg flex items-center gap-1">
                               <FileText className="w-4 h-4"/>
                            </button>
                          )}
                          {post.assetUrl && <span title="Tiene asset visual" className="text-pink-500 bg-pink-50 dark:bg-pink-900/30 p-1.5 rounded-lg"><ImageIcon className="w-4 h-4"/></span>}
                        </div>
                      </td>
                      <td className="px-5 py-4 text-center">
                        {isReadOnly ? (
                          <span className={`text-[11px] rounded-full px-3 py-1 font-bold inline-block ${post.status === 'Pendiente' ? 'bg-amber-50 text-amber-700' : post.status === 'En Revisión' ? 'bg-blue-50 text-blue-700' : 'bg-emerald-50 text-emerald-700'}`}>
                            {post.status}
                          </span>
                        ) : (
                          <select 
                            value={post.status} 
                            onChange={(e) => updatePostField(post.id, 'status', e.target.value)} 
                            className="text-xs rounded-full px-3 py-1.5 font-bold outline-none cursor-pointer bg-gray-50 dark:bg-gray-800 dark:text-gray-200 border border-gray-200 dark:border-gray-700"
                          >
                            <option value="Pendiente">Pendiente</option>
                            <option value="En Revisión">En Revisión</option>
                            <option value="Publicado">Publicado</option>
                          </select>
                        )}
                      </td>
                      <td className="px-5 py-4 text-center">
                        <button 
                          onClick={() => setActiveCommentPost(post.id)} 
                          className="relative p-2 text-gray-400 hover:text-indigo-600 bg-gray-50 dark:bg-gray-800 rounded-xl hover:bg-indigo-50 dark:hover:bg-indigo-900/50 transition-all"
                        >
                          <MessageSquare className="w-5 h-5" />
                          {(post.comments?.length || 0) > 0 && (
                            <span className="absolute -top-1 -right-1 bg-rose-500 text-white text-[9px] font-black w-4 h-4 rounded-full flex items-center justify-center border-2 border-white dark:border-gray-900">
                              {post.comments.length}
                            </span>
                          )}
                        </button>
                      </td>
                      {!isReadOnly && (
                        <td className="px-5 py-4 text-center">
                          <div className="flex justify-center items-center gap-1">
                            <button 
                              onClick={() => startEdit(post)} 
                              className="text-gray-400 hover:text-blue-600 p-2 rounded-lg hover:bg-blue-50 dark:hover:bg-blue-900/50 transition-colors" 
                              title="Editar post"
                            >
                              <Edit2 className="w-4 h-4" />
                            </button>
                            <button 
                              onClick={() => deletePost(post.id)} 
                              className="text-gray-400 hover:text-red-500 p-2 rounded-lg hover:bg-red-50 dark:hover:bg-red-900/50 transition-colors" 
                              title="Eliminar post"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        </td>
                      )}
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
        </div>
      ) : (
        <div className="flex gap-6 overflow-x-auto pb-4 items-start">
          {/* KANBAN BOARD */}
          {['Pendiente', 'En Revisión', 'Publicado'].map(col => (
            <div 
              key={col} 
              onDragOver={e => e.preventDefault()} 
              onDrop={e => handleDrop(e, col)}
              className="flex-1 min-w-[300px] bg-gray-100 dark:bg-gray-800/50 rounded-2xl p-4 border border-gray-200 dark:border-gray-700 flex flex-col gap-4 min-h-[500px]"
            >
              <div className="flex items-center justify-between mb-2 px-1">
                 <h4 className="font-black text-sm text-gray-600 dark:text-gray-400 uppercase tracking-widest">{col}</h4>
                 <span className="bg-gray-200 dark:bg-gray-700 text-gray-600 dark:text-gray-300 text-xs font-bold px-2 py-0.5 rounded-full">
                   {posts.filter(p => p.status === col).length}
                 </span>
              </div>
              
              {posts.filter(p => p.status === col).map(post => {
                const urgent = isUrgent(post.date, post.status);
                return (
                  <div 
                    key={post.id} 
                    draggable={!isReadOnly} 
                    onDragStart={(e) => handleDragStart(e, post.id)}
                    className={`bg-white dark:bg-gray-900 p-4 rounded-xl shadow-sm border transition-all group relative
                      ${urgent ? 'border-rose-500 shadow-rose-100' : 'border-gray-100 dark:border-gray-800'}
                      ${isReadOnly ? 'cursor-default' : 'cursor-grab active:cursor-grabbing hover:shadow-md'}`}
                  >
                     {urgent && (
                        <div className="absolute -top-2 -right-2 bg-rose-500 text-white text-[9px] font-black px-2 py-1 rounded-full shadow-sm animate-pulse">
                          ¡PARA HOY!
                        </div>
                     )}
                     <div className="flex justify-between items-start mb-3">
                       <span className={`text-[10px] text-white font-black px-2 py-0.5 rounded shadow-sm ${networkColors[post.network] || 'bg-gray-500'}`}>
                         {post.network}
                       </span>
                       {!isReadOnly && <GripVertical className="w-4 h-4 text-gray-300 opacity-0 group-hover:opacity-100" />}
                     </div>
                     <h5 className="font-bold text-gray-900 dark:text-white leading-tight mb-2">{post.title}</h5>
                     <div className="flex justify-between items-end mt-4 pt-3 border-t border-gray-100 dark:border-gray-800">
                       <div className="flex items-center gap-2">
                         <span className={`text-xs font-medium flex items-center gap-1 ${urgent ? 'text-rose-600 dark:text-rose-400' : 'text-gray-400'}`}>
                           <CalendarIcon className="w-3 h-3"/> {post.date.split('-').slice(1).join('/')}
                         </span>
                         {post.docRef && (
                           <button onClick={() => onNavigateToDoc && onNavigateToDoc(post.docRef)} className="text-blue-500 hover:text-blue-700 bg-blue-50 dark:bg-blue-900/30 p-1 rounded transition-colors" title="Abrir Documento">
                             <FileText className="w-3 h-3" />
                           </button>
                         )}
                       </div>
                       <button 
                         onClick={() => setActiveCommentPost(post.id)} 
                         className="flex items-center gap-1 text-xs font-bold text-gray-400 hover:text-indigo-600"
                       >
                         <MessageSquare className="w-3 h-3" /> {post.comments?.length || 0}
                       </button>
                     </div>
                  </div>
                )
              })}
            </div>
          ))}
        </div>
      )}

      {/* MODAL DE COMENTARIOS */}
      {activeCommentPost && (
        <div className="absolute inset-0 z-40 flex items-center justify-center p-4 bg-gray-900/60 backdrop-blur-sm">
          <div className="bg-white dark:bg-gray-900 rounded-3xl shadow-2xl border border-gray-200 dark:border-gray-800 w-full max-w-lg h-[600px] flex flex-col animate-in fade-in zoom-in duration-200">
             {(() => {
               const p = posts.find(x => x.id === activeCommentPost);
               if (!p) return null;
               return (
                 <>
                   <div className="p-6 border-b dark:border-gray-800 flex justify-between items-center bg-gray-50 dark:bg-gray-800/50 shrink-0">
                     <div>
                       <h3 className="text-xl font-black text-gray-900 dark:text-white flex items-center gap-2 leading-tight">
                         Feedback y Revisión
                       </h3>
                       <p className="text-sm text-gray-500 dark:text-gray-400 font-medium mt-1">
                         Post: <span className="font-bold text-gray-800 dark:text-gray-200">{p.title}</span>
                       </p>
                     </div>
                     <button 
                       onClick={() => setActiveCommentPost(null)} 
                       className="text-gray-400 hover:text-gray-900 dark:hover:text-white bg-gray-200/50 dark:bg-gray-700 p-1 rounded-full"
                     >
                       <X className="w-5 h-5"/>
                     </button>
                   </div>
                   
                   <div className="flex-1 overflow-y-auto p-6 bg-[#F8FAFC] dark:bg-gray-950 space-y-4">
                     {(p.comments || []).length === 0 && (
                       <p className="text-center text-gray-400 text-sm mt-10">No hay comentarios. Sé el primero.</p>
                     )}
                     {(p.comments || []).map(c => (
                       <div 
                         key={c.id} 
                         className={`flex flex-col max-w-[85%] ${c.author === 'Cliente' ? 'self-start items-start' : 'self-end items-end ml-auto'}`}
                       >
                         <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1 mx-1">
                           {c.author} • {c.date}
                         </span>
                         <div className={`p-4 rounded-2xl text-sm font-medium shadow-sm 
                           ${c.author === 'Cliente' 
                             ? 'bg-white dark:bg-gray-800 text-gray-800 dark:text-gray-200 rounded-tl-none border border-gray-100 dark:border-gray-700' 
                             : 'bg-indigo-600 text-white rounded-tr-none'}`}
                         >
                           {c.text}
                         </div>
                       </div>
                     ))}
                   </div>

                   <div className="p-4 border-t dark:border-gray-800 bg-white dark:bg-gray-900 shrink-0 flex gap-2">
                     <input 
                       type="text" 
                       value={newComment}
                       onChange={(e) => setNewComment(e.target.value)}
                       onKeyDown={(e) => e.key === 'Enter' && handleAddComment()}
                       placeholder="Escribe un comentario o solicitud de cambio..." 
                       className="flex-1 border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 dark:text-white p-3 rounded-xl text-sm outline-none focus:ring-2 focus:ring-indigo-500 transition-all"
                     />
                     <button 
                       onClick={handleAddComment} 
                       className="bg-indigo-600 text-white p-3 rounded-xl font-bold hover:bg-indigo-700 transition-colors shadow-sm"
                     >
                       Enviar
                     </button>
                   </div>
                 </>
               )
             })()}
          </div>
        </div>
      )}
    </div>
  );
}

// --- TAB 3: CALENDARIO ---
function TabCalendario({ campaign }) {
  const posts = campaign.posts || [];
  const today = new Date();
  const [currentDate, setCurrentDate] = useState(new Date(today.getFullYear(), today.getMonth(), 1));

  const todayStr = new Date().toISOString().split('T')[0];
  const isUrgent = (date, status) => date === todayStr && status === 'Pendiente';

  const daysInMonth = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0).getDate();
  const firstDayIndex = currentDate.getDay();
  
  const prevMonth = () => setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1));
  const nextMonth = () => setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1));
  const goToday = () => setCurrentDate(new Date(today.getFullYear(), today.getMonth(), 1));

  const monthNames = ["Enero", "Febrero", "Marzo", "Abril", "Mayo", "Junio", "Julio", "Agosto", "Septiembre", "Octubre", "Noviembre", "Diciembre"];
  const days = ["Dom", "Lun", "Mar", "Mié", "Jue", "Vie", "Sáb"];
  
  const calendarCells = Array.from({length: firstDayIndex}, () => null).concat(Array.from({length: daysInMonth}, (_, i) => i + 1));
  while (calendarCells.length % 7 !== 0) calendarCells.push(null);

  const getPostsForDay = (day) => {
    if (!day) return [];
    const dateStr = `${currentDate.getFullYear()}-${String(currentDate.getMonth() + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
    return posts.filter(p => p.date === dateStr);
  };
  
  const networkColors = { 
    'FB': 'bg-[#1877F2]', 
    'IG': 'bg-gradient-to-tr from-[#F56040] to-[#833AB4]', 
    'TW': 'bg-black', 
    'TK': 'bg-gray-900', 
    'LI': 'bg-[#0A66C2]' 
  };

  return (
    <div className="bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800 rounded-3xl shadow-sm p-6 sm:p-8 max-w-6xl mx-auto">
      <div className="flex flex-col sm:flex-row justify-between items-center mb-8 gap-4">
        <h2 className="text-3xl font-black text-gray-900 dark:text-white capitalize flex items-center gap-3">
          {monthNames[currentDate.getMonth()]} {currentDate.getFullYear()}
        </h2>
        <div className="flex items-center gap-3 bg-gray-50 dark:bg-gray-800 p-1.5 rounded-xl border border-gray-200 dark:border-gray-700">
           <button 
             onClick={prevMonth} 
             className="p-2 text-gray-600 dark:text-gray-400 hover:bg-white dark:hover:bg-gray-700 hover:shadow rounded-lg transition-all"
           >
             <ChevronLeft className="w-5 h-5"/>
           </button>
           <button 
             onClick={goToday} 
             className="px-4 py-1.5 text-sm font-bold text-gray-700 dark:text-gray-300 hover:text-emerald-600 dark:hover:text-emerald-400 transition-colors"
           >
             Hoy
           </button>
           <button 
             onClick={nextMonth} 
             className="p-2 text-gray-600 dark:text-gray-400 hover:bg-white dark:hover:bg-gray-700 hover:shadow rounded-lg transition-all"
           >
             <ChevronRight className="w-5 h-5"/>
           </button>
        </div>
      </div>
      
      <div className="grid grid-cols-7 border-t border-l border-gray-100 dark:border-gray-800 rounded-xl overflow-hidden shadow-sm">
        {days.map(d => (
          <div 
            key={d} 
            className="border-b border-r border-gray-100 dark:border-gray-800 p-3 text-center text-gray-400 font-bold text-xs uppercase tracking-wider bg-gray-50/50 dark:bg-gray-800/50"
          >
            {d}
          </div>
        ))}
        
        {calendarCells.map((day, idx) => {
          const isToday = day === today.getDate() && currentDate.getMonth() === today.getMonth() && currentDate.getFullYear() === today.getFullYear();
          return (
            <div 
              key={idx} 
              className={`border-b border-r border-gray-100 dark:border-gray-800 min-h-[120px] p-2 flex flex-col transition-colors 
                ${!day ? 'bg-gray-50/30 dark:bg-gray-900' : isToday ? 'bg-blue-50/30 dark:bg-blue-900/10' : 'bg-white dark:bg-gray-900 hover:bg-gray-50/50 dark:hover:bg-gray-800/50'}`}
            >
              {day && (
                <>
                  <div className="mb-2">
                    <span className={`w-7 h-7 flex items-center justify-center rounded-full text-sm font-bold 
                      ${isToday ? 'bg-blue-600 text-white shadow-md' : 'text-gray-500 dark:text-gray-400'}`}
                    >
                      {day}
                    </span>
                  </div>
                  <div className="flex flex-col gap-1.5 overflow-y-auto max-h-[80px] no-scrollbar flex-1">
                    {getPostsForDay(day).map(post => {
                      const urgent = isUrgent(post.date, post.status);
                      return (
                        <div 
                          key={post.id} 
                          className={`text-[10px] p-1.5 rounded-md text-white font-bold truncate flex items-center justify-between gap-1 shadow-sm ${networkColors[post.network] || 'bg-gray-600'}`} 
                          title={post.title}
                        >
                          <span className="truncate">{post.title}</span>
                          {urgent && <span className="flex h-2 w-2 relative shrink-0"><span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-rose-300 opacity-75"></span><span className="relative inline-flex rounded-full h-2 w-2 bg-rose-400"></span></span>}
                        </div>
                      )
                    })}
                  </div>
                </>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}

// --- TAB 4: PUBLICADAS (Repositorio) ---
function TabPublicadas({ campaign }) {
  const publishedPosts = (campaign.posts || []).filter(p => p.status === 'Publicado');
  
  return (
    <div className="bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800 rounded-3xl shadow-sm p-8 max-w-6xl mx-auto">
      <div className="flex flex-col mb-8">
        <h3 className="font-black text-2xl text-gray-900 dark:text-white flex items-center gap-3 mb-2">
          <div className="bg-emerald-100 dark:bg-emerald-900/30 p-2 rounded-xl">
            <LinkIcon className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
          </div> 
          Repositorio Final
        </h3>
      </div>
      
      <div className="overflow-hidden border border-gray-200 dark:border-gray-800 rounded-2xl">
        <table className="w-full text-sm text-left">
          <thead className="text-xs text-gray-500 dark:text-gray-400 uppercase bg-gray-50 dark:bg-gray-800 font-bold border-b border-gray-200 dark:border-gray-700">
            <tr>
              <th className="px-6 py-4">Fecha</th>
              <th className="px-6 py-4">Post</th>
              <th className="px-6 py-4">Enlace Vivo (URL)</th>
              <th className="px-6 py-4 text-center">Abrir</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100 dark:divide-gray-800">
            {publishedPosts.map(post => (
              <tr key={post.id} className="hover:bg-gray-50/50 dark:hover:bg-gray-800/50">
                <td className="px-6 py-4 text-gray-500 dark:text-gray-400 font-medium">
                  {post.date}
                </td>
                <td className="px-6 py-4">
                  <span className="font-bold text-gray-900 dark:text-gray-100">[{post.network}] {post.title}</span>
                </td>
                <td className="px-6 py-4">
                  <span className="text-blue-500 text-xs font-mono">{post.finalUrl || 'Sin URL'}</span>
                </td>
                <td className="px-6 py-4 text-center">
                  {post.finalUrl && (
                    <a 
                      href={post.finalUrl} 
                      target="_blank" 
                      rel="noopener noreferrer" 
                      className="inline-block p-2 bg-emerald-50 text-emerald-600 rounded-lg hover:bg-emerald-100 transition-colors"
                    >
                      <ExternalLink className="w-4 h-4"/>
                    </a>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

// --- TAB 5: MÉTRICAS (KPIs y Gráficas) CON EXPORTACIÓN ---
function TabMetricas({ campaign, updateCampaign, isReadOnly = false, appData }) {
  const publishedPosts = (campaign.posts || []).filter(p => p.status === 'Publicado');
  const [selectedNetwork, setSelectedNetwork] = useState('Todas');
  
  const availableNetworks = ['Todas', ...new Set(publishedPosts.map(p => p.network))];
  const filteredPosts = selectedNetwork === 'Todas' ? publishedPosts : publishedPosts.filter(p => p.network === selectedNetwork);

  const updateMetrics = (id, field, value) => {
    if (isReadOnly) return;
    const updated = (campaign.posts || []).map(p => {
      if (p.id === id) {
        return { 
          ...p, 
          metrics: { 
            ...(p.metrics || { likes: 0, comments: 0, shares: 0 }), 
            [field]: Number(value) 
          } 
        };
      }
      return p;
    });
    updateCampaign({ posts: updated });
  };

  const exportToCSV = () => {
    const header = "Fecha,Red,Tipo,Post,Likes,Comentarios,Compartidos,Interacciones\n";
    const rows = filteredPosts.map(p => {
      const metrics = p.metrics || {};
      const total = (metrics.likes || 0) + (metrics.comments || 0) + (metrics.shares || 0);
      const safeTitle = p.title ? p.title.replace(/"/g, '""') : '';
      return `${p.date},${p.network},${p.type},"${safeTitle}",${metrics.likes || 0},${metrics.comments || 0},${metrics.shares || 0},${total}`;
    }).join("\n");
    
    const blob = new Blob([header + rows], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement("a");
    const url = URL.createObjectURL(blob);
    link.setAttribute("href", url);
    link.setAttribute("download", `Metricas_${campaign.name}_${selectedNetwork}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handlePrintPDF = () => {
    const totalEng = totalLikes + totalComments + totalShares;
    const html = `
      <html>
        <head>
          <title>Reporte - ${campaign.name}</title>
          <style>
            body { font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; color: #1e293b; padding: 40px; max-width: 900px; margin: 0 auto; }
            .header { display: flex; justify-content: space-between; align-items: center; border-bottom: 2px solid #e2e8f0; padding-bottom: 20px; margin-bottom: 30px; }
            .logo { max-height: 60px; border-radius: 8px; }
            .title { margin: 0; color: #0f172a; font-size: 28px; }
            .subtitle { margin: 5px 0 0 0; color: #64748b; font-size: 16px; font-weight: normal; }
            .kpi-container { display: flex; gap: 20px; margin-bottom: 40px; }
            .kpi-card { padding: 20px; background: #f8fafc; border: 1px solid #e2e8f0; border-radius: 12px; flex: 1; text-align: center; }
            .kpi-title { font-size: 12px; text-transform: uppercase; color: #64748b; font-weight: bold; letter-spacing: 1px; margin-bottom: 10px; }
            .kpi-value { font-size: 32px; font-weight: 900; color: #4f46e5; margin: 0; }
            table { width: 100%; border-collapse: collapse; margin-top: 20px; font-size: 14px; }
            th, td { padding: 16px; text-align: left; border-bottom: 1px solid #e2e8f0; }
            th { background: #f1f5f9; color: #475569; font-weight: bold; text-transform: uppercase; font-size: 11px; letter-spacing: 1px;}
            tr:nth-child(even) { background-color: #f8fafc; }
            .network-badge { font-weight: bold; font-size: 10px; padding: 4px 8px; border-radius: 4px; background: #1e293b; color: white; margin-right: 8px; }
          </style>
        </head>
        <body>
          <div class="header">
            <div>
              <h1 class="title">Reporte de Rendimiento</h1>
              <h2 class="subtitle">Campaña: <strong>${campaign.name}</strong> | Filtro: ${selectedNetwork}</h2>
            </div>
            ${appData?.profile?.logoUrl ? `<img src="${appData.profile.logoUrl}" class="logo" />` : `<h2 style="color:#4f46e5; margin:0;">${appData?.profile?.name || 'Agencia'}</h2>`}
          </div>

          <div class="kpi-container">
             <div class="kpi-card"><div class="kpi-title">Interacciones Totales</div><div class="kpi-value">${totalEng.toLocaleString()}</div></div>
             <div class="kpi-card"><div class="kpi-title">Me Gusta</div><div class="kpi-value" style="color:#db2777;">${totalLikes.toLocaleString()}</div></div>
             <div class="kpi-card"><div class="kpi-title">Comentarios</div><div class="kpi-value" style="color:#0284c7;">${totalComments.toLocaleString()}</div></div>
             <div class="kpi-card"><div class="kpi-title">Compartidos</div><div class="kpi-value" style="color:#059669;">${totalShares.toLocaleString()}</div></div>
          </div>

          <h3 style="margin-bottom: 15px;">Desglose de Publicaciones</h3>
          <table>
            <thead>
              <tr><th>Post</th><th>Likes</th><th>Comentarios</th><th>Compartidos</th><th>Total</th></tr>
            </thead>
            <tbody>
              ${filteredPosts.map(p => {
                const m = p.metrics || {};
                const t = (m.likes||0) + (m.comments||0) + (m.shares||0);
                return `<tr>
                  <td><span class="network-badge">${p.network}</span> <strong>${p.title}</strong><br><small style="color:#64748b; margin-top:4px; display:inline-block;">${p.date}</small></td>
                  <td>${m.likes||0}</td><td>${m.comments||0}</td><td>${m.shares||0}</td>
                  <td><strong>${t}</strong></td>
                </tr>`
              }).join('')}
            </tbody>
          </table>
        </body>
      </html>
    `;
    
    const printWin = window.open('', '', 'width=900,height=800');
    if(printWin) {
      printWin.document.write(html);
      printWin.document.close();
      printWin.focus();
      setTimeout(() => {
        printWin.print();
        printWin.close();
      }, 500);
    } else {
      alert("Por favor, permite las ventanas emergentes (pop-ups) para generar el reporte.");
    }
  };

  const totalLikes = filteredPosts.reduce((sum, p) => sum + (p.metrics?.likes || 0), 0);
  const totalComments = filteredPosts.reduce((sum, p) => sum + (p.metrics?.comments || 0), 0);
  const totalShares = filteredPosts.reduce((sum, p) => sum + (p.metrics?.shares || 0), 0);
  const totalEngagement = totalLikes + totalComments + totalShares;
  const maxEngagement = Math.max(...filteredPosts.map(p => (p.metrics?.likes || 0) + (p.metrics?.comments || 0) + (p.metrics?.shares || 0)), 1);

  return (
    <div className="max-w-[1400px] mx-auto flex flex-col gap-8">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <h3 className="font-black text-2xl text-gray-900 dark:text-white flex items-center gap-3 mb-2">
            <div className="bg-indigo-100 dark:bg-indigo-900/30 p-2 rounded-xl">
              <TrendingUp className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />
            </div> 
            Rendimiento y Métricas
          </h3>
        </div>
        <div className="flex flex-wrap gap-4">
          {publishedPosts.length > 0 && (
            <div className="flex bg-gray-100 dark:bg-gray-800 p-1.5 rounded-xl shadow-inner">
              {availableNetworks.map(net => (
                <button 
                  key={net} 
                  onClick={() => setSelectedNetwork(net)} 
                  className={`px-4 py-2 rounded-lg text-sm font-bold 
                    ${selectedNetwork === net ? 'bg-white dark:bg-gray-900 text-indigo-600 dark:text-indigo-400 shadow-sm' : 'text-gray-500 dark:text-gray-400'}`}
                >
                  {net}
                </button>
              ))}
            </div>
          )}
          <button 
            onClick={exportToCSV} 
            className="bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-200 border border-gray-200 dark:border-gray-700 px-4 py-2 rounded-xl font-bold flex items-center gap-2 shadow-sm hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
          >
            <FileBox className="w-4 h-4"/> CSV
          </button>
          <button 
            onClick={handlePrintPDF} 
            className="bg-indigo-600 text-white px-4 py-2 rounded-xl font-bold flex items-center gap-2 shadow-md hover:bg-indigo-700 transition-colors"
          >
            <Printer className="w-4 h-4"/> Generar Reporte PDF
          </button>
        </div>
      </div>

      {/* TARJETAS KPI GLOBALES (NUEVO) */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <KpiCard title="Interacciones" value={totalEngagement} color="bg-indigo-50 text-indigo-700 dark:bg-indigo-900/30 dark:text-indigo-400 border-indigo-100 dark:border-indigo-800" />
        <KpiCard title="Me Gusta" value={totalLikes} color="bg-pink-50 text-pink-700 dark:bg-pink-900/30 dark:text-pink-400 border-pink-100 dark:border-pink-800" />
        <KpiCard title="Comentarios" value={totalComments} color="bg-sky-50 text-sky-700 dark:bg-sky-900/30 dark:text-sky-400 border-sky-100 dark:border-sky-800" />
        <KpiCard title="Compartidos" value={totalShares} color="bg-emerald-50 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400 border-emerald-100 dark:border-emerald-800" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        
        {/* TABLA DE MÉTRICAS */}
        <div className="bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800 rounded-3xl shadow-sm p-6 overflow-hidden">
           <h4 className="font-black text-xl text-gray-800 dark:text-white mb-6">Métricas por Publicación</h4>
           <div className="overflow-x-auto">
             <table className="w-full text-sm text-left">
               <thead className="text-[10px] text-gray-500 uppercase bg-gray-50 dark:bg-gray-800">
                 <tr>
                   <th className="px-4 py-4">Post</th>
                   <th className="px-4 py-4 text-center">Likes</th>
                   <th className="px-4 py-4 text-center">Coments</th>
                   <th className="px-4 py-4 text-center">Shares</th>
                 </tr>
               </thead>
               <tbody className="divide-y divide-gray-100 dark:divide-gray-800">
                  {filteredPosts.length === 0 ? (
                    <tr>
                      <td colSpan="4" className="text-center py-8 text-gray-400 font-medium">No hay publicaciones para mostrar en esta red.</td>
                    </tr>
                  ) : filteredPosts.map(post => (
                    <tr key={post.id}>
                      <td className="px-4 py-4 font-bold dark:text-white">
                        <span className="text-[10px] uppercase text-gray-400 block">{post.network}</span>
                        {post.title}
                      </td>
                      <td className="px-4 py-4 text-center">
                        {isReadOnly ? (
                           <span className="font-bold text-gray-700 dark:text-gray-300 text-lg">
                             {post.metrics?.likes || 0}
                           </span>
                        ) : (
                          <input 
                            type="number" 
                            min="0" 
                            value={post.metrics?.likes || ''} 
                            onChange={(e) => updateMetrics(post.id, 'likes', e.target.value)} 
                            className="w-16 border border-gray-200 dark:border-gray-700 p-2 rounded-xl text-center text-sm font-bold outline-none focus:ring-2 focus:ring-indigo-500 bg-gray-50 dark:bg-gray-800 dark:text-white mx-auto block" 
                            placeholder="0" 
                          />
                        )}
                      </td>
                      <td className="px-4 py-4 text-center">
                        {isReadOnly ? (
                           <span className="font-bold text-gray-700 dark:text-gray-300 text-lg">
                             {post.metrics?.comments || 0}
                           </span>
                        ) : (
                          <input 
                            type="number" 
                            min="0" 
                            value={post.metrics?.comments || ''} 
                            onChange={(e) => updateMetrics(post.id, 'comments', e.target.value)} 
                            className="w-16 border border-gray-200 dark:border-gray-700 p-2 rounded-xl text-center text-sm font-bold outline-none focus:ring-2 focus:ring-indigo-500 bg-gray-50 dark:bg-gray-800 dark:text-white mx-auto block" 
                            placeholder="0" 
                          />
                        )}
                      </td>
                      <td className="px-4 py-4 text-center">
                        {isReadOnly ? (
                           <span className="font-bold text-gray-700 dark:text-gray-300 text-lg">
                             {post.metrics?.shares || 0}
                           </span>
                        ) : (
                          <input 
                            type="number" 
                            min="0" 
                            value={post.metrics?.shares || ''} 
                            onChange={(e) => updateMetrics(post.id, 'shares', e.target.value)} 
                            className="w-16 border border-gray-200 dark:border-gray-700 p-2 rounded-xl text-center text-sm font-bold outline-none focus:ring-2 focus:ring-indigo-500 bg-gray-50 dark:bg-gray-800 dark:text-white mx-auto block" 
                            placeholder="0" 
                          />
                        )}
                      </td>
                    </tr>
                  ))}
               </tbody>
             </table>
           </div>
        </div>

        {/* GRÁFICA */}
        <div className="bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800 rounded-3xl shadow-sm p-6 min-h-[400px] flex flex-col">
           <h4 className="font-black text-xl text-gray-800 dark:text-white mb-2">Rendimiento Comparativo</h4>
           <p className="text-sm text-gray-500 mb-8">Comparación del total de interacciones por post.</p>
           
           <div className="flex-1 flex items-end gap-4 border-b-2 border-l-2 border-gray-100 dark:border-gray-800 p-4 pt-10 relative">
             <div className="absolute top-0 left-0 w-full border-t border-dashed border-gray-200 dark:border-gray-700 flex items-center z-0">
                <span className="text-[10px] font-bold text-gray-400 bg-white dark:bg-gray-900 pr-2 -translate-y-1/2 -translate-x-full absolute -left-2">{maxEngagement}</span>
             </div>
             <div className="absolute top-1/2 left-0 w-full border-t border-dashed border-gray-100 dark:border-gray-800 flex items-center z-0">
                <span className="text-[10px] font-bold text-gray-400 bg-white dark:bg-gray-900 pr-2 -translate-y-1/2 -translate-x-full absolute -left-2">{Math.round(maxEngagement/2)}</span>
             </div>

             {filteredPosts.map(post => {
               const total = (post.metrics?.likes || 0) + (post.metrics?.comments || 0) + (post.metrics?.shares || 0);
               const heightPercent = maxEngagement > 0 ? (total / maxEngagement) * 100 : 0;
               
               return (
                 <div key={post.id} className="flex-1 flex flex-col items-center gap-3 relative h-full justify-end group">
                    <div 
                      className="w-full max-w-[60px] bg-gradient-to-t from-indigo-600 to-indigo-400 rounded-t-xl transition-all relative" 
                      style={{ height: `${heightPercent}%`, minHeight: total > 0 ? '6px' : '0' }}
                    >
                      <span className="absolute -top-10 left-1/2 -translate-x-1/2 bg-gray-900 text-white font-bold text-xs px-3 py-1.5 rounded-lg opacity-0 group-hover:opacity-100 transition-all whitespace-nowrap z-20 shadow-lg pointer-events-none transform group-hover:-translate-y-1">
                        {total} interacciones
                      </span>
                    </div>
                    <span className="text-[10px] text-gray-500 truncate w-full text-center" title={post.title}>
                      {post.title.substring(0,8)}
                    </span>
                 </div>
               )
             })}
           </div>
        </div>
      </div>
    </div>
  );
}

function KpiCard({ title, value, color }) {
  return (
    <div className={`p-6 rounded-3xl border shadow-sm flex flex-col justify-center items-start ${color} transition-transform hover:-translate-y-1`}>
      <span className="text-xs font-black uppercase tracking-widest opacity-80 mb-2">{title}</span>
      <span className="text-4xl font-black">{value.toLocaleString()}</span>
    </div>
  );
}