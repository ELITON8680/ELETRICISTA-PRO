
import React, { useState } from 'react';
import { AppSettings, WorkType, WorkPattern } from '../types';
import { DEFAULT_SETTINGS } from '../constants';
import { Save, RotateCcw, ArrowLeft, Percent, Layers } from 'lucide-react';

interface Props {
  settings: AppSettings;
  budgets: any[]; // Mantido para compatibilidade de assinatura se necessário, mas não usado agora
  professional: any;
  onUpdate: (settings: AppSettings) => void;
  onBack: () => void;
}

const SettingsView: React.FC<Props> = ({ settings, onUpdate, onBack }) => {
  const [tempSettings, setTempSettings] = useState<AppSettings>(settings);
  const [showConfirm, setShowConfirm] = useState(false);

  const updatePerc = (group: 'workTypePercentages' | 'workPatternPercentages', key: string, val: string) => {
    const numVal = val === '' ? 0 : parseFloat(val);
    setTempSettings({
      ...tempSettings,
      [group]: {
        ...tempSettings[group],
        [key]: numVal
      }
    });
  };

  const handleSave = () => {
    onUpdate(tempSettings);
    setShowConfirm(false);
    alert("Configurações de margem atualizadas com sucesso!");
    onBack();
  };

  const restoreDefaults = () => {
    if (confirm("Deseja restaurar os percentuais de cálculo para os padrões de fábrica?")) {
      setTempSettings(DEFAULT_SETTINGS);
    }
  };

  return (
    <div className="space-y-8 pb-10 animate-in fade-in duration-300">
      <div className="flex items-center gap-4">
        <button onClick={onBack} className="p-2 text-slate-400 active-press">
          <ArrowLeft size={24} />
        </button>
        <div>
          <h2 className="text-3xl font-[900] text-slate-900 tracking-tight">Ajustes Técnicos</h2>
          <p className="text-slate-400 text-sm font-semibold">Configuração de Margens de Lucro</p>
        </div>
      </div>

      <section className="space-y-4">
        <div className="flex items-center gap-2 px-2">
          <Percent size={16} className="text-blue-600" />
          <h3 className="text-xs font-black text-slate-400 uppercase tracking-[0.2em]">Markup por Tipo de Obra</h3>
        </div>
        <div className="bg-white p-6 rounded-[40px] premium-shadow border border-slate-100 space-y-5">
          {Object.entries(WorkType).map(([key, label]) => (
            <div key={label} className="flex items-center justify-between">
              <span className="font-bold text-slate-700">{label}</span>
              <div className="flex items-center gap-2">
                <input 
                  type="number" 
                  step="1"
                  inputMode="numeric"
                  className="w-20 bg-slate-50 border border-slate-100 rounded-xl h-12 px-3 text-right font-black text-blue-600 outline-none focus:ring-2 focus:ring-blue-500 transition-all"
                  value={tempSettings.workTypePercentages[label]}
                  onChange={e => updatePerc('workTypePercentages', label, e.target.value)}
                />
                <span className="text-slate-300 font-black">%</span>
              </div>
            </div>
          ))}
        </div>
      </section>

      <section className="space-y-4">
        <div className="flex items-center gap-2 px-2">
          <Layers size={16} className="text-emerald-600" />
          <h3 className="text-xs font-black text-slate-400 uppercase tracking-[0.2em]">Adicional por Complexidade</h3>
        </div>
        <div className="bg-white p-6 rounded-[40px] premium-shadow border border-slate-100 space-y-5">
          {Object.entries(WorkPattern).map(([key, label]) => (
            <div key={label} className="flex items-center justify-between">
              <span className="font-bold text-slate-700">{label}</span>
              <div className="flex items-center gap-2">
                <input 
                  type="number" 
                  step="1"
                  inputMode="numeric"
                  className="w-20 bg-slate-50 border border-slate-100 rounded-xl h-12 px-3 text-right font-black text-emerald-600 outline-none focus:ring-2 focus:ring-emerald-500 transition-all"
                  value={tempSettings.workPatternPercentages[label]}
                  onChange={e => updatePerc('workPatternPercentages', label, e.target.value)}
                />
                <span className="text-slate-300 font-black">%</span>
              </div>
            </div>
          ))}
        </div>
      </section>

      <div className="bg-blue-50 p-6 rounded-[32px] border border-blue-100 flex gap-4">
        <div className="bg-blue-600 text-white p-2 rounded-xl h-fit shrink-0">
          <Layers size={18} />
        </div>
        <p className="text-[11px] text-blue-900/70 font-bold leading-relaxed">
          As porcentagens acima são aplicadas sobre o custo base da mão de obra para gerar o valor final sugerido ao cliente.
        </p>
      </div>

      <div className="flex flex-col gap-3">
        <button 
          onClick={() => setShowConfirm(true)}
          className="w-full bg-blue-600 text-white py-6 rounded-[28px] font-black text-lg flex items-center justify-center gap-3 active-press shadow-2xl shadow-blue-100"
        >
          <Save size={24} strokeWidth={3} />
          SALVAR ALTERAÇÕES
        </button>
        <button 
          onClick={restoreDefaults}
          className="w-full bg-white text-slate-400 py-6 rounded-[28px] font-black text-sm uppercase tracking-widest active-press border border-slate-100"
        >
          <RotateCcw size={18} />
          Resetar para Padrões
        </button>
      </div>

      {showConfirm && (
        <div className="fixed inset-0 bg-slate-900/80 backdrop-blur-sm z-[70] flex items-center justify-center p-6">
          <div className="bg-white rounded-[40px] p-8 max-w-sm w-full shadow-2xl animate-in zoom-in-95">
            <h3 className="text-xl font-black text-slate-900 text-center mb-4">Atualizar Cálculos?</h3>
            <p className="text-slate-500 text-center text-sm mb-8 leading-relaxed">
              Esta alteração afetará apenas os <span className="text-blue-600 font-bold">próximos orçamentos</span> criados a partir de agora.
            </p>
            <div className="flex flex-col gap-3">
              <button onClick={handleSave} className="w-full bg-blue-600 text-white py-5 rounded-[20px] font-black uppercase text-xs tracking-widest active-press shadow-lg shadow-blue-100">Sim, Confirmar</button>
              <button onClick={() => setShowConfirm(false)} className="w-full bg-slate-100 text-slate-400 py-5 rounded-[20px] font-black uppercase text-xs tracking-widest active-press">Cancelar</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default SettingsView;
