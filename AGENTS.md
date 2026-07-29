# AGENTS.md

## Project Overview

Maniok is a SvelteKit webapp for viewing git-hosted Structurizr/C4 architecture documentation. It loads a Structurizr-exported `.maniok/workspace.json`, parses diagrams and Markdown documentation, and renders an interactive documentation UI with embedded C4 diagrams.

The repository is a TypeScript/Svelte 5 codebase with a root webapp and two local packages:

- `src/`: SvelteKit webapp routes, app shell, page-specific UI, CSS, and state.
- `packages/maniok-core/`: core domain models, parsers, services, Svelte components, diagram rendering, navigation, layout, and Markdown rendering.
- `packages/maniok-exporter/`: Node-side watcher/exporter that runs Structurizr to export `workspace.dsl` to `workspace.json` for preview mode.

This is not configured as an npm workspace; the root app depends on the packages through `file:` dependencies. The root `vite.config.ts` aliases `maniok-core` directly to `packages/maniok-core/src/index.ts` so app development uses core source files directly.

## Architecture

### Webapp

- `src/routes/+page.svelte` is the landing page and repository selector.
- `src/routes/+page.server.ts` redirects to `/local` when `WORKSPACE_PATH` is set.
- `src/routes/[provider]/[org]/[name]/+page.server.ts` loads `.maniok/workspace.json` from public GitHub repositories through `RepositoryService`.
- `src/routes/local/+page.server.ts` loads `${WORKSPACE_PATH ?? '.maniok'}/workspace.json` from the local filesystem.
- `src/routes/local/workspacechanged/+server.ts` polls a `maniok-exporter` watcher so local preview can hot-reload on `workspace.json` changes.
- `src/routes/examples/[id]/+page.server.ts` loads pre-generated example workspaces from `EXAMPLES_PATH` or `examples/generated`.
- `src/lib/app.svelte` is the shared app shell. It passes `workspaceJson` into `DocumentationProvider` and composes navigation, document view, diagram view, theme switch, repository selector, and optional route-specific controls.
- `src/css/app.css` imports Tailwind, Skeleton, XYFlow styles, theme files, and repository-wide CSS modules.

### Core Package

`packages/maniok-core/src/index.ts` is the public API. Keep exported types, services, and components intentional.

Key core responsibilities:

- `model/szr/szrworkspace.ts`: Zod schemas and inferred types for the supported Structurizr workspace JSON subset.
- `service/workspaceservice.ts`: parses raw workspace JSON and validates it with Zod.
- `service/diagramservice.ts`: converts Structurizr views and model elements into Maniok diagram models.
- `service/documentservice.ts`: builds the documentation tree from workspace and element documentation.
- `service/markdownservice.ts`: converts Markdown to sanitized HTML, collects headings, and maps `embed:` images to `<diagram-embed>` placeholders.
- `components/documentationprovider.svelte`: creates the reactive `documentationContext`, parses workspace JSON, derives diagrams and document tree, and exposes state through Svelte context.
- `components/content/documentview.svelte`: renders sanitized HTML and mounts embedded diagrams into `diagram-embed[data-diagram-key]` placeholders.
- `components/internal/diagram/*`: renders diagrams with `@xyflow/svelte` custom nodes and edges.
- `service/layoutservice.ts` and `service/xyflow/*`: map Maniok diagram models to XYFlow nodes/edges and calculate Dagre layout.

### Exporter Package

- `packages/maniok-exporter/src/exporter.ts` runs `java -jar /usr/local/structurizr.war export -w workspace.dsl -f json -o <workspaceDirectory>`.
- `packages/maniok-exporter/src/watcher.ts` wraps `chokidar` and calls `onChange` on file add/change/unlink.
- `packages/maniok-exporter/src/main.ts` requires `WORKSPACE_PATH`, performs an initial export, then watches the workspace directory while ignoring `workspace.json`.
- `Dockerfile.Preview` combines the built webapp, built exporter, and Structurizr image so mounted `.maniok` workspaces can be exported and previewed live.

## Runtime Data Flow

1. A route loader obtains a raw `workspaceJson` string from GitHub, local disk, or example fixtures.
2. `src/lib/app.svelte` passes that string to `DocumentationProvider`.
3. `WorkspaceService.parse` validates the Structurizr JSON with the Zod workspace schema.
4. `DiagramService.parse` builds diagram models from supported Structurizr views.
5. `DocumentService.generateDocumentTree` builds the navigation/document tree and uses `MarkdownService.parse` for Markdown sections.
6. Svelte components read and mutate `documentationContext` to switch modes, selected diagrams, selected documents, active headings, and focused diagrams.
7. Diagram components map diagram models to XYFlow nodes/edges, calculate layout with Dagre, and render custom Svelte nodes/edges.

## Commands

- `npm i`: install dependencies.
- `npm run dev`: run the SvelteKit dev server.
- `npm run check`: sync SvelteKit and run `svelte-check` against the root app.
- `npm run build`: build the root SvelteKit app.
- `npm run test --prefix packages/maniok-core`: run the core package Vitest suite.
- `npm run build --prefix packages/maniok-core`: type-check/package `maniok-core`.
- `npm run build --prefix packages/maniok-exporter`: build the exporter package.
- `npm run exportexamples`: zip the repository's `.maniok` documentation into `examples/maniokdocs.zip`.

Dockerfiles use Node 25. `.npmrc` has `engine-strict=true`, so prefer a current Node version compatible with the package dependency engines.

## Development Guidelines

- Use Svelte 5/runes patterns. The root Svelte config enables runes for project files, and `packages/maniok-core/svelte.config.js` sets `compilerOptions.runes = true`.
- Keep TypeScript strict. Avoid `any` unless interacting with untyped AST/library structures where a narrower type is impractical.
- Preserve the existing formatting style: single quotes, no semicolons, 4-space indentation, `printWidth: 100`, and no trailing commas.
- Prefer small, focused changes. Keep domain parsing/mapping logic in services and UI composition in Svelte components.
- When adding core functionality, update or add tests under `packages/maniok-core/test` when the behavior can be verified without a browser.
- When changing Structurizr support, update `model/szr/szrworkspace.ts` first, then update service mapping logic and tests.
- When changing exported core APIs, update `packages/maniok-core/src/index.ts` deliberately and check root app imports.
- When changing local preview/export behavior, check both `packages/maniok-exporter` and `Dockerfile.Preview` assumptions.
- Do not manually edit generated build outputs: `.svelte-kit/`, `build/`, and package `dist/` directories.
- Treat `.maniok/workspace.dsl` and `.maniok/markdown/` as source documentation. Treat `.maniok/workspace.json` as exported Structurizr output.
- Treat `examples/generated/**/workspace.json` as generated example data. Prefer regenerating examples instead of hand-editing them unless the task explicitly asks for fixture edits.
- Never commit secrets. `.env` and `.env.*` are ignored; use environment variables for `WORKSPACE_PATH` and `EXAMPLES_PATH`.

## Verification

For most changes, run at least:

```bash
npm run check
```

For core parser/service/layout changes, also run:

```bash
npm run test --prefix packages/maniok-core
```

For production/runtime changes, run:

```bash
npm run build
```

For exporter changes, run:

```bash
npm run build --prefix packages/maniok-exporter
```
