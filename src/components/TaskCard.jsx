import { COLUMNS } from '../constants'

const priorityClass = {
  Alta: 'priority-high',
  Media: 'priority-medium',
  Baja: 'priority-low',
}

function TaskCard({ task, onEdit, onDelete, onMove }) {
  const currentIndex = COLUMNS.findIndex((column) => column.id === task.status)
  const previous = COLUMNS[currentIndex - 1]
  const next = COLUMNS[currentIndex + 1]
  const priority = task.priority ?? 'Media'

  const created = task.createdAt ? new Date(task.createdAt) : null
  const createdLabel =
    created && !Number.isNaN(created.getTime())
      ? created.toLocaleDateString('es-EC', { day: '2-digit', month: 'short' })
      : null

  return (
    <article className="task-card">
      <div className="task-top">
        <span className={`priority ${priorityClass[priority] ?? 'priority-medium'}`}>
          {priority}
        </span>
        <div className="task-tools">
          <button
            type="button"
            className="icon-btn"
            aria-label={`Editar tarea: ${task.title}`}
            title="Editar tarea"
            onClick={() => onEdit(task)}
          >
            <svg
              aria-hidden="true"
              viewBox="0 0 24 24"
              width="15"
              height="15"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.9"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M12 20h9" />
              <path d="M16.5 3.5a2.1 2.1 0 0 1 3 3L7 19l-4 1 1-4Z" />
            </svg>
          </button>
          <button
            type="button"
            className="icon-btn danger"
            aria-label={`Eliminar tarea: ${task.title}`}
            title="Eliminar tarea"
            onClick={() => onDelete(task.id)}
          >
            <svg
              aria-hidden="true"
              viewBox="0 0 24 24"
              width="15"
              height="15"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.9"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M3 6h18" />
              <path d="M8 6V4h8v2" />
              <path d="m19 6-1 14H6L5 6" />
              <path d="M10 11v6M14 11v6" />
            </svg>
          </button>
        </div>
      </div>

      <h3 className="task-title">{task.title}</h3>
      {task.description && <p className="task-description">{task.description}</p>}

      <div className="task-footer">
        <span className="task-date">{createdLabel ? `Creada ${createdLabel}` : ''}</span>
        <div className="task-moves">
          {previous ? (
            <button
              type="button"
              className="move-btn"
              aria-label={`Mover a ${previous.title}: ${task.title}`}
              title={`Mover a ${previous.title}`}
              onClick={() => onMove(task.id, previous.id)}
            >
              ←
            </button>
          ) : (
            <span className="move-spacer" aria-hidden="true" />
          )}
          {next ? (
            <button
              type="button"
              className="move-btn"
              aria-label={`Mover a ${next.title}: ${task.title}`}
              title={`Mover a ${next.title}`}
              onClick={() => onMove(task.id, next.id)}
            >
              →
            </button>
          ) : (
            <span className="move-spacer" aria-hidden="true" />
          )}
        </div>
      </div>
    </article>
  )
}

export default TaskCard
