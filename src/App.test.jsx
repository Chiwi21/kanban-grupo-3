import { render, screen, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { beforeEach, describe, expect, it } from 'vitest'
import App from './App'
import { STORAGE_KEY } from './constants'

const getColumn = (name) => screen.getByRole('region', { name })

async function createTask(user, { title, description = '', priority = 'Media', status = 'pendiente' }) {
  await user.click(screen.getByRole('button', { name: 'Nueva tarea' }))
  await user.type(screen.getByLabelText(/título/i), title)
  if (description) {
    await user.type(screen.getByLabelText(/descripción/i), description)
  }
  await user.selectOptions(screen.getByLabelText(/prioridad/i), priority)
  await user.selectOptions(screen.getByLabelText(/estado/i), status)
  await user.click(screen.getByRole('button', { name: 'Crear tarea' }))
}

beforeEach(() => {
  window.localStorage.clear()
  window.localStorage.setItem(STORAGE_KEY, '[]')
})

describe('Tablero Kanban', () => {
  it('renderiza las tres columnas con su estado vacío', () => {
    render(<App />)

    expect(screen.getByRole('region', { name: 'Pendiente' })).toBeInTheDocument()
    expect(screen.getByRole('region', { name: 'En progreso' })).toBeInTheDocument()
    expect(screen.getByRole('region', { name: 'Completado' })).toBeInTheDocument()
    expect(screen.getAllByText('No hay tareas todavía.')).toHaveLength(3)
  })

  it('crea una nueva tarea y la guarda en localStorage', async () => {
    const user = userEvent.setup()
    render(<App />)

    await createTask(user, {
      title: 'Configurar CI',
      description: 'Pipeline en GitHub Actions',
      priority: 'Alta',
    })

    const pendiente = getColumn('Pendiente')
    expect(within(pendiente).getByText('Configurar CI')).toBeInTheDocument()
    expect(within(pendiente).getByText('Pipeline en GitHub Actions')).toBeInTheDocument()
    expect(within(pendiente).getByText('Alta')).toBeInTheDocument()

    const stored = JSON.parse(window.localStorage.getItem(STORAGE_KEY))
    expect(stored).toHaveLength(1)
    expect(stored[0]).toMatchObject({
      title: 'Configurar CI',
      description: 'Pipeline en GitHub Actions',
      priority: 'Alta',
      status: 'pendiente',
    })
  })

  it('cambia una tarea de estado usando las flechas de la tarjeta', async () => {
    const user = userEvent.setup()
    render(<App />)

    await createTask(user, { title: 'Desplegar en Vercel' })

    await user.click(
      screen.getByRole('button', { name: 'Mover a En progreso: Desplegar en Vercel' }),
    )
    expect(within(getColumn('En progreso')).getByText('Desplegar en Vercel')).toBeInTheDocument()
    expect(
      within(getColumn('Pendiente')).queryByText('Desplegar en Vercel'),
    ).not.toBeInTheDocument()

    await user.click(
      screen.getByRole('button', { name: 'Mover a Completado: Desplegar en Vercel' }),
    )
    expect(within(getColumn('Completado')).getByText('Desplegar en Vercel')).toBeInTheDocument()
    expect(
      within(getColumn('En progreso')).queryByText('Desplegar en Vercel'),
    ).not.toBeInTheDocument()
  })

  it('edita el título y la prioridad de una tarea existente', async () => {
    const user = userEvent.setup()
    render(<App />)

    await createTask(user, { title: 'Tarea sin nombre' })

    await user.click(screen.getByRole('button', { name: 'Editar tarea: Tarea sin nombre' }))
    expect(screen.getByRole('heading', { name: 'Editar tarea' })).toBeInTheDocument()

    const titleInput = screen.getByLabelText(/título/i)
    await user.clear(titleInput)
    await user.type(titleInput, 'Tarea corregida')
    await user.selectOptions(screen.getByLabelText(/prioridad/i), 'Alta')
    await user.click(screen.getByRole('button', { name: 'Guardar cambios' }))

    expect(screen.getByText('Tarea corregida')).toBeInTheDocument()
    expect(screen.queryByText('Tarea sin nombre')).not.toBeInTheDocument()
    expect(screen.getByText('Alta')).toBeInTheDocument()
  })

  it('elimina una tarea del tablero', async () => {
    const user = userEvent.setup()
    render(<App />)

    await createTask(user, { title: 'Revisar Pull Request' })
    expect(screen.getByText('Revisar Pull Request')).toBeInTheDocument()

    await user.click(screen.getByRole('button', { name: 'Eliminar tarea: Revisar Pull Request' }))

    expect(screen.queryByText('Revisar Pull Request')).not.toBeInTheDocument()
    expect(screen.getAllByText('No hay tareas todavía.')).toHaveLength(3)
  })

  it('muestra un error si se intenta crear una tarea sin título', async () => {
    const user = userEvent.setup()
    render(<App />)

    await user.click(screen.getByRole('button', { name: 'Nueva tarea' }))
    await user.click(screen.getByRole('button', { name: 'Crear tarea' }))

    expect(screen.getByRole('alert')).toHaveTextContent('El título es obligatorio.')
    expect(screen.getByRole('dialog')).toBeInTheDocument()
  })

  it('filtra las tareas con el buscador', async () => {
    const user = userEvent.setup()
    render(<App />)

    await createTask(user, { title: 'Documentar el pipeline' })
    await createTask(user, { title: 'Publicar en Vercel' })

    await user.type(screen.getByRole('searchbox', { name: 'Buscar tareas' }), 'vercel')

    expect(screen.getByText('Publicar en Vercel')).toBeInTheDocument()
    expect(screen.queryByText('Documentar el pipeline')).not.toBeInTheDocument()
  })
    it('limpia todas las tareas completadas', async () => {
    const user = userEvent.setup()
    render(<App />)

    await createTask(user, { title: 'Tarea completada', status: 'completado' })
    await createTask(user, { title: 'Tarea pendiente' })

    await user.click(screen.getByRole('button', { name: /limpiar completadas/i }))

    expect(screen.queryByText('Tarea completada')).not.toBeInTheDocument()
    expect(screen.getByText('Tarea pendiente')).toBeInTheDocument()
  })
})
