# Repository Overview

- **Name**: chill-teacher (frontend)
- **Framework**: React 19 with TypeScript via Vite
- **Routing**: @tanstack/react-router file-based routing
- **Styling**: Tailwind CSS 4 and custom CSS modules/components
- **UI Library**: Ant Design for shared components

# Project Structure (key folders)

1. **src/lib/components** – Shared UI elements, game implementations, and utilities
2. **src/routes** – Lesson pages and router entries (file-based configuration)
3. **public** – Static assets such as backgrounds, sounds, vocab images
4. **scripts** – Helper shell scripts for build/deploy tasks

# NPM Scripts

1. `npm run dev` – Start local Vite dev server on port 4000
2. `npm run build` – Build production bundle and run `tsc`
3. `npm run serve` – Preview the production build
4. `npm run test` – Execute Vitest unit tests
5. `npm run lint` – Run ESLint checks
6. `npm run check` – Format with Prettier and auto-fix lint issues

# Notes

- Ensure Node.js 18+ for compatibility with Vite 7 and Tailwind 4
- Game definitions live under `src/lib/components/games` and are dynamically registered in lessons
