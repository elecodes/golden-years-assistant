# ADR-003: Tailwind CSS for Styling

**Status**: Accepted

**Date**: 2024-03-16

## Context

We needed a styling solution that supports rapid UI development, consistent design system, and excellent elderly-accessibility features (large text, high contrast, clear spacing).

## Decision

We chose Tailwind CSS 4 with Vite plugin integration.

- Utility-first CSS enables rapid prototyping
- Built-in responsive design utilities
- Custom theme configuration for healthcare accessibility
- Zero runtime overhead with Vite

## Consequences

### Positive
- Fast iteration with inline utilities
- Consistent spacing and sizing
- Easy to implement accessibility requirements
- Custom colors via `@theme` directive
- Purges unused CSS for small bundles

### Negative
- Class name verbosity in JSX
- Learning curve for developers new to Tailwind
- IDE autocomplete required for best experience

## Alternatives Considered

### CSS Modules
- More verbose class management
- No built-in design system support

### Styled Components
- Runtime CSS overhead
- More complex setup with TypeScript

### Vanilla CSS + Variables
- No utility classes for responsive design
- More manual work for common patterns
