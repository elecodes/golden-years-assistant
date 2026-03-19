# ADR-007: Vitest Testing Infrastructure

**Status**: Accepted

**Date**: 2024-03-19

## Context

We needed a testing infrastructure that integrates well with Vite, provides fast execution, and supports our 100/80/0 coverage strategy. The project is a React SPA with core business logic in store and utilities.

## Decision

We chose Vitest with the following configuration:

- **Test Runner**: Vitest (Vite-native)
- **Environment**: happy-dom (lightweight DOM implementation)
- **Testing Library**: @testing-library/react + @testing-library/jest-dom
- **Coverage**: v8 provider with 80% global threshold

### Test Coverage Strategy (100/80/0)

| Layer | Coverage Target | Examples |
|-------|-----------------|----------|
| CORE | 100% | src/utils/, src/store/ |
| GLOBAL | 80% | src/pages/, src/components/ |
| INFRA | 0% | configs, static files |

## Consequences

### Positive
- Fast HMR during test development
- Native Vite integration
- TypeScript support out of the box
- Modern ESM support
- 100% coverage on core utilities achieved

### Negative
- happy-dom missing some Web APIs (SpeechSynthesis)
- Requires mocking browser APIs in setup

## Implementation

### Scripts Added

```bash
npm run test        # Run tests in watch mode
npm run test:ci     # Run tests once (CI mode)
npm run test:coverage  # Generate coverage report
```

### File Structure

```
src/
├── test/
│   └── setup.ts        # Global test setup + mocks
├── utils/
│   └── voice.test.ts   # Voice utility tests
└── store/
    └── useStore.test.ts # Store tests
```
