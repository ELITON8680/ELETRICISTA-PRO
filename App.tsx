
import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { BudgetData, ProfessionalData, WorkType, WorkPattern, BudgetStatus, AppSettings, PricingMode } from './types';
import { getFromStorage, saveToStorage, generateId } from './utils';
import { DEFAULT_SETTINGS } from './constants';
import Dashboard from './components/Dashboard';
import BudgetForm from './components/BudgetForm';
import History from './components/History';
import Profile from './components/Profile';
import SettingsView from './components/SettingsView';
import { LayoutGrid, FileText, History as HistoryIcon, User, Plus } from 'lucide-react';

const App: React.FC = () => {
  const [view, setView] = useState<'dashboard' | 'form' | 'history' | 'profile' | 'settings'>('dashboard');
  
  const [professional, setProfessional] = useState<ProfessionalData>(() => 
    getFromStorage('professional', {
      name: '',
      profession: 'Eletricista',
      phone: '',
      logo: '',
      baseSalary: 4400
    })
  );

  const [settings, setSettings] = useState<AppSettings>(() => 
    getFromStorage('settings', DEFAULT_SETTINGS)
  );

  const [budgets, setBudgets] = useState<BudgetData[]>(() => 
    getFromStorage('budgets', [])
  );

  const [activeBudgetId, setActiveBudgetId] = useState<string | null>(() => 
    getFromStorage('activeBudgetId', null)
  );

  useEffect(() => saveToStorage('professional', professional), [professional]);
  useEffect(() => saveToStorage('settings', settings), [settings]);
  useEffect(() => saveToStorage('budgets', budgets), [budgets]);
  useEffect(() => saveToStorage('activeBudgetId', activeBudgetId), [activeBudgetId]);

  const handleStartNewBudget = useCallback(() => {
    if (activeBudgetId) {
      setView('form');
      return;
    }
    const newId = generateId();
    const newBudget: BudgetData = {
      id: newId,
      date: new Date().toISOString(),
      client: { name: '', phone: '', address: '', observations: '' },
      workType: WorkType.RESIDENCIAL,
      workPattern: WorkPattern.FACIL,
      pricingMode: PricingMode.SERVICES,
      hours: 0,
      services: [],
      travelCost: 0,
      foodCost: 0,
      additionalCost: 0,
      materials: [],
      laborValue: 0,
      partialTotal: 0,
      finalTotal: 0,
      isFinalized: false,
      status: BudgetStatus.ABERTO,
      hasPdf: false,
      serviceDescription: '',
      executionDeadline: '',
      proposalValidity: '7 dias',
      paymentConditions: 'À vista'
    };
    setBudgets(prev => [...prev, newBudget]);
    setActiveBudgetId(newId);
    setView('form');
  }, [activeBudgetId]);

  const handleFinalizeBudget = useCallback((updatedBudget: BudgetData) => {
    setBudgets(prev => prev.map(b => b.id === updatedBudget.id ? { ...updatedBudget, isFinalized: true } : b));
    setActiveBudgetId(null);
    setView('dashboard');
    alert("Proposta Comercial finalizada com sucesso!");
  }, []);

  const handleUpdateBudget = useCallback((updated: BudgetData) => {
    setBudgets(prev => prev.map(b => b.id === updated.id ? updated : b));
  }, []);

  const handleUpdateBudgetStatus = useCallback((id: string, status: BudgetStatus) => {
    setBudgets(prev => prev.map(b => b.id === id ? { ...b, status } : b));
  }, []);

  const handleUpdateHasPdf = useCallback((id: string) => {
    setBudgets(prev => prev.map(b => b.id === id ? { ...b, hasPdf: true } : b));
  }, []);

  const handleEditBudget = useCallback((id: string) => {
    setActiveBudgetId(id);
    setView('form');
  }, []);

  const handleDuplicateBudget = useCallback((id: string) => {
    const original = budgets.find(b => b.id === id);
    if (!original) return;
    const duplicate: BudgetData = {
      ...original,
      id: generateId(),
      date: new Date().toISOString(),
      isFinalized: false,
      signature: undefined,
      status: BudgetStatus.ABERTO,
      hasPdf: false
    };
    setBudgets(prev => [...prev, duplicate]);
    setActiveBudgetId(duplicate.id);
    setView('form');
    alert("Orçamento duplicado.");
  }, [budgets]);

  const handleDeleteBudget = useCallback((id: string) => {
    if (window.confirm("Deseja realmente excluir este serviço?\nEsta ação não poderá ser desfeita.")) {
      setBudgets(prev => prev.filter(b => b.id !== id));
      if (activeBudgetId === id) {
        setActiveBudgetId(null);
      }
    }
  }, [activeBudgetId]);

  const activeBudget = useMemo(() => budgets.find(b => b.id === activeBudgetId), [budgets, activeBudgetId]);

  return (
    <div className="min-h-screen bg-[#f8fafc] flex flex-col pb-24 select-none">
      <header className="bg-white/80 backdrop-blur-xl border-b border-slate-100 px-6 py-5 sticky top-0 z-30">
        <div className="flex justify-between items-center max-w-lg mx-auto w-full">
          <div>
            <h1 className="text-xl font-[900] text-slate-900 tracking-tighter flex items-center gap-1">
              Eletro<span className="text-blue-600">Pro</span>
            </h1>
          </div>
          <div className="flex items-center gap-3">
            {professional.name && (
              <div className="text-[11px] font-black text-blue-700 bg-blue-50 px-3 py-1.5 rounded-full uppercase tracking-widest border border-blue-100">
                {professional.name.split(' ')[0]}
              </div>
            )}
            <button 
              onClick={() => setView('profile')} 
              className={`w-10 h-10 rounded-2xl flex items-center justify-center active-press transition-colors ${view === 'profile' ? 'bg-blue-600 text-white shadow-lg shadow-blue-100' : 'bg-slate-100 text-slate-600'}`}
              title="Perfil Profissional"
            >
              <User size={20} />
            </button>
          </div>
        </div>
      </header>

      <main className="flex-1 overflow-y-auto px-4 py-6">
        <div className="max-w-lg mx-auto w-full">
          {view === 'dashboard' && <Dashboard budgets={budgets} onNewBudget={handleStartNewBudget} activeBudget={activeBudget} onOpenSettings={() => setView('settings')} />}
          {view === 'form' && activeBudget && <BudgetForm budget={activeBudget} professional={professional} settings={settings} onUpdate={handleUpdateBudget} onFinalize={handleFinalizeBudget} onCancel={() => setView('dashboard')} />}
          {view === 'form' && !activeBudget && (
            <div className="flex flex-col items-center justify-center py-20 text-center bg-white rounded-[40px] premium-shadow border border-slate-50">
              <div className="bg-blue-600 w-24 h-24 rounded-[32px] flex items-center justify-center mb-8 shadow-xl shadow-blue-200">
                <Plus className="text-white" size={48} strokeWidth={3} />
              </div>
              <h2 className="text-2xl font-black text-slate-900 mb-2">Novo Projeto?</h2>
              <p className="text-slate-500 text-sm mb-10 px-12">Gere uma proposta comercial detalhada em instantes.</p>
              <button onClick={handleStartNewBudget} className="fintech-gradient text-white px-12 py-5 rounded-[24px] font-black text-lg shadow-2xl shadow-blue-200 active-press">
                Começar Agora
              </button>
            </div>
          )}
          {view === 'history' && (
            <History 
              budgets={budgets} 
              professional={professional} 
              onDuplicate={handleDuplicateBudget} 
              onDelete={handleDeleteBudget} 
              onEdit={handleEditBudget}
              onUpdateStatus={handleUpdateBudgetStatus}
              onUpdateHasPdf={handleUpdateHasPdf}
            />
          )}
          {view === 'profile' && <Profile professional={professional} onUpdate={setProfessional} />}
          {view === 'settings' && <SettingsView settings={settings} budgets={budgets} professional={professional} onUpdate={setSettings} onBack={() => setView('dashboard')} />}
        </div>
      </main>

      <nav className="fixed bottom-6 left-1/2 -translate-x-1/2 w-[calc(100%-32px)] max-w-md bg-slate-900 rounded-[32px] h-20 px-12 flex items-center justify-around shadow-2xl z-30 ring-8 ring-white/50 backdrop-blur-md">
        <NavButton active={view === 'dashboard'} icon={<LayoutGrid />} label="Home" onClick={() => setView('dashboard')} />
        <NavButton active={view === 'form'} icon={<FileText />} label="Form" onClick={() => setView('form')} />
        <NavButton active={view === 'history'} icon={<HistoryIcon />} label="Lista" onClick={() => setView('history')} />
      </nav>
    </div>
  );
};

const NavButton: React.FC<{ active: boolean, icon: React.ReactNode, label: string, onClick: () => void }> = React.memo(({ active, icon, label, onClick }) => (
  <button onClick={onClick} className={`flex flex-col items-center gap-1 transition-all ${active ? 'text-blue-400' : 'text-slate-500'}`}>
    {React.cloneElement(icon as React.ReactElement, { size: 24, strokeWidth: active ? 2.5 : 2 })}
    <span className={`text-[9px] font-black uppercase tracking-widest ${active ? 'opacity-100' : 'opacity-40'}`}>{label}</span>
  </button>
));

export default App;
