import { VisualKnowledgeArticle } from '../types/visualKnowledge';
import { METAL_MATERIALS_ARTICLES } from './metalCatalogMaterials';
import { METAL_SHEET_AND_SECTIONS_ARTICLES } from './metalCatalogSheetAndSections';
import { METAL_PROCESSES_AND_DEFECTS_ARTICLES } from './metalCatalogProcessesAndDefects';

// Master unified list of all dedicated Metal Intelligence articles
export const ALL_METAL_CATALOG_ARTICLES: VisualKnowledgeArticle[] = [
  ...METAL_MATERIALS_ARTICLES,
  ...METAL_SHEET_AND_SECTIONS_ARTICLES,
  ...METAL_PROCESSES_AND_DEFECTS_ARTICLES
];

export const METAL_SUB_CATEGORIES = [
  'All Metal Topics',
  'Metals & Steel Materials',
  'Sheet Metal',
  'Steel Sections',
  'Aluminium & Non-Ferrous Metals',
  'Metal Properties',
  'Metal Fabrication',
  'Welding',
  'Welding Defects',
  'Corrosion & Metal Damage',
  'Fasteners & Connections',
  'Surface Treatment',
  'Metal Inspection',
  'Metal Design Examples',
  'AI Metal Image Analysis'
] as const;

export type MetalSubCategory = typeof METAL_SUB_CATEGORIES[number];
