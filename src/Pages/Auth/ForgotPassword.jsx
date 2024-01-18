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
} from "@mui/material";
import LockResetIcon from "@mui/icons-material/LockReset";
import KeyboardBackspaceIcon from "@mui/icons-material/KeyboardBackspace";
import { Link } from "react-router-dom";
import CustomTextField from "../../Components/CustomTextField";
import { CustomLoader } from "../../Components/CustomLoader";
import { Popup } from "../../Components/Popup";
import UserProfileService from "../../services/UserProfileService";

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
        const response = await UserProfileService.sendResetPasswordEmail(req);
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
      <CustomLoader open={open} />
      <Popup
        openPopup={modalOpen}
        setOpenPopup={setModalOpen}
        title="Verify Your Email"
        maxWidth="md"
      >
        {message}
      </Popup>
      <Container className="Auth-form-container" component="main" maxWidth="xs">
        <Box
          className="Auth-form"
          sx={
            {
              // display: "flex",
              // flexDirection: "column",
              // alignItems: "center",
            }
          }
        >
          <Box sx={{ ml: 8 }} display={"flex"} justifyContent="flex-start">
            <Link to={"/"}>
              <KeyboardBackspaceIcon />
              Back To Login
            </Link>
          </Box>
          <Box display={"flex"} justifyContent="center">
            <Avatar sx={{ m: 1, bgcolor: "secondary.main" }}>
              <LockResetIcon />
            </Avatar>
          </Box>
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
                <CustomTextField
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
