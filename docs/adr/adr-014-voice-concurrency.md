# ADR-014: Voice Concurrency & Cancellation

## Status
Accepted

## Context
Elderly users may interact with the interface rapidly (e.g., clicking multiple tasks or buttons). Without proper concurrency handling, the voice assistant would play multiple audio streams simultaneously (AWS Polly audio + Browser TTS), creating a confusing and noisy experience.

## Decision
Implement an "Interruptive" concurrency model where the newest voice request always cancels and replaces any previous in-flight requests or currently playing audio.

## Technical Approach

### 1. Request Cancellation (AbortController)
- Each `fetch` request to the Polly API is associated with an `AbortController`.
- When a new `speak()` request arrives, `abort()` is called on the previous controller to immediately stop network activity.

### 2. Request Sequencing
- A monotonic `currentRequestId` counter is used to track the order of requests.
- Even if an aborted request's fetch completes (edge case), the service checks if the `requestId` matches the current one before proceeding to playback.

### 3. Immediate Audio Stop
- Before starting a new utterance, the `stop()` method is called on both the `PollyService` and the browser's `speechSynthesis`.
- This clears the speech queue and stops active audio elements instantly.

## Architecture

```
User Action A → speak(A) → stop() → fetch(A)
User Action B → speak(B) → stop() [Cancels A] → fetch(B) → play(B)
```

## File Changes

| File | Action |
|------|--------|
| `src/services/polly.service.ts` | Added AbortController and requestId tracking |
| `src/utils/voice.ts` | Refactored to async/await with centralized stop() |
| `src/services/polly.service.test.ts` | Created tests for cancellation logic |

## Benefits
- **Clarity**: Ensures only one message is heard at a time.
- **Responsiveness**: The system reacts immediately to user input.
- **Efficiency**: Reduces unnecessary data transfer by aborting stale requests.

## Related
- ADR-013: Amazon Polly Voice Integration
