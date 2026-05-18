# Bernard Simulator Agent Notes

Always read this file before starting any task in this repository.

## Project Shape

- This is a frontend-only Vite + React + Tailwind + Phaser project.
- React owns the application chrome, sliders, and stats.
- Phaser owns the simulation canvas and animation loop.
- Pure simulation rules live under `src/simulation` and should remain testable without Phaser.

## Commands

- `make up` starts the local Vite app.
- `make kill` stops the local Vite app on port 5173.
- `make test` runs Vitest.
- `make build` runs TypeScript and the production Vite build.
- `make deploy` builds and publishes `dist` to GitHub Pages.

## Conventions

- Keep the project frontend-only until explicitly asked to add persistence or a backend.
- Prefer small pure functions for simulation rules and cover behavior changes with unit tests.
- Keep Phaser scene code focused on rendering, movement, and per-frame orchestration.
- Use simple SVG assets in `public/assets` unless a later task asks for generated bitmap art.
- Preserve hash-based navigation because this app is deployed on GitHub Pages.
- Preserve the custom domain CNAME `bernard.thefrenchartist.dev` unless deployment changes.
- Keep the Vite base path as `/` while the app deploys at the custom domain root.
- Always commit and push completed changes, even when working directly on the `main` branch.
