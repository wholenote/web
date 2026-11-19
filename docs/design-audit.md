# Design alignment audit

Date: 2026-10-07. Baseline: the local working tree, including the user's existing uncommitted changes. Standard: [Brian website design skill](../skills/brian-website-design/SKILL.md), with [reference research](../skills/brian-website-design/references/research.md).

The original findings are preserved below. See the [2026-10-08 implementation follow-up](#implementation-follow-up--2026-10-08) for the current state after the user authorized fixes and demo imagery.

## Verdict

**Partially aligned.** The cream/plum palette, serif titles, monospaced metadata, thin rules, framed panels, and tactile primary button already establish a coherent personal identity. The restaurant draw is an appropriate place for playful feedback. The main gaps are readability, motion preferences, mobile content priority, and unfinished content. A wholesale visual replacement is unnecessary.

This audit records findings and proposed acceptance criteria. No UI, application logic, content data, or deployment was changed as part of the audit.

## Evidence and coverage

The site was served locally at `http://127.0.0.1:4322/` and inspected in Chrome. Observations below describe the inspected working tree, not a production deployment.

| Check | Result |
| --- | --- |
| Food at 1440px | Full-page visual review and computed typography/control dimensions recorded |
| Food at 390px and 320px | No document-level horizontal overflow; heading fits; horizontally scrolling filter rows remain contained |
| Food at 768px | Favorites filter produced three visible cards and a matching result count |
| Restaurant draw | Observed shuffling state, final named result, matching selected card, and re-enabled Spin button |
| Photos at 1440px and 390px | Empty state visually reviewed; no document-level overflow at 390px |
| Photos at 700px | Empty-state layout reviewed; right text column nearly exhausts the panel's right padding |
| About at 768px | Navigation works; page contains only “Coming soon.” |
| Color contrast | Ratios calculated from source colors using sRGB relative luminance; translucent examples are estimates against stated solid surfaces |
| Motion, sound, semantics | Source reviewed; no runtime reduced-motion emulation, screen-reader session, or audio loudness assessment performed |
| Populated Photos states | Source reviewed only; `photographs` is empty, so guessing, reveal, browse, and image-loading states could not be visually validated |

Astro's development toolbar was present in local screenshots; it is not treated as production UI. Browser interactions were limited to local navigation and controls; no external Directions link was followed. Performance, full WCAG conformance, zoom/reflow at 200%, and every keyboard path are not certified by this review.

## Retain

- The existing identity and palette. Main cream on the night canvas is about **16.57:1**, and muted text on the raised panel is about **8.43:1**. The basic colors are usable; the weaker combinations come from accent backgrounds and low-opacity labels.
- Clear selected filter styling, `aria-pressed` on filters, `aria-current` in navigation, labeled map markers, a global focus rule, and text feedback through live regions.
- The framed photography empty state, which combines subtle technical corners with a tilted card. It fits the reference synthesis without requiring copied imagery.
- The optional restaurant randomizer's pressed shadow, visible result, and disabled state during a draw. Its source already skips result cycling when reduced motion is requested.
- Real recommendations remain available as text beside the map, with visible map attribution. Native buttons and links provide a sound basis for accessible interaction.

## Findings

P1 = address before calling the design aligned. P2 = material consistency or usability improvement. P3 = maintainability or polish. These priorities are project judgments, not formal WCAG severity ratings.

### P1 — Primary action text lacks sufficient contrast

**Observed/source-derived:** Spin uses `#fff6df` text over a `#ff5b83` → `#d23b6a` gradient. Endpoint ratios are approximately **2.76:1** and **4.26:1**, both below the 4.5:1 requirement for its 12.8px text. The smaller sublabel is also translucent. Photo guess/next buttons reuse the same pairing in source, though those controls are not currently rendered.

Location: [global.css](../src/styles/global.css), `.spin-button` around line 901 and `.guess-button, .next-photo-button` around line 1874.

**Acceptance:** use a tested foreground/background pair across the entire button, including hover/pressed states. Keep the berry identity through fill, border, or shadow. Normal-size text must reach 4.5:1. Check gradient interiors and brightness effects as well as endpoints. [Contrast criterion](https://www.w3.org/WAI/WCAG22/Understanding/contrast-minimum.html).

### P1 — Useful text is consistently too small, with some low-contrast labels

**Browser measurements at 1440px:** navigation and the food introduction are 10.24px; the sound label is 8px; slot labels are 7.2px; draw status is 8.48px; restaurant metadata is 8.64px; restaurant notes are 11.84px. This makes normal information resemble decorative microprint.

Slot-label cream at 37% opacity over `--night-soft` is approximately **3.07:1**. Card-index cream at 32% over `--night-raised` is approximately **2.63:1**. These two values are illustrative source calculations, not pixel-sampled certification of the composed gradients and texture.

Location: [global.css](../src/styles/global.css), `.site-tab`, `.sound-toggle`, `.guide-heading p`, `.slot-window > span`, `.spin-status`, `.card-index`, `.card-meta`, `.card-note`.

**Acceptance:** introduce a shared type scale, bring meaningful metadata to approximately 12px or larger and compact reading text to 14–16px, and use solid text tokens with measured contrast. Verify the result at desktop and mobile widths, including long restaurant names. These size targets are project design choices; WCAG does not prescribe a universal minimum font size.

### P1 — Reduced motion is only partially implemented

**Source-confirmed:** the CSS media query minimizes CSS durations, and the draw handler skips its timer cycle. However, selected cards still call `scrollIntoView({ behavior: "smooth" })`. Filter-driven `fitBounds`/`setView` calls do not explicitly opt out of Leaflet animation. The draw uses `flyTo` with zero duration under reduced motion rather than a clearly nonanimated operation.

Location: [FoodGuide.astro](../src/components/FoodGuide.astro), `fitCity` around lines 283–298, `selectRecommendation` around lines 300–314, and `finishSpin` around lines 481–503; [global.css](../src/styles/global.css), final media query.

**Acceptance:** one motion-preference helper should govern both CSS and scripted paths. With reduced motion enabled, choosing a filter, marker, or random result must update immediately without smooth scrolling, camera travel, or slot cycling. Use `animate: false` where supported and a direct nonanimated map view update. Verify actual behavior in a browser; CSS overrides alone do not establish a pass.

### P2 — Mobile ordering postpones the recommendations

**Browser measurement:** at 390×844, the map starts around **1103px** down the document and the recommendation panel around **1607px**. Four filter groups and the expanded randomizer precede a 435px-tall map. The main restaurant information is difficult to reach quickly despite the page fitting horizontally.

Location: [FoodGuide.astro](../src/components/FoodGuide.astro), toolbar → randomizer → map/list order; [global.css](../src/styles/global.css), media rules at 960px and 680px.

**Acceptance:** a visitor should reach at least the first recommendation within roughly the first one or two phone screens. A compact filter summary, collapsed optional randomizer, or list-first mobile arrangement could achieve this. Keep map access obvious and DOM/focus order coherent. Do not rely on CSS reordering that produces a conflicting keyboard sequence.

### P2 — Bright map and decorative layers compete with the content

**Visual judgment:** the large, pale OpenStreetMap surface is the strongest luminous area in the full Food page. The textured background and striped randomizer add further visual activity. The site has the desired atmosphere, but its quiet content areas could be more distinct.

Location: [FoodGuide.astro](../src/components/FoodGuide.astro), tile layer around line 253; [global.css](../src/styles/global.css), `body::before`, `.restaurant-randomizer`, `.real-map`.

**Acceptance:** reduce visual competition while preserving street labels, marker recognition, and attribution. Options include a quieter licensed tile style, more compact map presentation, or clearer separation of the map from reading surfaces. Do not blindly invert the map. Keep grain behind text and photos; compare the entire page after the change. This is an art-direction finding, not an accessibility failure by itself.

### P2 — Sound is enabled before explicit consent

**Source-confirmed:** `muted` starts as `false`; missing or unavailable storage also leaves it false. Any ordinary link/button click may initialize sound, and later hovers may trigger cues. The browser displayed the enabled sound control on the inspected page. No claim is made about measured sound volume.

Location: [SiteHeader.astro](../src/components/SiteHeader.astro), initial sound state around lines 47–59 and document listeners around lines 152–189.

**Acceptance:** a new visitor starts silent, explicitly enables sound through the sound control, and can disable it again. Stored preference and control labeling agree. Cues remain optional, quiet, and nonblocking. This is the newly established project default, not a claim that current behavior violates browser autoplay rules.

### P2 — Touch comfort and navigation shortcuts need attention

**Measured/source-confirmed:** filter and navigation controls are about 35px high, and the mobile sound control is 32×32px. They fall below the skill's preferred 44px comfort target, although that does not automatically fail WCAG AA's 24px rule. The three page templates have no skip-to-main link.

Location: [SiteHeader.astro](../src/components/SiteHeader.astro), [page templates](../src/pages/), and `.filter-chip`, `.site-tab`, `.sound-toggle` in [global.css](../src/styles/global.css).

**Acceptance:** increase practical hit areas while keeping the visual density controlled, add a working skip link with a focusable main target, and check focus visibility inside overflow containers. Verify navigation, filters, map/list selection, and optional game controls by keyboard and touch. [Target-size criterion](https://www.w3.org/WAI/WCAG22/Understanding/target-size-minimum.html).

### P2 — Photo game states cannot yet be approved; source exposes specific gaps

**Content limitation:** [photography.ts](../src/data/photography.ts) contains no photos. The visible empty state is coherent; the actual game has not been visually exercised.

**Source-derived risks:** browse mode sets `data-browse-mode` and changes copy but does not hide the Score stat, and no matching CSS rule was found. Revealing hides the currently focused submit/skip control without explicitly moving focus. Window-level arrow-key handling excludes only the country input. `image.src` is replaced directly without a loading/error state.

Location: [PhotoGame.astro](../src/components/PhotoGame.astro), topbar around lines 21–35, `render` around lines 169–212, and listeners around lines 216–271.

**Acceptance:** when real photos or isolated review fixtures are available, verify guessing, retry, skip, next/previous, completed, and browse modes at desktop and phone widths. Browse mode should hide game-only scoring; reveal should leave focus in a useful location; keyboard shortcuts should be scoped; slow or failed images should have a stable, understandable state. Do not add invented photographs to production just to clear this finding.

### P2 — Personal content and page framing remain incomplete

**Observed:** About only says “Coming soon.” Photos explains a game that cannot yet be played. Food uses a compact heading starting 34px below the header, while Photos uses a larger heading and 64–112px top spacing. All three page titles are `brian` and descriptions are `website`.

Location: [resume.astro](../src/pages/resume.astro), [photos.astro](../src/pages/photos.astro), [food.astro](../src/pages/food.astro), and the heading rules in [global.css](../src/styles/global.css).

**Acceptance:** distinguish intentional compact/content-led heading variants in shared styles; give each page a meaningful title and description; make empty-state promises match availability. Add About content only from Brian's supplied facts. Content readiness is a separate dependency from palette alignment.

### P3 — The animation system is ad hoc and contains dormant styles

**Source-confirmed:** `.reveal` is visible by default; the entrance animation only targets `.hero .reveal`, and no current page renders that hero. Hero cards, ticker, and illustrated-map styles also remain in the stylesheet. The draw cycles all three result fields every 75ms for 15 ticks, waits 160ms, then resolves simultaneously. It does not yet use the recommended sequential reveal/settle treatment.

Location: [global.css](../src/styles/global.css), hero/ticker/map blocks and animation rules around lines 2206–2247; [FoodGuide.astro](../src/components/FoodGuide.astro), draw timer around lines 515–522.

**Acceptance:** when implementing motion changes, consolidate reusable durations/easing and document which components use them. A restaurant reveal can settle fields in sequence with one restrained final emphasis. Keep ordinary browsing immediate. Remove dormant CSS only after confirming no intended feature depends on it. Missing entrance effects are not themselves a defect; do not animate all content to make unused classes active.

## Recommended order

1. Fix contrast and text sizing; establish shared type/action tokens.
2. Close CSS/JavaScript reduced-motion gaps and make sound opt-in.
3. Improve mobile content order, touch targets, and keyboard navigation.
4. Refine map/texture balance and shared page framing.
5. Supply real personal/photo content, then validate the populated game states.
6. Consolidate motion and remove verified dormant styling during the relevant implementation work.

Alignment should be reassessed after implementation. The audit does not authorize deployment or establish that any listed fix has already been made.

## Implementation follow-up — 2026-10-08

The user subsequently authorized fixes, new design concepts, and filler photographs. The implemented direction is a quieter field-notes collection with expressive serif headings, readable metadata, optional tactile interactions, and consistent framing across Food, Photos, and About. It is substantially aligned with the established art direction; the remaining content and validation limitations below still apply.

### Implemented

- **Readability and contrast:** shared type/spacing tokens, 12px-or-larger interface metadata, 14px restaurant notes, and dark text on lighter berry action buttons. Source-color contrast is approximately **7.84:1** normally and **9.63:1** on hover.
- **Motion and sound:** shared CSS timing tokens and a JavaScript motion helper govern scrolling, map updates, and the restaurant draw. The draw reveals cuisine, price, then restaurant over 720ms, resolving immediately with reduced motion. Obsolete draw timers are cancelled on city change. Sound starts off unless the visitor previously explicitly enabled it.
- **Food hierarchy:** native city selector, collapsed filter and “Dealer’s choice” drawers, list-first mobile layout, and a clear List/Map toggle. Map fitting runs after the hidden map is revealed. Card selection is deliberate, and marker selection transfers keyboard focus to its field note. The map retains readable, credited OpenStreetMap tiles with slightly reduced saturation; decorative noise and stripes were removed.
- **Photo experience:** three locally hosted, visibly labeled and credited demo photographs; a numbered filmstrip; loading/error/retry handling; neutral unrevealed figure naming; useful focus after reveal; scoped keyboard controls; no-score browsing; and completion/restart feedback. Full photographs are preserved by default, with image-first stacking on smaller screens. [Image credits](../public/photos/demo/CREDITS.md).
- **Shared identity:** one page layout supplies titles, descriptions, skip navigation, and footer. About introduces the existing collections with live recommendation/city counts, without inventing a biography. Dormant hero, ticker, and illustrated-map CSS was removed. The project skill now documents these adopted patterns and current tokens.

### Verification

| Check | Evidence |
| --- | --- |
| Responsive sizing | Food, Photos, and About inspected across 320, 390, 768, and 1440px; no document-level horizontal overflow in the tested layouts. Tablet photo framing was changed to image-first stacking after visual review. |
| Mobile content priority | At 390px, the first restaurant begins around **703px** down the document, versus roughly **1607px** in the baseline. Optional drawers remain closed initially. |
| Food controls | City/tier filters, combined category/price filters, a completed draw with matching selected restaurant, and cancellation during city change exercised. Mobile map markers were confirmed inside the visible map bounds; clicking one returns to the list and focuses its card. |
| Reduced motion | Chrome rendering emulation enabled for the actual page: draw result immediate, button enabled immediately, computed transition `0s`, reveal animation `none`, and scroll behavior `auto`. City and marker updates exercised without animated camera travel. Emulation restored afterward. |
| Photo game | Wrong and correct guesses, reveal, next/previous, scoring, completion, restart, browse mode, and input-safe arrow navigation exercised. All three local photographs loaded. Figure accessible name remained neutral before reveal. |
| Failed image | A temporary missing-image fixture showed the error/retry state and disabled guessing. Retrying remained stable while the asset was unavailable. The fixture was removed and the restored image loaded with guessing enabled. Slow-network behavior was source-reviewed, not throttled. |
| Keyboard and sound | Skip link focused the main landmark; map selection focused the corresponding card; photo reveal moved focus to Next frame. Initial sound control was off. No screen-reader or audio-loudness session was performed. |
| Build and tests | `npm run build` passed with 0 Astro errors/warnings/hints. `npm test` passed all **14 tests**. `git diff --check` passed. |

### Remaining boundaries

The demo roll is explicitly not Brian’s photography; replace it when personal photos are ready. A fuller About biography still requires supplied personal facts. This is not a full WCAG certification, performance audit, screen-reader assessment, or 200% zoom review. Map tiles and web fonts still depend on external services. No deployment was performed.
