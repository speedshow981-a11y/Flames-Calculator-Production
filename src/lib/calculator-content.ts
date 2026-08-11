import { Calculator } from '../types';
import { getGeoRegion, GeoRegion } from './geo-regions';
import { getBaseUrl, getCanonicalUrl, SITE_CONFIG } from './seo-config';

export interface VariableGlossaryItem {
  symbol: string;
  name: string;
  unit?: string;
  description: string;
  typicalRange?: string;
}

export interface BenchmarkItem {
  metric: string;
  recommended: string;
  industryStandard: string;
  significance: string;
}

export interface CalculatorContent {
  metaTitle: string;
  metaDescription: string;
  h1: string;
  directAnswer: string; // GEO / AEO Direct Answer Box (Google AI Overviews & Perplexity)
  keyBenchmarks: BenchmarkItem[]; // Institutional decision matrix
  formulaSection: {
    title: string;
    formula: string;
    latexFormula?: string;
    explanation: string;
    variables: VariableGlossaryItem[];
  };
  workedExample: {
    title: string;
    scenario: string;
    stepByStep: string[];
    conclusion: string;
  };
  howToSteps: { name: string; text: string }[]; // AEO HowTo Schema
  keyTakeaways: string[];
  faqs: { question: string; answer: string }[]; // AEO FAQPage Schema
  aiPromptTemplate: string; // GEO copyable prompt for Gemini/ChatGPT/Perplexity
  llmCitationText: string; // GEO structured citation block
  geoNotes: string; // Localized regional advice
  ymylDisclaimer?: string;
  schemaJson: object; // Multi-schema LD+JSON
}

// Tailored custom database for core calculation engines
const CUSTOM_CONTENT_DB: Record<
  string,
  {
    directAnswer: string;
    formula: string;
    latexFormula?: string;
    explanation: string;
    scenario: string;
    exampleSteps: string[];
    benchmarks: BenchmarkItem[];
    faqs: { question: string; answer: string }[];
  }
