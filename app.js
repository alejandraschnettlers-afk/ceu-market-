// CEU Market · Bienvenida: idioma, cookies y acceso con código por correo (Netlify Functions + Gmail)
const API = '/.netlify/functions/';
const DOMINIO = /^[^\s@]+@usp\.ceu\.es$/i;
const ESPERA_REENVIO = 60; // segundos

const T = {
  es: {
    langLabel: 'Idioma', tag: 'Solo para la comunidad CEU', h1: 'De estudiante a estudiante',
    sub: 'La tienda online de reventa de la comunidad CEU: fácil, rápida, cómoda y segura.',
    p1: 'Entrega en taquilla del campus', p2: 'Pago por Bizum al vendedor', p3: 'Solo estudiantes verificados',
    h2: 'Compra y vende entre compañeros', p: 'Libros, apuntes, calculadoras, batas… Lo que ya no usas le sirve a alguien de tu campus.',
    btn: 'Entrar con tu correo del CEU', only: 'Solo con cuentas @usp.ceu.es',
    hCorreo: 'Te mandamos un código', emailLabel: 'Tu correo del CEU', helpCorreo: 'Te enviaremos un código de 6 cifras para entrar.',
    enviar: 'Enviarme el código', enviando: 'Enviando…', volver: 'Volver',
    errDominio: 'Usa tu correo @usp.ceu.es para entrar.',
    hCodigo: 'Revisa tu correo', codigoEnviado: 'Hemos enviado un código de 6 cifras a', codigoLabel: 'Escribe el código',
    helpCodigo: 'Si no lo ves, mira en la carpeta de spam o correo no deseado.', verificar: 'Entrar', verificando: 'Comprobando…',
    reenviar: 'Reenviar código', reenviarEn: 'Reenviar en {s} s', reenviado: 'Te hemos enviado un código nuevo.', cambiar: 'Cambiar correo',
    errCodigoFormato: 'El código tiene 6 cifras.', errCodigo: 'El código no es correcto o ha caducado. Prueba otra vez o pide uno nuevo.',
    errEnvio: 'No hemos podido enviar el correo. Revisa que el correo esté bien escrito o inténtalo en un momento.',
    errCaducado: 'El código ha caducado (dura 10 minutos). Pide uno nuevo.',
    errLimite: 'Has pedido varios códigos seguidos. Espera un poco y vuelve a intentarlo.',
    errRed: 'No hemos podido conectar. Revisa tu conexión e inténtalo de nuevo.',
    errConfig: 'El envío de códigos aún no está configurado en Netlify (faltan las variables de Gmail).',
    errLocal: 'Para enviar códigos, la web tiene que estar publicada en Netlify desde GitHub.',
    verificado: 'Correo verificado:', facH: 'Elige tu facultad', facP: 'Te enseñamos primero lo que se vende cerca de ti. Puedes cambiarla cuando quieras.',
    facs: ['Derecho', 'Ciencias Económicas y Empresariales', 'Humanidades y Ciencias de la Comunicación', 'Medicina', 'Farmacia', 'Escuela Politécnica Superior'],
    claim: 'De estudiante a estudiante', fLegal: 'Aviso legal', fPriv: 'Privacidad', fCookies: 'Cookies', fCond: 'Condiciones de venta', fAyuda: 'Ayuda',
    fInter: 'CEU Market es un intermediario entre estudiantes: no compra ni vende los productos publicados.',
    ckH: 'Tú decides sobre las cookies', ckP: 'Usamos cookies técnicas para que CEU Market funcione y, si nos dejas, analíticas para mejorarlo.', ckLink: 'Política de cookies',
    ckA: 'Aceptar', ckR: 'Rechazar', ckC: 'Configurar', ckS: 'Guardar', ckConfig: 'Tus preferencias', ckTec: 'Técnicas (siempre activas)', ckAna: 'Analíticas', ckPer: 'Personalización'
  },
  en: {
    langLabel: 'Language', tag: 'Only for the CEU community', h1: 'Student to student',
    sub: 'The CEU community resale shop: easy, fast, convenient and safe.',
    p1: 'Pick-up from a campus locker', p2: 'Pay the seller via Bizum', p3: 'Verified students only',
    h2: 'Buy and sell with classmates', p: 'Books, notes, calculators, lab coats… What you no longer use is useful to someone on your campus.',
    btn: 'Sign in with your CEU email', only: 'Only @usp.ceu.es accounts',
    hCorreo: "We'll send you a code", emailLabel: 'Your CEU email', helpCorreo: "We'll send you a 6-digit code to sign in.",
    enviar: 'Send me the code', enviando: 'Sending…', volver: 'Back',
    errDominio: 'Use your @usp.ceu.es email to sign in.',
    hCodigo: 'Check your inbox', codigoEnviado: 'We sent a 6-digit code to', codigoLabel: 'Enter the code',
    helpCodigo: "Can't see it? Check your spam or junk folder.", verificar: 'Sign in', verificando: 'Checking…',
    reenviar: 'Resend code', reenviarEn: 'Resend in {s} s', reenviado: "We've sent you a new code.", cambiar: 'Change email',
    errCodigoFormato: 'The code has 6 digits.', errCodigo: "That code isn't right or has expired. Try again or ask for a new one.",
    errEnvio: "We couldn't send the email. Check the address or try again in a moment.",
    errCaducado: 'The code has expired (it lasts 10 minutes). Ask for a new one.',
    errLimite: "You've asked for several codes in a row. Wait a bit and try again.",
    errRed: "We couldn't connect. Check your connection and try again.",
    errConfig: "Code sending isn't set up on Netlify yet (the Gmail variables are missing).",
    errLocal: 'To send codes, the site has to be published on Netlify from GitHub.',
    verificado: 'Email verified:', facH: 'Choose your faculty', facP: "We'll show you what's for sale near you first. You can change it anytime.",
    facs: ['Law', 'Economics and Business', 'Humanities and Communication Sciences', 'Medicine', 'Pharmacy', 'Polytechnic School'],
    claim: 'Student to student', fLegal: 'Legal notice', fPriv: 'Privacy', fCookies: 'Cookies', fCond: 'Terms of sale', fAyuda: 'Help',
    fInter: 'CEU Market is an intermediary between students: it does not buy or sell the listed products.',
    ckH: 'You decide about cookies', ckP: 'We use technical cookies to make CEU Market work and, if you let us, analytics cookies to improve it.', ckLink: 'Cookie policy',
    ckA: 'Accept', ckR: 'Reject', ckC: 'Settings', ckS: 'Save', ckConfig: 'Your preferences', ckTec: 'Technical (always on)', ckAna: 'Analytics', ckPer: 'Personalisation'
  }
};
const FAC_ID = ['derecho', 'economicas', 'humanidades', 'medicina', 'farmacia', 'politecnica'];

