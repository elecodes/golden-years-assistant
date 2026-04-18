import { PollyClient, SynthesizeSpeechCommand } from '@aws-sdk/client-polly';

const client = new PollyClient({
  credentials: {
    accessKeyId: process.env.POLLY_KEY!,
    secretAccessKey: process.env.POLLY_SECRET!,
  },
  region: process.env.REGION_POLLY || 'us-east-1',
});

export const handler = async (event: any) => {
  const corsHeaders = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'POST,OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type',
  };

  if (event.httpMethod === 'OPTIONS') {
    return { statusCode: 204, headers: corsHeaders, body: '' };
  }

  if (event.httpMethod !== 'POST') {
    return { 
      statusCode: 405, 
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }, 
      body: JSON.stringify({ error: 'Method not allowed' }) 
    };
  }

  const body = JSON.parse(event.body || '{}');
  const { Text, VoiceId = 'Joanna', Engine = 'neural' } = body;

  if (!Text) {
    return { 
      statusCode: 400, 
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }, 
      body: JSON.stringify({ error: 'Text is required' }) 
    };
  }

  try {
    const command = new SynthesizeSpeechCommand({
      Text,
      TextType: 'text',
      OutputFormat: 'mp3',
      VoiceId,
      Engine,
    });

    const response = await client.send(command);

    if (!response.AudioStream) {
      return { 
        statusCode: 500, 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }, 
        body: JSON.stringify({ error: 'Failed to generate audio' }) 
      };
    }

    const chunks: number[] = [];
    // @ts-ignore - AudioStream is async iterable
    for await (const chunk of response.AudioStream) {
      chunks.push(...chunk);
    }
    const audioBuffer = Buffer.from(chunks);

    return {
      statusCode: 200,
      headers: { ...corsHeaders, 'Content-Type': 'audio/mpeg' },
      body: audioBuffer.toString('base64'),
      isBase64Encoded: true,
    };
  } catch (error) {
    console.error('Error:', error);
    return { 
      statusCode: 500, 
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }, 
      body: JSON.stringify({ error: 'Internal error', message: String(error) }) 
    };
  }
};