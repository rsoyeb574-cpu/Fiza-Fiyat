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
  where
} from 'firebase/firestore';
import { db } from '../lib/firebase';
import {
  DigitalProduct,
  SellerStore,
  MarketplaceOrder,
  ProductReview,
  CommunityPost,
  CommunityAnswer,
  Course,
  StudentCourseProgress,
  JobListing,
  JobApplication,
  ProfessionalProfile
} from '../types/marketplace';
import {
  initialSellerStores,
  initialDigitalProducts,
  initialMarketplaceOrders,
  initialCommunityPosts,
  initialCourses,
  initialJobListings,
  initialProfessionalProfiles
} from './marketplaceSeedData';

// Storage keys for instant offline fallback / local cache
const MP_CACHE_KEYS = {
  PRODUCTS: 'fh_cache_mp_products',
  STORES: 'fh_cache_mp_stores',
  ORDERS: 'fh_cache_mp_orders',
  REVIEWS: 'fh_cache_mp_reviews',
  COMMUNITY: 'fh_cache_mp_community',
  COURSES: 'fh_cache_mp_courses',
  PROGRESS: 'fh_cache_mp_progress',
  JOBS: 'fh_cache_mp_jobs',
  APPLICATIONS: 'fh_cache_mp_applications',
  DIRECTORY: 'fh_cache_mp_directory',
  WISHLIST: 'fh_cache_mp_wishlist',
  FOLLOWERS: 'fh_cache_mp_followers'
};

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

// Seed Firebase Firestore if collections are empty
export async function seedMarketplaceDatabaseIfEmpty() {
  try {
    const productsSnap = await getDocs(collection(db, 'digital_products'));
    if (productsSnap.empty) {
      console.log('Seeding initial digital products to Firestore...');
      for (const prod of initialDigitalProducts) {
        await setDoc(doc(db, 'digital_products', prod.id), prod);
      }
    }

    const storesSnap = await getDocs(collection(db, 'seller_stores'));
    if (storesSnap.empty) {
      console.log('Seeding initial seller stores to Firestore...');
      for (const st of initialSellerStores) {
        await setDoc(doc(db, 'seller_stores', st.id), st);
      }
    }

    const ordersSnap = await getDocs(collection(db, 'marketplace_orders'));
    if (ordersSnap.empty) {
      console.log('Seeding initial marketplace orders to Firestore...');
      for (const ord of initialMarketplaceOrders) {
        await setDoc(doc(db, 'marketplace_orders', ord.id), ord);
      }
    }

    const postsSnap = await getDocs(collection(db, 'community_posts'));
    if (postsSnap.empty) {
      console.log('Seeding initial community posts to Firestore...');
      for (const post of initialCommunityPosts) {
        await setDoc(doc(db, 'community_posts', post.id), post);
      }
    }

    const coursesSnap = await getDocs(collection(db, 'courses'));
    if (coursesSnap.empty) {
      console.log('Seeding initial courses to Firestore...');
      for (const crs of initialCourses) {
        await setDoc(doc(db, 'courses', crs.id), crs);
      }
    }

    const jobsSnap = await getDocs(collection(db, 'job_listings'));
    if (jobsSnap.empty) {
      console.log('Seeding initial job listings to Firestore...');
      for (const job of initialJobListings) {
        await setDoc(doc(db, 'job_listings', job.id), job);
      }
    }

    const directorySnap = await getDocs(collection(db, 'professional_directory'));
    if (directorySnap.empty) {
      console.log('Seeding initial professional directory to Firestore...');
      for (const prof of initialProfessionalProfiles) {
        await setDoc(doc(db, 'professional_directory', prof.id), prof);
      }
    }

    console.log('Marketplace Firestore seeding complete!');
  } catch (err) {
    console.warn('Marketplace seeding warning / offline fallback:', err);
  }
}

