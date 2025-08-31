import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  FiArrowLeft, 
  FiMessageSquare, 
  FiMail, 
  FiPhone, 
  FiClock, 
  FiEye, 
  FiTrash2,
  FiSearch,
  FiFilter
} from 'react-icons/fi';
import { collection, query, orderBy, getDocs, doc, updateDoc, deleteDoc, onSnapshot } from 'firebase/firestore';
import { db } from '../../firebase';
import { toast } from 'react-hot-toast';

const Messages = () => {
  const navigate = useNavigate();
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');

  // Format date to relative time (e.g., "2 hours ago")
  const formatRelativeTime = (date) => {
    const now = new Date();
    const diffInSeconds = Math.floor((now - date) / 1000);
    
    if (diffInSeconds < 60) return 'Just now';
    if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)}m ago`;
    if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)}h ago`;
    return `${Math.floor(diffInSeconds / 86400)}d ago`;
  };

  // Process message data from Firestore
  const processMessageDoc = (doc) => {
    const data = doc.data();
    
    // Safely handle timestamps
    const getDate = (timestamp) => {
      try {
        return timestamp?.toDate ? timestamp.toDate() : new Date();
      } catch (error) {
        console.warn('Error parsing timestamp:', error);
        return new Date();
      }
    };
    
    return {
      id: doc.id,
      name: data.name || 'No Name',
      email: data.email || 'No Email',
      message: data.message || '',
      phone: data.phone || '',
      status: data.status || 'unread',
      ip: data.ip || 'unknown',
      createdAt: getDate(data.createdAt),
      updatedAt: getDate(data.updatedAt)
    };
  };

  // Set up real-time listener for messages
  useEffect(() => {
    console.log('Setting up messages listener...');
    
    const q = query(
      collection(db, 'messages'),
      orderBy('createdAt', 'desc')
    );
    
    const unsubscribe = onSnapshot(
      q,
      (querySnapshot) => {
        console.log('Messages updated, new count:', querySnapshot.size);
        if (querySnapshot.empty) {
          console.log('No messages found in the collection');
          setMessages([]);
          setLoading(false);
          return;
        }
        
        const messagesData = [];
        querySnapshot.forEach((doc) => {
          try {
            const processed = processMessageDoc(doc);
            messagesData.push(processed);
          } catch (error) {
            console.error('Error processing document:', doc.id, error);
          }
        });
        
        console.log('Processed messages:', messagesData);
        setMessages(messagesData);
        setLoading(false);
      },
      (error) => {
        console.error('Error in messages listener:', error);
        console.error('Error details:', {
          code: error.code,
          message: error.message,
          stack: error.stack
        });
        toast.error(`Error loading messages: ${error.message}`);
        setLoading(false);
      }
    );
    
    // Initial fetch as fallback
    fetchMessages();
    
    // Clean up listener on unmount
    return () => {
      console.log('Cleaning up messages listener');
      unsubscribe();
    };
  }, []);
  
  // Initial data fetch (fallback in case real-time fails)
  const fetchMessages = async () => {
    try {
      setLoading(true);
      console.log('Fetching messages...');
      
      const messagesRef = collection(db, 'messages');
      console.log('Messages reference created');
      
      const q = query(messagesRef, orderBy('createdAt', 'desc'));
      console.log('Query created');
      
      const querySnapshot = await getDocs(q);
      console.log('Query executed, found', querySnapshot.docs.length, 'messages');
      
      if (querySnapshot.empty) {
        console.log('No messages found in initial fetch');
        setMessages([]);
        return;
      }
      
      const messagesData = [];
      querySnapshot.forEach(doc => {
        try {
          const processed = processMessageDoc(doc);
          messagesData.push(processed);
        } catch (error) {
          console.error(`Error processing document ${doc.id}:`, error);
        }
      });
      
      console.log('Successfully processed messages:', messagesData);
      setMessages(messagesData);
    } catch (error) {
      console.error('Error in initial messages fetch:', {
        name: error.name,
        message: error.message,
        code: error.code,
        stack: error.stack
      });
      toast.error(`Failed to load messages: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  // Mark message as read/unread
  const toggleMessageStatus = async (messageId, currentStatus) => {
    try {
      await updateDoc(doc(db, 'messages', messageId), {
        status: currentStatus === 'read' ? 'unread' : 'read',
        updatedAt: new Date()
      });
      fetchMessages(); // Refresh the list
    } catch (error) {
      console.error('Error updating message status:', error);
      toast.error('Failed to update message status');
    }
  };

  // Delete a message
  const handleDeleteMessage = async (messageId) => {
    if (window.confirm('Are you sure you want to delete this message?')) {
      try {
        await deleteDoc(doc(db, 'messages', messageId));
        toast.success('Message deleted successfully');
        fetchMessages(); // Refresh the list
      } catch (error) {
        console.error('Error deleting message:', error);
        toast.error('Failed to delete message');
      }
    }
  };

  // Filter messages based on search and status
  const filteredMessages = messages.filter(message => {
    const matchesSearch = 
      message.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      message.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      message.message?.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStatus = statusFilter === 'all' || message.status === statusFilter;
    
    return matchesSearch && matchesStatus;
  });

  // Load messages on component mount
  useEffect(() => {
    fetchMessages();
  }, []);

  return (
    <div className="p-4 md:p-6">
      <div className="flex items-center mb-6">
        <button
          onClick={() => navigate(-1)}
          className="mr-4 p-2 rounded-full hover:bg-gray-100"
        >
          <FiArrowLeft className="w-5 h-5" />
        </button>
        <h1 className="text-2xl font-bold text-gray-900">Contact Messages</h1>
      </div>

      <div className="bg-white rounded-lg shadow overflow-hidden">
        {/* Search and filter bar */}
        <div className="p-4 border-b">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div className="relative flex-1">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <FiSearch className="h-5 w-5 text-gray-400" />
              </div>
              <input
                type="text"
                placeholder="Search messages..."
                className="pl-10 block w-full rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <div className="flex items-center gap-2">
              <div className="flex items-center text-sm text-gray-600">
                <FiFilter className="mr-2 h-4 w-4" />
                <span className="mr-2">Status:</span>
                <select
                  className="rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500 text-sm"
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                >
                  <option value="all">All</option>
                  <option value="unread">Unread</option>
                  <option value="read">Read</option>
                </select>
              </div>
            </div>
          </div>
        </div>

        {/* Messages list */}
        <div className="divide-y divide-gray-200">
          {loading ? (
            <div className="p-8 text-center text-gray-500">
              <p>Loading messages...</p>
            </div>
          ) : filteredMessages.length === 0 ? (
            <div className="p-8 text-center text-gray-500">
              <FiMessageSquare className="mx-auto h-12 w-12 text-gray-300" />
              <h3 className="mt-2 text-sm font-medium text-gray-900">No messages</h3>
              <p className="mt-1 text-sm text-gray-500">
                {searchTerm || statusFilter !== 'all' 
                  ? 'No messages match your search criteria.'
                  : 'No messages have been received yet.'}
              </p>
            </div>
          ) : (
            <ul className="divide-y divide-gray-200">
              {filteredMessages.map((message) => (
                <li 
                  key={message.id}
                  className={`hover:bg-gray-50 ${message.status === 'unread' ? 'bg-blue-50' : 'bg-white'}`}
                >
                  <div className="px-4 py-4 sm:px-6">
                    <div className="flex items-center justify-between">
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center">
                          <div className={`flex-shrink-0 h-10 w-10 rounded-full flex items-center justify-center ${
                            message.status === 'unread' ? 'bg-blue-100 text-blue-600' : 'bg-gray-100 text-gray-600'
                          }`}>
                            {message.name ? message.name.charAt(0).toUpperCase() : '?'}
                          </div>
                          <div className="ml-4">
                            <div className="flex items-center">
                              <p className="text-sm font-medium text-gray-900 truncate">
                                {message.name || 'No Name'}
                              </p>
                              {message.status === 'unread' && (
                                <span className="ml-2 inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                                  New
                                </span>
                              )}
                            </div>
                            <p className="text-sm text-gray-500 truncate">
                              {message.email || 'No email provided'}
                            </p>
                          </div>
                        </div>
                      </div>
                      <div className="ml-4 flex-shrink-0 flex flex-col items-end">
                        <div className="text-sm text-gray-500 flex items-center">
                          <FiClock className="mr-1 h-3.5 w-3.5" />
                          {formatRelativeTime(message.createdAt)}
                        </div>
                        <div className="mt-2 flex space-x-2">
                          <button
                            onClick={() => toggleMessageStatus(message.id, message.status)}
                            className="text-gray-400 hover:text-gray-600"
                            title={message.status === 'read' ? 'Mark as unread' : 'Mark as read'}
                          >
                            <FiEye className="h-4 w-4" />
                          </button>
                          <a 
                            href={`mailto:${message.email}`} 
                            className="text-gray-400 hover:text-blue-600"
                            title="Reply via email"
                          >
                            <FiMail className="h-4 w-4" />
                          </a>
                          {message.phone && (
                            <a 
                              href={`tel:${message.phone}`} 
                              className="text-gray-400 hover:text-green-600"
                              title="Call"
                            >
                              <FiPhone className="h-4 w-4" />
                            </a>
                          )}
                          <button
                            onClick={() => handleDeleteMessage(message.id)}
                            className="text-gray-400 hover:text-red-600"
                            title="Delete message"
                          >
                            <FiTrash2 className="h-4 w-4" />
                          </button>
                        </div>
                      </div>
                    </div>
                    <div className="mt-2">
                      <p className="text-sm text-gray-600 whitespace-pre-line">
                        {message.message || 'No message content'}
                      </p>
                    </div>
                    {message.phone && (
                      <div className="mt-2 flex items-center text-sm text-gray-500">
                        <FiPhone className="mr-1 h-3.5 w-3.5" />
                        {message.phone}
                      </div>
                    )}
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </div>
  );
};

export default Messages;
