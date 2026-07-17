// ---------- Libro de PDFs: cambiar de documento en el visor ----------
const pdfViewer = document.getElementById('pdfViewer');
const bookTabs = document.querySelectorAll('.book-tab');

bookTabs.forEach((tab) => {
  tab.addEventListener('click', () => {
    if (!pdfViewer) return;
    pdfViewer.src = tab.dataset.pdf;
    bookTabs.forEach((t) => t.classList.remove('active'));
    tab.classList.add('active');
  });
});

// ---------- Navbar: resaltar la sección activa mientras se hace scroll ----------
const navLinks = document.querySelectorAll('#mainNav a[data-section]');
const trackedSections = document.querySelectorAll('main section[id]');

if (navLinks.length && trackedSections.length) {
  const headerHeight = document.querySelector('.site-header').offsetHeight;

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          const id = entry.target.getAttribute('id');
          navLinks.forEach((link) => {
            link.classList.toggle('active', link.dataset.section === id);
          });
        }
      });
    },
    {
      rootMargin: `-${headerHeight + 10}px 0px -60% 0px`,
      threshold: 0,
    }
  );

  trackedSections.forEach((section) => observer.observe(section));
}

// ---------- Carrusel de imágenes de fondo (hero) ----------
const slides = document.querySelectorAll('.hero-slide');
const dots = document.querySelectorAll('.hero-dot');
let currentSlide = 0;
let carouselTimer;

function irASlide(index) {
  slides[currentSlide].classList.remove('active');
  dots[currentSlide].classList.remove('active');
  currentSlide = index;
  slides[currentSlide].classList.add('active');
  dots[currentSlide].classList.add('active');
}

function siguienteSlide() {
  irASlide((currentSlide + 1) % slides.length);
}

function iniciarCarrusel() {
  clearInterval(carouselTimer);
  carouselTimer = setInterval(siguienteSlide, 5000);
}

dots.forEach((dot) => {
  dot.addEventListener('click', () => {
    irASlide(Number(dot.dataset.slide));
    iniciarCarrusel();
  });
});

if (slides.length) iniciarCarrusel();

// ---------- Diagrama interactivo: mostrar definición al pasar el cursor ----------
// El diagrama ahora vive en un archivo SVG aparte (assets/svg/elements.svg),
// cargado con <object>. Por eso hay que esperar a que cargue y entrar a su
// propio documento (contentDocument) para engancharle los eventos.
const diagramObject = document.getElementById('circuitDiagram');
const diagramDef = document.getElementById('diagram-def');

function activarDiagrama() {
  const svgDoc = diagramObject.contentDocument;
  if (!svgDoc) return;

  const nodes = svgDoc.querySelectorAll('.node');
  nodes.forEach((node) => {
    node.addEventListener('mouseenter', () => {
      diagramDef.textContent = node.getAttribute('data-def');
    });
    node.addEventListener('mouseleave', () => {
      diagramDef.textContent = 'Pasa el cursor sobre un nodo del diagrama para ver su definición aquí.';
    });
  });
}

if (diagramObject) {
  // Si el SVG ya estaba cargado (caché) al correr el script, "load" no vuelve a disparar
  if (diagramObject.contentDocument && diagramObject.contentDocument.readyState === 'complete') {
    activarDiagrama();
  } else {
    diagramObject.addEventListener('load', activarDiagrama);
  }
}

// ---------- Modal genérico (compartido por los dos formularios) ----------
const modalOverlay = document.getElementById('modalOverlay');
const modalBox = document.getElementById('modalBox');
const modalIcon = document.getElementById('modalIcon');
const modalTitle = document.getElementById('modalTitle');
const modalBody = document.getElementById('modalBody');
const modalAction = document.getElementById('modalAction');
const modalClose = document.getElementById('modalClose');
let countdownTimer = null;

function abrirModal({ tipo = 'default', icono = 'fa-solid fa-paper-plane', titulo, cuerpoHTML, textoBoton = 'Entendido', onAction = null }) {
  modalBox.classList.remove('modal-success', 'modal-warning');
  if (tipo === 'success') modalBox.classList.add('modal-success');
  if (tipo === 'warning') modalBox.classList.add('modal-warning');

  modalIcon.innerHTML = `<i class="${icono}"></i>`;
  modalTitle.textContent = titulo;
  modalBody.innerHTML = cuerpoHTML;
  modalAction.textContent = textoBoton;
  modalAction.style.display = '';
  modalClose.style.display = '';

  modalAction.onclick = () => {
    cerrarModal();
    if (onAction) onAction();
  };

  modalOverlay.classList.add('open');
  document.body.style.overflow = 'hidden';
}