// =========================================
// DIGITAL PRODUCTS SERVICES
// =========================================
export async function getDigitalProducts(): Promise<DigitalProduct[]> {
  try {
    const q = query(collection(db, 'digital_products'), orderBy('createdAt', 'desc'));
    const snap = await getDocs(q);
    if (!snap.empty) {
      const items = snap.docs.map(doc => ({ id: doc.id, ...doc.data() } as DigitalProduct));
      setLocalCache(MP_CACHE_KEYS.PRODUCTS, items);
      return items;
    }
  } catch (e) {
    console.warn('Firestore fetch digital products error:', e);
  }
  return getLocalCache<DigitalProduct[]>(MP_CACHE_KEYS.PRODUCTS) || initialDigitalProducts;
}

export async function saveDigitalProduct(productData: Partial<DigitalProduct>): Promise<string> {
  const id = productData.id || `prod-${Date.now()}`;
  const now = new Date().toISOString();

  const fullData: DigitalProduct = {
    id,
    title: productData.title || 'New Digital Asset',
    slug: productData.slug || (productData.title ? productData.title.toLowerCase().replace(/[^a-z0-9]+/g, '-') : `prod-${Date.now()}`),
    description: productData.description || '',
    fullDetails: productData.fullDetails || '',
    category: productData.category || 'House Plans',
    price: Number(productData.price) || 0,
    discountPrice: productData.discountPrice ? Number(productData.discountPrice) : undefined,
    fileFormats: productData.fileFormats?.length ? productData.fileFormats : ['ZIP'],
    fileSize: productData.fileSize || '25 MB',
    fileUrl: productData.fileUrl || 'https://example.com/downloads/digital-file.zip',
    previewImages: productData.previewImages?.length ? productData.previewImages : ['https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&w=1200&q=80'],
    previewVideoUrl: productData.previewVideoUrl || '',
    sellerId: productData.sellerId || 'seller-current',
    sellerName: productData.sellerName || 'Verified Seller',
    sellerAvatar: productData.sellerAvatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=300&q=80',
    storeId: productData.storeId || 'store-current',
    storeName: productData.storeName || 'Digital Design Store',
    storeVerified: productData.storeVerified ?? true,
    rating: productData.rating || 5.0,
    reviewCount: productData.reviewCount || 0,
    salesCount: productData.salesCount || 0,
    tags: productData.tags || ['Digital Asset', 'Design'],
    featured: productData.featured ?? false,
    inventoryStatus: productData.inventoryStatus || 'in_stock',
    discountActive: productData.discountActive ?? false,
    createdAt: productData.createdAt || now,
    updatedAt: now
  };

  try {
    await setDoc(doc(db, 'digital_products', id), fullData, { merge: true });
  } catch (err) {
    console.warn('Firestore save product error:', err);
  }

  const cached = getLocalCache<DigitalProduct[]>(MP_CACHE_KEYS.PRODUCTS) || initialDigitalProducts;
  const idx = cached.findIndex(p => p.id === id);
  if (idx >= 0) cached[idx] = fullData;
  else cached.unshift(fullData);
  setLocalCache(MP_CACHE_KEYS.PRODUCTS, cached);

  return id;
}

export async function deleteDigitalProduct(id: string): Promise<void> {
  try {
    await deleteDoc(doc(db, 'digital_products', id));
  } catch (e) {}
  const cached = getLocalCache<DigitalProduct[]>(MP_CACHE_KEYS.PRODUCTS) || initialDigitalProducts;
  setLocalCache(MP_CACHE_KEYS.PRODUCTS, cached.filter(p => p.id !== id));
}

// =========================================
// SELLER STORES
// =========================================
export async function getSellerStores(): Promise<SellerStore[]> {
  try {
    const snap = await getDocs(collection(db, 'seller_stores'));
    if (!snap.empty) {
      const stores = snap.docs.map(doc => ({ id: doc.id, ...doc.data() } as SellerStore));
      setLocalCache(MP_CACHE_KEYS.STORES, stores);
      return stores;
    }
  } catch (e) {}
  return getLocalCache<SellerStore[]>(MP_CACHE_KEYS.STORES) || initialSellerStores;
}

