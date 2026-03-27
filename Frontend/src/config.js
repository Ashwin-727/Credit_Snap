const trimTrailingSlash = (value = '') => value.replace(/\/+$/, '');

const resolveBaseUrl = () => {
  const configuredBaseUrl = trimTrailingSlash(import.meta.env.VITE_API_BASE_URL || '');
  if (configuredBaseUrl) {
    return configuredBaseUrl;
  }

  if (typeof window !== 'undefined') {
    const { protocol, hostname, host } = window.location;

    if (hostname === 'localhost' || hostname === '127.0.0.1') {
      return 'http://localhost:5000';
    }

    return `${protocol}//${host}`;
  }

  return 'http://localhost:5000';
};

export let BASE_URL = resolveBaseUrl();

export const checkServerBaseUrl = async () => {
  BASE_URL = resolveBaseUrl();
  return BASE_URL;
};
