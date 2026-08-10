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
  LogOut,
  Cpu,
  Users,
  MessageSquare,
  Image as ImageIcon,
  FileText,
  Video,
  Upload,
  Link as LinkIcon,
  Eye,
  Star,
  CheckCircle2,
  PlusCircle,
  HelpCircle,
  Share2
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { CONTACT_CONFIG } from '../config/contact';
import { 
  Project, 
  Category, 
  Service, 
  BlogArticle, 
  Inquiry, 
  WebsiteSettings,
  TeamMember,
  Testimonial,
  MediaAsset
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
  saveTeamMember,
  deleteTeamMember,
  saveTestimonial,
  deleteTestimonial,
  saveMediaAsset,
  deleteMediaAsset,
  deleteInquiry,
  saveWebsiteSettings, 
  seedDatabaseIfEmpty,
  subscribeProjects,
  subscribeCategories,
  subscribeServices,
  subscribeBlogs,
  subscribeTestimonials,
  subscribeTeamMembers,
  subscribeMediaAssets,
  subscribeWebsiteSettings,
  subscribeInquiries
} from '../services/db';

import { ConstructionMaterialsAdmin } from '../components/admin/ConstructionMaterialsAdmin';
import { ConstructionLaborAdmin } from '../components/admin/ConstructionLaborAdmin';
import { ConstructionAIRulesAdmin } from '../components/admin/ConstructionAIRulesAdmin';
import { ProjectManagementAdmin } from '../components/admin/ProjectManagementAdmin';
import { QuotationInvoiceAdmin } from '../components/admin/QuotationInvoiceAdmin';
import { EmployeeTaskAdmin } from '../components/admin/EmployeeTaskAdmin';
import { FileVaultAdmin } from '../components/admin/FileVaultAdmin';
import { CRMAnalyticsAdmin } from '../components/admin/CRMAnalyticsAdmin';

interface AdminPageProps {
  projects: Project[];
  categories: Category[];
  services: Service[];
  blogs: BlogArticle[];
  settings: WebsiteSettings;
  onDataChange: () => void;
}

