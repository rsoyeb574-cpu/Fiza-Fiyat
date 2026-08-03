import React, { useState } from 'react';
import { Mail, Phone, MapPin, Send, MessageSquare, Check, Sparkles } from 'lucide-react';
import { WebsiteSettings } from '../types';
import { sendInquiry } from '../services/db';

interface ContactPageProps {
  settings: WebsiteSettings;
}

export const ContactPage: React.FC<ContactPageProps> = ({ settings }) => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    service: 'Building Design',
    budget: '$50,000 - $100,000',
    message: ''
  });
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.email || !formData.message) return;
    setLoading(true);

    try {
      await sendInquiry({
        name: formData.name,
        email: formData.email,
        phone: formData.phone,
        service: formData.service,
        budget: formData.budget,
        message: formData.message
      });
      setSubmitted(true);
      setFormData({
        name: '',
        email: '',
        phone: '',
        service: 'Building Design',
        budget: '$50,000 - $100,000',
        message: ''
      });
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  const whatsappNum = settings.whatsappNumber ? settings.whatsappNumber.replace(/[^0-9]/g, '') : '18005553492';
  const whatsappUrl = `https://wa.me/${whatsappNum}?text=${encodeURIComponent('Hello Fiza Hayat Team, I would like to inquire about your architectural/design/AI services.')}`;

  return (
    <div className="pt-28 pb-20 space-y-12 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      
      {/* Title */}
      <div className="text-center space-y-4 max-w-3xl mx-auto">
        <span className="text-blue-400 text-xs font-bold uppercase tracking-widest block">
          Get in Touch
        </span>
        <h1 className="text-4xl sm:text-5xl font-extrabold text-white tracking-tight">
          Initiate Your Project
        </h1>
        <p className="text-neutral-400 text-sm leading-relaxed">
          Contact our international studio offices in Dubai and Zurich. Send an inquiry or schedule a direct consultation call.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
        
        {/* Contact Details & Direct Channels */}
        <div className="space-y-8">
          <div className="p-8 rounded-3xl bg-neutral-900/60 border border-white/10 space-y-6">
            <h3 className="text-xl font-bold text-white">Executive Studio Offices</h3>
            
            <div className="space-y-4 text-xs">
              <div className="flex items-start space-x-3">
                <MapPin className="w-5 h-5 text-blue-400 shrink-0 mt-0.5" />
                <div>
                  <div className="text-white font-semibold">Primary Address</div>
                  <div className="text-neutral-400 mt-0.5">{settings.address || 'Executive Tower, Downtown Dubai / Geneva'}</div>
                </div>
              </div>

              <div className="flex items-start space-x-3">
                <Mail className="w-5 h-5 text-blue-400 shrink-0 mt-0.5" />
                <div>
                  <div className="text-white font-semibold">Email Inquiries</div>
                  <a href={`mailto:${settings.companyEmail}`} className="text-blue-400 hover:underline mt-0.5 block">
                    {settings.companyEmail || 'contact@fizahayat.com'}
                  </a>
                </div>
              </div>

              <div className="flex items-start space-x-3">
                <Phone className="w-5 h-5 text-blue-400 shrink-0 mt-0.5" />
                <div>
                  <div className="text-white font-semibold">Phone Support</div>
                  <a href={`tel:${settings.companyPhone}`} className="text-blue-400 hover:underline mt-0.5 block">
                    {settings.companyPhone || '+1 (800) 555-FIZA'}
                  </a>
                </div>
              </div>
            </div>

            <div className="pt-4 border-t border-white/10">
              <a
                href={whatsappUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full py-3.5 rounded-2xl bg-emerald-600 hover:bg-emerald-500 text-white font-semibold text-xs flex items-center justify-center space-x-2 shadow-xl transition-all cursor-pointer"
              >
                <MessageSquare className="w-4 h-4 fill-white" />
                <span>Chat Directly on WhatsApp</span>
              </a>
            </div>
          </div>

          {/* Embedded Google Map */}
          <div className="rounded-3xl overflow-hidden border border-white/10 h-64 relative">
            <iframe
              title="Studio Location Map"
              src={settings.googleMapsEmbed}
              className="w-full h-full border-0"
              loading="lazy"
            ></iframe>
          </div>
        </div>

        {/* Contact Form */}
        <div className="p-8 rounded-3xl bg-neutral-900/80 border border-white/10 space-y-6">
          <div className="space-y-1">
            <h3 className="text-xl font-bold text-white">Send a Project Proposal Inquiry</h3>
            <p className="text-neutral-400 text-xs">Fill out the form below to receive a custom proposal and fee estimate.</p>
          </div>

          {submitted ? (
            <div className="p-6 rounded-2xl bg-green-950/80 border border-green-500/30 text-green-300 space-y-2">
              <div className="flex items-center space-x-2 font-bold text-sm">
                <Check className="w-5 h-5 text-green-400" />
                <span>Inquiry Submitted Successfully!</span>
              </div>
              <p className="text-xs text-green-400/80">
                Thank you for reaching out to Fiza Hayat. Our principal architectural design team will review your requirements and respond within 24 hours.
              </p>
              <button
                onClick={() => setSubmitted(false)}
                className="mt-2 text-xs text-blue-400 font-semibold hover:underline"
              >
                Send another message
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4 text-xs">
              <div>
                <label className="block text-neutral-300 font-semibold mb-1">Your Full Name *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Marcus Vance"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full px-4 py-3 rounded-xl bg-neutral-950 border border-white/10 text-white placeholder-neutral-500 focus:outline-none focus:border-blue-500"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-neutral-300 font-semibold mb-1">Corporate Email *</label>
                  <input
                    type="email"
                    required
                    placeholder="email@company.com"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className="w-full px-4 py-3 rounded-xl bg-neutral-950 border border-white/10 text-white placeholder-neutral-500 focus:outline-none focus:border-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-neutral-300 font-semibold mb-1">Phone Number</label>
                  <input
                    type="tel"
                    placeholder="+1 (555) 000-0000"
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    className="w-full px-4 py-3 rounded-xl bg-neutral-950 border border-white/10 text-white placeholder-neutral-500 focus:outline-none focus:border-blue-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-neutral-300 font-semibold mb-1">Select Primary Service</label>
                  <select
                    value={formData.service}
                    onChange={(e) => setFormData({ ...formData, service: e.target.value })}
                    className="w-full px-4 py-3 rounded-xl bg-neutral-950 border border-white/10 text-white focus:outline-none cursor-pointer"
                  >
                    <option value="Building Design">Building Design & Planning</option>
                    <option value="Luxury Interior">Luxury Interior Design</option>
                    <option value="Parametric Exterior">Parametric Exterior</option>
                    <option value="Revit BIM & CAD">Revit BIM & AutoCAD</option>
                    <option value="8K 3D Rendering">8K 3D Rendering</option>
                    <option value="AI Image/Video">AI Generative Media</option>
                    <option value="Brand Identity">Brand Identity & Motion</option>
                    <option value="Website & UI/UX">Luxury Web & UI/UX</option>
                  </select>
                </div>

                <div>
                  <label className="block text-neutral-300 font-semibold mb-1">Estimated Budget</label>
                  <select
                    value={formData.budget}
                    onChange={(e) => setFormData({ ...formData, budget: e.target.value })}
                    className="w-full px-4 py-3 rounded-xl bg-neutral-950 border border-white/10 text-white focus:outline-none cursor-pointer"
                  >
                    <option value="$10,000 - $25,000">$10,000 – $25,000 USD</option>
                    <option value="$25,000 - $50,000">$25,000 – $50,000 USD</option>
                    <option value="$50,000 - $100,000">$50,000 – $100,000 USD</option>
                    <option value="$100,000+">$100,000+ USD</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-neutral-300 font-semibold mb-1">Project Scope & Details *</label>
                <textarea
                  required
                  rows={4}
                  placeholder="Describe your site location, square footage, architectural vision or timeline..."
                  value={formData.message}
                  onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                  className="w-full px-4 py-3 rounded-xl bg-neutral-950 border border-white/10 text-white placeholder-neutral-500 focus:outline-none focus:border-blue-500"
                ></textarea>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full py-4 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white font-semibold text-xs shadow-xl transition-all cursor-pointer flex items-center justify-center space-x-2"
              >
                <span>{loading ? 'Submitting Inquiry...' : 'Submit Proposal Inquiry'}</span>
                <Send className="w-4 h-4" />
              </button>
            </form>
          )}
        </div>

      </div>

    </div>
  );
};
