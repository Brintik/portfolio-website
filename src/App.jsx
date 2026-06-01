import React, { useState, useEffect, useRef } from 'react';
import { Routes, Route } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { FiX, FiSend, FiMessageCircle } from 'react-icons/fi';
import PortfolioHub from './PortfolioHub';
import CaseStudy from './CaseStudy';

const THEME_CONFIG = {
  morning: { chatBg: 'bg-sky-50/95', chatHeaderBg: 'bg-sky-100/90', chatBorder: 'border-sky-200', chatTextMain: 'text-slate-900', npcMsgBg: 'bg-white', npcMsgBorder: 'border-sky-200', npcMsgText: 'text-slate-800' },
  afternoon: { chatBg: 'bg-orange-50/95', chatHeaderBg: 'bg-orange-100/90', chatBorder: 'border-orange-200', chatTextMain: 'text-slate-900', npcMsgBg: 'bg-white', npcMsgBorder: 'border-orange-200', npcMsgText: 'text-slate-800' },
  night: { chatBg: 'bg-slate-900/95', chatHeaderBg: 'bg-slate-800/80', chatBorder: 'border-slate-700/50', chatTextMain: 'text-white', npcMsgBg: 'bg-slate-800', npcMsgBorder: 'border-slate-700', npcMsgText: 'text-slate-200' }
};

const CHAT_OPTIONS = [
  { id: 1, question: "Tell me about yourself.", answer: "I'm Brintik, a self-taught AI & ML whiz, coding since I stumbled upon Python in 1st undergrad year. My passion lies at the intersection of math, logic, and data. When I'm not automating code, I game, eat spicy butter chicken, and binge-watch anime." },
  { id: 2, question: "What is your main tech stack?", answer: "Python all the way, specifically YOLOv8, PyTorch, Pandas, and Scikit-learn for my AI & ML work. React, Tailwind, and Framer Motion on the frontend. Python, FastAPI, Docker, and YOLOv8 on the backend! Java? Never heard of her. Seeing someone named JavaScript though!" },
  { id: 3, question: "Are you open to new work?", answer: "Yeah, I'm actively looking for a new challenge, whether it's a full-time remote or hybrid AI/ML role, or some freelance automation projects. Hit the email form and we can set something up." }
];

