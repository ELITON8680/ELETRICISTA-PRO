
import React, { useState, useMemo, useCallback } from 'react';
import { BudgetData, ProfessionalData, BudgetStatus } from '../types';
import { formatCurrency } from '../utils';
import { Search, Copy, Trash2, FileDown, Loader2, MessageCircle, Edit3, Filter, Calendar, AlertCircle, ReceiptText, TrendingUp, XCircle, CheckCircle2, BarChart3 } from 'lucide-react';
import { generatePDF, generateReceiptPDF } from '../services/pdfService';

interface Props {
  budgets: BudgetData[];
  professional: ProfessionalData;
  onDuplicate: (id: string) => void;
  onDelete: (id: string) => void;
  onEdit: (id: string) => void;
  onUpdateStatus: (id: string, status: BudgetStatus) => void;
  onUpdateHasPdf: (id: string) => void;
}

const StatusBadge = ({ status, onUpdate }: { status: BudgetStatus, onUpdate: (s: BudgetStatus) => void }) => {
  const [showMenu, setShowMenu] = useState(false);
  
  const colors = {
    [BudgetStatus.ABERTO]: 'bg-slate-100 text-slate-600 border-slate-200',
    [BudgetStatus.ENVIADO]: 'bg-blue-100 text-blue-700 border-blue-200',
    [BudgetStatus.APROVADO]: 'bg-emerald-100 text-emerald-700 border-emerald-200',
    [BudgetStatus.CANCELADO]: 'bg-red-100 text-red-700 border-red-200',
  };

  const statusLabels = {
    [BudgetStatus.ABERTO]: 'Em Aberto',
    [BudgetStatus.ENVIADO]: 'Enviado ao Cliente',
    [BudgetStatus.APROVADO]: 'Serviço Fechado ✅',
    [BudgetStatus.CANCELADO]: 'Não Realizado ❌',
  };

  return (
    <div className="relative">
      <button 
        onClick={() => setShowMenu(!showMenu)}
        className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest border transition-all active:scale-95 ${colors[status]}`}
      >
        {status}
      </button>
      
      {showMenu && (
        <>
          <div className="fixed inset-0 z-40" onClick={() => setShowMenu(false)}></div>
          <div className="absolute top-full mt-2 right-0 bg-white border border-slate-100 rounded-2xl shadow-2xl z-50 p-2 w-48 flex flex-col gap-1 ring-4 ring-black/5 animate-in zoom-in-95 duration-150">
            {Object.values(BudgetStatus).map(s => (
              <button 
                key={s}
                onClick={() => { onUpdate(s); setShowMenu(false); }}
                className={`text-left px-3 py-2 rounded-xl text-[10px] font-black uppercase tracking-wider flex justify-between items-center ${status === s ? 'bg-slate-50 text-slate-900' : 'text-slate-400 hover:bg-slate-50'}`}
              >
                {statusLabels[s]}
                {status === s && <CheckCircle2 size={12} className="text-blue-500" />}
              </button>
            ))}
          </div>
        </>
      )}
    </div>
  );
};

const BudgetCard = React.memo(({ budget, professional, onDuplicate, onDelete, onEdit, onDownload, onDownloadReceipt, onWhatsApp, onUpdateStatus, isGenerating }: { 
  budget: BudgetData, 
  professional: ProfessionalData, 
  onDuplicate: (id: string) => void, 
  onDelete: (id: string) => void,
  onEdit: (id: string) => void,
  onDownload: (b: BudgetData) => void,
  onDownloadReceipt: (b: BudgetData) => void,
  onWhatsApp: (b: BudgetData) => void,
  onUpdateStatus: (id: string, status: BudgetStatus) => void,
  isGenerating: boolean
}) => {
  const cardStyle = {
    [BudgetStatus.APROVADO]: 'bg-emerald-50/50 border-emerald-100 shadow-emerald-100/20',
    [BudgetStatus.CANCELADO]: 'bg-slate-50/80 border-slate-200 opacity-75 grayscale-[0.5]',
    [BudgetStatus.ENVIADO]: 'bg-white border-blue-100',
    [BudgetStatus.ABERTO]: 'bg-white border-slate-100',
  };

  return (
    <div className={`p-6 rounded-[32px] shadow-sm border mb-5 relative overflow-hidden transition-all hover:shadow-xl animate-in slide-in-from-bottom-4 duration-300 ${cardStyle[budget.status] || cardStyle[BudgetStatus.ABERTO]}`}>
      {budget.status === BudgetStatus.APROVADO && (
        <div className="absolute top-0 right-0 p-2">
          <div className="bg-emerald-500 text-white p-1 rounded-full">
            <CheckCircle2 size={14} strokeWidth={3} />
          </div>
        </div>
      )}
      
      <div className="flex justify-between items-start mb-5">
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1.5">
            <div className={`text-[9px] font-black px-2 py-0.5 rounded-full uppercase tracking-widest ${budget.status === BudgetStatus.APROVADO ? 'bg-emerald-500 text-white' : 'bg-blue-50 text-blue-600'}`}>
              #{budget.id?.toUpperCase().slice(0, 6)}
            </div>
            <div className="text-[9px] font-bold text-slate-400">
              {new Date(budget.date).toLocaleDateString('pt-BR')}
            </div>
          </div>
          <h3 className="text-xl font-[900] text-slate-900 truncate pr-2">{budget.client.name || 'Cliente Sem Nome'}</h3>
          <p className="text-[11px] text-slate-400 font-bold uppercase tracking-tight">{budget.workType} • {budget.workPattern}</p>
        </div>
        <div className="text-right flex flex-col items-end gap-2">
          <p className={`text-xl font-[900] tracking-tighter ${budget.status === BudgetStatus.APROVADO ? 'text-emerald-600' : 'text-slate-900'}`}>{formatCurrency(budget.finalTotal)}</p>
          <StatusBadge status={budget.status} onUpdate={(s) => onUpdateStatus(budget.id, s)} />
        </div>
      </div>

      <div className="grid grid-cols-6 gap-2 pt-4 border-t border-slate-100/50">
        <button 
          onClick={() => onDownload(budget)}
          disabled={isGenerating}
          className={`h-14 bg-blue-600 text-white rounded-2xl flex flex-col items-center justify-center gap-1 active-press shadow-lg shadow-blue-100 transition-all ${isGenerating ? 'opacity-50 grayscale' : ''}`}
          title="Baixar PDF Proposta"
        >
          {isGenerating ? <Loader2 className="animate-spin" size={18} /> : <FileDown size={18} strokeWidth={2.5} />}
          <span className="text-[8px] font-black uppercase">Proposta</span>
        </button>

        <button 
          onClick={() => onDownloadReceipt(budget)}
          className="h-14 bg-indigo-600 text-white rounded-2xl flex flex-col items-center justify-center gap-1 active-press shadow-lg shadow-indigo-100 transition-all"
          title="Gerar Recibo"
        >
          <ReceiptText size={18} strokeWidth={2.5} />
          <span className="text-[8px] font-black uppercase">Recibo</span>
        </button>
        
        <button 
          onClick={() => onWhatsApp(budget)}
          className="h-14 bg-emerald-500 text-white rounded-2xl flex flex-col items-center justify-center gap-1 active-press shadow-lg shadow-emerald-100 transition-all"
          title="Enviar WhatsApp"
        >
          <MessageCircle size={18} strokeWidth={2.5} />
          <span className="text-[8px] font-black uppercase">ZAP</span>
        </button>

        <button 
          onClick={() => onEdit(budget.id)}
          className="h-14 bg-white border border-slate-200 text-slate-600 rounded-2xl flex flex-col items-center justify-center gap-1 active-press transition-all"
          title="Editar"
        >
          <Edit3 size={18} strokeWidth={2.5} />
          <span className="text-[8px] font-black uppercase">EDITAR</span>
        </button>
        
        <button 
          onClick={() => onDuplicate(budget.id)}
          className="h-14 bg-white border border-slate-200 text-slate-400 rounded-2xl flex flex-col items-center justify-center gap-1 active-press transition-all"
          title="Duplicar"
        >
          <Copy size={18} strokeWidth={2.5} />
          <span className="text-[8px] font-black uppercase">COPIAR</span>
        </button>
        
        <button 
          onClick={() => onDelete(budget.id)}
          className="h-14 bg-red-50 text-red-500 rounded-2xl flex flex-col items-center justify-center gap-1 active-press transition-all hover:bg-red-100"
          title="Excluir"
        >
          <Trash2 size={18} strokeWidth={2.5} />
          <span className="text-[8px] font-black uppercase">LIXO</span>
        </button>
      </div>
    </div>
  );
});

const History: React.FC<Props> = ({ budgets, professional, onDuplicate, onDelete, onEdit, onUpdateStatus, onUpdateHasPdf }) => {
  const [search, setSearch] = useState('');
  const [isGenerating, setIsGenerating] = useState<string | null>(null);
  const [dateFilter, setDateFilter] = useState<'all' | 'today' | 'week' | 'month'>('all');
  const [pdfAlertBudget, setPdfAlertBudget] = useState<BudgetData | null>(null);

  const stats = useMemo(() => {
    const closed = budgets.filter(b => b.status === BudgetStatus.APROVADO);
    const lost = budgets.filter(b => b.status === BudgetStatus.CANCELADO);
    const totalCount = budgets.filter(b => b.isFinalized).length;
    
    const conversionRate = totalCount > 0 ? (closed.length / totalCount) * 100 : 0;
    const closedValue = closed.reduce((acc, b) => acc + b.finalTotal, 0);

    return {
      closedCount: closed.length,
      lostCount: lost.length,
      conversionRate: Math.round(conversionRate),
      closedValue
    };
  }, [budgets]);

  const filteredBudgets = useMemo(() => {
    let list = budgets.filter(b => b.isFinalized);

    const now = new Date();
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate()).getTime();
    
    if (dateFilter === 'today') {
      list = list.filter(b => new Date(b.date).getTime() >= today);
    } else if (dateFilter === 'week') {
      const startOfWeek = today - (now.getDay() * 24 * 60 * 60 * 1000);
      list = list.filter(b => new Date(b.date).getTime() >= startOfWeek);
    } else if (dateFilter === 'month') {
      const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1).getTime();
      list = list.filter(b => new Date(b.date).getTime() >= startOfMonth);
    }

    if (search) {
      const q = search.toLowerCase();
      list = list.filter(b => 
        b.client.name.toLowerCase().includes(q) || 
        b.id.toLowerCase().includes(q) ||
        (b.client.phone && b.client.phone.includes(q))
      );
    }

    return list.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
  }, [budgets, search, dateFilter]);

  const handleDownload = useCallback(async (budget: BudgetData) => {
    if (isGenerating) return;
    setIsGenerating(budget.id);
    await new Promise(r => setTimeout(r, 200));
    const success = await generatePDF(budget, professional, false);
    if (success) onUpdateHasPdf(budget.id);
    setIsGenerating(null);
  }, [isGenerating, professional, onUpdateHasPdf]);

  const handleDownloadReceipt = useCallback(async (budget: BudgetData) => {
    setIsGenerating(budget.id);
    await new Promise(r => setTimeout(r, 200));
    await generateReceiptPDF(budget, professional);
    setIsGenerating(null);
  }, [professional]);

  const handleWhatsApp = useCallback(async (budget: BudgetData) => {
    if (!budget.client.phone || budget.client.phone.trim() === '') {
      alert("Telefone do cliente não informado.");
      return;
    }

    if (!budget.hasPdf) {
      setPdfAlertBudget(budget);
      return;
    }

    const cleanPhone = budget.client.phone.replace(/\D/g, '');
    const message = encodeURIComponent(`Olá, segue seu orçamento em PDF.\nQualquer dúvida estou à disposição.`);
    window.open(`https://wa.me/55${cleanPhone}?text=${message}`, '_blank');
    if (budget.status !== BudgetStatus.APROVADO) {
      onUpdateStatus(budget.id, BudgetStatus.ENVIADO);
    }
  }, [onUpdateStatus]);

  const handleGeneratePdfAndShare = useCallback(async () => {
    if (!pdfAlertBudget) return;
    const budget = pdfAlertBudget;
    setPdfAlertBudget(null);
    
    setIsGenerating(budget.id);
    await new Promise(r => setTimeout(r, 200));
    const success = await generatePDF(budget, professional, false);
    setIsGenerating(null);
    
    if (success) {
      onUpdateHasPdf(budget.id);
      setTimeout(() => {
        const cleanPhone = budget.client.phone.replace(/\D/g, '');
        const message = encodeURIComponent(`Olá, segue seu orçamento em PDF.\nQualquer dúvida estou à disposição.`);
        window.open(`https://wa.me/55${cleanPhone}?text=${message}`, '_blank');
        if (budget.status !== BudgetStatus.APROVADO) {
           onUpdateStatus(budget.id, BudgetStatus.ENVIADO);
        }
      }, 500);
    }
  }, [pdfAlertBudget, professional, onUpdateHasPdf, onUpdateStatus]);

  return (
    <div className="space-y-6 pb-10">
      <div className="flex justify-between items-end">
        <div>
          <h2 className="text-3xl font-[900] text-slate-900 tracking-tight leading-none">Meus Serviços</h2>
          <p className="text-slate-400 text-sm font-semibold mt-1">Gerencie seu fluxo de trabalho</p>
        </div>
      </div>

      {/* Conversion Stats Panel */}
      <div className="grid grid-cols-3 gap-3">
        <div className="bg-white p-4 rounded-[24px] border border-slate-100 premium-shadow">
          <div className="flex items-center gap-1.5 mb-1">
             <TrendingUp size={12} className="text-emerald-500" />
             <span className="text-[8px] font-black text-slate-400 uppercase tracking-widest">Conversão</span>
          </div>
          <p className="text-xl font-black text-slate-900">{stats.conversionRate}%</p>
        </div>
        <div className="bg-white p-4 rounded-[24px] border border-slate-100 premium-shadow">
          <div className="flex items-center gap-1.5 mb-1">
             <CheckCircle2 size={12} className="text-emerald-500" />
             <span className="text-[8px] font-black text-slate-400 uppercase tracking-widest">Fechados</span>
          </div>
          <p className="text-xl font-black text-emerald-600">{stats.closedCount}</p>
        </div>
        <div className="bg-white p-4 rounded-[24px] border border-slate-100 premium-shadow">
          <div className="flex items-center gap-1.5 mb-1">
             <XCircle size={12} className="text-red-400" />
             <span className="text-[8px] font-black text-slate-400 uppercase tracking-widest">Perdidos</span>
          </div>
          <p className="text-xl font-black text-slate-300">{stats.lostCount}</p>
        </div>
      </div>

      <div className="space-y-4">
        <div className="bg-white/80 backdrop-blur-xl border border-slate-200 rounded-[24px] h-16 px-6 flex items-center gap-4 shadow-xl shadow-slate-200/40 focus-within:ring-4 focus-within:ring-blue-500/10 transition-all">
          <Search className="text-blue-600" size={20} strokeWidth={3} />
          <input 
            type="text" 
            className="flex-1 bg-transparent border-none outline-none font-bold text-slate-800 placeholder:text-slate-300 placeholder:font-normal"
            placeholder="Nome, Telefone ou OS..."
            value={search}
            onChange={e => setSearch(e.target.value)}
          />
        </div>

        <div className="flex gap-2 overflow-x-auto no-scrollbar pb-2">
          <FilterButton active={dateFilter === 'all'} label="Tudo" onClick={() => setDateFilter('all')} icon={<BarChart3 size={12} />} />
          <FilterButton active={dateFilter === 'today'} label="Hoje" onClick={() => setDateFilter('today')} />
          <FilterButton active={dateFilter === 'week'} label="Esta Semana" onClick={() => setDateFilter('week')} />
          <FilterButton active={dateFilter === 'month'} label="Este Mês" onClick={() => setDateFilter('month')} />
        </div>
      </div>

      <div className="pt-2">
        {filteredBudgets.map(budget => (
          <BudgetCard 
            key={budget.id} 
            budget={budget} 
            professional={professional} 
            onDuplicate={onDuplicate} 
            onDelete={onDelete}
            onEdit={onEdit}
            onDownload={handleDownload}
            onDownloadReceipt={handleDownloadReceipt}
            onWhatsApp={handleWhatsApp}
            onUpdateStatus={onUpdateStatus}
            isGenerating={isGenerating === budget.id}
          />
        ))}

        {filteredBudgets.length === 0 && (
          <div className="text-center py-32 bg-white/50 rounded-[48px] border-2 border-dashed border-slate-200">
            <div className="bg-slate-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
              <Search className="text-slate-300" size={32} />
            </div>
            <p className="font-black text-slate-300 uppercase tracking-widest text-xs">Nenhum serviço encontrado</p>
          </div>
        )}
      </div>

      {/* PDF Required Alert Modal */}
      {pdfAlertBudget && (
        <div className="fixed inset-0 bg-slate-900/80 backdrop-blur-sm z-[60] flex items-center justify-center p-6">
          <div className="bg-white rounded-[40px] p-8 max-w-sm w-full shadow-2xl animate-in zoom-in-95 duration-200">
            <div className="w-16 h-16 bg-blue-50 text-blue-600 rounded-[20px] flex items-center justify-center mx-auto mb-6">
              <AlertCircle size={32} strokeWidth={2.5} />
            </div>
            <h3 className="text-xl font-black text-slate-900 text-center mb-2">PDF Necessário</h3>
            <p className="text-slate-500 text-center text-sm mb-8">
              É necessário gerar o PDF antes de enviar pelo WhatsApp.
            </p>
            <div className="flex flex-col gap-3">
              <button 
                onClick={handleGeneratePdfAndShare}
                className="w-full bg-blue-600 text-white py-5 rounded-[20px] font-black text-sm uppercase tracking-widest active-press shadow-xl shadow-blue-100"
              >
                Gerar PDF Agora
              </button>
              <button 
                onClick={() => setPdfAlertBudget(null)}
                className="w-full bg-slate-100 text-slate-400 py-5 rounded-[20px] font-black text-sm uppercase tracking-widest active-press"
              >
                Cancelar
              </button>
            </div>
          </div>
        </div>
      )}

      {isGenerating && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-md z-50 flex items-center justify-center p-8">
          <div className="bg-white rounded-[40px] p-10 flex flex-col items-center gap-6 shadow-2xl animate-in zoom-in-95 duration-200 max-w-xs w-full text-center">
            <div className="w-20 h-20 rounded-[32px] bg-blue-50 flex items-center justify-center">
              <Loader2 className="text-blue-600 animate-spin" size={40} strokeWidth={3} />
            </div>
            <div>
              <p className="font-black text-slate-900 uppercase tracking-widest text-sm mb-1">Processando</p>
              <p className="text-xs text-slate-400 font-bold">Gerando Documento Profissional...</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

const FilterButton = ({ active, label, onClick, icon }: { active: boolean, label: string, onClick: () => void, icon?: React.ReactNode }) => (
  <button 
    onClick={onClick}
    className={`whitespace-nowrap px-5 h-10 rounded-full text-[10px] font-black uppercase tracking-widest flex items-center gap-2 transition-all active:scale-95 border ${
      active 
        ? 'bg-slate-900 text-white border-slate-900 shadow-lg shadow-slate-200' 
        : 'bg-white text-slate-400 border-slate-100 hover:border-slate-300'
    }`}
  >
    {icon}
    {label}
  </button>
);

export default History;
