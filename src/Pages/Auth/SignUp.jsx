import React, { useState } from "react";
import "../CommonStyle.css";
import { Link, useNavigate } from "react-router-dom";
import LockOutlinedIcon from "@mui/icons-material/LockOutlined";
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
  Modal,
  Typography,
} from "@mui/material";
import axios from "axios";
import * as Yup from "yup";
import { useFormik } from "formik";

const style = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: 400,
  bgcolor: "background.paper",
  border: "2px solid #000",
  boxShadow: 24,
  p: 4,
};

const phoneRegExp =
  /^((\\+[1-9]{1,4}[ \\-]*)|(\\([0-9]{2,3}\\)[ \\-]*)|([0-9]{2,4})[ \\-]*)*?[0-9]{3,4}?[ \\-]*[0-9]{3,4}?$/;
const SIGNUP_URL = `${process.env.REACT_APP_DEPLOY_BACKEND_URL}/api/user/register/`;
// const SIGNUP_URL = `${process.env.REACT_APP_TESTING_BACKEND_URL}/api/user/register/`;

export const SignUp = () => {
  let navigate = useNavigate();
  const [open, setOpen] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);
  const [message, setMessage] = useState("");

  const validationSchema = Yup.object().shape({
    first_name: Yup.string().required("first name is required"),
    last_name: Yup.string().required("last name is required"),
    email: Yup.string().required("Email is required").email("Email is invalid"),
    contact: Yup.string()
      .required("contact is required")
      .matches(phoneRegExp, "Phone number is not valid"),
    password: Yup.string()
      .required("Please Enter your password")
      .matches(
        /^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*#?&])[A-Za-z\d@$!%*#?&]{8,}$/,
        "Must Contain 8 Characters, One Uppercase, One Lowercase, One Number and one special case Character"
      ),
    password2: Yup.string()
      .required("Confirm Password is required")
      .oneOf([Yup.ref("password"), null], "Confirm Password does not match"),
    acceptTerms: Yup.bool().oneOf([true], "Accept Terms is required"),
  });

  const formik = useFormik({
    initialValues: {
      first_name: "",
      last_name: "",
      email: "",
      contact: "",
      password: "",
      password2: "",
    },
    validationSchema: validationSchema,

    onSubmit: async (values) => {
      try {
        const req = {
          first_name: values.first_name,
          last_name: values.last_name,
          email: values.email,
          contact: values.contact,
          password: values.password,
          password2: values.password2,
        };
        setOpen(true);

        const res = await axios.post(SIGNUP_URL, req);
        console.log("res :>> ", res);
        setMessage(res.data.message);
        setModalOpen(true);
        setOpen(false);
      } catch (error) {
        console.log("error", error);
        setOpen(false);
      }
    },
  });

  const theme = createTheme();
  return (
    <div>
      <ThemeProvider theme={theme}>
        <div>
          <Backdrop
            sx={{ color: "#fff", zIndex: (theme) => theme.zIndex.drawer + 1 }}
            open={open}
          >
            <CircularProgress color="inherit" />
          </Backdrop>
        </div>
        <Modal
          open={modalOpen}
          onClose={() => setModalOpen(false)}
          aria-labelledby="modal-modal-title"
          aria-describedby="modal-modal-description"
        >
          <Box sx={style}>
            <Typography id="modal-modal-title" variant="h6" component="h2">
              Verify Your Email
            </Typography>
            <Typography
              id="modal-modal-description"
              sx={{ mb: 2, color: "#3980F4" }}
            >
              {message}
            </Typography>
            <Button variant="contained" component={Link} to="/login">
              LOGIN
            </Button>
          </Box>
        </Modal>
        <Container
          className="Auth-form-container"
          component="main"
          maxWidth="xs"
        >
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
            <h3 className="Auth-form-title">Sign Up</h3>
            <Box
              className="Auth-form-content"
              component="form"
              noValidate
              onSubmit={formik.handleSubmit}
              sx={{ mt: 1 }}
            >
              <Grid container spacing={2}>
                <Grid item xs={12} sm={6}>
                  <TextField
                    required
                    name="first_name"
                    fullWidth={false}
                    size="small"
                    label="First Name"
                    variant="outlined"
                    value={formik.values.first_name}
                    onChange={formik.handleChange}
                    error={
                      formik.touched.first_name &&
                      Boolean(formik.errors.first_name)
                    }
                    helperText={
                      formik.touched.first_name && formik.errors.first_name
                    }
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    required
                    name="last_name"
                    size="small"
                    label="Last Name"
                    variant="outlined"
                    value={formik.values.last_name}
                    onChange={formik.handleChange}
                    error={
                      formik.touched.last_name &&
                      Boolean(formik.errors.last_name)
                    }
                    helperText={
                      formik.touched.last_name && formik.errors.last_name
                    }
                  />
                </Grid>
                <Grid item xs={12}>
                  <TextField
                    required
                    name="email"
                    fullWidth
                    size="small"
                    label="Email"
                    variant="outlined"
                    value={formik.values.email}
                    onChange={formik.handleChange}
                    error={formik.touched.email && Boolean(formik.errors.email)}
                    helperText={formik.touched.email && formik.errors.email}
                  />
                </Grid>
                <Grid item xs={12}>
                  <TextField
                    required
                    name="contact"
                    fullWidth
                    size="small"
                    label="Contact No."
                    type="phone"
                    variant="outlined"
                    value={formik.values.contact}
                    onChange={formik.handleChange}
                    error={
                      formik.touched.contact && Boolean(formik.errors.contact)
                    }
                    helperText={formik.touched.contact && formik.errors.contact}
                  />
                </Grid>

                <Grid item xs={12} sm={6}>
                  <TextField
                    required
                    name="password"
                    size="small"
                    type="password"
                    label="Password"
                    variant="outlined"
                    value={formik.values.password}
                    onChange={formik.handleChange}
                    error={
                      formik.touched.password && Boolean(formik.errors.password)
                    }
                    helperText={
                      formik.touched.password && formik.errors.password
                    }
                  />
                </Grid>
                <Grid rowSpacing={0.5} item xs={12} sm={6}>
                  <TextField
                    required
                    name="password2"
                    size="small"
                    type="Password"
                    label="Confirm Password"
                    variant="outlined"
                    value={formik.values.password2}
                    onChange={formik.handleChange}
                    error={
                      formik.touched.password2 &&
                      Boolean(formik.errors.password2)
                    }
                    helperText={
                      formik.touched.password2 && formik.errors.password
                    }
                  />
                </Grid>
              </Grid>
              <Button
                type="submit"
                fullWidth
                variant="contained"
                sx={{ mt: 3, mb: 2 }}
              >
                Sign Up
              </Button>
              <Grid container justifyContent="center">
                <Grid item>
                  <Link to="/login" className="link-primary">
                    Already have an account? Sign in
                  </Link>
                </Grid>
              </Grid>
            </Box>
          </Box>
        </Container>
      </ThemeProvider>
    </div>
  );
};
