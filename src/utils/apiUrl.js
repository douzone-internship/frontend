const LOCAL_BACKEND_ORIGIN = 'http://localhost:8080';

const trimTrailingSlash = (value) => value.replace(/\/$/, '');

export const getApiBaseUrl = () => {
  const envApiBaseUrl = (process.env.REACT_APP_API_BASE_URL || '').trim();

  if (!envApiBaseUrl) {
    return '/api';
  }

  const normalized = trimTrailingSlash(envApiBaseUrl);
  return normalized.endsWith('/api') ? normalized : `${normalized}/api`;
};

export const buildApiUrl = (path) => {
  const normalizedPath = path.startsWith('/') ? path : `/${path}`;
  return `${getApiBaseUrl()}${normalizedPath}`;
};

export const buildOAuthAuthorizationUrl = (provider) => {
  const apiBaseUrl = getApiBaseUrl();
  const isLocalhost = ['localhost', '127.0.0.1'].includes(window.location.hostname);

  if (isLocalhost && apiBaseUrl === '/api') {
    return `${LOCAL_BACKEND_ORIGIN}${apiBaseUrl}/oauth2/authorization/${provider}`;
  }

  return `${apiBaseUrl}/oauth2/authorization/${provider}`;
};