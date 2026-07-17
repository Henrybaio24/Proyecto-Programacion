// 1) VISOR DE PDF 
var visorPdf = document.getElementById("visorPdf");
var botonesPestana = document.querySelectorAll(".pestana-libro");

for (var i = 0; i < botonesPestana.length; i++) {
  botonesPestana[i].addEventListener("click", function () {
    var archivoPdf = this.getAttribute("data-pdf");
    if (visorPdf) {
      visorPdf.src = archivoPdf;
    }
    for (var j = 0; j < botonesPestana.length; j++) {
      botonesPestana[j].classList.remove("activa");
    }
    this.classList.add("activa");
  });
}

// MENU DE NAVEGACION
var enlacesMenu = document.querySelectorAll("#menuPrincipal a[data-seccion]");
var secciones = document.querySelectorAll("main section[id]");

function actualizarMenuActivo() {
  var alturaEncabezado = document.querySelector(".encabezado").offsetHeight;

  for (var i = 0; i < secciones.length; i++) {
    var seccion = secciones[i];
    var rect = seccion.getBoundingClientRect();

    if (rect.top <= alturaEncabezado + 10 && rect.bottom > alturaEncabezado + 10) {
      var idSeccion = seccion.getAttribute("id");

      for (var j = 0; j < enlacesMenu.length; j++) {
        var enlace = enlacesMenu[j];
        if (enlace.getAttribute("data-seccion") === idSeccion) {
          enlace.classList.add("activo");
        } else {
          enlace.classList.remove("activo");
        }
      }
    }
  }
}

if (enlacesMenu.length > 0 && secciones.length > 0) {
  window.addEventListener("scroll", actualizarMenuActivo);
  actualizarMenuActivo(); 
}

// CARRUSEL DE PORTADA
var diapositivas = document.querySelectorAll(".portada-imagen");
var puntosCarrusel = document.querySelectorAll(".portada-punto");
var diapositivaActual = 0;
var temporizadorCarrusel = null;

function irADiapositiva(indice) {
  diapositivas[diapositivaActual].classList.remove("activa");
  puntosCarrusel[diapositivaActual].classList.remove("activo");

  diapositivaActual = indice;

  diapositivas[diapositivaActual].classList.add("activa");
  puntosCarrusel[diapositivaActual].classList.add("activo");
}

function siguienteDiapositiva() {
  var siguiente = diapositivaActual + 1;
  if (siguiente >= diapositivas.length) {
    siguiente = 0;
  }
  irADiapositiva(siguiente);
}

function iniciarCarrusel() {
  clearInterval(temporizadorCarrusel);
  temporizadorCarrusel = setInterval(siguienteDiapositiva, 5000);
}

for (var i = 0; i < puntosCarrusel.length; i++) {
  puntosCarrusel[i].addEventListener("click", function () {
    var indice = Number(this.getAttribute("data-diapositiva"));
    irADiapositiva(indice);
    iniciarCarrusel();
  });
}

if (diapositivas.length > 0) {
  iniciarCarrusel();
}

