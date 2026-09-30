import { describe, expect, it } from "vitest";
import { cities, recommendations } from "../data/recommendations";
import { filterRecommendations, firstVisibleRecommendation } from "./recommendations";

describe("recommendation filters", () => {
  it("uses unique restaurant IDs and valid city references", () => {
    const recommendationIds = recommendations.map((item) => item.id);
    const cityIds = new Set(cities.map((city) => city.id));

    expect(new Set(recommendationIds).size).toBe(recommendationIds.length);
    expect(recommendations.every((item) => cityIds.has(item.cityId))).toBe(true);
  });

  it("returns every recommendation in the selected city", () => {
    expect(filterRecommendations(recommendations, "austin", "All")).toHaveLength(28);
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
      "pho-ben-sugar-land",
      "gaos-bbq",
      "liuyishou-houston",
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
      "sangam-chettinad",
      "loro-austin",
    ]);
    expect(favorites.map((item) => item.id)).toEqual(["uchi", "chicha-san-chen", "odd-duck"]);
  });

  it("filters recommendations by price", () => {
    const budget = filterRecommendations(recommendations, "austin", "All", "all", "$");

    expect(budget.map((item) => item.id)).toEqual([
      "cafe-du-bliss",
      "banh-mi-oven",
      "breakfast-house",
      "uncle-tetsu",
    ]);
  });

  it("combines price with category and tier filters", () => {
    const filtered = filterRecommendations(
      recommendations,
      "austin",
      "Japanese",
      "favorite",
      "$$$$",
    );

    expect(filtered.map((item) => item.id)).toEqual(["uchi"]);
  });

  it("keeps the explicit favorites and no others", () => {
    expect(recommendations.filter((item) => item.tier === "favorite").map((item) => item.id)).toEqual([
      "uchi",
      "chicha-san-chen",
      "odd-duck",
      "agas",
      "mala-sichuan",
      "hells-kitchen-las-vegas",
      "cheli-flushing",
      "aba-chicago",
      "lou-malnatis-south-loop",
      "reunion-bakery-south-pearl",
    ]);
  });

  it("keeps the requested order notes", () => {
    const orders = Object.fromEntries(recommendations.map((item) => [item.id, item.order]));

    expect(orders["sangam-chettinad"]).toBe("Dosa, Butter Chicken, Chicken 65");
    expect(orders["pho-ben-sugar-land"]).toBe("Broken Rice Plates");
    expect(orders["hells-kitchen-las-vegas"]).toBe(
      "Scallops, Bone Marrow, Lobster Risotto, Sticky Toffee Pudding",
    );
    expect(orders["reunion-bakery-south-pearl"]).toBe("Egg Tart");
  });

  it("returns null when a filter has no matches", () => {
    expect(firstVisibleRecommendation(recommendations, "unknown", "All")).toBeNull();
  });
});
