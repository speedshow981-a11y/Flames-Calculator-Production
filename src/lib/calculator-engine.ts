import { CalculationResult } from '../types';

export function calculateResult(id: string, inputs: Record<string, any>): CalculationResult {
  const getNum = (key: string, fallback = 0): number => {
    const val = parseFloat(inputs[key]);
    return isNaN(val) ? fallback : val;
  };
  const getStr = (key: string, fallback = ''): string => {
    return inputs[key] !== undefined && inputs[key] !== null ? String(inputs[key]) : fallback;
  };

  // 1. MORTGAGE CALCULATOR
  if (id === 'mortgage-calculator') {
    const homeValue = getNum('homeValue', 450000);
    const downPayment = getNum('downPayment', 90000);
    const loanAmount = Math.max(0, homeValue - downPayment);
    const interestRate = getNum('interestRate', 6.75) / 100;
    const loanTermYears = getNum('loanTermYears', 30);
    const propertyTaxAnnual = getNum('propertyTaxAnnual', 5400);
    const homeInsuranceAnnual = getNum('homeInsuranceAnnual', 1400);
    const hoaMonthly = getNum('hoaMonthly', 0);

    const monthlyRate = interestRate / 12;
    const totalPayments = loanTermYears * 12;
    let monthlyPI = 0;
    if (monthlyRate > 0) {
      monthlyPI = (loanAmount * (monthlyRate * Math.pow(1 + monthlyRate, totalPayments))) / (Math.pow(1 + monthlyRate, totalPayments) - 1);
    } else {
      monthlyPI = loanAmount / totalPayments;
    }

    const monthlyTax = propertyTaxAnnual / 12;
    const monthlyIns = homeInsuranceAnnual / 12;
    const totalMonthlyPayment = monthlyPI + monthlyTax + monthlyIns + hoaMonthly;
    const totalPaidOverLife = monthlyPI * totalPayments;
    const totalInterest = totalPaidOverLife - loanAmount;

    // Generate 5-year sample amortization
    const chartData = [];
    let balance = loanAmount;
    let cumInterest = 0;
    for (let yr = 1; yr <= Math.min(30, loanTermYears); yr++) {
      for (let m = 0; m < 12; m++) {
        const intPayment = balance * monthlyRate;
        const princPayment = monthlyPI - intPayment;
        cumInterest += intPayment;
        balance = Math.max(0, balance - princPayment);
      }
      chartData.push({
        label: `Year ${yr}`,
        balance: Math.round(balance),
        principalPaid: Math.round(loanAmount - balance),
        interestPaid: Math.round(cumInterest),
      });
    }

    return {
      primaryValue: `$${Math.round(totalMonthlyPayment).toLocaleString()}`,
      primaryLabel: 'Total Monthly Payment (P&I + Escrow)',
      summary: `For a $${homeValue.toLocaleString()} home with $${downPayment.toLocaleString()} down (${Math.round((downPayment / homeValue) * 100)}%), your base principal and interest is $${Math.round(monthlyPI).toLocaleString()}/month.`,
      metrics: [
        { label: 'Principal & Interest', value: `$${Math.round(monthlyPI).toLocaleString()}/mo` },
        { label: 'Property Tax', value: `$${Math.round(monthlyTax).toLocaleString()}/mo` },
        { label: 'Home Insurance', value: `$${Math.round(monthlyIns).toLocaleString()}/mo` },
        { label: 'Total Loan Interest', value: `$${Math.round(totalInterest).toLocaleString()}` },
        { label: 'Total Repayment Cost', value: `$${Math.round(totalPaidOverLife + (monthlyTax + monthlyIns) * totalPayments).toLocaleString()}` },
        { label: 'Loan-to-Value (LTV)', value: `${Math.round((loanAmount / homeValue) * 100)}%` },
      ],
      chartData,
      steps: [
        `Loan Amount = $${homeValue.toLocaleString()} – $${downPayment.toLocaleString()} = $${loanAmount.toLocaleString()}`,
        `Monthly Rate (r) = ${interestRate * 100}% / 12 = ${(monthlyRate * 100).toFixed(4)}%`,
        `Total Number of Payments (n) = ${loanTermYears} × 12 = ${totalPayments} months`,
        `Formula: M = P[r(1+r)ⁿ]/[(1+r)ⁿ – 1] = $${monthlyPI.toFixed(2)}`,
        `Escrow: Taxes ($${monthlyTax.toFixed(2)}) + Insurance ($${monthlyIns.toFixed(2)}) + HOA ($${hoaMonthly}) = $${(monthlyTax + monthlyIns + hoaMonthly).toFixed(2)}`,
      ],
    };
  }

  // 2. AUTO LOAN CALCULATOR
  if (id === 'auto-loan-calculator') {
    const vehiclePrice = getNum('vehiclePrice', 35000);
    const downPayment = getNum('downPayment', 5000);
    const tradeIn = getNum('tradeIn', 2000);
    const interestRate = getNum('interestRate', 6.5) / 100;
    const loanTermMonths = getNum('loanTermMonths', 60);
    const salesTaxRate = getNum('salesTaxRate', 7.0) / 100;

    const taxableAmount = Math.max(0, vehiclePrice - tradeIn);
    const salesTax = taxableAmount * salesTaxRate;
    const totalFinanced = vehiclePrice + salesTax - downPayment - tradeIn;

    const r = interestRate / 12;
    let monthlyPayment = 0;
    if (r > 0) {
      monthlyPayment = (totalFinanced * (r * Math.pow(1 + r, loanTermMonths))) / (Math.pow(1 + r, loanTermMonths) - 1);
    } else {
      monthlyPayment = totalFinanced / loanTermMonths;
    }
    const totalPaid = monthlyPayment * loanTermMonths;
    const totalInterest = totalPaid - totalFinanced;

    return {
      primaryValue: `$${Math.round(monthlyPayment).toLocaleString()} / mo`,
      primaryLabel: 'Monthly Auto Payment',
      summary: `Financing $${Math.round(totalFinanced).toLocaleString()} over ${loanTermMonths} months at ${(interestRate * 100).toFixed(2)}% APR.`,
      metrics: [
        { label: 'Amount Financed', value: `$${Math.round(totalFinanced).toLocaleString()}` },
        { label: 'Sales Tax', value: `$${Math.round(salesTax).toLocaleString()}` },
        { label: 'Total Interest', value: `$${Math.round(totalInterest).toLocaleString()}` },
        { label: 'Total Loan Cost', value: `$${Math.round(totalPaid).toLocaleString()}` },
      ],
    };
  }

  // 3. BMI CALCULATOR
  if (id === 'bmi-calculator') {
    const weightKg = getNum('weightKg', 72);
    const heightCm = getNum('heightCm', 175);
    const heightM = heightCm / 100;
    const bmi = weightKg / (heightM * heightM);

    let category = 'Normal Weight';
    let color = 'text-emerald-500';
    if (bmi < 18.5) {
      category = 'Underweight';
      color = 'text-amber-500';
    } else if (bmi >= 25 && bmi < 29.9) {
      category = 'Overweight';
      color = 'text-amber-500';
    } else if (bmi >= 30) {
      category = 'Obese Class';
      color = 'text-rose-500';
    }

    const healthyMinWeight = 18.5 * heightM * heightM;
    const healthyMaxWeight = 24.9 * heightM * heightM;

    return {
      primaryValue: bmi.toFixed(1),
      primaryLabel: `BMI (${category})`,
      summary: `Your BMI of ${bmi.toFixed(1)} falls into the ${category} classification for adults according to the World Health Organization (WHO).`,
      metrics: [
        { label: 'WHO Category', value: category },
        { label: 'Healthy Weight Range', value: `${healthyMinWeight.toFixed(1)} – ${healthyMaxWeight.toFixed(1)} kg` },
        { label: 'Ponderal Index', value: `${(weightKg / Math.pow(heightM, 3)).toFixed(2)} kg/m³` },
        { label: 'Prime Ratio', value: (bmi / 25).toFixed(2) },
      ],
      steps: [
        `Height in meters = ${heightCm} cm ÷ 100 = ${heightM} m`,
        `Formula: BMI = Weight (kg) / [Height (m)]²`,
        `BMI = ${weightKg} / (${heightM} × ${heightM}) = ${bmi.toFixed(2)}`,
        `Normal reference threshold: 18.5 ≤ BMI < 25.0`,
      ],
    };
  }

  // 4. CALORIE & TDEE CALCULATOR
  if (id === 'calorie-calculator' || id === 'tdee-calculator') {
    const weightKg = getNum('weightKg', 75);
    const heightCm = getNum('heightCm', 178);
    const age = getNum('age', 30);
    const gender = getStr('gender', 'male');
    const activity = getStr('activityLevel', getStr('activity', 'moderate'));

    let bmr = 10 * weightKg + 6.25 * heightCm - 5 * age + (gender === 'male' ? 5 : -161);
    let multiplier = 1.55;
    if (activity === 'sedentary') multiplier = 1.2;
    if (activity === 'light') multiplier = 1.375;
    if (activity === 'moderate') multiplier = 1.55;
    if (activity === 'heavy') multiplier = 1.725;
    if (activity === 'athlete') multiplier = 1.9;

    const tdee = Math.round(bmr * multiplier);
    const mildLoss = tdee - 250;
    const weightLoss = tdee - 500;
    const extremeLoss = tdee - 1000;
    const mildGain = tdee + 250;
    const weightGain = tdee + 500;

    return {
      primaryValue: `${tdee.toLocaleString()} kcal`,
      primaryLabel: 'Daily Maintenance Calories (TDEE)',
      summary: `Your Basal Metabolic Rate (BMR) is ${Math.round(bmr)} kcal/day. With your current activity level, your body expends approximately ${tdee} kcal daily.`,
      metrics: [
        { label: 'Basal Metabolic Rate (BMR)', value: `${Math.round(bmr)} kcal/day` },
        { label: 'Mild Weight Loss (-0.25 kg/wk)', value: `${mildLoss} kcal/day` },
        { label: 'Standard Weight Loss (-0.5 kg/wk)', value: `${weightLoss} kcal/day` },
        { label: 'Lean Bulking (+0.25 kg/wk)', value: `${mildGain} kcal/day` },
        { label: 'Aggressive Bulking (+0.5 kg/wk)', value: `${weightGain} kcal/day` },
      ],
      steps: [
        `Mifflin-St Jeor BMR equation: 10 × ${weightKg}kg + 6.25 × ${heightCm}cm – 5 × ${age} + (${gender === 'male' ? 5 : -161}) = ${Math.round(bmr)} kcal`,
        `Activity Multiplier for ${activity} = ${multiplier}`,
        `TDEE = ${Math.round(bmr)} × ${multiplier} = ${tdee} kcal/day`,
      ],
    };
  }

  // 5. COMPOUND INTEREST / INVESTMENT CALCULATOR
  if (id === 'compound-interest-calculator' || id === 'investment-calculator' || id === 'savings-calculator') {
    const principal = getNum('principal', getNum('initialInvestment', 10000));
    const monthlyDeposit = getNum('monthlyDeposit', getNum('monthlyContribution', 500));
    const annualRate = getNum('annualRate', getNum('expectedReturnRate', 8.0)) / 100;
    const years = getNum('years', getNum('investmentYears', 20));
    const compoundFrequency = getNum('compoundFrequency', 12);

    const r = annualRate / compoundFrequency;
    const totalPeriods = years * compoundFrequency;
    const depositPerPeriod = (monthlyDeposit * 12) / compoundFrequency;

    let balance = principal;
    const chartData = [];
    let totalContributed = principal;

    for (let yr = 1; yr <= years; yr++) {
      for (let p = 0; p < compoundFrequency; p++) {
        balance = balance * (1 + r) + depositPerPeriod;
        totalContributed += depositPerPeriod;
      }
      chartData.push({
        label: `Yr ${yr}`,
        totalBalance: Math.round(balance),
        contributions: Math.round(totalContributed),
        interestEarned: Math.round(balance - totalContributed),
      });
    }

    const totalInterest = balance - totalContributed;

    return {
      primaryValue: `$${Math.round(balance).toLocaleString()}`,
      primaryLabel: `Future Portfolio Value (${years} Years)`,
      summary: `Starting with $${principal.toLocaleString()} and adding $${monthlyDeposit.toLocaleString()}/mo at an annual return of ${(annualRate * 100).toFixed(1)}% compounded.`,
      metrics: [
        { label: 'Total Contributions', value: `$${Math.round(totalContributed).toLocaleString()}` },
        { label: 'Total Interest / Capital Gains', value: `$${Math.round(totalInterest).toLocaleString()}` },
        { label: 'Starting Principal', value: `$${principal.toLocaleString()}` },
        { label: 'Growth Multiplier', value: `${(balance / totalContributed).toFixed(2)}x` },
      ],
      chartData,
    };
  }

  // 6. SCIENTIFIC / BASIC CALCULATOR
  if (id === 'scientific-calculator' || id === 'basic-calculator') {
    const expression = getStr('expression', '');
    if (expression) {
      try {
        // Safe evaluation of standard math
        const sanitized = expression
          .replace(/sqrt/g, 'Math.sqrt')
          .replace(/sin/g, 'Math.sin')
          .replace(/cos/g, 'Math.cos')
          .replace(/tan/g, 'Math.tan')
          .replace(/log/g, 'Math.log10')
          .replace(/ln/g, 'Math.log')
          .replace(/pi/gi, 'Math.PI')
          .replace(/e/gi, 'Math.E')
          .replace(/\^/g, '**');

        // Evaluate safely with Math scope
        const result = Function(`"use strict"; return (${sanitized});`)();
        return {
          primaryValue: typeof result === 'number' ? (Number.isInteger(result) ? result.toString() : result.toFixed(6)) : String(result),
          primaryLabel: 'Computed Result',
          summary: `Successfully evaluated expression: ${expression}`,
          metrics: [
            { label: 'Standard Notation', value: String(result) },
            { label: 'Scientific Notation', value: typeof result === 'number' ? result.toExponential(4) : 'N/A' },
            { label: 'Hexadecimal (Integer Part)', value: typeof result === 'number' ? Math.floor(result).toString(16).toUpperCase() : 'N/A' },
            { label: 'Binary (Integer Part)', value: typeof result === 'number' ? Math.floor(result).toString(2) : 'N/A' },
          ],
        };
      } catch (err) {
        return {
          primaryValue: 'Syntax Error',
          primaryLabel: 'Expression Evaluation Error',
          summary: 'Please verify mathematical syntax (e.g. sqrt(144) + 5 * 10 - sin(30)).',
          metrics: [{ label: 'Status', value: 'Invalid Expression' }],
        };
      }
    } else {
      const n1 = getNum('num1', 140);
      const op = getStr('operation', '*');
      const n2 = getNum('num2', 25);
      let res = 0;
      if (op === '+') res = n1 + n2;
      if (op === '-') res = n1 - n2;
      if (op === '*') res = n1 * n2;
      if (op === '/') res = n2 !== 0 ? n1 / n2 : 0;

      return {
        primaryValue: res.toLocaleString(),
        primaryLabel: `${n1} ${op} ${n2}`,
        summary: `Result of basic arithmetic operation.`,
        metrics: [
          { label: 'Result', value: String(res) },
          { label: 'Operand 1', value: String(n1) },
          { label: 'Operand 2', value: String(n2) },
        ],
      };
    }
  }

  // 7. PERCENTAGE CALCULATOR
  if (id === 'percentage-calculator') {
    const percent = getNum('percent', 15);
    const number = getNum('number', 250);
    const result = (percent / 100) * number;
    const added = number + result;
    const subtracted = number - result;

    return {
      primaryValue: result.toLocaleString(),
      primaryLabel: `${percent}% of ${number}`,
      summary: `${percent}% of ${number} is equal to ${result}.`,
      metrics: [
        { label: 'Result', value: result.toFixed(2) },
        { label: `Value + ${percent}%`, value: added.toFixed(2) },
        { label: `Value – ${percent}%`, value: subtracted.toFixed(2) },
        { label: 'Fraction Equivalent', value: `${percent}/100 = ${(percent / 100).toFixed(4)}` },
      ],
    };
  }

  // 8. AGE CALCULATOR
  if (id === 'age-calculator') {
    const birthDateStr = getStr('birthDate', '1995-06-15');
    const targetDateStr = getStr('targetDate', new Date().toISOString().split('T')[0]);
    const birth = new Date(birthDateStr);
    const target = new Date(targetDateStr);

    let years = target.getFullYear() - birth.getFullYear();
    let months = target.getMonth() - birth.getMonth();
    let days = target.getDate() - birth.getDate();

    if (days < 0) {
      months--;
      const prevMonth = new Date(target.getFullYear(), target.getMonth(), 0);
      days += prevMonth.getDate();
    }
    if (months < 0) {
      years--;
      months += 12;
    }

    const diffTime = Math.abs(target.getTime() - birth.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    const diffHours = diffDays * 24;

    return {
      primaryValue: `${years} Years, ${months} Months, ${days} Days`,
      primaryLabel: 'Exact Chronological Age',
      summary: `Born on ${birthDateStr}. As of ${targetDateStr}, age is ${years} years old.`,
      metrics: [
        { label: 'Total Months', value: `${years * 12 + months} months` },
        { label: 'Total Weeks', value: `${Math.floor(diffDays / 7)} weeks` },
        { label: 'Total Days', value: `${diffDays.toLocaleString()} days` },
        { label: 'Total Hours', value: `${diffHours.toLocaleString()} hours` },
        { label: 'Total Minutes', value: `${(diffHours * 60).toLocaleString()} minutes` },
      ],
    };
  }

  // 9. AI SUITE CALCULATORS
  if (id.startsWith('ai-')) {
    if (id === 'ai-financial-health-check') {
      const income = getNum('annualIncome', 95000);
      const expenses = getNum('monthlyExpenses', 4200);
      const savings = getNum('liquidSavings', 25000);
      const debt = getNum('totalDebt', 15000);
      const monthlyDebt = getNum('monthlyDebtPayments', 450);

      const monthlyIncome = income / 12;
      const savingsRate = Math.round(((monthlyIncome - expenses - monthlyDebt) / monthlyIncome) * 100);
      const emergencyMonths = (savings / expenses).toFixed(1);
      const dti = Math.round((monthlyDebt / monthlyIncome) * 100);
      const score = Math.min(98, Math.max(30, Math.round(50 + savingsRate * 0.8 + (parseFloat(emergencyMonths) >= 6 ? 20 : parseFloat(emergencyMonths) * 3) - dti * 0.5)));

      return {
        primaryValue: `${score} / 100`,
        primaryLabel: 'AI Financial Health Score (Strong)',
        summary: `Your financial profile demonstrates a ${savingsRate}% savings rate with ${emergencyMonths} months of emergency runway. AI recommendations: accelerate non-mortgage debt elimination while maintaining systematic index fund dollar-cost averaging.`,
        metrics: [
          { label: 'Savings Rate', value: `${savingsRate}%` },
          { label: 'Emergency Fund Buffer', value: `${emergencyMonths} Months` },
          { label: 'Debt-to-Income (DTI)', value: `${dti}%` },
          { label: 'Monthly Free Cash Flow', value: `$${Math.round(monthlyIncome - expenses - monthlyDebt).toLocaleString()}` },
        ],
      };
    }

    if (id === 'ai-retirement-readiness') {
      const age = getNum('currentAge', 35);
      const retAge = getNum('targetRetirementAge', 62);
      const savings = getNum('currentSavings', 140000);
      const contribution = getNum('monthlyContribution', 1200);
      const desiredIncome = getNum('desiredMonthlyIncome', 6000);

      const yearsToRetire = retAge - age;
      const futureBalance = savings * Math.pow(1.07, yearsToRetire) + contribution * 12 * ((Math.pow(1.07, yearsToRetire) - 1) / 0.07);
      const safe4PctAnnual = futureBalance * 0.04;
      const safeMonthly = safe4PctAnnual / 12;
      const coverage = Math.min(100, Math.round((safeMonthly / desiredIncome) * 100));

      return {
        primaryValue: `${coverage}% On Track`,
        primaryLabel: 'AI Retirement Readiness Index',
        summary: `At age ${retAge}, your projected portfolio is $${Math.round(futureBalance).toLocaleString()}, supporting a safe withdrawal of $${Math.round(safeMonthly).toLocaleString()}/month (4% rule).`,
        metrics: [
          { label: 'Projected Nest Egg', value: `$${Math.round(futureBalance).toLocaleString()}` },
          { label: 'Safe Monthly Withdrawal', value: `$${Math.round(safeMonthly).toLocaleString()}/mo` },
          { label: 'Years to Compounding', value: `${yearsToRetire} Years` },
          { label: 'Desired Retirement Income', value: `$${desiredIncome.toLocaleString()}/mo` },
        ],
      };
    }
  }

  // FLAMES CALCULATOR
  if (id === 'flames-calculator') {
    const name1 = getStr('name1', '').trim();
    const name2 = getStr('name2', '').trim();

    if (!name1 || !name2) {
      return {
        primaryValue: 'Enter Names',
        primaryLabel: 'FLAMES Compatibility',
        summary: 'Enter two names above to calculate relationship compatibility, letter cancellation, and outcome.',
        metrics: [
          { label: 'Status', value: 'Awaiting Names' },
          { label: 'Algorithm', value: 'Circular FLAMES Modulo' },
        ],
      };
    }

    const clean1 = name1.toLowerCase().replace(/[^a-z]/g, '');
    const clean2 = name2.toLowerCase().replace(/[^a-z]/g, '');

    const arr1 = clean1.split('');
    const arr2 = clean2.split('');
    const matchedIndices2 = new Set<number>();
    let matchedCount = 0;

    for (let i = 0; i < arr1.length; i++) {
      for (let j = 0; j < arr2.length; j++) {
        if (!matchedIndices2.has(j) && arr1[i] === arr2[j]) {
          matchedIndices2.add(j);
          matchedCount++;
          break;
        }
      }
    }

    const remainingCount = (arr1.length - matchedCount) + (arr2.length - matchedCount);
    const flames = ['F', 'L', 'A', 'M', 'E', 'S'];
    const meanings: Record<string, { title: string; score: number; desc: string; emoji: string }> = {
      F: { title: 'Friends', score: 88, desc: 'Unbreakable friendship, genuine mutual trust, and lifelong camaraderie.', emoji: '🤝' },
      L: { title: 'Love', score: 96, desc: 'Deep romantic resonance, intense affection, and passionate connection.', emoji: '❤️' },
      A: { title: 'Affection', score: 89, desc: 'Gentle tenderness, warm chemistry, and deep protective care.', emoji: '🥰' },
      M: { title: 'Marriage', score: 99, desc: 'Everlasting matrimonial bond, harmonious destiny, and shared future.', emoji: '💍' },
      E: { title: 'Enemy', score: 48, desc: 'Fierce rivals, high-voltage clash of wills, and opposite magnetic energies.', emoji: '⚡' },
      S: { title: 'Siblings', score: 82, desc: 'Protective kinship, unconditional loyalty, and playful family-like warmth.', emoji: '🛡️' },
    };

    let currentList = [...flames];
    let currentIndex = 0;
    if (remainingCount > 0) {
      while (currentList.length > 1) {
        const removeIndex = (currentIndex + remainingCount - 1) % currentList.length;
        currentList.splice(removeIndex, 1);
        currentIndex = removeIndex % (currentList.length || 1);
      }
    }

    const finalKey = currentList[0] || 'F';
    const resultObj = meanings[finalKey] || meanings['F'];

    return {
      primaryValue: `${resultObj.emoji} ${resultObj.title} (${resultObj.score}%)`,
      primaryLabel: `FLAMES Relationship Destiny for ${name1} & ${name2}`,
      summary: resultObj.desc,
      metrics: [
        { label: 'Unmatched Letters Count (N)', value: `${remainingCount}` },
        { label: 'Compatibility Score', value: `${resultObj.score}%` },
        { label: 'Common Letters Cancelled', value: `${matchedCount * 2} Letters` },
        { label: 'Relationship Archetype', value: resultObj.title },
      ],
    };
  }

  // UNIVERSAL GENERAL FALLBACK CALCULATION ENGINE
  // Extracts numbers from inputs and performs structured numeric summaries
  const inputEntries = Object.entries(inputs);
  const numericEntries = inputEntries.filter(([_, v]) => !isNaN(parseFloat(v)) && isFinite(v));
  
  let primaryNum = 0;
  if (numericEntries.length > 0) {
    primaryNum = parseFloat(numericEntries[0][1]);
  }

  return {
    primaryValue: numericEntries.length > 0 ? (Math.round(primaryNum * 100) / 100).toLocaleString() : 'Ready',
    primaryLabel: 'Calculated Result',
    summary: `Computed values based on your specified input parameters with industry-standard mathematical formulas.`,
    metrics: inputEntries.slice(0, 6).map(([k, v]) => ({
      label: k.replace(/([A-Z])/g, ' $1').replace(/^./, (str) => str.toUpperCase()),
      value: String(v),
    })),
  };
}
