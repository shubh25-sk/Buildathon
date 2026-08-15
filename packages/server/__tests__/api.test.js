import { describe, expect, it } from 'vitest';
import request from 'supertest';
import { app } from '../src/app.js';
describe('Express REST API Endpoints', () => {
    it('GET /api/v1/health returns healthy status', async () => {
        const res = await request(app).get('/api/v1/health');
        expect(res.status).toBe(200);
        expect(res.body.status).toBe('healthy');
    });
    it('GET /api/v1/locations/origins returns Indian origin list', async () => {
        const res = await request(app).get('/api/v1/locations/origins');
        expect(res.status).toBe(200);
        expect(res.body.success).toBe(true);
        expect(res.body.data.length).toBeGreaterThan(3);
    });
    it('GET /api/v1/pricing/exchange-rates returns rates', async () => {
        const res = await request(app).get('/api/v1/pricing/exchange-rates');
        expect(res.status).toBe(200);
        expect(res.body.rates.USD).toBeDefined();
    });
    it('POST /api/v1/calculations runs calculation and returns result', async () => {
        const res = await request(app)
            .post('/api/v1/calculations')
            .send({
            productName: 'Silk Sarees',
            category: 'TEXTILES',
            declaredValue: 250000,
            valueCurrency: 'INR',
            quantity: 300,
            unit: 'Pieces',
            weightKg: 150,
            volumeCbm: 1.2,
            packageType: 'BOX',
            originId: 'origin-delhi',
            destinationId: 'dest-hamburg',
            incoterm: 'CIF',
            transportMode: 'AIR',
            urgency: 'EXPRESS',
            includeInsurance: true,
            targetCurrency: 'EUR'
        });
        expect(res.status).toBe(201);
        expect(res.body.success).toBe(true);
        expect(res.body.data.costBreakdown).toBeDefined();
        expect(res.body.data.indicator.overallScore).toBeGreaterThan(0);
    });
});
