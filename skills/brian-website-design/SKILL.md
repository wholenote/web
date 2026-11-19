---
name: brian-website-design
description: Design, extend, or audit Brian's personal website using its Balatro-inspired tactile interactions and Vincent Passaro-inspired visual restraint. Apply to this project's visual design, responsive layouts, UI states, animation, imagery, and sound; not unrelated backend or content-data maintenance.
---

# Brian website design

## Direction

Create a personal collection that is enjoyable to explore: a calm, carefully typeset canvas with tangible cards and brief moments of play. Prioritize Brian's writing, recommendations, photographs, and projects. The shell establishes order; interaction provides character.

Use Balatro for physicality, anticipation, and satisfying resolution. Use Vincent Passaro's site for hierarchy, negative space, fine rules, compact metadata, and selective motion. Keep Brian's warm cream, plum, berry, mint, serif typography, and 王 identity. These are deliberate project adaptations, not claims about either reference's exact design system.

Read [research.md](references/research.md) when interpreting the inspirations, proposing a new visual direction, or explaining their provenance. It records observations from 2026-10-07 and distinguishes them from this project's decisions. Do not require new external research for routine work.

## Design principles

1. **Content leads.** A visitor should understand the page and find its main content before encountering elaborate controls or animation. Give each view a clear heading and a dominant content region. Reserve generous hero space for pages that have something to introduce.
2. **Calm shell, playful objects.** Keep navigation, prose, tables, and long lists steady. Give selectable cards and deliberate reveal actions modest depth, lift, press, and settle. One prominent animated event at a time is the default.
3. **Color has a job.** Cream is reading, berry is primary action, mint is selection or success, and gold is favorites or attention. Pair color with a label, shape, border, or icon. Avoid assigning every panel a different accent.
4. **Texture stays behind content.** A restrained grain or slow color field can add atmosphere. It must not muddy letters, photographs, maps, or focus rings. Avoid blanket CRT distortion, scanline flicker, and effects that move reading text.
5. **Personality comes from real content.** Use accurate notes, places, dates, and counts. Keep copy plain and specific: Brian prefers direct labels over sayings, poetic filler, or “field notes” branding. Use Brian alone in the shared header/footer; omit map taglines and decorative photo-game slogans. Do not invent terminal telemetry, credits, achievements, professional history, or scarcity to furnish a theme. Reuse existing identity assets instead of introducing unrelated motifs.
6. **Play is optional.** Reading, browsing photos, and finding restaurants must work without games, sound, pointer hover, or motion. An empty state should honestly explain what is available.

## Visual system

Use `src/styles/global.css` as the shared token source. Preserve existing token names where practical. The following palette is the baseline, not a requirement to keep every current color pairing:

| Token | Value | Role |
| --- | --- | --- |
| `--night` | `#0c0b20` | Main canvas |
| `--night-raised` | `#15142f` | Elevated surface |
| `--night-soft` | `#1d1b3d` | Inset or secondary surface |
| `--ink` | `#f7edcf` | Main text and selected neutral controls |
| `--ink-muted` | `#b8b1a8` | Supporting text |
| `--berry` / `--berry-bright` | `#d23b6a` / `#ff7a9a` | Action accent and decorative emphasis |
| `--mint` | `#75deca` | Selection, links, success |
| `--gold` | `#f5c45b` | Favorites, focus, attention |

Accent backgrounds need their own tested foreground. Primary actions now use `--night` text on `--berry-bright` (about 7.84:1), with a `#ff99b1` hover fill (about 9.63:1). Do not reintroduce cream text on a bright berry gradient. Check new pairings and hover states.

Use Instrument Serif for expressive headings and short item titles, DM Sans for reading and controls, and DM Mono for short metadata. Preserve system fallbacks. Avoid pixel fonts for ordinary reading. Keep mixed Chinese and Latin text legible with suitable fallbacks.

