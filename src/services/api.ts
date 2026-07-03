import type { Scheme, SchemeDetailResponse } from '../types';

const BASE_URL = 'https://api.mfapi.in';
const REQUEST_TIMEOUT_MS = 15000;

const fetchJson = async <T>(path: string): Promise<T> => {
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), REQUEST_TIMEOUT_MS);

  try {
    const response = await fetch(`${BASE_URL}${path}`, {
      headers: { Accept: 'application/json' },
      signal: controller.signal,
    });

    if (!response.ok) {
      throw new Error(`Request failed with status ${response.status}`);
    }

    return (await response.json()) as T;
  } catch (error) {
    if (error instanceof Error && error.name === 'AbortError') {
      throw new Error('The request took too long. Please try again.');
    }
    throw new Error(
      'Unable to connect. Check your internet connection and try again.',
    );
  } finally {
    clearTimeout(timeout);
  }
};

export const getSchemes = async (page?: number, limit?: number) => {
  let path = '/mf';
  const params: string[] = [];
  if (typeof page === 'number') {
    params.push(`page=${page}`);
  }
  if (typeof limit === 'number') {
    params.push(`limit=${limit}`);
  }
  if (typeof page === 'number' && typeof limit === 'number') {
    const offset = (page - 1) * limit;
    params.push(`offset=${offset}`);
  }
  if (params.length > 0) {
    path += `?${params.join('&')}`;
  }
  
  const schemes = await fetchJson<Scheme[]>(path);
  if (!Array.isArray(schemes)) {
    throw new Error('The server returned an unexpected response.');
  }
  return schemes;
};

export const searchSchemes = async (query: string) => {
  const encodedQuery = encodeURIComponent(query.trim());
  const schemes = await fetchJson<Scheme[]>(`/mf/search?q=${encodedQuery}`);
  if (!Array.isArray(schemes)) {
    throw new Error('The server returned an unexpected response.');
  }
  return schemes;
};

export const getSchemeDetail = async (schemeCode: number) => {
  const detail = await fetchJson<SchemeDetailResponse>(`/mf/${schemeCode}`);
  if (!detail || !Array.isArray(detail.data)) {
    throw new Error('NAV history is unavailable for this scheme.');
  }
  return detail;
};
