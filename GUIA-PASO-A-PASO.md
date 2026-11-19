# Guía paso a paso — Pipeline con GitHub Actions + Vercel

> **Proyecto ya creado:** la carpeta `kanban-group-3` contiene la aplicación Kanban completa, las 7 pruebas con Vitest y el workflow de GitHub Actions.
> Ya verifiqué localmente que `npm run test:run` pasa (7/7) y que `npm run build` genera `dist/` correctamente.
> Lo que falta es publicarlo en **tu** GitHub y en **tu** Vercel, provocar el fallo, corregirlo y abrir el Pull Request.

---

## 0. Requisitos y datos que necesitas

- Cuenta de **GitHub** (gratuita).
- Cuenta de **Vercel** (puedes registrarte con GitHub).
- Node.js 20 o superior y Git instalados.
- Terminal (PowerShell en Windows).

Verifica las versiones:

```powershell
node -v
npm -v
git --version
```

> **Importante:** el repositorio debe crearse **dentro** de la carpeta `kanban-group-3`, para que la raíz del repositorio sea la raíz del proyecto. Así Vercel detecta todo automáticamente.

---

## 1. Probar la aplicación en local

Abre una terminal en la carpeta del proyecto:

```powershell
cd "C:\Users\PORTATIL\Desktop\Ingeniería Web\kanban-group-3"
```

Instala dependencias y ejecuta las verificaciones:

```powershell
npm install
npm run test:run
npm run build
```

Debes ver:

- `Test Files 1 passed` y `Tests 7 passed`.
- `✓ built in ...` dentro de `dist/`.

Prueba la app visualmente:

```powershell
npm run dev
```

Abre `http://localhost:5173` y comprueba que puedes crear, editar, eliminar y mover tareas.

> La primera vez que se abre, el tablero trae 4 tareas de ejemplo. Se guardan en `localStorage`, así que tus cambios se conservan al recargar.

---

## 2. Crear el repositorio público en GitHub y subir el código

### 2.1 Crear el repositorio vacío

1. Entra a <https://github.com/new>.
2. **Repository name:** `kanban-group-3` (o el nombre que prefieras).
3. **Visibility:** `Public` (obligatorio para la entrega).
4. **NO** marques “Add a README file”, ni `.gitignore`, ni licencia. Debe crearse vacío.
5. Clic en **Create repository**.

### 2.2 Subir el proyecto desde la terminal

En la carpeta `kanban-group-3`:

```powershell
git init
git add .
git commit -m "feat: tablero Kanban con React, Vitest y GitHub Actions"
git branch -M main
git remote add origin https://github.com/TU-USUARIO/kanban-group-3.git
git push -u origin main
```

Reemplaza `TU-USUARIO` por tu usuario de GitHub.

- La primera vez, Git abrirá una ventana del navegador para iniciar sesión (Git Credential Manager). Acepta.
- Si te pide contraseña, usa un **Personal Access Token**, no la contraseña de GitHub. Lo más fácil es dejar que se abra el navegador.

### Alternativa con GitHub CLI (opcional)

Si tienes `gh` instalado y autenticado (`gh auth login`), puedes crear el repositorio público y subir todo en un solo paso:

```powershell
git init
git add .
git commit -m "feat: tablero Kanban con React, Vitest y GitHub Actions"
gh repo create kanban-group-3 --public --source=. --remote=origin --push
```

Esto crea el repositorio, configura `origin` y hace el primer push sin tener que crear el repo manualmente en la web.

### 2.3 Verificar que se subió el archivo del workflow

En el repositorio de GitHub debe existir:

```text
.github/workflows/ci.yml
```

También debe estar `package-lock.json` en la raíz. **No lo borres**: el pipeline usa `npm ci`, que lo necesita.

> Si por error creaste el repo con README, ejecuta `git pull origin main --rebase` antes de hacer push, o elimina el README desde la web.

---

## 3. Ver la primera ejecución del pipeline

1. En GitHub, entra a la pestaña **Actions**.
2. Debe aparecer el workflow **CI** ejecutándose (punto amarillo) o ya terminado (check verde).
3. Entra a la ejecución → job **Pruebas y build**.
4. Revisa los pasos:
   - Clonar repositorio
   - Configurar Node.js
   - Instalar dependencias
   - Ejecutar pruebas con Vitest
   - Build de producción
   - Publicar artefacto del build

Si todo está en verde, el pipeline está bien configurado. **Todavía no copies este enlace como entregable final**; primero harás el fallo intencional y la corrección (paso 4).

