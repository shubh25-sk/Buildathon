import { calculateExportCost } from '@export-cost/calculation-engine';
import {
  CalculationInput,
  CalculationResult,
  CurrencyCode,
  GlossaryTerm,
  Location,
  Port,
  Route,
  RouteComparison
} from '@export-cost/shared';

const API_BASE = '/api/v1';

// Seed fallbacks for offline execution
const SEED_ORIGINS: Location[] = [
  { id: 'origin-ludhiana', name: 'Ludhiana Industrial Hub', state: 'Punjab', country: 'India', lat: 30.9, lng: 75.85, type: 'ORIGIN', code: 'INLUH' },
  { id: 'origin-delhi', name: 'Delhi NCR (ICD Tughlakabad)', state: 'Delhi', country: 'India', lat: 28.51, lng: 77.26, type: 'ORIGIN', code: 'INTKD' },
  { id: 'origin-jaipur', name: 'Jaipur Handicraft Zone', state: 'Rajasthan', country: 'India', lat: 26.91, lng: 75.78, type: 'ORIGIN', code: 'INJAI' },
  { id: 'origin-tirupur', name: 'Tirupur Textile Hub', state: 'Tamil Nadu', country: 'India', lat: 11.1, lng: 77.34, type: 'ORIGIN', code: 'INTUP' },
  { id: 'origin-surat', name: 'Surat Diamond & Textile City', state: 'Gujarat', country: 'India', lat: 21.17, lng: 72.83, type: 'ORIGIN', code: 'INSUR' },
  { id: 'origin-indore', name: 'Indore Pharma & Agri Zone', state: 'Madhya Pradesh', country: 'India', lat: 22.71, lng: 75.85, type: 'ORIGIN', code: 'ININD' },
  { id: 'origin-moradabad', name: 'Moradabad Brass City', state: 'Uttar Pradesh', country: 'India', lat: 28.83, lng: 78.78, type: 'ORIGIN', code: 'INMBD' },
  { id: 'origin-bengaluru', name: 'Bengaluru Tech & Engineering Hub', state: 'Karnataka', country: 'India', lat: 12.97, lng: 77.59, type: 'ORIGIN', code: 'INBLR' }
];

const SEED_DESTINATIONS: Location[] = [
  { id: 'dest-hamburg', name: 'Hamburg Port City', country: 'Germany', lat: 53.55, lng: 9.99, type: 'DESTINATION', code: 'DEHAM' },
  { id: 'dest-rotterdam', name: 'Rotterdam Logistics Port', country: 'Netherlands', lat: 51.92, lng: 4.47, type: 'DESTINATION', code: 'NLRTM' },
  { id: 'dest-dubai', name: 'Dubai Jebel Ali Free Zone', country: 'UAE', lat: 24.98, lng: 55.06, type: 'DESTINATION', code: 'AEJEA' },
  { id: 'dest-singapore', name: 'Singapore PSA Container Port', country: 'Singapore', lat: 1.29, lng: 103.85, type: 'DESTINATION', code: 'SGSIN' },
  { id: 'dest-newyork', name: 'New York / New Jersey Port Terminal', country: 'USA', lat: 40.71, lng: -74.0, type: 'DESTINATION', code: 'USNYC' },
  { id: 'dest-felixstowe', name: 'Felixstowe Port Hub', country: 'United Kingdom', lat: 51.96, lng: 1.35, type: 'DESTINATION', code: 'GBFXT' },
  { id: 'dest-yokohama', name: 'Yokohama Bay Port', country: 'Japan', lat: 35.44, lng: 139.63, type: 'DESTINATION', code: 'JPYOK' },
  { id: 'dest-sydney', name: 'Sydney Port Botany', country: 'Australia', lat: -33.86, lng: 151.2, type: 'DESTINATION', code: 'AUSYD' }
];

