import { create } from 'zustand';
import { query, collection, where, orderBy, limit, onSnapshot } from 'firebase/firestore';
import { db } from '../firebase';

export const useNoticeStore = create((set) => ({
  notices: [],
  isLoading: true,
  error: null,
  
  // Initialize real-time listener for active notices
  subscribeToNotices: (count = 5) => {
    try {
      // First check if we have the required index
      const q = query(
        collection(db, 'notices'),
        where('isActive', '==', true),
        orderBy('createdAt', 'desc'),
        limit(count)
      );
      
      // For debugging
      console.log('Setting up notices listener with query:', {
        collection: 'notices',
        where: ['isActive', '==', true],
        orderBy: ['createdAt', 'desc'],
        limit: count
      });
      
      // Add error boundary to handle index creation
      const handleError = (error) => {
        console.error('Error in notices listener:', error);
        if (error.code === 'failed-precondition' && error.message.includes('index')) {
          console.error('Missing or incompatible index. Please create the required index in Firebase Console.');
        }
        set({ 
          error: error.message,
          isLoading: false 
        });
      };
      
      const unsubscribe = onSnapshot(
        q,
        (snapshot) => {
          try {
            const notices = [];
            snapshot.forEach((doc) => {
              try {
                const data = doc.data();
                if (!data) return;
                
                notices.push({
                  id: doc.id,
                  ...data,
                  createdAt: data.createdAt?.toDate?.(),
                  updatedAt: data.updatedAt?.toDate?.()
                });
              } catch (error) {
                console.error('Error processing notice:', error);
              }
            });
            
            set({ 
              notices,
              isLoading: false,
              error: null 
            });
          } catch (error) {
            console.error('Error in notices snapshot:', error);
            set({ 
              error: error.message,
              isLoading: false 
            });
          }
        },
        (error) => {
          console.error('Notices listener error:', error);
          set({ 
            error: error.message,
            isLoading: false 
          });
        }
      );
      
      // Return cleanup function
      return () => {
        try {
          unsubscribe();
        } catch (error) {
          console.error('Error unsubscribing from notices:', error);
        }
      };
    } catch (error) {
      console.error('Error setting up notices listener:', error);
      set({ 
        error: error.message,
        isLoading: false 
      });
      return () => {}; // Return empty cleanup function
    }
  },
  
  // Get active notices count
  getActiveNoticesCount: async () => {
    try {
      const { getCountFromServer, collection, query, where } = await import('firebase/firestore');
      const coll = collection(db, 'notices');
      const q = query(coll, where('isActive', '==', true));
      const snapshot = await getCountFromServer(q);
      return snapshot.data().count;
    } catch (error) {
      console.error('Error getting active notices count:', error);
      return 0;
    }
  }
}));
