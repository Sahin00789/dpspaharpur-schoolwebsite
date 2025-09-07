import { create } from 'zustand';
import { collection, query, where, getDocs, orderBy, doc, getDoc, updateDoc } from 'firebase/firestore';
import { db, auth } from '../firebase';
import { toast } from 'react-hot-toast';

const useAdmissionStore = create((set, get) => ({
  applications: [],
  loading: false,
  error: null,
  lastFetched: null,
  
  // Fetch all applications
  fetchApplications: async () => {
    // Return cached data if it's fresh (less than 1 minute old)
    if (get().lastFetched && (Date.now() - get().lastFetched) < 60000) {
      return get().applications;
    }
    
    set({ loading: true, error: null });
    
    try {
      const { currentUser } = auth;
      if (!currentUser) {
        throw new Error('User not authenticated');
      }
      
      // Force token refresh to ensure we have the latest claims
      await currentUser.getIdToken(true);
      
      const q = query(
        collection(db, 'applications'),
        orderBy('createdAt', 'desc')
      );
      
      const querySnapshot = await getDocs(q);
      const applications = [];
      
      querySnapshot.forEach((doc) => {
        applications.push({ 
          id: doc.id, 
          ...doc.data(),
          // Ensure required fields have defaults
          status: doc.data().status || 'pending',
          createdAt: doc.data().createdAt?.toDate() || new Date(),
          updatedAt: doc.data().updatedAt?.toDate() || new Date()
        });
      });
      
      set({
        applications,
        loading: false,
        lastFetched: Date.now(),
        error: null
      });
      
      return applications;
    } catch (error) {
      console.error('Error fetching applications:', error);
      let errorMessage = 'Failed to fetch applications';
      
      if (error.code === 'permission-denied') {
        errorMessage = 'You do not have permission to view applications. Please ensure you are logged in as an admin.';
      } else if (error.message === 'User not authenticated') {
        errorMessage = 'Please log in to view applications';
      } else {
        errorMessage = error.message || errorMessage;
      }
      
      toast.error(errorMessage);
      set({ 
        error: errorMessage,
        loading: false 
      });
      return [];
    }
  },
  
  // Get application by ID
  getApplicationById: (id) => {
    return get().applications.find(app => app.id === id);
  },
  
  // Get applications by status
  getApplicationsByStatus: (status) => {
    if (status === 'all') return get().applications;
    return get().applications.filter(app => app.status === status);
  },
  
  // Update application data (status, lock status, etc.)
  updateApplicationStatus: async (id, updates) => {
    const { currentUser } = auth;
    if (!currentUser) {
      throw new Error('User not authenticated');
    }

    try {
      set({ loading: true, error: null });
      
      // Force token refresh to ensure we have the latest claims
      await currentUser.getIdToken(true);
      
      const applicationRef = doc(db, 'applications', id);
      const applicationDoc = await getDoc(applicationRef);
      
      if (!applicationDoc.exists()) {
        throw new Error('Application not found');
      }
      
      // Prepare update data with updatedAt timestamp
      const updateData = {
        ...updates,
        updatedAt: new Date()
      };
      
      // Update the document
      await updateDoc(applicationRef, updateData);
      
      // Update local state
      set(state => ({
        applications: state.applications.map(app => 
          app.id === id 
            ? { ...app, ...updateData } 
            : app
        )
      }));
      
      return true;
    } catch (error) {
      console.error('Error updating application:', error);
      set({ error: error.message });
      throw error;
    } finally {
      set({ loading: false });
    }
  },
  
  // Clear the store
  clearStore: () => set({ 
    applications: [], 
    loading: false, 
    error: null, 
    lastFetched: null 
  })
}));

export default useAdmissionStore;
