# Agent Guidelines for Chill Teacher Frontend

## Commands

- **Build**: `pnpm build` (runs vite build + tsc)
- **Lint**: `pnpm lint` (eslint)
- **Format**: `pnpm format` (prettier)
- **Test**: `pnpm test` (vitest run)
- **Single test**: `pnpm test <filename>` (vitest run <filename>)
- **Dev**: `pnpm dev` (vite on port 4000)
- **Check all**: `pnpm check` (format + lint fix)

## Code Style

- **Imports**: Use `@/lib/*` path alias, no import sorting rules enforced
- **Formatting**: No semicolons, single quotes, trailing commas
- **TypeScript**: Strict mode enabled, React functional components with interfaces
- **Components**: Use React.FC, define interfaces for props, memoize with useMemo/useEffect
- **State**: TanStack Store for global state, useState for local state
- **Naming**: PascalCase for components, camelCase for functions/variables
- **Error handling**: Try-catch with proper error types, use existing error patterns
- **File structure**: Group by feature (components/, hooks/, stores/, types/)
