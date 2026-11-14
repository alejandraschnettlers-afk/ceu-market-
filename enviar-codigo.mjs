// CEU Market · envía un código de 6 cifras al correo @usp.ceu.es usando el Gmail del grupo.
// Variables de entorno en Netlify: GMAIL_USER, GMAIL_APP_PASSWORD, CODE_SECRET
import nodemailer from 'nodemailer';
import { DOMINIO, VALIDEZ_CODIGO_MIN, nuevoCodigo, crearToken, respuesta } from '../lib/codigo.mjs';

const TEXTOS = {
  es: {
    asunto: (c) => `Tu código de CEU Market: ${c}`,
    titulo: 'Tu código para entrar',
    intro: 'Escríbelo en la web de CEU Market para verificar tu correo del CEU.',
    caduca: `El código caduca en ${VALIDEZ_CODIGO_MIN} minutos. Si no has pedido entrar, ignora este correo.`,
    claim: 'De estudiante a estudiante.',
    legal: 'CEU Market es un intermediario entre estudiantes: no compra ni vende los productos publicados.'
  },
  en: {
    asunto: (c) => `Your CEU Market code: ${c}`,
    titulo: 'Your sign-in code',
    intro: 'Enter it on the CEU Market website to verify your CEU email.',
    caduca: `This code expires in ${VALIDEZ_CODIGO_MIN} minutes. If you didn't try to sign in, ignore this email.`,
    claim: 'Student to student.',
    legal: 'CEU Market is an intermediary between students: it does not buy or sell the listed products.'
  }
};

function html(t, codigo) {
  return `<div style="margin:0;padding:24px 12px;background:#F3F6FA;font-family:Arial,Helvetica,sans-serif;color:#070850">
  <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="max-width:520px;margin:0 auto;background:#FFFFFF;border:1px solid #C9CFDA;border-radius:20px;overflow:hidden">
    <tr><td style="background:#123285;padding:22px 28px;color:#FFFFFF;font-size:22px"><strong>CEU</strong> Market</td></tr>
    <tr><td style="padding:28px">
      <p style="margin:0 0 8px;font-size:22px;font-weight:bold;line-height:1.3">${t.titulo}</p>
      <p style="margin:0 0 20px;font-size:16px;line-height:1.5">${t.intro}</p>
      <p style="margin:0 0 20px;text-align:center"><span style="display:inline-block;background:#C6F04A;color:#070850;font-size:34px;font-weight:bold;letter-spacing:8px;padding:14px 22px;border-radius:14px">${codigo}</span></p>
      <p style="margin:0 0 6px;font-size:15px;line-height:1.5;color:#4A5275">${t.caduca}</p>
      <p style="margin:0;font-size:15px;line-height:1.5;color:#4A5275">${t.claim}</p>
    </td></tr>
    <tr><td style="background:#070850;color:#DDE3F4;padding:16px 28px;font-size:13px;line-height:1.5">${t.legal} · @ceumarket</td></tr>
  </table>
</div>`;
}

export default async (req) => {
  if (req.method !== 'POST') return respuesta(405, { error: 'metodo' });
  const { GMAIL_USER, GMAIL_APP_PASSWORD, CODE_SECRET } = process.env;
  if (!GMAIL_USER || !GMAIL_APP_PASSWORD || !CODE_SECRET) return respuesta(500, { error: 'config' });

  let datos;
  try { datos = await req.json(); } catch { return respuesta(400, { error: 'datos' }); }
  const email = String(datos.email || '').trim().toLowerCase();
  const t = TEXTOS[datos.lang === 'en' ? 'en' : 'es'];
  if (!DOMINIO.test(email)) return respuesta(400, { error: 'dominio' });

  const codigo = nuevoCodigo();
  const token = crearToken(CODE_SECRET, email, codigo);

  const transporte = nodemailer.createTransport({
    service: 'gmail',
    auth: { user: GMAIL_USER, pass: GMAIL_APP_PASSWORD.replace(/\s/g, '') }
  });
  try {
    await transporte.sendMail({
      from: `"CEU Market" <${GMAIL_USER}>`,
      to: email,
      subject: t.asunto(codigo),
      text: `${t.titulo}: ${codigo}\n\n${t.intro}\n${t.caduca}\n\n${t.claim}`,
      html: html(t, codigo)
    });
  } catch (err) {
    console.error('[enviar-codigo] Gmail ha rechazado el envío:', err && err.message);
    return respuesta(502, { error: 'envio' });
  }
  return respuesta(200, { token, minutos: VALIDEZ_CODIGO_MIN });
};
