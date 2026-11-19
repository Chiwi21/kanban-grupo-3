import { useState } from 'react'
import { COLUMNS, PRIORITIES } from '../constants'

function TaskForm({ task, defaultStatus, onCancel, onSave }) {
  const isEditing = Boolean(task)
  const [title, setTitle] = useState(task?.title ?? '')
  const [description, setDescription] = useState(task?.description ?? '')
  const [priority, setPriority] = useState(task?.priority ?? 'Media')
  const [status, setStatus] = useState(task?.status ?? defaultStatus ?? 'pendiente')
  const [error, setError] = useState('')

  const handleSubmit = (event) => {
    event.preventDefault()
    if (!title.trim()) {
      setError('El título es obligatorio.')
      return
    }
    onSave({
      title: title.trim(),
      description: description.trim(),
      priority,
      status,
    })
  }

  return (
    <div
      className="modal-backdrop"
      onMouseDown={(event) => {
        if (event.target === event.currentTarget) onCancel()
      }}
      onKeyDown={(event) => {
        if (event.key === 'Escape') onCancel()
      }}
    >
      <div className="modal" role="dialog" aria-modal="true" aria-labelledby="task-form-title">
        <div className="modal-header">
          <h2 id="task-form-title">{isEditing ? 'Editar tarea' : 'Nueva tarea'}</h2>
          <button
            type="button"
            className="icon-btn"
            aria-label="Cerrar formulario"
            onClick={onCancel}
          >
            <svg
              aria-hidden="true"
              viewBox="0 0 24 24"
              width="16"
              height="16"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.2"
              strokeLinecap="round"
            >
              <path d="M6 6l12 12M18 6 6 18" />
            </svg>
          </button>
        </div>

        <form className="task-form" onSubmit={handleSubmit}>
          <label htmlFor="task-title">
            Título <span className="required">*</span>
          </label>
          <input
            id="task-title"
            name="title"
            autoFocus
            placeholder="Ej. Configurar el pipeline de GitHub Actions"
            value={title}
            aria-invalid={Boolean(error)}
            onChange={(event) => {
              setTitle(event.target.value)
              if (error) setError('')
            }}
          />
          {error && (
            <p className="form-error" role="alert">
              {error}
            </p>
          )}

          <label htmlFor="task-description">Descripción</label>
          <textarea
            id="task-description"
            name="description"
            rows={3}
            placeholder="Detalles opcionales de la tarea"
            value={description}
            onChange={(event) => setDescription(event.target.value)}
          />

          <div className="form-row">
            <div className="field">
              <label htmlFor="task-priority">Prioridad</label>
              <select
                id="task-priority"
                name="priority"
                value={priority}
                onChange={(event) => setPriority(event.target.value)}
              >
                {PRIORITIES.map((option) => (
                  <option key={option} value={option}>
                    {option}
                  </option>
                ))}
              </select>
            </div>

            <div className="field">
              <label htmlFor="task-status">Estado</label>
              <select
                id="task-status"
                name="status"
                value={status}
                onChange={(event) => setStatus(event.target.value)}
              >
                {COLUMNS.map((column) => (
                  <option key={column.id} value={column.id}>
                    {column.title}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="modal-actions">
            <button type="button" className="btn btn-ghost" onClick={onCancel}>
              Cancelar
            </button>
            <button type="submit" className="btn btn-primary">
              {isEditing ? 'Guardar cambios' : 'Crear tarea'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default TaskForm
