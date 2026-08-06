import React, { useState } from 'react';
import { Sparkles, FileText, Share2, Search, BookOpen, Copy, Check } from 'lucide-react';

export const AIContentAssistant: React.FC = () => {
  const [contentType, setContentType] = useState<'project_desc' | 'blog_article' | 'social_caption' | 'seo_meta' | 'service_desc'>('project_desc');
  const [titleInput, setTitleInput] = useState('Grand Azure Luxury Villa - Palm Jumeirah');
  const [keywords, setKeywords] = useState('BIM LOD 500, luxury villa architecture, Revit modeling, 8K photorealistic rendering');
  const [copied, setCopied] = useState(false);
  const [generatedContent, setGeneratedContent] = useState('');

  const handleGenerate = (e: React.FormEvent) => {
    e.preventDefault();
    if (!titleInput.trim()) return;

    let output = '';
    if (contentType === 'project_desc') {
      output = `Architectural Overview:\n${titleInput} represents a pinnacle of luxury residential architecture combining cantilevered reinforced concrete volumes, double-height glazing, and seamless indoor-outdoor tropical gardens. Engineered to BIM LOD 500 standards in Autodesk Revit, the project incorporates smart home automation, post-tensioned slab ceilings, and sustainable solar facade shading.\n\nKey Highlights:\n- Total Built-Up Area: 12,500 sq.ft across G+2 floors\n- Materials: Imported Italian Bottechino marble, slimline thermal-break aluminum windows, and APP modified roof membrane\n- Rendered in Unreal Engine 5 at 8K photorealistic clarity.`;
    } else if (contentType === 'blog_article') {
      output = `# ${titleInput}\n\nIn modern luxury residential construction, structural longevity and thermal efficiency must go hand in hand. With rising climate temperatures, architects are increasingly turning to fly ash blended PPC cement, AAC lightweight masonry, and double-glazed low-E glass facade systems.\n\n## 1. Structural Efficiency with Post-Tensioned Slabs\nBy utilizing post-tensioned concrete slabs, structural engineers can eliminate bulky interior columns, allowing column-free open living halls spanning over 35 feet.\n\n## 2. BIM Coordination & Clash Detection\nBefore a single shovel hits the dirt, Autodesk Revit BIM modeling identifies MEP electrical and plumbing pipe clashes in 3D, saving up to 18% in site rework costs.`;
    } else if (contentType === 'social_caption') {
      output = `✨ Step inside the future of luxury living with ${titleInput}! 🏡\n\nEngineered with precision BIM LOD 500 Revit modeling and brought to life with 8K photorealistic rendering. From double-height marble entry halls to cantilevered infinity pools, every millimeter is crafted for perfection.\n\n📍 Location: Dubai / International\n📐 Architecture: Fiza Hayat Digital Business Hub\n\n💬 DM us today or visit fizahayat.com to turn your dream estate into reality!\n\n#ArchitecturalDesign #LuxuryVilla #RevitBIM #3DRendering #FizaHayat #ArchitectureExcellence`;
    } else if (contentType === 'seo_meta') {
      output = `SEO Meta Title: ${titleInput} | Fiza Hayat Architecture & BIM Hub\n\nSEO Meta Description: Explore ${titleInput} featuring bespoke architectural planning, Revit BIM LOD 500 modeling, and 8K rendering. Contact Fiza Hayat for world-class design services.\n\nFocus Keywords: ${keywords}\nCanonical URL: https://fizahayat.com/portfolio/grand-azure-villa`;
    } else {
      output = `Service Description for ${titleInput}:\nOur end-to-end architectural and BIM engineering service delivers complete municipal submission drawings, 3D structural modeling, bill of quantities (BOQ) cost estimation, and ongoing site supervision. Compliant with international building codes (IS 456 / Eurocode).`;
    }

    setGeneratedContent(output);
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(generatedContent);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="space-y-6 text-xs">
      <div className="p-6 rounded-3xl bg-slate-900 border border-white/10 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-base font-black text-white flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-purple-400" />
            <span>AI Architectural Content Assistant & Marketing Studio</span>
          </h2>
          <p className="text-slate-400 text-xs mt-0.5">
            Generates project descriptions, portfolio copy, blog articles, social captions, SEO metadata & service copy.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <form onSubmit={handleGenerate} className="p-6 rounded-3xl bg-slate-900 border border-white/10 space-y-4">
          <h3 className="font-bold text-white text-sm border-b border-white/10 pb-3">Content Parameters</h3>

          <div>
            <label className="block text-slate-300 font-semibold mb-1">Content Type</label>
            <select
              value={contentType}
              onChange={e => setContentType(e.target.value as any)}
              className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-white/10 text-white"
            >
              <option value="project_desc">Project Description & Specs</option>
              <option value="blog_article">Educational Blog Article</option>
              <option value="social_caption">Social Media Caption & Tags</option>
              <option value="seo_meta">SEO Title & Meta Description</option>
              <option value="service_desc">Service Page Copy</option>
            </select>
          </div>

          <div>
            <label className="block text-slate-300 font-semibold mb-1">Project / Topic Title</label>
            <input 
              type="text" 
              value={titleInput} 
              onChange={e => setTitleInput(e.target.value)} 
              className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-white/10 text-white font-bold" 
            />
          </div>

          <div>
            <label className="block text-slate-300 font-semibold mb-1">Keywords / Focus Tags</label>
            <input 
              type="text" 
              value={keywords} 
              onChange={e => setKeywords(e.target.value)} 
              className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-white/10 text-white font-mono" 
            />
          </div>

          <button
            type="submit"
            className="w-full py-3 rounded-2xl bg-purple-600 hover:bg-purple-500 text-white font-bold shadow-lg flex items-center justify-center gap-2 cursor-pointer"
          >
            <Sparkles className="w-4 h-4 text-purple-300" /> Generate Content
          </button>
        </form>

        <div className="lg:col-span-2 p-6 rounded-3xl bg-slate-900 border border-white/10 space-y-4">
          <div className="flex justify-between items-center border-b border-white/10 pb-3">
            <h3 className="font-bold text-white text-sm flex items-center gap-2">
              <FileText className="w-4 h-4 text-purple-400" /> Generated Copy
            </h3>
            {generatedContent && (
              <button
                onClick={handleCopy}
                className="px-3 py-1.5 rounded-xl bg-purple-950 hover:bg-purple-900 border border-purple-500/30 text-purple-300 font-bold flex items-center gap-1 cursor-pointer"
              >
                {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{copied ? 'Copied!' : 'Copy Text'}</span>
              </button>
            )}
          </div>

          <textarea
            readOnly
            value={generatedContent || 'Click "Generate Content" to synthesize tailored copy for your project.'}
            rows={12}
            className="w-full p-4 rounded-2xl bg-slate-950 border border-white/10 text-slate-200 font-mono text-xs leading-relaxed focus:outline-none"
          />
        </div>
      </div>
    </div>
  );
};