export default function App() {
  const [timeOfDay, setTimeOfDay] = useState('afternoon');
  
  // Global Chat State
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [hasOpenedChat, setHasOpenedChat] = useState(false); // Tracks if chat was opened at least once
  const [isChatHovered, setIsChatHovered] = useState(false);
  const [chatHistory, setChatHistory] = useState([{ type: 'npc', text: "Hey there. Thanks for dropping by. What do you want to know?" }]);
  const [customInput, setCustomInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  
  const chatEndRef = useRef(null);
  const inputRef = useRef(null);
  const optionsScrollRef = useRef(null);

  useEffect(() => {
    const hour = new Date().getHours();
    if (hour >= 6 && hour < 12) setTimeOfDay('morning');
    else if (hour >= 12 && hour < 18) setTimeOfDay('afternoon');
    else setTimeOfDay('night');
  }, []);

  // URL PARAMETER LISTENER: Auto-opens chat if triggered from a specific link
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    if (params.get('openChat') === 'true') {
      setIsChatOpen(true);
      setHasOpenedChat(true); // Ensures the bubble stays if they close it
      
      // Optional: Clean up the URL so it looks nice after opening
      window.history.replaceState({}, document.title, "/");
    }
  }, []);

  // Track if chat has been opened for the persistent bubble
  useEffect(() => {
    if (isChatOpen) setHasOpenedChat(true);
  }, [isChatOpen]);

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

  useEffect(() => chatEndRef.current?.scrollIntoView({ behavior: 'smooth' }), [chatHistory]);

  // 2. ADD THIS EFFECT TO BLOCK BACKGROUND SCROLLING
  useEffect(() => {
    const scrollEl = optionsScrollRef.current;
    if (!scrollEl) return;

    const handleWheel = (e) => {
      if (e.deltaY !== 0) {
        e.preventDefault(); // Kills the main website vertical scroll
        scrollEl.scrollLeft += e.deltaY; // Converts vertical wheel to horizontal
      }
    };

    // { passive: false } is the magic key that allows preventDefault to work
    scrollEl.addEventListener('wheel', handleWheel, { passive: false });

    return () => scrollEl.removeEventListener('wheel', handleWheel);
  }, [isChatOpen]); // Re-attach whenever the chat box opens

  const handleAskQuestion = (qa) => {
    if (isTyping) return;
    setChatHistory(prev => [...prev, { type: 'player', text: qa.question }]);
    setIsTyping(true);
    setTimeout(() => {
      setChatHistory(prev => [...prev, { type: 'npc', text: qa.answer }]);
      setIsTyping(false);
    }, 600);
  };

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
      setChatHistory(prev => [...prev, { type: 'npc', text: "Looks like my API connection is taking a nap. Use the email form below!" }]);
    } finally {
      setIsTyping(false);
    }
  };

  const currentTheme = THEME_CONFIG[timeOfDay];

  return (
    <>
      <Routes>
        <Route path="/" element={<PortfolioHub setIsChatOpen={setIsChatOpen} />} />
        <Route path="/projects/:id" element={<CaseStudy />} />
      </Routes>

      {/* Global Persistent Hover Bubble */}
      {!isChatOpen && hasOpenedChat && (
        <motion.button
          initial={{ scale: 0, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          onClick={() => setIsChatOpen(true)}
          className={`fixed bottom-8 right-8 p-4 rounded-full shadow-2xl z-[100] ${currentTheme.chatBg} border ${currentTheme.chatBorder} hover:scale-110 transition-transform`}
        >
          <FiMessageCircle size={28} className={currentTheme.chatTextMain} />
        </motion.button>
      )}

      {/* Global Chat Interface */}
      <AnimatePresence>
        {isChatOpen && (
          <motion.div 
            initial={{ opacity: 0, y: 50, scale: 0.95 }} animate={{ opacity: 1, y: 0, scale: 1 }} exit={{ opacity: 0, y: 20, scale: 0.95 }}
            onMouseEnter={() => setIsChatHovered(true)} onMouseLeave={() => setIsChatHovered(false)}
            className={`fixed bottom-8 right-8 w-96 h-[550px] ${currentTheme.chatBg} backdrop-blur-2xl border ${currentTheme.chatBorder} rounded-2xl shadow-2xl flex flex-col overflow-hidden z-[100]`}
          >
            <div className={`flex justify-between items-center p-4 border-b ${currentTheme.chatBorder} ${currentTheme.chatHeaderBg}`}>
              <div className="flex items-center">
                <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse mr-2"></div>
                <span className={`font-medium ${currentTheme.chatTextMain}`}>Brintik</span>
              </div>
              <button onClick={() => setIsChatOpen(false)} className={`${currentTheme.chatTextMain} hover:text-green-500 transition`}><FiX size={20} /></button>
            </div>
            
            {/* Added overscroll-contain to isolate scrolling */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4 overscroll-contain">
              {chatHistory.map((msg, idx) => (
                <div key={idx} className={`flex ${msg.type === 'player' ? 'justify-end' : 'justify-start'}`}>
                  <div className={`max-w-[80%] p-3 rounded-2xl text-sm ${msg.type === 'player' ? 'bg-green-500 text-white rounded-br-sm' : `${currentTheme.npcMsgBg} border ${currentTheme.npcMsgBorder} ${currentTheme.npcMsgText} rounded-bl-sm shadow-sm`}`}>
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
            
            <div className={`p-3 ${currentTheme.chatHeaderBg} border-t ${currentTheme.chatBorder} flex flex-col gap-3`}>
              <div ref={optionsScrollRef} className="flex gap-2 overflow-x-auto pb-2 [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none] cursor-grab active:cursor-grabbing">
                {CHAT_OPTIONS.map((opt) => (
                  <button key={opt.id} onClick={() => handleAskQuestion(opt)} disabled={isTyping} className={`whitespace-nowrap px-3 py-1.5 rounded-full border ${currentTheme.chatBorder} bg-white/50 text-slate-800 text-xs hover:bg-green-100 hover:border-green-300 transition shadow-sm disabled:opacity-50`}>
                    {opt.question}
                  </button>
                ))}
              </div>
              <form onSubmit={handleCustomSubmit} className="flex gap-2">
                <input ref={inputRef} type="text" value={customInput} onChange={(e) => setCustomInput(e.target.value)} disabled={isTyping} placeholder="Press Enter to type..." className={`flex-1 px-3 py-2 rounded-lg text-sm bg-white/60 border ${currentTheme.chatBorder} text-slate-900 focus:outline-none focus:border-green-500 transition disabled:opacity-50`} />
                <button type="submit" disabled={isTyping || !customInput.trim()} className="bg-green-500 hover:bg-green-400 text-white p-2 rounded-lg transition disabled:opacity-50 disabled:bg-green-500/50 flex items-center justify-center"><FiSend size={16} /></button>
              </form>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}