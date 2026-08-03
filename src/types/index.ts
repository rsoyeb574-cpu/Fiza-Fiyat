export interface Project {
  id: string;
  title: string;
  slug: string;
  description: string;
  fullContent?: string;
  categoryId: string;
  categoryName: string;
  images: string[];
  coverImage: string;
  videoUrl?: string;
  softwareUsed: string[];
  tags: string[];
  projectDate: string;
  clientName: string;
  location?: string;
  downloads?: { label: string; url: string; size?: string }[];
  gallery?: string[];
  beforeAfter?: {
    before: string;
    after: string;
    labelBefore?: string;
    labelAfter?: string;
  };
  featured?: boolean;
  views?: number;
  likes?: number;
  createdAt: string;
}

export interface Category {
  id: string;
  name: string;
  slug: string;
  description: string;
  icon: string;
  order: number;
}

export interface Service {
  id: string;
  title: string;
  slug: string;
  description: string;
  icon: string;
  features: string[];
  category: string;
  order: number;
  featured?: boolean;
}

export interface BlogArticle {
  id: string;
  title: string;
  slug: string;
  content: string;
  excerpt: string;
  coverImage: string;
  category: string;
  tags: string[];
  author: string;
  readTime: string;
  published: boolean;
  createdAt: string;
}

export interface GalleryItem {
  id: string;
  title: string;
  type: 'image' | 'video' | '3d' | 'animation';
  url: string;
  thumbnailUrl: string;
  category: string;
  createdAt: string;
}

export interface Testimonial {
  id: string;
  name: string;
  role: string;
  company: string;
  avatar: string;
  content: string;
  rating: number;
  location?: string;
}

export interface Inquiry {
  id?: string;
  name: string;
  email: string;
  phone?: string;
  service: string;
  message: string;
  budget?: string;
  status?: 'new' | 'in_progress' | 'completed';
  createdAt: string;
}

export interface WebsiteSettings {
  id?: string;
  heroTitle: string;
  heroSubtitle: string;
  heroTypingTexts: string[];
  companyStory: string;
  mission: string;
  vision: string;
  companyEmail: string;
  companyPhone: string;
  whatsappNumber: string;
  address: string;
  googleMapsEmbed: string;
  statsProjects: number;
  statsClients: number;
  statsCountries: number;
  statsYears: number;
  socialLinks: {
    instagram?: string;
    linkedin?: string;
    youtube?: string;
    behance?: string;
    facebook?: string;
    github?: string;
  };
}
