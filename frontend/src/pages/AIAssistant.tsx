import React, { useState, useEffect } from 'react';
import { 
  Bot, 
  Send, 
  Sparkles, 
  BookOpen, 
  FileText, 
  ListTree, 
  Copy, 
  Check, 
  ShieldCheck 
} from 'lucide-react';
import { api } from '../services/api';
import { useAuth } from '../context/AuthContext';
import { useTranslation } from '../i18n';

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
  const { t, language } = useTranslation();
  const isHi = language === 'hi';
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      sender: 'assistant',
      content: isHi
        ? "राष्ट्रीय भूमि शासन **एआई अनुसंधान सहायक** में आपका स्वागत है।\n\n" +
          "मैं **ग्रामीण विकास मंत्रालय (DoLR)** के आधिकारिक नीति निर्देशों पर आधारित हूं, जिसमें " +
          "SIH समस्या विवरण **26019**, **26018**, **26016**, **25017**, एवं **26015** तथा सहकर्मी-समीक्षित साहित्य शामिल हैं।\n\n" +
          "आज आपके शोध में मैं किस प्रकार सहायता कर सकता हूं?"
        : "Welcome to the **National Land Governance AI Research Assistant**.\n\n" +
          "I am grounded in official policy directives from the **Ministry of Rural Development (DoLR)**, " +
          "including SIH Problem Statements **26019**, **26018**, **26016**, **25017**, and **26015**, " +
          "alongside peer-reviewed land administration literature.\n\n" +
          "How can I assist your research today?",
      sources: [
        { title: "National Land Governance Platform (MoRD 26019)", citation: "Department of Land Resources (2026)" },
        { title: "Predictive Analytics for Land Acquisition Delays (MoRD 25017)", citation: "DoLR MoRD (2026)" }
      ],
      isFallback: true,
      suggestions: isHi ? [
        "MoRD समस्या विवरण 26019 का संक्षेप दें",
        "अंतिम भूमि अधिकार (Conclusive Titling) पर साहित्य समीक्षा रूपरेखा तैयार करें",
        "वाटरशेड रिमोट सेंसिंग में महत्वपूर्ण शोध अंतरालों की पहचान करें",
        "भूमि अधिग्रहण विलंब मॉडलिंग हेतु डेटासेट की सिफारिश करें"
      ] : [
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
        content: isHi 
          ? "शोध ज्ञानकोष से जुड़ने में त्रुटि हुई। कृपया बैकएंड स्थिति जांचें।"
          : "An error occurred while connecting to the research knowledge base. Please check backend status.",
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
    { id: 'chat', label: isHi ? 'साक्ष्य-आधारित प्रश्नोत्तर' : 'Evidence-Based Q&A', icon: Bot },
    { id: 'summarize', label: isHi ? 'शोध पत्र संक्षेपण' : 'Paper Summarizer', icon: FileText },
    { id: 'literature_review', label: isHi ? 'साहित्य समीक्षा मसौदा' : 'Lit Review Drafter', icon: ListTree },
    { id: 'gap_analysis', label: isHi ? 'अनुसंधान अंतराल' : 'Research Gap Finder', icon: Sparkles },
    { id: 'dataset_recommendation', label: isHi ? 'डेटासेट सिफारिशें' : 'Dataset Recommender', icon: BookOpen },
  ];

  return (
    <div className="flex flex-col h-[calc(100vh-190px)] min-h-[560px] liquid-glass rounded-2xl border border-white/10 overflow-hidden shadow-2xl bg-[#080A0A]/60">
      {/* Top Engine Status & Grounding Badges */}
      <div className="px-5 py-3.5 border-b border-white/10 flex flex-wrap items-center justify-between gap-3 bg-[#101313]/70">
        <div className="flex items-center space-x-3">
          <div className="p-2 bg-gradient-to-br from-[#F5F5F2] via-[#C7CBC7] to-[#747A76] text-[#080A0A] rounded-xl shadow-xs">
            <Bot className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-[#F2F4EF] leading-none">
              {isHi ? 'साक्ष्य-आधारित एआई भूमि शासन सहायक' : 'Grounded AI Land Governance Assistant'}
            </h3>
            <p className="text-[11px] text-[#A7ADA8] font-mono mt-1">
              {isHi ? 'आधिकारिक ग्रामीण विकास मंत्रालय (DoLR) रिपॉजिटरी पर आधारित RAG इंजन' : 'Retrieval-Augmented Generation (RAG) over official DoLR MoRD repository'}
            </p>
          </div>
        </div>

        {/* Verifiable Citations */}
        <div className="flex items-center space-x-2">
          <span className="text-[11px] px-3 py-1 rounded-full bg-[#B7E300]/10 text-[#B7E300] font-semibold border border-[#B7E300]/30 flex items-center space-x-1.5">
            <ShieldCheck className="w-3.5 h-3.5 text-[#B7E300]" />
            <span>{isHi ? 'सत्यापित उद्धरण (शून्य भ्रांति)' : 'Verifiable Citations (No Hallucinations)'}</span>
          </span>
          <span className="text-[11px] px-3 py-1 rounded-full bg-white/5 text-[#78C8C8] font-semibold border border-[#78C8C8]/20 hidden sm:inline font-mono">
            {isHi ? 'ज्ञान इंजन सक्रिय' : 'Knowledge Engine Active'}
          </span>
        </div>
      </div>

      {/* Mode Buttons Bar */}
      <div className="px-5 py-2.5 bg-white/[0.02] border-b border-white/10 flex flex-wrap items-center gap-2 text-xs">
        <span className="text-[11px] font-semibold text-[#A7ADA8] mr-1">
          {isHi ? 'कार्य मोड:' : 'Task Mode:'}
        </span>
        {modes.map((m) => {
          const Icon = m.icon;
          const isActive = mode === m.id;
          return (
            <button
              key={m.id}
              onClick={() => setMode(m.id)}
              className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-xl text-xs transition cursor-pointer ${
                isActive
                  ? 'bg-gradient-to-r from-[#F5F5F2] to-[#C7CBC7] text-[#080A0A] font-bold shadow-xs'
                  : 'bg-white/5 text-[#A7ADA8] hover:text-[#F2F4EF] hover:bg-white/10 border border-white/10'
              }`}
            >
              <Icon className="w-3.5 h-3.5" />
              <span>{m.label}</span>
            </button>
          );
        })}
      </div>

      {/* Messages Stream */}
      <div className="flex-1 p-5 overflow-y-auto space-y-4">
        {messages.map((msg) => {
          const isUser = msg.sender === 'user';
          return (
            <div
              key={msg.id}
              className={`flex ${isUser ? 'justify-end' : 'justify-start'}`}
            >
              <div
                className={`max-w-2xl rounded-2xl p-4 text-xs leading-relaxed shadow-sm ${
                  isUser
                    ? 'bg-gradient-to-r from-[#151919] to-[#1c2222] text-[#F2F4EF] border border-[#78C8C8]/30 rounded-br-xs'
                    : 'liquid-glass-card bg-[#151919]/70 text-[#F2F4EF] border border-white/10 rounded-bl-xs'
                }`}
              >
                {/* Header */}
                <div className={`flex items-center justify-between mb-2 pb-1.5 border-b text-[10px] ${isUser ? 'border-white/10 text-[#78C8C8]' : 'border-white/10 text-[#B7E300]'}`}>
                  <span className="font-bold">{isUser ? user?.full_name || (isHi ? 'आप' : 'You') : 'NDP-LG Grounded Assistant'}</span>
                  <span className="text-[#6F7772]">{msg.timestamp}</span>
                </div>

                {/* Content */}
                <div className="whitespace-pre-wrap space-y-2 text-[#F2F4EF]">
                  {msg.content}
                </div>

                {/* Grounded Sources / Citations */}
                {!isUser && msg.sources && msg.sources.length > 0 && (
                  <div className="mt-3 pt-3 border-t border-white/10 space-y-2">
                    <p className="text-[10px] font-bold uppercase tracking-wider text-[#B7E300] flex items-center space-x-1.5">
                      <BookOpen className="w-3.5 h-3.5 text-[#B7E300]" />
                      <span>{isHi ? "सत्यापित प्राथमिक स्रोत और कानूनी निर्देश:" : "Verifiable Primary Sources & Legal Directives:"}</span>
                    </p>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                      {msg.sources.map((s, idx) => (
                        <div key={idx} className="p-2 bg-white/[0.03] rounded-xl border border-white/10 text-[10px]">
                          <p className="font-semibold text-[#F2F4EF] truncate">{s.title}</p>
                          <p className="text-[#A7ADA8] italic truncate">{s.citation}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Suggestions Pills */}
                {!isUser && msg.suggestions && msg.suggestions.length > 0 && (
                  <div className="mt-3 pt-2.5 border-t border-white/10 flex flex-wrap gap-1.5">
                    {msg.suggestions.map((sug, idx) => (
                      <button
                        key={idx}
                        onClick={() => handleSend(sug)}
                        className="text-[10px] px-2.5 py-1 rounded-lg bg-white/5 hover:bg-[#B7E300]/10 text-[#A7ADA8] hover:text-[#B7E300] border border-white/10 hover:border-[#B7E300]/40 transition text-left cursor-pointer"
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
                      className="text-[10px] text-[#A7ADA8] hover:text-[#F2F4EF] flex items-center space-x-1 ml-auto cursor-pointer"
                    >
                      {copiedId === msg.id ? (
                        <>
                          <Check className="w-3 h-3 text-[#B7E300]" />
                          <span className="text-[#B7E300]">{isHi ? 'कॉपी किया गया' : 'Copied'}</span>
                        </>
                      ) : (
                        <>
                          <Copy className="w-3 h-3 text-[#A7ADA8]" />
                          <span>{isHi ? 'उत्तर कॉपी करें' : 'Copy Response'}</span>
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
            <div className="liquid-glass-card rounded-2xl p-4 text-xs flex items-center space-x-3 text-[#F2F4EF] border border-white/10">
              <div className="w-4 h-4 border-2 border-[#B7E300] border-t-transparent rounded-full animate-spin"></div>
              <span className="text-[#A7ADA8]">{isHi ? "MoRD दस्तावेज़ों और राष्ट्रीय संहिताओं में साक्ष्य खोजा जा रहा है..." : "Grounding response in MoRD documents and national statutes..."}</span>
            </div>
          </div>
        )}
      </div>

      {/* Prompt Suggestions Bar */}
      <div className="px-5 py-2 bg-white/[0.02] border-t border-white/10 flex items-center space-x-2 overflow-x-auto text-[11px]">
        <span className="text-[#F2F4EF] shrink-0 font-semibold">
          {isHi ? 'त्वरित प्रश्न:' : 'Quick Prompts:'}
        </span>
        {(isHi ? [
          "MoRD समस्या विवरण 26019 का सारांश",
          "भूमि अधिग्रहण में देरी के मुख्य कारण क्या हैं?",
          "30मी उपग्रह डेटा से वाटरशेड परिणाम कैसे सुधरते हैं?",
          "अंतिम भूमि अधिकार पर साहित्य समीक्षा उत्पन्न करें"
        ] : [
          "Summarize MoRD Problem Statement 26019",
          "What factors drive land acquisition delays under RFCTLARR?",
          "How does 30m satellite data improve watershed outcomes?",
          "Generate literature review on conclusive land titling"
        ]).map((prompt, idx) => (
          <button
            key={idx}
            onClick={() => handleSend(prompt)}
            className="px-3 py-1 bg-white/5 border border-white/10 hover:border-[#B7E300]/40 text-[#A7ADA8] hover:text-[#F2F4EF] rounded-full whitespace-nowrap transition cursor-pointer text-[11px]"
          >
            {prompt}
          </button>
        ))}
      </div>

      {/* Input Box */}
      <div className="p-4 bg-[#101313]/80 border-t border-white/10">
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleSend();
          }}
          className="flex items-center space-x-3"
        >
          <input
            type="text"
            placeholder={
              isHi 
                ? `'${modes.find(m => m.id === mode)?.label}' मोड में अनुसंधान प्रश्न पूछें...`
                : `Ask research assistant in '${modes.find(m => m.id === mode)?.label}' mode...`
            }
            value={input}
            onChange={(e) => setInput(e.target.value)}
            disabled={loading}
            className="flex-1 px-4 py-3 text-xs bg-white/[0.04] rounded-full text-[#F2F4EF] placeholder-[#A7ADA8] border border-white/10 focus:outline-none focus:border-[#B7E300]/50"
          />
          <button
            type="submit"
            disabled={loading || !input.trim()}
            className="btn-primary-cta px-6 py-2.5 disabled:opacity-40 text-xs flex items-center space-x-2 cursor-pointer shrink-0 font-medium"
          >
            <span>{t('ai.send_button', isHi ? 'भेजें' : 'Send Query')}</span>
            <Send className="w-3.5 h-3.5" />
          </button>
        </form>
      </div>
    </div>
  );
};
