// api/send-email.js
// Endpoint llamado desde Shopify Flow cuando hay pedido de PRIMAL CLUB
// Genera HMAC + envía email vía Resend

import crypto from 'crypto';
import { Resend } from 'resend';

const HMAC_SECRET = process.env.PRIMAL_HMAC_SECRET || '';
const FLOW_SECRET = process.env.FLOW_WEBHOOK_SECRET || '';
const RESEND_API_KEY = process.env.RESEND_API_KEY || '';

export default async function handler(req, res) {
  // CORS para que Flow pueda llamar
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, X-Flow-Secret');
  
  if (req.method === 'OPTIONS') return res.status(200).end();
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  // Autenticar la petición (solo Flow debería llamar)
  const providedSecret = req.headers['x-flow-secret'] || (req.body && req.body.flow_secret);
  if (providedSecret !== FLOW_SECRET) {
    return res.status(401).json({ error: 'Unauthorized' });
  }

  const { order_number, order_created_at, customer_email, customer_first_name } = req.body || {};

  if (!order_number || !order_created_at || !customer_email) {
    return res.status(400).json({
      error: 'Missing fields',
      required: ['order_number', 'order_created_at', 'customer_email'],
      received: Object.keys(req.body || {})
    });
  }

  // Generar HMAC
  const orderNum = String(order_number).replace('#', '');
  const orderTs = Math.floor(new Date(order_created_at).getTime() / 1000);
  const payload = `${orderNum}|${orderTs}`;
  const signature = crypto.createHmac('sha256', HMAC_SECRET).update(payload).digest('hex');

  const accessUrl = `https://primalgens.com/pages/primal-club-acceso-38755-aprobado?o=${orderNum}&t=${orderTs}&s=${signature}`;

  const firstName = customer_first_name || '';

  const html = `<!DOCTYPE html>
<html>
<head><meta charset="UTF-8"></head>
<body style="margin:0;padding:0;background:#0a0a0a;font-family:Arial,Helvetica,sans-serif">
<table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background:#0a0a0a">
<tr><td align="center" style="padding:40px 20px">
<table role="presentation" width="560" cellpadding="0" cellspacing="0" style="max-width:560px;width:100%">
<tr><td style="background:#050505;color:#f2f0eb;padding:40px 32px;border-radius:12px;text-align:center">
<div style="color:#C8A96E;font-size:26px;letter-spacing:3px;font-weight:bold;margin-bottom:20px">ACCESO PRIMAL CLUB</div>
<p style="color:#a09d96;font-size:15px;line-height:1.6;margin:10px 0">Hola ${firstName},</p>
<p style="color:#a09d96;font-size:15px;line-height:1.6;margin:10px 0">Tu protocolo personalizado de entrenamiento, nutricion y suplementacion ya esta listo.</p>
<p style="color:#a09d96;font-size:15px;line-height:1.6;margin:10px 0 30px">Genera tu plan ahora accediendo al club:</p>
<a href="${accessUrl}" style="display:inline-block;background:#C8A96E;color:#050505;padding:16px 40px;border-radius:10px;font-weight:bold;text-decoration:none;letter-spacing:2px;font-size:14px">ACCEDER A MI PLAN</a>
<p style="color:#6b6862;font-size:11px;margin-top:30px;line-height:1.5">Tu acceso se renueva con cada pago mensual. Valido 31 dias desde esta compra.</p>
</td></tr>
</table>
</td></tr>
</table>
</body>
</html>`;

  try {
    const resend = new Resend(RESEND_API_KEY);
    const result = await resend.emails.send({
      from: 'PRIMAL <help@primalgens.com>',
      to: customer_email,
      subject: `Tu acceso PRIMAL CLUB - Pedido #${orderNum}`,
      html: html,
    });

    if (result.error) {
      return res.status(500).json({ error: 'Resend error', details: result.error });
    }

    return res.status(200).json({
      success: true,
      email_id: result.data?.id,
      sent_to: customer_email
    });
  } catch (error) {
    console.error('Send email error:', error);
    return res.status(500).json({
      error: 'Email send failed',
      message: error.message
    });
  }
}
