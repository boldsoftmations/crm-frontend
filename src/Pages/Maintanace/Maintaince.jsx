import { Box, Typography, Button, Paper } from "@mui/material";
import React from "react";
import { useNavigate } from "react-router-dom";
import maintenanceImg from "../../Images/MAINTENANCE.gif"; // your image

export default function Maintaince() {
  const naviagation = useNavigate();
  const handleLogin = () => {
    // window.location.reload();
    naviagation("/");
  };
  return (
    <Box
      sx={{
        // marginTop: "50px",
        // height: "20vh",
        width: "98%",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        mt: 0,
        mx: "auto",
        p: 2,
        position: "absolute",
      }}
    >
      <Paper
        elevation={4}
        sx={{
          p: 4,
          borderRadius: 4,
          maxWidth: 600,
          width: "100%",
          textAlign: "center",
          animation: "fadeIn 1s ease",
          // bgcolor: "#fff",
          backgroundColor: "#f7f9fc",
          background:
            "linear-gradient(90deg, rgba(242, 242, 255, 1) 0%, rgba(227, 227, 255, 1) 35%, rgba(93, 188, 207, 1) 100%)",
        }}
      >
        {/* Image */}
        <Box
          component="img"
          src={maintenanceImg}
          alt="Maintenance"
          sx={{
            width: "60%",
            mx: "auto",
            display: "block",
            mb: 1,
            animation: "float 3s ease-in-out infinite",
          }}
        />

        {/* Code Title */}
        <Typography
          variant="h3"
          fontWeight="bold"
          sx={{ color: "#2d2f3a", mb: 0.5 }}
        >
          503
        </Typography>

        {/* Subtitle */}
        <Typography
          variant="h5"
          fontWeight="500"
          sx={{ mb: 0.5, color: "red" }}
        >
          Under Maintenance
        </Typography>

        <Typography variant="body1" color="text.secondary">
          Our system is performing scheduled updates.
          <br />
          We’ll be back shortly.
        </Typography>

        {/* Retry Button */}
        <Button
          variant="contained"
          color="primary"
          hoverColor="secondary"
          sx={{
            mt: 4,
            py: 1.2,
            px: 4,
            fontWeight: "bold",
            borderRadius: 2,
            ":hover": {
              backgroundColor:
                "linear-gradient(90deg, rgba(242, 242, 255, 1) 0%, rgba(243, 243, 243, 1) 35%, rgba(59, 79, 255, 1) 100%)  ",
            },
          }}
          onClick={handleLogin}
        >
          GO BACK
        </Button>
      </Paper>

      {/* Keyframe Animations */}
      <style>
        {`
          @keyframes fadeIn {
            from { opacity: 0; transform: translateY(10px); }
            to { opacity: 1; transform: translateY(0); }
          }

          @keyframes float {
            0% { transform: translateY(0px); }
            50% { transform: translateY(-10px); }
            100% { transform: translateY(0px); }
          }
        `}
      </style>
    </Box>
  );
}