// TARJETAS DE ELEMENTOS
var listaElementos = [
  {
    nombre: "Emisor",
    icono: "fa-solid fa-microphone-lines",
    color: "carta-c1",
    definicion: "Quien origina y codifica el mensaje. Puede ser una persona, una institucion o un sistema.",
    ejemplo: "La profesora explicando la tarea."
  },
  {
    nombre: "Mensaje",
    icono: "fa-solid fa-envelope",
    color: "carta-c2",
    definicion: "El contenido de la informacion: ideas, datos o emociones que se quieren transmitir.",
    ejemplo: '"La tarea es para el lunes".'
  },
  {
    nombre: "Codigo",
    icono: "fa-solid fa-key",
    color: "carta-c3",
    definicion: "El sistema de signos (idioma, gestos, simbolos) que emisor y receptor deben compartir.",
    ejemplo: "El espanol hablado."
  },
  {
    nombre: "Canal",
    icono: "fa-solid fa-satellite-dish",
    color: "carta-c4",
    definicion: "El medio fisico por el que viaja el mensaje: aire, papel, cable, red.",
    ejemplo: "El aire (voz) o una app como WhatsApp."
  },
  {
    nombre: "Receptor",
    icono: "fa-solid fa-headphones",
    color: "carta-c5",
    definicion: "Quien recibe y decodifica el mensaje.",
    ejemplo: "Los estudiantes que escuchan."
  },
  {
    nombre: "Ruido",
    icono: "fa-solid fa-bolt",
    color: "carta-c6",
    definicion: "Cualquier interferencia que distorsiona o interrumpe el mensaje.",
    ejemplo: "Una alarma sonando en el salon."
  },
  {
    nombre: "Retroalimentacion",
    icono: "fa-solid fa-arrows-rotate",
    color: "carta-c7",
    definicion: "La respuesta del receptor, que confirma si el mensaje llego y como fue entendido.",
    ejemplo: "Un estudiante levanta la mano y pregunta."
  },
  {
    nombre: "Contexto",
    icono: "fa-solid fa-earth-americas",
    color: "carta-c8",
    definicion: "La situacion, lugar y momento en que ocurre la comunicacion, y que influye en su interpretacion.",
    ejemplo: "Un salon de clase en la manana."
  }
];

var contenedorCartas = document.getElementById("cartasElementos");

function dibujarCartasElementos() {
  if (!contenedorCartas) {
    return;
  }

  contenedorCartas.innerHTML = "";

  for (var i = 0; i < listaElementos.length; i++) {
    var elemento = listaElementos[i];

    var tarjeta = document.createElement("div");
    tarjeta.className = "carta-elemento " + elemento.color;

    tarjeta.innerHTML =
      '<div class="cara-carta">' +
        '<div class="icono-carta"><i class="' + elemento.icono + '"></i></div>' +
        '<div class="nombre-carta">' + elemento.nombre + "</div>" +
        '<div class="pista-carta">Pasa el mouse para descubrir &rarr;</div>' +
      "</div>" +
      '<div class="reverso-carta">' +
        '<div class="titulo-reverso">' + elemento.nombre + "</div>" +
        '<div class="definicion-carta">' + elemento.definicion + "</div>" +
        '<div class="ejemplo-carta">' +
          '<span class="etiqueta-ejemplo">Ejemplo</span>' +
          elemento.ejemplo +
        "</div>" +
      "</div>";

    tarjeta.addEventListener("mouseenter", function () {
      this.classList.add("volteada");
    });
    tarjeta.addEventListener("mouseleave", function () {
      this.classList.remove("volteada");
    });

    contenedorCartas.appendChild(tarjeta);
  }
}

// MODAL
var fondoModal = document.getElementById("fondoModal");
var cajaModal = document.getElementById("cajaModal");
var iconoModal = document.getElementById("iconoModal");
var tituloModal = document.getElementById("tituloModal");
var cuerpoModal = document.getElementById("cuerpoModal");
var botonAccionModal = document.getElementById("accionModal");
var botonCerrarModal = document.getElementById("cerrarModal");

var temporizadorCuentaRegresiva = null;
var funcionAlCerrarModal = null;

function abrirVentana(tipo, icono, titulo, cuerpoHtml, textoBoton, alCerrar) {
  cajaModal.classList.remove("ventana-exito", "ventana-advertencia");

  if (tipo === "exito") {
    cajaModal.classList.add("ventana-exito");
  }
  if (tipo === "advertencia") {
    cajaModal.classList.add("ventana-advertencia");
  }

  iconoModal.innerHTML = '<i class="' + icono + '"></i>';
  tituloModal.textContent = titulo;
  cuerpoModal.innerHTML = cuerpoHtml;
  botonAccionModal.textContent = textoBoton;
  botonAccionModal.style.display = "";
  botonCerrarModal.style.display = "";

  funcionAlCerrarModal = alCerrar || null;

  fondoModal.classList.add("abierta");
  document.body.style.overflow = "hidden";
}