export async function saveSellerStore(storeData: Partial<SellerStore>): Promise<string> {
  const id = storeData.id || `store-${Date.now()}`;
  const now = new Date().toISOString();

  const fullStore: SellerStore = {
    id,
    sellerUserId: storeData.sellerUserId || 'user-current',
    sellerName: storeData.sellerName || 'Store Owner',
    sellerAvatar: storeData.sellerAvatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=300&q=80',
    storeName: storeData.storeName || 'My Digital Studio',
    storeSlug: storeData.storeSlug || (storeData.storeName ? storeData.storeName.toLowerCase().replace(/[^a-z0-9]+/g, '-') : `store-${Date.now()}`),
    tagline: storeData.tagline || 'High quality architectural & CAD digital assets',
    bio: storeData.bio || 'Creating digital design products for professionals.',
    storeLogo: storeData.storeLogo || 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=300&q=80',
    storeBanner: storeData.storeBanner || 'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&w=1200&q=80',
    verified: storeData.verified ?? true,
    rating: storeData.rating || 5.0,
    reviewCount: storeData.reviewCount || 0,
    followersCount: storeData.followersCount || 1,
    totalSales: storeData.totalSales || 0,
    revenue: storeData.revenue || 0,
    location: storeData.location || 'Global',
    websiteUrl: storeData.websiteUrl || '',
    createdAt: storeData.createdAt || now
  };

  try {
    await setDoc(doc(db, 'seller_stores', id), fullStore, { merge: true });
  } catch (e) {}

  const cached = getLocalCache<SellerStore[]>(MP_CACHE_KEYS.STORES) || initialSellerStores;
  const idx = cached.findIndex(s => s.id === id);
  if (idx >= 0) cached[idx] = fullStore;
  else cached.push(fullStore);
  setLocalCache(MP_CACHE_KEYS.STORES, cached);

  return id;
}

// =========================================
// ORDERS & BUYER DOWNLOADS
// =========================================
export async function getMarketplaceOrders(): Promise<MarketplaceOrder[]> {
  try {
    const q = query(collection(db, 'marketplace_orders'), orderBy('createdAt', 'desc'));
    const snap = await getDocs(q);
    if (!snap.empty) {
      const orders = snap.docs.map(doc => ({ id: doc.id, ...doc.data() } as MarketplaceOrder));
      setLocalCache(MP_CACHE_KEYS.ORDERS, orders);
      return orders;
    }
  } catch (e) {}
  return getLocalCache<MarketplaceOrder[]>(MP_CACHE_KEYS.ORDERS) || initialMarketplaceOrders;
}

export async function createMarketplaceOrder(orderData: Partial<MarketplaceOrder>): Promise<MarketplaceOrder> {
  const id = `ord-${Date.now()}`;
  const now = new Date().toISOString();
  const orderNumber = `FH-ORD-${Math.floor(100000 + Math.random() * 900000)}`;

  const fullOrder: MarketplaceOrder = {
    id,
    orderNumber,
    buyerUserId: orderData.buyerUserId || 'buyer-demo',
    buyerName: orderData.buyerName || 'Alex Mercer',
    buyerEmail: orderData.buyerEmail || 'alex.mercer@example.com',
    items: orderData.items || [],
    totalAmount: orderData.totalAmount || 0,
    paymentMethod: orderData.paymentMethod || 'Credit Card / Stripe',
    paymentStatus: 'paid',
    transactionId: `txn_${Date.now()}`,
    invoiceUrl: `#invoice-${id}`,
    refundRequested: false,
    refundStatus: 'none',
    createdAt: now
  };

  try {
    await setDoc(doc(db, 'marketplace_orders', id), fullOrder);
  } catch (e) {}

  const cached = getLocalCache<MarketplaceOrder[]>(MP_CACHE_KEYS.ORDERS) || initialMarketplaceOrders;
  cached.unshift(fullOrder);
  setLocalCache(MP_CACHE_KEYS.ORDERS, cached);

  return fullOrder;
}

