import { db, storage } from '../firebase';
import { 
  collection, 
  doc, 
  setDoc, 
  getDoc, 
  updateDoc, 
  query, 
  where, 
  getDocs, 
  serverTimestamp,
  orderBy
} from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { v4 as uuidv4 } from 'uuid';

const ADMISSION_COLLECTION = 'admissionApplications';

// Submit a new admission application
export const submitAdmissionApplication = async (userId, applicationData) => {
  try {
    const applicationId = uuidv4();
    const applicationRef = doc(db, ADMISSION_COLLECTION, applicationId);
    
    await setDoc(applicationRef, {
      ...applicationData,
      id: applicationId,
      userId,
      status: 'pending',
      submittedAt: serverTimestamp(),
      updatedAt: serverTimestamp()
    });
    
    return { success: true, applicationId };
  } catch (error) {
    console.error('Error submitting application:', error);
    return { success: false, error: error.message };
  }
};

// Helper function to convert Firestore timestamps to JS dates
const convertTimestamps = (data) => {
  if (!data) return data;
  
  const result = { ...data };
  
  // Convert Firestore timestamps to JS dates
  if (result.submittedAt?.toDate) {
    result.submittedAt = result.submittedAt.toDate();
  }
  if (result.updatedAt?.toDate) {
    result.updatedAt = result.updatedAt.toDate();
  }
  
  return result;
};

// Get admission application by user ID
export const getApplicationByUserId = async (userId) => {
  try {
    if (!userId) {
      console.error('No user ID provided');
      return null;
    }
    
    const q = query(
      collection(db, ADMISSION_COLLECTION),
      where('userId', '==', userId)
    );
    
    const querySnapshot = await getDocs(q);
    if (querySnapshot.empty) {
      console.log('No application found for user:', userId);
      return null;
    }
    
    // Return the first application (should only be one per user)
    const doc = querySnapshot.docs[0];
    const appData = {
      id: doc.id,
      ...doc.data(),
      // Add any default values if needed
      status: doc.data().status || 'pending',
    };
    
    console.log('Fetched application data:', appData);
    return convertTimestamps(appData);
  } catch (error) {
    console.error('Error getting application:', error);
    throw error; // Re-throw to be handled by the caller
  }
};

// Update application status (admin only)
export const updateApplicationStatus = async (applicationId, status, adminData = {}) => {
  try {
    const applicationRef = doc(db, ADMISSION_COLLECTION, applicationId);
    const updateData = {
      status,
      updatedAt: serverTimestamp(),
      ...adminData
    };
    
    // If status is approved, set exam date if not provided
    if (status === 'approved' && !updateData.examDate) {
      // Default to 2 weeks from now
      const examDate = new Date();
      examDate.setDate(examDate.getDate() + 14);
      updateData.examDate = examDate.toISOString();
      updateData.examTime = updateData.examTime || '10:00 AM';
      updateData.examVenue = updateData.examVenue || 'Main Campus';
    }
    
    await updateDoc(applicationRef, updateData);
    return { success: true, data: updateData };
  } catch (error) {
    console.error('Error updating application status:', error);
    return { success: false, error: error.message };
  }
};

// Get all applications (admin only)
export const getAllApplications = async (status = null) => {
  try {
    // Get current user
    const { getAuth } = await import('firebase/auth');
    const auth = getAuth();
    const currentUser = auth.currentUser;
    
    if (!currentUser) {
      throw new Error('User not authenticated');
    }
    
    // Verify admin status
    try {
      const userDoc = await getDoc(doc(db, 'users', currentUser.uid));
      if (!userDoc.exists() || !userDoc.data().isAdmin) {
        console.error('User is not an admin:', currentUser.uid);
        throw new Error('Insufficient permissions');
      }
    } catch (error) {
      console.error('Error verifying admin status:', error);
      throw error;
    }
    
    console.log('Fetching applications with status:', status);
    let q = query(
      collection(db, 'admissionApplications'),
      orderBy('submittedAt', 'desc')
    );
    
    console.log('Query created, adding status filter if needed');
    
    if (status) {
      q = query(q, where('status', '==', status));
    }
    
    console.log('Executing Firestore query...');
    const querySnapshot = await getDocs(q);
    console.log(`Found ${querySnapshot.docs.length} applications`);
    return querySnapshot.docs.map(doc => {
      const data = doc.data();
      // Convert Firestore timestamp to Date
      const submittedAt = data.submittedAt?.toDate ? data.submittedAt.toDate() : null;
      const updatedAt = data.updatedAt?.toDate ? data.updatedAt.toDate() : null;
      const examDate = data.examDate ? new Date(data.examDate) : null;
      
      return {
        id: doc.id,
        ...data,
        submittedAt: submittedAt?.toISOString(),
        updatedAt: updatedAt?.toISOString(),
        examDate: examDate?.toISOString(),
        // Add formatted dates for display
        formattedSubmittedAt: submittedAt ? formatDate(submittedAt) : 'N/A',
        formattedExamDate: examDate ? formatDate(examDate) : 'Not scheduled'
      };
    });
  } catch (error) {
    console.error('Error getting applications:', error);
    throw error;
  }
};

