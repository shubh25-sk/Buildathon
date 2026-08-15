# Security & Compliance Considerations

1. **Authentication**: JWT token authorization headers with bearer format. Local mock auth provides identity claims identical to AWS Cognito JWTs.
2. **Data Isolation**: Calculations and organization profiles scoped to `organization_id`.
3. **Input Sanitation & Floating-Point Safety**: Uses strict TypeScript types and `decimal.js` for financial rounding, avoiding IEEE-754 precision loss.
4. **CORS & Rate Limiting**: Express CORS enabled for client origin, with headers sanitization.
