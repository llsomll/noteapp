import { useParams, useRouter } from '@tanstack/react-router'
import { type NoteOut } from '../../api/api-client'
import { useState } from 'react';
import Grid from '@mui/material/Grid'
import { Box, Typography, useTheme, CircularProgress } from '@mui/material';
import NoteCard from '../NoteCard'
import NoteDialog from '../NoteDialog';
import { useFolders } from '../../hooks/useFolders';
import { useNotes } from '../../hooks/useNotes';

export default function FolderNotesPage() {
    const { palette } = useTheme();
    const { folderId } = useParams({ from: '/_auth/folder/$folderId' });
    const router = useRouter();

    const { foldersQuery } = useFolders();
    const { data: folders = [], isLoading: foldersLoading, isError: foldersError } = foldersQuery;
    const { notesQuery, updateNoteMutation, deleteNoteMutation } = useNotes();
    const { data: notes = [], isLoading, isError } = notesQuery;

    const [noteToEdit, setNoteToEdit] = useState<NoteOut | null>(null);
    const [dialogOpen, setDialogOpen] = useState(false);

    const folderMap = folders?.reduce((map, folder) => {
        map[folder.id] = folder.name;
        return map;
    }, {} as Record<string, string>) || {};

    const handleDeleteNote = (noteId: string) => {
        deleteNoteMutation.mutate({ noteId });
    };

    const folder = folders.find(f => f.id === folderId);
    const filteredNotes = notes.filter(note => note.folder_id === folderId);

    if (!folder) return <Typography color="error">Folder not found</Typography>;
    if (isLoading) return <CircularProgress />;
    if (isError) return <Typography color="error">Failed to load notes</Typography>

    return (
        <Box p={3}>
            <Typography
                variant="h4"
                fontWeight="bold"
                gutterBottom
                sx={{
                    borderBlockEnd: `solid 2px ${palette.primary.main}`,
                    paddingBottom: '4px',
                    marginBottom: '20px',
                    color: palette.primary.main
                }}
            >
                📁 {folder.name}
            </Typography>

            {filteredNotes.length === 0 ? (
                <Typography variant="body1">No notes in this folder yet.</Typography>
            ) : (
                <Grid container spacing={3}>
                    {filteredNotes.map(note => (
                        <Grid key={note.id} size={{ xs: 12, sm: 6, md: 4, lg: 3 }}>
                            <NoteCard
                                note={{
                                    ...note,
                                    content: note.content ?? '',
                                    title: note.title ?? '',
                                }}
                                onClick={() =>
                                    router.navigate({
                                        to: '/note/$noteId',
                                        params: { noteId: note.id },
                                    })
                                }
                                onStarToggle={() =>
                                    updateNoteMutation.mutate({
                                        noteId: note.id,
                                        data: { ...note, is_starred: !note.is_starred },
                                    })
                                }
                                onDelete={() => handleDeleteNote(note.id)}
                                onEdit={() => {
                                    setNoteToEdit(note);
                                    setDialogOpen(true);
                                }}
                                folderName={folderMap[note.folder_id ?? '']}
                            />
                        </Grid>
                    ))}
                </Grid>
            )}

            <NoteDialog
                open={dialogOpen}
                onClose={() => setDialogOpen(false)}
                onSubmit={(data) => {
                    if (noteToEdit) {
                        updateNoteMutation.mutate({ noteId: noteToEdit.id, data });
                    }
                    setDialogOpen(false);
                }}
                folders={folders}
                foldersLoading={foldersLoading}
                foldersError={foldersError}
                initialData={
                    noteToEdit
                        ? {
                            id: noteToEdit.id,
                            title: noteToEdit.title ?? '',
                            content: noteToEdit.content ?? '',
                            folder_id: noteToEdit.folder_id ?? '',
                        }
                        : null
                }
            />
        </Box>
    );
}
