
import React, { useState, useMemo } from 'react';
import { CatalogMaterial, AppSettings } from '../types';
import { MATERIAL_CATALOG_BASE } from '../constants';
import { Search, Plus, Trash2, Filter, Package, Tag, Layers, CheckCircle2, X } from 'lucide-react';
import { generateId, formatCurrency } from '../utils';

interface Props {
  settings: AppSettings;
  onUpdateSettings: (settings: AppSettings) => void;
}

const MaterialsManager: React.FC<Props> = ({ settings, onUpdateSettings }) => {
  const [search, setSearch] = useState('');
  const [activeCategory, setActiveCategory] = useState<string>('Tudo');
  const [showAddForm, setShowAddForm] = useState(false);
  
  // New Item State
  const [newName, setNewName] = useState('');
  const [newCat, setNewCat] = useState('Geral');
  const [newUnit, setNewUnit] = useState('unid');
  const [newVal, setNewVal] = useState('');

  const catalog = useMemo(() => {
    return [...MATERIAL_CATALOG_BASE, ...settings.customMaterials];
  }, [settings.customMaterials]);

  const categories = useMemo(() => {
    const cats = new Set(catalog.map(m => m.category));
    return ['Tudo', ...Array.from(cats).sort()];
  }, [catalog]);

  const filteredItems = useMemo(() => {
    let list = catalog;
    if (activeCategory !== 'Tudo') {
      list = list.filter(m => m.category === activeCategory);
    }
    if (search) {
      const q = search.toLowerCase();
      list = list.filter(m => m.name.toLowerCase().includes(q));
    }
    return list.sort((a, b) => a.name.localeCompare(b.name));
  }, [catalog, activeCategory, search]);

  const handleAddCustom = () => {
    if (!newName.trim() || !newVal) {
      alert("Preencha o nome e valor do material.");
      return;
    }
    const newItem: CatalogMaterial = {
      id: generateId(),
      name: newName,
      category: newCat,
      unit: newUnit,
      defaultValue: Number(newVal),
      isCustom: true
    };
    onUpdateSettings({
      ...settings,
      customMaterials: [...settings.customMaterials, newItem]
    });
    setShowAddForm(false);
    setNewName('');
    setNewVal('');
  };

  const removeCustom = (id: string) => {
    if (confirm("Deseja excluir este material do seu catálogo pessoal?")) {
      onUpdateSettings({
        ...settings,
        customMaterials: settings.customMaterials.filter(m => m.id !== id)
      });
    }
  };

  return (
    <div className="space-y-6 pb-12 animate-page">
      <div className="flex justify-between items-end">
        <div>
          <h2 className="text-3xl font-[900] text-slate-900 tracking-tight leading-none">Catálogo</h2>
          <p className="text-slate-400 text-sm font-semibold mt-1">Materiais e Insumos</p>
        </div>
        <button 
          onClick={() => setShowAddForm(true)}
          className="bg-blue-600 text-white p-4 rounded-2xl premium-shadow active-press"
        >
          <Plus size={24} strokeWidth={3} />
        </button>
      </div>

      <div className="space-y-4">
        <div className="bg-white/80 backdrop-blur-xl border border-slate-200 rounded-[24px] h-16 px-6 flex items-center gap-4 shadow-xl shadow-slate-200/40 focus-within:ring-4 focus-within:ring-blue-500/10 transition-all">
          <Search className="text-blue-600" size={20} strokeWidth={3} />
          <input 
            type="text" 
            className="flex-1 bg-transparent border-none outline-none font-bold text-slate-800 placeholder:text-slate-300"
            placeholder="Pesquisar material..."
            value={search}
            onChange={e => setSearch(e.target.value)}
          />
        </div>

        <div className="flex gap-2 overflow-x-auto no-scrollbar pb-2">
          {categories.map(cat => (
            <button 
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={`whitespace-nowrap px-5 h-10 rounded-full text-[10px] font-black uppercase tracking-widest border transition-all ${
                activeCategory === cat ? 'bg-slate-900 text-white border-slate-900 shadow-lg' : 'bg-white text-slate-400 border-slate-100'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      <div className="grid gap-4">
        {filteredItems.map(item => (
          <div key={item.id || item.name} className="bg-white p-5 rounded-[32px] border border-slate-100 premium-shadow flex items-center justify-between group">
            <div className="flex items-center gap-4 flex-1 min-w-0">
               <div className="bg-slate-50 w-12 h-12 rounded-2xl flex items-center justify-center text-slate-400 shrink-0">
                 <Package size={24} />
               </div>
               <div className="min-w-0">
                 <p className="font-black text-slate-800 text-sm truncate pr-2">{item.name}</p>
                 <div className="flex items-center gap-2 mt-1">
                   <span className="text-[9px] font-black text-blue-600 uppercase bg-blue-50 px-2 py-0.5 rounded-full">{item.category}</span>
                   <span className="text-[9px] font-bold text-slate-400 uppercase tracking-widest">{item.unit}</span>
                 </div>
               </div>
            </div>
            <div className="flex items-center gap-4">
               <div className="text-right">
                 <p className="text-[8px] font-black text-slate-300 uppercase mb-0.5">Preço Base</p>
                 <p className="text-sm font-black text-slate-700">{formatCurrency(item.defaultValue)}</p>
               </div>
               {item.isCustom && (
                 <button onClick={() => removeCustom(item.id)} className="p-2 text-red-200 hover:text-red-500 active-press">
                   <Trash2 size={18} />
                 </button>
               )}
            </div>
          </div>
        ))}

        {filteredItems.length === 0 && (
          <div className="text-center py-24 bg-slate-50 rounded-[48px] border-2 border-dashed border-slate-200">
             <Filter className="text-slate-200 mx-auto mb-4" size={48} />
             <p className="text-xs font-black text-slate-300 uppercase tracking-widest">Nenhum material encontrado</p>
          </div>
        )}
      </div>

      {showAddForm && (
        <div className="fixed inset-0 bg-slate-900/80 backdrop-blur-md z-50 flex items-center justify-center p-6">
          <div className="bg-white rounded-[40px] p-8 max-w-md w-full shadow-2xl animate-in zoom-in-95 duration-200">
            <div className="flex justify-between items-center mb-8">
               <h3 className="text-xl font-[900] text-slate-900 uppercase tracking-tight">Novo Material</h3>
               <button onClick={() => setShowAddForm(false)} className="text-slate-300 hover:text-slate-900"><X size={24} /></button>
            </div>
            <div className="space-y-4">
               <div className="space-y-1">
                 <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest px-1">Nome do Material</label>
                 <input className="w-full bg-slate-50 border border-slate-100 rounded-2xl h-14 px-5 font-bold text-slate-800 outline-none" value={newName} onChange={e => setNewName(e.target.value)} placeholder="Ex: Cabo 25mm" />
               </div>
               <div className="grid grid-cols-2 gap-4">
                 <div className="space-y-1">
                   <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest px-1">Categoria</label>
                   <select className="w-full bg-slate-50 border border-slate-100 rounded-2xl h-14 px-4 font-bold text-slate-800 outline-none appearance-none" value={newCat} onChange={e => setNewCat(e.target.value)}>
                     <option>Geral</option>
                     <option>Infraestrutura</option>
                     <option>Iluminação</option>
                     <option>Proteção</option>
                     <option>Automação</option>
                   </select>
                 </div>
                 <div className="space-y-1">
                   <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest px-1">Unidade</label>
                   <input className="w-full bg-slate-50 border border-slate-100 rounded-2xl h-14 px-5 font-bold text-slate-800 outline-none" value={newUnit} onChange={e => setNewUnit(e.target.value)} placeholder="m, unid..." />
                 </div>
               </div>
               <div className="space-y-1">
                 <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest px-1">Preço Sugerido (R$)</label>
                 <input type="number" className="w-full bg-slate-50 border border-slate-100 rounded-2xl h-14 px-5 font-bold text-slate-800 outline-none" value={newVal} onChange={e => setNewVal(e.target.value)} placeholder="0.00" />
               </div>
               <button 
                 onClick={handleAddCustom}
                 className="w-full bg-blue-600 text-white h-16 rounded-[24px] font-black uppercase tracking-widest text-sm shadow-xl shadow-blue-100 active-press mt-4"
               >
                 Adicionar ao Meu Catálogo
               </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default MaterialsManager;
