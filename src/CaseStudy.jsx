import React, { useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { FiArrowLeft, FiExternalLink } from 'react-icons/fi';
import { SITE_DATA } from './portfolioData';

export default function CaseStudy() {
  const { id } = useParams();
  const navigate = useNavigate();
  
  const project = SITE_DATA.projects.find(p => p.id === id);

  // Always scroll to top when this page loads
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  if (!project || !project.caseStudy) {
    return (
      <div className="min-h-screen bg-slate-950 flex flex-col items-center justify-center text-white">
        <h1 className="text-4xl font-bold mb-4">404 - Project Not Found</h1>
        <button onClick={() => navigate('/')} className="text-green-500 hover:underline">Return to Hub</button>
      </div>
    );
  }

  const { caseStudy } = project;

  return (
    <div className="min-h-screen bg-slate-950 text-slate-300 font-sans selection:bg-green-500 selection:text-white pb-24">
      
      {/* FLOATING BACK BUTTON */}
      <button 
        onClick={() => navigate('/')}
        className="fixed top-8 left-8 z-50 flex items-center gap-2 px-4 py-2 bg-slate-900/80 backdrop-blur-md border border-slate-700 rounded-full text-white hover:border-green-500 hover:text-green-400 transition-all shadow-xl group"
      >
        <FiArrowLeft className="group-hover:-translate-x-1 transition-transform" /> Back to Hub
      </button>

      {/* HERO SECTION */}
      <div className="relative w-full h-[60vh] bg-slate-900">
        <div className="absolute inset-0 bg-gradient-to-b from-transparent to-slate-950 z-10"></div>
        <img src={caseStudy.heroImage} alt={project.title} className="w-full h-full object-cover opacity-60" />
        <div className="absolute bottom-0 left-0 w-full z-20 p-8 md:p-16 max-w-5xl mx-auto">
          <div className="flex flex-wrap gap-3 mb-6">
            {project.tags.map((tag, i) => (
              <span key={i} className="px-3 py-1 text-xs font-bold rounded-md bg-green-500/20 text-green-400 border border-green-500/30 backdrop-blur-sm">
                {tag}
              </span>
            ))}
          </div>
          <h1 className="text-5xl md:text-7xl font-black text-white mb-6 tracking-tight">{project.title}</h1>
          <a href={project.websiteUrl} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 px-6 py-3 bg-green-500 hover:bg-green-400 text-white font-bold rounded-xl transition shadow-[0_0_20px_rgba(34,197,94,0.3)] hover:shadow-[0_0_30px_rgba(34,197,94,0.5)]">
            <FiExternalLink /> View Live Application
          </a>
        </div>
      </div>

      {/* ARTICLE CONTENT */}
      <div className="max-w-4xl mx-auto px-6 mt-16 space-y-24">
        
        <section>
          <div className="flex items-center gap-4 mb-8">
            <div className="h-px bg-green-500/50 flex-1"></div>
            <h2 className="text-2xl font-bold text-white uppercase tracking-widest text-green-500">01 / The Challenge</h2>
            <div className="h-px bg-green-500/50 flex-1"></div>
          </div>
          <p className="text-xl leading-relaxed whitespace-pre-line text-slate-400">{caseStudy.challenge}</p>
        </section>

        <section>
          <div className="flex items-center gap-4 mb-8">
            <div className="h-px bg-green-500/50 flex-1"></div>
            <h2 className="text-2xl font-bold text-white uppercase tracking-widest text-green-500">02 / The Architecture</h2>
            <div className="h-px bg-green-500/50 flex-1"></div>
          </div>
          <p className="text-xl leading-relaxed whitespace-pre-line text-slate-400">{caseStudy.solution}</p>
        </section>

        <section>
          <div className="flex items-center gap-4 mb-8">
            <div className="h-px bg-green-500/50 flex-1"></div>
            <h2 className="text-2xl font-bold text-white uppercase tracking-widest text-green-500">03 / The Results</h2>
            <div className="h-px bg-green-500/50 flex-1"></div>
          </div>
          <p className="text-xl leading-relaxed whitespace-pre-line text-slate-400">{caseStudy.results}</p>
        </section>

      </div>
    </div>
  );
}