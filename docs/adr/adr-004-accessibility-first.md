# ADR-004: Accessibility-First Design

**Status**: Accepted

**Date**: 2024-03-18

## Context

This app targets elderly users who may have visual impairments, motor difficulties, or limited technical literacy. WCAG compliance is not optional—it's a core requirement for the target demographic.

## Decision

We adopted an Accessibility-First design approach:

- **Touch Targets**: Minimum 70px height for all interactive elements
- **Color Contrast**: Primary blue (#1e3a8a) meets WCAG AAA (8.59:1 ratio)
- **Font Size**: Base 20px for comfortable reading
- **Focus States**: Visible 4px ring on keyboard navigation
- **ARIA Labels**: All interactive elements properly labeled
- **Voice Feedback**: Audio confirmation for all actions

## Consequences

### Positive
- Usable by elderly with visual/motor impairments
- Keyboard navigation support
- Screen reader compatible
- Large targets reduce frustration

### Negative
- Larger visual footprint
- Some design compromises for accessibility
- More attributes to maintain

## Alternatives Considered

### Progressive Enhancement
- Starting without accessibility adds tech debt
- Harder to retrofit accessibility later

### Accessibility as Feature
- Less comprehensive than first-class approach
- Risk of incomplete implementation
