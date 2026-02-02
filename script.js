let jugadores = [];
let jugadorActual = 0;
let rolVisible = false;

/* ============================
   SONIDO GLOBAL
   ============================ */

let sonidoActivo = localStorage.getItem("sonido") !== "off";

document.addEventListener("DOMContentLoaded", () => {
    const btn = document.getElementById("btnSonido");
    if (btn) btn.innerText = sonidoActivo ? "🔊" : "🔇";
});

function toggleSonido() {
    sonidoActivo = !sonidoActivo;
    localStorage.setItem("sonido", sonidoActivo ? "on" : "off");

    const btn = document.getElementById("btnSonido");
    if (btn) btn.innerText = sonidoActivo ? "🔊" : "🔇";

    const sonido = document.getElementById("sonidoRol");

    if (!sonidoActivo) {
        sonido.pause();
        sonido.currentTime = 0;
    }
}

/* ============================
   PALABRAS Y PISTAS
   ============================ */

const palabrasRonda = [
    "Eren","Kamehameha","Doraemon","Charizar","Kakashi","Namek",
    "Retumbar","Digievolución","Megumi","Pochita","Dorayaki","Draken",
    "Naruto","Death Note","Bachira","Tokito","Turbo vieja","Ghoul",
    "Zoro","Akaza","Potara","Senku","Oliver/Tsubasa","Shoto Todoroki",
    "Pokeball","Black Clover","Boticaria","Aizawa","Ryuk","Erwin",
    "Aldea de la hoja","Team Rocket","Caballeros del zodiaco","Nana",
    "Kisaki","Zeno","Mewtwo","Fruta del diablo","Titán fundador","Sukuna",

    "Sharingan","Arise","Ichigo","Marley","Muzan","Dominio",
    "Alphonse Elric","Anya Forger","Blue Box","Gotenks",
    "Inuyasha","Nen","Sailor Moon"
];

const pistasRonda = [
    "mar","energía","azul","dragón","ojo","verde",
    "golpear","mejora","sombras","cortar","dulce","delincuente",
    "bestia","intelecto","regate","nube","vehículo antiguo","monstruo",
    "espadas","luna","objeto","crear","partido","dual",
    "objeto","magia","ungüento","profesor","divino","liderazgo",
    "lugar","villanos","armadura","mujeres",
    "celos","Dragon Ball","creación","comida","enorme","poderoso",

    "Copiar","Habilidad","Híbrido","Guerra","Inmortalidad",
    "Espacio cerrado","Armadura","Niña","Deporte","Dos",
    "Orejas","Energía vital","Guerrera"
];

/* ============================
   ANIMACIÓN DE TRANSICIÓN
   ============================ */

function animacionTransicion(callback) {
    const capa = document.getElementById("transicion");

    capa.classList.add("activa");

    setTimeout(() => {
        capa.classList.add("fadeout");

        setTimeout(() => {
            capa.classList.remove("activa", "fadeout");
            callback();
        }, 400);

    }, 400);
}

/* ============================
   LÓGICA DEL JUEGO
   ============================ */

function iniciarJuego() {
    const numJugadores = parseInt(document.getElementById("numJugadores").value);
    const numImpostores = parseInt(document.getElementById("numImpostores").value);

    if (!numJugadores || numImpostores >= numJugadores) return;

    let indice = Math.floor(Math.random() * palabrasRonda.length);
    let palabraNormal = palabrasRonda[indice];
    let pistaImpostor = pistasRonda[indice];

    jugadores = Array(numJugadores).fill(palabraNormal);

    let asignados = 0;
    while (asignados < numImpostores) {
        const i = Math.floor(Math.random() * numJugadores);
        if (jugadores[i] === palabraNormal) {
            jugadores[i] = `Impostor (pista: ${pistaImpostor})`;
            asignados++;
        }
    }

    jugadorActual = 0;
    rolVisible = false;

    document.getElementById("inicio").classList.add("oculto");
    document.getElementById("juego").classList.remove("oculto");
    document.getElementById("final").classList.add("oculto");

    prepararJugador();
}

function prepararJugador() {
    document.getElementById("jugadorTexto").innerText =
        `Jugador ${jugadorActual + 1}`;

    document.getElementById("rolTexto").innerText = "Toca para ver tu rol";
    document.getElementById("btnSiguiente").classList.add("oculto");
    rolVisible = false;
}

function mostrarRol() {
    const rolTexto = document.getElementById("rolTexto");
    const sonido = document.getElementById("sonidoRol");
    const rolReal = jugadores[jugadorActual];

    if (!rolVisible) {

        if (rolReal.startsWith("Impostor")) {
            rolTexto.innerHTML = `<span style="color:red; font-weight:bold;">${rolReal}</span>`;
        } else {
            rolTexto.innerHTML = rolReal;
        }

        if (sonidoActivo) {
            sonido.currentTime = 0;
            sonido.play();
        }

        rolVisible = true;

    } else {
        rolTexto.innerText = "Pasa el móvil al siguiente jugador";
        document.getElementById("btnSiguiente").classList.remove("oculto");
    }
}

function siguienteJugador() {
    jugadorActual++;

    if (jugadorActual < jugadores.length) {
        prepararJugador();
    } else {
        mostrarFinal();
    }
}

function mostrarFinal() {
    // Reiniciar contenido visual del final
    document.getElementById("final").innerHTML = `
        <h2>Resultados</h2>
        <p id="jugadorInicio" style="font-size:24px; font-weight:bold; color:#0f0;"></p>
        <ul id="listaJugadores"></ul>
    `;

    document.getElementById("juego").classList.add("oculto");
    document.getElementById("final").classList.remove("oculto");

    // Elegir jugador que empieza la ronda
    const jugadorQueEmpieza = Math.floor(Math.random() * jugadores.length) + 1;
    document.getElementById("jugadorInicio").innerText =
        `Empieza el jugador ${jugadorQueEmpieza}`;
document.getElementById("jugadorInicio").classList.add("anuncio-jugador");

    const lista = document.getElementById("listaJugadores");

    jugadores.forEach((rol, index) => {
        const li = document.createElement("li");

        li.innerText = `Jugador ${index + 1}`;

        li.onclick = () => {
            const esImpostor = rol.startsWith("Impostor");

            if (esImpostor && navigator.vibrate) {
                navigator.vibrate(200);
            }

            li.innerHTML = `Jugador ${index + 1} → 
                <span style="color:${esImpostor ? "red" : "green"}; font-weight:bold;">
                    ${esImpostor ? "Impostor" : "Buena gente"}
                </span>`;
        };

        lista.appendChild(li);
    });

    let btnNuevaRonda = document.createElement("button");
    btnNuevaRonda.style.marginTop = "20px";
    btnNuevaRonda.innerText = "Nueva ronda aleatoria";
    btnNuevaRonda.onclick = () => {
        animacionTransicion(() => iniciarJuego());
    };

    let btnCambiar = document.createElement("button");
    btnCambiar.style.marginTop = "20px";
    btnCambiar.innerText = "Cambiar jugadores";
    btnCambiar.onclick = () => {
        document.getElementById("final").classList.add("oculto");
        document.getElementById("inicio").classList.remove("oculto");
    };

    document.getElementById("final").appendChild(btnNuevaRonda);
    document.getElementById("final").appendChild(btnCambiar);
}
