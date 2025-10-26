# Configuración de Variables de Entorno

## 📋 Variables de Entorno Necesarias

Crea un archivo `.env` en la raíz del proyecto con las siguientes variables:

```env
# Configuración de la API
VITE_API_URL=http://localhost:3000

# Configuración de la aplicación
VITE_APP_NAME=Banorte Dashboard
VITE_APP_VERSION=1.0.0

# Configuración de desarrollo
VITE_DEBUG=true
VITE_LOG_LEVEL=info

# Configuración de autenticación
VITE_AUTH_TOKEN_KEY=banorte_token
VITE_AUTH_REFRESH_TOKEN_KEY=banorte_refresh_token

# Configuración del asistente IA
VITE_AI_ENDPOINT=http://localhost:3000/api/chat
VITE_AI_MODEL=gpt-3.5-turbo

# Configuración de notificaciones
VITE_TOAST_DURATION=4000
VITE_TOAST_POSITION=top-right
```

## 🔐 Datos de Prueba para Login

El sistema incluye usuarios de prueba para testing:

### Usuarios Disponibles:

| Usuario | Contraseña | Nombre | Email |
|---------|------------|--------|-------|
| `admin` | `admin123` | Administrador | admin@banorte.com |
| `usuario` | `123456` | Usuario Demo | usuario@banorte.com |
| `demo` | `demo` | Demo User | demo@banorte.com |
| `test` | `test123` | Test User | test@banorte.com |

### 🚀 Cómo Probar:

1. **Ejecuta el servidor:**
   ```bash
   npm run dev
   ```

2. **Accede a la aplicación** en el puerto mostrado (ej: http://localhost:3000)

3. **Usa cualquiera de los usuarios de prueba** para hacer login

4. **Prueba el registro** con cualquier email válido

## 🔧 Configuración de Desarrollo

### Variables Importantes:

- **VITE_API_URL**: URL base de tu API backend
- **VITE_DEBUG**: Activa logs de desarrollo
- **VITE_AUTH_TOKEN_KEY**: Clave para guardar el token en localStorage
- **VITE_TOAST_DURATION**: Duración de las notificaciones en ms

### 🎯 Para Producción:

Cambia las siguientes variables:
```env
VITE_DEBUG=false
VITE_API_URL=https://tu-api-produccion.com
VITE_LOG_LEVEL=error
```

## 📱 Funcionalidades de Prueba

- ✅ **Login con usuarios de prueba**
- ✅ **Registro con validaciones**
- ✅ **Notificaciones toast**
- ✅ **Persistencia de sesión**
- ✅ **Logout funcional**
- ✅ **Datos mock del dashboard**

## 🐛 Troubleshooting

Si tienes problemas:

1. **Verifica que el archivo `.env` esté en la raíz del proyecto**
2. **Reinicia el servidor** después de cambiar variables
3. **Revisa la consola** para errores de configuración
4. **Limpia el localStorage** si hay problemas de autenticación

## 📞 Soporte

Para más ayuda, revisa la documentación de Vite sobre variables de entorno:
https://vitejs.dev/guide/env-and-mode.html