const SEED_PORTS: Port[] = [
  { id: 'port-nhava-sheva', name: 'Jawaharlal Nehru Port (Nhava Sheva)', state: 'Maharashtra', country: 'India', lat: 18.95, lng: 72.95, type: 'PORT', portType: 'SEA', unlocode: 'INNSA', handlingFeeUsd: 110 },
  { id: 'port-mundra', name: 'Adani Ports Mundra', state: 'Gujarat', country: 'India', lat: 22.74, lng: 69.7, type: 'PORT', portType: 'SEA', unlocode: 'INMUN', handlingFeeUsd: 95 },
  { id: 'port-chennai', name: 'Chennai Ocean Terminal', state: 'Tamil Nadu', country: 'India', lat: 13.08, lng: 80.29, type: 'PORT', portType: 'SEA', unlocode: 'INMAA', handlingFeeUsd: 105 }
];

export async function fetchOrigins(): Promise<Location[]> {
  try {
    const res = await fetch(`${API_BASE}/locations/origins`);
    if (res.ok) {
      const body = await res.json();
      return body.data;
    }
  } catch {}
  return SEED_ORIGINS;
}

export async function fetchDestinations(): Promise<Location[]> {
  try {
    const res = await fetch(`${API_BASE}/locations/destinations`);
    if (res.ok) {
      const body = await res.json();
      return body.data;
    }
  } catch {}
  return SEED_DESTINATIONS;
}

export async function fetchPorts(): Promise<Port[]> {
  try {
    const res = await fetch(`${API_BASE}/locations/ports`);
    if (res.ok) {
      const body = await res.json();
      return body.data;
    }
  } catch {}
  return SEED_PORTS;
}

export async function runCalculation(input: CalculationInput): Promise<CalculationResult> {
  try {
    const res = await fetch(`${API_BASE}/calculations`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(input)
    });
    if (res.ok) {
      const body = await res.json();
      saveToLocalStorage(body.data);
      return body.data;
    }
  } catch {}

  // Local fallback calculation engine
  const origins = await fetchOrigins();
  const destinations = await fetchDestinations();

  const origin = origins.find(o => o.id === input.originId) || origins[0];
  const destination = destinations.find(d => d.id === input.destinationId) || destinations[0];

  const result = calculateExportCost({
    input,
    origin,
    destination
  });

  saveToLocalStorage(result);
  return result;
}

export async function compareRoutesApi(routes: Route[]): Promise<RouteComparison> {
  try {
    const res = await fetch(`${API_BASE}/routes/compare`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ routes })
    });
    if (res.ok) {
      const body = await res.json();
      return body.data;
    }
  } catch {}

  // Fallback comparative matrix
  const sorted = [...routes].sort((a, b) => a.totalCostUsd - b.totalCostUsd);
  return {
    calculationId: `cmp-local-${Date.now()}`,
    routes,
    recommendedRouteId: sorted[0].id,
    comparisonMatrix: routes.map(r => ({
      routeId: r.id,
      routeName: r.name,
      transportMode: r.transportMode,
      totalCostInr: Math.round(r.totalCostUsd * 83.5),
      transitDays: r.totalTransitDays,
      eciScore: r.reliabilityScore,
      carbonKg: r.carbonKg,
      reliabilityScore: r.reliabilityScore,
      riskScore: r.riskScore,
      badges: r.badges
    }))
  };
}

export async function fetchExchangeRates(): Promise<Record<CurrencyCode, number>> {
  try {
    const res = await fetch(`${API_BASE}/pricing/exchange-rates`);
    if (res.ok) {
      const body = await res.json();
      return body.rates;
    }
  } catch {}
  return {
    INR: 1.0,
    USD: 83.50,
    EUR: 90.80,
    GBP: 106.20,
    AED: 22.73,
    SGD: 62.15,
    JPY: 0.54
  };
}

