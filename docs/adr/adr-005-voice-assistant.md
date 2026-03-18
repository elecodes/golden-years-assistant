# ADR-005: Web Speech API Integration

**Status**: Accepted

**Date**: 2024-03-18

## Context

Elderly users may have difficulty reading small text or interacting with small touch targets. Voice feedback provides an alternative interaction modality that improves accessibility and user experience.

## Decision

We use the Web Speech API (SpeechSynthesis) for voice feedback:

- Native browser API, no external dependencies
- `speak()` utility function for consistent voice calls
- Adjustable speech rate (0.75 default for clarity)
- Cancels previous speech before new announcements

## Consequences

### Positive
- Zero external dependencies
- Works offline once loaded
- Provides accessibility for visually impaired users
- Confirmation of actions reduces uncertainty

### Negative
- Speech quality varies by browser/OS
- No speech recognition (voice commands) in v1
- May be intrusive in shared environments

## Alternatives Considered

### Amazon Polly / Google TTS
- External API dependency
- Network required
- Setup complexity
- Cost for production use

### Web Speech Recognition (Input)
- Complexity increase for v1
- Accuracy issues with medical terms
- Deferring to future version
