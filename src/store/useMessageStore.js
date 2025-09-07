import { create } from 'zustand';
import { query, collection, where, orderBy, limit, onSnapshot } from 'firebase/firestore';
import { db } from '../firebase';

export const useMessageStore = create((set) => ({
  messages: [],
  unreadCount: 0,
  isLoading: true,
  error: null,
  
  // Initialize real-time listener for messages
  subscribeToMessages: () => {
    try {
      const q = query(
        collection(db, 'messages'),
        orderBy('createdAt', 'desc')
      );
      
      const unsubscribe = onSnapshot(
        q,
        (snapshot) => {
          const messages = [];
          let unread = 0;
          
          snapshot.forEach((doc) => {
            try {
              const data = doc.data();
              if (!data) return;
              
              messages.push({
                id: doc.id,
                ...data,
                createdAt: data.createdAt?.toDate?.(),
                updatedAt: data.updatedAt?.toDate?.()
              });
              
              if (data.status === 'unread') unread++;
            } catch (error) {
              console.error('Error processing message:', error);
            }
          });
          
          set({ 
            messages,
            unreadCount: unread,
            isLoading: false,
            error: null 
          });
        },
        (error) => {
          console.error('Error fetching messages:', error);
          set({ 
            isLoading: false, 
            error: error.message || 'Failed to load messages' 
          });
        }
      );

      // Return the unsubscribe function
      return () => {
        try {
          unsubscribe();
        } catch (e) {
          console.error('Error unsubscribing from messages:', e);
        }
      };
    } catch (error) {
      console.error('Error setting up message listener:', error);
      set({ 
        error: error.message,
        isLoading: false 
      });
      return () => {}; // Return empty cleanup function
    }
  }
}));
