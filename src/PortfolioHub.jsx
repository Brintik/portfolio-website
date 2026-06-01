/* Imports and Dependencies */
import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FiArrowUp, FiGithub, FiLinkedin, FiMail, FiExternalLink, FiArrowRight, FiMapPin, FiDownload, FiMenu, FiX } from 'react-icons/fi';
import { SiKaggle } from 'react-icons/si';
import { useNavigate } from 'react-router-dom';
import { SITE_DATA } from './portfolioData';

/* Configuration Flags */
const DEBUG_MODE = false; 

/* Desktop Coordinate Matrices */
const CHARACTER_POSITIONS = {
  morning: { top: '33%', left: '67%', width: '10%', height: '35%', bubbleTop: '-4rem', bubbleLeft: '50%', bubbleAlign: '-50%' }, 
  afternoon: { top: '27.5%', left: '70%', width: '9%', height: '44%', bubbleTop: '-4rem', bubbleLeft: '50%', bubbleAlign: '-50%' }, 
  night: { top: '42.5%', left: '52%', width: '9%', height: '30%', bubbleTop: '-4rem', bubbleLeft: '50%', bubbleAlign: '-50%' }       
};

const SHELF_PROJECTS = [
  { id: 11, name: "AI Image Recognizer", top: '23.5%', left: '9.8%', width: '4.5%', height: '14%', targetId: 'project-11' },
  { id: 12, name: "Model Ship Project", top: '25.2%', left: '17%', width: '4%', height: '13%', targetId: 'project-12' },
  { id: 13, name: "Plant Pot App", top: '27.5%', left: '27.5%', width: '5%', height: '12%', targetId: 'project-13' },
];

/* Mobile Coordinate Matrices (9:20 Aspect Ratio) */
const MOBILE_CHARACTER_POSITIONS = {
  morning: { top: '40%', left: '73%', width: '19%', height: '19%', bubbleTop: '-3rem', bubbleLeft: '20%', bubbleAlign: '-50%' }, 
  afternoon: { top: '40%', left: '66%', width: '17%', height: '26%', bubbleTop: '-3rem', bubbleLeft: '20%', bubbleAlign: '-50%' }, 
  night: { top: '47%', left: '60%', width: '20%', height: '18%', bubbleTop: '-3rem', bubbleLeft: '20%', bubbleAlign: '-50%' }      
};

const MOBILE_SHELF_PROJECTS = [
  { id: 11, name: "AI Image Recognizer", top: '35%', left: '0%', width: '8%', height: '9%', targetId: 'project-11' },
  { id: 12, name: "Model Ship Project", top: '36%', left: '9.2%', width: '6.5%', height: '8%', targetId: 'project-12' },
  { id: 13, name: "Plant Pot App", top: '36.5%', left: '20%', width: '12%', height: '8%', targetId: 'project-13' },
];

/* Theme Configuration Dictionary */
const THEME_CONFIG = {
  morning: { 
    navRgb: '186, 230, 253', pageBg: 'bg-sky-50/95', textMain: 'text-slate-900', textMuted: 'text-slate-700', cardBg: 'bg-white', cardBorder: 'border-slate-200', footerBg: 'bg-slate-100', inputBg: 'bg-white', inputBorder: 'border-slate-300',
    navText: 'text-blue-900', accentText: 'text-blue-800', accentBg: 'bg-blue-800', accentHoverBg: 'hover:bg-blue-700', accentBorder: 'border-blue-800', accentHoverBorder: 'hover:border-blue-700', accentHoverText: 'hover:text-blue-700', accentLightBg: 'bg-blue-800/10', accentLightBorder: 'border-blue-800/20', selectionBg: 'selection:bg-blue-800'
  },
  afternoon: { 
    navRgb: '255, 237, 213', pageBg: 'bg-orange-50/95', textMain: 'text-slate-900', textMuted: 'text-slate-700', cardBg: 'bg-white', cardBorder: 'border-slate-200', footerBg: 'bg-slate-100', inputBg: 'bg-white', inputBorder: 'border-slate-300',
    navText: 'text-amber-900', accentText: 'text-amber-800', accentBg: 'bg-amber-800', accentHoverBg: 'hover:bg-amber-700', accentBorder: 'border-amber-800', accentHoverBorder: 'hover:border-amber-700', accentHoverText: 'hover:text-amber-700', accentLightBg: 'bg-amber-800/10', accentLightBorder: 'border-amber-800/20', selectionBg: 'selection:bg-amber-800'
  },
  night: { 
    navRgb: '15, 23, 42', pageBg: 'bg-slate-900/95', textMain: 'text-white', textMuted: 'text-slate-300', cardBg: 'bg-slate-900/60', cardBorder: 'border-slate-800/50', footerBg: 'bg-slate-900', inputBg: 'bg-slate-950', inputBorder: 'border-slate-800',
    navText: 'text-white', accentText: 'text-green-500', accentBg: 'bg-green-500', accentHoverBg: 'hover:bg-green-400', accentBorder: 'border-green-500', accentHoverBorder: 'hover:border-green-400', accentHoverText: 'hover:text-green-400', accentLightBg: 'bg-green-500/10', accentLightBorder: 'border-green-500/20', selectionBg: 'selection:bg-green-500'
  }
};