### Si falla

- **`npm ci` falla:** falta `package-lock.json` en el repositorio. Ejecuta `git add package-lock.json`, commit y push.
- **No aparece el workflow:** revisa que la ruta sea exactamente `.github/workflows/ci.yml` y que estés en la rama `main`.
- **Falla una prueba en CI pero no en local:** ejecuta `npm ci` y luego `npm run test:run` en local. Con este proyecto no debería ocurrir.

---

## 4. Provocar un fallo intencional y corregirlo (evidencia obligatoria)

La idea es que el pipeline se ponga **rojo**, tomar la captura y luego dejarlo **verde**.

### 4.1 Provocar el fallo

Abre `src/constants.js` y cambia el título de la primera columna:

```js
// Antes
{ id: 'pendiente', title: 'Pendiente' },

// Después (fallo intencional)
{ id: 'pendiente', title: 'Pendientes' },
```

Esto rompe la prueba que busca la columna con el nombre exacto `Pendiente`, así que el paso de Vitest fallará.

Sube el cambio:

```powershell
git add src/constants.js
git commit -m "test: provocar fallo intencional en el pipeline"
git push
```

### 4.2 Capturar la evidencia del fallo

1. Ve a **Actions** → workflow **CI** → la ejecución más reciente (debe tener una **X roja**).
2. Entra al job **Pruebas y build** y ubica el paso rojo **Ejecutar pruebas con Vitest**.
3. Toma la captura con `Win + Shift + S` (Recorte y anotación).
4. Guarda la imagen como `pipeline-fallido.png`.

La captura debe mostrar claramente:

- El nombre del workflow **CI**.
- La ejecución fallida (X roja).
- El job y/o el paso que falló.

> Guarda también la URL de esa ejecución fallida. No es obligatoria, pero puedes incluirla en el documento como evidencia extra.

### 4.3 Corregir el fallo

Vuelve a dejar el título original:

```js
{ id: 'pendiente', title: 'Pendiente' },
```

Sube la corrección:

```powershell
git add src/constants.js
git commit -m "fix: corregir titulo de la columna pendiente"
git push
```

### 4.4 Verificar el pipeline exitoso

1. Ve a **Actions** → **CI** → la nueva ejecución.
2. Espera el check verde en **Pruebas y build**.
3. Copia la URL de la barra de direcciones. Será similar a:

   ```text
   https://github.com/TU-USUARIO/kanban-group-3/actions/runs/1234567890
   ```

   **Ese es el enlace de la ejecución exitosa para tu entrega.**

### Opción alternativa (si prefieres fallar una aserción)

En `src/App.test.jsx`, cambia temporalmente:

```js
expect(screen.getAllByText('No hay tareas todavía.')).toHaveLength(3)
```

por:

```js
expect(screen.getAllByText('No hay tareas todavía.')).toHaveLength(4)
```

Haz commit y push, captura el fallo, vuelve a dejar `3`, haz commit y push. El resultado es el mismo. La opción de `constants.js` es mejor porque simula un error real de la aplicación detectado por las pruebas.

---

## 5. Publicar la aplicación en Vercel

### 5.1 Importar el repositorio

1. Entra a <https://vercel.com> e inicia sesión con **GitHub**.
2. Clic en **Add New…** → **Project**.
3. En **Import Git Repository**, busca `kanban-group-3`.
   - Si no aparece, clic en **Adjust GitHub App Permissions** y autoriza el acceso al repositorio.
4. Clic en **Import**.

### 5.2 Configuración del proyecto

Vercel detecta Vite automáticamente. Verifica que quede así:

| Campo | Valor |
| --- | --- |
| Project Name | `kanban-group-3` |
| Framework Preset | `Vite` |
| Root Directory | `./` (sin cambios) |
| Build Command | `npm run build` |
| Output Directory | `dist` |
| Install Command | `npm install` (por defecto) o `npm ci` |
| Environment Variables | Ninguna |

> El archivo `vercel.json` del proyecto ya declara `framework`, `buildCommand`, `outputDirectory` y la reescritura de rutas, así que Vercel respetará esa configuración.

5. Clic en **Deploy**.
6. Espera a que termine. Debe mostrar **Congratulations!**.
7. Abre la URL de producción. Vercel te da un dominio parecido a:

   ```text
   https://kanban-group-3.vercel.app
   ```

   Ese es el **enlace de la app publicada**.

