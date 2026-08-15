import { Router } from 'express';
import { AIRPORTS, DESTINATIONS, ORIGINS, PORTS } from '../data/seed/locations.js';

export const locationsRouter = Router();

// GET /api/v1/locations/origins
locationsRouter.get('/origins', (req, res) => {
  res.json({ success: true, count: ORIGINS.length, data: ORIGINS });
});

// GET /api/v1/locations/destinations
locationsRouter.get('/destinations', (req, res) => {
  res.json({ success: true, count: DESTINATIONS.length, data: DESTINATIONS });
});

// GET /api/v1/locations/ports
locationsRouter.get('/ports', (req, res) => {
  res.json({ success: true, count: PORTS.length, data: PORTS });
});

// GET /api/v1/locations/airports
locationsRouter.get('/airports', (req, res) => {
  res.json({ success: true, count: AIRPORTS.length, data: AIRPORTS });
});
