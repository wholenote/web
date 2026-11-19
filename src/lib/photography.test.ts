import { describe, expect, it } from "vitest";
import { canonicalCountryName, isCorrectCountryGuess, normalizeCountryName, chooseDailyPhotos, dailyPhotoDate, answerDailyPhoto, photoGameScore, restoreDailyPhotoProgress } from "./photography";
import { photographs } from "../data/photography";

describe("photography country guesses", () => {
  it("normalizes punctuation, accents, and capitalization", () => {
    expect(normalizeCountryName("  Côte d’Ivoire ")).toBe("cote d ivoire");
    expect(normalizeCountryName("BOSNIA & HERZEGOVINA")).toBe("bosnia and herzegovina");
  });

  it("accepts common country aliases", () => {
    expect(canonicalCountryName("USA")).toBe("united states");
    expect(isCorrectCountryGuess("UK", "United Kingdom")).toBe(true);
    expect(isCorrectCountryGuess("Czech Republic", "Czechia")).toBe(true);
  });

  it("rejects a different country", () => {
    expect(isCorrectCountryGuess("Japan", "South Korea")).toBe(false);
  });
});

describe("daily photo game", () => {
  const day = "2026-11-17";
  const pool = Array.from({ length: 20 }, (_, i) => ({ id: String(i), country: "Japan" }));
  const daily = chooseDailyPhotos(pool, day);
  const fresh = () => restoreDailyPhotoProgress(null, day, daily);

  it("selects five distinct photographs without changing the source library", () => {
    const ids = pool.map(photo => photo.id);
    expect(daily).toHaveLength(5);
    expect(new Set(daily.map(photo => photo.id)).size).toBe(5);
    expect(pool.map(photo => photo.id)).toEqual(ids);
    expect(chooseDailyPhotos(photographs, day)).toHaveLength(5);
    expect(chooseDailyPhotos(pool.slice(0, 4), day)).toEqual([]);
  });

  it("shares the same set regardless of library order and changes it by date", () => {
    expect(chooseDailyPhotos([...pool].reverse(), day)).toEqual(daily);
    expect(chooseDailyPhotos(pool, "2026-11-18")).not.toEqual(daily);
    expect(dailyPhotoDate(new Date("2026-11-17T23:59:59Z"))).toBe(day);
    expect(dailyPhotoDate(new Date("2026-11-18T00:00:00Z"))).toBe("2026-11-18");
  });

  it("allows one scored answer per photo and prevents skipping ahead", () => {
    const start = fresh();
    expect(answerDailyPhoto(start, daily, 1, "Japan")).toBe(start);
    const answered = answerDailyPhoto(start, daily, 0, "Japan");
    expect(photoGameScore(answered.answers)).toBe(1);
    expect(answerDailyPhoto(answered, daily, 0, "France")).toBe(answered);
    expect(answerDailyPhoto(answered, daily, 0, null)).toBe(answered);
  });

  it("scores a complete game with incorrect answers and skips", () => {
    let progress = fresh();
    for (const [index, guess] of ["Japan", "France", null, "Japan", "Spain"].entries()) {
      progress = answerDailyPhoto(progress, daily, index, guess);
    }
    expect(progress.answers.map(answer => answer.outcome)).toEqual(["correct", "incorrect", "skipped", "correct", "incorrect"]);
    expect(photoGameScore(progress.answers)).toBe(2);
    expect(answerDailyPhoto(progress, daily, 5, "Japan")).toBe(progress);
  });

  it("restores progress across refreshes but starts a new game the next day", () => {
    const progress = answerDailyPhoto(fresh(), daily, 0, "Japan");
    expect(restoreDailyPhotoProgress(JSON.stringify(progress), day, daily)).toEqual(progress);
    expect(restoreDailyPhotoProgress(JSON.stringify(progress), "2026-11-18", daily).answers).toEqual([]);
    expect(restoreDailyPhotoProgress(JSON.stringify(progress), day, [...daily].reverse()).answers).toEqual([]);
  });

  it("recovers from malformed storage and rejects inconsistent scores", () => {
    for (const saved of ["broken json", "null", "{}", JSON.stringify({ ...fresh(), answers: [{ guess: "France", outcome: "correct" }] }), JSON.stringify({ ...fresh(), answers: [{ guess: "Japan", outcome: "correct" }, null] })]) {
      expect(restoreDailyPhotoProgress(saved, day, daily)).toEqual(fresh());
    }
  });
});
