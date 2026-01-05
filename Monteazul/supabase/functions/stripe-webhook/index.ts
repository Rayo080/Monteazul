import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'
import Stripe from 'https://esm.sh/stripe@14.16.0'

const stripe = new Stripe(Deno.env.get('STRIPE_SECRET_KEY') ?? '', {
  apiVersion: '2023-10-16',
  httpClient: Stripe.createFetchHttpClient(),
})

serve(async (req) => {
  const signature = req.headers.get('stripe-signature')
  const body = await req.text()

  try {
    const event = await stripe.webhooks.constructEventAsync(
      body, 
      signature!, 
      Deno.env.get('STRIPE_WEBHOOK_SIGNING_SECRET') ?? ''
    )


    if (event.type === 'checkout.session.completed') {
      const session = event.data.object
      const codigoReserva = session.metadata?.codigoReserva
      console.log("DEBUG: Código de reserva recibido de Stripe:", codigoReserva);
      console.log("DEBUG: Metadata completa:", JSON.stringify(session.metadata));

      // Extraer el ID de payment_intent (puede ser un string en session.payment_intent)
      const paymentIntentId = session.payment_intent || session.paymentIntent?.id || null;

      const supabase = createClient(
        Deno.env.get('SUPABASE_URL') ?? '',
        Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
      )


      // 1. Confirmar la reserva y obtener datos
      const { data: reserva, error } = await supabase
        .from('reservas')
        .update({ estado: 'confirmado', payment_intent_id: paymentIntentId })
        .eq('codigo_reserva', codigoReserva)
        .select()
        .single()
      if (error) throw error

      // 2. Descontar inventario de habitaciones según la reserva
      if (reserva.cant_privado > 0) {
        // Descontar de habitaciones privadas
        const { error: errorPrivado } = await supabase
          .rpc('decrement_inventory', {
            row_id: reserva.habitacion_id, // ID de la cabaña/habitación
            col_name: 'stock_privado',     // Nombre de tu columna de stock
            quantity: reserva.cant_privado
          });
        // Puedes manejar errorPrivado si lo deseas
      }

      // 1. Usar el cliente con Service Role (Admin)
      const supabaseAdmin = createClient(
        Deno.env.get('SUPABASE_URL') ?? '',
        Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
      );

      // 2. Definir fechas
      const fechaInicio = new Date(reserva.fecha_entrada);
      const fechaFin = new Date(reserva.fecha_salida);

      console.log(`Iniciando descuento de stock para: ${reserva.codigo_reserva}`);

      // 3. Bucle para descontar cada noche
      for (let d = new Date(fechaInicio); d < fechaFin; d.setDate(d.getDate() + 1)) {
        const fechaISO = d.toISOString().split('T')[0];

        // Primero obtenemos el stock actual de ese día
        const { data: diaActual } = await supabaseAdmin
          .from('disponibilidad')
          .select('stock_privada, stock_compartida')
          .eq('date', fechaISO) // AQUÍ USAMOS 'date' como dice tu tabla
          .single();

        if (diaActual) {
          // Calculamos la resta
          const nuevoStockPrivada = Math.max(0, (diaActual.stock_privada || 0) - (reserva.cant_privado || 0));
          const nuevoStockCompartida = Math.max(0, (diaActual.stock_compartida || 0) - (reserva.cant_publico || 0));

          // Actualizamos con los nuevos nombres: stock_privada y stock_compartida
          const { error: errorUpdate } = await supabaseAdmin
            .from('disponibilidad')
            .update({ 
              stock_privada: nuevoStockPrivada, 
              stock_compartida: nuevoStockCompartida 
            })
            .eq('date', fechaISO);

          if (errorUpdate) {
            console.error(`Error en fecha ${fechaISO}:`, errorUpdate.message);
          } else {
            console.log(`¡Stock bajado! Día: ${fechaISO} - Priv: ${nuevoStockPrivada}, Comp: ${nuevoStockCompartida}`);
          }
        } else {
          console.log(`No se encontró la fecha ${fechaISO} en la tabla disponibilidad.`);
        }
      }

      if (reserva.cant_publico > 0) {
        // Descontar de habitaciones compartidas
        const { error: errorPublico } = await supabase
          .rpc('decrement_inventory', {
            row_id: reserva.habitacion_id,
            col_name: 'stock_publico',
            quantity: reserva.cant_publico
          });
        // Puedes manejar errorPublico si lo deseas
      }

      // 2. ENVIAR EL CORREO vía Resend con diseño profesional
      const resendKey = Deno.env.get('RESEND_API_KEY')
      if (resendKey && reserva?.email) {
        await fetch('https://api.resend.com/emails', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${resendKey}`,
          },
          body: JSON.stringify({
            from: 'Monteazul <reservas@monteazulhotel.com>',
            to: [reserva.email],
            subject: `🌲 Reserva Confirmada: ${reserva.codigo_reserva}`,
            html: `
    <div style="background-color: #f0f4f1; padding: 40px 10px; font-family: sans-serif;">
      <div style="max-width: 750px; margin: 0 auto; background-color: #ffffff; border-radius: 20px; overflow: hidden; box-shadow: 0 15px 40px rgba(0,0,0,0.12);">
        
        <div style="background-color: #2D5A27; padding: 50px 20px; text-align: center;">
          <h1 style="color: #ffffff; margin: 0; font-size: 34px; letter-spacing: 4px; font-weight: 300;">MONTEAZUL</h1>
          <p style="color: #cbdccb; margin: 10px 0 0 0; font-size: 14px; text-transform: uppercase; letter-spacing: 3px;">Luxe Nature Escapes</p>
        </div>

        <div style="padding: 50px; color: #333;">
          <h2 style="color: #2D5A27; font-size: 26px; margin-bottom: 25px; font-weight: 400;">¡Tu estancia está confirmada!</h2>
          <p style="margin-bottom: 35px; font-size: 17px;">Hola <strong>${reserva.cliente_nombre}</strong>, aquí tienes el desglose detallado de tu reserva:</p>

          <div style="background-color: #f9fbf9; border: 1px solid #e0eadd; padding: 35px; border-radius: 15px; margin-bottom: 35px;">
            <table style="width: 100%; font-size: 16px; border-collapse: collapse;">
              <tr>
                <td style="padding: 18px 0; color: #888; border-bottom: 1px solid #f0f0f0; white-space: nowrap; width: 1%;">Alojamiento: &nbsp;&nbsp;</td>
                <td style="padding: 18px 0; text-align: right; font-weight: bold; border-bottom: 1px solid #f0f0f0; white-space: nowrap;">
                  ${reserva.cant_privado > 0 ? 'Habitación doble con baño privado' : 'Habitación doble con baño compartido'}
                </td>
              </tr>
              <tr>
                <td style="padding: 18px 0; color: #888; border-bottom: 1px solid #f0f0f0; white-space: nowrap;">Nº Habitaciones:</td>
                <td style="padding: 18px 0; text-align: right; font-weight: bold; border-bottom: 1px solid #f0f0f0; white-space: nowrap;">
                  ${(reserva.cant_privado || 0) + (reserva.cant_publico || 0)} unidades
                </td>
              </tr>
              <tr>
                <td style="padding: 18px 0; color: #888; border-bottom: 1px solid #f0f0f0; white-space: nowrap;">Entrada:</td>
                <td style="padding: 18px 0; text-align: right; border-bottom: 1px solid #f0f0f0;">${new Date(reserva.fecha_entrada).toLocaleDateString('es-ES')}</td>
              </tr>
              <tr>
                <td style="padding: 18px 0; color: #888; border-bottom: 1px solid #f0f0f0; white-space: nowrap;">Salida:</td>
                <td style="padding: 18px 0; text-align: right; border-bottom: 1px solid #f0f0f0;">${new Date(reserva.fecha_salida).toLocaleDateString('es-ES')}</td>
              </tr>
              <tr>
                <td style="padding: 18px 0; color: #888; border-bottom: 1px solid #f0f0f0; white-space: nowrap;">Mascota:</td>
                <td style="padding: 18px 0; text-align: right; border-bottom: 1px solid #f0f0f0;">
                  ${reserva.mascota ? '🐾 ¡Sí, bienvenida!' : 'No'}
                </td>
              </tr>
              <tr>
                <td style="padding: 18px 0; color: #888; white-space: nowrap;">Huéspedes:</td>
                <td style="padding: 18px 0; text-align: right; white-space: nowrap;">${reserva.adultos} adultos, ${reserva.ninos} niños</td>
              </tr>
              <tr style="font-size: 24px; color: #2D5A27;">
                <td style="padding-top: 30px; font-weight: bold; border-top: 2px solid #e0eadd; white-space: nowrap;">Total:</td>
                <td style="padding-top: 30px; text-align: right; font-weight: bold; border-top: 2px solid #e0eadd; white-space: nowrap;">${reserva.total}€</td>
              </tr>
            </table>
          </div>

          <p style="text-align: center; font-size: 14px; color: #999; margin-top: 40px;">
            Código de reserva: <span style="color: #2D5A27; font-weight: bold;">${reserva.codigo_reserva}</span>
          </p>
        </div>
      </div>
    </div>
  `,
          }),
        });
      }
    }

    return new Response(JSON.stringify({ received: true }), { status: 200 })
  } catch (err) {
    return new Response(JSON.stringify({ error: err.message }), { status: 400 })
  }
})
