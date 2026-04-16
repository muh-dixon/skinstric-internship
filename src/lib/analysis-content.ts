export type AnalysisDetail = {
  label: string;
  value: string;
};

export type AnalysisCategory = {
  slug: string;
  title: string;
  summary: string;
  score: number;
  accent: string;
  insight: string;
  nextStep: string;
  details?: AnalysisDetail[];
};

export type PhaseTwoBuckets = Record<string, number>;

export type PhaseTwoData = {
  race: PhaseTwoBuckets;
  age: PhaseTwoBuckets;
  gender: PhaseTwoBuckets;
};

export type PhaseTwoApiResponse = {
  message?: string;
  data?: PhaseTwoData;
};

export const STORAGE_KEYS = {
  userName: "skinstric.userName",
  userLocation: "skinstric.userLocation",
  phaseTwoResult: "skinstric.phaseTwoResult",
} as const;

const fallbackAnalysisCategories: AnalysisCategory[] = [
  {
    slug: "demographics",
    title: "Demographics",
    summary: "Estimated age range, skin presentation, and general profile markers.",
    score: 84,
    accent: "#E1E1E2",
    insight:
      "The scan estimates a balanced profile with no major demographic anomalies affecting the reading.",
    nextStep:
      "Adjust the estimate if needed so later recommendations stay aligned with your context.",
    details: [
      { label: "Primary age range", value: "30-39" },
      { label: "Primary gender", value: "Male" },
      { label: "Primary race estimate", value: "East Asian" },
    ],
  },
  {
    slug: "skin-type-details",
    title: "Skin Type Details",
    summary: "Surface balance, oil distribution, and overall skin type signals.",
    score: 79,
    accent: "#F3F3F4",
    insight:
      "The scan suggests combination-leaning skin with a relatively stable barrier and mild zone variation.",
    nextStep:
      "Confirm the estimate before moving on so the routine can be tailored more accurately.",
  },
  {
    slug: "cosmetic-concerns",
    title: "Cosmetic Concerns",
    summary: "Potential concerns identified from visible texture, tone, and clarity cues.",
    score: 73,
    accent: "#F3F3F4",
    insight:
      "Minor concerns appear concentrated around clarity and texture rather than severe irritation or dryness.",
    nextStep:
      "Review and correct any concern tags that feel inaccurate before generating the summary.",
  },
  {
    slug: "weather",
    title: "Weather",
    summary: "Environmental conditions that may affect your routine recommendations.",
    score: 76,
    accent: "#F3F3F4",
    insight:
      "The current weather profile suggests a routine that should account for daily exposure and moisture loss.",
    nextStep:
      "Confirm your location details so the summary can match the right environmental conditions.",
    details: [{ label: "Current location", value: "Location not provided" }],
  },
];

export function formatBucketLabel(label: string) {
  if (/^\d+\s*-\s*\d+$/.test(label)) {
    return label.replace(/\s*-\s*/g, "-");
  }

  return label
    .split(/[\s_-]+/)
    .map((part) => {
      if (!part) {
        return part;
      }

      if (/^\d/.test(part)) {
        return part.toUpperCase();
      }

      return part[0].toUpperCase() + part.slice(1).toLowerCase();
    })
    .join(" ");
}

export function toPercent(value: number) {
  return `${(value * 100).toFixed(2)}%`;
}

export function rankBuckets(buckets: PhaseTwoBuckets) {
  return Object.entries(buckets)
    .sort(([, a], [, b]) => b - a)
    .map(([label, value]) => ({
      rawLabel: label,
      label: formatBucketLabel(label),
      value,
      percent: toPercent(value),
    }));
}

export function normalizeBase64Image(image: string) {
  const marker = "base64,";
  const markerIndex = image.indexOf(marker);

  if (markerIndex === -1) {
    return image;
  }

  return image.slice(markerIndex + marker.length);
}