### 5.3 Comprobar despliegues automáticos

Ve a la pestaña **Deployments** del proyecto en Vercel:

- Cada `push` a `main` genera un deployment de **Production**.
- Cada Pull Request genera un deployment de **Preview**.

No hace falta configurar nada más: el vínculo con GitHub ya activa los despliegues automáticos.

> Si cambias el nombre del proyecto en Vercel, la URL cambia. Copia la URL exacta desde el botón **Visit** o desde **Domains**.

---

## 6. Crear la rama de desarrollo, la mejora y el Pull Request

La mejora que vas a implementar es un botón **“Limpiar completadas”** en la cabecera, que elimina de una vez todas las tareas del estado Completado.

### 6.1 Crear la rama

```powershell
git checkout main
git pull origin main
git checkout -b feature/limpiar-completadas
```

### 6.2 Implementar la mejora

**Archivo `src/App.jsx`.** Después de la función `handleMove`:

```jsx
  const handleMove = (id, status) => {
    setTasks((prev) => prev.map((task) => (task.id === id ? { ...task, status } : task)))
  }

  // Agrega esto:
  const clearCompleted = () => {
    setTasks((prev) => prev.filter((task) => task.status !== 'completado'))
  }
```

En el mismo archivo, dentro del `div` con clase `header-actions`, justo **antes** del botón “Nueva tarea”:

```jsx
          <button
            type="button"
            className="btn btn-ghost"
            onClick={clearCompleted}
            disabled={completedCount === 0}
          >
            Limpiar completadas ({completedCount})
          </button>
```

`completedCount` ya existe en el archivo y el estilo `.btn-ghost:disabled` ya está en el CSS, así que no necesitas tocar `index.css`.

**Archivo `src/App.test.jsx`.** Agrega esta prueba dentro del `describe('Tablero Kanban', ...)`, por ejemplo al final:

```jsx
  it('limpia todas las tareas completadas', async () => {
    const user = userEvent.setup()
    render(<App />)

    await createTask(user, { title: 'Tarea completada', status: 'completado' })
    await createTask(user, { title: 'Tarea pendiente' })

    await user.click(screen.getByRole('button', { name: /limpiar completadas/i }))

    expect(screen.queryByText('Tarea completada')).not.toBeInTheDocument()
    expect(screen.getByText('Tarea pendiente')).toBeInTheDocument()
  })
```

Verifica en local antes de subir:

```powershell
npm run test:run
npm run build
```

Deben pasar **8 pruebas** y el build debe completarse.

> Opcional: en `README.md`, cambia “**7 pruebas**” por “**8 pruebas**” y agrega la nueva prueba a la lista. Así la documentación queda coherente con el PR.

### 6.3 Subir la rama y abrir el Pull Request

```powershell
git add .
git commit -m "feat: agregar accion para limpiar tareas completadas"
git push -u origin feature/limpiar-completadas
```

1. Abre el repositorio en GitHub. Aparecerá el aviso **“feature/limpiar-completadas had recent pushes”** con el botón **Compare & pull request**.
2. Si no aparece: pestaña **Pull requests** → **New pull request**.
3. Configura:
   - **base:** `main`
   - **compare:** `feature/limpiar-completadas`
   - **Título:** `feat: agregar acción para limpiar tareas completadas`
   - **Descripción:** explica brevemente qué hace y que incluye una prueba nueva.
4. Clic en **Create pull request**.
5. Espera los checks en la parte inferior del PR:
   - **CI / Pruebas y build** debe quedar en verde.
   - **Vercel** debe mostrar un deployment de Preview exitoso (y suele comentar la URL de preview).
6. Copia la URL del Pull Request:

   ```text
   https://github.com/TU-USUARIO/kanban-group-3/pull/1
   ```

   **Ese es el enlace del PR para tu entrega.**

7. Clic en **Merge pull request** → **Confirm merge**.
8. Vuelve a **Actions**: se ejecutará un nuevo pipeline sobre `main` (debe quedar verde) y Vercel volverá a desplegar la versión de producción con la mejora.

> Importante: no hagas merge antes de comprobar que el check del PR está en verde. Así demuestras que el pipeline validó la rama.

---

## 7. Completar el README (opcional, pero recomendado)

En `README.md`, reemplaza la tabla de enlaces:

```md
| Recurso | Enlace |
| --- | --- |
| Aplicación desplegada en Vercel | _Completar después del despliegue_ |
| Repositorio público de GitHub | _Completar_ |
| Ejecución exitosa de GitHub Actions | _Completar_ |
| Pull Request de la mejora | _Completar_ |
```

