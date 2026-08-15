export function calculateAllComponents(ctx) {
    const { input, distanceInlandKm, distanceMainKm, ratesInr } = ctx;
    const components = [];
    // Currency rates relative to INR
    const valCurrencyRateInr = ratesInr[input.valueCurrency] || 1;
    const targetRateInr = ratesInr[input.targetCurrency] || 1;
    // 1. Product Declared Value
    const productCostInr = input.declaredValue * valCurrencyRateInr;
    components.push({
        id: 'comp-product-value',
        code: 'PRODUCT_VALUE',
        name: 'Declared Product Value',
        category: 'PRODUCT',
        amount: input.declaredValue,
        amountInr: productCostInr,
        amountTargetCurrency: productCostInr / targetRateInr,
        isSellerResponsibility: true,
        incotermNote: 'Included in all Incoterms as base product cost.',
        breakdownDetails: `${input.quantity} ${input.unit} @ declared value`
    });
    // 2. Export Packaging
    let pkgCostPerUnit = 150; // INR per package
    if (input.packageType === 'PALLET')
        pkgCostPerUnit = 1200;
    if (input.packageType === 'CRATE')
        pkgCostPerUnit = 2500;
    if (input.packageType === 'CONTAINER_20FT')
        pkgCostPerUnit = 15000;
    if (input.packageType === 'CONTAINER_40FT')
        pkgCostPerUnit = 25000;
    const packagingInr = Math.max(pkgCostPerUnit * (input.quantity || 1), 500);
    components.push({
        id: 'comp-packaging',
        code: 'PACKAGING',
        name: 'Export Packaging & Labeling',
        category: 'PRODUCT',
        amountInr: packagingInr,
        amount: packagingInr / valCurrencyRateInr,
        amountTargetCurrency: packagingInr / targetRateInr,
        isSellerResponsibility: true,
        incotermNote: 'Seller responsibility under EXW, FOB, CIF, DAP, DDP.',
        breakdownDetails: `${input.packageType} export grade packaging`
    });
    // 3. Inland Transportation (Origin to Port/Airport)
    // ~₹25 per km per ton equivalent
    const weightTons = Math.max(input.weightKg / 1000, 0.1);
    const inlandRatePerKmTon = 28;
    const inlandTransportInr = Math.round(Math.max(distanceInlandKm * weightTons * inlandRatePerKmTon, 1800));
    components.push({
        id: 'comp-inland-transport',
        code: 'INLAND_TRANSPORT',
        name: 'Inland Freight (Factory to Port/Airport)',
        category: 'INLAND',
        amountInr: inlandTransportInr,
        amount: inlandTransportInr / valCurrencyRateInr,
        amountTargetCurrency: inlandTransportInr / targetRateInr,
        isSellerResponsibility: true, // EXW excludes this
        incotermNote: 'Buyer pays under EXW; Seller pays under FOB, CIF, DAP, DDP.',
        breakdownDetails: `${distanceInlandKm} km truck haulage (${weightTons.toFixed(2)} tons)`
    });
    // 4. Origin Terminal & CFS Handling
    const originHandlingInr = input.transportMode === 'AIR' ? 4500 : 7500;
    components.push({
        id: 'comp-origin-handling',
        code: 'ORIGIN_HANDLING',
        name: 'Origin Port / Airport Terminal Handling (THC)',
        category: 'ORIGIN_HANDLING',
        amountInr: originHandlingInr,
        amount: originHandlingInr / valCurrencyRateInr,
        amountTargetCurrency: originHandlingInr / targetRateInr,
        isSellerResponsibility: true,
        incotermNote: 'Included from FOB onwards.',
        breakdownDetails: 'CFS stuffing, wharfage, and gate charges at Indian port'
    });
    // 5. Documentation & Certificates
    const docFeesInr = 3800; // Bill of lading, Certificate of Origin (CoC), Shipping Bill
    components.push({
        id: 'comp-documentation',
        code: 'DOCUMENTATION',
        name: 'Export Documentation & Certificate of Origin',
        category: 'DOCUMENTATION',
        amountInr: docFeesInr,
        amount: docFeesInr / valCurrencyRateInr,
        amountTargetCurrency: docFeesInr / targetRateInr,
        isSellerResponsibility: true,
        incotermNote: 'Seller responsibility from FOB onwards.',
        breakdownDetails: 'Bill of Lading / Airway Bill, COO, Shipping Bill filing'
    });
    // 6. Export Customs Clearance (CHA)
    const customsInr = 4500;
    components.push({
        id: 'comp-customs-clearance',
        code: 'CUSTOMS_CLEARANCE',
        name: 'Export Customs Clearance & CHA Fees',
        category: 'CUSTOMS',
        amountInr: customsInr,
        amount: customsInr / valCurrencyRateInr,
        amountTargetCurrency: customsInr / targetRateInr,
        isSellerResponsibility: true,
        incotermNote: 'Seller clears export customs under FOB, CIF, DAP, DDP.',
        breakdownDetails: 'Customs Broker agent fees and EDI ICEGATE filing'
    });
    // 7. Mandatory Category Inspection
    let inspectionInr = 0;
    if (input.category === 'AGRICULTURE' || input.category === 'PHARMA' || input.category === 'CHEMICALS') {
        inspectionInr = 5500; // Phytosanitary or Lab inspection
    }
    if (inspectionInr > 0) {
        components.push({
            id: 'comp-inspection',
            code: 'INSPECTION',
            name: `Pre-shipment ${input.category} Quality Inspection`,
            category: 'DOCUMENTATION',
            amountInr: inspectionInr,
            amount: inspectionInr / valCurrencyRateInr,
            amountTargetCurrency: inspectionInr / targetRateInr,
            isSellerResponsibility: true,
            incotermNote: 'Required for regulated commodity clearance.',
            breakdownDetails: 'Mandatory agency testing & health certificate'
        });
    }
    // 8. International Freight (Main Carriage)
    // Volumetric weight vs gross weight for Air, rate per cbm or ton for Sea
    const volumetricWeightKg = input.volumeCbm * 167; // Air standard 1 CBM = 167 kg
    const chargeableWeightKg = Math.max(input.weightKg, volumetricWeightKg);
    let freightRateUsdPerKgOrCbm = 0.45; // Sea default per kg equiv
    if (input.transportMode === 'AIR') {
        freightRateUsdPerKgOrCbm = input.urgency === 'EXPRESS' ? 4.80 : 3.20;
    }
    else {
        // Ocean freight ~ $1200 - $2200 per 20ft container or ~$45/CBM
        freightRateUsdPerKgOrCbm = Math.max(0.25, (distanceMainKm / 10000) * 0.40);
    }
    const usdRateInr = ratesInr['USD'] || 83.5;
    const freightUsd = input.transportMode === 'AIR'
        ? Math.max(chargeableWeightKg * freightRateUsdPerKgOrCbm, 120)
        : Math.max(input.volumeCbm * 45 * (distanceMainKm / 6000), 250);
    const freightInr = Math.round(freightUsd * usdRateInr);
    components.push({
        id: 'comp-freight',
        code: 'MAIN_FREIGHT',
        name: `International ${input.transportMode} Main Freight`,
        category: 'FREIGHT',
        amountInr: freightInr,
        amount: freightInr / valCurrencyRateInr,
        amountTargetCurrency: freightInr / targetRateInr,
        isSellerResponsibility: true, // EXW and FOB exclude main freight
        incotermNote: 'Buyer pays under EXW & FOB; Seller pays under CFR, CIF, DAP, DDP.',
        breakdownDetails: `${input.transportMode} transport for ${distanceMainKm} km transit`
    });
    // 9. Fuel Surcharge (BAF / FSC)
    const fuelSurchargeInr = Math.round(freightInr * 0.12); // 12% BAF/FSC
    components.push({
        id: 'comp-fuel-surcharge',
        code: 'FUEL_SURCHARGE',
        name: 'Bunker / Fuel Surcharge (BAF)',
        category: 'FREIGHT',
        amountInr: fuelSurchargeInr,
        amount: fuelSurchargeInr / valCurrencyRateInr,
        amountTargetCurrency: fuelSurchargeInr / targetRateInr,
        isSellerResponsibility: true,
        incotermNote: 'Appended to main carriage freight cost.',
        breakdownDetails: '12% fuel surcharge factor'
    });
    // 10. Cargo Marine Insurance
    // 0.35% of CIF Value (Product + Freight + 10% margin)
    const cifBaseInr = (productCostInr + freightInr) * 1.10;
    const insuranceInr = input.includeInsurance ? Math.round(Math.max(cifBaseInr * 0.0035, 1200)) : 0;
    if (input.includeInsurance) {
        components.push({
            id: 'comp-insurance',
            code: 'CARGO_INSURANCE',
            name: 'Marine Cargo Insurance Cover (110% CIF)',
            category: 'INSURANCE',
            amountInr: insuranceInr,
            amount: insuranceInr / valCurrencyRateInr,
            amountTargetCurrency: insuranceInr / targetRateInr,
            isSellerResponsibility: true,
            incotermNote: 'Seller responsibility under CIF & DDP. Excluded in CFR/FOB unless checked.',
            breakdownDetails: 'All-risk Institute Cargo Clauses (A) cover'
        });
    }
    // 11. Destination Port Charges & Unloading
    const destChargesInr = Math.round(originHandlingInr * 1.3); // Foreign port charges slightly higher
    components.push({
        id: 'comp-destination-charges',
        code: 'DESTINATION_CHARGES',
        name: 'Destination Port Handling & Terminal Charges',
        category: 'DESTINATION_CHARGES',
        amountInr: destChargesInr,
        amount: destChargesInr / valCurrencyRateInr,
        amountTargetCurrency: destChargesInr / targetRateInr,
        isSellerResponsibility: false, // Only seller under DAP & DDP
        incotermNote: 'Buyer responsibility except under DAP & DDP.',
        breakdownDetails: 'Destination port discharge and terminal fees'
    });
    // 12. Destination Import Duties & Taxes (Only DDP)
    const importDutyInr = Math.round(productCostInr * 0.05); // Est 5% average duty
    components.push({
        id: 'comp-import-duties',
        code: 'IMPORT_DUTIES',
        name: 'Destination Import Customs Duties & Tariffs',
        category: 'CUSTOMS',
        amountInr: importDutyInr,
        amount: importDutyInr / valCurrencyRateInr,
        amountTargetCurrency: importDutyInr / targetRateInr,
        isSellerResponsibility: false,
        incotermNote: 'Seller pays ONLY under DDP Incoterm.',
        breakdownDetails: 'Estimated foreign country import tariff (~5% avg)'
    });
    // 13. Last-Mile Delivery (Destination Port to Buyer Address)
    const lastMileInr = Math.round(inlandTransportInr * 1.4);
    components.push({
        id: 'comp-last-mile',
        code: 'LAST_MILE',
        name: 'Destination Last-Mile Delivery Haulage',
        category: 'LAST_MILE',
        amountInr: lastMileInr,
        amount: lastMileInr / valCurrencyRateInr,
        amountTargetCurrency: lastMileInr / targetRateInr,
        isSellerResponsibility: false,
        incotermNote: 'Seller pays under DAP & DDP.',
        breakdownDetails: 'Local road delivery to destination buyer premises'
    });
    // 14. Bank Processing & Letter of Credit (LC) Charges
    const bankingInr = Math.round(Math.max(productCostInr * 0.005, 2500)); // 0.5% LC fee
    components.push({
        id: 'comp-banking',
        code: 'BANKING_FEES',
        name: 'Bank LC & Foreign Exchange Processing Fee',
        category: 'BANKING',
        amountInr: bankingInr,
        amount: bankingInr / valCurrencyRateInr,
        amountTargetCurrency: bankingInr / targetRateInr,
        isSellerResponsibility: true,
        incotermNote: 'Indian bank processing fee for export remittance.',
        breakdownDetails: 'Trade finance & swift document processing fee'
    });
    // 15. Contingency Buffer
    const logSubtotalInr = components
        .filter(c => c.category !== 'PRODUCT')
        .reduce((sum, c) => sum + c.amountInr, 0);
    const pct = (input.contingencyPct ?? 2.5) / 100;
    const contingencyInr = Math.round(logSubtotalInr * pct);
    components.push({
        id: 'comp-contingency',
        code: 'CONTINGENCY',
        name: `Logistics Contingency Buffer (${(pct * 100).toFixed(1)}%)`,
        category: 'CONTINGENCY',
        amountInr: contingencyInr,
        amount: contingencyInr / valCurrencyRateInr,
        amountTargetCurrency: contingencyInr / targetRateInr,
        isSellerResponsibility: true,
        incotermNote: 'Recommended reserve for demurrage/exchange fluctuations.',
        breakdownDetails: 'Buffer for unforeseen port delays or currency fluctuations'
    });
    return components;
}