function cerrarVentana() {
  fondoModal.classList.remove("abierta");
  document.body.style.overflow = "";

  if (temporizadorCuentaRegresiva) {
    clearInterval(temporizadorCuentaRegresiva);
    temporizadorCuentaRegresiva = null;

    var cuerpoQuizElemento = document.getElementById("cuerpoQuiz");
    var botonIniciarQuiz = document.getElementById("iniciar-quiz");

    if (cuerpoQuizElemento) {
      cuerpoQuizElemento.classList.remove("oculto");
    }
    if (botonIniciarQuiz) {
      botonIniciarQuiz.style.display = "none";
    }

    botonAccionModal.style.display = "";
    botonCerrarModal.style.display = "";
  }

  if (funcionAlCerrarModal) {
    funcionAlCerrarModal();
    funcionAlCerrarModal = null;
  }
}

if (botonAccionModal) {
  botonAccionModal.addEventListener("click", cerrarVentana);
}
if (botonCerrarModal) {
  botonCerrarModal.addEventListener("click", cerrarVentana);
}
if (fondoModal) {
  fondoModal.addEventListener("click", function (evento) {
    if (evento.target === fondoModal) {
      cerrarVentana();
    }
  });
}
document.addEventListener("keydown", function (evento) {
  if (evento.key === "Escape" && fondoModal.classList.contains("abierta")) {
    cerrarVentana();
  }
});

// VALIDACION FORMULARIOS
var expresionSoloLetras = /^[A-Za-zÁÉÍÓÚÑáéíóúñ\s]+$/;

function mostrarError(campo, mensaje) {
  campo.classList.remove("invalido");
  void campo.offsetWidth;
  campo.classList.add("invalido");

  var elementoError = document.getElementById(campo.id + "-error");
  if (elementoError) {
    elementoError.innerHTML = '<i class="fa-solid fa-circle-exclamation"></i>' + mensaje;
  }
}

function quitarError(campo) {
  campo.classList.remove("invalido");
  var elementoError = document.getElementById(campo.id + "-error");
  if (elementoError) {
    elementoError.innerHTML = "";
  }
}

function validarCampoDeTexto(campo, minimoCaracteres, soloLetras, mensajeError) {
  var valor = campo.value.trim();

  if (valor.length < minimoCaracteres) {
    mostrarError(campo, mensajeError);
    return false;
  }

  if (soloLetras && !expresionSoloLetras.test(valor)) {
    mostrarError(campo, "Solo se permiten letras, sin numeros ni simbolos.");
    return false;
  }

  quitarError(campo);
  return true;
}

// FORMULARIO 1
var formularioSimulador = document.getElementById("formulario-simulador");
var resultadoSimulador = document.getElementById("resultado-simulador");

var campoEmisor = document.getElementById("emisor");
var campoMensaje = document.getElementById("mensaje");
var campoCodigo = document.getElementById("codigo");
var campoCanal = document.getElementById("canal");
var campoContexto = document.getElementById("contexto");
var campoRuido = document.getElementById("ruido");
var campoReceptor = document.getElementById("receptor");
var campoRetroalimentacion = document.getElementById("retroalimentacion");

var textosCanal = {
  voz: "ondas sonoras en el aire",
  whatsapp: "una red de datos movil",
  carta: "papel entregado en mano",
  videollamada: "una conexion de video en tiempo real"
};
var textosCodigo = {
  espanol: "el espanol hablado",
  senas: "la lengua de senas",
  emojis: "emojis",
  morse: "codigo Morse"
};
var textosContexto = {
  salon: "el salon de clase",
  recreo: "el recreo",
  casa: "una videollamada desde casa",
  reunion: "una reunion familiar"
};

