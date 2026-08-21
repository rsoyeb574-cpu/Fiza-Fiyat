import { 
  collection, 
  getDocs, 
  getDoc, 
  doc, 
  setDoc, 
  addDoc, 
  updateDoc, 
  deleteDoc, 
  query, 
  orderBy, 
  limit, 
  where,
  onSnapshot
} from 'firebase/firestore';
import { db, auth } from '../lib/firebase';
import { 
  Project, 
  Category, 
  Service, 
  BlogArticle, 
  Testimonial, 
  GalleryItem, 
  WebsiteSettings, 
  Inquiry,
  TeamMember,
  MediaAsset
} from '../types';
import {
  ConstructionGuideItem,
  ConstructionPlotPlan,
  RegionalRate
} from '../types/construction';
import { 
  initialCategories, 
  initialProjects, 
  initialServices, 
  initialBlogs, 
  initialTestimonials, 
  initialGallery, 
  initialSettings,
  initialTeamMembers,
  initialMediaAssets
} from './seedData';
import {
  initialConstructionGuides,
  initialConstructionPlotPlans,
  initialRegionalRates
} from './constructionSeedData';

// Storage keys for offline or instant local cache fallback
const CACHE_KEYS = {
  PROJECTS: 'fh_cache_projects',
  CATEGORIES: 'fh_cache_categories',
  SERVICES: 'fh_cache_services',
  BLOGS: 'fh_cache_blogs',
  GALLERY: 'fh_cache_gallery',
  TESTIMONIALS: 'fh_cache_testimonials',
  TEAM: 'fh_cache_team',
  MEDIA: 'fh_cache_media',
  SETTINGS: 'fh_cache_settings',
  INQUIRIES: 'fh_cache_inquiries',
  CONSTRUCTION_GUIDES: 'fh_cache_construction_guides',
  CONSTRUCTION_PLANS: 'fh_cache_construction_plans',
  REGIONAL_RATES: 'fh_cache_regional_rates'
};

// Helper for local caching
function getLocalCache<T>(key: string): T | null {
  try {
    const data = localStorage.getItem(key);
    return data ? JSON.parse(data) : null;
  } catch (e) {
    return null;
  }
}

function setLocalCache<T>(key: string, value: T) {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch (e) {
    // Ignore cache errors
  }
}

const ADMIN_EMAILS = [
  'rsoyeb574@gmail.com',
  'admin@fizahayatresearch.com',
  'admin@fiza-hayat-buildcom.iam.gserviceaccount.com'
];