export async function requestOrderRefund(orderId: string, reason: string): Promise<void> {
  try {
    await updateDoc(doc(db, 'marketplace_orders', orderId), {
      refundRequested: true,
      refundReason: reason,
      refundStatus: 'pending'
    });
  } catch (e) {}

  const cached = getLocalCache<MarketplaceOrder[]>(MP_CACHE_KEYS.ORDERS) || initialMarketplaceOrders;
  const idx = cached.findIndex(o => o.id === orderId);
  if (idx >= 0) {
    cached[idx].refundRequested = true;
    cached[idx].refundReason = reason;
    cached[idx].refundStatus = 'pending';
  }
  setLocalCache(MP_CACHE_KEYS.ORDERS, cached);
}

// =========================================
// REVIEWS
// =========================================
export async function getProductReviews(productId: string): Promise<ProductReview[]> {
  try {
    const q = query(collection(db, 'product_reviews'), where('productId', '==', productId));
    const snap = await getDocs(q);
    if (!snap.empty) {
      return snap.docs.map(doc => ({ id: doc.id, ...doc.data() } as ProductReview));
    }
  } catch (e) {}
  const cached = getLocalCache<ProductReview[]>(MP_CACHE_KEYS.REVIEWS) || [];
  return cached.filter(r => r.productId === productId);
}

export async function saveProductReview(reviewData: Partial<ProductReview>): Promise<string> {
  const id = reviewData.id || `rev-${Date.now()}`;
  const now = new Date().toISOString();

  const fullReview: ProductReview = {
    id,
    productId: reviewData.productId || '',
    buyerUserId: reviewData.buyerUserId || 'buyer-demo',
    buyerName: reviewData.buyerName || 'Verified Buyer',
    buyerAvatar: reviewData.buyerAvatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=300&q=80',
    rating: reviewData.rating || 5,
    comment: reviewData.comment || '',
    createdAt: now
  };

  try {
    await setDoc(doc(db, 'product_reviews', id), fullReview);
  } catch (e) {}

  const cached = getLocalCache<ProductReview[]>(MP_CACHE_KEYS.REVIEWS) || [];
  cached.unshift(fullReview);
  setLocalCache(MP_CACHE_KEYS.REVIEWS, cached);

  return id;
}

export async function respondToReview(reviewId: string, responseComment: string): Promise<void> {
  const now = new Date().toISOString();
  try {
    await updateDoc(doc(db, 'product_reviews', reviewId), {
      sellerResponse: {
        comment: responseComment,
        respondedAt: now
      }
    });
  } catch (e) {}

  const cached = getLocalCache<ProductReview[]>(MP_CACHE_KEYS.REVIEWS) || [];
  const idx = cached.findIndex(r => r.id === reviewId);
  if (idx >= 0) {
    cached[idx].sellerResponse = { comment: responseComment, respondedAt: now };
  }
  setLocalCache(MP_CACHE_KEYS.REVIEWS, cached);
}

// =========================================
// COMMUNITY FORUM
// =========================================
export async function getCommunityPosts(): Promise<CommunityPost[]> {
  try {
    const q = query(collection(db, 'community_posts'), orderBy('createdAt', 'desc'));
    const snap = await getDocs(q);
    if (!snap.empty) {
      const posts = snap.docs.map(doc => ({ id: doc.id, ...doc.data() } as CommunityPost));
      setLocalCache(MP_CACHE_KEYS.COMMUNITY, posts);
      return posts;
    }
  } catch (e) {}
  return getLocalCache<CommunityPost[]>(MP_CACHE_KEYS.COMMUNITY) || initialCommunityPosts;
}

