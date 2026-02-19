
import { BudgetData, ProfessionalData, AppSettings, PricingMode, AdjustmentType, AppliedService } from './types';

export const calculateServiceItemTotal = (item: AppliedService): number => {
  if (!item) return 0;
  const qty = Math.max(0, Number(item.quantity) || 0);
  const val = Math.max(0, Number(item.unitValue) || 0);
  const subtotal = val * qty;
  
  let discount = 0;
  const dVal = Number(item.discountValue) || 0;
  if (item.discountType === AdjustmentType.FIXED) {
    discount = dVal;
  } else {
    discount = subtotal * (dVal / 100);
  }

  let markup = 0;
  const mVal = Number(item.markupValue) || 0;
  if (item.markupType === AdjustmentType.FIXED) {
    markup = mVal;
  } else {
    markup = subtotal * (mVal / 100);
  }

  const result = subtotal - discount + markup;
  return isNaN(result) ? 0 : Math.round(result * 100) / 100;
};

export const calculateBudget = (
  budget: Partial<BudgetData>, 
  professional: ProfessionalData,
  settings: AppSettings
): Partial<BudgetData> => {
  let laborValue = 0;

  if (budget.pricingMode === PricingMode.HOURS) {
    const salary = Number(professional?.baseSalary) || 4400;
    const hourlyRate = salary / 220;
    const hours = Number(budget.hours) || 0;
    laborValue = Math.round((hourlyRate * hours) * 100) / 100;
  } else {
    laborValue = (budget.services || []).reduce((acc, service) => {
      return acc + calculateServiceItemTotal(service);
    }, 0);
  }
  
  const travel = Number(budget.travelCost) || 0;
  const food = Number(budget.foodCost) || 0;
  const additional = Number(budget.additionalCost) || 0;
  
  const partialTotal = laborValue + travel + food + additional;
  
  const typePerc = settings?.workTypePercentages?.[budget.workType as string] || 0;
  const patternPerc = settings?.workPatternPercentages?.[budget.workPattern as string] || 0;

  const serviceTotal = partialTotal * (1 + typePerc / 100) * (1 + patternPerc / 100);
  
  const materialsTotal = (budget.materials || []).reduce((acc, item) => {
    const q = Number(item.quantity) || 0;
    const uv = Number(item.unitValue) || 0;
    return acc + (q * uv);
  }, 0);
  
  const finalTotal = Math.round((serviceTotal + materialsTotal) * 100) / 100;

  return {
    ...budget,
    laborValue: isNaN(laborValue) ? 0 : laborValue,
    partialTotal: isNaN(partialTotal) ? 0 : partialTotal,
    finalTotal: isNaN(finalTotal) ? 0 : finalTotal
  };
};

export const formatCurrency = (value: number) => {
  const safeValue = isNaN(value) || value === null || value === undefined ? 0 : value;
  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL'
  }).format(safeValue);
};

export const generateId = () => {
  return Math.random().toString(36).substr(2, 6).toUpperCase();
};

export const saveToStorage = (key: string, data: any) => {
  try {
    localStorage.setItem(key, JSON.stringify(data));
  } catch (e) {
    console.warn('Storage save error:', e);
  }
};

export const getFromStorage = (key: string, defaultValue: any) => {
  try {
    const stored = localStorage.getItem(key);
    return stored ? JSON.parse(stored) : defaultValue;
  } catch (e) {
    return defaultValue;
  }
}