- Use roughly 16–18px for prose and 14–16px for compact descriptions and controls. Meaningful metadata should normally be at least 12px. These are project readability defaults, not WCAG font-size requirements.
- Keep normal text at least 4.5:1 contrast and qualifying large text at least 3:1. Do not turn meaningful metadata into low-opacity decoration. Measure composed colors, including translucent surfaces and images.
- Use a compact spacing scale such as 4, 8, 12, 16, 24, 32, 48, 64, and 96px. Prefer shared spacing and type tokens when adding styles rather than unrelated per-component values.
- Use the existing 1180px maximum shell as a starting point; give prose a narrower measure, around 60–70 characters. Keep mobile gutters comfortable, usually 16–20px unless the content needs a different fit.
- Fine borders and 8–16px panel radii suit the current site. Pills belong to filters or toggles. Restrict hard offset shadows and small rotations to interactive objects or illustrative card stacks.
- Favor the shared page-heading pattern: small collection label, expressive serif title with selective berry italics, and a brief plain-language introduction. Keep navigation and state cues consistent between Food, Photos, About, and future sections.

## Motion language

Choose motion by purpose. The values below are project starting ranges, not timings measured from Balatro. Reuse the shared `--motion-fast`, `--motion-settle`, and `--ease-settle` CSS tokens; use `src/lib/motion.ts` for scripted motion preferences.

| Event | Starting treatment | Timing | Reduced motion |
| --- | --- | --- | --- |
| Hover/focus emphasis | Border/color change; optional 1–3px lift on a fine pointer | 120–180ms, ease-out | Color/border only |
| Press | 1–2px depression and shorter shadow | 80–120ms | Immediate state change |
| Card selection | Stable selected border/inset marker; optional lift and settle | 180–280ms, `cubic-bezier(.2,.8,.2,1)` | Immediate selection |
| Section entrance | At most 8–14px upward travel with opacity | 300–500ms; stagger 40–70ms, capped around 300ms total delay | Fully visible immediately |
| Deliberate reveal | Brief anticipation, sequential reveal, one small settle | 250–450ms; an optional shuffle may take about 600–1000ms | Resolve immediately without cycling |
| Ambient layer | Low-amplitude transform or static gradient | 16–24s if animated | Static |
| Optional headline accent | One brief decorative scramble over stable accessible text | Finish within about 800ms | Final text immediately |

Entrance and scramble effects are optional. Do not add them just to satisfy resemblance. Do not animate every word, list row, route transition, or repeated hover. Keep actual text available in the server-rendered HTML; decorative glyphs must be hidden from assistive technology. Add pending states only after enhancement initializes successfully.

Prefer `transform` and `opacity`; avoid animating layout, large blurs, or full-page filters. Keep focus and scroll position stable during reveals. Do not delay navigation for decorative transitions. Cancel obsolete timers/frames when the selection changes or the component unmounts. Avoid introducing a motion library solely for a small effect.

Reduced motion must cover CSS **and** JavaScript: scrolling, Leaflet pan/zoom/fly operations, timers that cycle results, and any canvas work. Use immediate scroll and explicit nonanimated map operations. Do not assume a CSS media query disables `scrollIntoView({ behavior: "smooth" })` or third-party animation. Respect preference changes for ongoing effects. Continuous decorative motion should have a pause mechanism or be omitted when it distracts from reading.

## Components and interaction

