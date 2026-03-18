# ADR-002: Zustand for State Management

**Status**: Accepted

**Date**: 2024-03-16

## Context

We needed simple, lightweight state management with built-in persistence for a healthcare app that stores critical data (medications, tasks, hydration) that must survive browser refreshes and sessions.

## Decision

We chose Zustand with the persist middleware for state management.

- Zustand is minimal and has excellent TypeScript support
- Persist middleware uses localStorage automatically
- Simple API without complex boilerplate

## Consequences

### Positive
- Minimal boilerplate (~100 lines total store code)
- Built-in persistence to localStorage
- Excellent TypeScript support
- DevTools for debugging

### Negative
- No built-in undo/redo
- No automatic time-travel debugging
- LocalStorage has 5-10MB limit (sufficient for our use case)

## Alternatives Considered

### Redux Toolkit
- Too much boilerplate for a small app
- Overhead for our simple state needs

### Jotai
- Atomic model adds unnecessary complexity
- Zustand's API is more familiar

### Context API + useReducer
- More verbose
- No built-in persistence
