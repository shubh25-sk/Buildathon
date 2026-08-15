import { GlossaryTerm } from '@export-cost/shared';

export const GLOSSARY_TERMS: GlossaryTerm[] = [
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
