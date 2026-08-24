import type { RoomType, DesignStyle } from "@/types";

export const PROPERTY_TYPES = [
  { id: "apartment", label: "Apartment / Flat", icon: "building" },
  { id: "villa", label: "Villa", icon: "home" },
  { id: "independent_house", label: "Independent House", icon: "house" },
  { id: "office", label: "Office", icon: "briefcase" },
  { id: "commercial", label: "Commercial Space", icon: "store" },
  { id: "retail", label: "Retail", icon: "shopping-bag" },
  { id: "restaurant", label: "Restaurant / Hospitality", icon: "utensils" },
  { id: "other", label: "Other", icon: "more-horizontal" },
] as const;

export const ROOMS: Record<RoomType, { label: string; elements: string[] }> = {
  living_room: {
    label: "Living Room",
    elements: ["TV Unit", "Sofa", "Feature Wall", "Ceiling", "Lighting", "Flooring", "Curtains", "Storage", "Display Unit", "Dining Integration"],
  },
  dining_room: {
    label: "Dining Room",
    elements: ["Dining Table", "Chairs", "Storage Unit", "Lighting", "Feature Wall", "Flooring"],
  },
  master_bedroom: {
    label: "Master Bedroom",
    elements: ["Bed", "Headboard Wall", "Wardrobe", "Dressing Area", "Side Tables", "Ceiling", "Lighting", "Flooring", "Wall Treatment", "Curtains", "Seating", "Accessories"],
  },
  bedroom_2: {
    label: "Bedroom 2",
    elements: ["Bed", "Wardrobe", "Study Area", "Lighting", "Flooring", "Curtains"],
  },
  bedroom_3: {
    label: "Bedroom 3",
    elements: ["Bed", "Wardrobe", "Study Area", "Lighting", "Flooring", "Curtains"],
  },
  kids_bedroom: {
    label: "Kids Bedroom",
    elements: ["Bed", "Study Table", "Storage", "Play Area", "Lighting", "Flooring", "Curtains"],
  },
  guest_bedroom: {
    label: "Guest Bedroom",
    elements: ["Bed", "Wardrobe", "Lighting", "Flooring", "Curtains"],
  },
  kitchen: {
    label: "Kitchen",
    elements: ["Base Cabinets", "Wall Cabinets", "Tall Units", "Handles", "Countertop", "Backsplash", "Lighting", "Storage Systems"],
  },
  foyer: {
    label: "Foyer / Entrance",
    elements: ["Console", "Storage", "Flooring", "Lighting", "Feature Wall", "Ceiling"],
  },
  pooja_room: {
    label: "Pooja Room",
    elements: ["Mandir Unit", "Storage", "Lighting", "Flooring", "Wall Treatment"],
  },
  balcony: {
    label: "Balcony",
    elements: ["Flooring", "Seating", "Lighting", "Planters", "Railing"],
  },
  bathroom: {
    label: "Bathroom",
    elements: ["Vanity", "Shower", "Tiles", "Lighting", "Storage", "Fixtures"],
  },
  office: {
    label: "Home Office",
    elements: ["Desk", "Storage", "Chair", "Lighting", "Shelving", "Feature Wall"],
  },
  other: {
    label: "Other",
    elements: ["Custom"],
  },
};

export const DESIGN_STYLES: Array<{ id: DesignStyle; label: string; description: string; keywords: string[] }> = [
  { id: "modern", label: "Modern", description: "Clean lines, functional form, open spaces", keywords: ["clean", "functional", "geometric"] },
  { id: "minimal", label: "Minimal", description: "Essential elements only, profound calm", keywords: ["minimal", "simple", "serene"] },
  { id: "contemporary", label: "Contemporary", description: "Current trends, sophisticated neutrals", keywords: ["current", "sophisticated", "refined"] },
  { id: "luxury", label: "Luxury", description: "Premium materials, curated opulence", keywords: ["opulent", "premium", "rich"] },
  { id: "scandinavian", label: "Scandinavian", description: "Warm woods, light tones, hygge comfort", keywords: ["warm", "wood", "hygge"] },
  { id: "japandi", label: "Japandi", description: "Japanese minimalism meets Scandinavian warmth", keywords: ["wabi-sabi", "nature", "harmony"] },
  { id: "industrial", label: "Industrial", description: "Raw materials, urban character", keywords: ["raw", "metal", "concrete"] },
  { id: "traditional", label: "Traditional", description: "Classic patterns, rich wood tones", keywords: ["classic", "ornate", "heritage"] },
  { id: "neoclassical", label: "Neoclassical", description: "Architectural grandeur, refined proportion", keywords: ["architectural", "proportion", "elegant"] },
  { id: "warm_wooden", label: "Warm Wooden", description: "Natural wood forward, organic warmth", keywords: ["natural", "wood", "organic"] },
  { id: "modern_classic", label: "Modern Classic", description: "Timeless silhouettes, contemporary finish", keywords: ["timeless", "contemporary", "balanced"] },
  { id: "organic", label: "Organic / Natural", description: "Natural forms, biophilic design", keywords: ["biophilic", "natural", "earthen"] },
];

export const PALETTE_OPTIONS = [
  { id: "warm_neutrals", label: "Warm Neutrals", swatch: "#E8DDD0" },
  { id: "cool_neutrals", label: "Cool Neutrals", swatch: "#D4D8DB" },
  { id: "pure_white", label: "Pure White", swatch: "#F8F8F7" },
  { id: "beige", label: "Beige", swatch: "#D4B896" },
  { id: "grey", label: "Grey", swatch: "#9B9B9B" },
  { id: "earth_tones", label: "Earth Tones", swatch: "#A0785A" },
  { id: "dark_tones", label: "Dark Tones", swatch: "#2C2C2C" },
  { id: "wood_heavy", label: "Wood-Forward", swatch: "#8B6240" },
  { id: "colourful", label: "Colourful", swatch: "#6B8E6B" },
];

export const MATERIAL_OPTIONS = [
  "Natural Wood", "Walnut", "Oak", "Matte Laminate", "Gloss Laminate",
  "Natural Stone", "Marble", "Fluted Panels", "Fabric", "Glass", "Metal", "Concrete",
];

export const LIGHTING_OPTIONS = [
  { id: "warm_ambient", label: "Warm Ambient" },
  { id: "bright", label: "Bright & Airy" },
  { id: "indirect", label: "Indirect / Cove" },
  { id: "decorative", label: "Decorative Fixtures" },
  { id: "minimal_lighting", label: "Minimal Lighting" },
  { id: "dramatic", label: "Dramatic Accent" },
];

export const FURNITURE_OPTIONS = [
  { id: "minimal", label: "Minimal & Streamlined" },
  { id: "soft_curves", label: "Soft & Curved" },
  { id: "heavy_luxurious", label: "Heavy & Luxurious" },
  { id: "contemporary", label: "Contemporary" },
  { id: "wooden", label: "Wood-Forward" },
  { id: "straight_line", label: "Straight-Line" },
];

export const ORNAMENTATION_OPTIONS = [
  { id: "very_minimal", label: "Very Minimal", description: "Bare essentials only" },
  { id: "minimal", label: "Minimal", description: "Subtle details" },
  { id: "moderate", label: "Moderate", description: "Balanced decoration" },
  { id: "decorative", label: "Decorative", description: "Rich in detail" },
  { id: "highly_detailed", label: "Highly Detailed", description: "Maximum ornamentation" },
];
