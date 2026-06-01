/* Imports and Dependencies */
import React, { useState, useEffect, useRef } from 'react';
import { Routes, Route, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { FiX, FiSend, FiMessageCircle } from 'react-icons/fi';
import PortfolioHub from './PortfolioHub';
import CaseStudy from './CaseStudy';

/* Configuration Dictionaries */
const THEME_CONFIG = {
  morning: { 
    chatBg: 'bg-sky-50/95', chatHeaderBg: 'bg-sky-100/90', chatBorder: 'border-sky-200', chatTextMain: 'text-slate-900', npcMsgBg: 'bg-white', npcMsgBorder: 'border-sky-200', npcMsgText: 'text-slate-800',
    accentBg: 'bg-blue-800', accentHoverBg: 'hover:bg-blue-700', accentText: 'text-blue-800', accentHoverText: 'hover:text-blue-700', accentBorder: 'border-blue-800', 
    btnLightBg: 'hover:bg-blue-100', btnLightBorder: 'hover:border-blue-300', disabledBg: 'disabled:bg-blue-800/50'
  },
  afternoon: { 
    chatBg: 'bg-orange-50/95', chatHeaderBg: 'bg-orange-100/90', chatBorder: 'border-orange-200', chatTextMain: 'text-slate-900', npcMsgBg: 'bg-white', npcMsgBorder: 'border-orange-200', npcMsgText: 'text-slate-800',
    accentBg: 'bg-amber-800', accentHoverBg: 'hover:bg-amber-700', accentText: 'text-amber-800', accentHoverText: 'hover:text-amber-700', accentBorder: 'border-amber-800', 
    btnLightBg: 'hover:bg-amber-100', btnLightBorder: 'hover:border-amber-300', disabledBg: 'disabled:bg-amber-800/50'
  },
  night: { 
    chatBg: 'bg-slate-900/95', chatHeaderBg: 'bg-slate-800/80', chatBorder: 'border-slate-700/50', chatTextMain: 'text-white', npcMsgBg: 'bg-slate-800', npcMsgBorder: 'border-slate-700', npcMsgText: 'text-slate-200',
    accentBg: 'bg-green-500', accentHoverBg: 'hover:bg-green-400', accentText: 'text-green-500', accentHoverText: 'hover:text-green-400', accentBorder: 'border-green-500', 
    btnLightBg: 'hover:bg-green-100', btnLightBorder: 'hover:border-green-300', disabledBg: 'disabled:bg-green-500/50'
  }
};

const CHAT_OPTIONS = [
  { id: 1, question: "Tell me about yourself.", answer: "I'm Brintik, a self-taught AI & ML whiz, coding since I stumbled upon Python in 1st undergrad year. My passion lies at the intersection of math, logic, and data. When I'm not automating code, I game, eat spicy butter chicken, and binge-watch anime." },
  { id: 2, question: "What is your main tech stack?", answer: "Python all the way, specifically YOLOv8, PyTorch, Pandas, and Scikit-learn for my AI & ML work. React, Tailwind, and Framer Motion on the frontend. Python, FastAPI, Docker, and YOLOv8 on the backend! Java? Never heard of her. Seeing someone named JavaScript though!" },
  { id: 3, question: "Are you open to new work?", answer: "Yeah, I'm actively looking for a new challenge, whether it's a full-time remote or hybrid AI/ML role, or some freelance automation projects. Hit the email form and we can set something up." }
];

/* Main Application Component */
export default function App() {
  /* Application State */
  const [timeOfDay, setTimeOfDay] = useState('afternoon');
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [hasOpenedChat, setHasOpenedChat] = useState(false); 
  const [isChatHovered, setIsChatHovered] = useState(false);
  const [chatHistory, setChatHistory] = useState([{ type: 'npc', text: "Hey there. Thanks for dropping by. What do you want to know?" }]);
  const [customInput, setCustomInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  
  /* DOM Element References */
  const chatEndRef = useRef(null);
  const inputRef = useRef(null);
  const optionsScrollRef = useRef(null); 
  
  /* Route Observer */
  const location = useLocation();

  /* Lifecycle: System Time Initialization */
  useEffect(() => {
    const hour = new Date().getHours();
    if (hour >= 6 && hour < 12) setTimeOfDay('morning');
    else if (hour >= 12 && hour < 18) setTimeOfDay('afternoon');
    else setTimeOfDay('night');
  }, []);

  /* Lifecycle: URL Parameter Routing */
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    if (params.get('openChat') === 'true') {
      setIsChatOpen(true);
      setHasOpenedChat(true); 
      window.history.replaceState({}, document.title, "/");
    }
  }, []);

  /* Lifecycle: Chat Session Tracking */
  useEffect(() => {
    if (isChatOpen) setHasOpenedChat(true);
  }, [isChatOpen]);

  /* Lifecycle: Keyboard Event Listeners */
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Enter' && isChatOpen && isChatHovered && document.activeElement !== inputRef.current) {
        e.preventDefault();
        inputRef.current?.focus();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isChatOpen, isChatHovered]);

  /* Lifecycle: Horizontal Scroll Interceptor */
  useEffect(() => {
    const scrollEl = optionsScrollRef.current;
    if (!scrollEl) return;
    const handleWheel = (e) => {
      if (e.deltaY !== 0) {
        e.preventDefault(); 
        scrollEl.scrollLeft += e.deltaY; 
      }
    };
    scrollEl.addEventListener('wheel', handleWheel, { passive: false });
    return () => scrollEl.removeEventListener('wheel', handleWheel);
  }, [isChatOpen]);

  /* Lifecycle: Chat Container Auto-Scroll */
  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [chatHistory]);

  /* Handlers: Pre-configured Input Processing */
  const handleAskQuestion = (qa) => {
    if (isTyping) return;
    setChatHistory(prev => [...prev, { type: 'player', text: qa.question }]);
    setIsTyping(true);
    setTimeout(() => {
      setChatHistory(prev => [...prev, { type: 'npc', text: qa.answer }]);
      setIsTyping(false);
    }, 600);
  };

  /* Handlers: LLM API Integration */
  const handleCustomSubmit = async (e) => {
    e.preventDefault();
    if (!customInput.trim() || isTyping) return;
    const userMessage = customInput.trim();
    setChatHistory(prev => [...prev, { type: 'player', text: userMessage }]);
    setCustomInput('');
    setIsTyping(true);

    try {
      const apiHistory = chatHistory.map(msg => ({ role: msg.type === 'player' ? 'user' : 'assistant', content: msg.text }));
      const response = await fetch('https://api.groq.com/openai/v1/chat/completions', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${import.meta.env.VITE_GROQ_API_KEY}` },
        body: JSON.stringify({
          model: 'llama-3.1-8b-instant', 
          messages: [{ role: 'system', content: import.meta.env.VITE_AI_LORE }, ...apiHistory, { role: 'user', content: userMessage }]
        })
      });
      const data = await response.json();
      setChatHistory(prev => [...prev, { type: 'npc', text: data.choices[0].message.content }]);
    } catch (error) {
      setChatHistory(prev => [...prev, { type: 'npc', text: "Connection anomaly detected. Please use the contact form below." }]);
    } finally {
      setIsTyping(false);
    }
  };

  /* Derived State Execution */
  const currentTheme = THEME_CONFIG[timeOfDay];
  
  // Forces the chat bubble to appear globally if a Case Study is active
  const isCaseStudyPage = location.pathname.includes('/projects/');
  const displayChatBubble = !isChatOpen && (hasOpenedChat || isCaseStudyPage);

  /* Render Output */
  return (
    <>
      <Routes>
        <Route path="/" element={<PortfolioHub setIsChatOpen={setIsChatOpen} />} />
        <Route path="/projects/:id" element={<CaseStudy />} />
      </Routes>

      {displayChatBubble && (
        <motion.button
          initial={{ scale: 0, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          onClick={() => setIsChatOpen(true)}
          className={`fixed bottom-6 right-6 md:bottom-8 md:right-8 p-4 rounded-full shadow-2xl z-[999] ${currentTheme.chatBg} border ${currentTheme.chatBorder} hover:scale-110 transition-transform`}
        >
          <FiMessageCircle size={28} className={currentTheme.accentText} />
        </motion.button>
      )}

      <AnimatePresence>
        {isChatOpen && (
          <motion.div 
            initial={{ opacity: 0, y: 50, scale: 0.95 }} animate={{ opacity: 1, y: 0, scale: 1 }} exit={{ opacity: 0, y: 20, scale: 0.95 }}
            onMouseEnter={() => setIsChatHovered(true)} onMouseLeave={() => setIsChatHovered(false)}
            className={`fixed bottom-0 right-0 md:bottom-8 md:right-8 w-full h-[100dvh] md:w-96 md:h-[550px] ${currentTheme.chatBg} backdrop-blur-2xl border ${currentTheme.chatBorder} rounded-none md:rounded-2xl shadow-2xl flex flex-col overflow-hidden z-[9999]`}
          >
            <div className={`flex justify-between items-center p-4 border-b ${currentTheme.chatBorder} ${currentTheme.chatHeaderBg}`}>
              <div className="flex items-center">
                <div className={`w-2 h-2 rounded-full ${currentTheme.accentBg} animate-pulse mr-2`}></div>
                <span className={`font-medium ${currentTheme.chatTextMain}`}>Brintik</span>
              </div>
              <button onClick={() => setIsChatOpen(false)} className={`${currentTheme.chatTextMain} ${currentTheme.accentHoverText} transition p-2`}><FiX size={24} /></button>
            </div>
            
            <div className="flex-1 overflow-y-auto p-4 space-y-4 overscroll-contain">
              {chatHistory.map((msg, idx) => (
                <div key={idx} className={`flex ${msg.type === 'player' ? 'justify-end' : 'justify-start'}`}>
                  <div className={`max-w-[80%] p-3 rounded-2xl text-sm ${msg.type === 'player' ? `${currentTheme.accentBg} text-white rounded-br-sm` : `${currentTheme.npcMsgBg} border ${currentTheme.npcMsgBorder} ${currentTheme.npcMsgText} rounded-bl-sm shadow-sm`}`}>
                    {msg.text}
                  </div>
                </div>
              ))}
              {isTyping && (
                <div className="flex justify-start">
                  <div className={`p-3 rounded-2xl text-sm ${currentTheme.npcMsgBg} border ${currentTheme.npcMsgBorder} flex gap-1 items-center`}>
                    <div className="w-1.5 h-1.5 bg-slate-400 rounded-full animate-bounce"></div>
                    <div className="w-1.5 h-1.5 bg-slate-400 rounded-full animate-bounce delay-75"></div>
                    <div className="w-1.5 h-1.5 bg-slate-400 rounded-full animate-bounce delay-150"></div>
                  </div>
                </div>
              )}
              <div ref={chatEndRef} />
            </div>
            
            <div className={`p-3 ${currentTheme.chatHeaderBg} border-t ${currentTheme.chatBorder} flex flex-col gap-3 pb-8 md:pb-3`}>
              <div ref={optionsScrollRef} className="flex gap-2 overflow-x-auto pb-2 [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none] cursor-grab active:cursor-grabbing">
                {CHAT_OPTIONS.map((opt) => (
                  <button key={opt.id} onClick={() => handleAskQuestion(opt)} disabled={isTyping} className={`whitespace-nowrap px-3 py-1.5 rounded-full border ${currentTheme.chatBorder} bg-white/50 text-slate-800 text-xs ${currentTheme.btnLightBg} ${currentTheme.btnLightBorder} transition shadow-sm disabled:opacity-50`}>
                    {opt.question}
                  </button>
                ))}
              </div>
              <form onSubmit={handleCustomSubmit} className="flex gap-2">
                <input ref={inputRef} type="text" value={customInput} onChange={(e) => setCustomInput(e.target.value)} disabled={isTyping} placeholder="Press Enter to type..." className={`flex-1 px-3 py-2 rounded-lg text-sm bg-white/60 border ${currentTheme.chatBorder} text-slate-900 focus:outline-none focus:border-transparent focus:ring-1 focus:ring-[${currentTheme.accentBorder}] transition disabled:opacity-50`} />
                <button type="submit" disabled={isTyping || !customInput.trim()} className={`${currentTheme.accentBg} ${currentTheme.accentHoverBg} text-white p-2 rounded-lg transition disabled:opacity-50 ${currentTheme.disabledBg} flex items-center justify-center`}><FiSend size={16} /></button>
              </form>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}