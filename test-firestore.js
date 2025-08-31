import { initializeApp } from 'firebase/app';
import { getFirestore, collection, getDocs } from 'firebase/firestore';
import { firebaseConfig } from './src/firebase.js';

async function testConnection() {
  try {
    console.log('Initializing Firebase...');
    const app = initializeApp(firebaseConfig);
    const db = getFirestore(app);
    
    // Test messages collection
    console.log('\n--- Testing Messages Collection ---');
    const messagesSnapshot = await getDocs(collection(db, 'messages'));
    console.log(`Found ${messagesSnapshot.size} messages`);
    messagesSnapshot.forEach(doc => {
      console.log(`Message ID: ${doc.id}`);
      console.log('Data:', JSON.stringify(doc.data(), null, 2));
    });

    // Test notices collection
    console.log('\n--- Testing Notices Collection ---');
    const noticesSnapshot = await getDocs(collection(db, 'notices'));
    console.log(`Found ${noticesSnapshot.size} notices`);
    noticesSnapshot.forEach(doc => {
      console.log(`Notice ID: ${doc.id}`);
      console.log('Data:', JSON.stringify(doc.data(), null, 2));
    });

  } catch (error) {
    console.error('Error testing Firestore:', error);
  }
}

testConnection();
