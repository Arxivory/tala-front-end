import React, { useState } from 'react';
import {
  Sparkles,
  Dumbbell,
  User,
  TrendingUp,
  CheckCircle2,
  Cloud,
  Settings,
  Sun,
  Moon,
  Bell,
  ChevronRight,
  ShieldCheck,
  Activity,
  Calendar,
  Filter,
  Download,
  Info,
  Layers,
  ChevronDown,
  ArrowUpRight,
  SlidersHorizontal,
  Table,
  BarChart3,
  LineChart,
  Check,
  AlertTriangle
} from 'lucide-react';

export default function TrendsSection() {
  // Navigation & Dark Mode State
  const [activeTab, setActiveTab] = useState('Overview'); // 'Overview' | 'Sites' | 'Sessions'
  const [isDarkMode, setIsDarkMode] = useState(false);

  // Top Controls Filter State
  const [dateRange, setDateRange] = useState('30d');
  const [exerciseFilter, setExerciseFilter] = useState('All');
  const [regimeFilter, setRegimeFilter] = useState('All');
  const [compareRef, setCompareRef] = useState(true);

  // Sessions Table Sorting State
  const [sortField, setSortField] = useState('date');
  const [sortDirection, setSortDirection] = useState('desc');

  // Theme Design Tokens
  const theme = {
    bgBase: isDarkMode ? '#14111C' : '#FFFBFC',
    bgSurface: isDarkMode ? '#1D1929' : '#FFFFFF',
    bgRaised: isDarkMode ? '#272236' : '#FAF3F7',
    primary100: isDarkMode ? '#3A2536' : '#FDEBF2',
    primary300: '#F7C6D9',
    primary500: '#E58FB0',
    primary700: isDarkMode ? '#F2C0D3' : '#B35A82',
    textStrong: isDarkMode ? '#F4EEFA' : '#3B2A4A',
    textBody: isDarkMode ? '#D8CFE4' : '#5A4A6A',
    textMuted: isDarkMode ? '#9E93B0' : '#8A7C99',
    optimal: '#7CC9A0',
    caution: '#E8BC68',
    anomaly: '#E58A7F',
  };

  const headingFont = `'Quicksand', 'Nunito', system-ui, -apple-system, sans-serif`;
  const bodyFont = `'Inter', 'Source Sans 3', system-ui, sans-serif`;

  // Sample Sessions Dataset
  const sessionsData = [
    { id: 'SES-042', date: '2026-11-08', exercise: 'Squat', regime: '0.16g Lunar', load: '140 kg', adequacy: 88, safetyMargin: '1.45 kN', formScore: 96, status: 'optimal', flags: 0 },
    { id: 'SES-041', date: '2026-11-07', exercise: 'Deadlift', regime: '0.16g Lunar', load: '160 kg', adequacy: 92, safetyMargin: '1.32 kN', formScore: 94, status: 'optimal', flags: 0 },
    { id: 'SES-040', date: '2026-11-06', exercise: 'Heel Raise', regime: '0.16g Lunar', load: '110 kg', adequacy: 76, safetyMargin: '1.80 kN', formScore: 91, status: 'caution', flags: 1 },
    { id: 'SES-039', date: '2026-11-05', exercise: 'Squat', regime: '0.38g Mars', load: '135 kg', adequacy: 84, safetyMargin: '1.50 kN', formScore: 98, status: 'optimal', flags: 0 },
    { id: 'SES-038', date: '2026-11-04', exercise: 'Deadlift', regime: '0g LEO', load: '150 kg', adequacy: 82, safetyMargin: '1.28 kN', formScore: 89, status: 'caution', flags: 1 },
    { id: 'SES-037', date: '2026-11-03', exercise: 'Squat', regime: '0.16g Lunar', load: '145 kg', adequacy: 90, safetyMargin: '1.40 kN', formScore: 97, status: 'optimal', flags: 0 },
    { id: 'SES-036', date: '2026-11-02', exercise: 'Heel Raise', regime: '0.16g Lunar', load: '115 kg', adequacy: 80, safetyMargin: '1.75 kN', formScore: 93, status: 'optimal', flags: 0 },
    { id: 'SES-035', date: '2026-11-01', exercise: 'Squat', regime: '0.16g Lunar', load: '150 kg', adequacy: 95, safetyMargin: '1.18 kN', formScore: 85, status: 'caution', flags: 2 },
  ];

  // Sites Small-Multiple Grid Dataset
  const sitesGridData = [
    { site: 'Proximal Femur', metric: 'Strain (mε)', current: '1.82 mε', target: '1.60 - 2.10 mε', trend: [65, 70, 78, 82, 85, 88, 86, 88], status: 'optimal' },
    { site: 'L4/L5 Lumbar Spine', metric: 'Compression (kN)', current: '1.42 kN', target: '< 3.40 kN', trend: [40, 50, 65, 75, 88, 92, 84, 80], status: 'caution' },
    { site: 'Hip Joint Complex', metric: 'Moment (N·m)', current: '142 N·m', target: '110 - 160 N·m', trend: [50, 60, 72, 80, 88, 94, 93, 94], status: 'optimal' },
    { site: 'Knee Joint', metric: 'Extension Torque (N·m)', current: '118 N·m', target: '90 - 140 N·m', trend: [60, 68, 75, 80, 84, 85, 84, 85], status: 'optimal' },
    { site: 'Ankle / Calcaneus', metric: 'Plantar Torque (N·m)', current: '72 N·m', target: '80 - 110 N·m', trend: [80, 76, 72, 70, 74, 76, 74, 75], status: 'caution' },
  ];

  return (
    <div 
      className="flex h-screen w-full overflow-hidden select-none transition-colors duration-300" 
      style={{ backgroundColor: theme.bgBase, color: theme.textBody, fontFamily: bodyFont }}
    >
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&family=Quicksand:wght@500;600;700&display=swap');
        .tnum { font-feature-settings: 'tnum'; font-variant-numeric: tabular-nums; }
      `}</style>

      {/* MAIN VIEWPORT */}
      <div className="flex-1 flex flex-col min-w-0 overflow-y-auto">

        {/* TRENDS MAIN CONTENT */}
        <main className="flex-1 p-6 lg:p-8 max-w-7xl mx-auto w-full space-y-6">
          
          {/* Section Header & Export */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <span className="text-[13px] uppercase tracking-wider font-semibold" style={{ color: theme.textMuted }}>Longitudinal Analytics</span>
              <h1 className="text-[28px] font-bold mt-0.5" style={{ fontFamily: headingFont, color: theme.textStrong }}>Trends & Mechanical Loading Index</h1>
              <p className="text-[16px]" style={{ color: theme.textMuted }}>Time-integrated loading stimulus and technique consistency across mission phases.</p>
            </div>

            <button
              onClick={() => alert("Exporting longitudinal loading analytics packet (CSV/PDF)...")}
              className="px-5 py-2.5 rounded-full font-bold text-[14px] shadow-sm flex items-center justify-center gap-2 border border-pink-200 dark:border-purple-800 transition-all hover:bg-pink-50 dark:hover:bg-purple-900/30"
              style={{ backgroundColor: theme.primary300, color: theme.textStrong, fontFamily: headingFont }}
            >
              <Download className="w-4 h-4" />
              <span>Export Analytics (CSV/PDF)</span>
            </button>
          </div>

          {/* 1. TOP CONTROLS BAR */}
          <div className="p-4 rounded-[24px] shadow-sm border border-pink-100/60 dark:border-purple-950 space-y-4" style={{ backgroundColor: theme.bgSurface }}>
            <div className="flex flex-wrap items-center justify-between gap-4">
              
              {/* Filter Group: Date, Exercise, Regime */}
              <div className="flex flex-wrap items-center gap-3">
                {/* Date Range Selector */}
                <div className="flex items-center bg-gray-100 dark:bg-purple-900/40 p-1 rounded-full text-[13px] font-semibold">
                  {['7d', '30d', '90d', 'Mission'].map((r) => (
                    <button
                      key={r}
                      onClick={() => setDateRange(r)}
                      className={`px-3 py-1 rounded-full transition-all tnum ${
                        dateRange === r ? 'shadow-xs font-bold' : 'opacity-70 hover:opacity-100'
                      }`}
                      style={{
                        fontFamily: headingFont,
                        backgroundColor: dateRange === r ? theme.bgSurface : 'transparent',
                        color: dateRange === r ? theme.textStrong : theme.textMuted,
                      }}
                    >
                      {r}
                    </button>
                  ))}
                </div>

                {/* Exercise Filter Dropdown */}
                <select
                  value={exerciseFilter}
                  onChange={(e) => setExerciseFilter(e.target.value)}
                  className="px-3.5 py-1.5 rounded-full text-[13px] font-semibold border border-pink-200 dark:border-purple-800 bg-transparent"
                  style={{ color: theme.textStrong, fontFamily: headingFont }}
                >
                  <option value="All">All Exercises</option>
                  <option value="Squat">Squat</option>
                  <option value="Deadlift">Deadlift</option>
                  <option value="Heel Raise">Heel Raise</option>
                </select>

                {/* Gravity Regime Filter */}
                <select
                  value={regimeFilter}
                  onChange={(e) => setRegimeFilter(e.target.value)}
                  className="px-3.5 py-1.5 rounded-full text-[13px] font-semibold border border-pink-200 dark:border-purple-800 bg-transparent"
                  style={{ color: theme.textStrong, fontFamily: headingFont }}
                >
                  <option value="All">All Regimes</option>
                  <option value="0g">0g (LEO)</option>
                  <option value="0.16g">0.16g (Lunar)</option>
                  <option value="0.38g">0.38g (Mars)</option>
                </select>
              </div>

              {/* Compare Toggle */}
              <div className="flex items-center gap-2">
                <label className="text-[13px] font-semibold cursor-pointer" style={{ color: theme.textStrong, fontFamily: headingFont }}>
                  Compare to 1g Reference
                </label>
                <button
                  onClick={() => setCompareRef(!compareRef)}
                  className={`w-11 h-6 rounded-full transition-colors flex items-center p-1 ${
                    compareRef ? 'bg-pink-400' : 'bg-gray-300 dark:bg-purple-900'
                  }`}
                >
                  <div className={`w-4 h-4 rounded-full bg-white transform transition-transform ${compareRef ? 'translate-x-5' : 'translate-x-0'}`}></div>
                </button>
              </div>

            </div>
          </div>

          {/* 2. TABBED VIEW NAVIGATION */}
          <div className="flex items-center gap-2 border-b border-pink-100 dark:border-purple-950 pb-2">
            {[
              { id: 'Overview', label: 'Overview', icon: BarChart3 },
              { id: 'Sites', label: 'Sites Grid', icon: Layers },
              { id: 'Sessions', label: 'Sessions Log', icon: Table },
            ].map((t) => {
              const TabIcon = t.icon;
              const isTabActive = activeTab === t.id;
              return (
                <button
                  key={t.id}
                  onClick={() => setActiveTab(t.id)}
                  className={`px-5 py-2.5 rounded-full font-bold text-[14px] transition-all flex items-center gap-2 ${
                    isTabActive ? 'shadow-2xs' : 'opacity-70 hover:opacity-100'
                  }`}
                  style={{
                    backgroundColor: isTabActive ? (isDarkMode ? '#2B2340' : '#FDEBF2') : 'transparent',
                    color: isTabActive ? theme.textStrong : theme.textMuted,
                    fontFamily: headingFont,
                  }}
                >
                  <TabIcon className="w-4 h-4" style={{ color: isTabActive ? theme.primary500 : theme.textMuted }} />
                  <span>{t.label}</span>
                </button>
              );
            })}
          </div>

          {/* 3. TAB 1: OVERVIEW TAB PANELS */}
          {activeTab === 'Overview' && (
            <div className="space-y-6 animate-fade-in">
              
              {/* Mechanical Loading Index Daily Bar Chart Panel */}
              <div className="p-6 rounded-[24px] shadow-sm border border-pink-100/60 dark:border-purple-950 space-y-4" style={{ backgroundColor: theme.bgSurface }}>
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                  <div>
                    <h2 className="font-bold text-[20px]" style={{ fontFamily: headingFont, color: theme.textStrong }}>Mechanical Loading Index (MLI)</h2>
                    <p className="text-[13px]" style={{ color: theme.textMuted }}>Daily time-integrated stimulus relative to astronaut 1g reference session.</p>
                  </div>

                  {/* Explicit Disclaimer Chip */}
                  <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-pink-50 dark:bg-purple-900/30 border border-pink-100 dark:border-purple-800 text-[13px] font-medium" style={{ color: theme.primary700 }}>
                    <Info className="w-3.5 h-3.5 flex-shrink-0" />
                    <span>A measure of stimulus delivered. It does not measure or predict bone status.</span>
                  </div>
                </div>

                {/* Daily Bar Chart Visualization */}
                <div className="h-56 w-full flex items-end gap-2 pt-8 px-2 border-b border-pink-100 dark:border-purple-950 relative">
                  {/* 100% Target Reference Line */}
                  <div className="absolute inset-x-0 bottom-24 border-b-2 border-dashed border-emerald-500/40 pointer-events-none flex items-center justify-between px-2">
                    <span className="text-[13px] text-emerald-600 font-bold bg-white dark:bg-purple-950 px-1 rounded">100% Target Stimulus Line</span>
                  </div>

                  {[65, 72, 80, 85, 90, 88, 92, 84, 86, 95, 100, 94, 88, 85, 92, 98, 105, 92, 86, 88, 90, 94, 96, 92, 88, 84, 90, 92, 88, 84].map((val, idx) => (
                    <div key={idx} className="flex-1 flex flex-col items-center h-full justify-end group relative">
                      <div 
                        className="w-full rounded-t-md transition-all duration-300 group-hover:brightness-110"
                        style={{ height: `${val}%`, backgroundColor: val >= 90 ? '#7CC9A0' : '#E8BC68' }}
                      ></div>
                      {/* Tooltip on Hover */}
                      <div className="absolute -top-8 hidden group-hover:flex flex-col items-center bg-gray-900 text-white text-[13px] px-2 py-1 rounded shadow-md z-10 whitespace-nowrap tnum">
                        <span>Day {idx + 1}: {val}% MLI</span>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="flex items-center justify-between text-[13px]" style={{ color: theme.textMuted }}>
                  <span>30 Days Ago</span>
                  <span>Today (Day 42)</span>
                </div>
              </div>

              {/* Femoral Strain & Safety Margin Dual Grid */}
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
                
                {/* Femoral Strain vs Reference Line Chart (8 Cols) */}
                <div className="lg:col-span-8 p-6 rounded-[24px] shadow-sm border border-pink-100/60 dark:border-purple-950 flex flex-col justify-between" style={{ backgroundColor: theme.bgSurface }}>
                  <div className="flex items-center justify-between mb-4">
                    <div>
                      <h2 className="font-bold text-[20px]" style={{ fontFamily: headingFont, color: theme.textStrong }}>Femoral Strain vs Reference</h2>
                      <p className="text-[13px]" style={{ color: theme.textMuted }}>Microstrain values derived from Tier 2 neural surrogate models.</p>
                    </div>
                    <span className="text-[13px] font-semibold text-emerald-600 dark:text-emerald-400 tnum">80 - 110% Target Band</span>
                  </div>

                  <div className="h-44 w-full flex items-end gap-1.5 pt-6 px-2 border-b border-pink-100 dark:border-purple-950 relative">
                    <div className="absolute inset-x-0 bottom-14 top-8 bg-emerald-500/5 rounded-xl border border-dashed border-emerald-500/20 pointer-events-none"></div>

                    {[70, 75, 80, 84, 88, 86, 85, 88, 87, 89, 92, 90, 88, 85, 86, 90, 94, 91, 88, 86, 88, 90, 92, 89, 87, 85, 88, 90, 88, 86].map((val, idx) => (
                      <div key={idx} className="flex-1 flex flex-col items-center h-full justify-end">
                        <div className="w-2 h-2 rounded-full bg-pink-400 mb-1"></div>
                        <div className="w-0.5 bg-pink-200 dark:bg-purple-800 w-full" style={{ height: `${val}%` }}></div>
                      </div>
                    ))}
                  </div>

                  <div className="flex items-center justify-between pt-3 text-[13px]" style={{ color: theme.textMuted }}>
                    <span>Day 1 Baseline</span>
                    <span>Session Trend (30 Days)</span>
                  </div>
                </div>

                {/* Safety Margin & Form Stability Mini Cards (4 Cols) */}
                <div className="lg:col-span-4 space-y-6">
                  {/* Safety Margin Mini Panel */}
                  <div className="p-6 rounded-[24px] shadow-sm border border-pink-100/60 dark:border-purple-950 flex flex-col justify-between" style={{ backgroundColor: theme.bgSurface }}>
                    <div className="flex items-center justify-between">
                      <span className="text-[13px] uppercase tracking-wider font-semibold" style={{ color: theme.textMuted }}>Min Upper Bound Margin</span>
                      <span className="px-2.5 py-0.5 rounded-full text-[13px] font-semibold bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300">Optimal</span>
                    </div>
                    <div className="my-4">
                      <span className="text-[36px] font-bold leading-none tnum" style={{ fontFamily: headingFont, color: theme.textStrong }}>1.45 kN</span>
                      <p className="text-[13px] mt-1" style={{ color: theme.textMuted }}>Lumbar compression upper limit: 3.40 kN</p>
                    </div>
                    <div className="w-full bg-pink-50 dark:bg-purple-950 h-2 rounded-full overflow-hidden">
                      <div className="bg-emerald-400 h-full rounded-full" style={{ width: '65%' }}></div>
                    </div>
                  </div>

                  {/* Technique Consistency Mini Panel */}
                  <div className="p-6 rounded-[24px] shadow-sm border border-pink-100/60 dark:border-purple-950 flex flex-col justify-between" style={{ backgroundColor: theme.bgSurface }}>
                    <div className="flex items-center justify-between">
                      <span className="text-[13px] uppercase tracking-wider font-semibold" style={{ color: theme.textMuted }}>Technique Consistency</span>
                      <span className="px-2.5 py-0.5 rounded-full text-[13px] font-semibold bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300">Precise</span>
                    </div>
                    <div className="my-4 flex items-center justify-between">
                      <div>
                        <span className="text-[36px] font-bold leading-none tnum" style={{ fontFamily: headingFont, color: theme.textStrong }}>96%</span>
                        <p className="text-[13px] mt-1" style={{ color: theme.textMuted }}>Form stability score</p>
                      </div>
                      <Activity className="w-8 h-8 text-pink-400" />
                    </div>
                  </div>
                </div>

              </div>

              {/* Session Heat Calendar Panel (30-day month grid) */}
              <div className="p-6 rounded-[24px] shadow-sm border border-pink-100/60 dark:border-purple-950 space-y-4" style={{ backgroundColor: theme.bgSurface }}>
                <div className="flex items-center justify-between">
                  <div>
                    <h2 className="font-bold text-[20px]" style={{ fontFamily: headingFont, color: theme.textStrong }}>Session Consistency Heat Calendar</h2>
                    <p className="text-[13px]" style={{ color: theme.textMuted }}>30-day month grid color coded by session status.</p>
                  </div>
                  <div className="flex items-center gap-4 text-[13px]">
                    <div className="flex items-center gap-1.5"><span className="w-3 h-3 rounded-full bg-emerald-400"></span><span>Optimal</span></div>
                    <div className="flex items-center gap-1.5"><span className="w-3 h-3 rounded-full bg-amber-400"></span><span>Caution</span></div>
                    <div className="flex items-center gap-1.5"><span className="w-3 h-3 rounded-full bg-coral-400" style={{ backgroundColor: theme.anomaly }}></span><span>Anomaly</span></div>
                  </div>
                </div>

                <div className="grid grid-cols-7 gap-2 pt-2 text-center">
                  {['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'].map((d) => (
                    <span key={d} className="text-[13px] font-bold" style={{ color: theme.textMuted, fontFamily: headingFont }}>{d}</span>
                  ))}
                  {Array.from({ length: 30 }).map((_, i) => {
                    const status = i === 5 || i === 18 ? 'caution' : 'optimal';
                    return (
                      <div 
                        key={i}
                        className="h-12 rounded-xl flex flex-col items-center justify-center p-1 cursor-pointer transition-transform hover:scale-105 border border-pink-50 dark:border-purple-950"
                        style={{
                          backgroundColor: status === 'optimal' ? (isDarkMode ? '#1F3A2B' : '#E8F5E9') : (isDarkMode ? '#3E321F' : '#FFF8E1'),
                        }}
                      >
                        <span className="text-[13px] font-bold tnum" style={{ fontFamily: headingFont, color: theme.textStrong }}>{i + 1}</span>
                        <span className="w-2 h-2 rounded-full mt-1" style={{ backgroundColor: status === 'optimal' ? '#7CC9A0' : '#E8BC68' }}></span>
                      </div>
                    );
                  })}
                </div>
              </div>

            </div>
          )}

          {/* 4. TAB 2: SITES TAB (Small-multiple grid) */}
          {activeTab === 'Sites' && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 animate-fade-in">
              {sitesGridData.map((item, idx) => (
                <div key={idx} className="p-6 rounded-[24px] shadow-sm border border-pink-100/60 dark:border-purple-950 space-y-4 flex flex-col justify-between" style={{ backgroundColor: theme.bgSurface }}>
                  <div className="flex items-start justify-between">
                    <div>
                      <span className="text-[13px] uppercase tracking-wider font-semibold" style={{ color: theme.textMuted }}>Anatomical Site</span>
                      <h3 className="font-bold text-[20px] mt-0.5" style={{ fontFamily: headingFont, color: theme.textStrong }}>{item.site}</h3>
                    </div>
                    <span 
                      className="px-2.5 py-0.5 rounded-full text-[13px] font-bold"
                      style={{
                        backgroundColor: item.status === 'caution' ? '#FEF3C7' : '#E1F5FE',
                        color: item.status === 'caution' ? '#D97706' : '#0288D1',
                        fontFamily: headingFont
                      }}
                    >
                      {item.status === 'caution' ? 'Caution' : 'Optimal'}
                    </span>
                  </div>

                  <div>
                    <p className="text-[13px]" style={{ color: theme.textMuted }}>{item.metric}</p>
                    <div className="flex items-baseline gap-2 mt-1">
                      <span className="text-[28px] font-bold tnum" style={{ fontFamily: headingFont, color: theme.textStrong }}>{item.current}</span>
                      <span className="text-[13px]" style={{ color: theme.textMuted }}>Target: {item.target}</span>
                    </div>
                  </div>

                  {/* Mini Sparkline Chart */}
                  <div className="h-16 w-full flex items-end gap-1.5 p-2 rounded-xl bg-pink-50/50 dark:bg-purple-900/20 border border-pink-100 dark:border-purple-950">
                    {item.trend.map((val, tIdx) => (
                      <div key={tIdx} className="flex-1 rounded-t-sm" style={{ height: `${val}%`, backgroundColor: item.status === 'caution' ? '#E8BC68' : '#7CC9A0' }}></div>
                    ))}
                  </div>

                  <button 
                    onClick={() => alert(`Opening detailed view for ${item.site}`)}
                    className="w-full py-2.5 rounded-xl font-semibold text-[13px] border border-pink-200 dark:border-purple-800 hover:bg-pink-50 dark:hover:bg-purple-900/30 flex items-center justify-center gap-1.5"
                    style={{ color: theme.textStrong, fontFamily: headingFont }}
                  >
                    <span>Inspect Site Profile</span>
                    <ChevronRight className="w-4 h-4" />
                  </button>
                </div>
              ))}
            </div>
          )}

          {/* 5. TAB 3: SESSIONS TAB (Sortable table) */}
          {activeTab === 'Sessions' && (
            <div className="p-6 rounded-[24px] shadow-sm border border-pink-100/60 dark:border-purple-950 overflow-hidden animate-fade-in" style={{ backgroundColor: theme.bgSurface }}>
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="border-b border-pink-100 dark:border-purple-950 text-[13px] font-semibold" style={{ color: theme.textMuted, fontFamily: headingFont }}>
                      <th className="py-3 px-4">Session ID</th>
                      <th className="py-3 px-4">Date</th>
                      <th className="py-3 px-4">Exercise</th>
                      <th className="py-3 px-4">Regime</th>
                      <th className="py-3 px-4">Peak Load</th>
                      <th className="py-3 px-4">Loading Adequacy %</th>
                      <th className="py-3 px-4">Safety Margin</th>
                      <th className="py-3 px-4">Form Score</th>
                      <th className="py-3 px-4">Status</th>
                      <th className="py-3 px-4 text-right">Flags</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-pink-50 dark:divide-purple-950 text-[14px]">
                    {sessionsData.map((s) => (
                      <tr key={s.id} className="hover:bg-pink-50/50 dark:hover:bg-purple-900/20 transition-colors">
                        <td className="py-3.5 px-4 font-bold tnum" style={{ color: theme.textStrong, fontFamily: headingFont }}>{s.id}</td>
                        <td className="py-3.5 px-4 text-[13px] tnum" style={{ color: theme.textMuted }}>{s.date}</td>
                        <td className="py-3.5 px-4 font-semibold" style={{ color: theme.textStrong }}>{s.exercise}</td>
                        <td className="py-3.5 px-4 text-[13px]" style={{ color: theme.textMuted }}>{s.regime}</td>
                        <td className="py-3.5 px-4 font-bold tnum" style={{ color: theme.textStrong }}>{s.load}</td>
                        <td className="py-3.5 px-4 font-bold text-emerald-600 tnum">{s.adequacy}%</td>
                        <td className="py-3.5 px-4 text-[13px] tnum" style={{ color: theme.textMuted }}>{s.safetyMargin}</td>
                        <td className="py-3.5 px-4 font-bold tnum" style={{ color: theme.textStrong }}>{s.formScore}%</td>
                        <td className="py-3.5 px-4">
                          <span 
                            className="px-2.5 py-0.5 rounded-full text-[13px] font-bold"
                            style={{
                              backgroundColor: s.status === 'caution' ? '#FEF3C7' : '#E1F5FE',
                              color: s.status === 'caution' ? '#D97706' : '#0288D1',
                              fontFamily: headingFont
                            }}
                          >
                            {s.status === 'caution' ? 'Caution' : 'Optimal'}
                          </span>
                        </td>
                        <td className="py-3.5 px-4 text-right font-bold tnum" style={{ color: s.flags > 0 ? theme.anomaly : theme.textMuted }}>
                          {s.flags}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* CLAIM BOUNDARY FOOTNOTE */}
          <div className="p-4 rounded-[20px] border border-pink-100/60 dark:border-purple-950 flex items-center justify-between" style={{ backgroundColor: theme.bgSurface }}>
            <div className="flex items-center gap-3">
              <Info className="w-5 h-5 text-purple-500 flex-shrink-0" />
              <p className="text-[13px]" style={{ color: theme.textMuted }}>
                Shows mechanical loading, not bone density. TALA is an edge-accelerated biomechanical digital twin and decision support tool.
              </p>
            </div>
            <span className="text-[13px] font-semibold px-3 py-1 rounded-full bg-pink-100 dark:bg-purple-900 text-pink-700 dark:text-pink-300">
              Claim Boundary Safe
            </span>
          </div>

        </main>
      </div>

    </div>
  );
}