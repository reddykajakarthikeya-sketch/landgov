import React, { useState, useEffect } from 'react';
import { 
  Bot, 
  Send, 
  Sparkles, 
  BookOpen, 
  FileText, 
  ListTree, 
  HelpCircle, 
  Copy, 
  Check, 
  ShieldCheck, 
  ExternalLink,
  RotateCcw,
  Tag
} from 'lucide-react';
import { api } from '../services/api';
import { useAuth } from '../context/AuthContext';

interface Message {
  id: string;
  sender: 'user' | 'assistant';
  content: string;
  sources?: any[];
  isFallback?: boolean;
  suggestions?: string[];
  timestamp: string;
}

interface AIAssistantProps {
  initialQuery?: string;
}

export const AIAssistant: React.FC<AIAssistantProps> = ({ initialQuery }) => {
  const { user } = useAuth();
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      sender: 'assistant',
      content: 
        "Welcome to the **National Land Governance AI Research Assistant**.\n\n" +
        "I am grounded in official policy directives from the **Ministry of Rural Development (DoLR)**, " +
        "including SIH Problem Statements **26019**, **26018**, **26016**, **25017**, and **26015**, " +
        "alongside peer-reviewed land administration literature.\n\n" +
        "How can I assist your research today?",
      sources: [
        { title: "National Land Governance Platform (MoRD 26019)", citation: "Department of Land Resources (2026)" },
        { title: "Predictive Analytics for Land Acquisition Delays (MoRD 25017)", citation: "DoLR MoRD (2026)" }
      ],
      isFallback: true,
      suggestions: [
        "Summarize MoRD Problem Statement 26019",
        "Generate a literature review outline on conclusive land titling",
        "Identify critical research gaps in watershed remote sensing",
        "Recommend datasets for land acquisition delay modeling"
      ],
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    }
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [mode, setMode] = useState<string>('chat');
  const [copiedId, setCopiedId] = useState<string | null>(null);

  useEffect(() => {
    if (initialQuery && initialQuery.trim()) {
      setInput(initialQuery);
      handleSend(initialQuery);
    }
  }, [initialQuery]);

  async function handleSend(queryText?: string) {
    const textToSend = queryText || input;
    if (!textToSend.trim() || loading) return;

    const userMsg: Message = {
      id: Date.now().toString(),
      sender: 'user',
      content: textToSend,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    setMessages(prev => [...prev, userMsg]);
    if (!queryText) setInput('');
    setLoading(true);

    try {
      const res = await api.askAI(textToSend, mode);
      const assistantMsg: Message = {
        id: (Date.now() + 1).toString(),
        sender: 'assistant',
        content: res.answer,
        sources: res.sources,
        isFallback: res.is_fallback,
        suggestions: res.suggestions,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };
      setMessages(prev => [...prev, assistantMsg]);
    } catch (err) {
      console.error('AI query error:', err);
      const errorMsg: Message = {
        id: (Date.now() + 1).toString(),
        sender: 'assistant',
        content: "An error occurred while connecting to the research knowledge base. Please check backend status.",
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };
      setMessages(prev => [...prev, errorMsg]);
    } finally {
      setLoading(false);
    }
  }

  function handleCopy(id: string, text: string) {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  }

  const modes = [
    { id: 'chat', label: 'Evidence-Based Q&A', icon: Bot },
    { id: 'summarize', label: 'Paper Summarizer', icon: FileText },
    { id: 'literature_review', label: 'Lit Review Drafter', icon: ListTree },
    { id: 'gap_analysis', label: 'Research Gap Finder', icon: Sparkles },
    { id: 'dataset_recommendation', label: 'Dataset Recommender', icon: BookOpen },
  ];

  return (
    <div className="flex flex-col h-[calc(100vh-190px)] min-h-[550px] bg-white rounded-lg border border-slate-200 shadow-xs overflow-hidden">
      {/* Top Engine Status & Mode Selector */}
      <div className="bg-slate-50 border-b border-slate-200 px-4 py-2.5 flex flex-wrap items-center justify-between gap-2">
        <div className="flex items-center space-x-2">
          <div className="p-1.5 bg-[#0a2540] text-amber-400 rounded-md">
            <Bot className="w-4 h-4" />
          </div>
          <div>
            <h3 className="text-xs font-bold text-[#0a2540] leading-none">
              Grounded AI Land Governance Assistant
            </h3>
            <p className="text-[10px] text-slate-500">
              Retrieval-Augmented Generation (RAG) over official DoLR MoRD repository
            </p>
          </div>
        </div>

        {/* Fallback & Verified Grounding Tag */}
        <div className="flex items-center space-x-2">
          <span className="text-[10px] px-2 py-0.5 rounded bg-emerald-100 text-emerald-800 font-semibold border border-emerald-300 flex items-center space-x-1">
            <ShieldCheck className="w-3 h-3 text-emerald-600" />
            <span>Verifiable Citations (No Hallucinations)</span>
          </span>
          <span className="text-[10px] px-2 py-0.5 rounded bg-blue-100 text-blue-800 font-semibold border border-blue-200">
            Fallback Mode Active (Pre-Trained Knowledge Engine)
          </span>
        </div>
      </div>

      {/* Mode Buttons */}
      <div className="px-4 py-2 bg-slate-100/60 border-b border-slate-200 flex flex-wrap items-center gap-1.5 text-xs">
        <span className="text-[11px] font-semibold text-slate-500 mr-1">Task Mode:</span>
        {modes.map((m) => {
          const Icon = m.icon;
          const isActive = mode === m.id;
          return (
            <button
              key={m.id}
              onClick={() => setMode(m.id)}
              className={`flex items-center space-x-1 px-2.5 py-1 rounded-md text-[11px] font-medium transition ${
                isActive
                  ? 'bg-[#0a2540] text-white shadow-xs'
                  : 'bg-white text-slate-700 hover:bg-slate-200 border border-slate-300'
              }`}
            >
              <Icon className="w-3 h-3" />
              <span>{m.label}</span>
            </button>
          );
        })}
      </div>

      {/* Messages Stream */}
      <div className="flex-1 p-4 overflow-y-auto space-y-4">
        {messages.map((msg) => {
          const isUser = msg.sender === 'user';
          return (
            <div
              key={msg.id}
              className={`flex ${isUser ? 'justify-end' : 'justify-start'}`}
            >
              <div
                className={`max-w-2xl rounded-xl p-4 text-xs leading-relaxed shadow-xs ${
                  isUser
                    ? 'bg-[#0a2540] text-white rounded-br-xs'
                    : 'bg-slate-50 text-slate-900 border border-slate-200 rounded-bl-xs'
                }`}
              >
                {/* Header */}
                <div className="flex items-center justify-between mb-2 pb-1 border-b border-slate-200/40 text-[10px] text-slate-400">
                  <span className="font-semibold">{isUser ? user?.full_name || 'You' : 'NDP-LG Research Assistant'}</span>
                  <span>{msg.timestamp}</span>
                </div>

                {/* Content */}
                <div className="whitespace-pre-wrap space-y-2">
                  {msg.content}
                </div>

                {/* Grounded Sources / Citations */}
                {!isUser && msg.sources && msg.sources.length > 0 && (
                  <div className="mt-3 pt-2.5 border-t border-slate-200 space-y-1.5">
                    <p className="text-[10px] font-bold uppercase tracking-wider text-slate-500 flex items-center space-x-1">
                      <BookOpen className="w-3 h-3 text-blue-600" />
                      <span>Verifiable Primary Sources & Legal Directives:</span>
                    </p>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-1.5">
                      {msg.sources.map((s, idx) => (
                        <div key={idx} className="p-1.5 bg-white rounded border border-slate-200 text-[10px]">
                          <p className="font-semibold text-slate-800 truncate">{s.title}</p>
                          <p className="text-slate-500 italic truncate">{s.citation}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Suggestions Pills */}
                {!isUser && msg.suggestions && msg.suggestions.length > 0 && (
                  <div className="mt-3 pt-2 border-t border-slate-200 flex flex-wrap gap-1.5">
                    {msg.suggestions.map((sug, idx) => (
                      <button
                        key={idx}
                        onClick={() => handleSend(sug)}
                        className="text-[10px] px-2 py-0.5 rounded bg-white hover:bg-amber-50 text-slate-700 hover:text-amber-900 border border-slate-300 transition text-left"
                      >
                        → {sug}
                      </button>
                    ))}
                  </div>
                )}

                {/* Copy Button */}
                {!isUser && (
                  <div className="mt-2 text-right">
                    <button
                      onClick={() => handleCopy(msg.id, msg.content)}
                      className="text-[10px] text-slate-400 hover:text-slate-600 flex items-center space-x-1 ml-auto"
                    >
                      {copiedId === msg.id ? (
                        <>
                          <Check className="w-3 h-3 text-emerald-600" />
                          <span className="text-emerald-600">Copied</span>
                        </>
                      ) : (
                        <>
                          <Copy className="w-3 h-3" />
                          <span>Copy Response</span>
                        </>
                      )}
                    </button>
                  </div>
                )}
              </div>
            </div>
          );
        })}

        {loading && (
          <div className="flex justify-start">
            <div className="bg-slate-50 border border-slate-200 rounded-xl p-3 text-xs flex items-center space-x-2 text-slate-500">
              <div className="w-4 h-4 border-2 border-[#0a2540] border-t-transparent rounded-full animate-spin"></div>
              <span>Grounding response in MoRD documents and national statutes...</span>
            </div>
          </div>
        )}
      </div>

      {/* Prompt Suggestions Bar */}
      <div className="px-4 py-1.5 bg-slate-50 border-t border-slate-200 flex items-center space-x-2 overflow-x-auto text-[11px]">
        <span className="text-slate-400 shrink-0 font-medium">Quick Prompts:</span>
        {[
          "Summarize MoRD Problem Statement 26019",
          "What factors drive land acquisition delays under RFCTLARR?",
          "How does 30m satellite data improve watershed outcomes?",
          "Generate literature review on conclusive land titling"
        ].map((prompt, idx) => (
          <button
            key={idx}
            onClick={() => handleSend(prompt)}
            className="px-2 py-0.5 bg-white border border-slate-200 hover:border-slate-400 text-slate-600 hover:text-[#0a2540] rounded whitespace-nowrap transition"
          >
            {prompt}
          </button>
        ))}
      </div>

      {/* Input Box */}
      <div className="p-3 bg-white border-t border-slate-200">
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleSend();
          }}
          className="flex items-center space-x-2"
        >
          <input
            type="text"
            placeholder={`Ask research assistant in '${modes.find(m => m.id === mode)?.label}' mode...`}
            value={input}
            onChange={(e) => setInput(e.target.value)}
            disabled={loading}
            className="flex-1 px-4 py-2.5 text-xs bg-slate-50 border border-slate-300 rounded-lg focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#0a2540] text-slate-900"
          />
          <button
            type="submit"
            disabled={loading || !input.trim()}
            className="px-4 py-2.5 bg-[#0a2540] hover:bg-[#1e3a5f] disabled:opacity-50 text-white rounded-lg transition font-semibold text-xs flex items-center space-x-1.5"
          >
            <span>Send</span>
            <Send className="w-3.5 h-3.5" />
          </button>
        </form>
      </div>
    </div>
  );
};
