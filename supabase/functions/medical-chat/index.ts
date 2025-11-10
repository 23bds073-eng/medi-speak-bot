import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

const GEMINI_API_KEY = Deno.env.get('GEMINI_API_KEY');

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { message, language } = await req.json();
    console.log('Received request:', { message, language });

    if (!GEMINI_API_KEY) {
      throw new Error('GEMINI_API_KEY is not configured');
    }

    const languageInstructions = {
      telugu: 'You must respond only in Telugu language.',
      hindi: 'You must respond only in Hindi language.',
      kannada: 'You must respond only in Kannada language.',
      tamil: 'You must respond only in Tamil language.',
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

    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${GEMINI_API_KEY}`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          contents: [{
            parts: [{
              text: `${systemPrompt}\n\nUser question: ${message}`
            }]
          }],
          generationConfig: {
            temperature: 0.7,
            topK: 40,
            topP: 0.95,
            maxOutputTokens: 1024,
          }
        })
      }
    );

    if (!response.ok) {
      const errorText = await response.text();
      console.error('Gemini API error:', response.status, errorText);
      throw new Error(`Gemini API error: ${response.status}`);
    }

    const data = await response.json();
    console.log('Gemini response received');
    
    const reply = data.candidates?.[0]?.content?.parts?.[0]?.text || 
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
