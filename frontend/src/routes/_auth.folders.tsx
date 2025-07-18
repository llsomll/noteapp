import { createFileRoute } from '@tanstack/react-router'
import FoldersPage from '../components/pages/FoldersPage'

export const Route = createFileRoute('/_auth/folders')({
  component: FoldersPage,
})


