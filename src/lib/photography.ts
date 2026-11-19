const aliases: Record<string, string> = {
  america: "united states",
  britain: "united kingdom",
  burma: "myanmar",
  congo: "republic of the congo",
  "cote d ivoire": "ivory coast",
  "cote divoire": "ivory coast",
  "czech republic": "czechia",
  "drc": "democratic republic of the congo",
  "east timor": "timor leste",
  england: "united kingdom",
  holland: "netherlands",
  macao: "macau",
  "republic of korea": "south korea",
  russia: "russia",
  "south korea": "south korea",
  swaziland: "eswatini",
  uae: "united arab emirates",
  uk: "united kingdom",
  usa: "united states",
  us: "united states",
  "united states of america": "united states",
};

export const normalizeCountryName = (value: string) =>
  value
    .normalize("NFKD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/&/g, " and ")
    .replace(/[^a-z0-9]+/g, " ")
    .trim();

export const canonicalCountryName = (value: string) => {
  const normalized = normalizeCountryName(value);
  return aliases[normalized] ?? normalized;
};

export const isCorrectCountryGuess = (guess: string, answer: string) =>
  canonicalCountryName(guess) === canonicalCountryName(answer);

export const DAILY_PHOTO_COUNT = 5;
export const dailyPhotoDate = (date = new Date()) => date.toISOString().slice(0, 10);

/** A date-seeded shuffle gives every visitor the same five distinct frames for the UTC day. */
export function chooseDailyPhotos<T extends { id: string }>(photos: readonly T[], day: string): T[] {
  if (photos.length < DAILY_PHOTO_COUNT) return [];
  const shuffled = [...photos].sort((a, b) => a.id.localeCompare(b.id));
  let seed = 2166136261;
  for (const char of `daily-photos-v1:${day}`) seed = Math.imul(seed ^ char.charCodeAt(0), 16777619);
  const random = () => {
    seed += 0x6d2b79f5;
    let value = Math.imul(seed ^ (seed >>> 15), 1 | seed);
    value ^= value + Math.imul(value ^ (value >>> 7), 61 | value);
    return ((value ^ (value >>> 14)) >>> 0) / 4294967296;
  };
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j]!, shuffled[i]!];
  }
  return shuffled.slice(0, DAILY_PHOTO_COUNT);
}

export type PhotoOutcome = "correct" | "incorrect" | "skipped";
export interface DailyPhotoAnswer { guess: string; outcome: PhotoOutcome }
export interface DailyPhotoProgress { day: string; photoIds: string[]; answers: DailyPhotoAnswer[] }

export const photoGameScore = (answers: readonly DailyPhotoAnswer[]) =>
  answers.filter(answer => answer.outcome === "correct").length;

/** Only the next unanswered round can be scored; revisiting a frame never changes its result. */
export function answerDailyPhoto(
  progress: DailyPhotoProgress,
  photos: readonly { id: string; country: string }[],
  index: number,
  guess: string | null,
): DailyPhotoProgress {
  const photo = photos[index];
  if (!photo || index !== progress.answers.length || progress.photoIds[index] !== photo.id) return progress;
  const answer: DailyPhotoAnswer = {
    guess: guess?.trim() ?? "",
    outcome: guess === null ? "skipped" : isCorrectCountryGuess(guess, photo.country) ? "correct" : "incorrect",
  };
  return { ...progress, answers: [...progress.answers, answer] };
}

/** Ignore stale, partial, or malformed browser storage without breaking the game. */
export function restoreDailyPhotoProgress(
  saved: string | null, day: string, photos: readonly { id: string; country: string }[],
): DailyPhotoProgress {
  const fresh: DailyPhotoProgress = { day, photoIds: photos.map(photo => photo.id), answers: [] };
  if (!saved) return fresh;
  try {
    const parsed = JSON.parse(saved);
    if (parsed.day !== day || !Array.isArray(parsed.photoIds)
      || JSON.stringify(parsed.photoIds) !== JSON.stringify(fresh.photoIds)
      || !Array.isArray(parsed.answers) || parsed.answers.length > photos.length) return fresh;
    for (const [index, answer] of parsed.answers.entries()) {
      if (!answer || typeof answer.guess !== "string" || answer.guess.length > 100
        || !["correct", "incorrect", "skipped"].includes(answer.outcome)) return { ...fresh, answers: [] };
      const expected = answer.outcome === "skipped" ? "skipped"
        : isCorrectCountryGuess(answer.guess, photos[index]!.country) ? "correct" : "incorrect";
      if (answer.outcome !== expected) return { ...fresh, answers: [] };
      fresh.answers.push({ guess: answer.guess, outcome: answer.outcome });
    }
    return fresh;
  } catch { return { ...fresh, answers: [] }; }
}
