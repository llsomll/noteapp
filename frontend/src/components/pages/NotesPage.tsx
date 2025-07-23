import { useState } from 'react';
import { Box, Typography, CircularProgress, useTheme, Switch, FormControlLabel } from '@mui/material';
import Grid from '@mui/material/Grid';
import Fab from '@mui/material/Fab';
import AddIcon from '@mui/icons-material/Add';
import { useQueryClient } from '@tanstack/react-query';
import type { NoteOut } from '../../api/api-client/model';
import { useGetNotes, useDeleteNote, useCreateNote, useUpdateNote } from '../../api/api-client/notes';
import { useGetFolders } from '../../api/api-client';
import NoteDialog from '../NoteDialog';
import { useRouter } from '@tanstack/react-router'
import NoteCard from '../NoteCard';

export default function NotesPage() {
  const router = useRouter()
  const { palette } = useTheme()
  const { data: notes, isLoading, isError } = useGetNotes();
  const [isDialogOpen, setDialogOpen] = useState(false);
  const [noteToEdit, setNoteToEdit] = useState<NoteOut | null>(null);
  const [showStarredOnly, setShowStarredOnly] = useState(false);


  const queryClient = useQueryClient();

  const { data: folders, isLoading: foldersLoading, isError: foldersError } = useGetFolders();

  const folderMap = folders?.reduce((map, folder) => {
    map[folder.id] = folder.name;
    return map;
  }, {} as Record<string, string>) || {};


  const deleteNoteMutation = useDeleteNote({
    mutation: {
      onSuccess: () => {
        console.log('Deleted successfully');
        queryClient.invalidateQueries({ queryKey: ['/api/v1/note/'] });
      },
    },
  });

  const createNoteMutation = useCreateNote({
    mutation: {
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: ['/api/v1/note/'] });
        setDialogOpen(false);
      },
      onError: (error) => {
        console.error('Failed to create note', error);
      },
    },
  });

  const updateNoteMutation = useUpdateNote({
    mutation: {
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: ['/api/v1/note/'] });
        setDialogOpen(false);
      },
      onError: (error) => {
        console.error('Failed to update note', error);
      },
    },
  });

  const handleDelete = (noteId: string) => {
    deleteNoteMutation.mutate({ noteId });
  };

  const handleNoteSubmit = (data: { id?: string; title: string; content: string; folder_id?: string }) => {
    if (data.id) {
      updateNoteMutation.mutate({ noteId: data.id, data });
    } else {
      console.log("Creating note with:", data);
      createNoteMutation.mutate({ data });
    }
  };

  const handleCloseDialog = () => {
    setDialogOpen(false);
    setNoteToEdit(null); // reset noteToEdit on close
  };


  if (isLoading) return <CircularProgress />;
  if (isError || !notes) return <Typography color="error">Failed to load notes</Typography>;

  const sortedNotes = [...notes].sort(
    (a, b) => new Date(a.created_at).getTime() - new Date(b.created_at).getTime()
  );

  return (
    <Box p={3}>
      <Typography
        variant="h4"
        fontWeight="bold"
        gutterBottom
        sx={{
          borderBlockEnd: `solid 2px ${palette.primary.main}`,
          writingMode: 'horizontal-tb',
          paddingBottom: '4px',
          marginBottom: '20px',
          color: palette.primary.main
        }}
      >
        Notes
      </Typography>

      <Box mb={2} display="flex" justifyContent="flex-end">
        <FormControlLabel
          control={
            <Switch
              checked={showStarredOnly}
              onChange={(e) => setShowStarredOnly(e.target.checked)}
              color="primary"
            />
          }
          label="Starred Only"
          labelPlacement="start"
        />
      </Box>

      <Grid container spacing={3}>
        {(showStarredOnly ? sortedNotes.filter((note) => note.is_starred) : sortedNotes).map((note) => (
          <Grid key={note.id} size={{ xs: 12, sm: 6, md: 4, lg: 3 }}>
            <NoteCard
              note={{
                ...note,
                content: note.content ?? '',
              }}
              folderName={note.folder_id ? folderMap[note.folder_id] : undefined}
              onClick={() =>
                router.navigate({ to: '/note/$noteId', params: { noteId: note.id } })
              }
              onStarToggle={() => {
                updateNoteMutation.mutate({
                  noteId: note.id,
                  data: { ...note, is_starred: !note.is_starred },
                })
              }}
              onDelete={() => handleDelete(note.id)}
              onEdit={() => {
                setNoteToEdit(note)
                setDialogOpen(true)
              }}
            />

          </Grid>
        ))}
      </Grid>
      <Fab
        color="primary"
        aria-label="add"
        onClick={() => { setNoteToEdit(null); setDialogOpen(true); }}
        sx={{
          position: 'fixed',
          bottom: 50,
          right: 50,
          width: 60,
          height: 60,
        }}
      >
        <AddIcon sx={{ fontSize: 35 }} />
      </Fab>

      <NoteDialog
        open={isDialogOpen}
        onClose={handleCloseDialog}
        onSubmit={handleNoteSubmit}
        folders={folders}
        foldersLoading={foldersLoading}
        foldersError={foldersError}
        initialData={
          noteToEdit
            ? {
              ...noteToEdit,
              content: noteToEdit.content ?? '',
            }
            : null
        }
      />
    </Box>
  );
}