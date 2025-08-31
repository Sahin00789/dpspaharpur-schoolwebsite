import { db } from './firebase';
import { collection, getDocs, query, where, limit } from 'firebase/firestore';

async function testFirestoreConnection() {
  try {
    console.log('Testing Firestore connection...');
    
    // Test messages collection
    console.log('\nTesting messages collection...');
    const messagesQuery = query(collection(db, 'messages'), limit(1));
    const messagesSnapshot = await getDocs(messagesQuery);
    console.log(`Found ${messagesSnapshot.size} messages`);
    messagesSnapshot.forEach((doc) => {
      console.log('Message data:', { id: doc.id, ...doc.data() });
    });
    
    // Test notices collection
    console.log('\nTesting notices collection...');
    const noticesQuery = query(collection(db, 'notices'), limit(1));
    const noticesSnapshot = await getDocs(noticesQuery);
    console.log(`Found ${noticesSnapshot.size} notices`);
    noticesSnapshot.forEach((doc) => {
      console.log('Notice data:', { id: doc.id, ...doc.data() });
    });
    
    console.log('\nFirestore connection test completed successfully!');
  } catch (error) {
    console.error('Firestore test failed:', error);
    if (error.code) {
      console.error('Error code:', error.code);
      console.error('Error message:', error.message);
    }
  }
}

// Run the test
testFirestoreConnection();