function cerrarModal() {
  modalOverlay.classList.remove('open');
  document.body.style.overflow = '';

  // Si se cierra a mitad de la cuenta regresiva del quiz, no dejamos al niño trabado
  if (countdownTimer) {
    clearInterval(countdownTimer);
    countdownTimer = null;
    const quizBody = document.getElementById('quizBody');
    const quizStartBtn = document.getElementById('quiz-start');
    if (quizBody) quizBody.classList.remove('hidden');
    if (quizStartBtn) quizStartBtn.style.display = 'none';
    modalAction.style.display = '';
    modalClose.style.display = '';
  }
}

modalClose.addEventListener('click', cerrarModal);
modalOverlay.addEventListener('click', (e) => {
  if (e.target === modalOverlay) cerrarModal();
});
document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape' && modalOverlay.classList.contains('open')) cerrarModal();
});

// ---------- Helpers de validación de campos ----------
function marcarError(input, mensajeError) {
  input.classList.remove('invalid');
  void input.offsetWidth; // fuerza a reiniciar la animación si el error ya estaba marcado
  input.classList.add('invalid');
  const errorSpan = document.getElementById(`${input.id}-error`);
  if (errorSpan) errorSpan.innerHTML = `<i class="fa-solid fa-circle-exclamation"></i>${mensajeError}`;
}

function limpiarError(input) {
  input.classList.remove('invalid');
  const errorSpan = document.getElementById(`${input.id}-error`);
  if (errorSpan) errorSpan.innerHTML = '';
}

// ---------- Simulador de circuito de comunicación ----------
const simulatorForm = document.getElementById('simulator-form');
const simulatorResult = document.getElementById('simulator-result');
const emisorInput = document.getElementById('emisor');
const mensajeInput = document.getElementById('mensaje');
const receptorInput = document.getElementById('receptor');
const retroalimentacionInput = document.getElementById('retroalimentacion');

const SOLO_LETRAS = /^[A-Za-zÁÉÍÓÚÑáéíóúñ\s]+$/;

const canalDescripciones = {
  voz: 'ondas sonoras en el aire',
  whatsapp: 'una red de datos móvil',
  carta: 'papel entregado en mano',
  videollamada: 'una conexión de video en tiempo real',
};
const codigoDescripciones = {
  espanol: 'el español hablado',
  senas: 'la lengua de señas',
  emojis: 'emojis',
  morse: 'código Morse',
};
const contextoDescripciones = {
  salon: 'el salón de clase',
  recreo: 'el recreo',
  casa: 'una videollamada desde casa',
  reunion: 'una reunión familiar',
};

function evaluarRuido(nivel) {
  if (nivel < 20) return { estado: 'mínimo', efecto: 'el mensaje llega prácticamente intacto.' };
  if (nivel < 60) return { estado: 'moderado', efecto: 'el receptor entiende la idea general, pero pierde algunos detalles.' };
  return { estado: 'alto', efecto: 'el mensaje llega muy distorsionado y probablemente necesite repetirse.' };
}

// Filtra en vivo: a estos campos solo se les permite escribir letras y espacios,
// y avisa AL INSTANTE (no hasta que se envía el formulario) por qué se borró el caracter
function permitirSoloLetras(input) {
  input.addEventListener('input', () => {
    const limpio = input.value.replace(/[^A-Za-zÁÉÍÓÚÑáéíóúñ\s]/g, '');
    if (limpio !== input.value) {
      input.value = limpio;
      marcarError(input, 'Solo letras, sin números ni símbolos.');
    }
  });
}
permitirSoloLetras(emisorInput);
permitirSoloLetras(receptorInput);

function validarSimulador() {
  let valido = true;

  if (!SOLO_LETRAS.test(emisorInput.value.trim()) || emisorInput.value.trim().length < 2) {
    marcarError(emisorInput, 'Solo letras, sin números ni símbolos (mínimo 2).');
    valido = false;
  } else {
    limpiarError(emisorInput);
  }

  if (mensajeInput.value.trim().length < 3) {
    marcarError(mensajeInput, 'Escribe un mensaje un poco más largo.');
    valido = false;
  } else {
    limpiarError(mensajeInput);
  }

  if (!SOLO_LETRAS.test(receptorInput.value.trim()) || receptorInput.value.trim().length < 2) {
    marcarError(receptorInput, 'Solo letras, sin números ni símbolos (mínimo 2).');
    valido = false;
  } else {
    limpiarError(receptorInput);
  }

  if (retroalimentacionInput.value.trim().length < 3) {
    marcarError(retroalimentacionInput, 'Cuéntanos brevemente cómo respondería el receptor.');
    valido = false;
  } else {
    limpiarError(retroalimentacionInput);
  }

  return valido;
}

