import { describe, expect, it } from "vitest";
import { cities, recommendations, restaurantFlagIcons, restaurantCuisineCountries } from "../data/recommendations";
import { WORLD_VIEW, filterRecommendations, firstVisibleRecommendation, groupMapRecommendations } from "./recommendations";

describe("recommendation filters", () => {
  it("shows every city in world view despite previously selected city filters", () => {
    const world = filterRecommendations(recommendations, WORLD_VIEW, "Japanese", "favorite", "$$$$");
    expect(world).toEqual(recommendations);
    expect(new Set(world.map(item => item.cityId)).size).toBe(cities.length);
    expect(world).not.toBe(recommendations);
  });

  it("groups nearby map points while leaving distant restaurants individually reachable", () => {
    const items = recommendations.slice(0, 3);
    const points = [{ x: 10, y: 10 }, { x: 22, y: 15 }, { x: 160, y: 140 }];
    const groups = groupMapRecommendations(items, item => points[items.indexOf(item)]!);
    expect(groups.map(group => group.map(item => item.id))).toEqual([
      [items[0]!.id, items[1]!.id], [items[2]!.id],
    ]);
  });

  it("keeps every recommendation exactly once across map clusters", () => {
    const groups = groupMapRecommendations(recommendations, item => ({
      x: item.coordinates.lng * 10, y: item.coordinates.lat * 10,
    }));
    const ids = groups.flat().map(item => item.id);
    expect(ids.sort()).toEqual(recommendations.map(item => item.id).sort());
    expect(new Set(ids).size).toBe(recommendations.length);
    expect(groupMapRecommendations([], () => ({ x: 0, y: 0 }))).toEqual([]);
  });

  it("groups adjacent points even across a projected grid boundary", () => {
    const items = recommendations.slice(0, 2);
    const groups = groupMapRecommendations(items, item => ({
      x: item === items[0] ? 47 : 49, y: 48,
    }));
    expect(groups).toEqual([items]);
  });
  it("uses local country flags for every restaurant, including broad and mixed cuisines", () => {
    for (const item of recommendations) {
      const icons = restaurantFlagIcons(item);
      const paths = [...icons.matchAll(/src="(\/flags\/[a-z]{2}\.svg)"/g)];
      expect(paths).toHaveLength(restaurantCuisineCountries(item).length);
      expect(paths.length).toBeGreaterThan(0);
      expect(icons.replace(/<img[^>]+\/>/g, "")).toBe("");
    }
    const tea = recommendations.find(item => item.id === "chicha-san-chen")!;
    expect(restaurantCuisineCountries(tea)).toEqual(["Taiwan"]);
    const barbecue = recommendations.find(item => item.id === "gan-hoo-bbq-flushing")!;
    expect(restaurantCuisineCountries(barbecue)).toEqual(["China", "South Korea", "Japan"]);
  });
  it("uses unique restaurant IDs and valid city references", () => {
    const recommendationIds = recommendations.map((item) => item.id);
    const cityIds = new Set(cities.map((city) => city.id));

    expect(new Set(recommendationIds).size).toBe(recommendationIds.length);
    expect(recommendations.every((item) => cityIds.has(item.cityId))).toBe(true);
  });

  it("returns every recommendation in the selected city", () => {
    expect(filterRecommendations(recommendations, "austin", "All")).toHaveLength(30);
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

  it("keeps Las Vegas recommendations and corrected map locations", () => {
    expect(filterRecommendations(recommendations, "las-vegas", "All").map((item) => item.id)).toEqual([
      "hells-kitchen-las-vegas",
      "secret-pizza-las-vegas",
    ]);

    const aba = recommendations.find((item) => item.id === "aba-austin");
    expect(aba?.coordinates.lat).toBeCloseTo(30.2530792);
    expect(aba?.coordinates.lng).toBeCloseTo(-97.7478012);
  });

  it("filters recommendation tiers independently", () => {
    const recommended = filterRecommendations(recommendations, "austin", "All", "recommended");
    const favorites = filterRecommendations(recommendations, "austin", "All", "favorite");

    expect(recommended.map((item) => item.id)).toEqual([
      "p-thais",
      "allday-pizza",
      "aba-austin",
      "mezzeme",
      "choo-sando",
      "lau-lau",
      "old-alley-hot-pot",
      "an-nyeong-k-tofu-bbq",
      "sazan-ramen",
      "jewboy-burgers",
      "tan-my",
      "banh-mi-oven",
      "breakfast-house",
      "uncle-tetsu",
      "cosmic-saltillo",
      "heavens-bistro-bakery",
      "sangam-chettinad",
      "loro-austin",
      "doc-bs-austin",
      "haywire-austin",
    ]);
    expect(favorites.map((item) => item.id)).toEqual([
      "uchi",
      "sushi-yume",
      "interstellar-bbq",
      "usta-kababgy",
      "mian-and-bao",
      "soha",
      "cafe-du-bliss",
      "chicha-san-chen",
      "odd-duck",
      "new-fortune-2",
    ]);
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
      "sushi-yume",
      "interstellar-bbq",
      "usta-kababgy",
      "mian-and-bao",
      "soha",
      "cafe-du-bliss",
      "chicha-san-chen",
      "odd-duck",
      "agas",
      "hus-cooking",
      "hells-kitchen-las-vegas",
      "new-fortune-2",
      "los-tacos-no-1-times-square",
      "cheli-flushing",
      "mountain-house-times-square",
      "eight-jane-flushing",
      "skinny-louie-east-village",
      "aba-chicago",
      "lou-malnatis-south-loop",
      "reunion-bakery-south-pearl",
      "sizzle-and-crunch-university-district",
      "19-gold-fremont",
      "saison-bakery-coffee-gotanda",
      "new-matsuzaka-shinjukuten",
      "isegen-kanda",
      "old-chengdu-rome",
      "vivoli-florence",
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
