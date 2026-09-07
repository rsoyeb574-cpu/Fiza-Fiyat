import {
  SectionLossCalculationInput,
  SectionLossCalculationResult,
  SheetWeightCalculationInput,
  SheetWeightCalculationResult,
  SteelSeverityLevel
} from '../types/steelDiagnosis';

// Standard Wire Gauge (SWG) & Sheet Metal Gauge conversion table
export interface GaugeEntry {
  gauge: number;
  thicknessMm: number;
  approxWeightMildSteelKgM2: number; // For 1 m² sheet
}

export const STANDARD_GAUGE_TABLE: GaugeEntry[] = [
  { gauge: 8, thicknessMm: 4.06, approxWeightMildSteelKgM2: 31.87 },
  { gauge: 10, thicknessMm: 3.25, approxWeightMildSteelKgM2: 25.51 },
  { gauge: 11, thicknessMm: 2.95, approxWeightMildSteelKgM2: 23.16 },
  { gauge: 12, thicknessMm: 2.64, approxWeightMildSteelKgM2: 20.72 },
  { gauge: 14, thicknessMm: 2.03, approxWeightMildSteelKgM2: 15.94 },
  { gauge: 16, thicknessMm: 1.63, approxWeightMildSteelKgM2: 12.80 },
  { gauge: 18, thicknessMm: 1.22, approxWeightMildSteelKgM2: 9.58 },
  { gauge: 20, thicknessMm: 0.91, approxWeightMildSteelKgM2: 7.14 },
  { gauge: 22, thicknessMm: 0.71, approxWeightMildSteelKgM2: 5.57 },
  { gauge: 24, thicknessMm: 0.56, approxWeightMildSteelKgM2: 4.40 },
  { gauge: 26, thicknessMm: 0.46, approxWeightMildSteelKgM2: 3.61 },
  { gauge: 28, thicknessMm: 0.38, approxWeightMildSteelKgM2: 2.98 }
];

export const MATERIAL_DENSITIES: Record<string, { name: string; densityKgM3: number }> = {
  mild_steel: { name: 'Mild Steel / Carbon Steel (IS 2062)', densityKgM3: 7850 },
  stainless_steel: { name: 'Stainless Steel (SS 304 / SS 316)', densityKgM3: 8000 },
  aluminium: { name: 'Aluminium Sheet (AA 3003 / 5052)', densityKgM3: 2700 },
  galvanized_iron: { name: 'Galvanized Iron (GI / GP with Zinc)', densityKgM3: 7850 }
};

/**
 * Calculates Section Loss % from user-provided physical measurements (caliper or ultrasonic gauge).
 * Explicitly labeled as 'calculated from user-provided measurements'.
 */
export function calculateSectionLoss(input: SectionLossCalculationInput): SectionLossCalculationResult {
  const nominal = Math.max(0.1, Number(input.nominalThicknessMm));
  const measured = Math.max(0, Math.min(nominal * 2, Number(input.measuredThicknessMm)));
  
  const lossMm = Math.max(0, nominal - measured);
  const sectionLossPercentage = Number(((lossMm / nominal) * 100).toFixed(2));
  const remainingRatio = Number((measured / nominal).toFixed(3));

  let severity: SteelSeverityLevel = 'LOW';
  let engineeringEvaluation = '';
  let structuralWarning = '';

  if (sectionLossPercentage <= 5) {
    severity = 'LOW';
    engineeringEvaluation = `Minor surface depletion (${sectionLossPercentage}% loss). Member maintains ~${Math.round(remainingRatio * 100)}% of original section modulus. Normal structural reserve safety factors accommodate this within IS 800:2007 tolerances.`;
    structuralWarning = 'Surface cleaning and re-coating with anti-corrosive primer recommended to arrest progression.';
  } else if (sectionLossPercentage <= 15) {
    severity = 'MEDIUM';
    engineeringEvaluation = `Moderate section reduction (${sectionLossPercentage}% loss, ${lossMm.toFixed(2)} mm lost). Bending and axial capacity reduced proportionally. Safety margin is reduced from design limits.`;
    structuralWarning = 'Recommended monitoring. Perform localized ultrasonic mapping across member grid. Recoat with high-build epoxy barrier.';
  } else if (sectionLossPercentage <= 30) {
    severity = 'HIGH';
    engineeringEvaluation = `Substantial section loss (${sectionLossPercentage}% loss, ${lossMm.toFixed(2)} mm lost). Compression flange local buckling resistance (b/t ratio) or shear web capacity may be critically degraded per IS 800:2007 Clause 8.`;
    structuralWarning = 'ATTENTION: Member capacity significantly impaired. Formal review by a licensed structural engineer is required to determine if load reduction or sister plate reinforcement is necessary.';
  } else {
    severity = 'CRITICAL';
    engineeringEvaluation = `Severe critical section loss (${sectionLossPercentage}% loss). Member has lost more than 30% of structural wall thickness. Risk of sudden local buckling, web crippling, or tensile yielding under design loads.`;
    structuralWarning = 'DANGER: Stop heavy loading on this member immediately. Erect temporary propping/shoring and consult a licensed structural engineer for urgent section replacement or structural reinforcement.';
  }

  return {
    nominalThicknessMm: nominal,
    measuredThicknessMm: measured,
    lossMm: Number(lossMm.toFixed(2)),
    sectionLossPercentage,
    remainingThicknessRatio: remainingRatio,
    severity,
    engineeringEvaluation,
    structuralWarning,
    sourceType: 'calculated from user-provided measurements'
  };
}

/**
 * Calculates Sheet Metal & Plate Weight from user-provided physical dimensions.
 * Explicitly labeled as 'calculated from user-provided measurements'.
 */
export function calculateSheetWeight(input: SheetWeightCalculationInput): SheetWeightCalculationResult {
  const matInfo = MATERIAL_DENSITIES[input.material] || MATERIAL_DENSITIES.mild_steel;
  const density = matInfo.densityKgM3;

  const lengthM = Math.max(0, input.lengthMm) / 1000;
  const widthM = Math.max(0, input.widthMm) / 1000;
  const thicknessM = Math.max(0, input.thicknessMm) / 1000;
  const qty = Math.max(1, Math.round(input.quantity || 1));

  const areaSqM = lengthM * widthM;
  const singleVolumeM3 = areaSqM * thicknessM;
  const singleWeightKg = singleVolumeM3 * density;
  const totalWeightKg = singleWeightKg * qty;

  return {
    materialName: matInfo.name,
    densityKgM3: density,
    singleVolumeM3: Number(singleVolumeM3.toFixed(6)),
    singleWeightKg: Number(singleWeightKg.toFixed(2)),
    totalWeightKg: Number(totalWeightKg.toFixed(2)),
    areaSqM: Number(areaSqM.toFixed(3)),
    sourceType: 'calculated from user-provided measurements'
  };
}

/**
 * Helper to find nearest standard gauge for a given millimeter thickness.
 */
export function findNearestGauge(thicknessMm: number): GaugeEntry {
  let closest = STANDARD_GAUGE_TABLE[0];
  let minDiff = Math.abs(thicknessMm - closest.thicknessMm);

  for (const entry of STANDARD_GAUGE_TABLE) {
    const diff = Math.abs(thicknessMm - entry.thicknessMm);
    if (diff < minDiff) {
      minDiff = diff;
      closest = entry;
    }
  }

  return closest;
}
