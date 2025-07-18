import { Card, CardContent, IconButton, Typography, Box } from '@mui/material'
import StarIcon from '@mui/icons-material/Star'
import StarBorderIcon from '@mui/icons-material/StarBorder'
import DeleteIcon from '@mui/icons-material/Delete'
import EditIcon from '@mui/icons-material/Edit'

type Note = {
  id: string
  title: string
  content: string
  created_at: string
  is_starred?: boolean 
  folder_id?: string | null
}

type Props = {
  note: Note
  onClick: () => void
  onStarToggle: () => void
  onDelete: () => void
  onEdit: () => void
  folderName?: string
}

export default function NoteCard({
  note,
  onClick,
  onStarToggle,
  onDelete,
  onEdit,
  folderName,
}: Props) {
  return (
    <Card
      onClick={onClick}
      sx={{
        boxShadow: 'none',
        position: 'relative',
        background: note.is_starred ? '#ffdeec' : '#feefbc',
        padding: '0.5em 0.5em',
        overflow: 'hidden',
        height: 220,
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
        cursor: 'pointer',
        '&::before': {
          content: '""',
          position: 'absolute',
          top: 0,
          right: 0,
          borderStyle: 'solid',
          borderWidth: '0 16px 16px 0',
          borderColor: note.is_starred ? '#fff #fff #ff78b2 #ff78b2' : '#fff #fff #fccb26 #fccb26',
          width: 0,
          height: 0,
          display: 'block',
        },
      }}
    >
      <CardContent sx={{ flexGrow: 1, overflow: 'hidden' }}>
        <IconButton
          onClick={(e) => {
            e.stopPropagation()
            onStarToggle()
          }}
          sx={{ position: 'absolute', top: 8, right: 8 }}
        >
          {note.is_starred ? <StarIcon sx={{ color: "#ff2c86" }} /> : <StarBorderIcon />}
        </IconButton>

        {folderName && (
          <Typography variant="subtitle2" color="primary">
            {folderName}
          </Typography>
        )}

        <Typography variant="h6" gutterBottom>{note.title}</Typography>
        <Typography variant="body2" color="text.secondary">
          {note.content.slice(0, 100)}...
        </Typography>
      </CardContent>

      <Box display="flex" justifyContent="space-between" alignItems="center">
        <Typography px={2} fontSize="12px" color="text.secondary">
          {new Date(note.created_at).toLocaleString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric',
            hour: 'numeric',
            minute: '2-digit',
            hour12: true,
          })}
        </Typography>
        <Box px={1} pb={1} display="flex" gap={1}>
          <IconButton onClick={(e) => { e.stopPropagation(); onDelete(); }}>
            <DeleteIcon />
          </IconButton>
          <IconButton onClick={(e) => { e.stopPropagation(); onEdit(); }}>
            <EditIcon />
          </IconButton>
        </Box>
      </Box>
    </Card>
  )
}
