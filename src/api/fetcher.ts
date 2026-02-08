const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

if (!API_BASE_URL) {
  throw new Error('VITE_API_BASE_URL is not defined');
}

export const fetcher = async <T>(path: string, options?: RequestInit): Promise<T> => {
  const url = `${API_BASE_URL}${path}`;
  const response = await fetch(url, {
    credentials: 'include',
    ...options,
  });

  if (!response.ok) {
    const errorBody = await response.json().catch(() => ({ message: 'An unknown error occurred' }));
    throw new Error(errorBody.message || 'API request failed');
  }

  if (response.status === 204) {
    return undefined as T;
  }

  const contentType = response.headers.get('content-type') || '';
  if (!contentType.includes('application/json')) {
    return undefined as T;
  }

  return response.json();
};
