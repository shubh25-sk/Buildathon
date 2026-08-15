import Decimal from 'decimal.js';
import { CURRENCIES } from '../constants/currencies.js';
/**
 * Decimal-safe addition
 */
export function addMoney(a, b) {
    return new Decimal(a).add(new Decimal(b)).toNumber();
}
/**
 * Decimal-safe multiplication
 */
export function multiplyMoney(amount, factor) {
    return new Decimal(amount).mul(new Decimal(factor)).toNumber();
}
/**
 * Round to specified decimal places
 */
export function roundMoney(amount, decimals = 2) {
    return new Decimal(amount).toDecimalPlaces(decimals, Decimal.ROUND_HALF_UP).toNumber();
}
/**
 * Convert value from source currency to target currency using INR as base
 */
export function convertCurrency(amount, from, to, ratesInr = Object.fromEntries(Object.entries(CURRENCIES).map(([k, v]) => [k, v.defaultRateInr]))) {
    if (from === to)
        return amount;
    const fromRateInr = ratesInr[from] || CURRENCIES[from]?.defaultRateInr || 1;
    const toRateInr = ratesInr[to] || CURRENCIES[to]?.defaultRateInr || 1;
    // Convert to INR first
    const amountInInr = new Decimal(amount).mul(new Decimal(fromRateInr));
    // Convert INR to target currency
    const targetAmount = amountInInr.div(new Decimal(toRateInr));
    return targetAmount.toDecimalPlaces(2, Decimal.ROUND_HALF_UP).toNumber();
}
/**
 * Format currency with symbol
 */
export function formatCurrency(amount, currency = 'INR', locale = 'en-IN') {
    const symbol = CURRENCIES[currency]?.symbol || currency;
    const rounded = roundMoney(amount, 2);
    try {
        const formattedNumber = new Intl.NumberFormat(locale, {
            minimumFractionDigits: 2,
            maximumFractionDigits: 2
        }).format(rounded);
        return `${symbol} ${formattedNumber}`;
    }
    catch {
        return `${symbol} ${rounded.toFixed(2)}`;
    }
}
