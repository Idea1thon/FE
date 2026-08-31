# CLAUDE.md — Design System & Figma MCP Integration Rules

Rules for translating Figma designs into this codebase via the Figma MCP server.
Keep generated code consistent with the patterns below.

> **Project state:** A React 19 + TypeScript + Vite SPA implementing the 금보원
> (아이디어1톤) wireframe — a grayscale, single-tone mockup of a store-operations
> reporting product. Styling is **Tailwind CSS v4**; design tokens are CSS custom
> properties in `src/index.css` exposed as Tailwind utilities. Routing is
> `react-router-dom`. There is a working component set under `src/components/`
> but no Storybook / token build tool. The conventions below describe what exists
> and how to extend it cleanly.

---

## 1. Frameworks & Libraries

| Concern         | Choice                                              | Notes |
|-----------------|----------------------------------------------------|-------|
| UI framework    | **React 19.2** (`react`, `react-dom`)              | Function components only, `StrictMode` in `src/main.tsx` |
| Routing         | **react-router-dom 7** (`<Routes>` in `src/App.tsx`)| Role-gated route groups via `src/routes/RequireRole.tsx`; auth state in `src/session/` |
| Language        | **TypeScript ~6.0**, `strict` bundler mode         | `jsx: "react-jsx"` (no `import React`), `verbatimModuleSyntax` (use `import type`), `erasableSyntaxOnly`, `noUnusedLocals/Parameters` |
| Build / bundler | **Vite 8** + `@vitejs/plugin-react` + `@tailwindcss/vite` | Config: `vite.config.ts` |
| Linting         | **oxlint** (`npm run lint`), config `.oxlintrc.json`| Plugins: react, typescript, oxc. `react/rules-of-hooks` = error, `react/only-export-components` = warn (`allowConstantExport`) |
| Styling         | **Tailwind CSS v4** (`@import 'tailwindcss'` in `src/index.css`) | Utility classes in JSX. No CSS Modules, no CSS-in-JS, no Sass, no co-located `.css` files |
| State           | Local `useState` + one React context (`src/session/`) | No Redux / Zustand / React Query |

Scripts: `npm run dev` · `npm run build` (`tsc -b && vite build`) · `npm run lint` · `npm run preview`

**Do not add** more styling libraries (styled-components, MUI, …), a token build
tool (Style Dictionary), or a data-fetching / state library unless the user
explicitly asks. Match the existing Tailwind + CSS-variable approach.

---

## 2. Token Definitions

Design tokens are **CSS custom properties** on `:root` in **`src/index.css`**, and
they are re-exposed as Tailwind color utilities through the **`@theme`** block in
the same file. `src/index.css` *is* the source of truth — there is no JSON token
source and no transformation step.

```css
/* src/index.css */
@import 'tailwindcss';

/* @theme maps each --w-* / --risk-* variable to a Tailwind color utility:
   bg-w-panel, border-w-line, text-w-ink, text-risk-danger, … */
@theme {
  --color-w-page: var(--w-page);
  --color-w-ink: var(--w-ink);
  --color-w-line: var(--w-line);
  --color-w-panel: var(--w-panel);
  --color-w-row: var(--w-row);
  --color-w-field: var(--w-field);
  --color-w-placeholder: var(--w-placeholder);
  --color-w-overlay: var(--w-overlay);
  --color-w-social: var(--w-social);
  --color-risk-safe: var(--risk-safe);
  --color-risk-warn: var(--risk-warn);
  --color-risk-danger: var(--risk-danger);
}

:root {
  /* Wireframe palette — grayscale "as drawn" values */
  --w-page: #fff;          /* screen background        */
  --w-ink: #000;           /* text / icons             */
  --w-line: #000;          /* borders, dividers        */
  --w-panel: #ececec;      /* card & popup surface     */
  --w-row: #d9d9d9;        /* list / table row surface */
  --w-field: #fff;         /* input & select surface   */
  --w-placeholder: #7c7c7c;
  --w-overlay: rgba(0,0,0,0.35);  /* modal scrim       */
  --w-social: #9e9e9e;     /* 간편로그인 버튼 placeholder */

  --risk-safe: #00a015;    /* 안전 */
  --risk-warn: #ed7c03;    /* 보통 */
  --risk-danger: #a80000;  /* 위험 */

  --sans: system-ui, 'Segoe UI', Roboto, sans-serif;
  --mono: ui-monospace, Consolas, monospace;

  font: 18px/145% var(--sans);   /* 16px ≤1024px */
  letter-spacing: 0.18px;
}
```

