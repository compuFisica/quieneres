let port;
let distancia = 0;
let presente = false;
let ultimoDato = 0;
let estadoActual = "";
let efectoActual = -1;
let proximoCambio = 0;

const DURACION_MIN = 3000;   // ms mínimo por efecto aleatorio
const DURACION_MAX = 8000;   // ms máximo por efecto aleatorio

const IMG5 = "https://live.staticflickr.com/7337/15870494823_70caeef4b0_b.jpg";
const IMG6 = "https://live.staticflickr.com/5065/5571978160_616a5db959_k.jpg";

// ---------- EFECTOS ----------
const efectos = [
  { nombre: '1', fn: () => { // (antes era el 8)
    src(s0).invert().pixelate(110, 100).out(o0);
    shape([0,1,3,2,0,3,4,2].fast(10))
      .color([10,0.3,-0.5].fast(0.5), 0.4, [-1,-0.6,-0.8].fast(0.4))
      .repeat([20,40].fast(1), 3).out(o1);
    src(o0).modulate(o1).out(o2);
    render(o2);
  }},
  { nombre: '2', fn: () => {
    src(s1).color(0, 0.3, 0).out(o0);
    src(s0).invert().pixelate(150, 150).out(o1);
    osc(5, 0.1, 0.6).color(1, 1, 1).out(o2);
    src(o0).add(o1).diff(o2).color(0.3, 1, 0.3).out(o3);
    render(o3);
  }},
  { nombre: '3', fn: () => {
    src(s0).contrast(100).out(o0);
    src(s2).blend(o0).out(o1);
    src(o1).color(1.0, 1, -1.0)
      .brightness(() => Math.sin(6))
      .invert().rotate(9.42, 0).scrollX(0.5, 0.1).out(o2);
    src(o2).blend(o0).out(o3);
    render(o3);
  }},
  { nombre: '4', fn: () => {
    src(s0).out(o0);
    src(o2).color(1.0, 1, -1.0).rotate(0.1, 0.01)
      .modulatePixelate(noise(25, 0.5), 100).out(o3);
    src(o0).modulateScale(o3).invert().out(o2);
    render(o2);
  }},
  { nombre: '5', fn: () => {
    s3.initImage(IMG5);
    src(s3).contrast(5).color(0.3, 0, 0).rotate(0, 0.1).out(o0);
    src(s0).contrast(50).color(0, 1, 0).out(o1);
    src(o0).blend(o1).out(o2);
    src(o2)
      .blend(src(o0).mask(shape(2).rotate(0, 0.5).scale(1.5, 1.5)))
      .modulateRotate(o2).out(o3);
    render(o3);
  }},
  { nombre: '6', fn: () => {
    s3.initImage(IMG6);
    src(s3).contrast(50).color(0, 0, 0.1).out(o0);
    src(s0).contrast(10).color(0.1, 0, 0).out(o1);
    osc(2).colorama(80, 0.9).pixelate(10, 10).out(o2);
    src(o1).add(o0).add(o1).modulate(o0)
      .modulateRotate(o2, 0, 0).modulate(o2).out(o3);
    render(o3);
  }},
  { nombre: '7', fn: () => {
    src(s0).invert().pixelate(110, 100)
      .scrollX([1, 0.2].offset(10).smooth())
      .scrollY([1, 0.2].smooth()).out(o0);
    shape([0,1,3,2,0,3,4,2].fast(10))
      .color([10,0.3,-0.5].fast(0.5), 0.4, [-1,-0.6,-0.8].fast(0.4))
      .repeat([20,40].fast(1), 3)
      .scrollX([1, 0.2].offset(10).smooth())
      .scrollY([1, 0.2].smooth()).out(o1);
    src(o0).modulate(o1).out(o2);
    render(o2);
  }},
  { nombre: '8', fn: () => { // (antes era el 1)
    src(s0).out(o0);
    src(o2).color(1.0, 1, -1.0).rotate(0.1, 0.01)
      .modulatePixelate(noise(25, 0.5), 100).out(o3);
    src(o0).modulateScale(o3).out(o2);
    render(o2);
  }},
  { nombre: '9', fn: () => {
    src(s0).scale(2).contrast(10)
      .modulateScale(osc([-3,0.8,4].fast(-0)).scale(20), 1, 0)
      .invert().out(o2);
    voronoi([25,2,60].fast(2).smooth())
      .modulate(osc(20, 1, 4))
      .scale(1.5, [0.25,0.5,0.75,1].fast(0.25), [3,2,1].smooth()).out(o0);
    osc([30,50,10])
      .modulate(osc(25, 0.1, 0.5).kaleid(10).diff(o2)).out(o1);
    src(o1).modulate(o0).modulate(o2).color(1, 0, 0).out(o3);
    render(o2);
  }},
  { nombre: '10', fn: () => {
    src(s0).scale(2).contrast(10)
      .modulateScale(osc([-3,0.8,4].fast(-0)).scale(20), 1, 0)
      .invert().out(o2);
    voronoi([25,2,60].fast(2).smooth())
      .modulate(osc(20, 1, 4))
      .scale(1.5, [0.25,0.5,0.75,1].fast(0.25), [3,2,1].smooth()).out(o0);
    osc([30,50,10])
      .modulate(osc(25, 0.1, 0.5).kaleid(10).diff(o2)).out(o1);
    src(o1).modulate(o0).modulate(o2).color(1, 0, 0).out(o3);
    render(o3);
  }},
  { nombre: '11', fn: () => {
    src(s0).scale(2).contrast(10)
      .modulateScale(osc([-3,0.8,4].fast(-0)).scale(20), 1, 0)
      .invert().out(o0);
    src(s0).scale(2).contrast(10).color(1, 0, 1)
      .modulateScale(osc([-3,0.8,4].fast(-0)).scale(20), 1, 0).out(o1);
    src(s0).scale(2).contrast(10).color(0, 1, 1)
      .modulateScale(osc([-3,0.8,4].fast(-0)).scale(20), 1, 0).out(o2);
    src(o0).modulate(o2).modulate(o1).out(o3);
    render(o3);
  }}
];