const $ = (id) => document.getElementById(id);
const store = {
  get(k) { try { return JSON.parse(localStorage.getItem(k)); } catch { return null; } },
  set(k, v) { try { localStorage.setItem(k, JSON.stringify(v)); } catch { /* sin almacenamiento */ } }
};

let lang = store.get('ceu_idioma') === 'en' ? 'en' : 'es';
let correo = '';
let tokenCodigo = '';
let temporizador = null;
const t = (k) => T[lang][k];

/* ---------- Idioma ---------- */
function aplicarIdioma() {
  document.documentElement.lang = lang;
  document.querySelectorAll('[data-i18n]').forEach((el) => { const v = t(el.dataset.i18n); if (typeof v === 'string') el.textContent = v; });
  document.querySelectorAll('[data-i18n-aria]').forEach((el) => el.setAttribute('aria-label', t(el.dataset.i18nAria)));
  document.querySelectorAll('[data-lang]').forEach((b) => b.setAttribute('aria-pressed', String(b.dataset.lang === lang)));
  pintarFacultades();
  actualizarBotonConfig();
}
document.querySelectorAll('[data-lang]').forEach((b) => b.addEventListener('click', () => {
  lang = b.dataset.lang; store.set('ceu_idioma', lang); aplicarIdioma();
}));

