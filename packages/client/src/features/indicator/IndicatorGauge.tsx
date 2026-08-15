import React from 'react';
import { ExportCostIndicator } from '@export-cost/shared';
import { Award, CheckCircle2, Info, ShieldAlert, Zap } from 'lucide-react';

interface IndicatorGaugeProps {
  indicator: ExportCostIndicator;
}

export const IndicatorGauge: React.FC<IndicatorGaugeProps> = ({ indicator }) => {
  const { overallScore, level, subScores, recommendations, benchmarkComparison } = indicator;

  const getLevelColor = (lvl: string) => {
    switch (lvl) {
      case 'EXCELLENT': return 'var(--accent-green)';
      case 'GOOD': return 'var(--primary)';
      case 'MODERATE': return 'var(--accent-amber)';
      default: return 'var(--accent-red)';
    }
  };

  const scoreColor = getLevelColor(level);

  return (
    <div className="glass-card" style={{ padding: '1.5rem' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.2rem' }}>
        <div>
          <h3 style={{ fontSize: '1.1rem', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <Award style={{ color: scoreColor }} size={22} />
            Export Cost Indicator (ECI)
          </h3>
          <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
            Normalized multi-vector efficiency score for Indian MSME shipments
          </p>
        </div>
        <div style={{
          padding: '0.4rem 0.9rem',
          borderRadius: '9999px',
          background: `${scoreColor}20`,
          border: `1px solid ${scoreColor}`,
          color: scoreColor,
          fontWeight: 700,
          fontSize: '0.85rem'
        }}>
          {level} ({overallScore}/100)
        </div>
      </div>

      {/* Main Meter Circle / Progress Bar */}
      <div style={{ margin: '1.5rem 0' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem', marginBottom: '0.4rem' }}>
          <span style={{ color: 'var(--text-muted)' }}>Overall Export Readiness & Efficiency</span>
          <span style={{ fontWeight: 700, color: scoreColor }}>{overallScore} %</span>
        </div>
        <div style={{ width: '100%', height: '12px', background: 'rgba(255,255,255,0.06)', borderRadius: '6px', overflow: 'hidden' }}>
          <div style={{
            width: `${overallScore}%`,
            height: '100%',
            background: `linear-gradient(90deg, ${scoreColor}88, ${scoreColor})`,
            borderRadius: '6px',
            transition: 'width 0.8s ease'
          }} />
        </div>
      </div>

      {/* Sub-scores breakdown */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '1rem', marginTop: '1.5rem' }}>
        <SubScoreBar label="Cost Efficiency (40%)" score={subScores.costEfficiency} color="var(--accent-green)" />
        <SubScoreBar label="Transit Speed (20%)" score={subScores.transitSpeed} color="var(--primary)" />
        <SubScoreBar label="Route Reliability (15%)" score={subScores.routeReliability} color="var(--accent-purple)" />
        <SubScoreBar label="Route Complexity (10%)" score={subScores.routeComplexity} color="var(--accent-cyan)" />
        <SubScoreBar label="Risk Rating (10%)" score={subScores.riskRating} color="var(--accent-amber)" />
        <SubScoreBar label="Sustainability (5%)" score={subScores.sustainability} color="var(--accent-green)" />
      </div>

      {/* Benchmark comparison note */}
      <div style={{
        marginTop: '1.5rem',
        padding: '0.75rem 1rem',
        background: 'rgba(255,255,255,0.03)',
        borderRadius: 'var(--radius-md)',
        fontSize: '0.82rem',
        color: 'var(--text-muted)',
        display: 'flex',
        alignItems: 'center',
        gap: '0.6rem'
      }}>
        <Info size={16} style={{ color: 'var(--primary)', flexShrink: 0 }} />
        <span><strong>MSME Benchmark:</strong> {benchmarkComparison}</span>
      </div>

      {/* Actionable Recommendations */}
      <div style={{ marginTop: '1.5rem' }}>
        <h4 style={{ fontSize: '0.9rem', fontWeight: 600, marginBottom: '0.75rem', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
          <Zap size={16} style={{ color: 'var(--accent-amber)' }} />
          Actionable MSME Optimization Guidance
        </h4>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
          {recommendations.map((rec, i) => (
            <div key={i} style={{ display: 'flex', alignItems: 'flex-start', gap: '0.5rem', fontSize: '0.83rem', color: 'var(--text-main)' }}>
              <CheckCircle2 size={16} style={{ color: 'var(--accent-green)', flexShrink: 0, marginTop: '2px' }} />
              <span>{rec}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

const SubScoreBar: React.FC<{ label: string; score: number; color: string }> = ({ label, score, color }) => (
  <div style={{ background: 'rgba(255,255,255,0.02)', padding: '0.65rem 0.85rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-card)' }}>
    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.75rem', marginBottom: '0.3rem', color: 'var(--text-muted)' }}>
      <span>{label}</span>
      <span style={{ fontWeight: 700, color: 'var(--text-main)' }}>{score}</span>
    </div>
    <div style={{ width: '100%', height: '6px', background: 'rgba(255,255,255,0.06)', borderRadius: '3px', overflow: 'hidden' }}>
      <div style={{ width: `${score}%`, height: '100%', background: color, borderRadius: '3px' }} />
    </div>
  </div>
);
