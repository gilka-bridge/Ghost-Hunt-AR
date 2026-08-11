let puntos = 0;

let atrapados = 0;

let vidas = 3;

let tiempo = 60;

let juegoActivo = false;

let fantasmaActivo = false;

let bloqueado = false;

let intervaloTiempo = null;

let temporizadorFantasma = null;

let tiempoFantasma = 3000;


/* =========================================
   INICIO
========================================= */

document.addEventListener(
    "DOMContentLoaded",
    function () {

        document
            .getElementById("botonJugar")
            .addEventListener(
                "click",
                iniciarJuego
            );


        document
            .getElementById("botonReiniciar")
            .addEventListener(
                "click",
                iniciarJuego
            );


        const escena =
            document.querySelector(
                "a-scene"
            );


        escena.addEventListener(
            "loaded",
            function () {

                escena.canvas.addEventListener(
                    "pointerdown",
                    detectarFantasma
                );

            }
        );

    }
);


/* =========================================
   DETECTAR CLICK / TOUCH
========================================= */

function detectarFantasma(evento) {

    if (
        !juegoActivo ||
        !fantasmaActivo ||
        bloqueado
    ) {
        return;
    }


    const escena =
        document.querySelector(
            "a-scene"
        );


    const canvas =
        escena.canvas;


    const rect =
        canvas.getBoundingClientRect();


    const mouse =
        new THREE.Vector2();


    mouse.x =
        (
            (evento.clientX - rect.left)
            /
            rect.width
        ) * 2 - 1;


    mouse.y =
        -(
            (
                evento.clientY - rect.top
            )
            /
            rect.height
        ) * 2 + 1;


    const camara =
        document
            .getElementById("camara")
            .getObject3D("camera");


    if (!camara) {
        return;
    }


    const hitbox =
        document
            .getElementById(
                "hitboxFantasma"
            )
            .getObject3D("mesh");


    if (!hitbox) {
        return;
    }


    const raycaster =
        new THREE.Raycaster();


    raycaster.setFromCamera(
        mouse,
        camara
    );


    const impactos =
        raycaster.intersectObject(
            hitbox,
            true
        );


    if (impactos.length > 0) {

        atraparFantasma();

    }

}


/* =========================================
   INICIAR JUEGO
========================================= */

function iniciarJuego() {

    puntos = 0;

    atrapados = 0;

    vidas = 3;

    tiempo = 60;

    tiempoFantasma = 3000;

    juegoActivo = true;

    fantasmaActivo = false;

    bloqueado = false;


    clearInterval(
        intervaloTiempo
    );


    clearTimeout(
        temporizadorFantasma
    );


    document.getElementById(
        "pantallaInicio"
    ).style.display =
        "none";


    document.getElementById(
        "pantallaGameOver"
    ).style.display =
        "none";


    document.getElementById(
        "hud"
    ).style.display =
        "flex";


    document.getElementById(
        "contadorFantasmas"
    ).style.display =
        "block";


    document.getElementById(
        "mensaje"
    ).style.display =
        "block";


    actualizarInterfaz();


    aparecerFantasma();


    intervaloTiempo =
        setInterval(
            function () {

                tiempo--;


                actualizarInterfaz();


                if (tiempo === 45) {

                    tiempoFantasma =
                        2500;

                }


                if (tiempo === 30) {

                    tiempoFantasma =
                        2000;

                }


                if (tiempo === 15) {

                    tiempoFantasma =
                        1500;

                }


                if (tiempo <= 0) {

                    terminarJuego();

                }

            },
            1000
        );

}


/* =========================================
   APARECER
========================================= */

function aparecerFantasma() {

    if (!juegoActivo) {
        return;
    }


    const fantasma =
        document.getElementById(
            "fantasma"
        );


    moverFantasma();


    fantasma.setAttribute(
        "visible",
        "true"
    );


    fantasma.removeAttribute(
        "animation__desaparecer"
    );


    fantasma.removeAttribute(
        "animation__aparecer"
    );


    fantasma.setAttribute(
        "scale",
        "0.05 0.05 0.05"
    );


    fantasma.setAttribute(
        "animation__aparecer",

        `
        property: scale;
        from: 0.05 0.05 0.05;
        to: 1 1 1;
        dur: 300;
        easing: easeOutBack;
        `
    );


    fantasmaActivo = true;

    bloqueado = false;


    clearTimeout(
        temporizadorFantasma
    );


    temporizadorFantasma =
        setTimeout(
            fantasmaEscapado,
            tiempoFantasma
        );

}


