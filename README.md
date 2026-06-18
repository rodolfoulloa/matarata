# 🎮 MATARATA 3D - Juego Retro en HTML5

Un juego arcade retro desarrollado en HTML5 con gráficos 3D, música de fondo de los años 90 y efectos de sonido 8-bit. Controla un auto que debe recoger caracteres "J" y "P" que caen por la pantalla.

## 📋 Características

- **Gráficos 3D Retro**: Efecto de perspectiva pseudo-3D que simula personajes acercándose
- **Auto Controlable**: Movimiento suave con las flechas direccionales
- **Sistema de Puntuación**: Puntos variables según el tipo de carácter
- **Sistema de Combo**: Multiplicador que aumenta con cada colisión consecutiva
- **Dificultad Progresiva**: El juego se acelera conforme aumenta tu puntuación
- **Música de Fondo**: Melodía retro de 90s generada con Web Audio API
- **Efectos de Sonido**: Sonidos 8-bit para colisiones y game over
- **Interfaz Retro**: Estética arcade con líneas de escaneo y colores verde/cian
- **Responsive**: Compatible con dispositivos móviles

## 🎯 Cómo Jugar

### Controles
- **← →** - Mover el auto a izquierda/derecha
- **A/D** - Alternativa para movimiento
- **ESPACIO** - Pausar/Reanudar
- **R** - Reiniciar el juego

### Objetivo
1. Controla el auto verde en la parte inferior de la pantalla
2. Recoge los caracteres "J" y "P" que caen desde arriba
3. **J** = 10 puntos base
4. **P** = 15 puntos base
5. Mantén una racha de colisiones para multiplicar tus puntos

### Sistema de Puntuación
- Cada carácter recolectado suma puntos base
- Si recoges otro carácter dentro de 2 segundos, activas el **COMBO**
- El multiplicador aumenta con cada colisión consecutiva (máximo 10x)
- La dificultad aumenta cada 500 puntos

### Fin del Juego
El juego termina cuando un carácter llega a la zona del auto sin ser recogido.

## 🏗️ Estructura del Proyecto

```
matarata/
├── index.html      # HTML principal
├── styles.css      # Estilos retro
├── game.js         # Lógica del juego y física
├── sound.js        # Efectos de sonido y música
└── README.md       # Este archivo
```

## 🎨 Características Visuales

- **Efecto 3D Pseudo-Perspectiva**: Los enemigos se hacen más grandes conforme se acercan
- **Grid de Fondo**: Líneas de perspectiva que crean profundidad
- **Scanlines**: Efecto de líneas de escaneo vintage
- **Glow Effects**: Resplandor verde retro en la interfaz
- **Animaciones Suaves**: Transiciones y efectos visuales

## 🔊 Audio

### Música de Fondo
Melodía retro de 90 segundos que se repite continuamente, generada completamente con Web Audio API usando ondas triangulares.

### Efectos de Sonido
- **Recolectar**: Secuencia ascendente de 3 notas (E4 → G4 → C5)
- **Game Over**: Secuencia descendente de 3 notas (C5 → A4 → F4)
- **Inicio**: Secuencia ascendente al cargar (C5 → E5 → G5)

## 🚀 Cómo Usar

1. Abre `index.html` en tu navegador web
2. El juego iniciará automáticamente
3. Comienza a jugar inmediatamente

### Requisitos
- Navegador moderno con soporte para:
  - Canvas HTML5
  - Web Audio API
  - ES6 JavaScript

## 📱 Compatibilidad

- ✅ Chrome/Chromium
- ✅ Firefox
- ✅ Safari
- ✅ Edge
- ✅ Opera
- ✅ Dispositivos móviles (iOS Safari, Chrome Mobile)

## 🎓 Inspiración

Este juego fue creado basándose en "Matarata", un clásico juego de consola desarrollado en los años 2000. Ha sido actualizado a HTML5 con gráficos mejorados y una experiencia moderna.

## 🔧 Detalles Técnicos

### Física del Juego
- Movimiento del auto: 8 píxeles por frame
- Velocidad de enemigos: 3-6 píxeles por frame (según dificultad)
- Sistema de colisión: AABB (Axis-Aligned Bounding Box)

### Renderizado 3D
- Algoritmo de perspectiva lineal
- Escala dinámica basada en profundidad (Z)
- Múltiples capas visuales (grid, enemigos, auto, HUD)

### Audio
- Generación procedural usando Web Audio API
- Osciladores: Square (efectos), Triangle (música)
- No requiere archivos de audio externos

## 📊 Progresión de Dificultad

| Puntuación | Nivel | Velocidad |
|-----------|-------|-----------|
| 0-499     | 1     | Normal    |
| 500-999   | 2     | Más rápido|
| 1000+     | 3+    | Muy rápido|

## 🎪 Tips para Jugar

1. **Anticipación**: El grid de perspectiva te ayuda a predecir dónde caerán los enemigos
2. **Mantén el Combo**: Trata de no romper la racha de recolecciones para multiplicar puntos
3. **Posicionamiento**: Mantente en el centro para tener máxima reacción
4. **Pausa Estratégica**: Usa espacio para planificar tu estrategia

## 📝 Notas de Desarrollo

- Todo el código es vanilla JavaScript (sin librerías externas)
- Optimizado para rendimiento a 60 FPS
- Responsive design que se adapta a cualquier resolución
- Audio completamente generado proceduralmente

## 🎮 Versiones Futuras

- [ ] Powerups
- [ ] Diferentes tipos de enemigos
- [ ] Tablas de puntuaciones
- [ ] Modos de juego adicionales
- [ ] Gráficos mejorados con WebGL

## 📄 Licencia

Juego retro de código abierto. Siéntete libre de modificar y distribuir.

---

**¡Que disfrutes jugando MATARATA 3D! 🚗💨**

*Desarrollado con ❤️ en 2026*