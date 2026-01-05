import { serve } from "https://deno.land/std@0.177.0/http/server.ts"
import Stripe from "https://esm.sh/stripe@13.11.0?target=deno&no-check"


const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
  if (req.method === 'OPTIONS') return new Response('ok', { headers: corsHeaders })

  try {
    const { total, codigoReserva, clienteEmail } = await req.json()

    const stripe = new Stripe(Deno.env.get('STRIPE_SECRET_KEY') ?? '', {
     
      httpClient: Stripe.createFetchHttpClient(),
    })

    const session = await stripe.checkout.sessions.create({
      customer_email: clienteEmail,
      line_items: [{
        price_data: {
          currency: 'eur',
          product_data: { name: `Reserva Monteazul - ${codigoReserva}` },
          unit_amount: Math.round(total * 100),
        },
        quantity: 1,
      }],
      mode: 'payment',
      success_url: `${req.headers.get('origin')}/exito?codigo=${codigoReserva}`,
      cancel_url: `${req.headers.get('origin')}/reserva`,
      metadata: {
        codigoReserva: codigoReserva
      },
    })

    return new Response(JSON.stringify({ url: session.url }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: 200,
    })
  } catch (err) {
    return new Response(JSON.stringify({ error: err.message }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: 400,
    })
  }
})
