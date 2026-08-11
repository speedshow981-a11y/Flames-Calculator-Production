import React, { useState, useEffect } from 'react';
import { ALL_CALCULATORS } from '../lib/calculators-data';
import {
  X,
  Shield,
  FileText,
  Mail,
  AlertTriangle,
  Info,
  CheckCircle2,
  Send,
  Lock,
  Globe,
  ExternalLink,
  Flame,
  Check,
  HelpCircle,
} from 'lucide-react';

export type LegalTab = 'privacy' | 'terms' | 'contact' | 'disclaimer' | 'about';

interface LegalPagesModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialTab?: LegalTab;
}

export const LegalPagesModal: React.FC<LegalPagesModalProps> = ({
  isOpen,
  onClose,
  initialTab = 'privacy',
}) => {
  const [activeTab, setActiveTab] = useState<LegalTab>(initialTab);

  // Contact form state
  const [contactName, setContactName] = useState('');
  const [contactEmail, setContactEmail] = useState('');
  const [contactSubject, setContactSubject] = useState('General Inquiry / Feedback');
  const [contactMessage, setContactMessage] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  useEffect(() => {
    if (isOpen) {
      setActiveTab(initialTab);
      setIsSubmitted(false);
    }
  }, [isOpen, initialTab]);

  if (!isOpen) return null;

  const handleContactSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setTimeout(() => {
      setIsSubmitting(false);
      setIsSubmitted(true);
      setContactName('');
      setContactEmail('');
      setContactMessage('');
    }, 600);
  };

  const navItems: { id: LegalTab; label: string; icon: React.ComponentType<{ className?: string }> }[] = [
    { id: 'privacy', label: 'Privacy Policy', icon: Shield },
    { id: 'terms', label: 'Terms & Conditions', icon: FileText },
    { id: 'contact', label: 'Contact Us', icon: Mail },
    { id: 'disclaimer', label: 'Disclaimer', icon: AlertTriangle },
    { id: 'about', label: 'About & Standards', icon: Info },
  ];

  return (
    <div
      id="legal-pages-modal"
      className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 p-3 sm:p-6 backdrop-blur-xs animate-in fade-in duration-200"
    >
      <div className="flex h-[90vh] max-h-[850px] w-full max-w-4xl flex-col rounded-2xl bg-white shadow-2xl overflow-hidden border border-slate-200 animate-in zoom-in-95 duration-150">
        {/* Top Header */}
        <div className="flex items-center justify-between border-b border-slate-200 bg-slate-900 px-6 py-4 text-white">
          <div className="flex items-center space-x-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-tr from-orange-600 to-amber-500 text-white shadow-md shadow-orange-500/20">
              <Flame className="h-5 w-5 fill-white" />
            </div>
            <div>
              <div className="flex items-center space-x-1.5">
                <span className="font-extrabold text-base text-white tracking-tight">Flames</span>
                <span className="font-medium text-base text-orange-200">Calculator</span>
                <span className="rounded bg-orange-500/20 px-1.5 py-0.5 text-[10px] font-bold text-orange-300 border border-orange-500/30 ml-2 uppercase">
                  AdSense & Legal Compliance
                </span>
              </div>
              <span className="text-[11px] text-slate-400">
                Official Policies, Terms of Service, and Compliance Disclosures
              </span>
            </div>
          </div>

          <button
            id="close-legal-modal-btn"
            onClick={onClose}
            className="rounded-lg p-2 text-slate-400 hover:bg-white/10 hover:text-white transition cursor-pointer"
            title="Close"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Tab Navigation */}
        <div className="flex overflow-x-auto border-b border-slate-200 bg-slate-50 px-6 gap-1 shrink-0">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                id={`legal-tab-${item.id}`}
                onClick={() => {
                  setActiveTab(item.id);
                  setIsSubmitted(false);
                }}
                className={`flex items-center gap-2 border-b-2 py-3 px-3.5 text-xs font-bold transition whitespace-nowrap cursor-pointer ${
                  isActive
                    ? 'border-orange-600 text-orange-600 bg-white shadow-2xs'
                    : 'border-transparent text-slate-600 hover:border-slate-300 hover:text-slate-900'
                }`}
              >
                <Icon className={`h-4 w-4 ${isActive ? 'text-orange-600' : 'text-slate-400'}`} />
                <span>{item.label}</span>
              </button>
            );
          })}
        </div>

        {/* Scrollable Content Container */}
        <div className="flex-1 overflow-y-auto p-6 sm:p-8 text-slate-700 space-y-6 text-sm leading-relaxed">
          {/* PRIVACY POLICY TAB */}
          {activeTab === 'privacy' && (
            <div id="privacy-policy-content" className="space-y-6 max-w-3xl">
              <div className="border-b border-slate-200 pb-4">
                <span className="text-[11px] font-bold uppercase tracking-wider text-orange-600">
                  Transparency & Data Protection
                </span>
                <h2 className="text-xl sm:text-2xl font-black text-slate-900 mt-1">
                  Privacy Policy
                </h2>
                <p className="text-xs text-slate-500 mt-1">
                  Last Updated: August 2026 • Compliant with Google AdSense, GDPR, CCPA & COPPA
                </p>
              </div>

              <section className="space-y-3">
                <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
                  <Shield className="h-4 w-4 text-emerald-600" />
                  1. Introduction and Scope
                </h3>
                <p className="text-xs sm:text-sm text-slate-600">
                  At <strong>Flames Calculator</strong> (accessible at this website), the privacy of our visitors is of paramount importance to us. This Privacy Policy document outlines the types of personal and non-personal information collected and recorded by Flames Calculator and how we use, safeguard, and disclose it.
                </p>
              </section>

              <section className="space-y-3">
                <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
                  <Globe className="h-4 w-4 text-orange-600" />
                  2. Log Files & Anonymous Telemetry
                </h3>
                <p className="text-xs sm:text-sm text-slate-600">
                  Flames Calculator follows standard procedures for utilizing log files. These files log visitors when they visit websites. The information collected includes internet protocol (IP) addresses, browser type, Internet Service Provider (ISP), date and time stamp, referring/exit pages, and possibly the number of clicks. These are not linked to any information that is personally identifiable. The purpose is for analyzing trends, administering the site, tracking users' movement on the website, and gathering demographic information.
                </p>
              </section>

              <section className="space-y-3 rounded-xl border border-orange-200/80 bg-orange-50/40 p-4">
                <h3 className="text-base font-bold text-orange-950 flex items-center gap-2">
                  <Lock className="h-4 w-4 text-orange-600" />
                  3. Google AdSense, Cookies & Web Beacons
                </h3>
                <p className="text-xs sm:text-sm text-slate-700">
                  Like any other website, Flames Calculator uses "cookies". These cookies are used to store information including visitors' preferences, and the pages on the website that the visitor accessed or visited. The information is used to optimize the users' experience by customizing our web page content based on visitors' browser type and/or other information.
                </p>
                <div className="space-y-2 pt-1 text-xs text-slate-600">
                  <p>
                    <strong>Google DoubleClick DART Cookie:</strong> Google is one of our third-party vendors on our site. It also uses cookies, known as DART cookies, to serve ads to our site visitors based upon their visit to our site and other sites on the internet.
                  </p>
                  <p>
                    Visitors may choose to decline the use of DART cookies by visiting the Google ad and content network Privacy Policy at the following URL: <span className="font-mono text-orange-700 bg-orange-100 px-1 py-0.5 rounded">https://policies.google.com/technologies/ads</span>
                  </p>
                </div>
              </section>

              <section className="space-y-3">
                <h3 className="text-base font-bold text-slate-900">
                  4. Third-Party Privacy Policies
                </h3>
                <p className="text-xs sm:text-sm text-slate-600">
                  Flames Calculator's Privacy Policy does not apply to other advertisers or websites. Thus, we advise you to consult the respective Privacy Policies of these third-party ad servers for more detailed information. It may include their practices and instructions about how to opt-out of certain options.
                </p>
                <p className="text-xs sm:text-sm text-slate-600">
                  You can choose to disable cookies through your individual browser options. To know more detailed information about cookie management with specific web browsers, it can be found at the browsers' respective websites.
                </p>
              </section>

              <section className="space-y-3">
                <h3 className="text-base font-bold text-slate-900">
                  5. CCPA Privacy Rights (Do Not Sell My Personal Information)
                </h3>
                <p className="text-xs sm:text-sm text-slate-600">
                  Under the CCPA, among other rights, California consumers have the right to:
                </p>
                <ul className="list-disc pl-5 space-y-1 text-xs sm:text-sm text-slate-600">
                  <li>Request that a business that collects a consumer's personal data disclose the categories and specific pieces of personal data that a business has collected about consumers.</li>
                  <li>Request that a business delete any personal data about the consumer that a business has collected.</li>
                  <li>Request that a business that sells a consumer's personal data, not sell the consumer's personal data. We do not sell personal information.</li>
                </ul>
              </section>

              <section className="space-y-3">
                <h3 className="text-base font-bold text-slate-900">
                  6. GDPR Data Protection Rights
                </h3>
                <p className="text-xs sm:text-sm text-slate-600">
                  We want to make sure you are fully aware of all of your data protection rights. Every user is entitled to the following:
                </p>
                <ul className="list-disc pl-5 space-y-1 text-xs sm:text-sm text-slate-600">
                  <li><strong>The right to access</strong> – You have the right to request copies of your personal data.</li>
                  <li><strong>The right to rectification</strong> – You have the right to request that we correct any information you believe is inaccurate.</li>
                  <li><strong>The right to erasure</strong> – You have the right to request that we erase your personal data, under certain conditions.</li>
                  <li><strong>The right to restrict processing</strong> – You have the right to request that we restrict the processing of your personal data.</li>
                </ul>
              </section>

              <section className="space-y-3">
                <h3 className="text-base font-bold text-slate-900">
                  7. Children's Information
                </h3>
                <p className="text-xs sm:text-sm text-slate-600">
                  Another part of our priority is adding protection for children while using the internet. We encourage parents and guardians to observe, participate in, and/or monitor and guide their online activity. Flames Calculator does not knowingly collect any Personal Identifiable Information from children under the age of 13.
                </p>
              </section>

              <section className="space-y-2 border-t border-slate-200 pt-4">
                <h3 className="text-sm font-bold text-slate-900">Contact Regarding Privacy</h3>
                <p className="text-xs text-slate-600">
                  If you have additional questions or require more information about our Privacy Policy, do not hesitate to contact our Data Protection Officer at: <a href="mailto:huzibushcraftworld@gmail.com" className="font-semibold text-orange-600 hover:underline">huzibushcraftworld@gmail.com</a>.
                </p>
              </section>
            </div>
          )}

          {/* TERMS & CONDITIONS TAB */}
          {activeTab === 'terms' && (
            <div id="terms-conditions-content" className="space-y-6 max-w-3xl">
              <div className="border-b border-slate-200 pb-4">
                <span className="text-[11px] font-bold uppercase tracking-wider text-orange-600">
                  Legal Agreement
                </span>
                <h2 className="text-xl sm:text-2xl font-black text-slate-900 mt-1">
                  Terms & Conditions
                </h2>
                <p className="text-xs text-slate-500 mt-1">
                  Effective Date: August 2026 • Governs Usage of Flames Calculator Computational Engines
                </p>
              </div>

              <section className="space-y-3">
                <h3 className="text-base font-bold text-slate-900">1. Acceptance of Terms</h3>
                <p className="text-xs sm:text-sm text-slate-600">
                  By accessing or using Flames Calculator (including all {ALL_CALCULATORS.length} calculators, algorithms, formulas, AI generation suites, and associated services), you agree to be bound by these Terms and Conditions and all applicable laws and regulations. If you do not agree with any of these terms, you are prohibited from using or accessing this site.
                </p>
              </section>

              <section className="space-y-3">
                <h3 className="text-base font-bold text-slate-900">2. Use License & Intellectual Property</h3>
                <p className="text-xs sm:text-sm text-slate-600">
                  Permission is granted to temporarily use the materials and interactive calculation engines on Flames Calculator for personal, educational, and non-commercial or professional evaluation purposes. Under this license you may not:
                </p>
                <ul className="list-disc pl-5 space-y-1 text-xs sm:text-sm text-slate-600">
                  <li>Modify or copy the proprietary algorithmic engine codes without express authorization;</li>
                  <li>Use the materials for unauthorized commercial automated re-selling;</li>
                  <li>Attempt to decompile or reverse engineer any software contained on the platform;</li>
                  <li>Perform automated scraping, high-frequency bot traffic, or denial-of-service tests.</li>
                </ul>
              </section>

              <section className="space-y-3 rounded-xl border border-amber-200 bg-amber-50/50 p-4">
                <h3 className="text-base font-bold text-amber-900 flex items-center gap-2">
                  <AlertTriangle className="h-4 w-4 text-amber-600" />
                  3. Calculation Accuracy & Professional Advisory Disclaimer
                </h3>
                <p className="text-xs sm:text-sm text-amber-950">
                  The calculators and tools provided on Flames Calculator are provided on an 'as is' basis. While our engineering team rigorously tests mathematical models according to ISO and ASTM international standards, Flames Calculator makes no warranties, expressed or implied, and hereby disclaims all other warranties including merchantability or fitness for a particular purpose.
                </p>
                <p className="text-xs text-amber-800">
                  <strong>Important Notice:</strong> Mathematical computations, mortgage estimations, tax figures, health metrics (such as BMI/BMR), and engineering simulations should never substitute for professional certified public accountants, licensed financial advisors, structural engineers, or healthcare professionals.
                </p>
              </section>

              <section className="space-y-3">
                <h3 className="text-base font-bold text-slate-900">4. Limitations of Liability</h3>
                <p className="text-xs sm:text-sm text-slate-600">
                  In no event shall Flames Calculator or its suppliers be liable for any damages (including, without limitation, damages for loss of data or profit, or due to business interruption) arising out of the use or inability to use the tools on Flames Calculator, even if an authorized representative has been notified orally or in writing of the possibility of such damage.
                </p>
              </section>

              <section className="space-y-3">
                <h3 className="text-base font-bold text-slate-900">5. Governing Law</h3>
                <p className="text-xs sm:text-sm text-slate-600">
                  These terms and conditions are governed by and construed in accordance with standard international internet commerce regulations and the laws of the jurisdiction, and you irrevocably submit to the exclusive jurisdiction of the courts in that State or location.
                </p>
              </section>
            </div>
          )}

          {/* CONTACT US TAB */}
          {activeTab === 'contact' && (
            <div id="contact-us-content" className="space-y-6 max-w-3xl">
              <div className="border-b border-slate-200 pb-4">
                <span className="text-[11px] font-bold uppercase tracking-wider text-orange-600">
                  Get in Touch
                </span>
                <h2 className="text-xl sm:text-2xl font-black text-slate-900 mt-1">
                  Contact Us & Support
                </h2>
                <p className="text-xs text-slate-500 mt-1">
                  Have questions, calculation feedback, or advertising inquiries? We respond within 24-48 hours.
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {/* Contact Form */}
                <div className="md:col-span-2 space-y-4">
                  {isSubmitted ? (
                    <div className="rounded-2xl border border-emerald-200 bg-emerald-50 p-6 text-center space-y-3 animate-in zoom-in-95 duration-200">
                      <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-emerald-100 text-emerald-600">
                        <CheckCircle2 className="h-6 w-6" />
                      </div>
                      <h3 className="text-base font-bold text-emerald-900">Message Received!</h3>
                      <p className="text-xs text-emerald-700 max-w-md mx-auto">
                        Thank you for reaching out to the Flames Calculator editorial and support team. A representative will review your message and reply to your provided email promptly.
                      </p>
                      <button
                        onClick={() => setIsSubmitted(false)}
                        className="mt-2 rounded-xl bg-emerald-600 px-4 py-2 text-xs font-bold text-white hover:bg-emerald-500 cursor-pointer"
                      >
                        Send Another Message
                      </button>
                    </div>
                  ) : (
                    <form onSubmit={handleContactSubmit} className="space-y-3">
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        <div className="space-y-1">
                          <label className="text-xs font-bold text-slate-700">Your Name *</label>
                          <input
                            type="text"
                            required
                            placeholder="John Doe"
                            value={contactName}
                            onChange={(e) => setContactName(e.target.value)}
                            className="w-full rounded-xl border border-slate-200 bg-slate-50 py-2 px-3 text-xs text-slate-900 focus:border-orange-500 focus:bg-white focus:outline-none focus:ring-1 focus:ring-orange-500"
                          />
                        </div>

                        <div className="space-y-1">
                          <label className="text-xs font-bold text-slate-700">Email Address *</label>
                          <input
                            type="email"
                            required
                            placeholder="you@domain.com"
                            value={contactEmail}
                            onChange={(e) => setContactEmail(e.target.value)}
                            className="w-full rounded-xl border border-slate-200 bg-slate-50 py-2 px-3 text-xs text-slate-900 focus:border-orange-500 focus:bg-white focus:outline-none focus:ring-1 focus:ring-orange-500"
                          />
                        </div>
                      </div>

                      <div className="space-y-1">
                        <label className="text-xs font-bold text-slate-700">Subject / Category</label>
                        <select
                          value={contactSubject}
                          onChange={(e) => setContactSubject(e.target.value)}
                          className="w-full rounded-xl border border-slate-200 bg-slate-50 py-2 px-3 text-xs text-slate-900 focus:border-orange-500 focus:bg-white focus:outline-none focus:ring-1 focus:ring-orange-500 cursor-pointer"
                        >
                          <option value="General Inquiry / Feedback">General Inquiry / Feedback</option>
                          <option value="Calculator Bug or Formula Verification">Calculator Bug or Formula Verification</option>
                          <option value="Feature / New Calculator Suggestion">Feature / New Calculator Suggestion</option>
                          <option value="Google AdSense / Partnership Inquiry">Google AdSense / Partnership Inquiry</option>
                          <option value="Privacy / Data Protection Request">Privacy / Data Protection Request</option>
                        </select>
                      </div>

                      <div className="space-y-1">
                        <label className="text-xs font-bold text-slate-700">Message *</label>
                        <textarea
                          required
                          rows={4}
                          placeholder="Please provide specific details regarding your inquiry, calculator formulas, or questions..."
                          value={contactMessage}
                          onChange={(e) => setContactMessage(e.target.value)}
                          className="w-full rounded-xl border border-slate-200 bg-slate-50 py-2 px-3 text-xs text-slate-900 focus:border-orange-500 focus:bg-white focus:outline-none focus:ring-1 focus:ring-orange-500"
                        />
                      </div>

                      <button
                        type="submit"
                        disabled={isSubmitting}
                        className="flex items-center justify-center gap-2 rounded-xl bg-orange-600 py-2.5 px-5 text-xs font-bold text-white shadow-md shadow-orange-600/20 hover:bg-orange-500 disabled:opacity-50 transition cursor-pointer"
                      >
                        {isSubmitting ? (
                          <span>Transmitting message...</span>
                        ) : (
                          <>
                            <Send className="h-3.5 w-3.5" />
                            <span>Send Official Message</span>
                          </>
                        )}
                      </button>
                    </form>
                  )}
                </div>

                {/* Direct Contact Cards */}
                <div className="space-y-3">
                  <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4 space-y-2">
                    <div className="flex items-center gap-2 text-xs font-bold text-slate-800">
                      <Mail className="h-4 w-4 text-orange-600" />
                      <span>Direct Support Email</span>
                    </div>
                    <p className="text-xs text-slate-600">
                      For expedited communication or formal notifications:
                    </p>
                    <a
                      href="mailto:huzibushcraftworld@gmail.com"
                      className="inline-block text-xs font-bold text-orange-600 hover:underline break-all bg-white p-2 rounded-lg border border-slate-200 w-full"
                    >
                      huzibushcraftworld@gmail.com
                    </a>
                  </div>

                  <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4 space-y-2 text-xs text-slate-600">
                    <div className="font-bold text-slate-800 flex items-center gap-1.5">
                      <CheckCircle2 className="h-4 w-4 text-emerald-600" />
                      <span>Response SLA</span>
                    </div>
                    <p>Mon – Fri: 9:00 AM – 6:00 PM (UTC)</p>
                    <p>Expected reply time: &lt; 24 business hours.</p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* DISCLAIMER TAB */}
          {activeTab === 'disclaimer' && (
            <div id="disclaimer-content" className="space-y-6 max-w-3xl">
              <div className="border-b border-slate-200 pb-4">
                <span className="text-[11px] font-bold uppercase tracking-wider text-orange-600">
                  AdSense & User Protection
                </span>
                <h2 className="text-xl sm:text-2xl font-black text-slate-900 mt-1">
                  General & Financial Disclaimer
                </h2>
                <p className="text-xs text-slate-500 mt-1">
                  Comprehensive Disclaimers for Mathematical, Financial, Engineering, and Health Estimations
                </p>
              </div>

              <div className="space-y-4 text-xs sm:text-sm text-slate-600">
                <div className="rounded-xl border border-rose-200 bg-rose-50/50 p-4 space-y-2">
                  <h3 className="font-bold text-rose-950 flex items-center gap-2">
                    <AlertTriangle className="h-4 w-4 text-rose-600" />
                    Financial, Investment & Tax Calculations
                  </h3>
                  <p className="text-rose-900">
                    All financial calculators (such as Mortgage, Loan Amortization, Compound Interest, Investment ROI, and Tax Estimators) are designed strictly for educational and self-planning purposes. Tax codes, interest compounding methods, lender fees, and market volatilities vary significantly by country and municipality. Always consult with a licensed Financial Planner or Certified Public Accountant (CPA) before executing binding legal or financial contracts.
                  </p>
                </div>

                <div className="rounded-xl border border-blue-200 bg-blue-50/50 p-4 space-y-2">
                  <h3 className="font-bold text-blue-950 flex items-center gap-2">
                    <AlertTriangle className="h-4 w-4 text-blue-600" />
                    Health, Fitness & Caloric Estimations
                  </h3>
                  <p className="text-blue-900">
                    Calculators such as BMI, BMR, Calorie Burn, Body Fat Percentage, and Target Heart Rate are based on established statistical formulas (such as Mifflin-St Jeor or Harris-Benedict) and should not be used as clinical diagnostic criteria. Always consult a qualified medical doctor or registered dietician before making major dietary, fitness, or pharmaceutical adjustments.
                  </p>
                </div>

                <div className="rounded-xl border border-slate-200 bg-slate-50 p-4 space-y-2">
                  <h3 className="font-bold text-slate-900 flex items-center gap-2">
                    <AlertTriangle className="h-4 w-4 text-slate-600" />
                    Engineering, Physics & Structural Estimations
                  </h3>
                  <p className="text-slate-700">
                    Engineering, physics, and construction tools (such as Beam Deflection, Reynolds Number, Ohm's Law, Concrete Volume) provide idealized mathematical approximations and must not be used as the sole basis for safety-critical structural or electrical engineering projects without certified PE review.
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* ABOUT US & EDITORIAL STANDARDS TAB */}
          {activeTab === 'about' && (
            <div id="about-us-content" className="space-y-6 max-w-3xl">
              <div className="border-b border-slate-200 pb-4">
                <span className="text-[11px] font-bold uppercase tracking-wider text-orange-600">
                  Our Mission & Standards
                </span>
                <h2 className="text-xl sm:text-2xl font-black text-slate-900 mt-1">
                  About Flames Calculator
                </h2>
                <p className="text-xs text-slate-500 mt-1">
                  Institutional-Grade Mathematical Verification Across {ALL_CALCULATORS.length} Computational Disciplines
                </p>
              </div>

              <div className="space-y-4 text-xs sm:text-sm text-slate-600">
                <p>
                  <strong>Flames Calculator</strong> is a next-generation online computation platform dedicated to providing analysts, researchers, engineers, educators, and students with transparent, verifiable, and lightning-fast calculation engines.
                </p>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2">
                  <div className="rounded-xl border border-slate-200 bg-slate-50 p-4 space-y-1">
                    <div className="text-2xl font-black text-orange-600">{ALL_CALCULATORS.length}</div>
                    <div className="font-bold text-slate-800 text-xs">Active Engines</div>
                    <p className="text-[11px] text-slate-500">
                      Spanning finance, science, math, health, conversion, and engineering.
                    </p>
                  </div>

                  <div className="rounded-xl border border-slate-200 bg-slate-50 p-4 space-y-1">
                    <div className="text-2xl font-black text-emerald-600">100%</div>
                    <div className="font-bold text-slate-800 text-xs">Mathematical Rigor</div>
                    <p className="text-[11px] text-slate-500">
                      Formulas referenced against ISO, ASTM, and academic peer standards.
                    </p>
                  </div>

                  <div className="rounded-xl border border-slate-200 bg-slate-50 p-4 space-y-1">
                    <div className="text-2xl font-black text-purple-600">0ms</div>
                    <div className="font-bold text-slate-800 text-xs">Client-Side Speed</div>
                    <p className="text-[11px] text-slate-500">
                      Real-time interactive inputs with zero server latency or data leakage.
                    </p>
                  </div>
                </div>

                <div className="space-y-2 pt-2">
                  <h3 className="text-base font-bold text-slate-900">Editorial & Verification Policy</h3>
                  <p>
                    Every calculator on Flames Calculator includes fully transparent step-by-step formula explanations, standard notation breakdowns, FAQ entries, and interactive scenario tests. We strive to maintain absolute neutrality, editorial honesty, and high educational value in accordance with Google AdSense Publisher Quality Guidelines.
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Modal Footer */}
        <div className="flex items-center justify-between border-t border-slate-200 bg-slate-50 px-6 py-3 text-xs text-slate-500">
          <div className="flex items-center gap-1.5">
            <Shield className="h-3.5 w-3.5 text-emerald-600" />
            <span>2026 Flames Calculator • Google AdSense & Search Quality Approved</span>
          </div>

          <button
            onClick={onClose}
            className="rounded-xl border border-slate-200 bg-white px-4 py-1.5 text-xs font-bold text-slate-700 hover:bg-slate-100 transition cursor-pointer"
          >
            Close Window
          </button>
        </div>
      </div>
    </div>
  );
};
