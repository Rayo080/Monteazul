import { serve } from "https://deno.land/std@0.177.0/http/server.ts"
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.39.7"
import Stripe from "https://esm.sh/stripe@13.11.0?target=deno&no-check"

// ─────────────────────────────────────────────
// Clientes y Configuración
// ─────────────────────────────────────────────
const stripe = new Stripe(Deno.env.get("STRIPE_SECRET_KEY") ?? "", {
  httpClient: Stripe.createFetchHttpClient(),
})

const supabaseAdmin = createClient(
  Deno.env.get("SUPABASE_URL") ?? "",
  Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? ""
)

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type, stripe-signature",
}

// ─────────────────────────────────────────────
// Servidor
// ─────────────────────────────────────────────
serve(async (req) => {
  if (req.method === "OPTIONS") return new Response("ok", { headers: corsHeaders })

  try {
    const signature = req.headers.get("stripe-signature")
    if (!signature) return new Response("Missing signature", { status: 400 })

    const body = await req.text()
    const webhookSecret = Deno.env.get("STRIPE_WEBHOOK_SECRET") ?? ""

    const event = await stripe.webhooks.constructEventAsync(body, signature, webhookSecret)

    if (event.type === "checkout.session.completed") {
      const session = event.data.object as Stripe.Checkout.Session
      const codigoReserva = session.metadata?.codigoReserva
      const paymentIntentId = session.payment_intent as string

      if (!codigoReserva) throw new Error("codigoReserva no encontrado")

      // 1. Confirmar reserva
      const { data: reserva, error } = await supabaseAdmin
        .from("reservas")
        .update({ estado: "confirmado", payment_intent_id: paymentIntentId })
        .eq("codigo_reserva", codigoReserva)
        .select()
        .single()

      if (error || !reserva) throw error ?? new Error("Reserva no encontrada")

      // 2. Descontar stock por noches en tabla 'disponibilidad'
      const fechaInicio = new Date(reserva.fecha_entrada)
      const fechaFin = new Date(reserva.fecha_salida)

      for (let d = new Date(fechaInicio); d < fechaFin; d.setDate(d.getDate() + 1)) {
        const fechaISO = d.toISOString().split("T")[0]

        const { data: dia } = await supabaseAdmin
          .from("disponibilidad")
          .select("stock_privada, stock_compartida")
          .eq("date", fechaISO)
          .single()

        if (dia) {
          await supabaseAdmin
            .from("disponibilidad")
            .update({
              stock_privada: Math.max(0, (dia.stock_privada || 0) - (reserva.cant_privado || 0)),
              stock_compartida: Math.max(0, (dia.stock_compartida || 0) - (reserva.cant_publico || 0)),
            })
            .eq("date", fechaISO)
        }
      }

    // 3. Enviar email profesional vía Resend con diseño Ultra-Premium
      const resendKey = Deno.env.get("RESEND_API_KEY")
      if (resendKey && reserva.email) {
        await fetch("https://api.resend.com/emails", {
          method: "POST",
          headers: {
            Authorization: `Bearer ${resendKey}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            from: "Monteazul <reservas@monteazulhotel.com>",
            to: [reserva.email],
            subject: `🌲 Reserva Confirmada: ${reserva.codigo_reserva}`,
            html: `
<div style="background-color: #0f1a0f; background-image: url('https://images.unsplash.com/photo-1501785888041-af3ef285b470?q=80&w=2070&auto=format&fit=crop'); background-size: cover; background-position: center; background-attachment: fixed; padding: 80px 10px; font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; min-height: 100vh;">
  
  <div style="max-width: 600px; margin: 0 auto; background: rgba(255, 255, 255, 0.05); backdrop-filter: blur(15px); -webkit-backdrop-filter: blur(15px); border: 1px solid rgba(255, 255, 255, 0.15); border-radius: 30px; overflow: hidden; box-shadow: 0 40px 100px rgba(0,0,0,0.5);">
    
    <div style="padding: 50px 20px 30px 20px; text-align: center;">
      <p style="margin: 0; font-size: 24px; letter-spacing: 10px; font-weight: 200; text-transform: uppercase; color: #ffffff; text-shadow: 0 2px 10px rgba(0,0,0,0.2);">Monteazul</p>
      <p style="margin: 10px 0 0 0; font-size: 9px; text-transform: uppercase; letter-spacing: 5px; color: #a3b3a3; font-weight: 400;">Luxe Nature Escapes</p>
      
      <p style="margin: 20px 0 0 0; font-size: 18px; letter-spacing: 3px; color: #ffffff; text-transform: uppercase; font-weight: 600; text-shadow: 0 2px 10px rgba(0,0,0,0.3);">
        Reserva No: ${reserva.codigo_reserva}
      </p>
    </div>

    <div style="padding: 0 40px 45px 40px;">
      <div style="background-color: #ffffff; border-radius: 20px; padding: 40px; box-shadow: 0 10px 30px rgba(0,0,0,0.1);">
        
        <div style="text-align: center; margin-bottom: 35px;">
          <h2 style="font-size: 22px; font-weight: 500; margin: 0; color: #1a2a1a;">¡Tu estancia está confirmada!</h2>
          <div style="width: 30px; height: 2px; background-color: #2D5A27; margin: 15px auto;"></div>
          <p style="font-size: 14px; color: #555; line-height: 1.6;">Hola <strong>${reserva.cliente_nombre}</strong>, aquí tienes el desglose detallado de tu reserva:</p>
        </div>

        <table style="width: 100%; border-collapse: collapse; font-size: 14px;">
          <tr>
            <td style="padding: 18px 0; color: #888; border-bottom: 1px solid #f0f0f0;">Alojamiento:</td>
            <td style="padding: 18px 0; text-align: right; font-weight: bold; color: #333;">
              ${reserva.cant_privado > 0 ? 'Habitación doble con baño privado' : 'Habitación doble con baño compartido'}
            </td>
          </tr>
          <tr>
            <td style="padding: 18px 0; color: #888; border-bottom: 1px solid #f0f0f0;">Nº Habitaciones:</td>
            <td style="padding: 18px 0; text-align: right; font-weight: bold; color: #333;">
              ${(reserva.cant_privado || 0) + (reserva.cant_publico || 0)} unidades
            </td>
          </tr>
          <tr>
            <td style="padding: 18px 0; color: #888; border-bottom: 1px solid #f0f0f0;">Entrada:</td>
            <td style="padding: 18px 0; text-align: right; color: #333;">${new Date(reserva.fecha_entrada).toLocaleDateString('es-ES')}</td>
          </tr>
          <tr>
            <td style="padding: 18px 0; color: #888; border-bottom: 1px solid #f0f0f0;">Salida:</td>
            <td style="padding: 18px 0; text-align: right; color: #333;">${new Date(reserva.fecha_salida).toLocaleDateString('es-ES')}</td>
          </tr>
          <tr>
            <td style="padding: 18px 0; color: #888; border-bottom: 1px solid #f0f0f0;">Mascota:</td>
            <td style="padding: 18px 0; text-align: right; color: #333;">${reserva.mascota ? '🐾 Sí' : 'No'}</td>
          </tr>
          <tr>
            <td style="padding: 18px 0; color: #888; border-bottom: 1px solid #f0f0f0;">Huéspedes:</td>
            <td style="padding: 18px 0; text-align: right; color: #333;">${reserva.adultos} adultos, ${reserva.ninos} niños</td>
          </tr>
          <tr>
            <td style="padding-top: 30px; font-size: 18px; font-weight: bold; color: #2D5A27;">Total Pagado:</td>
            <td style="padding-top: 30px; text-align: right; font-size: 24px; font-weight: bold; color: #2D5A27;">${reserva.total}€</td>
          </tr>
        </table>

        <div style="text-align: center; margin-top: 40px;">
          <a href="#" style="background-color: #2D5A27; color: #ffffff; padding: 18px 35px; text-decoration: none; font-size: 11px; letter-spacing: 3px; text-transform: uppercase; border-radius: 50px; display: inline-block; font-weight: 600; box-shadow: 0 10px 20px rgba(45, 90, 39, 0.2);">Gestionar Reserva</a>
        </div>
      </div>

      <div style="margin-top: 30px; text-align: center;">
        <div style="margin-top: 20px;">
          <a href="#" style="color: #ffffff; text-decoration: none; font-size: 12px; margin: 0 10px; opacity: 0.6;">Ubicación</a>
          <span style="color: #ffffff; opacity: 0.3;">|</span>
          <a href="#" style="color: #ffffff; text-decoration: none; font-size: 12px; margin: 0 10px; opacity: 0.6;">Contacto</a>
        </div>
      </div>
    </div>
  </div>
  
  <p style="text-align: center; color: rgba(255,255,255,0.3); font-size: 10px; margin-top: 40px; letter-spacing: 1px; text-transform: uppercase;">© 2026 MONTEAZUL LUXE NATURE ESCAPES</p>
</div>`,
          }),
        })
      }
    }

    return new Response(JSON.stringify({ received: true }), {
      status: 200,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    })
  } catch (err) {
    return new Response(JSON.stringify({ error: err.message }), {
      status: 400,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    })
  }
})