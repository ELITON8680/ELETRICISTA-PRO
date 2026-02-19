
import { BudgetData, ProfessionalData, PricingMode } from '../types';
import { formatCurrency } from '../utils';
import { jsPDF } from 'jspdf';

// Função auxiliar para download robusto em dispositivos móveis usando Blob
const downloadPDF = (doc: jsPDF, filename: string) => {
  try {
    const pdfBlob = doc.output('blob');
    const url = URL.createObjectURL(pdfBlob);
    const link = document.createElement('a');
    link.href = url;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  } catch (error) {
    console.error("Erro interno no download do PDF:", error);
    throw error;
  }
};

export const generatePDF = async (budget: BudgetData, professional: ProfessionalData, shareOnWhatsApp: boolean = false): Promise<boolean> => {
  try {
    const doc = new jsPDF();
    const primaryColor = '#1e293b'; 
    const accentColor = '#2563eb';
    const textColor = '#334155';
    const lightGray = '#f8fafc';
    const darkGray = '#475569';

    const pageWidth = doc.internal.pageSize.getWidth();
    const margin = 18;
    let y = 0;

    // --- CABEÇALHO ---
    doc.setFillColor(primaryColor);
    doc.rect(0, 0, pageWidth, 45, 'F');
    
    if (professional.logo) {
      try {
        doc.addImage(professional.logo, 'PNG', margin, 8, 28, 28, undefined, 'FAST');
      } catch (e) {
        console.warn('Falha ao renderizar logo no PDF:', e);
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
    
    y += 4;
    doc.setDrawColor(accentColor);
    doc.setLineWidth(1);
    doc.line(pageWidth / 2 - 40, y, pageWidth / 2 + 40, y);

    // --- DADOS DO CLIENTE ---
    y += 18;
    doc.setFillColor(lightGray);
    doc.roundedRect(margin, y, pageWidth - (margin * 2), 28, 3, 3, 'F');
    
    doc.setFontSize(9);
    doc.setTextColor(darkGray);
    doc.setFont('helvetica', 'bold');
    doc.text('DADOS DO CLIENTE:', margin + 5, y + 8);
    
    doc.setFont('helvetica', 'normal');
    doc.setTextColor(textColor);
    doc.text(`Nome: ${budget.client.name || 'Não informado'}`, margin + 5, y + 15);
    doc.text(`Telefone: ${budget.client.phone || 'Não informado'}`, margin + 5, y + 21);
    doc.text(`Endereço: ${budget.client.address || 'Não informado'}`, pageWidth / 2, y + 15, { maxWidth: 80 });

    // --- DESCRIÇÃO DO SERVIÇO ---
    y += 40;
    doc.setTextColor(primaryColor);
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(11);
    doc.text('1. DESCRIÇÃO E ESCOPO DOS SERVIÇOS', margin, y);
    
    y += 5;
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(10);
    doc.setTextColor(textColor);
    const descLines = doc.splitTextToSize(budget.serviceDescription || 'Serviços elétricos diversos conforme solicitado pelo cliente.', pageWidth - (margin * 2));
    doc.text(descLines, margin, y + 5);
    
    y += (descLines.length * 5) + 12;

    // --- DETALHAMENTO DE SERVIÇOS ---
    if (budget.pricingMode === PricingMode.SERVICES && (budget.services?.length || 0) > 0) {
       if (y > 200) { doc.addPage(); y = 20; }
       doc.setTextColor(primaryColor);
       doc.setFont('helvetica', 'bold');
       doc.setFontSize(11);
       doc.text('2. DETALHAMENTO DE ITENS', margin, y);
       y += 8;
       
       doc.setFillColor(lightGray);
       doc.rect(margin, y, pageWidth - (margin * 2), 7, 'F');
       doc.setFontSize(8);
       doc.text('Serviço / Item', margin + 3, y + 5);
       doc.text('Qtd', pageWidth - margin - 50, y + 5);
       doc.text('Unitário', pageWidth - margin - 30, y + 5);
       doc.text('Subtotal', pageWidth - margin - 3, y + 5, { align: 'right' });
       y += 10;

       doc.setFont('helvetica', 'normal');
       budget.services.forEach(s => {
          if (y > 270) { doc.addPage(); y = 20; }
          doc.text(s.name, margin + 3, y);
          doc.text(`${s.quantity} ${s.unitType}`, pageWidth - margin - 50, y);
          doc.text(formatCurrency(s.unitValue), pageWidth - margin - 30, y);
          doc.text(formatCurrency(s.total), pageWidth - margin - 3, y, { align: 'right' });
          y += 6;
       });
       y += 10;
    }

    // --- VALORES E INVESTIMENTO ---
    if (y > 230) { doc.addPage(); y = 20; }
    doc.setTextColor(primaryColor);
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(11);
    doc.text('2. RESUMO DO INVESTIMENTO', margin, y);
    
    y += 8;
    doc.setFillColor(lightGray);
    doc.rect(margin, y, pageWidth - (margin * 2), 22, 'F');
    
    doc.setFontSize(9);
    doc.setTextColor(textColor);
    doc.text('Item de Proposta', margin + 5, y + 8);
    doc.text('Valor', pageWidth - margin - 5, y + 8, { align: 'right' });
    
    doc.setDrawColor('#e2e8f0');
    doc.setLineWidth(0.2);
    doc.line(margin + 5, y + 10, pageWidth - margin - 5, y + 10);
    
    doc.setFont('helvetica', 'normal');
    
    const materialsTotal = budget.materials.reduce((acc, i) => acc + (i.total || 0), 0);
    const laborTotalConsolidated = budget.finalTotal - materialsTotal;
    
    doc.text('Mão de Obra e Serviços Técnicos Especializados', margin + 5, y + 16);
    doc.text(formatCurrency(laborTotalConsolidated), pageWidth - margin - 5, y + 16, { align: 'right' });

    y += 22;
    
    if (materialsTotal > 0) {
      doc.text('Materiais, Insumos e Componentes Relacionados', margin + 5, y + 6);
      doc.text(formatCurrency(materialsTotal), pageWidth - margin - 5, y + 6, { align: 'right' });
      y += 10;
    }

    doc.setFillColor(accentColor);
    doc.roundedRect(pageWidth - 95, y + 5, 80, 18, 2, 2, 'F');
    doc.setTextColor('#ffffff');
    doc.setFontSize(10);
    doc.setFont('helvetica', 'bold');
    doc.text('TOTAL DA PROPOSTA:', pageWidth - 90, y + 12);
    doc.setFontSize(14);
    doc.text(formatCurrency(budget.finalTotal), pageWidth - margin - 5, y + 17, { align: 'right' });

    // --- CONDIÇÕES COMERCIAIS ---
    y += 35;
    if (y > 230) { doc.addPage(); y = 20; }
    doc.setTextColor(primaryColor);
    doc.setFontSize(11);
    doc.setFont('helvetica', 'bold');
    doc.text('3. CONDIÇÕES COMERCIAIS', margin, y);
    
    y += 8;
    doc.setFontSize(9);
    doc.setFont('helvetica', 'normal');
    doc.setTextColor(textColor);
    doc.text(`Prazo de Execução: ${budget.executionDeadline || 'A combinar'}`, margin, y);
    doc.text(`Condições de Pagamento: ${budget.paymentConditions || 'A combinar'}`, margin, y + 6);
    doc.text(`Validade desta Proposta: ${budget.proposalValidity || '7 dias'}`, margin, y + 12);

    // --- ASSINATURAS ---
    y = 265;
    doc.setDrawColor(textColor);
    doc.setLineWidth(0.3);
    doc.line(margin, y, margin + 70, y);
    doc.setFontSize(8);
    doc.text(professional.name || 'Assinatura do Profissional', margin, y + 5);
    if (professional.signature) {
      try { doc.addImage(professional.signature, 'PNG', margin + 5, y - 18, 55, 15); } catch (e) {}
    }
    
    doc.line(pageWidth - margin - 70, y, pageWidth - margin, y);
    doc.text('Aceite do Cliente', pageWidth - margin - 70, y + 5);
    if (budget.signature) {
      try { doc.addImage(budget.signature, 'PNG', pageWidth - margin - 65, y - 18, 55, 15); } catch (e) {}
    }

    const fileName = `Proposta_${(budget.client.name || 'proposta').replace(/\s+/g, '_')}.pdf`;
    downloadPDF(doc, fileName);
    return true;
  } catch (error) {
    console.error('Erro ao gerar PDF:', error);
    alert('Erro ao gerar PDF. Verifique se o navegador permite downloads.');
    return false;
  }
};

export const generateReceiptPDF = async (budget: BudgetData, professional: ProfessionalData): Promise<boolean> => {
  try {
    const doc = new jsPDF();
    const pageWidth = doc.internal.pageSize.getWidth();
    const accentBlue = '#2563eb';
    const softGray = '#f1f5f9';
    const darkText = '#0f172a';
    const lightText = '#64748b';

    doc.setFillColor(softGray);
    doc.rect(0, 0, pageWidth, 297, 'F');
    doc.setFillColor('#ffffff');
    doc.roundedRect(15, 15, pageWidth - 30, 160, 5, 5, 'F');
    doc.setDrawColor('#e2e8f0');
    doc.setLineWidth(0.5);
    doc.roundedRect(15, 15, pageWidth - 30, 160, 5, 5, 'D');

    doc.setFillColor(accentBlue);
    doc.roundedRect(pageWidth - 85, 25, 60, 15, 2, 2, 'F');
    doc.setTextColor('#ffffff');
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(16);
    doc.text(formatCurrency(budget.finalTotal), pageWidth - 55, 35, { align: 'center' });

    if (professional.logo) {
      try { doc.addImage(professional.logo, 'PNG', 25, 25, 20, 20); } catch (e) {}
    }
    
    doc.setTextColor(darkText);
    doc.setFontSize(14);
    doc.text(professional.name.toUpperCase() || 'PRESTADOR DE SERVIÇOS', 25 + (professional.logo ? 25 : 0), 32);
    doc.setFontSize(9);
    doc.setFont('helvetica', 'normal');
    doc.setTextColor(lightText);
    doc.text(professional.profession || 'Eletricista Especializado', 25 + (professional.logo ? 25 : 0), 38);

    doc.setDrawColor('#cbd5e1');
    doc.line(25, 50, pageWidth - 25, 50);

    doc.setTextColor(accentBlue);
    doc.setFontSize(22);
    doc.setFont('helvetica', 'bold');
    doc.text('RECIBO', pageWidth / 2, 65, { align: 'center' });

    doc.setTextColor(darkText);
    doc.setFontSize(11);
    doc.setFont('helvetica', 'normal');
    
    let y = 80;
    doc.text(`Recebi(emos) de:`, 25, y);
    doc.setFont('helvetica', 'bold');
    doc.text(budget.client.name.toUpperCase() || 'CLIENTE NÃO IDENTIFICADO', 25, y + 7);
    
    y += 20;
    doc.setFont('helvetica', 'normal');
    doc.text(`A quantia líquida de:`, 25, y);
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(accentBlue);
    doc.text(formatCurrency(budget.finalTotal), 25, y + 7);
    
    y += 20;
    doc.setFont('helvetica', 'normal');
    doc.setTextColor(darkText);
    doc.text(`Referente aos serviços de:`, 25, y);
    doc.setFont('helvetica', 'bold');
    const serviceLines = doc.splitTextToSize(budget.serviceDescription || 'Prestação de serviços elétricos especializados e mão de obra técnica.', pageWidth - 50);
    doc.text(serviceLines, 25, y + 7);

    y = 145;
    const dataExtenso = new Date(budget.date).toLocaleDateString('pt-BR', { day: 'numeric', month: 'long', year: 'numeric' });
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(10);
    doc.text(`Emitido em: ${dataExtenso}`, 25, y);

    doc.line(pageWidth - 95, y, pageWidth - 25, y);
    doc.setFontSize(8);
    doc.setFont('helvetica', 'bold');
    doc.text(professional.name.toUpperCase() || 'ASSINATURA DO EMISSOR', pageWidth - 60, y + 5, { align: 'center' });
    
    if (professional.signature) {
      try { doc.addImage(professional.signature, 'PNG', pageWidth - 85, y - 18, 50, 15); } catch (e) {}
    }

    const fileName = `Recibo_${budget.client.name.replace(/\s+/g, '_')}.pdf`;
    downloadPDF(doc, fileName);
    return true;
  } catch (error) {
    console.error('Erro ao gerar recibo:', error);
    alert('Erro ao gerar Recibo. Verifique as permissões do navegador.');
    return false;
  }
};
