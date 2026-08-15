export const ORIGINS = [
    {
        id: 'origin-ludhiana',
        name: 'Ludhiana Industrial Hub',
        state: 'Punjab',
        country: 'India',
        lat: 30.9,
        lng: 75.85,
        type: 'ORIGIN',
        code: 'INLUH',
        nearestPortId: 'port-nhava-sheva',
        nearestAirportId: 'airport-delhi'
    },
    {
        id: 'origin-delhi',
        name: 'Delhi NCR (ICD Tughlakabad)',
        state: 'Delhi',
        country: 'India',
        lat: 28.51,
        lng: 77.26,
        type: 'ORIGIN',
        code: 'INTKD',
        nearestPortId: 'port-nhava-sheva',
        nearestAirportId: 'airport-delhi'
    },
    {
        id: 'origin-jaipur',
        name: 'Jaipur Handicraft Zone',
        state: 'Rajasthan',
        country: 'India',
        lat: 26.91,
        lng: 75.78,
        type: 'ORIGIN',
        code: 'INJAI',
        nearestPortId: 'port-mundra',
        nearestAirportId: 'airport-delhi'
    },
    {
        id: 'origin-tirupur',
        name: 'Tirupur Textile Hub',
        state: 'Tamil Nadu',
        country: 'India',
        lat: 11.1,
        lng: 77.34,
        type: 'ORIGIN',
        code: 'INTUP',
        nearestPortId: 'port-chennai',
        nearestAirportId: 'airport-chennai'
    },
    {
        id: 'origin-surat',
        name: 'Surat Diamond & Textile City',
        state: 'Gujarat',
        country: 'India',
        lat: 21.17,
        lng: 72.83,
        type: 'ORIGIN',
        code: 'INSUR',
        nearestPortId: 'port-nhava-sheva',
        nearestAirportId: 'airport-mumbai'
    },
    {
        id: 'origin-indore',
        name: 'Indore Pharma & Agri Zone',
        state: 'Madhya Pradesh',
        country: 'India',
        lat: 22.71,
        lng: 75.85,
        type: 'ORIGIN',
        code: 'ININD',
        nearestPortId: 'port-nhava-sheva',
        nearestAirportId: 'airport-mumbai'
    },
    {
        id: 'origin-moradabad',
        name: 'Moradabad Brass City',
        state: 'Uttar Pradesh',
        country: 'India',
        lat: 28.83,
        lng: 78.78,
        type: 'ORIGIN',
        code: 'INMBD',
        nearestPortId: 'port-nhava-sheva',
        nearestAirportId: 'airport-delhi'
    },
    {
        id: 'origin-bengaluru',
        name: 'Bengaluru Tech & Engineering Hub',
        state: 'Karnataka',
        country: 'India',
        lat: 12.97,
        lng: 77.59,
        type: 'ORIGIN',
        code: 'INBLR',
        nearestPortId: 'port-chennai',
        nearestAirportId: 'airport-bengaluru'
    }
];
export const DESTINATIONS = [
    {
        id: 'dest-hamburg',
        name: 'Hamburg Port City',
        country: 'Germany',
        lat: 53.55,
        lng: 9.99,
        type: 'DESTINATION',
        code: 'DEHAM'
    },
    {
        id: 'dest-rotterdam',
        name: 'Rotterdam Logistics Port',
        country: 'Netherlands',
        lat: 51.92,
        lng: 4.47,
        type: 'DESTINATION',
        code: 'NLRTM'
    },
    {
        id: 'dest-dubai',
        name: 'Dubai Jebel Ali Free Zone',
        country: 'UAE',
        lat: 24.98,
        lng: 55.06,
        type: 'DESTINATION',
        code: 'AEJEA'
    },
    {
        id: 'dest-singapore',
        name: 'Singapore PSA Container Port',
        country: 'Singapore',
        lat: 1.29,
        lng: 103.85,
        type: 'DESTINATION',
        code: 'SGSIN'
    },
    {
        id: 'dest-newyork',
        name: 'New York / New Jersey Port Terminal',
        country: 'USA',
        lat: 40.71,
        lng: -74.0,
        type: 'DESTINATION',
        code: 'USNYC'
    },
    {
        id: 'dest-felixstowe',
        name: 'Felixstowe Port Hub',
        country: 'United Kingdom',
        lat: 51.96,
        lng: 1.35,
        type: 'DESTINATION',
        code: 'GBFXT'
    },
    {
        id: 'dest-yokohama',
        name: 'Yokohama Bay Port',
        country: 'Japan',
        lat: 35.44,
        lng: 139.63,
        type: 'DESTINATION',
        code: 'JPYOK'
    },
    {
        id: 'dest-sydney',
        name: 'Sydney Port Botany',
        country: 'Australia',
        lat: -33.86,
        lng: 151.2,
        type: 'DESTINATION',
        code: 'AUSYD'
    },
    {
        id: 'dest-antwerp',
        name: 'Antwerp Gateway Port',
        country: 'Belgium',
        lat: 51.22,
        lng: 4.4,
        type: 'DESTINATION',
        code: 'BEANR'
    },
    {
        id: 'dest-losangeles',
        name: 'Los Angeles Long Beach Port',
        country: 'USA',
        lat: 33.74,
        lng: -118.26,
        type: 'DESTINATION',
        code: 'USLAX'
    }
];
export const PORTS = [
    {
        id: 'port-nhava-sheva',
        name: 'Jawaharlal Nehru Port Trust (Nhava Sheva)',
        state: 'Maharashtra',
        country: 'India',
        lat: 18.95,
        lng: 72.95,
        type: 'PORT',
        portType: 'SEA',
        unlocode: 'INNSA',
        handlingFeeUsd: 110
    },
    {
        id: 'port-mundra',
        name: 'Adani Ports Mundra',
        state: 'Gujarat',
        country: 'India',
        lat: 22.74,
        lng: 69.7,
        type: 'PORT',
        portType: 'SEA',
        unlocode: 'INMUN',
        handlingFeeUsd: 95
    },
    {
        id: 'port-chennai',
        name: 'Chennai Ocean Terminal',
        state: 'Tamil Nadu',
        country: 'India',
        lat: 13.08,
        lng: 80.29,
        type: 'PORT',
        portType: 'SEA',
        unlocode: 'INMAA',
        handlingFeeUsd: 105
    },
    {
        id: 'port-vizag',
        name: 'Visakhapatnam Port',
        state: 'Andhra Pradesh',
        country: 'India',
        lat: 17.68,
        lng: 83.21,
        type: 'PORT',
        portType: 'SEA',
        unlocode: 'INVTZ',
        handlingFeeUsd: 90
    }
];
export const AIRPORTS = [
    {
        id: 'airport-delhi',
        name: 'Indira Gandhi International Airport Cargo Complex',
        state: 'Delhi',
        country: 'India',
        lat: 28.55,
        lng: 77.1,
        type: 'AIRPORT',
        code: 'DEL'
    },
    {
        id: 'airport-mumbai',
        name: 'Chhatrapati Shivaji Maharaj Air Cargo Terminal',
        state: 'Maharashtra',
        country: 'India',
        lat: 19.08,
        lng: 72.87,
        type: 'AIRPORT',
        code: 'BOM'
    },
    {
        id: 'airport-bengaluru',
        name: 'Kempegowda International Air Cargo Hub',
        state: 'Karnataka',
        country: 'India',
        lat: 13.19,
        lng: 77.7,
        type: 'AIRPORT',
        code: 'BLR'
    },
    {
        id: 'airport-chennai',
        name: 'Chennai Air Cargo Complex',
        state: 'Tamil Nadu',
        country: 'India',
        lat: 12.99,
        lng: 80.17,
        type: 'AIRPORT',
        code: 'MAA'
    }
];