/* =========================================
   ATRAPAR
========================================= */

function atraparFantasma() {

    if (
        !juegoActivo ||
        !fantasmaActivo ||
        bloqueado
    ) {
        return;
    }


    bloqueado = true;

    fantasmaActivo = false;


    clearTimeout(
        temporizadorFantasma
    );


    puntos += 10;

    atrapados++;


    actualizarInterfaz();


    document.getElementById(
        "mensaje"
    ).textContent =
        "¡Atrapado! +10";


    const fantasma =
        document.getElementById(
            "fantasma"
        );


    fantasma.removeAttribute(
        "animation__aparecer"
    );


    fantasma.setAttribute(
        "animation__desaparecer",

        `
        property: scale;
        from: 1 1 1;
        to: 0.05 0.05 0.05;
        dur: 220;
        easing: easeInBack;
        `
    );


    setTimeout(
        function () {

            if (!juegoActivo) {
                return;
            }


            fantasma.setAttribute(
                "visible",
                "false"
            );


            setTimeout(
                aparecerFantasma,
                250
            );

        },
        230
    );

}


/* =========================================
   ESCAPAR
========================================= */

function fantasmaEscapado() {

    if (
        !juegoActivo ||
        !fantasmaActivo
    ) {
        return;
    }


    fantasmaActivo = false;

    bloqueado = true;

    vidas--;


    actualizarInterfaz();


    document.getElementById(
        "mensaje"
    ).textContent =
        "¡Se escapó! -1 ❤️";


    document.getElementById(
        "fantasma"
    ).setAttribute(
        "visible",
        "false"
    );


    if (vidas <= 0) {

        terminarJuego();

        return;

    }


    setTimeout(
        aparecerFantasma,
        500
    );

}


/* =========================================
   MOVER
========================================= */

function moverFantasma() {

    const fantasma =
        document.getElementById(
            "fantasma"
        );


    const x =
        numeroAleatorio(
            -0.85,
            0.85
        );


    const y =
        numeroAleatorio(
            -0.40,
            0.60
        );


    const z =
        numeroAleatorio(
            -3.8,
            -2.5
        );


    fantasma.setAttribute(
        "position",
        `${x} ${y} ${z}`
    );

}


/* =========================================
   HUD
========================================= */

function actualizarInterfaz() {

    document.getElementById(
        "puntos"
    ).textContent =
        puntos;


    document.getElementById(
        "atrapados"
    ).textContent =
        atrapados;


    document.getElementById(
        "tiempo"
    ).textContent =
        tiempo;


    let corazones = "";


    for (
        let i = 0;
        i < vidas;
        i++
    ) {

        corazones += "❤️";

    }


    document.getElementById(
        "vidas"
    ).textContent =
        corazones;

}


/* =========================================
   FINAL
========================================= */

function terminarJuego() {

    if (!juegoActivo) {
        return;
    }


    juegoActivo = false;

    fantasmaActivo = false;

    bloqueado = true;


    clearInterval(
        intervaloTiempo
    );


    clearTimeout(
        temporizadorFantasma
    );


    document.getElementById(
        "fantasma"
    ).setAttribute(
        "visible",
        "false"
    );


    document.getElementById(
        "hud"
    ).style.display =
        "none";


    document.getElementById(
        "contadorFantasmas"
    ).style.display =
        "none";


    document.getElementById(
        "mensaje"
    ).style.display =
        "none";


    let record =
        Number(
            localStorage.getItem(
                "ghostHuntRecord"
            )
        ) || 0;


    if (puntos > record) {

        record = puntos;


        localStorage.setItem(
            "ghostHuntRecord",
            record
        );

    }


    document.getElementById(
        "puntuacionFinal"
    ).textContent =
        puntos;


    document.getElementById(
        "fantasmasFinal"
    ).textContent =
        atrapados;


    document.getElementById(
        "recordFinal"
    ).textContent =
        record;


    document.getElementById(
        "pantallaGameOver"
    ).style.display =
        "flex";

}


/* =========================================
   ALEATORIO
========================================= */

function numeroAleatorio(
    minimo,
    maximo
) {

    return (
        Math.random()
        *
        (maximo - minimo)
        +
        minimo
    );

}