// Check and Seed Database if Empty
export async function seedDatabaseIfEmpty() {
  try {
    const currentUser = auth.currentUser;
    const isUserAdmin = Boolean(
      currentUser && 
      currentUser.email && 
      (ADMIN_EMAILS.includes(currentUser.email.toLowerCase()) || 
       currentUser.email.endsWith('@fizahayatresearch.com') ||
       currentUser.email.endsWith('@fiza-hayat-buildcom.iam.gserviceaccount.com'))
    );

    // If not admin, do not execute Firestore writes that require admin rules
    if (!isUserAdmin) {
      return;
    }

    const categoriesSnap = await getDocs(collection(db, 'categories'));
    if (categoriesSnap.empty) {
      console.log('Seeding initial categories...');
      for (const cat of initialCategories) {
        await setDoc(doc(db, 'categories', cat.id), cat);
      }
    }

    const projectsSnap = await getDocs(collection(db, 'projects'));
    if (projectsSnap.empty) {
      console.log('Seeding initial projects...');
      for (const proj of initialProjects) {
        await setDoc(doc(db, 'projects', proj.id), proj);
      }
    }

    const servicesSnap = await getDocs(collection(db, 'services'));
    if (servicesSnap.empty) {
      console.log('Seeding initial services...');
      for (const srv of initialServices) {
        await setDoc(doc(db, 'services', srv.id), srv);
      }
    }

    const blogsSnap = await getDocs(collection(db, 'blogs'));
    if (blogsSnap.empty) {
      console.log('Seeding initial blogs...');
      for (const blog of initialBlogs) {
        await setDoc(doc(db, 'blogs', blog.id), blog);
      }
    }

    const testimonialsSnap = await getDocs(collection(db, 'testimonials'));
    if (testimonialsSnap.empty) {
      console.log('Seeding initial testimonials...');
      for (const t of initialTestimonials) {
        await setDoc(doc(db, 'testimonials', t.id), t);
      }
    }

    const teamSnap = await getDocs(collection(db, 'team'));
    if (teamSnap.empty) {
      console.log('Seeding initial team...');
      for (const tm of initialTeamMembers) {
        await setDoc(doc(db, 'team', tm.id), tm);
      }
    }

    const mediaSnap = await getDocs(collection(db, 'media'));
    if (mediaSnap.empty) {
      console.log('Seeding initial media assets...');
      for (const ma of initialMediaAssets) {
        await setDoc(doc(db, 'media', ma.id), ma);
      }
    }

    const gallerySnap = await getDocs(collection(db, 'gallery'));
    if (gallerySnap.empty) {
      console.log('Seeding initial gallery...');
      for (const g of initialGallery) {
        await setDoc(doc(db, 'gallery', g.id), g);
      }
    }

    const settingsDoc = await getDoc(doc(db, 'settings', 'website'));
    if (!settingsDoc.exists()) {
      console.log('Seeding initial settings...');
      await setDoc(doc(db, 'settings', 'website'), initialSettings);
    }

    const guidesSnap = await getDocs(collection(db, 'construction_guides'));
    if (guidesSnap.empty) {
      console.log('Seeding initial construction guides...');
      for (const guide of initialConstructionGuides) {
        await setDoc(doc(db, 'construction_guides', guide.id), guide);
      }
    }

    const plansSnap = await getDocs(collection(db, 'construction_presets'));
    if (plansSnap.empty) {
      console.log('Seeding initial construction plot plans...');
      for (const plan of initialConstructionPlotPlans) {
        await setDoc(doc(db, 'construction_presets', plan.id), plan);
      }
    }

    const ratesSnap = await getDocs(collection(db, 'construction_rates'));
    if (ratesSnap.empty) {
      console.log('Seeding initial regional rates...');
      for (const rate of initialRegionalRates) {
        await setDoc(doc(db, 'construction_rates', rate.id), rate);
      }
    }

    console.log('Database seeding complete!');
  } catch (error) {
    console.warn('Seeding warning or network issue, using cached/initial data:', error);
  }
}

// ---------------- PROJECTS ----------------
export async function getProjects(): Promise<Project[]> {
  try {
    const q = query(collection(db, 'projects'), orderBy('createdAt', 'desc'));
    const snap = await getDocs(q);
    if (!snap.empty) {
      const projects = snap.docs.map(doc => ({ id: doc.id, ...doc.data() } as Project));
      setLocalCache(CACHE_KEYS.PROJECTS, projects);
      return projects;
    }
  } catch (err) {
    console.warn('Firestore fetch projects error, fallback to cache/initial:', err);
  }
  return getLocalCache<Project[]>(CACHE_KEYS.PROJECTS) || initialProjects;
}

export async function getProjectById(idOrSlug: string): Promise<Project | null> {
  const projects = await getProjects();
  return projects.find(p => p.id === idOrSlug || p.slug === idOrSlug) || null;
}

export async function saveProject(projectData: Partial<Project>): Promise<string> {
  const isUpdate = !!projectData.id;
  const id = projectData.id || `proj-${Date.now()}`;
  const now = new Date().toISOString();

  const fullData: Project = {
    id,
    title: projectData.title || 'Untitled Project',
    slug: projectData.slug || (projectData.title ? projectData.title.toLowerCase().replace(/[^a-z0-9]+/g, '-') : `project-${Date.now()}`),
    description: projectData.description || '',
    fullContent: projectData.fullContent || '',
    categoryId: projectData.categoryId || 'cat-arch',
    categoryName: projectData.categoryName || 'Architecture',
    images: projectData.images?.length ? projectData.images : ['https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&w=1200&q=80'],
    coverImage: projectData.coverImage || projectData.images?.[0] || 'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&w=1200&q=80',
    videoUrl: projectData.videoUrl || '',
    softwareUsed: projectData.softwareUsed || ['AutoCAD', '3ds Max'],
    tags: projectData.tags || ['Design', 'Architecture'],
    projectDate: projectData.projectDate || new Date().toISOString().split('T')[0],
    clientName: projectData.clientName || 'Private Client',
    location: projectData.location || '',
    downloads: projectData.downloads || [],
    gallery: projectData.gallery || [],
    beforeAfter: projectData.beforeAfter,
    featured: projectData.featured ?? false,
    views: projectData.views || 1,
    likes: projectData.likes || 0,
    createdAt: projectData.createdAt || now
  };

  try {
    await setDoc(doc(db, 'projects', id), fullData, { merge: true });
  } catch (err) {
    console.warn('Firestore save project failed, updating local cache:', err);
  }

  // Update local cache
  const cached = getLocalCache<Project[]>(CACHE_KEYS.PROJECTS) || initialProjects;
  const existingIdx = cached.findIndex(p => p.id === id);
  if (existingIdx >= 0) {
    cached[existingIdx] = fullData;
  } else {
    cached.unshift(fullData);
  }
  setLocalCache(CACHE_KEYS.PROJECTS, cached);

  return id;
}

