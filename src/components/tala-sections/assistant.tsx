import { useRef, useState, type FormEvent } from "react";
import { BookOpen, Database, FileText, Moon, Send, Sparkles, Sun, User, X } from "lucide-react";

type KnowledgeSource = {
  id: string;
  title: string;
  designation: string;
  description: string;
};

type PreparedQuestion = {
  id: string;
  topic: string;
  question: string;
  answer: string;
  sourceIds: string[];
};

type ChatMessage = {
  id: string;
  sender: "assistant" | "user";
  text: string;
  kind?: "welcome" | "prepared" | "custom-notice";
  sourceIds?: string[];
  questionId?: string;
};

const knowledgeSources: KnowledgeSource[] = [
  {
    id: "nasa-std-3001-v1",
    title: "NASA-STD-3001, Volume 1",
    designation: "Revision C",
    description:
      "Health and Medical Care, including astronaut health, muscle strength, aerobic capacity, and in-mission health requirements.",
  },
  {
    id: "nasa-std-3001-v2",
    title: "NASA-STD-3001, Volume 2",
    designation: "Revision F",
    description:
      "Human Factors, Habitability, and Environmental Health, including human capabilities, physical limitations, and human-system considerations.",
  },
  {
    id: "ochmo-hb-004",
    title: "OCHMO-HB-004 — Anthropometry, Biomechanics, and Strength",
    designation: "Handbook",
    description:
      "Human dimensions, body characteristics, biomechanics, range of motion, and strength-related design information.",
  },
  {
    id: "ochmo-tb-031",
    title: "OCHMO-TB-031 — Exercise Overview",
    designation: "Technical brief",
    description:
      "Astronaut physiological deconditioning and exercise countermeasure considerations in spaceflight.",
  },
  {
    id: "hrp-fitness",
    title: "HRP Evidence Report — Reduced Cardiorespiratory and Musculoskeletal Fitness",
    designation: "Evidence report",
    description:
      "Research evidence concerning muscle and aerobic fitness changes associated with spaceflight.",
  },
  {
    id: "hrp-sleep",
    title: "HRP Evidence Report — Sleep Loss, Circadian Desynchronization, and Work Overload",
    designation: "Evidence report",
    description: "Research concerning sleep, circadian disruption, fatigue, and human performance.",
  },
];

const preparedQuestions: PreparedQuestion[] = [
  {
    id: "exercise-countermeasures",
    topic: "Exercise Countermeasures",
    question: "Why are exercise countermeasures important during long-duration spaceflight?",
    answer:
      "Exercise countermeasures are important because prolonged exposure to spaceflight environments can affect multiple physiological systems, including musculoskeletal and cardiovascular function.\n\nNASA's human-system standards describe exercise as an important countermeasure for maintaining muscle strength and cardiovascular fitness throughout a mission. Exercise systems must support crew countermeasure activities within the operational constraints of the spacecraft.\n\nWhat this means for TALA: Movement monitoring can help make exercise-session observations more interpretable. The current prototype does not independently measure physiological adaptation or prove countermeasure effectiveness.",
    sourceIds: ["nasa-std-3001-v2", "ochmo-tb-031", "hrp-fitness"],
  },
  {
    id: "musculoskeletal-fitness",
    topic: "Musculoskeletal Fitness",
    question: "What happens to muscle strength and aerobic fitness during spaceflight?",
    answer:
      "Spaceflight-related physiological changes can affect both musculoskeletal and cardiorespiratory fitness. The NASA Human Research Program's evidence report on reduced cardiorespiratory and musculoskeletal fitness examines research on these risks.\n\nNASA-STD-3001 Volume 1 also includes a mission-specific requirement for maintaining skeletal muscle strength at or above 80% of baseline values. This is an astronaut-program requirement, not a general fitness threshold and not a measure produced by TALA.\n\nTALA's current movement-analysis pipeline reconstructs kinematics; it does not directly measure muscle strength or aerobic capacity. Those require appropriate physiological assessments.",
    sourceIds: ["nasa-std-3001-v1", "hrp-fitness"],
  },
  {
    id: "movement-biomechanics",
    topic: "Movement & Biomechanics",
    question: "How do anthropometry and range of motion affect astronaut movement analysis?",
    answer:
      "Anthropometry describes human body dimensions and segment characteristics, while range of motion describes the movement available at a joint.\n\nThese characteristics matter when interpreting movement because body proportions, joint geometry, posture, and movement constraints influence how a person performs a task. NASA's anthropometric and biomechanical references provide information relevant to human-system design and human movement capabilities.\n\nWhat this means for TALA: Its kinematic reconstruction uses estimated body landmarks and a musculoskeletal model. Interpret these estimates with awareness of camera viewpoint, landmark uncertainty, and model assumptions.",
    sourceIds: ["ochmo-hb-004", "nasa-std-3001-v2"],
  },
  {
    id: "sleep-performance",
    topic: "Sleep & Performance",
    question: "How can sleep loss and circadian disruption affect astronaut performance?",
    answer:
      "Sleep loss and circadian desynchronization are relevant to astronaut performance because sleep and biological timing influence alertness, cognitive functioning, and the ability to carry out operational tasks.\n\nThe NASA Human Research Program's evidence report on sleep loss, circadian desynchronization, and work overload examines these issues in the context of human spaceflight.\n\nWhat this means for TALA: These factors provide broader context for astronaut wellness, but the current movement-analysis system does not diagnose sleep deprivation, fatigue, or cognitive impairment.",
    sourceIds: ["hrp-sleep", "nasa-std-3001-v1"],
  },
];

