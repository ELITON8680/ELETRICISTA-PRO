
import { BudgetData, ProfessionalData, PricingMode } from '../types';
import { formatCurrency } from '../utils';
import { jsPDF } from 'jspdf';

/**
 * Função de download robusta otimizada para Web Apps e PWAs em dispositivos móveis.
 * Segue estritamente o modelo de segurança e compatibilidade solicitado.
 */
const downloadPDF = (doc: jsPDF, filename: string) => {
  console.log(`[PDF] Iniciando processo de download para: ${filename}`);
  
  try {
    // 1. MÉTODO PRINCIPAL: Tenta usar o salvamento nativo da biblioteca
    console.log("[PDF] Tentando método principal: doc.save()");
    doc.save(filename);
    console.log("[PDF] Sucesso no método doc.save()");
  } catch (error) {
    console.error("[PDF] Erro no método doc.save(), iniciando FALLBACK MANUAL:", error);

    // 2. FALLBACK MANUAL: Recomendado para navegadores móveis Android/PWA
    try {
      console.log("[PDF] Gerando Blob para fallback...");
      const pdfBlob = doc.output("blob");
      const url = URL.createObjectURL(pdfBlob);

      const link = document.createElement("a");
      link.href = url;
      link.download = filename;

      // Importante: O link deve estar no document.body para o clique ser registrado em alguns navegadores
      document.body.appendChild(link);
      
      console.log("[PDF] Disparando clique no link de download");
      link.click();

      // Limpeza após o clique
      setTimeout(() => {
        document.body.removeChild(link);
        URL.revokeObjectURL(url);
        console.log("[PDF] Limpeza de recursos de fallback concluída.");
      }, 250);

    } catch (fallbackError) {
      console.error("[PDF] Erro crítico no fallback de download:", fallbackError);
      alert("Erro ao baixar o arquivo. Verifique se o seu navegador bloqueou o download ou tente usar outro navegador.");
    }
  }
};

/**
 * Gera o PDF da Proposta Comercial
 */
export const generatePDF = async (budget: BudgetData, professional: ProfessionalData, shareOnWhatsApp: boolean = false): Promise<boolean> => {
  try {
    console.log("[PDF] Gerando Proposta Comercial...");
    const doc = new jsPDF();
    
    // Configurações Estéticas
    const primaryColor = '#1e293b'; 
    const accentColor = '#2563eb';
    const textColor = '#334155';
    const lightGray = '#f8fafc';

    const pageWidth = doc.internal.pageSize.getWidth();
    const margin = 18;
    let y = 0;

    // --- CABEÇALHO (BANNER) ---
    doc.setFillColor(primaryColor);
    doc.rect(0, 0, pageWidth, 45, 'F');
    
    if (professional.logo) {
      try {
        doc.addImage(professional.logo, 'PNG', margin, 8, 28, 28, undefined, 'FAST');
      } catch (e) {
        console.warn('[PDF] Erro ao processar logo:', e);
      }
    }
    
    doc.setTextColor('#ffffff');
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(16);
    doc.text(professional.name.toUpperCase() || 'PROFISSIONAL', professional.logo ? margin + 35 : margin, 18);
    
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(9);
    doc.text(professional.profession || 'Eletricista Especializado', professional.logo ? margin + 35 : margin, 24);
    doc.text(`WhatsApp: ${professional.phone || 'N/A'}`, professional.logo ? margin + 35 : margin, 29);

    y = 58;
    doc.setTextColor(primaryColor);
    doc.setFontSize(14);
    doc.setFont('helvetica', 'bold');
    doc.text('PROPOSTA DE PRESTAÇÃO DE SERVIÇOS ELÉTRICOS', pageWidth / 2, y, { align: 'center' });
    
    y += 18;
    // DADOS DO CLIENTE
    doc.setFillColor(lightGray);
    doc.roundedRect(margin, y, pageWidth - (margin * 2), 28, 3, 3, 'F');
    doc.setFontSize(9);
    doc.setTextColor(textColor);
    doc.text(`Cliente: ${budget.client.name || 'Não informado'}`, margin + 5, y + 10);
    doc.text(`Endereço: ${budget.client.address || 'Não informado'}`, margin + 5, y + 18);

    // DESCRIÇÃO DO SERVIÇO
    y += 40;
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(11);
    doc.text('1. ESCOPO DOS SERVIÇOS', margin, y);
    
    y += 5;
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(10);
    const descLines = doc.splitTextToSize(budget.serviceDescription || 'Serviços elétricos especializados.', pageWidth - (margin * 2));
    doc.text(descLines, margin, y + 5);
    y += (descLines.length * 5) + 15;

    // TABELA DE SERVIÇOS (SE LISTA)
    if (budget.pricingMode === PricingMode.SERVICES && budget.services?.length > 0) {
      if (y > 220) { doc.addPage(); y = 20; }
      doc.setFont('helvetica', 'bold');
      doc.text('2. DETALHAMENTO DE ITENS', margin, y);
      y += 8;
      
      doc.setFillColor(lightGray);
      doc.rect(margin, y, pageWidth - (margin * 2), 7, 'F');
      doc.setFontSize(8);
      doc.text('Item', margin + 3, y + 5);
      doc.text('Qtd', pageWidth - margin - 50, y + 5);
      doc.text('Total', pageWidth - margin - 3, y + 5, { align: 'right' });
      y += 10;

      doc.setFont('helvetica', 'normal');
      budget.services.forEach(s => {
        if (y > 275) { doc.addPage(); y = 20; }
        doc.text(s.name, margin + 3, y);
        doc.text(`${s.quantity} ${s.unitType}`, pageWidth - margin - 50, y);
        doc.text(formatCurrency(s.total), pageWidth - margin - 3, y, { align: 'right' });
        y += 6;
      });
      y += 10;
    }

    // INVESTIMENTO TOTAL
    if (y > 230) { doc.addPage(); y = 20; }
    doc.setFillColor(accentColor);
    doc.roundedRect(pageWidth - 95, y, 80, 18, 2, 2, 'F');
    doc.setTextColor('#ffffff');
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(10);
    doc.text('VALOR TOTAL:', pageWidth - 90, y + 7);
    doc.setFontSize(14);
    doc.text(formatCurrency(budget.finalTotal), pageWidth - margin - 5, y + 14, { align: 'right' });

    // ASSINATURAS
    y = 265;
    doc.setTextColor(primaryColor);
    doc.setDrawColor(primaryColor);
    doc.line(margin, y, margin + 65, y);
    doc.setFontSize(8);
    doc.text(professional.name || 'Assinatura Profissional', margin, y + 5);
    if (professional.signature) {
      try { doc.addImage(professional.signature, 'PNG', margin, y - 16, 50, 15); } catch (e) {}
    }
    
    doc.line(pageWidth - margin - 65, y, pageWidth - margin, y);
    doc.text('Aceite do Cliente', pageWidth - margin - 65, y + 5);
    if (budget.signature) {
      try { doc.addImage(budget.signature, 'PNG', pageWidth - margin - 65, y - 16, 50, 15); } catch (e) {}
    }

    const fileName = `Proposta_${(budget.client.name || budget.id).replace(/\s+/g, '_')}.pdf`;
    downloadPDF(doc, fileName);
    return true;
  } catch (error) {
    console.error("[PDF] Falha geral ao gerar PDF:", error);
    alert("Ocorreu um erro ao gerar o documento PDF.");
    return false;
  }
};

