# ADR-008: Husky Git Hooks

**Status**: Accepted

**Date**: 2024-03-19

## Context

Following the QualityTesting skill's requirements for automated quality gates, we needed Git hooks to enforce:
- All tests pass before commit
- Coverage thresholds met before push
- No lint errors
- Successful production build

## Decision

We implemented Husky with two automated hooks:

### pre-commit Hook
Runs before every commit:
1. Execute `npm run test:ci` - Run all tests
2. Execute `npm run lint` - Check for lint errors
3. Execute `npm run build` - Verify production build

### pre-push Hook
Runs before every push:
1. Execute `npm run test:coverage` - Verify 80% coverage threshold

## Consequences

### Positive
- Prevents broken code from being committed
- Enforces coverage standards automatically
- Blocks pushes with insufficient test coverage
- Mac-compatible with proper chmod

### Negative
- Hooks can slow down commits (but save time debugging)
- Requires npm install for first-time setup (handled by prepare script)

## Implementation

### Setup

```bash
npm install -D husky
npx husky init
```

### Hooks Location

```
.husky/
├── _/
│   └── husky.sh          # Base hook script
├── pre-commit            # Runs: tests, lint, build
└── pre-push              # Runs: coverage check
```

### Mac Compatibility

Following the QualityTesting skill requirements:
- All hooks made executable: `chmod +x .husky/*`
- Using POSIX-compatible shell syntax

### Automatic Setup

The `prepare` script in package.json ensures hooks are set up automatically:
```json
{
  "scripts": {
    "prepare": "husky"
  }
}
```
