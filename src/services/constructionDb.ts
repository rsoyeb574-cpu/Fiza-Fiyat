import { 
  collection, 
  getDocs, 
  getDoc, 
  doc, 
  setDoc, 
  addDoc, 
  deleteDoc, 
  query, 
  orderBy, 
  where 
} from 'firebase/firestore';
import { db, auth } from '../lib/firebase';
import { 
  LocationCity,
  LocationState,
  LocationCountry,
  MaterialItem,
  MaterialCategory,
  LaborRateItem,
  FoundationType,
  ColumnType,
  BeamType,
  RoofType,
  SlabType,
  WallType,
  BrickType,
  BlockType,
  DoorType,
  WindowType,
  FinishCategoryItem,
  HousePlanItem,
  Model3DItem,
  ConstructionTipItem,
  ConstructionVideoItem,
  ProjectGalleryItem,
  CustomerReviewItem,
  FAQItem,
  SliderItem,
  UserAccount,
  UserRoleDefinition,
  AppNotification,
  SEOSetting,
  AnalyticsSummary
} from '../types/constructionDatabase';

// Error handling helper required by Firebase integration standards
enum OperationType {
  CREATE = 'create',
  UPDATE = 'update',
  DELETE = 'delete',
  LIST = 'list',
  GET = 'get',
  WRITE = 'write',
}

interface FirestoreErrorInfo {
  error: string;
  operationType: OperationType;
  path: string | null;
  authInfo: {
    userId?: string | null;
    email?: string | null;
    emailVerified?: boolean | null;
  }
}

function handleFirestoreError(error: unknown, operationType: OperationType, path: string | null) {
  const errInfo: FirestoreErrorInfo = {
    error: error instanceof Error ? error.message : String(error),
    authInfo: {
      userId: auth.currentUser?.uid,
      email: auth.currentUser?.email,
      emailVerified: auth.currentUser?.emailVerified,
    },
    operationType,
    path
  };
  console.warn('Firestore Operation Notice:', JSON.stringify(errInfo));
}

