export type IncotermCode = 'EXW' | 'FOB' | 'CFR' | 'CIF' | 'DAP' | 'DDP';

export type TransportMode = 'SEA' | 'AIR' | 'ROAD' | 'RAIL' | 'MULTIMODAL';

export type CurrencyCode = 'INR' | 'USD' | 'EUR' | 'GBP' | 'AED' | 'SGD' | 'JPY';

export type PackageType = 'BOX' | 'PALLET' | 'CRATE' | 'DRUM' | 'CONTAINER_20FT' | 'CONTAINER_40FT';

export type UrgencyLevel = 'STANDARD' | 'EXPRESS' | 'ECONOMY';

export type ProductCategory = 
  | 'TEXTILES'
  | 'AGRICULTURE'
  | 'ENGINEERING'
  | 'PHARMA'
  | 'CHEMICALS'
  | 'HANDICRAFTS'
  | 'ELECTRONICS'
  | 'OTHER';

export type LocationType = 'ORIGIN' | 'DESTINATION' | 'PORT' | 'AIRPORT';

export interface Location {
  id: string;
  name: string;
  state?: string;
  country: string;
  lat: number;
  lng: number;
  type: LocationType;
  code?: string;
  nearestPortId?: string;
  nearestAirportId?: string;
}

export interface Port extends Location {
  portType: 'SEA' | 'AIR';
  unlocode: string;
  handlingFeeUsd: number;
}

export interface RouteLeg {
  id: string;
  legOrder: number;
  mode: TransportMode;
  origin: Location;
  destination: Location;
  distanceKm: number;
  transitTimeHours: number;
  carrier: string;
  carbonEmissionsKg: number;
  estimatedCostUsd: number;
  /** Intermediate waypoints for realistic route rendering (e.g. ocean corridors) */
  waypoints?: { lat: number; lng: number }[];
}

export interface Route {
  id: string;
  name: string;
  transportMode: TransportMode;
  origin: Location;
  destination: Location;
  legs: RouteLeg[];
  totalDistanceKm: number;
  totalTransitDays: number;
  totalCostUsd: number;
  reliabilityScore: number; // 0 to 100
  riskScore: number; // 0 to 100 (higher = riskier)
  carbonKg: number;
  isDirect: boolean;
  badges: string[];
}

export type CostCategory =
  | 'PRODUCT'
  | 'INLAND'
  | 'ORIGIN_HANDLING'
  | 'DOCUMENTATION'
  | 'CUSTOMS'
  | 'FREIGHT'
  | 'INSURANCE'
  | 'DESTINATION_CHARGES'
  | 'LAST_MILE'
  | 'BANKING'
  | 'CONTINGENCY';

export interface CostComponent {
  id: string;
  code: string;
  name: string;
  category: CostCategory;
  amount: number;
  amountInr: number;
  amountTargetCurrency: number;
  isSellerResponsibility: boolean;
  incotermNote: string;
  breakdownDetails?: string;
}

export interface CostBreakdown {
  components: CostComponent[];
  totalSellerCost: number;
  totalBuyerCost: number;
  totalExportCost: number;
  currency: CurrencyCode;
  totalExportCostInr: number;
  totalExportCostTarget: number;
  perKgCostInr: number;
  perCbmCostInr: number;
  costSharePercentage: {
    freightSharePct: number;
    logisticsSharePct: number;
    dutiesCustomsSharePct: number;
    productSharePct: number;
  };
}

export interface ExportCostIndicator {
  overallScore: number; // 0 - 100
  level: 'EXCELLENT' | 'GOOD' | 'MODERATE' | 'CHALLENGING';
  subScores: {
    costEfficiency: number;      // 40% weight
    transitSpeed: number;        // 20% weight
    routeReliability: number;    // 15% weight
    routeComplexity: number;     // 10% weight
    riskRating: number;          // 10% weight
    sustainability: number;      // 5% weight
  };
  recommendations: string[];
  benchmarkComparison: string;
}

export interface CalculationInput {
  productName: string;
  category: ProductCategory;
  declaredValue: number;
  valueCurrency: CurrencyCode;
  quantity: number;
  unit: string;
  weightKg: number;
  volumeCbm: number;
  packageType: PackageType;
  originId: string;
  destinationId: string;
  incoterm: IncotermCode;
  transportMode: TransportMode;
  urgency: UrgencyLevel;
  includeInsurance: boolean;
  contingencyPct?: number;
  targetCurrency: CurrencyCode;
}

export interface CalculationResult {
  id: string;
  timestamp: string;
  input: CalculationInput;
  origin: Location;
  destination: Location;
  costBreakdown: CostBreakdown;
  indicator: ExportCostIndicator;
  selectedRoute: Route;
  routeAlternatives: Route[];
  exchangeRates: Record<CurrencyCode, number>; // Base INR
  isEstimatedData: boolean;
  disclaimer: string;
}

export interface RouteComparison {
  calculationId: string;
  routes: Route[];
  recommendedRouteId: string;
  comparisonMatrix: {
    routeId: string;
    routeName: string;
    transportMode: TransportMode;
    totalCostInr: number;
    transitDays: number;
    eciScore: number;
    carbonKg: number;
    reliabilityScore: number;
    riskScore: number;
    badges: string[];
  }[];
}

export interface IncotermDefinition {
  code: IncotermCode;
  name: string;
  description: string;
  riskTransferPoint: string;
  sellerResponsibilities: string[];
  buyerResponsibilities: string[];
  recommendedFor: string;
}

export interface GlossaryTerm {
  id: string;
  term: string;
  abbreviation?: string;
  category: 'INCOTERMS' | 'DOCUMENTATION' | 'FREIGHT' | 'CUSTOMS' | 'FINANCE' | 'GENERAL';
  definition: string;
  example?: string;
  incotermRelevance?: string;
}
