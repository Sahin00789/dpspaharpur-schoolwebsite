import { useMutation, useQueryClient } from '@tanstack/react-query';
import { doc, updateDoc, deleteDoc } from 'firebase/firestore';
import { db } from '../firebase';
import { toast } from 'react-hot-toast';

export const useUpdateMessageStatus = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async ({ messageId, status }) => {
      await updateDoc(doc(db, 'messages', messageId), {
        status,
        updatedAt: new Date()
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries(['messages']);
    },
    onError: (error) => {
      console.error('Error updating message status:', error);
      toast.error('Failed to update message status');
    }
  });
};

export const useDeleteMessage = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (messageId) => {
      await deleteDoc(doc(db, 'messages', messageId));
    },
    onSuccess: () => {
      toast.success('Message deleted successfully');
      queryClient.invalidateQueries(['messages']);
    },
    onError: (error) => {
      console.error('Error deleting message:', error);
      toast.error('Failed to delete message');
    }
  });
};
