/// <reference types="node" />
import { PollyClient, SynthesizeSpeechCommand } from '@aws-sdk/client-polly';

const client = new PollyClient({
  region: process.env.REGION_POLLY || process.env.AWS_REGION || 'us-east-1',
});

export const handler = async (event: { httpMethod?: string; body?: string | null }) => {
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

  console.log('Incoming event:', JSON.stringify(event, null, 2));

  let body;
  try {
    body = JSON.parse(event.body || '{}');
  } catch {
    console.error('Failed to parse body:', event.body);
    return {
      statusCode: 400,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      body: JSON.stringify({ error: 'Invalid JSON body' })
    };
  }

  const { Text, VoiceId = 'Joanna', Engine = 'neural' } = body;

  if (!Text) {
    console.warn('Missing required field: Text');
    return { 
      statusCode: 400, 
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }, 
      body: JSON.stringify({ error: 'Text is required' }) 
    };
  }

  try {
    console.log(`Synthesizing speech for text length ${Text.length} with engine ${Engine}`);
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
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    for await (const chunk of response.AudioStream as any) {
      chunks.push(...chunk);
    }
    const audioBuffer = Buffer.from(chunks);

    return {
      statusCode: 200,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      body: JSON.stringify({ audioBase64: audioBuffer.toString('base64') }),
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