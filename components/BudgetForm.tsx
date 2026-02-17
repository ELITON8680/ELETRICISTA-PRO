
import React, { useState } from 'react';
import { BudgetData, ProfessionalData, WorkType, WorkPattern, AppSettings, PricingMode, AdjustmentType, AppliedService } from '../types';
import { calculateBudget, formatCurrency, generateId, calculateServiceItemTotal } from '../utils';
import { SERVICE_CATALOG } from '../constants';
import MaterialsTable from './MaterialsTable';
import SignaturePad from './SignaturePad';
import { ArrowLeft, CheckCircle2, FileText, ClipboardList, Zap, Plus, Trash2, Edit2, ChevronDown, ChevronRight, Percent, Tag, Settings2, MapPin, Utensils, PlusCircle, PlusSquare, X } from 'lucide-react';

interface Props {
  budget: BudgetData;
  professional: ProfessionalData;
  settings: AppSettings;
  onUpdate: (budget: BudgetData) => void;
  onFinalize: (budget: BudgetData) => void;
  onCancel: () => void;
}

const BudgetForm: React.FC<Props> = ({ budget, professional, settings, onUpdate, onFinalize, onCancel }) => {
  const [step, setStep] = useState(1);
  const [expandedCategory, setExpandedCategory] = useState<string | null>(null);
  const [editingServiceId, setEditingServiceId] = useState<string | null>(null);
  
  // Estados para o novo formulário de adição rápida
  const [showQuickAdd, setShowQuickAdd] = useState<string | null>(null);
  const [quickName, setQuickName] = useState('');
  const [quickValue, setQuickValue] = useState('');
  const [quickUnit, setQuickUnit] = useState('unid');

  const totalSteps = 5;

  const updateField = (field: keyof BudgetData | 'client', value: any) => {
    let updated: BudgetData;
    if (field === 'client') {
      updated = { ...budget, client: { ...budget.client, ...value } };
    } else {
      updated = { ...budget, [field]: value } as BudgetData;
    }
    
    const calculated = calculateBudget(updated, professional, settings) as BudgetData;
    onUpdate(calculated);
  };

  const addService = (name: string, value: number, category: string, unit: string) => {
    const newService: AppliedService = {
      id: generateId(),
      name: name || 'Serviço Personalizado',
      category: category || 'Geral',
      unitValue: value || 0,
      unitType: unit || 'unid',
      quantity: 1,
      discountValue: 0,
      discountType: AdjustmentType.PERCENT,
      markupValue: 0,
      markupType: AdjustmentType.PERCENT,
      total: value || 0
    };
    
    const newServices = [...(budget.services || []), newService];
    updateField('services', newServices);
  };

  const handleQuickAddSubmit = (category: string) => {
    if (!quickName.trim()) {
      alert("Informe o nome do serviço.");
      return;
    }
    const val = Number(quickValue.replace(',', '.'));
    addService(quickName, isNaN(val) ? 0 : val, category, quickUnit);
    
    // Reset e Close
    setQuickName('');
    setQuickValue('');
    setQuickUnit('unid');
    setShowQuickAdd(null);
  };

  const removeService = (id: string) => {
    const filtered = (budget.services || []).filter(s => s.id !== id);
    updateField('services', filtered);
  };

  const updateServiceItem = (id: string, updates: Partial<AppliedService>) => {
    const updatedServices = (budget.services || []).map(s => {
      if (s.id === id) {
        const item = { ...s, ...updates };
        item.total = calculateServiceItemTotal(item);
        return item;
      }
      return s;
    });
    updateField('services', updatedServices);
  };

  const handleNext = () => step < totalSteps && setStep(step + 1);
  const handlePrev = () => step > 1 && setStep(step - 1);

  const handleFinalizeClick = () => {
    if (budget.pricingMode === PricingMode.HOURS && (!budget.hours || budget.hours <= 0)) {
      alert("Informe o tempo de serviço em horas.");
      return;
    }
    if (budget.pricingMode === PricingMode.SERVICES && (!budget.services || budget.services.length === 0)) {
      alert("Adicione pelo menos um serviço à lista.");
      return;
    }
    if (!budget.serviceDescription) {
      alert("Descreva os serviços na Proposta.");
      return;
    }
    onFinalize(budget);
  };

  return (
    <div className="max-w-md mx-auto space-y-6 pb-12">
      {/* Header with Progress */}
      <div className="flex items-center justify-between mb-2">
        <button onClick={onCancel} className="text-slate-400 p-2 active-press"><ArrowLeft size={24} /></button>
        <div className="flex-1 px-4">
          <div className="h-1.5 w-full bg-slate-200 rounded-full overflow-hidden">
            <div 
              className="h-full bg-blue-600 transition-all duration-300" 
              style={{ width: `${(step / totalSteps) * 100}%` }}
            />
          </div>
        </div>
        <span className="text-xs font-bold text-slate-400">{step}/{totalSteps}</span>
      </div>

      {/* Step 1: Client Info */}
      {step === 1 && (
        <div className="space-y-4 animate-in fade-in slide-in-from-right-4 duration-300">
          <h2 className="text-2xl font-extrabold text-slate-800">Dados do Cliente</h2>
          <div className="space-y-4 bg-white p-6 rounded-3xl shadow-sm border border-slate-100">
            <Input label="Nome completo" value={budget.client.name} onChange={v => updateField('client', { name: v })} placeholder="Ex: João Silva" />
            <Input label="Telefone / WhatsApp" value={budget.client.phone} onChange={v => updateField('client', { phone: v })} placeholder="(00) 00000-0000" />
            <Input label="Endereço da Obra" value={budget.client.address} onChange={v => updateField('client', { address: v })} placeholder="Rua, Número, Bairro" />
          </div>
        </div>
      )}

      {/* Step 2: Charging Area */}
      {step === 2 && (
        <div className="space-y-4 animate-in fade-in slide-in-from-right-4 duration-300">
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-extrabold text-slate-800">Cobrança</h2>
            <div className="flex bg-slate-100 p-1 rounded-xl">
               <button 
                 onClick={() => updateField('pricingMode', PricingMode.HOURS)}
                 className={`px-3 py-1.5 rounded-lg text-[10px] font-black uppercase tracking-wider transition-all ${budget.pricingMode === PricingMode.HOURS ? 'bg-white text-blue-600 shadow-sm' : 'text-slate-400'}`}
               >Horas</button>
               <button 
                 onClick={() => updateField('pricingMode', PricingMode.SERVICES)}
                 className={`px-3 py-1.5 rounded-lg text-[10px] font-black uppercase tracking-wider transition-all ${budget.pricingMode === PricingMode.SERVICES ? 'bg-white text-blue-600 shadow-sm' : 'text-slate-400'}`}
               >Lista</button>
            </div>
          </div>

          {budget.pricingMode === PricingMode.HOURS ? (
            <div className="space-y-4 bg-white p-6 rounded-3xl shadow-sm border border-slate-100">
              <Input label="Horas Estimadas" type="number" value={budget.hours} onChange={v => updateField('hours', Number(v))} />
              <div className="p-4 bg-blue-50 rounded-2xl">
                 <p className="text-[10px] text-blue-700 font-bold uppercase tracking-widest mb-1">Cálculo Base</p>
                 <p className="text-sm font-black text-blue-900">{formatCurrency(budget.laborValue)}</p>
              </div>
            </div>
          ) : (
            <div className="space-y-4">
               {/* Predefined Categories */}
               {SERVICE_CATALOG.map(cat => (
                 <div key={cat.category} className="bg-white rounded-2xl border border-slate-100 overflow-hidden">
                    <button 
                      onClick={() => setExpandedCategory(expandedCategory === cat.category ? null : cat.category)}
                      className="w-full flex items-center justify-between p-4 bg-slate-50/50"
                    >
                      <span className="text-xs font-black text-slate-700 uppercase">{cat.category}</span>
                      {expandedCategory === cat.category ? <ChevronDown size={16} /> : <ChevronRight size={16} />}
                    </button>
                    {expandedCategory === cat.category && (
                      <div className="p-3 space-y-1">
                        {cat.items.map(item => (
                          <button 
                            key={item.name}
                            onClick={() => addService(item.name, item.value, cat.category, item.unit)}
                            className="w-full flex items-center justify-between p-3 rounded-xl hover:bg-blue-50 transition-colors group"
                          >
                            <div className="text-left">
                              <p className="text-sm font-bold text-slate-800">{item.name}</p>
                              <p className="text-[9px] text-slate-400 uppercase font-black">{formatCurrency(item.value)} / {item.unit}</p>
                            </div>
                            <Plus size={16} className="text-blue-500 group-active:scale-125 transition-transform" />
                          </button>
                        ))}

                        {/* Quick Add Form Space */}
                        {showQuickAdd === cat.category ? (
                          <div className="mt-4 p-4 bg-blue-50 rounded-2xl border-2 border-blue-200 animate-in zoom-in-95 duration-200">
                            <div className="flex justify-between items-center mb-3">
                               <span className="text-[10px] font-black text-blue-700 uppercase tracking-widest">Novo Item Customizado</span>
                               <button onClick={() => setShowQuickAdd(null)} className="text-blue-300 hover:text-blue-600"><X size={16}/></button>
                            </div>
                            <div className="space-y-3">
                               <input 
                                 className="w-full bg-white border border-blue-100 h-10 px-3 rounded-xl text-xs font-bold outline-none"
                                 placeholder="Nome do serviço..."
                                 value={quickName}
                                 onChange={e => setQuickName(e.target.value)}
                               />
                               <div className="grid grid-cols-2 gap-2">
                                  <input 
                                    className="w-full bg-white border border-blue-100 h-10 px-3 rounded-xl text-xs font-bold outline-none"
                                    placeholder="Preço (R$)"
                                    type="number"
                                    value={quickValue}
                                    onChange={e => setQuickValue(e.target.value)}
                                  />
                                  <input 
                                    className="w-full bg-white border border-blue-100 h-10 px-3 rounded-xl text-xs font-bold outline-none"
                                    placeholder="Unid (m, pt...)"
                                    value={quickUnit}
                                    onChange={e => setQuickUnit(e.target.value)}
                                  />
                               </div>
                               <button 
                                 onClick={() => handleQuickAddSubmit(cat.category)}
                                 className="w-full bg-blue-600 text-white h-12 rounded-xl font-black text-[10px] uppercase tracking-widest active-press"
                               >
                                 Adicionar ao Orçamento
                               </button>
                            </div>
                          </div>
                        ) : (
                          <div className="pt-2 px-1">
                            <button 
                              type="button"
                              onClick={(e) => { 
                                e.preventDefault(); 
                                e.stopPropagation(); 
                                setShowQuickAdd(cat.category);
                                setQuickName('');
                                setQuickValue('');
                                setQuickUnit('unid');
                              }}
                              className="w-full h-14 bg-blue-50/50 border-2 border-dashed border-blue-200 rounded-2xl flex items-center justify-center gap-2 text-blue-700 font-black text-[11px] uppercase active-press transition-all"
                            >
                              <PlusSquare size={18} /> ADICIONAR NESTA CATEGORIA
                            </button>
                          </div>
                        )}
                      </div>
                    )}
                 </div>
               ))}

               {/* Manual Addition OUTSIDE Categories */}
               <button 
                type="button"
                onClick={(e) => { 
                  e.preventDefault(); 
                  setShowQuickAdd('Geral');
                  setExpandedCategory(null);
                }}
                className="w-full p-4 bg-white border border-blue-100 rounded-2xl flex items-center justify-center gap-3 text-blue-600 font-black text-[11px] uppercase shadow-sm active-press"
               >
                 <PlusCircle size={20} /> Adicionar Serviço Personalizado
               </button>

               {/* Applied Services List */}
               <div className="space-y-3 pt-4">
                  <h3 className="text-xs font-black text-slate-400 uppercase tracking-widest px-1">Serviços Selecionados</h3>
                  {(budget.services || []).map(s => (
                    <div key={s.id} className="bg-white p-4 rounded-3xl border border-slate-100 shadow-sm space-y-3">
                      <div className="flex justify-between items-start">
                        <div className="flex-1">
                          <p className="text-sm font-black text-slate-900">{s.name}</p>
                          <p className="text-[10px] text-slate-400 font-bold uppercase">{s.category}</p>
                        </div>
                        <button onClick={() => removeService(s.id)} className="p-2 text-red-300 hover:text-red-500 transition-colors">
                          <Trash2 size={16} />
                        </button>
                      </div>
                      
                      <div className="grid grid-cols-2 gap-3">
                        <div className="space-y-1">
                           <label className="text-[9px] font-black text-slate-400 uppercase">Valor Un.</label>
                           <input 
                             type="number" 
                             className="w-full bg-slate-50 border-none rounded-xl h-10 px-3 text-sm font-bold text-slate-800"
                             value={s.unitValue === 0 || s.unitValue === undefined ? '' : s.unitValue}
                             onChange={e => updateServiceItem(s.id, { unitValue: Number(e.target.value) })}
                           />
                        </div>
                        <div className="space-y-1">
                           <label className="text-[9px] font-black text-slate-400 uppercase">Qtd ({s.unitType})</label>
                           <input 
                             type="number" 
                             className="w-full bg-slate-50 border-none rounded-xl h-10 px-3 text-sm font-bold text-slate-800"
                             value={s.quantity === 0 || s.quantity === undefined ? '' : s.quantity}
                             onChange={e => updateServiceItem(s.id, { quantity: Number(e.target.value) })}
                           />
                        </div>
                      </div>

                      {/* Adjustments */}
                      <div className="flex gap-2">
                         <button 
                           onClick={() => setEditingServiceId(editingServiceId === s.id ? null : s.id)}
                           className="flex-1 h-10 bg-slate-100 rounded-xl flex items-center justify-center gap-2 text-[10px] font-black uppercase text-slate-500 active-press transition-all"
                         >
                           <Settings2 size={14} /> Ajustes extras
                         </button>
                         <div className="flex items-center gap-2 px-4 bg-blue-50 rounded-xl h-10 border border-blue-100">
                           <span className="text-[10px] font-black text-blue-600 uppercase">Item:</span>
                           <span className="text-xs font-black text-blue-900">{formatCurrency(s.total)}</span>
                         </div>
                      </div>

                      {editingServiceId === s.id && (
                        <div className="p-4 bg-slate-50 rounded-2xl space-y-4 animate-in slide-in-from-top-2">
                           <div className="grid grid-cols-2 gap-4">
                              <div className="space-y-1">
                                 <label className="text-[9px] font-black text-slate-400 uppercase flex items-center gap-1"><Tag size={10}/> Desconto</label>
                                 <div className="flex bg-white rounded-xl border border-slate-200 overflow-hidden">
                                    <input 
                                      type="number" 
                                      className="flex-1 h-9 px-2 text-xs font-bold bg-transparent outline-none text-slate-800"
                                      value={s.discountValue === 0 || s.discountValue === undefined ? '' : s.discountValue}
                                      onChange={e => updateServiceItem(s.id, { discountValue: Number(e.target.value) })}
                                    />
                                    <button 
                                      onClick={() => updateServiceItem(s.id, { discountType: s.discountType === AdjustmentType.FIXED ? AdjustmentType.PERCENT : AdjustmentType.FIXED })}
                                      className="w-8 h-9 bg-slate-200 text-[10px] font-black"
                                    >{s.discountType}</button>
                                 </div>
                              </div>
                              <div className="space-y-1">
                                 <label className="text-[9px] font-black text-slate-400 uppercase flex items-center gap-1"><Zap size={10}/> Acréscimo</label>
                                 <div className="flex bg-white rounded-xl border border-slate-200 overflow-hidden">
                                    <input 
                                      type="number" 
                                      className="flex-1 h-9 px-2 text-xs font-bold bg-transparent outline-none text-slate-800"
                                      value={s.markupValue === 0 || s.markupValue === undefined ? '' : s.markupValue}
                                      onChange={e => updateServiceItem(s.id, { markupValue: Number(e.target.value) })}
                                    />
                                    <button 
                                      onClick={() => updateServiceItem(s.id, { markupType: s.markupType === AdjustmentType.FIXED ? AdjustmentType.PERCENT : AdjustmentType.FIXED })}
                                      className="w-8 h-9 bg-slate-200 text-[10px] font-black"
                                    >{s.markupType}</button>
                                 </div>
                              </div>
                           </div>
                        </div>
                      )}
                    </div>
                  ))}
                  {(!budget.services || budget.services.length === 0) && (
                    <div className="text-center py-12 bg-slate-50 rounded-[32px] border-2 border-dashed border-slate-100">
                       <Zap className="mx-auto text-slate-200 mb-3" size={32} />
                       <p className="text-[10px] font-black text-slate-300 uppercase tracking-widest">Nenhum serviço adicionado</p>
                    </div>
                  )}
               </div>
            </div>
          )}

          {/* Operational Costs Section */}
          <div className="space-y-3 pt-2">
            <h3 className="text-xs font-black text-slate-400 uppercase tracking-widest px-1">Custos Operacionais</h3>
            <div className="bg-white p-6 rounded-[32px] shadow-sm border border-slate-100 space-y-5">
              <CostInput 
                icon={<MapPin size={18} className="text-blue-500" />} 
                label="Deslocamento (R$)" 
                value={budget.travelCost} 
                onChange={v => updateField('travelCost', Number(v))} 
              />
              <CostInput 
                icon={<Utensils size={18} className="text-orange-500" />} 
                label="Alimentação (R$)" 
                value={budget.foodCost} 
                onChange={v => updateField('foodCost', Number(v))} 
              />
              <CostInput 
                icon={<PlusCircle size={18} className="text-emerald-500" />} 
                label="Adicional (R$)" 
                value={budget.additionalCost} 
                onChange={v => updateField('additionalCost', Number(v))} 
              />
            </div>
          </div>

          <div className="space-y-4 bg-white p-6 rounded-3xl shadow-sm border border-slate-100">
            <div className="grid grid-cols-2 gap-4">
              <Select label="Markup Obra" value={budget.workType} options={Object.values(WorkType)} onChange={v => updateField('workType', v)} />
              <Select label="Markup Complexidade" value={budget.workPattern} options={Object.values(WorkPattern)} onChange={v => updateField('workPattern', v)} />
            </div>
          </div>
        </div>
      )}

      {/* Step 3: Materials */}
      {step === 3 && (
        <div className="space-y-4 animate-in fade-in slide-in-from-right-4 duration-300">
          <h2 className="text-2xl font-extrabold text-slate-800">Materiais</h2>
          <MaterialsTable items={budget.materials} onChange={items => updateField('materials', items)} />
        </div>
      )}

      {/* Step 4: Proposal Details */}
      {step === 4 && (
        <div className="space-y-4 animate-in fade-in slide-in-from-right-4 duration-300">
          <h2 className="text-2xl font-extrabold text-slate-800">Detalhes da Proposta</h2>
          <div className="space-y-4 bg-white p-6 rounded-3xl shadow-sm border border-slate-100">
             <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-500 uppercase flex items-center gap-2">
                   <ClipboardList size={14} /> Descrição dos Serviços
                </label>
                <textarea 
                  className="w-full bg-slate-50 border border-slate-200 rounded-2xl p-4 text-slate-800 outline-none focus:ring-2 focus:ring-blue-500 transition-all font-medium"
                  rows={4}
                  placeholder="Descreva detalhadamente o que será feito..."
                  value={budget.serviceDescription}
                  onChange={e => updateField('serviceDescription', e.target.value)}
                />
             </div>
             <div className="grid grid-cols-2 gap-4">
                <Input label="Prazo (Dias/Horas)" value={budget.executionDeadline} onChange={v => updateField('executionDeadline', v)} placeholder="Ex: 5 dias" />
                <Input label="Validade da Proposta" value={budget.proposalValidity} onChange={v => updateField('proposalValidity', v)} />
             </div>
             <Input label="Pagamento" value={budget.paymentConditions} onChange={v => updateField('paymentConditions', v)} placeholder="Ex: PIX ou 2x Cartão" />
          </div>
        </div>
      )}

      {/* Step 5: Final Summary */}
      {step === 5 && (
        <div className="space-y-4 animate-in fade-in slide-in-from-right-4 duration-300">
          <h2 className="text-2xl font-extrabold text-slate-800">Finalizar Proposta</h2>
          
          <div className="bg-white p-8 rounded-[40px] shadow-xl border border-slate-100 text-center space-y-6">
            <div className="space-y-1">
              <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">Total da Proposta Comercial</p>
              <p className="text-4xl font-black text-slate-800">{formatCurrency(budget.finalTotal)}</p>
            </div>

            <div className="pt-2">
               <p className="text-sm font-bold text-slate-500 uppercase text-left mb-2">Assinatura do Cliente</p>
               <SignaturePad value={budget.signature} onChange={sig => updateField('signature', sig)} />
            </div>
          </div>

          <button onClick={handleFinalizeClick} className="w-full bg-blue-600 text-white py-5 rounded-[24px] font-black text-xl shadow-lg active-press transition-all flex items-center justify-center gap-3">
            <CheckCircle2 size={28} />
            CONCLUIR PROPOSTA
          </button>
        </div>
      )}

      {/* Nav Footer */}
      <div className="flex gap-4 pt-4">
        {step > 1 && (
          <button onClick={handlePrev} className="flex-1 bg-white text-slate-600 py-4 rounded-2xl font-bold border border-slate-200 active-press">
            Anterior
          </button>
        )}
        {step < totalSteps && (
          <button onClick={handleNext} className="flex-[2] bg-blue-600 text-white py-4 rounded-2xl font-bold active-press">
            Próximo Passo
          </button>
        )}
      </div>
    </div>
  );
};

