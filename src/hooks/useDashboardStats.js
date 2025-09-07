import { useEffect } from 'react';
import { useMessageStore } from '../store/useMessageStore';
import { useNoticeStore } from '../store/useNoticeStore';

export const useDashboardStats = () => {
  const { unreadCount: unreadMessages } = useMessageStore();
  const { notices } = useNoticeStore();
  
  // This hook is now just a simple selector that returns the current state
  // from our Zustand stores
  return {
    unreadMessages,
    activeNotices: notices.length,
    isLoading: false // We handle loading states in the individual stores
  };
};