export async function createCommunityPost(postData: Partial<CommunityPost>): Promise<string> {
  const id = `post-${Date.now()}`;
  const now = new Date().toISOString();

  const fullPost: CommunityPost = {
    id,
    title: postData.title || 'Community Question',
    content: postData.content || '',
    postType: postData.postType || 'question',
    category: postData.category || 'General Architecture',
    authorUserId: postData.authorUserId || 'user-demo',
    authorName: postData.authorName || 'Member',
    authorAvatar: postData.authorAvatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=300&q=80',
    authorRole: postData.authorRole || 'Design Enthusiast',
    answers: [],
    likesCount: 0,
    likedByUsers: [],
    bookmarksCount: 0,
    bookmarkedByUsers: [],
    isReported: false,
    createdAt: now
  };

  try {
    await setDoc(doc(db, 'community_posts', id), fullPost);
  } catch (e) {}

  const cached = getLocalCache<CommunityPost[]>(MP_CACHE_KEYS.COMMUNITY) || initialCommunityPosts;
  cached.unshift(fullPost);
  setLocalCache(MP_CACHE_KEYS.COMMUNITY, cached);

  return id;
}

export async function answerCommunityPost(postId: string, answerContent: string, authorName = 'Architect Pro', authorAvatar = 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=300&q=80'): Promise<void> {
  const newAnswer: CommunityAnswer = {
    id: `ans-${Date.now()}`,
    postId,
    authorUserId: 'user-current',
    authorName,
    authorAvatar,
    content: answerContent,
    likesCount: 0,
    likedByUsers: [],
    createdAt: new Date().toISOString()
  };

  const posts = await getCommunityPosts();
  const target = posts.find(p => p.id === postId);
  if (target) {
    target.answers.push(newAnswer);
    try {
      await setDoc(doc(db, 'community_posts', postId), target, { merge: true });
    } catch (e) {}
    setLocalCache(MP_CACHE_KEYS.COMMUNITY, posts);
  }
}

export async function likeCommunityPost(postId: string, userId: string): Promise<void> {
  const posts = await getCommunityPosts();
  const target = posts.find(p => p.id === postId);
  if (target) {
    if (!target.likedByUsers.includes(userId)) {
      target.likedByUsers.push(userId);
      target.likesCount += 1;
    } else {
      target.likedByUsers = target.likedByUsers.filter(u => u !== userId);
      target.likesCount = Math.max(0, target.likesCount - 1);
    }
    try {
      await setDoc(doc(db, 'community_posts', postId), target, { merge: true });
    } catch (e) {}
    setLocalCache(MP_CACHE_KEYS.COMMUNITY, posts);
  }
}

export async function bookmarkCommunityPost(postId: string, userId: string): Promise<void> {
  const posts = await getCommunityPosts();
  const target = posts.find(p => p.id === postId);
  if (target) {
    if (!target.bookmarkedByUsers.includes(userId)) {
      target.bookmarkedByUsers.push(userId);
      target.bookmarksCount += 1;
    } else {
      target.bookmarkedByUsers = target.bookmarkedByUsers.filter(u => u !== userId);
      target.bookmarksCount = Math.max(0, target.bookmarksCount - 1);
    }
    try {
      await setDoc(doc(db, 'community_posts', postId), target, { merge: true });
    } catch (e) {}
    setLocalCache(MP_CACHE_KEYS.COMMUNITY, posts);
  }
}

export async function reportCommunityPost(postId: string, reason: string): Promise<void> {
  const posts = await getCommunityPosts();
  const target = posts.find(p => p.id === postId);
  if (target) {
    target.isReported = true;
    target.reportReason = reason;
    try {
      await updateDoc(doc(db, 'community_posts', postId), {
        isReported: true,
        reportReason: reason
      });
    } catch (e) {}
    setLocalCache(MP_CACHE_KEYS.COMMUNITY, posts);
  }
}

