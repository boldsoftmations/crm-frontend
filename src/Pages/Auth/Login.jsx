import { Link, useNavigate } from "react-router-dom";
import LockOutlinedIcon from "@mui/icons-material/LockOutlined";
import React, { useEffect, useRef, useState } from "react";

import {
  loginstart,
  loginsucces,
  loginfail,
} from "./../../Redux/Action/Action";
import "../CommonStyle.css";

import {
  Avatar,
  Container,
  ThemeProvider,
  createTheme,
  Box,
  Grid,
  Button,
  TextField,
  Backdrop,
  CircularProgress,
  OutlinedInput,
  FormControl,
  InputLabel,
  IconButton,
  InputAdornment
} from "@mui/material";
import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';
import { useDispatch } from "react-redux";
import axios from "axios";
import { setUserData } from "./../../services/TokenService";

const LOGIN_URL = `${process.env.REACT_APP_DEPLOY_BACKEND_URL}/api/user/login/`;
// const LOGIN_URL = `${process.env.REACT_APP_TESTING_BACKEND_URL}/api/user/login/`;

export const Login = () => {
  const [open, setOpen] = useState(false);
  const theme = createTheme();
  let navigate = useNavigate();
  const dispatch = useDispatch();
  const userRef = useRef();
  const errRef = useRef();

  const [user, setUser] = useState({email: '' , password: '', showPassword: false,});
  const [pwd, setPwd] = useState("");
  const [errMsg, setErrMsg] = useState("");

  useEffect(() => {
    userRef.current.focus();
  }, []);

  useEffect(() => {
    setErrMsg("");
  }, [user,]);

  const handleChange = (prop) => (event) => {
    setUser({ ...user, [prop]: event.target.value });
  };

  const handleClickShowPassword = () => {
    setUser({
      ...user,
      showPassword: !user.showPassword,
    });
  };

  const handleMouseDownPassword = (event) => {
    event.preventDefault();
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      setOpen(true);
      dispatch(loginstart());
      const req = {
        email: user.email,
        password: user.password,
      };
      const response = await axios.post(LOGIN_URL, req);
      if (response.data.token.access) {
        setUserData(response.data.token);
        dispatch(loginsucces(response.data));
      }
      navigate("/user/dashoard");
      setUser("");
      setPwd("");

      setOpen(false);
    } catch (err) {
      console.log("err :>> ", err);
      setOpen(false);
      if (!err.response) {
        setErrMsg("please verify your email");
      } else if (err.response.status === 400) {
        setErrMsg("Missing Username or Password");
      } else if (err.response.status === 401) {
        setErrMsg("Unauthorized");
      } else if (err.response.status === 404) {
        setErrMsg(err.response.data.errors.non_field_errors);
      } else {
        setErrMsg("Login Failed");
      }
      dispatch(loginfail(errMsg));
      errRef.current.focus();
    }
  };

  return (
    <ThemeProvider theme={theme}>
      <div>
        <Backdrop
          sx={{ color: "#fff", zIndex: (theme) => theme.zIndex.drawer + 1 }}
          open={open}
        >
          <CircularProgress color="inherit" />
        </Backdrop>
      </div>
      <Container className="Auth-form-container" component="main" maxWidth="xs">
        <Box
          className="Auth-form"
          sx={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
          }}
        >
          <Avatar sx={{ m: 1, bgcolor: "secondary.main" }}>
            <LockOutlinedIcon />
          </Avatar>
          <h3 className="Auth-form-title">Login</h3>
          <Box
            className="Auth-form-content"
            onSubmit={handleSubmit}
            component="form"
            noValidate
            sx={{ mt: 1 }}
          >
            <p
              style={{
                width: "100%",
                padding: 10,
                marginBottom: 10,
                borderRadius: 4,
                backgroundColor: errMsg ? "red" : "offscreen",
                textAlign: "center",
                color: "white",
                textTransform: "capitalize",
              }}
              ref={errRef}
              className={errMsg ? "errmsg" : "offscreen"}
              aria-live="assertive"
            >
              {errMsg}
            </p>

            <Grid container spacing={2}>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  name="email"
                  size="small"
                  label="Email"
                  variant="outlined"
                  ref={userRef}
                  autoComplete="off"
                  onChange={handleChange('email')}
                  value={user.email}
                  required
                />
              </Grid>
              <Grid rowSpacing={0.5} item xs={12}>
              <FormControl variant="outlined" size="small" fullWidth>
          <InputLabel htmlFor="outlined-adornment-password">Password</InputLabel>
          <OutlinedInput
            id="outlined-adornment-password"
            type={user.showPassword ? 'text' : 'password'}
            value={user.password}
            onChange={handleChange('password')}
            endAdornment={
              <InputAdornment position="end">
                <IconButton
                  aria-label="toggle password visibility"
                  onClick={handleClickShowPassword}
                  onMouseDown={handleMouseDownPassword}
                  edge="end"
                >
                  {user.showPassword ? <VisibilityOff /> : <Visibility />}
                </IconButton>
              </InputAdornment>
            }
            label="Password"
          />
        </FormControl>
                {/* <TextField
                  fullWidth
                  name="password"
                  size="small"
                  type="Password"
                  label="Password"
                  variant="outlined"
                  onChange={(e) => setPwd(e.target.value)}
                  value={pwd}
                  required
                /> */}
              </Grid>
            </Grid>
            <Button
              type="submit"
              fullWidth
              variant="contained"
              sx={{ mt: 3, mb: 2 }}
            >
              Login
            </Button>
            <Grid container justifyContent="center">
              <Grid item>
                <Link to="/forgot-password" className="link-primary">
                  Forgot Password? Click Here
                </Link>
              </Grid>
            </Grid>
          </Box>
        </Box>
      </Container>
    </ThemeProvider>
  );
};
