// CEU Market · códigos de acceso firmados (sin base de datos)
// El código de 6 cifras nunca viaja al navegador: solo un "token" firmado con CODE_SECRET
// que permite comprobar después, en el servidor, que el código escrito es el correcto.
import crypto from 'node:crypto';

export const DOMINIO = /^[^\s@]+@usp\.ceu\.es$/i;
export const VALIDEZ_CODIGO_MIN = 10;
export const VALIDEZ_SESION_DIAS = 30;

const b64 = (s) => Buffer.from(s, 'utf8').toString('base64url');
const unb64 = (s) => Buffer.from(s, 'base64url').toString('utf8');
const firma = (secret, ...partes) => crypto.createHmac('sha256', secret).update(partes.join('|')).digest('base64url');
const iguales = (a, b) => {
  const x = Buffer.from(String(a)); const y = Buffer.from(String(b));
  return x.length === y.length && crypto.timingSafeEqual(x, y);
};

export function nuevoCodigo() {
  return String(crypto.randomInt(0, 1000000)).padStart(6, '0');
}

export function crearToken(secret, email, codigo, ahora = Date.now()) {
  const exp = ahora + VALIDEZ_CODIGO_MIN * 60 * 1000;
  return `${b64(email)}.${exp}.${firma(secret, 'codigo', email, codigo, exp)}`;
}

// Devuelve 'ok' | 'incorrecto' | 'caducado' | 'invalido'
export function comprobarToken(secret, email, codigo, token, ahora = Date.now()) {
  const partes = String(token || '').split('.');
  if (partes.length !== 3) return 'invalido';
  const [e, expStr, f] = partes;
  let em;
  try { em = unb64(e); } catch { return 'invalido'; }
  if (em !== email) return 'invalido';
  const exp = Number(expStr);
  if (!Number.isFinite(exp)) return 'invalido';
  if (ahora > exp) return 'caducado';
  if (!/^\d{6}$/.test(String(codigo))) return 'incorrecto';
  return iguales(firma(secret, 'codigo', email, codigo, exp), f) ? 'ok' : 'incorrecto';
}

export function crearSesion(secret, email, ahora = Date.now()) {
  const exp = ahora + VALIDEZ_SESION_DIAS * 24 * 3600 * 1000;
  return { email, exp, firma: firma(secret, 'sesion', email, exp) };
}

export const respuesta = (status, body) => new Response(JSON.stringify(body), {
  status,
  headers: { 'content-type': 'application/json; charset=utf-8', 'cache-control': 'no-store' }
});
