import { QueryClient, QueryClientProvider as ReactQueryProvider } from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import { useState, useEffect } from 'react';
import { toast } from 'react-hot-toast';
import axios from 'axios';

// Create a client
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 5, // 5 minutes
      retry: 1,
      refetchOnWindowFocus: false,
      onError: (error) => {
        // Handle global query errors
        if (axios.isAxiosError(error)) {
          const message = error.response?.data?.message || 'An error occurred';
          toast.error(message);
        } else {
          toast.error('An unexpected error occurred');
        }
      },
    },
    mutations: {
      onError: (error) => {
        // Handle global mutation errors
        if (axios.isAxiosError(error)) {
          const message = error.response?.data?.message || 'An error occurred';
          toast.error(message);
        } else {
          toast.error('An unexpected error occurred');
        }
      },
    },
  },
});

export const QueryClientProvider = ({ children }) => {
  const [client] = useState(() => queryClient);

  // Set up axios defaults
  useEffect(() => {
    // Set base URL for all axios requests
    axios.defaults.baseURL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api/v1';
    
    // Add request interceptor to include auth token
    const requestInterceptor = axios.interceptors.request.use(
      (config) => {
        const token = localStorage.getItem('token');
        if (token) {
          config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
      },
      (error) => {
        return Promise.reject(error);
      }
    );

    // Add response interceptor to handle 401 errors
    const responseInterceptor = axios.interceptors.response.use(
      (response) => response,
      async (error) => {
        const originalRequest = error.config;
        
        // If error is 401 and we haven't tried to refresh yet
        if (error.response?.status === 401 && !originalRequest._retry) {
          originalRequest._retry = true;
          
          try {
            // Try to refresh the token
            const response = await axios.post('/auth/refresh-token', {}, {
              withCredentials: true,
            });
            
            const { token } = response.data;
            localStorage.setItem('token', token);
            
            // Update the Authorization header
            originalRequest.headers.Authorization = `Bearer ${token}`;
            
            // Retry the original request
            return axios(originalRequest);
          } catch (error) {
            // If refresh token fails, redirect to login
            if (window.location.pathname !== '/login') {
              window.location.href = '/login';
            }
            return Promise.reject(error);
          }
        }
        
        return Promise.reject(error);
      }
    );

    // Cleanup interceptors on unmount
    return () => {
      axios.interceptors.request.eject(requestInterceptor);
      axios.interceptors.response.eject(responseInterceptor);
    };
  }, []);

  return (
    <ReactQueryProvider client={client}>
      {children}
      {import.meta.env.DEV && <ReactQueryDevtools initialIsOpen={false} />}
    </ReactQueryProvider>
  );
};

export default QueryClientProvider;
