# 🎓 Sistema de Registro de Llegadas Tarde - SENA

Sistema completo de gestión de asistencia estudiantil con múltiples métodos de autenticación biométrica y códigos QR.

![Estado](https://img.shields.io/badge/Estado-Funcional-success)
![Versión](https://img.shields.io/badge/Versión-1.0.0-blue)
![Licencia](https://img.shields.io/badge/Licencia-MIT-green)

## 📋 Descripción

Sistema web profesional para el registro de llegadas tarde de estudiantes del SENA, con soporte para:

- 📱 **Códigos QR** - Generación y escaneo de códigos QR personales
- 👆 **Huella Dactilar** - Autenticación biométrica con WebAuthn
- 😊 **Face ID** - Reconocimiento facial para iOS y Android
- 📊 **Dashboard** - Estadísticas en tiempo real
- 👥 **Gestión de Estudiantes** - CRUD completo

## ✨ Características Principales

### 🔐 Autenticación Múltiple
- **WebAuthn (W3C Standard)** para huella dactilar y Face ID
- **Códigos QR únicos** por estudiante
- **Detección automática** de dispositivo y navegador
- **Almacenamiento seguro** de credenciales biométricas

### 📊 Gestión y Reportes
- Dashboard con estadísticas en tiempo real
- Registro automático de hora de llegada
- Detección de retardos (hora límite: 7:00 AM)
- Historial completo de registros
- Búsqueda y filtrado avanzado

### 🎨 Interfaz Profesional
- Diseño responsive (móvil, tablet, desktop)
- Tema SENA (verde institucional)
- Animaciones y transiciones suaves
- Experiencia de usuario optimizada

## 🛠️ Tecnologías Utilizadas

### Backend
- **Node.js** + **Express.js** - Servidor y API REST
- **MongoDB** + **Mongoose** - Base de datos NoSQL
- **@simplewebauthn/server** - Autenticación biométrica
- **QRCode** - Generación de códigos QR
- **Express Validator** - Validación de datos

### Frontend
- **Vue 3** + **Vite** - Framework y build tool
- **Vue Router** - Navegación SPA
- **Pinia** - State management
- **Axios** - Cliente HTTP
- **@simplewebauthn/browser** - Cliente WebAuthn
- **html5-qrcode** - Escaneo de QR

## 📦 Instalación

### Requisitos Previos

- Node.js >= 16.x
- MongoDB >= 5.x
- npm o yarn

### 1. Clonar el Repositorio

```bash
git clone https://github.com/TU_USUARIO/llegadas-tarde-sena.git
cd llegadas-tarde-sena
```

### 2. Configurar Backend

```bash
cd tarde/Backend
npm install
```

Crear archivo `.env`:

```env
PORT=5000
MONGODB_URI=mongodb://localhost:27017/llegadas_tarde
JWT_SECRET=tu_clave_secreta_super_segura
NODE_ENV=development
FRONTEND_URL=http://localhost:5173
```

### 3. Configurar Frontend

```bash
cd ../Frontend
npm install
```

Crear archivo `.env`:

```env
VITE_API_URL=http://localhost:5000/api
```

### 4. Iniciar MongoDB

```bash
# Windows
mongod

# Linux/Mac
sudo systemctl start mongod
```

### 5. Ejecutar la Aplicación

**Terminal 1 - Backend:**
```bash
cd tarde/Backend
npm run dev
```

**Terminal 2 - Frontend:**
```bash
cd tarde/Frontend
npm run dev
```

La aplicación estará disponible en:
- **Frontend:** http://localhost:5173
- **Backend:** http://localhost:5000

## 🚀 Uso Rápido

### Para Estudiantes

1. **Generar tu QR:**
   - Ve a "Mi Código QR"
   - Ingresa tu cédula
   - Descarga o guarda el QR

2. **Registrar llegada:**
   - Opción A: Escanea tu QR en el dispositivo de entrada
   - Opción B: Usa tu huella dactilar
   - Opción C: Usa Face ID

### Para Administradores

1. **Registrar estudiante:**
   - Ve a "Estudiantes" → "Nuevo Estudiante"
   - Completa el formulario
   - Guardar

2. **Configurar biometría:**
   - Ve a "Biometría"
   - Busca al estudiante
   - Registra huella o Face ID

3. **Ver estadísticas:**
   - Ve a "Dashboard"
   - Consulta registros en tiempo real

## 📱 Compatibilidad

### Navegadores
- ✅ Chrome/Edge (Windows, Android, macOS)
- ✅ Safari (iOS, macOS)
- ✅ Firefox (soporte limitado de WebAuthn)

### Dispositivos
- 📱 iPhone/iPad con Face ID o Touch ID
- 📱 Android con sensor de huella o reconocimiento facial
- 💻 Laptops con Windows Hello, Touch ID, o sensor de huella

## 📚 Documentación Adicional

- [Instrucciones de QR](tarde/INSTRUCCIONES_QR.md) - Guía completa de códigos QR
- [Inicio Rápido](tarde/INICIO_RAPIDO.md) - Guía de inicio rápido

## 🔒 Seguridad

- ✅ Credenciales biométricas nunca salen del dispositivo
- ✅ Almacenamiento seguro de claves públicas
- ✅ Variables de entorno para datos sensibles
- ✅ Validación de datos en backend
- ✅ CORS configurado correctamente

## 🤝 Contribuir

Las contribuciones son bienvenidas. Por favor:

1. Fork el proyecto
2. Crea una rama para tu feature (`git checkout -b feature/AmazingFeature`)
3. Commit tus cambios (`git commit -m 'Add some AmazingFeature'`)
4. Push a la rama (`git push origin feature/AmazingFeature`)
5. Abre un Pull Request

## 📄 Licencia

Este proyecto está bajo la Licencia MIT. Ver el archivo `LICENSE` para más detalles.

## 👨‍💻 Autor

Desarrollado para el SENA - Servicio Nacional de Aprendizaje

## 📞 Soporte

Para reportar problemas o solicitar características, por favor abre un issue en GitHub.

---

**⭐ Si este proyecto te fue útil, considera darle una estrella en GitHub!**

