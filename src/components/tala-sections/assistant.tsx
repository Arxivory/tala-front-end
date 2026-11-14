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
  Send,
  Mic,
  ChevronRight,
  ShieldCheck,
  BookOpen,
  FileText,
  ExternalLink,
  ThumbsUp,
  ThumbsDown,
  Info,
  X,
  Search,
  Check,
  AlertTriangle,
  HelpCircle,
  Clock,
  Database
} from 'lucide-react';

export default function OfflineAssistant() {
  // Navigation & Theme State
  const [activeTab, setActiveTab] = useState('Assistant');
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [viewMode, setViewMode] = useState('chat'); // 'chat' | 'library'

  // Context Chips & Messages State
  const [contextChips, setContextChips] = useState(['Lumbar flag • Session 42', 'Squat 0.16g']);
  const [inputQuery, setInputQuery] = useState('');
  const [activeCitationSource, setActiveCitationSource] = useState(null); // Document detail overlay state

  // Initial Conversation Stream (Section 14)
  const [messages, setMessages] = useState([
    {
      id: 1,
      sender: 'assistant',
      text: "Hello Alex. I'm Tala, your offline clinical decision support assistant. I can answer questions about exercise loading, form adjustments, and biomechanical safety thresholds grounded strictly in NASA standards.",
      confidence: 'High',
      citations: [],
      timestamp: '08:14'
    },
    {
      id: 2,
      sender: 'user',
      text: "Why was my lumbar compression flagged during yesterday's squat set?",
      timestamp: '08:15'
    },
    {
      id: 3,
      sender: 'assistant',
      text: "During Set 3 Rep 6, your estimated peak L4/L5 lumbar compression reached 1.42 kN. While below the absolute NIOSH compression action limit (3.40 kN), spinal flexion exceeded the configured caution threshold. Maintaining neutral pelvic tilt reduces L4/L5 shear force during the bottom phase of the squat in 0.16g Lunar gravity.",
      confidence: 'High',
      citations: [
        {
          id: 'CIT-01',
          docId: 'NASA-STD-3001',
          vol: 'Vol 2',
          section: '6.4.2',
          page: 112,
          title: 'Musculoskeletal Integrity & Biomechanical Loading Constraints',
          excerpt: 'Axial compression along the L4/L5 intervertebral disc during resistive exercise countermeasure loading shall not exceed 3.4 kN, with shear forces gated strictly relative to torso flexion angles exceeding 15 degrees relative to Neutral Body Posture (NBP).'
        },
        {
          id: 'CIT-02',
          docId: 'HRP-47052',
          section: '4.1',
          page: 45,
          title: 'Human Health and Performance Countermeasures Standards',
          excerpt: 'Astronauts performing resistance countermeasures in partial gravity (0.16g / 0.38g) must maintain lumbar spine stabilization to mitigate accelerated intervertebral disc expansion and posterior annulus shear.'
        }
      ],
      timestamp: '08:15'
    }
  ]);

  // Indexed NASA Documents Library
  const indexedDocuments = [
    { id: 'NASA-STD-3001', title: 'NASA Space Flight Human-System Standard (Vol 2)', version: 'Rev C (2023)', chunks: 1420, status: 'Verified', lastUpdated: '2026-10-15' },
    { id: 'HRP-47052', title: 'Human Research Program Human Health & Performance Standards', version: 'V4.1', chunks: 850, status: 'Verified', lastUpdated: '2026-09-28' },
    { id: 'JSC-65829', title: 'ARED Operational Exercise Protocol Manual', version: 'Rev B', chunks: 310, status: 'Verified', lastUpdated: '2026-08-11' },
    { id: 'TALA-THRESH-V3', title: 'TALA Configured Biomechanical Thresholds & Literature Sources', version: 'MVP v1.0', chunks: 180, status: 'Verified', lastUpdated: '2026-11-01' }
  ];

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

  // Handle Suggested Prompt Click
  const handleSuggestedPrompt = (promptText) => {
    sendMessage(promptText);
  };

  // Send Message Logic
  const sendMessage = (textToSend) => {
    const query = textToSend || inputQuery;
    if (!query.trim()) return;

    const userMsg = {
      id: Date.now(),
      sender: 'user',
      text: query,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    setMessages((prev) => [...prev, userMsg]);
    setInputQuery('');

    // Simulated RAG In-Memory Retrieval Delay
    setTimeout(() => {
      let botResponse = {
        id: Date.now() + 1,
        sender: 'assistant',
        text: "I retrieved relevant excerpts from NASA-STD-3001. Mechanical loading on the proximal femur during 0.16g lunar squats delivers approximately 88% of your habitual 1g ground daily stimulus. To optimize osteogenic remodeling, maintain a steady loading rate above 1.2 mε/s.",
        confidence: 'High',
        citations: [
          {
            id: 'CIT-03',
            docId: 'NASA-STD-3001',
            vol: 'Vol 2',
            section: '6.4.5',
            page: 118,
            title: 'Skeletal Remodeling Stimulus Requirements',
            excerpt: 'Countermeasure exercise prescriptions shall aim to deliver daily integrated strain energy density (SED) at the proximal femur exceeding 80% of earthbound reference baselines to mitigate BMD micro-structural deficits.'
          }
        ],
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };

      setMessages((prev) => [...prev, botResponse]);
    }, 800);
  };

  const removeContextChip = (chipToRemove) => {
    setContextChips(contextChips.filter((c) => c !== chipToRemove));
  };

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
        
        {/* ASSISTANT MAIN WORKSPACE */}
        <div className="flex-1 flex overflow-hidden">
          
          {/* CENTER CHAT PANEL */}
          <main className="flex-1 flex flex-col justify-between overflow-hidden">
            
            {/* Header & Mode Selector */}
            <div className="p-6 border-b border-pink-100 dark:border-purple-950 flex flex-col sm:flex-row sm:items-center justify-between gap-4 flex-shrink-0" style={{ backgroundColor: theme.bgSurface }}>
              <div>
                <div className="flex items-center gap-2">
                  <span className="px-3 py-1 rounded-full text-[13px] font-semibold bg-sky-100 text-sky-800 dark:bg-sky-950 dark:text-sky-300 flex items-center gap-1.5">
                    <Cloud className="w-3.5 h-3.5" />
                    Running Offline (Edge RAG)
                  </span>
                  <span className="text-[13px]" style={{ color: theme.textMuted }}>Decision Support, Not Diagnosis</span>
                </div>
                <h1 className="text-[28px] font-bold mt-1" style={{ fontFamily: headingFont, color: theme.textStrong }}>Offline Clinical Assistant</h1>
              </div>

              {/* View Selector: Chat vs Library */}
              <div className="flex bg-gray-100 dark:bg-purple-900/40 p-1 rounded-full text-[13px] font-medium">
                <button
                  onClick={() => setViewMode('chat')}
                  className={`px-4 py-1.5 rounded-full transition-all ${
                    viewMode === 'chat' ? 'shadow-xs font-bold' : 'opacity-70 hover:opacity-100'
                  }`}
                  style={{
                    fontFamily: headingFont,
                    backgroundColor: viewMode === 'chat' ? theme.bgSurface : 'transparent',
                    color: viewMode === 'chat' ? theme.textStrong : theme.textMuted,
                  }}
                >
                  Query Assistant
                </button>
                <button
                  onClick={() => setViewMode('library')}
                  className={`px-4 py-1.5 rounded-full transition-all ${
                    viewMode === 'library' ? 'shadow-xs font-bold' : 'opacity-70 hover:opacity-100'
                  }`}
                  style={{
                    fontFamily: headingFont,
                    backgroundColor: viewMode === 'library' ? theme.bgSurface : 'transparent',
                    color: viewMode === 'library' ? theme.textStrong : theme.textMuted,
                  }}
                >
                  Indexed Library ({indexedDocuments.length})
                </button>
              </div>
            </div>

            {/* CHAT VIEW MODE */}
            {viewMode === 'chat' ? (
              <div className="flex-1 flex flex-col min-h-0">
                
                {/* Active Context Chips Bar */}
                {contextChips.length > 0 && (
                  <div className="px-6 py-3 border-b border-pink-50 dark:border-purple-950 flex items-center gap-2 flex-wrap" style={{ backgroundColor: theme.bgRaised }}>
                    <span className="text-[13px] font-semibold" style={{ color: theme.textMuted }}>Attached Session Context:</span>
                    {contextChips.map((chip, idx) => (
                      <span
                        key={idx}
                        className="px-3 py-1 rounded-full text-[13px] font-semibold bg-pink-100 dark:bg-purple-900 text-pink-700 dark:text-pink-300 flex items-center gap-1.5 shadow-2xs"
                        style={{ fontFamily: headingFont }}
                      >
                        <span>{chip}</span>
                        <X className="w-3.5 h-3.5 cursor-pointer hover:opacity-75" onClick={() => removeContextChip(chip)} />
                      </span>
                    ))}
                  </div>
                )}

                {/* Conversation Scroll Container */}
                <div className="flex-1 p-6 overflow-y-auto space-y-6">
                  {messages.map((msg) => (
                    <div
                      key={msg.id}
                      className={`flex gap-3 max-w-3xl ${msg.sender === 'user' ? 'ml-auto flex-row-reverse' : ''}`}
                    >
                      {/* Avatar */}
                      <div
                        className={`w-9 h-9 rounded-2xl flex items-center justify-center flex-shrink-0 shadow-xs ${
                          msg.sender === 'user' ? 'bg-pink-300' : 'bg-purple-200 dark:bg-purple-900'
                        }`}
                      >
                        {msg.sender === 'user' ? (
                          <User className="w-5 h-5 text-purple-900" />
                        ) : (
                          <Sparkles className="w-5 h-5 text-purple-700 dark:text-purple-300" />
                        )}
                      </div>

                      {/* Message Bubble */}
                      <div className="space-y-2">
                        <div
                          className={`p-4 rounded-[20px] text-[15px] leading-relaxed shadow-sm ${
                            msg.sender === 'user'
                              ? 'rounded-tr-none text-purple-950'
                              : 'rounded-tl-none border border-pink-100/60 dark:border-purple-950'
                          }`}
                          style={{
                            backgroundColor: msg.sender === 'user' ? theme.primary300 : theme.bgSurface,
                            color: msg.sender === 'user' ? '#3B2A4A' : theme.textBody,
                          }}
                        >
                          <p>{msg.text}</p>
                        </div>

                        {/* Citation Chips & Metadata for Assistant Messages */}
                        {msg.sender === 'assistant' && (
                          <div className="space-y-2">
                            {msg.citations && msg.citations.length > 0 && (
                              <div className="flex items-center gap-2 flex-wrap">
                                <span className="text-[13px] font-semibold" style={{ color: theme.textMuted }}>Sources:</span>
                                {msg.citations.map((cit) => (
                                  <button
                                    key={cit.id}
                                    onClick={() => setActiveCitationSource(cit)}
                                    className="px-3 py-1 rounded-full text-[13px] font-bold border border-purple-200 dark:border-purple-800 bg-purple-50 dark:bg-purple-900/40 text-purple-700 dark:text-purple-300 hover:scale-105 transition-transform flex items-center gap-1.5"
                                    style={{ fontFamily: headingFont }}
                                  >
                                    <BookOpen className="w-3.5 h-3.5" />
                                    <span>{cit.docId}, Sec {cit.section}</span>
                                  </button>
                                ))}
                              </div>
                            )}

                            <div className="flex items-center gap-3 text-[13px]" style={{ color: theme.textMuted }}>
                              <span className="tnum">{msg.timestamp}</span>
                              <span>•</span>
                              <span className="font-semibold text-emerald-600 dark:text-emerald-400">Retrieval Confidence: {msg.confidence}</span>
                              <div className="flex items-center gap-1 ml-auto opacity-70">
                                <ThumbsUp className="w-3.5 h-3.5 hover:opacity-100 cursor-pointer" />
                                <ThumbsDown className="w-3.5 h-3.5 hover:opacity-100 cursor-pointer ml-1" />
                              </div>
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>

                {/* Suggested Prompts & Query Input Bar */}
                <div className="p-4 border-t border-pink-100 dark:border-purple-950 space-y-3 flex-shrink-0" style={{ backgroundColor: theme.bgSurface }}>
                  
                  {/* Suggested Quick Prompts */}
                  <div className="flex items-center gap-2 overflow-x-auto pb-1 no-scrollbar">
                    <span className="text-[13px] font-semibold flex-shrink-0" style={{ color: theme.textMuted }}>Suggested:</span>
                    {[
                      "Why was my lumbar load flagged?",
                      "How can I improve squat form at 0.16g?",
                      "What does the loading index mean?",
                      "Explain femoral strain effective range"
                    ].map((prompt, i) => (
                      <button
                        key={i}
                        onClick={() => handleSuggestedPrompt(prompt)}
                        className="px-3.5 py-1.5 rounded-full text-[13px] font-medium border border-pink-200 dark:border-purple-800 bg-pink-50/50 dark:bg-purple-900/20 whitespace-nowrap hover:bg-pink-100 dark:hover:bg-purple-900/50 transition-colors"
                        style={{ color: theme.textStrong, fontFamily: headingFont }}
                      >
                        {prompt}
                      </button>
                    ))}
                  </div>

                  {/* Input Form */}
                  <form
                    onSubmit={(e) => {
                      e.preventDefault();
                      sendMessage();
                    }}
                    className="flex items-center gap-2"
                  >
                    <div className="flex-1 relative flex items-center">
                      <input
                        type="text"
                        value={inputQuery}
                        onChange={(e) => setInputQuery(e.target.value)}
                        placeholder="Ask about loading standards, squat form, or NASA-STD-3001..."
                        className="w-full pl-4 pr-10 py-3.5 rounded-full border border-pink-200 dark:border-purple-800 bg-transparent text-[15px] focus:outline-none focus:ring-2 focus:ring-pink-300"
                        style={{ color: theme.textStrong }}
                      />
                      <button type="button" className="absolute right-3 p-1.5 rounded-full hover:bg-pink-100 dark:hover:bg-purple-900/40 text-purple-600">
                        <Mic className="w-4 h-4" />
                      </button>
                    </div>

                    <button
                      type="submit"
                      className="py-3.5 px-6 rounded-full font-bold text-[15px] shadow-md transition-transform hover:scale-[1.02] active:scale-[0.98] flex items-center gap-2 flex-shrink-0"
                      style={{ backgroundColor: theme.primary300, color: theme.textStrong, fontFamily: headingFont }}
                    >
                      <span>Send</span>
                      <Send className="w-4 h-4" />
                    </button>
                  </form>
                </div>

              </div>
            ) : (
              /* INDEXED LIBRARY TAB MODE */
              <div className="flex-1 p-6 overflow-y-auto space-y-6">
                <div>
                  <h2 className="text-[20px] font-bold" style={{ fontFamily: headingFont, color: theme.textStrong }}>Indexed NASA Standards & Protocols</h2>
                  <p className="text-[13px]" style={{ color: theme.textMuted }}>Local vector database chunks powering offline RAG inference.</p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {indexedDocuments.map((doc) => (
                    <div key={doc.id} className="p-6 rounded-[24px] shadow-sm border border-pink-100/60 dark:border-purple-950 space-y-4 flex flex-col justify-between" style={{ backgroundColor: theme.bgSurface }}>
                      <div>
                        <div className="flex items-start justify-between">
                          <span className="px-3 py-1 rounded-full text-[13px] font-bold bg-pink-100 dark:bg-purple-900 text-pink-700 dark:text-pink-300" style={{ fontFamily: headingFont }}>
                            {doc.id}
                          </span>
                          <span className="px-2.5 py-0.5 rounded-full text-[13px] font-semibold bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300">
                            {doc.status}
                          </span>
                        </div>
                        <h3 className="font-bold text-[18px] mt-3" style={{ fontFamily: headingFont, color: theme.textStrong }}>{doc.title}</h3>
                        <p className="text-[13px] mt-1" style={{ color: theme.textMuted }}>Version: {doc.version}</p>
                      </div>

                      <div className="pt-4 border-t border-pink-50 dark:border-purple-950 flex items-center justify-between text-[13px]" style={{ color: theme.textMuted }}>
                        <span className="tnum font-medium">{doc.chunks} vector chunks</span>
                        <span className="tnum">Updated {doc.lastUpdated}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

          </main>

          {/* RIGHT SIDE PANEL: RETRIEVED SOURCE CITATION DRAWER */}
          {activeCitationSource && (
            <aside className="w-80 flex-shrink-0 border-l border-pink-100 dark:border-purple-950 p-6 flex flex-col justify-between animate-fade-in" style={{ backgroundColor: theme.bgSurface }}>
              <div className="space-y-5">
                <div className="flex items-center justify-between border-b border-pink-50 dark:border-purple-950 pb-3">
                  <div className="flex items-center gap-2">
                    <BookOpen className="w-5 h-5 text-purple-600" />
                    <h2 className="font-bold text-[18px]" style={{ fontFamily: headingFont, color: theme.textStrong }}>Source Inspection</h2>
                  </div>
                  <button onClick={() => setActiveCitationSource(null)} className="p-1 rounded-full hover:bg-pink-50 dark:hover:bg-purple-900/40">
                    <X className="w-5 h-5" />
                  </button>
                </div>

                <div>
                  <span className="px-2.5 py-1 rounded-md text-[13px] font-bold bg-purple-100 dark:bg-purple-900 text-purple-800 dark:text-purple-200">
                    {activeCitationSource.docId}
                  </span>
                  <h3 className="font-bold text-[16px] mt-2" style={{ fontFamily: headingFont, color: theme.textStrong }}>{activeCitationSource.title}</h3>
                  <p className="text-[13px] mt-1" style={{ color: theme.textMuted }}>Section {activeCitationSource.section} • Page {activeCitationSource.page}</p>
                </div>

                {/* Highlighted Retrieved Text Chunk */}
                <div className="p-4 rounded-2xl bg-purple-50/70 dark:bg-purple-900/30 border border-purple-100 dark:border-purple-800 space-y-2">
                  <p className="text-[13px] font-bold text-purple-900 dark:text-purple-200" style={{ fontFamily: headingFont }}>Retrieved Text Excerpt:</p>
                  <p className="text-[13px] leading-relaxed font-medium" style={{ color: theme.textBody }}>
                    "{activeCitationSource.excerpt}"
                  </p>
                </div>

                <div className="p-3 rounded-xl border border-pink-100 dark:border-purple-900 space-y-1">
                  <p className="text-[13px] font-semibold" style={{ color: theme.textStrong }}>Verification Status</p>
                  <p className="text-[13px]" style={{ color: theme.textMuted }}>Verified against official NASA standard document index on local edge storage.</p>
                </div>
              </div>

              <button
                onClick={() => setActiveCitationSource(null)}
                className="w-full py-2.5 rounded-full font-bold text-[13px] border border-pink-200 dark:border-purple-800"
                style={{ color: theme.textStrong, fontFamily: headingFont }}
              >
                Close Source Panel
              </button>
            </aside>
          )}

        </div>

      </div>

    </div>
  );
}