// Shared helpers for API calls
export const getApiBase = () => {
  // Prefer CRA dev server proxy in development to avoid cross-origin
  // and Codespaces auth prompts.
  if (typeof window !== 'undefined') {
    const isDev = process.env.NODE_ENV === 'development';
    if (isDev || process.env.REACT_APP_USE_PROXY === 'true') {
      const base = '/api';
      console.log('[API] Using dev proxy base', { base, env: process.env.NODE_ENV });
      return base;
    }
  }

  // Prefer Codespaces-style host if provided via env var at build-time
  // The instruction: https://$REACT_APP_CODESPACE_NAME-8000.app.github.dev
  const codespace = process.env.REACT_APP_CODESPACE_NAME;
  if (codespace) {
    const base = `https://${codespace}-8000.app.github.dev/api`;
    console.log('[API] Using Codespaces base from env', base);
    return base;
  }
  // Try to auto-detect Codespaces from window location
  if (typeof window !== 'undefined') {
    const { protocol, hostname } = window.location;
    // Codespaces frontend runs at https://<name>-3000.app.github.dev
    if (/\.app\.github\.dev$/.test(hostname)) {
      const backendHost = hostname.replace(/-\d+\.app\.github\.dev$/, '-8000.app.github.dev');
      const base = `https://${backendHost}/api`;
      console.log('[API] Auto-detected Codespaces base', base);
      return base;
    }
    // Local dev only: use localhost:8000 when page is served from localhost
    if (hostname === 'localhost' || hostname === '127.0.0.1') {
      const scheme = protocol === 'https:' ? 'https' : 'http';
      const base = `${scheme}://localhost:8000/api`;
      console.log('[API] Using localhost base', base);
      return base;
    }
  }
  // Fallback to env override or relative path
  const guess = (process.env.REACT_APP_API_BASE || '/api').replace(/\/$/, '');
  console.log('[API] Using fallback base', guess);
  return guess;
};

export const extractResults = (data) => {
  // Compatible with DRF pagination (data.results) and plain array
  if (Array.isArray(data)) return data;
  if (data && Array.isArray(data.results)) return data.results;
  // If it's an object but not an array, try values
  if (data && typeof data === 'object') {
    const vals = Object.values(data);
    if (vals.length && Array.isArray(vals[0])) return vals[0];
  }
  return [];
};

export const shouldSkipFetch = () => process.env.NODE_ENV === 'test';