export async function deleteProject(id: string): Promise<void> {
  try {
    await deleteDoc(doc(db, 'projects', id));
  } catch (e) {
    console.warn('Firestore delete project failed:', e);
  }
  const cached = getLocalCache<Project[]>(CACHE_KEYS.PROJECTS) || initialProjects;
  const filtered = cached.filter(p => p.id !== id);
  setLocalCache(CACHE_KEYS.PROJECTS, filtered);
}

// ---------------- CATEGORIES ----------------
export async function getCategories(): Promise<Category[]> {
  try {
    const q = query(collection(db, 'categories'), orderBy('order', 'asc'));
    const snap = await getDocs(q);
    if (!snap.empty) {
      const categories = snap.docs.map(doc => ({ id: doc.id, ...doc.data() } as Category));
      setLocalCache(CACHE_KEYS.CATEGORIES, categories);
      return categories;
    }
  } catch (err) {
    console.warn('Firestore fetch categories error, fallback to cache:', err);
  }
  return getLocalCache<Category[]>(CACHE_KEYS.CATEGORIES) || initialCategories;
}

export async function saveCategory(categoryData: Partial<Category>): Promise<string> {
  const id = categoryData.id || `cat-${Date.now()}`;
  const fullData: Category = {
    id,
    name: categoryData.name || 'New Category',
    slug: categoryData.slug || (categoryData.name ? categoryData.name.toLowerCase().replace(/[^a-z0-9]+/g, '-') : `cat-${Date.now()}`),
    description: categoryData.description || '',
    icon: categoryData.icon || 'Folder',
    order: categoryData.order || 99
  };

  try {
    await setDoc(doc(db, 'categories', id), fullData, { merge: true });
  } catch (e) {
    console.warn('Firestore save category error:', e);
  }

  const cached = getLocalCache<Category[]>(CACHE_KEYS.CATEGORIES) || initialCategories;
  const idx = cached.findIndex(c => c.id === id);
  if (idx >= 0) cached[idx] = fullData;
  else cached.push(fullData);
  setLocalCache(CACHE_KEYS.CATEGORIES, cached);

  return id;
}

export async function deleteCategory(id: string): Promise<void> {
  try {
    await deleteDoc(doc(db, 'categories', id));
  } catch (e) {}
  const cached = getLocalCache<Category[]>(CACHE_KEYS.CATEGORIES) || initialCategories;
  setLocalCache(CACHE_KEYS.CATEGORIES, cached.filter(c => c.id !== id));
}

// ---------------- SERVICES ----------------
export async function getServices(): Promise<Service[]> {
  try {
    const q = query(collection(db, 'services'), orderBy('order', 'asc'));
    const snap = await getDocs(q);
    if (!snap.empty) {
      const services = snap.docs.map(doc => ({ id: doc.id, ...doc.data() } as Service));
      setLocalCache(CACHE_KEYS.SERVICES, services);
      return services;
    }
  } catch (err) {
    console.warn('Firestore fetch services error:', err);
  }
  return getLocalCache<Service[]>(CACHE_KEYS.SERVICES) || initialServices;
}

export async function saveService(serviceData: Partial<Service>): Promise<string> {
  const id = serviceData.id || `srv-${Date.now()}`;
  const fullData: Service = {
    id,
    title: serviceData.title || 'New Service',
    slug: serviceData.slug || (serviceData.title ? serviceData.title.toLowerCase().replace(/[^a-z0-9]+/g, '-') : `service-${Date.now()}`),
    description: serviceData.description || '',
    icon: serviceData.icon || 'Sparkles',
    features: serviceData.features || [],
    category: serviceData.category || 'Architecture',
    order: serviceData.order || 99,
    featured: serviceData.featured ?? false
  };

  try {
    await setDoc(doc(db, 'services', id), fullData, { merge: true });
  } catch (e) {}

  const cached = getLocalCache<Service[]>(CACHE_KEYS.SERVICES) || initialServices;
  const idx = cached.findIndex(s => s.id === id);
  if (idx >= 0) cached[idx] = fullData;
  else cached.push(fullData);
  setLocalCache(CACHE_KEYS.SERVICES, cached);

  return id;
}

