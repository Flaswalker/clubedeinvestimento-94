
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.39.0';
import { serve } from 'https://deno.land/std@0.177.0/http/server.ts';
import { corsHeaders } from '../_shared/cors.ts';

const supabaseUrl = Deno.env.get('SUPABASE_URL') || '';
const supabaseAnonKey = Deno.env.get('SUPABASE_ANON_KEY') || '';
const mercadoPagoAccessToken = Deno.env.get('MP_ACCESS_TOKEN') || '';

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    // Create a Supabase client
    const supabase = createClient(supabaseUrl, supabaseAnonKey);
    
    // Get the request body
    const { amount, email, cpf, firstName, lastName } = await req.json();
    
    // Validate inputs
    if (!amount || !email || !cpf || !firstName || !lastName) {
      return new Response(
        JSON.stringify({ error: 'Todos os campos são obrigatórios' }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 400 }
      );
    }
    
    // Create payment using Mercado Pago API
    const paymentData = {
      transaction_amount: amount,
      payment_method_id: 'pix',
      payer: {
        email,
        first_name: firstName,
        last_name: lastName,
        identification: { type: 'CPF', number: cpf },
      },
    };
    
    const mpResponse = await fetch('https://api.mercadopago.com/v1/payments', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${mercadoPagoAccessToken}`,
      },
      body: JSON.stringify(paymentData),
    });
    
    const mpData = await mpResponse.json();
    
    if (mpResponse.status !== 201) {
      console.error('Mercado Pago error:', mpData);
      return new Response(
        JSON.stringify({ error: 'Erro ao processar pagamento' }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 500 }
      );
    }
    
    // Return the PIX data
    const pixData = {
      qr_code: mpData.point_of_interaction?.transaction_data?.qr_code,
      qr_code_base64: mpData.point_of_interaction?.transaction_data?.qr_code_base64,
      payment_id: mpData.id,
    };
    
    return new Response(
      JSON.stringify(pixData),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
    
  } catch (error) {
    console.error('Error:', error.message);
    return new Response(
      JSON.stringify({ error: 'Erro interno ao processar o pagamento' }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 500 }
    );
  }
});

