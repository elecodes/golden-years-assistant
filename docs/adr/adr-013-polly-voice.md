# ADR-013: Amazon Polly Voice Integration

## Status
Accepted

## Context
Need to replace browser's robotic TTS with natural-sounding voice for elderly users. Browser SpeechSynthesis often has unnatural accents and limited voice options.

## Decision
Use Amazon Polly Neural TTS via Lambda API endpoint.

## Technical Approach

### Voice Service
- **Amazon Polly**: Joanna (Neural female voice)
- **Pricing**: $16/M chars (Neural) - 1M free/month for 12 months

### API Layer
- AWS Lambda (Node.js 20.x)
- API Gateway for HTTP endpoint
- Keeps AWS credentials secure (not exposed to browser)

### Client
- PollyService with memory cache for repeated messages
- Falls back to browser TTS if API fails or offline

## Architecture

```
Frontend → API Gateway → Lambda → Polly → MP3 → Frontend
                ↑
          AWS credentials (server-side)
```

## File Changes

| File | Action |
|------|--------|
| `src/config/voice.ts` | Create |
| `src/config/voice-feature.ts` | Create |
| `src/services/polly.service.ts` | Create |
| `src/utils/voice.ts` | Modify |
| `src/lambda/polly-speech.ts` | Create |
| `serverless.yml` | Create |

## Open Questions Resolved

- [x] Voice: Joanna (Neural female)
- [x] Security: Lambda API keeps keys server-side
- [x] Caching: In-memory, 50 messages max

## Related
- AWS Polly pricing: https://aws.amazon.com/polly/pricing/