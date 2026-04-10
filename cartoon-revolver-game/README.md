# Lucky Drum Revue

Lucky Drum Revue es un minijuego web original inspirado en la energia de los cartoons de los anios 30: blanco y negro, deformaciones rubber hose, grano de pelicula, humo, flashes y una maquina de azar caricaturesca que convierte una mecanica de ruleta rusa en un duelo teatral sin gore ni realismo explicito.

## Caracteristicas

- HTML5 Canvas con interfaz vintage dibujada a mano.
- Juego por turnos entre jugador y una IA basica.
- Sistema de rondas, vidas, puntuacion y mejor marca.
- Animaciones frame-by-frame por codigo para ambos personajes.
- Particulas, pantalla temblando, flash blanco y grano de pelicula.
- Sonido sintetico con Web Audio API: base jazz retro y efectos cartoon.
- Estructura modular para ampliar el juego facilmente.

## Estructura

```text
cartoon-revolver-game/
|-- index.html
|-- styles.css
|-- style.css
|-- script.js
|-- README.md
`-- js/
    |-- main.js
    |-- game.js
    |-- player.js
    |-- ai.js
    |-- renderer.js
    `-- sound.js
```

## Controles

- `Espacio`: tirar del gatillo
- `R`: re-girar el tambor
- `Esc`: volver al menu
- Mouse: todos los botones de interfaz son clicables

## Como ejecutar

Como el proyecto usa modulos ES, lo recomendable es servirlo con un servidor local sencillo.

### Opcion 1: Python

1. Abre una terminal en `cartoon-revolver-game`
2. Ejecuta:

```bash
python -m http.server 8000
```

3. Abre `http://localhost:8000`

### Opcion 2: VS Code / Cursor Live Server

1. Abre la carpeta `cartoon-revolver-game`
2. Lanza un servidor estatico como Live Server
3. Abre el juego en el navegador

## Notas

- El audio del navegador se activa tras la primera interaccion del usuario.
- El boton `Salir` intenta cerrar la pestana, pero algunos navegadores no lo permiten por seguridad.
- Todo el arte visual y el audio se generan por codigo; no se usan assets externos protegidos.
