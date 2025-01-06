import { logoutUser } from "../Redux/Action/Action";
import CustomAxios from "./api";
import { getLocalAccessToken, removeUser } from "./TokenService";

// Helper to log out and redirect
const logoutProcess = (dispatch) => {
  dispatch(logoutUser());
  removeUser();
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
    (error) => Promise.reject(error)
  );

  // Response interceptor: Handle 401 errors
  CustomAxios.interceptors.response.use(
    (response) => response,
    async (error) => {
      const originalRequest = error.config;

      // Handle non-401 errors
      if (!error.response || error.response.status !== 401) {
        return Promise.reject(error);
      }

      // If `401` is encountered, handle token expiration
      const errorData = error.response.data;
      if (
        errorData &&
        errorData.errors &&
        errorData.errors.code === "token_not_valid" &&
        !originalRequest._retry
      ) {
        originalRequest._retry = true;

        const LocalAccessToken = getLocalAccessToken();

        // No access token: Logout
        if (!LocalAccessToken) {
          logoutProcess(dispatch);
          return Promise.reject(new Error("No refresh token available"));
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
