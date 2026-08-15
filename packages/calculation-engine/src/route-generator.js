/**
 * Returns realistic ocean shipping waypoints based on origin/destination coordinates.
 * Approximates major maritime corridors:
 *  - India → Europe: Arabian Sea → Gulf of Aden → Red Sea → Suez Canal → Mediterranean
 *  - India → East Asia/SE Asia: Arabian Sea → Indian Ocean → Malacca Strait
 *  - India → USA East Coast: Arabian Sea → Suez → Mediterranean → Atlantic
 *  - India → Australia: Indian Ocean → South of Indonesia
 *  - India → Middle East: Arabian Sea direct
 */
function getOceanWaypoints(originLat, originLng, destLat, destLng) {
    // Arabian Sea departure point (common for west coast Indian ports)
    const arabianSeaExit = { lat: 15.0, lng: 68.0 };
    // Key corridor waypoints
    const gulfOfAden = { lat: 12.5, lng: 50.0 };
    const babElMandeb = { lat: 12.6, lng: 43.3 };
    const redSeaSouth = { lat: 14.0, lng: 42.5 };
    const redSeaMid = { lat: 20.0, lng: 38.5 };
    const redSeaNorth = { lat: 27.5, lng: 34.5 };
    const suezSouth = { lat: 29.95, lng: 32.57 };
    const suezNorth = { lat: 31.27, lng: 32.32 };
    const medEast = { lat: 33.0, lng: 30.0 };
    const medCentral = { lat: 35.5, lng: 18.0 };
    const medWest = { lat: 36.0, lng: 5.0 };
    const gibraltarStrait = { lat: 35.95, lng: -5.6 };
    // Malacca Strait / SE Asia waypoints
    const indianOceanMid = { lat: 6.0, lng: 78.0 };
    const malaccaWest = { lat: 4.0, lng: 95.0 };
    const malaccaEast = { lat: 1.3, lng: 104.0 };
    // South Indian Ocean (for Australia route)
    const southIndianOcean = { lat: -5.0, lng: 80.0 };
    const southOfIndonesia = { lat: -10.0, lng: 105.0 };
    const timor = { lat: -11.0, lng: 120.0 };
    const coralSea = { lat: -15.0, lng: 140.0 };
    // Determine route corridor based on destination coordinates
    // Middle East (UAE, Gulf states): destLng ~50-56, destLat ~22-28
    if (destLng >= 45 && destLng <= 60 && destLat >= 20 && destLat <= 30) {
        return [
            arabianSeaExit,
            { lat: 20.0, lng: 62.0 },
        ];
    }
    // Europe (destLng < 40, destLat > 35) — via Suez Canal
    if (destLng < 40 && destLat > 35) {
        const waypoints = [
            arabianSeaExit,
            gulfOfAden,
            babElMandeb,
            redSeaSouth,
            redSeaMid,
            redSeaNorth,
            suezSouth,
            suezNorth,
            medEast,
        ];
        // Northern Europe (UK, Netherlands, Germany, etc.)
        if (destLat > 48) {
            waypoints.push(medCentral, medWest, gibraltarStrait);
            waypoints.push({ lat: 43.0, lng: -9.5 }); // Bay of Biscay
            waypoints.push({ lat: 48.5, lng: -5.5 }); // English Channel approach
        }
        // Mediterranean destinations
        else {
            waypoints.push(medCentral);
        }
        return waypoints;
    }
    // USA East Coast (destLng < -50, destLat > 25) — via Suez + Atlantic
    if (destLng < -50 && destLat > 25) {
        return [
            arabianSeaExit,
            gulfOfAden,
            babElMandeb,
            redSeaSouth,
            redSeaMid,
            redSeaNorth,
            suezSouth,
            suezNorth,
            medEast,
            medCentral,
            medWest,
            gibraltarStrait,
            { lat: 34.0, lng: -15.0 }, // Eastern Atlantic
            { lat: 33.0, lng: -35.0 }, // Mid Atlantic
            { lat: 35.0, lng: -55.0 }, // Western Atlantic
            { lat: 38.0, lng: -68.0 }, // US East Coast approach
        ];
    }
    // Southeast Asia / Singapore (destLng 100-108, destLat -2 to 5)
    if (destLng >= 95 && destLng <= 110 && destLat >= -5 && destLat <= 10) {
        return [
            indianOceanMid,
            malaccaWest,
            malaccaEast,
        ];
    }
    // East Asia — Japan, China, Korea (destLng > 110, destLat > 20)
    if (destLng > 110 && destLat > 20) {
        return [
            indianOceanMid,
            malaccaWest,
            malaccaEast,
            { lat: 5.0, lng: 110.0 }, // South China Sea
            { lat: 15.0, lng: 115.0 }, // Mid South China Sea
            { lat: 22.0, lng: 120.0 }, // Taiwan Strait area
        ];
    }
    // Australia (destLat < -15, destLng > 110)
    if (destLat < -15 && destLng > 110) {
        return [
            southIndianOcean,
            southOfIndonesia,
            timor,
            coralSea,
            { lat: -25.0, lng: 148.0 },
        ];
    }
    // Default: simple mid-ocean point for any unmatched corridor
    const midLat = (originLat + destLat) / 2;
    const midLng = (originLng + destLng) / 2;
    return [
        arabianSeaExit,
        { lat: midLat, lng: midLng },
    ];
}
export function generateRouteAlternatives(input) {
    const { origin, destination, originPort, destinationPort, weightKg } = input;
    const defaultOriginPort = originPort || {
        id: 'port-nhava-sheva',
        name: 'Jawaharlal Nehru Port (Nhava Sheva)',
        state: 'Maharashtra',
        country: 'India',
        lat: 18.95,
        lng: 72.95,
        type: 'PORT',
        code: 'INNSA'
    };
    const defaultDestPort = destinationPort || {
        id: 'port-dest-main',
        name: `${destination.name} Commercial Port`,
        country: destination.country,
        lat: destination.lat - 0.2,
        lng: destination.lng - 0.2,
        type: 'PORT'
    };
    // Route 1: Standard Sea Freight (Direct/Primary)
    const seaLeg1 = {
        id: 'leg-1-1',
        legOrder: 1,
        mode: 'ROAD',
        origin: origin,
        destination: defaultOriginPort,
        distanceKm: 280,
        transitTimeHours: 14,
        carrier: 'Indian Container Haulage Services',
        carbonEmissionsKg: Math.round(weightKg * 0.08),
        estimatedCostUsd: 120
    };
    const directOceanWaypoints = getOceanWaypoints(defaultOriginPort.lat, defaultOriginPort.lng, defaultDestPort.lat, defaultDestPort.lng);
    const seaLeg2 = {
        id: 'leg-1-2',
        legOrder: 2,
        mode: 'SEA',
        origin: defaultOriginPort,
        destination: defaultDestPort,
        distanceKm: 6500,
        transitTimeHours: 432, // 18 Days
        carrier: 'Maersk Line / MSC Shipping',
        carbonEmissionsKg: Math.round(weightKg * 0.18),
        estimatedCostUsd: 850,
        waypoints: directOceanWaypoints
    };
    const seaLeg3 = {
        id: 'leg-1-3',
        legOrder: 3,
        mode: 'ROAD',
        origin: defaultDestPort,
        destination: destination,
        distanceKm: 85,
        transitTimeHours: 6,
        carrier: 'Destination Logistics Express',
        carbonEmissionsKg: Math.round(weightKg * 0.04),
        estimatedCostUsd: 180
    };
    const route1 = {
        id: 'route-sea-direct',
        name: `Direct Ocean Freight via ${defaultOriginPort.name}`,
        transportMode: 'SEA',
        origin,
        destination,
        legs: [seaLeg1, seaLeg2, seaLeg3],
        totalDistanceKm: 280 + 6500 + 85,
        totalTransitDays: 19,
        totalCostUsd: 1150,
        reliabilityScore: 88,
        riskScore: 20,
        carbonKg: seaLeg1.carbonEmissionsKg + seaLeg2.carbonEmissionsKg + seaLeg3.carbonEmissionsKg,
        isDirect: true,
        badges: ['Most Cost-Effective', 'Recommended for MSMEs', 'Lowest Carbon Footprint']
    };
    // Route 2: Ocean Freight via Transshipment (Hub Colombo / Jebel Ali / Singapore)
    const transshipmentPort = {
        id: 'port-jebel-ali',
        name: 'Jebel Ali Port (Transshipment Hub)',
        country: 'UAE',
        lat: 24.98,
        lng: 55.06,
        type: 'PORT',
        code: 'AEJEA'
    };
    const transLeg1 = {
        id: 'leg-2-1',
        legOrder: 1,
        mode: 'ROAD',
        origin,
        destination: defaultOriginPort,
        distanceKm: 280,
        transitTimeHours: 14,
        carrier: 'Origin Feeder Trucking',
        carbonEmissionsKg: Math.round(weightKg * 0.08),
        estimatedCostUsd: 120
    };
    // Waypoints: Nhava Sheva → Jebel Ali (Arabian Sea route)
    const feederWaypoints = getOceanWaypoints(defaultOriginPort.lat, defaultOriginPort.lng, transshipmentPort.lat, transshipmentPort.lng);
    const transLeg2 = {
        id: 'leg-2-2',
        legOrder: 2,
        mode: 'SEA',
        origin: defaultOriginPort,
        destination: transshipmentPort,
        distanceKm: 1900,
        transitTimeHours: 120, // 5 Days
        carrier: 'DP World Feeder Service',
        carbonEmissionsKg: Math.round(weightKg * 0.09),
        estimatedCostUsd: 420,
        waypoints: feederWaypoints
    };
    // Waypoints: Jebel Ali → Destination port (varies by destination)
    const transshipOnwardWaypoints = getOceanWaypoints(transshipmentPort.lat, transshipmentPort.lng, defaultDestPort.lat, defaultDestPort.lng);
    const transLeg3 = {
        id: 'leg-2-3',
        legOrder: 3,
        mode: 'SEA',
        origin: transshipmentPort,
        destination: defaultDestPort,
        distanceKm: 5200,
        transitTimeHours: 360, // 15 Days
        carrier: 'CMA CGM Global Service',
        carbonEmissionsKg: Math.round(weightKg * 0.16),
        estimatedCostUsd: 650,
        waypoints: transshipOnwardWaypoints
    };
    const transLeg4 = {
        id: 'leg-2-4',
        legOrder: 4,
        mode: 'ROAD',
        origin: defaultDestPort,
        destination: destination,
        distanceKm: 85,
        transitTimeHours: 6,
        carrier: 'Destination Logistics Express',
        carbonEmissionsKg: Math.round(weightKg * 0.04),
        estimatedCostUsd: 180
    };
    const route2 = {
        id: 'route-sea-transshipment',
        name: `Ocean Transshipment via Jebel Ali Hub`,
        transportMode: 'MULTIMODAL',
        origin,
        destination,
        legs: [transLeg1, transLeg2, transLeg3, transLeg4],
        totalDistanceKm: 280 + 1900 + 5200 + 85,
        totalTransitDays: 25,
        totalCostUsd: 1370,
        reliabilityScore: 78,
        riskScore: 35,
        carbonKg: transLeg1.carbonEmissionsKg + transLeg2.carbonEmissionsKg + transLeg3.carbonEmissionsKg + transLeg4.carbonEmissionsKg,
        isDirect: false,
        badges: ['Flexible Departure Schedules', 'High Capacity Route']
    };
    // Route 3: Air Cargo Express
    const originAirport = {
        id: 'airport-delhi',
        name: 'Indira Gandhi International Cargo Terminal',
        state: 'Delhi',
        country: 'India',
        lat: 28.55,
        lng: 77.10,
        type: 'AIRPORT',
        code: 'DEL'
    };
    const destAirport = {
        id: 'airport-dest-main',
        name: `${destination.name} Cargo Terminal`,
        country: destination.country,
        lat: destination.lat + 0.1,
        lng: destination.lng + 0.1,
        type: 'AIRPORT'
    };
    const airLeg1 = {
        id: 'leg-3-1',
        legOrder: 1,
        mode: 'ROAD',
        origin,
        destination: originAirport,
        distanceKm: 120,
        transitTimeHours: 4,
        carrier: 'Express Cargo Trucking',
        carbonEmissionsKg: Math.round(weightKg * 0.05),
        estimatedCostUsd: 90
    };
    const airLeg2 = {
        id: 'leg-3-2',
        legOrder: 2,
        mode: 'AIR',
        origin: originAirport,
        destination: destAirport,
        distanceKm: 6200,
        transitTimeHours: 12,
        carrier: 'Air India Cargo / Lufthansa Cargo',
        carbonEmissionsKg: Math.round(weightKg * 1.40), // Air is much higher carbon per kg
        estimatedCostUsd: 2850
    };
    const airLeg3 = {
        id: 'leg-3-3',
        legOrder: 3,
        mode: 'ROAD',
        origin: destAirport,
        destination,
        distanceKm: 45,
        transitTimeHours: 3,
        carrier: 'DHL / FedEx Air Hub Express',
        carbonEmissionsKg: Math.round(weightKg * 0.03),
        estimatedCostUsd: 140
    };
    const route3 = {
        id: 'route-air-express',
        name: `Direct Air Cargo via Delhi Airport (DEL)`,
        transportMode: 'AIR',
        origin,
        destination,
        legs: [airLeg1, airLeg2, airLeg3],
        totalDistanceKm: 120 + 6200 + 45,
        totalTransitDays: 3,
        totalCostUsd: 3080,
        reliabilityScore: 96,
        riskScore: 10,
        carbonKg: airLeg1.carbonEmissionsKg + airLeg2.carbonEmissionsKg + airLeg3.carbonEmissionsKg,
        isDirect: true,
        badges: ['Fastest Transit', 'Lowest Risk', 'Ideal for High-Value Goods']
    };
    return [route1, route2, route3];
}
