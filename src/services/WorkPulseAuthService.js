import axios from "axios";
import { getLocalAccessToken } from "./TokenService";

// Independent of the global interceptor: an expired CRM login must keep the
// pending authorization URL and render the login form here, not navigate away.
const base = process.env.REACT_APP_DEPLOY_BACKEND_URL;

export function getCRMLoginToken() {
  try {
    const token = getLocalAccessToken();
    return typeof token === "string" ? token : "";
  } catch (_) {
    return "";
  }
}
const client = axios.create({ baseURL: base, timeout: 15000 });
export const workPulseOptions = (params) =>
  client.get("/api/workpulse-auth/options/", { params });
export const authorizeWorkPulse = (params) =>
  client.post("/api/workpulse-auth/authorize/", params, {
    headers: { Authorization: `Bearer ${getCRMLoginToken()}` },
  });
