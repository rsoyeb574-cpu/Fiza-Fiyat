import React, { useState, useEffect } from 'react';
import {
  Briefcase,
  Search,
  MapPin,
  DollarSign,
  PlusCircle,
  Clock,
  Send,
  X,
  Building2,
  Users,
  CheckCircle2
} from 'lucide-react';
import { JobListing, JobApplication } from '../types/marketplace';
import {
  getJobListings,
  saveJobListing,
  submitJobApplication,
  getJobApplications
} from '../services/marketplaceDb';

export const JobBoardPage: React.FC = () => {
  const [jobs, setJobs] = useState<JobListing[]>([]);
  const [applications, setApplications] = useState<JobApplication[]>([]);
  const [loading, setLoading] = useState(true);

  // Filters & Tabs
  const [activeTab, setActiveTab] = useState<'board' | 'employer'>('board');
  const [selectedType, setSelectedType] = useState<string>('All');
  const [searchQuery, setSearchQuery] = useState('');

  // Modals
  const [selectedJobForApply, setSelectedJobForApply] = useState<JobListing | null>(null);
  const [applicantPhone, setApplicantPhone] = useState('');
  const [portfolioUrl, setPortfolioUrl] = useState('');
  const [coverLetter, setCoverLetter] = useState('');

  // Post Job Modal
  const [showPostJobModal, setShowPostJobModal] = useState(false);
  const [newJobTitle, setNewJobTitle] = useState('');
  const [newCompanyName, setNewCompanyName] = useState('');
  const [newJobType, setNewJobType] = useState<'Freelance' | 'Full-time' | 'Internship' | 'Remote'>('Freelance');
  const [newJobLocation, setNewJobLocation] = useState('Remote Global');
  const [newSalaryRange, setNewSalaryRange] = useState('$3,000 Budget');
  const [newJobDescription, setNewJobDescription] = useState('');

  useEffect(() => {
    loadJobData();
  }, []);

  const loadJobData = async () => {
    setLoading(true);
    const jList = await getJobListings();
    const aList = await getJobApplications();
    setJobs(jList);
    setApplications(aList);
    setLoading(false);
  };

  const handleApplySubmit = async () => {
    if (!selectedJobForApply || !coverLetter.trim()) return;

    await submitJobApplication({
      jobId: selectedJobForApply.id,
      jobTitle: selectedJobForApply.title,
      companyName: selectedJobForApply.companyName,
      applicantUserId: 'user-current',
      applicantName: 'Alex Mercer, PE',
      applicantEmail: 'alex.mercer@example.com',
      applicantPhone,
      portfolioUrl,
      coverLetter
    });

    setSelectedJobForApply(null);
    setCoverLetter('');
    await loadJobData();
    alert('Application submitted successfully to employer!');
  };

  const handlePostJob = async () => {
    if (!newJobTitle.trim() || !newCompanyName.trim()) return;

    await saveJobListing({
      title: newJobTitle,
      companyName: newCompanyName,
      employerUserId: 'user-current',
      jobType: newJobType,
      category: 'Architecture',
      location: newJobLocation,
      salaryRange: newSalaryRange,
      description: newJobDescription,
      requirements: ['Proven track record in CAD/BIM', 'Strong communication']
    });

    setShowPostJobModal(false);
    setNewJobTitle('');
    await loadJobData();
    alert('Job opportunity published to the job board!');
  };

  const jobTypes = ['All', 'Freelance', 'Full-time', 'Internship', 'Remote'];

  const filteredJobs = jobs.filter(j => {
    const matchesSearch = j.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          j.companyName.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          j.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesType = selectedType === 'All' || j.jobType === selectedType;
    return matchesSearch && matchesType;
  });

  return (
    <div className="min-h-screen bg-[#020408] text-white pt-24 pb-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Banner */}
        <div className="bg-gradient-to-r from-blue-950/80 via-neutral-900 to-indigo-950/80 border border-white/10 rounded-3xl p-6 md:p-8 mb-8 shadow-2xl flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/20 text-blue-300 text-xs font-bold mb-2">
              <Briefcase className="w-3.5 h-3.5" />
              Architectural & Engineering Careers
            </div>
            <h1 className="text-2xl sm:text-4xl font-extrabold text-white">Freelance & Full-time Job Board</h1>
            <p className="text-xs text-neutral-400 mt-1">Hire top Architects, BIM Managers, Structural Engineers, and 3D Artists or apply for global remote opportunities.</p>
          </div>

          <button
            onClick={() => setShowPostJobModal(true)}
            className="px-5 py-3 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white font-bold text-xs shadow-lg shadow-blue-600/30 flex items-center gap-2 cursor-pointer whitespace-nowrap"
          >
            <PlusCircle className="w-4 h-4" />
            Post a Job Opportunity
          </button>
        </div>

        {/* Tab & Search controls */}
        <div className="flex flex-col md:flex-row items-center justify-between gap-4 mb-8">
          <div className="flex items-center gap-2 overflow-x-auto scrollbar-none w-full md:w-auto">
            {jobTypes.map((t) => (
              <button
                key={t}
                onClick={() => setSelectedType(t)}
                className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer whitespace-nowrap ${
                  selectedType === t
                    ? 'bg-blue-600 text-white shadow-lg shadow-blue-600/30'
                    : 'bg-neutral-900/80 text-neutral-400 hover:text-white border border-white/10'
                }`}
              >
                {t}
              </button>
            ))}

            <button
              onClick={() => setActiveTab(activeTab === 'board' ? 'employer' : 'board')}
              className="px-4 py-2 rounded-xl text-xs font-bold bg-white/10 text-cyan-300 border border-white/10 hover:bg-white/20 whitespace-nowrap ml-auto"
            >
              {activeTab === 'board' ? `Employer Dashboard (${applications.length} Applicants)` : '← Back to Job Board'}
            </button>
          </div>

          <div className="relative w-full md:w-80">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-400" />
            <input
              type="text"
              placeholder="Search jobs, CAD, BIM, 3D render..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 bg-neutral-900 border border-white/10 rounded-xl text-xs text-white focus:outline-none"
            />
          </div>
        </div>

        {/* Employer Dashboard Tab */}
        {activeTab === 'employer' ? (
          <div className="bg-neutral-900/80 border border-white/10 rounded-2xl p-6 space-y-6">
            <h3 className="font-bold text-sm text-white uppercase tracking-wider">Submitted Job Applications ({(applications || []).length})</h3>
            <div className="space-y-4">
              {(applications || []).map((app) => (
                <div key={app.id} className="p-4 bg-neutral-950 rounded-xl border border-white/5 space-y-2 text-xs">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-white text-sm">{app.applicantName}</span>
                    <span className="px-2.5 py-0.5 rounded bg-blue-500/20 text-blue-300 font-bold uppercase text-[10px]">
                      {app.status}
                    </span>
                  </div>
                  <p className="text-neutral-300">Job: <span className="font-bold text-cyan-400">{app.jobTitle}</span> ({app.companyName})</p>
                  <p className="text-neutral-400">Email: {app.applicantEmail} | Phone: {app.applicantPhone || 'N/A'}</p>
                  {app.portfolioUrl && (
                    <a href={app.portfolioUrl} target="_blank" rel="noreferrer" className="text-blue-400 font-bold hover:underline block">
                      View Portfolio Link →
                    </a>
                  )}
                  <div className="bg-white/5 p-3 rounded-lg text-neutral-300 mt-2">
                    <span className="font-bold text-white block mb-1">Cover Letter:</span>
                    {app.coverLetter}
                  </div>
                </div>
              ))}
            </div>
          </div>
        ) : (
          /* Job Board Listings */
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {filteredJobs.map((job) => (
              <div key={job.id} className="bg-neutral-900/90 border border-white/10 rounded-2xl p-6 flex flex-col justify-between space-y-4 hover:border-blue-500/50 transition-all">
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="px-2.5 py-0.5 rounded-full bg-cyan-500/20 text-cyan-300 text-[10px] font-bold">
                      {job.jobType}
                    </span>
                    <span className="text-[11px] text-neutral-400">{job.applicantsCount} Applicants</span>
                  </div>

                  <h3 className="font-bold text-base text-white">{job.title}</h3>
                  <p className="text-xs text-blue-400 font-bold flex items-center gap-1.5">
                    <Building2 className="w-3.5 h-3.5" /> {job.companyName}
                  </p>

                  <div className="flex flex-wrap gap-4 text-xs text-neutral-300 pt-1">
                    <span className="flex items-center gap-1"><MapPin className="w-3.5 h-3.5 text-neutral-400" /> {job.location}</span>
                    <span className="flex items-center gap-1 font-bold text-emerald-400"><DollarSign className="w-3.5 h-3.5" /> {job.salaryRange}</span>
                  </div>

                  <p className="text-xs text-neutral-400 line-clamp-3">{job.description}</p>
                </div>

                <div className="pt-3 border-t border-white/10 flex items-center justify-between">
                  <span className="text-[10px] text-neutral-500">{new Date(job.createdAt).toLocaleDateString()}</span>
                  <button
                    onClick={() => setSelectedJobForApply(job)}
                    className="px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs rounded-xl cursor-pointer"
                  >
                    Apply Now
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Apply Modal */}
      {selectedJobForApply && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4">
          <div className="bg-neutral-900 border border-white/10 rounded-3xl max-w-lg w-full p-6 space-y-4 relative">
            <button
              onClick={() => setSelectedJobForApply(null)}
              className="absolute top-6 right-6 p-2 rounded-full bg-white/10 text-neutral-300 hover:text-white"
            >
              <X className="w-5 h-5" />
            </button>

            <h3 className="text-lg font-bold text-white">Apply for {selectedJobForApply.title}</h3>
            <p className="text-xs text-neutral-400">{selectedJobForApply.companyName} • {selectedJobForApply.location}</p>

            <div className="space-y-3 text-xs">
              <div>
                <label className="block font-bold text-neutral-300 mb-1">Phone Number</label>
                <input
                  type="text"
                  placeholder="+1 (555) 019-2831"
                  value={applicantPhone}
                  onChange={(e) => setApplicantPhone(e.target.value)}
                  className="w-full bg-neutral-950 border border-white/10 rounded-xl p-3 text-white"
                />
              </div>

              <div>
                <label className="block font-bold text-neutral-300 mb-1">Portfolio or Resume Link</label>
                <input
                  type="text"
                  placeholder="https://myportfolio.example.com"
                  value={portfolioUrl}
                  onChange={(e) => setPortfolioUrl(e.target.value)}
                  className="w-full bg-neutral-950 border border-white/10 rounded-xl p-3 text-white"
                />
              </div>

              <div>
                <label className="block font-bold text-neutral-300 mb-1">Cover Letter & Experience Overview</label>
                <textarea
                  rows={4}
                  placeholder="Summarize your CAD, BIM, or structural experience relevant to this role..."
                  value={coverLetter}
                  onChange={(e) => setCoverLetter(e.target.value)}
                  className="w-full bg-neutral-950 border border-white/10 rounded-xl p-3 text-white"
                />
              </div>

              <button
                onClick={handleApplySubmit}
                className="w-full py-3 bg-blue-600 font-bold text-white rounded-xl cursor-pointer"
              >
                Submit Application
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Post Job Modal */}
      {showPostJobModal && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4">
          <div className="bg-neutral-900 border border-white/10 rounded-3xl max-w-md w-full p-6 space-y-4 relative">
            <button
              onClick={() => setShowPostJobModal(false)}
              className="absolute top-6 right-6 p-2 rounded-full bg-white/10 text-neutral-300 hover:text-white"
            >
              <X className="w-5 h-5" />
            </button>

            <h3 className="text-lg font-bold text-white">Post Job Listing</h3>

            <div className="space-y-3 text-xs">
              <div>
                <label className="block font-bold text-neutral-300 mb-1">Job Title</label>
                <input
                  type="text"
                  placeholder="e.g. Senior Revit BIM Specialist"
                  value={newJobTitle}
                  onChange={(e) => setNewJobTitle(e.target.value)}
                  className="w-full bg-neutral-950 border border-white/10 rounded-xl p-3 text-white"
                />
              </div>

              <div>
                <label className="block font-bold text-neutral-300 mb-1">Company Name</label>
                <input
                  type="text"
                  placeholder="e.g. Apex Studio Designs"
                  value={newCompanyName}
                  onChange={(e) => setNewCompanyName(e.target.value)}
                  className="w-full bg-neutral-950 border border-white/10 rounded-xl p-3 text-white"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-neutral-300 mb-1">Type</label>
                  <select
                    value={newJobType}
                    onChange={(e: any) => setNewJobType(e.target.value)}
                    className="w-full bg-neutral-950 border border-white/10 rounded-xl p-3 text-white"
                  >
                    <option value="Freelance">Freelance</option>
                    <option value="Full-time">Full-time</option>
                    <option value="Internship">Internship</option>
                    <option value="Remote">Remote</option>
                  </select>
                </div>

                <div>
                  <label className="block font-bold text-neutral-300 mb-1">Salary / Budget</label>
                  <input
                    type="text"
                    value={newSalaryRange}
                    onChange={(e) => setNewSalaryRange(e.target.value)}
                    className="w-full bg-neutral-950 border border-white/10 rounded-xl p-3 text-white"
                  />
                </div>
              </div>

              <div>
                <label className="block font-bold text-neutral-300 mb-1">Description</label>
                <textarea
                  rows={3}
                  value={newJobDescription}
                  onChange={(e) => setNewJobDescription(e.target.value)}
                  className="w-full bg-neutral-950 border border-white/10 rounded-xl p-3 text-white"
                />
              </div>

              <button
                onClick={handlePostJob}
                className="w-full py-3 bg-blue-600 text-white font-bold rounded-xl cursor-pointer"
              >
                Publish Job Opportunity
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
