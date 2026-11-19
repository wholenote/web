import type { Country } from "./countries";

export interface Photograph {
  id: string;
  src: string;
  country: Country;
  /** Kept intentionally neutral so assistive text does not spoil the game. */
  alt: string;
  place?: string;
  year?: string;
  caption?: string;
  thumbnail?: string;
  demo?: boolean;
  credit?: { name: string; url: string };
}

/**
 * Add full-size images to public/photos, then add one object per image here.
 * Each UTC day, five distinct images are selected from this library for the daily game.
 *
 * Example:
 * {
 *   id: "kyoto-evening",
 *   src: "/photos/kyoto-evening.webp",
 *   country: "Japan",
 *   alt: "An evening street scene",
 *   place: "Kyoto",
 *   year: "2025",
 *   caption: "Lantern light after the rain.",
 * },
 */
// Demo images are explicitly labeled in the UI. Replace these entries with Brian's photos.
export const photographs: Photograph[] = [
  {
    id: "demo-01",
    src: "/photos/demo/frame-01.jpg",
    thumbnail: "/photos/demo/frame-01-thumb.jpg",
    country: "Japan",
    alt: "Two people in patterned robes walk along a narrow lane toward a tiered wooden tower.",
    place: "Kyoto",
    demo: true,
    credit: { name: "Sorasak", url: "https://unsplash.com/photos/_UIN-pFfJ7c" },
  },
  {
    id: "demo-02",
    src: "/photos/demo/frame-02.jpg",
    thumbnail: "/photos/demo/frame-02-thumb.jpg",
    country: "France",
    alt: "An iron lattice tower rises above a tree-lined avenue and pale stone buildings.",
    place: "Paris",
    demo: true,
    credit: { name: "Anthony DELANOIX", url: "https://unsplash.com/photos/Q0-fOL2nqZc" },
  },
  {
    id: "demo-03",
    src: "/photos/demo/frame-03.jpg",
    thumbnail: "/photos/demo/frame-03-thumb.jpg",
    country: "Italy",
    alt: "Gondolas rest on blue water beside a waterfront city under a warm evening sky.",
    place: "Venice",
    demo: true,
    credit: { name: "Luca Bravo", url: "https://unsplash.com/photos/UKJev6G45f0" },
  },
  {
    id: "demo-04",
    src: "/photos/demo/frame-04.jpg",
    thumbnail: "/photos/demo/frame-04-thumb.jpg",
    country: "United Kingdom",
    alt: "A river curves through a city, with a twin-towered bridge and a cluster of tall buildings.",
    place: "London",
    demo: true,
    credit: { name: "Benjamin Davies", url: "https://unsplash.com/photos/Oja2ty_9ZLM" },
  },
  {
    id: "demo-05",
    src: "/photos/demo/frame-05.jpg",
    thumbnail: "/photos/demo/frame-05-thumb.jpg",
    country: "Spain",
    alt: "Ornate pale buildings line a busy avenue under an orange evening sky.",
    place: "Madrid",
    demo: true,
    credit: { name: "Florian Wehde", url: "https://unsplash.com/photos/WBGjg0DsO_g" },
  },
];
