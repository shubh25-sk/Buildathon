import { Location, Route } from '@export-cost/shared';
export interface RouteGeneratorInput {
    origin: Location;
    destination: Location;
    originPort?: Location;
    destinationPort?: Location;
    weightKg: number;
    volumeCbm: number;
}
export declare function generateRouteAlternatives(input: RouteGeneratorInput): Route[];