export async function moderateCommunityPost(postId: string, action: 'approve' | 'delete'): Promise<void> {
  const posts = await getCommunityPosts();
  if (action === 'delete') {
    try {
      await deleteDoc(doc(db, 'community_posts', postId));
    } catch (e) {}
    setLocalCache(MP_CACHE_KEYS.COMMUNITY, posts.filter(p => p.id !== postId));
  } else {
    const target = posts.find(p => p.id === postId);
    if (target) {
      target.isReported = false;
      target.reportReason = undefined;
      try {
        await updateDoc(doc(db, 'community_posts', postId), {
          isReported: false,
          reportReason: null
        });
      } catch (e) {}
      setLocalCache(MP_CACHE_KEYS.COMMUNITY, posts);
    }
  }
}

// =========================================
// COURSES & STUDENT PROGRESS
// =========================================
export async function getCourses(): Promise<Course[]> {
  try {
    const snap = await getDocs(collection(db, 'courses'));
    if (!snap.empty) {
      const courses = snap.docs.map(doc => ({ id: doc.id, ...doc.data() } as Course));
      setLocalCache(MP_CACHE_KEYS.COURSES, courses);
      return courses;
    }
  } catch (e) {}
  return getLocalCache<Course[]>(MP_CACHE_KEYS.COURSES) || initialCourses;
}

export async function saveCourse(courseData: Partial<Course>): Promise<string> {
  const id = courseData.id || `course-${Date.now()}`;
  const now = new Date().toISOString();

  const fullCourse: Course = {
    id,
    title: courseData.title || 'New Professional Course',
    slug: courseData.slug || (courseData.title ? courseData.title.toLowerCase().replace(/[^a-z0-9]+/g, '-') : `course-${Date.now()}`),
    description: courseData.description || '',
    category: courseData.category || 'Architecture & BIM',
    level: courseData.level || 'Intermediate',
    coverImage: courseData.coverImage || 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1200&q=80',
    price: Number(courseData.price) || 0,
    creatorId: courseData.creatorId || 'creator-current',
    creatorName: courseData.creatorName || 'Master Instructor',
    creatorAvatar: courseData.creatorAvatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=300&q=80',
    lessons: courseData.lessons || [],
    totalDuration: courseData.totalDuration || '4 Hours',
    enrolledStudentsCount: courseData.enrolledStudentsCount || 0,
    rating: courseData.rating || 5.0,
    reviewCount: courseData.reviewCount || 0,
    certificateProvided: courseData.certificateProvided ?? true,
    createdAt: now
  };

  try {
    await setDoc(doc(db, 'courses', id), fullCourse, { merge: true });
  } catch (e) {}

  const cached = getLocalCache<Course[]>(MP_CACHE_KEYS.COURSES) || initialCourses;
  const idx = cached.findIndex(c => c.id === id);
  if (idx >= 0) cached[idx] = fullCourse;
  else cached.unshift(fullCourse);
  setLocalCache(MP_CACHE_KEYS.COURSES, cached);

  return id;
}

export async function getStudentCourseProgress(studentUserId: string, courseId: string): Promise<StudentCourseProgress | null> {
  const cacheKey = `${MP_CACHE_KEYS.PROGRESS}_${studentUserId}_${courseId}`;
  try {
    const docSnap = await getDoc(doc(db, 'student_progress', `${studentUserId}_${courseId}`));
    if (docSnap.exists()) {
      const prog = docSnap.data() as StudentCourseProgress;
      setLocalCache(cacheKey, prog);
      return prog;
    }
  } catch (e) {}
  return getLocalCache<StudentCourseProgress>(cacheKey);
}

