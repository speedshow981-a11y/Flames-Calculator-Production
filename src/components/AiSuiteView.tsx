import React from 'react';
import { Sparkles, ArrowRight, Brain, Target, ShieldCheck, Zap } from 'lucide-react';
import { AI_CALCULATORS } from '../lib/data/ai-calcs';
import { Link } from '../lib/router';

interface AiSuiteViewProps {
  onSelectCalculator?: (id: string) => void;
}

export const AiSuiteView: React.FC<AiSuiteViewProps> = ({ onSelectCalculator }) => {
  return (
    <div className="mx-auto max-w-6xl space-y-10 pb-16">
      {/* Hero Banner */}
      <div className="relative overflow-hidden rounded-3xl bg-slate-900 text-white p-8 sm:p-10 shadow-lg border border-slate-800">
        <div className="relative z-10 max-w-2xl space-y-4">
          <div className="inline-flex items-center gap-2 rounded-full border border-purple-500/40 bg-purple-950/60 px-3.5 py-1 text-xs font-bold uppercase tracking-wider text-purple-300">
            <Sparkles className="h-3.5 w-3.5 text-amber-300" />
            <span>Next-Generation Neural Math</span>
          </div>

          <h1 className="text-3xl font-extrabold tracking-tight text-white sm:text-4xl">
            Flames AI Calculator Suite
          </h1>

          <p className="text-sm leading-relaxed text-slate-300 sm:text-base font-normal">
            Harness the power of the Google Gemini AI engine combined with precision mathematical modeling to solve multi-variable financial scenarios, optimize longevity, and accelerate debt elimination.
          </p>
        </div>
      </div>

      {/* 5 AI Tools Showcase Grid */}
      <div className="space-y-4">
        <div className="flex items-center justify-between border-b border-slate-200 pb-3">
          <div>
            <h2 className="text-xs font-bold text-slate-400 uppercase tracking-[0.2em]">
              AI Neural Models
            </h2>
            <p className="text-xs text-slate-500 mt-0.5">
              5 Dedicated Gemini-Powered Scenario Engines
            </p>
          </div>
          <span className="rounded bg-purple-100 px-2.5 py-1 text-xs font-bold text-purple-700 border border-purple-200">
            Production Ready
          </span>
        </div>

        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
          {AI_CALCULATORS.map((tool) => (
            <Link
              key={tool.id}
              href={`/calculators/${tool.id}/`}
              onClick={() => onSelectCalculator?.(tool.id)}
              className="group relative flex flex-col justify-between rounded-2xl border border-slate-800 bg-slate-900 p-6 shadow-md transition-all duration-200 hover:-translate-y-1 hover:border-purple-500/60 hover:shadow-xl text-white block"
            >
              <div>
                <div className="flex items-center justify-between">
                  <div
                    className={`flex h-12 w-12 items-center justify-center rounded-xl text-lg font-bold text-white shadow-xs ${tool.color}`}
                  >
                    <Sparkles className="h-6 w-6 text-amber-200" />
                  </div>
                  <span className="rounded border border-purple-500/40 bg-purple-500/20 px-2.5 py-0.5 text-[11px] font-bold text-purple-300 uppercase tracking-wider">
                    AI PRO
                  </span>
                </div>

                <h3 className="mt-4 text-lg font-bold text-white group-hover:text-purple-300 transition-colors">
                  {tool.title}
                </h3>

                <p className="mt-2 text-xs leading-relaxed text-slate-400 font-normal">
                  {tool.description}
                </p>
              </div>

              <div className="mt-6 flex items-center justify-between border-t border-slate-800 pt-4 text-xs font-semibold text-purple-400 group-hover:text-purple-300">
                <span>Launch AI Evaluation</span>
                <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
};