**Dark mode** re-declares the same `--w-*` / `--risk-*` variables inside
`@media (prefers-color-scheme: dark) { :root { … } }` in `src/index.css`. The
Tailwind utilities reference the variables, so they follow automatically. Never
hardcode a dark-mode color in a component.

### Rules when importing tokens from Figma
- Pull Figma variables with `get_variable_defs`. Map them onto the existing
  `--w-*` / `--risk-*` set where a match exists (e.g. Figma `color/line` →
  `--w-line`).
- Add a **new** token only when none fits: add the `--x` variable in **both** the
  light `:root` block and the dark `@media` block, **and** add a
  `--color-x: var(--x)` line to `@theme`. Then use it as `bg-x` / `text-x` /
  `border-x`.
- In components use the utility (`bg-w-panel`, `text-risk-danger`). **Never**
  paste a raw hex/rgba into a component — grep the codebase, there is currently
  exactly zero raw color literals.
- **Spacing / radius / font-size have no tokens.** Use Tailwind's scale where it
  lands on the value (`gap-3`, `p-6`, `mt-5`) and arbitrary values otherwise
  (`h-[54px]`, `text-[20px]`, `rounded-[10px]`, `w-[140px]`). Common radii:
  `rounded-sm` / `rounded-md` / `rounded-[7px]` / `rounded-[10px]` / `rounded-2xl`.

### Typography
Global `h1`–`h4` rules (font-family, `font-weight: 500`, `color: var(--text-h)`)
live in `src/index.css`. Per-element sizes are Tailwind arbitrary values on the
component, following the wireframe, e.g. headline `text-[30px] lg:text-[40px]`,
card title `text-[20px] lg:text-[25px]`, body `text-[15px]`–`text-[18px]`.

---

## 3. Component Library

Components live under **`src/components/`**, split by role:

| Folder                    | Contents |
|---------------------------|----------|
| `src/components/ui/`      | Primitives: `Button`, `Card`, `Modal`, `Select`, `TextField`, `DataList` (+ `DataRow`), `Icon`, `RiskText`, `PublishToggle` |
| `src/components/layout/`  | `AppLayout`, `AppHeader`, `AppFooter`, `PageContainer`, `PageHeading`, `DashboardGrid` |
| `src/components/domain/`  | Feature blocks: `RiskSummaryCard`, `StoreRankingCard`, `StoreList`, `ReportList`, `OperationReportCard`, `FinancialReportForm` (+ `financialReportSchema.ts`), `LoginPanel`, `StoreSearchCard`, `LocationResultList`, `SolutionCards`, `ReportViewer` |
| `src/components/modals/`  | `ConfirmDialog`, `MyPageModal`, `NotificationModal` (compose `ui/Modal`) |

### Conventions for new components
- One component per file, **PascalCase** filename: `src/components/ui/Badge.tsx`.
- Named function + `export default`. Props typed with an `interface`, **no
  `React.FC`**:
  ```tsx
  interface BadgeProps {
    label: string
    tone?: 'safe' | 'warn' | 'danger'
  }

  function Badge({ label, tone = 'safe' }: BadgeProps) {
    return <span className="rounded-md px-2 py-0.5 text-[14px] text-w-ink">{label}</span>
  }

  export default Badge
  ```