// ---------- PREGUNTAS ----------
// Introducción: se repite cada vez que llega alguien a la marca
const introduccion = [
  "¿Quién anda ahí?",
  "Sí, hablo contigo"
];

// Preguntas aleatorias (empiezan después de la introducción)
const preguntas = [
  "¿Quién eres?",
  "¿Eres tus logros?",
  "¿Eres tus experiencias?",
  "¿Eres quien se espera que seas?",
  "¿Eres quien te dijeron que eras?",
  "¿Eres tu cuerpo?",
  "¿Eres tus pensamientos?",
  "¿Eres tu corazón?",
  "¿Eres las palabras que te describen: mujer, hombre, joven, estudiante, artista?",
  "¿Quién serías si nadie te hubiera dicho quién eres?",
  "¿Qué te hace ser quien eres?"
];

const ESPERA_INICIAL = 1000;     // ms desde que llega alguien hasta "¿Quién anda ahí?"
const PAUSA_INTRO = 10;        // ms entre las dos frases de la introducción
const INTERVALO_MIN = 1000;      // ms mínimo de pausa entre preguntas aleatorias
const INTERVALO_MAX = 4000;     // ms máximo de pausa entre preguntas aleatorias
const MS_POR_LETRA = 30;         // velocidad de escritura
const DURACION_PREGUNTA = 4000;  // ms que se queda cada frase completa en pantalla

let fasePregunta = "reposo";     // reposo | espera | escribiendo | visible
let tPregunta = 0;
let preguntaActual = "";
let letrasMostradas = 0;
let ultimaPregunta = -1;
let indiceIntro = 0;

function elegirPregunta() {
  if (indiceIntro < introduccion.length) {
    preguntaActual = introduccion[indiceIntro];
    indiceIntro++;
    return;
  }
  let i;
  do { i = floor(random(preguntas.length)); }
  while (i === ultimaPregunta && preguntas.length > 1);
  ultimaPregunta = i;
  preguntaActual = preguntas[i];
}

function actualizarPregunta() {
  const el = document.getElementById("pregunta");
  const ahora = millis();

  // Sin presencia: se borra el texto, se corta la voz y se reinicia
  if (!presente) {
    if (fasePregunta !== "reposo") {
      el.textContent = "";
      fasePregunta = "reposo";
      detenerVoz();
    }
    return;
  }

  // Acaba de llegar alguien: empieza la introducción desde cero
  if (fasePregunta === "reposo") {
    fasePregunta = "espera";
    tPregunta = ahora + ESPERA_INICIAL;
    indiceIntro = 0;
  }

  // Toca una frase nueva: se escribe y se dice a la vez
  if (fasePregunta === "espera" && ahora >= tPregunta) {
    elegirPregunta();
    letrasMostradas = 0;
    fasePregunta = "escribiendo";
    tPregunta = ahora;
    decirPregunta(preguntaActual);
  }

  if (fasePregunta === "escribiendo") {
    if (ahora >= tPregunta) {
      letrasMostradas++;
      el.textContent = preguntaActual.slice(0, letrasMostradas);
      tPregunta = ahora + MS_POR_LETRA;
      if (letrasMostradas >= preguntaActual.length) {
        fasePregunta = "visible";
        tPregunta = ahora + DURACION_PREGUNTA;
      }
    }
  } else if (fasePregunta === "visible" && ahora >= tPregunta &&
             (!vozActiva || ahora >= tPregunta + 8000)) {
    el.textContent = "";
    fasePregunta = "espera";
    tPregunta = ahora + (indiceIntro < introduccion.length
      ? PAUSA_INTRO
      : random(INTERVALO_MIN, INTERVALO_MAX));
  }
}

