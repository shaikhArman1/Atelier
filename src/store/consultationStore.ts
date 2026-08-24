import { create } from "zustand";
import type { Consultation, PreferenceProfile, ReferenceItem, FloorPlan, GeneratedConcept, RoomType, DesignStyle } from "@/types";

interface ConsultationState {
  currentConsultation: Consultation | null;
  preferenceProfile: PreferenceProfile | null;
  selectedRoom: RoomType | null;
  selectedElement: string | null;
  selectedReferences: ReferenceItem[];
  currentFloorPlan: FloorPlan | null;
  generatedConcepts: GeneratedConcept[];
  activeConcept: GeneratedConcept | null;
  isPresentationMode: boolean;
  setConsultation: (c: Consultation) => void;
  updateProfile: (updates: Partial<PreferenceProfile>) => void;
  addStyleSelection: (style: DesignStyle, liked: boolean) => void;
  setRoom: (room: RoomType) => void;
  setElement: (element: string) => void;
  toggleReference: (ref: ReferenceItem) => void;
  setFloorPlan: (fp: FloorPlan) => void;
  addConcept: (concept: GeneratedConcept) => void;
  setActiveConcept: (concept: GeneratedConcept) => void;
  togglePresentationMode: () => void;
  reset: () => void;
}

const defaultProfile = (): PreferenceProfile => ({
  id: "",
  consultationId: "",
  projectId: "",
  overallStyle: [],
  palette: [],
  materials: [],
  lighting: [],
  furniture: [],
  ornamentation: "minimal",
  confidence: {},
  likedReferenceIds: [],
  dislikedReferenceIds: [],
  avoid: [],
  version: 1,
  updatedAt: new Date(),
});

export const useConsultationStore = create<ConsultationState>((set, get) => ({
  currentConsultation: null,
  preferenceProfile: null,
  selectedRoom: null,
  selectedElement: null,
  selectedReferences: [],
  currentFloorPlan: null,
  generatedConcepts: [],
  activeConcept: null,
  isPresentationMode: false,

  setConsultation: (c) => set({ currentConsultation: c, preferenceProfile: defaultProfile() }),

  updateProfile: (updates) =>
    set((state) => ({
      preferenceProfile: state.preferenceProfile
        ? { ...state.preferenceProfile, ...updates, updatedAt: new Date() }
        : { ...defaultProfile(), ...updates },
    })),

  addStyleSelection: (style, liked) =>
    set((state) => {
      const profile = state.preferenceProfile || defaultProfile();
      if (liked && !profile.overallStyle.includes(style)) {
        return { preferenceProfile: { ...profile, overallStyle: [...profile.overallStyle, style], updatedAt: new Date() } };
      }
      return {};
    }),

  setRoom: (room) => set({ selectedRoom: room, selectedElement: null, selectedReferences: [] }),
  setElement: (element) => set({ selectedElement: element }),

  toggleReference: (ref) =>
    set((state) => {
      const exists = state.selectedReferences.find((r) => r.id === ref.id);
      return {
        selectedReferences: exists
          ? state.selectedReferences.filter((r) => r.id !== ref.id)
          : [...state.selectedReferences, { ...ref, isSelected: true }],
      };
    }),

  setFloorPlan: (fp) => set({ currentFloorPlan: fp }),
  addConcept: (concept) => set((state) => ({ generatedConcepts: [concept, ...state.generatedConcepts], activeConcept: concept })),
  setActiveConcept: (concept) => set({ activeConcept: concept }),
  togglePresentationMode: () => set((state) => ({ isPresentationMode: !state.isPresentationMode })),
  reset: () => set({
    currentConsultation: null, preferenceProfile: null, selectedRoom: null,
    selectedElement: null, selectedReferences: [], currentFloorPlan: null,
    generatedConcepts: [], activeConcept: null, isPresentationMode: false,
  }),
}));