// Local cache helper for instant UI feedback & offline safety
function getCache<T>(key: string): T | null {
  try {
    const raw = localStorage.getItem(`cdb_${key}`);
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}

function setCache<T>(key: string, val: T) {
  try {
    localStorage.setItem(`cdb_${key}`, JSON.stringify(val));
  } catch {}
}

// GENERIC COLLECTION HELPER
export async function getCollectionData<T>(collName: string, fallbackData: T[] = []): Promise<T[]> {
  try {
    const snap = await getDocs(collection(db, collName));
    if (!snap.empty) {
      const items = snap.docs.map(d => ({ id: d.id, ...d.data() } as unknown as T));
      setCache(collName, items);
      return items;
    }
  } catch (err) {
    handleFirestoreError(err, OperationType.GET, collName);
  }
  return getCache<T[]>(collName) || fallbackData;
}

export async function saveDocumentData<T extends { id?: string }>(collName: string, docData: T): Promise<string> {
  const id = docData.id || `${collName.slice(0, 4)}-${Date.now()}`;
  const payload = { ...docData, id, updatedAt: new Date().toISOString() };
  try {
    await setDoc(doc(db, collName, id), payload, { merge: true });
  } catch (err) {
    handleFirestoreError(err, OperationType.WRITE, `${collName}/${id}`);
  }
  const cached = getCache<T[]>(collName) || [];
  const idx = cached.findIndex(item => item.id === id);
  if (idx >= 0) cached[idx] = payload;
  else cached.unshift(payload);
  setCache(collName, cached);
  return id;
}

export async function deleteDocumentData(collName: string, id: string): Promise<void> {
  try {
    await deleteDoc(doc(db, collName, id));
  } catch (err) {
    handleFirestoreError(err, OperationType.DELETE, `${collName}/${id}`);
  }
  const cached = getCache<any[]>(collName) || [];
  setCache(collName, cached.filter(item => item.id !== id));
}

// =========================================
// SPECIFIC COLLECTION ACCESSORS
// =========================================

export const getCities = (fallback: LocationCity[] = []) => getCollectionData<LocationCity>('cities', fallback);
export const saveCity = (city: LocationCity) => saveDocumentData<LocationCity>('cities', city);
export const deleteCity = (id: string) => deleteDocumentData('cities', id);

export const getStates = (fallback: LocationState[] = []) => getCollectionData<LocationState>('states', fallback);
export const saveState = (state: LocationState) => saveDocumentData<LocationState>('states', state);

export const getCountries = (fallback: LocationCountry[] = []) => getCollectionData<LocationCountry>('countries', fallback);
export const saveCountry = (country: LocationCountry) => saveDocumentData<LocationCountry>('countries', country);

export const getMaterials = (fallback: MaterialItem[] = []) => getCollectionData<MaterialItem>('materials', fallback);
export const saveMaterial = (material: MaterialItem) => saveDocumentData<MaterialItem>('materials', material);
export const deleteMaterial = (id: string) => deleteDocumentData('materials', id);

export const getMaterialCategories = (fallback: MaterialCategory[] = []) => getCollectionData<MaterialCategory>('material_categories', fallback);
export const saveMaterialCategory = (cat: MaterialCategory) => saveDocumentData<MaterialCategory>('material_categories', cat);

export const getLaborRates = (fallback: LaborRateItem[] = []) => getCollectionData<LaborRateItem>('labor_rates', fallback);
export const saveLaborRate = (labor: LaborRateItem) => saveDocumentData<LaborRateItem>('labor_rates', labor);
export const deleteLaborRate = (id: string) => deleteDocumentData('labor_rates', id);

export const getFoundationTypes = (fallback: FoundationType[] = []) => getCollectionData<FoundationType>('foundation_types', fallback);
export const saveFoundationType = (item: FoundationType) => saveDocumentData<FoundationType>('foundation_types', item);

export const getColumnTypes = (fallback: ColumnType[] = []) => getCollectionData<ColumnType>('column_types', fallback);
export const saveColumnType = (item: ColumnType) => saveDocumentData<ColumnType>('column_types', item);

export const getBeamTypes = (fallback: BeamType[] = []) => getCollectionData<BeamType>('beam_types', fallback);
export const saveBeamType = (item: BeamType) => saveDocumentData<BeamType>('beam_types', item);

export const getRoofTypes = (fallback: RoofType[] = []) => getCollectionData<RoofType>('roof_types', fallback);
export const saveRoofType = (item: RoofType) => saveDocumentData<RoofType>('roof_types', item);

export const getSlabTypes = (fallback: SlabType[] = []) => getCollectionData<SlabType>('slab_types', fallback);
export const saveSlabType = (item: SlabType) => saveDocumentData<SlabType>('slab_types', item);

export const getWallTypes = (fallback: WallType[] = []) => getCollectionData<WallType>('wall_types', fallback);
export const saveWallType = (item: WallType) => saveDocumentData<WallType>('wall_types', item);

export const getBrickTypes = (fallback: BrickType[] = []) => getCollectionData<BrickType>('brick_types', fallback);
export const saveBrickType = (item: BrickType) => saveDocumentData<BrickType>('brick_types', item);

export const getBlockTypes = (fallback: BlockType[] = []) => getCollectionData<BlockType>('block_types', fallback);
export const saveBlockType = (item: BlockType) => saveDocumentData<BlockType>('block_types', item);

export const getDoorTypes = (fallback: DoorType[] = []) => getCollectionData<DoorType>('door_types', fallback);
export const saveDoorType = (item: DoorType) => saveDocumentData<DoorType>('door_types', item);

export const getWindowTypes = (fallback: WindowType[] = []) => getCollectionData<WindowType>('window_types', fallback);
export const saveWindowType = (item: WindowType) => saveDocumentData<WindowType>('window_types', item);

export const getFinishItems = (categoryColl: string, fallback: FinishCategoryItem[] = []) => getCollectionData<FinishCategoryItem>(categoryColl, fallback);
export const saveFinishItem = (categoryColl: string, item: FinishCategoryItem) => saveDocumentData<FinishCategoryItem>(categoryColl, item);

export const getHousePlans = (fallback: HousePlanItem[] = []) => getCollectionData<HousePlanItem>('house_plans', fallback);
export const saveHousePlan = (plan: HousePlanItem) => saveDocumentData<HousePlanItem>('house_plans', plan);
export const deleteHousePlan = (id: string) => deleteDocumentData('house_plans', id);

export const get3DModels = (fallback: Model3DItem[] = []) => getCollectionData<Model3DItem>('models_3d', fallback);
export const save3DModel = (model: Model3DItem) => saveDocumentData<Model3DItem>('models_3d', model);

export const getConstructionTips = (fallback: ConstructionTipItem[] = []) => getCollectionData<ConstructionTipItem>('construction_tips', fallback);
export const saveConstructionTip = (tip: ConstructionTipItem) => saveDocumentData<ConstructionTipItem>('construction_tips', tip);

export const getConstructionVideos = (fallback: ConstructionVideoItem[] = []) => getCollectionData<ConstructionVideoItem>('construction_videos', fallback);
export const saveConstructionVideo = (video: ConstructionVideoItem) => saveDocumentData<ConstructionVideoItem>('construction_videos', video);

export const getProjectGallery = (fallback: ProjectGalleryItem[] = []) => getCollectionData<ProjectGalleryItem>('project_gallery', fallback);
export const saveProjectGallery = (item: ProjectGalleryItem) => saveDocumentData<ProjectGalleryItem>('project_gallery', item);

export const getCustomerReviews = (fallback: CustomerReviewItem[] = []) => getCollectionData<CustomerReviewItem>('customer_reviews', fallback);
export const saveCustomerReview = (review: CustomerReviewItem) => saveDocumentData<CustomerReviewItem>('customer_reviews', review);

export const getFAQs = (fallback: FAQItem[] = []) => getCollectionData<FAQItem>('faqs', fallback);
export const saveFAQ = (faq: FAQItem) => saveDocumentData<FAQItem>('faqs', faq);

export const getSliders = (fallback: SliderItem[] = []) => getCollectionData<SliderItem>('sliders', fallback);
export const saveSlider = (slider: SliderItem) => saveDocumentData<SliderItem>('sliders', slider);

export const getUsers = (fallback: UserAccount[] = []) => getCollectionData<UserAccount>('users', fallback);
export const saveUser = (user: UserAccount) => saveDocumentData<UserAccount>('users', user);

export const getNotifications = (fallback: AppNotification[] = []) => getCollectionData<AppNotification>('notifications', fallback);
export const saveNotification = (notif: AppNotification) => saveDocumentData<AppNotification>('notifications', notif);

export const getSEOSettings = (fallback: SEOSetting[] = []) => getCollectionData<SEOSetting>('seo', fallback);
export const saveSEOSetting = (seo: SEOSetting) => saveDocumentData<SEOSetting>('seo', seo);
