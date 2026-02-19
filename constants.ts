
import { WorkType, WorkPattern } from './types';

export const MATERIAL_CATALOG_BASE = [
  // 1. CONDUTORES ELÉTRICOS
  { id: 'mat-ce-01', category: '1. Condutores Elétricos', name: 'Cabo flexível 750V 1,5mm²', unit: 'm', defaultValue: 2.5 },
  { id: 'mat-ce-02', category: '1. Condutores Elétricos', name: 'Cabo flexível 750V 2,5mm²', unit: 'm', defaultValue: 3.8 },
  { id: 'mat-ce-03', category: '1. Condutores Elétricos', name: 'Cabo flexível 750V 4mm²', unit: 'm', defaultValue: 5.9 },
  { id: 'mat-ce-04', category: '1. Condutores Elétricos', name: 'Cabo flexível 750V 6mm²', unit: 'm', defaultValue: 8.5 },
  { id: 'mat-ce-05', category: '1. Condutores Elétricos', name: 'Cabo flexível 750V 10mm²', unit: 'm', defaultValue: 14.2 },
  { id: 'mat-ce-06', category: '1. Condutores Elétricos', name: 'Cabo flexível 750V 16mm²', unit: 'm', defaultValue: 22.0 },
  { id: 'mat-ce-07', category: '1. Condutores Elétricos', name: 'Cabo flexível 750V 25mm²', unit: 'm', defaultValue: 35.0 },
  { id: 'mat-ce-08', category: '1. Condutores Elétricos', name: 'Cabo flexível 750V 35mm²', unit: 'm', defaultValue: 48.0 },
  { id: 'mat-ce-09', category: '1. Condutores Elétricos', name: 'Cabo flexível 750V 50mm²', unit: 'm', defaultValue: 65.0 },
  { id: 'mat-ce-10', category: '1. Condutores Elétricos', name: 'Cabo rígido 750V', unit: 'm', defaultValue: 4.5 },
  { id: 'mat-ce-11', category: '1. Condutores Elétricos', name: 'Cabo PP 2x1,5mm²', unit: 'm', defaultValue: 6.5 },
  { id: 'mat-ce-12', category: '1. Condutores Elétricos', name: 'Cabo PP 2x2,5mm²', unit: 'm', defaultValue: 9.8 },
  { id: 'mat-ce-13', category: '1. Condutores Elétricos', name: 'Cabo PP 3x2,5mm²', unit: 'm', defaultValue: 12.5 },
  { id: 'mat-ce-14', category: '1. Condutores Elétricos', name: 'Cabo PP 3x4mm²', unit: 'm', defaultValue: 18.0 },
  { id: 'mat-ce-15', category: '1. Condutores Elétricos', name: 'Cabo paralelo', unit: 'm', defaultValue: 3.5 },
  { id: 'mat-ce-16', category: '1. Condutores Elétricos', name: 'Cabo multiplexado', unit: 'm', defaultValue: 7.8 },
  { id: 'mat-ce-17', category: '1. Condutores Elétricos', name: 'Cabo de comando', unit: 'm', defaultValue: 5.5 },
  { id: 'mat-ce-18', category: '1. Condutores Elétricos', name: 'Cabo blindado', unit: 'm', defaultValue: 15.0 },
  { id: 'mat-ce-19', category: '1. Condutores Elétricos', name: 'Cabo de aterramento verde', unit: 'm', defaultValue: 3.8 },
  { id: 'mat-ce-20', category: '1. Condutores Elétricos', name: 'Cabo de rede (UTP)', unit: 'm', defaultValue: 2.2 },
  { id: 'mat-ce-21', category: '1. Condutores Elétricos', name: 'Cabo coaxial', unit: 'm', defaultValue: 3.0 },

  // 2. INFRAESTRUTURA
  { id: 'mat-in-01', category: '2. Infraestrutura', name: 'Eletroduto PVC rígido', unit: 'm', defaultValue: 12.0 },
  { id: 'mat-in-02', category: '2. Infraestrutura', name: 'Eletroduto PVC corrugado', unit: 'm', defaultValue: 3.5 },
  { id: 'mat-in-03', category: '2. Infraestrutura', name: 'Eletroduto galvanizado', unit: 'm', defaultValue: 45.0 },
  { id: 'mat-in-04', category: '2. Infraestrutura', name: 'Eletroduto PEAD', unit: 'm', defaultValue: 8.5 },
  { id: 'mat-in-05', category: '2. Infraestrutura', name: 'Curva para eletroduto', unit: 'unid', defaultValue: 4.5 },
  { id: 'mat-in-06', category: '2. Infraestrutura', name: 'Luva para eletroduto', unit: 'unid', defaultValue: 2.5 },
  { id: 'mat-in-07', category: '2. Infraestrutura', name: 'Adaptador para eletroduto', unit: 'unid', defaultValue: 1.8 },
  { id: 'mat-in-08', category: '2. Infraestrutura', name: 'Caixa 4x2', unit: 'unid', defaultValue: 3.5 },
  { id: 'mat-in-09', category: '2. Infraestrutura', name: 'Caixa 4x4', unit: 'unid', defaultValue: 5.5 },
  { id: 'mat-in-10', category: '2. Infraestrutura', name: 'Caixa octogonal', unit: 'unid', defaultValue: 4.8 },
  { id: 'mat-in-11', category: '2. Infraestrutura', name: 'Caixa de passagem PVC', unit: 'unid', defaultValue: 25.0 },
  { id: 'mat-in-12', category: '2. Infraestrutura', name: 'Caixa de passagem metálica', unit: 'unid', defaultValue: 45.0 },
  { id: 'mat-in-13', category: '2. Infraestrutura', name: 'Caixa para quadro de distribuição', unit: 'unid', defaultValue: 85.0 },
  { id: 'mat-in-14', category: '2. Infraestrutura', name: 'Tampa cega', unit: 'unid', defaultValue: 4.2 },
  { id: 'mat-in-15', category: '2. Infraestrutura', name: 'Canaleta PVC simples', unit: 'm', defaultValue: 8.5 },
  { id: 'mat-in-16', category: '2. Infraestrutura', name: 'Canaleta com divisória', unit: 'm', defaultValue: 14.0 },
  { id: 'mat-in-17', category: '2. Infraestrutura', name: 'Perfilado galvanizado', unit: 'm', defaultValue: 32.0 },
  { id: 'mat-in-18', category: '2. Infraestrutura', name: 'Eletrocalha perfurada', unit: 'm', defaultValue: 55.0 },

  // 3. TOMADAS E ACESSÓRIOS
  { id: 'mat-ta-01', category: '3. Tomadas e Acessórios', name: 'Tomada 10A', unit: 'unid', defaultValue: 18.0 },
  { id: 'mat-ta-02', category: '3. Tomadas e Acessórios', name: 'Tomada 20A', unit: 'unid', defaultValue: 22.0 },
  { id: 'mat-ta-03', category: '3. Tomadas e Acessórios', name: 'Tomada dupla', unit: 'unid', defaultValue: 35.0 },
  { id: 'mat-ta-04', category: '3. Tomadas e Acessórios', name: 'Tomada tripla', unit: 'unid', defaultValue: 48.0 },
  { id: 'mat-ta-05', category: '3. Tomadas e Acessórios', name: 'Tomada industrial 2P+T', unit: 'unid', defaultValue: 65.0 },
  { id: 'mat-ta-06', category: '3. Tomadas e Acessórios', name: 'Tomada industrial 3P+T', unit: 'unid', defaultValue: 85.0 },
  { id: 'mat-ta-07', category: '3. Tomadas e Acessórios', name: 'Espelho 4x2', unit: 'unid', defaultValue: 5.0 },

  // 4. INTERRUPTORES E COMANDOS
  { id: 'mat-ic-01', category: '4. Interruptores', name: 'Interruptor simples', unit: 'unid', defaultValue: 18.0 },
  { id: 'mat-ic-02', category: '4. Interruptores', name: 'Interruptor duplo', unit: 'unid', defaultValue: 28.0 },
  { id: 'mat-ic-03', category: '4. Interruptores', name: 'Interruptor paralelo', unit: 'unid', defaultValue: 24.0 },
  { id: 'mat-ic-04', category: '4. Interruptores', name: 'Sensor de presença', unit: 'unid', defaultValue: 45.0 },
  { id: 'mat-ic-05', category: '4. Interruptores', name: 'Fotocélula', unit: 'unid', defaultValue: 38.0 },

  // 5. ILUMINAÇÃO
  { id: 'mat-il-01', category: '5. Iluminação', name: 'Lâmpada LED bulbo', unit: 'unid', defaultValue: 12.0 },
  { id: 'mat-il-02', category: '5. Iluminação', name: 'Painel LED', unit: 'unid', defaultValue: 45.0 },
  { id: 'mat-il-03', category: '5. Iluminação', name: 'Refletor LED', unit: 'unid', defaultValue: 85.0 },
  { id: 'mat-il-04', category: '5. Iluminação', name: 'Fita LED', unit: 'm', defaultValue: 15.0 },

  // 6. PROTEÇÃO E DISTRIBUIÇÃO
  { id: 'mat-pr-01', category: '6. Proteção', name: 'Disjuntor monopolar', unit: 'unid', defaultValue: 12.0 },
  { id: 'mat-pr-02', category: '6. Proteção', name: 'Disjuntor bipolar', unit: 'unid', defaultValue: 45.0 },
  { id: 'mat-pr-03', category: '6. Proteção', name: 'Disjuntor tripolar', unit: 'unid', defaultValue: 85.0 },
  { id: 'mat-pr-04', category: '6. Proteção', name: 'DR (Diferencial Residual)', unit: 'unid', defaultValue: 180.0 },
  { id: 'mat-pr-05', category: '6. Proteção', name: 'DPS (Protetor de Surto)', unit: 'unid', defaultValue: 65.0 },

  // 7. ATERRAMENTO
  { id: 'mat-at-01', category: '7. Aterramento', name: 'Haste de aterramento cobreada', unit: 'unid', defaultValue: 35.0 },
  { id: 'mat-at-02', category: '7. Aterramento', name: 'Cabo nu de cobre', unit: 'm', defaultValue: 18.0 },

  // 8. INDUSTRIAL E AUTOMAÇÃO
  { id: 'mat-au-01', category: '8. Automação', name: 'Contator', unit: 'unid', defaultValue: 120.0 },
  { id: 'mat-au-02', category: '8. Automação', name: 'Relé térmico', unit: 'unid', defaultValue: 85.0 },
  { id: 'mat-au-03', category: '8. Automação', name: 'Inversor de frequência', unit: 'unid', defaultValue: 1200.0 },

  // 9. CONEXÃO E FIXAÇÃO
  { id: 'mat-cx-01', category: '9. Conexão', name: 'Conector Wago', unit: 'unid', defaultValue: 3.5 },
  { id: 'mat-cx-02', category: '9. Conexão', name: 'Fita isolante', unit: 'unid', defaultValue: 12.0 },
  { id: 'mat-cx-03', category: '9. Conexão', name: 'Abraçadeira nylon', unit: 'unid', defaultValue: 0.5 },

  // 10. FERRAMENTAS
  { id: 'mat-fe-01', category: '10. Ferramentas', name: 'Alicate universal', unit: 'unid', defaultValue: 65.0 },
  { id: 'mat-fe-02', category: '10. Ferramentas', name: 'Multímetro', unit: 'unid', defaultValue: 150.0 },
];

