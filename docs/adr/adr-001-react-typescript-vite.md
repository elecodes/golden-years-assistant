# ADR-001: React + TypeScript + Vite Stack

**Status**: Accepted

**Date**: 2024-03-16

## Context

We needed a modern, fast, and maintainable frontend framework for a voice-enabled healthcare assistant targeting elderly users. The stack needed to support:
- Fast development iteration with hot module replacement
- Type safety for healthcare-related code
- Small bundle sizes for mobile users
- Strong ecosystem of libraries

## Decision

We chose React 19 with TypeScript and Vite as the core stack.

- **React 19**: Latest React with concurrent features and improved performance
- **TypeScript**: Type safety for maintainable healthcare code
- **Vite**: Fast dev server and optimized production builds

## Consequences

### Positive
- Fast HMR for rapid development
- Excellent TypeScript integration
- Small production bundle (~76KB gzipped)
- Large ecosystem of compatible libraries

### Negative
- React compiler not enabled (performance tradeoff)
- Some libraries may have compatibility issues with React 19

## Alternatives Considered

### Next.js
- SSR not needed for a client-side SPA
- More complexity than necessary

### Svelte/SvelteKit
- Smaller community for React libraries
- Team familiarity with React
