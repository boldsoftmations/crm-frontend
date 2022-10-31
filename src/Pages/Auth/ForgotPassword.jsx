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

const RESET_URL = `${process.env.REACT_APP_DEPLOY_BACKEND_URL}/api/user/send-reset-password-email/`;
// const RESET_URL = `${process.env.REACT_APP_TESTING_BACKEND_URL}/api/user/send-reset-password-email/`;

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

export const ForgotPassword = () => {
  const [email, setEmail] = useState("");
  const theme = createTheme();
  const [open, setOpen] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);
  const [message, setMessage] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      setOpen(true);
      if (email) {
        const req = {
          email: email,
        };
        const response = await axios.post(RESET_URL, req);
        setMessage(response.data.message);
        setModalOpen(true);
        setEmail("");
      }
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
            Verify Your Email
          </Typography>
          <Typography
            id="modal-modal-description"
            sx={{ mb: 2, mt: 2, color: "#3980F4" }}
          >
            {message}
          </Typography>
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
                  label="Email"
                  variant="outlined"
                  name="email"
                  onChange={(e) => setEmail(e.target.value)}
                  value={email}
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
