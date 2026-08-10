import React, { useState, useEffect } from 'react';
import { 
  Linkedin, 
  Twitter, 
  Instagram, 
  Github, 
  Globe, 
  Mail, 
  Phone, 
  Users, 
  Sparkles, 
  CheckCircle2, 
  Briefcase,
  Award
} from 'lucide-react';
import { TeamMember } from '../../types';
import { getTeamMembers, subscribeTeamMembers } from '../../services/db';

export interface TeamSectionProps {
  members?: TeamMember[];
  title?: string;
  subtitle?: string;
  className?: string;
}

export const TeamSection: React.FC<TeamSectionProps> = ({
  members: propMembers,
  title = 'Project Contributors & Specialists',
  subtitle = 'Meet the visionary architects, BIM structural engineers, interior specialists, and AI visualizers driving Fiza Hayat excellence.',
  className = '',
}) => {
  const [teamMembers, setTeamMembers] = useState<TeamMember[]>(propMembers || []);
  const [selectedRoleFilter, setSelectedRoleFilter] = useState<string>('all');

  useEffect(() => {
    if (propMembers && propMembers.length > 0) {
      setTeamMembers(propMembers);
      return;
    }

    // Subscribe to live DB or fetch cached team
    const unsubscribe = subscribeTeamMembers((items) => {
      if (items && items.length > 0) {
        setTeamMembers(items);
      }
    });

    return () => {
      if (typeof unsubscribe === 'function') {
        unsubscribe();
      }
    };
  }, [propMembers]);

  // Filter contributors by category (Architects, Engineers, Designers)
  const filteredMembers = teamMembers.filter((member) => {
    if (selectedRoleFilter === 'all') return true;
    const lowerRole = (member.role + ' ' + (member.specialization || '')).toLowerCase();
    if (selectedRoleFilter === 'architect') return lowerRole.includes('architect');
    if (selectedRoleFilter === 'engineer') return lowerRole.includes('engineer') || lowerRole.includes('bim') || lowerRole.includes('structural');
    if (selectedRoleFilter === 'designer') return lowerRole.includes('designer') || lowerRole.includes('visualizer') || lowerRole.includes('interior') || lowerRole.includes('ai');
    return true;
  });

  return (
    <section className={`space-y-10 ${className}`}>
      {/* Header */}
      <div className="text-center space-y-3 max-w-3xl mx-auto">
        <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-indigo-500/10 border border-indigo-500/30 text-indigo-400 text-xs font-semibold">
          <Users className="w-3.5 h-3.5 shrink-0 text-indigo-400" />
          <span>Multidisciplinary Expertise</span>
        </div>
        <h2 className="text-3xl font-extrabold text-white tracking-tight">
          {title}
        </h2>
        {subtitle && (
          <p className="text-neutral-400 text-xs sm:text-sm leading-relaxed">
            {subtitle}
          </p>
        )}

        {/* Filter Pills */}
        <div className="pt-3 flex flex-wrap items-center justify-center gap-2">
          {[
            { id: 'all', label: 'All Contributors' },
            { id: 'architect', label: 'Architects' },
            { id: 'engineer', label: 'BIM & Engineers' },
            { id: 'designer', label: 'Designers & Visualizers' },
          ].map((filter) => (
            <button
              key={filter.id}
              onClick={() => setSelectedRoleFilter(filter.id)}
              className={`px-4 py-2 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
                selectedRoleFilter === filter.id
                  ? 'bg-gradient-to-r from-violet-600 to-indigo-600 text-white shadow-lg shadow-indigo-600/25'
                  : 'bg-neutral-900/80 text-neutral-400 border border-white/10 hover:border-white/20 hover:text-white'
              }`}
            >
              {filter.label}
            </button>
          ))}
        </div>
      </div>

      {/* Contributors Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {filteredMembers.map((member) => {
          // Extract expertise tags either from array or specialization
          const expertiseTags = member.expertiseAreas && member.expertiseAreas.length > 0
            ? member.expertiseAreas
            : member.specialization
            ? member.specialization.split('&').map(s => s.trim())
            : ['Architecture', 'BIM Modeling'];

          return (
            <div
              key={member.id}
              className="group rounded-3xl bg-[#151B2E] border border-indigo-500/20 hover:border-indigo-500/50 p-6 flex flex-col justify-between transition-all duration-300 hover:-translate-y-1 shadow-xl relative overflow-hidden"
            >
              {/* Top ambient glow */}
              <div className="absolute top-0 right-0 w-32 h-32 bg-violet-600/10 rounded-full blur-2xl pointer-events-none group-hover:bg-violet-600/20 transition-all" />

              <div>
                {/* Avatar Frame */}
                <div className="relative mb-5">
                  <div className="w-24 h-24 mx-auto rounded-2xl overflow-hidden border-2 border-indigo-500/30 group-hover:border-violet-400 shadow-lg transition-all duration-300">
                    <img
                      src={member.avatar}
                      alt={member.name}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                  </div>
                  {member.experienceYears && (
                    <span className="absolute -bottom-2.5 left-1/2 -translate-x-1/2 px-2.5 py-0.5 rounded-full bg-gradient-to-r from-violet-600 to-indigo-600 text-[10px] font-bold text-white shadow-md flex items-center gap-1 whitespace-nowrap">
                      <Award className="w-3 h-3 shrink-0" />
                      {member.experienceYears}+ Yrs Exp
                    </span>
                  )}
                </div>

                {/* Name & Role */}
                <div className="text-center space-y-1 mt-2">
                  <h3 className="text-base font-bold text-white group-hover:text-violet-300 transition-colors">
                    {member.name}
                  </h3>
                  <p className="text-xs font-medium text-indigo-400">
                    {member.role}
                  </p>
                </div>

                {/* Bio */}
                <p className="text-neutral-400 text-xs leading-relaxed text-center mt-3 line-clamp-3">
                  {member.bio}
                </p>

                {/* Expertise Areas */}
                <div className="mt-4 pt-4 border-t border-indigo-500/10">
                  <span className="text-[10px] uppercase tracking-wider font-bold text-neutral-500 block mb-2">
                    Core Expertise
                  </span>
                  <div className="flex flex-wrap gap-1.5">
                    {expertiseTags.map((tag, idx) => (
                      <span
                        key={idx}
                        className="px-2 py-1 rounded-lg bg-indigo-950/60 border border-indigo-500/20 text-indigo-300 text-[10px] font-medium flex items-center gap-1"
                      >
                        <CheckCircle2 className="w-2.5 h-2.5 text-indigo-400 shrink-0" />
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              {/* Social & Contact Links */}
              <div className="mt-6 pt-4 border-t border-indigo-500/10 flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  {member.email && (
                    <a
                      href={`mailto:${member.email}`}
                      title={`Email ${member.name}`}
                      className="p-1.5 rounded-lg bg-neutral-900 text-neutral-400 hover:text-white hover:bg-violet-600/30 transition-all"
                    >
                      <Mail className="w-3.5 h-3.5" />
                    </a>
                  )}
                  {member.phone && (
                    <a
                      href={`tel:${member.phone}`}
                      title={`Call ${member.name}`}
                      className="p-1.5 rounded-lg bg-neutral-900 text-neutral-400 hover:text-white hover:bg-violet-600/30 transition-all"
                    >
                      <Phone className="w-3.5 h-3.5" />
                    </a>
                  )}
                </div>

                {/* Social Icons */}
                <div className="flex items-center space-x-1.5">
                  {member.socials?.linkedin && (
                    <a
                      href={member.socials.linkedin}
                      target="_blank"
                      rel="noopener noreferrer"
                      title="LinkedIn Profile"
                      className="p-1.5 rounded-lg bg-neutral-900 text-neutral-400 hover:text-blue-400 hover:bg-blue-500/10 transition-all"
                    >
                      <Linkedin className="w-3.5 h-3.5" />
                    </a>
                  )}
                  {member.socials?.twitter && (
                    <a
                      href={member.socials.twitter}
                      target="_blank"
                      rel="noopener noreferrer"
                      title="Twitter/X Profile"
                      className="p-1.5 rounded-lg bg-neutral-900 text-neutral-400 hover:text-sky-400 hover:bg-sky-500/10 transition-all"
                    >
                      <Twitter className="w-3.5 h-3.5" />
                    </a>
                  )}
                  {member.socials?.instagram && (
                    <a
                      href={member.socials.instagram}
                      target="_blank"
                      rel="noopener noreferrer"
                      title="Instagram Profile"
                      className="p-1.5 rounded-lg bg-neutral-900 text-neutral-400 hover:text-pink-400 hover:bg-pink-500/10 transition-all"
                    >
                      <Instagram className="w-3.5 h-3.5" />
                    </a>
                  )}
                  {member.socials?.github && (
                    <a
                      href={member.socials.github}
                      target="_blank"
                      rel="noopener noreferrer"
                      title="GitHub Profile"
                      className="p-1.5 rounded-lg bg-neutral-900 text-neutral-400 hover:text-white hover:bg-neutral-800 transition-all"
                    >
                      <Github className="w-3.5 h-3.5" />
                    </a>
                  )}
                  {member.socials?.behance && (
                    <a
                      href={member.socials.behance}
                      target="_blank"
                      rel="noopener noreferrer"
                      title="Behance Portfolio"
                      className="p-1.5 rounded-lg bg-neutral-900 text-neutral-400 hover:text-blue-500 hover:bg-blue-600/10 transition-all"
                    >
                      <Globe className="w-3.5 h-3.5" />
                    </a>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
};

export default TeamSection;
