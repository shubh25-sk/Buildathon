export function calculateExportCostIndicator(ctx) {
    const { productValueInr, totalExportCostInr, logisticsCostInr, transitDays, reliabilityScore, riskScore, carbonKg, isMultimodal } = ctx;
    // 1. Cost Efficiency (40% Weight)
    // Logistics cost as % of product value. Standard benchmark is ~15-20% for MSME exports.
    const logisticsRatio = productValueInr > 0 ? (logisticsCostInr / productValueInr) : 0.25;
    // Ratio <= 10% -> 100 score; Ratio >= 45% -> 20 score
    let costEfficiency = Math.max(10, Math.min(100, Math.round(100 - (logisticsRatio - 0.10) * 220)));
    // 2. Transit Speed (20% Weight)
    // Faster speed relative to 30-day benchmark gets higher score
    let transitSpeed = Math.max(10, Math.min(100, Math.round(100 - (transitDays - 3) * 2.8)));
    // 3. Route Reliability (15% Weight)
    const routeReliability = Math.max(0, Math.min(100, Math.round(reliabilityScore)));
    // 4. Route Complexity (10% Weight)
    // Single leg vs multimodal transshipment
    const routeComplexity = isMultimodal ? 65 : 90;
    // 5. Risk Rating (10% Weight)
    // Invert risk score (lower risk = higher indicator score)
    const riskRating = Math.max(10, Math.min(100, Math.round(100 - riskScore)));
    // 6. Sustainability / Carbon Footprint (5% Weight)
    // Lower carbon per kg gets higher score
    const carbonRatio = carbonKg / Math.max(ctx.weightKg, 1);
    const sustainability = Math.max(10, Math.min(100, Math.round(100 - carbonRatio * 8)));
    // Weighted Score Formula:
    // score = (costEfficiency * 0.40) + (transitSpeed * 0.20) + (routeReliability * 0.15) + (routeComplexity * 0.10) + (riskRating * 0.10) + (sustainability * 0.05)
    const overallScore = Math.round(costEfficiency * 0.40 +
        transitSpeed * 0.20 +
        routeReliability * 0.15 +
        routeComplexity * 0.10 +
        riskRating * 0.10 +
        sustainability * 0.05);
    let level = 'MODERATE';
    if (overallScore >= 80)
        level = 'EXCELLENT';
    else if (overallScore >= 65)
        level = 'GOOD';
    else if (overallScore >= 50)
        level = 'MODERATE';
    else
        level = 'CHALLENGING';
    // Actionable MSME Recommendations
    const recommendations = [];
    if (logisticsRatio > 0.22) {
        recommendations.push('Logistics costs represent >22% of product value. Consider consolidating shipments or switching from Air to Ocean FCL/LCL.');
    }
    else {
        recommendations.push('Logistics cost ratio is competitive within industry standard benchmark bounds.');
    }
    if (transitDays > 25) {
        recommendations.push('Transit duration exceeds 25 days. Buffer working capital cycle for delayed buyer payment arrival.');
    }
    if (riskScore > 35) {
        recommendations.push('Route passes through high-congestion transshipment hubs. Strongly consider securing All-Risk Marine Cargo Insurance.');
    }
    if (isMultimodal) {
        recommendations.push('Multimodal legs require pre-cleared ICD documentation at Indian origin to prevent demurrage detention fees.');
    }
    recommendations.push('Verify ICEGATE RoDTEP / Duty Drawback eligibility with your Customs House Agent (CHA) to recover export taxes.');
    // Benchmark comparison string
    const benchmarkComparison = logisticsRatio <= 0.18
        ? 'Outperforms Indian MSME sector average logistics expenditure by 14%.'
        : 'Aligns with average Indian MSME export route logistics parameters.';
    return {
        overallScore,
        level,
        subScores: {
            costEfficiency,
            transitSpeed,
            routeReliability,
            routeComplexity,
            riskRating,
            sustainability
        },
        recommendations,
        benchmarkComparison
    };
}
