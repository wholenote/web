import type { Recommendation, RecommendationTier } from "../data/recommendations";

export function filterRecommendations(
  items: Recommendation[],
  cityId: string,
  category: string,
  tier: RecommendationTier | "all" = "all",
) {
  return items.filter(
    (item) => item.cityId === cityId
      && (category === "All" || item.category === category)
      && (tier === "all" || item.tier === tier),
  );
}

export function firstVisibleRecommendation(
  items: Recommendation[],
  cityId: string,
  category: string,
  tier: RecommendationTier | "all" = "all",
) {
  return filterRecommendations(items, cityId, category, tier)[0] ?? null;
}
