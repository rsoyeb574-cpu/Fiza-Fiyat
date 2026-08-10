import React from 'react';
import { 
  Building2, 
  Target, 
  Compass, 
  Sparkles, 
  Award, 
  CheckCircle2, 
  Code, 
  Layers, 
  Cpu, 
  Globe 
} from 'lucide-react';
import { WebsiteSettings } from '../types';
import { FaqAccordion } from '../components/common/FaqAccordion';
import { TeamSection } from '../components/common/TeamSection';

interface AboutPageProps {
  settings: WebsiteSettings;
  setActivePage: (page: string) => void;
}

export const AboutPage: React.FC<AboutPageProps> = ({ settings, setActivePage }) => {
  const timeline = [
    { year: '2016', title: 'Studio Inception', desc: 'Founded as a boutique architectural drafting and 3D modeling consultancy.' },
    { year: '2019', title: 'BIM & CAD Expansion', desc: 'Integrated full Revit LOD 500 BIM coordination and structural engineering services.' },
    { year: '2022', title: 'International Client Network', desc: 'Expanded projects into Dubai, Zurich, London, and San Francisco.' },
    { year: '2024', title: 'Generative AI Integration', desc: 'Pioneered custom neural diffusion pipelines for real-time concept rendering.' },
    { year: '2026', title: 'Fiza Hayat Digital Business Hub', desc: 'Launched unified enterprise digital platform uniting design, engineering, and AI.' }
  ];

  const skillsMatrix = [
    { category: 'Architectural & Engineering', items: ['Autodesk Revit BIM (LOD 500)', 'AutoCAD 2026', 'Rhino 3D', 'Tekla Structures', 'Navisworks Clash Detection'] },
    { category: '3D Visualization & CG', items: ['3ds Max', 'V-Ray & Corona', 'Unreal Engine 5 (Real-time Raytracing)', 'Blender', 'Photoshop Post-Production'] },
    { category: 'Generative AI & Tech', items: ['Custom Midjourney Pipelines', 'Stable Diffusion XL / ComfyUI', 'Runway AI Video', 'Python AI Scripting'] },
    { category: 'Creative & Digital Hub', items: ['Brand Identity Systems', 'After Effects 3D Motion', 'Figma Design Systems', 'React & Next.js Platforms'] }
  ];

  return (
    <div className="pt-28 pb-20 space-y-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      
      {/* Page Title */}
      <div className="text-center space-y-4 max-w-3xl mx-auto">
        <span className="text-blue-400 text-xs font-bold uppercase tracking-widest block">
          Corporate Overview
        </span>
        <h1 className="text-4xl sm:text-5xl font-extrabold text-white tracking-tight">
          About Fiza Hayat
        </h1>
        <p className="text-neutral-400 text-sm leading-relaxed">
          Uniting physical architectural craftsmanship, advanced BIM engineering, and cutting-edge artificial intelligence.
        </p>
      </div>

      {/* Story, Mission & Vision Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="p-8 rounded-3xl bg-neutral-900/60 border border-white/10 space-y-4">
          <div className="w-12 h-12 rounded-2xl bg-blue-600/15 text-blue-400 flex items-center justify-center">
            <Building2 className="w-6 h-6" />
          </div>
          <h3 className="text-xl font-bold text-white">Our Story</h3>
          <p className="text-neutral-400 text-xs leading-relaxed">
            {settings.companyStory}
          </p>
        </div>

        <div className="p-8 rounded-3xl bg-neutral-900/60 border border-white/10 space-y-4">
          <div className="w-12 h-12 rounded-2xl bg-indigo-600/15 text-indigo-400 flex items-center justify-center">
            <Target className="w-6 h-6" />
          </div>
          <h3 className="text-xl font-bold text-white">Mission</h3>
          <p className="text-neutral-400 text-xs leading-relaxed">
            {settings.mission}
          </p>
        </div>

        <div className="p-8 rounded-3xl bg-neutral-900/60 border border-white/10 space-y-4">
          <div className="w-12 h-12 rounded-2xl bg-purple-600/15 text-purple-400 flex items-center justify-center">
            <Compass className="w-6 h-6" />
          </div>
          <h3 className="text-xl font-bold text-white">Vision</h3>
          <p className="text-neutral-400 text-xs leading-relaxed">
            {settings.vision}
          </p>
        </div>
      </div>

      {/* Corporate Timeline */}
      <section className="space-y-8">
        <div className="text-center space-y-2">
          <span className="text-blue-400 text-xs font-bold uppercase tracking-widest block">
            Milestones
          </span>
          <h2 className="text-3xl font-extrabold text-white tracking-tight">
            Our Evolutionary Journey
          </h2>
        </div>

        <div className="relative border-l border-blue-500/30 ml-4 sm:ml-32 space-y-8">
          {timeline.map((item, idx) => (
            <div key={idx} className="relative pl-8 sm:pl-10">
              <div className="absolute -left-3 top-0 w-6 h-6 rounded-full bg-blue-600 border-4 border-neutral-950 flex items-center justify-center"></div>
              <div className="sm:absolute sm:-left-32 sm:top-0 text-blue-400 font-extrabold text-sm sm:w-24 sm:text-right">
                {item.year}
              </div>
              <div className="p-5 rounded-2xl bg-neutral-900/60 border border-white/10 space-y-1">
                <h4 className="text-white font-bold text-sm">{item.title}</h4>
                <p className="text-neutral-400 text-xs leading-relaxed">{item.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Technical Skills & Software Matrix */}
      <section className="space-y-8">
        <div className="text-center space-y-2">
          <span className="text-blue-400 text-xs font-bold uppercase tracking-widest block">
            Technical Arsenal
          </span>
          <h2 className="text-3xl font-extrabold text-white tracking-tight">
            Software & Engineering Capabilities
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {skillsMatrix.map((mat, i) => (
            <div key={i} className="p-6 rounded-3xl bg-neutral-900/60 border border-white/10 space-y-4">
              <h3 className="text-base font-bold text-white border-l-2 border-blue-500 pl-3">
                {mat.category}
              </h3>
              <div className="flex flex-wrap gap-2">
                {mat.items.map((item) => (
                  <span
                    key={item}
                    className="px-3 py-1.5 rounded-xl bg-neutral-800 text-neutral-300 text-xs font-medium border border-white/5 flex items-center gap-1.5"
                  >
                    <CheckCircle2 className="w-3.5 h-3.5 text-blue-400" />
                    {item}
                  </span>
                ))}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Project Contributors & Team Specialists */}
      <TeamSection />

      {/* Frequently Asked Questions */}
      <FaqAccordion />

      {/* CTA */}
      <div className="text-center pt-8">
        <button
          onClick={() => setActivePage('contact')}
          className="px-8 py-4 rounded-2xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white font-semibold text-xs shadow-xl transition-all cursor-pointer"
        >
          Work With Fiza Hayat Team
        </button>
      </div>

    </div>
  );
};
