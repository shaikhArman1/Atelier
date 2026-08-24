// Core type definitions for the Interior Design Consultation Platform

export type PropertyType =
  | 'apartment'
  | 'villa'
  | 'independent_house'
  | 'office'
  | 'commercial'
  | 'retail'
  | 'restaurant'
  | 'other';

export type ProjectStatus =
  | 'new'
  | 'preference_discovery'
  | 'space_selection'
  | 'reference_selection'
  | 'concept_generation'
  | 'refinement'
  | 'summary'
  | 'completed';

export type RoomType =
  | 'living_room'
  | 'dining_room'
  | 'master_bedroom'
  | 'bedroom_2'
  | 'bedroom_3'
  | 'kids_bedroom'
  | 'guest_bedroom'
  | 'kitchen'
  | 'foyer'
  | 'pooja_room'
  | 'balcony'
  | 'bathroom'
  | 'office'
  | 'other';

export type DesignStyle =
  | 'modern'
  | 'minimal'
  | 'contemporary'
  | 'luxury'
  | 'scandinavian'
  | 'japandi'
  | 'industrial'
  | 'traditional'
  | 'neoclassical'
  | 'warm_wooden'
  | 'modern_classic'
  | 'organic';

export type NoteType = 'client_preference' | 'designer_note' | 'ai_inference';
export type ImageSource = 'private_library' | 'external' | 'ai_generated';
export type ReferenceAction = 'like' | 'dislike' | 'save' | 'select' | 'skip';

export interface User {
  uid: string;
  email: string;
  displayName: string;
  role: 'designer';
  createdAt: Date;
}

export interface Client {
  id: string;
  designerId: string;
  name: string;
  email?: string;
  phone?: string;
  createdAt: Date;
}

export interface Project {
  id: string;
  designerId: string;
  clientId: string;
  clientName: string;
  name: string;
  propertyType: PropertyType;
  bhk?: number;
  location?: string;
  status: ProjectStatus;
  thumbnailUrl?: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface Consultation {
  id: string;
  projectId: string;
  designerId: string;
  clientId: string;
  clientName: string;
  status: ProjectStatus;
  currentStep: string;
  startedAt: Date;
  completedAt?: Date;
  notes: ConsultationNote[];
}

export interface ConsultationNote {
  id: string;
  type: NoteType;
  content: string;
  createdAt: Date;
}

export interface PreferenceProfile {
  id: string;
  consultationId: string;
  projectId: string;
  overallStyle: DesignStyle[];
  palette: string[];
  materials: string[];
  lighting: string[];
  furniture: string[];
  ornamentation: 'very_minimal' | 'minimal' | 'moderate' | 'decorative' | 'highly_detailed';
  confidence: Record<string, number>;
  likedReferenceIds: string[];
  dislikedReferenceIds: string[];
  avoid: string[];
  version: number;
  updatedAt: Date;
}

export interface DesignLibraryItem {
  id: string;
  designerId: string;
  storagePath: string;
  thumbnailPath?: string;
  publicUrl: string;
  thumbnailUrl?: string;
  room: RoomType;
  element?: string;
  style: DesignStyle[];
  palette: string[];
  materials: string[];
  lighting?: string;
  tags: string[];
  description?: string;
  source?: string;
  budgetCategory?: 'economy' | 'mid_range' | 'luxury' | 'ultra_luxury';
  createdAt: Date;
}

export interface ReferenceItem {
  id: string;
  imageUrl: string;
  thumbnailUrl?: string;
  title?: string;
  description?: string;
  source: ImageSource;
  sourceUrl?: string;
  room?: RoomType;
  style?: DesignStyle[];
  materials?: string[];
  relevanceScore?: number;
  isSelected?: boolean;
  action?: ReferenceAction;
}

export interface FloorPlan {
  id: string;
  consultationId: string;
  projectId: string;
  storagePath: string;
  publicUrl: string;
  analysisStatus: 'pending' | 'analyzing' | 'complete' | 'failed';
  analysis?: FloorPlanAnalysis;
  uploadedAt: Date;
}

export interface FloorPlanAnalysis {
  rooms: DetectedRoom[];
  overallDimensions?: { widthFt?: number; lengthFt?: number };
  confidence: number;
  notes: string;
}

export interface DetectedRoom {
  name: string;
  roomType?: RoomType;
  approxDimensions?: { widthFt?: number; lengthFt?: number };
  openings: RoomOpening[];
  position?: { x: number; y: number; width: number; height: number };
}

export interface RoomOpening {
  type: 'door' | 'window' | 'opening';
  wall: 'north' | 'south' | 'east' | 'west' | 'unknown';
  approxWidthFt?: number;
}

export interface GeneratedConcept {
  id: string;
  consultationId: string;
  projectId: string;
  room: RoomType;
  element?: string;
  imageUrl: string;
  prompt: string;
  referencesUsed: string[];
  floorPlanId?: string;
  profileVersion?: number;
  provider: string;
  model: string;
  promptVersion: string;
  parentConceptId?: string;
  refinementInstruction?: string;
  feedback?: ConceptFeedback;
  savedToProject: boolean;
  createdAt: Date;
}

export interface ConceptFeedback {
  aspect: 'colour' | 'furniture' | 'lighting' | 'material' | 'layout' | 'too_decorative' | 'too_simple' | 'too_dark' | 'too_bright' | 'other';
  note?: string;
}

export interface GeneratedSummary {
  id: string;
  consultationId: string;
  content: string;
  editedContent?: string;
  generatedAt: Date;
  editedAt?: Date;
}

// AI Provider interfaces
export interface ConceptGenerationInput {
  room: RoomType;
  element?: string;
  preferenceProfile: Partial<PreferenceProfile>;
  selectedReferences: ReferenceItem[];
  floorPlanAnalysis?: FloorPlanAnalysis;
  designerInstructions?: string;
  parentConceptUrl?: string;
  refinementInstruction?: string;
}

export interface FloorPlanInput {
  imageUrl: string;
  targetRoom?: string;
}

export interface ReferenceSearchInput {
  room: RoomType;
  element?: string;
  styles: DesignStyle[];
  materials: string[];
  palette: string[];
  maxResults?: number;
}

export interface StyleOption {
  id: DesignStyle;
  label: string;
  description: string;
  imageUrl: string;
}

export interface AppMode {
  isDemo: boolean;
  hasGemini: boolean;
  hasOpenAI: boolean;
  hasSearch: boolean;
  hasFirebase: boolean;
}
