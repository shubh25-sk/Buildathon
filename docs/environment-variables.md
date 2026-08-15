# Environment Variables Guide

## Client (`packages/client/.env`)
```env
VITE_API_BASE_URL=/api/v1
VITE_ENABLE_MOCK_FALLBACK=true
```

## Server (`packages/server/.env`)
```env
PORT=4000
NODE_ENV=development
JWT_SECRET=super-secret-local-dev-key
DATABASE_URL=postgresql://postgres:postgres@localhost:5432/export_cost_db
```
