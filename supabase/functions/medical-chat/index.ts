import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

// Use Lovable AI gateway key (auto-provisioned in Lovable Cloud)
const LOVABLE_API_KEY = Deno.env.get('LOVABLE_API_KEY');

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { message, language } = await req.json();
    console.log('Received request:', { message, language });

    if (!LOVABLE_API_KEY) {
      throw new Error('LOVABLE_API_KEY is not configured');
    }

    const languageInstructions: Record<string, string> = {
      telugu: 'You must respond only in Telugu language.',
      hindi: 'You must respond only in Hindi language.',
      kannada: 'You must respond only in Kannada language.',
      tamil: 'You must respond only in Tamil language.',
      marathi: 'You must respond only in Marathi language.',
      urdu: 'You must respond only in Urdu language.',
      malayalam: 'You must respond only in Malayalam language.',
      bengali: 'You must respond only in Bengali language.',
      english: 'You must respond in English language.'
    };

    const systemPrompt = `You are a helpful medical assistant AI. You provide general health information and suggestions.
${languageInstructions[language as keyof typeof languageInstructions] || languageInstructions.english}

IMPORTANT DISCLAIMER: Always remind users that you are an AI assistant and your suggestions are for informational purposes only.
Users should always consult with qualified healthcare professionals for proper medical diagnosis and treatment.

Provide helpful, clear, and compassionate responses about:
- General health tips
- Common symptoms and when to seek medical help
- Healthy lifestyle recommendations
- Basic first aid information
- Medication reminders (but never prescribe)

Never provide:
- Specific medical diagnoses
- Prescription recommendations
- Emergency medical advice (always direct to emergency services)
- Treatment plans without professional consultation`;

    // Call Lovable AI Gateway (OpenAI-compatible API)
    const response = await fetch('https://ai.gateway.lovable.dev/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${LOVABLE_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'google/gemini-2.5-flash', // default recommended model
        messages: [
          { role: 'system', content: systemPrompt },
          { role: 'user', content: String(message ?? '') }
        ],
        stream: false,
      }),
    });

    if (!response.ok) {
      const text = await response.text();
      console.error('AI gateway error:', response.status, text);

      if (response.status === 429) {
        return new Response(
          JSON.stringify({ error: 'Rate limits exceeded, please try again shortly.' }),
          { status: 429, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }
      if (response.status === 402) {
        return new Response(
          JSON.stringify({ error: 'Payment required. Please add AI credits to your workspace.' }),
          { status: 402, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }

      return new Response(
        JSON.stringify({ error: 'AI gateway error' }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const data = await response.json();
    const reply: string = data?.choices?.[0]?.message?.content ||
      'I apologize, but I could not generate a response. Please try again.';

    return new Response(
      JSON.stringify({ reply }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  } catch (error) {
    console.error('Error in medical-chat function:', error);
    return new Response(
      JSON.stringify({
        error: error instanceof Error ? error.message : 'An unexpected error occurred',
        reply: 'I apologize, but I encountered an error. Please try again later.'
      }),
      {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      }
    );
  }
});