- **Navigation:** readable labels, visible active state, generous hit areas, and an obvious keyboard focus indicator. Provide a skip link into the main content. Preserve the 王 home mark. About and Photos are temporarily unavailable: show a plain “Coming soon” tag, disable their header entries without keyboard stops, redirect direct visits to Food, and preserve their source content for reopening. Keep narrow headers from overflowing when tags are present.
- **Food:** list favorites first in each city, preserving existing order within each tier and numbering cards in display order. Keep cards compact with 12px top padding, 26px titles, an inline order label, and a 44px Directions target. Show the restaurant name, cuisine, price, neighborhood, and Brian’s suggested order when supplied; omit generic descriptions. Place the Directions link at the bottom-right of each card, using the shared card inset at every breakpoint. Omit the redundant upper card arrow. Use only country flags for cuisine markers; provide restaurant-specific origins for broad categories or mixed cuisines. Keep the native city selector with an inset chevron. Use a native city selector and collapsed optional filter/draw drawers. The mobile default is List, with an explicit Map toggle; refit Leaflet after revealing a previously hidden map. Synchronize deliberate card and marker selection, not incidental pointer movement. “Random pick” draws from every restaurant in the city, explicitly independent of filters, and reveals cuisine, price, then place. Keep map labels and attribution readable; a dark map is optional, not a reason to blindly invert tiles or lose geography.
- **Photos:** let the photograph dominate and retain its intended color. Use a simple image frame with a numbered filmstrip, without decorative corner marks or a compass glyph; preserve the full image by default and stack the photo above controls on tablet/phone. Use a daily five-photo country game: select five distinct photos with a date-seeded shuffle, one guess per photo, a final score out of five, and browser-persisted daily progress. Reset at midnight UTC and explain that time in the UI. Lock future rounds and hide their preview images; one correct guess earns one point, an incorrect guess or reveal earns zero. Reveal & browse skips all unfinished rounds. Support loading, missing images, validation errors, reveal, review navigation, completion, and day rollover; never offer a scored same-day restart. Keep location hints out of unrevealed alt text and accessible figure names. Do not fabricate Brian's photographs. The user-authorized demo roll uses credited, locally hosted filler photos, visibly labeled as demos; retain that distinction until replaced by Brian's images.
- **About/projects:** use clear personal information and selected work. Apply the same typography and spacing; card illustrations and factual timelines are optional. Missing content is a content dependency, not permission to invent a biography.
- **Sound:** default to silent until the visitor explicitly enables it, persist that choice when possible, and keep visual feedback complete. Use short, quiet, nonoverlapping cues for actions. Sound must not block the interaction or be required to understand it. Do not infer sound consent from an unrelated click. This is a project default, not an observed requirement of the reference sites.
- **Inputs and selection:** native semantics first. Give hover behavior a keyboard/touch equivalent; expose persistent selection through appropriate ARIA state. Do not hide the focused control without moving focus to a logical successor. Scope arrow-key shortcuts to the relevant experience and avoid intercepting editing or native-control keys.
- **Responsive layout:** test around 320, 390, 768, and 1440px plus any affected breakpoint. Stack content in useful reading order. Keep primary content reachable before large optional widgets. Prefer 44px control targets for comfort; WCAG 2.2 AA's 24px target-size rule has exceptions and is a separate minimum. Use contained horizontal scrolling only when discoverable and keyboard usable. Check zoom/reflow, long titles, and mixed-language names.

## Working in this repository

Inspect the current pages, shared CSS, and components before editing. Shared framing and metadata live in `src/layouts/SiteLayout.astro`; interaction lives in `src/components/SiteHeader.astro`, `FoodGuide.astro`, and `PhotoGame.astro`. Content data belongs in `src/data/`. The dormant hero/ticker/illustrated-map CSS was removed during the October 2026 refinement; extend rendered components rather than reviving unrelated visual systems.

For implementation requests, make the scoped change, inspect the rendered result at relevant widths, exercise the changed states with keyboard and pointer, and check reduced motion. For functional edits run the appropriate existing tests and Astro checks; documentation-only work does not require adding application tests. Do not publish as a side effect of design work.

For audit requests, inspect the live local pages and source, then report:

- What aligns with the principles and should be retained.
- Specific deviations, location, user impact, and priority.
- A concrete acceptance criterion for each proposed fix.
- Which findings are visually observed, source-derived, or unverified because content/state is unavailable.

An audit is not an instruction to redesign or implement its findings. Do not mark a page aligned solely because its palette matches. Do not claim a motion, performance, accessibility, or photo-state check passed unless it was actually tested. The dated baseline is [docs/design-audit.md](../../docs/design-audit.md).
