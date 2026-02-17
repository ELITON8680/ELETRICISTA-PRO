
import { WorkType, WorkPattern } from './types';

export const ESSENTIAL_MATERIALS = [
  'Fio de cobre 1,5mm²',
  'Fio de cobre 2,5mm²',
  'Fio de cobre 4,0mm²',
  'Fio de cobre 6,0mm²',
  'Disjuntor Monopolar',
  'Disjuntor Bipolar',
  'Disjuntor Tripolar',
  'DR (Diferencial Residual)',
  'DPS (Protetor de Surto)',
  'Quadro de Distribuição',
  'Caixa de Passagem',
  'Tomada Simples 2P+T',
  'Interruptor Simples',
  'Eletroduto Flexível 3/4',
  'Lâmpada LED Bulbo 9W',
  'Fita Isolante 20m',
  'Bucha 6mm c/ Parafuso',
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
};
