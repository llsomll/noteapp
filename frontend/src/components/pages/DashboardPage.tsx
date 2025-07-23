import { Box, Typography, Card, CardContent, Button } from '@mui/material';
import Grid from '@mui/material/Grid';
import { useNavigate } from '@tanstack/react-router';
import AddIcon from '@mui/icons-material/Add';
import StarIcon from '@mui/icons-material/Star';
import FolderIcon from '@mui/icons-material/Folder';
import DescriptionIcon from '@mui/icons-material/Description';
import { useGetNotes, useGetFolders } from '../../api/api-client';

export default function DashboardPage() {
  const navigate = useNavigate();
  const { data: notes = [] } = useGetNotes();
  const { data: folders = [] } = useGetFolders();

  const totalNotes = notes.length;
  const totalFolders = folders.length;
  const starredNotes = notes.filter(n => n.is_starred);

  const folderColors = ['#E3F2FD', '#FFEBEE', '#DCEDC8', '#FFECB3', '#FFCCBC'];

  return (
    <Box p={3}>
      {/* Top Bar */}
      <Box display="flex" justifyContent="flex-end" alignItems="center" mb={3}>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={() => navigate({ to: '/notes' })}
        >
          New Note
        </Button>
      </Box>

      {/* Summary Cards */}
      <Grid container spacing={2} mb={4}>
        <Grid size={{ xs: 12, sm: 4 }}>
          <Card>
            <CardContent>
              <Box display="flex" alignItems="center" gap={2}>
                <DescriptionIcon color="primary" />
                <Box>
                  <Typography variant="subtitle2">Total Notes</Typography>
                  <Typography variant="h6">{totalNotes}</Typography>
                </Box>
              </Box>
            </CardContent>
          </Card>
        </Grid>

        <Grid size={{ xs: 12, sm: 4 }}>
          <Card>
            <CardContent>
              <Box display="flex" alignItems="center" gap={2}>
                <FolderIcon color="secondary" />
                <Box>
                  <Typography variant="subtitle2">Folders</Typography>
                  <Typography variant="h6">{totalFolders}</Typography>
                </Box>
              </Box>
            </CardContent>
          </Card>
        </Grid>

        <Grid size={{ xs: 12, sm: 4 }}>
          <Card>
            <CardContent>
              <Box display="flex" alignItems="center" gap={2}>
                <StarIcon color="warning" />
                <Box>
                  <Typography variant="subtitle2">Starred Notes</Typography>
                  <Typography variant="h6">{starredNotes.length}</Typography>
                </Box>
              </Box>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Folders Section */}
      {folders.length > 0 && (
        <>
          <Typography variant="h6" gutterBottom>📁 Folders</Typography>
          <Grid container spacing={2} mb={4}>
            {folders.map((folder, index) => (
              <Grid size={{ xs: 6, sm: 4, md: 3, lg: 2 }} key={folder.id}>
                <Card
                  onClick={() =>
                    navigate({
                      to: '/folder/$folderId', 
                      params: { folderId: folder.id },
                    })
                  }
                  sx={{
                    cursor: 'pointer', background: folderColors[index % folderColors.length], height: '80px', 
                    display: 'flex', alignItems: 'center', justifyContent: 'center'
                  }}
                >
                  <CardContent>
                    <Typography variant="subtitle1" fontWeight="bold" textAlign="center">
                      {folder.name}
                    </Typography>
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>
        </>
      )}

      {/* Starred Notes */}
      {starredNotes.length > 0 && (
        <>
          <Typography variant="h6" gutterBottom>⭐ Starred Notes</Typography>
          <Grid container spacing={2} mb={2}>
            {starredNotes.slice(0, 4).map(note => (
              <Grid size={{ xs: 12, sm: 6, md: 4, lg: 4 }} key={note.id}>
                <Card
                  onClick={() =>
                    navigate({
                      to: '/note/$noteId',
                      params: { noteId: note.id },
                    })
                  }
                  sx={{ cursor: 'pointer', background: '#fffbe6', height: '100px' }}
                >
                  <CardContent>
                    <Typography variant="subtitle2" color="primary">
                      {note.title}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      {(note.content ?? '').slice(0, 50)}...
                    </Typography>
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>
        </>
      )}

    </Box>
  );
}
