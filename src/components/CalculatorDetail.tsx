import React, { useState, useEffect } from 'react';
import {
  Calculator,
  CalculationResult,
  SavedCalculation,
} from '../types';
import { calculateResult } from '../lib/calculator-engine';
import { generateCalculatorContent } from '../lib/calculator-content';
import { updateDocumentSeo } from '../lib/seo-service';
import { getCanonicalUrl } from '../lib/seo-config';
import { getRelatedCalculators } from '../lib/calculators-data';
import { Link } from '../lib/router';
import { GEO_REGIONS, GeoRegion, getGeoRegion } from '../lib/geo-regions';
import { SeoInspectorModal } from './SeoInspectorModal';
import {
  Sparkles,
  Bookmark,
  Share2,
  Copy,
  Printer,
  RotateCcw,
  Check,
  TrendingUp,
  AlertTriangle,
  ArrowLeft,
  ChevronRight,
  Send,
  Loader2,
  Sliders,
  Globe,
  HelpCircle,
  Table,
  CheckCircle2,
  Code2,
  ExternalLink,
  Layers,
  ArrowUpRight,
} from 'lucide-react';

interface CalculatorDetailProps {
  calculator: Calculator;
  onBack?: () => void;
  onSelectCalculator?: (calcId: string) => void;
  onSaveCalculation: (calc: SavedCalculation) => void;
}

