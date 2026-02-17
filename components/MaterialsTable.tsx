
import React, { useState } from 'react';
import { MaterialItem } from '../types';
import { generateId, formatCurrency } from '../utils';
import { ESSENTIAL_MATERIALS } from '../constants';
import { Plus, Trash2, Search, Zap } from 'lucide-react';

interface Props {
  items: MaterialItem[];
  onChange: (items: MaterialItem[]) => void;
}

const MaterialsTable: React.FC<Props> = ({ items, onChange }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [showSuggestions, setShowSuggestions] = useState(false);

  const addItem = (description: string = '') => {
    const newItem: MaterialItem = {
      id: generateId(),
      description,
      amperage: '',
      quantity: undefined as any,
      unitValue: undefined as any,
      total: 0
    };
    onChange([...items, newItem]);
    setSearchTerm('');
    setShowSuggestions(false);
  };

  const updateItem = (id: string, field: keyof MaterialItem, value: any) => {
    const newItems = items.map(item => {
      if (item.id === id) {
        const updated = { ...item, [field]: value };
        const q = updated.quantity || 0;
        const uv = updated.unitValue || 0;
        updated.total = q * uv;
        return updated;
      }
      return item;
    });
    onChange(newItems);
  };

  const removeItem = (id: string) => onChange(items.filter(i => i.id !== id));

  const filteredSuggestions = ESSENTIAL_MATERIALS.filter(m => 
    m.toLowerCase().includes(searchTerm.toLowerCase()) && 
    !items.some(existing => existing.description === m)
  );

  return (
    <div className="space-y-6">
      <div className="relative">
        <div className="bg-white premium-shadow border border-slate-100 rounded-[24px] h-16 px-5 flex items-center gap-4 focus-within:ring-4 focus-within:ring-blue-500/10 transition-all">
          <Search className="text-blue-600" size={22} strokeWidth={2.5} />
          <input 
            type="text" 
            className="flex-1 bg-transparent border-none outline-none font-bold text-slate-800 placeholder:text-slate-300 placeholder:font-medium"
            placeholder="Buscar material..."
            value={searchTerm}
            onChange={e => { setSearchTerm(e.target.value); setShowSuggestions(true); }}
            onFocus={() => setShowSuggestions(true)}
          />
          {searchTerm && (
            <button onClick={() => addItem(searchTerm)} className="bg-blue-600 text-white text-[10px] font-black px-4 py-2 rounded-xl active-press uppercase tracking-widest">
              Add
            </button>
          )}
        </div>

        {showSuggestions && searchTerm && filteredSuggestions.length > 0 && (
          <div className="absolute top-full left-0 right-0 mt-3 bg-white border border-slate-100 rounded-[24px] premium-shadow z-40 max-h-72 overflow-y-auto no-scrollbar ring-8 ring-black/5">
            {filteredSuggestions.map(m => (
              <button 
                key={m}
                onClick={() => addItem(m)}
                className="w-full text-left px-6 py-5 border-b border-slate-50 last:border-none hover:bg-slate-50 transition-colors font-bold text-slate-700 flex items-center justify-between"
              >
                {m}
                <Plus size={16} className="text-blue-500" />
              </button>
            ))}
          </div>
        )}
      </div>

      <div className="bg-white rounded-[32px] border border-slate-100 premium-shadow overflow-hidden">
        <div className="overflow-x-auto no-scrollbar">
          <table className="w-full text-left border-collapse">
            <thead className="bg-slate-50/50 text-[10px] uppercase font-black text-slate-400">
              <tr>
                <th className="pl-6 py-4 min-w-[160px]">Descrição</th>
                <th className="px-3 py-4 text-center">Amp</th>
                <th className="px-3 py-4 text-center">Qtd</th>
                <th className="px-3 py-4 text-right">Unitário</th>
                <th className="pr-6 py-4"></th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {items.map((item) => (
                <tr key={item.id} className="hover:bg-slate-50/50 transition-colors">
                  <td className="pl-6 py-4">
                    <input 
                      type="text" 
                      className="w-full bg-transparent outline-none font-bold text-slate-800 placeholder:text-slate-200"
                      value={item.description}
                      onChange={e => updateItem(item.id, 'description', e.target.value)}
                      placeholder="Material..."
                    />
                  </td>
                  <td className="px-3 py-4">
                    <div className="bg-blue-50 text-blue-700 rounded-lg px-2 py-1">
                      <input 
                        type="text" 
                        className="w-full bg-transparent text-center outline-none font-black text-[10px] uppercase"
                        value={item.amperage}
                        onChange={e => updateItem(item.id, 'amperage', e.target.value)}
                        placeholder="--"
                      />
                    </div>
                  </td>
                  <td className="px-3 py-4">
                    <input 
                      type="number" 
                      className="w-full bg-transparent text-center outline-none font-black text-slate-900"
                      value={item.quantity === undefined || item.quantity === null ? '' : item.quantity}
                      onChange={e => updateItem(item.id, 'quantity', e.target.value === '' ? undefined : Number(e.target.value))}
                    />
                  </td>
                  <td className="px-3 py-4">
                    <input 
                      type="number" 
                      className="w-full bg-transparent text-right outline-none font-black text-emerald-600"
                      value={item.unitValue === undefined || item.unitValue === null ? '' : item.unitValue}
                      onChange={e => updateItem(item.id, 'unitValue', e.target.value === '' ? undefined : Number(e.target.value))}
                    />
                  </td>
                  <td className="pr-6 py-4 text-right">
                    <button onClick={() => removeItem(item.id)} className="text-slate-300 hover:text-red-500 active-press transition-colors p-2">
                      <Trash2 size={16} />
                    </button>
                  </td>
                </tr>
              ))}
              {items.length === 0 && (
                <tr>
                  <td colSpan={5} className="px-8 py-20 text-center">
                    <div className="bg-slate-50 w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-4">
                      <Zap className="text-slate-200" size={32} />
                    </div>
                    <p className="text-sm font-black text-slate-400 uppercase tracking-widest">Nenhum Material</p>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      <div className="bg-emerald-600 rounded-[24px] p-6 shadow-xl shadow-emerald-100 flex justify-between items-center text-white">
        <div>
          <p className="text-[10px] font-black uppercase tracking-[0.2em] opacity-60 mb-1">Subtotal Materiais</p>
          <p className="text-2xl font-[900] tracking-tight">
            {formatCurrency(items.reduce((acc, i) => acc + (i.total || 0), 0))}
          </p>
        </div>
        <div className="bg-white/20 p-3 rounded-2xl">
          <Zap size={24} strokeWidth={3} />
        </div>
      </div>
    </div>
  );
};

export default MaterialsTable;
