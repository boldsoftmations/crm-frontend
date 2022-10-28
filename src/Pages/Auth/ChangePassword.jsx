import React, { useState } from "react";
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
  Modal,
  Typography,
} from "@mui/material";
import LockResetIcon from "@mui/icons-material/LockReset";
import axios from "axios";
import { Link, useParams } from "react-router-dom";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
const RESET_URL = `${process.env.REACT_APP_DEPLOY_BACKEND_URL}/api/user/reset-password`;

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

export const ChangePassword = () => {
  const [password, setPassword] = useState("");
  const [password2, setPassword2] = useState("");
  const theme = createTheme();
  const [open, setOpen] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);
  const [message, setMessage] = useState("");
  const { id } = useParams();
  const { token } = useParams();
  console.log("token", token);

  console.log("id", id);
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setOpen(true);

      const req = {
        password: password,
        password2: password2,
      };
      const response = await axios.post(`${RESET_URL}/${id}/${token}/`, req);
      setMessage(response.data.message);
      setModalOpen(true);

      setOpen(false);
    } catch (err) {
      console.log("err :>> ", err);
      setOpen(false);
    }
  };

  return (
    <ThemeProvider className="main" theme={theme}>
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
            Password Reset Confirmation
          </Typography>
          <Typography
            id="modal-modal-description"
            sx={{ mb: 2, mt: 2, color: "#3980F4" }}
          >
            {message}

            <CheckCircleIcon color="success" />
          </Typography>
          <Button variant="contained" component={Link} to="/login">
            LOGIN
          </Button>
        </Box>
      </Modal>
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
            <LockResetIcon />
          </Avatar>
          <h3 className="Auth-form-title">Forgot Password</h3>

          <Box
            className="Auth-form-content"
            onSubmit={(e) => handleSubmit(e)}
            component="form"
            noValidate
            sx={{ mt: 1 }}
          >
            <Grid container spacing={2}>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  size="small"
                  label="Password"
                  variant="outlined"
                  name="password"
                  type={"password"}
                  onChange={(e) => setPassword(e.target.value)}
                  value={password}
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  size="small"
                  label="Confirm Password"
                  variant="outlined"
                  name="password2"
                  type={"password"}
                  onChange={(e) => setPassword2(e.target.value)}
                  value={password2}
                />
              </Grid>
            </Grid>
            <Button
              type="submit"
              fullWidth
              variant="contained"
              sx={{ mt: 3, mb: 2 }}
            >
              Submit
            </Button>
          </Box>
        </Box>
      </Container>
    </ThemeProvider>
  );
};
