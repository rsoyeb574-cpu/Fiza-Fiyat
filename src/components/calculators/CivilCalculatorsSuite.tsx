import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  Calculator,
  Package,
  Layers,
  Box,
  SlidersHorizontal,
  Droplet,
  Grid,
  Building2,
  DollarSign,
  Printer,
  RotateCcw,
  CheckCircle2,
  Info,
  ShieldAlert,
  ChevronRight,
  TrendingUp,
  Percent,
  Calendar,
  Sparkles
} from 'lucide-react';

export type CalculatorTab =
  | 'cost'
  | 'material'
  | 'brick'
  | 'concrete'
  | 'steel'
  | 'plaster-paint'
  | 'tile'
  | 'tank'
  | 'boundary'
  | 'carpet-area'
  | 'loan-emi';

interface CalculatorDef {
  id: CalculatorTab;
  title: string;
  shortDesc: string;
  icon: React.ElementType;
}

const CALCULATORS: CalculatorDef[] = [
  { id: 'cost', title: 'Construction Cost', shortDesc: 'Built-up area & tier breakdown', icon: Calculator },
  { id: 'material', title: 'Material Estimator', shortDesc: 'Cement, steel, sand & aggregate', icon: Package },
  { id: 'brick', title: 'Brick & Block', shortDesc: 'Red brick, AAC block & mortar', icon: Box },
  { id: 'concrete', title: 'Concrete Mix (RCC)', shortDesc: 'M15, M20, M25 cement & aggregate', icon: Layers },
  { id: 'steel', title: 'Structural Steel', shortDesc: 'Bar weight & tonnage (d²/162)', icon: SlidersHorizontal },
  { id: 'plaster-paint', title: 'Plaster & Paint', shortDesc: 'Wall plaster, putty, primer & paint', icon: Sparkles },
  { id: 'tile', title: 'Tiles & Flooring', shortDesc: 'Floor/wall tiles, adhesive & boxes', icon: Grid },
  { id: 'tank', title: 'Water Tank Capacity', shortDesc: 'Dimensions to Liters & Gallons', icon: Droplet },
  { id: 'boundary', title: 'Boundary Wall', shortDesc: 'Perimeter, pillars, bricks & mortar', icon: Building2 },
  { id: 'carpet-area', title: 'Carpet & Built-Up Area', shortDesc: 'RERA Carpet, Built-up, Super Built-up', icon: Grid },
  { id: 'loan-emi', title: 'Construction Loan / EMI', shortDesc: 'EMI, interest breakdown & schedule', icon: DollarSign }
];

