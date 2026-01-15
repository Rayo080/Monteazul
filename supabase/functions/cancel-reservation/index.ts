import { serve } from "https://deno.land/std@0.177.0/http/server.ts"
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.39.7"
import Stripe from "https://esm.sh/stripe@13.11.0?target=deno&no-check"

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
}

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders })
  }

  try {
    const { reservaId, paymentIntentId } = await req.json()

    if (!reservaId) {
      throw new Error("reservaId es obligatorio")
    }

    const supabaseClient = createClient(
      Deno.env.get("SUPABASE_URL") ?? "",
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? ""
    )

    // 1️⃣ OBTENER RESERVA (incluye total_base)
    const { data: reserva, error: fetchError } = await supabaseClient
      .from("reservas")
      .select(`
        fecha_entrada,
        fecha_salida,
        cant_privado,
        cant_publico,
        total_base,
        estado
      `)
      .eq("id", reservaId)
      .single()

    if (fetchError || !reserva) {
      throw new Error("No se encontró la información de la reserva")
    }

    // 🔒 Evitar doble cancelación
    if (reserva.estado === "cancelada") {
      throw new Error("La reserva ya fue cancelada")
    }

    // 2️⃣ REEMBOLSO PARCIAL EN STRIPE (solo total_base)
    if (paymentIntentId && paymentIntentId !== "null") {
      const totalBase = Number(reserva.total_base || 0)
      const refundAmount = Math.round(totalBase * 100) // céntimos

      if (refundAmount > 0) {
        const stripe = new Stripe(Deno.env.get("STRIPE_SECRET_KEY") ?? "", {
          httpClient: Stripe.createFetchHttpClient(),
        })

        await stripe.refunds.create({
          payment_intent: paymentIntentId,
          amount: refundAmount,
          reason: "requested_by_customer",
          metadata: {
            reserva_id: reservaId,
            tipo: "cancelacion_reembolso_base",
          },
        })
      }
    }

    // 3️⃣ RESTAURAR STOCK
    const cantPrivado = Number(reserva.cant_privado || 0)
    const cantPublico = Number(reserva.cant_publico || 0)

    if (cantPrivado > 0 || cantPublico > 0) {
      const { data: availRows, error: availError } = await supabaseClient
        .from("disponibilidad")
        .select("date, stock_privada, stock_compartida")
        .gte("date", reserva.fecha_entrada)
        .lt("date", reserva.fecha_salida)

      if (availError) {
        console.error("Error leyendo disponibilidad:", availError.message)
      }

      if (availRows && availRows.length > 0) {
        for (const row of availRows) {
          const newPrivada = Number(row.stock_privada || 0) + cantPrivado
          const newCompartida = Number(row.stock_compartida || 0) + cantPublico

          const { error: updErr } = await supabaseClient
            .from("disponibilidad")
            .update({
              stock_privada: newPrivada,
              stock_compartida: newCompartida,
            })
            .eq("date", row.date)

          if (updErr) {
            console.error("Error actualizando disponibilidad:", row.date, updErr.message)
          }
        }
      }
    }

    // 4️⃣ MARCAR RESERVA COMO CANCELADA
    const { error: updateError } = await supabaseClient
      .from("reservas")
      .update({ estado: "cancelada" })
      .eq("id", reservaId)

    if (updateError) {
      throw updateError
    }

    return new Response(
      JSON.stringify({ success: true }),
      {
        status: 200,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      }
    )
  } catch (err: any) {
    return new Response(
      JSON.stringify({ error: err.message }),
      {
        status: 400,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      }
    )
  }
})
