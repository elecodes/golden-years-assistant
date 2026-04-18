# Polly Speech Lambda

AWS Lambda function for Amazon Polly Neural TTS integration.

## Quick Deploy

```bash
# Install serverless globally
npm install -g serverless

# Set AWS credentials
export AWS_ACCESS_KEY_ID=your_key
export AWS_SECRET_ACCESS_KEY=your_secret

# Deploy to AWS
serverless deploy --stage production

# Get endpoint URL
serverless info --stage production
```

## Environment

| Variable | Default | Description |
|----------|---------|-------------|
| AWS_REGION | us-east-1 | AWS region |
| POLLY_ENGINE | neural | Polly engine (standard/neural) |

## API

### POST /polly

Request:
```json
{
  "Text": "Hello, this is a test message",
  "VoiceId": "Joanna",
  "Engine": "neural"
}
```

Response: MP3 audio (base64 encoded)

## Cost

- AWS Lambda: Free tier (1M requests/month)
- Polly Neural: $16/million chars (free tier: 1M/month for 12 months)

Total free: ~62,500 requests/month for new AWS accounts.

## Frontend Configuration

After deployment, set in `.env`:
```
VITE_VOICE_PROVIDER=polly
VITE_POLLY_VOICE=Joanna
VITE_POLLY_API_ENDPOINT=https://xxx.execute-api.region.amazonaws.com/production/polly
```