export const CivilCalculatorsSuite: React.FC<{ initialTab?: CalculatorTab }> = ({ initialTab = 'cost' }) => {
  const [activeTab, setActiveTab] = useState<CalculatorTab>(initialTab);
  const [currency, setCurrency] = useState<'INR' | 'USD'>('INR');

  const currSymbol = currency === 'INR' ? '₹' : '$';
  const currRate = currency === 'INR' ? 1 : 0.012; // Approximation for USD display

  const formatCurrency = (amount: number) => {
    const val = amount * currRate;
    if (isNaN(val) || !isFinite(val)) return `${currSymbol}0`;
    if (currency === 'INR') {
      return `₹${Math.round(val).toLocaleString('en-IN')}`;
    }
    return `$${Math.round(val).toLocaleString('en-US')}`;
  };

  const handlePrint = (title: string) => {
    window.print();
  };

  // =========================================================================
  // 1. CONSTRUCTION COST CALCULATOR STATE
  // =========================================================================
  const [costArea, setCostArea] = useState<number>(1200);
  const [costAreaUnit, setCostAreaUnit] = useState<'sqft' | 'sqm' | 'sqyd'>('sqft');
  const [costQuality, setCostQuality] = useState<'basic' | 'standard' | 'premium' | 'luxury'>('standard');
  const [costFloors, setCostFloors] = useState<number>(1);

  const costAreaInSqFt = useMemo(() => {
    if (costAreaUnit === 'sqm') return costArea * 10.7639;
    if (costAreaUnit === 'sqyd') return costArea * 9;
    return costArea;
  }, [costArea, costAreaUnit]);

  const costRatesPerSqFt: Record<string, number> = {
    basic: 1400,
    standard: 1850,
    premium: 2400,
    luxury: 3200
  };

  const costEstimateResult = useMemo(() => {
    const safeArea = Math.max(0, costAreaInSqFt);
    const safeFloors = Math.max(1, costFloors);
    const totalBuiltUp = safeArea * safeFloors;
    const baseRate = costRatesPerSqFt[costQuality] || 1850;
    const totalCost = totalBuiltUp * baseRate;

    return {
      totalBuiltUp,
      ratePerSqFt: baseRate,
      totalCost,
      civilCost: totalCost * 0.55,
      finishingCost: totalCost * 0.20,
      mepCost: totalCost * 0.15,
      contingency: totalCost * 0.10
    };
  }, [costAreaInSqFt, costQuality, costFloors]);

  // =========================================================================
  // 2. MATERIAL ESTIMATOR STATE (Built-up thumb-rule standard)
  // =========================================================================
  const [matArea, setMatArea] = useState<number>(1000);
  const [matAreaUnit, setMatAreaUnit] = useState<'sqft' | 'sqm'>('sqft');

  const matAreaSqFt = useMemo(() => {
    return matAreaUnit === 'sqm' ? matArea * 10.7639 : matArea;
  }, [matArea, matAreaUnit]);

  const matEstimateResult = useMemo(() => {
    const area = Math.max(0, matAreaSqFt);
    // Standard Indian IS Code consumption thumb rules per sq.ft built-up area
    const cementBags = Math.round(area * 0.4); // 0.4 bags/sq.ft
    const steelKg = Math.round(area * 3.8); // 3.5 - 4.0 kg/sq.ft
    const steelTons = Number((steelKg / 1000).toFixed(2));
    const sandCft = Math.round(area * 1.8); // 1.8 cft/sq.ft
    const sandBrass = Number((sandCft / 100).toFixed(2));
    const aggregateCft = Math.round(area * 1.35); // 1.35 cft/sq.ft
    const aggregateBrass = Number((aggregateCft / 100).toFixed(2));
    const bricksCount = Math.round(area * 18); // 18-20 bricks/sq.ft
    const paintLiters = Math.round(area * 0.18); // 0.18 liters/sq.ft

    // Approximate Market Costs (INR)
    const cementCost = cementBags * 390;
    const steelCost = steelKg * 68;
    const sandCost = sandCft * 55;
    const aggregateCost = aggregateCft * 42;
    const bricksCost = bricksCount * 8.5;
    const totalEst = cementCost + steelCost + sandCost + aggregateCost + bricksCost;

    return {
      cementBags,
      steelKg,
      steelTons,
      sandCft,
      sandBrass,
      aggregateCft,
      aggregateBrass,
      bricksCount,
      paintLiters,
      totalEst
    };
  }, [matAreaSqFt]);

  // =========================================================================
  // 3. BRICK & BLOCK CALCULATOR STATE
  // =========================================================================
  const [brickWallLength, setBrickWallLength] = useState<number>(20); // ft
  const [brickWallHeight, setBrickWallHeight] = useState<number>(10); // ft
  const [brickWallThickness, setBrickWallThickness] = useState<4.5 | 9 | 8>(9); // inches (4.5", 9", or 8" AAC)
  const [brickType, setBrickType] = useState<'standard' | 'modular' | 'aac'>('standard');
  const [mortarRatio, setMortarRatio] = useState<'1:4' | '1:6'>('1:6');
  const [openingDeduction, setOpeningDeduction] = useState<number>(24); // sq.ft for doors/windows

  const brickEstimateResult = useMemo(() => {
    const l = Math.max(0, brickWallLength);
    const h = Math.max(0, brickWallHeight);
    const grossArea = l * h;
    const netArea = Math.max(0, grossArea - Math.max(0, openingDeduction));
    const wallVolCft = netArea * (brickWallThickness / 12);
    const wallVolCum = wallVolCft * 0.0283168;

    let bricksPerCft = 13.5;
    let cementPerCft = 0.05; // bags
    let sandPerCft = 0.25; // cft

    if (brickType === 'aac') {
      // AAC blocks 600x200x200mm = ~0.85 cft each
      bricksPerCft = 1.35;
      cementPerCft = 0.015; // thin-bed adhesive
      sandPerCft = 0;
    } else if (brickWallThickness === 4.5) {
      bricksPerCft = 14;
    }

    const baseCount = Math.round(wallVolCft * bricksPerCft);
    const withWastage = Math.round(baseCount * 1.05); // 5% wastage
    const cementBags = Math.max(1, Math.round(wallVolCft * cementPerCft * (mortarRatio === '1:4' ? 1.3 : 1.0)));
    const sandCft = Math.round(wallVolCft * sandPerCft);

    return {
      netArea,
      wallVolCft: Number(wallVolCft.toFixed(1)),
      wallVolCum: Number(wallVolCum.toFixed(2)),
      totalBricks: withWastage,
      cementBags,
      sandCft,
      sandBrass: Number((sandCft / 100).toFixed(2))
    };
  }, [brickWallLength, brickWallHeight, brickWallThickness, brickType, mortarRatio, openingDeduction]);

  // =========================================================================
  // 4. CONCRETE MIX CALCULATOR (RCC) STATE
  // =========================================================================
  const [concreteLength, setConcreteLength] = useState<number>(15); // ft
  const [concreteWidth, setConcreteWidth] = useState<number>(10); // ft
  const [concreteDepth, setConcreteDepth] = useState<number>(0.5); // ft (6 inches)
  const [concreteGrade, setConcreteGrade] = useState<'M15' | 'M20' | 'M25'>('M20');

  const concreteResult = useMemo(() => {
    const wetVolCft = Math.max(0, concreteLength) * Math.max(0, concreteWidth) * Math.max(0, concreteDepth);
    const wetVolCum = wetVolCft * 0.0283168;
    // Dry volume is 1.54 to 1.57 times wet volume to account for voids
    const dryVolCum = wetVolCum * 1.54;

    // Ratios:
    // M15 -> 1 : 2 : 4 (Total parts = 7)
    // M20 -> 1 : 1.5 : 3 (Total parts = 5.5)
    // M25 -> 1 : 1 : 2 (Total parts = 4)
    let cementPart = 1;
    let sandPart = 1.5;
    let aggPart = 3;
    let totalParts = 5.5;

    if (concreteGrade === 'M15') {
      sandPart = 2;
      aggPart = 4;
      totalParts = 7;
    } else if (concreteGrade === 'M25') {
      sandPart = 1;
      aggPart = 2;
      totalParts = 4;
    }

    const cementVolCum = (dryVolCum * cementPart) / totalParts;
    // Density of cement = 1440 kg/m³, 1 bag = 50kg -> 1 bag = 0.0347 m³ -> ~28.8 bags/m³
    const cementBags = Math.round(cementVolCum * 28.8);
    const sandVolCum = (dryVolCum * sandPart) / totalParts;
    const sandCft = Math.round(sandVolCum * 35.3147);
    const aggVolCum = (dryVolCum * aggPart) / totalParts;
    const aggCft = Math.round(aggVolCum * 35.3147);
    const waterLiters = Math.round(cementBags * 50 * (concreteGrade === 'M25' ? 0.45 : 0.50));

    return {
      wetVolCft: Number(wetVolCft.toFixed(2)),
      wetVolCum: Number(wetVolCum.toFixed(2)),
      cementBags,
      sandCft,
      sandBrass: Number((sandCft / 100).toFixed(2)),
      aggCft,
      aggBrass: Number((aggCft / 100).toFixed(2)),
      waterLiters
    };
  }, [concreteLength, concreteWidth, concreteDepth, concreteGrade]);

  // =========================================================================
  // 5. STEEL CALCULATOR STATE
  // =========================================================================
  const [steelDiameter, setSteelDiameter] = useState<number>(12); // mm
  const [steelLengthMeters, setSteelLengthMeters] = useState<number>(100); // meters
  const [steelRatePerKg, setSteelRatePerKg] = useState<number>(68); // INR

  const steelResult = useMemo(() => {
    const d = Math.max(0, steelDiameter);
    const l = Math.max(0, steelLengthMeters);
    // Formula: Weight (kg/m) = d² / 162.28
    const unitWeightKgPerM = (d * d) / 162.28;
    const totalWeightKg = unitWeightKgPerM * l;
    const totalTons = totalWeightKg / 1000;
    const totalQuintals = totalWeightKg / 100;
    const estimatedCost = totalWeightKg * Math.max(0, steelRatePerKg);

    return {
      unitWeightKgPerM: Number(unitWeightKgPerM.toFixed(3)),
      totalWeightKg: Math.round(totalWeightKg),
      totalTons: Number(totalTons.toFixed(3)),
      totalQuintals: Number(totalQuintals.toFixed(2)),
      estimatedCost: Math.round(estimatedCost)
    };
  }, [steelDiameter, steelLengthMeters, steelRatePerKg]);

  // =========================================================================
  // 6. PLASTER & PAINT CALCULATOR STATE
  // =========================================================================
  const [plasterAreaSqFt, setPlasterAreaSqFt] = useState<number>(1000);
  const [plasterThicknessMm, setPlasterThicknessMm] = useState<12 | 15 | 20>(12);
  const [paintCoats, setPaintCoats] = useState<1 | 2 | 3>(2);

  const plasterPaintResult = useMemo(() => {
    const area = Math.max(0, plasterAreaSqFt);
    const areaCum = area * 0.092903;
    const thicknessM = plasterThicknessMm / 1000;
    const wetVolCum = areaCum * thicknessM;
    const dryVolCum = wetVolCum * 1.33; // 33% increase for dry volume and joints

    // Ratio 1:4 for plaster
    const cementVol = dryVolCum / 5;
    const cementBags = Math.max(1, Math.round(cementVol * 28.8));
    const sandCft = Math.round((dryVolCum * 4 / 5) * 35.3147);

    // Paint coverage: Putty ~12-15 sq.ft/kg (2 coats), Primer ~120 sq.ft/L, Paint ~70-80 sq.ft/L (2 coats)
    const puttyKg = Math.round(area / 14);
    const primerLiters = Math.round(area / 110);
    const paintLiters = Math.round((area / 75) * (paintCoats / 2));

    return {
      cementBags,
      sandCft,
      puttyKg,
      primerLiters,
      paintLiters
    };
  }, [plasterAreaSqFt, plasterThicknessMm, paintCoats]);

  // =========================================================================
  // 7. TILE & FLOORING CALCULATOR STATE
  // =========================================================================
  const [roomLengthFt, setRoomLengthFt] = useState<number>(15);
  const [roomWidthFt, setRoomWidthFt] = useState<number>(12);
  const [tileLengthInches, setTileLengthInches] = useState<number>(24);
  const [tileWidthInches, setTileWidthInches] = useState<number>(24);
  const [skirtingHeightInches, setSkirtingHeightInches] = useState<number>(4);
  const [tileWastagePct, setTileWastagePct] = useState<number>(10);
  const [tilesPerBox, setTilesPerBox] = useState<number>(4);

  const tileResult = useMemo(() => {
    const l = Math.max(0, roomLengthFt);
    const w = Math.max(0, roomWidthFt);
    const floorArea = l * w;
    // Skirting perimeter = 2 * (l + w) - deductions (~3ft door)
    const perimeterFt = Math.max(0, 2 * (l + w) - 3);
    const skirtingArea = perimeterFt * (Math.max(0, skirtingHeightInches) / 12);
    const totalArea = floorArea + skirtingArea;

    const tileAreaSqFt = (Math.max(1, tileLengthInches) * Math.max(1, tileWidthInches)) / 144;
    const rawTilesNeeded = totalArea / tileAreaSqFt;
    const tilesWithWastage = Math.ceil(rawTilesNeeded * (1 + Math.max(0, tileWastagePct) / 100));
    const boxesNeeded = Math.ceil(tilesWithWastage / Math.max(1, tilesPerBox));
    const adhesiveBags = Math.ceil(totalArea / 40); // 1 bag 20kg covers ~40-50 sq.ft

    return {
      floorArea: Math.round(floorArea),
      totalAreaWithSkirting: Math.round(totalArea),
      tilesNeeded: tilesWithWastage,
      boxesNeeded,
      adhesiveBags
    };
  }, [roomLengthFt, roomWidthFt, tileLengthInches, tileWidthInches, skirtingHeightInches, tileWastagePct, tilesPerBox]);

  // =========================================================================
  // 8. TANK / WATER CAPACITY CALCULATOR STATE
  // =========================================================================
  const [tankShape, setTankShape] = useState<'rect' | 'cyl'>('rect');
  const [tankLength, setTankLength] = useState<number>(8); // ft
  const [tankWidth, setTankWidth] = useState<number>(6); // ft
  const [tankHeight, setTankHeight] = useState<number>(5); // ft
  const [tankDiameter, setTankDiameter] = useState<number>(6); // ft
  const [familyMembers, setFamilyMembers] = useState<number>(4);

  const tankResult = useMemo(() => {
    let volCft = 0;
    if (tankShape === 'rect') {
      volCft = Math.max(0, tankLength) * Math.max(0, tankWidth) * Math.max(0, tankHeight);
    } else {
      const r = Math.max(0, tankDiameter) / 2;
      volCft = Math.PI * r * r * Math.max(0, tankHeight);
    }

    // 1 Cubic Foot = 28.3168 Liters
    const capacityLiters = Math.round(volCft * 28.3168);
    // 1 US Gallon = 3.785 Liters
    const capacityGallons = Math.round(capacityLiters / 3.78541);
    // Standard domestic consumption = 135 L/person/day (IS 1172)
    const dailyDemand = Math.max(1, familyMembers) * 135;
    const daysSupply = Number((capacityLiters / dailyDemand).toFixed(1));

    return {
      volCft: Number(volCft.toFixed(1)),
      capacityLiters,
      capacityGallons,
      daysSupply
    };
  }, [tankShape, tankLength, tankWidth, tankHeight, tankDiameter, familyMembers]);

  // =========================================================================
  // 9. BOUNDARY WALL CALCULATOR STATE
  // =========================================================================
  const [wallPerimeterFt, setWallPerimeterFt] = useState<number>(200);
  const [wallHeightFt, setWallHeightFt] = useState<number>(6);
  const [pillarSpacingFt, setPillarSpacingFt] = useState<number>(10);
  const [wallThickInches, setWallThickInches] = useState<4.5 | 9>(4.5);

  const boundaryResult = useMemo(() => {
    const p = Math.max(0, wallPerimeterFt);
    const h = Math.max(0, wallHeightFt);
    const spacing = Math.max(5, pillarSpacingFt);
    const numPillars = Math.ceil(p / spacing) + 1;

    // Wall Masonry
    const wallArea = p * h;
    const bricksPerSqFt = wallThickInches === 4.5 ? 4.5 * 1.05 : 9 * 1.05;
    const totalBricks = Math.round(wallArea * bricksPerSqFt);
    const cementBags = Math.round(wallArea * (wallThickInches === 4.5 ? 0.05 : 0.09));
    const sandCft = Math.round(cementBags * 5);

    // Pillars Concrete (9" x 9" x H)
    const pillarVolCft = numPillars * (0.75 * 0.75 * (h + 2)); // 2ft in ground
    const pillarCementBags = Math.round(pillarVolCft * 0.22);
    const pillarSteelKg = Math.round(numPillars * (h + 2) * 4 * 0.888); // 4 bars 12mm

    return {
      totalBricks,
      cementBags: cementBags + pillarCementBags,
      sandCft,
      numPillars,
      pillarSteelKg,
      totalWallArea: wallArea
    };
  }, [wallPerimeterFt, wallHeightFt, pillarSpacingFt, wallThickInches]);

  // =========================================================================
  // 10. CARPET AREA / BUILT-UP / SUPER BUILT-UP CALCULATOR STATE
  // =========================================================================
  const [calcBaseMode, setCalcBaseMode] = useState<'carpet' | 'super'>('carpet');
  const [carpetInputArea, setCarpetInputArea] = useState<number>(900); // sq.ft
  const [wallThicknessPct, setWallThicknessPct] = useState<number>(12); // %
  const [balconyArea, setBalconyArea] = useState<number>(80); // sq.ft
  const [commonLoadingPct, setCommonLoadingPct] = useState<number>(25); // % for corridors/lift/stairs
  const [ratePerSqFtInput, setRatePerSqFtInput] = useState<number>(4500); // base price

  const areaResult = useMemo(() => {
    let carpet = 0;
    let builtUp = 0;
    let superBuiltUp = 0;

    if (calcBaseMode === 'carpet') {
      carpet = Math.max(0, carpetInputArea);
      builtUp = carpet * (1 + Math.max(0, wallThicknessPct) / 100) + Math.max(0, balconyArea);
      superBuiltUp = builtUp * (1 + Math.max(0, commonLoadingPct) / 100);
    } else {
      superBuiltUp = Math.max(0, carpetInputArea);
      builtUp = superBuiltUp / (1 + Math.max(0, commonLoadingPct) / 100);
      carpet = (builtUp - Math.max(0, balconyArea)) / (1 + Math.max(0, wallThicknessPct) / 100);
    }

    const totalValuation = superBuiltUp * Math.max(0, ratePerSqFtInput);
    const loadingDiff = superBuiltUp - carpet;

    return {
      carpetArea: Math.round(carpet),
      builtUpArea: Math.round(builtUp),
      superBuiltUpArea: Math.round(superBuiltUp),
      loadingSqFt: Math.round(loadingDiff),
      loadingPctEffective: carpet > 0 ? Number(((loadingDiff / carpet) * 100).toFixed(1)) : 0,
      totalValuation: Math.round(totalValuation)
    };
  }, [calcBaseMode, carpetInputArea, wallThicknessPct, balconyArea, commonLoadingPct, ratePerSqFtInput]);

  // =========================================================================
  // 11. CONSTRUCTION LOAN / EMI CALCULATOR STATE
  // =========================================================================
  const [loanPrincipal, setLoanPrincipal] = useState<number>(2500000); // ₹25 Lakhs
  const [loanAnnualRate, setLoanAnnualRate] = useState<number>(8.5); // %
  const [loanTenureYears, setLoanTenureYears] = useState<number>(15); // years

  const loanResult = useMemo(() => {
    const P = Math.max(0, loanPrincipal);
    const annualR = Math.max(0.1, loanAnnualRate);
    const r = annualR / (12 * 100); // Monthly rate
    const n = Math.max(1, loanTenureYears * 12); // Total months

    if (P === 0) {
      return { monthlyEmi: 0, totalInterest: 0, totalPayment: 0, interestPercentage: 0 };
    }

    // EMI formula: [P * r * (1 + r)^n] / [(1 + r)^n - 1]
    const factor = Math.pow(1 + r, n);
    const emi = (P * r * factor) / (factor - 1);
    const totalPayment = emi * n;
    const totalInterest = totalPayment - P;
    const interestPercentage = totalPayment > 0 ? Number(((totalInterest / totalPayment) * 100).toFixed(1)) : 0;

    return {
      monthlyEmi: Math.round(emi),
      totalInterest: Math.round(totalInterest),
      totalPayment: Math.round(totalPayment),
      interestPercentage
    };
  }, [loanPrincipal, loanAnnualRate, loanTenureYears]);

  return (
    <div className="w-full space-y-8" id="civil-calculators-suite">
      {/* Header & Currency Switcher */}
      <div className="glass-card rounded-3xl p-6 sm:p-8 border border-white/10 bg-slate-900/90 shadow-2xl relative overflow-hidden">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 border-b border-white/10">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold text-blue-400 bg-blue-500/10 border border-blue-500/20 mb-2">
              <Calculator className="w-3.5 h-3.5 text-blue-400" />
              Verified IS Code Civil Engineering Engine
            </div>
            <h2 className="text-2xl sm:text-3xl font-bold text-white tracking-tight">
              Interactive <span className="bg-gradient-to-r from-blue-400 via-cyan-300 to-indigo-400 bg-clip-text text-transparent">Civil Calculators</span>
            </h2>
            <p className="text-xs sm:text-sm text-slate-300 mt-1 max-w-2xl">
              Precision estimators for project budgets, RCC concrete, reinforcement steel, masonry blocks, finishes, water storage, and EMI amortization.
            </p>
          </div>

          <div className="flex items-center gap-3 self-start md:self-auto">
            {/* Currency selector */}
            <div className="flex items-center bg-slate-950 border border-white/15 rounded-xl p-1 text-xs">
              <button
                type="button"
                onClick={() => setCurrency('INR')}
                className={`px-3 py-1.5 rounded-lg font-medium transition-all ${
                  currency === 'INR' ? 'bg-blue-600 text-white shadow' : 'text-slate-400 hover:text-white'
                }`}
              >
                ₹ INR
              </button>
              <button
                type="button"
                onClick={() => setCurrency('USD')}
                className={`px-3 py-1.5 rounded-lg font-medium transition-all ${
                  currency === 'USD' ? 'bg-blue-600 text-white shadow' : 'text-slate-400 hover:text-white'
                }`}
              >
                $ USD
              </button>
            </div>

            <button
              type="button"
              onClick={() => handlePrint(activeTab)}
              className="px-3.5 py-2 rounded-xl text-xs font-medium text-slate-200 bg-white/5 hover:bg-white/10 border border-white/10 transition-all flex items-center gap-1.5"
            >
              <Printer className="w-4 h-4 text-blue-400" />
              Print / Export
            </button>
          </div>
        </div>

        {/* Tab Scroller */}
        <div className="pt-6 overflow-x-auto no-scrollbar">
          <div className="flex items-center gap-2.5 min-w-max pb-2">
            {CALCULATORS.map((calc) => {
              const Icon = calc.icon;
              const isActive = activeTab === calc.id;
              return (
                <button
                  key={calc.id}
                  onClick={() => setActiveTab(calc.id)}
                  className={`flex items-center gap-2.5 px-4 py-2.5 rounded-xl text-xs font-semibold transition-all border ${
                    isActive
                      ? 'bg-blue-600/20 text-blue-300 border-blue-500/50 shadow-lg shadow-blue-500/10'
                      : 'bg-slate-950/60 text-slate-400 border-white/5 hover:border-white/20 hover:text-slate-200'
                  }`}
                >
                  <Icon className={`w-4 h-4 ${isActive ? 'text-blue-400' : 'text-slate-500'}`} />
                  <span>{calc.title}</span>
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* Active Calculator Card */}
      <div className="glass-card rounded-3xl p-6 sm:p-8 border border-white/10 bg-slate-900/80 shadow-xl">
        {/* =================================================================== */}
        {/* TAB 1: CONSTRUCTION COST CALCULATOR */}
        {/* =================================================================== */}
        {activeTab === 'cost' && (
          <div className="space-y-6">
            <div className="flex flex-wrap items-center justify-between gap-4 pb-4 border-b border-white/10">
              <div>
                <h3 className="text-xl font-bold text-white flex items-center gap-2">
                  <Calculator className="w-5 h-5 text-blue-400" /> Construction Cost Estimator
                </h3>
                <p className="text-xs text-slate-400">Total turn-key budget based on regional quality tiers and floor multipliers.</p>
              </div>
              <button
                type="button"
                onClick={() => {
                  setCostArea(1200);
                  setCostAreaUnit('sqft');
                  setCostQuality('standard');
                  setCostFloors(1);
                }}
                className="text-xs text-slate-400 hover:text-white flex items-center gap-1.5 transition-colors"
              >
                <RotateCcw className="w-3.5 h-3.5" /> Reset
              </button>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              <div className="lg:col-span-1 space-y-4">
                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-1.5">
                    Plot / Built-up Area
                  </label>
                  <div className="flex gap-2">
                    <input
                      type="number"
                      min="1"
                      value={costArea}
                      onChange={(e) => setCostArea(Math.max(0, parseFloat(e.target.value) || 0))}
                      className="w-full bg-slate-950 border border-white/15 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-blue-500 font-mono"
                    />
                    <select
                      value={costAreaUnit}
                      onChange={(e) => setCostAreaUnit(e.target.value as any)}
                      className="bg-slate-950 border border-white/15 rounded-xl px-3 py-2.5 text-xs text-slate-300 focus:outline-none focus:border-blue-500"
                    >
                      <option value="sqft">Sq. Ft</option>
                      <option value="sqyd">Sq. Yards</option>
                      <option value="sqm">Sq. Meters</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-1.5">
                    Number of Floors
                  </label>
                  <input
                    type="number"
                    min="1"
                    max="10"
                    value={costFloors}
                    onChange={(e) => setCostFloors(Math.max(1, parseInt(e.target.value) || 1))}
                    className="w-full bg-slate-950 border border-white/15 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-blue-500 font-mono"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-1.5">
                    Construction Quality Tier
                  </label>
                  <div className="grid grid-cols-2 gap-2">
                    {[
                      { id: 'basic', label: 'Basic', rate: costRatesPerSqFt.basic },
                      { id: 'standard', label: 'Standard', rate: costRatesPerSqFt.standard },
                      { id: 'premium', label: 'Premium', rate: costRatesPerSqFt.premium },
                      { id: 'luxury', label: 'Luxury', rate: costRatesPerSqFt.luxury }
                    ].map((tier) => (
                      <button
                        key={tier.id}
                        type="button"
                        onClick={() => setCostQuality(tier.id as any)}
                        className={`p-3 rounded-xl border text-left transition-all ${
                          costQuality === tier.id
                            ? 'bg-blue-600/20 border-blue-500 text-white'
                            : 'bg-slate-950/60 border-white/10 text-slate-400 hover:text-white'
                        }`}
                      >
                        <div className="text-xs font-bold capitalize">{tier.label}</div>
                        <div className="text-[11px] font-mono text-cyan-400">{formatCurrency(tier.rate)}/sq.ft</div>
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              {/* Cost Results Display */}
              <div className="lg:col-span-2 space-y-4">
                <div className="p-6 rounded-2xl bg-slate-950 border border-white/10 space-y-4">
                  <div className="flex flex-wrap items-center justify-between gap-2 pb-3 border-b border-white/10">
                    <span className="text-xs uppercase tracking-wider font-semibold text-slate-400">Total Projected Turnkey Cost</span>
                    <span className="text-xs px-2.5 py-1 rounded-full bg-blue-500/10 text-blue-400 border border-blue-500/20 font-mono">
                      {Math.round(costEstimateResult.totalBuiltUp)} sq.ft total built-up
                    </span>
                  </div>

                  <div className="text-3xl sm:text-4xl font-extrabold text-emerald-400 font-mono">
                    {formatCurrency(costEstimateResult.totalCost)}
                  </div>

                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-2">
                    <div className="p-3 rounded-xl bg-white/5 border border-white/5">
                      <div className="text-[11px] text-slate-400">Civil & Structure (55%)</div>
                      <div className="text-sm font-bold text-white font-mono mt-1">{formatCurrency(costEstimateResult.civilCost)}</div>
                    </div>
                    <div className="p-3 rounded-xl bg-white/5 border border-white/5">
                      <div className="text-[11px] text-slate-400">Finishing & Tiles (20%)</div>
                      <div className="text-sm font-bold text-white font-mono mt-1">{formatCurrency(costEstimateResult.finishingCost)}</div>
                    </div>
                    <div className="p-3 rounded-xl bg-white/5 border border-white/5">
                      <div className="text-[11px] text-slate-400">MEP & Plumbing (15%)</div>
                      <div className="text-sm font-bold text-white font-mono mt-1">{formatCurrency(costEstimateResult.mepCost)}</div>
                    </div>
                    <div className="p-3 rounded-xl bg-white/5 border border-white/5">
                      <div className="text-[11px] text-slate-400">Contingency (10%)</div>
                      <div className="text-sm font-bold text-white font-mono mt-1">{formatCurrency(costEstimateResult.contingency)}</div>
                    </div>
                  </div>
                </div>

                <div className="p-4 rounded-xl bg-blue-500/5 border border-blue-500/20 text-xs text-slate-300 flex items-start gap-2.5">
                  <Info className="w-4 h-4 text-blue-400 shrink-0 mt-0.5" />
                  <div>
                    Estimates include structural excavation, RCC framing, brick masonry, plastering, premium electrical cabling, CPVC plumbing, and branded vitrified flooring.
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* =================================================================== */}
        {/* TAB 2: GENERAL MATERIAL ESTIMATOR */}
        {/* =================================================================== */}
        {activeTab === 'material' && (
          <div className="space-y-6">
            <div className="flex flex-wrap items-center justify-between gap-4 pb-4 border-b border-white/10">
              <div>
                <h3 className="text-xl font-bold text-white flex items-center gap-2">
                  <Package className="w-5 h-5 text-amber-400" /> Thumb-Rule Material Estimator
                </h3>
                <p className="text-xs text-slate-400">Calculates raw material quantities required for an entire house based on IS consumption factors.</p>
              </div>
              <button
                type="button"
                onClick={() => {
                  setMatArea(1000);
                  setMatAreaUnit('sqft');
                }}
                className="text-xs text-slate-400 hover:text-white flex items-center gap-1.5 transition-colors"
              >
                <RotateCcw className="w-3.5 h-3.5" /> Reset
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              <div className="md:col-span-1 space-y-4">
                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-1.5">
                    Total Built-up Area
                  </label>
                  <div className="flex gap-2">
                    <input
                      type="number"
                      min="1"
                      value={matArea}
                      onChange={(e) => setMatArea(Math.max(0, parseFloat(e.target.value) || 0))}
                      className="w-full bg-slate-950 border border-white/15 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-blue-500 font-mono"
                    />
                    <select
                      value={matAreaUnit}
                      onChange={(e) => setMatAreaUnit(e.target.value as any)}
                      className="bg-slate-950 border border-white/15 rounded-xl px-3 py-2.5 text-xs text-slate-300 focus:outline-none focus:border-blue-500"
                    >
                      <option value="sqft">Sq. Ft</option>
                      <option value="sqm">Sq. Meters</option>
                    </select>
                  </div>
                </div>

                <div className="p-4 rounded-xl bg-slate-950 border border-white/10 space-y-2 text-xs">
                  <div className="text-slate-400 font-semibold uppercase tracking-wider">Estimated Material Budget</div>
                  <div className="text-2xl font-bold text-emerald-400 font-mono">{formatCurrency(matEstimateResult.totalEst)}</div>
                  <div className="text-[11px] text-slate-400">Excludes labor, fixtures, and interior millwork.</div>
                </div>
              </div>

              <div className="md:col-span-3 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                <div className="p-5 rounded-2xl bg-slate-950 border border-white/10 space-y-2">
                  <div className="text-xs text-slate-400 flex items-center justify-between">
                    <span>Cement</span>
                    <span className="font-mono text-cyan-400">0.4 bags/sq.ft</span>
                  </div>
                  <div className="text-2xl font-bold text-white font-mono">{matEstimateResult.cementBags.toLocaleString()} <span className="text-xs font-normal text-slate-400">Bags (50kg)</span></div>
                  <p className="text-[11px] text-slate-400">PPC / OPC for foundation, RCC framing & masonry.</p>
                </div>

                <div className="p-5 rounded-2xl bg-slate-950 border border-white/10 space-y-2">
                  <div className="text-xs text-slate-400 flex items-center justify-between">
                    <span>Steel Rebar</span>
                    <span className="font-mono text-cyan-400">3.8 kg/sq.ft</span>
                  </div>
                  <div className="text-2xl font-bold text-white font-mono">{matEstimateResult.steelTons} <span className="text-xs font-normal text-slate-400">Tons ({matEstimateResult.steelKg.toLocaleString()} kg)</span></div>
                  <p className="text-[11px] text-slate-400">Fe500D high ductility reinforcement bars.</p>
                </div>

                <div className="p-5 rounded-2xl bg-slate-950 border border-white/10 space-y-2">
                  <div className="text-xs text-slate-400 flex items-center justify-between">
                    <span>Sand / River Fine</span>
                    <span className="font-mono text-cyan-400">1.8 cft/sq.ft</span>
                  </div>
                  <div className="text-2xl font-bold text-white font-mono">{matEstimateResult.sandBrass} <span className="text-xs font-normal text-slate-400">Brass ({matEstimateResult.sandCft.toLocaleString()} cft)</span></div>
                  <p className="text-[11px] text-slate-400">M-sand or screened river sand for mortar & concrete.</p>
                </div>

                <div className="p-5 rounded-2xl bg-slate-950 border border-white/10 space-y-2">
                  <div className="text-xs text-slate-400 flex items-center justify-between">
                    <span>Coarse Aggregate</span>
                    <span className="font-mono text-cyan-400">1.35 cft/sq.ft</span>
                  </div>
                  <div className="text-2xl font-bold text-white font-mono">{matEstimateResult.aggregateBrass} <span className="text-xs font-normal text-slate-400">Brass ({matEstimateResult.aggregateCft.toLocaleString()} cft)</span></div>
                  <p className="text-[11px] text-slate-400">10mm & 20mm blue granite metal for RCC.</p>
                </div>

                <div className="p-5 rounded-2xl bg-slate-950 border border-white/10 space-y-2">
                  <div className="text-xs text-slate-400 flex items-center justify-between">
                    <span>Red Bricks</span>
                    <span className="font-mono text-cyan-400">18 pcs/sq.ft</span>
                  </div>
                  <div className="text-2xl font-bold text-white font-mono">{matEstimateResult.bricksCount.toLocaleString()} <span className="text-xs font-normal text-slate-400">Pcs</span></div>
                  <p className="text-[11px] text-slate-400">First-class kiln fired bricks for load bearing/partition walls.</p>
                </div>

                <div className="p-5 rounded-2xl bg-slate-950 border border-white/10 space-y-2">
                  <div className="text-xs text-slate-400 flex items-center justify-between">
                    <span>Interior/Exterior Paint</span>
                    <span className="font-mono text-cyan-400">0.18 L/sq.ft</span>
                  </div>
                  <div className="text-2xl font-bold text-white font-mono">{matEstimateResult.paintLiters.toLocaleString()} <span className="text-xs font-normal text-slate-400">Liters</span></div>
                  <p className="text-[11px] text-slate-400">Primer + 2 finish coats across all wall faces.</p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* =================================================================== */}
        {/* TAB 3: BRICK & BLOCK CALCULATOR */}
        {/* =================================================================== */}
        {activeTab === 'brick' && (
          <div className="space-y-6">
            <div className="flex flex-wrap items-center justify-between gap-4 pb-4 border-b border-white/10">
              <div>
                <h3 className="text-xl font-bold text-white flex items-center gap-2">
                  <Box className="w-5 h-5 text-indigo-400" /> Brick & AAC Block Calculator
                </h3>
                <p className="text-xs text-slate-400">Computes exact masonry units, mortar cement bags, and sand volume with 5% breakage allowance.</p>
              </div>
              <button
                type="button"
                onClick={() => {
                  setBrickWallLength(20);
                  setBrickWallHeight(10);
                  setBrickWallThickness(9);
                  setBrickType('standard');
                  setOpeningDeduction(24);
                }}
                className="text-xs text-slate-400 hover:text-white flex items-center gap-1.5 transition-colors"
              >
                <RotateCcw className="w-3.5 h-3.5" /> Reset
              </button>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-semibold uppercase text-slate-400 mb-1">Wall Length (Ft)</label>
                    <input
                      type="number"
                      min="1"
                      value={brickWallLength}
                      onChange={(e) => setBrickWallLength(Math.max(0, parseFloat(e.target.value) || 0))}
                      className="w-full bg-slate-950 border border-white/15 rounded-xl px-3 py-2 text-sm text-white font-mono"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold uppercase text-slate-400 mb-1">Wall Height (Ft)</label>
                    <input
                      type="number"
                      min="1"
                      value={brickWallHeight}
                      onChange={(e) => setBrickWallHeight(Math.max(0, parseFloat(e.target.value) || 0))}
                      className="w-full bg-slate-950 border border-white/15 rounded-xl px-3 py-2 text-sm text-white font-mono"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold uppercase text-slate-400 mb-1">Door / Window Openings (Sq. Ft)</label>
                  <input
                    type="number"
                    min="0"
                    value={openingDeduction}
                    onChange={(e) => setOpeningDeduction(Math.max(0, parseFloat(e.target.value) || 0))}
                    className="w-full bg-slate-950 border border-white/15 rounded-xl px-3 py-2 text-sm text-white font-mono"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-semibold uppercase text-slate-400 mb-1">Thickness</label>
                    <select
                      value={brickWallThickness}
                      onChange={(e) => setBrickWallThickness(Number(e.target.value) as any)}
                      className="w-full bg-slate-950 border border-white/15 rounded-xl px-3 py-2 text-xs text-white"
                    >
                      <option value={4.5}>4.5 inch (Partition)</option>
                      <option value={9}>9 inch (Load-Bearing)</option>
                      <option value={8}>8 inch (AAC Block)</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs font-semibold uppercase text-slate-400 mb-1">Block Type</label>
                    <select
                      value={brickType}
                      onChange={(e) => setBrickType(e.target.value as any)}
                      className="w-full bg-slate-950 border border-white/15 rounded-xl px-3 py-2 text-xs text-white"
                    >
                      <option value="standard">Standard Red Brick</option>
                      <option value="aac">AAC Autoclaved Block</option>
                    </select>
                  </div>
                </div>
              </div>

              <div className="lg:col-span-2 grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="p-5 rounded-2xl bg-slate-950 border border-white/10 space-y-2">
                  <div className="text-xs text-slate-400 font-semibold uppercase">Total Units (+5% Waste)</div>
                  <div className="text-3xl font-extrabold text-indigo-400 font-mono">
                    {brickEstimateResult.totalBricks.toLocaleString()}
                  </div>
                  <p className="text-[11px] text-slate-400">
                    Net wall area: {brickEstimateResult.netArea} sq.ft ({brickEstimateResult.wallVolCft} cft).
                  </p>
                </div>

                <div className="p-5 rounded-2xl bg-slate-950 border border-white/10 space-y-2">
                  <div className="text-xs text-slate-400 font-semibold uppercase">Mortar Cement</div>
                  <div className="text-3xl font-extrabold text-cyan-400 font-mono">
                    {brickEstimateResult.cementBags} <span className="text-sm font-normal text-slate-400">Bags</span>
                  </div>
                  <p className="text-[11px] text-slate-400">Calculated using 1:6 cement mortar mix ratio.</p>
                </div>

                <div className="p-5 rounded-2xl bg-slate-950 border border-white/10 space-y-2">
                  <div className="text-xs text-slate-400 font-semibold uppercase">Mortar Sand</div>
                  <div className="text-3xl font-extrabold text-amber-400 font-mono">
                    {brickEstimateResult.sandCft} <span className="text-sm font-normal text-slate-400">cft</span>
                  </div>
                  <p className="text-[11px] text-slate-400">
                    Equivalent to {brickEstimateResult.sandBrass} brass of plaster sand.
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* =================================================================== */}
        {/* TAB 4: CONCRETE MIX CALCULATOR (RCC) */}
        {/* =================================================================== */}
        {activeTab === 'concrete' && (
          <div className="space-y-6">
            <div className="flex flex-wrap items-center justify-between gap-4 pb-4 border-b border-white/10">
              <div>
                <h3 className="text-xl font-bold text-white flex items-center gap-2">
                  <Layers className="w-5 h-5 text-cyan-400" /> Concrete Mix (RCC) Calculator
                </h3>
                <p className="text-xs text-slate-400">Converts structural member dimensions (slabs, beams, columns) into dry mix cement, sand, gravel & water.</p>
              </div>
              <button
                type="button"
                onClick={() => {
                  setConcreteLength(15);
                  setConcreteWidth(10);
                  setConcreteDepth(0.5);
                  setConcreteGrade('M20');
                }}
                className="text-xs text-slate-400 hover:text-white flex items-center gap-1.5 transition-colors"
              >
                <RotateCcw className="w-3.5 h-3.5" /> Reset
              </button>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              <div className="space-y-4">
                <div className="grid grid-cols-3 gap-2">
                  <div>
                    <label className="block text-[11px] font-semibold uppercase text-slate-400 mb-1">Length (Ft)</label>
                    <input
                      type="number"
                      min="0.1"
                      value={concreteLength}
                      onChange={(e) => setConcreteLength(Math.max(0, parseFloat(e.target.value) || 0))}
                      className="w-full bg-slate-950 border border-white/15 rounded-xl px-3 py-2 text-sm text-white font-mono"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] font-semibold uppercase text-slate-400 mb-1">Width (Ft)</label>
                    <input
                      type="number"
                      min="0.1"
                      value={concreteWidth}
                      onChange={(e) => setConcreteWidth(Math.max(0, parseFloat(e.target.value) || 0))}
                      className="w-full bg-slate-950 border border-white/15 rounded-xl px-3 py-2 text-sm text-white font-mono"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] font-semibold uppercase text-slate-400 mb-1">Depth (Ft)</label>
                    <input
                      type="number"
                      step="0.05"
                      min="0.1"
                      value={concreteDepth}
                      onChange={(e) => setConcreteDepth(Math.max(0, parseFloat(e.target.value) || 0))}
                      className="w-full bg-slate-950 border border-white/15 rounded-xl px-3 py-2 text-sm text-white font-mono"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold uppercase text-slate-400 mb-1">Concrete Design Grade</label>
                  <select
                    value={concreteGrade}
                    onChange={(e) => setConcreteGrade(e.target.value as any)}
                    className="w-full bg-slate-950 border border-white/15 rounded-xl px-3 py-2.5 text-xs text-white"
                  >
                    <option value="M15">M15 (1 : 2 : 4) - PCC & Foundation Bed</option>
                    <option value="M20">M20 (1 : 1.5 : 3) - Standard Slabs & Beams</option>
                    <option value="M25">M25 (1 : 1 : 2) - Heavy Load Columns & Foundations</option>
                  </select>
                </div>

                <div className="p-4 rounded-xl bg-slate-950 border border-white/10 text-xs text-slate-300 space-y-1 font-mono">
                  <div>Wet Vol: <span className="text-white font-bold">{concreteResult.wetVolCft} cft</span> ({concreteResult.wetVolCum} m³)</div>
                  <div>Dry Vol Multiplier: <span className="text-cyan-400">1.54x</span></div>
                </div>
              </div>

              <div className="lg:col-span-2 grid grid-cols-2 sm:grid-cols-4 gap-4">
                <div className="p-4 rounded-xl bg-slate-950 border border-white/10">
                  <div className="text-xs text-slate-400">Cement Required</div>
                  <div className="text-2xl font-bold text-white font-mono mt-1">{concreteResult.cementBags}</div>
                  <div className="text-[11px] text-slate-500">Bags (50 kg)</div>
                </div>
                <div className="p-4 rounded-xl bg-slate-950 border border-white/10">
                  <div className="text-xs text-slate-400">Sand Volume</div>
                  <div className="text-2xl font-bold text-amber-400 font-mono mt-1">{concreteResult.sandCft}</div>
                  <div className="text-[11px] text-slate-500">cft ({concreteResult.sandBrass} brass)</div>
                </div>
                <div className="p-4 rounded-xl bg-slate-950 border border-white/10">
                  <div className="text-xs text-slate-400">Coarse Aggregate</div>
                  <div className="text-2xl font-bold text-cyan-400 font-mono mt-1">{concreteResult.aggCft}</div>
                  <div className="text-[11px] text-slate-500">cft ({concreteResult.aggBrass} brass)</div>
                </div>
                <div className="p-4 rounded-xl bg-slate-950 border border-white/10">
                  <div className="text-xs text-slate-400">Water Ratio</div>
                  <div className="text-2xl font-bold text-blue-400 font-mono mt-1">{concreteResult.waterLiters}</div>
                  <div className="text-[11px] text-slate-500">Liters (w/c 0.45-0.50)</div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* =================================================================== */}
        {/* TAB 5: STRUCTURAL STEEL CALCULATOR */}
        {/* =================================================================== */}
        {activeTab === 'steel' && (
          <div className="space-y-6">
            <div className="flex flex-wrap items-center justify-between gap-4 pb-4 border-b border-white/10">
              <div>
                <h3 className="text-xl font-bold text-white flex items-center gap-2">
                  <SlidersHorizontal className="w-5 h-5 text-emerald-400" /> Structural Steel Rebar Calculator
                </h3>
                <p className="text-xs text-slate-400">Calculates rebar weight using standard civil formula: W = (d² / 162.28) kg/meter.</p>
              </div>
              <button
                type="button"
                onClick={() => {
                  setSteelDiameter(12);
                  setSteelLengthMeters(100);
                  setSteelRatePerKg(68);
                }}
                className="text-xs text-slate-400 hover:text-white flex items-center gap-1.5 transition-colors"
              >
                <RotateCcw className="w-3.5 h-3.5" /> Reset
              </button>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              <div className="space-y-4">
                <div>
                  <label className="block text-xs font-semibold uppercase text-slate-400 mb-1">Bar Diameter</label>
                  <select
                    value={steelDiameter}
                    onChange={(e) => setSteelDiameter(Number(e.target.value))}
                    className="w-full bg-slate-950 border border-white/15 rounded-xl px-3 py-2.5 text-xs text-white"
                  >
                    <option value={8}>8 mm (Stirrups / Ties)</option>
                    <option value={10}>10 mm (Slab Distribution Bars)</option>
                    <option value={12}>12 mm (Main Slab & Beam Reinforcement)</option>
                    <option value={16}>16 mm (Main Column & Heavy Beam Rebar)</option>
                    <option value={20}>20 mm (Heavy Columns & Footing)</option>
                    <option value={25}>25 mm (Bridge / Deep Raft Foundation)</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold uppercase text-slate-400 mb-1">Total Length (Meters)</label>
                  <input
                    type="number"
                    min="1"
                    value={steelLengthMeters}
                    onChange={(e) => setSteelLengthMeters(Math.max(0, parseFloat(e.target.value) || 0))}
                    className="w-full bg-slate-950 border border-white/15 rounded-xl px-4 py-2.5 text-sm text-white font-mono"
                  />
                  <span className="text-[11px] text-slate-500 font-mono mt-1 block">
                    ≈ {Math.round(steelLengthMeters * 3.28084)} feet total
                  </span>
                </div>

                <div>
                  <label className="block text-xs font-semibold uppercase text-slate-400 mb-1">Market Rate per Kg (INR)</label>
                  <input
                    type="number"
                    min="1"
                    value={steelRatePerKg}
                    onChange={(e) => setSteelRatePerKg(Math.max(0, parseFloat(e.target.value) || 0))}
                    className="w-full bg-slate-950 border border-white/15 rounded-xl px-4 py-2.5 text-sm text-white font-mono"
                  />
                </div>
              </div>

              <div className="lg:col-span-2 grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="p-5 rounded-2xl bg-slate-950 border border-white/10 space-y-1">
                  <div className="text-xs text-slate-400">Total Steel Weight</div>
                  <div className="text-3xl font-extrabold text-white font-mono">{steelResult.totalWeightKg.toLocaleString()} <span className="text-sm font-normal text-slate-400">kg</span></div>
                  <div className="text-xs text-emerald-400 font-mono pt-1">
                    {steelResult.totalTons} Metric Tons
                  </div>
                </div>

                <div className="p-5 rounded-2xl bg-slate-950 border border-white/10 space-y-1">
                  <div className="text-xs text-slate-400">Unit Weight</div>
                  <div className="text-3xl font-extrabold text-cyan-400 font-mono">{steelResult.unitWeightKgPerM} <span className="text-sm font-normal text-slate-400">kg/m</span></div>
                  <div className="text-xs text-slate-400 pt-1">
                    Formula: {steelDiameter}² / 162.28
                  </div>
                </div>

                <div className="p-5 rounded-2xl bg-slate-950 border border-white/10 space-y-1">
                  <div className="text-xs text-slate-400">Estimated Cost</div>
                  <div className="text-3xl font-extrabold text-emerald-400 font-mono">{formatCurrency(steelResult.estimatedCost)}</div>
                  <div className="text-xs text-slate-400 pt-1">
                    At {formatCurrency(steelRatePerKg)}/kg rate
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* =================================================================== */}
        {/* TAB 6: PLASTER & PAINT CALCULATOR */}
        {/* =================================================================== */}
        {activeTab === 'plaster-paint' && (
          <div className="space-y-6">
            <div className="flex flex-wrap items-center justify-between gap-4 pb-4 border-b border-white/10">
              <div>
                <h3 className="text-xl font-bold text-white flex items-center gap-2">
                  <Sparkles className="w-5 h-5 text-purple-400" /> Plaster, Putty & Paint Estimator
                </h3>
                <p className="text-xs text-slate-400">Calculates cement bags, sand, primer, acrylic wall putty, and emulsion paint for wall areas.</p>
              </div>
              <button
                type="button"
                onClick={() => {
                  setPlasterAreaSqFt(1000);
                  setPlasterThicknessMm(12);
                  setPaintCoats(2);
                }}
                className="text-xs text-slate-400 hover:text-white flex items-center gap-1.5 transition-colors"
              >
                <RotateCcw className="w-3.5 h-3.5" /> Reset
              </button>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              <div className="space-y-4">
                <div>
                  <label className="block text-xs font-semibold uppercase text-slate-400 mb-1">Total Wall Area (Sq. Ft)</label>
                  <input
                    type="number"
                    min="1"
                    value={plasterAreaSqFt}
                    onChange={(e) => setPlasterAreaSqFt(Math.max(0, parseFloat(e.target.value) || 0))}
                    className="w-full bg-slate-950 border border-white/15 rounded-xl px-4 py-2.5 text-sm text-white font-mono"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-semibold uppercase text-slate-400 mb-1">Thickness</label>
                    <select
                      value={plasterThicknessMm}
                      onChange={(e) => setPlasterThicknessMm(Number(e.target.value) as any)}
                      className="w-full bg-slate-950 border border-white/15 rounded-xl px-3 py-2 text-xs text-white"
                    >
                      <option value={12}>12 mm (Internal)</option>
                      <option value={15}>15 mm (Ceilings)</option>
                      <option value={20}>20 mm (External 2-Coat)</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs font-semibold uppercase text-slate-400 mb-1">Paint Coats</label>
                    <select
                      value={paintCoats}
                      onChange={(e) => setPaintCoats(Number(e.target.value) as any)}
                      className="w-full bg-slate-950 border border-white/15 rounded-xl px-3 py-2 text-xs text-white"
                    >
                      <option value={1}>1 Coat</option>
                      <option value={2}>2 Coats (Standard)</option>
                      <option value={3}>3 Coats (Luxury)</option>
                    </select>
                  </div>
                </div>
              </div>

              <div className="lg:col-span-2 grid grid-cols-2 sm:grid-cols-4 gap-4">
                <div className="p-4 rounded-xl bg-slate-950 border border-white/10">
                  <div className="text-xs text-slate-400">Cement (1:4)</div>
                  <div className="text-2xl font-bold text-white font-mono mt-1">{plasterPaintResult.cementBags}</div>
                  <div className="text-[11px] text-slate-500">Bags</div>
                </div>
                <div className="p-4 rounded-xl bg-slate-950 border border-white/10">
                  <div className="text-xs text-slate-400">Sand</div>
                  <div className="text-2xl font-bold text-amber-400 font-mono mt-1">{plasterPaintResult.sandCft}</div>
                  <div className="text-[11px] text-slate-500">cft</div>
                </div>
                <div className="p-4 rounded-xl bg-slate-950 border border-white/10">
                  <div className="text-xs text-slate-400">Wall Putty</div>
                  <div className="text-2xl font-bold text-purple-400 font-mono mt-1">{plasterPaintResult.puttyKg}</div>
                  <div className="text-[11px] text-slate-500">Kg (2 coats)</div>
                </div>
                <div className="p-4 rounded-xl bg-slate-950 border border-white/10">
                  <div className="text-xs text-slate-400">Emulsion Paint</div>
                  <div className="text-2xl font-bold text-cyan-400 font-mono mt-1">{plasterPaintResult.paintLiters}</div>
                  <div className="text-[11px] text-slate-500">Liters ({paintCoats} coats)</div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* =================================================================== */}
        {/* TAB 7: TILE & FLOORING CALCULATOR */}
        {/* =================================================================== */}
        {activeTab === 'tile' && (
          <div className="space-y-6">
            <div className="flex flex-wrap items-center justify-between gap-4 pb-4 border-b border-white/10">
              <div>
                <h3 className="text-xl font-bold text-white flex items-center gap-2">
                  <Grid className="w-5 h-5 text-blue-400" /> Tile & Flooring Calculator
                </h3>
                <p className="text-xs text-slate-400">Includes 4-inch skirting perimeter allowance and adhesive bag estimation.</p>
              </div>
              <button
                type="button"
                onClick={() => {
                  setRoomLengthFt(15);
                  setRoomWidthFt(12);
                  setTileLengthInches(24);
                  setTileWidthInches(24);
                  setTileWastagePct(10);
                  setTilesPerBox(4);
                }}
                className="text-xs text-slate-400 hover:text-white flex items-center gap-1.5 transition-colors"
              >
                <RotateCcw className="w-3.5 h-3.5" /> Reset
              </button>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-semibold uppercase text-slate-400 mb-1">Room Length (Ft)</label>
                    <input
                      type="number"
                      min="1"
                      value={roomLengthFt}
                      onChange={(e) => setRoomLengthFt(Math.max(0, parseFloat(e.target.value) || 0))}
                      className="w-full bg-slate-950 border border-white/15 rounded-xl px-3 py-2 text-sm text-white font-mono"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold uppercase text-slate-400 mb-1">Room Width (Ft)</label>
                    <input
                      type="number"
                      min="1"
                      value={roomWidthFt}
                      onChange={(e) => setRoomWidthFt(Math.max(0, parseFloat(e.target.value) || 0))}
                      className="w-full bg-slate-950 border border-white/15 rounded-xl px-3 py-2 text-sm text-white font-mono"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold uppercase text-slate-400 mb-1">Tile Dimensions</label>
                  <select
                    value={`${tileLengthInches}x${tileWidthInches}`}
                    onChange={(e) => {
                      const [l, w] = e.target.value.split('x').map(Number);
                      setTileLengthInches(l);
                      setTileWidthInches(w);
                    }}
                    className="w-full bg-slate-950 border border-white/15 rounded-xl px-3 py-2 text-xs text-white"
                  >
                    <option value="24x24">24″ × 24″ (600mm × 600mm) - Standard Vitrified</option>
                    <option value="48x24">48″ × 24″ (1200mm × 600mm) - Large Format GVT</option>
                    <option value="12x12">12″ × 12″ (300mm × 300mm) - Anti-Skid Bathroom</option>
                    <option value="32x32">32″ × 32″ (800mm × 800mm) - Premium Living Tile</option>
                  </select>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-semibold uppercase text-slate-400 mb-1">Wastage %</label>
                    <input
                      type="number"
                      min="0"
                      max="25"
                      value={tileWastagePct}
                      onChange={(e) => setTileWastagePct(Math.max(0, parseFloat(e.target.value) || 0))}
                      className="w-full bg-slate-950 border border-white/15 rounded-xl px-3 py-2 text-sm text-white font-mono"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold uppercase text-slate-400 mb-1">Tiles Per Box</label>
                    <input
                      type="number"
                      min="1"
                      value={tilesPerBox}
                      onChange={(e) => setTilesPerBox(Math.max(1, parseInt(e.target.value) || 1))}
                      className="w-full bg-slate-950 border border-white/15 rounded-xl px-3 py-2 text-sm text-white font-mono"
                    />
                  </div>
                </div>
              </div>

              <div className="lg:col-span-2 grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="p-5 rounded-2xl bg-slate-950 border border-white/10 space-y-1">
                  <div className="text-xs text-slate-400">Total Boxes Needed</div>
                  <div className="text-3xl font-extrabold text-blue-400 font-mono">{tileResult.boxesNeeded} <span className="text-sm font-normal text-slate-400">Boxes</span></div>
                  <div className="text-xs text-slate-400 pt-1">
                    ({tileResult.tilesNeeded} tiles total with {tileWastagePct}% waste)
                  </div>
                </div>

                <div className="p-5 rounded-2xl bg-slate-950 border border-white/10 space-y-1">
                  <div className="text-xs text-slate-400">Total Surface Area</div>
                  <div className="text-3xl font-extrabold text-white font-mono">{tileResult.totalAreaWithSkirting} <span className="text-sm font-normal text-slate-400">sq.ft</span></div>
                  <div className="text-xs text-slate-400 pt-1">
                    Floor: {tileResult.floorArea} sq.ft + Skirting
                  </div>
                </div>

                <div className="p-5 rounded-2xl bg-slate-950 border border-white/10 space-y-1">
                  <div className="text-xs text-slate-400">Tile Adhesive</div>
                  <div className="text-3xl font-extrabold text-emerald-400 font-mono">{tileResult.adhesiveBags} <span className="text-sm font-normal text-slate-400">Bags</span></div>
                  <div className="text-xs text-slate-400 pt-1">
                    20kg polymer adhesive bags
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* =================================================================== */}
        {/* TAB 8: WATER TANK CAPACITY CALCULATOR */}
        {/* =================================================================== */}
        {activeTab === 'tank' && (
          <div className="space-y-6">
            <div className="flex flex-wrap items-center justify-between gap-4 pb-4 border-b border-white/10">
              <div>
                <h3 className="text-xl font-bold text-white flex items-center gap-2">
                  <Droplet className="w-5 h-5 text-sky-400" /> Water Tank Capacity Calculator
                </h3>
                <p className="text-xs text-slate-400">Underground sump and overhead tank sizing based on Indian Standard domestic consumption.</p>
              </div>
              <button
                type="button"
                onClick={() => {
                  setTankShape('rect');
                  setTankLength(8);
                  setTankWidth(6);
                  setTankHeight(5);
                  setFamilyMembers(4);
                }}
                className="text-xs text-slate-400 hover:text-white flex items-center gap-1.5 transition-colors"
              >
                <RotateCcw className="w-3.5 h-3.5" /> Reset
              </button>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              <div className="space-y-4">
                <div>
                  <label className="block text-xs font-semibold uppercase text-slate-400 mb-1">Tank Geometry</label>
                  <div className="grid grid-cols-2 gap-2">
                    <button
                      type="button"
                      onClick={() => setTankShape('rect')}
                      className={`py-2 px-3 rounded-xl border text-xs font-semibold ${
                        tankShape === 'rect' ? 'bg-blue-600 text-white border-blue-500' : 'bg-slate-950 border-white/10 text-slate-400'
                      }`}
                    >
                      Rectangular Sump
                    </button>
                    <button
                      type="button"
                      onClick={() => setTankShape('cyl')}
                      className={`py-2 px-3 rounded-xl border text-xs font-semibold ${
                        tankShape === 'cyl' ? 'bg-blue-600 text-white border-blue-500' : 'bg-slate-950 border-white/10 text-slate-400'
                      }`}
                    >
                      Cylindrical Tank
                    </button>
                  </div>
                </div>

                {tankShape === 'rect' ? (
                  <div className="grid grid-cols-3 gap-2">
                    <div>
                      <label className="block text-[11px] font-semibold text-slate-400 mb-1">Length (Ft)</label>
                      <input
                        type="number"
                        min="1"
                        value={tankLength}
                        onChange={(e) => setTankLength(Math.max(0, parseFloat(e.target.value) || 0))}
                        className="w-full bg-slate-950 border border-white/15 rounded-xl px-2.5 py-2 text-sm text-white font-mono"
                      />
                    </div>
                    <div>
                      <label className="block text-[11px] font-semibold text-slate-400 mb-1">Width (Ft)</label>
                      <input
                        type="number"
                        min="1"
                        value={tankWidth}
                        onChange={(e) => setTankWidth(Math.max(0, parseFloat(e.target.value) || 0))}
                        className="w-full bg-slate-950 border border-white/15 rounded-xl px-2.5 py-2 text-sm text-white font-mono"
                      />
                    </div>
                    <div>
                      <label className="block text-[11px] font-semibold text-slate-400 mb-1">Height (Ft)</label>
                      <input
                        type="number"
                        min="1"
                        value={tankHeight}
                        onChange={(e) => setTankHeight(Math.max(0, parseFloat(e.target.value) || 0))}
                        className="w-full bg-slate-950 border border-white/15 rounded-xl px-2.5 py-2 text-sm text-white font-mono"
                      />
                    </div>
                  </div>
                ) : (
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs font-semibold text-slate-400 mb-1">Diameter (Ft)</label>
                      <input
                        type="number"
                        min="1"
                        value={tankDiameter}
                        onChange={(e) => setTankDiameter(Math.max(0, parseFloat(e.target.value) || 0))}
                        className="w-full bg-slate-950 border border-white/15 rounded-xl px-3 py-2 text-sm text-white font-mono"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-slate-400 mb-1">Height (Ft)</label>
                      <input
                        type="number"
                        min="1"
                        value={tankHeight}
                        onChange={(e) => setTankHeight(Math.max(0, parseFloat(e.target.value) || 0))}
                        className="w-full bg-slate-950 border border-white/15 rounded-xl px-3 py-2 text-sm text-white font-mono"
                      />
                    </div>
                  </div>
                )}

                <div>
                  <label className="block text-xs font-semibold uppercase text-slate-400 mb-1">Family Members</label>
                  <input
                    type="number"
                    min="1"
                    max="50"
                    value={familyMembers}
                    onChange={(e) => setFamilyMembers(Math.max(1, parseInt(e.target.value) || 1))}
                    className="w-full bg-slate-950 border border-white/15 rounded-xl px-4 py-2.5 text-sm text-white font-mono"
                  />
                  <span className="text-[11px] text-slate-500 mt-1 block">Based on 135 L / person / day (IS 1172 benchmark)</span>
                </div>
              </div>

              <div className="lg:col-span-2 grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="p-5 rounded-2xl bg-slate-950 border border-white/10 space-y-1">
                  <div className="text-xs text-slate-400">Total Water Capacity</div>
                  <div className="text-3xl font-extrabold text-sky-400 font-mono">{tankResult.capacityLiters.toLocaleString()} <span className="text-sm font-normal text-slate-400">Liters</span></div>
                  <div className="text-xs text-slate-400 pt-1">
                    {tankResult.capacityGallons.toLocaleString()} US Gallons
                  </div>
                </div>

                <div className="p-5 rounded-2xl bg-slate-950 border border-white/10 space-y-1">
                  <div className="text-xs text-slate-400">Tank Volume</div>
                  <div className="text-3xl font-extrabold text-white font-mono">{tankResult.volCft} <span className="text-sm font-normal text-slate-400">cft</span></div>
                  <div className="text-xs text-slate-400 pt-1">
                    {Number((tankResult.volCft * 0.0283168).toFixed(2))} m³
                  </div>
                </div>

                <div className="p-5 rounded-2xl bg-slate-950 border border-white/10 space-y-1">
                  <div className="text-xs text-slate-400">Estimated Household Supply</div>
                  <div className="text-3xl font-extrabold text-emerald-400 font-mono">{tankResult.daysSupply} <span className="text-sm font-normal text-slate-400">Days</span></div>
                  <div className="text-xs text-slate-400 pt-1">
                    For {familyMembers} persons ({familyMembers * 135} L/day)
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* =================================================================== */}
        {/* TAB 9: BOUNDARY WALL CALCULATOR */}
        {/* =================================================================== */}
        {activeTab === 'boundary' && (
          <div className="space-y-6">
            <div className="flex flex-wrap items-center justify-between gap-4 pb-4 border-b border-white/10">
              <div>
                <h3 className="text-xl font-bold text-white flex items-center gap-2">
                  <Building2 className="w-5 h-5 text-amber-400" /> Boundary Wall Estimator
                </h3>
                <p className="text-xs text-slate-400">Calculates perimeter bricks, mortar, concrete pillars, and vertical reinforcement.</p>
              </div>
              <button
                type="button"
                onClick={() => {
                  setWallPerimeterFt(200);
                  setWallHeightFt(6);
                  setPillarSpacingFt(10);
                  setWallThickInches(4.5);
                }}
                className="text-xs text-slate-400 hover:text-white flex items-center gap-1.5 transition-colors"
              >
                <RotateCcw className="w-3.5 h-3.5" /> Reset
              </button>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              <div className="space-y-4">
                <div>
                  <label className="block text-xs font-semibold uppercase text-slate-400 mb-1">Perimeter Length (Ft)</label>
                  <input
                    type="number"
                    min="1"
                    value={wallPerimeterFt}
                    onChange={(e) => setWallPerimeterFt(Math.max(0, parseFloat(e.target.value) || 0))}
                    className="w-full bg-slate-950 border border-white/15 rounded-xl px-4 py-2.5 text-sm text-white font-mono"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-semibold uppercase text-slate-400 mb-1">Height (Ft)</label>
                    <input
                      type="number"
                      min="1"
                      value={wallHeightFt}
                      onChange={(e) => setWallHeightFt(Math.max(0, parseFloat(e.target.value) || 0))}
                      className="w-full bg-slate-950 border border-white/15 rounded-xl px-3 py-2 text-sm text-white font-mono"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold uppercase text-slate-400 mb-1">Thickness</label>
                    <select
                      value={wallThickInches}
                      onChange={(e) => setWallThickInches(Number(e.target.value) as any)}
                      className="w-full bg-slate-950 border border-white/15 rounded-xl px-3 py-2 text-xs text-white"
                    >
                      <option value={4.5}>4.5 inch Single</option>
                      <option value={9}>9 inch Double</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold uppercase text-slate-400 mb-1">Pillar Interval (Ft)</label>
                  <input
                    type="number"
                    min="5"
                    max="20"
                    value={pillarSpacingFt}
                    onChange={(e) => setPillarSpacingFt(Math.max(5, parseFloat(e.target.value) || 5))}
                    className="w-full bg-slate-950 border border-white/15 rounded-xl px-4 py-2 text-sm text-white font-mono"
                  />
                  <span className="text-[11px] text-slate-500 mt-1 block">Requires {boundaryResult.numPillars} RCC pillars</span>
                </div>
              </div>

              <div className="lg:col-span-2 grid grid-cols-2 sm:grid-cols-4 gap-4">
                <div className="p-4 rounded-xl bg-slate-950 border border-white/10">
                  <div className="text-xs text-slate-400">Total Bricks</div>
                  <div className="text-2xl font-bold text-white font-mono mt-1">{boundaryResult.totalBricks.toLocaleString()}</div>
                  <div className="text-[11px] text-slate-500">Pcs (+5% waste)</div>
                </div>
                <div className="p-4 rounded-xl bg-slate-950 border border-white/10">
                  <div className="text-xs text-slate-400">Total Cement</div>
                  <div className="text-2xl font-bold text-cyan-400 font-mono mt-1">{boundaryResult.cementBags}</div>
                  <div className="text-[11px] text-slate-500">Bags (wall + pillars)</div>
                </div>
                <div className="p-4 rounded-xl bg-slate-950 border border-white/10">
                  <div className="text-xs text-slate-400">Mortar Sand</div>
                  <div className="text-2xl font-bold text-amber-400 font-mono mt-1">{boundaryResult.sandCft}</div>
                  <div className="text-[11px] text-slate-500">cft</div>
                </div>
                <div className="p-4 rounded-xl bg-slate-950 border border-white/10">
                  <div className="text-xs text-slate-400">Pillar Steel</div>
                  <div className="text-2xl font-bold text-emerald-400 font-mono mt-1">{boundaryResult.pillarSteelKg}</div>
                  <div className="text-[11px] text-slate-500">kg (12mm rebar)</div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* =================================================================== */}
        {/* TAB 10: CARPET & SUPER BUILT-UP AREA CALCULATOR */}
        {/* =================================================================== */}
        {activeTab === 'carpet-area' && (
          <div className="space-y-6">
            <div className="flex flex-wrap items-center justify-between gap-4 pb-4 border-b border-white/10">
              <div>
                <h3 className="text-xl font-bold text-white flex items-center gap-2">
                  <Grid className="w-5 h-5 text-cyan-400" /> Carpet Area vs. Built-up Area (RERA)
                </h3>
                <p className="text-xs text-slate-400">Differentiates net usable carpet area, wall allowances, and common area loading factors.</p>
              </div>
              <button
                type="button"
                onClick={() => {
                  setCalcBaseMode('carpet');
                  setCarpetInputArea(900);
                  setWallThicknessPct(12);
                  setBalconyArea(80);
                  setCommonLoadingPct(25);
                  setRatePerSqFtInput(4500);
                }}
                className="text-xs text-slate-400 hover:text-white flex items-center gap-1.5 transition-colors"
              >
                <RotateCcw className="w-3.5 h-3.5" /> Reset
              </button>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              <div className="space-y-4">
                <div>
                  <label className="block text-xs font-semibold uppercase text-slate-400 mb-1">Starting Metric</label>
                  <div className="grid grid-cols-2 gap-2">
                    <button
                      type="button"
                      onClick={() => setCalcBaseMode('carpet')}
                      className={`py-2 px-3 rounded-xl border text-xs font-semibold ${
                        calcBaseMode === 'carpet' ? 'bg-blue-600 text-white border-blue-500' : 'bg-slate-950 border-white/10 text-slate-400'
                      }`}
                    >
                      From Carpet Area
                    </button>
                    <button
                      type="button"
                      onClick={() => setCalcBaseMode('super')}
                      className={`py-2 px-3 rounded-xl border text-xs font-semibold ${
                        calcBaseMode === 'super' ? 'bg-blue-600 text-white border-blue-500' : 'bg-slate-950 border-white/10 text-slate-400'
                      }`}
                    >
                      From Super Built-up
                    </button>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold uppercase text-slate-400 mb-1">
                    {calcBaseMode === 'carpet' ? 'Net Carpet Area (Sq. Ft)' : 'Super Built-up Area (Sq. Ft)'}
                  </label>
                  <input
                    type="number"
                    min="1"
                    value={carpetInputArea}
                    onChange={(e) => setCarpetInputArea(Math.max(0, parseFloat(e.target.value) || 0))}
                    className="w-full bg-slate-950 border border-white/15 rounded-xl px-4 py-2.5 text-sm text-white font-mono"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-semibold text-slate-400 mb-1">Wall Thickness %</label>
                    <input
                      type="number"
                      min="5"
                      max="20"
                      value={wallThicknessPct}
                      onChange={(e) => setWallThicknessPct(Math.max(0, parseFloat(e.target.value) || 0))}
                      className="w-full bg-slate-950 border border-white/15 rounded-xl px-3 py-2 text-sm text-white font-mono"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-slate-400 mb-1">Common Loading %</label>
                    <input
                      type="number"
                      min="10"
                      max="40"
                      value={commonLoadingPct}
                      onChange={(e) => setCommonLoadingPct(Math.max(0, parseFloat(e.target.value) || 0))}
                      className="w-full bg-slate-950 border border-white/15 rounded-xl px-3 py-2 text-sm text-white font-mono"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold uppercase text-slate-400 mb-1">Base Price / Sq. Ft ({currSymbol})</label>
                  <input
                    type="number"
                    min="0"
                    value={ratePerSqFtInput}
                    onChange={(e) => setRatePerSqFtInput(Math.max(0, parseFloat(e.target.value) || 0))}
                    className="w-full bg-slate-950 border border-white/15 rounded-xl px-4 py-2 text-sm text-white font-mono"
                  />
                </div>
              </div>

              <div className="lg:col-span-2 space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div className="p-5 rounded-2xl bg-slate-950 border border-blue-500/30 space-y-1">
                    <div className="text-xs text-blue-400 font-bold uppercase">Carpet Area (RERA)</div>
                    <div className="text-3xl font-extrabold text-white font-mono">{areaResult.carpetArea} <span className="text-sm font-normal text-slate-400">sq.ft</span></div>
                    <div className="text-[11px] text-slate-400 pt-1">Net usable floor space inside internal walls.</div>
                  </div>

                  <div className="p-5 rounded-2xl bg-slate-950 border border-white/10 space-y-1">
                    <div className="text-xs text-slate-400 font-bold uppercase">Built-Up Area</div>
                    <div className="text-3xl font-extrabold text-white font-mono">{areaResult.builtUpArea} <span className="text-sm font-normal text-slate-400">sq.ft</span></div>
                    <div className="text-[11px] text-slate-400 pt-1">Includes carpet, external walls & balconies.</div>
                  </div>

                  <div className="p-5 rounded-2xl bg-slate-950 border border-emerald-500/30 space-y-1">
                    <div className="text-xs text-emerald-400 font-bold uppercase">Super Built-Up Area</div>
                    <div className="text-3xl font-extrabold text-emerald-400 font-mono">{areaResult.superBuiltUpArea} <span className="text-sm font-normal text-slate-400">sq.ft</span></div>
                    <div className="text-[11px] text-slate-400 pt-1">Total saleable area with lift, stairs & lobby.</div>
                  </div>
                </div>

                <div className="p-5 rounded-2xl bg-slate-950 border border-white/10 flex flex-wrap items-center justify-between gap-4 text-xs">
                  <div>
                    <span className="text-slate-400">Effective Loading Factor:</span>
                    <strong className="text-cyan-400 ml-1.5 font-mono text-sm">{areaResult.loadingPctEffective}% ({areaResult.loadingSqFt} sq.ft)</strong>
                  </div>
                  <div>
                    <span className="text-slate-400">Estimated Property Valuation:</span>
                    <strong className="text-emerald-400 ml-1.5 font-mono text-base">{formatCurrency(areaResult.totalValuation)}</strong>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* =================================================================== */}
        {/* TAB 11: CONSTRUCTION LOAN & EMI CALCULATOR */}
        {/* =================================================================== */}
        {activeTab === 'loan-emi' && (
          <div className="space-y-6">
            <div className="flex flex-wrap items-center justify-between gap-4 pb-4 border-b border-white/10">
              <div>
                <h3 className="text-xl font-bold text-white flex items-center gap-2">
                  <DollarSign className="w-5 h-5 text-emerald-400" /> Home Construction Loan & EMI Calculator
                </h3>
                <p className="text-xs text-slate-400">Calculates monthly installments, total interest liability, and principal-interest distribution.</p>
              </div>
              <button
                type="button"
                onClick={() => {
                  setLoanPrincipal(2500000);
                  setLoanAnnualRate(8.5);
                  setLoanTenureYears(15);
                }}
                className="text-xs text-slate-400 hover:text-white flex items-center gap-1.5 transition-colors"
              >
                <RotateCcw className="w-3.5 h-3.5" /> Reset
              </button>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              <div className="space-y-4">
                <div>
                  <label className="block text-xs font-semibold uppercase text-slate-400 mb-1">
                    Loan Amount ({currSymbol})
                  </label>
                  <input
                    type="number"
                    min="10000"
                    step="50000"
                    value={loanPrincipal}
                    onChange={(e) => setLoanPrincipal(Math.max(0, parseFloat(e.target.value) || 0))}
                    className="w-full bg-slate-950 border border-white/15 rounded-xl px-4 py-2.5 text-sm text-white font-mono"
                  />
                  <div className="flex justify-between text-[11px] text-slate-500 mt-1 font-mono">
                    <span>{formatCurrency(loanPrincipal)}</span>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold uppercase text-slate-400 mb-1">
                    Interest Rate (% per annum)
                  </label>
                  <input
                    type="number"
                    step="0.1"
                    min="1"
                    max="25"
                    value={loanAnnualRate}
                    onChange={(e) => setLoanAnnualRate(Math.max(0.1, parseFloat(e.target.value) || 0.1))}
                    className="w-full bg-slate-950 border border-white/15 rounded-xl px-4 py-2.5 text-sm text-white font-mono"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold uppercase text-slate-400 mb-1">
                    Tenure (Years)
                  </label>
                  <input
                    type="number"
                    min="1"
                    max="30"
                    value={loanTenureYears}
                    onChange={(e) => setLoanTenureYears(Math.max(1, parseInt(e.target.value) || 1))}
                    className="w-full bg-slate-950 border border-white/15 rounded-xl px-4 py-2.5 text-sm text-white font-mono"
                  />
                  <span className="text-[11px] text-slate-500 font-mono mt-1 block">
                    {loanTenureYears * 12} monthly installments
                  </span>
                </div>
              </div>

              <div className="lg:col-span-2 space-y-4">
                <div className="p-6 rounded-2xl bg-slate-950 border border-emerald-500/20 space-y-3">
                  <div className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Estimated Monthly EMI</div>
                  <div className="text-4xl font-extrabold text-emerald-400 font-mono">
                    {formatCurrency(loanResult.monthlyEmi)} <span className="text-sm font-normal text-slate-400">/ month</span>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div className="p-4 rounded-xl bg-slate-950 border border-white/10">
                    <div className="text-xs text-slate-400">Principal Amount</div>
                    <div className="text-xl font-bold text-white font-mono mt-1">{formatCurrency(loanPrincipal)}</div>
                  </div>
                  <div className="p-4 rounded-xl bg-slate-950 border border-white/10">
                    <div className="text-xs text-slate-400">Total Interest Payable</div>
                    <div className="text-xl font-bold text-amber-400 font-mono mt-1">{formatCurrency(loanResult.totalInterest)}</div>
                  </div>
                  <div className="p-4 rounded-xl bg-slate-950 border border-white/10">
                    <div className="text-xs text-slate-400">Total Amount Payable</div>
                    <div className="text-xl font-bold text-cyan-400 font-mono mt-1">{formatCurrency(loanResult.totalPayment)}</div>
                  </div>
                </div>

                {/* Visual Ratio Bar */}
                <div className="p-4 rounded-xl bg-slate-950 border border-white/10 space-y-2 text-xs">
                  <div className="flex justify-between text-slate-400">
                    <span>Principal: {(100 - loanResult.interestPercentage).toFixed(1)}%</span>
                    <span>Interest: {loanResult.interestPercentage}%</span>
                  </div>
                  <div className="w-full h-3 rounded-full bg-slate-800 overflow-hidden flex">
                    <div
                      className="bg-blue-500 h-full transition-all"
                      style={{ width: `${100 - loanResult.interestPercentage}%` }}
                    ></div>
                    <div
                      className="bg-amber-500 h-full transition-all"
                      style={{ width: `${loanResult.interestPercentage}%` }}
                    ></div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
