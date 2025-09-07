import { useQuery } from '@tanstack/react-query';
import { collection, query, where, orderBy, limit, getDocs } from 'firebase/firestore';
import { db } from '../firebase';

export const useRecentNotices = (count = 5) => {
  return useQuery({
    queryKey: ['recentNotices', count],
    queryFn: async () => {
      const noticesRef = collection(db, 'notices');
      const q = query(
        noticesRef,
        where('isActive', '==', true),
        orderBy('createdAt', 'desc'),
        limit(count)
      );
      
      const querySnapshot = await getDocs(q);
      return querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
        // Convert Firestore Timestamp to Date if needed
        createdAt: doc.data().createdAt?.toDate()?.toISOString() || new Date().toISOString(),
      }));
    },
    staleTime: 5 * 60 * 1000, // 5 minutes
    refetchOnWindowFocus: false
  });
};
