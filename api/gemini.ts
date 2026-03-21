export const config = { runtime: 'edge' };

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'OPTIONS, POST',
  'Access-Control-Allow-Headers': 'Content-Type',
};

export default async function handler(req: Request) {
  if (req.method === 'OPTIONS') return new Response('OK', { headers: corsHeaders });

  try {
    const payload = await req.json();
    const apiKey = process.env.GEMINI_API_KEY;
    
    if (!apiKey) {
      return new Response(JSON.stringify({ error: 'GEMINI_API_KEY is not configured on the server' }), { status: 500, headers: corsHeaders });
    }

    if (payload.stream === true) {
      const targetUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash-lite:streamGenerateContent?key=${apiKey}&alt=sse`;
      
      const geminiBody: any = {
        contents: payload.contents,
        generationConfig: { maxOutputTokens: payload.maxOutputTokens || 1500 }
      };
      
      if (payload.systemInstruction) {
        geminiBody.system_instruction = { parts: [{ text: payload.systemInstruction }] };
      }
      
      const response = await fetch(targetUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(geminiBody)
      });

      return new Response(response.body, {
        status: response.status,
        headers: { ...corsHeaders, 'Content-Type': response.headers.get('Content-Type') || 'application/json' }
      });
    }

    const { path, method, body } = payload;
    const targetUrl = `https://generativelanguage.googleapis.com${path}?key=${apiKey}`;
    const fetchBody = body ? (typeof body === 'string' ? body : JSON.stringify(body)) : undefined;

    const response = await fetch(targetUrl, {
      method: method || 'POST',
      headers: { 'Content-Type': 'application/json' },
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
