import React, { useState, useRef, useEffect } from "react";
import {
  Sparkles,
  Send,
  X,
  Bot,
  User,
  Trash2,
  Copy,
  Check,
  Globe,
  Zap,
  Square,
  RotateCcw,
  ExternalLink,
  Search,
} from "lucide-react";
import { ChatMessage, ChatCitation, LanguageCode, Article } from "../types";
import { streamChatMessageApi } from "../services/api";

interface AskAiModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentLanguage: LanguageCode;
  onChangeLanguage: (lang: LanguageCode) => void;
  initialArticleContext?: Article | null;
}

export const AskAiModal: React.FC<AskAiModalProps> = ({
  isOpen,
  onClose,
  currentLanguage,
  onChangeLanguage,
}) => {
  const [messages, setMessages] = useState<ChatMessage[]>(() => [
    {
      role: "assistant",
      content:
        "👋 Hello! I am **Ask AI** (powered by Google Gemini with live Google Search grounding). You can ask me **ANY question on ANY topic**—general knowledge, science, mathematics, coding, history, current news, stock markets, and economics!\n\nWhat would you like to ask today?",
      timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
    },
  ]);

  const [inputQuery, setInputQuery] = useState("");
  const [isGenerating, setIsGenerating] = useState(false);
  const [copiedIndex, setCopiedIndex] = useState<number | null>(null);

  const abortControllerRef = useRef<AbortController | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const suggestionPills = [
    { label: "🌍 How many countries are in the world?", prompt: "How many countries are in the world?" },
    { label: "💡 Explain Inflation in 2 sentences", prompt: "Explain Inflation in 2 simple sentences" },
    { label: "💻 Write Python Compound Interest Code", prompt: "Write a Python function to calculate compound interest over time" },
    { label: "📊 Nifty 50 vs SENSEX", prompt: "What is the difference between Nifty 50 and SENSEX?" },
    { label: "🤖 How does AI & Quantum Computing work?", prompt: "Explain how AI models and quantum computing work in 3 bullet points" },
    { label: "📈 What is Stock P/E Ratio?", prompt: "What is Price-to-Earnings (P/E) Ratio with an example?" },
  ];

  useEffect(() => {
    if (isOpen) {
      setTimeout(() => inputRef.current?.focus(), 150);
      scrollToBottom();
    }
  }, [isOpen]);

  useEffect(() => {
    scrollToBottom();
  }, [messages, isGenerating]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  const handleSendMessage = async (textToSend?: string) => {
    const query = (textToSend || inputQuery).trim();
    if (!query || isGenerating) return;

    const userMsg: ChatMessage = {
      role: "user",
      content: query,
      timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
    };

    const updatedMessages = [...messages, userMsg];
    setMessages(updatedMessages);
    setInputQuery("");
    setIsGenerating(true);

    // Create placeholder assistant message for streaming
    const assistantIndex = updatedMessages.length;
    const placeholderAssistantMsg: ChatMessage = {
      role: "assistant",
      content: "",
      timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
      citations: [],
    };

    setMessages([...updatedMessages, placeholderAssistantMsg]);

    const controller = new AbortController();
    abortControllerRef.current = controller;

    let accumulatedText = "";
    let accumulatedCitations: ChatCitation[] = [];

    await streamChatMessageApi({
      messages: updatedMessages,
      language: currentLanguage,
      signal: controller.signal,
      onChunk: (textDelta, citations) => {
        accumulatedText += textDelta;
        if (citations) {
          accumulatedCitations = citations;
        }

        setMessages((prev) => {
          const newArr = [...prev];
          if (newArr[assistantIndex]) {
            newArr[assistantIndex] = {
              ...newArr[assistantIndex],
              content: accumulatedText,
              citations: accumulatedCitations.length > 0 ? accumulatedCitations : undefined,
            };
          }
          return newArr;
        });
      },
      onComplete: (fullText, citations) => {
        setIsGenerating(false);
        abortControllerRef.current = null;
        setMessages((prev) => {
          const newArr = [...prev];
          if (newArr[assistantIndex]) {
            newArr[assistantIndex] = {
              ...newArr[assistantIndex],
              content: fullText || accumulatedText || "No response received.",
              citations: citations || accumulatedCitations,
            };
          }
          return newArr;
        });
      },
      onError: (errorMsg) => {
        setIsGenerating(false);
        abortControllerRef.current = null;
        setMessages((prev) => {
          const newArr = [...prev];
          if (newArr[assistantIndex]) {
            newArr[assistantIndex] = {
              ...newArr[assistantIndex],
              content: `⚠️ **API Error**: ${errorMsg}`,
            };
          }
          return newArr;
        });
      },
    });
  };

  const handleStopGenerating = () => {
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
      abortControllerRef.current = null;
    }
    setIsGenerating(false);
  };

  const handleRegenerate = () => {
    if (isGenerating || messages.length < 2) return;
    // Find last user message
    const lastUserIndex = [...messages].reverse().findIndex((m) => m.role === "user");
    if (lastUserIndex !== -1) {
      const realIndex = messages.length - 1 - lastUserIndex;
      const lastUserMsgText = messages[realIndex].content;
      // Remove trailing assistant message and re-send
      const trimmed = messages.slice(0, realIndex);
      setMessages(trimmed);
      setTimeout(() => handleSendMessage(lastUserMsgText), 50);
    }
  };

  const handleClearChat = () => {
    handleStopGenerating();
    setMessages([
      {
        role: "assistant",
        content: "Chat cleared! Ask AI is ready for your next question.",
        timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
      },
    ]);
  };

  const handleCopyText = (content: string, idx: number) => {
    navigator.clipboard.writeText(content);
    setCopiedIndex(idx);
    setTimeout(() => setCopiedIndex(null), 2000);
  };

  if (!isOpen) return null;

  const renderFormattedContent = (content: string) => {
    const lines = content.split("\n");
    let inCodeBlock = false;
    let codeBuffer: string[] = [];

    return lines.map((line, idx) => {
      if (line.startsWith("```")) {
        if (inCodeBlock) {
          inCodeBlock = false;
          const codeText = codeBuffer.join("\n");
          codeBuffer = [];
          return (
            <div key={idx} className="my-2.5 p-3.5 bg-slate-950 text-pink-300 rounded-2xl font-mono text-xs overflow-x-auto border border-pink-500/30 shadow-inner">
              <pre>{codeText}</pre>
            </div>
          );
        } else {
          inCodeBlock = true;
          return null;
        }
      }

      if (inCodeBlock) {
        codeBuffer.push(line);
        return null;
      }

      const parts = line.split(/(\*\*.*?\*\*)/g);
      return (
        <p key={idx} className={line.trim() === "" ? "h-2" : "min-h-[1.25rem] leading-relaxed my-1"}>
          {parts.map((part, pIdx) => {
            if (part.startsWith("**") && part.endsWith("**")) {
              return <strong key={pIdx} className="font-black text-pink-950 dark:text-pink-200">{part.slice(2, -2)}</strong>;
            }
            return part;
          })}
        </p>
      );
    });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-950/70 backdrop-blur-md animate-fade-in">
      {/* Light-Pink & Amethyst Glass Card Container */}
      <div className="w-full max-w-4xl h-[90vh] max-h-[780px] rounded-3xl glass-card border border-pink-300/50 dark:border-pink-500/30 shadow-2xl flex flex-col overflow-hidden relative bg-gradient-to-b from-pink-50/80 via-purple-50/40 to-slate-900/90 dark:from-slate-950 dark:via-purple-950/40 dark:to-slate-950">
        
        {/* Modal Header */}
        <div className="px-5 py-4 bg-gradient-to-r from-pink-600 via-purple-600 to-indigo-700 text-white flex items-center justify-between shadow-md">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-white/20 backdrop-blur-md flex items-center justify-center shadow-lg border border-white/30">
              <Bot className="w-5 h-5 text-white animate-pulse" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-base font-black tracking-tight text-white">Ask Anything</h3>
                <span className="px-2.5 py-0.5 text-[10px] font-black tracking-wider uppercase rounded-full bg-white/20 text-white border border-white/30 flex items-center gap-1">
                  <Search className="w-3 h-3 text-pink-200" />
                  Google Search Grounded
                </span>
              </div>
              <p className="text-xs text-pink-100 font-medium">Ask ANY question — General Knowledge, Coding, Current News, Science, Math</p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {/* Language Selector */}
            <div className="flex items-center gap-1 px-2.5 py-1 rounded-xl bg-white/10 backdrop-blur-md border border-white/20 text-xs font-bold text-white">
              <Globe className="w-3.5 h-3.5 text-pink-200" />
              <select
                value={currentLanguage}
                onChange={(e) => onChangeLanguage(e.target.value as LanguageCode)}
                className="bg-transparent text-xs font-extrabold focus:outline-none cursor-pointer text-white"
              >
                <option value="en" className="text-slate-900">EN</option>
                <option value="hi" className="text-slate-900">HI (हिन्दी)</option>
                <option value="mr" className="text-slate-900">MR (मराठी)</option>
              </select>
            </div>

            {/* Clear Chat Button */}
            <button
              onClick={handleClearChat}
              className="p-2 rounded-xl bg-white/10 hover:bg-white/20 text-white transition-all"
              title="Clear Chat History"
            >
              <Trash2 className="w-4 h-4" />
            </button>

            {/* Close Button */}
            <button
              onClick={onClose}
              className="p-2 rounded-xl bg-white/10 hover:bg-red-600/80 text-white transition-all"
              title="Close Modal"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Suggestion Starters */}
        <div className="px-4 py-2.5 bg-pink-100/50 dark:bg-slate-900/60 border-b border-pink-200/50 dark:border-slate-800 flex items-center gap-2 overflow-x-auto no-scrollbar">
          <span className="text-[11px] font-black uppercase text-pink-700 dark:text-pink-400 flex items-center gap-1 shrink-0">
            <Zap className="w-3.5 h-3.5" /> Starters:
          </span>
          {suggestionPills.map((pill, idx) => (
            <button
              key={idx}
              onClick={() => handleSendMessage(pill.prompt)}
              disabled={isGenerating}
              className="px-3 py-1 text-xs font-extrabold rounded-full bg-white/80 dark:bg-purple-950/50 hover:bg-pink-500 hover:text-white dark:hover:bg-pink-600 text-purple-900 dark:text-pink-300 border border-pink-300/60 dark:border-pink-500/30 transition-all shrink-0 active:scale-95 disabled:opacity-50 shadow-xs"
            >
              {pill.label}
            </button>
          ))}
        </div>

        {/* Chat Messages Container */}
        <div className="flex-1 p-4 overflow-y-auto space-y-4">
          {messages.map((msg, idx) => {
            const isUser = msg.role === "user";
            return (
              <div
                key={idx}
                className={`flex gap-3 ${isUser ? "justify-end" : "justify-start"} animate-fade-in`}
              >
                {!isUser && (
                  <div className="w-8 h-8 rounded-2xl bg-gradient-to-tr from-pink-600 to-purple-600 flex items-center justify-center shrink-0 shadow-md">
                    <Bot className="w-4 h-4 text-white" />
                  </div>
                )}

                <div
                  className={`max-w-[88%] sm:max-w-[78%] p-4 rounded-3xl text-xs sm:text-sm font-medium shadow-md relative group ${
                    isUser
                      ? "bg-gradient-to-r from-pink-600 via-purple-600 to-indigo-600 text-white rounded-tr-none"
                      : "bg-white/95 dark:bg-slate-900/95 text-slate-900 dark:text-slate-100 rounded-tl-none border border-pink-200/80 dark:border-slate-800 shadow-pink-500/5"
                  }`}
                >
                  <div className="pr-2">
                    {isUser ? (
                      <p className="whitespace-pre-wrap">{msg.content}</p>
                    ) : msg.content ? (
                      renderFormattedContent(msg.content)
                    ) : (
                      <div className="flex items-center gap-2 text-pink-600 dark:text-pink-400 font-bold">
                        <Sparkles className="w-4 h-4 animate-spin" />
                        <span>Searching Google & Generating Answer...</span>
                      </div>
                    )}
                  </div>

                  {/* Google Search Grounding Citations */}
                  {!isUser && msg.citations && msg.citations.length > 0 && (
                    <div className="mt-3 pt-2.5 border-t border-slate-200 dark:border-slate-800">
                      <span className="text-[10px] font-black uppercase text-pink-600 dark:text-pink-400 block mb-1.5 flex items-center gap-1">
                        <Search className="w-3 h-3" /> Web Sources & Citations:
                      </span>
                      <div className="flex flex-wrap gap-1.5">
                        {msg.citations.map((cit, cIdx) => (
                          <a
                            key={cIdx}
                            href={cit.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-1 px-2.5 py-1 rounded-xl bg-pink-50 dark:bg-slate-800 text-[11px] font-bold text-pink-700 dark:text-pink-300 border border-pink-200 dark:border-slate-700 hover:bg-pink-600 hover:text-white transition-all shadow-xs"
                          >
                            <span>[{cIdx + 1}] {cit.title}</span>
                            <ExternalLink className="w-3 h-3" />
                          </a>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Message Action Bar (Copy & Timestamp) */}
                  <div
                    className={`mt-2.5 flex items-center justify-between text-[10px] ${
                      isUser ? "text-pink-100" : "text-slate-400 dark:text-slate-500"
                    }`}
                  >
                    <span>{msg.timestamp}</span>
                    {!isUser && msg.content && (
                      <div className="flex items-center gap-1 opacity-90 group-hover:opacity-100 transition-opacity">
                        <button
                          onClick={() => handleCopyText(msg.content, idx)}
                          className="p-1 rounded-lg hover:bg-pink-100 dark:hover:bg-slate-800 text-slate-600 dark:text-slate-400 transition-all flex items-center gap-1 text-[10px]"
                          title="Copy Answer"
                        >
                          {copiedIndex === idx ? (
                            <Check className="w-3.5 h-3.5 text-emerald-500" />
                          ) : (
                            <>
                              <Copy className="w-3.5 h-3.5" />
                              <span>Copy</span>
                            </>
                          )}
                        </button>
                      </div>
                    )}
                  </div>
                </div>

                {isUser && (
                  <div className="w-8 h-8 rounded-2xl bg-purple-700 flex items-center justify-center shrink-0 shadow-md">
                    <User className="w-4 h-4 text-white" />
                  </div>
                )}
              </div>
            );
          })}

          <div ref={messagesEndRef} />
        </div>

        {/* Action Controls & Input Bar */}
        <div className="p-3 sm:p-4 bg-white/90 dark:bg-slate-900/90 border-t border-pink-200/60 dark:border-slate-800 flex flex-col gap-2">
          
          {/* Controls Bar: Stop & Regenerate */}
          <div className="flex items-center justify-between px-1">
            {isGenerating ? (
              <button
                onClick={handleStopGenerating}
                className="px-3.5 py-1.5 rounded-xl bg-rose-500 hover:bg-rose-600 text-white font-extrabold text-xs flex items-center gap-1.5 shadow-md transition-all active:scale-95"
              >
                <Square className="w-3.5 h-3.5 fill-white" />
                <span>Stop Response</span>
              </button>
            ) : (
              messages.length > 1 && (
                <button
                  onClick={handleRegenerate}
                  className="px-3.5 py-1.5 rounded-xl bg-pink-100 dark:bg-slate-800 hover:bg-pink-200 text-pink-700 dark:text-pink-300 font-extrabold text-xs flex items-center gap-1.5 transition-all active:scale-95 border border-pink-300/50 dark:border-slate-700"
                >
                  <RotateCcw className="w-3.5 h-3.5 text-pink-600" />
                  <span>Regenerate Response</span>
                </button>
              )
            )}
          </div>

          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSendMessage();
            }}
            className="flex items-center gap-2"
          >
            <input
              ref={inputRef}
              type="text"
              value={inputQuery}
              onChange={(e) => setInputQuery(e.target.value)}
              placeholder="Ask ANYTHING (General knowledge, math, coding, news, markets)..."
              disabled={isGenerating}
              className="flex-1 px-4 py-3 text-xs sm:text-sm font-bold rounded-2xl glass-input text-slate-900 dark:text-white placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-pink-500/50"
            />
            <button
              type="submit"
              disabled={!inputQuery.trim() || isGenerating}
              className="px-5 py-3 rounded-2xl bg-gradient-to-r from-pink-600 via-purple-600 to-indigo-600 hover:from-pink-700 hover:to-indigo-700 text-white font-black text-xs sm:text-sm shadow-md shadow-pink-500/30 transition-all active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-1.5 shrink-0"
            >
              <span>Send</span>
              <Send className="w-4 h-4" />
            </button>
          </form>

          <p className="text-[10px] text-center text-slate-500 dark:text-slate-400 font-medium">
            ✨ Powered by Gemini API with Google Search grounding. Secure backend API key.
          </p>
        </div>
      </div>
    </div>
  );
};
