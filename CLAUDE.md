# CLAUDE.md — Design System & Figma MCP Integration Rules

Rules for translating Figma designs into this codebase via the Figma MCP server.
Keep generated code consistent with the patterns below.

> **Project state:** This is a fresh Vite + React 19 + TypeScript starter (the
> default Vite template landing page). There is **no formal design system yet** —
> no component library, no token pipeline, no Storybook. The conventions below
> describe what exists and how to extend it cleanly.

---

## 1. Frameworks & Libraries

| Concern        | Choice                                              | Notes |
|----------------|----------------------------------------------------|-------|
| UI framework   | **React 19.2** (`react`, `react-dom`)              | Function components only, `StrictMode` enabled in `src/main.tsx` |
| Language       | **TypeScript ~6.0**, `strict` bundler mode         | `jsx: "react-jsx"` (no `import React`), `verbatimModuleSyntax`, `noUnusedLocals/Parameters` |
| Build / bundler| **Vite 8** + `@vitejs/plugin-react` (Oxc transform)| Config: `vite.config.ts` (minimal — just the react plugin) |
| Linting        | **oxlint** (`npm run lint`), config `.oxlintrc.json`| Plugins: react, typescript, oxc. `react/rules-of-hooks` = error |
| Styling        | **Plain CSS** with native nesting + CSS custom properties | No Tailwind, no CSS-in-JS, no CSS Modules, no Sass |
| Router / state | None                                               | Add intentionally if a design requires it |

Scripts: `npm run dev` · `npm run build` (`tsc -b && vite build`) · `npm run lint` · `npm run preview`

**Do not add** styling libraries (Tailwind, styled-components, MUI, etc.) or a
token build tool (Style Dictionary) unless the user explicitly asks. Match the
existing plain-CSS approach.

---

## 2. Token Definitions

All design tokens are **CSS custom properties** declared on `:root` in
**`src/index.css`**. There is no JSON token source and no transformation system —
`src/index.css` *is* the source of truth.

```css
/* src/index.css */
:root {
  --text: #6b6375;      /* body text            */
  --text-h: #08060d;    /* headings / high-emphasis */
  --bg: #fff;
  --border: #e5e4e7;
  --code-bg: #f4f3ec;
  --accent: #aa3bff;                       /* brand purple */
  --accent-bg: rgba(170, 59, 255, 0.1);
  --accent-border: rgba(170, 59, 255, 0.5);
  --social-bg: rgba(244, 243, 236, 0.5);
  --shadow: rgba(0,0,0,0.1) 0 10px 15px -3px, rgba(0,0,0,0.05) 0 4px 6px -2px;

  --sans: system-ui, 'Segoe UI', Roboto, sans-serif;
  --heading: system-ui, 'Segoe UI', Roboto, sans-serif;
  --mono: ui-monospace, Consolas, monospace;

  font: 18px/145% var(--sans);
  letter-spacing: 0.18px;
}
```

**Dark mode** is handled by re-declaring the same variables inside
`@media (prefers-color-scheme: dark)` in `src/index.css`. Never hardcode a
dark-mode color in a component — add/adjust the token instead.

```css
@media (prefers-color-scheme: dark) {
  :root {
    --text: #9ca3af;
    --text-h: #f3f4f6;
    --bg: #16171d;
    --border: #2e303a;
    --accent: #c084fc;
    /* ... */
  }
}
```

### Rules when importing tokens from Figma
- Pull Figma variables with `get_variable_defs`. Map them onto the existing
  `--name` set where a match exists (e.g. Figma `color/accent` → `--accent`).
- Add a **new** `--token` only when no existing one fits. Add it in **both** the
  light `:root` block and the dark `@media` block.
- Use `var(--token)` in component CSS. **Never** paste raw hex/rgba into a
  component stylesheet if a token exists.
- **Spacing / radius / font-size have no tokens today.** Values are inline
  literals (`padding: 6px 12px`, `border-radius: 6px`, `font-size: 16px`).
  Keep following that unless the user asks for a spacing scale. Common values
  in use: radius `4px / 5px / 6px`; gaps `8px / 16px / 24px / 25px`; section
  padding `32px` (desktop) / `20–24px` (mobile).

