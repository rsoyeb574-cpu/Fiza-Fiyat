import React, { useState, useEffect } from 'react';
import { AuthProvider } from './context/AuthContext';
import { ThemeProvider } from './context/ThemeContext';
import { PlanProvider } from './context/PlanContext';
import { ErrorBoundary } from './components/common/ErrorBoundary';
import { Header } from './components/common/Header';
import { Footer } from './components/common/Footer';
import { FloatingContact } from './components/common/FloatingContact';
import { SearchModal } from './components/common/SearchModal';
import { ShareModal } from './components/common/ShareModal';
import { FavoritesDrawer } from './components/common/FavoritesDrawer';
import { CookieConsent } from './components/common/CookieConsent';
import { CostCalculatorModal } from './components/calculators/CostCalculatorModal';
import { AIChatbot } from './components/ai/AIChatbot';
import { GlobalAIAssistantWidget } from './components/ai/GlobalAIAssistantWidget';
import { GlobalSearchModal } from './components/common/GlobalSearchModal';
import { UserExperienceDashboard } from './components/common/UserExperienceDashboard';
import { UpgradeModal } from './components/common/UpgradeModal';
import { ProjectComparisonModal } from './components/common/ProjectComparisonModal';
import { ProjectComparisonBar } from './components/common/ProjectComparisonBar';

import { HomePage } from './pages/HomePage';
import { AboutPage } from './pages/AboutPage';
import { ServicesPage } from './pages/ServicesPage';
import { PortfolioPage } from './pages/PortfolioPage';
import { ProjectDetailPage } from './pages/ProjectDetailPage';
import { BlogPage } from './pages/BlogPage';
import { BlogPostPage } from './pages/BlogPostPage';
import { GalleryPage } from './pages/GalleryPage';
import { ContactPage } from './pages/ContactPage';
import { PrivacyTermsPage } from './pages/PrivacyTermsPage';
import { AdminPage } from './pages/AdminPage';
import { ConstructionIntelligencePage } from './pages/ConstructionIntelligencePage';
import { ClientPortalPage } from './pages/ClientPortalPage';
import { PricingPage } from './pages/PricingPage';
import { AIStudioPage } from './components/ai/AIStudioPage';

import { MarketplacePage } from './pages/MarketplacePage';
import { SellerDashboardPage } from './pages/SellerDashboardPage';
import { BuyerDashboardPage } from './pages/BuyerDashboardPage';
import { CommunityPage } from './pages/CommunityPage';
import { CoursePlatformPage } from './pages/CoursePlatformPage';
import { JobBoardPage } from './pages/JobBoardPage';
import { DirectoryPage } from './pages/DirectoryPage';

import { 
  Project, 
  Category, 
  Service, 
  BlogArticle, 
  Testimonial, 
  GalleryItem, 
  WebsiteSettings 
} from './types';
import { 
  getProjects, 
  getCategories, 
  getServices, 
  getBlogs, 
  getTestimonials, 
  getGalleryItems, 
  getWebsiteSettings, 
  seedDatabaseIfEmpty,
  subscribeProjects,
  subscribeCategories,
  subscribeServices,
  subscribeBlogs,
  subscribeTestimonials,
  subscribeWebsiteSettings
} from './services/db';

