/* ==========================================
   VARIABLES DEL JUEGO
========================================== */

let puntos = 0;

let atrapados = 0;

let vidas = 3;

let tiempo = 60;

let juegoActivo = false;

let fantasmaActivo = false;

let bloqueado = false;

let intervaloTiempo = null;

let temporizadorFantasma = null;


/* Tiempo que tiene el jugador
   para atrapar cada fantasma */

let tiempoFantasma = 3000;


/* ==========================================
   CARGAR PÁGINA
========================================== */

document.addEventListener(
    "DOMContentLoaded",

    function () {

        const fantasma =
            document.getElementById(
                "fantasma"
            );


        fantasma.addEventListener(
            "click",

            atraparFantasma
        );


        document.getElementById(
            "botonJugar"
        ).addEventListener(
            "click",

            iniciarJuego
        );


        document.getElementById(
            "botonReiniciar"
        ).addEventListener(
            "click",

            iniciarJuego
        );

    }
);


/* ==========================================
   INICIAR PARTIDA
========================================== */

function iniciarJuego() {

    puntos = 0;

    atrapados = 0;

    vidas = 3;

    tiempo = 60;

    tiempoFantasma = 3000;

    juegoActivo = true;

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


    /* Aparece el primer fantasma */

    aparecerFantasma();


    /* Iniciamos cronómetro */

    intervaloTiempo =
        setInterval(

            function () {

                tiempo--;


                actualizarInterfaz();


                /* Aumentar dificultad */

                if (
                    tiempo === 45
                ) {

                    tiempoFantasma =
                        2500;

                    mostrarMensaje(
                        "¡Los fantasmas son más rápidos!"
                    );
                }


                if (
                    tiempo === 30
                ) {

                    tiempoFantasma =
                        2000;

                    mostrarMensaje(
                        "¡Dificultad aumentada!"
                    );
                }


                if (
                    tiempo === 15
                ) {

                    tiempoFantasma =
                        1500;

                    mostrarMensaje(
                        "¡Últimos segundos!"
                    );
                }


                if (
                    tiempo <= 0
                ) {

                    terminarJuego();

                }

            },

            1000

        );

}


/* ==========================================
   APARECER FANTASMA
========================================== */

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


    fantasma.setAttribute(
        "scale",
        "0.05 0.05 0.05"
    );


    fantasma.removeAttribute(
        "animation__desaparecer"
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


    /* Si no lo atrapa a tiempo */

    temporizadorFantasma =
        setTimeout(

            function () {

                fantasmaEscapado();

            },

            tiempoFantasma

        );

}


/* ==========================================
   ATRAPAR
========================================== */

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


    mostrarMensaje(
        "¡Atrapado! +10"
    );


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


            /* Pequeña pausa */

            setTimeout(

                function () {

                    aparecerFantasma();

                },

                250

            );

        },

        230

    );

}


/* ==========================================
   FANTASMA ESCAPADO
========================================== */

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


    mostrarMensaje(
        "¡Se escapó! -1 ❤️"
    );


    const fantasma =
        document.getElementById(
            "fantasma"
        );


    fantasma.setAttribute(
        "visible",
        "false"
    );


    /* Si no quedan vidas */

    if (
        vidas <= 0
    ) {

        terminarJuego();

        return;

    }


    setTimeout(

        function () {

            aparecerFantasma();

        },

        500

    );

}


/* ==========================================
   MOVER FANTASMA
========================================== */

function moverFantasma() {

    const fantasma =
        document.getElementById(
            "fantasma"
        );


    const x =
        numeroAleatorio(
            -1.2,
            1.2
        );


    const y =
        numeroAleatorio(
            -0.65,
            0.85
        );


    const z =
        numeroAleatorio(
            -4,
            -2.5
        );


    fantasma.setAttribute(

        "position",

        `${x} ${y} ${z}`

    );

}


/* ==========================================
   ACTUALIZAR INTERFAZ
========================================== */

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

        corazones +=
            "❤️";

    }


    document.getElementById(
        "vidas"
    ).textContent =
        corazones;

}


/* ==========================================
   MENSAJES
========================================== */

function mostrarMensaje(
    texto
) {

    document.getElementById(
        "mensaje"
    ).textContent =
        texto;

}


/* ==========================================
   TERMINAR JUEGO
========================================== */

function terminarJuego() {

    if (!juegoActivo) {
        return;
    }


    juegoActivo = false;

    fantasmaActivo = false;


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


    /* =========================
       RÉCORD
    ========================== */

    let record =
        Number(
            localStorage.getItem(
                "ghostHuntRecord"
            )
        ) || 0;


    if (
        puntos > record
    ) {

        record =
            puntos;


        localStorage.setItem(
            "ghostHuntRecord",
            record
        );

    }


    /* RESULTADOS */

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


/* ==========================================
   NÚMERO ALEATORIO
========================================== */

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