- **No co-located CSS file.** Style with Tailwind utility classes in the JSX.
- Type-only imports use `import type { … }` (`verbatimModuleSyntax`).
- A file with a component must not also export non-component values (oxlint
  `react/only-export-components`; plain `const` is allowed). Local
  (non-exported) helper components in the same file are fine — see
  `OwnerReportDetailPage` for the `key`-remount wrapper pattern.
- Reach for an existing `ui/` primitive before writing new markup (`Card`,
  `DataList` + `DataRow`, `Modal`, `Select`, `TextField`).

---

## 4. Styling Approach

- **Tailwind v4 utilities in JSX.** No stylesheet per component. Global concerns
  (`@import`, `@theme`, `:root` tokens, dark-mode block, `h1`–`h4`, `body`,
  `#root`) live in `src/index.css`.
- **Colors:** always a token utility (`bg-w-*`, `text-w-*`, `border-w-*`,
  `text-risk-*`). The scrim uses `bg-w-overlay`; the card shadow is
  `shadow-[var(--shadow)]`.
- **Responsive — single breakpoint `lg` (Tailwind default = 1024px).**
  Mobile-first: unprefixed = mobile, `lg:` = desktop (`flex-col lg:flex-row`,
  `grid-cols-1 lg:grid-cols-2`, `text-[16px] lg:text-[20px]`). Use `max-lg:`
  only when a rule must apply *below* 1024px. **Do not** introduce `sm` / `md` /
  `xl` / custom `min-[…]` / `max-[…]` breakpoints.
- **Overriding a base utility:** use the v4 important suffix — `pb-0!`,
  `gap-3!` (see `FinancialReportFormPage`, `OperationReportCard`).
- **Dynamic class names don't work** — Tailwind can't scan a constructed string.
  Map to a literal-class lookup object, e.g. `FinancialReportForm`'s
  `GRID_COLS: Record<number, string> = { 1: 'lg:grid-cols-1', 2: …, 3: … }`.
- **Arbitrary values** for one-off sizing: `w-[150px]`, `h-[34px]`,
  `min-w-[280px]`, `flex-[1_1_320px]`, `max-w-[560px]`. `[word-break:keep-all]`
  is used on Korean headings/labels to prevent mid-word breaks.
- Layout: flexbox / grid + `gap`. `PageContainer` is the centered
  `max-w-[1440px]` (`narrow` = `max-w-[1040px]`) column with standard padding;
  `DashboardGrid` is the two-column dashboard body that stacks at `lg`.

### Accessibility patterns already in use
- `Modal` supplies the accessible name (`aria-labelledby` from `title`, else
  `aria-label`), moves focus into the panel on open, restores it on close, and
  traps Tab. New dialogs go through `ui/Modal`.
- Native controls get a real label: `<label htmlFor>` or `aria-label`
  (`Select` takes a required `ariaLabel` prop; `TextField` renders a `<label>`).
- Field groups use `role="group"` + `aria-label` (`FinancialReportForm`).
  Generated `id`s are built from **indices**, never from the (space-containing)
  Korean label text.
- Decorative icons: `Icon` without a `label` renders `role="presentation"
  aria-hidden`; pass `label` when the icon carries meaning.

---

## 5. Icon System

Icons are an **SVG sprite** at **`public/icons.svg`** — one `<svg>` of `<symbol>`
elements, each `id="<name>-icon"` with its own `viewBox`.

Render them through the **`src/components/ui/Icon.tsx`** component, never inline:

```tsx
<Icon name="search" size={28} />          {/* decorative */}
<Icon name="settings" size={26} label="설정" />  {/* meaningful */}
```

`Icon` does `<use href={`/icons.svg#${name}-icon`} />`, sizes via inline
`width`/`height` from the `size` prop, and colors via `text-w-ink` +
`currentColor`. `name` is constrained to the `IconName` union in `Icon.tsx`
(currently `bell`, `user`, `search`, `chevron-down`, `settings`).

