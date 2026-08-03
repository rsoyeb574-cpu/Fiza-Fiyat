import React, { useState, useEffect } from 'react';
import { 
  ShieldCheck, 
  Lock, 
  Folder, 
  Plus, 
  Trash2, 
  Edit3, 
  Save, 
  RefreshCw, 
  Building2, 
  Sparkles, 
  BookOpen, 
  Mail, 
  Settings, 
  Check, 
  X, 
  Database,
  ArrowRight,
  LogOut
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { 
  Project, 
  Category, 
  Service, 
  BlogArticle, 
  Inquiry, 
  WebsiteSettings 
} from '../types';
import { 
  saveProject, 
  deleteProject, 
  saveCategory, 
  deleteCategory, 
  saveService, 
  deleteService, 
  saveBlog, 
  deleteBlog, 
  getInquiries, 
  saveWebsiteSettings, 
  seedDatabaseIfEmpty 
} from '../services/db';

interface AdminPageProps {
  projects: Project[];
  categories: Category[];
  services: Service[];
  blogs: BlogArticle[];
  settings: WebsiteSettings;
  onDataChange: () => void;
}

export const AdminPage: React.FC<AdminPageProps> = ({
  projects,
  categories,
  services,
  blogs,
  settings,
  onDataChange
}) => {
  const { isAdmin, loginDemoAdmin, loginWithEmail, logout } = useAuth();
  
  const [emailInput, setEmailInput] = useState('');
  const [passInput, setPassInput] = useState('');
  const [loginError, setLoginError] = useState('');
  const [loginLoading, setLoginLoading] = useState(false);

  const [activeTab, setActiveTab] = useState<'dashboard' | 'projects' | 'categories' | 'services' | 'blogs' | 'inquiries' | 'settings'>('dashboard');
  const [inquiries, setInquiries] = useState<Inquiry[]>([]);

  // Editing Project Modal State
  const [editingProject, setEditingProject] = useState<Partial<Project> | null>(null);
  const [editingCategory, setEditingCategory] = useState<Partial<Category> | null>(null);
  const [editingService, setEditingService] = useState<Partial<Service> | null>(null);
  const [editingBlog, setEditingBlog] = useState<Partial<BlogArticle> | null>(null);
  const [websiteSettingsState, setWebsiteSettingsState] = useState<WebsiteSettings>(settings);

  const [toastMessage, setToastMessage] = useState<string | null>(null);

  useEffect(() => {
    if (isAdmin) {
      getInquiries().then(setInquiries);
      setWebsiteSettingsState(settings);
    }
  }, [isAdmin, settings]);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoginError('');
    setLoginLoading(true);

    try {
      if (emailInput && passInput) {
        await loginWithEmail(emailInput, passInput);
      } else {
        loginDemoAdmin();
      }
      showToast('Admin logged in successfully!');
    } catch (err: any) {
      setLoginError(err.message || 'Login failed.');
    } finally {
      setLoginLoading(false);
    }
  };

  // ---------------- PROJECT HANDLERS ----------------
  const handleSaveProjectSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingProject?.title) return;
    await saveProject(editingProject);
    setEditingProject(null);
    onDataChange();
    showToast('Project saved successfully to Firestore!');
  };

  const handleDeleteProject = async (id: string) => {
    if (confirm('Are you sure you want to delete this project?')) {
      await deleteProject(id);
      onDataChange();
      showToast('Project deleted.');
    }
  };

  // ---------------- CATEGORY HANDLERS ----------------
  const handleSaveCategorySubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingCategory?.name) return;
    await saveCategory(editingCategory);
    setEditingCategory(null);
    onDataChange();
    showToast('Category saved.');
  };

  const handleDeleteCategory = async (id: string) => {
    if (confirm('Delete category?')) {
      await deleteCategory(id);
      onDataChange();
      showToast('Category deleted.');
    }
  };

  // ---------------- SERVICE HANDLERS ----------------
  const handleSaveServiceSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingService?.title) return;
    await saveService(editingService);
    setEditingService(null);
    onDataChange();
    showToast('Service saved.');
  };

  const handleDeleteService = async (id: string) => {
    if (confirm('Delete service?')) {
      await deleteService(id);
      onDataChange();
      showToast('Service deleted.');
    }
  };

  // ---------------- BLOG HANDLERS ----------------
  const handleSaveBlogSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingBlog?.title) return;
    await saveBlog(editingBlog);
    setEditingBlog(null);
    onDataChange();
    showToast('Blog article saved.');
  };

  const handleDeleteBlog = async (id: string) => {
    if (confirm('Delete article?')) {
      await deleteBlog(id);
      onDataChange();
      showToast('Blog article deleted.');
    }
  };

  // ---------------- SETTINGS HANDLERS ----------------
  const handleSaveSettings = async (e: React.FormEvent) => {
    e.preventDefault();
    await saveWebsiteSettings(websiteSettingsState);
    onDataChange();
    showToast('Website settings updated globally!');
  };

  // ---------------- RE-SEED HANDLER ----------------
  const handleReseed = async () => {
    if (confirm('Re-seed initial database sample data?')) {
      await seedDatabaseIfEmpty();
      onDataChange();
      showToast('Database re-seeded successfully!');
    }
  };

  // IF NOT LOGGED IN SHOW LOGIN SCREEN
  if (!isAdmin) {
    return (
      <div className="pt-32 pb-20 min-h-screen flex items-center justify-center px-4">
        <div className="w-full max-w-md bg-neutral-900 border border-white/10 p-8 rounded-3xl shadow-2xl space-y-6">
          <div className="text-center space-y-2">
            <div className="w-12 h-12 rounded-2xl bg-blue-600/20 text-blue-400 border border-blue-500/30 flex items-center justify-center mx-auto">
              <Lock className="w-6 h-6" />
            </div>
            <h1 className="text-2xl font-bold text-white tracking-tight">Fiza Hayat Admin Hub</h1>
            <p className="text-neutral-400 text-xs">Secure authentication for database management & homepage editing</p>
          </div>

          {loginError && (
            <div className="p-3 rounded-xl bg-red-950/80 border border-red-500/30 text-red-300 text-xs">
              {loginError}
            </div>
          )}

          <form onSubmit={handleLogin} className="space-y-4 text-xs">
            <div>
              <label className="block text-neutral-300 font-semibold mb-1">Admin Email (Optional for Demo)</label>
              <input
                type="email"
                placeholder="admin@fizahayat.com"
                value={emailInput}
                onChange={(e) => setEmailInput(e.target.value)}
                className="w-full px-4 py-3 rounded-xl bg-neutral-950 border border-white/10 text-white placeholder-neutral-500 focus:outline-none focus:border-blue-500"
              />
            </div>

            <div>
              <label className="block text-neutral-300 font-semibold mb-1">Password</label>
              <input
                type="password"
                placeholder="••••••••"
                value={passInput}
                onChange={(e) => setPassInput(e.target.value)}
                className="w-full px-4 py-3 rounded-xl bg-neutral-950 border border-white/10 text-white placeholder-neutral-500 focus:outline-none focus:border-blue-500"
              />
            </div>

            <button
              type="submit"
              disabled={loginLoading}
              className="w-full py-3.5 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white font-semibold shadow-xl transition-all cursor-pointer text-xs"
            >
              {loginLoading ? 'Authenticating...' : 'Log In to Admin Panel'}
            </button>
          </form>

          <div className="pt-4 border-t border-white/10 text-center">
            <button
              onClick={loginDemoAdmin}
              className="text-xs text-blue-400 hover:underline font-semibold cursor-pointer"
            >
              Instant Demo Admin Access →
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="pt-28 pb-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
      
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed top-24 right-6 z-50 px-4 py-3 rounded-2xl bg-blue-600 text-white font-semibold text-xs shadow-2xl flex items-center gap-2 animate-bounce">
          <Check className="w-4 h-4" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Admin Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-6 rounded-3xl bg-neutral-900/80 border border-white/10 backdrop-blur-md">
        <div className="flex items-center space-x-3">
          <div className="p-2.5 rounded-2xl bg-blue-600/20 text-blue-400 border border-blue-500/30">
            <ShieldCheck className="w-6 h-6" />
          </div>
          <div>
            <h1 className="text-xl font-bold text-white">Admin Management Hub</h1>
            <p className="text-neutral-400 text-xs">Live Firestore Database CRUD & Website Control Panel</p>
          </div>
        </div>

        <div className="flex items-center space-x-3">
          <button
            onClick={handleReseed}
            className="px-3 py-2 rounded-xl bg-neutral-800 hover:bg-neutral-700 text-neutral-300 text-xs font-semibold flex items-center gap-1.5 cursor-pointer"
            title="Seed sample data"
          >
            <Database className="w-3.5 h-3.5 text-blue-400" />
            <span>Re-Seed Data</span>
          </button>

          <button
            onClick={logout}
            className="px-3 py-2 rounded-xl bg-red-950/60 hover:bg-red-900/60 text-red-300 text-xs font-semibold flex items-center gap-1.5 border border-red-500/30 cursor-pointer"
          >
            <LogOut className="w-3.5 h-3.5" />
            <span>Log Out</span>
          </button>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="flex items-center space-x-2 overflow-x-auto pb-2 border-b border-white/10 text-xs">
        {[
          { id: 'dashboard', label: 'Dashboard Stats', icon: ShieldCheck },
          { id: 'projects', label: `Projects (${projects.length})`, icon: Building2 },
          { id: 'categories', label: `Categories (${categories.length})`, icon: Folder },
          { id: 'services', label: `Services (${services.length})`, icon: Sparkles },
          { id: 'blogs', label: `Blogs (${blogs.length})`, icon: BookOpen },
          { id: 'inquiries', label: `Inquiries (${inquiries.length})`, icon: Mail },
          { id: 'settings', label: 'Homepage Settings', icon: Settings }
        ].map((tab) => {
          const Icon = tab.icon;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`px-4 py-2.5 rounded-2xl font-semibold flex items-center space-x-2 cursor-pointer transition-all whitespace-nowrap ${
                activeTab === tab.id
                  ? 'bg-blue-600 text-white shadow-lg shadow-blue-600/30'
                  : 'bg-neutral-900/60 text-neutral-400 hover:text-white border border-white/5'
              }`}
            >
              <Icon className="w-4 h-4" />
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>

      {/* TAB 1: DASHBOARD STATS */}
      {activeTab === 'dashboard' && (
        <div className="space-y-8">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="p-6 rounded-3xl bg-neutral-900/60 border border-white/10">
              <div className="text-neutral-400 text-xs font-medium">Total Projects</div>
              <div className="text-3xl font-extrabold text-white mt-1">{projects.length}</div>
            </div>
            <div className="p-6 rounded-3xl bg-neutral-900/60 border border-white/10">
              <div className="text-neutral-400 text-xs font-medium">Categories</div>
              <div className="text-3xl font-extrabold text-white mt-1">{categories.length}</div>
            </div>
            <div className="p-6 rounded-3xl bg-neutral-900/60 border border-white/10">
              <div className="text-neutral-400 text-xs font-medium">Services Offered</div>
              <div className="text-3xl font-extrabold text-white mt-1">{services.length}</div>
            </div>
            <div className="p-6 rounded-3xl bg-neutral-900/60 border border-white/10">
              <div className="text-neutral-400 text-xs font-medium">Client Inquiries</div>
              <div className="text-3xl font-extrabold text-blue-400 mt-1">{inquiries.length}</div>
            </div>
          </div>

          <div className="p-8 rounded-3xl bg-neutral-900/60 border border-white/10 space-y-4 text-xs text-neutral-300">
            <h3 className="text-base font-bold text-white">Database & System Architecture</h3>
            <p>
              This Admin Panel provides dynamic CRUD access directly to your Firestore database collections (`projects`, `categories`, `services`, `blogs`, `settings`, `inquiries`). Every change reflects instantly on the client website without hardcoding or redeploying code.
            </p>
          </div>
        </div>
      )}

      {/* TAB 2: PROJECTS MANAGEMENT */}
      {activeTab === 'projects' && (
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-bold text-white">Projects Collection</h2>
            <button
              onClick={() => setEditingProject({
                title: '',
                description: '',
                categoryId: categories[0]?.id || 'cat-arch',
                categoryName: categories[0]?.name || 'Architecture',
                coverImage: 'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&w=1200&q=80',
                images: ['https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&w=1200&q=80'],
                softwareUsed: ['Autodesk Revit', '3ds Max'],
                tags: ['Architecture'],
                clientName: 'New Client',
                projectDate: new Date().toISOString().split('T')[0]
              })}
              className="px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-semibold text-xs flex items-center space-x-1.5 cursor-pointer shadow-lg"
            >
              <Plus className="w-4 h-4" />
              <span>Add New Project</span>
            </button>
          </div>

          <div className="space-y-3">
            {projects.map((proj) => (
              <div
                key={proj.id}
                className="p-4 rounded-2xl bg-neutral-900/60 border border-white/10 flex items-center justify-between gap-4 text-xs"
              >
                <div className="flex items-center space-x-3 min-w-0">
                  <img src={proj.coverImage} alt={proj.title} className="w-12 h-12 rounded-xl object-cover shrink-0" />
                  <div className="min-w-0">
                    <div className="text-white font-bold truncate">{proj.title}</div>
                    <div className="text-neutral-400 text-[11px] truncate">{proj.categoryName} • Client: {proj.clientName}</div>
                  </div>
                </div>

                <div className="flex items-center space-x-2 shrink-0">
                  <button
                    onClick={() => setEditingProject(proj)}
                    className="p-2 rounded-xl bg-neutral-800 text-neutral-300 hover:text-white"
                  >
                    <Edit3 className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => handleDeleteProject(proj.id)}
                    className="p-2 rounded-xl bg-red-950/60 text-red-400 hover:text-red-300 border border-red-500/20"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* EDIT / ADD PROJECT MODAL */}
      {editingProject && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-neutral-950/80 backdrop-blur-md animate-fadeIn">
          <div className="w-full max-w-2xl bg-neutral-900 border border-white/10 rounded-3xl p-6 shadow-2xl overflow-y-auto max-h-[90vh] space-y-4 text-xs" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-center justify-between border-b border-white/10 pb-3">
              <h3 className="text-base font-bold text-white">
                {editingProject.id ? 'Edit Project' : 'Create New Project'}
              </h3>
              <button onClick={() => setEditingProject(null)} className="p-1 rounded-lg bg-neutral-800 text-neutral-400 hover:text-white">
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleSaveProjectSubmit} className="space-y-4">
              <div>
                <label className="block text-neutral-300 font-semibold mb-1">Project Title *</label>
                <input
                  type="text"
                  required
                  value={editingProject.title || ''}
                  onChange={(e) => setEditingProject({ ...editingProject, title: e.target.value })}
                  className="w-full px-3 py-2 bg-neutral-950 rounded-xl border border-white/10 text-white focus:outline-none focus:border-blue-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-neutral-300 font-semibold mb-1">Category</label>
                  <select
                    value={editingProject.categoryId || ''}
                    onChange={(e) => {
                      const selectedCat = categories.find(c => c.id === e.target.value);
                      setEditingProject({
                        ...editingProject,
                        categoryId: e.target.value,
                        categoryName: selectedCat?.name || 'Architecture'
                      });
                    }}
                    className="w-full px-3 py-2 bg-neutral-950 rounded-xl border border-white/10 text-white cursor-pointer"
                  >
                    {categories.map((c) => (
                      <option key={c.id} value={c.id}>{c.name}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-neutral-300 font-semibold mb-1">Client Name</label>
                  <input
                    type="text"
                    value={editingProject.clientName || ''}
                    onChange={(e) => setEditingProject({ ...editingProject, clientName: e.target.value })}
                    className="w-full px-3 py-2 bg-neutral-950 rounded-xl border border-white/10 text-white"
                  />
                </div>
              </div>

              <div>
                <label className="block text-neutral-300 font-semibold mb-1">Cover Image URL *</label>
                <input
                  type="url"
                  required
                  value={editingProject.coverImage || ''}
                  onChange={(e) => setEditingProject({ ...editingProject, coverImage: e.target.value })}
                  className="w-full px-3 py-2 bg-neutral-950 rounded-xl border border-white/10 text-white"
                />
              </div>

              <div>
                <label className="block text-neutral-300 font-semibold mb-1">Short Description *</label>
                <textarea
                  required
                  rows={2}
                  value={editingProject.description || ''}
                  onChange={(e) => setEditingProject({ ...editingProject, description: e.target.value })}
                  className="w-full px-3 py-2 bg-neutral-950 rounded-xl border border-white/10 text-white"
                ></textarea>
              </div>

              <div>
                <label className="block text-neutral-300 font-semibold mb-1">Full Architectural Writeup</label>
                <textarea
                  rows={4}
                  value={editingProject.fullContent || ''}
                  onChange={(e) => setEditingProject({ ...editingProject, fullContent: e.target.value })}
                  className="w-full px-3 py-2 bg-neutral-950 rounded-xl border border-white/10 text-white"
                ></textarea>
              </div>

              <div className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  id="featuredProject"
                  checked={editingProject.featured || false}
                  onChange={(e) => setEditingProject({ ...editingProject, featured: e.target.checked })}
                  className="rounded accent-blue-500"
                />
                <label htmlFor="featuredProject" className="text-neutral-300 font-semibold">Mark as Featured Project on Homepage</label>
              </div>

              <div className="pt-2 flex justify-end space-x-2">
                <button
                  type="button"
                  onClick={() => setEditingProject(null)}
                  className="px-4 py-2 rounded-xl bg-neutral-800 text-neutral-300"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-6 py-2 rounded-xl bg-blue-600 text-white font-semibold flex items-center gap-1.5"
                >
                  <Save className="w-4 h-4" /> Save Project
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* TAB 6: INQUIRIES */}
      {activeTab === 'inquiries' && (
        <div className="space-y-4">
          <h2 className="text-lg font-bold text-white">Client Inquiries & Cost Proposals</h2>
          <div className="space-y-3">
            {inquiries.length === 0 ? (
              <div className="p-8 text-center text-neutral-500 rounded-3xl bg-neutral-900/60 border border-white/10">
                No client inquiries submitted yet.
              </div>
            ) : (
              inquiries.map((inq) => (
                <div key={inq.id} className="p-5 rounded-2xl bg-neutral-900/60 border border-white/10 space-y-2 text-xs">
                  <div className="flex items-center justify-between">
                    <span className="text-white font-bold text-sm">{inq.name} ({inq.email})</span>
                    <span className="text-neutral-400 text-[10px]">{new Date(inq.createdAt).toLocaleString()}</span>
                  </div>
                  <div className="text-blue-400 font-semibold">Service: {inq.service} • Budget: {inq.budget || 'N/A'}</div>
                  <p className="text-neutral-300 whitespace-pre-line bg-neutral-950 p-3 rounded-xl border border-white/5">{inq.message}</p>
                </div>
              ))
            )}
          </div>
        </div>
      )}

      {/* TAB 7: SETTINGS */}
      {activeTab === 'settings' && (
        <form onSubmit={handleSaveSettings} className="p-8 rounded-3xl bg-neutral-900/60 border border-white/10 space-y-6 text-xs">
          <h2 className="text-lg font-bold text-white">Homepage & Global Settings</h2>

          <div className="space-y-4">
            <div>
              <label className="block text-neutral-300 font-semibold mb-1">Hero Title</label>
              <input
                type="text"
                value={websiteSettingsState.heroTitle || ''}
                onChange={(e) => setWebsiteSettingsState({ ...websiteSettingsState, heroTitle: e.target.value })}
                className="w-full px-4 py-3 rounded-xl bg-neutral-950 border border-white/10 text-white"
              />
            </div>

            <div>
              <label className="block text-neutral-300 font-semibold mb-1">Hero Subtitle</label>
              <textarea
                rows={2}
                value={websiteSettingsState.heroSubtitle || ''}
                onChange={(e) => setWebsiteSettingsState({ ...websiteSettingsState, heroSubtitle: e.target.value })}
                className="w-full px-4 py-3 rounded-xl bg-neutral-950 border border-white/10 text-white"
              ></textarea>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-neutral-300 font-semibold mb-1">Company Email</label>
                <input
                  type="email"
                  value={websiteSettingsState.companyEmail || ''}
                  onChange={(e) => setWebsiteSettingsState({ ...websiteSettingsState, companyEmail: e.target.value })}
                  className="w-full px-4 py-3 rounded-xl bg-neutral-950 border border-white/10 text-white"
                />
              </div>

              <div>
                <label className="block text-neutral-300 font-semibold mb-1">Company Phone</label>
                <input
                  type="text"
                  value={websiteSettingsState.companyPhone || ''}
                  onChange={(e) => setWebsiteSettingsState({ ...websiteSettingsState, companyPhone: e.target.value })}
                  className="w-full px-4 py-3 rounded-xl bg-neutral-950 border border-white/10 text-white"
                />
              </div>
            </div>

            <div>
              <label className="block text-neutral-300 font-semibold mb-1">Studio Address</label>
              <input
                type="text"
                value={websiteSettingsState.address || ''}
                onChange={(e) => setWebsiteSettingsState({ ...websiteSettingsState, address: e.target.value })}
                className="w-full px-4 py-3 rounded-xl bg-neutral-950 border border-white/10 text-white"
              />
            </div>
          </div>

          <button
            type="submit"
            className="px-6 py-3 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-semibold flex items-center space-x-2 shadow-lg cursor-pointer"
          >
            <Save className="w-4 h-4" />
            <span>Save Settings to Firestore</span>
          </button>
        </form>
      )}

    </div>
  );
};