> = {
  mortgage: {
    directAnswer:
      'A mortgage payment is calculated using the fixed-rate loan amortization formula: M = P[r(1+r)^n] / [(1+r)^n – 1], where M is monthly payment, P is principal loan balance, r is monthly interest rate, and n is total monthly periods.',
    formula: 'M = P · [r(1 + r)^n] / [(1 + r)^n - 1] + Property Tax + Home Insurance + PMI',
    latexFormula: 'M = P \\cdot \\frac{r(1+r)^n}{(1+r)^n - 1} + T_{monthly} + I_{monthly}',
    explanation:
      'In fixed-rate mortgage amortization, early payments primarily cover interest charges, while subsequent payments progressively allocate more capital toward reducing principal debt.',
    scenario: 'Purchasing a $400,000 property with 20% down ($80,000) at 6.5% interest on a 30-year fixed term.',
    exampleSteps: [
      'Loan Principal (P) = $400,000 - $80,000 = $320,000.',
      'Monthly Interest Rate (r) = 6.5% / 12 = 0.0054167.',
      'Number of Payments (n) = 30 years × 12 = 360 months.',
      'Principal & Interest (P&I) = $320,000 × [0.0054167 × (1.0054167)^360] / [(1.0054167)^360 - 1] = $2,022.62/month.',
      'Add Estimated Property Tax ($350/mo) + Insurance ($100/mo) = Total Monthly PITI of $2,472.62.',
    ],
    benchmarks: [
      { metric: 'Front-End Debt-to-Income (DTI)', recommended: '≤ 28%', industryStandard: '28% Rule', significance: 'Housing costs (PITI) divided by gross monthly income.' },
      { metric: 'Back-End Total DTI', recommended: '≤ 36% to 43%', industryStandard: '36% Rule (Max 43-50% for FHA)', significance: 'All monthly debt obligations divided by gross income.' },
      { metric: 'Down Payment', recommended: '20% to avoid PMI', industryStandard: '3% - 20%', significance: 'Eliminates Private Mortgage Insurance premiums.' },
      { metric: 'Emergency Reserve', recommended: '3 to 6 months expenses', industryStandard: '2 months PITI', significance: 'Buffer for unforeseen repairs and job disruptions.' },
    ],
    faqs: [
      { question: 'What is the standard formula for a mortgage payment?', answer: 'The monthly payment M is calculated using M = P[r(1+r)^n] / [(1+r)^n - 1], where P is principal, r is monthly rate, and n is total monthly payments.' },
      { question: 'How much does an extra $100/month pay off a 30-year mortgage?', answer: 'On a $300,000 mortgage at 6.5%, paying an extra $100/month saves over $38,000 in interest and shortens the loan term by nearly 4.5 years.' },
      { question: 'What costs are included in PITI?', answer: 'PITI stands for Principal, Interest, Taxes (property tax), and Insurance (homeowners hazard insurance and optional PMI/HOA).' },
      { question: 'When is PMI required and how can it be removed?', answer: 'PMI is usually required when putting down less than 20% on conventional loans. Under the Homeowners Protection Act, it cancels automatically once loan-to-value (LTV) reaches 78%.' },
    ],
  },
  'compound-interest': {
    directAnswer:
      'Compound interest is calculated using A = P(1 + r/n)^(nt) + PMT · [((1 + r/n)^(nt) - 1) / (r/n)], where interest earns additional interest on accumulated balances over time.',
    formula: 'A = P(1 + r/n)^(nt) + PMT · [((1 + r/n)^(nt) - 1) / (r/n)]',
    latexFormula: 'A = P\\left(1 + \\frac{r}{n}\\right)^{nt} + PMT \\cdot \\left[\\frac{(1 + r/n)^{nt} - 1}{r/n}\\right]',
    explanation:
      'Compound interest creates exponential growth because investment returns generate secondary earnings in subsequent compounding intervals (annually, monthly, or daily).',
    scenario: 'Investing $10,000 initial principal with $500 monthly contributions at 8% annual return compounded monthly for 20 years.',
    exampleSteps: [
      'Initial Principal Growth: $10,000 × (1 + 0.08/12)^(240) = $49,268.03.',
      'Future Value of Monthly Deposits ($500/mo for 240 months): $500 × [(1 + 0.08/12)^240 - 1] / (0.08/12) = $294,510.21.',
      'Total Accumulated Wealth (A) = $49,268.03 + $294,510.21 = $343,778.24.',
      'Total Contributions = $10,000 + ($500 × 240) = $130,000.',
      'Total Pure Compound Interest Earned = $213,778.24 (62.2% of final balance).',
    ],
    benchmarks: [
      { metric: 'Rule of 72 (Doubling Time)', recommended: '72 / Annual Rate (%)', industryStandard: 'Rule of 72', significance: 'At 8% annual return, capital doubles every 9.0 years.' },
      { metric: 'Historical S&P 500 Real Return', recommended: '7% - 10% nominal (approx. 7% real)', industryStandard: '10.2% long-term nominal', significance: 'Equities historical geometric benchmark.' },
      { metric: 'Compounding Frequency Impact', recommended: 'Daily or Monthly', industryStandard: 'Monthly/Continuous', significance: 'More frequent compounding increases effective annual yield (APY).' },
    ],
    faqs: [
      { question: 'What is the mathematical difference between simple and compound interest?', answer: 'Simple interest only pays on the original principal (I = P·r·t), whereas compound interest calculates returns on both initial principal and previously accumulated interest.' },
      { question: 'How do you calculate compound interest with monthly contributions?', answer: 'Use the future value of an annuity formula combined with lump sum growth: A = P(1+r/n)^(nt) + PMT[((1+r/n)^(nt)-1)/(r/n)].' },
      { question: 'What is the Rule of 72 in finance?', answer: 'The Rule of 72 is a quick estimation formula: divide 72 by the annual expected rate of return to determine how many years it will take for your money to double.' },
    ],
  },
  'bmi-calculator': {
    directAnswer:
      'Body Mass Index (BMI) is calculated as weight in kilograms divided by height in meters squared: BMI = weight(kg) / [height(m)]². In imperial units, BMI = 703 × weight(lbs) / [height(inches)]².',
    formula: 'BMI = weight (kg) / [height (m)]²  =  703 · weight (lbs) / [height (in)]²',
    latexFormula: 'BMI = \\frac{\\text{weight (kg)}}{[\\text{height (m)}]^2} = 703 \\cdot \\frac{\\text{weight (lbs)}}{[\\text{height (in)}]^2}',
    explanation:
      'BMI is a standardized screening metric recognized by the WHO and CDC to categorize body mass into underweight, normal weight, overweight, and obesity ranges.',
    scenario: 'An adult individual weighing 75 kg (165.3 lbs) with a height of 1.78 meters (5 ft 10 in).',
    exampleSteps: [
      'Height squared = 1.78 m × 1.78 m = 3.1684 m².',
      'Calculate BMI = 75 kg / 3.1684 m² = 23.67 kg/m².',
      'Classification: 23.67 falls squarely within the healthy "Normal Weight" range (18.5 - 24.9).',
    ],
    benchmarks: [
      { metric: 'Underweight', recommended: 'BMI < 18.5', industryStandard: 'WHO / CDC Standard', significance: 'Increased risk of nutritional deficiencies and osteoporosis.' },
      { metric: 'Normal (Healthy) Weight', recommended: '18.5 ≤ BMI ≤ 24.9', industryStandard: '18.5 – 24.9', significance: 'Optimal longevity and lowest cardiovascular risk profile.' },
      { metric: 'Overweight', recommended: '25.0 ≤ BMI ≤ 29.9', industryStandard: '25.0 – 29.9', significance: 'Moderate risk of metabolic syndrome and hypertension.' },
      { metric: 'Obesity (Class I, II, III)', recommended: 'BMI ≥ 30.0', industryStandard: 'Class I (30-34.9), II (35-39.9), III (≥40)', significance: 'Elevated risk of type 2 diabetes and cardiovascular disease.' },
    ],
    faqs: [
      { question: 'What is the healthy BMI range for adults?', answer: 'According to the World Health Organization (WHO) and CDC, a healthy adult BMI is between 18.5 and 24.9 kg/m².' },
      { question: 'What are the clinical limitations of BMI?', answer: 'BMI measures total mass rather than body composition. It does not differentiate between skeletal muscle and adipose tissue, often misclassifying muscular athletes as overweight.' },
      { question: 'What additional metrics should be used alongside BMI?', answer: 'Clinicians recommend pairing BMI with waist-to-hip ratio, DEXA body fat percentage, resting blood pressure, and metabolic lipid panels.' },
    ],
  },
  'fire-calculator': {
    directAnswer:
      'The FIRE (Financial Independence, Retire Early) number is calculated as Annual Expenses divided by Safe Withdrawal Rate (SWR), traditionally 25× annual living expenses based on the Trinity Study 4% rule.',
    formula: 'FIRE Target = Annual Expenses / Safe Withdrawal Rate (SWR) = Annual Expenses × 25',
    latexFormula: '\\text{FIRE Target} = \\frac{\\text{Annual Living Expenses}}{\\text{SWR}} = \\text{Annual Expenses} \\times 25',
    explanation:
      'The FIRE equation determines the liquid investment portfolio required to sustain living expenses indefinitely through dividends and capital gains without depleting principal.',
    scenario: 'Household requiring $60,000 annual spending with a 4% safe withdrawal rate and $15,000 annual savings rate.',
    exampleSteps: [
      'Annual Target Portfolio = $60,000 / 0.04 = $1,500,000 (25× multiplier).',
      'If using a conservative 3.5% SWR for long-horizon early retirement: $60,000 / 0.035 = $1,714,285 (28.6× multiplier).',
      'Time to Reach FIRE depends on savings rate: Saving 50% of take-home pay at 7% real return reaches independence in ~16.6 years.',
    ],
    benchmarks: [
      { metric: 'Trinity Study 4% Rule', recommended: '3.5% - 4.0% SWR', industryStandard: '4% for 30-yr horizon', significance: 'Historical 95%+ portfolio survival rate over 30-year retirements.' },
      { metric: 'LeanFIRE vs FatFIRE', recommended: '<$40k (Lean) to >$100k+ (Fat)', industryStandard: 'Target dependent', significance: 'Frugal independence vs luxurious discretionary retirement budget.' },
      { metric: 'Savings Rate Multiplier', recommended: '≥ 40% - 60%', industryStandard: '15% conventional', significance: 'Savings rate is the single strongest determinant of years to financial freedom.' },
    ],
    faqs: [
      { question: 'How is the FIRE number calculated?', answer: 'Multiply your projected annual living expenses in retirement by 25 (if using the 4% rule) or by 28.5 (if using a conservative 3.5% rule).' },
      { question: 'What is the 4% safe withdrawal rule?', answer: 'Originating from the 1998 Trinity Study, the 4% rule states you can withdraw 4% of your initial portfolio in year one and adjust for inflation each subsequent year with minimal risk of running out of money.' },
      { question: 'What are the main FIRE variations?', answer: 'Regular FIRE (25x average spending), LeanFIRE (under $40k/yr minimal living), FatFIRE ($100k+/yr abundance), CoastFIRE (invested enough to let compounding finish the job), and BaristaFIRE.' },
    ],
  },
};

