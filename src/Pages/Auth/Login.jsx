import { Link, useNavigate } from "react-router-dom";
import React, { useEffect, useRef, useState } from "react";

import {
  loginstart,
  loginsucces,
  loginfail,
  getProfileUser,
} from "./../../Redux/Action/Action";
import "../CommonStyle.css";

import {
  ThemeProvider,
  createTheme,
  Box,
  Grid,
  OutlinedInput,
  FormControl,
  InputLabel,
  IconButton,
  InputAdornment,
  Avatar,
  TextField,
} from "@mui/material";
import Visibility from "@mui/icons-material/Visibility";
import VisibilityOff from "@mui/icons-material/VisibilityOff";
import { useDispatch } from "react-redux";
import { setUserData } from "./../../services/TokenService";
import { CustomButton } from "../../Components/CustomButton";
import { ErrorMessage } from "./../../Components/ErrorMessage/ErrorMessage";
import { CustomLoader } from "./../../Components/CustomLoader";
import LockOutlinedIcon from "@mui/icons-material/LockOutlined";
import UserProfileService from "../../services/UserProfileService";

const paperStyle = {
  padding: 20,
  height: "73vh",
  width: 340,
  margin: "0 auto",
};
const avatarStyle = { backgroundColor: "#1bbd7e" };
// const btnstyle = { margin: "8px 0" };

export const Login = () => {
  const [open, setOpen] = useState(false);
  const [token, setToken] = useState([]);
  const theme = createTheme();
  let navigate = useNavigate();
  const dispatch = useDispatch();
  const userRef = useRef();
  const errRef = useRef();

  const [user, setUser] = useState({
    email: "",
    password: "",
    showPassword: false,
  });
  const [errMsg, setErrMsg] = useState("");

  useEffect(() => {
    userRef.current.focus();
  }, []);

  useEffect(() => {
    setErrMsg("");
  }, [user]);

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
      const response = await UserProfileService.login(req);
      if (response.data.token.access) {
        setUserData(response.data.token);
        dispatch(loginsucces(response.data));
        dispatch(getProfileUser(response.data));
        setToken(response.data.token);
        getUsers();
      }

      navigate("/user/analytics");
      setUser("");

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

  const getUsers = async () => {
    try {
      setOpen(true);
      const response = await UserProfileService.getProfile();
      dispatch(getProfileUser(response.data));
      setOpen(false);
    } catch (err) {
      console.error(err);
    } finally {
      setOpen(false);
    }
  };

  return (
    <ThemeProvider theme={theme}>
      <CustomLoader open={open} />
      <Grid>
        {/* <Paper style={paperStyle}> */}
        <Grid align="center">
          <Avatar style={avatarStyle}>
            <LockOutlinedIcon />
          </Avatar>
          <h2>Sign In</h2>
        </Grid>
        <Box
          // className="Auth-form-content"
          onSubmit={handleSubmit}
          component="form"
          noValidate
        >
          <ErrorMessage errMsg={errMsg} errRef={errRef} />
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
                onChange={handleChange("email")}
                value={user.email}
                required
              />
            </Grid>
            <Grid rowSpacing={0.5} item xs={12}>
              <FormControl variant="outlined" size="small" fullWidth>
                <InputLabel htmlFor="outlined-adornment-password">
                  Password
                </InputLabel>
                <OutlinedInput
                  id="outlined-adornment-password"
                  type={user.showPassword ? "text" : "password"}
                  value={user.password}
                  onChange={handleChange("password")}
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
            </Grid>
          </Grid>
          <CustomButton
            type="submit"
            fullWidth
            variant="contained"
            sx={{ mt: 3, mb: 2 }}
            text={"Sign In"}
          />
          {/* <Button
          type="submit"
          fullWidth
          variant="contained"
          sx={{ mt: 3, mb: 2 }}
        >
          Sign In
        </Button> */}
          <Grid container justifyContent="center">
            <Grid item>
              <Link to="/forgot-password" className="link-primary">
                Forgot Password? Click Here
              </Link>
            </Grid>
          </Grid>
        </Box>
        {/* </Paper> */}
      </Grid>
    </ThemeProvider>
  );
};
