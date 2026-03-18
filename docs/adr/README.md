# Architecture Decision Records

This directory contains architecture decision records (ADRs) for the GoldenYears Assistant project.

## ADR Format

Each ADR contains:
- **Title**: Brief description
- **Status**: Proposed, Accepted, Deprecated, Superseded
- **Context**: Background and problem statement
- **Decision**: The chosen solution
- **Consequences**: Benefits and drawbacks

## Index

| Number | Title | Status | Date |
|--------|-------|--------|------|
| [001](./adr-001-react-typescript-vite.md) | React + TypeScript + Vite Stack | Accepted | 2024-03-16 |
| [002](./adr-002-zustand-state.md) | Zustand for State Management | Accepted | 2024-03-16 |
| [003](./adr-003-tailwind-styling.md) | Tailwind CSS for Styling | Accepted | 2024-03-16 |
| [004](./adr-004-accessibility-first.md) | Accessibility-First Design | Accepted | 2024-03-18 |
| [005](./adr-005-voice-assistant.md) | Web Speech API Integration | Accepted | 2024-03-18 |

## Creating New ADRs

When making significant architectural decisions:

1. Copy the template: `docs/adr/template.md`
2. Name it: `adr-NNN-title.md` (next sequential number)
3. Update this index
4. Document context, decision, and consequences
