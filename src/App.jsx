import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FiX, FiArrowUp, FiMessageSquare, FiGithub, FiLinkedin, FiMail, FiExternalLink, FiArrowRight, FiMapPin, FiDownload, FiSend } from 'react-icons/fi';
import { SiKaggle } from 'react-icons/si';

const DEBUG_MODE = false; 

// --- UPDATED COORDINATES ---
const CHARACTER_POSITIONS = {
  morning: { top: '30%', left: '67%', width: '10%', height: '40%' }, 
  afternoon: { top: '24%', left: '70%', width: '9%', height: '52%' }, 
  night: { top: '40%', left: '52%', width: '10%', height: '36%' }      
};

const SHELF_PROJECTS = [
  { id: 11, name: "AI Image Recognizer", top: '21%', left: '10%', width: '4.5%', height: '14%', targetId: 'project-11' },
  { id: 12, name: "Model Ship Project", top: '22%', left: '17.5%', width: '3.4%', height: '14%', targetId: 'project-12' },
  { id: 13, name: "Plant Pot App", top: '25%', left: '27.5%', width: '5%', height: '12%', targetId: 'project-13' },
];

const PROJECTS_DATA = [
  {
    id: 'project-11',
    title: "AI Image Recognizer",
    shortDesc: "A full-stack, decoupled machine learning pipeline. Processes raw images through a custom YOLOv8 neural network and maps absolute coordinates into a responsive React/Tailwind UI.",
    image: "https://images.unsplash.com/photo-1555949963-aa79dcee981c?auto=format&fit=crop&q=80&w=800", 
    websiteUrl: "https://your-live-app.com",
    readMoreUrl: "/projects/ai-image-recognizer" 
  },
  {
    id: 'project-12',
    title: "Model Ship Project",
    shortDesc: "A 3D rendering pipeline demonstrating advanced WebGL and Three.js physics capabilities directly in the browser.",
    image: "https://images.unsplash.com/photo-1534447677768-be436bb09401?auto=format&fit=crop&q=80&w=800",
    websiteUrl: "https://your-live-app.com",
    readMoreUrl: "/projects/model-ship"
  },
  {
    id: 'project-13',
    title: "Plant Pot App",
    shortDesc: "An IoT dashboard integrating real-time sensor telemetry for automated botanical care systems.",
    image: "https://images.unsplash.com/photo-1416879598555-3914a51eb848?auto=format&fit=crop&q=80&w=800",
    websiteUrl: "https://your-live-app.com",
    readMoreUrl: "/projects/plant-pot"
  }
];

const THEME_CONFIG = {
  morning: {
    navRgb: '186, 230, 253', 
    navText: 'text-slate-900',
    pageBg: 'bg-slate-50', 
    textMain: 'text-slate-900',
    textMuted: 'text-slate-600',
    cardBg: 'bg-white',
    cardBorder: 'border-slate-200',
    footerBg: 'bg-slate-100',
    inputBg: 'bg-white',
    inputBorder: 'border-slate-300',
    chatBg: 'bg-sky-50/95',
    chatHeaderBg: 'bg-sky-100/90',
    chatBorder: 'border-sky-200',
    chatTextMain: 'text-slate-900',
    chatBtnBg: 'bg-white',
    chatBtnHover: 'hover:bg-sky-100 hover:text-sky-900',
    npcMsgBg: 'bg-white',
    npcMsgBorder: 'border-sky-200',
    npcMsgText: 'text-slate-800'
  },
  afternoon: {
    navRgb: '255, 237, 213', 
    navText: 'text-slate-900',
    pageBg: 'bg-slate-50', 
    textMain: 'text-slate-900',
    textMuted: 'text-slate-600',
    cardBg: 'bg-white',
    cardBorder: 'border-slate-200',
    footerBg: 'bg-slate-100',
    inputBg: 'bg-white',
    inputBorder: 'border-slate-300',
    chatBg: 'bg-orange-50/95',
    chatHeaderBg: 'bg-orange-100/90',
    chatBorder: 'border-orange-200',
    chatTextMain: 'text-slate-900',
    chatBtnBg: 'bg-white',
    chatBtnHover: 'hover:bg-orange-100 hover:text-orange-900',
    npcMsgBg: 'bg-white',
    npcMsgBorder: 'border-orange-200',
    npcMsgText: 'text-slate-800'
  },
  night: {
    navRgb: '23, 37, 84', 
    navText: 'text-blue-100',
    pageBg: 'bg-slate-950', 
    textMain: 'text-white',
    textMuted: 'text-slate-400',
    cardBg: 'bg-slate-900/50',
    cardBorder: 'border-slate-800',
    footerBg: 'bg-slate-900',
    inputBg: 'bg-slate-950',
    inputBorder: 'border-slate-800',
    chatBg: 'bg-slate-900/85',
    chatHeaderBg: 'bg-slate-800/50',
    chatBorder: 'border-slate-700/50',
    chatTextMain: 'text-white',
    chatBtnBg: 'bg-slate-800/50',
    chatBtnHover: 'hover:bg-slate-700 hover:text-white',
    npcMsgBg: 'bg-slate-800/90',
    npcMsgBorder: 'border-slate-700',
    npcMsgText: 'text-slate-200'
  }
};

