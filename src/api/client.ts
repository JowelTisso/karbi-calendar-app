// Axios API client configuration

import axios, { AxiosInstance, AxiosError, InternalAxiosRequestConfig } from 'axios';
import { API_CONFIG } from '@/utils/constants';
import type { ApiError } from '@/types';

// Create axios instance
const client: AxiosInstance = axios.create({
  baseURL: API_CONFIG.BASE_URL,
  timeout: API_CONFIG.TIMEOUT,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor
client.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    // Add any auth headers here when authentication is implemented
    // const token = await getAuthToken();
    // if (token) {
    //   config.headers.Authorization = `Bearer ${token}`;
    // }

    if (__DEV__) {
      console.log(`[API] ${config.method?.toUpperCase()} ${config.url}`);
    }

    return config;
  },
  (error: AxiosError) => {
    return Promise.reject(error);
  }
);

// Response interceptor
client.interceptors.response.use(
  (response) => {
    return response;
  },
  (error: AxiosError<ApiError>) => {
    const apiError: ApiError = {
      code: error.response?.status?.toString() || 'NETWORK_ERROR',
      message: error.response?.data?.message || error.message || 'An error occurred',
      details: error.response?.data?.details,
    };

    if (__DEV__) {
      console.error('[API Error]', apiError);
    }

    return Promise.reject(apiError);
  }
);

// API helper functions
export const api = {
  get: <T>(url: string, params?: Record<string, unknown>) =>
    client.get<T>(url, { params }).then((res) => res.data),

  post: <T>(url: string, data?: unknown) =>
    client.post<T>(url, data).then((res) => res.data),

  put: <T>(url: string, data?: unknown) =>
    client.put<T>(url, data).then((res) => res.data),

  patch: <T>(url: string, data?: unknown) =>
    client.patch<T>(url, data).then((res) => res.data),

  delete: <T>(url: string) =>
    client.delete<T>(url).then((res) => res.data),
};

// Update base URL (useful for development/staging environments)
export const setBaseUrl = (url: string): void => {
  client.defaults.baseURL = url;
};

// Set authorization header
export const setAuthToken = (token: string | null): void => {
  if (token) {
    client.defaults.headers.common.Authorization = `Bearer ${token}`;
  } else {
    delete client.defaults.headers.common.Authorization;
  }
};

export default client;
