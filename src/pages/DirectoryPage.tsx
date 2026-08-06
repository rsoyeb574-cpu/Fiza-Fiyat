import React, { useState, useEffect } from 'react';
import {
  Users,
  Search,
  MapPin,
  Star,
  ShieldCheck,
  Briefcase,
  Mail,
  Send,
  X,
  ExternalLink,
  Award
} from 'lucide-react';
import { ProfessionalProfile } from '../types/marketplace';
import { getProfessionalProfiles } from '../services/marketplaceDb';

export const DirectoryPage: React.FC = () => {
  const [profiles, setProfiles] = useState<ProfessionalProfile[]>([]);
  const [loading, setLoading] = useState(true);

  // Filters & Search
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedRole, setSelectedRole] = useState<string>('All');
  const [selectedProfile, setSelectedProfile] = useState<ProfessionalProfile | null>(null);

  // Contact Modal State
  const [contactMessage, setContactMessage] = useState('');

  const roles = [
    'All',
    'Architect',
    'Interior Designer',
    'Contractor',
    'Builder',
    'Structural Engineer',
    '3D Artist',
    'Graphic Designer',
    'Video Editor'
  ];

  useEffect(() => {
    loadProfiles();
  }, []);

  const loadProfiles = async () => {
    setLoading(true);
    const list = await getProfessionalProfiles();
    setProfiles(list);
    setLoading(false);
  };

  const handleSendContact = () => {
    if (!contactMessage.trim()) return;
    alert(`Direct request sent to ${selectedProfile?.name}! They will get back to you via email.`);
    setContactMessage('');
    setSelectedProfile(null);
  };

  const filteredProfiles = profiles.filter(p => {
    const matchesSearch = p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          p.location.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          p.bio.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          p.skills.some(s => s.toLowerCase().includes(searchQuery.toLowerCase()));
    const matchesRole = selectedRole === 'All' || p.role === selectedRole;
    return matchesSearch && matchesRole;
  });

  return (
    <div className="min-h-screen bg-[#020408] text-white pt-24 pb-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Banner */}
        <div className="bg-gradient-to-r from-blue-950/80 via-neutral-900 to-indigo-950/80 border border-white/10 rounded-3xl p-6 md:p-8 mb-8 shadow-2xl flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/20 text-blue-300 text-xs font-bold mb-2">
              <Users className="w-3.5 h-3.5" />
              Verified Professional Network Directory
            </div>
            <h1 className="text-2xl sm:text-4xl font-extrabold text-white">Find Licensed Architects & Specialists</h1>
            <p className="text-xs text-neutral-400 mt-1">Browse verified portfolios, software skills, ratings, and contact professionals directly for architectural projects.</p>
          </div>
        </div>

        {/* Filter Bar */}
        <div className="bg-neutral-900/80 border border-white/10 p-4 sm:p-6 rounded-2xl mb-8 space-y-4">
          <div className="flex flex-col md:flex-row items-center gap-4">
            <div className="relative flex-1 w-full">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-400" />
              <input
                type="text"
                placeholder="Search by name, location, Revit, AutoCAD, 3ds Max..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-11 pr-4 py-3 bg-neutral-950 border border-white/10 rounded-xl text-xs text-white placeholder-neutral-500 focus:outline-none"
              />
            </div>
          </div>

          <div className="flex items-center gap-2 overflow-x-auto scrollbar-none pt-2 border-t border-white/5">
            <span className="text-[11px] font-bold text-neutral-400 uppercase mr-2 whitespace-nowrap">Specialization:</span>
            {roles.map((role) => (
              <button
                key={role}
                onClick={() => setSelectedRole(role)}
                className={`px-3.5 py-1.5 rounded-xl text-xs font-medium whitespace-nowrap transition-all cursor-pointer ${
                  selectedRole === role
                    ? 'bg-blue-600 text-white shadow-lg shadow-blue-600/30'
                    : 'bg-neutral-950 text-neutral-300 hover:bg-neutral-800 border border-white/10'
                }`}
              >
                {role}
              </button>
            ))}
          </div>
        </div>

        {/* Profiles Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredProfiles.map((prof) => (
            <div
              key={prof.id}
              onClick={() => setSelectedProfile(prof)}
              className="bg-neutral-900/90 border border-white/10 rounded-2xl p-6 space-y-4 hover:border-blue-500/50 transition-all cursor-pointer flex flex-col justify-between"
            >
              <div className="space-y-3">
                <div className="flex items-center gap-4">
                  <img src={prof.avatar} alt={prof.name} className="w-14 h-14 rounded-2xl object-cover bg-neutral-950 border border-white/10" />
                  <div>
                    <div className="flex items-center gap-1.5">
                      <h3 className="font-bold text-sm text-white">{prof.name}</h3>
                      {prof.verified && <ShieldCheck className="w-4 h-4 text-blue-400" />}
                    </div>
                    <span className="text-xs text-blue-400 font-semibold">{prof.role}</span>
                    <p className="text-[11px] text-neutral-400 flex items-center gap-1 mt-0.5">
                      <MapPin className="w-3 h-3" /> {prof.location}
                    </p>
                  </div>
                </div>

                <p className="text-xs text-neutral-300 line-clamp-3">{prof.bio}</p>

                <div className="flex flex-wrap gap-1.5 pt-2">
                  {(prof.skills || []).map((sk) => (
                    <span key={sk} className="px-2 py-0.5 rounded bg-white/5 border border-white/10 text-[10px] text-neutral-300">
                      {sk}
                    </span>
                  ))}
                </div>
              </div>

              <div className="pt-3 border-t border-white/10 flex items-center justify-between text-xs">
                <div className="flex items-center gap-1 text-amber-400 font-bold">
                  <Star className="w-3.5 h-3.5 fill-amber-400" />
                  <span>{prof.rating}</span>
                  <span className="text-neutral-400 text-[10px]">({prof.reviewCount})</span>
                </div>

                <span className="font-bold text-emerald-400">${prof.hourlyRate}/hr</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Professional Profile Detail Modal */}
      {selectedProfile && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-neutral-900 border border-white/10 rounded-3xl max-w-2xl w-full p-6 md:p-8 space-y-6 relative max-h-[90vh] overflow-y-auto">
            <button
              onClick={() => setSelectedProfile(null)}
              className="absolute top-6 right-6 p-2 rounded-full bg-white/10 text-neutral-300 hover:text-white"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="flex items-center gap-4 border-b border-white/10 pb-4">
              <img src={selectedProfile.avatar} alt={selectedProfile.name} className="w-16 h-16 rounded-2xl object-cover" />
              <div>
                <div className="flex items-center gap-2">
                  <h2 className="text-xl font-bold text-white">{selectedProfile.name}</h2>
                  {selectedProfile.verified && <ShieldCheck className="w-5 h-5 text-blue-400" />}
                </div>
                <p className="text-xs text-blue-400 font-semibold">{selectedProfile.role} • {selectedProfile.experienceYears}+ Years Exp</p>
                <p className="text-xs text-neutral-400">{selectedProfile.location}</p>
              </div>
            </div>

            <div className="space-y-2">
              <h4 className="font-bold text-xs text-white uppercase tracking-wider">Biography & Background</h4>
              <p className="text-xs text-neutral-300 leading-relaxed">{selectedProfile.bio}</p>
            </div>

            <div className="space-y-2">
              <h4 className="font-bold text-xs text-white uppercase tracking-wider">Portfolio Samples</h4>
              <div className="grid grid-cols-2 gap-3">
                {(selectedProfile.portfolioImages || []).map((img, idx) => (
                  <img key={idx} src={img} alt="Portfolio" className="w-full h-32 object-cover rounded-xl border border-white/10" />
                ))}
              </div>
            </div>

            {/* Direct Hire Contact Form */}
            <div className="bg-neutral-950 p-4 rounded-2xl border border-white/10 space-y-3">
              <h4 className="font-bold text-xs text-white">Direct Hire / Contact Inquiry</h4>
              <textarea
                rows={3}
                placeholder={`Send a direct message or project scope to ${selectedProfile.name}...`}
                value={contactMessage}
                onChange={(e) => setContactMessage(e.target.value)}
                className="w-full bg-neutral-900 border border-white/10 rounded-xl p-3 text-xs text-white focus:outline-none"
              />
              <button
                onClick={handleSendContact}
                className="w-full py-3 bg-blue-600 text-white font-bold text-xs rounded-xl cursor-pointer"
              >
                Send Direct Message
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
