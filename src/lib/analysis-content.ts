export type AnalysisCategory = {
  slug: string;
  title: string;
  summary: string;
  score: number;
  accent: string;
  insight: string;
  nextStep: string;
};

export const analysisCategories: AnalysisCategory[] = [
  {
    slug: "hydration",
    title: "Hydration",
    summary: "Moisture balance across the skin surface",
    score: 78,
    accent: "#D97757",
    insight:
      "Hydration looks fairly stable, with mild dryness around the cheeks and jawline.",
    nextStep: "Introduce a lightweight hydration layer before sealing with moisturizer.",
  },
  {
    slug: "texture",
    title: "Texture",
    summary: "Visible smoothness and surface refinement",
    score: 64,
    accent: "#B77945",
    insight:
      "The forehead and nose show a little unevenness that can be softened with consistent exfoliation.",
    nextStep: "Use a gentle chemical exfoliant two to three times per week.",
  },
  {
    slug: "tone",
    title: "Tone",
    summary: "Overall evenness and visual balance",
    score: 82,
    accent: "#8A3F2E",
    insight:
      "Tone appears even overall, with only minor discoloration near high-movement areas.",
    nextStep: "Maintain sunscreen use daily to protect the current tone consistency.",
  },
  {
    slug: "pores",
    title: "Pores",
    summary: "Pore visibility in central facial zones",
    score: 71,
    accent: "#A8553A",
    insight:
      "Pore visibility is concentrated around the nose and inner cheek area, which is common in combination skin.",
    nextStep: "Add a balancing cleanser and a niacinamide-based serum.",
  },
];

export const milestones = [
  "Intro and onboarding flow",
  "Camera capture and image confirmation",
  "Results dashboard with category cards",
  "Detail pages for each category insight",
];
