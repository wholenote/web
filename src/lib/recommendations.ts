import type {
  Recommendation,
  RecommendationPrice,
  RecommendationTier,
} from "../data/recommendations";

export function filterRecommendations(
  items: Recommendation[],
  cityId: string,
  category: string,
  tier: RecommendationTier | "all" = "all",
  price: RecommendationPrice | "All" = "All",
) {
  return items.filter(
    (item) => item.cityId === cityId
      && (category === "All" || item.category === category)
      && (tier === "all" || item.tier === tier)
      && (price === "All" || item.price === price),
  );
}

export function firstVisibleRecommendation(
  items: Recommendation[],
  cityId: string,
  category: string,
  tier: RecommendationTier | "all" = "all",
  price: RecommendationPrice | "All" = "All",
) {
  return filterRecommendations(items, cityId, category, tier, price)[0] ?? null;
}