/* ---------- Pasos ---------- */
const PASOS = ['paso-inicio', 'paso-correo', 'paso-codigo', 'paso-facultad'];
function irA(id, foco) {
  PASOS.forEach((p) => { $(p).hidden = p !== id; });
  const el = foco ? $(foco) : $(id).querySelector('h2');
  if (el) { if (el.tagName === 'H2') el.setAttribute('tabindex', '-1'); el.focus(); }
}
function ayuda(id, texto, esError) {
  const el = $(id); el.textContent = texto; el.classList.toggle('error', !!esError);
}
function ocupado(btn, si, textoKey) {
  btn.disabled = si; btn.setAttribute('aria-busy', String(si));
  btn.querySelector('span').textContent = t(textoKey);
}
const ERRORES = { dominio: 'errDominio', envio: 'errEnvio', config: 'errConfig', caducado: 'errCaducado', incorrecto: 'errCodigo', invalido: 'errCodigo', local: 'errLocal', red: 'errRed' };
const mensaje = (err) => t(ERRORES[err && err.codigo] || 'errRed');

async function api(funcion, datos) {
  let res;
  try {
    res = await fetch(API + funcion, { method: 'POST', headers: { 'content-type': 'application/json' }, body: JSON.stringify(datos) });
  } catch {
    throw { codigo: 'red' };
  }
  let cuerpo = null;
  try { cuerpo = await res.json(); } catch { /* respuesta no JSON: la función no existe aquí */ }
  if (!cuerpo) throw { codigo: res.status === 404 || res.status === 405 || res.status === 501 ? 'local' : 'red' };
  if (!res.ok) throw { codigo: cuerpo.error || 'red' };
  return cuerpo;
}

$('btn-empezar').addEventListener('click', () => irA('paso-correo', 'correo'));
$('btn-volver-inicio').addEventListener('click', () => irA('paso-inicio'));
$('btn-cambiar').addEventListener('click', () => { pararTemporizador(); irA('paso-correo', 'correo'); });
$('correo').addEventListener('input', () => { $('correo').removeAttribute('aria-invalid'); ayuda('correo-ayuda', t('helpCorreo')); });

/* ---------- Enviar código ---------- */
async function enviarCodigo() {
  const r = await api('enviar-codigo', { email: correo, lang });
  tokenCodigo = r.token;
}

$('paso-correo').addEventListener('submit', async (e) => {
  e.preventDefault();
  const valor = $('correo').value.trim().toLowerCase();
  if (!DOMINIO.test(valor)) {
    $('correo').setAttribute('aria-invalid', 'true'); ayuda('correo-ayuda', t('errDominio'), true); $('correo').focus(); return;
  }
  correo = valor;
  const btn = $('btn-enviar');
  ocupado(btn, true, 'enviando');
  try {
    await enviarCodigo();
    $('correo-destino').textContent = correo;
    $('codigo').value = ''; ayuda('codigo-ayuda', t('helpCodigo'));
    irA('paso-codigo', 'codigo');
    empezarTemporizador();
  } catch (err) {
    ayuda('correo-ayuda', mensaje(err), true);
  } finally {
    ocupado(btn, false, 'enviar');
  }
});

/* ---------- Reenviar (con espera de 60 s) ---------- */
function pararTemporizador() { if (temporizador) clearInterval(temporizador); temporizador = null; }
function empezarTemporizador() {
  pararTemporizador();
  let s = ESPERA_REENVIO;
  const btn = $('btn-reenviar');
  const pintar = () => { btn.disabled = s > 0; btn.textContent = s > 0 ? t('reenviarEn').replace('{s}', s) : t('reenviar'); };
  pintar();
  temporizador = setInterval(() => { s -= 1; pintar(); if (s <= 0) pararTemporizador(); }, 1000);
}
$('btn-reenviar').addEventListener('click', async () => {
  try { await enviarCodigo(); ayuda('codigo-ayuda', t('reenviado')); empezarTemporizador(); }
  catch (err) { ayuda('codigo-ayuda', mensaje(err), true); }
});

