import { refreshToken } from "../Redux/Action/Action";
import CustomAxios from "./api";
import {
  getLocalAccessToken,
  getLocalRefreshToken,
  removeUser,
  updateLocalAccessToken,
} from "./TokenService";

const SetupInterceptor = (store) => {
  CustomAxios.interceptors.request.use(
    (config) => {
      const token = getLocalAccessToken();
      // config.baseURL = process.env.REACT_APP_DEPLOY_BACKEND_URL;
      if (token) {
        config.headers = {
          Authorization: `Bearer ${token}`,
          Accept: "application/json",
        };
      }
      return config;
    },
    (error) => {
      return Promise.reject(error);
    }
  );
  const { dispatch } = store;

  CustomAxios.interceptors.response.use(
    (res) => {
      return res;
    },
    async (err) => {
      console.log("err respoanse :>> ", err);
      if (err.response.data.code === "token_not_valid") {
        removeUser();
      }
      const originalConfig = err.config;

      if (err.response) {
        // Access Token was expired
        if (err.response.status === 401 && !originalConfig._retry) {
          originalConfig._retry = true;

          try {
            const rs = await CustomAxios.post("/api/token/refresh/", {
              refresh: getLocalRefreshToken(),
            });

            const accessToken = rs.data.access;
            console.log("accessToken :>> ", accessToken);
            if (rs.status === 200) {
              dispatch(refreshToken(accessToken));
              updateLocalAccessToken(accessToken);
              CustomAxios.defaults.headers.common[
                "Authorization"
              ] = `Bearer ${accessToken.access}`;

              return CustomAxios(originalConfig);
            }
          } catch (_error) {
            if (_error.response && _error.response.data) {
              return Promise.reject(_error.response.data);
            }

            return Promise.reject(_error);
          }
        }

        if (err.response.status === 403 && err.response.data) {
          return Promise.reject(err.response.data);
        }
      }

      return Promise.reject(err);
    }
  );
};

export default SetupInterceptor;
