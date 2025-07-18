import { createFileRoute } from '@tanstack/react-router'
import FolderNotesPage from '../components/pages/FolderNotesPage'

export const Route = createFileRoute('/_auth/folder/$folderId')({
  component: FolderNotesPage
})
