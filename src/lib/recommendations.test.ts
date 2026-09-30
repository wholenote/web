import { describe, expect, it } from "vitest";
import { recommendations } from "../data/recommendations";
import { filterRecommendations, firstVisibleRecommendation } from "./recommendations";

describe("recommendation filters", () => {
  it("returns every recommendation in the selected city", () => {
    expect(filterRecommendations(recommendations, "austin", "All")).toHaveLength(26);
  });

  it("combines city and category filters", () => {
    const filtered = filterRecommendations(recommendations, "austin", "Japanese");
    expect(filtered.map((item) => item.id)).toEqual([
      "uchi",
      "sushi-yume",
      "choo-sando",
      "sazan-ramen",
    ]);
  });

  it("keeps Houston recommendations separate from Austin", () => {
    const filtered = filterRecommendations(recommendations, "houston", "All");
    expect(filtered.map((item) => item.id)).toEqual([
      "agas",
      "mala-sichuan",
      "hus-cooking",
      "mensho-houston",
    ]);
  });

  it("filters recommendation tiers independently", () => {
    const recommended = filterRecommendations(recommendations, "austin", "All", "recommended");
    const favorites = filterRecommendations(recommendations, "austin", "All", "favorite");

    expect(recommended.map((item) => item.id)).toEqual([
      "p-thais",
      "sushi-yume",
      "interstellar-bbq",
      "usta-kababgy",
      "mian-and-bao",
      "allday-pizza",
      "soha",
      "aba-austin",
      "mezzeme",
      "choo-sando",
      "lau-lau",
      "cafe-du-bliss",
      "old-alley-hot-pot",
      "an-nyeong-k-tofu-bbq",
      "sazan-ramen",
      "jewboy-burgers",
      "tan-my",
      "banh-mi-oven",
      "breakfast-house",
      "new-fortune-2",
      "uncle-tetsu",
      "cosmic-saltillo",
      "heavens-bistro-bakery",
    ]);
    expect(favorites.map((item) => item.id)).toEqual(["uchi", "chicha-san-chen", "odd-duck"]);
  });

  it("keeps the six explicit favorites and no others", () => {
    expect(recommendations.filter((item) => item.tier === "favorite").map((item) => item.id)).toEqual([
      "uchi",
      "chicha-san-chen",
      "odd-duck",
      "agas",
      "mala-sichuan",
      "hells-kitchen-las-vegas",
    ]);
  });

  it("returns null when a filter has no matches", () => {
    expect(firstVisibleRecommendation(recommendations, "unknown", "All")).toBeNull();
  });
});
