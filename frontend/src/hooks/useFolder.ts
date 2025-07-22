import { useCreateFolder, useDeleteFolder, useUpdateFolder } from "../api/api-client";
import { useQueryClient } from "@tanstack/react-query";

export function useFolder() {
    const queryClient = useQueryClient();

    const createFolderMutation = useCreateFolder({
        mutation: {
            onSuccess: () => {
                queryClient.invalidateQueries({ queryKey: ['/api/v1/folder/'] });
            },
            onError: (error) => {
                console.error('Failed to create folder', error);
            },
        },
    });

    const updateFolderMutation = useUpdateFolder({
        mutation: {
            onSuccess: () => {
                queryClient.invalidateQueries({ queryKey: ['/api/v1/folder/'] });
            },
        },
    });

    const deleteFolderMutation = useDeleteFolder({
        mutation: {
            onSuccess: () => {
                queryClient.invalidateQueries({ queryKey: ['/api/v1/folder/'] });
            },
        },
    });

    return { 
        createFolderMutation, 
        updateFolderMutation, 
        deleteFolderMutation 
    };
}

