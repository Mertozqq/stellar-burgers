const normalizeBaseUrl = (value?: string) => (value ?? '').replace(/\/+$/, '');

const API_BASE_URL = normalizeBaseUrl(process.env.APP_API_URL);
const WS_BASE_URL = normalizeBaseUrl(process.env.APP_WS_URL);

export const getApiBaseUrl = () => {
  if (!API_BASE_URL) {
    throw new Error(
      'APP_API_URL is not configured. Add it to your environment before using the API.'
    );
  }

  return API_BASE_URL;
};

export const getWsBaseUrl = () => {
  if (WS_BASE_URL) {
    return WS_BASE_URL;
  }

  if (API_BASE_URL) {
    return API_BASE_URL.replace(/^http/i, 'ws').replace(/\/api$/, '');
  }

  throw new Error(
    'APP_WS_URL or APP_API_URL is not configured. Add one of them to your environment before using realtime features.'
  );
};
