import { CurrencyCode } from '../types/export.js';
/**
 * Decimal-safe addition
 */
export declare function addMoney(a: number, b: number): number;
/**
 * Decimal-safe multiplication
 */
export declare function multiplyMoney(amount: number, factor: number): number;
/**
 * Round to specified decimal places
 */
export declare function roundMoney(amount: number, decimals?: number): number;
/**
 * Convert value from source currency to target currency using INR as base
 */
export declare function convertCurrency(amount: number, from: CurrencyCode, to: CurrencyCode, ratesInr?: Record<CurrencyCode, number>): number;
/**
 * Format currency with symbol
 */
export declare function formatCurrency(amount: number, currency?: CurrencyCode, locale?: string): string;
