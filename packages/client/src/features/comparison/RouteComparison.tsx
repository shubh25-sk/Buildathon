import React from 'react';
import { Route } from '@export-cost/shared';
import { formatCurrency } from '@export-cost/shared';
import { Award, CheckCircle, Clock, ShieldAlert, Ship, Zap } from 'lucide-react';

interface RouteComparisonProps {
  routes: Route[];
  selectedRouteId?: string;
  onSelectRoute?: (routeId: string) => void;
}

export const RouteComparison: React.FC<RouteComparisonProps> = ({
  routes,
  selectedRouteId,
  onSelectRoute
}) => {
  if (!routes || routes.length === 0) return null;

  return (
    <div className="glass-card" style={{ padding: '1.5rem' }}>
      <h3 style={{ fontSize: '1.1rem', fontWeight: 700, marginBottom: '0.4rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
        <Ship size={20} style={{ color: 'var(--primary)' }} />
        Trade Route Alternatives & Comparative Analysis
      </h3>
      <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginBottom: '1.25rem' }}>
        Compare logistics modes, transit speed, reliability ratings, carbon footprint, and total freight costs.
      </p>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '1rem' }}>
        {routes.map(route => {
          const isSelected = route.id === selectedRouteId;
          const costInr = Math.round(route.totalCostUsd * 83.5);

          return (
            <div
              key={route.id}
              onClick={() => onSelectRoute && onSelectRoute(route.id)}
              className="glass-card-interactive"
              style={{
                padding: '1.2rem',
                borderRadius: 'var(--radius-md)',
                border: isSelected ? '2px solid var(--primary)' : '1px solid var(--border-card)',
                background: isSelected ? 'rgba(59,130,246,0.08)' : 'var(--bg-card-solid)',
                cursor: 'pointer',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between'
              }}
            >
              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '0.5rem' }}>
                  <span className={`badge ${route.transportMode === 'AIR' ? 'badge-amber' : route.transportMode === 'SEA' ? 'badge-blue' : 'badge-purple'}`}>
                    {route.transportMode} FREIGHT
                  </span>
                  {isSelected && (
                    <span className="badge badge-green">
                      <CheckCircle size={12} /> Active Choice
                    </span>
                  )}
                </div>

                <h4 style={{ fontSize: '0.95rem', fontWeight: 700, marginBottom: '0.5rem', color: 'var(--text-main)' }}>
                  {route.name}
                </h4>

                {/* Badges */}
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.35rem', marginBottom: '1rem' }}>
                  {route.badges.map((b, i) => (
                    <span key={i} style={{ fontSize: '0.7rem', padding: '0.15rem 0.5rem', borderRadius: '4px', background: 'rgba(255,255,255,0.06)', color: 'var(--text-muted)' }}>
                      {b}
                    </span>
                  ))}
                </div>

                {/* Metrics */}
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.5rem', fontSize: '0.8rem', color: 'var(--text-muted)', marginBottom: '1rem' }}>
                  <div>
                    <div>Est. Total Cost:</div>
                    <strong style={{ color: 'var(--text-main)', fontSize: '0.9rem' }}>
                      {formatCurrency(costInr, 'INR')}
                    </strong>
                  </div>
                  <div>
                    <div>Transit Duration:</div>
                    <strong style={{ color: 'var(--text-main)', fontSize: '0.9rem' }}>
                      {route.totalTransitDays} Days
                    </strong>
                  </div>
                  <div>
                    <div>Reliability Rating:</div>
                    <strong style={{ color: 'var(--accent-green)' }}>{route.reliabilityScore} / 100</strong>
                  </div>
                  <div>
                    <div>CO2 Carbon:</div>
                    <strong style={{ color: 'var(--text-main)' }}>{route.carbonKg} kg</strong>
                  </div>
                </div>
              </div>

              <button
                className={`btn btn-sm ${isSelected ? 'btn-primary' : 'btn-outline'}`}
                style={{ width: '100%', marginTop: '0.5rem' }}
              >
                {isSelected ? 'Selected Route' : 'Select Route'}
              </button>
            </div>
          );
        })}
      </div>
    </div>
  );
};