function permitirSoloLetrasMientrasEscribe(campo) {
  if (!campo) {
    return;
  }
  campo.addEventListener("input", function () {
    var valorLimpio = campo.value.replace(/[^A-Za-zÁÉÍÓÚÑáéíóúñ\s]/g, "");
    if (valorLimpio !== campo.value) {
      campo.value = valorLimpio;
      mostrarError(campo, "Solo letras, sin numeros ni simbolos.");
    }
  });
}
permitirSoloLetrasMientrasEscribe(campoEmisor);
permitirSoloLetrasMientrasEscribe(campoReceptor);

function describirRuido(nivel) {
  if (nivel < 20) {
    return {
      estado: "minimo",
      efecto: "el mensaje llega practicamente intacto."
    };
  }
  if (nivel < 60) {
    return {
      estado: "moderado",
      efecto: "el receptor entiende la idea general, pero pierde algunos detalles."
    };
  }
  return {
    estado: "alto",
    efecto: "el mensaje llega muy distorsionado y probablemente necesite repetirse."
  };
}

function validarFormularioSimulador() {
  var emisorValido = validarCampoDeTexto(campoEmisor, 2, true, "Escribe quien envia el mensaje (minimo 2 letras).");
  var mensajeValido = validarCampoDeTexto(campoMensaje, 3, false, "Escribe un mensaje un poco mas largo (minimo 3 caracteres).");
  var receptorValido = validarCampoDeTexto(campoReceptor, 2, true, "Escribe quien recibe el mensaje (minimo 2 letras).");
  var retroalimentacionValida = validarCampoDeTexto(campoRetroalimentacion, 3, false, "Cuentanos brevemente como respondera el receptor.");
  
  return emisorValido && mensajeValido && receptorValido && retroalimentacionValida;
}

// Mientras el usuario va corrigiendo, revalidamos en vivo
var camposDelSimulador = [campoEmisor, campoMensaje, campoReceptor, campoRetroalimentacion];
for (var i = 0; i < camposDelSimulador.length; i++) {
  if (camposDelSimulador[i]) {
    camposDelSimulador[i].addEventListener("input", function () {
      if (this.classList.contains("invalido")) {
        validarFormularioSimulador();
      }
    });
  }
}

if (formularioSimulador) {
  formularioSimulador.addEventListener("submit", function (evento) {
    evento.preventDefault(); // evitamos que la pagina se recargue

    if (!validarFormularioSimulador()) {
      return; // si algo esta mal, no seguimos
    }

    var emisor = campoEmisor.value.trim();
    var mensaje = campoMensaje.value.trim();
    var codigo = campoCodigo.value;
    var canal = campoCanal.value;
    var contexto = campoContexto.value;
    var ruido = Number(campoRuido.value);
    var receptor = campoReceptor.value.trim();
    var retroalimentacion = campoRetroalimentacion.value.trim();

    var infoRuido = describirRuido(ruido);

    // Si no encontramos el texto en el diccionario, usamos el valor tal cual
    var textoCanal = textosCanal[canal];
    if (!textoCanal) {
      textoCanal = canal;
    }
    var textoCodigo = textosCodigo[codigo];
    if (!textoCodigo) {
      textoCodigo = codigo;
    }
    var textoContexto = textosContexto[contexto];
    if (!textoContexto) {
      textoContexto = contexto;
    }

    // Armamos el mensaje final concatenando texto (con el operador +)
    var textoResultado =
      "<strong>" + emisor + "</strong> envia el mensaje \"<em>" + mensaje + "</em>\" usando " +
      textoCodigo + ", a traves de " + textoCanal + ", durante " + textoContexto + ". " +
      "Con un ruido " + infoRuido.estado + " (" + ruido + "%), " + infoRuido.efecto + " " +
      "Finalmente, <strong>" + receptor + "</strong> recibe la senal y responde: \"<em>" +
      retroalimentacion + "</em>\".";

    if (resultadoSimulador) {
      resultadoSimulador.innerHTML = textoResultado;
      // reiniciamos la animacion quitando y poniendo la clase
      resultadoSimulador.classList.remove("resultado-animado");
      void resultadoSimulador.offsetWidth;
      resultadoSimulador.classList.add("resultado-animado");
    }
  });

  formularioSimulador.addEventListener("reset", function () {
    for (var i = 0; i < camposDelSimulador.length; i++) {
      if (camposDelSimulador[i]) {
        quitarError(camposDelSimulador[i]);
      }
    }
    if (resultadoSimulador) {
      resultadoSimulador.innerHTML = "";
    }
  });
}


