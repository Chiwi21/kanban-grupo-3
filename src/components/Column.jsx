import TaskCard from './TaskCard'

function Column({ column, tasks, query, onAdd, onEdit, onDelete, onMove }) {
  return (
    <section className={`column column-${column.id}`} aria-label={column.title}>
      <header className="column-header">
        <div className="column-title">
          <span className={`status-dot status-${column.id}`} aria-hidden="true" />
          <h2>{column.title}</h2>
          <span className="count" title={`${tasks.length} tareas`}>
            {tasks.length}
          </span>
        </div>
        <button
          type="button"
          className="icon-btn"
          aria-label={`Añadir tarea a ${column.title}`}
          title={`Añadir tarea a ${column.title}`}
          onClick={onAdd}
        >
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
        </button>
      </header>

      <div className="column-body">
        {tasks.length === 0 ? (
          <p className="column-empty">
            {query.trim() ? 'No hay coincidencias.' : 'No hay tareas todavía.'}
          </p>
        ) : (
          tasks.map((task) => (
            <TaskCard
              key={task.id}
              task={task}
              onEdit={onEdit}
              onDelete={onDelete}
              onMove={onMove}
            />
          ))
        )}
      </div>

      <button type="button" className="column-add" onClick={onAdd}>
        <svg
          aria-hidden="true"
          viewBox="0 0 24 24"
          width="15"
          height="15"
          fill="none"
          stroke="currentColor"
          strokeWidth="2.4"
          strokeLinecap="round"
        >
          <path d="M12 5v14M5 12h14" />
        </svg>
        Añadir tarea
      </button>
    </section>
  )
}

export default Column
