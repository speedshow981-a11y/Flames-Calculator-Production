import React, { useState, useMemo } from 'react';
import {
  Flame,
  Sparkles,
  RotateCcw,
  Copy,
  Check,
  ArrowRight,
  HelpCircle,
  BookOpen,
  Shuffle,
  Zap,
  ChevronDown,
  ChevronUp,
  Landmark,
  HeartPulse,
  Binary,
  Sliders,
  Search,
} from 'lucide-react';
import { getCalculatorById } from '../lib/calculators-data';
import { Link } from '../lib/router';

interface HeroSectionProps {
  onOpenSearch?: () => void;
  onSelectCalculator?: (calcId: string) => void;
  onSelectCategory?: (categoryId: string) => void;
}

// FLAMES Outcome Definitions
interface FlamesOutcome {
  letter: 'F' | 'L' | 'A' | 'M' | 'E' | 'S';
  name: string;
  emoji: string;
  tagline: string;
  compatibilityScore: number;
  bgGradient: string;
  textColor: string;
  borderColor: string;
  badgeBg: string;
  description: string;
  strengths: string[];
  quote: string;
}

const FLAMES_DATA: Record<string, FlamesOutcome> = {
  F: {
    letter: 'F',
    name: 'Friends',
    emoji: '🤝',
    tagline: 'Comrades for Life & Unbreakable Trust',
    compatibilityScore: 88,
    bgGradient: 'from-emerald-500/20 via-teal-500/10 to-transparent',
    textColor: 'text-emerald-400',
    borderColor: 'border-emerald-500/40',
    badgeBg: 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30',
    description:
      'Your bond is anchored in mutual respect, shared humor, and effortless honesty. You make exceptional confidants who lift each other up without pretense.',
    strengths: ['Total transparency with zero judgment', 'Instant comfort and natural laughter', 'Dependable support during tough times'],
    quote: '"A real friend is one who walks in when the rest of the world walks out."',
  },
  L: {
    letter: 'L',
    name: 'Love',
    emoji: '❤️',
    tagline: 'Deep Romance & Soulful Chemistry',
    compatibilityScore: 96,
    bgGradient: 'from-rose-500/25 via-pink-500/15 to-transparent',
    textColor: 'text-rose-400',
    borderColor: 'border-rose-500/40',
    badgeBg: 'bg-rose-500/20 text-rose-300 border-rose-500/30',
    description:
      'A powerful romantic attraction with deep emotional resonance. Your energies interlock with natural magnetism, creating passionate spark and heart-to-heart harmony.',
    strengths: ['Intense emotional and physical magnetism', 'Intuitive understanding of each other', 'Inspiring creative and personal growth'],
    quote: '"Whatever our souls are made of, his and mine are the same."',
  },
  A: {
    letter: 'A',
    name: 'Affection',
    emoji: '🥰',
    tagline: 'Sweet Tenderness & Warm Chemistry',
    compatibilityScore: 89,
    bgGradient: 'from-purple-500/25 via-fuchsia-500/15 to-transparent',
    textColor: 'text-purple-400',
    borderColor: 'border-purple-500/40',
    badgeBg: 'bg-purple-500/20 text-purple-300 border-purple-500/30',
    description:
      'Your connection radiates warmth, gentle care, and heartfelt tenderness. You genuinely care for each other’s well-being and find comfort in each other’s presence.',
    strengths: ['Gentle empathy and attentive listening', 'Deep protective instincts and kindness', 'Peaceful, drama-free companionship'],
    quote: '"Affection is responsible for nine-tenths of whatever solid happiness there is in our lives."',
  },
  M: {
    letter: 'M',
    name: 'Marriage',
    emoji: '💍',
    tagline: 'Lifelong Union & Harmonious Destiny',
    compatibilityScore: 99,
    bgGradient: 'from-amber-500/25 via-orange-500/15 to-transparent',
    textColor: 'text-amber-400',
    borderColor: 'border-amber-500/40',
    badgeBg: 'bg-amber-500/20 text-amber-300 border-amber-500/30',
    description:
      'The ultimate astrological and numerological alignment! Your life philosophies, values, and temperaments complement each other perfectly for a lasting matrimonial partnership.',
    strengths: ['Aligned long-term dreams and principles', 'Rock-solid loyalty and mutual devotion', 'Complementary strengths that balance weaknesses'],
    quote: '"A great marriage is an imperfect couple learning to enjoy their differences."',
  },
  E: {
    letter: 'E',
    name: 'Enemy',
    emoji: '⚡',
    tagline: 'Spicy Rivals & Opposites Attract',
    compatibilityScore: 48,
    bgGradient: 'from-red-500/25 via-orange-600/15 to-transparent',
    textColor: 'text-red-400',
    borderColor: 'border-red-500/40',
    badgeBg: 'bg-red-500/20 text-red-300 border-red-500/30',
    description:
      'High-voltage clash of wills! You two have strong, distinct personalities that frequently spark debates with undeniable tension and magnetic curiosity.',
    strengths: ['Challenging each other to think outside the box', 'Zero boredom — always full of energetic banter', 'Catalyst for building personal patience'],
    quote: '"True strength lies in finding harmony beyond our differences."',
  },
  S: {
    letter: 'S',
    name: 'Siblings',
    emoji: '🛡️',
    tagline: 'Protective Kinship & Pure Loyalty',
    compatibilityScore: 82,
    bgGradient: 'from-sky-500/25 via-blue-500/15 to-transparent',
    textColor: 'text-sky-400',
    borderColor: 'border-sky-500/40',
    badgeBg: 'bg-sky-500/20 text-sky-300 border-sky-500/30',
    description:
      'A pure, wholesome, family-like kinship. You share playful teasing, unconditional protection, and the steadfast loyalty of blood relatives.',
    strengths: ['Unconditional support through thick and thin', 'Playful banter with zero awkwardness', 'Natural instinct to defend and look out for one another'],
    quote: '"At the end of the day, our kinship and loyalty are unconditional."',
  },
};

