import { createClient } from 'npm:@supabase/supabase-js@2.39.7';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type, Authorization',
};

interface ModerateRequest {
  content: string;
}

interface ModerateResponse {
  isApproved: boolean;
  flags: {
    hate: boolean;
    harassment: boolean;
    selfHarm: boolean;
    sexual: boolean;
    personalInfo: boolean;
  };
  message?: string;
}

// Simple content moderation rules
const moderateContent = (content: string): ModerateResponse => {
  const lowerContent = content.toLowerCase();
  
  // Initialize flags
  const flags = {
    hate: false,
    harassment: false,
    selfHarm: false,
    sexual: false,
    personalInfo: false,
  };
  
  // Check for personal information patterns
  const personalInfoPatterns = [
    /\b[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}\b/i, // Email
    /\b\d{3}[-.]?\d{3}[-.]?\d{4}\b/, // Phone number
    /\b\d{3}-\d{2}-\d{4}\b/, // SSN pattern
  ];

  flags.personalInfo = personalInfoPatterns.some(pattern => pattern.test(content));

  // Check for harmful content patterns
  const harmfulPatterns = {
    hate: [
      'hate', 'racist', 'discrimination', 'bigot',
      // Add more patterns
    ],
    harassment: [
      'bully', 'harass', 'stalk', 'threat',
      // Add more patterns
    ],
    selfHarm: [
      'suicide', 'self-harm', 'kill myself',
      // Add more patterns
    ],
    sexual: [
      'nsfw', 'explicit', 'nude',
      // Add more patterns
    ],
  };

  // Check each category
  Object.entries(harmfulPatterns).forEach(([category, patterns]) => {
    flags[category as keyof typeof flags] = patterns.some(pattern => 
      lowerContent.includes(pattern)
    );
  });

  // Determine if content should be approved
  const hasAnyFlag = Object.values(flags).some(flag => flag);
  
  return {
    isApproved: !hasAnyFlag,
    flags,
    message: hasAnyFlag ? 'Content contains inappropriate or unsafe material' : undefined,
  };
};

Deno.serve(async (req: Request) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { content } = await req.json() as ModerateRequest;
    
    if (!content) {
      return new Response(
        JSON.stringify({ error: 'Content is required' }),
        { 
          status: 400,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        }
      );
    }

    const result = moderateContent(content);
    
    return new Response(
      JSON.stringify(result),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      }
    );
  } catch (error) {
    return new Response(
      JSON.stringify({ error: 'Internal server error' }),
      { 
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      }
    );
  }
});