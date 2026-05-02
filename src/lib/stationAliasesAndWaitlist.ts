
export const stationAliasMap: Record<string, { code: string; primary: string }> = {
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

export function searchStationWithAliases(
  query: string,
  stations: Array<{ code: string; name: string; city: string }>
) {
  const q = query.toLowerCase().trim();
  
  if (!q) return [];
  
  const results = [];
  const seen = new Set<string>();

  const exactCodeMatch = stations.find((s) => s.code.toLowerCase() === q);
  if (exactCodeMatch && !seen.has(exactCodeMatch.code)) {
    results.push({ ...exactCodeMatch, confidence: 1.0 });
    seen.add(exactCodeMatch.code);
  }
  
  if (stationAliasMap[q]) {
    const aliasMatch = stations.find((s) => s.code === stationAliasMap[q].code);
    if (aliasMatch && !seen.has(aliasMatch.code)) {
      results.push({ ...aliasMatch, confidence: 0.95 });
      seen.add(aliasMatch.code);
    }
  }
  
  const namePrefix = stations.filter((s) =>
    s.name.toLowerCase().startsWith(q) && !seen.has(s.code)
  );
  namePrefix.forEach((s) => {
    results.push({ ...s, confidence: 0.9 });
    seen.add(s.code);
  });

  const cityPrefix = stations.filter((s) =>
    s.city.toLowerCase().startsWith(q) && !seen.has(s.code)
  );
  cityPrefix.forEach((s) => {
    results.push({ ...s, confidence: 0.8 });
    seen.add(s.code);
  });

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
}
export function getWaitlistProbability(trainCode: string, classCode: string) {
  const trainData = waitlistProbabilityData[trainCode];
  if (!trainData) {

    return { percentage: 45, daysToConfirm: 7, confidence: "LOW" };
  }
  
  const classData = trainData[classCode];
  if (!classData) {
    return { percentage: 50, daysToConfirm: 5, confidence: "MEDIUM" };
  }
  
  const confidence =
    classData.percentage >= 80 ? "HIGH" :
    classData.percentage >= 60 ? "MEDIUM" : "LOW";
  
  return {
    percentage: classData.percentage,
    daysToConfirm: classData.daysToConfirm,
    confidence,
  };
}


export function getWaitlistMessage(percentage: number): string {
  if (percentage >= 80) return "Very likely to confirm";
  if (percentage >= 60) return "Likely to confirm";
  if (percentage >= 40) return "May confirm";
  return "Unlikely to confirm";
}

export function getWaitlistGradient(
  percentage: number
): { from: string; to: string } {
  if (percentage >= 80) {
    return { from: "#4ade80", to: "#22c55e" };
  }
  if (percentage >= 60) {
    return { from: "#fbbf24", to: "#f59e0b" };
  }
  return { from: "#fb923c", to: "#f97316" };
}
