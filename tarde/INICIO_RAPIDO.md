# 🚀 Inicio Rápido - Sistema de Llegadas Tarde SENA

## ⚡ Pasos para Iniciar la Aplicación

### 1️⃣ Verificar MongoDB

Asegúrate de que MongoDB esté corriendo:

**Windows:**
```powershell
# Verificar si MongoDB está corriendo
Get-Service MongoDB

# Si no está corriendo, iniciarlo
net start MongoDB
```

**macOS/Linux:**
```bash
# Verificar estado
sudo systemctl status mongod

# Iniciar si es necesario
sudo systemctl start mongod
```

### 2️⃣ Iniciar el Backend

Abre una terminal en la carpeta del proyecto:

```bash
cd tarde/Backend
npm run dev
```

Deberías ver:
```
✅ MongoDB conectado exitosamente
🚀 Servidor corriendo en puerto 5000
```

### 3️⃣ Iniciar el Frontend

Abre OTRA terminal en la carpeta del proyecto:

```bash
cd tarde/Frontend
npm run dev
```

Deberías ver:
```
VITE v7.2.7  ready in XXX ms
➜  Local:   http://localhost:5173/
```

### 4️⃣ Abrir la Aplicación

Abre tu navegador en: **http://localhost:5173**

## 📋 Primeros Pasos en la Aplicación

### Paso 1: Registrar un Estudiante

1. Clic en "Estudiantes" en el menú superior
2. Clic en "Nuevo Estudiante"
3. Llenar el formulario:
   - **Cédula:** 1234567890 (ejemplo)
   - **Nombre:** Juan Pérez
   - **Número de Ficha:** 2558346
   - Email y teléfono son opcionales
4. Clic en "Guardar Estudiante"

### Paso 2: Generar Código QR

1. En la lista de estudiantes, busca al estudiante que acabas de crear
2. Clic en el botón "Generar QR"
3. Se mostrará el código QR único del estudiante
4. Puedes descargarlo con el botón "Descargar QR"

### Paso 3: Probar el Registro por QR

1. Vuelve al inicio (clic en "Sistema de Llegadas Tarde" o el logo)
2. Clic en la tarjeta "📱 Registro por QR"
3. Clic en "Activar Cámara"
4. Permite el acceso a la cámara cuando el navegador lo solicite
5. Muestra el código QR que descargaste frente a la cámara
6. ¡El sistema registrará automáticamente la llegada!

### Paso 4: Ver el Dashboard

1. Clic en "Dashboard" en el menú
2. Verás las estadísticas del día:
   - Total de registros
   - Estudiantes a tiempo
   - Llegadas tarde
   - Gráficos por método de registro

### Paso 5: Ver Historial de Registros

1. Clic en "Registros" en el menú
2. Verás todos los registros con:
   - Fecha y hora
   - Nombre del estudiante
   - Método usado (QR/HUELLA/FACEID)
   - Estado (A tiempo / Retardo)

## 🔧 Configuración de Hora Límite

Por defecto, la hora límite para considerar una llegada tarde es **7:00 AM**.

Para cambiar esto, edita el archivo:
`tarde/Backend/models/RegistroLlegada.js`

Busca la línea:
```javascript
horaLimite: {
  type: String,
  default: '07:00'
}
```

Y cambia '07:00' por la hora que desees (formato 24 horas).

## 📱 Probar en Móvil

### Opción 1: Usar la misma red WiFi

1. Encuentra la IP de tu computadora:
   - **Windows:** `ipconfig` (busca IPv4)
   - **Mac/Linux:** `ifconfig` o `ip addr`

2. En el móvil, abre el navegador y ve a:
   ```
   http://TU_IP:5173
   ```
   Ejemplo: `http://192.168.1.100:5173`

### Opción 2: Usar ngrok (para probar desde cualquier lugar)

1. Instala ngrok: https://ngrok.com/download
2. Ejecuta:
   ```bash
   ngrok http 5173
   ```
3. Usa la URL que te proporciona ngrok

## ⚠️ Solución de Problemas Comunes

### Error: "Cannot connect to MongoDB"
- Verifica que MongoDB esté corriendo
- Verifica la URL en `Backend/.env`

### Error: "Failed to fetch" en el frontend
- Verifica que el backend esté corriendo en puerto 5000
- Verifica la URL en `Frontend/.env`

### La cámara no funciona
- Asegúrate de dar permisos de cámara al navegador
- En producción, necesitas HTTPS para que funcione la cámara

### Los registros biométricos no funcionan
- La autenticación biométrica requiere HTTPS en producción
- En desarrollo local (localhost) funciona sin HTTPS
- Verifica que tu dispositivo tenga sensor de huella o Face ID

## 📞 Soporte

Si tienes problemas, verifica:
1. ✅ MongoDB está corriendo
2. ✅ Backend está corriendo en puerto 5000
3. ✅ Frontend está corriendo en puerto 5173
4. ✅ No hay errores en las consolas de las terminales
5. ✅ Los archivos .env están configurados correctamente

## 🎉 ¡Listo!

Tu sistema de registro de llegadas tarde está funcionando. Ahora puedes:
- Registrar más estudiantes
- Probar los diferentes métodos de registro
- Ver estadísticas en tiempo real
- Exportar reportes (próximamente)

¡Disfruta usando el sistema! 🚀

