import React, { useState, useEffect } from 'react';
import { CalculationInput, CalculationResult } from '@export-cost/shared';
import { runCalculation, getSavedCalculations, deleteCalculation, clearAllCalculations } from '../services/api';
import { DashboardView } from '../features/dashboard/DashboardView';
import { CalculatorWizard } from '../features/calculator/CalculatorWizard';
import { ResultsView } from '../features/results/ResultsView';
import { TradeMap } from '../features/map/TradeMap';
import { GlossaryView } from '../features/glossary/GlossaryView';
import { BookOpen, Calculator, Globe, LayoutDashboard, MapPin, Ship } from 'lucide-react';
import '../styles/global.css';

type ActiveTab = 'dashboard' | 'calculate' | 'results' | 'map' | 'glossary';

export const App: React.FC = () => {
  const [tab, setTab] = useState<ActiveTab>('dashboard');
  const [loading, setLoading] = useState(false);
  const [savedCalculations, setSavedCalculations] = useState<CalculationResult[]>([]);
  const [currentResult, setCurrentResult] = useState<CalculationResult | null>(null);

  useEffect(() => {
    const list = getSavedCalculations();
    setSavedCalculations(list);
    if (list.length > 0 && !currentResult) {
      setCurrentResult(list[0]);
    }
  }, []);

  const handleRunCalculation = async (input: CalculationInput) => {
    setLoading(true);
    try {
      const res = await runCalculation(input);
      setCurrentResult(res);
      const updatedList = getSavedCalculations();
      setSavedCalculations(updatedList);
      setTab('results');
    } catch (err) {
      console.error('Calculation error:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteCalculation = (id: string) => {
    const updated = deleteCalculation(id);
    setSavedCalculations(updated);
    // If the deleted one was currently viewed, clear it
    if (currentResult && currentResult.id === id) {
      setCurrentResult(updated.length > 0 ? updated[0] : null);
    }
  };

  const handleClearHistory = () => {
    clearAllCalculations();
    setSavedCalculations([]);
    setCurrentResult(null);
  };

  return (
    <div className="app-container">
      {/* App Navigation Bar */}
      <header style={{
        background: 'rgba(11, 15, 23, 0.9)',
        backdropFilter: 'blur(12px)',
        borderBottom: '1px solid var(--border-card)',
        position: 'sticky',
        top: 0,
        zIndex: 1000,
        padding: '0.75rem 1.5rem'
      }}>
        <div style={{ maxWidth: '1280px', margin: '0 auto', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', cursor: 'pointer' }} onClick={() => setTab('dashboard')}>
            <div style={{
              width: '38px',
              height: '38px',
              borderRadius: '10px',
              background: 'linear-gradient(135deg, var(--primary) 0%, var(--accent-green) 100%)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#fff'
            }}>
              <Globe size={22} />
            </div>
            <div>
              <h1 style={{ fontSize: '1.05rem', fontWeight: 800, color: 'var(--text-main)', margin: 0, lineHeight: '1.2' }}>
                Export Cost Indicator
              </h1>
              <span style={{ fontSize: '0.72rem', color: 'var(--accent-green)', fontWeight: 600 }}>
                Powered by Grace
              </span>
            </div>
          </div>

          {/* Navigation Links */}
          <nav style={{ display: 'flex', gap: '0.5rem' }}>
            <NavButton active={tab === 'dashboard'} onClick={() => setTab('dashboard')} icon={<LayoutDashboard size={16} />} label="Dashboard" />
            <NavButton active={tab === 'calculate'} onClick={() => setTab('calculate')} icon={<Calculator size={16} />} label="Calculator" />
            {currentResult && (
              <NavButton active={tab === 'results'} onClick={() => setTab('results')} icon={<Ship size={16} />} label="Results & Costs" />
            )}
            <NavButton active={tab === 'map'} onClick={() => setTab('map')} icon={<MapPin size={16} />} label="Route Map" />
            <NavButton active={tab === 'glossary'} onClick={() => setTab('glossary')} icon={<BookOpen size={16} />} label="Glossary" />
          </nav>
        </div>
      </header>

      {/* Main App Body */}
      <main className="main-content">
        {tab === 'dashboard' && (
          <DashboardView
            savedCalculations={savedCalculations}
            onStartNew={() => setTab('calculate')}
            onViewResult={(calc) => {
              setCurrentResult(calc);
              setTab('results');
            }}
            onDeleteCalculation={handleDeleteCalculation}
            onClearHistory={handleClearHistory}
          />
        )}

        {tab === 'calculate' && (
          <CalculatorWizard onCalculate={handleRunCalculation} loading={loading} />
        )}

        {tab === 'results' && currentResult && (
          <ResultsView result={currentResult} onNewCalculation={() => setTab('calculate')} />
        )}

        {tab === 'map' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            <div className="glass-card" style={{ padding: '1rem' }}>
              <h2 style={{ fontSize: '1.2rem', fontWeight: 700 }}>Interactive Ocean & Air Trade Corridor Map</h2>
              <p style={{ fontSize: '0.82rem', color: 'var(--text-muted)' }}>
                Explore origin Indian ports, transshipment hubs, and international maritime delivery corridors.
              </p>
            </div>
            <TradeMap
              routes={currentResult?.routeAlternatives || []}
              selectedRouteId={currentResult?.selectedRoute.id}
              height="600px"
            />
          </div>
        )}

        {tab === 'glossary' && <GlossaryView />}
      </main>

      {/* Footer */}
      <footer style={{
        borderTop: '1px solid var(--border-card)',
        padding: '1.5rem',
        textAlign: 'center',
        fontSize: '0.78rem',
        color: 'var(--text-subtle)',
        marginTop: '3rem'
      }}>
        Export Cost Indicator & Trade Route Map — Built for Indian MSME Exporters. All cost estimates are based on sample benchmark data.
      </footer>
    </div>
  );
};

const NavButton: React.FC<{ active: boolean; onClick: () => void; icon: React.ReactNode; label: string }> = ({
  active,
  onClick,
  icon,
  label
}) => (
  <button
    onClick={onClick}
    style={{
      display: 'flex',
      alignItems: 'center',
      gap: '0.4rem',
      padding: '0.5rem 0.85rem',
      borderRadius: 'var(--radius-md)',
      fontSize: '0.85rem',
      fontWeight: 600,
      border: 'none',
      cursor: 'pointer',
      background: active ? 'var(--primary-glow)' : 'transparent',
      color: active ? 'var(--primary)' : 'var(--text-muted)',
      transition: 'all 0.15s ease'
    }}
  >
    {icon}
    {label}
  </button>
);