// ---------- VOZ ----------
const NOMBRE_VOZ = "";        // opcional: parte del nombre de una voz (ej. "Paulina"); vacío = automática
const VOZ_VELOCIDAD = 1.3;    // 0.5 (lenta) a 2 (rápida)
const VOZ_TONO = 0;         // 0 (grave) a 2 (agudo)

let vozElegida = null;
let vozActiva = false;
let utteranceActual = null;

function iniciarVoces() {
  if (!("speechSynthesis" in window)) return;
  elegirVoz();
  speechSynthesis.onvoiceschanged = elegirVoz;  // Chrome carga las voces con retraso
}

function elegirVoz() {
  const es = speechSynthesis.getVoices().filter(v => v.lang.toLowerCase().startsWith("es"));
  console.log("Voces en español disponibles:", es.map(v => v.name + " (" + v.lang + ")"));
  vozElegida =
    es.find(v => NOMBRE_VOZ && v.name.includes(NOMBRE_VOZ)) ||
    es.find(v => /(MX|US|419|AR|CO|CL)/i.test(v.lang)) ||
    es[0] || null;
}

function decirPregunta(texto) {
  if (!("speechSynthesis" in window)) return;
  utteranceActual = null;
  speechSynthesis.cancel();

  const u = new SpeechSynthesisUtterance(texto);
  if (vozElegida) { u.voice = vozElegida; u.lang = vozElegida.lang; }
  else { u.lang = "es-MX"; }
  u.rate = VOZ_VELOCIDAD;
  u.pitch = VOZ_TONO;
  u.onstart = () => { if (u === utteranceActual) vozActiva = true; };
  u.onend = u.onerror = () => { if (u === utteranceActual) vozActiva = false; };

  utteranceActual = u;
  speechSynthesis.speak(u);
}

function detenerVoz() {
  if (!("speechSynthesis" in window)) return;
  utteranceActual = null;
  speechSynthesis.cancel();
  vozActiva = false;
}

// ---------- PROGRAMA PRINCIPAL ----------
function setup() {
  noCanvas();

  new Hydra({
    canvas: document.getElementById("hydra"),
    detectAudio: false,
    makeGlobal: true
  });
  s0.initCam();
  s1.initVideo("https://cdn.pixabay.com/video/2022/02/11/107468-678258885_large.mp4");
  s2.initVideo("https://media.giphy.com/media/AS9LIFttYzkc0/giphy.mp4");

  port = createSerial();
  let puertos = usedSerialPorts();
  if (puertos.length > 0) port.open(puertos[0], 115200);

  document.getElementById("boton").addEventListener("click", () => {
    if (!port.opened()) port.open(115200);
  });

    iniciarVoces();
  cambiarEstado("negro");
}

function draw() {
  leerSensor();

  // Modo seguro: si el Arduino deja de mandar datos, pantalla negra
  let sinDatos = millis() - ultimoDato;
  if (sinDatos > 1500) presente = false;

  let estado = !presente ? "negro" : "aleatorio";

  if (estado !== estadoActual) {
    cambiarEstado(estado);
  } else if (estado === "aleatorio" && millis() > proximoCambio) {
    siguienteEfecto();
  }

  actualizarPregunta();

  let nombreEfecto = (estadoActual === "aleatorio" && efectoActual >= 0)
    ? efectos[efectoActual].nombre : estadoActual;
  document.getElementById("debug").textContent =
    "distancia: " + distancia + " mm | presente: " + presente +
    " | efecto: " + nombreEfecto +
    " | último dato hace: " + sinDatos + " ms";
}

function ordenSonido(orden) {
  const f = document.getElementById("sonido");
  if (f && f.contentWindow) f.contentWindow.postMessage("sonido:" + orden, location.origin);
}

function cambiarEstado(estado) {
  estadoActual = estado;
  if (estado === "negro") {
    solid(0, 0, 0, 1).out(o0);
    render(o0);
    ordenSonido("stop");
  } else {
    siguienteEfecto();
    ordenSonido("play");
  }
}

function siguienteEfecto() {
  let i;
  do { i = floor(random(efectos.length)); }
  while (i === efectoActual && efectos.length > 1);
  efectoActual = i;
  efectos[i].fn();
  proximoCambio = millis() + random(DURACION_MIN, DURACION_MAX);
}

function leerSensor() {
  if (!port.opened()) return;
  let linea;
  while ((linea = port.readUntil("\n")) !== "") {
    let partes = linea.trim().split(",");
    if (partes.length === 2) {
      distancia = int(partes[0]);
      presente = partes[1] === "1";
      ultimoDato = millis();
    }
  }
}
