import React, { useEffect } from 'react';
import { MapContainer, TileLayer, Marker, Popup, Polyline, useMap } from 'react-leaflet';
import L from 'leaflet';
import { Route } from '@export-cost/shared';

// Fix Leaflet default icon path issues in Vite
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

interface TradeMapProps {
  routes: Route[];
  selectedRouteId?: string;
  onSelectRoute?: (routeId: string) => void;
  height?: string;
}

// Map Auto-Bounds Controller
const FitBounds: React.FC<{ routes: Route[] }> = ({ routes }) => {
  const map = useMap();

  useEffect(() => {
    if (!routes || routes.length === 0) return;

    const points: [number, number][] = [];
    routes.forEach(route => {
      route.legs.forEach(leg => {
        points.push([leg.origin.lat, leg.origin.lng]);
        points.push([leg.destination.lat, leg.destination.lng]);
      });
    });

    if (points.length > 0) {
      const bounds = L.latLngBounds(points);
      map.fitBounds(bounds, { padding: [40, 40] });
    }
  }, [routes, map]);

  return null;
};

export const TradeMap: React.FC<TradeMapProps> = ({
  routes,
  selectedRouteId,
  onSelectRoute,
  height = '480px'
}) => {
  if (!routes || routes.length === 0) {
    return (
      <div className="glass-card" style={{ height, display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--text-muted)' }}>
        No route data available to display on map.
      </div>
    );
  }

  const primaryRoute = routes.find(r => r.id === selectedRouteId) || routes[0];

  const getModeColor = (mode: string) => {
    switch (mode) {
      case 'AIR': return '#F59E0B'; // Orange
      case 'SEA': return '#3B82F6'; // Blue
      case 'RAIL': return '#8B5CF6'; // Purple
      default: return '#10B981';    // Green Road
    }
  };

  return (
    <div className="glass-card" style={{ height, overflow: 'hidden', position: 'relative' }}>
      <MapContainer
        center={[20.59, 78.96]} // India center
        zoom={4}
        scrollWheelZoom={true}
        style={{ height: '100%', width: '100%' }}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />

        <FitBounds routes={routes} />

        {/* Render Route Leg Polylines */}
        {routes.map(route => {
          const isSelected = route.id === (selectedRouteId || primaryRoute.id);
          const opacity = isSelected ? 0.9 : 0.35;
          const weight = isSelected ? 4 : 2;

          return route.legs.map((leg, idx) => {
            // Build positions: origin → waypoints → destination
            const positions: [number, number][] = [
              [leg.origin.lat, leg.origin.lng]
            ];

            // Insert intermediate waypoints for realistic route rendering
            if (leg.waypoints && leg.waypoints.length > 0) {
              leg.waypoints.forEach(wp => {
                positions.push([wp.lat, wp.lng]);
              });
            }

            positions.push([leg.destination.lat, leg.destination.lng]);

            return (
              <Polyline
                key={`${route.id}-leg-${idx}`}
                positions={positions}
                pathOptions={{
                  color: getModeColor(leg.mode),
                  weight,
                  opacity,
                  dashArray: leg.mode === 'AIR' ? '6, 8' : undefined
                }}
                eventHandlers={{
                  click: () => onSelectRoute && onSelectRoute(route.id)
                }}
              >
                <Popup>
                  <div style={{ padding: '0.2rem', fontFamily: 'var(--font-family)', color: '#0F172A' }}>
                    <h4 style={{ margin: 0, fontSize: '0.9rem', color: '#1E293B' }}>{leg.carrier}</h4>
                    <p style={{ margin: '0.3rem 0', fontSize: '0.8rem' }}>
                      <strong>Leg {leg.legOrder}:</strong> {leg.origin.name} → {leg.destination.name}
                    </p>
                    <p style={{ margin: '0.2rem 0', fontSize: '0.78rem', color: '#475569' }}>
                      Mode: {leg.mode} | Distance: {leg.distanceKm} km | Transit: {Math.round(leg.transitTimeHours / 24)} Days
                    </p>
                    <span style={{ fontSize: '0.75rem', fontWeight: 600, color: '#2563EB' }}>
                      Part of: {route.name}
                    </span>
                  </div>
                </Popup>
              </Polyline>
            );
          });
        })}

        {/* Render Origin & Destination Markers for Selected Route */}
        {primaryRoute.legs.map((leg, idx) => (
          <React.Fragment key={`marker-leg-${idx}`}>
            <Marker position={[leg.origin.lat, leg.origin.lng]}>
              <Popup>
                <div style={{ color: '#0F172A' }}>
                  <strong>{leg.origin.name}</strong> ({leg.origin.type})
                  <br />
                  <span style={{ fontSize: '0.75rem', color: '#64748B' }}>{leg.origin.country}</span>
                </div>
              </Popup>
            </Marker>

            {idx === primaryRoute.legs.length - 1 && (
              <Marker position={[leg.destination.lat, leg.destination.lng]}>
                <Popup>
                  <div style={{ color: '#0F172A' }}>
                    <strong>{leg.destination.name}</strong> ({leg.destination.type})
                    <br />
                    <span style={{ fontSize: '0.75rem', color: '#64748B' }}>{leg.destination.country}</span>
                  </div>
                </Popup>
              </Marker>
            )}
          </React.Fragment>
        ))}
      </MapContainer>

      {/* Map Legend Overlay */}
      <div style={{
        position: 'absolute',
        bottom: '12px',
        right: '12px',
        zIndex: 1000,
        background: 'rgba(11, 15, 23, 0.88)',
        backdropFilter: 'blur(8px)',
        border: '1px solid var(--border-card)',
        padding: '0.6rem 0.9rem',
        borderRadius: 'var(--radius-md)',
        fontSize: '0.75rem',
        color: 'var(--text-main)',
        display: 'flex',
        flexDirection: 'column',
        gap: '0.3rem'
      }}>
        <div style={{ fontWeight: 700, marginBottom: '0.2rem', color: 'var(--text-muted)' }}>Route Legend</div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <span style={{ width: '14px', height: '3px', background: '#3B82F6', display: 'inline-block' }}></span>
          Ocean Freight (Sea)
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <span style={{ width: '14px', height: '3px', background: '#F59E0B', display: 'inline-block' }}></span>
          Air Cargo Express
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <span style={{ width: '14px', height: '3px', background: '#10B981', display: 'inline-block' }}></span>
          Inland Road Haulage
        </div>
      </div>
    </div>
  );
};
