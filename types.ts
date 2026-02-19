
export enum WorkType {
  RESIDENCIAL = 'Residencial',
  PREDIAL = 'Predial',
  COMERCIAL = 'Comercial',
  INDUSTRIAL = 'Industrial'
}

export enum WorkPattern {
  FACIL = 'Fácil',
  MEDIO = 'Médio',
  DIFICIL = 'Difícil'
}

export enum BudgetStatus {
  ABERTO = 'Aberto',
  ENVIADO = 'Enviado',
  APROVADO = 'Aprovado',
  CANCELADO = 'Cancelado'
}

export enum PricingMode {
  HOURS = 'Horas',
  SERVICES = 'Serviços'
}

export enum AdjustmentType {
  FIXED = 'R$',
  PERCENT = '%'
}

export interface MaterialItem {
  id: string;
  description: string;
  category: string;
  unit: string;
  quantity: number;
  unitValue: number;
  total: number;
  amperage?: string;
}

export interface CatalogMaterial {
  id: string;
  name: string;
  category: string;
  unit: string;
  defaultValue: number;
  isCustom?: boolean;
}

export interface ProfessionalData {
  name: string;
  profession: string;
  phone: string;
  logo: string;
  signature?: string;
  baseSalary: number;
}

export interface ClientData {
  name: string;
  phone: string;
  address: string;
  observations: string;
}

export interface AppSettings {
  workTypePercentages: Record<string, number>;
  workPatternPercentages: Record<string, number>;
  customMaterials: CatalogMaterial[];
}

export interface BudgetData {
  id: string;
  date: string;
  client: ClientData;
  workType: WorkType;
  workPattern: WorkPattern;
  pricingMode: PricingMode;
  hours: number;
  services: AppliedService[];
  travelCost: number;
  foodCost: number;
  additionalCost: number;
  materials: MaterialItem[];
  laborValue: number;
  partialTotal: number;
  finalTotal: number;
  signature?: string;
  isFinalized: boolean;
  status: BudgetStatus;
  hasPdf?: boolean;
  serviceDescription: string;
  executionDeadline: string;
  proposalValidity: string;
  paymentConditions: string;
}

export interface AppliedService {
  id: string;
  name: string;
  category: string;
  unitValue: number;
  unitType: string;
  quantity: number;
  discountValue: number;
  discountType: AdjustmentType;
  markupValue: number;
  markupType: AdjustmentType;
  total: number;
}