export function parseStoredPhaseTwoResult(raw: string | null) {
  if (!raw) {
    return null;
  }

  try {
    const parsed = JSON.parse(raw) as PhaseTwoData;

    if (
      parsed &&
      typeof parsed === "object" &&
      parsed.race &&
      parsed.age &&
      parsed.gender
    ) {
      return parsed;
    }
  } catch {
    return null;
  }

  return null;
}

export function getAnalysisCategories({
  phaseTwoData,
  location,
}: {
  phaseTwoData?: PhaseTwoData | null;
  location?: string | null;
} = {}) {
  const categories = fallbackAnalysisCategories.map((category) => ({ ...category }));

  if (!phaseTwoData) {
    const weatherCategory = categories.find((category) => category.slug === "weather");

    if (weatherCategory && location) {
      weatherCategory.summary = `Environmental conditions around ${location} may affect your routine recommendations.`;
      weatherCategory.details = [{ label: "Current location", value: location }];
    }

    return categories;
  }

  const rankedRace = rankBuckets(phaseTwoData.race);
  const rankedAge = rankBuckets(phaseTwoData.age);
  const rankedGender = rankBuckets(phaseTwoData.gender);

  const topRace = rankedRace[0];
  const topAge = rankedAge[0];
  const topGender = rankedGender[0];

  const demographicsCategory = categories.find(
    (category) => category.slug === "demographics",
  );

  if (demographicsCategory && topRace && topAge && topGender) {
    const confidence = Math.max(topRace.value, topAge.value, topGender.value);

    demographicsCategory.summary = `The phase 2 scan currently leans ${topAge.label}, ${topGender.label}, and ${topRace.label}.`;
    demographicsCategory.score = Math.round(confidence * 100);
    demographicsCategory.insight = `Top model estimates are ${topAge.label} (${topAge.percent}), ${topGender.label} (${topGender.percent}), and ${topRace.label} (${topRace.percent}).`;
    demographicsCategory.nextStep =
      "If any of these estimates look off, update them before moving on so the summary reflects your actual profile.";
    demographicsCategory.details = [
      { label: "Age ranking", value: rankedAge.map((item) => `${item.label} ${item.percent}`).join(" / ") },
      { label: "Gender ranking", value: rankedGender.map((item) => `${item.label} ${item.percent}`).join(" / ") },
      { label: "Race ranking", value: rankedRace.map((item) => `${item.label} ${item.percent}`).join(" / ") },
    ];
  }

  const skinTypeCategory = categories.find(
    (category) => category.slug === "skin-type-details",
  );

  if (skinTypeCategory && topAge && topGender) {
    skinTypeCategory.summary = `Using the current scan profile, the routine will be tuned around ${topAge.label} and ${topGender.label} presentation signals.`;
    skinTypeCategory.insight =
      "This category is still visually staged, but it now receives its base user profile from the phase 2 analysis response.";
  }

  const concernsCategory = categories.find(
    (category) => category.slug === "cosmetic-concerns",
  );

  if (concernsCategory && topRace) {
    concernsCategory.summary = `Concern scoring is being staged with the current profile estimate leaning ${topRace.label}.`;
    concernsCategory.insight =
      "This section is still using placeholder concern logic, but it is now anchored to the latest uploaded-image analysis.";
  }

  const weatherCategory = categories.find((category) => category.slug === "weather");

  if (weatherCategory) {
    if (location) {
      weatherCategory.summary = `Environmental conditions around ${location} may affect your routine recommendations.`;
      weatherCategory.insight = `Weather-aware recommendations will use ${location} as the active location context.`;
      weatherCategory.details = [{ label: "Current location", value: location }];
    } else {
      weatherCategory.details = [{ label: "Current location", value: "Location not provided" }];
    }
  }

  return categories;
}

export const analysisCategories: AnalysisCategory[] = getAnalysisCategories();

export const milestones = [
  "Intro and onboarding flow",
  "Camera capture and image confirmation",
  "Results dashboard with category cards",
  "Detail pages for each category insight",
];