export async function deleteService(id: string): Promise<void> {
  try {
    await deleteDoc(doc(db, 'services', id));
  } catch (e) {}
  const cached = getLocalCache<Service[]>(CACHE_KEYS.SERVICES) || initialServices;
  setLocalCache(CACHE_KEYS.SERVICES, cached.filter(s => s.id !== id));
}

// ---------------- BLOGS ----------------
export async function getBlogs(): Promise<BlogArticle[]> {
  try {
    const q = query(collection(db, 'blogs'), orderBy('createdAt', 'desc'));
    const snap = await getDocs(q);
    if (!snap.empty) {
      const blogs = snap.docs.map(doc => ({ id: doc.id, ...doc.data() } as BlogArticle));
      setLocalCache(CACHE_KEYS.BLOGS, blogs);
      return blogs;
    }
  } catch (err) {
    console.warn('Firestore fetch blogs error:', err);
  }
  return getLocalCache<BlogArticle[]>(CACHE_KEYS.BLOGS) || initialBlogs;
}

export async function getBlogById(idOrSlug: string): Promise<BlogArticle | null> {
  const blogs = await getBlogs();
  return blogs.find(b => b.id === idOrSlug || b.slug === idOrSlug) || null;
}

export async function saveBlog(blogData: Partial<BlogArticle>): Promise<string> {
  const id = blogData.id || `blog-${Date.now()}`;
  const now = new Date().toISOString();
  const fullData: BlogArticle = {
    id,
    title: blogData.title || 'Untitled Article',
    slug: blogData.slug || (blogData.title ? blogData.title.toLowerCase().replace(/[^a-z0-9]+/g, '-') : `blog-${Date.now()}`),
    content: blogData.content || '',
    excerpt: blogData.excerpt || '',
    coverImage: blogData.coverImage || 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1200&q=80',
    category: blogData.category || 'Architecture',
    tags: blogData.tags || ['Design', 'AI'],
    author: blogData.author || 'Fiza Hayat Team',
    readTime: blogData.readTime || '4 min read',
    published: blogData.published ?? true,
    createdAt: blogData.createdAt || now
  };

  try {
    await setDoc(doc(db, 'blogs', id), fullData, { merge: true });
  } catch (e) {}

  const cached = getLocalCache<BlogArticle[]>(CACHE_KEYS.BLOGS) || initialBlogs;
  const idx = cached.findIndex(b => b.id === id);
  if (idx >= 0) cached[idx] = fullData;
  else cached.unshift(fullData);
  setLocalCache(CACHE_KEYS.BLOGS, cached);

  return id;
}

export async function deleteBlog(id: string): Promise<void> {
  try {
    await deleteDoc(doc(db, 'blogs', id));
  } catch (e) {}
  const cached = getLocalCache<BlogArticle[]>(CACHE_KEYS.BLOGS) || initialBlogs;
  setLocalCache(CACHE_KEYS.BLOGS, cached.filter(b => b.id !== id));
}

// ---------------- TESTIMONIALS ----------------
export async function getTestimonials(): Promise<Testimonial[]> {
  try {
    const snap = await getDocs(collection(db, 'testimonials'));
    if (!snap.empty) {
      const testimonials = snap.docs.map(doc => ({ id: doc.id, ...doc.data() } as Testimonial));
      setLocalCache(CACHE_KEYS.TESTIMONIALS, testimonials);
      return testimonials;
    }
  } catch (e) {}
  return getLocalCache<Testimonial[]>(CACHE_KEYS.TESTIMONIALS) || initialTestimonials;
}

export async function saveTestimonial(testData: Partial<Testimonial>): Promise<string> {
  const id = testData.id || `test-${Date.now()}`;
  const fullData: Testimonial = {
    id,
    name: testData.name || 'Client Reviewer',
    role: testData.role || 'Client',
    company: testData.company || '',
    avatar: testData.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=300&q=80',
    content: testData.content || '',
    rating: testData.rating || 5,
    location: testData.location || ''
  };

  try {
    await setDoc(doc(db, 'testimonials', id), fullData, { merge: true });
  } catch (e) {}

  const cached = getLocalCache<Testimonial[]>(CACHE_KEYS.TESTIMONIALS) || initialTestimonials;
  const idx = cached.findIndex(t => t.id === id);
  if (idx >= 0) cached[idx] = fullData;
  else cached.unshift(fullData);
  setLocalCache(CACHE_KEYS.TESTIMONIALS, cached);

  return id;
}

