let accessToken: string | null = null;
let refreshHandler: (() => Promise<string>) | null = null;
let refreshPromise: Promise<string> | null = null;

export const getAccessToken = () => accessToken;
export const setAccessToken = (token: string) => {
  accessToken = token;
};
export const clearAccessToken = () => {
  accessToken = null;
};

export const registerRefreshHandler = (handler: () => Promise<string>) => {
  refreshHandler = handler;
};

export const refreshAccessToken = async (): Promise<string> => {
  if (!refreshHandler) throw new Error('refresh handler가 등록되지 않았습니다');
  if (!refreshPromise) {
    refreshPromise = refreshHandler().finally(() => {
      refreshPromise = null;
    });
  }
  return refreshPromise;
};
