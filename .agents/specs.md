# Especificaciones del Proyecto - Ciudad 3D

## Resumen
Ciudad 3D interactiva conectada al chat de Twitch, creada con ThreeJS, Vite y módulos ESM vanilla. Los usuarios del chat aparecen como personajes que caminan por la ciudad. Incluye música procedural, modo jugador, cámara GoPro y globo de texto con speech synthesis.

## Stack
- **ThreeJS**: Motor 3D (r185)
- **Vite**: Bundler de desarrollo (v8)
- **mtmi**: Conexión al chat de Twitch (IRC, solo lectura)
- **ESM**: Módulos nativos del navegador

## Estructura de Ficheros
```
src/
  main.js
  people/
    person.js       createPerson, accesorios, labels
    angel.js        createAngel, updateAngels
    people.js       init, updatePeople, respawn, globo de texto, speech
    pig.js          DHardySD (cerdito)
  city/
    buildings.js    edificios con tejados, ventanas, señora con rulos
    roads.js        carreteras con aceras texturizadas
    cars.js         25 coches con faros y movimiento
    trafficLights.js semáforos con point lights
  camera/
    camera.js       cámara, controles, GoPro, modo jugador
  effects/
    daynight.js     ciclo día/noche
    textures.js     texturas procedurales (césped, acera, cielo)
    music.js        música 8-bit procedural (WebAudio)
```

## Funcionalidades

### Interacción
- **OrbitControls**: Rotación con arrastrar, zoom con scroll
- **Tecla ESPACIO**: Transición suave (lerp) a posición de cámara aleatoria
- **Tecla D**: Modo GoPro del cerdito (HUD con REC, PIG CAM MODE, reloj)
- **Tecla P**: Modo jugador del cerdito (flechas para mover, cámara 3ra persona)
- **Tecla B**: Activar/desactivar música
- **Tecla M**: Mute del speech synthesis

### Ciudad
- **Edificios**: Con tejados a dos aguas y ventanas que se encienden/apagan (5s)
- **Señora con rulos**: Aparece en 2% de ventanas iluminadas
- **Carreteras**: Grid con aceras texturizadas y marcas de carril
- **Coches**: 25 coches con cabinas, rines, faros y luces traseras
- **Semáforos**: Con ciclo rojo-amarillo-verde, esferas iluminadas y point lights

### Personajes (Twitch)
- **Personas**: Cada usuario que entra al chat o comenta aparece caminando
- **Modelo**: Cuerpo, cabeza, brazos animados, piernas animadas, pies
- **10 accesorios**: afro, pelo largo, mohawk, gorra, sombrero de copa, beanie, gafas de sol, gafas de vista, loro, ninguno
- **Colores**: Paletas variadas de camisas, pantalones, pelo y piel
- **Avatar**: Cargado desde Twitch (API ivr con caché)
- **Nick**: Sprite con avatar y nombre encima del personaje
- **Velocidades**: Aleatoria por personaje (0.2 - 1.0)
- **Globo de texto**: Aparece al hablar, se borra en 5-15s según longitud
- **Speech synthesis**: Mensajes leídos en voz alta (Web Speech API, español)

### DHardySD (Cerdito)
- Personaje permanente en la ciudad
- Modelo: cuerpo, cabeza, hocico, fosas nasales, ojos, orejas, 4 patas, cola rizada
- Camina por la ciudad independientemente del chat
- Modo GoPro: HUD con indicadores de grabación
- Modo jugador: Control total con flechas, cámara en 3ra persona

### Sistema de Colisiones
- Coche atropella persona → persona cae → ángel asciende → reaparece en 5s
- Ángel: Versión blanca con alas y aureola dorada, asciende 3s con fade

### Texturas Procedurales
- **Césped**: Hierba oscura con briznas generadas por canvas
- **Acera**: Baldosas con juntas y textura de piedra
- **Cielo**: Degradado azul con nubes (EquirectangularReflectionMapping)

### Música (WebAudio)
- BPM 78, estilo 8-bit/chiptune
- 4 secciones dinámicas: intro → build → main → break
- Canales: kick, snare, hi-hat, bass (triangle), pad (sawtooth), melody (sine), arp (square)
- Progresiones de acordes distintas por sección
- Swing sutil y compresor dinámico

### Ciclo Día/Noche
- Transición lenta de niebla y luces
- Cambio de color del sol (amanecer/atardercer)

### Iluminación
- Direccional principal + fill light + back light
- HemisphereLight
- AmbientLight
- Point lights en semáforos
- Tone mapping ACES Filmic
- Sombras 4096x4096 con PCFSoft

### Parámetros URL
- `?channel=nombre` para conectar a cualquier canal (default: manzdev)
