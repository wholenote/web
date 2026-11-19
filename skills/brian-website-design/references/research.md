# Reference research

Inspected 2026-10-07. This records direct observations and their design implications; it is not a specification supplied by either creator. Live pages and hashed stylesheet URLs may change.

## Balatro

Primary sources: [official site](https://www.playbalatro.com/), [official press kit](https://www.playbalatro.com/press-kit/), [gameplay GIF 1](https://www.playbalatro.com/press-kit/Gifs/Balatro_gif_1%20.gif), and [developer/publisher Steam listing](https://store.steampowered.com/app/2379780/Balatro/).

The official gameplay GIF was opened in the browser and sampled at different points in its cycle. It shows a purple, swirling field behind bright, outlined cards; overlapping cards create depth. An elevated special card directs attention. The hand turns over in sequence, and irregular tilt and position make the cards feel tangible. Decorative shine is localized to special objects. These are visual observations, not reverse engineering of its animation engine or exact timings. [Official gameplay GIF](https://www.playbalatro.com/press-kit/Gifs/Balatro_gif_1%20.gif).

The publisher describes the game's pixel art, CRT texture, psychedelic presentation, and synthwave soundtrack. That supports borrowing atmosphere and responsive play, while the portfolio needs its own readable typography and sound-consent behavior. Audio was not evaluated from the silent GIF. [Steam listing](https://store.steampowered.com/app/2379780/Balatro/).

**Project interpretation:** apply anticipation → reveal → settle to a restaurant draw or photo answer. Use subtle elevation, overlap, and pressed shadows where they communicate interaction. Keep readable content steady. A simulated slot machine, poker vocabulary, pixel body text, or copied game assets are not required to convey this influence.

## Vincent Passaro

Primary source: [vincentpassaro.com](https://www.vincentpassaro.com/), inspected visually on the homepage and trajectory section, with its publicly served styles and inline animation logic inspected separately.

The homepage uses near-black space, a large two-line sans-serif statement, small monospaced navigation and metadata, a monochrome portrait, fine rules, and sparse signal colors. The trajectory graphic is framed as a technical diagram. It communicates a focused professional identity with generous separation and a clear information hierarchy. [Homepage](https://www.vincentpassaro.com/).

The shared stylesheet uses Geist/Geist Mono, a `#0a0a0b` canvas, pale foregrounds, amber and muted blue accents, and low-opacity grain. Typical controls change color or border over about 150–300ms. The general reveal uses a 14px translation over 900ms; reduced-motion styles expose content directly. These are inspected implementation values, not recommendations to copy wholesale. [Shared stylesheet observed on this date](https://www.vincentpassaro.com/_astro/Layout.Ch0J2w8B.css).

The headline's inline script resolves decorative characters in staggered order with an 800ms lock cap, runs once, and skips the scramble under reduced motion. Offscreen reveal enhancement is added after initial content exists. The headline CSS keeps overlays separate from real characters. Other homepage styles include staggered heatmap-cell entrances, selective pulses, and training-card reveals. [Homepage logic](https://www.vincentpassaro.com/), [homepage stylesheet](https://www.vincentpassaro.com/_astro/index.D9CmIN5i.css).

**Project interpretation:** borrow hierarchy, restrained framing, accurate metadata, and progressive enhancement. Keep Brian's warmer serif voice and personal content. Treat text scrambling, technical diagrams, and monochrome images as optional techniques with a purpose. Do not inherit very small/faint labels simply because the reference uses them.

## Synthesis for this project

| Dimension | Decision for Brian's site |
| --- | --- |
| Overall structure | Restrained shell; one clear heading and content region per view |
| Personality | Warm type, personal notes, photographs, tactile selection objects |
| Color | Existing plum/cream foundation, berry actions, mint selection, gold favorites |
| Motion | Fast response, brief deliberate reveals, steady reading surfaces |
| Texture | Subtle atmosphere behind content; preserve clear photographs and map labels |
| Sound | Optional, silent by default; visual state remains sufficient |
| Device/input | Equivalent keyboard/touch behavior and explicit reduced-motion handling |

The palette, type sizes, touch targets, and motion ranges in the skill are project decisions. They are intentionally not presented as measured Balatro specifications or endorsements from either creator. Research assets remain references; no third-party imagery, fonts, or game code were copied into the site's assets.

## Accessibility references

- [WCAG 2.2 contrast minimum](https://www.w3.org/WAI/WCAG22/Understanding/contrast-minimum.html): normal text requires 4.5:1; qualifying large text requires 3:1. Assess transparency and gradients, not isolated hex values.
- [WCAG 2.2 target size minimum](https://www.w3.org/WAI/WCAG22/Understanding/target-size-minimum.html): the AA target-size rule is 24 CSS pixels with specified exceptions. The skill's 44px preference is a comfort target, not a claim that all smaller controls violate AA.
- [Animation from interactions](https://www.w3.org/WAI/WCAG22/Understanding/animation-from-interactions.html): the AAA criterion addresses disabling nonessential interaction animation. The project adopts reduced-motion support as its own requirement across CSS and scripted effects.
