# mtmi - Conexión a Twitch

## Uso en el proyecto
Librería para conectar al chat de Twitch vía IRC (solo lectura).

## Conexión
```js
import { client } from 'mtmi';

client.connect({
  channels: [CHANNEL],
  avatarProvider: 'ivr'
});
```

## Eventos utilizados
- **`connected`**: Confirmación de conexión al IRC
- **`join`**: Usuario entra al canal → `({ username, channel })`
- **`message`**: Usuario envía mensaje → `({ username, channel, userInfo, message })`

## Datos de usuario
- `userInfo.avatar`: Promise que resuelve con la URL del avatar (API ivr con caché)
- `userInfo.displayName`: Nombre para mostrar
- `message`: Texto del mensaje enviado

## Canal
- Se configura con `?channel=nombre` en la URL
- Default: `manzdev`
- Se acepta con o sin `#`

## Limitaciones conocidas
- JOIN solo funciona en canales con <1000 viewers (limitación Twitch IRC)
- messages funciona siempre
- `getAvatar` NO está exportado, se usa `userInfo.avatar` en su lugar