export async function saveStudentCourseProgress(progress: StudentCourseProgress): Promise<void> {
  const docId = `${progress.studentUserId}_${progress.courseId}`;
  try {
    await setDoc(doc(db, 'student_progress', docId), progress, { merge: true });
  } catch (e) {}
  setLocalCache(`${MP_CACHE_KEYS.PROGRESS}_${progress.studentUserId}_${progress.courseId}`, progress);
}

// =========================================
// JOB BOARD & APPLICATIONS
// =========================================
export async function getJobListings(): Promise<JobListing[]> {
  try {
    const q = query(collection(db, 'job_listings'), orderBy('createdAt', 'desc'));
    const snap = await getDocs(q);
    if (!snap.empty) {
      const jobs = snap.docs.map(doc => ({ id: doc.id, ...doc.data() } as JobListing));
      setLocalCache(MP_CACHE_KEYS.JOBS, jobs);
      return jobs;
    }
  } catch (e) {}
  return getLocalCache<JobListing[]>(MP_CACHE_KEYS.JOBS) || initialJobListings;
}

export async function saveJobListing(jobData: Partial<JobListing>): Promise<string> {
  const id = jobData.id || `job-${Date.now()}`;
  const now = new Date().toISOString();

  const fullJob: JobListing = {
    id,
    title: jobData.title || 'New Job Opportunity',
    companyName: jobData.companyName || 'Design Studio',
    companyLogo: jobData.companyLogo || 'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&w=300&q=80',
    employerUserId: jobData.employerUserId || 'emp-current',
    jobType: jobData.jobType || 'Freelance',
    category: jobData.category || 'Architecture',
    location: jobData.location || 'Remote',
    salaryRange: jobData.salaryRange || 'Competitive',
    description: jobData.description || '',
    requirements: jobData.requirements || [],
    servicesRequested: jobData.servicesRequested || [],
    applicantsCount: jobData.applicantsCount || 0,
    status: jobData.status || 'open',
    createdAt: now
  };

  try {
    await setDoc(doc(db, 'job_listings', id), fullJob, { merge: true });
  } catch (e) {}

  const cached = getLocalCache<JobListing[]>(MP_CACHE_KEYS.JOBS) || initialJobListings;
  const idx = cached.findIndex(j => j.id === id);
  if (idx >= 0) cached[idx] = fullJob;
  else cached.unshift(fullJob);
  setLocalCache(MP_CACHE_KEYS.JOBS, cached);

  return id;
}

export async function submitJobApplication(applicationData: Partial<JobApplication>): Promise<string> {
  const id = `app-${Date.now()}`;
  const now = new Date().toISOString();

  const fullApp: JobApplication = {
    id,
    jobId: applicationData.jobId || '',
    jobTitle: applicationData.jobTitle || '',
    companyName: applicationData.companyName || '',
    applicantUserId: applicationData.applicantUserId || 'applicant-demo',
    applicantName: applicationData.applicantName || 'Job Applicant',
    applicantEmail: applicationData.applicantEmail || 'applicant@example.com',
    applicantPhone: applicationData.applicantPhone || '',
    portfolioUrl: applicationData.portfolioUrl || '',
    resumeUrl: applicationData.resumeUrl || '',
    coverLetter: applicationData.coverLetter || '',
    status: 'applied',
    createdAt: now
  };

  try {
    await setDoc(doc(db, 'job_applications', id), fullApp);
  } catch (e) {}

  const cached = getLocalCache<JobApplication[]>(MP_CACHE_KEYS.APPLICATIONS) || [];
  cached.unshift(fullApp);
  setLocalCache(MP_CACHE_KEYS.APPLICATIONS, cached);

  // Increment applicants count
  const jobs = await getJobListings();
  const job = jobs.find(j => j.id === applicationData.jobId);
  if (job) {
    job.applicantsCount += 1;
    saveJobListing(job);
  }

  return id;
}