// -----------------------------------------------------
// 8) QUIZ: IDENTIFICA EL ELEMENTO
// -----------------------------------------------------

var formularioQuiz = document.getElementById("formulario-quiz");
var botonIniciarQuiz = document.getElementById("iniciar-quiz");
var cuerpoQuiz = document.getElementById("cuerpoQuiz");

// La respuesta correcta de cada pregunta
var respuestasCorrectas = {
  q1: "ruido",
  q2: "codigo",
  q3: "retroalimentacion",
  q4: "canal",
  q5: "contexto",
  q6: "mensaje"
};

if (botonIniciarQuiz) {
  botonIniciarQuiz.addEventListener("click", function () {
    var pasosCuenta = [
      { texto: "3", icono: "fa-solid fa-rocket" },
      { texto: "2", icono: "fa-solid fa-rocket" },
      { texto: "1", icono: "fa-solid fa-rocket" },
      { texto: "Empieza!", icono: "fa-solid fa-flag-checkered" }
    ];
    var pasoActual = 0;

    cajaModal.classList.remove("ventana-exito", "ventana-advertencia");
    tituloModal.textContent = "Listo para el reto?";
    iconoModal.innerHTML = '<i class="' + pasosCuenta[pasoActual].icono + '"></i>';
    cuerpoModal.innerHTML = '<span class="numero-cuenta">' + pasosCuenta[pasoActual].texto + "</span>";
    botonAccionModal.style.display = "none";
    botonCerrarModal.style.display = "none";
    fondoModal.classList.add("abierta");
    document.body.style.overflow = "hidden";

    temporizadorCuentaRegresiva = setInterval(function () {
      pasoActual = pasoActual + 1;

      if (pasoActual < pasosCuenta.length) {
        iconoModal.innerHTML = '<i class="' + pasosCuenta[pasoActual].icono + '"></i>';
        cuerpoModal.innerHTML = '<span class="numero-cuenta">' + pasosCuenta[pasoActual].texto + "</span>";
      } else {
        clearInterval(temporizadorCuentaRegresiva);
        temporizadorCuentaRegresiva = null;
        cerrarVentana();

        if (cuerpoQuiz) {
          cuerpoQuiz.classList.remove("oculto");
        }
        botonIniciarQuiz.style.display = "none";
      }
    }, 700);
  });
}

// Revisa que las 6 preguntas tengan una opcion seleccionada
function validarQuizCompleto() {
  var todoValido = true;
  var nombresPreguntas = Object.keys(respuestasCorrectas);

  for (var i = 0; i < nombresPreguntas.length; i++) {
    var pregunta = nombresPreguntas[i];
    var grupoOpciones = document.querySelector('.opciones-quiz[data-pregunta="' + pregunta + '"]');
    var elementoError = document.getElementById(pregunta + "-error");
    var opcionMarcada = document.querySelector('input[name="' + pregunta + '"]:checked');

    if (!opcionMarcada) {
      if (grupoOpciones) {
        grupoOpciones.classList.add("invalido");
      }
      if (elementoError) {
        elementoError.innerHTML = '<i class="fa-solid fa-circle-exclamation"></i>Selecciona una opcion.';
      }
      todoValido = false;
    } else {
      if (grupoOpciones) {
        grupoOpciones.classList.remove("invalido");
      }
      if (elementoError) {
        elementoError.innerHTML = "";
      }
    }
  }

  return todoValido;
}

