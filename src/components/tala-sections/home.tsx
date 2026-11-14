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
  Play,
  ChevronRight,
  ShieldCheck,
  Flame,
  Activity,
  AlertTriangle,
  RotateCcw,
  Check,
  Circle,
  HelpCircle
} from 'lucide-react';

export default function Home() {
  // State management for navigation, gravity regime, theme, and interactive elements
  const [activeTab, setActiveTab] = useState('Home');
  const [gravityRegime, setGravityRegime] = useState('0.16g');
  const [trendMetric, setTrendMetric] = useState('Femoral strain');
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [sessionStarted, setSessionStarted] = useState(false);
  const [notificationsOpen, setNotificationsOpen] = useState(false);

  // Colors & design tokens matching the TALA specification
  const theme = {
    bgBase: isDarkMode ? '#14111C' : '#FFFBFC',
    bgSurface: isDarkMode ? '#1D1929' : '#FFFFFF',
    bgRaised: isDarkMode ? '#272236' : '#FAF3F7',
    primary100: isDarkMode ? '#3A2536' : '#FDEBF2',
    primary300: '#F7C6D9',
    primary500: '#E58FB0',
    textStrong: isDarkMode ? '#F4EEFA' : '#3B2A4A',
    textBody: isDarkMode ? '#D8CFE4' : '#5A4A6A',
    textMuted: isDarkMode ? '#9E93B0' : '#8A7C99',
    optimal: '#7CC9A0',
    caution: '#E8BC68',
    anomaly: '#E58A7F',
  };

  const navItems = [
    { name: 'Home', icon: Sparkles },
    { name: 'Session', icon: Dumbbell },
    { name: 'Body Map', icon: User },
    { name: 'Trends', icon: TrendingUp },
    { name: 'Check-in', icon: CheckCircle2 },
    { name: 'Assistant', icon: Sparkles },
    { name: 'Sync', icon: Cloud },
    { name: 'Settings', icon: Settings },
  ];

  // Font definitions for exact typography compliance
  const headingFont = `'Quicksand', 'Nunito', system-ui, -apple-system, sans-serif`;
  const bodyFont = `'Inter', 'Source Sans 3', system-ui, sans-serif`;

  return (
    <div 
      className="flex h-screen w-full overflow-hidden select-none transition-colors duration-300" 
      style={{ 
        backgroundColor: theme.bgBase, 
        color: theme.textBody,
        fontFamily: bodyFont
      }}
    >
      {/* Injecting web fonts directly for exact preview rendering */}
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&family=Quicksand:wght@500;600;700&display=swap');
        .tnum { font-feature-settings: 'tnum'; font-variant-numeric: tabular-nums; }
      `}</style>

      {/* MAIN CONTENT WRAPPER */}
      <div className="flex-1 flex flex-col min-w-0 overflow-y-auto">

        {/* DASHBOARD VIEW CONTENT */}
        <main className="flex-1 p-6 lg:p-8 max-w-7xl mx-auto w-full space-y-6">
          
          {/* SIMULATED SESSION MODAL / OVERLAY IF STARTED */}
          {sessionStarted && (
            <div className="p-6 rounded-3xl shadow-xl border border-pink-200 dark:border-purple-800 flex flex-col md:flex-row items-center justify-between gap-4 animate-fade-in" style={{ backgroundColor: theme.bgSurface }}>
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-2xl flex items-center justify-center shadow-xs" style={{ backgroundColor: theme.primary300 }}>
                  <Dumbbell className="w-6 h-6 text-purple-900 animate-bounce" />
                </div>
                <div>
                  <h3 className="font-semibold text-[20px]" style={{ fontFamily: headingFont, color: theme.textStrong }}>Live Session Active — Squat ({gravityRegime} Lunar)</h3>
                  <p className="text-[16px]" style={{ color: theme.textMuted }}>Tier 1 Vision & Tier 2 Inverse Dynamics running. ARED machine load connected.</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <button 
                  onClick={() => setSessionStarted(false)}
                  className="px-5 py-2.5 rounded-full font-bold text-[16px] shadow-sm transition-all hover:opacity-90"
                  style={{ backgroundColor: '#E58A7F', color: '#FFFFFF', fontFamily: headingFont }}
                >
                  End Session & Summary
                </button>
              </div>
            </div>
          )}

          {/* TOP GRID: Greeting & Action */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            
            {/* Greeting Card (6 Cols) */}
            <div className="lg:col-span-6 p-6 rounded-[24px] shadow-sm border border-pink-100/60 dark:border-purple-950 flex flex-col justify-between" style={{ backgroundColor: theme.bgSurface }}>
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-[13px] uppercase tracking-wider font-semibold" style={{ color: theme.textMuted }}>Mission Log • Artemis Gateway</p>
                  <h1 className="text-[28px] font-bold mt-1 leading-snug" style={{ fontFamily: headingFont, color: theme.textStrong }}>Good morning, Alex. Day 42 on the Gateway.</h1>
                </div>
                <div className="w-12 h-12 rounded-full flex items-center justify-center shadow-inner flex-shrink-0" style={{ backgroundColor: theme.bgRaised }}>
                  <Sparkles className="w-6 h-6 text-pink-400" />
                </div>
              </div>
              <div className="mt-6 pt-4 border-t border-pink-50 dark:border-purple-950 flex items-center justify-between">
                <div>
                  <p className="text-[13px]" style={{ color: theme.textMuted }}>Today's Planned Countermeasure</p>
                  <p className="font-semibold text-[16px] mt-0.5 tnum" style={{ fontFamily: headingFont, color: theme.textStrong }}>Squat, 3 x 8 sets at {gravityRegime} (ARED)</p>
                </div>
                <span className="px-3 py-1 rounded-full text-[13px] font-semibold" style={{ backgroundColor: '#E8F2FC', color: '#31689B' }}>
                  Ready
                </span>
              </div>
            </div>

            {/* Primary Action Card (6 Cols) */}
            <div className="lg:col-span-6 p-6 rounded-[24px] shadow-sm border border-pink-100/60 dark:border-purple-950 flex flex-col justify-between" style={{ backgroundColor: theme.bgSurface }}>
              <div>
                <div className="flex items-center justify-between">
                  <span className="text-[13px] uppercase tracking-wider font-semibold" style={{ color: theme.textMuted }}>Execution Portal</span>
                  <span className="text-[13px] font-medium px-2.5 py-0.5 rounded-full bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300 flex items-center gap-1.5">
                    <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
                    Camera Active
                  </span>
                </div>
                <h2 className="text-[20px] font-semibold mt-2" style={{ fontFamily: headingFont, color: theme.textStrong }}>Ready for today's biomechanical twin session?</h2>
              </div>
              <div className="mt-6 flex items-center gap-3">
                <button
                  onClick={() => setSessionStarted(true)}
                  className="flex-1 py-3.5 px-6 rounded-full font-bold text-[16px] shadow-md transition-all transform hover:scale-[1.01] active:scale-[0.99] flex items-center justify-center gap-2"
                  style={{ backgroundColor: theme.primary300, color: theme.textStrong, fontFamily: headingFont }}
                >
                  <Play className="w-4 h-4 fill-current" />
                  <span>Start Session ({gravityRegime})</span>
                </button>
                <button 
                  onClick={() => setActiveTab('Check-in')}
                  className="px-5 py-3.5 rounded-full font-semibold text-[16px] transition-all border border-pink-200 dark:border-purple-800 hover:bg-pink-50 dark:hover:bg-purple-900/30"
                  style={{ color: theme.textStrong, fontFamily: headingFont }}
                >
                  Do check-in first
                </button>
              </div>
            </div>
          </div>

          {/* METRIC CARDS ROW (3 Cards) */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            
            {/* Card 1: Mechanical Loading Index */}
            <div className="p-6 rounded-[24px] shadow-sm border border-pink-100/60 dark:border-purple-950 flex flex-col justify-between" style={{ backgroundColor: theme.bgSurface }}>
              <div className="flex items-center justify-between">
                <h2 className="font-semibold text-[20px]" style={{ fontFamily: headingFont, color: theme.textStrong }}>Mechanical Loading Index</h2>
                <span className="px-2.5 py-0.5 rounded-full text-[13px] font-semibold" style={{ backgroundColor: '#E1F5FE', color: '#0288D1' }}>Optimal</span>
              </div>
              <div className="my-6 flex items-center justify-between">
                <div>
                  <span className="text-[40px] font-bold leading-none tnum" style={{ fontFamily: headingFont, color: theme.textStrong }}>84%</span>
                  <p className="text-[13px] mt-1" style={{ color: theme.textMuted }}>of today's target stimulus</p>
                </div>
                {/* SVG Circular Ring - Exact non-pixelated SVG render */}
                <div className="w-16 h-16 relative flex items-center justify-center">
                  <svg className="w-16 h-16 transform -rotate-90" viewBox="0 0 36 36">
                    <path
                      className="text-purple-100 dark:text-purple-950"
                      strokeWidth="3.5"
                      stroke="currentColor"
                      fill="none"
                      d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                    />
                    <path
                      className="text-emerald-400"
                      strokeDasharray="84, 100"
                      strokeWidth="3.5"
                      strokeLinecap="round"
                      stroke="currentColor"
                      fill="none"
                      d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                    />
                  </svg>
                  <span className="absolute text-[13px] font-bold tnum" style={{ fontFamily: headingFont, color: theme.textStrong }}>84%</span>
                </div>
              </div>
              <p className="text-[13px] pt-3 border-t border-pink-50 dark:border-purple-950" style={{ color: theme.textMuted }}>
                Measures mechanical stimulus delivered, not bone status.
              </p>
            </div>

            {/* Card 2: Peak Femoral Strain */}
            <div className="p-6 rounded-[24px] shadow-sm border border-pink-100/60 dark:border-purple-950 flex flex-col justify-between" style={{ backgroundColor: theme.bgSurface }}>
              <div className="flex items-center justify-between">
                <h2 className="font-semibold text-[20px]" style={{ fontFamily: headingFont, color: theme.textStrong }}>Peak Femoral Strain</h2>
                <span className="px-2.5 py-0.5 rounded-full text-[13px] font-semibold" style={{ backgroundColor: '#FEF3C7', color: '#D97706' }}>Caution</span>
              </div>
              <div className="my-6 flex items-center justify-between">
                <div>
                  <span className="text-[40px] font-bold leading-none tnum" style={{ fontFamily: headingFont, color: theme.textStrong }}>82%</span>
                  <p className="text-[13px] mt-1" style={{ color: theme.textMuted }}>vs 1g pre-flight reference</p>
                </div>
                <div className="text-right">
                  <span className="text-[13px] font-bold text-emerald-600 dark:text-emerald-400 flex items-center justify-end gap-1 tnum">
                    <TrendingUp className="w-3.5 h-3.5" /> +4% vs yesterday
                  </span>
                  <p className="text-[13px]" style={{ color: theme.textMuted }}>Target range: 80-110%</p>
                </div>
              </div>
              <div className="w-full bg-pink-50 dark:bg-purple-950 h-2 rounded-full overflow-hidden">
                <div className="bg-amber-400 h-full rounded-full" style={{ width: '82%' }}></div>
              </div>
            </div>

            {/* Card 3: Form Stability */}
            <div className="p-6 rounded-[24px] shadow-sm border border-pink-100/60 dark:border-purple-950 flex flex-col justify-between" style={{ backgroundColor: theme.bgSurface }}>
              <div className="flex items-center justify-between">
                <h2 className="font-semibold text-[20px]" style={{ fontFamily: headingFont, color: theme.textStrong }}>Form Stability</h2>
                <span className="px-2.5 py-0.5 rounded-full text-[13px] font-semibold" style={{ backgroundColor: '#E1F5FE', color: '#0288D1' }}>Precise</span>
              </div>
              <div className="my-6 flex items-center justify-between">
                <div>
                  <span className="text-[40px] font-bold leading-none tnum" style={{ fontFamily: headingFont, color: theme.textStrong }}>96%</span>
                  <p className="text-[13px] mt-1" style={{ color: theme.textMuted }}>Last session kinematic score</p>
                </div>
                <div className="w-12 h-12 rounded-2xl flex items-center justify-center" style={{ backgroundColor: '#F1EAFB' }}>
                  <Activity className="w-6 h-6 text-purple-600" />
                </div>
              </div>
              <p className="text-[13px] pt-3 border-t border-pink-50 dark:border-purple-950" style={{ color: theme.textMuted }}>
                Zero lumbar flexion anomalies detected.
              </p>
            </div>

          </div>

          {/* LOWER GRID: Trends & Streak / Last Session */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            
            {/* 30-Day Trend Panel (8 Cols) */}
            <div className="lg:col-span-8 p-6 rounded-[24px] shadow-sm border border-pink-100/60 dark:border-purple-950 flex flex-col justify-between" style={{ backgroundColor: theme.bgSurface }}>
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
                <div>
                  <h2 className="font-bold text-[20px]" style={{ fontFamily: headingFont, color: theme.textStrong }}>30-Day Longitudinal Micro-Analytics</h2>
                  <p className="text-[13px]" style={{ color: theme.textMuted }}>Edge-computed biomechanical trends across missions</p>
                </div>
                {/* Metric Selector Toggle */}
                <div className="flex bg-gray-100 dark:bg-purple-900/40 p-1 rounded-xl text-[13px] font-medium">
                  {['Femoral strain', 'Lumbar moment', 'Session count'].map((metric) => (
                    <button
                      key={metric}
                      onClick={() => setTrendMetric(metric)}
                      className={`px-3 py-1.5 rounded-lg transition-all ${
                        trendMetric === metric ? 'shadow-xs font-bold' : 'opacity-70 hover:opacity-100'
                      }`}
                      style={{
                        fontFamily: headingFont,
                        backgroundColor: trendMetric === metric ? theme.bgSurface : 'transparent',
                        color: trendMetric === metric ? theme.textStrong : theme.textMuted,
                      }}
                    >
                      {metric}
                    </button>
                  ))}
                </div>
              </div>

              {/* Sparkline Chart */}
              <div className="h-48 w-full flex items-end gap-2 pt-6 px-2 border-b border-pink-100 dark:border-purple-950 relative">
                {/* Background Threshold Safe Band */}
                <div className="absolute inset-x-0 bottom-16 top-8 bg-emerald-500/5 rounded-xl border border-dashed border-emerald-500/20 pointer-events-none flex items-center px-3">
                  <span className="text-[13px] text-emerald-600 font-semibold uppercase tracking-wider">Target Effective Range (80% - 110%)</span>
                </div>

                {[45, 52, 48, 60, 65, 72, 70, 78, 82, 80, 85, 88, 84, 82, 86, 90, 88, 85, 82, 84, 86, 89, 91, 88, 84, 82, 85, 87, 86, 84].map((val, idx) => (
                  <div key={idx} className="flex-1 flex flex-col items-center h-full justify-end group relative">
                    <div 
                      className="w-full rounded-t-md transition-all duration-300 group-hover:brightness-110"
                      style={{ 
                        height: `${val}%`, 
                        backgroundColor: val > 80 ? '#7CC9A0' : '#E8BC68' 
                      }}
                    ></div>
                    {/* Tooltip on hover */}
                    <div className="absolute -top-8 hidden group-hover:flex flex-col items-center bg-gray-900 text-white text-[13px] px-2 py-1 rounded shadow-md z-10 whitespace-nowrap tnum">
                      <span>Day {idx + 1}: {val}%</span>
                    </div>
                  </div>
                ))}
              </div>

              <div className="flex items-center justify-between pt-4 text-[13px]" style={{ color: theme.textMuted }}>
                <span>Day 1 (Pre-flight 1g Ref)</span>
                <span>Today (Day 42)</span>
              </div>
            </div>

            {/* Streak & Milestones + Last Session (4 Cols) */}
            <div className="lg:col-span-4 space-y-6">
              
              {/* Streak Card */}
              <div className="p-6 rounded-[24px] shadow-sm border border-pink-100/60 dark:border-purple-950 flex items-center justify-between" style={{ backgroundColor: theme.bgSurface }}>
                <div>
                  <span className="text-[13px] uppercase tracking-wider font-semibold" style={{ color: theme.textMuted }}>Consistency Streak</span>
                  <h2 className="text-[28px] font-bold mt-1 tnum" style={{ fontFamily: headingFont, color: theme.textStrong }}>42 Days Active</h2>
                  <p className="text-[13px] mt-1" style={{ color: theme.textMuted }}>Next milestone: 50-Day Lunar Explorer</p>
                </div>
                <div className="w-14 h-14 rounded-2xl flex items-center justify-center shadow-xs" style={{ backgroundColor: '#FDEBF2' }}>
                  <Flame className="w-7 h-7 text-pink-500" />
                </div>
              </div>

              {/* Last Session Summary Card */}
              <div className="p-6 rounded-[24px] shadow-sm border border-pink-100/60 dark:border-purple-950 space-y-4" style={{ backgroundColor: theme.bgSurface }}>
                <div className="flex items-center justify-between">
                  <div>
                    <span className="text-[13px] uppercase tracking-wider font-semibold" style={{ color: theme.textMuted }}>Last Session • Yesterday</span>
                    <h2 className="font-semibold text-[20px] mt-0.5 tnum" style={{ fontFamily: headingFont, color: theme.textStrong }}>Deadlift (3 x 6 at 0.16g)</h2>
                  </div>
                  <span className="px-2.5 py-0.5 rounded-full text-[13px] font-semibold bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300">Optimal</span>
                </div>

                {/* Pip-Timeline with SVG dots instead of emojis */}
                <div>
                  <p className="text-[13px] mb-2" style={{ color: theme.textMuted }}>Rep-by-rep form pips (Set 1 to 3):</p>
                  <div className="flex items-center gap-1.5 flex-wrap">
                    {[
                      'optimal', 'optimal', 'optimal', 'optimal', 'caution', 'optimal',
                      'optimal', 'optimal', 'optimal', 'optimal', 'optimal', 'optimal',
                      'optimal', 'optimal', 'optimal', 'optimal', 'optimal', 'caution'
                    ].map((status, i) => (
                      <div 
                        key={i}
                        className={`w-3.5 h-3.5 rounded-full flex items-center justify-center transition-transform hover:scale-125 cursor-pointer`}
                        style={{ backgroundColor: status === 'optimal' ? '#7CC9A0' : '#E8BC68' }}
                        title={`Rep ${i+1}: ${status === 'optimal' ? 'Form Stable' : 'Minor Caution'}`}
                      >
                        <span className="w-1.5 h-1.5 rounded-full bg-white opacity-80"></span>
                      </div>
                    ))}
                  </div>
                </div>

                <button 
                  onClick={() => setActiveTab('Session')}
                  className="w-full py-2.5 rounded-xl font-semibold text-[13px] transition-colors border border-pink-200 dark:border-purple-800 hover:bg-pink-50 dark:hover:bg-purple-900/30 flex items-center justify-center gap-2"
                  style={{ color: theme.textStrong, fontFamily: headingFont }}
                >
                  <span>Open Full Session Summary</span>
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>

            </div>

          </div>

          {/* ATTENTION LIST / FOOTER STATUS */}
          <div className="p-4 rounded-[20px] border border-pink-100/60 dark:border-purple-950 flex items-center justify-between" style={{ backgroundColor: theme.bgSurface }}>
            <div className="flex items-center gap-3">
              <ShieldCheck className="w-5 h-5 text-emerald-500" />
              <div>
                <h2 className="font-semibold text-[16px]" style={{ fontFamily: headingFont, color: theme.textStrong }}>Attention List</h2>
                <p className="text-[13px]" style={{ color: theme.textMuted }}>Nothing needs attention. All kinematic parameters within cited literature safety thresholds.</p>
              </div>
            </div>
            <span className="text-[13px] font-semibold px-3 py-1 rounded-full bg-pink-100 dark:bg-purple-900 text-pink-700 dark:text-pink-300">
              Clear
            </span>
          </div>

        </main>
      </div>

    </div>
  );
}