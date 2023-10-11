import { refreshToken } from "../Redux/Action/Action";
import CustomAxios from "./api";
import {
  getLocalAccessToken,
  getLocalRefreshToken,
  removeUser,
  updateLocalAccessToken,
} from "./TokenService";

const SetupInterceptor = (store) => {
  const { dispatch } = store;

  CustomAxios.interceptors.request.use(
    (config) => {
      const token = getLocalAccessToken();
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
      return config;
    },
    (error) => Promise.reject(error)
  );

  CustomAxios.interceptors.response.use(
    (response) => response,
    async (error) => {
      const originalRequest = error.config;

      // If error response is not available, reject promise
      if (!error.response) return Promise.reject(error);

      // Logout user if token is not valid
      if (error.response.data.code === "token_not_valid") {
        removeUser();
        window.location.reload();
        return Promise.reject(error);
      }

      // Refresh token on 401 error
      if (error.response.status === 401 && !originalRequest._retry) {
        originalRequest._retry = true;

        try {
          const { data, status } = await CustomAxios.post(
            "/api/token/refresh/",
            {
              refresh: getLocalRefreshToken(),
            }
          );

          if (status === 200) {
            dispatch(refreshToken(data.access));
            updateLocalAccessToken(data.access);
            originalRequest.headers.Authorization = `Bearer ${data.access}`;
            return CustomAxios(originalRequest);
          }
        } catch (_error) {
          removeUser();
          window.location.reload();
          return Promise.reject(_error);
        }
      }

      return Promise.reject(error);
    }
  );
};

export default SetupInterceptor;
