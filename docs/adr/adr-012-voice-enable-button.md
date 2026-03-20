# ADR-012: Voice Enable Button

**Status**: Accepted

**Date**: 2024-03-19

## Context

The Web Speech API requires user interaction to initiate speech due to browser autoplay policies. The welcome message was firing on mount via `useEffect`, which browsers block.

## Decision

We added an explicit "Enable Voice Assistant" landing page that users must click to activate voice features.

### Implementation

- Landing page with "Enable Voice Assistant" button
- Voice state tracked with `voiceEnabled` boolean
- Welcome message plays only after user click
- Subsequent navigation speaks only if voice is enabled

## Consequences

### Positive
- Respects browser autoplay policies
- Users opt-in to voice features
- No console errors from blocked speech

### Negative
- Additional interaction required before voice works
- Some users may not notice the voice feature

## Browser Compatibility

Voice works best in:
- **Safari** - Native Web Speech API support
- **Chrome** - May require user gesture, check tab audio settings
- **Firefox** - Variable support

## Known Issues

- Chrome on some systems may have audio routing issues
- Voice selection may default to silent voice on some browsers
- Users may need to enable audio permissions in browser settings