if (formularioQuiz) {
  formularioQuiz.addEventListener("submit", function (evento) {
    evento.preventDefault();

    if (!validarQuizCompleto()) {
      return;
    }

    var nombresPreguntas = Object.keys(respuestasCorrectas);
    var aciertos = 0;
    var totalPreguntas = nombresPreguntas.length;

    for (var i = 0; i < nombresPreguntas.length; i++) {
      var pregunta = nombresPreguntas[i];
      var respuestaCorrecta = respuestasCorrectas[pregunta];

      var grupoOpciones = document.querySelector('.opciones-quiz[data-pregunta="' + pregunta + '"]');
      var elementoError = document.getElementById(pregunta + "-error");
      var opcionMarcada = document.querySelector('input[name="' + pregunta + '"]:checked');
      var valorMarcado = opcionMarcada.value;

      var esCorrecta = (valorMarcado === respuestaCorrecta);

      if (grupoOpciones) {
        grupoOpciones.classList.remove("correcta", "incorrecta");
        if (esCorrecta) {
          grupoOpciones.classList.add("correcta");
        } else {
          grupoOpciones.classList.add("incorrecta");
        }
      }

      if (elementoError) {
        if (esCorrecta) {
          elementoError.className = "error-campo acierto";
          elementoError.innerHTML = '<i class="fa-solid fa-circle-check"></i> Correcto!';
        } else {
          elementoError.className = "error-campo fallo";
          elementoError.innerHTML = '<i class="fa-solid fa-circle-xmark"></i> Esa no era. Revisa "' + respuestaCorrecta + '" en las cartas.';
        }
      }

      if (esCorrecta) {
        aciertos = aciertos + 1;
      }
    }

    // Elegimos el mensaje final segun cuantas preguntas acerto
    var tipoVentana = "";
    var iconoVentana = "";
    var tituloVentana = "";
    var cuerpoVentana = "";

    if (aciertos === totalPreguntas) {
      tipoVentana = "exito";
      iconoVentana = "fa-solid fa-star";
      tituloVentana = "Perfecto!";
      cuerpoVentana = "Acertaste <strong>" + aciertos + " de " + totalPreguntas + "</strong>. Dominas los elementos de la comunicacion. :)";
    } else if (aciertos >= totalPreguntas / 2) {
      tipoVentana = "advertencia";
      iconoVentana = "fa-solid fa-face-smile";
      tituloVentana = "Bien hecho!";
      cuerpoVentana = "Acertaste <strong>" + aciertos + " de " + totalPreguntas + "</strong>. Mira en rojo cuales preguntas repasar.";
    } else {
      tipoVentana = "normal";
      iconoVentana = "fa-solid fa-rotate";
      tituloVentana = "Sigue practicando";
      cuerpoVentana = "Acertaste <strong>" + aciertos + " de " + totalPreguntas + "</strong>. Mira en rojo cuales preguntas repasar, y revisa las cartas de \"Elementos\".";
    }

    abrirVentana(tipoVentana, iconoVentana, tituloVentana, cuerpoVentana, "Ver resultados", null);

    // Agregamos (una sola vez) el boton para volver a intentar
    var botonReintentar = document.getElementById("botonReintentar");
    if (!botonReintentar) {
      botonReintentar = document.createElement("button");
      botonReintentar.id = "botonReintentar";
      botonReintentar.className = "boton-principal accion-modal";
      botonReintentar.style.marginTop = "10px";
      botonReintentar.style.background = "var(--tinta)";
      botonReintentar.textContent = "Volver a intentar";

      botonReintentar.addEventListener("click", function () {
        cerrarVentana();
        formularioQuiz.reset();

        var todosLosGrupos = document.querySelectorAll(".opciones-quiz");
        for (var g = 0; g < todosLosGrupos.length; g++) {
          todosLosGrupos[g].classList.remove("correcta", "incorrecta");
        }

        var todosLosErrores = document.querySelectorAll(".error-campo");
        for (var e = 0; e < todosLosErrores.length; e++) {
          todosLosErrores[e].innerHTML = "";
          todosLosErrores[e].className = "error-campo";
        }
      });

      cajaModal.appendChild(botonReintentar);
    }
    botonReintentar.style.display = "";
  });

  formularioQuiz.addEventListener("reset", function () {
    cuerpoQuiz.classList.add("oculto");
    botonIniciarQuiz.style.display = "";

    var todosLosGrupos = document.querySelectorAll(".opciones-quiz");
    for (var g = 0; g < todosLosGrupos.length; g++) {
      todosLosGrupos[g].classList.remove("correcta", "incorrecta");
    }

    var todosLosErrores = document.querySelectorAll(".error-campo");
    for (var e = 0; e < todosLosErrores.length; e++) {
      todosLosErrores[e].innerHTML = "";
      todosLosErrores[e].className = "error-campo";
    }
  });
}

