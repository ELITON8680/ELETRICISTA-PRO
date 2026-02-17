
import React from 'react';
import { ProfessionalData } from '../types';
import SignaturePad from './SignaturePad';
import { User, Phone, Briefcase, Wallet, Upload, Save, CheckCircle, ShieldCheck, BadgeCheck, PenTool } from 'lucide-react';

interface Props {
  professional: ProfessionalData;
  onUpdate: (data: ProfessionalData) => void;
}

const Profile: React.FC<Props> = ({ professional, onUpdate }) => {
  const [tempData, setTempData] = React.useState(professional);
  const [saved, setSaved] = React.useState(false);

  const handleSave = () => {
    onUpdate(tempData);
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  const handleLogoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => setTempData({ ...tempData, logo: reader.result as string });
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className="space-y-8 pb-10 animate-page">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-3xl font-[900] text-slate-900 tracking-tight">Perfil</h2>
          <p className="text-slate-400 text-sm font-semibold">Sua identidade profissional</p>
        </div>
        <div className="flex flex-col items-end gap-1">
          <div className="bg-emerald-50 text-emerald-600 p-3 rounded-2xl border border-emerald-100">
            <ShieldCheck size={24} />
          </div>
          <span className="text-[10px] font-black text-slate-300 uppercase tracking-tighter">v1.0.0 Stable</span>
        </div>
      </div>

      <div className="bg-white p-10 rounded-[48px] premium-shadow border border-slate-100 flex flex-col items-center gap-6 relative overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-2 fintech-gradient"></div>
        <div className="relative group">
          <div className="w-36 h-36 rounded-[40px] bg-slate-50 border-4 border-dashed border-slate-100 flex items-center justify-center overflow-hidden transition-all group-hover:border-blue-200">
            {tempData.logo ? (
              <img src={tempData.logo} alt="Logo" className="w-full h-full object-contain p-4" />
            ) : (
              <Upload className="text-slate-200" size={40} />
            )}
          </div>
          <input type="file" accept="image/*" className="absolute inset-0 opacity-0 cursor-pointer" onChange={handleLogoUpload} />
          <div className="absolute -bottom-3 -right-3 bg-blue-600 text-white p-3 rounded-2xl shadow-xl border-4 border-white active-press">
             <Upload size={18} strokeWidth={3} />
          </div>
        </div>
        <div className="text-center">
          <p className="text-sm font-black text-slate-900 uppercase tracking-widest flex items-center justify-center gap-2">
            Identidade Visual <BadgeCheck size={16} className="text-blue-500" />
          </p>
          <p className="text-xs text-slate-400 font-semibold mt-1">Logo aparecerá em todas as Propostas</p>
        </div>
      </div>

      <div className="bg-white p-8 rounded-[40px] premium-shadow border border-slate-100 space-y-6">
        <ProfileInput icon={<User size={18} />} label="Nome Completo" value={tempData.name} onChange={v => setTempData({ ...tempData, name: v })} placeholder="Ex: João Souza" />
        <ProfileInput icon={<Briefcase size={18} />} label="Especialidade" value={tempData.profession} onChange={v => setTempData({ ...tempData, profession: v })} />
        <ProfileInput icon={<Phone size={18} />} label="WhatsApp para Contato" value={tempData.phone} onChange={v => setTempData({ ...tempData, phone: v })} placeholder="(00) 00000-0000" />
        <ProfileInput icon={<Wallet size={18} />} label="Salário Base Desejado (R$)" type="number" value={tempData.baseSalary} onChange={v => setTempData({ ...tempData, baseSalary: Number(v) })} />
        
        {/* Espaço para Assinatura do Profissional */}
        <div className="space-y-4 pt-4 border-t border-slate-50">
           <div className="flex items-center gap-2 px-1">
             <PenTool size={18} className="text-blue-600" />
             <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Sua Assinatura Profissional</label>
           </div>
           <div className="bg-slate-50 p-2 rounded-3xl border border-slate-100">
             <SignaturePad value={tempData.signature} onChange={sig => setTempData({ ...tempData, signature: sig })} />
           </div>
           <p className="text-[10px] text-slate-400 font-bold px-4 leading-relaxed italic">
             Esta assinatura será utilizada automaticamente na Proposta e no Recibo.
           </p>
        </div>

        <div className="p-5 bg-blue-50/50 rounded-3xl border border-blue-100/50 flex gap-4">
          <div className="bg-blue-600 text-white p-2 rounded-xl h-fit shrink-0"><Wallet size={16} /></div>
          <p className="text-[11px] text-blue-900/70 font-bold leading-relaxed">
            Seu salário base mensal é a base para o cálculo técnico interno de mão de obra (Custo/220h).
          </p>
        </div>

        <button 
          onClick={handleSave}
          className={`w-full py-6 rounded-[28px] font-black text-lg flex items-center justify-center gap-3 shadow-2xl transition-all active-press ${
            saved ? 'bg-emerald-500 text-white shadow-emerald-100' : 'bg-blue-600 text-white shadow-blue-100'
          }`}
        >
          {saved ? <CheckCircle size={24} strokeWidth={3} /> : <Save size={24} strokeWidth={3} />}
          {saved ? 'DADOS ATUALIZADOS' : 'SALVAR CONFIGURAÇÕES'}
        </button>
      </div>

      <div className="text-center pb-4">
        <p className="text-[10px] font-black text-slate-300 uppercase tracking-widest">Orçamento Elétrico Pro • Versão Final v1.0.0</p>
      </div>
    </div>
  );
};

const ProfileInput = ({ icon, label, value, onChange, placeholder, type = 'text' }: { icon: React.ReactNode, label: string, value: any, onChange: (v: string) => void, placeholder?: string, type?: string }) => (
  <div className="space-y-2">
    <div className="flex items-center gap-2 px-1">
      <div className="text-blue-600">{icon}</div>
      <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{label}</label>
    </div>
    <input 
      type={type}
      className="w-full bg-slate-50 border border-slate-100 rounded-[20px] h-14 px-5 text-slate-900 font-bold focus:ring-4 focus:ring-blue-500/10 focus:bg-white outline-none transition-all placeholder:text-slate-300"
      value={value}
      onChange={e => onChange(e.target.value)}
      placeholder={placeholder}
    />
  </div>
);

export default Profile;