// Validar en vivo mientras el niño escribe (una vez que ya intentó enviar)
[emisorInput, mensajeInput, receptorInput, retroalimentacionInput].forEach((input) => {
  input.addEventListener('input', () => {
    if (input.classList.contains('invalid')) validarSimulador();
  });
});

simulatorForm.addEventListener('submit', function (event) {
  event.preventDefault();
  if (!validarSimulador()) return;

  const emisor = emisorInput.value.trim();
  const mensaje = mensajeInput.value.trim();
  const codigo = document.getElementById('codigo').value;
  const canal = document.getElementById('canal').value;
  const contexto = document.getElementById('contexto').value;
  const ruido = Number(document.getElementById('ruido').value);
  const receptor = receptorInput.value.trim();
  const retro = retroalimentacionInput.value.trim();

  const ruidoInfo = evaluarRuido(ruido);
  const canalTexto = canalDescripciones[canal] ?? canal;
  const codigoTexto = codigoDescripciones[codigo] ?? codigo;
  const contextoTexto = contextoDescripciones[contexto] ?? contexto;

  const resultadoHTML = `
    <strong>${emisor}</strong> envía el mensaje "<em>${mensaje}</em>" usando ${codigoTexto},
    a través de ${canalTexto}, durante ${contextoTexto}.
    Con un ruido ${ruidoInfo.estado} (${ruido}%), ${ruidoInfo.efecto}
    Finalmente, <strong>${receptor}</strong> recibe la señal y responde: "<em>${retro}</em>".
  `.replace(/\s+/g, ' ').trim();

  simulatorResult.innerHTML = resultadoHTML;
  simulatorResult.classList.remove('result-pop');
  void simulatorResult.offsetWidth; // reinicia la animación si se envía varias veces
  simulatorResult.classList.add('result-pop');
});

simulatorForm.addEventListener('reset', () => {
  [emisorInput, mensajeInput, receptorInput, retroalimentacionInput].forEach(limpiarError);
  simulatorResult.innerHTML = '';
});

// ---------- Quiz: identifica el elemento ----------
const quizForm = document.getElementById('quiz-form');
const quizStartBtn = document.getElementById('quiz-start');
const quizBody = document.getElementById('quizBody');

const respuestasCorrectas = {
  q1: 'ruido',
  q2: 'codigo',
  q3: 'retroalimentacion',
  q4: 'canal',
  q5: 'contexto',
  q6: 'mensaje',
};

// Botón "Iniciar prueba": cuenta regresiva 3, 2, 1 dentro del modal, y luego revela el quiz
quizStartBtn.addEventListener('click', () => {
  const pasos = [
    { texto: '3', icono: 'fa-solid fa-rocket' },
    { texto: '2', icono: 'fa-solid fa-rocket' },
    { texto: '1', icono: 'fa-solid fa-rocket' },
    { texto: '¡Empieza!', icono: 'fa-solid fa-flag-checkered' },
  ];
  let i = 0;

  modalBox.classList.remove('modal-success', 'modal-warning');
  modalTitle.textContent = '¿Listo para el reto?';
  modalIcon.innerHTML = `<i class="${pasos[i].icono}"></i>`;
  modalBody.innerHTML = `<span class="countdown-number">${pasos[i].texto}</span>`;
  modalAction.style.display = 'none';
  modalClose.style.display = 'none';
  modalOverlay.classList.add('open');
  document.body.style.overflow = 'hidden';

  countdownTimer = setInterval(() => {
    i += 1;
    if (i < pasos.length) {
      modalIcon.innerHTML = `<i class="${pasos[i].icono}"></i>`;
      modalBody.innerHTML = `<span class="countdown-number">${pasos[i].texto}</span>`;
    } else {
      clearInterval(countdownTimer);
      countdownTimer = null;
      cerrarModal();
      quizBody.classList.remove('hidden');
      quizStartBtn.style.display = 'none';
    }
  }, 700);
});

function validarQuiz() {
  let valido = true;

  Object.keys(respuestasCorrectas).forEach((pregunta) => {
    const grupo = document.querySelector(`.quiz-options[data-question="${pregunta}"]`);
    const errorSpan = document.getElementById(`${pregunta}-error`);
    const respondida = document.querySelector(`input[name="${pregunta}"]:checked`);

    if (!respondida) {
      grupo.classList.add('invalid');
      if (errorSpan) errorSpan.innerHTML = '<i class="fa-solid fa-circle-exclamation"></i>Selecciona una opción.';
      valido = false;
    } else {
      grupo.classList.remove('invalid');
      if (errorSpan) errorSpan.innerHTML = '';
    }
  });

  return valido;
}