### Typography scale (from `src/index.css`)
| Element | Size | Weight | Tracking |
|---------|------|--------|----------|
| base    | 18px (16px ≤1024px) | 400 | 0.18px |
| `h1`    | 56px (36px ≤1024px) | 500 | -1.68px |
| `h2`    | 24px (20px ≤1024px) | 500 | -0.24px |
| `code` / `.counter` | 15–16px | 400 | — (uses `--mono`) |

---

## 3. Component Library

**None exists yet.** `src/App.tsx` is the only component and holds the whole
page. When a Figma design introduces reusable UI, create it under a new
`src/components/` folder.

### Conventions for new components
- One component per file, **PascalCase** filename: `src/components/Button.tsx`.
- Named function + `export default`:
  ```tsx
  // src/components/Card.tsx
  import './Card.css'

  interface CardProps {
    title: string
    children: React.ReactNode
  }

  function Card({ title, children }: CardProps) {
    return (
      <div className="card">
        <h2>{title}</h2>
        {children}
      </div>
    )
  }

  export default Card
  ```
- Co-locate a plain `.css` file next to the component and `import './Card.css'`
  at the top (same pattern as `App.tsx` → `App.css`).
- Props typed with an `interface`, no `React.FC`.
- No Storybook / docs tooling. Don't add one unprompted.

---

## 4. Styling Approach

- **Plain global CSS**, split by concern: `src/index.css` (tokens + element
  resets + `#root` layout) and `src/App.css` (page-specific rules). Component
  CSS files follow the same idea.
- **CSS files are global** — there is no CSS Modules scoping. Avoid collisions by
  scoping selectors under a component root class (e.g. `.card { … }`,
  `.card h2 { … }`).
- **Native CSS nesting is used** (`&:hover`, nested descendant selectors) —
  supported directly, no preprocessor:
  ```css
  .counter {
    color: var(--accent);
    background: var(--accent-bg);
    border: 2px solid transparent;
    transition: border-color 0.3s;

    &:hover { border-color: var(--accent-border); }
    &:focus-visible { outline: 2px solid var(--accent); outline-offset: 2px; }
  }
  ```
- **Selectors:** layout regions use `#id` (`#center`, `#next-steps`, `#docs`),
  reusable bits use `.class` (`.counter`, `.hero`, `.icon`, `.ticks`). Prefer
  `.class` for anything a Figma component would map to.
- **Logical properties** are preferred where already used: `inset-inline`,
  `border-inline`, `margin`.
- Global element styles (`h1`, `h2`, `p`, `code`) live in `src/index.css` — a
  design that restyles headings globally goes there; a one-off goes in the
  component's CSS.

### Responsive design
- **Single breakpoint: `@media (max-width: 1024px)`** (mobile/tablet). Used
  throughout `App.css` and `index.css`. Reuse this exact query; don't introduce
  new breakpoints unless the Figma design clearly needs them.
- Layout: flexbox (`display: flex; flex-direction: column`), `gap`, and
  `flex: 1 1 0` for equal columns that stack to `flex-direction: column` on
  mobile.
- Page container: `#root` is fixed `width: 1126px; max-width: 100%; margin: 0 auto`
  with side borders. Full-width sections live inside it.

---

## 5. Icon System

Icons are an **SVG sprite** at **`public/icons.svg`** — a single `<svg>` of
`<symbol>` elements, each `id="<name>-icon"` with its own `viewBox`.

Current symbols: `bluesky-icon`, `discord-icon`, `documentation-icon`,
`github-icon`, `social-icon`, `x-icon`. (Note: `App.tsx` also references
`#documentation-icon` via `#docs`.)

**Usage** — reference by fragment from the public root:
```tsx
<svg className="icon" role="presentation" aria-hidden="true">
  <use href="/icons.svg#github-icon" />
</svg>
```
- Sized via CSS (`.icon { width: 22px; height: 22px }`, `.button-icon { … 18px }`),
  not width/height attributes.