const sourceById = new Map(knowledgeSources.map((source) => [source.id, source]));
const preparedById = new Map(preparedQuestions.map((question) => [question.id, question]));

const customQuestionNotice =
  "Thanks for your question!\n\nFree-form AI generation is not enabled in this MVP demonstration. To keep responses grounded in the selected NASA knowledge sources, please explore one of the prepared questions below.\n\nThe TALA backend includes a retrieval-augmented generation research pipeline. This interface demonstrates selected example interactions rather than connecting each submitted message to live inference.";

function createMessage(
  sender: ChatMessage["sender"],
  text: string,
  extras: Pick<ChatMessage, "kind" | "sourceIds" | "questionId"> = {},
  id: string,
): ChatMessage {
  return {
    id,
    sender,
    text,
    ...extras,
  };
}

export default function OfflineAssistant() {
  const [viewMode, setViewMode] = useState<"chat" | "library">("chat");
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [inputQuery, setInputQuery] = useState("");
  const [activeCitationSource, setActiveCitationSource] = useState<{
    source: KnowledgeSource;
    question: PreparedQuestion;
  } | null>(null);
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: "welcome",
      sender: "assistant",
      text: "Welcome to TALA's curated knowledge assistant demonstration. Choose a prepared question to explore an example response and its source summaries.",
      kind: "welcome",
    },
  ]);
  const messageSequence = useRef(0);

  const theme = {
    bgBase: isDarkMode ? "#14111C" : "#FFFBFC",
    bgSurface: isDarkMode ? "#1D1929" : "#FFFFFF",
    bgRaised: isDarkMode ? "#272236" : "#FAF3F7",
    primary300: "#F7C6D9",
    textStrong: isDarkMode ? "#F4EEFA" : "#3B2A4A",
    textBody: isDarkMode ? "#D8CFE4" : "#5A4A6A",
    textMuted: isDarkMode ? "#9E93B0" : "#8A7C99",
  };

  const headingFont = "'Quicksand', 'Nunito', system-ui, sans-serif";
  const bodyFont = "'Inter', 'Source Sans 3', system-ui, sans-serif";

  function choosePreparedQuestion(questionId: string) {
    const example = preparedById.get(questionId);
    if (!example) return;

    const userMessage = createMessage(
      "user",
      example.question,
      {},
      `message-${++messageSequence.current}`,
    );
    const assistantMessage = createMessage(
      "assistant",
      example.answer,
      {
        kind: "prepared",
        sourceIds: example.sourceIds,
        questionId: example.id,
      },
      `message-${++messageSequence.current}`,
    );
    setMessages((current) => [...current, userMessage, assistantMessage]);
  }

  function submitCustomQuestion(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const question = inputQuery.trim();
    if (!question) return;

    const userMessage = createMessage("user", question, {}, `message-${++messageSequence.current}`);
    const assistantMessage = createMessage(
      "assistant",
      customQuestionNotice,
      { kind: "custom-notice" },
      `message-${++messageSequence.current}`,
    );
    setMessages((current) => [...current, userMessage, assistantMessage]);
    setInputQuery("");
  }

  function openSource(sourceId: string, questionId: string) {
    const source = sourceById.get(sourceId);
    const question = preparedById.get(questionId);
    if (source && question) setActiveCitationSource({ source, question });
  }

  return (
    <div
      className="flex h-screen w-full select-none overflow-hidden transition-colors duration-300"
      style={{ backgroundColor: theme.bgBase, color: theme.textBody, fontFamily: bodyFont }}
    >
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&family=Quicksand:wght@500;600;700&display=swap');
        .tnum { font-feature-settings: 'tnum'; font-variant-numeric: tabular-nums; }
      `}</style>

      <div className="flex min-w-0 flex-1 flex-col overflow-y-auto">
        <div className="flex flex-1 overflow-hidden">
          <main className="flex flex-1 flex-col justify-between overflow-hidden">
            <header
              className="flex flex-shrink-0 flex-col justify-between gap-4 border-b border-pink-100 p-6 sm:flex-row sm:items-center dark:border-purple-950"
              style={{ backgroundColor: theme.bgSurface }}
            >
              <div>
                <div className="flex flex-wrap items-center gap-2">
                  <span className="flex items-center gap-1.5 rounded-full bg-sky-100 px-3 py-1 text-[13px] font-semibold text-sky-800 dark:bg-sky-950 dark:text-sky-300">
                    <BookOpen className="h-3.5 w-3.5" />
                    Curated RAG Demonstration
                  </span>
                  <span className="text-[13px]" style={{ color: theme.textMuted }}>
                    Evidence-informed knowledge assistant
                  </span>
                </div>
                <h1
                  className="mt-1 text-[28px] font-bold"
                  style={{ fontFamily: headingFont, color: theme.textStrong }}
                >
                  TALA Knowledge Assistant
                </h1>
              </div>

              <div className="flex flex-wrap items-center gap-3">
                <div className="flex rounded-full bg-gray-100 p-1 text-[13px] font-medium dark:bg-purple-900/40">
                  <button
                    type="button"
                    onClick={() => setViewMode("chat")}
                    aria-pressed={viewMode === "chat"}
                    className="rounded-full px-4 py-1.5 transition-all"
                    style={{
                      fontFamily: headingFont,
                      backgroundColor: viewMode === "chat" ? theme.bgSurface : "transparent",
                      color: viewMode === "chat" ? theme.textStrong : theme.textMuted,
                    }}
                  >
                    Assistant
                  </button>
                  <button
                    type="button"
                    onClick={() => setViewMode("library")}
                    aria-pressed={viewMode === "library"}
                    className="rounded-full px-4 py-1.5 transition-all"
                    style={{
                      fontFamily: headingFont,
                      backgroundColor: viewMode === "library" ? theme.bgSurface : "transparent",
                      color: viewMode === "library" ? theme.textStrong : theme.textMuted,
                    }}
                  >
                    Knowledge Sources ({knowledgeSources.length})
                  </button>
                </div>
              </div>
            </header>

            {viewMode === "chat" ? (
              <div className="flex min-h-0 flex-1 flex-col">
                <div
                  className="border-b border-pink-50 px-6 py-3 dark:border-purple-950"
                  style={{ backgroundColor: theme.bgRaised }}
                >
                  <div className="flex items-start gap-2">
                    <Database className="mt-0.5 h-4 w-4 flex-shrink-0 text-purple-600 dark:text-purple-300" />
                    <p className="text-[13px] leading-relaxed" style={{ color: theme.textBody }}>
                      <strong style={{ color: theme.textStrong }}>
                        Research Demonstration · MVP.
                      </strong>{" "}
                      Prepared example conversations based on TALA&apos;s six-document NASA
                      knowledge base. Free-form chat inference is not enabled in this interface.
                    </p>
                  </div>
                </div>

                <div className="flex-1 space-y-6 overflow-y-auto p-6" aria-live="polite">
                  {messages.map((message) => (
                    <div
                      key={message.id}
                      className={`flex max-w-3xl gap-3 ${
                        message.sender === "user" ? "ml-auto flex-row-reverse" : ""
                      }`}
                    >
                      <div
                        className={`flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-2xl shadow-xs ${
                          message.sender === "user"
                            ? "bg-pink-300"
                            : "bg-purple-200 dark:bg-purple-900"
                        }`}
                      >
                        {message.sender === "user" ? (
                          <User className="h-5 w-5 text-purple-900" />
                        ) : (
                          <Sparkles className="h-5 w-5 text-purple-700 dark:text-purple-300" />
                        )}
                      </div>

                      <div className="min-w-0 space-y-2">
                        <div
                          className={`rounded-[20px] p-4 text-[15px] leading-relaxed shadow-sm ${
                            message.sender === "user"
                              ? "rounded-tr-none text-purple-950"
                              : "rounded-tl-none border border-pink-100/60 dark:border-purple-950"
                          }`}
                          style={{
                            backgroundColor:
                              message.sender === "user" ? theme.primary300 : theme.bgSurface,
                            color: message.sender === "user" ? "#3B2A4A" : theme.textBody,
                          }}
                        >
                          {message.text.split("\n\n").map((paragraph, index) => (
                            <p key={`${message.id}-${index}`} className={index > 0 ? "mt-3" : ""}>
                              {paragraph}
                            </p>
                          ))}
                        </div>

                        {message.sender === "assistant" ? (
                          <div className="space-y-2">
                            {message.kind === "prepared" && message.sourceIds?.length ? (
                              <div className="flex flex-wrap items-center gap-2">
                                <span
                                  className="text-[13px] font-semibold"
                                  style={{ color: theme.textMuted }}
                                >
                                  Prepared source summaries:
                                </span>
                                {message.sourceIds.map((sourceId) => {
                                  const source = sourceById.get(sourceId);
                                  const questionId = message.questionId;
                                  if (!source || !questionId) return null;

                                  return (
                                    <button
                                      key={sourceId}
                                      type="button"
                                      onClick={() => openSource(sourceId, questionId)}
                                      className="flex items-center gap-1.5 rounded-full border border-purple-200 bg-purple-50 px-3 py-1 text-[13px] font-bold text-purple-700 transition-transform hover:scale-[1.02] dark:border-purple-800 dark:bg-purple-900/40 dark:text-purple-300"
                                      style={{ fontFamily: headingFont }}
                                    >
                                      <BookOpen className="h-3.5 w-3.5" />
                                      {source.id.toUpperCase()}
                                    </button>
                                  );
                                })}
                              </div>
                            ) : null}
                            <div
                              className="flex flex-wrap items-center gap-2 text-[13px]"
                              style={{ color: theme.textMuted }}
                            >
                              {message.kind === "prepared" ? (
                                <span className="rounded-full border border-pink-200 px-2.5 py-1 dark:border-purple-800">
                                  Prepared demonstration response
                                </span>
                              ) : message.kind === "custom-notice" ? (
                                <span className="rounded-full border border-pink-200 px-2.5 py-1 dark:border-purple-800">
                                  Demonstration mode
                                </span>
                              ) : null}
                            </div>
                          </div>
                        ) : null}
                      </div>
                    </div>
                  ))}
                </div>

                <div
                  className="flex-shrink-0 space-y-3 border-t border-pink-100 p-4 dark:border-purple-950"
                  style={{ backgroundColor: theme.bgSurface }}
                >
                  <div className="space-y-2">
                    <p className="text-[13px] font-semibold" style={{ color: theme.textMuted }}>
                      Explore the knowledge base
                    </p>
                    <div className="grid gap-2 sm:grid-cols-2">
                      {preparedQuestions.map((question) => (
                        <button
                          key={question.id}
                          type="button"
                          onClick={() => choosePreparedQuestion(question.id)}
                          className="rounded-2xl border border-pink-200 bg-pink-50/50 px-3.5 py-2.5 text-left text-[13px] transition-colors hover:bg-pink-100 dark:border-purple-800 dark:bg-purple-900/20 dark:hover:bg-purple-900/50"
                          style={{ color: theme.textStrong, fontFamily: headingFont }}
                        >
                          <span className="block text-[11px] font-semibold text-purple-600 dark:text-purple-300">
                            {question.topic}
                          </span>
                          <span className="mt-0.5 block">{question.question}</span>
                        </button>
                      ))}
                    </div>
                  </div>

                  <form onSubmit={submitCustomQuestion} className="flex items-center gap-2">
                    <label className="sr-only" htmlFor="assistant-question">
                      Ask a question
                    </label>
                    <input
                      id="assistant-question"
                      type="text"
                      value={inputQuery}
                      onChange={(event) => setInputQuery(event.target.value)}
                      placeholder="Enter a question to see the demonstration-mode notice"
                      className="min-w-0 flex-1 rounded-full border border-pink-200 bg-transparent px-4 py-3.5 text-[15px] focus:outline-none focus:ring-2 focus:ring-pink-300 dark:border-purple-800"
                      style={{ color: theme.textStrong }}
                    />
                    <button
                      type="submit"
                      disabled={!inputQuery.trim()}
                      className="flex flex-shrink-0 items-center gap-2 rounded-full px-5 py-3.5 text-[15px] font-bold shadow-md transition-transform hover:scale-[1.02] disabled:cursor-not-allowed disabled:opacity-50"
                      style={{
                        backgroundColor: theme.primary300,
                        color: theme.textStrong,
                        fontFamily: headingFont,
                      }}
                    >
                      <span>Send</span>
                      <Send className="h-4 w-4" />
                    </button>
                  </form>
                </div>
              </div>
            ) : (
              <div className="flex-1 space-y-6 overflow-y-auto p-6">
                <div>
                  <h2
                    className="text-[20px] font-bold"
                    style={{ fontFamily: headingFont, color: theme.textStrong }}
                  >
                    TALA Research Knowledge Base
                  </h2>
                  <p className="mt-1 max-w-4xl text-[13px]" style={{ color: theme.textMuted }}>
                    TALA&apos;s research assistant uses a curated collection of NASA standards,
                    technical guidance, and Human Research Program evidence reports. These documents
                    provide the knowledge foundation for its retrieval-augmented question-answering
                    pipeline.
                  </p>
                </div>

                <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                  {knowledgeSources.map((source) => (
                    <article
                      key={source.id}
                      className="flex flex-col justify-between space-y-4 rounded-[24px] border border-pink-100/60 p-6 shadow-sm dark:border-purple-950"
                      style={{ backgroundColor: theme.bgSurface }}
                    >
                      <div>
                        <div className="flex items-start justify-between gap-3">
                          <span
                            className="rounded-full bg-pink-100 px-3 py-1 text-[13px] font-bold text-pink-700 dark:bg-purple-900 dark:text-purple-300"
                            style={{ fontFamily: headingFont }}
                          >
                            {source.id.toUpperCase()}
                          </span>
                          <span className="flex flex-shrink-0 items-center gap-1 rounded-full border border-pink-200 px-2.5 py-1 text-[11px] font-medium dark:border-purple-800">
                            <FileText className="h-3 w-3" />
                            Included in RAG knowledge base
                          </span>
                        </div>
                        <h3
                          className="mt-3 text-[18px] font-bold"
                          style={{ fontFamily: headingFont, color: theme.textStrong }}
                        >
                          {source.title}
                        </h3>
                        <p className="mt-1 text-[13px]" style={{ color: theme.textMuted }}>
                          {source.designation}
                        </p>
                        <p
                          className="mt-3 text-sm leading-relaxed"
                          style={{ color: theme.textBody }}
                        >
                          {source.description}
                        </p>
                      </div>
                    </article>
                  ))}
                </div>
              </div>
            )}
          </main>

          {activeCitationSource ? (
            <aside
              aria-label="Source inspection"
              className="animate-fade-in flex w-80 flex-shrink-0 flex-col justify-between border-l border-pink-100 p-6 dark:border-purple-950"
              style={{ backgroundColor: theme.bgSurface }}
            >
              <div className="space-y-5">
                <div className="flex items-center justify-between border-b border-pink-50 pb-3 dark:border-purple-950">
                  <div className="flex items-center gap-2">
                    <BookOpen className="h-5 w-5 text-purple-600" />
                    <h2
                      className="text-[18px] font-bold"
                      style={{ fontFamily: headingFont, color: theme.textStrong }}
                    >
                      Source Inspection
                    </h2>
                  </div>
                  <button
                    type="button"
                    aria-label="Close source panel"
                    onClick={() => setActiveCitationSource(null)}
                    className="rounded-full p-1 hover:bg-pink-50 dark:hover:bg-purple-900/40"
                  >
                    <X className="h-5 w-5" />
                  </button>
                </div>

                <div>
                  <span className="rounded-md bg-purple-100 px-2.5 py-1 text-[13px] font-bold text-purple-800 dark:bg-purple-900 dark:text-purple-200">
                    {activeCitationSource.source.id.toUpperCase()}
                  </span>
                  <h3
                    className="mt-2 text-[16px] font-bold"
                    style={{ fontFamily: headingFont, color: theme.textStrong }}
                  >
                    {activeCitationSource.source.title}
                  </h3>
                  <p className="mt-1 text-[13px]" style={{ color: theme.textMuted }}>
                    {activeCitationSource.source.designation}
                  </p>
                </div>

                <div className="space-y-2 rounded-2xl border border-purple-100 bg-purple-50/70 p-4 dark:border-purple-800 dark:bg-purple-900/30">
                  <p
                    className="text-[13px] font-bold text-purple-900 dark:text-purple-200"
                    style={{ fontFamily: headingFont }}
                  >
                    Prepared source summary
                  </p>
                  <p className="text-[13px] leading-relaxed" style={{ color: theme.textBody }}>
                    {activeCitationSource.source.description}
                  </p>
                </div>

                <div className="space-y-1 rounded-xl border border-pink-100 p-3 dark:border-purple-900">
                  <p className="text-[13px] font-semibold" style={{ color: theme.textStrong }}>
                    Why this source is relevant
                  </p>
                  <p className="text-[13px]" style={{ color: theme.textMuted }}>
                    It is listed as a supporting knowledge source for the prepared question:
                  </p>
                  <p className="text-[13px] font-medium" style={{ color: theme.textBody }}>
                    {activeCitationSource.question.question}
                  </p>
                </div>

                <p className="text-xs leading-relaxed" style={{ color: theme.textMuted }}>
                  This is a prepared source summary for a demonstration response, not a live
                  retrieved excerpt. No section or page reference is asserted here.
                </p>
              </div>

              <button
                type="button"
                onClick={() => setActiveCitationSource(null)}
                className="mt-6 w-full rounded-full border border-pink-200 py-2.5 text-[13px] font-bold dark:border-purple-800"
                style={{ color: theme.textStrong, fontFamily: headingFont }}
              >
                Close Source Panel
              </button>
            </aside>
          ) : null}
        </div>
      </div>
    </div>
  );
}
