/**
 * Filter and tag cost components based on Incoterms 2020 rules
 */
export function applyIncotermRules(components, incoterm) {
    return components.map(comp => {
        let isSeller = false;
        switch (incoterm) {
            case 'EXW':
                // Seller only pays product cost and packaging. Everything else is buyer.
                isSeller = comp.code === 'PRODUCT_VALUE' || comp.code === 'PACKAGING';
                break;
            case 'FOB':
                // Seller pays up to loading on vessel at origin port
                isSeller = [
                    'PRODUCT_VALUE',
                    'PACKAGING',
                    'INLAND_TRANSPORT',
                    'ORIGIN_HANDLING',
                    'DOCUMENTATION',
                    'CUSTOMS_CLEARANCE',
                    'INSPECTION',
                    'BANKING_FEES',
                    'CONTINGENCY'
                ].includes(comp.code);
                break;
            case 'CFR':
                // FOB + main freight & fuel surcharge
                isSeller = [
                    'PRODUCT_VALUE',
                    'PACKAGING',
                    'INLAND_TRANSPORT',
                    'ORIGIN_HANDLING',
                    'DOCUMENTATION',
                    'CUSTOMS_CLEARANCE',
                    'INSPECTION',
                    'MAIN_FREIGHT',
                    'FUEL_SURCHARGE',
                    'BANKING_FEES',
                    'CONTINGENCY'
                ].includes(comp.code);
                break;
            case 'CIF':
                // CFR + marine cargo insurance
                isSeller = [
                    'PRODUCT_VALUE',
                    'PACKAGING',
                    'INLAND_TRANSPORT',
                    'ORIGIN_HANDLING',
                    'DOCUMENTATION',
                    'CUSTOMS_CLEARANCE',
                    'INSPECTION',
                    'MAIN_FREIGHT',
                    'FUEL_SURCHARGE',
                    'CARGO_INSURANCE',
                    'BANKING_FEES',
                    'CONTINGENCY'
                ].includes(comp.code);
                break;
            case 'DAP':
                // CIF + destination handling + last mile (excludes import duties)
                isSeller = comp.code !== 'IMPORT_DUTIES';
                break;
            case 'DDP':
                // Seller pays EVERYTHING (including import duties)
                isSeller = true;
                break;
            default:
                isSeller = true;
                break;
        }
        return {
            ...comp,
            isSellerResponsibility: isSeller
        };
    });
}
