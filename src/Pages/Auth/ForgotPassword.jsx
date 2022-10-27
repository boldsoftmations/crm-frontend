import React from "react";
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
} from "@mui/material";
import LockResetIcon from "@mui/icons-material/LockReset";

export const ForgotPassword = () => {
  const theme = createTheme();
  return (
    <ThemeProvider className="main" theme={theme}>
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
            component="form"
            noValidate
            sx={{ mt: 1 }}
          >
            <Grid container spacing={2}>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  size="small"
                  id="outlined-basic"
                  label="Email"
                  variant="outlined"
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
