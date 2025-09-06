# GPS Tracker Mobile App

Una aplicación móvil para el seguimiento GPS en tiempo real desarrollada con React Native y Expo.

## Características

- ✅ **Seguimiento GPS en tiempo real**: Captura coordenadas, precisión, velocidad y tiempo
- ✅ **Interfaz de usuario intuitiva**: Diseño moderno basado en los mockups proporcionados
- ✅ **Modal de identificación**: Permite ingresar el nombre del usuario antes del rastreo
- ✅ **Navegación por pestañas**: Tres pantallas principales (Inicio, Mapa, Autor)
- ✅ **Información del desarrollador**: Pantalla con datos académicos completos

## Estructura de la App

### Pantallas Principales

1. **Inicio (index.tsx)**
   - Vista principal con mapa interactivo
   - Estado de rastreo (Detenido/Rastreando)
   - Botón para iniciar/detener seguimiento
   - Información de ubicación actual en tiempo real

2. **Mapa (map.tsx)**
   - Vista del mapa interactivo
   - Coordinadas de ubicación
   - Botones de navegación y ubicación

3. **Autor (author.tsx)**
   - Información del desarrollador
   - Datos del curso y profesor
   - Características de la aplicación

## Funcionalidades Implementadas

### Rastreo GPS
- Solicitud de permisos de ubicación
- Obtención de coordenadas precisas
- Cálculo de velocidad y precisión
- Actualización automática cada 5 segundos
- Registro de tiempo de inicio y última actualización

### Interfaz de Usuario
- Header personalizado con título y iconos
- Tab bar inferior con 3 pestañas
- Modal para captura de nombre de usuario
- Diseño responsive y profesional
- Iconos Material Icons para consistencia visual

### Estados de la Aplicación
- **Estado Inicial**: Mapa estático con información básica
- **Estado Rastreando**: Información dinámica con datos GPS en tiempo real
- **Modal de Inicio**: Captura de nombre y confirmación de rastreo

## Información Académica

- **Estudiante**: Ciro Gabriel Callapiña Castilla
- **Número**: 5
- **Profesor**: Jose Mauro Pillco Quispe
- **Curso**: Sistemas Embebidos
- **Versión**: 1.0.0

## Instalación y Ejecución

1. Instalar dependencias:
```bash
npm install
```

2. Ejecutar en modo desarrollo:
```bash
npx expo start
```

3. Escanear el código QR con Expo Go (iOS/Android)

## Dependencias Principales

- React Native
- Expo SDK
- Expo Location (para GPS)
- Expo Router (navegación)
- Material Icons (iconografía)

## Permisos Requeridos

- `ACCESS_FINE_LOCATION`: Para obtener ubicación GPS precisa
- `ACCESS_COARSE_LOCATION`: Para ubicación aproximada como respaldo

## Notas de Desarrollo

La aplicación está diseñada para coincidir exactamente con los mockups proporcionados, incluyendo:
- Colores y tipografía específicos
- Disposición exacta de elementos
- Iconografía consistente
- Estados visuales precisos

La implementación está preparada para futuras integraciones con bases de datos y aplicaciones de terceros para visualización de datos en tiempo real.
