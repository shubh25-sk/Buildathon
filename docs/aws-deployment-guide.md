# AWS Deployment Guide (Phase 2 Roadmap)

## Architecture Mapping
1. **AWS Cognito**: Replace local mock auth middleware with `@aws-sdk/client-cognito-identity-provider`.
2. **AWS RDS (PostgreSQL)**: Deploy PostgreSQL 15 multi-AZ instance using schema in `docs/database-schema.md`.
3. **AWS S3**: Store generated PDF report artifacts.
4. **AWS Lambda + API Gateway**: Wrap Express backend endpoints in serverless Lambda functions via `serverless-http`.
5. **AWS CloudFront + S3**: Host static Vite React client bundle.