export default function App() {
  const [activePage, setActivePage] = useState<string>('home');
  const [selectedProjectId, setSelectedProjectId] = useState<string | null>(null);
  const [selectedBlogId, setSelectedBlogId] = useState<string | null>(null);

  // Modals state
  const [searchModalOpen, setSearchModalOpen] = useState<boolean>(false);
  const [favoritesDrawerOpen, setFavoritesDrawerOpen] = useState<boolean>(false);
  const [costCalculatorOpen, setCostCalculatorOpen] = useState<boolean>(false);
  const [aiChatOpen, setAiChatOpen] = useState<boolean>(false);
  const [shareProject, setShareProject] = useState<Project | null>(null);

  // Comparison State
  const [compareProjects, setCompareProjects] = useState<Project[]>([]);
  const [compareModalOpen, setCompareModalOpen] = useState<boolean>(false);

  // Favorites state
  const [favorites, setFavorites] = useState<Project[]>(() => {
    try {
      const saved = localStorage.getItem('fh_favorites');
      return saved ? JSON.parse(saved) : [];
    } catch (e) {
      return [];
    }
  });

  // DB State
  const [projects, setProjects] = useState<Project[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [services, setServices] = useState<Service[]>([]);
  const [blogs, setBlogs] = useState<BlogArticle[]>([]);
  const [testimonials, setTestimonials] = useState<Testimonial[]>([]);
  const [gallery, setGallery] = useState<GalleryItem[]>([]);
  const [settings, setSettings] = useState<WebsiteSettings>({
    heroTitle: 'Building the Future with Design, Creativity & AI',
    heroSubtitle: 'World-Class Digital Business Hub showcasing architectural engineering, luxury interiors, 3D BIM rendering, AI generative media, and bespoke web platforms.',
    heroTypingTexts: ['Architectural Design & Planning', '3D Rendering & Walkthroughs', 'AutoCAD & Revit BIM', 'AI Generative Production'],
    companyStory: 'Fiza Hayat was founded to bridge physical architectural craftsmanship, advanced BIM engineering, and cutting-edge generative AI technology.',
    mission: 'To deliver flawless design, engineering, and digital solutions.',
    vision: 'To set global benchmarks in architectural intelligence.',
    companyEmail: 'contact@fizahayat.com',
    companyPhone: '',
    whatsappNumber: '',
    whatsappGroupLink: 'https://chat.whatsapp.com/GsNwCBMQP5zJWbvocLdWg2',
    address: 'Executive Tower 4, Business Bay Dubai / Geneva',
    googleMapsEmbed: 'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3610.17851002432!2d55.2721877!3d25.1868882!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3e5f682def22a275%3A0x6b772b1684c3e395!2sBusiness%20Bay%20Dubai!5e0!3m2!1sen!2sae!4v1700000000000',
    statsProjects: 145,
    statsClients: 82,
    statsCountries: 24,
    statsYears: 10,
    socialLinks: {
      whatsappGroup: 'https://chat.whatsapp.com/GsNwCBMQP5zJWbvocLdWg2'
    }
  });

  useEffect(() => {
    // Seed DB if empty then establish real-time snapshot subscribers
    seedDatabaseIfEmpty();

    const unsubProjects = subscribeProjects(setProjects);
    const unsubCategories = subscribeCategories(setCategories);
    const unsubServices = subscribeServices(setServices);
    const unsubBlogs = subscribeBlogs(setBlogs);
    const unsubTestimonials = subscribeTestimonials(setTestimonials);
    const unsubSettings = subscribeWebsiteSettings(setSettings);

    getGalleryItems().then(setGallery);

    return () => {
      unsubProjects();
      unsubCategories();
      unsubServices();
      unsubBlogs();
      unsubTestimonials();
      unsubSettings();
    };
  }, []);

  useEffect(() => {
    localStorage.setItem('fh_favorites', JSON.stringify(favorites));
  }, [favorites]);

  const toggleFavorite = (project: Project) => {
    setFavorites(prev => {
      const exists = prev.some(p => p.id === project.id);
      if (exists) return prev.filter(p => p.id !== project.id);
      return [...prev, project];
    });
  };

  const isFavorite = (id: string) => favorites.some(p => p.id === id);

  // Comparison Handlers
  const handleToggleCompare = (project: Project) => {
    setCompareProjects(prev => {
      const exists = prev.some(p => p.id === project.id);
      if (exists) {
        return prev.filter(p => p.id !== project.id);
      }
      if (prev.length === 0) {
        return [project];
      }
      if (prev.length === 1) {
        const next = [prev[0], project];
        setCompareModalOpen(true);
        return next;
      }
      // If 2 already present, replace the second project with the newly selected one and open modal
      const next = [prev[0], project];
      setCompareModalOpen(true);
      return next;
    });
  };

  const isComparing = (id: string) => compareProjects.some(p => p.id === id);
  const handleRemoveCompare = (id: string) => setCompareProjects(prev => prev.filter(p => p.id !== id));
  const handleClearCompare = () => setCompareProjects([]);

  const handleSelectProject = (id: string) => {
    setSelectedProjectId(id);
    setActivePage('project-detail');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleSelectBlog = (id: string) => {
    setSelectedBlogId(id);
    setActivePage('blog-detail');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const activeProject = projects.find(p => p.id === selectedProjectId) || projects[0];
  const activeBlog = blogs.find(b => b.id === selectedBlogId) || blogs[0];

  return (
    <AuthProvider>
      <PlanProvider>
        <ThemeProvider>
          <div className="min-h-screen bg-[#0B1020] dark:bg-[#0B1020] light:bg-[#F8FAFC] text-neutral-100 dark:text-neutral-100 light:text-slate-900 font-sans selection:bg-violet-600 selection:text-white flex flex-col justify-between relative overflow-hidden transition-colors duration-300">
            
            {/* Ambient Glass Glow Orbs */}
            <div className="fixed top-0 left-1/4 -translate-x-1/2 w-[650px] h-[650px] bg-violet-600/15 rounded-full blur-[150px] pointer-events-none z-0"></div>
            <div className="fixed top-1/3 right-10 w-[550px] h-[550px] bg-indigo-600/20 rounded-full blur-[140px] pointer-events-none z-0"></div>
            <div className="fixed bottom-0 left-1/3 w-[750px] h-[550px] bg-blue-600/15 rounded-full blur-[160px] pointer-events-none z-0"></div>

            {/* Header Navigation */}
            <ErrorBoundary title="Header Error" description="The header navigation encountered an issue.">
              <Header
                activePage={activePage}
                setActivePage={(page) => {
                  setActivePage(page);
                  setSelectedProjectId(null);
                  setSelectedBlogId(null);
                }}
                onOpenSearch={() => setSearchModalOpen(true)}
                onOpenFavorites={() => setFavoritesDrawerOpen(true)}
                onOpenCalculator={() => setCostCalculatorOpen(true)}
                favoritesCount={favorites.length}
              />
            </ErrorBoundary>

            {/* Main Content Pages */}
            <main className="flex-1 relative z-10">
              <ErrorBoundary title="Page Render Error" description="This section failed to display properly. Try refreshing or switching pages.">
                {activePage === 'home' && (
                  <HomePage
                    settings={settings}
                    projects={projects}
                    services={services}
                    testimonials={testimonials}
                    categories={categories}
                    setActivePage={setActivePage}
                    onSelectProject={handleSelectProject}
                    onOpenCalculator={() => setCostCalculatorOpen(true)}
                    onToggleFavorite={toggleFavorite}
                    isFavorite={isFavorite}
                    onToggleCompare={handleToggleCompare}
                    isComparing={isComparing}
                  />
                )}

                {activePage === 'pricing' && (
                  <PricingPage onNavigate={setActivePage} />
                )}

                {activePage === 'ai-studio' && (
                  <AIStudioPage
                    projects={projects}
                    onNavigateToPricing={() => setActivePage('pricing')}
                  />
                )}

                {activePage === 'about' && (
                  <AboutPage settings={settings} setActivePage={setActivePage} />
                )}

                {activePage === 'marketplace' && (
                  <MarketplacePage
                    onNavigateToSeller={() => setActivePage('seller-dashboard')}
                    onNavigateToBuyer={() => setActivePage('buyer-dashboard')}
                  />
                )}

                {activePage === 'seller-dashboard' && (
                  <SellerDashboardPage />
                )}

                {activePage === 'buyer-dashboard' && (
                  <BuyerDashboardPage />
                )}

                {activePage === 'community' && (
                  <CommunityPage />
                )}

                {activePage === 'courses' && (
                  <CoursePlatformPage />
                )}

                {activePage === 'jobs' && (
                  <JobBoardPage />
                )}

                {activePage === 'directory' && (
                  <DirectoryPage />
                )}

                {activePage === 'client-portal' && (
                  <ClientPortalPage />
                )}

                {activePage === 'construction-intelligence' && (
                  <ConstructionIntelligencePage />
                )}

                {activePage === 'services' && (
                  <ServicesPage
                    services={services}
                    setActivePage={setActivePage}
                    onOpenCalculator={() => setCostCalculatorOpen(true)}
                  />
                )}

                {activePage === 'portfolio' && (
                  <PortfolioPage
                    projects={projects}
                    categories={categories}
                    onSelectProject={handleSelectProject}
                    onToggleFavorite={toggleFavorite}
                    isFavorite={isFavorite}
                    onToggleCompare={handleToggleCompare}
                    isComparing={isComparing}
                  />
                )}

                {activePage === 'project-detail' && activeProject && (
                  <ProjectDetailPage
                    project={activeProject}
                    relatedProjects={projects.filter(p => p.id !== activeProject.id)}
                    onBack={() => setActivePage('portfolio')}
                    onSelectProject={handleSelectProject}
                    onOpenShare={(p) => setShareProject(p)}
                    onToggleFavorite={toggleFavorite}
                    isFavorite={isFavorite}
                    onToggleCompare={handleToggleCompare}
                    isComparing={isComparing}
                  />
                )}

                {activePage === 'blog' && (
                  <BlogPage blogs={blogs} onSelectBlog={handleSelectBlog} />
                )}

                {activePage === 'blog-detail' && activeBlog && (
                  <BlogPostPage
                    blog={activeBlog}
                    onBack={() => setActivePage('blog')}
                    onSelectBlog={handleSelectBlog}
                  />
                )}

                {activePage === 'gallery' && (
                  <GalleryPage items={gallery} />
                )}

                {activePage === 'contact' && (
                  <ContactPage settings={settings} />
                )}

                {activePage === 'privacy' && (
                  <PrivacyTermsPage mode="privacy" />
                )}

                {activePage === 'terms' && (
                  <PrivacyTermsPage mode="terms" />
                )}

                {activePage === 'admin' && (
                  <AdminPage
                    projects={projects}
                    categories={categories}
                    services={services}
                    blogs={blogs}
                    settings={settings}
                    onDataChange={() => {}}
                  />
                )}
              </ErrorBoundary>
            </main>

          {/* Footer */}
          <Footer settings={settings} setActivePage={setActivePage} />

          {/* Floating Actions */}
          <FloatingContact
            settings={settings}
            onOpenCalculator={() => setCostCalculatorOpen(true)}
            onOpenAIChat={() => setAiChatOpen(true)}
          />

          {/* Global AI Assistant Floating Widget */}
          <ErrorBoundary title="AI Assistant Widget Error">
            <GlobalAIAssistantWidget activePage={activePage} />
          </ErrorBoundary>

          {/* Global Search Modal */}
          <GlobalSearchModal
            isOpen={searchModalOpen}
            onClose={() => setSearchModalOpen(false)}
            projects={projects}
            services={services}
            blogs={blogs}
            onSelectProject={handleSelectProject}
            onSelectService={() => setActivePage('services')}
            onSelectBlog={handleSelectBlog}
          />

          {/* Personal User Experience Dashboard */}
          <UserExperienceDashboard
            isOpen={favoritesDrawerOpen}
            onClose={() => setFavoritesDrawerOpen(false)}
            favorites={favorites}
            onRemoveFavorite={(id) => setFavorites(prev => prev.filter(p => p.id !== id))}
            onSelectProject={handleSelectProject}
          />

          {/* Cost Calculator Modal */}
          <CostCalculatorModal
            isOpen={costCalculatorOpen}
            onClose={() => setCostCalculatorOpen(false)}
          />

          {/* Fiza AI Assistant Chatbot */}
          <ErrorBoundary title="AI Chatbot Error">
            <AIChatbot
              isOpen={aiChatOpen}
              onClose={() => setAiChatOpen(false)}
              services={services}
              projects={projects}
            />
          </ErrorBoundary>

          {/* Share Modal */}
          <ShareModal
            project={shareProject}
            isOpen={!!shareProject}
            onClose={() => setShareProject(null)}
          />

          {/* Project Comparison Tray (Dock) */}
          <ProjectComparisonBar
            compareList={compareProjects}
            onRemoveProject={handleRemoveCompare}
            onClearAll={handleClearCompare}
            onOpenCompareModal={() => setCompareModalOpen(true)}
          />

          {/* Project Side-by-Side Comparison Modal */}
          <ProjectComparisonModal
            isOpen={compareModalOpen}
            onClose={() => setCompareModalOpen(false)}
            project1={compareProjects[0] || null}
            project2={compareProjects[1] || null}
            allProjects={projects}
            onSelectProject1={(p) => setCompareProjects(prev => [p, prev[1] || projects.find(proj => proj.id !== p.id)!])}
            onSelectProject2={(p) => setCompareProjects(prev => [prev[0] || projects[0], p])}
            onViewProjectDetails={handleSelectProject}
            onOpenCalculator={() => {
              setCompareModalOpen(false);
              setCostCalculatorOpen(true);
            }}
            onInquireProject={(p) => {
              setCompareModalOpen(false);
              setActivePage('contact');
            }}
          />

          {/* Cookie Banner */}
          <CookieConsent />

          {/* Upgrade Modal */}
          <UpgradeModal onNavigateToPricing={() => setActivePage('pricing')} />

        </div>
      </ThemeProvider>
    </PlanProvider>
  </AuthProvider>
  );
}
