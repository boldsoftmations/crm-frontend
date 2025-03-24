import React, { useState } from "react";
import "../CommonStyle.css";
import {
  Avatar,
  Box,
  Grid,
  Button,
  IconButton,
  InputAdornment,
} from "@mui/material";
import LockResetIcon from "@mui/icons-material/LockReset";
import Visibility from "@mui/icons-material/Visibility";
import VisibilityOff from "@mui/icons-material/VisibilityOff";
import CustomTextField from "../../Components/CustomTextField";
import { CustomLoader } from "../../Components/CustomLoader";
import UserProfileService from "../../services/UserProfileService";
import CustomSnackbar from "../../Components/CustomerSnackbar";
import { useNavigate } from "react-router-dom";

export const ChangePassword = () => {
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false); // For toggling password visibility
  const [open, setOpen] = useState(false);
  const navigate = useNavigate();
  const [alertmsg, setAlertMsg] = useState({
    message: "",
    severity: "",
    open: false,
  });

  const handleClose = () => {
    setAlertMsg({ open: false });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setOpen(true);
      const req = {
        password: password,
      };
      const response = await UserProfileService.resetPasswordByUser(req);
      if (response.status === 200) {
        setAlertMsg({
          message: response.data.message || "Password changed successfully",
          severity: "success",
          open: true,
        });
        setTimeout(() => {
          navigate("/user/analytics");
        }, 1000);
      }
    } catch (err) {
      setAlertMsg({
        message: err.response.data.error || "An error occurred. Try again.",
        severity: "error",
        open: true,
      });
    } finally {
      setOpen(false);
    }
  };

  const handleTogglePasswordVisibility = () => {
    setShowPassword((prev) => !prev);
  };

  return (
    <>
      <CustomLoader open={open} />
      <CustomSnackbar
        open={alertmsg.open}
        message={alertmsg.message}
        severity={alertmsg.severity}
        onClose={handleClose}
      />
      <Box
        className="Auth-form"
        sx={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          width: "40%",
          margin: "auto",
          marginTop: "5%",
        }}
      >
        <Avatar sx={{ m: 1, bgcolor: "secondary.main" }}>
          <LockResetIcon />
        </Avatar>
        <Box
          className="Auth-form-content"
          onSubmit={handleSubmit}
          component="form"
          noValidate
          sx={{ mt: 1 }}
        >
          <Grid container spacing={2}>
            <Grid item xs={12}>
              <CustomTextField
                fullWidth
                size="small"
                label="Password"
                variant="outlined"
                name="password"
                type={showPassword ? "text" : "password"} // Toggle between "text" and "password"
                onChange={(e) => setPassword(e.target.value)}
                value={password}
                InputProps={{
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton
                        onClick={handleTogglePasswordVisibility}
                        edge="end"
                      >
                        {showPassword ? <VisibilityOff /> : <Visibility />}
                      </IconButton>
                    </InputAdornment>
                  ),
                }}
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
    </>
  );
};
