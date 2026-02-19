
import React, { useState, useMemo } from 'react';
import { MaterialItem, AppSettings, CatalogMaterial } from '../types';
import { generateId, formatCurrency } from '../utils';
import { MATERIAL_CATALOG_BASE } from '../constants';
import { Plus, Trash2, Search, Zap, Package, PlusCircle, X } from 'lucide-react';

interface Props {
  items: MaterialItem[];
  settings: AppSettings;
  onChange: (items: MaterialItem[]) => void;
}

const MaterialsTable: React.FC<Props> = ({ items, settings, onChange }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [showCatalog, setShowCatalog] = useState(false);
  const [activeCat, setActiveCat] = useState('Tudo');

  // Estados para item avulso (Espaço branco para acréscimo personalizado)
  const [manualName, setManualName] = useState('');
  const [manualQty, setManualQty] = useState('1');
  const [manualPrice, setManualPrice] = useState('');
  const [manualAmp, setManualAmp] = useState('');

  const catalog = useMemo(() => {
    return [...(MATERIAL_CATALOG_BASE as CatalogMaterial[]), ...(settings?.customMaterials || [])];
  }, [settings?.customMaterials]);

  const categories = useMemo(() => {
    const cats = new Set(catalog.map(m => m.category));
    return ['Tudo', ...Array.from(cats).sort()];
  }, [catalog]);

  const filteredCatalog = useMemo(() => {
    let list = catalog;
    if (activeCat !== 'Tudo') {
      list = list.filter(m => m.category === activeCat);
    }
    if (searchTerm) {
      const q = searchTerm.toLowerCase();
      list = list.filter(m => m.name.toLowerCase().includes(q));
    }
    return list;
  }, [catalog, activeCat, searchTerm]);

  const addItem = (material: CatalogMaterial) => {
    const newItem: MaterialItem = {
      id: generateId(),
      description: material.name,
      category: material.category,
      unit: material.unit,
      quantity: 1,
      unitValue: material.defaultValue,
      total: material.defaultValue,
      amperage: ''
    };
    onChange([...items, newItem]);
    setSearchTerm('');
  };

  const addManualItem = () => {
    if (!manualName.trim()) {
      alert("Informe o nome do material.");
      return;
    }
    const qty = Number(manualQty) || 1;
    const price = Number(manualPrice.replace(',', '.')) || 0;
    
    const newItem: MaterialItem = {
      id: generateId(),
      description: manualName,
      category: 'Personalizado',
      unit: 'unid',
      quantity: qty,
      unitValue: price,
      total: qty * price,
      amperage: manualAmp
    };
    
    onChange([...items, newItem]);
    
    // Limpar formulário
    setManualName('');
    setManualQty('1');
    setManualPrice('');
    setManualAmp('');
  };

  const updateItem = (id: string, field: keyof MaterialItem, value: any) => {
    const newItems = items.map(item => {
      if (item.id === id) {
        const updated = { ...item, [field]: value };
        const q = Number(updated.quantity) || 0;
        const uv = Number(updated.unitValue) || 0;
        updated.total = q * uv;
        return updated;
      }
      return item;
    });
    onChange(newItems);
  };

  const removeItem = (id: string) => onChange(items.filter(i => i.id !== id));

  const totalMaterials = items.reduce((acc, i) => acc + (i.total || 0), 0);

  return (
    <div className="space-y-6">
      {/* Botão de Catálogo */}
      <button 
        onClick={() => setShowCatalog(true)}
        className="w-full h-16 bg-blue-600 text-white rounded-[24px] flex items-center justify-center gap-3 font-black uppercase tracking-widest text-sm shadow-xl active-press"
      >
        <Package size={22} />
        Catálogo de Materiais
      </button>

      {/* Espaço Branco para Item Personalizado */}
      <div className="bg-white p-6 rounded-[32px] border-2 border-dashed border-slate-200 space-y-4">
        <div className="flex items-center gap-2 mb-2">
          <PlusCircle size={18} className="text-blue-500" />
          <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Acrescentar Item Personalizado</h3>
        </div>
        <div className="space-y-3">
          <input 
            className="w-full bg-slate-50 border-none rounded-xl h-12 px-4 text-sm font-bold text-slate-800 outline-none"
            placeholder="Nome do material (ex: Cabo Flex 2.5mm)"
            value={manualName}
            onChange={e => setManualName(e.target.value)}
          />
          <div className="grid grid-cols-3 gap-2">
            <div className="space-y-1">
              <label className="text-[8px] font-black text-slate-400 uppercase text-center block">Qtd</label>
              <input 
                type="number"
                className="w-full bg-slate-50 border-none rounded-xl h-12 px-3 text-center text-xs font-bold"
                placeholder="Qtd"
                value={manualQty}
                onChange={e => setManualQty(e.target.value)}
              />
            </div>
            <div className="space-y-1">
              <label className="text-[8px] font-black text-slate-400 uppercase text-center block">Amp</label>
              <input 
                className="w-full bg-slate-50 border-none rounded-xl h-12 px-3 text-center text-xs font-bold"
                placeholder="Amp"
                value={manualAmp}
                onChange={e => setManualAmp(e.target.value)}
              />
            </div>
            <div className="space-y-1">
              <label className="text-[8px] font-black text-slate-400 uppercase text-center block">Valor Un.</label>
              <input 
                type="number"
                className="w-full bg-slate-50 border-none rounded-xl h-12 px-3 text-center text-xs font-bold"
                placeholder="R$ Unit."
                value={manualPrice}
                onChange={e => setManualPrice(e.target.value)}
              />
            </div>
          </div>
          <button 
            onClick={addManualItem}
            className="w-full bg-blue-50 text-blue-600 h-12 rounded-xl font-black text-[10px] uppercase tracking-widest flex items-center justify-center gap-2 active-press"
          >
            <Plus size={16} /> Adicionar à Lista
          </button>
        </div>
      </div>

      {/* Lista de Itens Selecionados */}
      <div className="space-y-4">
        <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-widest px-2">Itens no Orçamento</h3>
        {items.map((item) => (
          <div key={item.id} className="bg-white p-5 rounded-[32px] border border-slate-100 premium-shadow space-y-4">
             <div className="flex justify-between items-start">
                <div className="flex-1 min-w-0">
                  <p className="font-black text-slate-800 text-sm truncate">{item.description}</p>
                  <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest mt-0.5">{item.category}</p>
                </div>
                <button onClick={() => removeItem(item.id)} className="p-2 text-red-200 hover:text-red-500 active-press">
                  <Trash2 size={18} />
                </button>
             </div>
             
             {/* Grid de 4 Colunas conforme solicitado */}
             <div className="grid grid-cols-4 gap-2">
                <div className="space-y-1">
                  <label className="text-[8px] font-black text-slate-400 uppercase text-center block">Qtd</label>
                  <input 
                    type="number"
                    className="w-full bg-slate-50 border-none rounded-xl h-10 px-1 text-center font-black text-slate-800 text-xs"
                    value={item.quantity === 0 ? '' : item.quantity}
                    onChange={e => updateItem(item.id, 'quantity', Number(e.target.value))}
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-[8px] font-black text-slate-400 uppercase text-center block">Amp</label>
                  <input 
                    type="text"
                    className="w-full bg-slate-50 border-none rounded-xl h-10 px-1 text-center font-black text-blue-500 text-xs uppercase"
                    value={item.amperage || ''}
                    placeholder="--"
                    onChange={e => updateItem(item.id, 'amperage', e.target.value)}
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-[8px] font-black text-slate-400 uppercase text-center block">Unit.</label>
                  <input 
                    type="number"
                    className="w-full bg-slate-50 border-none rounded-xl h-10 px-1 text-center font-black text-slate-800 text-xs"
                    value={item.unitValue === 0 ? '' : item.unitValue}
                    onChange={e => updateItem(item.id, 'unitValue', Number(e.target.value))}
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-[8px] font-black text-slate-400 uppercase text-center block">Total</label>
                  <div className="w-full bg-emerald-50 rounded-xl h-10 flex items-center justify-center font-black text-emerald-700 text-[10px]">
                    {formatCurrency(item.total).replace('R$', '')}
                  </div>
                </div>
             </div>
          </div>
        ))}

        {items.length === 0 && (
          <div className="text-center py-12 bg-slate-50 rounded-[40px] border-2 border-dashed border-slate-100">
             <Package size={24} className="text-slate-200 mx-auto mb-2" />
             <p className="text-[9px] font-black text-slate-300 uppercase tracking-widest">Nenhum item adicionado</p>
          </div>
        )}
      </div>

      {/* Resumo Financeiro de Materiais */}
      <div className="bg-slate-900 rounded-[32px] p-6 shadow-xl flex justify-between items-center text-white">
        <div>
          <p className="text-[10px] font-black uppercase tracking-[0.2em] opacity-50 mb-1">Total Materiais</p>
          <p className="text-2xl font-[900] tracking-tight">{formatCurrency(totalMaterials)}</p>
        </div>
        <div className="bg-blue-600 p-3 rounded-2xl shadow-lg shadow-blue-500/20">
          <Zap size={24} strokeWidth={3} />
        </div>
      </div>

      {/* Modal do Catálogo */}
      {showCatalog && (
        <div className="fixed inset-0 bg-slate-900/90 backdrop-blur-xl z-[70] flex flex-col pt-12">
          <div className="bg-white flex-1 rounded-t-[48px] p-6 overflow-hidden flex flex-col">
            <div className="flex justify-between items-center mb-6">
               <h3 className="text-xl font-black text-slate-900 tracking-tight uppercase">Catálogo Geral</h3>
               <button onClick={() => setShowCatalog(false)} className="bg-slate-100 p-3 rounded-2xl active-press"><X size={20} /></button>
            </div>
            
            <div className="space-y-4 mb-6">
               <div className="bg-slate-50 border border-slate-100 rounded-[20px] h-14 px-5 flex items-center gap-4">
                 <Search size={18} className="text-blue-500" />
                 <input className="flex-1 bg-transparent border-none outline-none font-bold text-slate-800 placeholder:text-slate-300" placeholder="Pesquisar no catálogo..." value={searchTerm} onChange={e => setSearchTerm(e.target.value)} />
               </div>
               <div className="flex gap-2 overflow-x-auto no-scrollbar pb-2">
                 {categories.map(cat => (
                   <button key={cat} onClick={() => setActiveCat(cat)} className={`whitespace-nowrap px-5 h-9 rounded-full text-[9px] font-black uppercase tracking-widest transition-all ${activeCat === cat ? 'bg-blue-600 text-white shadow-lg' : 'bg-slate-100 text-slate-400'}`}>
                     {cat}
                   </button>
                 ))}
               </div>
            </div>

            <div className="flex-1 overflow-y-auto no-scrollbar space-y-3 pb-8">
               {filteredCatalog.map(m => (
                 <button 
                  key={m.id} 
                  onClick={() => { addItem(m); setShowCatalog(false); }}
                  className="w-full bg-slate-50/50 p-4 rounded-3xl flex items-center justify-between border border-transparent active:border-blue-200 active:bg-blue-50 transition-all text-left"
                 >
                   <div className="min-w-0 pr-4">
                     <p className="font-bold text-slate-800 text-sm truncate">{m.name}</p>
                     <p className="text-[9px] font-black text-slate-400 uppercase mt-0.5">{m.category}</p>
                   </div>
                   <div className="bg-white px-3 py-2 rounded-xl text-xs font-black text-blue-600 shadow-sm border border-slate-100 shrink-0">
                     {formatCurrency(m.defaultValue)}
                   </div>
                 </button>
               ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default MaterialsTable;