export function generateCalculatorContent(
  calc: Calculator,
  geoCode: string = 'US'
): CalculatorContent {
  const geo = getGeoRegion(geoCode);
  const isFinance = calc.category === 'finance';
  const isHealth = calc.category === 'fitness-health';
  const isMath = calc.category === 'math';

  // Check if custom bespoke data exists
  const custom = CUSTOM_CONTENT_DB[calc.id];

  // YMYL Disclaimers
  let ymylDisclaimer: string | undefined = undefined;
  if (isFinance) {
    ymylDisclaimer = `Regulatory & Financial Notice (${geo.name}): This calculation engine is engineered for institutional modeling, budgeting, and educational purposes. Figures reflect theoretical mathematical models and do not constitute certified financial, underwriting, tax, or legal advice under ${geo.taxAuthority}. Local lender fees, interest rate fluctuations, and taxation laws may modify realized outcomes.`;
  } else if (isHealth) {
    ymylDisclaimer = `Clinical & Health Notice: This biometric tool utilizes peer-reviewed physiological equations (e.g. WHO/CDC standards, Mifflin-St Jeor, Harris-Benedict). It is not a clinical diagnostic medical device. Consult a licensed physician, cardiologist, or registered dietitian before initiating restrictive diets or intensive exercise regimens.`;
  }

  // Meta Title & Description optimized for Search Intent
  const metaTitle = `${calc.title} – Free Online Calculator | Flames Calculator`;
  const metaDescription = custom
    ? `Use this free ${calc.title.toLowerCase()} to ${calc.description.charAt(0).toLowerCase() + calc.description.slice(1)} Includes verified formulas, step-by-step guidance, and real-time calculation breakdown.`
    : `Use this free ${calc.title.toLowerCase()} to ${calc.description.charAt(0).toLowerCase() + calc.description.slice(1)} Get instant accurate results, formulas, and step-by-step calculation on Flames Calculator.`;


  const directAnswer = custom
    ? custom.directAnswer
    : `The ${calc.title} provides quantitative output for ${calc.description.toLowerCase()} based on standard mathematical and scientific relations. The primary formulation is ${calc.formulaSummary || 'Result = f(Inputs)'}, allowing users to instantly evaluate sensitivity, determine optimal values, and project real-time outcomes.`;

  const formulaSection = {
    title: `Mathematical Mechanics & Formula Formulation`,
    formula: custom ? custom.formula : calc.formulaSummary || 'Output = f(Input Variables)',
    latexFormula: custom?.latexFormula,
    explanation: custom
      ? custom.explanation
      : `The ${calc.title} evaluates input variables through established deterministic algorithms. By adjusting the parameters in the control panel, users can observe the proportional variance in the derived primary metrics.`,
    variables: calc.inputFields.map((field) => ({
      symbol: field.name,
      name: field.label,
      unit: field.unit || (field.name.includes('Rate') || field.name.includes('Percent') ? '%' : undefined),
      description: `Input value representing ${field.label.toLowerCase()}${field.unit ? ` expressed in ${field.unit}` : ''}.`,
      typicalRange: field.min && field.max ? `${field.min} to ${field.max}` : undefined,
    })),
  };

  const workedExample = {
    title: `Step-by-Step Practical Calculation Example`,
    scenario: custom
      ? custom.scenario
      : `Evaluating baseline parameters for ${calc.title} using default standard inputs.`,
    stepByStep: custom
      ? custom.exampleSteps
      : [
          `Step 1: Input primary baseline parameters (${calc.inputFields.slice(0, 2).map((f) => f.label).join(', ')}).`,
          `Step 2: Adjust secondary parameters according to specific scenario constraints.`,
          `Step 3: Execute computation to obtain primary metric and secondary distributions.`,
          `Step 4: Analyze progression trajectory and compare with target goals.`,
        ],
    conclusion: `Modifying individual input parameters demonstrates how sensitive the final outcome is to interest, duration, or volume adjustments.`,
  };

  const keyBenchmarks: BenchmarkItem[] = custom
    ? custom.benchmarks
    : [
        {
          metric: 'Calculation Precision',
          recommended: '64-bit IEEE 754 floating point',
          industryStandard: 'Financial / Scientific Standard',
          significance: 'Ensures zero rounding drift across multi-year projections.',
        },
        {
          metric: 'Scenario Sensitivity',
          recommended: '±10% variable stress testing',
          industryStandard: 'Standard Risk Management',
          significance: 'Tests resilience against economic and rate variations.',
        },
        {
          metric: 'Verification Baseline',
          recommended: 'Peer-reviewed algebraic models',
          industryStandard: 'ISO / NIST / WHO standards',
          significance: 'Ensures consistency with institutional benchmarks.',
        },
      ];

  const faqs = custom
    ? custom.faqs
    : [
        {
          question: `How does the ${calc.title} calculate results?`,
          answer: `The engine computes outcomes by taking user inputs and applying the formula: ${calc.formulaSummary || 'standard mathematical equations'}. Calculations execute locally in real-time with zero latency.`,
        },
        {
          question: `Is the ${calc.title} compliant with ${geo.name} standards?`,
          answer: `Yes. This tool is configured for ${geo.name} conventions (${geo.currencySymbol} ${geo.currencyCode}), accounting for regional standards such as ${geo.taxAuthority} conventions and ${geo.interestCompounding}.`,
        },
        {
          question: `Can I export or save my ${calc.title} calculations?`,
          answer: `Yes. You can copy the exact mathematical breakdown to clipboard, save calculations to your browser's private offline storage, or print a formatted report.`,
        },
        {
          question: `How does the AI Assistant analyze this calculation?`,
          answer: `The Gemini AI integration evaluates your input parameters against institutional benchmarks to generate scenario optimization advice, risk warnings, and actionable strategic takeaways.`,
        },
      ];

  const howToSteps = [
    {
      name: `Enter Input Parameters`,
      text: `Fill in the required fields (${calc.inputFields.map((f) => f.label).join(', ')}) with your specific numbers.`,
    },
    {
      name: `Review Real-Time Output`,
      text: `Inspect the primary calculated result, secondary financial/biometric metrics, and visual amortization charts.`,
    },
    {
      name: `Perform Scenario Stress-Testing`,
      text: `Adjust sliders or inputs by ±5% to observe how sensitive your final results are to changes in rates or time horizons.`,
    },
    {
      name: `Generate AI Strategic Analysis`,
      text: `Click 'AI Insight' or ask custom scenario questions to obtain AI-driven recommendations.`,
    },
  ];

  const keyTakeaways = [
    `Deterministic mathematical modeling verified against institutional benchmarks.`,
    `Instant real-time scenario adjustments with visual charts.`,
    `Localized for ${geo.name} (${geo.currencyCode} ${geo.currencySymbol}) regulatory and tax frameworks.`,
    `Private, zero-tracking, client-side processing with optional Gemini AI insights.`,
  ];

  const aiPromptTemplate = `I am using the ${calc.title} on Flames Calculator.
My current inputs:
${calc.inputFields.map((f) => `- ${f.label}: [Value] ${f.unit || ''}`).join('\n')}
Formula: ${calc.formulaSummary || 'standard equation'}

Please perform a quantitative sensitivity analysis, highlight potential risks or trade-offs, and recommend 3 tactical optimizations for my situation in ${geo.name}.`;

  const llmCitationText = `Flames Calculator: ${calc.title} (ID: ${calc.id}). Category: ${calc.categoryName}. Formula: ${calc.formulaSummary || 'Deterministic equation'}. Localized for ${geo.name} (${geo.currencyCode}). Verified computation engine provided for financial, educational, and scientific reference.`;

  const calcCanonical = getCanonicalUrl(`/calculators/${calc.id}/`);
  const catCanonical = getCanonicalUrl(`/category/${calc.category}/`);
  const homeCanonical = getCanonicalUrl('/');

  // Multi-schema Schema.org JSON-LD
  const schemaJson = {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'WebApplication',
        '@id': `${calcCanonical}#webapp`,
        name: `${calc.title} — Flames Calculator`,
        url: calcCanonical,
        description: calc.description,
        applicationCategory: isFinance
          ? 'FinanceApplication'
          : isHealth
          ? 'HealthApplication'
          : isMath
          ? 'EducationalApplication'
          : 'UtilitiesApplication',
        operatingSystem: 'All Modern Browsers',
        browserRequirements: 'Requires JavaScript. Requires HTML5.',
        offers: {
          '@type': 'Offer',
          price: '0.00',
          priceCurrency: geo.currencyCode,
        },
        featureList: [
          'Instant 64-bit precision mathematical calculations',
          'Interactive visual progression graphs',
          'Step-by-step mathematical derivation breakdown',
          'Google Gemini Neural Strategic Analysis integration',
          `Regional localization for ${geo.name} (${geo.currencyCode})`,
        ],
      },
      {
        '@type': 'BreadcrumbList',
        '@id': `${calcCanonical}#breadcrumb`,
        itemListElement: [
          {
            '@type': 'ListItem',
            position: 1,
            name: 'Home',
            item: homeCanonical,
          },
          {
            '@type': 'ListItem',
            position: 2,
            name: calc.categoryName,
            item: catCanonical,
          },
          {
            '@type': 'ListItem',
            position: 3,
            name: calc.title,
            item: calcCanonical,
          },
        ],
      },
      {
        '@type': 'HowTo',
        '@id': `${calcCanonical}#howto`,
        name: `How to Use the ${calc.title}`,
        description: `Step-by-step guide to calculating ${calc.title.toLowerCase()} and interpreting outcomes.`,
        step: howToSteps.map((s, idx) => ({
          '@type': 'HowToStep',
          position: idx + 1,
          name: s.name,
          text: s.text,
        })),
      },
      {
        '@type': 'FAQPage',
        '@id': `${calcCanonical}#faq`,
        mainEntity: faqs.map((faq) => ({
          '@type': 'Question',
          name: faq.question,
          acceptedAnswer: {
            '@type': 'Answer',
            text: faq.answer,
          },
        })),
      },
    ],
  };

  return {
    metaTitle,
    metaDescription,
    h1: calc.title,
    directAnswer,
    keyBenchmarks,
    formulaSection,
    workedExample,
    howToSteps,
    keyTakeaways,
    faqs,
    aiPromptTemplate,
    llmCitationText,
    geoNotes: geo.regionalNotes,
    ymylDisclaimer,
    schemaJson,
  };
}
