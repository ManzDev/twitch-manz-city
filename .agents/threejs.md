# ThreeJS - Uso en el proyecto

## Configuración base
```js
import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
```

## Renderer
- WebGLRenderer con antialiasing
- Tone mapping: `ACESFilmicToneMapping`
- Shadow map: `PCFSoftShadowMap` 4096x4096
- Pixel ratio limitado a 2

## Cámara
- PerspectiveCamera(50°)
- OrbitControls con damping
- Lerp para transiciones suaves

## Sombras
- DireccionalLight con `castShadow = true`
- `shadow.bias = -0.0003`
- `shadow.normalBias = 0.02`
- Receivers: suelo, aceras, edificios

## Texturas procedurales (CanvasTexture)
- Césped: Hierba con briznas (512x512, repeat 20x20)
- Acera: Baldosas con juntas (256x256, repeat 4x4)
- Cielo: Degradado con nubes (1024x512, EquirectangularReflectionMapping)

## Sprites
- Labels de usuario: CanvasTexture → SpriteMaterial → Sprite
- Se añaden como hijos del grupo del personaje (siguen el movimiento)
- Globo de texto: Canvas con roundRect y puntero

## Modelos proceduralMeshes
- **Personas**: BoxGeometry (torso, brazos, piernas, pies), SphereGeometry (cabeza)
- **Cerdito**: BoxGeometry (cuerpo, cabeza, patas), CylinderGeometry (hocico), TorusGeometry (cola)
- **Coches**: BoxGeometry (cuerpo, cabina, rines), SphereGeometry (faros)
- **Edificios**: BoxGeometry + ExtrudeGeometry (tejado)
- **Semáforos**: CylinderGeometry (poste), SphereGeometry (luces)
- **Ángeles**: BoxGeometry, SphereGeometry, PlaneGeometry (alas), TorusGeometry (aureola)

## Luces
- **DirectionalLight**: Principal (2.0) + Fill (0.4) + Back (0.3)
- **HemisphereLight**: Cielo/suelo (0.6)
- **AmbientLight**: Base (0.3)
- **PointLights**: En semáforos (intensity 0-2)

## Texturas
- `texture.wrapS/T = RepeatWrapping`
- `texture.repeat.set(x, y)` para patrones
- `MeshStandardMaterial` con roughness, metalness, emissive

## Convolver (Reverb)
- Buffer de ruido con decaimiento exponencial (2s)
- Conectado vía GainNode para mezcla

## Materiales
- `MeshStandardMaterial`: Para la mayoría de objetos
- `SpriteMaterial`: Para labels y globo de texto (transparent: true)
- Colores hex: `0xRRGGBB`
- `emissiveIntensity` para ventanas y semáforos

## Clock
- `THREE.Clock` para delta time
- `getDelta()` y `getElapsedTime()` en cada frame

## Organización de escena
- Grupo por personaje (Group → meshes hijos)
- Posiciones en Vector3
- `scene.add()` para añadir objetos
- `mesh.parent.remove()` para eliminar
