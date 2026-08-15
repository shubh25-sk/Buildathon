# Calculation Engine Specification

## 1. Cost Components Engine
The calculation engine evaluates 15 cost components using floating-point safe `decimal.js` arithmetic:

- **Product Value**: Declared invoice value.
- **Export Packaging**: Based on package type (Box, Pallet, Container).
- **Inland Freight**: `distanceKm * weightTons * ₹28`.
- **Origin Handling (THC)**: Terminal charges at origin port/airport.
- **Documentation**: Bill of Lading, CoO, Shipping Bill filing.
- **Customs Clearance**: CHA agent fee + ICEGATE EDI filing.
- **Category Inspection**: Required for Agri, Pharma, Chemicals.
- **Main Freight**: Volumetric chargeable weight calculation for air; CBM distance rate for ocean.
- **Fuel Surcharge**: 12% BAF factor.
- **Cargo Insurance**: 0.35% of (CIF value × 110%).
- **Destination Charges**: Discharge and terminal fees.
- **Import Duties**: 5% average tariff (DDP only).
- **Last-Mile Delivery**: Port to destination buyer address.
- **Bank LC Fees**: 0.5% trade finance processing fee.
- **Contingency Buffer**: 2.5% default reserve.

## 2. Export Cost Indicator (ECI) Formula
```
ECI Score = (CostEfficiency * 0.40) + (TransitSpeed * 0.20) + (RouteReliability * 0.15) + (RouteComplexity * 0.10) + (RiskRating * 0.10) + (Sustainability * 0.05)
```
- **80 – 100**: EXCELLENT
- **65 – 79**: GOOD
- **50 – 64**: MODERATE
- **< 50**: CHALLENGING
