# ADR-011: Sentry Error Monitoring

**Status**: Accepted

**Date**: 2024-03-19

## Context

We needed error monitoring to track and diagnose issues in production. For a healthcare app targeting elderly users, understanding errors quickly is critical for maintaining reliability.

## Decision

We use Sentry for browser error monitoring.

### Why Sentry?

- **Real-time error tracking** - Immediate alerts for production errors
- **Source maps** - Stack traces with readable code locations
- **Session replay** - Debug UI issues with session recordings
- **Performance monitoring** - Track slow interactions
- **Privacy controls** - Can disable replay/mask sensitive data

## Configuration

### Environment Variables

```bash
# .env.example
VITE_SENTRY_DSN=  # Get from sentry.io
VITE_APP_ENV=development
```

### Features Enabled

| Feature | Sample Rate | Purpose |
|---------|-------------|---------|
| Tracing | 10% | Performance monitoring |
| Session Replay | 10% | UI debugging |
| Error Replay | 100% | Full capture on errors |

## Consequences

### Positive
- Faster error diagnosis in production
- Performance insights
- User session context
- Privacy-aware (replays masked by default)

### Negative
- Requires Sentry account (free tier available)
- Adds ~6KB to bundle
- Must configure DSN before use

## Implementation

### File Structure

```
src/monitoring/
├── sentry.ts       # Sentry initialization
└── sentry.test.ts  # Tests (mocked)
```

### Usage

```typescript
import { captureError, captureMessage } from '@/monitoring/sentry';

captureError(new Error('Something broke'), { userId: '123' });
captureMessage('User completed onboarding', 'info');
```

### Privacy

- Replay masking enabled by default
- No sensitive data captured without consent
- Can disable with feature flags

## Alternatives Considered

### LogRocket
- Good for session replay
- Less focused on error tracking
- Different pricing model

### Console + Analytics
- No centralized view
- Manual error tracking
- Less reliable
