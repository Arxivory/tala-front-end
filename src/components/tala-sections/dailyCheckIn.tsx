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
  Info,
  Check,
  AlertTriangle,
  Smile,
  Frown,
  Meh,
  Bed,
  Battery,
  BatteryCharging,
  BatteryWarning,
  Flame,
  Heart,
  Droplets,
  Apple,
  ChevronDown,
  HelpCircle,
  Activity
} from 'lucide-react';
import { useApp } from '@/lib/app-state';
import type { CheckIn } from '@/data/types';

type SleepQualityLabel = 'Poor' | 'Fair' | 'Good';
type FatigueLevel = 'None' | 'Mild' | 'Moderate' | 'High' | 'Severe';
type SorenessSeverity = 'None' | 'Mild' | 'Moderate' | 'Severe';

const fatigueValues: Record<FatigueLevel, CheckIn['fatigue']> = {
  None: 'none',
  Mild: 'mild',
  Moderate: 'moderate',
  High: 'high',
  Severe: 'severe',
};
const sleepQualityValues: Record<SleepQualityLabel, CheckIn['sleepQuality']> = {
  Poor: 1,
  Fair: 3,
  Good: 5,
};
const sorenessValues: Record<Exclude<SorenessSeverity, 'None'>, CheckIn['soreness'][number]['severity']> = {
  Mild: 'mild',
  Moderate: 'moderate',
  Severe: 'high',
};

