"use client"

import axios from 'axios';
import { getSessionStorage, setSessionStorage } from './storage';
// import { useRouter } from 'next/navigation';
const getAuthToken = () => {
  return getSessionStorage('accessToken');
};

// const router = useRouter();

// Create an Axios instance
const api = axios.create({
  
  


// baseURL: 'https://test.ownmali.com/api',

   baseURL: 'http://localhost:3001/api',
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 120000, // 2 minutes timeout
});
 
// Request Interceptor: Attach token from sessionStorage
api.interceptors.request.use(
  (config) => {
    const token = getAuthToken();   
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;  
  },
  (error) => Promise.reject(error)
);

// Basic Response Error Handling
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    if (!error.response) {
      console.error('Network error: No response received.');
      return Promise.reject({ message: 'Network Error' });
    }

    // Handle token refresh for 401 errors ONLY if the request already had an Authorization header
    // This prevents token refresh attempts for login/authentication requests
    if (error.response?.status === 401 && !originalRequest._retry && originalRequest.headers.Authorization) {
      originalRequest._retry = true;

      try {
        const refreshToken = getSessionStorage('refreshToken');
        // router.push('/auth/signin');

        if (!refreshToken) {
          console.error('No refresh token found. Redirecting to login.');
        }

        const { data } = await axios.post(
          'https://test.ownmali.com/api/user/refresh-token',
          { refreshToken },
          {
            timeout: 120000, // Also set timeout for refresh token request
            headers: {
              'Content-Type': 'application/json',
            },
          }
        );

        if (data?.data?.accessToken) {
          setSessionStorage('accessToken', data.data.accessToken);
          
          // Retry the original request with new token
          originalRequest.headers.Authorization = `Bearer ${data.data.accessToken}`;
          originalRequest.timeout = 120000; // Ensure timeout is set for retry request
          return api(originalRequest);
        } else {
          throw new Error('Invalid refresh token response');
        }
      } catch (refreshError) {
        console.error('Token refresh failed:', refreshError);
        return Promise.reject(refreshError);
      }
    }

    return Promise.reject(error);
  }
);

export default api;