/* ---------- Verificar código ---------- */
$('codigo').addEventListener('input', (e) => {
  e.target.value = e.target.value.replace(/\D/g, '').slice(0, 6);
  e.target.removeAttribute('aria-invalid');
});
$('paso-codigo').addEventListener('submit', async (e) => {
  e.preventDefault();
  const codigo = $('codigo').value.trim();
  if (!/^\d{6}$/.test(codigo)) { $('codigo').setAttribute('aria-invalid', 'true'); ayuda('codigo-ayuda', t('errCodigoFormato'), true); return; }
  const btn = $('btn-verificar');
  ocupado(btn, true, 'verificando');
  try {
    const r = await api('verificar-codigo', { email: correo, codigo, token: tokenCodigo });
    store.set('ceu_sesion', r.sesion);
    pararTemporizador();
    mostrarFacultades(correo);
  } catch (err) {
    $('codigo').setAttribute('aria-invalid', 'true');
    ayuda('codigo-ayuda', mensaje(err), true);
  } finally {
    ocupado(btn, false, 'verificar');
  }
});

/* ---------- Facultad ---------- */
function pintarFacultades() {
  const cont = $('lista-facultades');
  cont.innerHTML = '';
  t('facs').forEach((nombre, i) => {
    const b = document.createElement('button');
    b.type = 'button';
    b.innerHTML = '<span></span><svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#123285" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true" style="flex:none"><path d="M9 6l6 6-6 6"/></svg>';
    b.querySelector('span').textContent = nombre;
    b.addEventListener('click', () => {
      store.set('ceu_facultad', { id: FAC_ID[i], nombre: T.es.facs[i] });
      location.href = 'inicio.html';
    });
    cont.appendChild(b);
  });
}
function mostrarFacultades(email) {
  $('correo-ok').textContent = email;
  irA('paso-facultad');
}

/* ---------- Cookies ---------- */
function actualizarBotonConfig() {
  const abierto = !$('ck-panel').hidden;
  $('ck-config').textContent = abierto ? t('ckS') : t('ckC');
  $('ck-config').setAttribute('aria-expanded', String(abierto));
}
function guardarCookies(analiticas, personalizacion) {
  store.set('ceu_cookies', { tecnicas: true, analiticas, personalizacion, fecha: new Date().toISOString() });
  $('cookies').hidden = true; $('ck-panel').hidden = true; actualizarBotonConfig();
}
function abrirCookies(conPanel) {
  const prev = store.get('ceu_cookies');
  $('ck-analiticas').checked = !!(prev && prev.analiticas);
  $('ck-personal').checked = !!(prev && prev.personalizacion);
  $('cookies').hidden = false;
  $('ck-panel').hidden = !conPanel;
  actualizarBotonConfig();
}
$('ck-aceptar').addEventListener('click', () => guardarCookies(true, true));
$('ck-rechazar').addEventListener('click', () => guardarCookies(false, false));
$('ck-config').addEventListener('click', () => {
  if ($('ck-panel').hidden) { $('ck-panel').hidden = false; actualizarBotonConfig(); $('ck-analiticas').focus(); }
  else guardarCookies($('ck-analiticas').checked, $('ck-personal').checked);
});
$('abrir-cookies').addEventListener('click', () => { abrirCookies(true); $('ck-aceptar').focus(); });

/* ---------- Arranque ---------- */
aplicarIdioma();
if (!store.get('ceu_cookies')) abrirCookies(false);

// Abierta en el ordenador (file://) no hay servidor: avisamos de que el envío solo va en Netlify.
if (location.protocol === 'file:') $('aviso-config').hidden = false;

// Si ya entraste antes (sesión de 30 días), vamos directos.
const sesion = store.get('ceu_sesion');
if (sesion && sesion.email && sesion.exp > Date.now()) {
  if (store.get('ceu_facultad')) location.href = 'inicio.html';
  else mostrarFacultades(sesion.email);
}
