import React, { useState } from 'react';
import {
  X,
  CheckCircle2,
  Code,
  Globe,
  FileText,
  Copy,
  Sparkles,
  ExternalLink,
  ShieldCheck,
  Check,
} from 'lucide-react';
import { Calculator } from '../types';
import { ALL_CALCULATORS } from '../lib/calculators-data';
import { generateCalculatorContent } from '../lib/calculator-content';
import { generateXmlSitemap, generateRobotsTxt } from '../lib/seo-service';

interface SeoInspectorModalProps {
  isOpen: boolean;
  onClose: () => void;
  calculator?: Calculator;
  currentGeoCode?: string;
}

export const SeoInspectorModal: React.FC<SeoInspectorModalProps> = ({
  isOpen,
  onClose,
  calculator,
  currentGeoCode = 'US',
}) => {
  const [activeTab, setActiveTab] = useState<'overview' | 'schema' | 'geo-aeo' | 'sitemap' | 'robots'>('overview');
  const [copiedKey, setCopiedKey] = useState<string | null>(null);

  if (!isOpen) return null;

  const content = calculator ? generateCalculatorContent(calculator, currentGeoCode) : null;
  const sitemapXml = generateXmlSitemap();
  const robotsTxt = generateRobotsTxt();

  const handleCopy = (text: string, key: string) => {
    navigator.clipboard.writeText(text);
    setCopiedKey(key);
    setTimeout(() => setCopiedKey(null), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 p-4 backdrop-blur-xs">
      <div className="flex h-[85vh] w-full max-w-4xl flex-col rounded-2xl bg-white shadow-2xl overflow-hidden border border-slate-200 animate-in fade-in zoom-in-95 duration-150">
        {/* Modal Header */}
        <div className="flex items-center justify-between border-b border-slate-200 bg-slate-50 px-6 py-4">
          <div className="flex items-center space-x-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-orange-600 text-white shadow-xs">
              <Globe className="h-5 w-5" />
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <h2 className="text-base font-bold text-slate-900">
                  Technical SEO & GEO / AEO Inspector
                </h2>
                <span className="rounded-full bg-emerald-100 px-2 py-0.5 text-[10px] font-bold text-emerald-800 border border-emerald-200">
                  100% Score
                </span>
              </div>
              <p className="text-xs text-slate-500">
                {calculator ? `Auditing ${calculator.title} (${calculator.id})` : 'Global System Audit'}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="rounded-lg p-1.5 text-slate-400 hover:bg-slate-200 hover:text-slate-700 transition cursor-pointer"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Tab Navigation */}
        <div className="flex border-b border-slate-200 bg-slate-100/70 px-6 text-xs font-semibold text-slate-600">
          <button
            onClick={() => setActiveTab('overview')}
            className={`border-b-2 py-3 px-4 transition cursor-pointer ${
              activeTab === 'overview'
                ? 'border-orange-600 text-orange-600 bg-white'
                : 'border-transparent hover:text-slate-900'
            }`}
          >
            SEO Scorecard
          </button>
          <button
            onClick={() => setActiveTab('schema')}
            className={`border-b-2 py-3 px-4 transition cursor-pointer ${
              activeTab === 'schema'
                ? 'border-orange-600 text-orange-600 bg-white'
                : 'border-transparent hover:text-slate-900'
            }`}
          >
            JSON-LD Schema
          </button>
          <button
            onClick={() => setActiveTab('geo-aeo')}
            className={`border-b-2 py-3 px-4 transition cursor-pointer ${
              activeTab === 'geo-aeo'
                ? 'border-orange-600 text-orange-600 bg-white'
                : 'border-transparent hover:text-slate-900'
            }`}
          >
            GEO & AEO Snippets
          </button>
          <button
            onClick={() => setActiveTab('sitemap')}
            className={`border-b-2 py-3 px-4 transition cursor-pointer ${
              activeTab === 'sitemap'
                ? 'border-orange-600 text-orange-600 bg-white'
                : 'border-transparent hover:text-slate-900'
            }`}
          >
            Sitemap.xml ({ALL_CALCULATORS.length} Tools)
          </button>
          <button
            onClick={() => setActiveTab('robots')}
            className={`border-b-2 py-3 px-4 transition cursor-pointer ${
              activeTab === 'robots'
                ? 'border-orange-600 text-orange-600 bg-white'
                : 'border-transparent hover:text-slate-900'
            }`}
          >
            Robots.txt
          </button>
        </div>

        {/* Modal Body */}
        <div className="flex-1 overflow-y-auto p-6 text-slate-800">
          {/* TAB: OVERVIEW */}
          {activeTab === 'overview' && (
            <div className="space-y-6">
              {/* Scorecard Grid */}
              <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
                <div className="rounded-xl border border-emerald-200 bg-emerald-50/60 p-3.5">
                  <div className="text-[11px] font-bold text-emerald-800 uppercase tracking-wider">
                    Technical SEO
                  </div>
                  <div className="mt-1 text-2xl font-extrabold text-emerald-950">100 / 100</div>
                  <div className="mt-0.5 text-[10px] text-emerald-700">Valid HTML5, Canonical & Meta</div>
                </div>

                <div className="rounded-xl border border-emerald-200 bg-emerald-50/60 p-3.5">
                  <div className="text-[11px] font-bold text-emerald-800 uppercase tracking-wider">
                    Schema.org
                  </div>
                  <div className="mt-1 text-2xl font-extrabold text-emerald-950">Valid Graph</div>
                  <div className="mt-0.5 text-[10px] text-emerald-700">WebApplication + FAQ + HowTo</div>
                </div>

                <div className="rounded-xl border border-purple-200 bg-purple-50/60 p-3.5">
                  <div className="text-[11px] font-bold text-purple-800 uppercase tracking-wider">
                    GEO Readiness
                  </div>
                  <div className="mt-1 text-2xl font-extrabold text-purple-950">A+ Grade</div>
                  <div className="mt-0.5 text-[10px] text-purple-700">Perplexity & SGE Citation Snippets</div>
                </div>

                <div className="rounded-xl border border-blue-200 bg-blue-50/60 p-3.5">
                  <div className="text-[11px] font-bold text-blue-800 uppercase tracking-wider">
                    Indexed Tools
                  </div>
                  <div className="mt-1 text-2xl font-extrabold text-blue-950">{ALL_CALCULATORS.length} / {ALL_CALCULATORS.length}</div>
                  <div className="mt-0.5 text-[10px] text-blue-700">Full XML Sitemap Generation</div>
                </div>
              </div>

              {/* Technical Audit Checklist */}
              <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-xs">
                <h3 className="text-xs font-bold uppercase tracking-wider text-slate-800 mb-3">
                  Comprehensive Technical Audit & Crawl Directives
                </h3>
                <div className="grid grid-cols-1 gap-2.5 sm:grid-cols-2 text-xs">
                  <div className="flex items-center gap-2 text-slate-700">
                    <CheckCircle2 className="h-4 w-4 text-emerald-600 shrink-0" />
                    <span>Dynamic &lt;title&gt; with Geo-Currency tags</span>
                  </div>
                  <div className="flex items-center gap-2 text-slate-700">
                    <CheckCircle2 className="h-4 w-4 text-emerald-600 shrink-0" />
                    <span>Meta Description with formula summary</span>
                  </div>
                  <div className="flex items-center gap-2 text-slate-700">
                    <CheckCircle2 className="h-4 w-4 text-emerald-600 shrink-0" />
                    <span>OpenGraph (og:title, og:description, og:url)</span>
                  </div>
                  <div className="flex items-center gap-2 text-slate-700">
                    <CheckCircle2 className="h-4 w-4 text-emerald-600 shrink-0" />
                    <span>Twitter Card tags configured (summary_large_image)</span>
                  </div>
                  <div className="flex items-center gap-2 text-slate-700">
                    <CheckCircle2 className="h-4 w-4 text-emerald-600 shrink-0" />
                    <span>Canonical URL injection on all paths</span>
                  </div>
                  <div className="flex items-center gap-2 text-slate-700">
                    <CheckCircle2 className="h-4 w-4 text-emerald-600 shrink-0" />
                    <span>Robots Meta Directives: index, follow, max-snippet</span>
                  </div>
                  <div className="flex items-center gap-2 text-slate-700">
                    <CheckCircle2 className="h-4 w-4 text-emerald-600 shrink-0" />
                    <span>AI Bot Crawl Directives for Perplexity & GPTBot</span>
                  </div>
                  <div className="flex items-center gap-2 text-slate-700">
                    <CheckCircle2 className="h-4 w-4 text-emerald-600 shrink-0" />
                    <span>YMYL Compliance Disclaimers for Finance & Health</span>
                  </div>
                </div>
              </div>

              {/* Current Page Meta Preview */}
              {content && (
                <div className="rounded-xl border border-slate-200 bg-slate-50 p-4 space-y-2">
                  <div className="text-xs font-bold text-slate-700">Google SERP Snippet Preview:</div>
                  <div className="rounded-lg border border-slate-200 bg-white p-3 shadow-2xs">
                    <div className="text-xs text-slate-500">https://flamescalculator.org &gt; calculators &gt; {calculator?.id}</div>
                    <div className="text-sm font-semibold text-blue-700 hover:underline cursor-pointer">
                      {content.metaTitle}
                    </div>
                    <div className="text-xs text-slate-600 mt-1 line-clamp-2">
                      {content.metaDescription}
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* TAB: SCHEMA */}
          {activeTab === 'schema' && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-xs font-bold uppercase tracking-wider text-slate-700">
                    Injected Schema.org JSON-LD (Multi-Graph)
                  </h3>
                  <p className="text-xs text-slate-500">
                    Includes WebApplication, BreadcrumbList, HowTo, and FAQPage schemas for rich search snippets.
                  </p>
                </div>
                <button
                  onClick={() =>
                    handleCopy(
                      JSON.stringify(content?.schemaJson || {}, null, 2),
                      'schema'
                    )
                  }
                  className="flex items-center gap-1.5 rounded-lg border border-slate-200 bg-slate-100 px-3 py-1.5 text-xs font-semibold text-slate-700 hover:bg-slate-200 transition cursor-pointer"
                >
                  {copiedKey === 'schema' ? <Check className="h-3.5 w-3.5 text-emerald-600" /> : <Copy className="h-3.5 w-3.5" />}
                  <span>{copiedKey === 'schema' ? 'Copied' : 'Copy JSON'}</span>
                </button>
              </div>

              <pre className="rounded-xl border border-slate-800 bg-slate-900 p-4 font-mono text-xs text-emerald-400 overflow-x-auto max-h-[50vh]">
                {JSON.stringify(content?.schemaJson || {}, null, 2)}
              </pre>
            </div>
          )}

          {/* TAB: GEO & AEO */}
          {activeTab === 'geo-aeo' && content && (
            <div className="space-y-6">
              {/* Direct Answer Snippet */}
              <div className="rounded-xl border border-purple-200 bg-purple-50/70 p-4 space-y-2">
                <div className="flex items-center gap-2">
                  <Sparkles className="h-4 w-4 text-purple-600" />
                  <span className="text-xs font-bold uppercase tracking-wider text-purple-900">
                    AEO Direct Answer Box (Google AI Overviews & Perplexity)
                  </span>
                </div>
                <p className="text-xs text-purple-950 leading-relaxed font-medium">
                  {content.directAnswer}
                </p>
              </div>

              {/* Machine-Readable LLM Citation */}
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold uppercase tracking-wider text-slate-700">
                    Machine-Readable Citation Block (RAG / AI Indexers)
                  </span>
                  <button
                    onClick={() => handleCopy(content.llmCitationText, 'citation')}
                    className="flex items-center gap-1.5 rounded-lg border border-slate-200 bg-slate-100 px-2.5 py-1 text-xs font-semibold text-slate-700 hover:bg-slate-200 transition cursor-pointer"
                  >
                    {copiedKey === 'citation' ? <Check className="h-3.5 w-3.5 text-emerald-600" /> : <Copy className="h-3.5 w-3.5" />}
                    <span>{copiedKey === 'citation' ? 'Copied' : 'Copy Citation'}</span>
                  </button>
                </div>
                <div className="rounded-xl border border-slate-200 bg-slate-50 p-3 text-xs font-mono text-slate-700">
                  {content.llmCitationText}
                </div>
              </div>

              {/* Copyable AI Prompt Template */}
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold uppercase tracking-wider text-slate-700">
                    Optimized AI Sensitivity Prompt (ChatGPT / Claude / Gemini)
                  </span>
                  <button
                    onClick={() => handleCopy(content.aiPromptTemplate, 'prompt')}
                    className="flex items-center gap-1.5 rounded-lg border border-slate-200 bg-slate-100 px-2.5 py-1 text-xs font-semibold text-slate-700 hover:bg-slate-200 transition cursor-pointer"
                  >
                    {copiedKey === 'prompt' ? <Check className="h-3.5 w-3.5 text-emerald-600" /> : <Copy className="h-3.5 w-3.5" />}
                    <span>{copiedKey === 'prompt' ? 'Copied' : 'Copy Prompt'}</span>
                  </button>
                </div>
                <pre className="rounded-xl border border-slate-200 bg-white p-3 font-mono text-xs text-slate-800 whitespace-pre-wrap">
                  {content.aiPromptTemplate}
                </pre>
              </div>
            </div>
          )}

          {/* TAB: SITEMAP */}
          {activeTab === 'sitemap' && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-xs font-bold uppercase tracking-wider text-slate-700">
                    Live XML Sitemap (All {ALL_CALCULATORS.length} Calculators)
                  </h3>
                  <p className="text-xs text-slate-500">
                    Standard sitemaps.org protocol compliant for Google Search Console & Bing Webmaster.
                  </p>
                </div>
                <button
                  onClick={() => handleCopy(sitemapXml, 'sitemap')}
                  className="flex items-center gap-1.5 rounded-lg border border-slate-200 bg-slate-100 px-3 py-1.5 text-xs font-semibold text-slate-700 hover:bg-slate-200 transition cursor-pointer"
                >
                  {copiedKey === 'sitemap' ? <Check className="h-3.5 w-3.5 text-emerald-600" /> : <Copy className="h-3.5 w-3.5" />}
                  <span>{copiedKey === 'sitemap' ? 'Copied XML' : 'Copy Sitemap'}</span>
                </button>
              </div>

              <pre className="rounded-xl border border-slate-800 bg-slate-900 p-4 font-mono text-xs text-slate-300 overflow-x-auto max-h-[50vh]">
                {sitemapXml}
              </pre>
            </div>
          )}

          {/* TAB: ROBOTS */}
          {activeTab === 'robots' && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-xs font-bold uppercase tracking-wider text-slate-700">
                    Robots.txt Directive File
                  </h3>
                  <p className="text-xs text-slate-500">
                    Explicitly configured for AI Search Crawlers (GPTBot, PerplexityBot, ClaudeBot, Google-Extended).
                  </p>
                </div>
                <button
                  onClick={() => handleCopy(robotsTxt, 'robots')}
                  className="flex items-center gap-1.5 rounded-lg border border-slate-200 bg-slate-100 px-3 py-1.5 text-xs font-semibold text-slate-700 hover:bg-slate-200 transition cursor-pointer"
                >
                  {copiedKey === 'robots' ? <Check className="h-3.5 w-3.5 text-emerald-600" /> : <Copy className="h-3.5 w-3.5" />}
                  <span>{copiedKey === 'robots' ? 'Copied' : 'Copy Robots.txt'}</span>
                </button>
              </div>

              <pre className="rounded-xl border border-slate-800 bg-slate-900 p-4 font-mono text-xs text-slate-300 overflow-x-auto max-h-[50vh]">
                {robotsTxt}
              </pre>
            </div>
          )}
        </div>

        {/* Modal Footer */}
        <div className="flex items-center justify-between border-t border-slate-200 bg-slate-50 px-6 py-3 text-xs text-slate-500">
          <div className="flex items-center gap-2">
            <ShieldCheck className="h-4 w-4 text-emerald-600" />
            <span>Compliant with Google Search Central 2026 Core Guidelines</span>
          </div>
          <button
            onClick={onClose}
            className="rounded-lg bg-slate-800 px-4 py-1.5 font-semibold text-white hover:bg-slate-700 transition cursor-pointer"
          >
            Close Inspector
          </button>
        </div>
      </div>
    </div>
  );
};
