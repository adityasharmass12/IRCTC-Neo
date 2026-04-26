/**
 * Station Aliases & Waitlist Intelligence Utilities
 * Provides smart station matching and waitlist confirmation probability calculations
 */

/**
 * Station alias map for smart autocomplete
 * Maps common names, historical names, and colloquial references to station codes
 */
export const stationAliasMap: Record<string, { code: string; primary: string }> = {
  // Major metros with historical names
  bombay: { code: "BCT", primary: "Mumbai Central" },
  mumbai: { code: "BCT", primary: "Mumbai Central" },
  dadar: { code: "DR", primary: "Dadar" },
  
  // Delhi region
  delhi: { code: "NDLS", primary: "New Delhi" },
  "new delhi": { code: "NDLS", primary: "New Delhi" },
  "delhi junction": { code: "DLI", primary: "Delhi Junction" },
  "old delhi": { code: "DLI", primary: "Delhi Junction" },
  
  // Bangalore
  bangalore: { code: "SBC", primary: "Bangalore City" },
  bengaluru: { code: "SBC", primary: "Bangalore City" },
  
  // Chennai
  "madras": { code: "MAS", primary: "Chennai Central" },
  "chennai": { code: "MAS", primary: "Chennai Central" },
  
  // Kolkata
  kolkata: { code: "HWH", primary: "Howrah" },
  "howrah": { code: "HWH", primary: "Howrah" },
  "calcutta": { code: "HWH", primary: "Howrah" },
  
  // Hyderabad
  hyderabad: { code: "SC", primary: "Secunderabad" },
  secunderabad: { code: "SC", primary: "Secunderabad" },
  
  // Ahmedabad
  ahmedabad: { code: "ADI", primary: "Ahmedabad Junction" },
  
  // Jaipur
  jaipur: { code: "JP", primary: "Jaipur" },
  
  // Lucknow
  lucknow: { code: "LKO", primary: "Lucknow" },
  
  // Patna
  patna: { code: "PNBE", primary: "Patna" },
  
  // Kanpur
  kanpur: { code: "CNB", primary: "Kanpur" },
  
  // Varanasi
  varanasi: { code: "BSB", primary: "Varanasi" },
  
  // Common misspellings and abbreviations
  bct: { code: "BCT", primary: "Mumbai Central" },
  ndls: { code: "NDLS", primary: "New Delhi" },
  sbc: { code: "SBC", primary: "Bangalore City" },
  mas: { code: "MAS", primary: "Chennai Central" },
  hwh: { code: "HWH", primary: "Howrah" },
};

/**
 * Intelligent station search that handles aliases, partial matches, and typos
 */
export function searchStationWithAliases(
  query: string,
  stations: Array<{ code: string; name: string; city: string }>
) {
  const q = query.toLowerCase().trim();
  
  if (!q) return [];
  
  const results = [];
  const seen = new Set<string>();
  
  // 1. Exact code match (fastest, highest priority)
  const exactCodeMatch = stations.find((s) => s.code.toLowerCase() === q);
  if (exactCodeMatch && !seen.has(exactCodeMatch.code)) {
    results.push({ ...exactCodeMatch, confidence: 1.0 });
    seen.add(exactCodeMatch.code);
  }
  
  // 2. Alias match (e.g., "Bombay" → "Mumbai Central")
  if (stationAliasMap[q]) {
    const aliasMatch = stations.find((s) => s.code === stationAliasMap[q].code);
    if (aliasMatch && !seen.has(aliasMatch.code)) {
      results.push({ ...aliasMatch, confidence: 0.95 });
      seen.add(aliasMatch.code);
    }
  }
  
  // 3. Prefix match on station name (e.g., "Mum" → "Mumbai Central")
  const namePrefix = stations.filter((s) =>
    s.name.toLowerCase().startsWith(q) && !seen.has(s.code)
  );
  namePrefix.forEach((s) => {
    results.push({ ...s, confidence: 0.9 });
    seen.add(s.code);
  });
  
  // 4. Prefix match on city (e.g., "Mum" → stations in Mumbai)
  const cityPrefix = stations.filter((s) =>
    s.city.toLowerCase().startsWith(q) && !seen.has(s.code)
  );
  cityPrefix.forEach((s) => {
    results.push({ ...s, confidence: 0.8 });
    seen.add(s.code);
  });
  
  // 5. Substring match anywhere in name or city
  const substring = stations.filter((s) =>
    (s.name.toLowerCase().includes(q) || s.city.toLowerCase().includes(q)) &&
    !seen.has(s.code)
  );
  substring.forEach((s) => {
    results.push({ ...s, confidence: 0.7 });
    seen.add(s.code);
  });
  
  return results;
}

/**
 * Waitlist confirmation probability data (mock for now, would come from backend)
 * Structure: train code → class → confidence data
 */
export const waitlistProbabilityData: Record<
  string,
  Record<string, { percentage: number; daysToConfirm: number }>
> = {
  "12002": {
    "1A": { percentage: 95, daysToConfirm: 1 },
    "2A": { percentage: 85, daysToConfirm: 2 },
    "3A": { percentage: 78, daysToConfirm: 3 },
    SL: { percentage: 65, daysToConfirm: 5 },
  },
  "16015": {
    "1A": { percentage: 78, daysToConfirm: 2 },
    "2A": { percentage: 72, daysToConfirm: 3 },
    "3A": { percentage: 56, daysToConfirm: 7 },
    SL: { percentage: 42, daysToConfirm: 10 },
  },
  "15001": {
    "1A": { percentage: 88, daysToConfirm: 1 },
    "2A": { percentage: 82, daysToConfirm: 2 },
    "3A": { percentage: 70, daysToConfirm: 4 },
    SL: { percentage: 58, daysToConfirm: 6 },
  },
};

/**
 * Get waitlist confirmation probability for a specific train/class combination
 * Returns percentage and expected days to confirmation
 */
export function getWaitlistProbability(trainCode: string, classCode: string) {
  const trainData = waitlistProbabilityData[trainCode];
  if (!trainData) {
    // Default conservative estimate for unknown trains
    return { percentage: 45, daysToConfirm: 7, confidence: "LOW" };
  }
  
  const classData = trainData[classCode];
  if (!classData) {
    // Default for unknown class
    return { percentage: 50, daysToConfirm: 5, confidence: "MEDIUM" };
  }
  
  // Determine confidence level based on percentage
  const confidence =
    classData.percentage >= 80 ? "HIGH" :
    classData.percentage >= 60 ? "MEDIUM" : "LOW";
  
  return {
    percentage: classData.percentage,
    daysToConfirm: classData.daysToConfirm,
    confidence,
  };
}

/**
 * Generate a human-readable message for waitlist probability
 */
export function getWaitlistMessage(percentage: number): string {
  if (percentage >= 80) return "Very likely to confirm";
  if (percentage >= 60) return "Likely to confirm";
  if (percentage >= 40) return "May confirm";
  return "Unlikely to confirm";
}

/**
 * Generate gradient colors for waitlist badge based on probability
 * Orange → Yellow → Green as probability increases
 */
export function getWaitlistGradient(
  percentage: number
): { from: string; to: string } {
  if (percentage >= 80) {
    return { from: "#4ade80", to: "#22c55e" }; // Green
  }
  if (percentage >= 60) {
    return { from: "#fbbf24", to: "#f59e0b" }; // Amber
  }
  return { from: "#fb923c", to: "#f97316" }; // Orange
}
