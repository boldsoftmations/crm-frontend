import { logoutUser, refreshToken } from "../Redux/Action/Action";
import CustomAxios from "./api";
import {
  getLocalAccessToken,
  getLocalRefreshToken,
  removeUser,
  updateLocalAccessToken,
} from "./TokenService";

// Helper to log out and redirect
const logoutProcess = (dispatch) => {
  dispatch(logoutUser());
  removeUser();
  window.location.href = "/crm-frontend"; // Redirect to login page
};

// Setup Axios interceptors
const SetupInterceptor = (store) => {
  const { dispatch } = store;

  // Request interceptor: Add access token to headers
  CustomAxios.interceptors.request.use(
    (config) => {
      const token = getLocalAccessToken();
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
      return config;
    },
    (error) => {
      console.error("Request error:", error);
      return Promise.reject(error);
    }
  );

  // Response interceptor: Handle 401 errors
  CustomAxios.interceptors.response.use(
    (response) => response,
    async (error) => {
      const originalRequest = error.config;

      // Handle non-401 errors
      if (!error.response || error.response.status !== 401) {
        console.error("Non-401 error:", error);
        return Promise.reject(error);
      }

      // If `401` is encountered, check if it's due to token expiration
      if (
        error.response.data &&
        error.response.data.errors &&
        error.response.data.errors.code === "token_not_valid" &&
        !originalRequest._retry
      ) {
        originalRequest._retry = true;

        const refreshTokenValue = getLocalRefreshToken();

        // No refresh token: Logout
        if (!refreshTokenValue) {
          logoutProcess(dispatch);
          return Promise.reject(new Error("No refresh token available"));
        }

        try {
          // Refresh the access token
          const { data } = await CustomAxios.post("/api/token/refresh/", {
            refresh: refreshTokenValue,
          });
          // Update Redux and localStorage
          dispatch(refreshToken(data.access));
          updateLocalAccessToken(data.access);

          // Retry the original request with new token
          originalRequest.headers.Authorization = `Bearer ${data.access}`;
          return CustomAxios(originalRequest);
        } catch (refreshError) {
          console.error("Token refresh failed:", refreshError);
          logoutProcess(dispatch);
          return Promise.reject(refreshError);
        }
      }

      // Logout for other cases of 401 errors
      if (!originalRequest._retry) {
        logoutProcess(dispatch);
      }

      return Promise.reject(error);
    }
  );
};

export default SetupInterceptor;