por tus URLs reales. Luego:

```powershell
git add README.md
git commit -m "docs: agregar enlaces de despliegue y pipeline"
git push
```

Esto dispara otra ejecución verde del pipeline. Es normal.

---

## 8. Entregables: dónde obtener cada uno

| Entregable | Dónde obtenerlo |
| --- | --- |
| **URL del repositorio público** | `https://github.com/TU-USUARIO/kanban-group-3` |
| **URL de la app en Vercel** | Vercel → proyecto → botón **Visit** (ej. `https://kanban-group-3.vercel.app`) |
| **Enlace a una ejecución exitosa** | GitHub → **Actions** → **CI** → ejecución con check verde → copiar URL (paso 4.4) |
| **Captura de la ejecución fallida** | `pipeline-fallido.png`, tomada en el paso 4.2 (X roja + paso fallido) |
| **Enlace al Pull Request** | GitHub → **Pull requests** → el PR creado (paso 6.3) |

### Checklist final

- [ ] Repositorio **público** creado y con el código en `main`.
- [ ] Workflow `.github/workflows/ci.yml` presente y ejecutándose en cada push/PR a `main`.
- [ ] Pipeline con instalación de dependencias, **7 pruebas** con Vitest y build de producción.
- [ ] Primera ejecución exitosa verificada.
- [ ] Falla intencional provocada y **captura guardada**.
- [ ] Falla corregida y **enlace de ejecución exitosa** copiado.
- [ ] App desplegada en Vercel y URL de producción copiada.
- [ ] Despliegues automáticos comprobados (push a `main` = Production; PR = Preview).
- [ ] Rama `feature/limpiar-completadas` creada con la mejora y la prueba nueva.
- [ ] Pull Request a `main` creado y con checks verdes.
- [ ] PR fusionado y pipeline de `main` en verde.
- [ ] Los 5 entregables subidos al aula virtual.

---

## 9. Problemas comunes

| Problema | Solución |
| --- | --- |
| `npm ci` falla en GitHub Actions | Falta `package-lock.json`. Agrégalo con `git add package-lock.json`, commit y push. |
| El workflow no aparece en Actions | Verifica la ruta `.github/workflows/ci.yml`, que estés en `main` y que Actions esté habilitado en **Settings → Actions → General**. |
| Vercel muestra 404 al recargar | El proyecto incluye `vercel.json` con la reescritura a `index.html`. Verifica que el archivo esté en la raíz del repo. |
| Vercel no lista el repositorio | Autoriza el acceso en **Adjust GitHub App Permissions** al importar el proyecto. |
| Vercel falla el build | Revisa que **Output Directory** sea `dist` y **Build Command** sea `npm run build`. |
| El PR no ejecuta el pipeline | El workflow debe estar en `main` y el PR debe apuntar a `main`. Revisa la pestaña **Checks** del PR. |
| Git avisa `LF will be replaced by CRLF` | Es solo una advertencia de Windows; no afecta al pipeline. |
| La app no guarda tareas | Es normal en modo incógnito o si el navegador bloquea `localStorage`; usa una ventana normal. |

---

## 10. Resumen de comandos

```powershell
# 1. Probar en local
cd "C:\Users\PORTATIL\Desktop\Ingeniería Web\kanban-group-3"
npm install
npm run test:run
npm run build

# 2. Publicar en GitHub (primera vez)
git init
git add .
git commit -m "feat: tablero Kanban con React, Vitest y GitHub Actions"
git branch -M main
git remote add origin https://github.com/TU-USUARIO/kanban-group-3.git
git push -u origin main

# 3. Fallo intencional: editar src/constants.js, luego
git add src/constants.js
git commit -m "test: provocar fallo intencional en el pipeline"
git push

# 4. Corregir: volver a "Pendiente", luego
git add src/constants.js
git commit -m "fix: corregir titulo de la columna pendiente"
git push

# 5. Rama de la mejora
git checkout main
git pull origin main
git checkout -b feature/limpiar-completadas
# ... implementar el boton y la prueba ...
npm run test:run
npm run build
git add .
git commit -m "feat: agregar accion para limpiar tareas completadas"
git push -u origin feature/limpiar-completadas

# 6. Abrir el PR en GitHub y fusionarlo cuando este en verde
git checkout main
git pull origin main
git branch -d feature/limpiar-completadas
```