export default function DailyCheckIn() {
  const { saveCheckIn } = useApp();
  // Global & Theme State
  const [activeTab, setActiveTab] = useState('Check-in');
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [showRulesExplanation, setShowRulesExplanation] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  // Form State (Section 13)
  const [sleepHours, setSleepHours] = useState(7.5);
  const [sleepQuality, setSleepQuality] = useState<SleepQualityLabel>('Good');
  const [fatigueLevel, setFatigueLevel] = useState<FatigueLevel>('Moderate');
  const [selectedSorenessAreas, setSelectedSorenessAreas] = useState(['Lower Back']);
  const [sorenessSeverity, setSorenessSeverity] = useState<SorenessSeverity>('Mild');
  const [stressLevel, setStressLevel] = useState<1 | 2 | 3 | 4 | 5>(2); // 1 (Low) to 5 (High)
  const [hydrationStatus, setHydrationStatus] = useState('On track'); // 'On track' | 'Behind'
  const [nutritionStatus, setNutritionStatus] = useState('On track'); // 'On track' | 'Behind'
  const [discomfortNote, setDiscomfortNote] = useState('');

  // Design Tokens
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

  // Anatomical Soreness Regions
  const bodyRegions = [
    { id: 'Shoulders', label: 'Shoulders' },
    { id: 'Lower Back', label: 'Lower Back' },
    { id: 'Hips', label: 'Hips' },
    { id: 'Knees', label: 'Knees' },
    { id: 'Ankles', label: 'Ankles' },
  ];

  // Dynamic Non-Diagnostic Readiness Engine Logic
  const getReadinessStatus = () => {
    if (fatigueLevel === 'Severe' || sorenessSeverity === 'Severe') {
      return { label: 'Check with CMO', color: '#EE9A8F', bg: isDarkMode ? '#3D2024' : '#FDE8E5', text: '#D94336', desc: 'High fatigue or severe soreness detected.' };
    }
    if (fatigueLevel === 'High' || sorenessSeverity === 'Moderate' || sleepHours < 5 || sleepQuality === 'Poor') {
      return { label: 'Take it Easy', color: '#E8BC68', bg: isDarkMode ? '#3E321F' : '#FFF8E1', text: '#B78103', desc: 'Moderate strain or sub-optimal sleep flagged.' };
    }
    return { label: 'Ready for Exercise', color: '#7CC9A0', bg: isDarkMode ? '#1F3A2B' : '#E8F5E9', text: '#2E7D32', desc: 'All wellness indicators within target bounds.' };
  };

  const readiness = getReadinessStatus();

  // Handle Soreness Region Toggle
  const toggleSorenessArea = (areaId: string) => {
    if (selectedSorenessAreas.includes(areaId)) {
      setSelectedSorenessAreas(selectedSorenessAreas.filter((a) => a !== areaId));
    } else {
      setSelectedSorenessAreas([...selectedSorenessAreas, areaId]);
    }
  };

  const handleSaveCheckIn = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    saveCheckIn({
      date: new Date().toISOString().slice(0, 10),
      sleepHours,
      sleepQuality: sleepQualityValues[sleepQuality],
      fatigue: fatigueValues[fatigueLevel],
      soreness:
        sorenessSeverity === 'None'
          ? []
          : selectedSorenessAreas.map((site) => ({
              site,
              severity: sorenessValues[sorenessSeverity],
            })),
      stress: stressLevel,
      hydration: hydrationStatus === 'On track',
      nutrition: nutritionStatus === 'On track',
      ...(discomfortNote.trim() ? { note: discomfortNote.trim() } : {}),
    });
    setIsSubmitted(true);
    setTimeout(() => setIsSubmitted(false), 4000);
  };

  // 14-Day Strip Mock Data
  const fourteenDayTrend = [
    { day: 1, sleep: 8.0, fatigue: 'None', soreness: 'None' },
    { day: 2, sleep: 7.5, fatigue: 'Mild', soreness: 'None' },
    { day: 3, sleep: 7.0, fatigue: 'Mild', soreness: 'Mild' },
    { day: 4, sleep: 6.5, fatigue: 'Moderate', soreness: 'Mild' },
    { day: 5, sleep: 8.2, fatigue: 'None', soreness: 'None' },
    { day: 6, sleep: 7.8, fatigue: 'Mild', soreness: 'None' },
    { day: 7, sleep: 8.0, fatigue: 'None', soreness: 'None' },
    { day: 8, sleep: 6.0, fatigue: 'Moderate', soreness: 'Mild' },
    { day: 9, sleep: 7.2, fatigue: 'Mild', soreness: 'None' },
    { day: 10, sleep: 7.5, fatigue: 'Mild', soreness: 'None' },
    { day: 11, sleep: 8.1, fatigue: 'None', soreness: 'None' },
    { day: 12, sleep: 7.0, fatigue: 'Mild', soreness: 'Mild' },
    { day: 13, sleep: 6.8, fatigue: 'Moderate', soreness: 'Mild' },
    { day: 14, sleep: sleepHours, fatigue: fatigueLevel, soreness: sorenessSeverity },
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

        {/* MAIN CHECK-IN CONTENT */}
        <main className="mx-auto flex w-full max-w-7xl flex-col gap-6 px-3 py-6 sm:px-4 lg:px-6">
          
          {/* TOAST ON SUBMIT */}
          {isSubmitted && (
            <div className="p-4 rounded-2xl bg-emerald-100 dark:bg-emerald-950/80 border border-emerald-300 dark:border-emerald-800 text-emerald-900 dark:text-emerald-200 flex items-center justify-between animate-fade-in">
              <div className="flex items-center gap-3">
                <CheckCircle2 className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
                <span className="font-semibold text-[14px]">Daily check-in saved! Operational readiness updated.</span>
              </div>
              <span className="text-[13px] font-bold tnum">Synced to Local Log</span>
            </div>
          )}

          {/* 1. HEADER & DYNAMIC READINESS CHIP */}
          <div className="p-6 rounded-[24px] shadow-sm border border-pink-100/60 dark:border-purple-950 flex flex-col md:flex-row items-start md:items-center justify-between gap-4" style={{ backgroundColor: theme.bgSurface }}>
            <div>
              <span className="text-[13px] uppercase tracking-wider font-semibold" style={{ color: theme.textMuted }}>Self-Reported Health Context</span>
              <h1 className="text-[28px] font-bold mt-0.5" style={{ fontFamily: headingFont, color: theme.textStrong }}>Daily Wellness Check-in</h1>
              <p className="text-[16px] mt-1" style={{ color: theme.textMuted }}>Under 60 seconds. Provides essential context for biomechanical loading data.</p>
            </div>

            {/* Dynamic Readiness Status Chip */}
            <div className="flex flex-col items-end gap-1">
              <div
                className="px-4 py-2 rounded-full font-bold text-[14px] flex items-center gap-2 transition-all shadow-xs"
                style={{ backgroundColor: readiness.bg, color: readiness.text, fontFamily: headingFont }}
              >
                <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: readiness.color }}></span>
                <span>{readiness.label}</span>
              </div>
              <span className="text-[13px]" style={{ color: theme.textMuted }}>{readiness.desc}</span>
            </div>
          </div>

          {/* FORM CONTAINER */}
          <form onSubmit={handleSaveCheckIn} className="space-y-6">
            
            {/* FORM CARD 1: SLEEP & QUALITY */}
            <div className="p-6 rounded-[24px] shadow-sm border border-pink-100/60 dark:border-purple-950 space-y-6" style={{ backgroundColor: theme.bgSurface }}>
              <div className="flex items-center justify-between border-b border-pink-50 dark:border-purple-950 pb-3">
                <div className="flex items-center gap-2.5">
                  <Bed className="w-5 h-5 text-pink-500" />
                  <h2 className="font-semibold text-[20px]" style={{ fontFamily: headingFont, color: theme.textStrong }}>1. Sleep Duration & Quality</h2>
                </div>
                <span className="text-[20px] font-bold tnum" style={{ fontFamily: headingFont, color: theme.textStrong }}>
                  {sleepHours.toFixed(1)} hrs
                </span>
              </div>

              <div className="space-y-4">
                {/* Sleep Slider */}
                <div>
                  <div className="flex justify-between text-[13px] mb-2 font-medium" style={{ color: theme.textMuted }}>
                    <span>0 hrs</span>
                    <span>6 hrs (Min target)</span>
                    <span>12 hrs</span>
                  </div>
                  <input
                    type="range"
                    min="0"
                    max="12"
                    step="0.5"
                    value={sleepHours}
                    onChange={(e) => setSleepHours(parseFloat(e.target.value))}
                    className="w-full h-2.5 bg-pink-100 dark:bg-purple-900 rounded-lg appearance-none cursor-pointer accent-pink-400"
                  />
                </div>

                {/* Sleep Quality Icons Selector */}
                <div>
                  <label className="block text-[13px] font-semibold mb-2" style={{ color: theme.textMuted }}>Sleep Quality</label>
                  <div className="grid grid-cols-3 gap-3">
                    {([
                      { label: 'Poor', icon: Frown },
                      { label: 'Fair', icon: Meh },
                      { label: 'Good', icon: Smile },
                    ] as const).map((q) => {
                      const QIcon = q.icon;
                      const isSelected = sleepQuality === q.label;
                      return (
                        <button
                          key={q.label}
                          type="button"
                          onClick={() => setSleepQuality(q.label)}
                          className={`py-3 px-4 rounded-xl font-semibold text-[14px] border transition-all flex items-center justify-center gap-2 ${
                            isSelected ? 'border-pink-300 font-bold shadow-2xs' : 'border-gray-100 dark:border-purple-950 opacity-70 hover:opacity-100'
                          }`}
                          style={{
                            backgroundColor: isSelected ? (isDarkMode ? '#2B2340' : '#FDEBF2') : 'transparent',
                            color: isSelected ? theme.textStrong : theme.textMuted,
                            fontFamily: headingFont,
                          }}
                        >
                          <QIcon className="w-4 h-4" style={{ color: isSelected ? theme.primary500 : theme.textMuted }} />
                          <span>{q.label}</span>
                        </button>
                      );
                    })}
                  </div>
                </div>
              </div>
            </div>

            {/* FORM CARD 2: FATIGUE LEVEL */}
            <div className="p-6 rounded-[24px] shadow-sm border border-pink-100/60 dark:border-purple-950 space-y-4" style={{ backgroundColor: theme.bgSurface }}>
              <div className="flex items-center justify-between border-b border-pink-50 dark:border-purple-950 pb-3">
                <div className="flex items-center gap-2.5">
                  <BatteryCharging className="w-5 h-5 text-pink-500" />
                  <h2 className="font-semibold text-[20px]" style={{ fontFamily: headingFont, color: theme.textStrong }}>2. Fatigue Level</h2>
                </div>
                <span className="text-[13px] font-semibold px-3 py-1 rounded-full bg-pink-100 dark:bg-purple-900 text-pink-700 dark:text-pink-300" style={{ fontFamily: headingFont }}>
                  Current: {fatigueLevel}
                </span>
              </div>

              {/* 5-Step Segmented Selector */}
              <div className="grid grid-cols-5 gap-2 pt-2">
                {(['None', 'Mild', 'Moderate', 'High', 'Severe'] as const).map((lvl) => {
                  const isSelected = fatigueLevel === lvl;
                  return (
                    <button
                      key={lvl}
                      type="button"
                      onClick={() => setFatigueLevel(lvl)}
                      className={`py-3 rounded-xl text-[14px] font-semibold border transition-all ${
                        isSelected ? 'border-pink-400 font-bold shadow-2xs' : 'border-gray-100 dark:border-purple-950 opacity-70 hover:opacity-100'
                      }`}
                      style={{
                        backgroundColor: isSelected ? (isDarkMode ? '#2B2340' : '#FDEBF2') : 'transparent',
                        color: isSelected ? theme.textStrong : theme.textMuted,
                        fontFamily: headingFont,
                      }}
                    >
                      {lvl}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* FORM CARD 3: MUSCLE OR JOINT SORENESS */}
            <div className="p-6 rounded-[24px] shadow-sm border border-pink-100/60 dark:border-purple-950 space-y-5" style={{ backgroundColor: theme.bgSurface }}>
              <div className="flex items-center justify-between border-b border-pink-50 dark:border-purple-950 pb-3">
                <div className="flex items-center gap-2.5">
                  <Activity className="w-5 h-5 text-pink-500" />
                  <h2 className="font-semibold text-[20px]" style={{ fontFamily: headingFont, color: theme.textStrong }}>3. Muscle or Joint Soreness</h2>
                </div>
                <span className="text-[13px]" style={{ color: theme.textMuted }}>Tap locations to tag</span>
              </div>

              {/* Clickable Anatomical Regions */}
              <div>
                <label className="block text-[13px] font-semibold mb-2.5" style={{ color: theme.textMuted }}>Affected Body Locations</label>
                <div className="flex flex-wrap gap-2.5">
                  {bodyRegions.map((region) => {
                    const isSelected = selectedSorenessAreas.includes(region.id);
                    return (
                      <button
                        key={region.id}
                        type="button"
                        onClick={() => toggleSorenessArea(region.id)}
                        className={`px-4 py-2.5 rounded-full font-semibold text-[14px] border transition-all flex items-center gap-2 ${
                          isSelected ? 'border-pink-300 font-bold shadow-2xs' : 'border-gray-200 dark:border-purple-900 opacity-75'
                        }`}
                        style={{
                          backgroundColor: isSelected ? (isDarkMode ? '#2B2340' : '#FDEBF2') : 'transparent',
                          color: isSelected ? theme.textStrong : theme.textMuted,
                          fontFamily: headingFont,
                        }}
                      >
                        <span className={`w-2 h-2 rounded-full ${isSelected ? 'bg-pink-500' : 'bg-gray-300'}`}></span>
                        <span>{region.label}</span>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Soreness Severity Selector */}
              <div>
                <label className="block text-[13px] font-semibold mb-2" style={{ color: theme.textMuted }}>Soreness Severity</label>
                <div className="grid grid-cols-4 gap-2">
                  {(['None', 'Mild', 'Moderate', 'Severe'] as const).map((sev) => {
                    const isSelected = sorenessSeverity === sev;
                    return (
                      <button
                        key={sev}
                        type="button"
                        onClick={() => setSorenessSeverity(sev)}
                        className={`py-2.5 rounded-xl font-semibold text-[14px] border transition-all ${
                          isSelected ? 'border-pink-400 font-bold shadow-2xs' : 'border-gray-100 dark:border-purple-950 opacity-70 hover:opacity-100'
                        }`}
                        style={{
                          backgroundColor: isSelected ? (isDarkMode ? '#2B2340' : '#FDEBF2') : 'transparent',
                          color: isSelected ? theme.textStrong : theme.textMuted,
                          fontFamily: headingFont,
                        }}
                      >
                        {sev}
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>

            {/* FORM CARD 4: OPTIONAL WELLNESS & DISCOMFORT NOTE */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              
              {/* Stress & Hydration (Optional) */}
              <div className="p-6 rounded-[24px] shadow-sm border border-pink-100/60 dark:border-purple-950 space-y-4" style={{ backgroundColor: theme.bgSurface }}>
                <h2 className="font-semibold text-[20px]" style={{ fontFamily: headingFont, color: theme.textStrong }}>4. Mood, Stress & Nutrition</h2>
                
                {/* 5-Step Stress Scale */}
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <label className="text-[13px] font-semibold" style={{ color: theme.textMuted }}>Stress Level (1-5)</label>
                    <span className="text-[13px] font-bold tnum" style={{ fontFamily: headingFont, color: theme.textStrong }}>Level {stressLevel}</span>
                  </div>
                  <div className="flex gap-2">
                    {([1, 2, 3, 4, 5] as const).map((s) => (
                      <button
                        key={s}
                        type="button"
                        onClick={() => setStressLevel(s)}
                        className={`flex-1 py-2 rounded-xl text-[14px] font-bold border transition-all tnum ${
                          stressLevel === s ? 'border-pink-400 shadow-2xs' : 'border-gray-100 dark:border-purple-950 opacity-60'
                        }`}
                        style={{
                          backgroundColor: stressLevel === s ? (isDarkMode ? '#2B2340' : '#FDEBF2') : 'transparent',
                          color: stressLevel === s ? theme.textStrong : theme.textMuted,
                          fontFamily: headingFont,
                        }}
                      >
                        {s}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Hydration & Nutrition Chips */}
                <div className="grid grid-cols-2 gap-3 pt-2">
                  <div>
                    <label className="block text-[13px] font-semibold mb-1.5" style={{ color: theme.textMuted }}>Hydration</label>
                    <div className="flex gap-1">
                      {['On track', 'Behind'].map((h) => (
                        <button
                          key={h}
                          type="button"
                          onClick={() => setHydrationStatus(h)}
                          className={`flex-1 py-1.5 rounded-lg text-[13px] font-semibold border ${
                            hydrationStatus === h ? 'border-pink-300 font-bold' : 'border-transparent opacity-60'
                          }`}
                          style={{
                            backgroundColor: hydrationStatus === h ? theme.bgRaised : 'transparent',
                            color: hydrationStatus === h ? theme.textStrong : theme.textMuted,
                            fontFamily: headingFont,
                          }}
                        >
                          {h}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div>
                    <label className="block text-[13px] font-semibold mb-1.5" style={{ color: theme.textMuted }}>Nutrition</label>
                    <div className="flex gap-1">
                      {['On track', 'Behind'].map((n) => (
                        <button
                          key={n}
                          type="button"
                          onClick={() => setNutritionStatus(n)}
                          className={`flex-1 py-1.5 rounded-lg text-[13px] font-semibold border ${
                            nutritionStatus === n ? 'border-pink-300 font-bold' : 'border-transparent opacity-60'
                          }`}
                          style={{
                            backgroundColor: nutritionStatus === n ? theme.bgRaised : 'transparent',
                            color: nutritionStatus === n ? theme.textStrong : theme.textMuted,
                            fontFamily: headingFont,
                          }}
                        >
                          {n}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              {/* Free-text Discomfort Note */}
              <div className="p-6 rounded-[24px] shadow-sm border border-pink-100/60 dark:border-purple-950 flex flex-col justify-between" style={{ backgroundColor: theme.bgSurface }}>
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <h2 className="font-semibold text-[20px]" style={{ fontFamily: headingFont, color: theme.textStrong }}>5. Pain / Discomfort Note</h2>
                    <span className="text-[13px] tnum" style={{ color: theme.textMuted }}>{discomfortNote.length} / 280</span>
                  </div>
                  <textarea
                    maxLength={280}
                    rows={4}
                    value={discomfortNote}
                    onChange={(e) => setDiscomfortNote(e.target.value)}
                    placeholder="Optional notes for Crew Medical Officer (CMO)... e.g., Slight tightness in right hamstrings during warmup."
                    className="w-full p-3.5 rounded-xl border border-pink-200 dark:border-purple-800 bg-transparent text-[14px] leading-relaxed resize-none focus:outline-none focus:ring-2 focus:ring-pink-300"
                    style={{ color: theme.textStrong }}
                  />
                </div>
                <p className="text-[13px] mt-2" style={{ color: theme.textMuted }}>Shared with CMO logs if checked in settings.</p>
              </div>

            </div>

            {/* FORM ACTIONS */}
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-2">
              <div className="flex items-center gap-3 w-full sm:w-auto">
                <button
                  type="submit"
                  className="flex-1 sm:flex-none py-3.5 px-8 rounded-full font-bold text-[16px] shadow-md transition-transform hover:scale-[1.01] flex items-center justify-center gap-2"
                  style={{ backgroundColor: theme.primary300, color: theme.textStrong, fontFamily: headingFont }}
                >
                  <CheckCircle2 className="w-5 h-5" />
                  <span>Save check-in</span>
                </button>

                <button
                  type="button"
                  onClick={() => alert("Check-in skipped for today. Session baseline will use previous record.")}
                  className="px-6 py-3.5 rounded-full font-semibold text-[16px] transition-colors border border-transparent hover:bg-pink-50 dark:hover:bg-purple-900/30"
                  style={{ color: theme.textMuted, fontFamily: headingFont }}
                >
                  Skip today
                </button>
              </div>

              {/* Rules Explanation Expander Toggle */}
              <button
                type="button"
                onClick={() => setShowRulesExplanation(!showRulesExplanation)}
                className="text-[13px] font-semibold text-pink-600 dark:text-pink-300 flex items-center gap-1 hover:underline"
                style={{ fontFamily: headingFont }}
              >
                <HelpCircle className="w-4 h-4" />
                <span>How is readiness calculated?</span>
              </button>
            </div>

            {/* TRANSPARENT RULE EXPLANATION DRAWER */}
            {showRulesExplanation && (
              <div className="p-4 rounded-2xl border border-purple-100 dark:border-purple-800 bg-purple-50/50 dark:bg-purple-900/20 text-[13px] space-y-2 animate-fade-in">
                <p className="font-bold text-[14px]" style={{ color: theme.textStrong }}>Transparent Readiness Rules Framework:</p>
                <ul className="list-disc list-inside space-y-1 leading-relaxed" style={{ color: theme.textBody }}>
                  <li><strong>Ready for Exercise:</strong> Sleep &ge; 6 hrs, Fatigue &le; Moderate, Soreness Severity &le; Mild.</li>
                  <li><strong>Take it Easy:</strong> Sleep &lt; 6 hrs, Sleep Quality Poor, or Soreness Severity = Moderate. (Calculated load targets auto-adjust by -10%).</li>
                  <li><strong>Check with CMO:</strong> Fatigue = Severe or Soreness Severity = Severe. (Requires CMO approval before high-load ARED sessions).</li>
                </ul>
              </div>
            )}

          </form>

          {/* CLAIM BOUNDARY FOOTNOTE */}
          <div className="p-4 rounded-[20px] border border-pink-100/60 dark:border-purple-950 flex items-center justify-between" style={{ backgroundColor: theme.bgSurface }}>
            <div className="flex items-center gap-3">
              <Info className="w-5 h-5 text-purple-500 flex-shrink-0" />
              <p className="text-[13px]" style={{ color: theme.textMuted }}>
                Daily check-ins provide operational context for exercise kinetics. TALA does not diagnose medical conditions.
              </p>
            </div>
            <span className="text-[13px] font-semibold px-3 py-1 rounded-full bg-pink-100 dark:bg-purple-900 text-pink-700 dark:text-pink-300">
              Non-Diagnostic
            </span>
          </div>

        </main>
      </div>

    </div>
  );
}