export async function deleteTestimonial(id: string): Promise<void> {
  try {
    await deleteDoc(doc(db, 'testimonials', id));
  } catch (e) {}
  const cached = getLocalCache<Testimonial[]>(CACHE_KEYS.TESTIMONIALS) || initialTestimonials;
  setLocalCache(CACHE_KEYS.TESTIMONIALS, cached.filter(t => t.id !== id));
}

// ---------------- TEAM MEMBERS ----------------
export async function getTeamMembers(): Promise<TeamMember[]> {
  try {
    const q = query(collection(db, 'team'), orderBy('order', 'asc'));
    const snap = await getDocs(q);
    if (!snap.empty) {
      const team = snap.docs.map(doc => ({ id: doc.id, ...doc.data() } as TeamMember));
      setLocalCache(CACHE_KEYS.TEAM, team);
      return team;
    }
  } catch (e) {}
  return getLocalCache<TeamMember[]>(CACHE_KEYS.TEAM) || initialTeamMembers;
}

export async function saveTeamMember(teamData: Partial<TeamMember>): Promise<string> {
  const id = teamData.id || `team-${Date.now()}`;
  const fullData: TeamMember = {
    id,
    name: teamData.name || 'Team Member',
    role: teamData.role || 'Design Specialist',
    bio: teamData.bio || '',
    avatar: teamData.avatar || 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=600&q=80',
    email: teamData.email || '',
    phone: teamData.phone || '',
    specialization: teamData.specialization || '',
    experienceYears: teamData.experienceYears || 5,
    order: teamData.order || 99
  };

  try {
    await setDoc(doc(db, 'team', id), fullData, { merge: true });
  } catch (e) {}

  const cached = getLocalCache<TeamMember[]>(CACHE_KEYS.TEAM) || initialTeamMembers;
  const idx = cached.findIndex(tm => tm.id === id);
  if (idx >= 0) cached[idx] = fullData;
  else cached.push(fullData);
  setLocalCache(CACHE_KEYS.TEAM, cached);

  return id;
}

export async function deleteTeamMember(id: string): Promise<void> {
  try {
    await deleteDoc(doc(db, 'team', id));
  } catch (e) {}
  const cached = getLocalCache<TeamMember[]>(CACHE_KEYS.TEAM) || initialTeamMembers;
  setLocalCache(CACHE_KEYS.TEAM, cached.filter(tm => tm.id !== id));
}

// ---------------- MEDIA ASSETS (IMAGES, VIDEOS, PDFS) ----------------
export async function getMediaAssets(): Promise<MediaAsset[]> {
  try {
    const q = query(collection(db, 'media'), orderBy('createdAt', 'desc'));
    const snap = await getDocs(q);
    if (!snap.empty) {
      const media = snap.docs.map(doc => ({ id: doc.id, ...doc.data() } as MediaAsset));
      setLocalCache(CACHE_KEYS.MEDIA, media);
      return media;
    }
  } catch (e) {}
  return getLocalCache<MediaAsset[]>(CACHE_KEYS.MEDIA) || initialMediaAssets;
}

export async function saveMediaAsset(mediaData: Partial<MediaAsset>): Promise<string> {
  const id = mediaData.id || `media-${Date.now()}`;
  const now = new Date().toISOString();
  const fullData: MediaAsset = {
    id,
    title: mediaData.title || 'Untitled Asset',
    type: mediaData.type || 'image',
    url: mediaData.url || '',
    thumbnailUrl: mediaData.thumbnailUrl || mediaData.url || '',
    fileSize: mediaData.fileSize || '1.2 MB',
    category: mediaData.category || 'General',
    projectId: mediaData.projectId || '',
    description: mediaData.description || '',
    createdAt: mediaData.createdAt || now
  };

  try {
    await setDoc(doc(db, 'media', id), fullData, { merge: true });
  } catch (e) {}

  const cached = getLocalCache<MediaAsset[]>(CACHE_KEYS.MEDIA) || initialMediaAssets;
  const idx = cached.findIndex(m => m.id === id);
  if (idx >= 0) cached[idx] = fullData;
  else cached.unshift(fullData);
  setLocalCache(CACHE_KEYS.MEDIA, cached);

  return id;
}

