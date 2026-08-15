import { Router } from 'express';
import { generateRouteAlternatives } from '@export-cost/calculation-engine';
import { Route, RouteComparison } from '@export-cost/shared';
import { DESTINATIONS, ORIGINS } from '../data/seed/locations.js';

export const routesRouter = Router();

// POST /api/v1/routes/generate
routesRouter.post('/generate', (req, res) => {
  try {
    const { originId, destinationId, weightKg, volumeCbm } = req.body;

    const origin = ORIGINS.find(o => o.id === originId) || ORIGINS[0];
    const destination = DESTINATIONS.find(d => d.id === destinationId) || DESTINATIONS[0];

    const routes = generateRouteAlternatives({
      origin,
      destination,
      weightKg: weightKg || 500,
      volumeCbm: volumeCbm || 2
    });

    res.json({
      success: true,
      count: routes.length,
      data: routes
    });
  } catch (err: any) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// POST /api/v1/routes/compare
routesRouter.post('/compare', (req, res) => {
  try {
    const { routes }: { routes: Route[] } = req.body;

    if (!routes || !Array.isArray(routes) || routes.length === 0) {
      return res.status(400).json({ success: false, error: 'Provide array of routes to compare.' });
    }

    const comparisonMatrix = routes.map(r => ({
      routeId: r.id,
      routeName: r.name,
      transportMode: r.transportMode,
      totalCostInr: Math.round(r.totalCostUsd * 83.5),
      transitDays: r.totalTransitDays,
      eciScore: r.reliabilityScore,
      carbonKg: r.carbonKg,
      reliabilityScore: r.reliabilityScore,
      riskScore: r.riskScore,
      badges: r.badges
    }));

    // Pick recommended route (lowest total cost with reliability >= 80)
    const sorted = [...routes].sort((a, b) => a.totalCostUsd - b.totalCostUsd);
    const recommended = sorted.find(r => r.reliabilityScore >= 80) || sorted[0];

    const comparison: RouteComparison = {
      calculationId: `cmp-${Date.now()}`,
      routes,
      recommendedRouteId: recommended.id,
      comparisonMatrix
    };

    res.json({
      success: true,
      data: comparison
    });
  } catch (err: any) {
    res.status(500).json({ success: false, error: err.message });
  }
});
