# 📱 Guía Completa: Generar y Escanear Código QR

## 🎯 Objetivo
Esta guía te mostrará cómo generar tu código QR personal y usarlo para registrar tus llegadas desde cualquier dispositivo móvil.

---

## 📋 Requisitos Previos

1. ✅ Estar registrado como estudiante en el sistema
2. ✅ Tener acceso a un dispositivo con cámara (móvil, tablet, laptop)
3. ✅ Conexión a internet
4. ✅ Navegador moderno (Chrome, Safari, Firefox, Edge)

---

## 🎫 PASO 1: Generar Tu Código QR

### Opción A: Desde tu Móvil (Recomendado)

1. **Abre el navegador** en tu móvil (Chrome, Safari, etc.)

2. **Accede a la aplicación:**
   ```
   http://localhost:5173
   ```
   *(En producción, usa la URL real del servidor)*

3. **Haz clic en "Mi Código QR"** (tarjeta verde con icono 🎫)

4. **Ingresa tu cédula** y presiona "Generar Mi QR"

5. **¡Listo!** Verás tu código QR en pantalla

6. **Guarda el QR:**
   - Opción 1: Haz clic en "📤 Compartir" y envíalo a tu galería
   - Opción 2: Haz clic en "💾 Descargar QR" para guardarlo
   - Opción 3: Toma una captura de pantalla

### Opción B: Desde la Computadora

1. **Abre el navegador** en tu computadora

2. **Accede a:**
   ```
   http://localhost:5173
   ```

3. **Ve a "Estudiantes"** en el menú

4. **Busca tu nombre** en la lista

5. **Haz clic en el icono 📱** junto a tu nombre

6. **Se abrirá un modal** con tu código QR

7. **Descarga el QR:**
   - Haz clic en "💾 Descargar QR"
   - El archivo se guardará como `QR-[tu-cedula].png`

8. **Transfiere el QR a tu móvil:**
   - Envíalo por WhatsApp, email, etc.
   - O guárdalo en la nube (Google Drive, OneDrive)

---

## 📸 PASO 2: Escanear el Código QR para Registrar Llegada

### Desde Otro Dispositivo (Recomendado)

**Escenario:** Tienes el QR en tu móvil y quieres escanearlo desde una tablet o computadora en la entrada.

1. **En el dispositivo de escaneo**, abre:
   ```
   http://localhost:5173
   ```

2. **Haz clic en "Escanear QR"** (icono 📱)

3. **Presiona "🎥 Activar Cámara"**

4. **Permite el acceso a la cámara** cuando el navegador lo solicite

5. **Muestra tu QR** (desde tu móvil) frente a la cámara

6. **¡Automático!** El sistema:
   - Detectará el QR
   - Registrará tu llegada
   - Mostrará confirmación con:
     - Tu nombre
     - Hora de llegada
     - Si llegaste tarde o a tiempo

### Desde el Mismo Dispositivo

**Escenario:** Tienes el QR guardado en tu galería y quieres escanearlo desde el mismo móvil.

1. **Abre la aplicación** en tu móvil

2. **Ve a "Escanear QR"**

3. **Activa la cámara**

4. **Opción 1 - Imprime el QR:**
   - Imprime tu QR en papel
   - Escanéalo con la cámara del móvil

5. **Opción 2 - Usa otro dispositivo:**
   - Abre el QR en otro móvil/tablet
   - Escanéalo desde tu dispositivo principal

---

## 💡 Consejos y Mejores Prácticas

### Para Mejor Escaneo:

✅ **Iluminación:** Asegúrate de tener buena luz
✅ **Distancia:** Mantén el QR a 15-30 cm de la cámara
✅ **Estabilidad:** Mantén el QR quieto y enfocado
✅ **Limpieza:** Asegúrate de que el QR no esté borroso o dañado

### Recomendaciones:

1. **Guarda tu QR en varios lugares:**
   - Galería del móvil
   - Carpeta de favoritos
   - Impreso en tu carnet

2. **Comparte tu QR de forma segura:**
   - No lo publiques en redes sociales
   - Solo compártelo con personas de confianza

3. **Verifica tu registro:**
   - Después de escanear, confirma que veas el mensaje de éxito
   - Puedes verificar en "Registros" que tu llegada quedó guardada

---

## 🔧 Solución de Problemas

### ❌ "No se puede acceder a la cámara"
**Solución:**
- Verifica que diste permiso al navegador
- En móvil: Ve a Configuración → Aplicaciones → [Navegador] → Permisos → Cámara
- Intenta con otro navegador

### ❌ "El QR no se escanea"
**Solución:**
- Mejora la iluminación
- Limpia la lente de la cámara
- Acerca o aleja el QR
- Asegúrate de que el QR esté completo en el cuadro

### ❌ "Estudiante no encontrado"
**Solución:**
- Verifica que estés registrado en el sistema
- Contacta al administrador para verificar tu registro
- Genera un nuevo QR desde "Mi Código QR"

### ❌ "Error de conexión"
**Solución:**
- Verifica tu conexión a internet
- Asegúrate de que el servidor esté corriendo
- Recarga la página (F5)

---

## 📊 Flujo Completo Recomendado

```
1. REGISTRO INICIAL (Una sola vez)
   └─> Administrador registra al estudiante en el sistema

2. GENERAR QR (Una sola vez)
   └─> Estudiante genera su QR desde "Mi Código QR"
   └─> Guarda el QR en su móvil

3. USO DIARIO
   └─> Estudiante llega a la institución
   └─> Muestra su QR en el dispositivo de entrada
   └─> Sistema escanea y registra automáticamente
   └─> Estudiante recibe confirmación
```

---

## 🌐 URLs Importantes

- **Aplicación Principal:** `http://localhost:5173`
- **Generar Mi QR:** `http://localhost:5173/mi-qr`
- **Escanear QR:** `http://localhost:5173/registro-qr`
- **Ver Registros:** `http://localhost:5173/registros`
- **Dashboard:** `http://localhost:5173/dashboard`

---

## 📞 Soporte

Si tienes problemas:
1. Revisa esta guía completa
2. Verifica la sección de "Solución de Problemas"
3. Contacta al administrador del sistema

---

**¡Listo! Ahora puedes usar tu código QR para registrar tus llegadas de forma rápida y segura.** 🎉