const FEATURED_QUICK_TOOLS = [
  'mortgage-calculator',
  'bmi-calculator',
  'compound-interest-calculator',
  'percentage-calculator',
  'age-calculator',
  'auto-loan-calculator',
  'ai-multi-goal-planner',
  'scientific-calculator',
];

export const HeroSection: React.FC<HeroSectionProps> = ({
  onOpenSearch,
  onSelectCalculator,
  onSelectCategory,
}) => {
  // Input states initialized strictly EMPTY (no sample names)
  const [name1, setName1] = useState<string>('');
  const [name2, setName2] = useState<string>('');
  const [hasCalculated, setHasCalculated] = useState<boolean>(false);
  const [copied, setCopied] = useState<boolean>(false);
  const [showFaqIndex, setShowFaqIndex] = useState<number | null>(null);

  // Compute FLAMES Algorithm
  const calculationResult = useMemo(() => {
    const clean1 = name1.toLowerCase().replace(/[^a-z]/g, '');
    const clean2 = name2.toLowerCase().replace(/[^a-z]/g, '');

    if (!clean1 || !clean2) {
      return null;
    }

    const arr1 = clean1.split('');
    const arr2 = clean2.split('');

    const matchedIndices1 = new Set<number>();
    const matchedIndices2 = new Set<number>();
    const commonLetters: string[] = [];

    for (let i = 0; i < arr1.length; i++) {
      for (let j = 0; j < arr2.length; j++) {
        if (!matchedIndices2.has(j) && arr1[i] === arr2[j]) {
          matchedIndices1.add(i);
          matchedIndices2.add(j);
          commonLetters.push(arr1[i]);
          break;
        }
      }
    }

    const remainingCount1 = arr1.length - matchedIndices1.size;
    const remainingCount2 = arr2.length - matchedIndices2.size;
    const totalRemainingCount = remainingCount1 + remainingCount2;

    const letters: Array<'F' | 'L' | 'A' | 'M' | 'E' | 'S'> = ['F', 'L', 'A', 'M', 'E', 'S'];
    const eliminationSteps: { letter: string; removedAtStep: number; remainingArray: string[] }[] = [];

    let currentList = [...letters];
    let currentIndex = 0;

    if (totalRemainingCount === 0) {
      return {
        clean1,
        clean2,
        arr1,
        arr2,
        matchedIndices1,
        matchedIndices2,
        commonLetters,
        remainingCount1,
        remainingCount2,
        totalRemainingCount: 0,
        eliminationSteps: [],
        finalLetter: 'F' as const,
        outcome: FLAMES_DATA['F'],
      };
    }

    let stepNumber = 1;
    while (currentList.length > 1) {
      const removeIndex = (currentIndex + totalRemainingCount - 1) % currentList.length;
      const removedLetter = currentList[removeIndex];
      currentList.splice(removeIndex, 1);
      eliminationSteps.push({
        letter: removedLetter,
        removedAtStep: stepNumber,
        remainingArray: [...currentList],
      });
      currentIndex = removeIndex % (currentList.length || 1);
      stepNumber++;
    }

    const finalLetter = currentList[0];
    const outcome = FLAMES_DATA[finalLetter] || FLAMES_DATA['F'];

    return {
      clean1,
      clean2,
      arr1,
      arr2,
      matchedIndices1,
      matchedIndices2,
      commonLetters,
      remainingCount1,
      remainingCount2,
      totalRemainingCount,
      eliminationSteps,
      finalLetter,
      outcome,
    };
  }, [name1, name2]);

  const handleSwapNames = () => {
    const temp = name1;
    setName1(name2);
    setName2(temp);
  };

  const handleCopyResult = () => {
    if (!calculationResult) return;
    const text = `🔥 FLAMES Calculator Result 🔥\n👤 ${name1} + 👤 ${name2}\n💖 Result: ${calculationResult.outcome.emoji} ${calculationResult.outcome.name} (${calculationResult.outcome.tagline})\n📊 Compatibility Score: ${calculationResult.outcome.compatibilityScore}%\n✨ Calculated on Flames Calculator: https://flamescalculator.org`;
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  return (
    <div id="quick-start-hero-container" className="space-y-8 mb-4">
      {/* QUICK START: INTERACTIVE FLAMES CALCULATOR TOOL */}
      <div className="relative overflow-hidden rounded-3xl bg-slate-900 text-white border border-slate-800 shadow-2xl p-5 sm:p-8 lg:p-10">
        {/* Ambient Glows */}
        <div className="absolute top-0 right-0 -mr-20 -mt-20 h-96 w-96 rounded-full bg-orange-600/15 blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-0 -ml-20 -mb-20 h-96 w-96 rounded-full bg-rose-600/15 blur-3xl pointer-events-none" />

        <div className="relative z-10 space-y-7">
          {/* Header Title Bar */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800/80 pb-5">
            <div className="space-y-1.5">
              <div className="inline-flex items-center gap-2 rounded-full border border-orange-500/30 bg-orange-500/10 px-3.5 py-1 text-xs font-bold text-orange-400">
                <Flame className="h-3.5 w-3.5 fill-orange-400" />
                <span>Quick Start Tool • Relationship Destiny</span>
              </div>
              <h1 className="text-3xl font-black tracking-tight text-white sm:text-4xl lg:text-5xl">
                FLAMES <span className="text-transparent bg-clip-text bg-gradient-to-r from-orange-400 via-amber-300 to-rose-400">CALCULATOR</span>
              </h1>
              <p className="text-xs sm:text-sm text-slate-400 max-w-2xl font-normal leading-relaxed">
                Calculate relationship destiny, letter cancellation, modulo elimination, and compatibility between two names.
              </p>
            </div>

            {/* Fast Category Quick Jumps */}
            <div className="flex items-center gap-2 self-start sm:self-auto">
              <button
                onClick={onOpenSearch}
                className="flex items-center gap-2 rounded-xl border border-slate-700 bg-slate-800/80 px-3.5 py-2 text-xs text-slate-300 hover:border-orange-500/60 hover:text-white transition cursor-pointer"
              >
                <Search className="h-3.5 w-3.5 text-orange-400" />
                <span>Search 217+ Tools</span>
              </button>
            </div>
          </div>

          {/* Interactive Calculator Input & Solver Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8 items-start">
            {/* Left Inputs Column (5 Cols) */}
            <div className="lg:col-span-5 space-y-4 rounded-2xl border border-slate-800 bg-slate-800/60 p-5 backdrop-blur-xs">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold uppercase tracking-wider text-orange-400 flex items-center gap-1.5">
                  <Sparkles className="h-3.5 w-3.5" />
                  Enter Names
                </span>
                <button
                  onClick={handleSwapNames}
                  disabled={!name1 && !name2}
                  className="flex items-center gap-1 text-xs text-slate-400 hover:text-orange-400 transition cursor-pointer disabled:opacity-40"
                  title="Swap Names"
                >
                  <Shuffle className="h-3 w-3" />
                  <span>Swap</span>
                </button>
              </div>

              {/* Name 1 Input */}
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-slate-300 flex items-center justify-between">
                  <span>First Person Name</span>
                  <span className="text-[10px] text-slate-500 font-mono">
                    {name1.replace(/[^a-zA-Z]/g, '').length} letters
                  </span>
                </label>
                <div className="relative">
                  <input
                    type="text"
                    value={name1}
                    onChange={(e) => {
                      setName1(e.target.value);
                      setHasCalculated(true);
                    }}
                    placeholder="Enter first name..."
                    className="w-full rounded-xl border border-slate-700 bg-slate-900/90 py-3 pl-4 pr-10 text-sm font-semibold text-white placeholder-slate-500 focus:border-orange-500 focus:outline-none focus:ring-1 focus:ring-orange-500 shadow-inner"
                  />
                  {name1 && (
                    <button
                      onClick={() => setName1('')}
                      className="absolute right-3 top-3 text-xs text-slate-500 hover:text-slate-300"
                    >
                      ✕
                    </button>
                  )}
                </div>
              </div>

              {/* Swap Button Divider */}
              <div className="flex items-center justify-center -my-1.5 relative z-10">
                <button
                  onClick={handleSwapNames}
                  disabled={!name1 && !name2}
                  className="flex h-7 w-7 items-center justify-center rounded-full border border-slate-700 bg-slate-800 text-slate-400 hover:bg-orange-600 hover:text-white hover:border-orange-500 transition shadow-md cursor-pointer disabled:opacity-40"
                  title="Swap Names"
                >
                  <Shuffle className="h-3 w-3" />
                </button>
              </div>

              {/* Name 2 Input */}
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-slate-300 flex items-center justify-between">
                  <span>Second Person Name</span>
                  <span className="text-[10px] text-slate-500 font-mono">
                    {name2.replace(/[^a-zA-Z]/g, '').length} letters
                  </span>
                </label>
                <div className="relative">
                  <input
                    type="text"
                    value={name2}
                    onChange={(e) => {
                      setName2(e.target.value);
                      setHasCalculated(true);
                    }}
                    placeholder="Enter second name..."
                    className="w-full rounded-xl border border-slate-700 bg-slate-900/90 py-3 pl-4 pr-10 text-sm font-semibold text-white placeholder-slate-500 focus:border-orange-500 focus:outline-none focus:ring-1 focus:ring-orange-500 shadow-inner"
                  />
                  {name2 && (
                    <button
                      onClick={() => setName2('')}
                      className="absolute right-3 top-3 text-xs text-slate-500 hover:text-slate-300"
                    >
                      ✕
                    </button>
                  )}
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex gap-2 pt-1">
                <button
                  onClick={() => setHasCalculated(true)}
                  disabled={!name1.trim() || !name2.trim()}
                  className="flex-1 flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-orange-600 to-amber-600 py-3 px-4 text-xs font-bold text-white shadow-lg shadow-orange-600/30 hover:from-orange-500 hover:to-amber-500 active:scale-[0.98] transition cursor-pointer disabled:opacity-50"
                >
                  <Flame className="h-4 w-4 fill-white" />
                  <span>Calculate FLAMES</span>
                </button>

                <button
                  onClick={() => {
                    setName1('');
                    setName2('');
                  }}
                  className="rounded-xl border border-slate-700 bg-slate-900/80 px-3.5 py-3 text-xs font-medium text-slate-400 hover:text-white hover:border-slate-600 transition cursor-pointer"
                  title="Reset Inputs"
                >
                  <RotateCcw className="h-4 w-4" />
                </button>
              </div>

              {/* Quick Meaning Key */}
              <div className="border-t border-slate-700/60 pt-3 space-y-1.5">
                <div className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                  FLAMES Letters Key:
                </div>
                <div className="grid grid-cols-3 gap-1.5 text-center text-xs">
                  <div className="rounded-lg bg-emerald-950/40 border border-emerald-500/30 p-1.5 text-emerald-300">
                    <span className="font-black text-emerald-400">F</span> Friends
                  </div>
                  <div className="rounded-lg bg-rose-950/40 border border-rose-500/30 p-1.5 text-rose-300">
                    <span className="font-black text-rose-400">L</span> Love
                  </div>
                  <div className="rounded-lg bg-purple-950/40 border border-purple-500/30 p-1.5 text-purple-300">
                    <span className="font-black text-purple-400">A</span> Affection
                  </div>
                  <div className="rounded-lg bg-amber-950/40 border border-amber-500/30 p-1.5 text-amber-300">
                    <span className="font-black text-amber-400">M</span> Marriage
                  </div>
                  <div className="rounded-lg bg-red-950/40 border border-red-500/30 p-1.5 text-red-300">
                    <span className="font-black text-red-400">E</span> Enemy
                  </div>
                  <div className="rounded-lg bg-sky-950/40 border border-sky-500/30 p-1.5 text-sky-300">
                    <span className="font-black text-sky-400">S</span> Siblings
                  </div>
                </div>
              </div>
            </div>

            {/* Right Output & Analysis Column (7 Cols) */}
            <div className="lg:col-span-7 space-y-4">
              {calculationResult ? (
                <div
                  id="flames-result-card"
                  className={`rounded-2xl border ${calculationResult.outcome.borderColor} bg-gradient-to-br ${calculationResult.outcome.bgGradient} bg-slate-900/90 p-5 sm:p-6 shadow-2xl backdrop-blur-md space-y-5 animate-in fade-in zoom-in-95 duration-200`}
                >
                  {/* Result Header Badge */}
                  <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-800 pb-4">
                    <div className="flex items-center gap-3">
                      <div className="text-4xl">{calculationResult.outcome.emoji}</div>
                      <div>
                        <div className="text-xs font-bold uppercase tracking-wider text-slate-400">
                          Relationship Outcome
                        </div>
                        <div className={`text-2xl sm:text-3xl font-black ${calculationResult.outcome.textColor}`}>
                          {calculationResult.outcome.name}
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center gap-3">
                      <div className="text-right">
                        <div className="text-[10px] font-bold text-slate-400 uppercase">Flame Score</div>
                        <div className={`text-xl font-black ${calculationResult.outcome.textColor}`}>
                          {calculationResult.outcome.compatibilityScore}%
                        </div>
                      </div>
                      <button
                        onClick={handleCopyResult}
                        className="flex items-center gap-1.5 rounded-xl border border-slate-700 bg-slate-800/80 px-3 py-2 text-xs font-semibold text-slate-200 hover:bg-slate-700 hover:text-white transition cursor-pointer"
                        title="Copy Result Card"
                      >
                        {copied ? (
                          <>
                            <Check className="h-3.5 w-3.5 text-emerald-400" />
                            <span className="text-emerald-400 font-bold">Copied!</span>
                          </>
                        ) : (
                          <>
                            <Copy className="h-3.5 w-3.5" />
                            <span>Share</span>
                          </>
                        )}
                      </button>
                    </div>
                  </div>

                  {/* Compatibility Progress Meter */}
                  <div className="space-y-1.5">
                    <div className="flex justify-between text-xs font-medium text-slate-300">
                      <span>Attraction & Compatibility</span>
                      <span className="font-bold">{calculationResult.outcome.tagline}</span>
                    </div>
                    <div className="h-2.5 w-full overflow-hidden rounded-full bg-slate-800 border border-slate-700">
                      <div
                        className="h-full bg-gradient-to-r from-orange-500 via-amber-400 to-rose-500 rounded-full transition-all duration-500"
                        style={{ width: `${calculationResult.outcome.compatibilityScore}%` }}
                      />
                    </div>
                  </div>

                  {/* Letter Elimination Breakdown */}
                  <div className="rounded-xl border border-slate-800 bg-slate-950/70 p-3.5 space-y-2.5">
                    <div className="flex items-center justify-between text-xs font-bold text-slate-300">
                      <span>Letter Cancellation</span>
                      <span className="text-orange-400 font-mono">
                        Count N = {calculationResult.totalRemainingCount}
                      </span>
                    </div>

                    {/* Name 1 Letter Badges */}
                    <div className="space-y-1">
                      <div className="text-[11px] text-slate-400 flex items-center justify-between">
                        <span>{name1}:</span>
                        <span>{calculationResult.remainingCount1} unmatched</span>
                      </div>
                      <div className="flex flex-wrap gap-1">
                        {calculationResult.arr1.map((char, idx) => {
                          const isCancelled = calculationResult.matchedIndices1.has(idx);
                          return (
                            <span
                              key={idx}
                              className={`flex h-6 w-6 items-center justify-center rounded font-mono text-xs font-bold ${
                                isCancelled
                                  ? 'bg-red-950/60 text-red-400 line-through border border-red-800/40 opacity-60'
                                  : 'bg-emerald-950/80 text-emerald-300 border border-emerald-600/50'
                              }`}
                            >
                              {char.toUpperCase()}
                            </span>
                          );
                        })}
                      </div>
                    </div>

                    {/* Name 2 Letter Badges */}
                    <div className="space-y-1 pt-0.5">
                      <div className="text-[11px] text-slate-400 flex items-center justify-between">
                        <span>{name2}:</span>
                        <span>{calculationResult.remainingCount2} unmatched</span>
                      </div>
                      <div className="flex flex-wrap gap-1">
                        {calculationResult.arr2.map((char, idx) => {
                          const isCancelled = calculationResult.matchedIndices2.has(idx);
                          return (
                            <span
                              key={idx}
                              className={`flex h-6 w-6 items-center justify-center rounded font-mono text-xs font-bold ${
                                isCancelled
                                  ? 'bg-red-950/60 text-red-400 line-through border border-red-800/40 opacity-60'
                                  : 'bg-emerald-950/80 text-emerald-300 border border-emerald-600/50'
                              }`}
                            >
                              {char.toUpperCase()}
                            </span>
                          );
                        })}
                      </div>
                    </div>

                    {/* FLAMES Circular Elimination Bar */}
                    <div className="border-t border-slate-800 pt-2.5 space-y-1">
                      <div className="text-[10px] font-bold text-slate-400 uppercase">
                        Circular FLAMES Count ({calculationResult.totalRemainingCount})
                      </div>
                      <div className="flex gap-1.5 text-center text-xs">
                        {(['F', 'L', 'A', 'M', 'E', 'S'] as const).map((letKey) => {
                          const isWinner = calculationResult.finalLetter === letKey;
                          const step = calculationResult.eliminationSteps.find((s) => s.letter === letKey);
                          return (
                            <div
                              key={letKey}
                              className={`flex-1 rounded-lg py-1.5 px-0.5 font-bold border transition-all ${
                                isWinner
                                  ? 'bg-gradient-to-tr from-orange-600 to-amber-500 text-white border-orange-400 shadow-md scale-105 ring-1 ring-orange-400'
                                  : 'bg-slate-900 text-slate-500 border-slate-800 line-through opacity-40'
                              }`}
                            >
                              <div className="text-xs font-black">{letKey}</div>
                              <div className="text-[8px] truncate">
                                {isWinner ? 'WINNER' : step ? `#${step.removedAtStep}` : ''}
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  </div>

                  {/* Summary & Quote */}
                  <div className="space-y-2">
                    <p className="text-xs text-slate-200 leading-relaxed">
                      {calculationResult.outcome.description}
                    </p>
                    <div className="rounded-lg border border-slate-800 bg-slate-950/40 p-2.5 text-[11px] italic text-slate-400 border-l-2 border-l-orange-500">
                      {calculationResult.outcome.quote}
                    </div>
                  </div>
                </div>
              ) : (
                <div className="flex h-full min-h-[300px] flex-col items-center justify-center rounded-2xl border border-slate-800 bg-slate-900/60 p-8 text-center text-slate-400">
                  <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-orange-500/10 border border-orange-500/20 mb-3 text-orange-400">
                    <Flame className="h-7 w-7 fill-orange-400/20" />
                  </div>
                  <h3 className="text-base font-bold text-white">Enter Names to Calculate</h3>
                  <p className="text-xs text-slate-400 mt-1 max-w-sm leading-relaxed">
                    Type your name and your partner's name on the left to reveal instant letter cancellation, elimination steps, and relationship destiny.
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* COMPACT & CONCISE FLAMES QUICK GUIDE */}
      <section id="flames-seo-guide" className="rounded-3xl border border-slate-200 bg-white p-5 sm:p-6 shadow-sm space-y-5 text-slate-800">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-100 pb-3">
          <div className="space-y-0.5">
            <div className="inline-flex items-center gap-1.5 text-xs font-bold text-orange-600 uppercase tracking-wider">
              <BookOpen className="h-3.5 w-3.5" />
              Quick Guide
            </div>
            <h2 className="text-lg sm:text-xl font-black text-slate-900">
              How FLAMES Compatibility Works
            </h2>
          </div>
          <p className="text-xs text-slate-500 max-w-md sm:text-right">
            A traditional relationship game predicting compatibility through name letter cancellation and circular counting.
          </p>
        </div>

        {/* 6 Acronym Quick Meaning Pills */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2 text-center text-xs">
          <div className="rounded-xl border border-emerald-200 bg-emerald-50/60 p-2.5">
            <div className="text-base mb-0.5">🤝</div>
            <div className="font-bold text-emerald-800 text-xs">F — Friends</div>
            <div className="text-[10px] text-emerald-700/80 mt-0.5">Trust & Loyalty</div>
          </div>

          <div className="rounded-xl border border-rose-200 bg-rose-50/60 p-2.5">
            <div className="text-base mb-0.5">❤️</div>
            <div className="font-bold text-rose-800 text-xs">L — Love</div>
            <div className="text-[10px] text-rose-700/80 mt-0.5">Romance & Passion</div>
          </div>

          <div className="rounded-xl border border-purple-200 bg-purple-50/60 p-2.5">
            <div className="text-base mb-0.5">🥰</div>
            <div className="font-bold text-purple-800 text-xs">A — Affection</div>
            <div className="text-[10px] text-purple-700/80 mt-0.5">Warm Care & Bond</div>
          </div>

          <div className="rounded-xl border border-amber-200 bg-amber-50/60 p-2.5">
            <div className="text-base mb-0.5">💍</div>
            <div className="font-bold text-amber-800 text-xs">M — Marriage</div>
            <div className="text-[10px] text-amber-700/80 mt-0.5">Lifelong Union</div>
          </div>

          <div className="rounded-xl border border-red-200 bg-red-50/60 p-2.5">
            <div className="text-base mb-0.5">⚡</div>
            <div className="font-bold text-red-800 text-xs">E — Enemy</div>
            <div className="text-[10px] text-red-700/80 mt-0.5">Spicy Rivals & Spark</div>
          </div>

          <div className="rounded-xl border border-sky-200 bg-sky-50/60 p-2.5">
            <div className="text-base mb-0.5">🛡️</div>
            <div className="font-bold text-sky-800 text-xs">S — Siblings</div>
            <div className="text-[10px] text-sky-700/80 mt-0.5">Protective Kinship</div>
          </div>
        </div>

        {/* 3-Step Simple Method Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-2.5">
          <div className="rounded-xl border border-slate-200 bg-slate-50/80 p-3 space-y-0.5">
            <div className="flex items-center gap-2 font-bold text-xs text-slate-800">
              <span className="flex h-4 w-4 items-center justify-center rounded-full bg-orange-600 text-[10px] font-black text-white">1</span>
              <span>Cancel Shared Letters</span>
            </div>
            <p className="text-[11px] text-slate-600 pl-6">
              Cross out identical matching letters between both names.
            </p>
          </div>

          <div className="rounded-xl border border-slate-200 bg-slate-50/80 p-3 space-y-0.5">
            <div className="flex items-center gap-2 font-bold text-xs text-slate-800">
              <span className="flex h-4 w-4 items-center justify-center rounded-full bg-orange-600 text-[10px] font-black text-white">2</span>
              <span>Count Remaining (N)</span>
            </div>
            <p className="text-[11px] text-slate-600 pl-6">
              Sum all remaining unmatched letters across both names.
            </p>
          </div>

          <div className="rounded-xl border border-slate-200 bg-slate-50/80 p-3 space-y-0.5">
            <div className="flex items-center gap-2 font-bold text-xs text-slate-800">
              <span className="flex h-4 w-4 items-center justify-center rounded-full bg-orange-600 text-[10px] font-black text-white">3</span>
              <span>Circular FLAMES Count</span>
            </div>
            <p className="text-[11px] text-slate-600 pl-6">
              Count circularly on F-L-A-M-E-S to N and eliminate until 1 letter remains.
            </p>
          </div>
        </div>

        {/* Compact FAQ Accordion */}
        <div className="space-y-1.5 pt-1 border-t border-slate-100">
          <div className="text-xs font-bold text-slate-800 flex items-center gap-1.5 mb-1.5">
            <HelpCircle className="h-3.5 w-3.5 text-orange-600" />
            Quick FAQ
          </div>

          {[
            {
              q: 'Does name order affect the result?',
              a: 'No. Letter cancellation is commutative, so Person A + Person B yields the exact same count and result as Person B + Person A.',
            },
            {
              q: 'What if all letters cancel out?',
              a: 'If all letters match (count is 0), standard FLAMES rules award "Friends" (F) for perfect natural harmony.',
            },
          ].map((faq, idx) => {
            const isOpen = showFaqIndex === idx;
            return (
              <div
                key={idx}
                className="rounded-xl border border-slate-200 bg-slate-50/50 transition overflow-hidden"
              >
                <button
                  onClick={() => setShowFaqIndex(isOpen ? null : idx)}
                  className="w-full flex items-center justify-between p-2.5 text-left text-xs font-semibold text-slate-800 hover:text-orange-600 transition cursor-pointer"
                >
                  <span>{faq.q}</span>
                  {isOpen ? (
                    <ChevronUp className="h-3.5 w-3.5 text-orange-600 shrink-0" />
                  ) : (
                    <ChevronDown className="h-3.5 w-3.5 text-slate-400 shrink-0" />
                  )}
                </button>

                {isOpen && (
                  <div className="border-t border-slate-200/60 bg-white p-2.5 text-xs text-slate-600 leading-relaxed">
                    {faq.a}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </section>

      {/* QUICK START FEATURED TOOLS SECTION */}
      <section id="quick-start-section" className="space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-200 pb-3">
          <div className="space-y-0.5">
            <div className="flex items-center gap-2">
              <span className="flex h-2 w-2 rounded-full bg-orange-600 animate-ping" />
              <h2 className="text-lg sm:text-xl font-black text-slate-900">
                Popular Quick Start Calculators
              </h2>
              <span className="rounded-full bg-orange-100 px-2 py-0.5 text-[10px] font-bold text-orange-700 border border-orange-200">
                217 AVAILABLE
              </span>
            </div>
            <p className="text-xs text-slate-500">
              Instant financial calculations, body mass index, loan schedules, and computational tools.
            </p>
          </div>

          <Link
            href="/category/finance/"
            className="flex items-center gap-1 text-xs font-bold text-orange-600 hover:text-orange-700 transition cursor-pointer self-start sm:self-auto"
          >
            <span>Browse All Calculators</span>
            <ArrowRight className="h-3.5 w-3.5" />
          </Link>
        </div>

        {/* Quick Start Cards Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3.5">
          {FEATURED_QUICK_TOOLS.map((calcId) => {
            const calc = getCalculatorById(calcId);
            if (!calc) return null;

            return (
              <Link
                key={calc.id}
                href={`/calculators/${calc.id}/`}
                onClick={() => onSelectCalculator?.(calc.id)}
                className="group relative flex flex-col justify-between rounded-2xl border border-slate-200/80 bg-white p-4 shadow-xs transition-all duration-200 hover:-translate-y-0.5 hover:shadow-md hover:border-orange-300 text-left no-underline block"
              >
                <div>
                  <div className="flex items-center justify-between">
                    <div
                      className={`flex h-10 w-10 items-center justify-center rounded-xl font-bold text-white shadow-xs ${calc.color}`}
                    >
                      <span className="text-base font-extrabold">{calc.letter}</span>
                    </div>

                    {calc.badge && (
                      <span
                        className={`flex items-center gap-1 rounded-full px-2 py-0.5 text-[9px] font-black uppercase tracking-wider ${
                          calc.badge === 'HOT'
                            ? 'bg-rose-100 text-rose-600 border border-rose-200'
                            : calc.badge === 'AI'
                            ? 'bg-purple-100 text-purple-700 border border-purple-200'
                            : 'bg-amber-100 text-amber-700 border border-amber-200'
                        }`}
                      >
                        {calc.badge === 'HOT' && <Flame className="h-2.5 w-2.5 fill-rose-500" />}
                        {calc.badge === 'AI' && <Sparkles className="h-2.5 w-2.5" />}
                        {calc.badge}
                      </span>
                    )}
                  </div>

                  <h3 className="mt-3 text-sm font-bold tracking-tight text-slate-900 group-hover:text-orange-600 transition-colors">
                    {calc.title}
                  </h3>

                  <p className="mt-1 line-clamp-2 text-xs leading-relaxed text-slate-500">
                    {calc.description}
                  </p>
                </div>

                <div className="mt-3.5 flex items-center justify-between border-t border-slate-100 pt-2 text-[11px] text-slate-400">
                  <span className="font-medium truncate">{calc.categoryName}</span>
                  <div className="flex items-center gap-1 font-semibold text-slate-400 group-hover:text-orange-600 transition-colors">
                    <span>Launch</span>
                    <ArrowRight className="h-3 w-3 transition-transform group-hover:translate-x-0.5" />
                  </div>
                </div>
              </Link>
            );
          })}
        </div>
      </section>
    </div>
  );
};