/**
 * Gera o PDF do Recibo
 */
export const generateReceiptPDF = async (budget: BudgetData, professional: ProfessionalData): Promise<boolean> => {
  try {
    console.log("[PDF] Gerando Recibo...");
    const doc = new jsPDF();
    const pageWidth = doc.internal.pageSize.getWidth();
    const accentBlue = '#2563eb';

    doc.setFillColor('#f8fafc');
    doc.rect(0, 0, pageWidth, 297, 'F');
    
    doc.setFillColor('#ffffff');
    doc.roundedRect(10, 10, pageWidth - 20, 130, 3, 3, 'F');
    doc.setDrawColor('#e2e8f0');
    doc.rect(10, 10, pageWidth - 20, 130, 'D');

    doc.setTextColor(accentBlue);
    doc.setFontSize(26);
    doc.setFont('helvetica', 'bold');
    doc.text('RECIBO', pageWidth / 2, 35, { align: 'center' });

    doc.setTextColor('#1e293b');
    doc.setFontSize(14);
    doc.text(formatCurrency(budget.finalTotal), pageWidth - 20, 35, { align: 'right' });

    let y = 60;
    doc.setFontSize(11);
    doc.setFont('helvetica', 'normal');
    doc.text(`Recebi de ${budget.client.name || 'Cliente'}, a quantia de`, 20, y);
    y += 8;
    doc.setFont('helvetica', 'bold');
    doc.text(`${formatCurrency(budget.finalTotal)},`, 20, y);
    y += 10;
    doc.setFont('helvetica', 'normal');
    doc.text(`referente a serviços elétricos especializados na OS #${budget.id}.`, 20, y);

    y = 120;
    const date = new Date().toLocaleDateString('pt-BR', { day: 'numeric', month: 'long', year: 'numeric' });
    doc.text(`Emitido em: ${date}`, 20, y);

    if (professional.signature) {
      try { doc.addImage(professional.signature, 'PNG', pageWidth - 80, y - 20, 50, 15); } catch (e) {}
    }
    doc.line(pageWidth - 85, y, pageWidth - 15, y);
    doc.setFontSize(8);
    doc.text(professional.name.toUpperCase() || 'ASSINATURA', pageWidth - 50, y + 5, { align: 'center' });

    const fileName = `Recibo_${budget.client.name.replace(/\s+/g, '_')}.pdf`;
    downloadPDF(doc, fileName);
    return true;
  } catch (error) {
    console.error("[PDF] Erro ao gerar recibo:", error);
    alert("Não foi possível gerar o recibo.");
    return false;
  }
};
