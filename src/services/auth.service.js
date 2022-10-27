import { useNavigate } from "react-router-dom";

import { loginfail, loginsucces } from "../Redux/Action/Action";
import CustomAxios from "./api";

export const loginInitiate = (req) => {
  let navigate = useNavigate();
  return async function(dispatch) {
    try {
      dispatch(loginstart());
      const res = await CustomAxios.post("/login/", req);
      dispatch(loginsucces(res.data.access));
      navigate("/user/dashoard");
    } catch (error) {
      dispatch(loginfail(error.response.data.message));
    }
  };
};
