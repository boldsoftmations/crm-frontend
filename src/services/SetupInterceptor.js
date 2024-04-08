// Import necessary actions, Axios instance, and token service functions
import { logoutUser, refreshToken } from "../Redux/Action/Action";
import CustomAxios from "./api";
import {
  getLocalAccessToken,
  getLocalRefreshToken,
  removeUser,
  updateLocalAccessToken,
} from "./TokenService";

// Define a logout process to be used when the token refresh fails or when the refresh token is also expired
const logoutProcess = (dispatch) => {
  dispatch(logoutUser());
  removeUser();
};

// Setup Axios interceptors
const SetupInterceptor = (store) => {
  const { dispatch } = store;

  // Request interceptor to append the access token to every request
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

  // Response interceptor to handle 401 Unauthorized responses
  CustomAxios.interceptors.response.use(
    (response) => response,
    async (error) => {
      const originalRequest = error.config;

      // Handle non-401 errors or when the response is undefined
      if (!error.response || error.response.status !== 401) {
        return Promise.reject(error);
      }

      // Check for expired access token
      if (
        error.response &&
        error.response.data &&
        error.response.data.errors &&
        error.response.data.errors.code === "token_not_valid" &&
        !originalRequest._retry
      ) {
        originalRequest._retry = true; // Mark this request as already attempted
        const refreshTokenValue = getLocalRefreshToken();

        // No refresh token available, initiate logout
        if (!refreshTokenValue) {
          logoutProcess(dispatch);
          return Promise.reject(new Error("No refresh token available"));
        }

        // Attempt to refresh the token
        try {
          const { data } = await CustomAxios.post("/api/token/refresh/", {
            refresh: refreshTokenValue,
          });
          // Update tokens in the store and local storage
          dispatch(refreshToken(data.access));
          updateLocalAccessToken(data.access);
          // Update the original request with new token and retry
          originalRequest.headers.Authorization = `Bearer ${data.access}`;
          return CustomAxios(originalRequest);
        } catch (refreshError) {
          // Refresh token failed, logout
          logoutProcess(dispatch);
          return Promise.reject(refreshError);
        }
      }

      // Handle failed retries or other errors after a retry
      if (originalRequest._retry) {
        logoutProcess(dispatch);
        return Promise.reject(error);
      }

      return Promise.reject(error);
    }
  );
};

export default SetupInterceptor;