export const AdminPage: React.FC<AdminPageProps> = ({
  projects: initialProjectsProp,
  categories: initialCategoriesProp,
  services: initialServicesProp,
  blogs: initialBlogsProp,
  settings: initialSettingsProp,
  onDataChange
}) => {
  const { isAdmin, loginDemoAdmin, loginWithEmail, logout } = useAuth();
  
  const [emailInput, setEmailInput] = useState('');
  const [passInput, setPassInput] = useState('');
  const [loginError, setLoginError] = useState('');
  const [loginLoading, setLoginLoading] = useState(false);

  type TabType = 
    | 'projects' 
    | 'categories' 
    | 'services' 
    | 'blogs' 
    | 'team' 
    | 'testimonials' 
    | 'media' 
    | 'settings' 
    | 'inquiries'
    | 'project-mgmt' 
    | 'quotations' 
    | 'employees' 
    | 'vault' 
    | 'crm' 
    | 'materials' 
    | 'labor' 
    | 'airules' 
    | 'dashboard';

  const [activeTab, setActiveTab] = useState<TabType>('projects');

  // Real-time collections state
  const [projects, setProjects] = useState<Project[]>(initialProjectsProp || []);
  const [categories, setCategories] = useState<Category[]>(initialCategoriesProp || []);
  const [services, setServices] = useState<Service[]>(initialServicesProp || []);
  const [blogs, setBlogs] = useState<BlogArticle[]>(initialBlogsProp || []);
  const [team, setTeam] = useState<TeamMember[]>([]);
  const [testimonials, setTestimonials] = useState<Testimonial[]>([]);
  const [mediaAssets, setMediaAssets] = useState<MediaAsset[]>([]);
  const [inquiries, setInquiries] = useState<Inquiry[]>([]);
  const [websiteSettingsState, setWebsiteSettingsState] = useState<WebsiteSettings>(initialSettingsProp);

  // Modals for CRUD Editing
  const [editingProject, setEditingProject] = useState<Partial<Project> | null>(null);
  const [editingCategory, setEditingCategory] = useState<Partial<Category> | null>(null);
  const [editingService, setEditingService] = useState<Partial<Service> | null>(null);
  const [editingBlog, setEditingBlog] = useState<Partial<BlogArticle> | null>(null);
  const [editingTeamMember, setEditingTeamMember] = useState<Partial<TeamMember> | null>(null);
  const [editingTestimonial, setEditingTestimonial] = useState<Partial<Testimonial> | null>(null);
  const [editingMediaAsset, setEditingMediaAsset] = useState<Partial<MediaAsset> | null>(null);

  // File Uploader state
  const [uploadProgress, setUploadProgress] = useState<string | null>(null);

  const [toastMessage, setToastMessage] = useState<string | null>(null);

  useEffect(() => {
    if (isAdmin) {
      seedDatabaseIfEmpty();

      const unsubProjects = subscribeProjects(setProjects);
      const unsubCategories = subscribeCategories(setCategories);
      const unsubServices = subscribeServices(setServices);
      const unsubBlogs = subscribeBlogs(setBlogs);
      const unsubTestimonials = subscribeTestimonials(setTestimonials);
      const unsubTeam = subscribeTeamMembers(setTeam);
      const unsubMedia = subscribeMediaAssets(setMediaAssets);
      const unsubSettings = subscribeWebsiteSettings(setWebsiteSettingsState);
      const unsubInquiries = subscribeInquiries(setInquiries);

      return () => {
        unsubProjects();
        unsubCategories();
        unsubServices();
        unsubBlogs();
        unsubTestimonials();
        unsubTeam();
        unsubMedia();
        unsubSettings();
        unsubInquiries();
      };
    }
  }, [isAdmin]);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3500);
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoginError('');

    if (!emailInput || !passInput) {
      setLoginError('Please enter your email and password.');
      return;
    }

    setLoginLoading(true);

    try {
      await loginWithEmail(emailInput, passInput);
      showToast('Admin logged in successfully!');
    } catch (err: any) {
      setLoginError(err.message || 'Login failed. Please check your credentials.');
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
    showToast('Project updated in real-time in Firestore!');
  };

  const handleDeleteProject = async (id: string) => {
    if (confirm('Are you sure you want to delete this project?')) {
      await deleteProject(id);
      onDataChange();
      showToast('Project deleted from Firestore.');
    }
  };

  // ---------------- CATEGORY HANDLERS ----------------
  const handleSaveCategorySubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingCategory?.name) return;
    await saveCategory(editingCategory);
    setEditingCategory(null);
    onDataChange();
    showToast('Category saved to Firestore.');
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
    showToast('Service updated in Firestore.');
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

  // ---------------- TEAM HANDLERS ----------------
  const handleSaveTeamSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingTeamMember?.name) return;
    await saveTeamMember(editingTeamMember);
    setEditingTeamMember(null);
    onDataChange();
    showToast('Team member saved to Firestore.');
  };

  const handleDeleteTeamMember = async (id: string) => {
    if (confirm('Delete team member?')) {
      await deleteTeamMember(id);
      onDataChange();
      showToast('Team member removed.');
    }
  };

  // ---------------- TESTIMONIAL HANDLERS ----------------
  const handleSaveTestimonialSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingTestimonial?.name) return;
    await saveTestimonial(editingTestimonial);
    setEditingTestimonial(null);
    onDataChange();
    showToast('Testimonial saved to Firestore.');
  };

  const handleDeleteTestimonial = async (id: string) => {
    if (confirm('Delete testimonial?')) {
      await deleteTestimonial(id);
      onDataChange();
      showToast('Testimonial removed.');
    }
  };

  // ---------------- MEDIA ASSET HANDLERS ----------------
  const handleSaveMediaAssetSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingMediaAsset?.title || !editingMediaAsset?.url) return;
    await saveMediaAsset(editingMediaAsset);
    setEditingMediaAsset(null);
    onDataChange();
    showToast('Media asset saved to Firestore Media Vault.');
  };

  const handleDeleteMediaAsset = async (id: string) => {
    if (confirm('Delete media asset?')) {
      await deleteMediaAsset(id);
      onDataChange();
      showToast('Media asset deleted.');
    }
  };

  // File drop / picker handler
  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>, targetAsset: Partial<MediaAsset>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploadProgress(`Processing ${file.name}...`);
    const reader = new FileReader();
    reader.onload = async (event) => {
      const dataUrl = event.target?.result as string;
      const type = file.type.startsWith('video') 
        ? 'video' 
        : file.type.includes('pdf') 
        ? 'pdf' 
        : 'image';

      setEditingMediaAsset({
        ...targetAsset,
        title: targetAsset.title || file.name.replace(/\.[^/.]+$/, ""),
        type,
        url: dataUrl,
        fileSize: `${(file.size / (1024 * 1024)).toFixed(1)} MB`
      });
      setUploadProgress(null);
      showToast(`File "${file.name}" loaded successfully!`);
    };
    reader.readAsDataURL(file);
  };

  // ---------------- SETTINGS HANDLERS ----------------
  const handleSaveSettings = async (e: React.FormEvent) => {
    e.preventDefault();
    await saveWebsiteSettings(websiteSettingsState);
    onDataChange();
    showToast('Homepage & Global settings updated real-time in Firestore!');
  };

  // ---------------- INQUIRY HANDLER ----------------
  const handleDeleteInquiry = async (id: string) => {
    if (confirm('Delete client inquiry?')) {
      await deleteInquiry(id);
      showToast('Inquiry removed.');
    }
  };

  // ---------------- RE-SEED HANDLER ----------------
  const handleReseed = async () => {
    if (confirm('Re-seed initial database sample data across all collections?')) {
      await seedDatabaseIfEmpty();
      onDataChange();
      showToast('Firestore collections seeded successfully!');
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
            <p className="text-neutral-400 text-xs">Real-time Firestore Database Management & Admin Panel</p>
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
        <div className="fixed top-24 right-6 z-50 px-5 py-3.5 rounded-2xl bg-blue-600 text-white font-semibold text-xs shadow-2xl flex items-center gap-2 animate-bounce">
          <CheckCircle2 className="w-5 h-5 text-white" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Admin Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-6 rounded-3xl bg-neutral-900/90 border border-white/10 backdrop-blur-md shadow-2xl">
        <div className="flex items-center space-x-3">
          <div className="p-3 rounded-2xl bg-blue-600/20 text-blue-400 border border-blue-500/30">
            <ShieldCheck className="w-7 h-7" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-white tracking-tight">Fiza Hayat Admin Control Center</h1>
            <p className="text-neutral-400 text-xs flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping"></span>
              Live Firestore Real-Time CRUD Operations Active
            </p>
          </div>
        </div>

        <div className="flex items-center space-x-3">
          <button
            onClick={handleReseed}
            className="px-3.5 py-2.5 rounded-xl bg-neutral-800 hover:bg-neutral-700 text-neutral-300 text-xs font-semibold flex items-center gap-1.5 cursor-pointer transition-all border border-white/5"
            title="Seed sample data across all collections"
          >
            <Database className="w-4 h-4 text-blue-400" />
            <span>Re-Seed Firestore</span>
          </button>

          <button
            onClick={logout}
            className="px-3.5 py-2.5 rounded-xl bg-red-950/60 hover:bg-red-900/60 text-red-300 text-xs font-semibold flex items-center gap-1.5 border border-red-500/30 cursor-pointer transition-all"
          >
            <LogOut className="w-4 h-4" />
            <span>Log Out</span>
          </button>
        </div>
      </div>

      {/* Primary CRUD Navigation Tabs */}
      <div className="flex items-center space-x-2 overflow-x-auto pb-2 border-b border-white/10 text-xs">
        {[
          { id: 'projects', label: `Projects (${projects.length})`, icon: Building2 },
          { id: 'categories', label: `Categories (${categories.length})`, icon: Folder },
          { id: 'services', label: `Services (${services.length})`, icon: Sparkles },
          { id: 'blogs', label: `Blogs (${blogs.length})`, icon: BookOpen },
          { id: 'team', label: `Team (${team.length})`, icon: Users },
          { id: 'testimonials', label: `Testimonials (${testimonials.length})`, icon: MessageSquare },
          { id: 'media', label: `Upload Vault (${mediaAssets.length})`, icon: Upload },
          { id: 'settings', label: 'Homepage Settings', icon: Settings },
          { id: 'inquiries', label: `Inquiries (${inquiries.length})`, icon: Mail },
          { id: 'project-mgmt', label: 'Enterprise Projects', icon: Cpu },
          { id: 'quotations', label: 'Invoices', icon: Sparkles },
          { id: 'employees', label: 'Kanban Tasks', icon: Users },
          { id: 'vault', label: 'Cloud Vault', icon: Folder },
          { id: 'crm', label: 'CRM Analytics', icon: ShieldCheck }
        ].map((tab) => {
          const Icon = tab.icon;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as TabType)}
              className={`px-4 py-2.5 rounded-2xl font-semibold flex items-center space-x-2 cursor-pointer transition-all whitespace-nowrap ${
                activeTab === tab.id
                  ? 'bg-blue-600 text-white shadow-lg shadow-blue-600/30'
                  : 'bg-neutral-900/70 text-neutral-400 hover:text-white border border-white/5'
              }`}
            >
              <Icon className="w-4 h-4" />
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>

      {/* TAB 1: PROJECTS MANAGEMENT */}
      {activeTab === 'projects' && (
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-xl font-bold text-white">Projects Collection</h2>
              <p className="text-neutral-400 text-xs">Add, edit, or delete architectural, interior, 3D BIM, and AI projects.</p>
            </div>
            <button
              onClick={() => setEditingProject({
                title: '',
                description: '',
                fullContent: '',
                categoryId: categories[0]?.id || 'cat-arch',
                categoryName: categories[0]?.name || 'Architecture & Building',
                coverImage: 'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&w=1200&q=80',
                images: ['https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&w=1200&q=80'],
                videoUrl: '',
                softwareUsed: ['Autodesk Revit', '3ds Max'],
                tags: ['Architecture'],
                clientName: 'New Client',
                projectDate: new Date().toISOString().split('T')[0]
              })}
              className="px-4 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-semibold text-xs flex items-center space-x-2 cursor-pointer shadow-lg transition-all"
            >
              <Plus className="w-4 h-4" />
              <span>Add New Project</span>
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {projects.map((proj) => (
              <div
                key={proj.id}
                className="p-5 rounded-3xl bg-neutral-900/80 border border-white/10 flex flex-col justify-between gap-4 text-xs hover:border-blue-500/40 transition-all"
              >
                <div className="flex items-start space-x-3 min-w-0">
                  <img src={proj.coverImage} alt={proj.title} className="w-16 h-16 rounded-2xl object-cover shrink-0 border border-white/10" />
                  <div className="min-w-0 space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="px-2 py-0.5 rounded-full bg-blue-600/20 text-blue-400 text-[10px] font-bold border border-blue-500/30">
                        {proj.categoryName}
                      </span>
                      {proj.featured && (
                        <span className="px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-300 text-[10px] font-bold border border-amber-500/30">
                          Featured
                        </span>
                      )}
                    </div>
                    <div className="text-white font-bold text-sm truncate">{proj.title}</div>
                    <div className="text-neutral-400 text-[11px] line-clamp-1">{proj.description}</div>
                  </div>
                </div>

                <div className="flex items-center justify-between pt-3 border-t border-white/10">
                  <span className="text-neutral-500 text-[10px]">Client: {proj.clientName}</span>
                  <div className="flex items-center space-x-2">
                    <button
                      onClick={() => setEditingProject(proj)}
                      className="px-3 py-1.5 rounded-xl bg-neutral-800 text-neutral-300 hover:text-white flex items-center gap-1 cursor-pointer"
                    >
                      <Edit3 className="w-3.5 h-3.5" />
                      <span>Edit</span>
                    </button>
                    <button
                      onClick={() => handleDeleteProject(proj.id)}
                      className="px-3 py-1.5 rounded-xl bg-red-950/60 text-red-400 hover:text-red-300 border border-red-500/20 flex items-center gap-1 cursor-pointer"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                      <span>Delete</span>
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 2: CATEGORIES MANAGEMENT */}
      {activeTab === 'categories' && (
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-xl font-bold text-white">Categories Collection</h2>
              <p className="text-neutral-400 text-xs">Organize portfolio projects into architectural, interior, BIM, 3D, and AI categories.</p>
            </div>
            <button
              onClick={() => setEditingCategory({ name: '', description: '', icon: 'Building2', order: categories.length + 1 })}
              className="px-4 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-semibold text-xs flex items-center space-x-2 cursor-pointer shadow-lg"
            >
              <Plus className="w-4 h-4" />
              <span>Add Category</span>
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {categories.map((cat) => (
              <div key={cat.id} className="p-5 rounded-3xl bg-neutral-900/80 border border-white/10 space-y-3 text-xs">
                <div className="flex items-center justify-between">
                  <span className="px-2.5 py-1 rounded-xl bg-blue-600/20 text-blue-400 font-bold border border-blue-500/30">
                    Order #{cat.order}
                  </span>
                  <div className="flex items-center space-x-1">
                    <button onClick={() => setEditingCategory(cat)} className="p-1.5 text-neutral-400 hover:text-white">
                      <Edit3 className="w-4 h-4" />
                    </button>
                    <button onClick={() => handleDeleteCategory(cat.id)} className="p-1.5 text-red-400 hover:text-red-300">
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
                <h3 className="text-white font-bold text-base">{cat.name}</h3>
                <p className="text-neutral-400 text-xs">{cat.description}</p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 3: SERVICES MANAGEMENT */}
      {activeTab === 'services' && (
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-xl font-bold text-white">Services Collection</h2>
              <p className="text-neutral-400 text-xs">Manage company offerings, features, pricing tiers, and service cards.</p>
            </div>
            <button
              onClick={() => setEditingService({
                title: '',
                description: '',
                icon: 'Sparkles',
                features: ['Feature 1', 'Feature 2'],
                category: 'Architecture',
                order: services.length + 1,
                featured: true
              })}
              className="px-4 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-semibold text-xs flex items-center space-x-2 cursor-pointer shadow-lg"
            >
              <Plus className="w-4 h-4" />
              <span>Add New Service</span>
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {services.map((srv) => (
              <div key={srv.id} className="p-5 rounded-3xl bg-neutral-900/80 border border-white/10 space-y-3 text-xs flex flex-col justify-between">
                <div className="space-y-2">
                  <div className="flex justify-between items-center">
                    <span className="text-blue-400 font-bold uppercase text-[10px]">{srv.category}</span>
                    <div className="flex items-center space-x-1">
                      <button onClick={() => setEditingService(srv)} className="p-1.5 text-neutral-400 hover:text-white">
                        <Edit3 className="w-4 h-4" />
                      </button>
                      <button onClick={() => handleDeleteService(srv.id)} className="p-1.5 text-red-400 hover:text-red-300">
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                  <h3 className="text-white font-bold text-base">{srv.title}</h3>
                  <p className="text-neutral-400">{srv.description}</p>
                </div>

                <div className="pt-2 border-t border-white/10">
                  <div className="text-neutral-500 text-[10px] font-semibold mb-1">Included Features ({srv.features.length}):</div>
                  <div className="flex flex-wrap gap-1">
                    {srv.features.map((f, idx) => (
                      <span key={idx} className="px-2 py-0.5 rounded-md bg-neutral-950 text-neutral-300 text-[10px]">
                        ✓ {f}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 4: BLOGS MANAGEMENT */}
      {activeTab === 'blogs' && (
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-xl font-bold text-white">Blog Articles Collection</h2>
              <p className="text-neutral-400 text-xs">Publish architectural insights, AI design articles, and BIM guides.</p>
            </div>
            <button
              onClick={() => setEditingBlog({
                title: '',
                content: '',
                excerpt: '',
                coverImage: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1200&q=80',
                category: 'AI & Architecture',
                tags: ['Design', 'AI'],
                author: 'Fiza Hayat Team',
                readTime: '4 min read',
                published: true
              })}
              className="px-4 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-semibold text-xs flex items-center space-x-2 cursor-pointer shadow-lg"
            >
              <Plus className="w-4 h-4" />
              <span>Create Blog Article</span>
            </button>
          </div>

          <div className="space-y-3">
            {blogs.map((b) => (
              <div key={b.id} className="p-4 rounded-3xl bg-neutral-900/80 border border-white/10 flex items-center justify-between gap-4 text-xs">
                <div className="flex items-center space-x-3 min-w-0">
                  <img src={b.coverImage} alt={b.title} className="w-16 h-16 rounded-2xl object-cover shrink-0 border border-white/10" />
                  <div className="min-w-0">
                    <div className="text-white font-bold text-sm truncate">{b.title}</div>
                    <div className="text-neutral-400 text-[11px] truncate">{b.excerpt}</div>
                    <div className="text-blue-400 text-[10px] mt-0.5">{b.category} • {b.readTime}</div>
                  </div>
                </div>

                <div className="flex items-center space-x-2 shrink-0">
                  <button onClick={() => setEditingBlog(b)} className="p-2 rounded-xl bg-neutral-800 text-neutral-300 hover:text-white">
                    <Edit3 className="w-4 h-4" />
                  </button>
                  <button onClick={() => handleDeleteBlog(b.id)} className="p-2 rounded-xl bg-red-950/60 text-red-400 hover:text-red-300 border border-red-500/20">
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 5: TEAM MEMBERS MANAGEMENT */}
      {activeTab === 'team' && (
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-xl font-bold text-white">Team Members Collection</h2>
              <p className="text-neutral-400 text-xs">Manage studio architects, BIM engineers, 3D visualizers, and directors.</p>
            </div>
            <button
              onClick={() => setEditingTeamMember({
                name: '',
                role: 'Architect',
                bio: '',
                avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=600&q=80',
                email: 'team@fizahayat.com',
                specialization: 'Architecture',
                experienceYears: 5,
                order: team.length + 1
              })}
              className="px-4 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-semibold text-xs flex items-center space-x-2 cursor-pointer shadow-lg"
            >
              <Plus className="w-4 h-4" />
              <span>Add Team Member</span>
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {team.map((tm) => (
              <div key={tm.id} className="p-5 rounded-3xl bg-neutral-900/80 border border-white/10 space-y-3 text-xs flex flex-col justify-between">
                <div className="space-y-2">
                  <div className="flex items-center space-x-3">
                    <img src={tm.avatar} alt={tm.name} className="w-14 h-14 rounded-2xl object-cover border border-white/10" />
                    <div>
                      <h3 className="text-white font-bold text-sm">{tm.name}</h3>
                      <div className="text-blue-400 font-semibold text-[11px]">{tm.role}</div>
                      <div className="text-neutral-500 text-[10px]">{tm.experienceYears} Years Exp.</div>
                    </div>
                  </div>
                  <p className="text-neutral-300">{tm.bio}</p>
                </div>

                <div className="flex items-center justify-between pt-3 border-t border-white/10">
                  <span className="text-neutral-500 text-[10px]">{tm.email}</span>
                  <div className="flex space-x-1">
                    <button onClick={() => setEditingTeamMember(tm)} className="p-1.5 text-neutral-400 hover:text-white">
                      <Edit3 className="w-4 h-4" />
                    </button>
                    <button onClick={() => handleDeleteTeamMember(tm.id)} className="p-1.5 text-red-400 hover:text-red-300">
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 6: TESTIMONIALS MANAGEMENT */}
      {activeTab === 'testimonials' && (
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-xl font-bold text-white">Client Testimonials Collection</h2>
              <p className="text-neutral-400 text-xs">Manage client reviews, ratings, and quotes displayed on the homepage.</p>
            </div>
            <button
              onClick={() => setEditingTestimonial({
                name: '',
                role: 'Client Director',
                company: 'Private Client',
                avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=300&q=80',
                content: '',
                rating: 5,
                location: 'Zurich'
              })}
              className="px-4 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-semibold text-xs flex items-center space-x-2 cursor-pointer shadow-lg"
            >
              <Plus className="w-4 h-4" />
              <span>Add Testimonial</span>
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {testimonials.map((t) => (
              <div key={t.id} className="p-5 rounded-3xl bg-neutral-900/80 border border-white/10 space-y-3 text-xs flex flex-col justify-between">
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <img src={t.avatar} alt={t.name} className="w-10 h-10 rounded-full object-cover" />
                      <div>
                        <div className="text-white font-bold">{t.name}</div>
                        <div className="text-neutral-400 text-[10px]">{t.role} • {t.company}</div>
                      </div>
                    </div>
                    <div className="flex text-amber-400 text-xs">
                      {'★'.repeat(t.rating)}
                    </div>
                  </div>
                  <p className="text-neutral-300 italic">"{t.content}"</p>
                </div>

                <div className="flex justify-between items-center pt-2 border-t border-white/10">
                  <span className="text-neutral-500 text-[10px]">{t.location}</span>
                  <div className="flex space-x-1">
                    <button onClick={() => setEditingTestimonial(t)} className="p-1.5 text-neutral-400 hover:text-white">
                      <Edit3 className="w-4 h-4" />
                    </button>
                    <button onClick={() => handleDeleteTestimonial(t.id)} className="p-1.5 text-red-400 hover:text-red-300">
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 7: UPLOAD VAULT (IMAGES, VIDEOS, PDFS) */}
      {activeTab === 'media' && (
        <div className="space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h2 className="text-xl font-bold text-white">Media Vault & Upload Manager</h2>
              <p className="text-neutral-400 text-xs">Upload images, 4K videos, and PDF architectural blueprints directly to Firestore.</p>
            </div>
            <button
              onClick={() => setEditingMediaAsset({
                title: '',
                type: 'image',
                url: '',
                category: 'General',
                description: '',
                fileSize: '2.5 MB'
              })}
              className="px-4 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-semibold text-xs flex items-center space-x-2 cursor-pointer shadow-lg"
            >
              <Upload className="w-4 h-4" />
              <span>Upload / Add Media</span>
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {mediaAssets.map((asset) => (
              <div key={asset.id} className="p-4 rounded-3xl bg-neutral-900/80 border border-white/10 space-y-3 text-xs flex flex-col justify-between">
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase ${
                      asset.type === 'image' ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30' :
                      asset.type === 'video' ? 'bg-purple-500/20 text-purple-300 border border-purple-500/30' :
                      'bg-rose-500/20 text-rose-300 border border-rose-500/30'
                    }`}>
                      {asset.type}
                    </span>
                    <span className="text-neutral-500 text-[10px]">{asset.fileSize}</span>
                  </div>

                  {asset.type === 'image' && (
                    <img src={asset.url} alt={asset.title} className="w-full h-36 rounded-2xl object-cover border border-white/10" />
                  )}
                  {asset.type === 'video' && (
                    <video src={asset.url} className="w-full h-36 rounded-2xl object-cover border border-white/10" controls />
                  )}
                  {asset.type === 'pdf' && (
                    <div className="w-full h-36 rounded-2xl bg-neutral-950 border border-white/10 flex flex-col items-center justify-center space-y-2">
                      <FileText className="w-10 h-10 text-rose-400" />
                      <span className="text-neutral-300 font-semibold text-xs">PDF Blueprint Document</span>
                    </div>
                  )}

                  <h3 className="text-white font-bold text-sm truncate">{asset.title}</h3>
                  <p className="text-neutral-400 text-[11px] line-clamp-2">{asset.description}</p>
                </div>

                <div className="flex items-center justify-between pt-2 border-t border-white/10">
                  <a
                    href={asset.url}
                    target="_blank"
                    rel="noreferrer"
                    className="text-blue-400 hover:underline text-[10px] font-semibold flex items-center gap-1"
                  >
                    <Eye className="w-3 h-3" /> View Asset
                  </a>
                  <div className="flex space-x-1">
                    <button onClick={() => setEditingMediaAsset(asset)} className="p-1.5 text-neutral-400 hover:text-white">
                      <Edit3 className="w-4 h-4" />
                    </button>
                    <button onClick={() => handleDeleteMediaAsset(asset.id)} className="p-1.5 text-red-400 hover:text-red-300">
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 8: HOMEPAGE & GLOBAL SETTINGS */}
      {activeTab === 'settings' && (
        <form onSubmit={handleSaveSettings} className="p-8 rounded-3xl bg-neutral-900/80 border border-white/10 space-y-6 text-xs shadow-2xl">
          <div>
            <h2 className="text-xl font-bold text-white">Homepage Content & Global Website Settings</h2>
            <p className="text-neutral-400 text-xs">Control hero headers, typing subtitles, company story, stats, and contact info in real-time.</p>
          </div>

          <div className="space-y-4">
            <div>
              <label className="block text-neutral-300 font-semibold mb-1">Hero Headline Title</label>
              <input
                type="text"
                value={websiteSettingsState.heroTitle || ''}
                onChange={(e) => setWebsiteSettingsState({ ...websiteSettingsState, heroTitle: e.target.value })}
                className="w-full px-4 py-3 rounded-xl bg-neutral-950 border border-white/10 text-white focus:outline-none focus:border-blue-500"
              />
            </div>

            <div>
              <label className="block text-neutral-300 font-semibold mb-1">Hero Subtitle Description</label>
              <textarea
                rows={2}
                value={websiteSettingsState.heroSubtitle || ''}
                onChange={(e) => setWebsiteSettingsState({ ...websiteSettingsState, heroSubtitle: e.target.value })}
                className="w-full px-4 py-3 rounded-xl bg-neutral-950 border border-white/10 text-white focus:outline-none focus:border-blue-500"
              ></textarea>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              <div>
                <label className="block text-neutral-300 font-semibold mb-1">Completed Projects</label>
                <input
                  type="number"
                  value={websiteSettingsState.statsProjects || 145}
                  onChange={(e) => setWebsiteSettingsState({ ...websiteSettingsState, statsProjects: parseInt(e.target.value) || 0 })}
                  className="w-full px-3 py-2 rounded-xl bg-neutral-950 border border-white/10 text-white"
                />
              </div>
              <div>
                <label className="block text-neutral-300 font-semibold mb-1">Global Clients</label>
                <input
                  type="number"
                  value={websiteSettingsState.statsClients || 82}
                  onChange={(e) => setWebsiteSettingsState({ ...websiteSettingsState, statsClients: parseInt(e.target.value) || 0 })}
                  className="w-full px-3 py-2 rounded-xl bg-neutral-950 border border-white/10 text-white"
                />
              </div>
              <div>
                <label className="block text-neutral-300 font-semibold mb-1">Countries Active</label>
                <input
                  type="number"
                  value={websiteSettingsState.statsCountries || 24}
                  onChange={(e) => setWebsiteSettingsState({ ...websiteSettingsState, statsCountries: parseInt(e.target.value) || 0 })}
                  className="w-full px-3 py-2 rounded-xl bg-neutral-950 border border-white/10 text-white"
                />
              </div>
              <div>
                <label className="block text-neutral-300 font-semibold mb-1">Years Experience</label>
                <input
                  type="number"
                  value={websiteSettingsState.statsYears || 10}
                  onChange={(e) => setWebsiteSettingsState({ ...websiteSettingsState, statsYears: parseInt(e.target.value) || 0 })}
                  className="w-full px-3 py-2 rounded-xl bg-neutral-950 border border-white/10 text-white"
                />
              </div>
            </div>

            <div>
              <label className="block text-neutral-300 font-semibold mb-1">Company Story (About Us)</label>
              <textarea
                rows={3}
                value={websiteSettingsState.companyStory || ''}
                onChange={(e) => setWebsiteSettingsState({ ...websiteSettingsState, companyStory: e.target.value })}
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
                <label className="block text-neutral-300 font-semibold mb-1">WhatsApp Group Invite Link</label>
                <input
                  type="text"
                  value={websiteSettingsState.whatsappGroupLink || CONTACT_CONFIG.whatsappGroupLink}
                  onChange={(e) => setWebsiteSettingsState({ ...websiteSettingsState, whatsappGroupLink: e.target.value })}
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
            className="px-6 py-3 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-semibold flex items-center space-x-2 shadow-lg cursor-pointer transition-all"
          >
            <Save className="w-4 h-4" />
            <span>Save Settings Real-Time to Firestore</span>
          </button>
        </form>
      )}

      {/* TAB 9: INQUIRIES */}
      {activeTab === 'inquiries' && (
        <div className="space-y-4">
          <h2 className="text-xl font-bold text-white">Client Inquiries & Cost Proposals</h2>
          <div className="space-y-3">
            {inquiries.length === 0 ? (
              <div className="p-8 text-center text-neutral-500 rounded-3xl bg-neutral-900/80 border border-white/10">
                No client inquiries submitted yet.
              </div>
            ) : (
              inquiries.map((inq) => (
                <div key={inq.id} className="p-5 rounded-3xl bg-neutral-900/80 border border-white/10 space-y-2 text-xs">
                  <div className="flex items-center justify-between">
                    <span className="text-white font-bold text-sm">{inq.name} ({inq.email})</span>
                    <button onClick={() => handleDeleteInquiry(inq.id!)} className="p-1.5 text-red-400 hover:text-red-300">
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                  <div className="text-blue-400 font-semibold">Service: {inq.service} • Budget: {inq.budget || 'N/A'}</div>
                  <p className="text-neutral-300 whitespace-pre-line bg-neutral-950 p-3.5 rounded-2xl border border-white/5">{inq.message}</p>
                </div>
              ))
            )}
          </div>
        </div>
      )}

      {/* ENTERPRISE MODULE TABS */}
      {activeTab === 'project-mgmt' && <ProjectManagementAdmin />}
      {activeTab === 'quotations' && <QuotationInvoiceAdmin />}
      {activeTab === 'employees' && <EmployeeTaskAdmin />}
      {activeTab === 'vault' && <FileVaultAdmin />}
      {activeTab === 'crm' && <CRMAnalyticsAdmin />}

      {/* MODAL: EDIT / ADD PROJECT */}
      {editingProject && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-neutral-950/80 backdrop-blur-md animate-fadeIn">
          <div className="w-full max-w-2xl bg-neutral-900 border border-white/10 rounded-3xl p-6 shadow-2xl overflow-y-auto max-h-[90vh] space-y-4 text-xs">
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
                  className="w-full px-3 py-2 bg-neutral-950 rounded-xl border border-white/10 text-white"
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
                        categoryName: selectedCat?.name || 'Architecture & Building'
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
                <label className="block text-neutral-300 font-semibold mb-1">Video Walkthrough URL (MP4 / YouTube / Vimeo)</label>
                <input
                  type="text"
                  placeholder="https://assets.mixkit.co/videos/...mp4"
                  value={editingProject.videoUrl || ''}
                  onChange={(e) => setEditingProject({ ...editingProject, videoUrl: e.target.value })}
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

      {/* MODAL: EDIT / ADD CATEGORY */}
      {editingCategory && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-neutral-950/80 backdrop-blur-md">
          <div className="w-full max-w-md bg-neutral-900 border border-white/10 rounded-3xl p-6 shadow-2xl space-y-4 text-xs">
            <div className="flex justify-between items-center border-b border-white/10 pb-3">
              <h3 className="font-bold text-white text-base">{editingCategory.id ? 'Edit Category' : 'Add Category'}</h3>
              <button onClick={() => setEditingCategory(null)} className="p-1 text-neutral-400 hover:text-white"><X className="w-4 h-4" /></button>
            </div>
            <form onSubmit={handleSaveCategorySubmit} className="space-y-3">
              <div>
                <label className="block text-neutral-300 mb-1 font-semibold">Category Name *</label>
                <input
                  type="text"
                  required
                  value={editingCategory.name || ''}
                  onChange={(e) => setEditingCategory({ ...editingCategory, name: e.target.value })}
                  className="w-full px-3 py-2 bg-neutral-950 rounded-xl border border-white/10 text-white"
                />
              </div>
              <div>
                <label className="block text-neutral-300 mb-1 font-semibold">Description</label>
                <textarea
                  rows={2}
                  value={editingCategory.description || ''}
                  onChange={(e) => setEditingCategory({ ...editingCategory, description: e.target.value })}
                  className="w-full px-3 py-2 bg-neutral-950 rounded-xl border border-white/10 text-white"
                ></textarea>
              </div>
              <div className="flex justify-end space-x-2 pt-2">
                <button type="button" onClick={() => setEditingCategory(null)} className="px-4 py-2 bg-neutral-800 text-neutral-300 rounded-xl">Cancel</button>
                <button type="submit" className="px-5 py-2 bg-blue-600 text-white font-semibold rounded-xl flex items-center gap-1"><Save className="w-4 h-4" /> Save Category</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL: EDIT / ADD SERVICE */}
      {editingService && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-neutral-950/80 backdrop-blur-md">
          <div className="w-full max-w-lg bg-neutral-900 border border-white/10 rounded-3xl p-6 shadow-2xl space-y-4 text-xs">
            <div className="flex justify-between items-center border-b border-white/10 pb-3">
              <h3 className="font-bold text-white text-base">{editingService.id ? 'Edit Service' : 'Add Service'}</h3>
              <button onClick={() => setEditingService(null)} className="p-1 text-neutral-400 hover:text-white"><X className="w-4 h-4" /></button>
            </div>
            <form onSubmit={handleSaveServiceSubmit} className="space-y-3">
              <div>
                <label className="block text-neutral-300 mb-1 font-semibold">Service Title *</label>
                <input
                  type="text"
                  required
                  value={editingService.title || ''}
                  onChange={(e) => setEditingService({ ...editingService, title: e.target.value })}
                  className="w-full px-3 py-2 bg-neutral-950 rounded-xl border border-white/10 text-white"
                />
              </div>
              <div>
                <label className="block text-neutral-300 mb-1 font-semibold">Description *</label>
                <textarea
                  required
                  rows={3}
                  value={editingService.description || ''}
                  onChange={(e) => setEditingService({ ...editingService, description: e.target.value })}
                  className="w-full px-3 py-2 bg-neutral-950 rounded-xl border border-white/10 text-white"
                ></textarea>
              </div>
              <div className="flex justify-end space-x-2 pt-2">
                <button type="button" onClick={() => setEditingService(null)} className="px-4 py-2 bg-neutral-800 text-neutral-300 rounded-xl">Cancel</button>
                <button type="submit" className="px-5 py-2 bg-blue-600 text-white font-semibold rounded-xl flex items-center gap-1"><Save className="w-4 h-4" /> Save Service</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL: EDIT / ADD BLOG */}
      {editingBlog && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-neutral-950/80 backdrop-blur-md">
          <div className="w-full max-w-xl bg-neutral-900 border border-white/10 rounded-3xl p-6 shadow-2xl space-y-4 text-xs">
            <div className="flex justify-between items-center border-b border-white/10 pb-3">
              <h3 className="font-bold text-white text-base">{editingBlog.id ? 'Edit Article' : 'Create Article'}</h3>
              <button onClick={() => setEditingBlog(null)} className="p-1 text-neutral-400 hover:text-white"><X className="w-4 h-4" /></button>
            </div>
            <form onSubmit={handleSaveBlogSubmit} className="space-y-3">
              <div>
                <label className="block text-neutral-300 mb-1 font-semibold">Article Title *</label>
                <input
                  type="text"
                  required
                  value={editingBlog.title || ''}
                  onChange={(e) => setEditingBlog({ ...editingBlog, title: e.target.value })}
                  className="w-full px-3 py-2 bg-neutral-950 rounded-xl border border-white/10 text-white"
                />
              </div>
              <div>
                <label className="block text-neutral-300 mb-1 font-semibold">Cover Image URL *</label>
                <input
                  type="url"
                  required
                  value={editingBlog.coverImage || ''}
                  onChange={(e) => setEditingBlog({ ...editingBlog, coverImage: e.target.value })}
                  className="w-full px-3 py-2 bg-neutral-950 rounded-xl border border-white/10 text-white"
                />
              </div>
              <div>
                <label className="block text-neutral-300 mb-1 font-semibold">Excerpt</label>
                <textarea
                  rows={2}
                  value={editingBlog.excerpt || ''}
                  onChange={(e) => setEditingBlog({ ...editingBlog, excerpt: e.target.value })}
                  className="w-full px-3 py-2 bg-neutral-950 rounded-xl border border-white/10 text-white"
                ></textarea>
              </div>
              <div>
                <label className="block text-neutral-300 mb-1 font-semibold">Content Body</label>
                <textarea
                  rows={5}
                  value={editingBlog.content || ''}
                  onChange={(e) => setEditingBlog({ ...editingBlog, content: e.target.value })}
                  className="w-full px-3 py-2 bg-neutral-950 rounded-xl border border-white/10 text-white font-mono"
                ></textarea>
              </div>
              <div className="flex justify-end space-x-2 pt-2">
                <button type="button" onClick={() => setEditingBlog(null)} className="px-4 py-2 bg-neutral-800 text-neutral-300 rounded-xl">Cancel</button>
                <button type="submit" className="px-5 py-2 bg-blue-600 text-white font-semibold rounded-xl flex items-center gap-1"><Save className="w-4 h-4" /> Save Article</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL: EDIT / ADD TEAM MEMBER */}
      {editingTeamMember && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-neutral-950/80 backdrop-blur-md">
          <div className="w-full max-w-lg bg-neutral-900 border border-white/10 rounded-3xl p-6 shadow-2xl space-y-4 text-xs">
            <div className="flex justify-between items-center border-b border-white/10 pb-3">
              <h3 className="font-bold text-white text-base">{editingTeamMember.id ? 'Edit Team Member' : 'Add Team Member'}</h3>
              <button onClick={() => setEditingTeamMember(null)} className="p-1 text-neutral-400 hover:text-white"><X className="w-4 h-4" /></button>
            </div>
            <form onSubmit={handleSaveTeamSubmit} className="space-y-3">
              <div>
                <label className="block text-neutral-300 mb-1 font-semibold">Full Name *</label>
                <input
                  type="text"
                  required
                  value={editingTeamMember.name || ''}
                  onChange={(e) => setEditingTeamMember({ ...editingTeamMember, name: e.target.value })}
                  className="w-full px-3 py-2 bg-neutral-950 rounded-xl border border-white/10 text-white"
                />
              </div>
              <div>
                <label className="block text-neutral-300 mb-1 font-semibold">Role / Title *</label>
                <input
                  type="text"
                  required
                  value={editingTeamMember.role || ''}
                  onChange={(e) => setEditingTeamMember({ ...editingTeamMember, role: e.target.value })}
                  className="w-full px-3 py-2 bg-neutral-950 rounded-xl border border-white/10 text-white"
                />
              </div>
              <div>
                <label className="block text-neutral-300 mb-1 font-semibold">Avatar Photo URL *</label>
                <input
                  type="url"
                  required
                  value={editingTeamMember.avatar || ''}
                  onChange={(e) => setEditingTeamMember({ ...editingTeamMember, avatar: e.target.value })}
                  className="w-full px-3 py-2 bg-neutral-950 rounded-xl border border-white/10 text-white"
                />
              </div>
              <div>
                <label className="block text-neutral-300 mb-1 font-semibold">Bio</label>
                <textarea
                  rows={3}
                  value={editingTeamMember.bio || ''}
                  onChange={(e) => setEditingTeamMember({ ...editingTeamMember, bio: e.target.value })}
                  className="w-full px-3 py-2 bg-neutral-950 rounded-xl border border-white/10 text-white"
                ></textarea>
              </div>
              <div className="flex justify-end space-x-2 pt-2">
                <button type="button" onClick={() => setEditingTeamMember(null)} className="px-4 py-2 bg-neutral-800 text-neutral-300 rounded-xl">Cancel</button>
                <button type="submit" className="px-5 py-2 bg-blue-600 text-white font-semibold rounded-xl flex items-center gap-1"><Save className="w-4 h-4" /> Save Team Member</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL: EDIT / ADD TESTIMONIAL */}
      {editingTestimonial && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-neutral-950/80 backdrop-blur-md">
          <div className="w-full max-w-lg bg-neutral-900 border border-white/10 rounded-3xl p-6 shadow-2xl space-y-4 text-xs">
            <div className="flex justify-between items-center border-b border-white/10 pb-3">
              <h3 className="font-bold text-white text-base">{editingTestimonial.id ? 'Edit Testimonial' : 'Add Testimonial'}</h3>
              <button onClick={() => setEditingTestimonial(null)} className="p-1 text-neutral-400 hover:text-white"><X className="w-4 h-4" /></button>
            </div>
            <form onSubmit={handleSaveTestimonialSubmit} className="space-y-3">
              <div>
                <label className="block text-neutral-300 mb-1 font-semibold">Client Name *</label>
                <input
                  type="text"
                  required
                  value={editingTestimonial.name || ''}
                  onChange={(e) => setEditingTestimonial({ ...editingTestimonial, name: e.target.value })}
                  className="w-full px-3 py-2 bg-neutral-950 rounded-xl border border-white/10 text-white"
                />
              </div>
              <div>
                <label className="block text-neutral-300 mb-1 font-semibold">Review Content *</label>
                <textarea
                  required
                  rows={3}
                  value={editingTestimonial.content || ''}
                  onChange={(e) => setEditingTestimonial({ ...editingTestimonial, content: e.target.value })}
                  className="w-full px-3 py-2 bg-neutral-950 rounded-xl border border-white/10 text-white"
                ></textarea>
              </div>
              <div className="flex justify-end space-x-2 pt-2">
                <button type="button" onClick={() => setEditingTestimonial(null)} className="px-4 py-2 bg-neutral-800 text-neutral-300 rounded-xl">Cancel</button>
                <button type="submit" className="px-5 py-2 bg-blue-600 text-white font-semibold rounded-xl flex items-center gap-1"><Save className="w-4 h-4" /> Save Testimonial</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL: UPLOAD / EDIT MEDIA ASSET */}
      {editingMediaAsset && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-neutral-950/80 backdrop-blur-md">
          <div className="w-full max-w-lg bg-neutral-900 border border-white/10 rounded-3xl p-6 shadow-2xl space-y-4 text-xs">
            <div className="flex justify-between items-center border-b border-white/10 pb-3">
              <h3 className="font-bold text-white text-base">Add Media Asset (Images, YouTube Videos, PDFs)</h3>
              <button onClick={() => setEditingMediaAsset(null)} className="p-1 text-neutral-400 hover:text-white"><X className="w-4 h-4" /></button>
            </div>

            <form onSubmit={handleSaveMediaAssetSubmit} className="space-y-4">
              {/* File Dropzone */}
              <div className="p-6 rounded-2xl bg-neutral-950 border-2 border-dashed border-white/10 text-center space-y-2 hover:border-blue-500/50 transition-all relative">
                <Upload className="w-8 h-8 text-blue-400 mx-auto" />
                <div className="text-white font-semibold text-xs">Click or drop file to load asset</div>
                <div className="text-neutral-500 text-[10px]">Images (/images), PDF Documents (/documents), or local media</div>
                <input
                  type="file"
                  onChange={(e) => handleFileUpload(e, editingMediaAsset)}
                  accept="image/*,video/*,.pdf"
                  className="absolute inset-0 opacity-0 cursor-pointer"
                />
              </div>

              {uploadProgress && (
                <div className="p-3 rounded-xl bg-blue-950/60 border border-blue-500/30 text-blue-300 text-xs text-center animate-pulse">
                  {uploadProgress}
                </div>
              )}

              <div>
                <label className="block text-neutral-300 mb-1 font-semibold">Title *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Master Architectural Drawing v2"
                  value={editingMediaAsset.title || ''}
                  onChange={(e) => setEditingMediaAsset({ ...editingMediaAsset, title: e.target.value })}
                  className="w-full px-3 py-2 bg-neutral-950 rounded-xl border border-white/10 text-white"
                />
              </div>

              <div>
                <label className="block text-neutral-300 mb-1 font-semibold">Media Type</label>
                <select
                  value={editingMediaAsset.type || 'image'}
                  onChange={(e) => setEditingMediaAsset({ ...editingMediaAsset, type: e.target.value as any })}
                  className="w-full px-3 py-2 bg-neutral-950 rounded-xl border border-white/10 text-white cursor-pointer"
                >
                  <option value="image">Image (/images or URL)</option>
                  <option value="video">YouTube / Vimeo Embed / Video</option>
                  <option value="pdf">PDF Blueprint (/documents or URL)</option>
                </select>
              </div>

              <div>
                <label className="block text-neutral-300 mb-1 font-semibold">Asset URL / YouTube Embed Link / Repo Path *</label>
                <input
                  type="text"
                  required
                  placeholder={
                    editingMediaAsset.type === 'video'
                      ? 'https://www.youtube.com/watch?v=...'
                      : editingMediaAsset.type === 'pdf'
                      ? '/documents/sample_drawing.pdf'
                      : '/images/sample_villa.jpg or https://...'
                  }
                  value={editingMediaAsset.url || ''}
                  onChange={(e) => setEditingMediaAsset({ ...editingMediaAsset, url: e.target.value })}
                  className="w-full px-3 py-2 bg-neutral-950 rounded-xl border border-white/10 text-white font-mono text-[11px]"
                />
                <p className="text-[10px] text-neutral-500 mt-1">
                  {editingMediaAsset.type === 'video' 
                    ? 'Paste YouTube link (https://youtube.com/watch?v=...) to embed dynamically.'
                    : 'Use GitHub repo relative path (/images or /documents) or any public web URL.'}
                </p>
              </div>

              <div className="flex justify-end space-x-2 pt-2">
                <button type="button" onClick={() => setEditingMediaAsset(null)} className="px-4 py-2 bg-neutral-800 text-neutral-300 rounded-xl">Cancel</button>
                <button type="submit" className="px-5 py-2 bg-blue-600 text-white font-semibold rounded-xl flex items-center gap-1"><Save className="w-4 h-4" /> Save to Vault</button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};
