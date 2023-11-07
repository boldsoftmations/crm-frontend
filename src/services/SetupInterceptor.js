import { logoutUser, refreshToken } from "../Redux/Action/Action";
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

      // Check for a network error or no response
      if (!error.response) {
        return Promise.reject(new Error("Network Error - Unable to connect"));
      }

      // If the error is specifically for an expired access token and we haven't already retried
      if (
        error.response.status === 401 &&
        error.response.data.code === "token_not_valid" &&
        error.response.data.messages &&
        error.response.data.messages.some(
          (m) => m.token_class === "AccessToken"
        ) &&
        !originalRequest._retry
      ) {
        originalRequest._retry = true; // Mark that we have already retried
        const refreshTokenValue = getLocalRefreshToken();

        if (!refreshTokenValue) {
          // No refresh token available, log out immediately
          dispatch(logoutUser());
          removeUser();
          window.location.href = "/crm-frontend"; // Redirect to the login page
          return Promise.reject(new Error("No refresh token available"));
        }

        try {
          const { data } = await CustomAxios.post("/api/token/refresh/", {
            refresh: refreshTokenValue,
          });

          // Update tokens and retry original request
          dispatch(refreshToken(data.access));
          updateLocalAccessToken(data.access);
          originalRequest.headers.Authorization = `Bearer ${data.access}`;
          return CustomAxios(originalRequest);
        } catch (refreshError) {
          // If refresh attempt fails, log out and redirect
          dispatch(logoutUser());
          removeUser();
          window.location.href = "/crm-frontend"; // Redirect to the login page
          return Promise.reject(refreshError);
        }
      }

      // If the refresh token is also expired or invalid, log out and redirect
      if (error.response.status === 401 && originalRequest._retry) {
        // If we already retried, don't go into a loop
        dispatch(logoutUser());
        removeUser();
        window.location.href = "/crm-frontend"; // Redirect to the login page
        return Promise.reject(error);
      }

      // For all other response errors, just forward the error
      return Promise.reject(error);
    }
  );
};

export default SetupInterceptor;