- Naming convention: **`kebab-case` + `-icon` suffix**.
- Outline icons in the sprite use `stroke="#aa3bff"` (the accent) hardcoded;
  filled/brand icons use `fill="#08060d"`. Dark mode inverts specific ones via
  `#social .button-icon { filter: invert(1) brightness(2) }`.

### Adding icons from Figma
- Export the icon as SVG (`download_assets`), then **add a new `<symbol
  id="my-name-icon" viewBox="…">`** to `public/icons.svg` — don't create
  per-icon files or add an icon library.
- Strip width/height from the exported SVG; keep `viewBox`.
- Keep `role="presentation" aria-hidden="true"` on decorative icons; give a
  `<title>` or `aria-label` when the icon is meaningful.

---

## 6. Asset Management

| Asset kind | Location | How to reference |
|------------|----------|------------------|
| Images used in components | `src/assets/` (`hero.png`, `react.svg`, `vite.svg`) | **ES import**: `import heroImg from './assets/hero.png'` then `<img src={heroImg} />` — Vite hashes & bundles it |
| Icon sprite, favicon | `public/` (`icons.svg`, `favicon.svg`) | **Absolute path** from root: `/icons.svg`, `/favicon.svg` — served as-is, not processed |

- No CDN, no image optimization pipeline, no `srcset`/responsive images.
- Give `<img>` explicit `width`/`height` when known (see `hero.png` in
  `App.tsx`) to avoid layout shift. `alt=""` for decorative images.
- **Decision rule:** asset imported/transformed by code → `src/assets/`.
  Asset referenced by a stable public URL (sprite, favicon, `og:image`,
  files hit by `fetch`) → `public/`.

### Pulling assets from Figma
- Use `download_assets` for raster/complex assets → save into `src/assets/` and
  import them.
- Use SVG for icons/logos → add to `public/icons.svg` sprite (see §5).

---

## 7. Project Structure

```
금보원/
├── index.html            # Vite entry; <div id="root">, loads /src/main.tsx
├── vite.config.ts        # react plugin only
├── tsconfig*.json         # app + node project references
├── .oxlintrc.json         # lint config
├── public/
│   ├── favicon.svg
│   └── icons.svg          # SVG sprite — all icons as <symbol>
└── src/
    ├── main.tsx           # createRoot + <StrictMode><App/></StrictMode>
    ├── App.tsx            # the page (only component today)
    ├── App.css            # page styles
    ├── index.css          # design tokens (:root), dark mode, element resets, #root layout
    └── assets/            # bundled images (hero.png, react.svg, vite.svg)
```

### Where new code goes
| Adding… | Put it in… |
|---------|-----------|
| A reusable component | `src/components/<Name>.tsx` + `src/components/<Name>.css` |
| A full page / route   | `src/pages/<Name>.tsx` (create folder; wire up a router first) |
| A design token        | `src/index.css` — `:root` **and** the dark `@media` block |
| A global element style | `src/index.css` |
| An icon               | new `<symbol>` in `public/icons.svg` |
| A bundled image       | `src/assets/` (import it) |

- **No path aliases** — use relative imports (`./`, `../`). `@types/node` is
  available if you need `path` in config.
- No feature-folder / barrel-file convention exists yet; if the app grows,
  prefer feature folders under `src/` over deep nesting.

---

## Figma MCP Workflow Notes

- **Before `get_design_context`**: load the `figma:figma-design-to-code` skill
  (mandatory).
- Run `get_variable_defs` early and reconcile against the `--token` set in
  `src/index.css` before writing any component CSS.
- Generated components: function + `export default`, `interface` props, co-located
  `.css`, `var(--token)` for every color, the `@media (max-width: 1024px)`
  breakpoint for responsive rules.
- After generating: run `npm run lint` and `npm run build` (`tsc -b`) — the TS
  config is strict about unused locals/params and erasable syntax.
- Keep the plain-CSS, no-dependency ethos. Flag to the user if a design really
  needs a new library rather than adding one silently.
