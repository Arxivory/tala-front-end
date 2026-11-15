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
  ChevronDown,
  ChevronUp,
  Orbit,
  Compass
} from 'lucide-react';
import { useNavigate } from '@tanstack/react-router';

export default function App() {
  // State management for navigation, gravity regime, theme, and progressive disclosure
  const [activeTab, setActiveTab] = useState('Home');
  const [gravityRegime, setGravityRegime] = useState('0.16g');
  const [trendMetric, setTrendMetric] = useState('Femoral strain');
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [sessionStarted, setSessionStarted] = useState(false);
  const [notificationsOpen, setNotificationsOpen] = useState(false);
  const navigate = useNavigate();
  
  // Progressive disclosure toggle so astronauts aren't overwhelmed at first glance
  const [showDetailedAnalytics, setShowDetailedAnalytics] = useState(false);

  // Calming, low-glare Pastel Pink & Twilight Rose design tokens
  const theme = {
    bgBase: isDarkMode ? '#1A131A' : '#FFF7FA',       // Ultra-soft blush white / deep plum-rose
    bgSurface: isDarkMode ? '#241B24' : '#FFFDFE',    // Frosted petal surface
    bgRaised: isDarkMode ? '#2F232F' : '#FCEFF4',     // Warm pastel pink tint
    borderSoft: isDarkMode ? 'rgba(244, 194, 214, 0.14)' : 'rgba(235, 168, 195, 0.35)',
    primary100: isDarkMode ? '#3D2838' : '#FDE8F0',
    primary200: isDarkMode ? '#52344A' : '#FAD4E4',
    primary300: '#F5B8D1',                            // Signature soft pastel rose
    primary400: '#EC9EC0',
    primary500: '#DF7FA8',
    textStrong: isDarkMode ? '#FBF0F5' : '#4A2E3D',   // Deep warm plum-berry (less harsh than pure black)
    textBody: isDarkMode ? '#DFC7D3' : '#6E4E5F',
    textMuted: isDarkMode ? '#A88999' : '#9C7B8C',
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

  const headingFont = `'Quicksand', 'Nunito', system-ui, -apple-system, sans-serif`;
  const bodyFont = `'Inter', 'Source Sans 3', system-ui, sans-serif`;

  return (
    <div 
      className="relative flex h-screen w-full overflow-hidden select-none transition-colors duration-500" 
      style={{ 
        backgroundColor: theme.bgBase, 
        color: theme.textBody,
        fontFamily: bodyFont
      }}
    >
      {/* Web Fonts */}
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&family=Quicksand:wght@500;600;700&display=swap');
        .tnum { font-feature-settings: 'tnum'; font-variant-numeric: tabular-nums; }
      `}</style>

      {/* MAIN CONTENT WRAPPER */}
      <div className="relative z-10 flex-1 flex flex-col min-w-0 overflow-y-auto">

        {/* CALM, BREATHABLE DASHBOARD VIEW CONTENT */}
        <main className="mx-auto flex w-full max-w-7xl flex-col gap-6 px-3 py-6 sm:px-4 lg:px-6">
          
          {/* ACTIVE SESSION BANNER (Appears smoothly when started) */}
          {sessionStarted && (
            <div 
              className="p-6 rounded-[28px] shadow-md backdrop-blur-md flex flex-col md:flex-row items-center justify-between gap-4 transition-all" 
              style={{ backgroundColor: theme.bgSurface, border: `1px solid ${theme.primary300}` }}
            >
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-2xl flex items-center justify-center" style={{ backgroundColor: theme.primary200 }}>
                  <Dumbbell className="w-6 h-6 animate-bounce" style={{ color: theme.textStrong }} />
                </div>
                <div>
                  <h3 className="font-bold text-[19px]" style={{ fontFamily: headingFont, color: theme.textStrong }}>
                    Live Session Active — Squat ({gravityRegime} Lunar)
                  </h3>
                  <p className="text-[14px]" style={{ color: theme.textMuted }}>
                    Optical kinematics & inverse dynamics active. ARED telemetry connected.
                  </p>
                </div>
              </div>
              <button 
                onClick={() => setSessionStarted(false)}
                className="px-6 py-3 rounded-full font-bold text-[14px] shadow-xs transition-all hover:opacity-90"
                style={{ backgroundColor: theme.anomaly, color: '#FFFFFF', fontFamily: headingFont }}
              >
                End Session & View Summary
              </button>
            </div>
          )}

          {/* HERO FOCUS CARD: Unified Greeting + Today's Action (Connected to the Space Landscape) */}
          <div 
            className="relative overflow-hidden p-7 lg:p-8 rounded-[32px] shadow-sm backdrop-blur-md flex flex-col lg:flex-row lg:items-center justify-between gap-6 transition-all" 
            style={{ 
              backgroundColor: isDarkMode ? 'rgba(36, 27, 36, 0.85)' : 'rgba(255, 253, 254, 0.88)',
              border: `1px solid ${theme.borderSoft}` 
            }}
          >
            {/* Subtle Connecting Mini-Horizon & Rocket Greeting Emblem inside Card */}
            <div className="space-y-3 max-w-xl relative z-10">
              <div className="flex items-center gap-2.5 flex-wrap">
                <span 
                  className="px-3 py-1 rounded-full text-[12px] font-semibold flex items-center gap-1.5"
                  style={{ backgroundColor: theme.primary100, color: theme.textStrong, fontFamily: headingFont }}
                >
                  <Orbit className="w-3.5 h-3.5" style={{ color: theme.primary500 }} />
                  Lunar Orbit • Day 42
                </span>
                <span className="text-[12px] font-medium flex items-center gap-1.5 text-emerald-600 dark:text-emerald-400">
                  <span className="w-2 h-2 rounded-full bg-emerald-400"></span>
                  Optical Twin Ready
                </span>
              </div>

              <div className="flex items-center gap-3.5">
                {/* Static Greeting Rocket Icon Badge */}
                <div 
                  className="w-11 h-11 rounded-2xl flex items-center justify-center flex-shrink-0 shadow-2xs"
                  style={{ backgroundColor: theme.primary100, border: `1px solid ${theme.borderSoft}` }}
                  title="Artemis Gateway Shuttle • Calm Orbit"
                >
                  <svg className="w-6 h-6" viewBox="0 0 24 24" fill="none">
                    <path d="M14.5 4.5C17.5 4.5 19.5 6.5 19.5 9.5C19.5 13 15.5 16.5 11.5 18.5L5.5 12.5C7.5 8.5 11 4.5 14.5 4.5Z" fill={isDarkMode ? '#F5B8D1' : '#FAD4E4'} stroke={theme.primary500} strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"/>
                    <path d="M9 15L5 19M6.5 13.5L3.5 16.5M10.5 17.5L7.5 20.5" stroke={theme.primary500} strokeWidth="1.5" strokeLinecap="round"/>
                    <circle cx="14.5" cy="9.5" r="1.8" fill={isDarkMode ? '#241B24' : '#FFFDFE'} stroke={theme.primary500} strokeWidth="1.4"/>
                  </svg>
                </div>
                <h1 className="text-[28px] lg:text-[32px] font-bold leading-tight" style={{ fontFamily: headingFont, color: theme.textStrong }}>
                  Good morning, Alex.
                </h1>
              </div>
              
              <p className="text-[15px] leading-relaxed" style={{ color: theme.textBody }}>
                Today's countermeasure: <strong style={{ color: theme.textStrong }} className="tnum">Squat, 3 × 8 sets at {gravityRegime} (ARED)</strong>. 
                All biomechanical baselines are calm and calibrated.
              </p>
            </div>

            {/* Clear, High-Comfort Primary Actions */}
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 flex-shrink-0">
              <button
                onClick={() => navigate({ to: '/app/session' })}
                className="py-4 px-7 rounded-full font-bold text-[15px] shadow-sm transition-all transform hover:scale-[1.02] active:scale-[0.98] flex items-center justify-center gap-2.5"
                style={{ 
                  background: 'linear-gradient(135deg, #F7C6D9 0%, #ECA6C4 100%)', 
                  color: '#4A2E3D', 
                  fontFamily: headingFont 
                }}
              >
                <Play className="w-4 h-4 fill-current" />
                <span>Start Session ({gravityRegime})</span>
              </button>

              <button 
                onClick={() => navigate({ to: '/app/checkin' })}
                className="py-4 px-6 rounded-full font-semibold text-[15px] transition-all hover:opacity-85 flex items-center justify-center gap-2"
                style={{ 
                  backgroundColor: theme.bgRaised, 
                  color: theme.textStrong, 
                  border: `1px solid ${theme.borderSoft}`,
                  fontFamily: headingFont ,
                  cursor: 'pointer'
                }}
              >
                <span>Quick Check-in</span>
              </button>
            </div>
          </div>

          {/* CORE BIOMECHANICAL SNAPSHOT (3 Clean, Uncluttered Cards) */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            
            {/* Card 1: Mechanical Loading Index */}
            <div 
              className="p-6 rounded-[28px] shadow-sm backdrop-blur-md flex flex-col justify-between transition-transform duration-300 hover:-translate-y-0.5" 
              style={{ backgroundColor: theme.bgSurface, border: `1px solid ${theme.borderSoft}` }}
            >
              <div className="flex items-center justify-between">
                <span className="text-[14px] font-semibold" style={{ fontFamily: headingFont, color: theme.textBody }}>Loading Index</span>
                <span className="px-2.5 py-0.5 rounded-full text-[12px] font-semibold bg-emerald-50 text-emerald-700 dark:bg-emerald-950/60 dark:text-emerald-300">Optimal</span>
              </div>
              
              <div className="my-5 flex items-center justify-between">
                <div>
                  <span className="text-[38px] font-bold leading-none tnum" style={{ fontFamily: headingFont, color: theme.textStrong }}>84%</span>
                  <p className="text-[13px] mt-1.5" style={{ color: theme.textMuted }}>of daily target stimulus</p>
                </div>
                <div className="w-14 h-14 relative flex items-center justify-center">
                  <svg className="w-14 h-14 transform -rotate-90" viewBox="0 0 36 36">
                    <path
                      stroke={theme.primary100}
                      strokeWidth="3.5"
                      fill="none"
                      d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                    />
                    <path
                      stroke={theme.optimal}
                      strokeDasharray="84, 100"
                      strokeWidth="3.5"
                      strokeLinecap="round"
                      fill="none"
                      d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                    />
                  </svg>
                </div>
              </div>

              <p className="text-[12px]" style={{ color: theme.textMuted }}>
                Mechanical stimulus delivered, not bone status.
              </p>
            </div>

            {/* Card 2: Peak Femoral Strain */}
            <div 
              className="p-6 rounded-[28px] shadow-sm backdrop-blur-md flex flex-col justify-between transition-transform duration-300 hover:-translate-y-0.5" 
              style={{ backgroundColor: theme.bgSurface, border: `1px solid ${theme.borderSoft}` }}
            >
              <div className="flex items-center justify-between">
                <span className="text-[14px] font-semibold" style={{ fontFamily: headingFont, color: theme.textBody }}>Femoral Strain</span>
                <span className="px-2.5 py-0.5 rounded-full text-[12px] font-semibold bg-amber-50 text-amber-700 dark:bg-amber-950/60 dark:text-amber-300">Target Range</span>
              </div>

              <div className="my-5 flex items-baseline justify-between">
                <div>
                  <span className="text-[38px] font-bold leading-none tnum" style={{ fontFamily: headingFont, color: theme.textStrong }}>82%</span>
                  <p className="text-[13px] mt-1.5" style={{ color: theme.textMuted }}>vs 1g pre-flight ref</p>
                </div>
                <span className="text-[13px] font-semibold text-emerald-600 dark:text-emerald-400 flex items-center gap-1 tnum">
                  <TrendingUp className="w-3.5 h-3.5" /> +4%
                </span>
              </div>

              <div className="space-y-1.5">
                <div className="w-full h-2 rounded-full overflow-hidden" style={{ backgroundColor: theme.primary100 }}>
                  <div className="h-full rounded-full transition-all duration-500" style={{ width: '82%', backgroundColor: theme.primary400 }}></div>
                </div>
                <div className="flex justify-between text-[11px] tnum" style={{ color: theme.textMuted }}>
                  <span>0%</span>
                  <span>Target: 80–110%</span>
                </div>
              </div>
            </div>

            {/* Card 3: Form Stability */}
            <div 
              className="p-6 rounded-[28px] shadow-sm backdrop-blur-md flex flex-col justify-between transition-transform duration-300 hover:-translate-y-0.5" 
              style={{ backgroundColor: theme.bgSurface, border: `1px solid ${theme.borderSoft}` }}
            >
              <div className="flex items-center justify-between">
                <span className="text-[14px] font-semibold" style={{ fontFamily: headingFont, color: theme.textBody }}>Form Stability</span>
                <span className="px-2.5 py-0.5 rounded-full text-[12px] font-semibold bg-emerald-50 text-emerald-700 dark:bg-emerald-950/60 dark:text-emerald-300">Precise</span>
              </div>

              <div className="my-5 flex items-center justify-between">
                <div>
                  <span className="text-[38px] font-bold leading-none tnum" style={{ fontFamily: headingFont, color: theme.textStrong }}>96%</span>
                  <p className="text-[13px] mt-1.5" style={{ color: theme.textMuted }}>Kinematic alignment</p>
                </div>
                <div className="w-12 h-12 rounded-2xl flex items-center justify-center" style={{ backgroundColor: theme.primary100 }}>
                  <Activity className="w-6 h-6" style={{ color: theme.primary500 }} />
                </div>
              </div>

              <p className="text-[12px]" style={{ color: theme.textMuted }}>
                Zero lumbar flexion anomalies detected.
              </p>
            </div>

          </div>

          {/* CALM STATUS & PROGRESSIVE DISCLOSURE BAR */}
          <div 
            className="p-5 rounded-[24px] backdrop-blur-md flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4" 
            style={{ backgroundColor: theme.bgSurface, border: `1px solid ${theme.borderSoft}` }}
          >
            <div className="flex items-center gap-3.5">
              <div className="w-10 h-10 rounded-2xl flex items-center justify-center flex-shrink-0" style={{ backgroundColor: theme.primary100 }}>
                <ShieldCheck className="w-5 h-5 text-emerald-500" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h2 className="font-bold text-[15px]" style={{ fontFamily: headingFont, color: theme.textStrong }}>All Parameters Nominal</h2>
                  <span className="text-[12px] font-semibold px-2.5 py-0.5 rounded-full" style={{ backgroundColor: theme.primary100, color: theme.textStrong }}>
                    42-Day Streak
                  </span>
                </div>
                <p className="text-[13px]" style={{ color: theme.textMuted }}>
                  Yesterday: Squats (3 × 6 at 0.16g) • All thresholds within NASA-STD-3001 bounds.
                </p>
              </div>
            </div>

            {/* Expand/Collapse Deep Telemetry Toggle */}
            <button
              onClick={() => setShowDetailedAnalytics(!showDetailedAnalytics)}
              className="px-4 py-2.5 rounded-full text-[13px] font-bold transition-all flex items-center gap-2 self-end sm:self-auto"
              style={{ 
                backgroundColor: theme.bgRaised, 
                color: theme.textStrong, 
                border: `1px solid ${theme.borderSoft}`,
                fontFamily: headingFont 
              }}
            >
              <span>{showDetailedAnalytics ? 'Hide Detailed Telemetry' : 'Explore 30-Day Trends & Reps'}</span>
              {showDetailedAnalytics ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
            </button>
          </div>

          {/* PROGRESSIVELY DISCLOSED ANALYTICS (All original details preserved, zero clutter until needed) */}
          {showDetailedAnalytics && (
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 pt-2 animate-fade-in">
              
              {/* 30-Day Trend Panel (8 Cols) */}
              <div 
                className="lg:col-span-8 p-6 rounded-[28px] shadow-sm backdrop-blur-md flex flex-col justify-between" 
                style={{ backgroundColor: theme.bgSurface, border: `1px solid ${theme.borderSoft}` }}
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
                  <div>
                    <h2 className="font-bold text-[18px]" style={{ fontFamily: headingFont, color: theme.textStrong }}>30-Day Longitudinal Micro-Analytics</h2>
                    <p className="text-[13px]" style={{ color: theme.textMuted }}>Edge-computed biomechanical trends across mission days</p>
                  </div>

                  {/* Metric Selector Toggle */}
                  <div className="flex p-1 rounded-xl text-[12px] font-medium" style={{ backgroundColor: theme.bgRaised }}>
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

                {/* Soft Pastel Sparkline Chart */}
                <div className="h-44 w-full flex items-end gap-1.5 pt-6 px-2 relative" style={{ borderBottom: `1px solid ${theme.borderSoft}` }}>
                  <div 
                    className="absolute inset-x-0 bottom-14 top-8 rounded-xl border border-dashed pointer-events-none flex items-center px-3"
                    style={{ backgroundColor: 'rgba(124, 201, 160, 0.06)', borderColor: 'rgba(124, 201, 160, 0.25)' }}
                  >
                    <span className="text-[11px] text-emerald-600 dark:text-emerald-400 font-semibold uppercase tracking-wider">
                      Target Effective Range (80% – 110%)
                    </span>
                  </div>

                  {[45, 52, 48, 60, 65, 72, 70, 78, 82, 80, 85, 88, 84, 82, 86, 90, 88, 85, 82, 84, 86, 89, 91, 88, 84, 82, 85, 87, 86, 84].map((val, idx) => (
                    <div key={idx} className="flex-1 flex flex-col items-center h-full justify-end group relative">
                      <div 
                        className="w-full rounded-t-md transition-all duration-300 group-hover:opacity-80"
                        style={{ 
                          height: `${val}%`, 
                          backgroundColor: val > 80 ? theme.primary400 : '#E8BC68' 
                        }}
                      ></div>
                      <div className="absolute -top-8 hidden group-hover:flex flex-col items-center px-2 py-1 rounded-lg shadow-sm z-10 whitespace-nowrap tnum text-[11px] font-semibold" style={{ backgroundColor: theme.textStrong, color: theme.bgSurface }}>
                        <span>Day {idx + 1}: {val}%</span>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="flex items-center justify-between pt-3 text-[12px]" style={{ color: theme.textMuted }}>
                  <span>Day 1 (Pre-flight 1g Ref)</span>
                  <span>Today (Day 42)</span>
                </div>
              </div>

              {/* Streak & Last Session Rep Pips (4 Cols) */}
              <div className="lg:col-span-4 space-y-6">
                
                {/* Streak Card */}
                <div 
                  className="p-5 rounded-[28px] shadow-sm backdrop-blur-md flex items-center justify-between" 
                  style={{ backgroundColor: theme.bgSurface, border: `1px solid ${theme.borderSoft}` }}
                >
                  <div>
                    <span className="text-[12px] uppercase tracking-wider font-semibold" style={{ color: theme.textMuted }}>Consistency Streak</span>
                    <h3 className="text-[24px] font-bold mt-0.5 tnum" style={{ fontFamily: headingFont, color: theme.textStrong }}>42 Days Active</h3>
                    <p className="text-[12px] mt-0.5" style={{ color: theme.textMuted }}>Next milestone: 50-Day Lunar Explorer</p>
                  </div>
                  <div className="w-12 h-12 rounded-2xl flex items-center justify-center" style={{ backgroundColor: theme.primary100 }}>
                    <Flame className="w-6 h-6" style={{ color: theme.primary500 }} />
                  </div>
                </div>

                {/* Last Session Rep Pips Card */}
                <div 
                  className="p-5 rounded-[28px] shadow-sm backdrop-blur-md space-y-3.5" 
                  style={{ backgroundColor: theme.bgSurface, border: `1px solid ${theme.borderSoft}` }}
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <span className="text-[12px] uppercase tracking-wider font-semibold" style={{ color: theme.textMuted }}>Last Session • Yesterday</span>
                      <h3 className="font-bold text-[16px] mt-0.5 tnum" style={{ fontFamily: headingFont, color: theme.textStrong }}>Deadlift (3 × 6 at 0.16g)</h3>
                    </div>
                    <span className="px-2.5 py-0.5 rounded-full text-[12px] font-semibold bg-emerald-50 text-emerald-700 dark:bg-emerald-950/60 dark:text-emerald-300">Optimal</span>
                  </div>

                  <div>
                    <p className="text-[12px] mb-2" style={{ color: theme.textMuted }}>Rep-by-rep form pips (Set 1 to 3):</p>
                    <div className="flex items-center gap-1.5 flex-wrap">
                      {[
                        'optimal', 'optimal', 'optimal', 'optimal', 'caution', 'optimal',
                        'optimal', 'optimal', 'optimal', 'optimal', 'optimal', 'optimal',
                        'optimal', 'optimal', 'optimal', 'optimal', 'optimal', 'caution'
                      ].map((status, i) => (
                        <div 
                          key={i}
                          className="w-3.5 h-3.5 rounded-full flex items-center justify-center transition-transform hover:scale-125 cursor-pointer"
                          style={{ backgroundColor: status === 'optimal' ? theme.optimal : theme.caution }}
                          title={`Rep ${i+1}: ${status === 'optimal' ? 'Form Stable' : 'Minor Caution'}`}
                        >
                          <span className="w-1.5 h-1.5 rounded-full bg-white opacity-80"></span>
                        </div>
                      ))}
                    </div>
                  </div>

                  <button 
                    onClick={() => setActiveTab('Session')}
                    className="w-full py-2.5 rounded-xl font-semibold text-[13px] transition-opacity hover:opacity-85 flex items-center justify-center gap-1.5"
                    style={{ backgroundColor: theme.bgRaised, color: theme.textStrong, fontFamily: headingFont }}
                  >
                    <span>Open Full Session Summary</span>
                    <ChevronRight className="w-4 h-4" />
                  </button>
                </div>

              </div>
            </div>
          )}

        </main>
      </div>

    </div>
  );
}