export interface GeoRegion {
  code: string;
  name: string;
  flag: string;
  currencySymbol: string;
  currencyCode: string;
  system: 'imperial' | 'metric' | 'hybrid';
  taxAuthority: string;
  mortgageBenchmark: string;
  interestCompounding: string;
  regionalNotes: string;
}

export const GEO_REGIONS: Record<string, GeoRegion> = {
  US: {
    code: 'US',
    name: 'United States',
    flag: '🇺🇸',
    currencySymbol: '$',
    currencyCode: 'USD',
    system: 'imperial',
    taxAuthority: 'IRS (Internal Revenue Service)',
    mortgageBenchmark: '30-Year & 15-Year Fixed Conforming Loans',
    interestCompounding: 'Monthly compounding (standard nominal APR)',
    regionalNotes: 'Calculations follow US standard conventions (IRS tax brackets, 401(k) / Roth IRA rules, standard 30-year amortization, and conforming loan limits).',
  },
  UK: {
    code: 'UK',
    name: 'United Kingdom',
    flag: '🇬🇧',
    currencySymbol: '£',
    currencyCode: 'GBP',
    system: 'metric',
    taxAuthority: 'HMRC (HM Revenue & Customs)',
    mortgageBenchmark: '2-Year & 5-Year Fixed Rate with SVR reversion',
    interestCompounding: 'Daily / Monthly balance calculation',
    regionalNotes: 'Calculations align with UK standards (HMRC tax bands, ISA allowances, Stamp Duty Land Tax (SDLT), and Bank of England base rate conventions).',
  },
  EU: {
    code: 'EU',
    name: 'European Union',
    flag: '🇪🇺',
    currencySymbol: '€',
    currencyCode: 'EUR',
    system: 'metric',
    taxAuthority: 'National EU Tax Authorities / ECB Guidelines',
    mortgageBenchmark: '15-Year & 20-Year Fixed Euribor-linked mortgages',
    interestCompounding: 'Annual / Monthly effective interest rate (TAEG/APR)',
    regionalNotes: 'Formatted according to European standards (ECB reference rates, standard metric unit conversions, and EU consumer credit directives).',
  },
  CA: {
    code: 'CA',
    name: 'Canada',
    flag: '🇨🇦',
    currencySymbol: 'C$',
    currencyCode: 'CAD',
    system: 'metric',
    taxAuthority: 'CRA (Canada Revenue Agency)',
    mortgageBenchmark: '5-Year Fixed with 25-Year Amortization',
    interestCompounding: 'Semi-annual compounding required by Canadian law for fixed mortgages',
    regionalNotes: 'Compliant with Canadian regulations (CRA tax brackets, RRSP / TFSA contribution models, and CMHC mortgage insurance rules).',
  },
  AU: {
    code: 'AU',
    name: 'Australia',
    flag: '🇦🇺',
    currencySymbol: 'A$',
    currencyCode: 'AUD',
    system: 'metric',
    taxAuthority: 'ATO (Australian Taxation Office)',
    mortgageBenchmark: 'Variable Rate / 3-Year Fixed with 30-Year Amortization',
    interestCompounding: 'Calculated daily, charged monthly',
    regionalNotes: 'Reflects Australian benchmarks (ATO progressive tax rates, Superannuation guarantee, Lenders Mortgage Insurance (LMI), and Negative Gearing principles).',
  },
  IN: {
    code: 'IN',
    name: 'India',
    flag: '🇮🇳',
    currencySymbol: '₹',
    currencyCode: 'INR',
    system: 'metric',
    taxAuthority: 'Income Tax Department (ITD) / RBI',
    mortgageBenchmark: 'Floating Rate Home Loans (EBLR/MCLR benchmark)',
    interestCompounding: 'Monthly reducing balance',
    regionalNotes: 'Adapted for Indian financial frameworks (Old vs New Tax Regime, Section 80C/80D deductions, PPF/EPF compound interest, and Lakhs/Crores notations).',
  },
  GLOBAL: {
    code: 'GLOBAL',
    name: 'Global / International',
    flag: '🌐',
    currencySymbol: '$',
    currencyCode: 'USD',
    system: 'metric',
    taxAuthority: 'International Accounting Standards (IFRS / GAAP)',
    mortgageBenchmark: 'Standard Amortized Loan Engine',
    interestCompounding: 'Standard Compound Frequency (Monthly/Annual)',
    regionalNotes: 'Uses globally recognized mathematical, ISO currency standards, and international metric conventions.',
  },
};

export function getGeoRegion(code?: string): GeoRegion {
  if (!code) return GEO_REGIONS.US;
  return GEO_REGIONS[code.toUpperCase()] || GEO_REGIONS.US;
}
