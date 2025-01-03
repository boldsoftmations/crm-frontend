import { logoutUser, refreshToken } from "../Redux/Action/Action";
import CustomAxios from "./api";
import {
  getLocalAccessToken,
  getLocalRefreshToken,
  removeUser,
  updateLocalAccessToken,
} from "./TokenService";

// Helper to log out and redirect
const logoutProcess = (
  dispatch,
  message = "Session expired. Please log in again."
) => {
  alert(message); // Show popup message
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
      console.log("Adding access token to request:", token);

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
      console.error("Response error:", error);

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
        console.log("Token expired. Attempting refresh...");
        originalRequest._retry = true;

        const refreshTokenValue = getLocalRefreshToken();

        // No refresh token: Logout
        if (!refreshTokenValue) {
          console.error("No refresh token available. Logging out.");
          logoutProcess(
            dispatch,
            "Your session has expired. Please log in again."
          );
          return Promise.reject(new Error("No refresh token available"));
        }

        try {
          // Refresh the access token
          const { data } = await CustomAxios.post("/api/token/refresh/", {
            refresh: refreshTokenValue,
          });
          console.log("Token refreshed successfully:", data.access);

          // Update Redux and localStorage
          dispatch(refreshToken(data.access));
          updateLocalAccessToken(data.access);

          // Retry the original request with new token
          originalRequest.headers.Authorization = `Bearer ${data.access}`;
          return CustomAxios(originalRequest);
        } catch (refreshError) {
          console.error("Token refresh failed:", refreshError);
          logoutProcess(
            dispatch,
            "Failed to refresh session. Please log in again."
          );
          return Promise.reject(refreshError);
        }
      }

      // Logout for other cases of 401 errors
      if (!originalRequest._retry) {
        console.error("Unauthorized access. Logging out.");
        logoutProcess(dispatch, "Unauthorized access. Please log in again.");
      }

      return Promise.reject(error);
    }
  );
};

export default SetupInterceptor;
