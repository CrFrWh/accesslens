# AccessLens – AI Coding Agent Instructions

These notes capture the key patterns and workflows so an AI agent can be productive immediately in this repo.

## Big picture

- Chrome Extension (Manifest v3) built with React + TypeScript + Vite, wired by CRXJS.
- Three UI surfaces (current scaffold):
  - `src/popup/` – browser action popup UI.
  - `src/sidepanel/` – Chrome side panel UI (requires `sidePanel` permission).
  - `src/content/` – a content script React app mounted into a container appended to `document.body`.
- Central manifest source: `manifest.config.ts` (compiled via `@crxjs/vite-plugin`). Final MV3 manifest is generated during build.
- Vite config: `vite.config.ts` handles React plugin, CRXJS plugin, path alias `@` → `src`, dev server CORS for `chrome-extension://`, and a zip-pack plugin that emits a release ZIP.
- Roadmap from `docs/planning.mdx` (future-capability intent): background service worker (shortcuts, permission orchestration), on-demand script injection via `chrome.scripting.executeScript`, least-privilege permissions, audit sidebar, presets, and offline-only guarantee.

## How parts talk to each other

- Content script (current) is registered in `manifest.config.ts`:
  - `content_scripts: [{ js: ['src/content/main.tsx'], matches: ['https://*/*'] }]` → React app mounts itself into a container div (`#crxjs-app`).
- Popup and Side Panel are standard React single-page entries with `index.html` + `main.tsx` + `App.tsx`.
- No background service worker is defined yet in the scaffold. When implementing planned features, add `src/background/main.ts` and wire shortcuts/permission flows.
- Asset imports use Vite alias: `@/components/HelloWorld`, `@/assets/*.svg`.
- Planned messaging contract (from `planning.mdx`): Popup ⇄ Background ⇄ Content via runtime messages for `setModes`, `updateIntensity`, `applyPreset`, `resetAll`, `permissionStatus`, `auditResults`.

## Developer workflows

- Install deps: `npm install`
- Dev build and HMR: `npm run dev` (serves and builds extension in `dist`). Load the unpacked extension from `dist` in `chrome://extensions`.
- Production build: `npm run build` → outputs `dist/` and a release zip at `release/crx-<name>-<version>.zip`.
- Update manifest values from `package.json` via `manifest.config.ts` using `pkg` import.
- Use alias `@` for imports inside `src`.
- When implementing planned least-privilege flows:
  - Default permissions: `activeTab`, `storage`; avoid host perms.
  - Request optional hosts via `optional_host_permissions` on demand (tab/site/all-sites).
  - Prefer on-demand injection using `chrome.scripting.executeScript` over persistent content scripts, unless “apply everywhere” is explicitly enabled.

## Conventions and patterns

- Entry pattern for React apps:
  - `main.tsx` calls `createRoot(...).render(<StrictMode><App/></StrictMode>)`.
  - Keep `index.html` under each surface folder (`popup/`, `sidepanel/`) with a `#root` div.
- Content script pattern (current):
  - Create and append a container div; do not rely on a pre-existing element: see `src/content/main.tsx`.
  - Avoid leaking styles into host pages; scope with classes or consider CSS Modules.
- Manifest-driven routing:
  - `action.default_popup` → `src/popup/index.html`.
  - `side_panel.default_path` → `src/sidepanel/index.html`.
  - Edit `manifest.config.ts` for permissions/surface registration.
- Assets:
  - Icons/logos in `public/` and `src/assets/`; MV3 icons under `icons` and `action.default_icon`.
- Testing: none configured yet; if adding, prefer Vitest colocated under `src/**/__tests__`.
- Planned engine patterns:
  - Overlay root with shadow DOM; per-mode modules manage CSS vars/lightweight JS; separate audit sidebar DOM.
  - State in `chrome.storage.sync` for presets/config; background owns permission truth and shortcuts; content caches in-memory.

## Gotchas

- Side panel requires `sidePanel` permission (already present);
- Current scaffold uses a persistent content script with `matches: ['https://*/*']`. Planned least-privilege design prefers on-demand injection (consider migrating when implementing permission flows).
- Dev server CORS is opened for `chrome-extension://` origins.
- CRXJS expects `manifest.config.ts` to be the single source of truth; do not hand-edit `dist/manifest.json`.
- Restricted pages: `chrome://*`, Web Store, and some special schemes won’t allow injection; `file://` requires a user toggle in `chrome://extensions` (plan for notices/UX).

## Typical changes – examples

- Add a new component: place under `src/components/` and import with `@/components/MyComponent`.
- Add a background service worker (planned features like shortcuts/panic-off):
  - Create `src/background/main.ts`.
  - In `manifest.config.ts`, add `background: { service_worker: 'src/background/main.ts', type: 'module' }`.
- Switch to on-demand injection (least-privilege):
  - Remove or narrow persistent `content_scripts`; inject with `chrome.scripting.executeScript` on user action.
  - Use runtime messaging to coordinate between popup/background/content.
- Add another content script (if still using CS):
  - Extend `content_scripts` array in `manifest.config.ts` with additional `js` and `matches`.
- Storage model (planned):
  - Use `chrome.storage.sync` keys like `activeModes`, `intensity`, `presets`, `originsAllowed`, `lightweightMode`, `sessionTimeoutMinutes`, `auditSidebarEnabled`, `offlineModeConfirmed`.

## Key files

- `manifest.config.ts` – source of the MV3 manifest.
- `vite.config.ts` – plugins, alias, server CORS, release zip pack.
- `src/popup/**` – popup React app.
- `src/sidepanel/**` – side panel React app.
- `src/content/**` – content script React app.
- `src/components/HelloWorld.tsx` – example component used by popup/sidepanel.
- `public/logo.png` – icon referenced by manifest.
- `docs/planning.mdx` – product/system design for accessibility simulations, permissions model, messaging, storage schema, audit sidebar.

If any of these notes seem off for your current branch, tell me what changed and I’ll tighten the guidance.
