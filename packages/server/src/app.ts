import express from 'express';
import cors from 'cors';
import { mockAuthMiddleware } from './providers/mock-auth.js';
import { locationsRouter } from './routes/locations.js';
import { calculationsRouter } from './routes/calculations.js';
import { routesRouter } from './routes/routes.js';
import { pricingRouter } from './routes/pricing.js';
import { glossaryRouter } from './routes/glossary.js';

export const app = express();

app.use(cors());
app.use(express.json());
app.use(mockAuthMiddleware);

// Health check
app.get('/api/v1/health', (req, res) => {
  res.json({
    status: 'healthy',
    timestamp: new Date().toISOString(),
    service: 'export-cost-indicator-api',
    version: '1.0.0'
  });
});

// API Routes
app.use('/api/v1/locations', locationsRouter);
app.use('/api/v1/calculations', calculationsRouter);
app.use('/api/v1/routes', routesRouter);
app.use('/api/v1/pricing', pricingRouter);
app.use('/api/v1/glossary', glossaryRouter);

const PORT = process.env.PORT || 4000;

if (process.env.NODE_ENV !== 'test') {
  app.listen(PORT, () => {
    console.log(`[Export Cost API] Server listening on http://localhost:${PORT}`);
  });
}
