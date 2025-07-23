import { useQueryClient } from '@tanstack/react-query';
import {
  useCreateNote,
  useDeleteNote,
  useUpdateNote,
  useGetNotes,
  useGetNote,
} from '../api/api-client/notes';

export function useNotes() {
  const queryClient = useQueryClient();

  const createNoteMutation = useCreateNote({
    mutation: {
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: ['/api/v1/note/'] });
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
      },
      onError: (error) => {
        console.error('Failed to update note', error);
      },
    },
  });

  const deleteNoteMutation = useDeleteNote({
    mutation: {
      onSuccess: () => {
        console.log('Deleted successfully');
        queryClient.invalidateQueries({ queryKey: ['/api/v1/note/'] });
      },
    },
  });

  const notesQuery = useGetNotes();

  return {
    createNoteMutation,
    updateNoteMutation,
    deleteNoteMutation,
    notesQuery,
  };
}

export function useSingleNote(noteId: string) {
  return useGetNote(noteId);
}
