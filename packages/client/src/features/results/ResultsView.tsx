import React, { useState } from 'react';
import { CalculationResult } from '@export-cost/shared';
import { formatCurrency } from '@export-cost/shared';
import { IndicatorGauge } from '../indicator/IndicatorGauge';
import { TradeMap } from '../map/TradeMap';
import { RouteComparison } from '../comparison/RouteComparison';
import { exportCalculationToCsv } from '../../utils/csvExport';
import { exportElementToPdf } from '../../utils/pdfExport';
import { Download, FileSpreadsheet, MapPin, RefreshCw, Share2 } from 'lucide-react';

interface ResultsViewProps {
  result: CalculationResult;
  onNewCalculation: () => void;
}

export const ResultsView: React.FC<ResultsViewProps> = ({ result, onNewCalculation }) => {
  const [selectedRouteId, setSelectedRouteId] = useState<string>(result.selectedRoute.id);
  const { input, origin, destination, costBreakdown, indicator, routeAlternatives, isEstimatedData, disclaimer } = result;

  const currentRoute = routeAlternatives.find(r => r.id === selectedRouteId) || result.selectedRoute;

  const handleExportPdf = () => {
    exportElementToPdf('results-printable-area', `export-report-${input.productName.toLowerCase().replace(/\s+/g, '-')}.pdf`);
  };

  const handleExportCsv = () => {
    exportCalculationToCsv(result);
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
      {/* Sample Data Disclaimer Banner */}
      {isEstimatedData && (
        <div className="sample-data-notice">
          <strong>Notice:</strong> {disclaimer}
        </div>
      )}

      {/* Action Bar */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <h2 style={{ fontSize: '1.4rem', fontWeight: 800 }}>Export Calculation Results</h2>
          <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>
            Shipment of {input.productName} ({input.quantity} {input.unit}) from {origin.name} to {destination.name}
          </p>
        </div>

        <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap' }}>
          <button className="btn btn-secondary btn-sm" onClick={onNewCalculation}>
            <RefreshCw size={16} /> New Calculation
          </button>
          <button className="btn btn-secondary btn-sm" onClick={handleExportCsv}>
            <FileSpreadsheet size={16} /> Export CSV
          </button>
          <button className="btn btn-primary btn-sm" onClick={handleExportPdf}>
            <Download size={16} /> Export PDF Report
          </button>
        </div>
      </div>

      {/* Printable Report Container */}
      <div id="results-printable-area" style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
        {/* Metric Cards Top Row */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '1rem' }}>
          <div className="glass-card" style={{ padding: '1.25rem' }}>
            <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginBottom: '0.3rem' }}>Total Export Cost (INR)</div>
            <div style={{ fontSize: '1.5rem', fontWeight: 800, color: 'var(--primary)' }}>
              {formatCurrency(costBreakdown.totalExportCostInr, 'INR')}
            </div>
            <div style={{ fontSize: '0.75rem', color: 'var(--text-subtle)', marginTop: '0.2rem' }}>
              Target: {formatCurrency(costBreakdown.totalExportCostTarget, input.targetCurrency)}
            </div>
          </div>

          <div className="glass-card" style={{ padding: '1.25rem' }}>
            <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginBottom: '0.3rem' }}>Seller Freight Share ({input.incoterm})</div>
            <div style={{ fontSize: '1.5rem', fontWeight: 800, color: 'var(--accent-green)' }}>
              {formatCurrency(costBreakdown.totalSellerCost * (result.exchangeRates[input.valueCurrency] || 1), 'INR')}
            </div>
            <div style={{ fontSize: '0.75rem', color: 'var(--accent-green)', marginTop: '0.2rem' }}>
              Incoterm: {input.incoterm} Responsibility
            </div>
          </div>

          <div className="glass-card" style={{ padding: '1.25rem' }}>
            <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginBottom: '0.3rem' }}>Per-Kg / Per-CBM Unit Costs</div>
            <div style={{ fontSize: '1.2rem', fontWeight: 700, color: 'var(--text-main)' }}>
              ₹{costBreakdown.perKgCostInr} / kg
            </div>
            <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginTop: '0.2rem' }}>
              ₹{costBreakdown.perCbmCostInr} / CBM
            </div>
          </div>

          <div className="glass-card" style={{ padding: '1.25rem' }}>
            <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginBottom: '0.3rem' }}>ECI Efficiency Rating</div>
            <div style={{ fontSize: '1.5rem', fontWeight: 800, color: indicator.overallScore >= 70 ? 'var(--accent-green)' : 'var(--accent-amber)' }}>
              {indicator.overallScore} / 100
            </div>
            <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '0.2rem' }}>
              Level: {indicator.level}
            </div>
          </div>
        </div>

        {/* ECI Indicator & Sub-score Gauge */}
        <IndicatorGauge indicator={indicator} />

        {/* Detailed Cost Breakdown Table */}
        <div className="glass-card" style={{ padding: '1.5rem' }}>
          <h3 style={{ fontSize: '1.1rem', fontWeight: 700, marginBottom: '0.5rem' }}>
            Comprehensive Itemized Cost Breakdown
          </h3>
          <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginBottom: '1.2rem' }}>
            Categorized line-item costs allocated under {input.incoterm} rules.
          </p>

          <div style={{ overflowX: 'auto' }}>
            <table className="data-table">
              <thead>
                <tr>
                  <th>Category</th>
                  <th>Cost Item Name</th>
                  <th>Responsibility</th>
                  <th>Incoterm Note</th>
                  <th>Amount ({input.targetCurrency})</th>
                  <th>Amount (INR ₹)</th>
                </tr>
              </thead>
              <tbody>
                {costBreakdown.components.map(comp => (
                  <tr key={comp.id}>
                    <td>
                      <span className="badge badge-blue" style={{ fontSize: '0.7rem' }}>{comp.category}</span>
                    </td>
                    <td>
                      <strong>{comp.name}</strong>
                      {comp.breakdownDetails && (
                        <div style={{ fontSize: '0.75rem', color: 'var(--text-subtle)' }}>{comp.breakdownDetails}</div>
                      )}
                    </td>
                    <td>
                      <span className={`badge ${comp.isSellerResponsibility ? 'badge-green' : 'badge-amber'}`}>
                        {comp.isSellerResponsibility ? 'Seller' : 'Buyer'}
                      </span>
                    </td>
                    <td style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>{comp.incotermNote}</td>
                    <td style={{ fontWeight: 600 }}>
                      {formatCurrency(comp.amountTargetCurrency, input.targetCurrency)}
                    </td>
                    <td style={{ fontWeight: 700, color: 'var(--text-main)' }}>
                      {formatCurrency(comp.amountInr, 'INR')}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Trade Route Alternatives Comparison */}
        <RouteComparison
          routes={routeAlternatives}
          selectedRouteId={selectedRouteId}
          onSelectRoute={setSelectedRouteId}
        />

        {/* Interactive Map View */}
        <div>
          <h3 style={{ fontSize: '1.1rem', fontWeight: 700, marginBottom: '0.75rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <MapPin size={20} style={{ color: 'var(--primary)' }} />
            Geographic Trade Route Map ({currentRoute.name})
          </h3>
          <TradeMap
            routes={routeAlternatives}
            selectedRouteId={selectedRouteId}
            onSelectRoute={setSelectedRouteId}
          />
        </div>
      </div>
    </div>
  );
};