export async function deleteMediaAsset(id: string): Promise<void> {
  try {
    await deleteDoc(doc(db, 'media', id));
  } catch (e) {}
  const cached = getLocalCache<MediaAsset[]>(CACHE_KEYS.MEDIA) || initialMediaAssets;
  setLocalCache(CACHE_KEYS.MEDIA, cached.filter(m => m.id !== id));
}

// ---------------- GALLERY ----------------
export async function getGalleryItems(): Promise<GalleryItem[]> {
  try {
    const snap = await getDocs(collection(db, 'gallery'));
    if (!snap.empty) {
      const gallery = snap.docs.map(doc => ({ id: doc.id, ...doc.data() } as GalleryItem));
      setLocalCache(CACHE_KEYS.GALLERY, gallery);
      return gallery;
    }
  } catch (e) {}
  return getLocalCache<GalleryItem[]>(CACHE_KEYS.GALLERY) || initialGallery;
}

// ---------------- WEBSITE SETTINGS ----------------
export async function getWebsiteSettings(): Promise<WebsiteSettings> {
  try {
    const snap = await getDoc(doc(db, 'settings', 'website'));
    if (snap.exists()) {
      const settings = snap.data() as WebsiteSettings;
      setLocalCache(CACHE_KEYS.SETTINGS, settings);
      return settings;
    }
  } catch (e) {}
  return getLocalCache<WebsiteSettings>(CACHE_KEYS.SETTINGS) || initialSettings;
}

export async function saveWebsiteSettings(settings: WebsiteSettings): Promise<void> {
  try {
    await setDoc(doc(db, 'settings', 'website'), settings, { merge: true });
  } catch (e) {}
  setLocalCache(CACHE_KEYS.SETTINGS, settings);
}

// ---------------- INQUIRIES ----------------
export async function sendInquiry(inquiry: Omit<Inquiry, 'id' | 'createdAt'>): Promise<string> {
  const id = `inq-${Date.now()}`;
  const now = new Date().toISOString();
  const fullInquiry: Inquiry = {
    ...inquiry,
    id,
    status: 'new',
    createdAt: now
  };

  try {
    await setDoc(doc(db, 'inquiries', id), fullInquiry);
  } catch (e) {}

  const cached = getLocalCache<Inquiry[]>(CACHE_KEYS.INQUIRIES) || [];
  cached.unshift(fullInquiry);
  setLocalCache(CACHE_KEYS.INQUIRIES, cached);

  return id;
}

export async function getInquiries(): Promise<Inquiry[]> {
  try {
    const snap = await getDocs(collection(db, 'inquiries'));
    if (!snap.empty) {
      const inquiries = snap.docs.map(doc => ({ id: doc.id, ...doc.data() } as Inquiry));
      setLocalCache(CACHE_KEYS.INQUIRIES, inquiries);
      return inquiries;
    }
  } catch (e) {}
  return getLocalCache<Inquiry[]>(CACHE_KEYS.INQUIRIES) || [];
}

export async function deleteInquiry(id: string): Promise<void> {
  try {
    await deleteDoc(doc(db, 'inquiries', id));
  } catch (e) {}
  const cached = getLocalCache<Inquiry[]>(CACHE_KEYS.INQUIRIES) || [];
  setLocalCache(CACHE_KEYS.INQUIRIES, cached.filter(i => i.id !== id));
}

// =========================================
// REAL-TIME FIRESTORE SUBSCRIPTIONS
// =========================================

export function subscribeProjects(callback: (projects: Project[]) => void) {
  try {
    const q = query(collection(db, 'projects'), orderBy('createdAt', 'desc'));
    return onSnapshot(q, (snapshot) => {
      const items = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Project));
      setLocalCache(CACHE_KEYS.PROJECTS, items);
      callback(items);
    }, (error) => {
      console.warn('Projects onSnapshot error:', error);
      callback(getLocalCache<Project[]>(CACHE_KEYS.PROJECTS) || initialProjects);
    });
  } catch (e) {
    callback(getLocalCache<Project[]>(CACHE_KEYS.PROJECTS) || initialProjects);
    return () => {};
  }
}

export function subscribeCategories(callback: (categories: Category[]) => void) {
  try {
    const q = query(collection(db, 'categories'), orderBy('order', 'asc'));
    return onSnapshot(q, (snapshot) => {
      const items = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Category));
      setLocalCache(CACHE_KEYS.CATEGORIES, items);
      callback(items);
    }, (error) => {
      console.warn('Categories onSnapshot error:', error);
      callback(getLocalCache<Category[]>(CACHE_KEYS.CATEGORIES) || initialCategories);
    });
  } catch (e) {
    callback(getLocalCache<Category[]>(CACHE_KEYS.CATEGORIES) || initialCategories);
    return () => {};
  }
}

