import { createFileRoute } from '@tanstack/react-router'
import NotesPage from '../components/pages/NotesPage'

export const Route = createFileRoute('/_auth/notes')({
  component: NotesPage,
})

