import Papa from 'papaparse';
import { CalculationResult } from '@export-cost/shared';

export function exportCalculationToCsv(calc: CalculationResult) {
  const rows = calc.costBreakdown.components.map(comp => ({
    'Component Code': comp.code,
    'Cost Component Name': comp.name,
    'Category': comp.category,
    'Amount (INR)': comp.amountInr.toFixed(2),
    'Amount (Target Currency)': comp.amountTargetCurrency.toFixed(2),
    'Seller Responsibility': comp.isSellerResponsibility ? 'YES (Seller)' : 'NO (Buyer)',
    'Incoterm Note': comp.incotermNote,
    'Details': comp.breakdownDetails || ''
  }));

  // Summary metadata rows
  const summaryRows = [
    {},
    { 'Component Code': 'SUMMARY METRICS', 'Cost Component Name': '' },
    { 'Component Code': 'Product Name', 'Cost Component Name': calc.input.productName },
    { 'Component Code': 'Incoterm Used', 'Cost Component Name': calc.input.incoterm },
    { 'Component Code': 'Transport Mode', 'Cost Component Name': calc.input.transportMode },
    { 'Component Code': 'Origin Location', 'Cost Component Name': calc.origin.name },
    { 'Component Code': 'Destination Location', 'Cost Component Name': calc.destination.name },
    { 'Component Code': 'Export Cost Indicator Score', 'Cost Component Name': `${calc.indicator.overallScore} / 100 (${calc.indicator.level})` },
    { 'Component Code': 'Total Export Cost (INR)', 'Cost Component Name': calc.costBreakdown.totalExportCostInr.toFixed(2) },
    { 'Component Code': 'Total Seller Responsibility (INR)', 'Cost Component Name': (calc.costBreakdown.totalSellerCost * (calc.exchangeRates[calc.input.valueCurrency] || 1)).toFixed(2) }
  ];

  const csv = Papa.unparse([...rows, ...summaryRows]);
  const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.setAttribute('download', `export-cost-report-${calc.id}.csv`);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}