quizForm.addEventListener('submit', function (event) {
  event.preventDefault();
  if (!validarQuiz()) return;

  const formData = new FormData(quizForm);
  let aciertos = 0;
  const total = Object.keys(respuestasCorrectas).length;

  Object.entries(respuestasCorrectas).forEach(([pregunta, correcta]) => {
    const grupo = document.querySelector(`.quiz-options[data-question="${pregunta}"]`);
    const errorSpan = document.getElementById(`${pregunta}-error`);
    const seleccionada = formData.get(pregunta);
    const esCorrecta = seleccionada === correcta;

    grupo.classList.remove('correct', 'incorrect');
    grupo.classList.add(esCorrecta ? 'correct' : 'incorrect');

    if (errorSpan) {
      errorSpan.className = esCorrecta ? 'field-error success' : 'field-error incorrect';
      errorSpan.innerHTML = esCorrecta
        ? '<i class="fa-solid fa-circle-check"></i> ¡Correcto!'
        : `<i class="fa-solid fa-circle-xmark"></i> Esa no era. Revisa "${correcta}" en el diagrama.`;
    }

    if (esCorrecta) aciertos += 1;
  });

  let tipo, icono, titulo, cuerpo;
  if (aciertos === total) {
    tipo = 'success';
    icono = 'fa-solid fa-star';
    titulo = '¡Perfecto!';
    cuerpo = `Acertaste <strong>${aciertos} de ${total}</strong>. Dominas los elementos de la comunicación. 🎉`;
  } else if (aciertos >= total / 2) {
    tipo = 'warning';
    icono = 'fa-solid fa-face-smile';
    titulo = '¡Bien hecho!';
    cuerpo = `Acertaste <strong>${aciertos} de ${total}</strong>. Mira en rojo cuáles preguntas repasar.`;
  } else {
    tipo = 'default';
    icono = 'fa-solid fa-rotate';
    titulo = 'Sigue practicando';
    cuerpo = `Acertaste <strong>${aciertos} de ${total}</strong>. Mira en rojo cuáles preguntas repasar, y revisa el diagrama de "Elementos".`;
  }

  abrirModal({
    tipo,
    icono,
    titulo,
    cuerpoHTML: cuerpo,
    textoBoton: 'Intentar de nuevo',
    onAction: () => quizForm.reset(),
  });
});

// Si cambia una respuesta después de calificar, se le quita la marca de correcto/incorrecto
document.querySelectorAll('.quiz-options input[type="radio"]').forEach((radio) => {
  radio.addEventListener('change', () => {
    const grupo = radio.closest('.quiz-options');
    grupo.classList.remove('correct', 'incorrect', 'invalid');
    const errorSpan = document.getElementById(`${grupo.dataset.question}-error`);
    if (errorSpan) { errorSpan.innerHTML = ''; errorSpan.className = 'field-error'; }
  });
});

quizForm.addEventListener('reset', () => {
  document.querySelectorAll('.quiz-options').forEach((grupo) => grupo.classList.remove('invalid', 'correct', 'incorrect'));
  document.querySelectorAll('.quiz-options + .field-error').forEach((span) => {
    span.innerHTML = '';
    span.className = 'field-error';
  });
});

// ============================================================
// ANIMACIONES: revelado progresivo al hacer scroll
// No toca el HTML: agrega las clases por JS sobre selectores
// que ya existen, así que nada de lo anterior se rompe.
// ============================================================

document.addEventListener('DOMContentLoaded', () => {
  const revealSelectors = [
    '#definicion .col-text',
    '#definicion .col-quote',
    '#elementos .diagram-wrap',
    '#elementos .section-lead',
    '#elementos .table-wrap',
    '#fuentes .col-video',
    '#fuentes .col-book',
  ];
  revealSelectors.forEach((selector) => {
    document.querySelectorAll(selector).forEach((el) => el.classList.add('reveal'));
  });

  const staggerSelectors = [
    '.cards-grid',
    '.fact-row',
    '.activity-grid',
    '.footer-inner',
    '.quote-tags',
  ];
  staggerSelectors.forEach((selector) => {
    document.querySelectorAll(selector).forEach((el) => el.classList.add('reveal-stagger'));
  });

  const animatedEls = document.querySelectorAll('.reveal, .reveal-stagger');

  if (animatedEls.length && 'IntersectionObserver' in window) {
    const revealObserver = new IntersectionObserver(
      (entries, obs) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('is-visible');
            obs.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.15, rootMargin: '0px 0px -60px 0px' }
    );
    animatedEls.forEach((el) => revealObserver.observe(el));
  } else {
    animatedEls.forEach((el) => el.classList.add('is-visible'));
  }
});