// Seed fallback glossary data
const SEED_GLOSSARY: GlossaryTerm[] = [
  {
    id: 'gloss-incoterm',
    term: 'Incoterms (International Commercial Terms)',
    abbreviation: 'Incoterms',
    category: 'INCOTERMS',
    definition: 'A series of 11 pre-defined commercial terms published by the International Chamber of Commerce (ICC) defining seller and buyer responsibilities for freight, insurance, and clearance.',
    example: 'CIF (Cost, Insurance, and Freight) requires the seller to pay freight and insurance to the destination port.',
    incotermRelevance: 'Applies to all 6 Incoterms supported in this application (EXW, FOB, CFR, CIF, DAP, DDP).'
  },
  {
    id: 'gloss-icegate',
    term: 'ICEGATE (Indian Customs EDI Gateway)',
    abbreviation: 'ICEGATE',
    category: 'CUSTOMS',
    definition: 'The national portal of Indian Customs that offers e-filing services for exporters, CHAs, and logistics operators for shipping bills and bill of entry clearance.',
    example: 'Exporters file the Shipping Bill electronically through ICEGATE prior to cargo arrival at Indian ports.',
    incotermRelevance: 'Relevant for Indian origin customs clearance under FOB, CIF, DAP, DDP.'
  },
  {
    id: 'gloss-cha',
    term: 'Customs House Agent',
    abbreviation: 'CHA',
    category: 'CUSTOMS',
    definition: 'A licensed agent authorized to handle customs clearance procedures on behalf of exporters and importers at Indian sea ports and air cargo terminals.',
    example: 'A CHA files the Shipping Bill and handles physical cargo examination at Nhava Sheva or Mundra.',
    incotermRelevance: 'Mandatory for origin customs filing under FOB, CIF, DAP, DDP.'
  },
  {
    id: 'gloss-rodtep',
    term: 'Remission of Duties and Taxes on Exported Products',
    abbreviation: 'RoDTEP',
    category: 'FINANCE',
    definition: 'An Indian government incentive scheme refunding embedded central, state, and local duties/taxes incurred during production that are not otherwise rebated.',
    example: 'Textile exporters receive a 1.5% to 4.3% RoDTEP credit on FOB value credited directly to their e-Scrip account.',
    incotermRelevance: 'Applies to FOB valuation calculated in export invoices.'
  },
  {
    id: 'gloss-hsn',
    term: 'Harmonized System of Nomenclature Code',
    abbreviation: 'HSN Code',
    category: 'DOCUMENTATION',
    definition: 'An internationally standardized numerical method of classifying traded products used by customs authorities worldwide to assess duties.',
    example: 'Cotton T-shirts are classified under HSN Code 6109.10.',
    incotermRelevance: 'Required on all Shipping Bills and Commercial Invoices.'
  },
  {
    id: 'gloss-bill-of-lading',
    term: 'Bill of Lading',
    abbreviation: 'B/L',
    category: 'DOCUMENTATION',
    definition: 'A legal document issued by a ocean carrier to a shipper detailing the type, quantity, and destination of the goods being carried. Serves as a contract of carriage and title document.',
    example: 'An Original Negotiable B/L is surrendered to the bank under Letter of Credit transactions.',
    incotermRelevance: 'Issued upon ocean vessel loading under FOB, CFR, CIF, DAP, DDP.'
  },
  {
    id: 'gloss-demurrage',
    term: 'Demurrage & Detention',
    abbreviation: 'D&D',
    category: 'FREIGHT',
    definition: 'Demurrage is a fee charged by shipping lines when a container remains inside the port terminal beyond free allowed days. Detention applies outside the port.',
    example: 'Standard ocean carriers allow 7 free days at destination port before charging $100/day demurrage.',
    incotermRelevance: 'Included in contingency calculations to protect MSMEs against unexpected port delays.'
  },
  {
    id: 'gloss-thc',
    term: 'Terminal Handling Charges',
    abbreviation: 'THC',
    category: 'FREIGHT',
    definition: 'Fees charged by port container terminal operators for positioning, moving, loading, or unloading containers to/from vessels.',
    example: 'Origin THC at Nhava Sheva ranges between ₹6,500 and ₹9,500 for a 20ft container.',
    incotermRelevance: 'Paid by seller under FOB, CFR, CIF, DAP, DDP.'
  },
  {
    id: 'gloss-exw',
    term: 'Ex Works',
    abbreviation: 'EXW',
    category: 'INCOTERMS',
    definition: 'Seller makes goods available at their premises. Buyer bears all costs and risks from that point onward including loading, export clearance, and transport.',
    example: 'EXW Factory Gate, Ludhiana means buyer collects goods from factory and handles all logistics.',
    incotermRelevance: 'Minimum seller obligation. Best for domestic or experienced international buyers.'
  },
  {
    id: 'gloss-fob',
    term: 'Free on Board',
    abbreviation: 'FOB',
    category: 'INCOTERMS',
    definition: 'Seller delivers goods on board the vessel at the named port of shipment. Risk transfers to buyer when goods pass the ship\'s rail.',
    example: 'FOB Nhava Sheva means seller handles inland freight, customs clearance, and loading onto vessel.',
    incotermRelevance: 'Most common for Indian MSME exporters. Clear cost split at port.'
  },
  {
    id: 'gloss-cfr',
    term: 'Cost and Freight',
    abbreviation: 'CFR',
    category: 'INCOTERMS',
    definition: 'Seller pays cost and freight to destination port. Risk transfers to buyer when goods are loaded on vessel at origin port.',
    example: 'CFR Hamburg Port means seller pays ocean freight but insurance is buyer\'s responsibility.',
    incotermRelevance: 'Similar to FOB but seller also arranges ocean freight. Insurance excluded.'
  },
  {
    id: 'gloss-cif',
    term: 'Cost, Insurance and Freight',
    abbreviation: 'CIF',
    category: 'INCOTERMS',
    definition: 'Seller delivers goods on board vessel, pays freight and minimum insurance to destination port. Risk transfers when goods are loaded.',
    example: 'CIF Rotterdam means seller pays ocean freight and arranges cargo insurance coverage.',
    incotermRelevance: 'Preferred for Letter of Credit transactions. Insurance documentation required.'
  },
  {
    id: 'gloss-dap',
    term: 'Delivered at Place',
    abbreviation: 'DAP',
    category: 'INCOTERMS',
    definition: 'Seller delivers when goods are placed at buyer\'s disposal on arriving vehicle, ready for unloading at named destination.',
    example: 'DAP Warehouse Dubai means seller pays all costs until goods arrive at buyer\'s warehouse.',
    incotermRelevance: 'Seller handles everything except destination import clearance and duties.'
  },
  {
    id: 'gloss-ddp',
    term: 'Delivered Duty Paid',
    abbreviation: 'DDP',
    category: 'INCOTERMS',
    definition: 'Seller delivers goods to named destination, cleared for import and all duties paid. Maximum seller obligation.',
    example: 'DDP Buyer Warehouse, New York means seller handles all logistics including US customs and import duties.',
    incotermRelevance: 'Full door-to-door service. Highest seller risk and cost. Requires destination tax registration.'
  },
  {
    id: 'gloss-shipping-bill',
    term: 'Shipping Bill',
    category: 'DOCUMENTATION',
    definition: 'The principal document for export clearance in India filed through ICEGATE declaring goods for export to customs authorities.',
    example: 'Types include: Free Shipping Bill (no duty drawback), Drawback Shipping Bill (with duty benefit), and RoDTEP Shipping Bill.',
    incotermRelevance: 'Mandatory for all exports from India under any Incoterm.'
  },
  {
    id: 'gloss-letter-of-credit',
    term: 'Letter of Credit',
    abbreviation: 'L/C',
    category: 'FINANCE',
    definition: 'A payment guarantee issued by buyer\'s bank promising payment to seller upon presentation of compliant shipping documents.',
    example: 'Irrevocable L/C at sight means payment upon document submission; Usance L/C allows 30-90 days credit period.',
    incotermRelevance: 'Commonly used with FOB, CFR, and CIF terms. Requires strict document compliance.'
  },
  {
    id: 'gloss-commercial-invoice',
    term: 'Commercial Invoice',
    category: 'DOCUMENTATION',
    definition: 'The primary accounting document for international trade listing seller, buyer, description of goods, Incoterm, value, and payment terms.',
    example: 'Must include: Exporter name/address, Consignee details, Invoice number, HSN code, Incoterm, FOB/CIF value.',
    incotermRelevance: 'Required for all Incoterms. Basis for customs valuation and duty calculation.'
  },
  {
    id: 'gloss-packing-list',
    term: 'Packing List',
    category: 'DOCUMENTATION',
    definition: 'Detailed document listing contents, quantity, dimensions, weights, and packaging details of each carton/package in shipment.',
    example: 'Box 1 of 10: 100 pcs Cotton T-Shirts, Net 12 kg, Gross 13.5 kg, 40×30×25 cm.',
    incotermRelevance: 'Required for all international shipments. Critical for customs inspection.'
  },
  {
    id: 'gloss-certificate-of-origin',
    term: 'Certificate of Origin',
    abbreviation: 'COO',
    category: 'DOCUMENTATION',
    definition: 'An official document certifying the country where goods were manufactured, processed, or produced.',
    example: 'India issues preferential COO under FTAs with UAE, Japan, Korea, ASEAN for duty concessions.',
    incotermRelevance: 'Often mandatory for claiming preferential duty rates under trade agreements.'
  },
  {
    id: 'gloss-freight-forwarder',
    term: 'Freight Forwarder',
    category: 'FREIGHT',
    definition: 'An agent who organizes shipments on behalf of exporters by booking cargo space, arranging documentation, and coordinating with carriers.',
    example: 'Freight forwarders consolidate LCL cargo from multiple exporters into FCL containers.',
    incotermRelevance: 'Essential service provider for exporters using FOB, CFR, CIF, DAP, DDP.'
  },
  {
    id: 'gloss-fcl-lcl',
    term: 'FCL / LCL (Full Container Load / Less than Container Load)',
    abbreviation: 'FCL/LCL',
    category: 'FREIGHT',
    definition: 'FCL means one shipper fills entire container. LCL means multiple shippers share container space charged per CBM.',
    example: 'FCL 20ft rates from Mumbai to Hamburg: $1,200. LCL rates: $45-65 per CBM.',
    incotermRelevance: 'Cost calculation varies significantly. FCL preferred for large volume exporters.'
  },
  {
    id: 'gloss-ior-eor',
    term: 'Importer of Record / Exporter of Record',
    abbreviation: 'IOR/EOR',
    category: 'CUSTOMS',
    definition: 'The legal entity responsible for ensuring goods comply with local laws and paying applicable duties/taxes during import/export.',
    example: 'Under DDP, the seller acts as IOR in destination country and must have tax registration.',
    incotermRelevance: 'Critical for DDP shipments requiring destination country compliance.'
  }
];

