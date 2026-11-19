import { useEffect, useMemo, useState } from 'react'
import Column from './components/Column'
import TaskForm from './components/TaskForm'
import { COLUMNS, STORAGE_KEY } from './constants'

const demoTasks = [
  {
    id: 'demo-1',
    title: 'Configurar el pipeline de GitHub Actions',
    description: 'Instalar dependencias, ejecutar Vitest y generar el build de producción.',
    priority: 'Alta',
    status: 'pendiente',
    createdAt: '2026-11-10T09:00:00.000Z',
  },
  {
    id: 'demo-2',
    title: 'Diseñar el tablero Kanban',
    description: 'Definir columnas, tarjetas y estados de las tareas.',
    priority: 'Media',
    status: 'pendiente',
    createdAt: '2026-11-10T09:05:00.000Z',
  },
  {
    id: 'demo-3',
    title: 'Maquetar la aplicación con React',
    description: 'Componentes Board, Column, TaskCard y TaskForm.',
    priority: 'Alta',
    status: 'progreso',
    createdAt: '2026-11-10T09:10:00.000Z',
  },
  {
    id: 'demo-4',
    title: 'Crear el repositorio en GitHub',
    description: 'Repositorio público con la rama main validada por el pipeline.',
    priority: 'Baja',
    status: 'completado',
    createdAt: '2026-11-10T09:15:00.000Z',
  },
]

const uid = () =>
  typeof crypto !== 'undefined' && typeof crypto.randomUUID === 'function'
    ? crypto.randomUUID()
    : `t-${Date.now()}-${Math.random().toString(16).slice(2)}`

function loadTasks() {
  try {
    const stored = window.localStorage.getItem(STORAGE_KEY)
    if (stored === null) return demoTasks
    const parsed = JSON.parse(stored)
    return Array.isArray(parsed) ? parsed : demoTasks
  } catch {
    return demoTasks
  }
}

function App() {
  const [tasks, setTasks] = useState(loadTasks)
  const [query, setQuery] = useState('')
  const [form, setForm] = useState(null)

  useEffect(() => {
    try {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(tasks))
    } catch {
      // El tablero sigue funcionando aunque localStorage no esté disponible.
    }
  }, [tasks])

  const completedCount = tasks.filter((task) => task.status === 'completado').length
  const progress = tasks.length === 0 ? 0 : Math.round((completedCount / tasks.length) * 100)

  const visibleTasks = useMemo(() => {
    const term = query.trim().toLowerCase()
    if (!term) return tasks
    return tasks.filter((task) =>
      `${task.title} ${task.description ?? ''}`.toLowerCase().includes(term),
    )
  }, [tasks, query])

  const openCreate = (status = 'pendiente') => setForm({ mode: 'create', status })
  const openEdit = (task) => setForm({ mode: 'edit', task })
  const closeForm = () => setForm(null)

  const handleSave = (data) => {
    if (form?.mode === 'edit') {
      const id = form.task.id
      setTasks((prev) => prev.map((task) => (task.id === id ? { ...task, ...data } : task)))
    } else {
      const newTask = {
        id: uid(),
        createdAt: new Date().toISOString(),
        ...data,
      }
      setTasks((prev) => [newTask, ...prev])
    }
    setForm(null)
  }

  const handleDelete = (id) => {
    setTasks((prev) => prev.filter((task) => task.id !== id))
  }

  const handleMove = (id, status) => {
    setTasks((prev) => prev.map((task) => (task.id === id ? { ...task, status } : task)))
  }

  return (
    <div className="app">
      <header className="app-header">
        <div className="brand">
          <span className="brand-mark" aria-hidden="true">
            K
          </span>
          <div className="brand-text">
            <h1>Kanban Board</h1>
            <p>Group 3 · Ingeniería Web</p>
          </div>
        </div>

        <div className="header-actions">
          <label className="search">
            <svg
              aria-hidden="true"
              viewBox="0 0 24 24"
              width="18"
              height="18"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
            >
              <circle cx="11" cy="11" r="7" />
              <path d="m20 20-3.5-3.5" />
            </svg>
            <input
              type="search"
              aria-label="Buscar tareas"
              placeholder="Buscar tareas..."
              value={query}
              onChange={(event) => setQuery(event.target.value)}
            />
          </label>

          <button type="button" className="btn btn-primary" onClick={() => openCreate('pendiente')}>
            <svg
              aria-hidden="true"
              viewBox="0 0 24 24"
              width="16"
              height="16"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.4"
              strokeLinecap="round"
            >
              <path d="M12 5v14M5 12h14" />
            </svg>
            Nueva tarea
          </button>
        </div>
      </header>

      <main className="board-wrap">
        <div className="board-toolbar">
          <div>
            <h2>Tablero de tareas</h2>
            <p>
              {query.trim()
                ? `Resultados para “${query.trim()}”`
                : 'Usa las flechas de cada tarjeta para cambiar su estado.'}
            </p>
          </div>

          <div className="progress-box">
            <div className="progress-info">
              <span>
                {completedCount} de {tasks.length} completadas
              </span>
              <strong>{progress}%</strong>
            </div>
            <div
              className="progress-track"
              role="progressbar"
              aria-label="Progreso del tablero"
              aria-valuenow={progress}
              aria-valuemin={0}
              aria-valuemax={100}
            >
              <span style={{ width: `${progress}%` }} />
            </div>
          </div>
        </div>

        <div className="board">
          {COLUMNS.map((column) => (
            <Column
              key={column.id}
              column={column}
              tasks={visibleTasks.filter((task) => task.status === column.id)}
              query={query}
              onAdd={() => openCreate(column.id)}
              onEdit={openEdit}
              onDelete={handleDelete}
              onMove={handleMove}
            />
          ))}
        </div>
      </main>

      <footer className="app-footer">
        <span>Pruebas con Vitest</span>
        <span className="dot-sep" aria-hidden="true">
          ·
        </span>
        <span>CI con GitHub Actions</span>
        <span className="dot-sep" aria-hidden="true">
          ·
        </span>
        <span>Deploy en Vercel</span>
      </footer>

      {form && (
        <TaskForm
          task={form.mode === 'edit' ? form.task : null}
          defaultStatus={form.status ?? 'pendiente'}
          onCancel={closeForm}
          onSave={handleSave}
        />
      )}
    </div>
  )
}

export default App