/* Main Application Component */
export default function PortfolioHub({ setIsChatOpen }) {
  /* State Management */
  const [timeOfDay, setTimeOfDay] = useState('afternoon');
  const [bgLoaded, setBgLoaded] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const navigate = useNavigate();

  /* Lifecycle: Viewport Dimension Observer */
  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 768);
    handleResize(); 
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  /* Lifecycle: Mobile Navigation Scroll Lock Observer */
  useEffect(() => {
    if (isMobileMenuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => { document.body.style.overflow = 'unset'; };
  }, [isMobileMenuOpen]);

  /* Lifecycle: System Chronological Observer */
  useEffect(() => {
    const hour = new Date().getHours();
    if (hour >= 6 && hour < 12) setTimeOfDay('morning');
    else if (hour >= 12 && hour < 18) setTimeOfDay('afternoon');
    else setTimeOfDay('night');
  }, []);

  /* Lifecycle: Session State Scroll Restoration */
  useEffect(() => {
    const savedScrollPos = sessionStorage.getItem('portfolioScrollPos');
    if (savedScrollPos) {
      window.scrollTo({ top: parseInt(savedScrollPos, 10), behavior: 'instant' });
      sessionStorage.removeItem('portfolioScrollPos');
    }
  }, []);

  /* Handlers: Navigation and DOM Manipulation */
  const handleProjectNavigation = (url) => {
    sessionStorage.setItem('portfolioScrollPos', window.scrollY);
    navigate(url);
  };

  const scrollToTop = () => window.scrollTo({ top: 0, behavior: 'smooth' });
  const scrollToSection = (id) => {
    const element = document.getElementById(id);
    if (element) {
      const y = element.getBoundingClientRect().top + window.scrollY - 80;
      window.scrollTo({ top: y, behavior: 'smooth' });
    }
  };

  /* Derived State Variables */
  const currentTheme = THEME_CONFIG[timeOfDay];
  const activeCharPos = isMobile ? MOBILE_CHARACTER_POSITIONS[timeOfDay] : CHARACTER_POSITIONS[timeOfDay];
  const activeShelf = isMobile ? MOBILE_SHELF_PROJECTS : SHELF_PROJECTS;
  const activeImage = isMobile ? `/${timeOfDay}-mobile.png` : `/${timeOfDay}.png`; 
  
  const scalerStyle = isMobile 
    ? { width: '100vw', height: '222.22vw', minHeight: '100vh', minWidth: '45vh' }
    : { width: '100vw', height: '56.25vw', minHeight: '100vh', minWidth: '177.77vh' };

  /* Render Output */
  return (
    <div className={`relative w-full min-h-screen font-sans ${currentTheme.selectionBg} selection:text-white`}>
      
      {/* Primary Navigation Layer */}
      <nav className="fixed top-0 left-0 w-full h-16 z-[100] flex items-center justify-between px-6 md:px-8 backdrop-blur-md transition-colors duration-500 border-b border-transparent" style={{ backgroundColor: `rgba(${currentTheme.navRgb}, 0.6)` }}>
        <div className={`font-black text-xl tracking-tighter cursor-pointer ${currentTheme.navText}`} onClick={scrollToTop}>
          BRINTIK<span className="opacity-50">.dev</span>
        </div>
        
        {/* Navigation Interface: Desktop Layout */}
        <div className={`hidden md:flex items-center space-x-6 font-medium text-sm drop-shadow-sm ${currentTheme.navText}`}>
          <button onClick={() => scrollToSection('about')} className={`${currentTheme.accentHoverText} transition`}>About</button>
          <button onClick={() => scrollToSection('resume')} className={`${currentTheme.accentHoverText} transition`}>Resume</button>
          <button onClick={() => scrollToSection('projects')} className={`${currentTheme.accentHoverText} transition`}>Projects</button>
          <div className="h-4 w-px bg-current opacity-30"></div> 
          <a href={SITE_DATA.links.github} target="_blank" rel="noreferrer" className={`${currentTheme.accentHoverText} transition flex items-center gap-2`}><FiGithub size={16}/> GitHub</a>
          <a href={SITE_DATA.links.linkedin} target="_blank" rel="noreferrer" className={`${currentTheme.accentHoverText} transition flex items-center gap-2`}><FiLinkedin size={16}/> LinkedIn</a>
          <a href={SITE_DATA.links.kaggle} target="_blank" rel="noreferrer" className={`${currentTheme.accentHoverText} transition flex items-center gap-2`}><SiKaggle size={16}/> Kaggle</a>
          <button onClick={() => scrollToSection('contact')} className={`${currentTheme.accentHoverText} transition flex items-center gap-2`}><FiMail size={16}/> Contact</button>
        </div>

        {/* Navigation Interface: Mobile Toggle Hook */}
        <button onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)} className={`md:hidden p-2 ${currentTheme.navText}`}>
          {isMobileMenuOpen ? <FiX size={24} /> : <FiMenu size={24} />}
        </button>
      </nav>

      {/* Mobile Navigation State Rendering */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <>
            <motion.div 
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              onClick={() => setIsMobileMenuOpen(false)}
              className="fixed inset-0 z-[85] bg-black/10 backdrop-blur-sm md:hidden"
            />
            <motion.div 
              initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }}
              className={`fixed top-16 left-0 w-full z-[90] flex flex-col items-center justify-center space-y-6 py-8 text-xl font-bold border-b shadow-2xl rounded-b-3xl ${currentTheme.pageBg} ${currentTheme.cardBorder} md:hidden`}
            >
              <button onClick={() => { scrollToSection('about'); setIsMobileMenuOpen(false); }} className={currentTheme.textMain}>About</button>
              <button onClick={() => { scrollToSection('resume'); setIsMobileMenuOpen(false); }} className={currentTheme.textMain}>Resume</button>
              <button onClick={() => { scrollToSection('projects'); setIsMobileMenuOpen(false); }} className={currentTheme.textMain}>Projects</button>
              <button onClick={() => { scrollToSection('contact'); setIsMobileMenuOpen(false); }} className={currentTheme.textMain}>Contact</button>
              
              <div className="flex items-center gap-8 mt-4 pt-6 border-t border-current/10 w-2/3 justify-center">
                <a href={SITE_DATA.links.github} target="_blank" rel="noreferrer" className={`${currentTheme.accentText} ${currentTheme.accentHoverText} transition`}><FiGithub size={28}/></a>
                <a href={SITE_DATA.links.linkedin} target="_blank" rel="noreferrer" className={`${currentTheme.accentText} ${currentTheme.accentHoverText} transition`}><FiLinkedin size={28}/></a>
                <a href={SITE_DATA.links.kaggle} target="_blank" rel="noreferrer" className={`${currentTheme.accentText} ${currentTheme.accentHoverText} transition`}><SiKaggle size={28}/></a>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* Core Environmental Matrix & Interactive Scaler */}
      <div className="fixed inset-0 w-full h-full z-0 bg-slate-900 overflow-hidden">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2" style={scalerStyle}>
          <motion.img 
            src={activeImage} 
            alt="Room Environment" 
            initial={{ opacity: 0 }} 
            animate={{ opacity: bgLoaded ? 1 : 0 }} 
            transition={{ duration: 1.5, ease: "easeOut" }}
            onLoad={() => setBgLoaded(true)}
            className="w-full h-full object-cover" 
          />
          
          {bgLoaded && (
            <div className="absolute inset-0 pt-16 z-10">
              
              {/* Interaction Layer: Assistant Entity Hitbox */}
              <div onClick={() => setIsChatOpen(true)} className={`absolute cursor-pointer group ${DEBUG_MODE ? 'bg-red-500/50' : ''}`} style={activeCharPos}>
                <div className="absolute pointer-events-none" style={{ top: activeCharPos.bubbleTop, left: activeCharPos.bubbleLeft, transform: `translateX(${activeCharPos.bubbleAlign})` }}>
                  <motion.div animate={{ y: [0, -8, 0] }} transition={{ repeat: Infinity, duration: 2.5 }} className="bg-white/90 backdrop-blur-sm text-slate-900 font-extrabold text-sm px-4 py-2 rounded-2xl border-2 border-slate-900 shadow-[4px_4px_0_0_rgba(15,23,42,1)] group-hover:scale-110 transition-transform whitespace-nowrap pointer-events-auto">
                    Hey. Wanna chat?
                    <div className="absolute -bottom-[8px] left-1/2 -translate-x-1/2 w-0 h-0 border-l-[8px] border-l-transparent border-r-[8px] border-r-transparent border-t-[8px] border-t-slate-900"></div>
                  </motion.div>
                </div>
              </div>

              {/* Interaction Layer: Active Project Nodes */}
              {activeShelf.map((project) => (
                <div key={project.id} onClick={() => scrollToSection(project.targetId)} className={`absolute cursor-pointer group flex items-center justify-center ${DEBUG_MODE ? 'bg-blue-500/50' : ''}`} style={{ top: project.top, left: project.left, width: project.width, height: project.height }}>
                  <div className="absolute w-full h-full group-hover:scale-90 transition-transform duration-300">
                    <div className={`absolute top-0 left-0 w-4 h-4 border-t-[3px] border-l-[3px] border-white/50 ${currentTheme.accentHoverBorder}`} />
                    <div className={`absolute top-0 right-0 w-4 h-4 border-t-[3px] border-r-[3px] border-white/50 ${currentTheme.accentHoverBorder}`} />
                    <div className={`absolute bottom-0 left-0 w-4 h-4 border-b-[3px] border-l-[3px] border-white/50 ${currentTheme.accentHoverBorder}`} />
                    <div className={`absolute bottom-0 right-0 w-4 h-4 border-b-[3px] border-r-[3px] border-white/50 ${currentTheme.accentHoverBorder}`} />
                  </div>
                  <motion.div initial={{ opacity: 0, y: 10 }} whileHover={{ opacity: 1, y: 0 }} className="absolute -top-10 left-1/2 -translate-x-1/2 bg-slate-900 text-white font-bold text-xs px-3 py-1.5 rounded-md whitespace-nowrap pointer-events-none opacity-0 group-hover:opacity-100 z-20 border border-slate-700">
                    {project.name}
                  </motion.div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Content Container Layer */}
      <div className="relative z-10 w-full flex flex-col pointer-events-none">
        <div className="w-full h-screen"></div>
        
        <div className={`w-full backdrop-blur-2xl shadow-[0_-20px_50px_rgba(0,0,0,0.5)] border-t border-slate-500/20 ${currentTheme.pageBg} pointer-events-auto transition-colors duration-1000 z-20 relative`}>
          
          <section id="about" className="py-32 px-6 max-w-4xl mx-auto text-center md:text-left">
            <h2 className={`text-4xl font-extrabold mb-6 ${currentTheme.textMain}`}>About <span className={currentTheme.accentText}>Me</span></h2>
            <div className={`h-1 w-20 rounded-full mb-10 mx-auto md:mx-0 ${currentTheme.accentBg}`}></div>
            <p className={`text-xl leading-relaxed font-medium whitespace-pre-line ${currentTheme.textMuted}`}>{SITE_DATA.aboutMe}</p>
          </section>

          <section id="resume" className="py-12 px-6 max-w-4xl mx-auto">
            <div className={`${currentTheme.cardBg} border ${currentTheme.cardBorder} rounded-3xl p-8 flex flex-col md:flex-row items-center justify-between shadow-lg`}>
              <div>
                <h2 className={`text-3xl font-extrabold mb-2 ${currentTheme.textMain}`}>Brintik Majumder</h2>
                <p className={`${currentTheme.accentText} font-mono font-bold`}>Full-Stack Software Engineer</p>
              </div>
              <a href={SITE_DATA.links.resume} target="_blank" rel="noopener noreferrer" className={`mt-6 md:mt-0 flex items-center gap-3 px-8 py-4 ${currentTheme.accentBg} ${currentTheme.accentHoverBg} text-white font-extrabold rounded-xl transition-all shadow-lg hover:-translate-y-1`}>
                <FiDownload size={20} /> View Full Resume
              </a>
            </div>
          </section>

          <section id="projects" className="py-24 px-6 max-w-5xl mx-auto">
            <h2 className={`text-4xl font-extrabold mb-6 ${currentTheme.textMain}`}>Selected <span className={currentTheme.accentText}>Works</span></h2>
            <div className="space-y-16 mt-16">
              {SITE_DATA.projects.map((proj) => (
                <div key={proj.id} id={proj.id} onClick={() => handleProjectNavigation(proj.readMoreUrl)} className={`group flex flex-col md:flex-row ${currentTheme.cardBg} border ${currentTheme.cardBorder} rounded-2xl overflow-hidden ${currentTheme.accentHoverBorder} transition-all cursor-pointer shadow-xl`}>
                  <div className="w-full md:w-5/12 h-64 md:h-auto relative overflow-hidden bg-slate-900">
                    <img src={proj.image} alt={proj.title} className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 opacity-80 group-hover:opacity-100" />
                  </div>
                  <div className="w-full md:w-7/12 p-8 md:p-12 flex flex-col justify-center">
                    <h3 className={`text-3xl font-bold mb-4 ${currentTheme.accentHoverText} transition-colors ${currentTheme.textMain}`}>{proj.title}</h3>
                    <p className={`leading-relaxed mb-6 whitespace-pre-line ${currentTheme.textMuted}`}>{proj.shortDesc}</p>
                    
                    {proj.tags && (
                      <div className="flex flex-wrap gap-2 mb-8">
                        {proj.tags.map((tag, i) => (
                          <span key={i} className={`px-3 py-1 text-xs font-bold rounded-md ${currentTheme.accentLightBg} ${currentTheme.accentText} border ${currentTheme.accentLightBorder}`}>
                            {tag}
                          </span>
                        ))}
                      </div>
                    )}
                    
                    <div className="flex items-center gap-6 mt-auto">
                      <a href={proj.websiteUrl} onClick={(e) => {
                          e.stopPropagation();
                          if (proj.id === 'project-13') {
                            e.preventDefault();
                            window.open(proj.websiteUrl, '_blank');
                            window.open('https://portfolio-website-mocha-one.vercel.app/?openChat=true', '_blank');
                          }
                        }} target="_blank" rel="noopener noreferrer" className={`flex items-center gap-2 text-sm font-bold px-4 py-2 rounded-lg border ${currentTheme.cardBorder} ${currentTheme.accentHoverBorder} ${currentTheme.accentText} transition`}>
                        <FiExternalLink /> Live Site
                      </a>
                      <span className={`flex items-center gap-2 text-sm font-bold ${currentTheme.accentText} group-hover:translate-x-2 transition-transform`}>
                        Read Case Study <FiArrowRight />
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </section>

          <footer id="contact" className={`${currentTheme.footerBg} border-t ${currentTheme.cardBorder} py-24 transition-colors duration-1000`}>
            <div className="max-w-4xl mx-auto px-6 flex flex-col md:flex-row gap-16">
              <div className="w-full md:w-1/2 flex flex-col">
                <h2 className={`text-3xl font-bold mb-6 ${currentTheme.textMain}`}>Let's Connect.</h2>
                <p className={`mb-8 ${currentTheme.textMuted}`}>Currently open for new opportunities. Whether you have a question or just want to say hi, I'll try my best to get back to you!</p>
                <div className="flex flex-col gap-4 mb-8">
                  <a href={`mailto:${SITE_DATA.links.email}`} className={`flex items-center gap-4 ${currentTheme.accentHoverText} transition w-fit ${currentTheme.textMuted}`}>
                    <FiMail className="text-xl" /> {SITE_DATA.links.email}
                  </a>
                  <div className={`flex items-center gap-4 ${currentTheme.textMuted}`}>
                    <FiMapPin className={`text-xl ${currentTheme.accentText}`} /> West Bengal, India
                  </div>
                </div>
                <div className="flex gap-4 mt-auto">
                  <a href={SITE_DATA.links.github} target="_blank" rel="noreferrer" className={`p-3 ${currentTheme.inputBg} border ${currentTheme.cardBorder} ${currentTheme.accentHoverBorder} ${currentTheme.textMain} rounded-lg transition`}><FiGithub size={20} /></a>
                  <a href={SITE_DATA.links.linkedin} target="_blank" rel="noreferrer" className={`p-3 ${currentTheme.inputBg} border ${currentTheme.cardBorder} ${currentTheme.accentHoverBorder} ${currentTheme.textMain} rounded-lg transition`}><FiLinkedin size={20} /></a>
                  <a href={SITE_DATA.links.kaggle} target="_blank" rel="noreferrer" className={`p-3 ${currentTheme.inputBg} border ${currentTheme.cardBorder} ${currentTheme.accentHoverBorder} ${currentTheme.textMain} rounded-lg transition`}><SiKaggle size={20} /></a>
                </div>
              </div>

              <div className="w-full md:w-1/2">
                <form action="https://formspree.io/f/mbdbenyl" method="POST" className="flex flex-col gap-4">
                  <input type="text" name="name" required placeholder="Your Name" className={`w-full p-4 rounded-xl ${currentTheme.inputBg} border ${currentTheme.inputBorder} ${currentTheme.textMain} focus:outline-none focus:border-transparent focus:ring-1 focus:ring-[${currentTheme.accentBorder}] transition-colors`} />
                  <input type="email" name="email" required placeholder="Your Email Address" className={`w-full p-4 rounded-xl ${currentTheme.inputBg} border ${currentTheme.inputBorder} ${currentTheme.textMain} focus:outline-none focus:border-transparent focus:ring-1 focus:ring-[${currentTheme.accentBorder}] transition-colors`} />
                  <textarea name="message" required rows="4" placeholder="Your Message" className={`w-full p-4 rounded-xl ${currentTheme.inputBg} border ${currentTheme.inputBorder} ${currentTheme.textMain} focus:outline-none focus:border-transparent focus:ring-1 focus:ring-[${currentTheme.accentBorder}] transition-colors resize-none`}></textarea>
                  <button type="submit" className={`w-full py-4 rounded-xl ${currentTheme.accentBg} ${currentTheme.accentHoverBg} text-white font-bold transition`}>Send Message</button>
                </form>
              </div>
            </div>
          </footer>
        </div>
      </div>

      {/* Floating Action Component */}
      <button onClick={scrollToTop} className={`fixed bottom-6 left-6 md:bottom-8 md:left-8 p-3 rounded-full ${currentTheme.cardBg} backdrop-blur-md border ${currentTheme.cardBorder} ${currentTheme.textMuted} hover:${currentTheme.textMain} ${currentTheme.accentHoverBorder} transition-all z-[60] shadow-lg group`}>
        <FiArrowUp size={20} className="group-hover:-translate-y-1 transition-transform" />
      </button>
    </div>
  );
}