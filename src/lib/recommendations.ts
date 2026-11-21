import type {
  Recommendation,
  RecommendationPrice,
  RecommendationTier,
} from "../data/recommendations";

export const WORLD_VIEW = "world";

export function filterRecommendations(
  items: Recommendation[],
  cityId: string,
  category: string,
  tier: RecommendationTier | "all" = "all",
  price: RecommendationPrice | "All" = "All",
) {
  if (cityId === WORLD_VIEW) return [...items];
  return items.filter(
    (item) => item.cityId === cityId
      && (category === "All" || item.category === category)
      && (tier === "all" || item.tier === tier)
      && (price === "All" || item.price === price),
  );
}

/** Group nearby map points at the current zoom without losing any restaurants. */
export function groupMapRecommendations(
  items: Recommendation[],
  project: (item: Recommendation) => { x: number; y: number },
  radius = 48,
) {
  const groups: { point: { x: number; y: number }; items: Recommendation[] }[] = [];
  for (const item of items) {
    const point = project(item);
    const group = groups.find(group => Math.hypot(point.x - group.point.x, point.y - group.point.y) < radius);
    if (group) group.items.push(item);
    else groups.push({ point, items: [item] });
  }
  return groups.map(group => group.items);
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
