
import React from 'react';
import { ArrowLeft, GraduationCap, ExternalLink, Play, BookOpen, Clock, BadgeCheck } from 'lucide-react';

interface Props {
  onBack: () => void;
}

const COURSES = [
  {
    title: "NR-10 Básico",
    category: "Segurança",
    duration: "40h",
    description: "Segurança em Instalações e Serviços em Eletricidade. Obrigatório para todos os profissionais da área.",
    status: "Essencial"
  },
  {
    title: "Leitura de Projetos",
    category: "Técnico",
    duration: "20h",
    description: "Aprenda a interpretar plantas baixas, diagramas unifilares e multifilares de baixa tensão.",
    status: "Recomendado"
  },
  {
    title: "Sistemas Fotovoltaicos",
    category: "Inovação",
    duration: "60h",
    description: "Instalação e manutenção de painéis solares e inversores. O mercado que mais cresce no Brasil.",
    status: "Alta Demanda"
  },
  {
    title: "Automação Residencial",
    category: "Técnico",
    duration: "35h",
    description: "Configuração de casas inteligentes, dispositivos IoT, Alexa, Google Home e automação de iluminação.",
    status: "Diferencial"
  },
  {
    title: "Comandos Elétricos",
    category: "Industrial",
    duration: "80h",
    description: "Painéis de comando, contatores, relés térmicos e lógica de acionamento de motores.",
    status: "Avançado"
  }
];

const Courses: React.FC<Props> = ({ onBack }) => {
  return (
    <div className="space-y-8 pb-10 animate-in fade-in duration-300">
      <div className="flex items-center gap-4">
        <button onClick={onBack} className="p-2 text-slate-400 active-press">
          <ArrowLeft size={24} />
        </button>
        <div>
          <h2 className="text-3xl font-[900] text-slate-900 tracking-tight">Cursos Técnicos</h2>
          <p className="text-slate-400 text-sm font-semibold">Evolução e Profissionalização</p>
        </div>
      </div>

      <div className="bg-blue-600 rounded-[40px] p-8 text-white premium-shadow relative overflow-hidden">
        <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 blur-3xl -mr-16 -mt-16"></div>
        <div className="relative z-10">
          <GraduationCap size={48} className="mb-4 text-blue-200" />
          <h3 className="text-2xl font-black mb-2 leading-tight">Mantenha-se Atualizado</h3>
          <p className="text-blue-100 text-sm font-medium leading-relaxed">
            Profissionais capacitados cobram até 40% mais caro. Invista no seu conhecimento técnico.
          </p>
        </div>
      </div>

      <div className="space-y-4">
        <h4 className="text-xs font-black text-slate-400 uppercase tracking-[0.2em] px-2">Cursos Recomendados</h4>
        <div className="grid gap-4">
          {COURSES.map((course) => (
            <div key={course.title} className="bg-white p-6 rounded-[32px] border border-slate-100 premium-shadow flex flex-col gap-4">
              <div className="flex justify-between items-start">
                <div className="flex items-center gap-2">
                  <div className="bg-blue-50 text-blue-600 px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-widest">
                    {course.category}
                  </div>
                  <div className="bg-emerald-50 text-emerald-600 px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-widest">
                    {course.status}
                  </div>
                </div>
                <div className="flex items-center gap-1 text-slate-400">
                  <Clock size={12} />
                  <span className="text-[10px] font-bold">{course.duration}</span>
                </div>
              </div>
              
              <div>
                <h5 className="text-lg font-black text-slate-900 mb-1">{course.title}</h5>
                <p className="text-xs text-slate-500 font-medium leading-relaxed">{course.description}</p>
              </div>

              <div className="pt-2 border-t border-slate-50 flex gap-2">
                <button className="flex-1 bg-slate-900 text-white py-3 rounded-2xl text-[10px] font-black uppercase tracking-widest flex items-center justify-center gap-2 active-press">
                  <Play size={14} fill="white" /> Ver Detalhes
                </button>
                <button className="w-12 h-12 bg-blue-50 text-blue-600 rounded-2xl flex items-center justify-center active-press">
                  <ExternalLink size={18} />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="p-8 bg-slate-100 rounded-[40px] border-2 border-dashed border-slate-200 text-center">
        <BookOpen size={32} className="mx-auto text-slate-300 mb-4" />
        <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest leading-relaxed">
          Novos cursos técnicos e certificações são adicionados mensalmente pela nossa equipe.
        </p>
      </div>
    </div>
  );
};

export default Courses;