const CHAT_OPTIONS = [
  { id: 1, question: "Tell me about yourself.", answer: "I'm Brintik, a full-stack engineer bridging the gap between machine learning backends and premium front-end experiences." },
  { id: 2, question: "What is your main tech stack?", answer: "React, Tailwind, and Framer Motion on the frontend. Python, FastAPI, Docker, and custom YOLOv8 Neural Networks on the backend!" },
  { id: 3, question: "Are you open to new work?", answer: "Yes! I'm currently looking for full-time roles and open to exciting freelance projects. Feel free to use the contact form at the bottom of the page." }
];

export default function Portfolio() {
  const [timeOfDay, setTimeOfDay] = useState('afternoon');
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [chatHistory, setChatHistory] = useState([{ type: 'npc', text: "Hey there. Thanks for dropping by. What do you want to know?" }]);
  const [customInput, setCustomInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const chatEndRef = useRef(null);

  useEffect(() => {
    const hour = new Date().getHours();
    if (hour >= 6 && hour < 12) setTimeOfDay('morning');
    else if (hour >= 12 && hour < 18) setTimeOfDay('afternoon');
    else setTimeOfDay('night');
  }, []);

  useEffect(() => chatEndRef.current?.scrollIntoView({ behavior: 'smooth' }), [chatHistory]);

  const scrollToTop = () => window.scrollTo({ top: 0, behavior: 'smooth' });
  
  const scrollToSection = (id) => {
    const element = document.getElementById(id);
    if (element) {
      const y = element.getBoundingClientRect().top + window.scrollY - 80;
      window.scrollTo({ top: y, behavior: 'smooth' });
    }
  };

  // Pre-set Button Logic
  const handleAskQuestion = (qa) => {
    if (isTyping) return;
    setChatHistory(prev => [...prev, { type: 'player', text: qa.question }]);
    setIsTyping(true);
    setTimeout(() => {
      setChatHistory(prev => [...prev, { type: 'npc', text: qa.answer }]);
      setIsTyping(false);
    }, 600);
  };

  // LLM API Call Logic
  const handleCustomSubmit = async (e) => {
    e.preventDefault();
    if (!customInput.trim() || isTyping) return;

    const userMessage = customInput.trim();
    setChatHistory(prev => [...prev, { type: 'player', text: userMessage }]);
    setCustomInput('');
    setIsTyping(true);

    try {
      const response = await fetch('https://api.groq.com/openai/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${import.meta.env.VITE_GROQ_API_KEY}`
        },
        body: JSON.stringify({
          model: 'llama-3.1-8b-instant', // Blazing fast model
          messages: [
            { 
              role: 'system', 
              content: "You are Brintik, a Full-Stack AI Engineer. You are chatting with a recruiter/visitor on your portfolio site. Keep answers under 3 sentences, confident, and professional. Your stack includes React, Tailwind, Python, FastAPI, Docker, and YOLOv8. If asked something irrelevant, politely redirect the conversation back to your development skills." 
            },
            { role: 'user', content: userMessage }
          ]
        })
      });

      const data = await response.json();
      const aiResponse = data.choices[0].message.content;
      
      setChatHistory(prev => [...prev, { type: 'npc', text: aiResponse }]);
    } catch (error) {
      setChatHistory(prev => [...prev, { type: 'npc', text: "Looks like my API connection is taking a nap. Feel free to use the email form at the bottom of the page!" }]);
    } finally {
      setIsTyping(false);
    }
  };

  const currentTheme = THEME_CONFIG[timeOfDay];
  const currentCharPos = CHARACTER_POSITIONS[timeOfDay];

  return (
    <div className={`relative w-full min-h-screen ${currentTheme.pageBg} font-sans selection:bg-green-500 selection:text-white transition-colors duration-1000`}>
      
      {/* --- 1. FIXED NAVIGATION BAR --- */}
      <nav 
        className="fixed top-0 left-0 w-full h-16 z-50 flex items-center justify-between px-8 backdrop-blur-md transition-colors duration-500 border-b border-transparent"
        style={{ backgroundColor: `rgba(${currentTheme.navRgb}, 0.3)` }}
      >
        <div className={`font-black text-xl tracking-tighter ${currentTheme.navText} cursor-pointer`} onClick={scrollToTop}>
          BRINTIK<span className="opacity-50">.dev</span>
        </div>
        
        <div className={`hidden md:flex items-center space-x-6 lg:space-x-8 font-medium text-sm ${currentTheme.navText}`}>
          <button onClick={() => scrollToSection('about')} className="hover:opacity-70 transition">About</button>
          <button onClick={() => scrollToSection('resume')} className="hover:opacity-70 transition">Resume</button>
          <button onClick={() => scrollToSection('projects')} className="hover:opacity-70 transition">Projects</button>
          
          <div className="h-4 w-px bg-current opacity-30"></div> 

          <a href="https://github.com/Brintik" target="_blank" rel="noreferrer" className="hover:opacity-70 transition flex items-center gap-2"><FiGithub size={16}/> GitHub</a>
          <a href="https://www.linkedin.com/in/brintikmajumder/" target="_blank" rel="noreferrer" className="hover:opacity-70 transition flex items-center gap-2"><FiLinkedin size={16}/> LinkedIn</a>
          <a href="https://www.kaggle.com/brintikmajumder" target="_blank" rel="noreferrer" className="hover:opacity-70 transition flex items-center gap-2"><SiKaggle size={16}/> Kaggle</a>
          
          <button onClick={() => scrollToSection('contact')} className="hover:opacity-70 transition flex items-center gap-2"><FiMail size={16}/> Contact</button>
        </div>
      </nav>

      {/* --- 2. HERO SECTION --- */}
      <header className="relative w-full h-screen overflow-hidden">
        <img src={`/${timeOfDay}.png`} alt="Cozy Anime Room" className="absolute top-0 left-0 w-full h-full object-cover transition-opacity duration-1000 z-0" />

        <div className="absolute inset-0 z-10 pt-16">
          <div 
            onClick={() => setIsChatOpen(true)}
            className={`absolute cursor-pointer group ${DEBUG_MODE ? 'bg-red-500/50 border-2 border-red-500' : ''}`}
            style={currentCharPos}
          >
            {!isChatOpen && (
              <motion.div 
                onClick={(e) => { e.stopPropagation(); setIsChatOpen(true); }}
                animate={{ y: [0, -8, 0] }}
                transition={{ repeat: Infinity, duration: 2.5, ease: "easeInOut" }}
                className="absolute -top-16 left-1/2 -translate-x-1/2 bg-white/90 backdrop-blur-sm text-slate-900 font-extrabold text-sm px-4 py-2 rounded-2xl border-2 border-slate-900 shadow-[4px_4px_0_0_rgba(15,23,42,1)] pointer-events-auto cursor-pointer whitespace-nowrap z-20 hover:scale-110 transition-transform"
              >
                Hey. Wanna chat?
                <div className="absolute -bottom-[8px] left-1/2 -translate-x-1/2 w-0 h-0 border-l-[8px] border-l-transparent border-r-[8px] border-r-transparent border-t-[8px] border-t-slate-900"></div>
                <div className="absolute -bottom-[5px] left-1/2 -translate-x-1/2 w-0 h-0 border-l-[6px] border-l-transparent border-r-[6px] border-r-transparent border-t-[6px] border-t-white/90"></div>
              </motion.div>
            )}
          </div>

          {SHELF_PROJECTS.map((project) => (
            <div 
              key={project.id}
              onClick={() => scrollToSection(project.targetId)}
              className="absolute cursor-pointer group flex items-center justify-center"
              style={{ top: project.top, left: project.left, width: project.width, height: project.height }}
            >
              <div className="absolute w-full h-full group-hover:scale-90 transition-transform duration-300 ease-out">
                <div className="absolute top-0 left-0 w-2 h-2 border-t-[1.5px] border-l-[1.5px] border-white/50 group-hover:border-green-400 transition-colors" />
                <div className="absolute top-0 right-0 w-2 h-2 border-t-[1.5px] border-r-[1.5px] border-white/50 group-hover:border-green-400 transition-colors" />
                <div className="absolute bottom-0 left-0 w-2 h-2 border-b-[1.5px] border-l-[1.5px] border-white/50 group-hover:border-green-400 transition-colors" />
                <div className="absolute bottom-0 right-0 w-2 h-2 border-b-[1.5px] border-r-[1.5px] border-white/50 group-hover:border-green-400 transition-colors" />
              </div>
              <div className="absolute w-1 h-1 bg-green-400 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              <motion.div initial={{ opacity: 0, y: 10 }} whileHover={{ opacity: 1, y: 0 }}
                className="absolute -top-10 left-1/2 -translate-x-1/2 bg-slate-900 text-white font-bold text-xs px-3 py-1.5 rounded-md shadow-xl whitespace-nowrap pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity z-20 border border-slate-700"
              >
                {project.name}
              </motion.div>
            </div>
          ))}
        </div>
      </header>

      {/* --- 3. ABOUT SECTION --- */}
      <section id="about" className="py-24 px-6 max-w-4xl mx-auto text-center md:text-left transition-colors duration-1000">
        <h2 className={`text-4xl font-extrabold mb-6 tracking-tight ${currentTheme.textMain}`}>About <span className="text-transparent bg-clip-text bg-gradient-to-r from-green-400 to-emerald-600">Me</span></h2>
        <div className="h-1 w-20 bg-green-500 rounded-full mb-10 mx-auto md:mx-0"></div>
        <p className={`text-lg leading-relaxed mb-6 ${currentTheme.textMuted}`}>
          I am a passionate software engineer specializing in bridging the gap between heavy machine learning backends and premium front-end experiences. I love building decoupled, highly scalable architectures that look as beautiful as the code running them.
        </p>
      </section>

      {/* --- 4. RESUME SECTION --- */}
      <section id="resume" className="py-12 px-6 max-w-4xl mx-auto">
        <div className={`${currentTheme.cardBg} border ${currentTheme.cardBorder} rounded-3xl p-8 md:p-12 flex flex-col md:flex-row items-center justify-between shadow-xl relative overflow-hidden transition-colors duration-1000`}>
          <div className="absolute -right-20 -top-20 w-64 h-64 bg-green-500/10 rounded-full blur-3xl pointer-events-none"></div>
          
          <div className="text-center md:text-left mb-8 md:mb-0 relative z-10">
            <h2 className={`text-3xl font-extrabold mb-2 tracking-tight ${currentTheme.textMain}`}>Brintik Majumder</h2>
            <p className="text-lg text-green-500 font-mono font-bold">Full-Stack Software Engineer</p>
            <p className={`mt-4 max-w-md ${currentTheme.textMuted}`}>Detailed breakdown of my experience, tech stack, and educational background.</p>
          </div>
          
          <div className="relative z-10">
            <a href="/resume.pdf" target="_blank" rel="noopener noreferrer" className="flex items-center gap-3 px-8 py-4 bg-green-500 hover:bg-green-400 text-white font-extrabold rounded-xl transition-all shadow-lg hover:shadow-green-500/25 hover:-translate-y-1">
              <FiDownload size={20} /> View Full Resume
            </a>
          </div>
        </div>
      </section>

      {/* --- 5. PROJECTS SECTION --- */}
      <section id="projects" className="py-24 px-6 max-w-5xl mx-auto">
        <h2 className={`text-4xl font-extrabold mb-6 tracking-tight text-center md:text-left ${currentTheme.textMain}`}>Selected <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-indigo-600">Works</span></h2>
        <div className="h-1 w-20 bg-blue-500 rounded-full mb-16 mx-auto md:mx-0"></div>

        <div className="space-y-16">
          {PROJECTS_DATA.map((proj) => (
            <div 
              key={proj.id} id={proj.id} onClick={() => window.location.href = proj.readMoreUrl} 
              className={`group flex flex-col md:flex-row ${currentTheme.cardBg} border ${currentTheme.cardBorder} rounded-2xl overflow-hidden hover:border-green-400 transition-all duration-500 cursor-pointer shadow-xl`}
            >
              <div className={`w-full md:w-5/12 h-64 md:h-auto relative overflow-hidden ${currentTheme.inputBg}`}>
                <img src={proj.image} alt={proj.title} className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" />
              </div>
              <div className="w-full md:w-7/12 p-8 md:p-12 flex flex-col justify-center">
                <h3 className={`text-3xl font-bold mb-4 group-hover:text-green-500 transition-colors ${currentTheme.textMain}`}>{proj.title}</h3>
                <p className={`leading-relaxed mb-8 ${currentTheme.textMuted}`}>{proj.shortDesc}</p>
                <div className="flex items-center gap-6 mt-auto">
                  <a href={proj.websiteUrl} onClick={(e) => e.stopPropagation()} target="_blank" rel="noopener noreferrer" className={`flex items-center gap-2 text-sm font-bold px-4 py-2 rounded-lg border ${currentTheme.cardBorder} ${currentTheme.inputBg} ${currentTheme.textMain} hover:border-green-400 hover:text-green-500 transition`}>
                    <FiExternalLink /> Live Site
                  </a>
                  <span className="flex items-center gap-2 text-sm font-bold text-green-500 group-hover:translate-x-2 transition-transform">
                    Read Case Study <FiArrowRight />
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* --- 6. CONTACT & FOOTER SECTION --- */}
      <footer id="contact" className={`${currentTheme.footerBg} border-t ${currentTheme.cardBorder} py-24 mt-12 transition-colors duration-1000`}>
        <div className="max-w-4xl mx-auto px-6 flex flex-col md:flex-row gap-16">
          <div className="w-full md:w-1/2 flex flex-col">
            <h2 className={`text-3xl font-bold mb-6 ${currentTheme.textMain}`}>Let's Connect.</h2>
            <p className={`mb-8 ${currentTheme.textMuted}`}>Currently open for new opportunities. Whether you have a question or just want to say hi, I'll try my best to get back to you!</p>
            <div className="flex flex-col gap-4 mb-8">
              <a href="mailto:brintikmajumder@gmail.com" className={`flex items-center gap-4 hover:text-green-500 transition w-fit ${currentTheme.textMuted}`}>
                <FiMail className="text-xl" /> brintikmajumder@gmail.com
              </a>
              <div className={`flex items-center gap-4 ${currentTheme.textMuted}`}>
                <FiMapPin className="text-xl text-green-500" /> West Bengal, India
              </div>
            </div>
            <div className="flex gap-4 mt-auto">
              <a href="https://github.com/Brintik" target="_blank" rel="noreferrer" className={`p-3 ${currentTheme.inputBg} border ${currentTheme.cardBorder} hover:border-green-400 ${currentTheme.textMain} rounded-lg transition`}><FiGithub size={20} /></a>
              <a href="https://www.linkedin.com/in/brintikmajumder/" target="_blank" rel="noreferrer" className={`p-3 ${currentTheme.inputBg} border ${currentTheme.cardBorder} hover:border-green-400 ${currentTheme.textMain} rounded-lg transition`}><FiLinkedin size={20} /></a>
              <a href="https://www.kaggle.com/brintikmajumder" target="_blank" rel="noreferrer" className={`p-3 ${currentTheme.inputBg} border ${currentTheme.cardBorder} hover:border-green-400 ${currentTheme.textMain} rounded-lg transition`}><SiKaggle size={20} /></a>
            </div>
          </div>
          <div className="w-full md:w-1/2">
            <form action="https://formspree.io/f/YOUR_FORM_ID_HERE" method="POST" className="flex flex-col gap-4">
              <input type="text" name="name" required placeholder="Your Name" className={`w-full p-4 rounded-xl ${currentTheme.inputBg} border ${currentTheme.inputBorder} ${currentTheme.textMain} focus:outline-none focus:border-green-500 transition-colors`} />
              <input type="email" name="email" required placeholder="Your Email Address" className={`w-full p-4 rounded-xl ${currentTheme.inputBg} border ${currentTheme.inputBorder} ${currentTheme.textMain} focus:outline-none focus:border-green-500 transition-colors`} />
              <textarea name="message" required rows="4" placeholder="Your Message" className={`w-full p-4 rounded-xl ${currentTheme.inputBg} border ${currentTheme.inputBorder} ${currentTheme.textMain} focus:outline-none focus:border-green-500 transition-colors resize-none`}></textarea>
              <button type="submit" className="w-full py-4 rounded-xl bg-green-500 hover:bg-green-400 text-white font-bold transition">Send Message</button>
            </form>
          </div>
        </div>
      </footer>

      {/* --- DYNAMIC THEME HYBRID CHATBOX --- */}
      <AnimatePresence>
        {isChatOpen && (
          <motion.div 
            initial={{ opacity: 0, y: 50, scale: 0.95 }} animate={{ opacity: 1, y: 0, scale: 1 }} exit={{ opacity: 0, y: 20, scale: 0.95 }}
            className={`fixed bottom-8 right-8 w-96 h-[550px] ${currentTheme.chatBg} backdrop-blur-xl border ${currentTheme.chatBorder} rounded-2xl shadow-2xl flex flex-col overflow-hidden z-[100] transition-colors duration-500`}
          >
            <div className={`flex justify-between items-center p-4 border-b ${currentTheme.chatBorder} ${currentTheme.chatHeaderBg}`}>
              <div className="flex items-center">
                <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse mr-2"></div>
                <span className={`font-medium ${currentTheme.chatTextMain}`}>Brintik</span>
              </div>
              <button onClick={() => setIsChatOpen(false)} className={`${currentTheme.chatTextMain} hover:text-green-500 transition`}><FiX size={20} /></button>
            </div>
            
            <div className="flex-1 overflow-y-auto p-4 space-y-4">
              {chatHistory.map((msg, idx) => (
                <div key={idx} className={`flex ${msg.type === 'player' ? 'justify-end' : 'justify-start'}`}>
                  <div className={`max-w-[80%] p-3 rounded-2xl text-sm ${msg.type === 'player' ? 'bg-green-500 text-white rounded-br-sm' : `${currentTheme.npcMsgBg} border ${currentTheme.npcMsgBorder} ${currentTheme.npcMsgText} rounded-bl-sm shadow-sm`}`}>
                    {msg.text}
                  </div>
                </div>
              ))}
              {isTyping && (
                <div className="flex justify-start">
                  <div className={`p-3 rounded-2xl text-sm ${currentTheme.npcMsgBg} border ${currentTheme.npcMsgBorder} ${currentTheme.npcMsgText} rounded-bl-sm shadow-sm flex gap-1 items-center`}>
                    <div className="w-1.5 h-1.5 bg-slate-400 rounded-full animate-bounce"></div>
                    <div className="w-1.5 h-1.5 bg-slate-400 rounded-full animate-bounce delay-75"></div>
                    <div className="w-1.5 h-1.5 bg-slate-400 rounded-full animate-bounce delay-150"></div>
                  </div>
                </div>
              )}
              <div ref={chatEndRef} />
            </div>
            
            {/* Quick Replies & Custom Input */}
            <div className={`p-3 ${currentTheme.chatHeaderBg} border-t ${currentTheme.chatBorder} flex flex-col gap-3`}>
              
              {/* Scrollable Quick Reply Chips */}
              <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-hide">
                {CHAT_OPTIONS.map((opt) => (
                  <button 
                    key={opt.id} 
                    onClick={() => handleAskQuestion(opt)} 
                    disabled={isTyping}
                    className={`whitespace-nowrap px-3 py-1.5 rounded-full border ${currentTheme.chatBorder} ${currentTheme.chatBtnBg} ${currentTheme.chatTextMain} text-xs ${currentTheme.chatBtnHover} transition cursor-pointer shadow-sm disabled:opacity-50`}
                  >
                    {opt.question}
                  </button>
                ))}
              </div>

              {/* Dynamic Text Input */}
              <form onSubmit={handleCustomSubmit} className="flex gap-2">
                <input 
                  type="text" 
                  value={customInput} 
                  onChange={(e) => setCustomInput(e.target.value)} 
                  disabled={isTyping}
                  placeholder="Ask me anything..." 
                  className={`flex-1 px-3 py-2 rounded-lg text-sm bg-white/50 border ${currentTheme.inputBorder} ${currentTheme.textMain} focus:outline-none focus:border-green-500 transition disabled:opacity-50`}
                />
                <button 
                  type="submit" 
                  disabled={isTyping || !customInput.trim()} 
                  className="bg-green-500 hover:bg-green-400 text-white p-2 rounded-lg transition disabled:opacity-50 disabled:bg-green-500/50 flex items-center justify-center"
                >
                  <FiSend size={16} />
                </button>
              </form>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <button onClick={scrollToTop} className={`fixed bottom-8 left-8 p-3 rounded-full ${currentTheme.cardBg} backdrop-blur-md border ${currentTheme.cardBorder} ${currentTheme.textMuted} hover:${currentTheme.textMain} hover:border-green-500 transition-all z-20 shadow-lg group`}>
        <FiArrowUp size={20} className="group-hover:-translate-y-1 transition-transform" />
      </button>

    </div>
  );
}