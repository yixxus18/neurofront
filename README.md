# Dashboard Financiero Inteligente - Banorte

Una aplicación web moderna construida con React, TypeScript y Tailwind CSS que proporciona un dashboard financiero inteligente con asistente de IA.

## 🚀 Características

- **Dashboard Interactivo**: Métricas financieras en tiempo real con gráficos dinámicos
- **Asistente de IA**: Chat inteligente para consultas financieras y análisis
- **Diseño Responsivo**: Optimizado para desktop, tablet y móvil
- **Autenticación**: Sistema de login seguro
- **Animaciones Suaves**: Transiciones fluidas con Framer Motion
- **Gráficos Avanzados**: Visualizaciones con Chart.js

## 🛠️ Stack Tecnológico

- **Frontend**: React 18 + TypeScript
- **Build Tool**: Vite
- **Styling**: Tailwind CSS
- **Gráficos**: Chart.js + react-chartjs-2
- **Iconos**: Lucide React
- **Animaciones**: Framer Motion
- **HTTP Client**: Axios

## 📦 Instalación

1. Clona el repositorio:
```bash
git clone <repository-url>
cd banorte-app
```

2. Instala las dependencias:
```bash
npm install
```

3. Configura las variables de entorno:
```bash
# Crea un archivo .env en la raíz del proyecto
VITE_API_URL=http://localhost:3000
```

4. Ejecuta el servidor de desarrollo:
```bash
npm run dev
```

## 🎨 Paleta de Colores

- **Rojo Principal (Banorte)**: #E31D1A
- **Blanco**: #FFFFFF
- **Grises**: #F8F9FA, #6C757D, #212529

## 📱 Componentes Principales

### Dashboard
- **Header**: Navegación y información del usuario
- **Métricas**: Tarjetas con KPIs financieros
- **Gráficos**: Análisis de gastos y ahorros
- **Transacciones**: Lista de movimientos recientes
- **Acciones Rápidas**: Botones para operaciones comunes

### Asistente de IA
- **Chat Flotante**: Ventana de chat interactiva
- **Respuestas Inteligentes**: Análisis financiero personalizado
- **Integración**: Conexión con backend de IA

## 🔧 Estructura del Proyecto

```
src/
├── api/                  # Cliente HTTP y configuración
├── assets/               # Imágenes y recursos
├── components/
│   ├── ui/               # Componentes reutilizables
│   ├── dashboard/        # Componentes del dashboard
│   └── assistant/        # Componentes del asistente IA
├── hooks/                # Hooks personalizados
├── pages/                # Páginas principales
└── App.tsx              # Componente raíz
```

## 🚀 Scripts Disponibles

- `npm run dev` - Servidor de desarrollo
- `npm run build` - Build de producción
- `npm run preview` - Preview del build
- `npm run lint` - Linter de código

## 🔐 Autenticación

El sistema de autenticación está implementado con:
- Context API de React
- LocalStorage para persistencia
- Interceptores de Axios
- Verificación automática de tokens

## 📊 Datos de Ejemplo

La aplicación incluye datos de ejemplo para demostrar las funcionalidades:
- Métricas financieras
- Gráficos de gastos y ahorros
- Transacciones recientes
- Análisis de categorías

## 🌐 API Endpoints

La aplicación espera los siguientes endpoints en el backend:

- `POST /api/login` - Autenticación de usuario
- `GET /api/me` - Información del usuario
- `POST /api/chat` - Chat con asistente IA

## 📱 Responsive Design

- **Mobile First**: Diseño optimizado para móviles
- **Breakpoints**: sm, md, lg, xl
- **Grid System**: Layout adaptativo
- **Touch Friendly**: Interacciones táctiles

## 🎯 Próximas Funcionalidades

- [ ] Integración con APIs bancarias reales
- [ ] Notificaciones push
- [ ] Exportación de reportes
- [ ] Metas de ahorro personalizadas
- [ ] Análisis predictivo

## 📄 Licencia

Este proyecto está desarrollado para Banorte como parte de un hackathon.

## 🤝 Contribución

Para contribuir al proyecto:
1. Fork el repositorio
2. Crea una rama feature
3. Realiza tus cambios
4. Envía un Pull Request

---

**Desarrollado con ❤️ para Banorte**
