import { Router } from 'express';
import { calculateExportCost } from '@export-cost/calculation-engine';
import { CalculationInput, CalculationResult } from '@export-cost/shared';
import { DESTINATIONS, ORIGINS, PORTS } from '../data/seed/locations.js';

export const calculationsRouter = Router();

// In-memory store for MVP persistence
const calculationStore = new Map<string, CalculationResult>();

// POST /api/v1/calculations
calculationsRouter.post('/', (req, res) => {
  try {
    const input: CalculationInput = req.body;

    if (!input || !input.originId || !input.destinationId || !input.declaredValue) {
      return res.status(400).json({
        success: false,
        error: 'Invalid calculation input. Missing originId, destinationId, or declaredValue.'
      });
    }

    const origin = ORIGINS.find(o => o.id === input.originId) || ORIGINS[0];
    const destination = DESTINATIONS.find(d => d.id === input.destinationId) || DESTINATIONS[0];
    const originPort = PORTS.find(p => p.id === origin.nearestPortId) || PORTS[0];

    const result = calculateExportCost({
      input,
      origin,
      destination,
      originPort
    });

    calculationStore.set(result.id, result);

    res.status(201).json({
      success: true,
      data: result
    });
  } catch (err: any) {
    res.status(500).json({
      success: false,
      error: err.message || 'Internal calculation error'
    });
  }
});

// GET /api/v1/calculations/:id
calculationsRouter.get('/:id', (req, res) => {
  const calc = calculationStore.get(req.params.id);
  if (!calc) {
    return res.status(404).json({
      success: false,
      error: 'Calculation not found'
    });
  }
  res.json({ success: true, data: calc });
});

// GET /api/v1/calculations
calculationsRouter.get('/', (req, res) => {
  const list = Array.from(calculationStore.values());
  res.json({ success: true, count: list.length, data: list });
});