### Adding an icon from Figma
- Export as SVG (`download_assets`), strip `width`/`height`, keep `viewBox`.
- Add a `<symbol id="my-name-icon" viewBox="…">` to `public/icons.svg`
  (kebab-case + `-icon` suffix). Don't add per-icon files or an icon library.
- Add the bare name (`'my-name'`) to the `IconName` union in `Icon.tsx`.

---

## 6. Asset Management

| Asset kind | Location | How to reference |
|------------|----------|------------------|
| Images used in components | `src/assets/` | **ES import**: `import hero from '../assets/hero.png'` then `<img src={hero} />` — Vite hashes & bundles it |
| Icon sprite, favicon | `public/` (`icons.svg`, `favicon.svg`) | **Absolute path** from root: `/icons.svg`, `/favicon.svg` — served as-is |

- No CDN, no image optimization pipeline, no `srcset`.
- Give `<img>` explicit `width`/`height` when known; `alt=""` for decorative.
- **Decision rule:** transformed by code → `src/assets/`; stable public URL
  (sprite, favicon, `fetch` targets) → `public/`.

---

## 7. Project Structure

```
금보원/
├── index.html              # Vite entry; <div id="root">, loads /src/main.tsx
├── vite.config.ts          # react + tailwindcss/vite plugins
├── tsconfig*.json           # app + node project references
├── .oxlintrc.json           # lint config
├── public/
│   ├── favicon.svg
│   └── icons.svg            # SVG sprite — all icons as <symbol>
└── src/
    ├── main.tsx             # createRoot + <StrictMode><BrowserRouter><SessionProvider><App/>
    ├── App.tsx              # <Routes> — all route → page wiring
    ├── index.css            # @import tailwindcss, @theme, :root tokens, dark block, element resets
    ├── components/{ui,layout,domain,modals}/
    ├── pages/               # one file per screen
    │   ├── owner/           # 사업자 로그인 flow
    │   └── enterprise/      # 기업(관리자) 로그인 flow
    ├── routes/RequireRole.tsx   # role-gated <Outlet> wrapper
    ├── session/            # SessionContext + SessionProvider + useSession
    ├── data/mock.ts        # all mock data + lookup helpers (getStore, getReport, …)
    └── assets/             # bundled images
```

### Where new code goes
| Adding… | Put it in… |
|---------|-----------|
| A reusable primitive | `src/components/ui/<Name>.tsx` |
| A feature block | `src/components/domain/<Name>.tsx` |
| A dialog | `src/components/modals/<Name>.tsx` (compose `ui/Modal`) |
| A full screen | `src/pages/**/<Name>Page.tsx` + a `<Route>` in `src/App.tsx` |
| A design token | `src/index.css` — `:root` **and** the dark `@media` block **and** `@theme` |
| A global element style | `src/index.css` |
| An icon | `<symbol>` in `public/icons.svg` + name in `Icon.tsx` |
| Mock data | `src/data/mock.ts` |

- **No path aliases** — relative imports (`./`, `../../`).
- Convert relative dates in mock data / copy to absolute.

---

## Figma MCP Workflow Notes

- **Before `get_design_context`**: load the `figma:figma-design-to-code` skill
  (mandatory).
- Run `get_variable_defs` early and reconcile against the `--w-*` / `--risk-*`
  set (and the `@theme` block) in `src/index.css` before writing any component.
- Generated components: function + `export default`, `interface` props,
  `import type` for types, Tailwind utilities for every style, token utilities
  for every color, the single `lg:` (1024px) breakpoint for responsive rules,
  the `!` suffix to override a base utility, a literal-class map for anything
  dynamic.
- Route new screens through `src/App.tsx`; guard them with `RequireRole` if
  they belong to a login flow.
- After generating: run `npm run lint` and `npm run build` (`tsc -b && vite
  build`) — TS is strict about unused locals/params and erasable syntax.
- Keep the Tailwind + CSS-variable, no-extra-dependency ethos. Flag to the user
  if a design really needs a new library rather than adding one silently.