const CostInput: React.FC<{ icon: React.ReactNode, label: string, value: any, onChange: (v: string) => void }> = ({ icon, label, value, onChange }) => (
  <div className="flex items-center justify-between gap-4">
    <div className="flex items-center gap-3">
      {icon}
      <span className="text-xs font-bold text-slate-600">{label}</span>
    </div>
    <input 
      type="number" 
      className="w-24 bg-slate-50 border border-slate-100 rounded-xl h-10 px-3 text-right font-black text-slate-800 outline-none"
      value={value === 0 || value === undefined ? '' : value}
      onChange={e => onChange(e.target.value)}
      placeholder=""
    />
  </div>
);

const Input: React.FC<{ label: string, value: any, onChange: (v: string) => void, placeholder?: string, type?: string }> = ({ label, value, onChange, placeholder, type = 'text' }) => (
  <div className="space-y-1.5 text-left">
    <label className="text-xs font-bold text-slate-500 uppercase">{label}</label>
    <input 
      type={type} 
      className="w-full bg-slate-50 border border-slate-200 rounded-2xl h-14 px-4 font-bold text-slate-800 outline-none focus:ring-2 focus:ring-blue-500 transition-all placeholder:font-normal" 
      value={value === 0 && type === 'number' ? '' : (value || '')} 
      onChange={e => onChange(e.target.value)} 
      placeholder={placeholder} 
    />
  </div>
);

const Select: React.FC<{ label: string, value: string, options: string[], onChange: (v: any) => void }> = ({ label, value, options, onChange }) => (
  <div className="space-y-1.5 text-left">
    <label className="text-xs font-bold text-slate-500 uppercase">{label}</label>
    <select className="w-full bg-slate-50 border border-slate-200 rounded-2xl h-14 px-4 font-bold text-slate-800 outline-none focus:ring-2 focus:ring-blue-500 transition-all appearance-none" value={value} onChange={e => onChange(e.target.value)}>
      {options.map(opt => <option key={opt} value={opt}>{opt}</option>)}
    </select>
  </div>
);

export default BudgetForm;
