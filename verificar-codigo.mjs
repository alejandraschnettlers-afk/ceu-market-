// CEU Market · comprueba el código que escribe el estudiante.
import { comprobarToken, crearSesion, respuesta } from '../lib/codigo.mjs';

export default async (req) => {
  if (req.method !== 'POST') return respuesta(405, { error: 'metodo' });
  const { CODE_SECRET } = process.env;
  if (!CODE_SECRET) return respuesta(500, { error: 'config' });

  let datos;
  try { datos = await req.json(); } catch { return respuesta(400, { error: 'datos' }); }
  const email = String(datos.email || '').trim().toLowerCase();
  const codigo = String(datos.codigo || '').trim();
  const resultado = comprobarToken(CODE_SECRET, email, codigo, datos.token);

  if (resultado !== 'ok') return respuesta(400, { error: resultado });
  return respuesta(200, { sesion: crearSesion(CODE_SECRET, email) });
};
