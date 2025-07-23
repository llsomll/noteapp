import { Button, CircularProgress, Typography, Stack } from '@mui/material'
import { Box } from '@mui/system'
import { useParams, useNavigate } from '@tanstack/react-router'
import { useGetNote, useDeleteNote, useUpdateNote, useGetFolders } from '../../api/api-client'
import NotFound from './NotFound'
import NoteDialog from '../NoteDialog'
import { useState } from 'react'

function NoteDetailPage() {
    const { noteId } = useParams({ from: '/_auth/note/$noteId' })
    const navigate = useNavigate()

    const { data: note, isLoading, isError, refetch } = useGetNote(noteId)
    const { data: folders, isLoading: foldersLoading, isError: foldersError } = useGetFolders()

    const deleteNoteMutation = useDeleteNote()
    const updateNoteMutation = useUpdateNote()

    const [isDialogOpen, setDialogOpen] = useState(false)

    const folderMap = folders?.reduce((map, folder) => {
        map[folder.id] = folder.name;
        return map;
    }, {} as Record<string, string>) || {};

    const handleDelete = async () => {
        if (confirm('Are you sure you want to delete this note?')) {
            try {
                await deleteNoteMutation.mutateAsync({ noteId })
                navigate({ to: '/notes' }) // Redirect after deletion
            } catch (error) {
                console.error('Failed to delete note:', error)
            }
        }
    }

    const handleEdit = () => {
        setDialogOpen(true)
    }

    const handleUpdate = (formData: { title: string; content: string; folder_id?: string }) => {
        updateNoteMutation.mutate(
            { noteId, data: formData },
            {
                onSuccess: () => {
                    refetch() // immediate UI update
                    setDialogOpen(false)
                },
                onError: (error) => {
                    console.error('Failed to update note:', error)
                },
            }
        )
    }


    if (isLoading) return <CircularProgress />
    if (isError || !note) return <NotFound />
    if (!noteId) return <Typography color="error">Invalid note ID</Typography>

    return (
        <Box p={4}>
            {note.folder_id && folderMap[note.folder_id] && (
                <Typography variant="h6" color="primary">
                    {folderMap[note.folder_id]}
                </Typography>
            )}
            <Typography variant="h4" gutterBottom>{note.title}</Typography>
            <Typography variant="subtitle2" color="text.secondary" gutterBottom>
                {new Date(note.created_at).toLocaleString()}
            </Typography>
            <Typography
                variant="body1"
                mt={2}
                sx={{ whiteSpace: 'pre-wrap' }}
            >
                {note.content}
            </Typography>
            <Stack direction="row" justifyContent="space-between" mb={2} mt={5}>
                <Button onClick={() => navigate({ to: '/notes' })}>Back</Button>
                <Stack spacing={3} direction="row">
                    <Button variant="contained" onClick={handleEdit}>Edit</Button>
                    <Button variant="contained" color="error" onClick={handleDelete}>Delete</Button>
                </Stack>
            </Stack>

            <NoteDialog
                open={isDialogOpen}
                onClose={() => setDialogOpen(false)}
                onSubmit={handleUpdate}
                folders={folders}
                foldersLoading={foldersLoading}
                foldersError={foldersError}
                initialData={{
                    id: note.id,
                    title: note.title,
                    content: note.content ?? '',
                    folder_id: note.folder_id,
                }}
            />
        </Box>
    )
}

export default NoteDetailPage