// Helper function to format dates
const formatDate = (date) => {
  if (!(date instanceof Date)) return '';
  return date.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  });
};

// Upload document to storage and return download URL
export const uploadDocument = async (file, userId, type) => {
  try {
    const storageRef = ref(storage, `admission-docs/${userId}/${type}/${uuidv4()}_${file.name}`);
    await uploadBytes(storageRef, file);
    const downloadURL = await getDownloadURL(storageRef);
    return { success: true, url: downloadURL };
  } catch (error) {
    console.error('Error uploading document:', error);
    return { success: false, error: error.message };
  }
};

// Get application by ID
export const getApplicationById = async (applicationId) => {
  try {
    const docRef = doc(db, ADMISSION_COLLECTION, applicationId);
    const docSnap = await getDoc(docRef);
    
    if (!docSnap.exists()) {
      return { exists: false };
    }
    
    const data = docSnap.data();
    return {
      exists: true,
      id: docSnap.id,
      ...data,
      // Convert Firestore timestamps to ISO strings
      submittedAt: data.submittedAt?.toDate?.()?.toISOString(),
      updatedAt: data.updatedAt?.toDate?.()?.toISOString(),
      examDate: data.examDate ? new Date(data.examDate).toISOString() : null
    };
  } catch (error) {
    console.error('Error getting application by ID:', error);
    throw error;
  }
};

// Generate admit card data
export const generateAdmitCard = async (applicationId) => {
  try {
    // Get application data
    const applicationRef = doc(db, ADMISSION_COLLECTION, applicationId);
    const applicationSnap = await getDoc(applicationRef);
    
    if (!applicationSnap.exists()) {
      throw new Error('Application not found');
    }
    
    const application = applicationSnap.data();
    
    // Ensure application is approved
    if (application.status !== 'approved') {
      throw new Error('Application must be approved to generate admit card');
    }
    
    // Generate unique test ID if not exists
    const testId = application.testId || `TEST${Date.now().toString().slice(-6)}`;
    
    // Create admit card data
    const admitCardData = {
      applicationId: application.id,
      testId,
      studentName: application.studentName,
      fatherName: application.fatherName,
      className: application.className,
      photoUrl: application.photoUrl,
      examDate: application.examDate || new Date(Date.now() + 14 * 24 * 60 * 60 * 1000).toISOString(),
      examTime: application.examTime || '10:00 AM',
      examVenue: application.examVenue || 'Main Campus',
      generatedAt: new Date().toISOString()
    };
    
    // Update application with test ID and admit card data
    await updateDoc(applicationRef, {
      testId,
      admitCardData,
      admitCardGeneratedAt: serverTimestamp(),
      updatedAt: serverTimestamp()
    });
    
    // Generate a download URL for the admit card
    const fileName = `admit-card-${applicationId}.pdf`;
    const storageRef = ref(storage, `admit-cards/${applicationId}/${fileName}`);
    
    // In a real app, you would generate a PDF here and upload it
    // For now, we'll just return the data and the application will handle the UI
    
    const downloadUrl = `#/admit-card/${applicationId}`; // This would be the URL to download the PDF
    
    // Update application with download URL
    await updateDoc(applicationRef, {
      admitCardUrl: downloadUrl,
      updatedAt: serverTimestamp()
    });
    
    return { 
      success: true, 
      ...admitCardData,
      downloadUrl
    };
  } catch (error) {
    console.error('Error generating admit card:', error);
    return { success: false, error: error.message };
  }
};

// Get admit card data
export const getAdmitCard = async (applicationId) => {
  try {
    const applicationRef = doc(db, ADMISSION_COLLECTION, applicationId);
    const applicationSnap = await getDoc(applicationRef);
    
    if (!applicationSnap.exists()) {
      throw new Error('Application not found');
    }
    
    const application = applicationSnap.data();
    
    if (!application.admitCardData) {
      throw new Error('Admit card not generated yet');
    }
    
    return {
      success: true,
      ...application.admitCardData,
      downloadUrl: application.admitCardUrl
    };
  } catch (error) {
    console.error('Error getting admit card:', error);
    return { success: false, error: error.message };
  }
};