export async function getJobApplications(): Promise<JobApplication[]> {
  try {
    const snap = await getDocs(collection(db, 'job_applications'));
    if (!snap.empty) {
      const apps = snap.docs.map(doc => ({ id: doc.id, ...doc.data() } as JobApplication));
      setLocalCache(MP_CACHE_KEYS.APPLICATIONS, apps);
      return apps;
    }
  } catch (e) {}
  return getLocalCache<JobApplication[]>(MP_CACHE_KEYS.APPLICATIONS) || [];
}

// =========================================
// PROFESSIONAL DIRECTORY
// =========================================
export async function getProfessionalProfiles(): Promise<ProfessionalProfile[]> {
  try {
    const snap = await getDocs(collection(db, 'professional_directory'));
    if (!snap.empty) {
      const directory = snap.docs.map(doc => ({ id: doc.id, ...doc.data() } as ProfessionalProfile));
      setLocalCache(MP_CACHE_KEYS.DIRECTORY, directory);
      return directory;
    }
  } catch (e) {}
  return getLocalCache<ProfessionalProfile[]>(MP_CACHE_KEYS.DIRECTORY) || initialProfessionalProfiles;
}

export async function saveProfessionalProfile(profileData: Partial<ProfessionalProfile>): Promise<string> {
  const id = profileData.id || `prof-${Date.now()}`;

  const fullProf: ProfessionalProfile = {
    id,
    userId: profileData.userId || 'user-current',
    name: profileData.name || 'Professional Member',
    avatar: profileData.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=300&q=80',
    title: profileData.title || 'Architectural Specialist',
    profession: profileData.profession || 'Architect',
    location: profileData.location || 'Global',
    experienceYears: profileData.experienceYears || 5,
    rating: profileData.rating || 5.0,
    reviewCount: profileData.reviewCount || 0,
    hourlyRate: profileData.hourlyRate || '$50 / hr',
    verified: profileData.verified ?? true,
    bio: profileData.bio || '',
    services: profileData.services || [],
    softwareSkills: profileData.softwareSkills || [],
    portfolioImages: profileData.portfolioImages || [],
    contactEmail: profileData.contactEmail || 'pro@example.com',
    phone: profileData.phone || '',
    website: profileData.website || ''
  };

  try {
    await setDoc(doc(db, 'professional_directory', id), fullProf, { merge: true });
  } catch (e) {}

  const cached = getLocalCache<ProfessionalProfile[]>(MP_CACHE_KEYS.DIRECTORY) || initialProfessionalProfiles;
  const idx = cached.findIndex(p => p.id === id);
  if (idx >= 0) cached[idx] = fullProf;
  else cached.push(fullProf);
  setLocalCache(MP_CACHE_KEYS.DIRECTORY, cached);

  return id;
}

// =========================================
// WISHLIST & FOLLOWING
// =========================================
export function getWishlistProductIds(): string[] {
  return getLocalCache<string[]>(MP_CACHE_KEYS.WISHLIST) || ['prod-modern-villa-plan'];
}

export function toggleWishlistProductId(productId: string): string[] {
  const current = getWishlistProductIds();
  let updated: string[];
  if (current.includes(productId)) {
    updated = current.filter(id => id !== productId);
  } else {
    updated = [...current, productId];
  }
  setLocalCache(MP_CACHE_KEYS.WISHLIST, updated);
  return updated;
}

export function getFollowedSellerIds(): string[] {
  return getLocalCache<string[]>(MP_CACHE_KEYS.FOLLOWERS) || ['store-archviz'];
}

export function toggleFollowSellerId(sellerStoreId: string): string[] {
  const current = getFollowedSellerIds();
  let updated: string[];
  if (current.includes(sellerStoreId)) {
    updated = current.filter(id => id !== sellerStoreId);
  } else {
    updated = [...current, sellerStoreId];
  }
  setLocalCache(MP_CACHE_KEYS.FOLLOWERS, updated);
  return updated;
}
