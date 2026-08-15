export const INCOTERMS = {
    EXW: {
        code: 'EXW',
        name: 'Ex Works',
        description: 'Seller makes the goods available at their premises. Buyer assumes all risks, freight, insurance, and export/import formalities.',
        riskTransferPoint: 'Seller factory/warehouse floor upon collection',
        sellerResponsibilities: [
            'Packaging goods for export',
            'Making goods available at seller premises'
        ],
        buyerResponsibilities: [
            'Loading onto buyer vehicle',
            'Inland transport to port/airport',
            'Export customs clearance & duties',
            'International freight & insurance',
            'Import clearance, duties & delivery'
        ],
        recommendedFor: 'Experienced buyers with established Indian inland transport networks.'
    },
    FOB: {
        code: 'FOB',
        name: 'Free On Board',
        description: 'Seller clears goods for export and loads them onto the vessel specified by the buyer. Risk transfers once goods are on board.',
        riskTransferPoint: 'On board the ocean vessel at origin port',
        sellerResponsibilities: [
            'Export packaging & documentation',
            'Inland transport to Indian port',
            'Export customs clearance & port charges',
            'Loading onto ocean vessel'
        ],
        buyerResponsibilities: [
            'International ocean freight',
            'Marine cargo insurance',
            'Destination port handling & import clearance',
            'Last-mile delivery to destination'
        ],
        recommendedFor: 'Standard ocean container shipments where buyers arrange ocean freight.'
    },
    CFR: {
        code: 'CFR',
        name: 'Cost and Freight',
        description: 'Seller pays for freight to destination port, but risk transfers to buyer as soon as goods are loaded on board at origin port.',
        riskTransferPoint: 'On board the ocean vessel at origin port',
        sellerResponsibilities: [
            'Export packaging & documentation',
            'Inland transport to origin port',
            'Export customs clearance & terminal handling',
            'International ocean freight to destination port'
        ],
        buyerResponsibilities: [
            'Cargo insurance during ocean transit',
            'Destination port unloading & handling',
            'Import customs clearance & tariffs',
            'Last-mile delivery to warehouse'
        ],
        recommendedFor: 'Ocean freight when buyer has existing cargo insurance policies.'
    },
    CIF: {
        code: 'CIF',
        name: 'Cost, Insurance and Freight',
        description: 'Seller pays for freight and minimum marine insurance to destination port. Risk transfers to buyer when loaded on vessel.',
        riskTransferPoint: 'On board the ocean vessel at origin port',
        sellerResponsibilities: [
            'Export packaging & documentation',
            'Inland transport & export clearance',
            'International ocean freight',
            'Marine cargo insurance cover'
        ],
        buyerResponsibilities: [
            'Destination port handling & discharge',
            'Import customs clearance & local taxes/duties',
            'Final delivery from destination port'
        ],
        recommendedFor: 'Most popular Incoterm for Indian MSME exporters shipping sea freight.'
    },
    DAP: {
        code: 'DAP',
        name: 'Delivered at Place',
        description: 'Seller delivers goods ready for unloading at named destination. Buyer handles import clearance and tariffs.',
        riskTransferPoint: 'At named destination facility before unloading',
        sellerResponsibilities: [
            'Export packaging & documentation',
            'Inland transport & export clearance',
            'International main carriage freight & insurance',
            'Last-mile delivery to buyer destination address'
        ],
        buyerResponsibilities: [
            'Import clearance & customs paperwork',
            'Payment of import duties & local VAT/taxes',
            'Unloading goods at destination'
        ],
        recommendedFor: 'Competitive MSMEs offering end-to-end delivery experience.'
    },
    DDP: {
        code: 'DDP',
        name: 'Delivered Duty Paid',
        description: 'Maximum responsibility for seller. Seller delivers goods cleared for import with all duties and taxes paid.',
        riskTransferPoint: 'At named destination address ready for unloading',
        sellerResponsibilities: [
            'Export packaging & documentation',
            'Inland transport & export clearance',
            'International freight & insurance',
            'Destination port handling',
            'Import customs clearance, duties & destination VAT',
            'Last-mile delivery to buyer'
        ],
        buyerResponsibilities: [
            'Unloading goods at buyer facility'
        ],
        recommendedFor: 'High-margin MSME exports or selling directly to foreign e-commerce buyers.'
    }
};
