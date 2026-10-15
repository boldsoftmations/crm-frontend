import React, { useEffect, useRef, useState } from "react";
import { useLocation } from "react-router-dom";
import { Login } from "./Login";
import {
  authorizeWorkPulse,
  workPulseOptions,
  getCRMLoginToken,
} from "../../services/WorkPulseAuthService";
import { removeUser } from "../../services/TokenService";
import { useDispatch } from "react-redux";
import { logoutUser } from "../../Redux/Action/Action";

function parameters(search) {
  const query = new URLSearchParams(search);
  const result = {};
  [
    "client_id",
    "redirect_uri",
    "state",
    "code_challenge",
    "code_challenge_method",
    "response_type",
    "scope",
  ].forEach((key) => {
    if (query.getAll(key).length !== 1)
      throw new Error(
        "Invalid or incomplete WorkPulse login link. Start again from the desktop agent.",
      );
    result[key] = query.get(key);
  });
  return result;
}
function callbackURL(value, params, issuer) {
  const url = new URL(value);
  const expected = new URL(params.redirect_uri);
  const isLoopback =
    (url.hostname === "127.0.0.1" || url.hostname === "localhost") &&
    (expected.hostname === "127.0.0.1" || expected.hostname === "localhost") &&
    url.port === expected.port &&
    url.protocol === "http:";

  const cleanPath = (p) => p.replace(/\/$/, "");

  if (
    !isLoopback ||
    cleanPath(url.pathname) !== cleanPath(expected.pathname) ||
    url.searchParams.get("state") !== params.state ||
    (issuer &&
      url.searchParams.get("iss") &&
      url.searchParams.get("iss") !== issuer) ||
    !url.searchParams.get("code")
  )
    throw new Error(
      "CRM returned an invalid desktop callback. Start login again.",
    );
  return url.href;
}

function formatErrorMessage(err, defaultMsg) {
  if (!err) return defaultMsg;
  const data = err.response && err.response.data;
  if (typeof data === "string") return data;
  if (Array.isArray(data) && data.length > 0) {
    return typeof data[0] === "string" ? data[0] : JSON.stringify(data[0]);
  }
  if (data && typeof data === "object") {
    if (data.detail) return data.detail;
    if (data.error) return data.error;
    if (data.message) return data.message;
    if (data.non_field_errors && Array.isArray(data.non_field_errors)) {
      return data.non_field_errors[0];
    }
  }
  return err.message || defaultMsg;
}

export default function WorkPulseAuthorize() {
  const location = useLocation();
  const dispatch = useDispatch();
  const [options, setOptions] = useState(null);
  const [needsLogin, setNeedsLogin] = useState(false);
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(true);
  const inFlight = useRef(false);
  const mounted = useRef(true);
  const generation = useRef(0);
  async function authorize(params, info, run) {
    if (inFlight.current === run) return;
    inFlight.current = run;
    setBusy(true);
    setError("");
    try {
      const response = await authorizeWorkPulse(params);
      if (!mounted.current || run !== generation.current) return;
      window.location.assign(
        callbackURL(response.data.redirect_url, params, info.issuer),
      );
    } catch (err) {
      if (!mounted.current || run !== generation.current) return;
      if (err.response && err.response.status === 401) {
        removeUser(); // Prevent the existing Axios interceptor attaching an expired JWT to password login.
        dispatch(logoutUser());
        setNeedsLogin(true);
      } else {
        setError(formatErrorMessage(err, "CRM authorization failed."));
      }
    } finally {
      if (inFlight.current === run) inFlight.current = false;
      if (mounted.current && run === generation.current) setBusy(false);
    }
  }
  useEffect(() => {
    mounted.current = true;
    const run = ++generation.current;
    setOptions(null);
    setNeedsLogin(false);
    setError("");
    setBusy(true);
    let params;
    try {
      params = parameters(location.search);
    } catch (err) {
      setError(err.message);
      setBusy(false);
      return;
    }
    workPulseOptions(params)
      .then((response) => {
        if (!mounted.current || run !== generation.current) return;
        setOptions(response.data);
        if (getCRMLoginToken()) authorize(params, response.data, run);
        else {
          setNeedsLogin(true);
          setBusy(false);
        }
      })
      .catch((err) => {
        if (!mounted.current || run !== generation.current) return;
        setError(
          formatErrorMessage(
            err,
            "This WorkPulse login request could not be validated.",
          ),
        );
        setBusy(false);
      });
    return () => {
      mounted.current = false;
    };
  }, [location.search]);
  function continueLogin() {
    setNeedsLogin(false);
    authorize(parameters(location.search), options, generation.current);
  }
  return (
    <section
      style={{
        maxWidth: 520,
        margin: "60px auto",
        padding: 24,
        color: "#1e293b",
      }}
    >
      <h2 style={{ color: "#0f172a", marginBottom: 16 }}>
        Login to BOLD WorkPulse
      </h2>
      {options && (
        <p style={{ color: "#334155" }}>
          Continue from {options.company_name || "your CRM"} to{" "}
          <strong>{options.client_name}</strong>.
        </p>
      )}
      {busy && (
        <p role="status" style={{ color: "#2563eb" }}>
          Verifying your CRM login…
        </p>
      )}
      {error && (
        <div
          role="alert"
          style={{
            backgroundColor: "#fee2e2",
            border: "1px solid #f87171",
            color: "#991b1b",
            padding: "12px 16px",
            borderRadius: 6,
            marginBottom: 16,
            fontWeight: 500,
          }}
        >
          {String(error)}
        </div>
      )}
      {needsLogin && options && (
        <>
          <p style={{ color: "#334155" }}>
            Sign in to CRM to continue to the desktop agent.
          </p>
          <Login onSuccess={continueLogin} />
        </>
      )}
      {!busy && error && options && !needsLogin && (
        <button
          onClick={continueLogin}
          style={{
            padding: "8px 16px",
            backgroundColor: "#2563eb",
            color: "#fff",
            border: "none",
            borderRadius: 4,
            cursor: "pointer",
          }}
        >
          Try again
        </button>
      )}
      <p style={{ marginTop: 24, fontSize: 13, color: "#64748b" }}>
        You can close this tab and cancel login in the desktop agent.
      </p>
    </section>
  );
}