export const SERVICE_CATALOG = [
  {
    category: '1. Instalações Elétricas (Ponto)',
    items: [
      { name: 'Tomada simples', value: 45, unit: 'ponto' },
      { name: 'Tomada dupla', value: 65, unit: 'ponto' },
      { name: 'Tomada tripla', value: 85, unit: 'ponto' },
      { name: 'Tomada 220V Especial', value: 120, unit: 'ponto' },
      { name: 'Ponto de iluminação', value: 45, unit: 'ponto' },
      { name: 'Interruptor simples', value: 45, unit: 'ponto' },
      { name: 'Interruptor duplo', value: 65, unit: 'ponto' },
      { name: 'Interruptor triplo', value: 85, unit: 'ponto' },
      { name: 'Interruptor paralelo', value: 75, unit: 'ponto' },
      { name: 'Ponto de chuveiro', value: 150, unit: 'ponto' },
      { name: 'Ponto de ar-condicionado', value: 180, unit: 'ponto' },
      { name: 'Ponto para forno / cooktop', value: 160, unit: 'ponto' },
      { name: 'Ponto de máquina de lavar', value: 120, unit: 'ponto' },
    ]
  },
  {
    category: '2. Manutenção / Trocas',
    items: [
      { name: 'Troca de tomada', value: 25, unit: 'unid' },
      { name: 'Troca de interruptor', value: 25, unit: 'unid' },
      { name: 'Troca de disjuntor', value: 40, unit: 'unid' },
      { name: 'Troca de chuveiro', value: 80, unit: 'unid' },
      { name: 'Troca de luminária', value: 50, unit: 'unid' },
      { name: 'Reparo em curto', value: 150, unit: 'visita' },
      { name: 'Substituição de fiação', value: 200, unit: 'circuito' },
    ]
  },
  {
    category: '3. Iluminação',
    items: [
      { name: 'Instalação de luminária', value: 60, unit: 'unid' },
      { name: 'Instalação de spot', value: 35, unit: 'unid' },
      { name: 'Instalação de refletor', value: 90, unit: 'unid' },
      { name: 'Instalação de fita LED', value: 40, unit: 'metro' },
    ]
  },
  {
    category: '4. Quadro Elétrico',
    items: [
      { name: 'Montagem de quadro', value: 450, unit: 'unid' },
      { name: 'Troca de disjuntores', value: 50, unit: 'unid' },
      { name: 'Organização de circuitos', value: 250, unit: 'quadro' },
      { name: 'Identificação de disjuntores', value: 100, unit: 'quadro' },
    ]
  },
  {
    category: '5. Visita Técnica',
    items: [
      { name: 'Visita padrão', value: 120, unit: 'visita' },
      { name: 'Visita para orçamento', value: 80, unit: 'visita' },
      { name: 'Visita emergencial', value: 250, unit: 'visita' },
      { name: 'Taxa de deslocamento', value: 50, unit: 'unid' },
    ]
  },
  {
    category: '6. Serviços por Metragem',
    items: [
      { name: 'Passagem de cabos', value: 8, unit: 'metro' },
      { name: 'Instalação de eletroduto', value: 15, unit: 'metro' },
      { name: 'Instalação de canaleta', value: 12, unit: 'metro' },
      { name: 'Sistema de aterramento', value: 450, unit: 'unid' },
    ]
  }
];

export const DEFAULT_SETTINGS = {
  workTypePercentages: {
    [WorkType.RESIDENCIAL]: 0,
    [WorkType.PREDIAL]: 15,
    [WorkType.COMERCIAL]: 30,
    [WorkType.INDUSTRIAL]: 70,
  },
  workPatternPercentages: {
    [WorkPattern.FACIL]: 0,
    [WorkPattern.MEDIO]: 10,
    [WorkPattern.DIFICIL]: 25,
  },
  customMaterials: []
};
