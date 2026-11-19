# Kanban Board — Group 3

Aplicación web tipo **Kanban (estilo Jira)** desarrollada con **React + Vite**, con pruebas automatizadas en **Vitest**, integración continua mediante **GitHub Actions** y despliegue automático en **Vercel**.

## Demo y enlaces de entrega

| Recurso | Enlace |
| --- | --- |
| Aplicación desplegada en Vercel | _Completar después del despliegue_ |
| Repositorio público de GitHub | _Completar_ |
| Ejecución exitosa de GitHub Actions | _Completar_ |
| Pull Request de la mejora | _Completar_ |

## Funcionalidades

- Crear tareas con título, descripción, prioridad y estado.
- Editar tareas existentes.
- Eliminar tareas.
- Organizar las tareas en tres columnas: **Pendiente**, **En progreso** y **Completado**.
- Cambiar el estado de una tarea con las flechas de la tarjeta.
- Buscar tareas por título o descripción.
- Ver el progreso del tablero y el número de tareas por columna.
- Persistencia automática en `localStorage`.
- Validación del formulario (el título es obligatorio).

## Stack

| Tecnología | Uso |
| --- | --- |
| React 18 | Interfaz de usuario |
| Vite 5 | Servidor de desarrollo y build |
| Vitest 2 + Testing Library | Pruebas automatizadas |
| GitHub Actions | Pipeline de integración continua |
| Vercel | Despliegue automático |

## Cómo ejecutar el proyecto

Requiere **Node.js 20 o superior**.

```bash
npm install
npm run dev
```

La aplicación queda disponible en `http://localhost:5173`.

### Scripts disponibles

| Comando | Descripción |
| --- | --- |
| `npm run dev` | Inicia el servidor de desarrollo. |
| `npm run test` | Ejecuta Vitest en modo interactivo. |
| `npm run test:run` | Ejecuta las pruebas una vez (modo CI). |
| `npm run build` | Genera el build de producción en `dist/`. |
| `npm run preview` | Sirve localmente el build de producción. |

## Pruebas automatizadas

El archivo `src/App.test.jsx` contiene **7 pruebas**:

1. Renderizado de las tres columnas con su estado vacío.
2. Creación de una tarea y persistencia en `localStorage`.
3. Cambio de estado de una tarea entre columnas.
4. Edición de título y prioridad.
5. Eliminación de una tarea.
6. Validación cuando se intenta crear una tarea sin título.
7. Filtrado de tareas mediante el buscador.

```bash
npm run test:run
```

## Pipeline de GitHub Actions

El workflow [`.github/workflows/ci.yml`](.github/workflows/ci.yml) se ejecuta automáticamente en:

- Cada `push` a `main`.
- Cada `pull_request` dirigido a `main`.

Pasos del job:

1. Clonado del repositorio (`actions/checkout`).
2. Configuración de Node.js 22 con caché de npm.
3. Instalación de dependencias con `npm ci`.
4. Ejecución de las pruebas con Vitest (`npm run test:run`).
5. Build de producción (`npm run build`).
6. Publicación del artefacto `dist`.

Si cualquiera de los pasos falla, el pipeline se marca como fallido y el Pull Request queda bloqueado por el check correspondiente.

## Estructura del proyecto

```text
kanban-group-3/
├── .github/workflows/ci.yml     # Pipeline de integración continua
├── public/favicon.svg
├── src/
│   ├── components/
│   │   ├── Column.jsx           # Columna del tablero
│   │   ├── TaskCard.jsx         # Tarjeta de tarea
│   │   └── TaskForm.jsx         # Modal de creación/edición
│   ├── test/setup.js            # Configuración de Testing Library
│   ├── App.jsx                  # Estado del tablero y lógica principal
│   ├── App.test.jsx             # Pruebas automatizadas
│   ├── constants.js             # Columnas, prioridades y claves
│   ├── index.css                # Estilos
│   └── main.jsx                 # Punto de entrada
├── index.html
├── package.json
├── vite.config.js
└── vercel.json
```

## Despliegue en Vercel

El repositorio está vinculado a Vercel para habilitar despliegues automáticos:

- Cada `push` a `main` genera un **despliegue de producción**.
- Cada Pull Request genera un **despliegue de vista previa (Preview)**.

Configuración del proyecto en Vercel:

- **Framework Preset:** Vite
- **Build Command:** `npm run build`
- **Output Directory:** `dist`
- **Install Command:** `npm ci`

## Documentación del taller

El paso a paso completo para reproducir el taller (repositorio, fallo intencional, Vercel y Pull Request) está en [`GUIA-PASO-A-PASO.md`](GUIA-PASO-A-PASO.md).
