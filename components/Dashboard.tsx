
import React, { useMemo, useEffect, useState } from 'react';
import { BudgetData } from '../types';
import { formatCurrency } from '../utils';
import { BarChart, Bar, XAxis, Tooltip, ResponsiveContainer, Cell } from 'recharts';
import { TrendingUp, Plus, ChevronRight, Settings, FileText, Download, CheckCircle, Zap, Smartphone } from 'lucide-react';

interface Props {
  budgets: BudgetData[];
  onNewBudget: () => void;
  activeBudget?: BudgetData;
  onOpenSettings: () => void;
}

const Dashboard: React.FC<Props> = ({ budgets, onNewBudget, activeBudget, onOpenSettings }) => {
  const [deferredPrompt, setDeferredPrompt] = useState<any>(null);
  const [isInstalled, setIsInstalled] = useState(false);

  useEffect(() => {
    const handleBeforeInstallPrompt = (e: Event) => {
      e.preventDefault();
      setDeferredPrompt(e);
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);

    if (window.matchMedia('(display-mode: standalone)').matches || (window.navigator as any).standalone) {
      setIsInstalled(true);
    }

    return () => window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
  }, []);

  const handleInstall = async () => {
    if (deferredPrompt) {
      deferredPrompt.prompt();
      const { outcome } = await deferredPrompt.userChoice;
      if (outcome === 'accepted') {
        setDeferredPrompt(null);
        setIsInstalled(true);
      }
    } else {
      alert("Para baixar a versão original no Android:\n\n1. Clique nos 3 pontos do Chrome.\n2. Escolha 'Instalar aplicativo'.\n\nIsso agiliza o seu trabalho e permite usar o app sem internet!");
    }
  };

  const finalized = useMemo(() => budgets.filter(b => b.isFinalized), [budgets]);
  
  const stats = useMemo(() => {
    const revenue = finalized.reduce((acc, b) => acc + b.finalTotal, 0);
    const totalProjects = finalized.length;
    return { revenue, totalProjects };
  }, [finalized]);

  const chartData = useMemo(() => {
    return [...Array(7)].map((_, i) => {
      const d = new Date();
      d.setDate(d.getDate() - (6 - i));
      const dateStr = d.toISOString().split('T')[0];
      const val = finalized
        .filter(b => b.date.startsWith(dateStr))
        .reduce((acc, b) => acc + b.finalTotal, 0);
      return { 
        name: d.toLocaleDateString('pt-BR', { weekday: 'short' }).charAt(0).toUpperCase(),
        valor: val 
      };
    });
  }, [finalized]);

  return (
    <div className="space-y-8 animate-page">
      <div className="flex justify-between items-end">
        <div>
          <h2 className="text-3xl font-[900] text-slate-900 tracking-tight leading-none">Painel</h2>
          <p className="text-slate-400 text-sm font-semibold mt-1">EletroPro • Gestão Ágil</p>
        </div>
        <div className="flex items-center gap-3">
          <button 
            onClick={onOpenSettings}
            className="bg-white p-3 rounded-2xl premium-shadow border border-slate-100 text-slate-600 active-press"
          >
            <Settings size={22} />
          </button>
        </div>
      </div>

      {!isInstalled && (
        <div className="bg-white p-2 rounded-[32px] premium-shadow border border-blue-100">
          <button 
            type="button"
            onClick={handleInstall}
            className="w-full fintech-gradient text-white rounded-[26px] p-6 flex items-center gap-5 active-press shadow-xl shadow-blue-200"
          >
            <div className="bg-white/20 p-3 rounded-2xl">
              <Smartphone size={32} strokeWidth={2.5} className="text-white" />
            </div>
            <div className="text-left flex-1">
              <p className="text-lg font-[900] leading-none mb-1">BAIXAR APP ORIGINAL</p>
              <p className="text-[10px] font-bold opacity-80 uppercase tracking-widest">Instale agora para uso offline</p>
            </div>
          </button>
        </div>
      )}

      {isInstalled && (
        <div className="bg-emerald-50 border border-emerald-100 rounded-[24px] p-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <CheckCircle className="text-emerald-500" size={18} />
            <span className="text-[10px] font-black text-emerald-700 uppercase tracking-widest">Versão Original Ativa</span>
          </div>
          <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></div>
        </div>
      )}

      {activeBudget && (
        <button 
          onClick={onNewBudget}
          className="w-full bg-slate-900 rounded-[32px] p-6 text-white shadow-2xl active-press relative overflow-hidden group"
        >
          <div className="absolute top-0 right-0 w-32 h-32 bg-blue-600/20 blur-3xl -mr-16 -mt-16 group-hover:bg-blue-600/40 transition-all"></div>
          <div className="flex justify-between items-center relative z-10">
            <div className="text-left flex-1 min-w-0">
              <div className="text-[10px] font-black uppercase tracking-[0.2em] text-blue-400 mb-1">TRABALHO ATUAL</div>
              <div className="text-xl font-black truncate pr-4">{activeBudget.client.name || 'Novo Orçamento'}</div>
            </div>
            <div className="bg-white/10 p-3 rounded-2xl backdrop-blur-md">
              <ChevronRight size={20} />
            </div>
          </div>
        </button>
      )}

      <div className="grid grid-cols-2 gap-4">
        <div className="bg-white p-6 rounded-[32px] premium-shadow border border-slate-100 flex flex-col gap-4">
          <div className="w-12 h-12 rounded-2xl bg-emerald-50 flex items-center justify-center text-emerald-600">
            <TrendingUp size={24} />
          </div>
          <div>
            <div className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-0.5">Faturamento</div>
            <div className="text-xl font-black text-slate-900 tracking-tight">{formatCurrency(stats.revenue)}</div>
          </div>
        </div>
        <div className="bg-white p-6 rounded-[32px] premium-shadow border border-slate-100 flex flex-col gap-4">
          <div className="w-12 h-12 rounded-2xl bg-blue-50 flex items-center justify-center text-blue-600">
            <FileText size={24} />
          </div>
          <div>
            <div className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-0.5">Serviços</div>
            <div className="text-xl font-black text-slate-900 tracking-tight">{stats.totalProjects}</div>
          </div>
        </div>
      </div>

      <div className="bg-white p-8 rounded-[40px] premium-shadow border border-slate-100">
        <div className="flex justify-between items-center mb-8">
          <h3 className="text-[11px] font-black uppercase tracking-widest text-slate-400">Desempenho Semanal</h3>
        </div>
        <div className="h-44 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={chartData}>
              <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fontSize: 11, fill: '#94a3b8', fontWeight: '800' }} />
              <Tooltip 
                cursor={{ fill: 'rgba(241, 245, 249, 1)', radius: 12 }}
                contentStyle={{ borderRadius: '20px', border: 'none', boxShadow: '0 20px 25px -5px rgba(0,0,0,0.1)', fontWeight: '900' }}
                formatter={(val: number) => [formatCurrency(val), 'Valor']}
              />
              <Bar dataKey="valor" radius={[8, 8, 8, 8]} barSize={32}>
                {chartData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.valor > 0 ? '#2563eb' : '#f1f5f9'} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
      
      <button 
        onClick={onNewBudget}
        className="w-full bg-blue-600 text-white p-6 rounded-[32px] flex items-center justify-center gap-4 active-press shadow-2xl shadow-blue-200 transition-all"
      >
        <div className="bg-white/20 p-2 rounded-xl">
          <Plus size={24} strokeWidth={3} />
        </div>
        <span className="text-lg font-black uppercase tracking-wider">Criar Orçamento</span>
      </button>
    </div>
  );
};

export default Dashboard;
