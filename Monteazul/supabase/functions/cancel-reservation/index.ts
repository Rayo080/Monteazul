import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.39.3"
import Stripe from "https://esm.sh/stripe@14.10.0?target=deno"

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
  if (req.method === 'OPTIONS') return new Response('ok', { headers: corsHeaders })

  try {
    const { reservaId, paymentIntentId } = await req.json()
    
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    )

    // 1. OBTENER DETALLES DE LA RESERVA (Columnas reales: cant_privado, cant_publico)
    const { data: reserva, error: fetchError } = await supabaseClient
      .from('reservas')
      .select('fecha_entrada, fecha_salida, cant_privado, cant_publico')
      .eq('id', reservaId)
      .single()

    if (fetchError || !reserva) throw new Error("No se encontró la información de la reserva")

    // 2. REEMBOLSO EN STRIPE
    if (paymentIntentId && paymentIntentId !== 'null') {
      const stripe = new Stripe(Deno.env.get('STRIPE_SECRET_KEY') ?? '', {
        apiVersion: '2022-11-15',
        httpClient: Stripe.createFetchHttpClient(),
      })
      await stripe.refunds.create({ payment_intent: paymentIntentId })
    }

    // 3. AUMENTAR STOCK en la tabla `disponibilidad` para cada fecha del rango
    const cantPrivado = Number(reserva.cant_privado || 0)
    const cantPublico = Number(reserva.cant_publico || 0)

    if (cantPrivado > 0 || cantPublico > 0) {
      const { data: availRows, error: availError } = await supabaseClient
        .from('disponibilidad')
        .select('date, stock_privada, stock_compartida')
        .gte('date', reserva.fecha_entrada)
        .lt('date', reserva.fecha_salida)

      if (availError) console.error('Error leyendo disponibilidad:', availError.message)

      if (availRows && availRows.length > 0) {
        for (const row of availRows) {
          const currentPrivada = Number(row.stock_privada || 0)
          const currentCompartida = Number(row.stock_compartida || 0)
          const newPrivada = currentPrivada + cantPrivado
          const newCompartida = currentCompartida + cantPublico

          const { error: updErr } = await supabaseClient
            .from('disponibilidad')
            .update({ stock_privada: newPrivada, stock_compartida: newCompartida })
            .eq('date', row.date)

          if (updErr) console.error('Error actualizando disponibilidad para', row.date, updErr.message)
        }
      } else {
        console.warn('No se encontraron filas de disponibilidad para el rango de fechas')
      }
    }

    // 4. ACTUALIZAR ESTADO DE LA RESERVA
    const { error: updateError } = await supabaseClient
      .from('reservas')
      .update({ estado: 'cancelada' })
      .eq('id', reservaId)

    if (updateError) throw updateError

    return new Response(JSON.stringify({ success: true }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 200,
    })
  } catch (err) {
    return new Response(JSON.stringify({ error: err.message }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 400,
    })
  }
})