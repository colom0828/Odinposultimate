/**
 * ═══════════════════════════════════════════════════════════════
 * TEMPLATE PREVIEW - Vista previa en tiempo real tipo ticket térmico
 * ═══════════════════════════════════════════════════════════════
 */

import { Printer, Download } from 'lucide-react';
import { Button } from '../ui/button';
import { PrintTemplate, PrintData, BlockConfig } from '../../types/print-templates.types';
import { cn } from '../ui/utils';

interface TemplatePreviewProps {
  template: PrintTemplate;
  data: PrintData;
}

export function TemplatePreview({ template, data }: TemplatePreviewProps) {
  const handlePrint = () => {
    const printWindow = window.open('', '_blank');
    if (!printWindow) return;

    const html = generatePrintHTML();
    printWindow.document.write(html);
    printWindow.document.close();
    printWindow.print();
  };

  const handleDownloadHTML = () => {
    const html = generatePrintHTML();
    const blob = new Blob([html], { type: 'text/html' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${template.name.toLowerCase().replace(/\s+/g, '-')}.html`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const generatePrintHTML = () => {
    return `
<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${template.name}</title>
  <style>
    * {
      margin: 0;
      padding: 0;
      box-sizing: border-box;
    }
    body {
      font-family: 'Courier New', monospace;
      background: white;
    }
    .ticket {
      width: ${template.paperWidth}mm;
      margin: 0 auto;
      padding: 4mm;
      background: white;
    }
    table {
      width: 100%;
      border-collapse: collapse;
    }
    hr {
      border: none;
      border-top: 1px dashed #000;
      margin: 2mm 0;
    }
    @media print {
      body {
        margin: 0;
        padding: 0;
      }
      .no-print {
        display: none !important;
      }
    }
  </style>
</head>
<body>
  <div class="ticket">
    ${renderBlocks()}
  </div>
</body>
</html>
    `;
  };

  const renderBlocks = () => {
    return template.blocks
      .filter(block => block.visible)
      .sort((a, b) => a.order - b.order)
      .map(block => renderBlockHTML(block))
      .join('\n');
  };

  const visibleBlocks = template.blocks
    .filter(block => block.visible)
    .sort((a, b) => a.order - b.order);

  return (
    <div className="space-y-4">
      {/* Actions */}
      <div className="flex gap-2">
        <Button onClick={handlePrint} variant="outline" className="flex-1">
          <Printer className="w-4 h-4 mr-2" />
          Imprimir
        </Button>
        <Button onClick={handleDownloadHTML} variant="outline" className="flex-1">
          <Download className="w-4 h-4 mr-2" />
          Descargar HTML
        </Button>
      </div>

      {/* Preview Container */}
      <div className="bg-slate-100 dark:bg-slate-950 rounded-xl p-6 overflow-auto">
        <div className="mx-auto bg-white shadow-2xl" style={{ width: `${template.paperWidth}mm` }}>
          {/* Ticket Content */}
          <div className="p-4 font-mono text-black" style={{ fontSize: '10pt' }}>
            {visibleBlocks.map(block => (
              <div key={block.id}>
                {renderBlock(block)}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );

  // ============================================================
  // RENDERIZADO DE BLOQUES
  // ============================================================

  function renderBlock(block: BlockConfig) {
    const style = {
      textAlign: block.alignment,
      fontSize: getFontSize(block.fontSize),
      fontWeight: block.fontWeight,
      paddingTop: `${block.paddingTop}mm`,
      paddingBottom: `${block.paddingBottom}mm`,
    };

    return (
      <div style={style}>
        {renderBlockContent(block)}
      </div>
    );
  }

  function renderBlockContent(block: BlockConfig) {
    switch (block.type) {
      case 'header':
        return renderHeader(block);
      case 'business_info':
        return renderBusinessInfo();
      case 'customer_info':
        return renderCustomerInfo();
      case 'items':
        return renderItems(block);
      case 'totals':
        return renderTotals(block);
      case 'payment_info':
        return renderPaymentInfo();
      case 'separator':
        return <hr className="border-t border-dashed border-black" />;
      case 'footer':
        return renderFooter();
      case 'custom_text':
        return <div>{block.content?.text || ''}</div>;
      case 'qr_code':
        return (
          <div className="flex justify-center">
            <div
              className="bg-slate-200 flex items-center justify-center text-xs"
              style={{
                width: `${block.content?.size || 100}px`,
                height: `${block.content?.size || 100}px`
              }}
            >
              QR CODE
            </div>
          </div>
        );
      case 'barcode':
        return (
          <div className="flex justify-center">
            <div
              className="bg-slate-200 flex items-center justify-center text-xs"
              style={{
                width: '100%',
                height: `${block.content?.size || 50}px`
              }}
            >
              ||| BARCODE |||
            </div>
          </div>
        );
      case 'image':
        return block.content?.imageUrl ? (
          <div className="flex justify-center">
            <img
              src={block.content.imageUrl}
              alt="Custom"
              style={{ height: `${block.content.height || 50}px` }}
            />
          </div>
        ) : (
          <div className="text-center text-slate-400 text-xs">Sin imagen</div>
        );
      default:
        return null;
    }
  }

  function renderHeader(block: BlockConfig) {
    return (
      <div>
        {block.content?.showBusinessName && (
          <div className="font-bold text-lg">{data.business.name}</div>
        )}
        {block.content?.showLogo && data.business.logo && (
          <div className="my-2 flex justify-center">
            <img src={data.business.logo} alt="Logo" className="h-12" />
          </div>
        )}
      </div>
    );
  }

  function renderBusinessInfo() {
    return (
      <div className="text-sm">
        {data.business.address && <div>{data.business.address}</div>}
        {data.business.phone && <div>Tel: {data.business.phone}</div>}
        {data.business.taxId && <div>RFC/NIT: {data.business.taxId}</div>}
        {data.business.email && <div>{data.business.email}</div>}
      </div>
    );
  }

  function renderCustomerInfo() {
    if (!data.customer) return null;
    
    return (
      <div className="text-sm">
        <div className="font-semibold">Cliente: {data.customer.name}</div>
        {data.customer.taxId && <div>RFC/NIT: {data.customer.taxId}</div>}
        {data.customer.address && <div>{data.customer.address}</div>}
        {data.customer.phone && <div>Tel: {data.customer.phone}</div>}
      </div>
    );
  }

  function renderItems(block: BlockConfig) {
    return (
      <table className="w-full text-sm">
        <thead>
          <tr className="border-b border-black">
            <th className="text-left py-1">Cant</th>
            <th className="text-left">Producto</th>
            {block.content?.showPrices && <th className="text-right">P.U.</th>}
            {block.content?.showSubtotal && <th className="text-right">Total</th>}
          </tr>
        </thead>
        <tbody>
          {data.items.map((item, index) => (
            <tr key={index} className="border-b border-dashed border-slate-300">
              <td className="py-1">{item.quantity}</td>
              <td>{item.name}</td>
              {block.content?.showPrices && (
                <td className="text-right">${item.unitPrice.toFixed(2)}</td>
              )}
              {block.content?.showSubtotal && (
                <td className="text-right">${item.subtotal.toFixed(2)}</td>
              )}
            </tr>
          ))}
        </tbody>
      </table>
    );
  }

  function renderTotals(block: BlockConfig) {
    return (
      <table className="w-full text-sm">
        <tbody>
          {block.content?.showSubtotal && (
            <tr>
              <td className="text-right py-0.5">Subtotal:</td>
              <td className="text-right">${data.totals.subtotal.toFixed(2)}</td>
            </tr>
          )}
          {block.content?.showTax && data.totals.tax > 0 && (
            <tr>
              <td className="text-right py-0.5">ITBIS (18%):</td>
              <td className="text-right">${data.totals.tax.toFixed(2)}</td>
            </tr>
          )}
          {block.content?.showDiscount && data.totals.discount > 0 && (
            <tr>
              <td className="text-right py-0.5">Descuento:</td>
              <td className="text-right text-red-600">-${data.totals.discount.toFixed(2)}</td>
            </tr>
          )}
          {block.content?.showTip && data.totals.tip && data.totals.tip > 0 && (
            <tr>
              <td className="text-right py-0.5">10% de Ley:</td>
              <td className="text-right text-green-600">${data.totals.tip.toFixed(2)}</td>
            </tr>
          )}
          {block.content?.showTotal && (
            <tr className="border-t-2 border-black">
              <td className="text-right py-1 font-bold text-lg">TOTAL:</td>
              <td className="text-right font-bold text-lg">${data.totals.total.toFixed(2)}</td>
            </tr>
          )}
        </tbody>
      </table>
    );
  }

  function renderPaymentInfo() {
    if (!data.payment) return null;
    
    return (
      <div className="text-sm">
        <div>Método de pago: <span className="font-semibold">{data.payment.method}</span></div>
        <div>Pagado: ${data.payment.amountPaid.toFixed(2)}</div>
        <div>Cambio: ${data.payment.change.toFixed(2)}</div>
        {data.payment.reference && <div>Ref: {data.payment.reference}</div>}
      </div>
    );
  }

  function renderFooter() {
    return (
      <div className="text-xs text-center">
        {data.customText?.footer || '¡Gracias por su compra!'}
        <div className="mt-2">
          {data.transaction.date} - {data.transaction.time}
        </div>
        <div>Folio: {data.transaction.number}</div>
      </div>
    );
  }

  function renderBlockHTML(block: BlockConfig): string {
    const style = `
      text-align: ${block.alignment};
      font-size: ${getFontSize(block.fontSize)};
      font-weight: ${block.fontWeight};
      padding-top: ${block.paddingTop}mm;
      padding-bottom: ${block.paddingBottom}mm;
    `;
    
    let content = '';
    
    switch (block.type) {
      case 'header':
        content = `
          ${block.content?.showBusinessName ? `<div style="font-weight: bold; font-size: 14pt;">${data.business.name}</div>` : ''}
        `;
        break;
      case 'business_info':
        content = `
          <div style="font-size: 9pt;">
            ${data.business.address || ''}<br>
            ${data.business.phone || ''}<br>
            ${data.business.taxId || ''}
          </div>
        `;
        break;
      case 'customer_info':
        if (data.customer) {
          content = `
            <div style="font-size: 9pt;">
              <strong>Cliente:</strong> ${data.customer.name}<br>
              ${data.customer.taxId ? `<strong>RFC/NIT:</strong> ${data.customer.taxId}<br>` : ''}
            </div>
          `;
        }
        break;
      case 'items':
        content = '<table style="width: 100%; font-size: 9pt;"><tbody>';
        data.items.forEach(item => {
          content += `
            <tr>
              <td>${item.quantity}x ${item.name}</td>
              <td style="text-align: right;">$${item.subtotal.toFixed(2)}</td>
            </tr>
          `;
        });
        content += '</tbody></table>';
        break;
      case 'totals':
        content = '<table style="width: 100%; font-size: 10pt;"><tbody>';
        if (block.content?.showSubtotal) {
          content += `<tr><td>Subtotal:</td><td style="text-align: right;">$${data.totals.subtotal.toFixed(2)}</td></tr>`;
        }
        if (block.content?.showTotal) {
          content += `<tr><td><strong>TOTAL:</strong></td><td style="text-align: right;"><strong>$${data.totals.total.toFixed(2)}</strong></td></tr>`;
        }
        content += '</tbody></table>';
        break;
      case 'separator':
        content = '<hr>';
        break;
      case 'footer':
        content = `<div style="font-size: 8pt;">${data.customText?.footer || '¡Gracias por su compra!'}</div>`;
        break;
      case 'custom_text':
        content = block.content?.text || '';
        break;
      default:
        content = '';
    }
    
    return `<div style="${style}">${content}</div>`;
  }

  function getFontSize(size: string): string {
    const sizes: Record<string, string> = {
      xs: '8pt',
      sm: '9pt',
      md: '10pt',
      lg: '12pt',
      xl: '14pt',
    };
    return sizes[size] || '10pt';
  }
}