export function subscribeServices(callback: (services: Service[]) => void) {
  try {
    const q = query(collection(db, 'services'), orderBy('order', 'asc'));
    return onSnapshot(q, (snapshot) => {
      const items = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Service));
      setLocalCache(CACHE_KEYS.SERVICES, items);
      callback(items);
    }, (error) => {
      console.warn('Services onSnapshot error:', error);
      callback(getLocalCache<Service[]>(CACHE_KEYS.SERVICES) || initialServices);
    });
  } catch (e) {
    callback(getLocalCache<Service[]>(CACHE_KEYS.SERVICES) || initialServices);
    return () => {};
  }
}

export function subscribeBlogs(callback: (blogs: BlogArticle[]) => void) {
  try {
    const q = query(collection(db, 'blogs'), orderBy('createdAt', 'desc'));
    return onSnapshot(q, (snapshot) => {
      const items = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as BlogArticle));
      setLocalCache(CACHE_KEYS.BLOGS, items);
      callback(items);
    }, (error) => {
      console.warn('Blogs onSnapshot error:', error);
      callback(getLocalCache<BlogArticle[]>(CACHE_KEYS.BLOGS) || initialBlogs);
    });
  } catch (e) {
    callback(getLocalCache<BlogArticle[]>(CACHE_KEYS.BLOGS) || initialBlogs);
    return () => {};
  }
}

export function subscribeTestimonials(callback: (testimonials: Testimonial[]) => void) {
  try {
    return onSnapshot(collection(db, 'testimonials'), (snapshot) => {
      const items = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Testimonial));
      setLocalCache(CACHE_KEYS.TESTIMONIALS, items);
      callback(items);
    }, (error) => {
      callback(getLocalCache<Testimonial[]>(CACHE_KEYS.TESTIMONIALS) || initialTestimonials);
    });
  } catch (e) {
    callback(getLocalCache<Testimonial[]>(CACHE_KEYS.TESTIMONIALS) || initialTestimonials);
    return () => {};
  }
}

export function subscribeTeamMembers(callback: (team: TeamMember[]) => void) {
  try {
    const q = query(collection(db, 'team'), orderBy('order', 'asc'));
    return onSnapshot(q, (snapshot) => {
      const items = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as TeamMember));
      setLocalCache(CACHE_KEYS.TEAM, items);
      callback(items);
    }, (error) => {
      callback(getLocalCache<TeamMember[]>(CACHE_KEYS.TEAM) || initialTeamMembers);
    });
  } catch (e) {
    callback(getLocalCache<TeamMember[]>(CACHE_KEYS.TEAM) || initialTeamMembers);
    return () => {};
  }
}

export function subscribeMediaAssets(callback: (assets: MediaAsset[]) => void) {
  try {
    const q = query(collection(db, 'media'), orderBy('createdAt', 'desc'));
    return onSnapshot(q, (snapshot) => {
      const items = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as MediaAsset));
      setLocalCache(CACHE_KEYS.MEDIA, items);
      callback(items);
    }, (error) => {
      callback(getLocalCache<MediaAsset[]>(CACHE_KEYS.MEDIA) || initialMediaAssets);
    });
  } catch (e) {
    callback(getLocalCache<MediaAsset[]>(CACHE_KEYS.MEDIA) || initialMediaAssets);
    return () => {};
  }
}

export function subscribeWebsiteSettings(callback: (settings: WebsiteSettings) => void) {
  try {
    return onSnapshot(doc(db, 'settings', 'website'), (snapshot) => {
      if (snapshot.exists()) {
        const settings = snapshot.data() as WebsiteSettings;
        setLocalCache(CACHE_KEYS.SETTINGS, settings);
        callback(settings);
      }
    }, (error) => {
      callback(getLocalCache<WebsiteSettings>(CACHE_KEYS.SETTINGS) || initialSettings);
    });
  } catch (e) {
    callback(getLocalCache<WebsiteSettings>(CACHE_KEYS.SETTINGS) || initialSettings);
    return () => {};
  }
}

