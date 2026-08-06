export type ProductCategory = 
  | 'House Plans'
  | 'AutoCAD Drawings'
  | 'Revit Projects'
  | 'SketchUp Models'
  | '3D Models'
  | 'Interior Design Packages'
  | 'Exterior Design Packages'
  | 'Construction Templates'
  | 'Quantity Estimation Templates'
  | 'Project Documents'
  | 'Presentation Templates'
  | 'AI Prompt Packs'
  | 'Graphic Design Templates'
  | 'Motion Graphics Templates'
  | 'Video Editing Templates';

export type SupportedFileFormat = 
  | 'ZIP' 
  | 'PDF' 
  | 'DWG' 
  | 'RVT' 
  | 'SKP' 
  | 'OBJ' 
  | 'FBX' 
  | 'GLB' 
  | 'PNG' 
  | 'JPG' 
  | 'MP4';

export interface SellerStore {
  id: string;
  sellerUserId: string;
  sellerName: string;
  sellerAvatar: string;
  storeName: string;
  storeSlug: string;
  tagline: string;
  bio: string;
  storeLogo: string;
  storeBanner: string;
  verified: boolean;
  rating: number;
  reviewCount: number;
  followersCount: number;
  totalSales: number;
  revenue: number;
  location: string;
  websiteUrl?: string;
  createdAt: string;
}

export interface ProductReview {
  id: string;
  productId: string;
  buyerUserId: string;
  buyerName: string;
  buyerAvatar: string;
  rating: number;
  comment: string;
  createdAt: string;
  sellerResponse?: {
    comment: string;
    respondedAt: string;
  };
}

export interface DigitalProduct {
  id: string;
  title: string;
  slug: string;
  description: string;
  fullDetails?: string;
  category: ProductCategory;
  price: number;
  discountPrice?: number;
  fileFormats: SupportedFileFormat[];
  fileSize?: string;
  fileUrl: string; // Secure file download link
  previewImages: string[];
  previewVideoUrl?: string;
  sellerId: string;
  sellerName: string;
  sellerAvatar: string;
  storeId: string;
  storeName: string;
  storeVerified?: boolean;
  rating: number;
  reviewCount: number;
  salesCount: number;
  tags: string[];
  featured?: boolean;
  inventoryStatus: 'in_stock' | 'out_of_stock'; // Digital stock
  discountActive?: boolean;
  createdAt: string;
  updatedAt?: string;
}

export interface MarketplaceOrder {
  id: string;
  orderNumber: string;
  buyerUserId: string;
  buyerName: string;
  buyerEmail: string;
  items: {
    productId: string;
    productTitle: string;
    category: ProductCategory;
    price: number;
    fileUrl: string;
    fileFormats: SupportedFileFormat[];
    sellerId: string;
    sellerName: string;
    previewImage: string;
  }[];
  totalAmount: number;
  paymentMethod: string;
  paymentStatus: 'paid' | 'pending' | 'failed' | 'refunded';
  transactionId: string;
  invoiceUrl: string;
  refundRequested?: boolean;
  refundReason?: string;
  refundStatus?: 'none' | 'pending' | 'approved' | 'rejected';
  createdAt: string;
}

export interface CommunityPost {
  id: string;
  title: string;
  content: string;
  postType: 'question' | 'discussion';
  category: string;
  authorUserId: string;
  authorName: string;
  authorAvatar: string;
  authorRole: string;
  answers: CommunityAnswer[];
  likesCount: number;
  likedByUsers: string[];
  bookmarksCount: number;
  bookmarkedByUsers: string[];
  isReported: boolean;
  reportReason?: string;
  isResolved?: boolean;
  createdAt: string;
}

export interface CommunityAnswer {
  id: string;
  postId: string;
  authorUserId: string;
  authorName: string;
  authorAvatar: string;
  content: string;
  likesCount: number;
  likedByUsers: string[];
  isAccepted?: boolean;
  createdAt: string;
}

export interface CourseLesson {
  id: string;
  title: string;
  duration: string;
  type: 'video' | 'pdf_notes' | 'assignment' | 'quiz';
  videoUrl?: string;
  pdfUrl?: string;
  assignmentPrompt?: string;
  quizQuestions?: {
    question: string;
    options: string[];
    correctIndex: number;
  }[];
}

export interface Course {
  id: string;
  title: string;
  slug: string;
  description: string;
  category: string;
  level: 'Beginner' | 'Intermediate' | 'Advanced';
  coverImage: string;
  price: number;
  creatorId: string;
  creatorName: string;
  creatorAvatar: string;
  lessons: CourseLesson[];
  totalDuration: string;
  enrolledStudentsCount: number;
  rating: number;
  reviewCount: number;
  certificateProvided: boolean;
  createdAt: string;
}

export interface StudentCourseProgress {
  id: string;
  studentUserId: string;
  courseId: string;
  courseTitle: string;
  completedLessonIds: string[];
  quizScores: { [quizLessonId: string]: number };
  assignmentSubmissions?: { [assignmentLessonId: string]: string };
  isCompleted: boolean;
  certificateUrl?: string;
  completedAt?: string;
  updatedAt: string;
}

export interface JobListing {
  id: string;
  title: string;
  companyName: string;
  companyLogo: string;
  employerUserId: string;
  jobType: 'Freelance' | 'Full-time' | 'Internship' | 'Remote';
  category: string;
  location: string;
  salaryRange: string;
  description: string;
  requirements: string[];
  servicesRequested?: string[];
  applicantsCount: number;
  status: 'open' | 'closed';
  createdAt: string;
}

export interface JobApplication {
  id: string;
  jobId: string;
  jobTitle: string;
  companyName: string;
  applicantUserId: string;
  applicantName: string;
  applicantEmail: string;
  applicantPhone: string;
  portfolioUrl?: string;
  resumeUrl?: string;
  coverLetter: string;
  status: 'applied' | 'under_review' | 'shortlisted' | 'accepted' | 'rejected';
  createdAt: string;
}

export interface ProfessionalProfile {
  id: string;
  userId: string;
  name: string;
  avatar: string;
  title: string;
  profession: 
    | 'Architect'
    | 'Interior Designer'
    | 'Contractor'
    | 'Builder'
    | 'Engineer'
    | '3D Artist'
    | 'Graphic Designer'
    | 'Video Editor';
  location: string;
  experienceYears: number;
  rating: number;
  reviewCount: number;
  hourlyRate: string;
  verified: boolean;
  bio: string;
  services: string[];
  softwareSkills: string[];
  portfolioImages: string[];
  contactEmail: string;
  phone?: string;
  website?: string;
}