// Cuando el usuario cambia de opcion en una pregunta, quitamos las marcas
var opcionesDeRadio = document.querySelectorAll('.opciones-quiz input[type="radio"]');
for (var i = 0; i < opcionesDeRadio.length; i++) {
  opcionesDeRadio[i].addEventListener("change", function () {
    var grupo = this.closest(".opciones-quiz");
    if (grupo) {
      grupo.classList.remove("correcta", "incorrecta", "invalido");

      var nombrePregunta = grupo.getAttribute("data-pregunta");
      var elementoError = document.getElementById(nombrePregunta + "-error");
      if (elementoError) {
        elementoError.innerHTML = "";
        elementoError.className = "error-campo";
      }
    }
  });
}


// -----------------------------------------------------
// 9) ANIMACIONES AL HACER SCROLL (mostrar elementos poco a poco)
// -----------------------------------------------------

function activarAnimacionesDeScroll() {
  var selectoresParaRevelar = [
    "#definicion .columna-texto",
    "#definicion .columna-cita",
    "#tipos .grilla-cartas",
    "#fuentes .columna-video",
    "#fuentes .columna-libro"
  ];

  for (var i = 0; i < selectoresParaRevelar.length; i++) {
    var elementos = document.querySelectorAll(selectoresParaRevelar[i]);
    for (var j = 0; j < elementos.length; j++) {
      elementos[j].classList.add("revelar");
    }
  }

  var selectoresEscalonados = [
    ".grilla-cartas",
    ".fila-datos",
    ".grilla-actividad",
    ".pie-interior",
    ".cita-etiquetas"
  ];

  for (var i = 0; i < selectoresEscalonados.length; i++) {
    var elementos2 = document.querySelectorAll(selectoresEscalonados[i]);
    for (var j = 0; j < elementos2.length; j++) {
      elementos2[j].classList.add("revelar-escalonado");
    }
  }

  var todosLosAnimados = document.querySelectorAll(".revelar, .revelar-escalonado");

  function revisarSiEstanVisibles() {
    for (var i = 0; i < todosLosAnimados.length; i++) {
      var elemento = todosLosAnimados[i];
      if (elemento.classList.contains("visible")) {
        continue; // si ya esta visible, no hacemos nada
      }

      var rect = elemento.getBoundingClientRect();
      var estaEnPantalla = rect.top < window.innerHeight - 60 && rect.bottom > 0;

      if (estaEnPantalla) {
        elemento.classList.add("visible");
      }
    }
  }

  window.addEventListener("scroll", revisarSiEstanVisibles);
  revisarSiEstanVisibles(); // revisamos una vez al cargar la pagina
}


// -----------------------------------------------------
// 10) CUANDO LA PAGINA TERMINA DE CARGAR
// -----------------------------------------------------

document.addEventListener("DOMContentLoaded", function () {
  dibujarCartasElementos();
  activarAnimacionesDeScroll();
});