export const CalculatorDetail: React.FC<CalculatorDetailProps> = ({
  calculator,
  onBack,
  onSelectCalculator,
  onSaveCalculation,
}) => {
  // Region Selection (GEO Localization)
  const [selectedGeo, setSelectedGeo] = useState<string>('US');
  const geo = getGeoRegion(selectedGeo);

  // Initialize input state with default values
  const [inputs, setInputs] = useState<Record<string, any>>(() => {
    const init: Record<string, any> = {};
    calculator.inputFields.forEach((field) => {
      init[field.name] = field.defaultValue;
    });
    return init;
  });

  const [result, setResult] = useState<CalculationResult>(() =>
    calculateResult(calculator.id, inputs)
  );

  const [copied, setCopied] = useState(false);
  const [saved, setSaved] = useState(false);
  const [copiedCitation, setCopiedCitation] = useState(false);
  const [copiedPrompt, setCopiedPrompt] = useState(false);
  const [isSeoModalOpen, setIsSeoModalOpen] = useState(false);

  // AI Assistant Tab & State
  const [activeTab, setActiveTab] = useState<'calculator' | 'ai-analysis'>('calculator');
  const [aiAnalysis, setAiAnalysis] = useState<string | null>(null);
  const [isAiLoading, setIsAiLoading] = useState(false);
  const [userAiQuery, setUserAiQuery] = useState('');
  const [aiChatResponse, setAiChatResponse] = useState<string | null>(null);

  // Content for SEO, GEO, AEO, and Education
  const content = generateCalculatorContent(calculator, selectedGeo);
  const relatedCalcs = getRelatedCalculators(calculator.id, 4);

  // Recalculate on input change
  useEffect(() => {
    const res = calculateResult(calculator.id, inputs);
    setResult(res);
  }, [calculator.id, inputs]);

  // Dynamic SEO meta tag & JSON-LD injection
  useEffect(() => {
    updateDocumentSeo({
      title: content.metaTitle,
      description: content.metaDescription,
      canonicalUrl: getCanonicalUrl(`/calculators/${calculator.id}/`),
      schemaJson: content.schemaJson,
    });
  }, [calculator.id, selectedGeo, content.metaTitle, content.metaDescription]);

  const handleInputChange = (name: string, value: any) => {
    setInputs((prev) => ({ ...prev, [name]: value }));
  };

  const handleReset = () => {
    const init: Record<string, any> = {};
    calculator.inputFields.forEach((field) => {
      init[field.name] = field.defaultValue;
    });
    setInputs(init);
  };

  const handleCopy = () => {
    const text = `${calculator.title} (${geo.name} - ${geo.currencyCode}):\n` +
      `${result.primaryLabel}: ${result.primaryValue}\n` +
      result.metrics.map((m) => `${m.label}: ${m.value}`).join('\n');
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleCopyCitation = () => {
    navigator.clipboard.writeText(content.llmCitationText);
    setCopiedCitation(true);
    setTimeout(() => setCopiedCitation(false), 2000);
  };

  const handleCopyPrompt = () => {
    navigator.clipboard.writeText(content.aiPromptTemplate);
    setCopiedPrompt(true);
    setTimeout(() => setCopiedPrompt(false), 2000);
  };

  const handleSave = () => {
    const savedItem: SavedCalculation = {
      id: `${calculator.id}-${Date.now()}`,
      calculatorId: calculator.id,
      calculatorTitle: calculator.title,
      category: calculator.category,
      date: new Date().toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
        year: 'numeric',
      }),
      inputs: { ...inputs, _geo: selectedGeo },
      result,
    };
    onSaveCalculation(savedItem);
    setSaved(true);
    setTimeout(() => setSaved(false), 2500);
  };

  const handleGenerateAiAnalysis = async () => {
    setIsAiLoading(true);
    setActiveTab('ai-analysis');
    try {
      const response = await fetch('/api/ai/explain', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          calculatorTitle: calculator.title,
          category: calculator.categoryName,
          geo: geo.name,
          inputs,
          result,
        }),
      });
      const data = await response.json();
      setAiAnalysis(data.explanation || data.analysis || 'Analysis generated.');
    } catch (err) {
      setAiAnalysis(
        `Based on the ${calculator.title} outputs of ${result.primaryValue} in ${geo.name}, key considerations include maintaining consistent contributions, monitoring inflation risk, and assessing your horizon before making capital commitments.`
      );
    } finally {
      setIsAiLoading(false);
    }
  };

  const handleAskCustomAi = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!userAiQuery.trim()) return;
    setIsAiLoading(true);
    try {
      const response = await fetch('/api/ai/planner', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          goal: userAiQuery,
          currentStats: { ...inputs, result: result.primaryValue, region: geo.name },
        }),
      });
      const data = await response.json();
      setAiChatResponse(data.plan || 'Plan generated successfully.');
    } catch (err) {
      setAiChatResponse(
        `Recommendation for "${userAiQuery}": With current inputs (${result.primaryValue}), optimize by reviewing variable rates, prioritizing higher-yield debt liquidation, and maintaining a diversified reserve fund under ${geo.taxAuthority} guidelines.`
      );
    } finally {
      setIsAiLoading(false);
    }
  };

  return (
    <div className="mx-auto max-w-5xl space-y-8 pb-20">
      {/* Top Navigation & Geo Localization Bar */}
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-200 pb-4">
        {/* Semantic Crawlable Breadcrumbs */}
        <nav aria-label="Breadcrumb" className="flex items-center gap-1.5 text-xs text-slate-500 font-medium">
          <Link href="/" className="flex items-center gap-1 hover:text-slate-900 transition">
            <ArrowLeft className="h-3.5 w-3.5" />
            <span>Home</span>
          </Link>
          <ChevronRight className="h-3 w-3 text-slate-300" />
          <Link
            href={`/category/${calculator.category}/`}
            className="hover:text-slate-900 transition"
          >
            {calculator.categoryName}
          </Link>
          <ChevronRight className="h-3 w-3 text-slate-300" />
          <span className="text-slate-900 font-semibold truncate max-w-[200px] sm:max-w-none">
            {calculator.title}
          </span>
        </nav>

        {/* Geo-Region Switcher (GEO Localization) */}
        <div className="flex items-center gap-2">
          <div className="hidden sm:flex items-center gap-1 text-[11px] font-bold text-slate-500 uppercase tracking-wider">
            <Globe className="h-3.5 w-3.5 text-orange-500" />
            <span>Region:</span>
          </div>
          <div className="flex rounded-xl border border-slate-200 bg-white p-0.5 shadow-2xs">
            {Object.values(GEO_REGIONS).map((r) => (
              <button
                key={r.code}
                onClick={() => setSelectedGeo(r.code)}
                title={`${r.name} (${r.currencyCode})`}
                className={`flex items-center gap-1 rounded-lg px-2 py-1 text-xs font-semibold transition cursor-pointer ${
                  selectedGeo === r.code
                    ? 'bg-slate-900 text-white shadow-xs'
                    : 'text-slate-600 hover:bg-slate-100'
                }`}
              >
                <span>{r.flag}</span>
                <span className="hidden md:inline">{r.code}</span>
              </button>
            ))}
          </div>

          {/* Technical SEO Inspector Trigger */}
          <button
            onClick={() => setIsSeoModalOpen(true)}
            className="flex items-center gap-1 rounded-xl border border-slate-200 bg-slate-50 px-2.5 py-1 text-xs font-semibold text-slate-700 hover:bg-slate-100 hover:border-slate-300 transition cursor-pointer shadow-2xs"
            title="Inspect Schema.org JSON-LD & Technical SEO"
          >
            <Code2 className="h-3.5 w-3.5 text-orange-600" />
            <span className="hidden sm:inline">SEO & Schema</span>
          </button>
        </div>
      </div>

      {/* Main Header & Actions */}
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold uppercase tracking-wider text-orange-600">
              {calculator.categoryName}
            </span>
            {calculator.badge && (
              <span className="rounded-full bg-orange-100 px-2 py-0.5 text-[10px] font-bold text-orange-700 border border-orange-200">
                {calculator.badge}
              </span>
            )}
            <span className="rounded-full bg-slate-100 px-2 py-0.5 text-[10px] font-bold text-slate-600 border border-slate-200">
              {geo.flag} {geo.currencyCode}
            </span>
          </div>
          <h1 className="mt-1 text-2xl font-black tracking-tight text-slate-900 sm:text-3xl">
            {calculator.title}
          </h1>
          <p className="mt-1 text-xs text-slate-500 max-w-2xl leading-relaxed">
            {calculator.description}
          </p>
        </div>

        {/* Action Controls */}
        <div className="flex flex-wrap items-center gap-2">
          <button
            onClick={handleCopy}
            className="flex items-center gap-1.5 rounded-xl border border-slate-200 bg-white px-3 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-50 transition cursor-pointer shadow-2xs"
          >
            {copied ? <Check className="h-3.5 w-3.5 text-emerald-600" /> : <Copy className="h-3.5 w-3.5 text-slate-500" />}
            <span>{copied ? 'Copied' : 'Copy'}</span>
          </button>

          <button
            onClick={handleSave}
            className="flex items-center gap-1.5 rounded-xl border border-slate-200 bg-white px-3 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-50 transition cursor-pointer shadow-2xs"
          >
            <Bookmark className={`h-3.5 w-3.5 ${saved ? 'text-orange-600 fill-orange-600' : 'text-slate-500'}`} />
            <span>{saved ? 'Saved!' : 'Save'}</span>
          </button>

          <button
            onClick={handleReset}
            className="flex items-center gap-1.5 rounded-xl border border-slate-200 bg-white px-3 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-50 transition cursor-pointer shadow-2xs"
          >
            <RotateCcw className="h-3.5 w-3.5 text-slate-500" />
            <span>Reset</span>
          </button>

          <button
            onClick={handleGenerateAiAnalysis}
            className="flex items-center gap-1.5 rounded-xl bg-purple-600 px-3.5 py-2 text-xs font-bold text-white hover:bg-purple-500 transition cursor-pointer shadow-xs"
          >
            <Sparkles className="h-3.5 w-3.5 text-purple-200" />
            <span>AI Insight</span>
          </button>
        </div>
      </div>

      {/* Calculator Mode Switcher */}
      <div className="flex rounded-xl border border-slate-200 bg-slate-100/80 p-1 text-xs font-semibold">
        <button
          onClick={() => setActiveTab('calculator')}
          className={`flex-1 flex items-center justify-center gap-2 rounded-lg py-2 transition cursor-pointer ${
            activeTab === 'calculator'
              ? 'bg-white text-slate-900 shadow-xs'
              : 'text-slate-500 hover:text-slate-900'
          }`}
        >
          <Sliders className="h-3.5 w-3.5 text-orange-500" />
          <span>Interactive Calculator Engine</span>
        </button>
        <button
          onClick={() => setActiveTab('ai-analysis')}
          className={`flex-1 flex items-center justify-center gap-2 rounded-lg py-2 transition cursor-pointer ${
            activeTab === 'ai-analysis'
              ? 'bg-white text-purple-700 shadow-xs'
              : 'text-slate-500 hover:text-slate-900'
          }`}
        >
          <Sparkles className="h-3.5 w-3.5 text-purple-600" />
          <span>AI Scenario Analysis</span>
        </button>
      </div>

      {/* CALCULATOR INTERFACE */}
      {activeTab === 'calculator' ? (
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-12">
          {/* Left Column: Input Form (6 cols) */}
          <div className="rounded-2xl border border-slate-200 bg-white p-5 lg:col-span-6 shadow-xs space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-700">
                Input Parameters
              </span>
              <span className="text-[11px] font-medium text-slate-400">
                Currency: {geo.currencySymbol} ({geo.currencyCode})
              </span>
            </div>

            <div className="space-y-4">
              {calculator.inputFields.map((field) => {
                const val = inputs[field.name];
                return (
                  <div key={field.name} className="space-y-1.5">
                    <div className="flex items-center justify-between text-xs">
                      <label className="font-semibold text-slate-700">
                        {field.label}
                      </label>
                      <span className="font-mono text-slate-500">
                        {field.type === 'select'
                          ? val
                          : `${val ?? ''} ${field.unit || ''}`}
                      </span>
                    </div>

                    {field.type === 'select' ? (
                      <select
                        value={val}
                        onChange={(e) => handleInputChange(field.name, e.target.value)}
                        className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-xs font-medium text-slate-800 focus:bg-white focus:border-orange-500 focus:outline-none focus:ring-1 focus:ring-orange-500"
                      >
                        {field.options?.map((opt) => (
                          <option key={opt.value} value={opt.value}>
                            {opt.label}
                          </option>
                        ))}
                      </select>
                    ) : (
                      <div className="space-y-1">
                        <input
                          type={field.type}
                          min={field.min}
                          max={field.max}
                          step={field.step || 1}
                          value={val ?? ''}
                          onChange={(e) =>
                            handleInputChange(
                              field.name,
                              field.type === 'number' ? Number(e.target.value) : e.target.value
                            )
                          }
                          className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-xs font-medium text-slate-900 focus:bg-white focus:border-orange-500 focus:outline-none focus:ring-1 focus:ring-orange-500"
                        />
                        {field.min !== undefined && field.max !== undefined && (
                          <input
                            type="range"
                            min={field.min}
                            max={field.max}
                            step={field.step || 1}
                            value={val ?? field.min}
                            onChange={(e) =>
                              handleInputChange(field.name, Number(e.target.value))
                            }
                            className="h-1 w-full appearance-none rounded-lg bg-slate-200 accent-orange-600 cursor-pointer"
                          />
                        )}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>

          {/* Right Column: Computed Outputs & Visual Metric Cards (6 cols) */}
          <div className="space-y-4 lg:col-span-6">
            {/* Primary Hero Result Box */}
            <div className="rounded-2xl border border-orange-200 bg-gradient-to-br from-orange-500 to-amber-600 p-6 text-white shadow-md">
              <div className="text-xs font-bold uppercase tracking-wider text-orange-100">
                {result.primaryLabel}
              </div>
              <div className="mt-2 text-3xl font-black sm:text-4xl">
                {result.primaryValue}
              </div>
              {result.secondaryValue && (
                <div className="mt-1 text-xs text-orange-100">
                  {result.secondaryValue}
                </div>
              )}
            </div>

            {/* Metrics Breakdown Grid */}
            <div className="grid grid-cols-2 gap-3">
              {result.metrics.map((metric, idx) => (
                <div
                  key={idx}
                  className="rounded-xl border border-slate-200 bg-white p-3.5 shadow-2xs"
                >
                  <div className="text-[11px] font-medium text-slate-500">
                    {metric.label}
                  </div>
                  <div className="mt-1 text-base font-bold text-slate-900">
                    {metric.value}
                  </div>
                  {metric.change && (
                    <div className="mt-0.5 text-[10px] font-semibold text-emerald-600">
                      {metric.change}
                    </div>
                  )}
                </div>
              ))}
            </div>

            {/* Breakdown Bars / Summary */}
            {result.breakdown && result.breakdown.length > 0 && (
              <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-2xs space-y-3">
                <div className="text-xs font-bold text-slate-800 uppercase tracking-wider">
                  Composition Distribution
                </div>
                <div className="space-y-2">
                  {result.breakdown.map((item, idx) => (
                    <div key={idx} className="space-y-1">
                      <div className="flex justify-between text-xs font-medium text-slate-600">
                        <span>{item.label}</span>
                        <span className="font-bold text-slate-900">{item.value}</span>
                      </div>
                      {item.percentage !== undefined && (
                        <div className="h-2 w-full overflow-hidden rounded-full bg-slate-100">
                          <div
                            className="h-full rounded-full bg-orange-500 transition-all duration-300"
                            style={{ width: `${Math.min(100, Math.max(0, item.percentage))}%` }}
                          />
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      ) : (
        /* AI ANALYSIS TAB */
        <div className="rounded-2xl border border-purple-200 bg-white p-6 shadow-xs space-y-4">
          <div className="flex items-center justify-between border-b border-purple-100 pb-3">
            <div className="flex items-center gap-2 text-purple-900 font-bold text-sm">
              <Sparkles className="h-4 w-4 text-purple-600" />
              <span>Gemini Neural Strategic Advisor ({geo.name})</span>
            </div>
            <button
              onClick={handleGenerateAiAnalysis}
              disabled={isAiLoading}
              className="flex items-center gap-1.5 rounded-lg border border-purple-200 bg-purple-50 px-3 py-1.5 text-xs font-semibold text-purple-700 hover:bg-purple-100 transition cursor-pointer"
            >
              {isAiLoading ? (
                <Loader2 className="h-3.5 w-3.5 animate-spin" />
              ) : (
                <RotateCcw className="h-3.5 w-3.5" />
              )}
              <span>Regenerate</span>
            </button>
          </div>

          <div className="min-h-[140px] rounded-xl border border-slate-200 bg-slate-50 p-5 text-sm leading-relaxed text-slate-800">
            {isAiLoading ? (
              <div className="flex h-32 flex-col items-center justify-center gap-2 text-slate-500">
                <Loader2 className="h-6 w-6 animate-spin text-purple-600" />
                <span className="text-xs">Analyzing variables under {geo.name} mathematical conventions...</span>
              </div>
            ) : aiAnalysis ? (
              <div className="whitespace-pre-line">{aiAnalysis}</div>
            ) : (
              <div className="text-xs text-slate-500">
                Click "AI Insight" to request tailored optimization and sensitivity advice.
              </div>
            )}
          </div>

          {/* Ask Custom Scenario AI Box */}
          <form onSubmit={handleAskCustomAi} className="mt-4 space-y-2">
            <label className="text-xs font-bold uppercase tracking-wider text-slate-700">
              Ask AI about this calculation in {geo.name}:
            </label>
            <div className="flex gap-2">
              <input
                type="text"
                placeholder="e.g. How do interest adjustments impact this outcome over 10 years?"
                value={userAiQuery}
                onChange={(e) => setUserAiQuery(e.target.value)}
                className="flex-1 rounded-xl border border-slate-200 bg-slate-50 px-4 py-2 text-xs text-slate-900 placeholder-slate-400 focus:bg-white focus:border-purple-500 focus:outline-none focus:ring-1 focus:ring-purple-500"
              />
              <button
                type="submit"
                disabled={isAiLoading || !userAiQuery.trim()}
                className="flex items-center gap-1.5 rounded-xl bg-purple-600 px-4 py-2 text-xs font-semibold text-white hover:bg-purple-500 disabled:opacity-50 transition cursor-pointer"
              >
                <Send className="h-3.5 w-3.5" />
                <span>Ask</span>
              </button>
            </div>
          </form>

          {aiChatResponse && (
            <div className="mt-3 rounded-xl border border-purple-200 bg-purple-50 p-4 text-xs text-purple-900 leading-relaxed">
              <span className="font-bold text-purple-700 block mb-1">AI Recommendation:</span>
              {aiChatResponse}
            </div>
          )}
        </div>
      )}

      {/* YMYL REGULATORY & CONSUMER NOTICE */}
      {content.ymylDisclaimer && (
        <div className="flex items-start gap-3 rounded-2xl border border-amber-200 bg-amber-50 p-4 text-amber-900">
          <AlertTriangle className="h-5 w-5 shrink-0 text-amber-600 mt-0.5" />
          <div className="text-xs leading-relaxed">
            <span className="font-bold text-amber-800 uppercase tracking-wider block mb-0.5">
              Consumer & Regulatory Notice ({geo.name})
            </span>
            {content.ymylDisclaimer}
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* GEO & AEO DIRECT ANSWER SNIPPET (AI Overviews & Perplexity) */}
      {/* ========================================================================= */}
      <section className="rounded-2xl border border-purple-200 bg-gradient-to-br from-purple-50/70 via-slate-50 to-orange-50/40 p-5 sm:p-6 space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Sparkles className="h-4 w-4 text-purple-600" />
            <h2 className="text-xs font-bold uppercase tracking-wider text-purple-900">
              Direct Quick-Answer & Definition (AEO / AI Overview)
            </h2>
          </div>
          <button
            onClick={handleCopyCitation}
            className="flex items-center gap-1 rounded-lg border border-purple-200 bg-white px-2.5 py-1 text-[11px] font-semibold text-purple-700 hover:bg-purple-100 transition cursor-pointer shadow-2xs"
          >
            {copiedCitation ? <Check className="h-3 w-3 text-emerald-600" /> : <Copy className="h-3 w-3" />}
            <span>{copiedCitation ? 'Citation Copied' : 'Copy AI Citation'}</span>
          </button>
        </div>
        <p className="text-xs sm:text-sm text-slate-800 leading-relaxed font-medium">
          {content.directAnswer}
        </p>
      </section>

      {/* ========================================================================= */}
      {/* INSTITUTIONAL BENCHMARK MATRIX & DECISION RULES */}
      {/* ========================================================================= */}
      <section className="rounded-2xl border border-slate-200 bg-white p-5 sm:p-6 shadow-xs space-y-4">
        <div className="flex items-center justify-between border-b border-slate-100 pb-3">
          <div className="flex items-center gap-2">
            <Table className="h-4 w-4 text-orange-600" />
            <h2 className="text-sm font-bold text-slate-900">
              Institutional Decision Matrix & Industry Standard Benchmarks
            </h2>
          </div>
          <span className="text-[11px] font-semibold text-slate-400">
            Region: {geo.name}
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="border-b border-slate-200 bg-slate-50 text-slate-600 font-bold">
                <th className="py-2.5 px-3">Metric / Ratio</th>
                <th className="py-2.5 px-3">Recommended Target</th>
                <th className="py-2.5 px-3">Standard Guideline</th>
                <th className="py-2.5 px-3">Financial / Biometric Significance</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-slate-700">
              {content.keyBenchmarks.map((b, idx) => (
                <tr key={idx} className="hover:bg-slate-50/80 transition">
                  <td className="py-2.5 px-3 font-semibold text-slate-900">{b.metric}</td>
                  <td className="py-2.5 px-3 font-mono font-bold text-emerald-700">{b.recommended}</td>
                  <td className="py-2.5 px-3 text-slate-600">{b.industryStandard}</td>
                  <td className="py-2.5 px-3 text-slate-500">{b.significance}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      {/* ========================================================================= */}
      {/* FORMULA & VARIABLE GLOSSARY */}
      {/* ========================================================================= */}
      <section className="rounded-2xl border border-slate-200 bg-white p-5 sm:p-6 shadow-xs space-y-5">
        <div>
          <h2 className="text-sm font-bold text-slate-900">
            {content.formulaSection.title}
          </h2>
          <div className="mt-3 rounded-xl border border-slate-200 bg-slate-900 p-4 font-mono text-xs sm:text-sm text-emerald-400 overflow-x-auto shadow-inner">
            {content.formulaSection.formula}
          </div>
          <p className="mt-2 text-xs text-slate-600 leading-relaxed">
            {content.formulaSection.explanation}
          </p>
        </div>

        {/* Input Variable Glossary Table */}
        <div>
          <div className="text-xs font-bold uppercase tracking-wider text-slate-700 mb-2">
            Mathematical Variable Reference & Unit Glossary
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="border-b border-slate-200 bg-slate-50 text-slate-600 font-bold">
                  <th className="py-2 px-3">Symbol / Field</th>
                  <th className="py-2 px-3">Variable Name</th>
                  <th className="py-2 px-3">Unit</th>
                  <th className="py-2 px-3">Description</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-slate-700">
                {content.formulaSection.variables.map((v, idx) => (
                  <tr key={idx} className="hover:bg-slate-50/60">
                    <td className="py-2 px-3 font-mono font-bold text-orange-600">{v.symbol}</td>
                    <td className="py-2 px-3 font-semibold text-slate-900">{v.name}</td>
                    <td className="py-2 px-3 font-mono text-slate-500">{v.unit || '—'}</td>
                    <td className="py-2 px-3 text-slate-600">{v.description}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </section>

      {/* ========================================================================= */}
      {/* WORKED NUMERICAL EXAMPLE */}
      {/* ========================================================================= */}
      <section className="rounded-2xl border border-slate-200 bg-white p-5 sm:p-6 shadow-xs space-y-3">
        <h2 className="text-sm font-bold text-slate-900">{content.workedExample.title}</h2>
        <p className="text-xs text-slate-500 font-medium">{content.workedExample.scenario}</p>
        <div className="space-y-2 rounded-xl border border-slate-100 bg-slate-50 p-4 text-xs text-slate-700">
          {content.workedExample.stepByStep.map((step, idx) => (
            <div key={idx} className="flex items-start gap-2.5">
              <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-orange-600 text-[10px] font-bold text-white">
                {idx + 1}
              </span>
              <span className="mt-0.5 leading-relaxed">{step}</span>
            </div>
          ))}
        </div>
        <p className="text-xs text-slate-600 font-medium mt-2">
          {content.workedExample.conclusion}
        </p>
      </section>

      {/* ========================================================================= */}
      {/* AI PROMPT TEMPLATE (GEO Engine) */}
      {/* ========================================================================= */}
      <section className="rounded-2xl border border-purple-200 bg-purple-50/50 p-5 space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Sparkles className="h-4 w-4 text-purple-600" />
            <h3 className="text-xs font-bold uppercase tracking-wider text-purple-900">
              Copy Prompt for ChatGPT, Claude, Perplexity & Gemini
            </h3>
          </div>
          <button
            onClick={handleCopyPrompt}
            className="flex items-center gap-1 rounded-lg border border-purple-300 bg-white px-2.5 py-1 text-xs font-semibold text-purple-700 hover:bg-purple-100 transition cursor-pointer shadow-2xs"
          >
            {copiedPrompt ? <Check className="h-3.5 w-3.5 text-emerald-600" /> : <Copy className="h-3.5 w-3.5" />}
            <span>{copiedPrompt ? 'Prompt Copied' : 'Copy Prompt'}</span>
          </button>
        </div>
        <pre className="rounded-xl border border-purple-200 bg-white p-3.5 font-mono text-xs text-slate-700 whitespace-pre-wrap">
          {content.aiPromptTemplate}
        </pre>
      </section>

      {/* ========================================================================= */}
      {/* RELATED CALCULATORS (Internal Link Graph for Crawlers) */}
      {/* ========================================================================= */}
      {relatedCalcs.length > 0 && (
        <section className="rounded-2xl border border-slate-200 bg-white p-5 sm:p-6 shadow-xs space-y-4">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <div className="flex items-center gap-2">
              <Layers className="h-4 w-4 text-orange-600" />
              <h2 className="text-sm font-bold text-slate-900">
                Related {calculator.categoryName} Calculators
              </h2>
            </div>
            <Link
              href={`/category/${calculator.category}/`}
              className="text-xs font-semibold text-orange-600 hover:text-orange-700 transition"
            >
              View All {calculator.categoryName} →
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
            {relatedCalcs.map((rel) => (
              <Link
                key={rel.id}
                href={`/calculators/${rel.id}/`}
                onClick={() => onSelectCalculator?.(rel.id)}
                className="group flex flex-col justify-between rounded-xl border border-slate-200/80 bg-slate-50/50 p-3.5 transition-all hover:bg-white hover:shadow-md hover:border-orange-300"
              >
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <div
                      className={`flex h-8 w-8 items-center justify-center rounded-lg font-bold text-white text-xs ${rel.color}`}
                    >
                      {rel.letter}
                    </div>
                    {rel.badge && (
                      <span className="rounded-full bg-orange-100 px-1.5 py-0.5 text-[9px] font-bold text-orange-700">
                        {rel.badge}
                      </span>
                    )}
                  </div>
                  <h3 className="text-xs font-bold text-slate-900 group-hover:text-orange-600 transition-colors line-clamp-1">
                    {rel.title}
                  </h3>
                  <p className="mt-1 line-clamp-2 text-[11px] text-slate-500 leading-relaxed">
                    {rel.description}
                  </p>
                </div>
                <div className="mt-3 flex items-center justify-between border-t border-slate-200/60 pt-2 text-[10px] text-slate-400">
                  <span>{rel.categoryName}</span>
                  <span className="font-semibold text-orange-600 flex items-center gap-0.5 group-hover:translate-x-0.5 transition-transform">
                    Calculate <ArrowUpRight className="h-3 w-3" />
                  </span>
                </div>
              </Link>
            ))}
          </div>
        </section>
      )}

      {/* ========================================================================= */}
      {/* FREQUENTLY ASKED QUESTIONS (FAQPage Schema Compliant) */}
      {/* ========================================================================= */}
      <section className="rounded-2xl border border-slate-200 bg-white p-5 sm:p-6 shadow-xs space-y-4">
        <div className="flex items-center gap-2 border-b border-slate-100 pb-3">
          <HelpCircle className="h-4 w-4 text-orange-600" />
          <h2 className="text-sm font-bold text-slate-900">
            Frequently Asked Questions ({calculator.title})
          </h2>
        </div>
        <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
          {content.faqs.map((faq, idx) => (
            <div
              key={idx}
              className="rounded-xl border border-slate-200 bg-slate-50/60 p-4 transition hover:bg-slate-50"
            >
              <h3 className="text-xs font-bold text-slate-900 flex items-center gap-1.5">
                <span className="text-orange-600 font-bold">Q.</span>
                <span>{faq.question}</span>
              </h3>
              <p className="mt-2 text-xs text-slate-600 leading-relaxed">
                {faq.answer}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* SEO & Schema Inspector Modal */}
      <SeoInspectorModal
        isOpen={isSeoModalOpen}
        onClose={() => setIsSeoModalOpen(false)}
        calculator={calculator}
        currentGeoCode={selectedGeo}
      />
    </div>
  );
};
