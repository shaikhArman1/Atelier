import type { ConceptGenerationInput, FloorPlanAnalysis, PreferenceProfile } from "@/types";

export const PROMPT_VERSION = "v1.0";

export function buildConceptPrompt(input: ConceptGenerationInput): string {
  const { room, element, preferenceProfile, selectedReferences, floorPlanAnalysis, designerInstructions, refinementInstruction } = input;

  const roomLabel = room.replace(/_/g, " ");
  const styleList = preferenceProfile.overallStyle?.join(", ") || "minimal modern";
  const paletteList = preferenceProfile.palette?.join(", ") || "warm neutrals, beige";
  const materialsList = preferenceProfile.materials?.join(", ") || "natural materials";
  const lightingList = preferenceProfile.lighting?.join(", ") || "warm ambient";
  const avoidList = preferenceProfile.avoid?.join(", ") || "";
  const refCount = selectedReferences.length;

  let spatialContext = "";
  if (floorPlanAnalysis) {
    const detectedRoom = floorPlanAnalysis.rooms.find(r => r.name.toLowerCase().includes(roomLabel.toLowerCase()));
    if (detectedRoom?.approxDimensions) {
      spatialContext = `Room dimensions approximately ${detectedRoom.approxDimensions.widthFt}ft x ${detectedRoom.approxDimensions.lengthFt}ft. `;
      const openings = detectedRoom.openings.map(o => `${o.type} on ${o.wall} wall`).join(", ");
      if (openings) spatialContext += `Openings: ${openings}. `;
    }
  }

  const basePrompt = `Create a photorealistic interior design visualization of a ${roomLabel}${element ? `, focused on the ${element}` : ""}.

Design style: ${styleList}
Colour palette: ${paletteList}  
Primary materials: ${materialsList}
Lighting character: ${lightingList}
${avoidList ? `Avoid: ${avoidList}` : ""}
${spatialContext}
${refCount > 0 ? `Use ${refCount} selected references as visual inspiration for style, materials, and composition.` : ""}
${designerInstructions ? `Designer instructions: ${designerInstructions}` : ""}
${refinementInstruction ? `Refinement: ${refinementInstruction}` : ""}

Requirements:
- Photorealistic professional interior photography quality
- Realistic materials, lighting, shadows, and reflections
- Coherent furniture scale and proportions
- Clean architectural composition
- No text, watermarks, or overlays
- Preserve all existing architectural openings (doors, windows)
- Avoid impossible construction or malformed furniture
- Premium architectural visualization quality`;

  return basePrompt;
}

export function buildFloorPlanPrompt(targetRoom?: string): string {
  return `Analyze this architectural floor plan and extract structured spatial information.

${targetRoom ? `Focus particularly on the ${targetRoom}.` : "Analyze all visible rooms."}

For each room you can identify, extract:
1. Room name/label as written on the plan
2. Room type (bedroom, living room, kitchen, bathroom, dining, foyer, balcony, etc.)
3. Approximate dimensions in feet (estimate if not labeled)
4. All door openings (wall position: north/south/east/west, approximate width)
5. All window openings (wall position, approximate width)
6. Spatial relationships between rooms

Return ONLY valid JSON in this exact structure:
{
  "rooms": [
    {
      "name": "Master Bedroom",
      "roomType": "master_bedroom",
      "approxDimensions": { "widthFt": 12, "lengthFt": 14 },
      "openings": [
        { "type": "window", "wall": "east", "approxWidthFt": 5 },
        { "type": "door", "wall": "south", "approxWidthFt": 3 }
      ],
      "position": { "x": 0.5, "y": 0.2, "width": 0.3, "height": 0.4 }
    }
  ],
  "overallDimensions": { "widthFt": 60, "lengthFt": 45 },
  "confidence": 0.75,
  "notes": "Dimensions estimated from scale. North orientation assumed."
}

Be honest about uncertainty. Use confidence 0-1 (0.9 = very clear plan, 0.5 = unclear/complex).`;
}

export function buildSummaryPrompt(data: {
  clientName: string;
  projectName: string;
  propertyType: string;
  profile: Partial<PreferenceProfile>;
  rooms: string[];
  concepts: number;
  notes: string[];
}): string {
  return `Generate a professional interior design consultation summary brief.

Client: ${data.clientName}
Project: ${data.projectName} (${data.propertyType})
Rooms discussed: ${data.rooms.join(", ")}
Concepts generated: ${data.concepts}

Preference Profile:
- Overall Style: ${data.profile.overallStyle?.join(", ")}
- Colour Palette: ${data.profile.palette?.join(", ")}
- Materials: ${data.profile.materials?.join(", ")}
- Lighting: ${data.profile.lighting?.join(", ")}
- Furniture character: ${data.profile.furniture?.join(", ")}
- Ornamentation level: ${data.profile.ornamentation}
- Avoid: ${data.profile.avoid?.join(", ")}

Designer notes: ${data.notes.join("; ")}

Write a concise, professional consultation summary that:
1. Describes the overall design direction
2. Lists preferred palette and materials
3. Notes room-specific preferences
4. Lists elements to avoid
5. Captures next steps

Format as a clean structured brief (not JSON). Use clear section headers. Professional interior design language.`;
}