export async function fetchGlossary(query?: string, category?: string): Promise<GlossaryTerm[]> {
  try {
    const params = new URLSearchParams();
    if (query) params.append('q', query);
    if (category) params.append('category', category);

    const res = await fetch(`${API_BASE}/glossary?${params.toString()}`);
    if (res.ok) {
      const body = await res.json();
      return body.data;
    }
  } catch {}

  // Fallback to local filtering
  let filtered = SEED_GLOSSARY;

  if (category && category !== 'ALL') {
    filtered = filtered.filter(t => t.category === category);
  }

  if (query) {
    const lowerQuery = query.toLowerCase().trim();
    filtered = filtered.filter(t =>
      t.term.toLowerCase().includes(lowerQuery) ||
      (t.abbreviation && t.abbreviation.toLowerCase().includes(lowerQuery)) ||
      t.definition.toLowerCase().includes(lowerQuery) ||
      (t.example && t.example.toLowerCase().includes(lowerQuery))
    );
  }

  return filtered;
}

// Local Storage Helper
function saveToLocalStorage(calc: CalculationResult) {
  try {
    const existingRaw = localStorage.getItem('export_calculations') || '[]';
    const list: CalculationResult[] = JSON.parse(existingRaw);
    const updated = [calc, ...list.filter(item => item.id !== calc.id)].slice(0, 20);
    localStorage.setItem('export_calculations', JSON.stringify(updated));
  } catch (e) {
    console.warn('LocalStorage save failed:', e);
  }
}

export function getSavedCalculations(): CalculationResult[] {
  try {
    const existingRaw = localStorage.getItem('export_calculations');
    if (existingRaw) return JSON.parse(existingRaw);
  } catch {}
  return [];
}

export function deleteCalculation(id: string): CalculationResult[] {
  try {
    const existingRaw = localStorage.getItem('export_calculations') || '[]';
    const list: CalculationResult[] = JSON.parse(existingRaw);
    const updated = list.filter(item => item.id !== id);
    localStorage.setItem('export_calculations', JSON.stringify(updated));
    return updated;
  } catch (e) {
    console.warn('LocalStorage delete failed:', e);
    return [];
  }
}

export function clearAllCalculations(): void {
  try {
    localStorage.removeItem('export_calculations');
  } catch (e) {
    console.warn('LocalStorage clear failed:', e);
  }
}
