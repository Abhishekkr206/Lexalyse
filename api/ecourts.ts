export const config = { runtime: 'edge' };

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'OPTIONS, POST',
  'Access-Control-Allow-Headers': 'Content-Type, Authorization',
};

export default async function handler(req: Request) {
  if (req.method === 'OPTIONS') return new Response('OK', { headers: corsHeaders });

  try {
    const { path, body, method } = await req.json();
    const apiKey = process.env.ECOURTS_KEY;
    
    if (!apiKey) {
      return new Response(JSON.stringify({ error: 'ECOURTS_KEY is not configured on the server' }), { status: 500, headers: corsHeaders });
    }

    const url = `https://webapi.ecourtsindia.com${path}`;
    const fetchBody = body ? (typeof body === 'string' ? body : JSON.stringify(body)) : undefined;

    const response = await fetch(url, {
      method: method || 'GET',
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json'
      },
      body: fetchBody
    });

    return new Response(response.body, {
      status: response.status,
      headers: { ...corsHeaders, 'Content-Type': response.headers.get('Content-Type') || 'application/json' }
    });
  } catch (e: any) {
    return new Response(JSON.stringify({ error: e.message }), { status: 500, headers: corsHeaders });
  }
}
