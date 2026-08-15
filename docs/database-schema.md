# Database Schema Specification (PostgreSQL / AWS RDS)

```sql
-- 1. Users Table
CREATE TABLE users (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    email VARCHAR(255) UNIQUE NOT NULL,
    name VARCHAR(255) NOT NULL,
    role VARCHAR(50) DEFAULT 'MSME_EXPORTER',
    organization_id UUID,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 2. Calculations Table
CREATE TABLE calculations (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES users(id),
    product_name VARCHAR(255) NOT NULL,
    category VARCHAR(100) NOT NULL,
    declared_value NUMERIC(15, 2) NOT NULL,
    incoterm VARCHAR(10) NOT NULL,
    transport_mode VARCHAR(20) NOT NULL,
    origin_id VARCHAR(100) NOT NULL,
    destination_id VARCHAR(100) NOT NULL,
    input_params JSONB NOT NULL,
    cost_breakdown JSONB NOT NULL,
    total_export_cost_inr NUMERIC(15, 2) NOT NULL,
    indicator_score INTEGER NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 3. Locations Table
CREATE TABLE locations (
    id VARCHAR(100) PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    state VARCHAR(100),
    country VARCHAR(100) NOT NULL,
    lat NUMERIC(9, 6) NOT NULL,
    lng NUMERIC(9, 6) NOT NULL,
    location_type VARCHAR(50) NOT NULL,
    unlocode VARCHAR(20)
);
```
