import { createFileRoute } from '@tanstack/react-router'
import NoteDetailPage from '../components/pages/NoteDetailPage'

export const Route = createFileRoute('/_auth/note/$noteId')({
  component: NoteDetailPage
})