export function subscribeInquiries(callback: (inquiries: Inquiry[]) => void) {
  try {
    const q = query(collection(db, 'inquiries'), orderBy('createdAt', 'desc'));
    return onSnapshot(q, (snapshot) => {
      const items = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Inquiry));
      setLocalCache(CACHE_KEYS.INQUIRIES, items);
      callback(items);
    }, (error) => {
      callback(getLocalCache<Inquiry[]>(CACHE_KEYS.INQUIRIES) || []);
    });
  } catch (e) {
    callback(getLocalCache<Inquiry[]>(CACHE_KEYS.INQUIRIES) || []);
    return () => {};
  }
}

// =========================================
// CONSTRUCTION INTELLIGENCE DATA SERVICES
// =========================================

export async function getConstructionGuides(): Promise<ConstructionGuideItem[]> {
  try {
    const snap = await getDocs(collection(db, 'construction_guides'));
    if (!snap.empty) {
      const guides = snap.docs.map(doc => ({ id: doc.id, ...doc.data() } as ConstructionGuideItem));
      setLocalCache(CACHE_KEYS.CONSTRUCTION_GUIDES, guides);
      return guides;
    }
  } catch (e) {
    console.warn('Error fetching construction guides from Firestore, fallback to cache/seed:', e);
  }
  const cached = getLocalCache<ConstructionGuideItem[]>(CACHE_KEYS.CONSTRUCTION_GUIDES);
  return cached && cached.length > 0 ? cached : initialConstructionGuides;
}

export async function saveConstructionGuide(guide: ConstructionGuideItem): Promise<void> {
  try {
    await setDoc(doc(db, 'construction_guides', guide.id), guide);
  } catch (e) {
    console.error('Error saving construction guide to Firestore:', e);
  }
  const current = await getConstructionGuides();
  const idx = current.findIndex(g => g.id === guide.id);
  if (idx >= 0) {
    current[idx] = guide;
  } else {
    current.push(guide);
  }
  setLocalCache(CACHE_KEYS.CONSTRUCTION_GUIDES, current);
}

export async function getConstructionPlotPlans(): Promise<ConstructionPlotPlan[]> {
  try {
    const snap = await getDocs(collection(db, 'construction_presets'));
    if (!snap.empty) {
      const plans = snap.docs.map(doc => ({ id: doc.id, ...doc.data() } as ConstructionPlotPlan));
      setLocalCache(CACHE_KEYS.CONSTRUCTION_PLANS, plans);
      return plans;
    }
  } catch (e) {
    console.warn('Error fetching construction plans from Firestore, fallback to cache/seed:', e);
  }
  const cached = getLocalCache<ConstructionPlotPlan[]>(CACHE_KEYS.CONSTRUCTION_PLANS);
  return cached && cached.length > 0 ? cached : initialConstructionPlotPlans;
}

export async function saveConstructionPlotPlan(plan: ConstructionPlotPlan): Promise<void> {
  try {
    await setDoc(doc(db, 'construction_presets', plan.id), plan);
  } catch (e) {
    console.error('Error saving construction plan to Firestore:', e);
  }
  const current = await getConstructionPlotPlans();
  const idx = current.findIndex(p => p.id === plan.id);
  if (idx >= 0) {
    current[idx] = plan;
  } else {
    current.push(plan);
  }
  setLocalCache(CACHE_KEYS.CONSTRUCTION_PLANS, current);
}

export async function getRegionalRates(): Promise<RegionalRate[]> {
  try {
    const snap = await getDocs(collection(db, 'construction_rates'));
    if (!snap.empty) {
      const rates = snap.docs.map(doc => ({ id: doc.id, ...doc.data() } as RegionalRate));
      setLocalCache(CACHE_KEYS.REGIONAL_RATES, rates);
      return rates;
    }
  } catch (e) {
    console.warn('Error fetching regional rates from Firestore, fallback to cache/seed:', e);
  }
  const cached = getLocalCache<RegionalRate[]>(CACHE_KEYS.REGIONAL_RATES);
  return cached && cached.length > 0 ? cached : initialRegionalRates;
}

export async function saveRegionalRate(rate: RegionalRate): Promise<void> {
  try {
    await setDoc(doc(db, 'construction_rates', rate.id), rate);
  } catch (e) {
    console.error('Error saving regional rate to Firestore:', e);
  }
  const current = await getRegionalRates();
  const idx = current.findIndex(r => r.id === rate.id);
  if (idx >= 0) {
    current[idx] = rate;
  } else {
    current.push(rate);
  }
  setLocalCache(CACHE_KEYS.REGIONAL_RATES, current);
}
