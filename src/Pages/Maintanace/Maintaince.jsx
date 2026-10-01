import React from "react";
import {
  Box,
  Button,
  Chip,
  Container,
  Paper,
  Stack,
  Typography,
} from "@mui/material";
import { useNavigate } from "react-router-dom";

import BuildCircleOutlinedIcon from "@mui/icons-material/BuildCircleOutlined";
import ArrowBackRoundedIcon from "@mui/icons-material/ArrowBackRounded";
import RefreshRoundedIcon from "@mui/icons-material/RefreshRounded";

import maintenanceImg from "../../Images/MAINTENANCE.gif";

export default function Maintaince() {
  const navigate = useNavigate();

  const handleLogin = () => {
    navigate("/");
  };

  const handleRefresh = () => {
    window.location.reload();
  };

  return (
    <Box
      sx={{
        minHeight: "100vh",
        position: "relative",
        overflow: "hidden",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        background:
          "linear-gradient(135deg, #f8faff 0%, #eef3ff 45%, #f1fbff 100%)",
        px: 2,
        py: 4,

        "&::before": {
          content: '""',
          position: "absolute",
          width: 420,
          height: 420,
          borderRadius: "50%",
          background:
            "linear-gradient(135deg, rgba(63,81,181,0.14), rgba(33,150,243,0.04))",
          top: -180,
          right: -100,
          filter: "blur(4px)",
        },

        "&::after": {
          content: '""',
          position: "absolute",
          width: 350,
          height: 350,
          borderRadius: "50%",
          background:
            "linear-gradient(135deg, rgba(0,188,212,0.10), rgba(63,81,181,0.03))",
          bottom: -170,
          left: -120,
        },
      }}
    >
      <Container maxWidth="md" sx={{ position: "relative", zIndex: 1 }}>
        <Paper
          elevation={0}
          sx={{
            position: "relative",
            overflow: "hidden",
            borderRadius: { xs: 3, sm: 5 },
            border: "1px solid rgba(99, 102, 241, 0.12)",
            backgroundColor: "rgba(255,255,255,0.92)",
            backdropFilter: "blur(14px)",
            boxShadow: "0 24px 70px rgba(31, 38, 135, 0.12)",

            "&::before": {
              content: '""',
              position: "absolute",
              top: 0,
              left: 0,
              right: 0,
              height: 5,
              background:
                "linear-gradient(90deg, #3949ab 0%, #5c6bc0 45%, #29b6f6 100%)",
            },
          }}
        >
          <Box
            sx={{
              display: "flex",
              flexDirection: { xs: "column", md: "row" },
              alignItems: "center",
              gap: { xs: 2, md: 5 },
              px: { xs: 3, sm: 5, md: 6 },
              py: { xs: 4, sm: 5 },
            }}
          >
            {/* Left Illustration */}
            <Box
              sx={{
                width: { xs: "100%", md: "45%" },
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              <Box
                sx={{
                  width: { xs: 210, sm: 260, md: 300 },
                  height: { xs: 210, sm: 260, md: 300 },
                  borderRadius: "50%",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  position: "relative",
                  background:
                    "linear-gradient(135deg, rgba(63,81,181,0.07), rgba(41,182,246,0.10))",

                  "&::before": {
                    content: '""',
                    position: "absolute",
                    inset: 18,
                    borderRadius: "50%",
                    border: "1px dashed rgba(63,81,181,0.18)",
                  },
                }}
              >
                <Box
                  component="img"
                  src={maintenanceImg}
                  alt="System maintenance"
                  sx={{
                    width: "82%",
                    maxHeight: 250,
                    objectFit: "contain",
                    position: "relative",
                    zIndex: 1,
                    animation: "maintenanceFloat 3s ease-in-out infinite",
                  }}
                />
              </Box>
            </Box>

            {/* Right Content */}
            <Box
              sx={{
                width: { xs: "100%", md: "55%" },
                textAlign: { xs: "center", md: "left" },
              }}
            >
              <Chip
                icon={<BuildCircleOutlinedIcon />}
                label="Maintenance in progress"
                size="small"
                sx={{
                  mb: 2,
                  fontWeight: 700,
                  px: 0.5,
                  color: "#3949ab",
                  backgroundColor: "rgba(63, 81, 181, 0.08)",
                  border: "1px solid rgba(63, 81, 181, 0.12)",
                }}
              />

              <Typography
                sx={{
                  fontSize: { xs: "54px", sm: "66px" },
                  fontWeight: 800,
                  lineHeight: 1,
                  letterSpacing: "-3px",
                  background:
                    "linear-gradient(90deg, #283593 0%, #3f51b5 55%, #0288d1 100%)",
                  WebkitBackgroundClip: "text",
                  WebkitTextFillColor: "transparent",
                  mb: 1,
                }}
              >
                503
              </Typography>

              <Typography
                variant="h4"
                sx={{
                  fontSize: { xs: "24px", sm: "30px" },
                  fontWeight: 800,
                  color: "#1e293b",
                  mb: 1.5,
                }}
              >
                We’ll be back shortly
              </Typography>

              <Typography
                variant="body1"
                sx={{
                  color: "#64748b",
                  fontSize: { xs: "14px", sm: "16px" },
                  lineHeight: 1.8,
                  maxWidth: 480,
                  mx: { xs: "auto", md: 0 },
                }}
              >
                Our system is currently undergoing scheduled maintenance to
                improve performance and reliability. Please try again in a few
                moments.
              </Typography>

              <Box
                sx={{
                  mt: 3,
                  p: 2,
                  borderRadius: 2.5,
                  backgroundColor: "#f8fafc",
                  border: "1px solid #e8edf4",
                }}
              >
                <Stack
                  direction="row"
                  spacing={1.5}
                  alignItems="center"
                  justifyContent={{ xs: "center", md: "flex-start" }}
                >
                  <Box
                    sx={{
                      width: 9,
                      height: 9,
                      borderRadius: "50%",
                      backgroundColor: "#f59e0b",
                      boxShadow: "0 0 0 5px rgba(245,158,11,0.12)",
                      flexShrink: 0,
                    }}
                  />

                  <Box sx={{ textAlign: "left" }}>
                    <Typography
                      variant="body2"
                      sx={{
                        color: "#334155",
                        fontWeight: 700,
                      }}
                    >
                      System temporarily unavailable
                    </Typography>

                    <Typography variant="caption" sx={{ color: "#94a3b8" }}>
                      Your data remains safe while maintenance is in progress.
                    </Typography>
                  </Box>
                </Stack>
              </Box>

              <Stack
                direction={{ xs: "column", sm: "row" }}
                spacing={1.5}
                sx={{
                  mt: 3.5,
                  justifyContent: { xs: "center", md: "flex-start" },
                }}
              >
                <Button
                  variant="contained"
                  startIcon={<RefreshRoundedIcon />}
                  onClick={handleRefresh}
                  sx={{
                    minWidth: 150,
                    py: 1.15,
                    px: 3,
                    borderRadius: 2.5,
                    textTransform: "none",
                    fontWeight: 700,
                    boxShadow: "none",
                    background:
                      "linear-gradient(90deg, #3949ab 0%, #3f51b5 50%, #0288d1 100%)",

                    "&:hover": {
                      boxShadow: "0 8px 20px rgba(63, 81, 181, 0.22)",
                      background:
                        "linear-gradient(90deg, #303f9f 0%, #3949ab 50%, #0277bd 100%)",
                    },
                  }}
                >
                  Try Again
                </Button>

                <Button
                  variant="outlined"
                  startIcon={<ArrowBackRoundedIcon />}
                  onClick={handleLogin}
                  sx={{
                    minWidth: 150,
                    py: 1.15,
                    px: 3,
                    borderRadius: 2.5,
                    textTransform: "none",
                    fontWeight: 700,
                    borderColor: "#d8deeb",
                    color: "#475569",

                    "&:hover": {
                      borderColor: "#3f51b5",
                      color: "#3f51b5",
                      backgroundColor: "rgba(63, 81, 181, 0.04)",
                    },
                  }}
                >
                  Go Back
                </Button>
              </Stack>
            </Box>
          </Box>

          {/* Footer */}
          <Box
            sx={{
              px: 3,
              py: 1.5,
              textAlign: "center",
              borderTop: "1px solid #edf0f5",
              backgroundColor: "#fbfcfe",
            }}
          >
            <Typography
              variant="caption"
              sx={{
                color: "#94a3b8",
                fontWeight: 500,
              }}
            >
              Glutape India CRM • Scheduled Maintenance
            </Typography>
          </Box>
        </Paper>
      </Container>

      <style>
        {`
          @keyframes maintenanceFloat {
            0% {
              transform: translateY(0px);
            }

            50% {
              transform: translateY(-10px);
            }

            100% {
              transform: translateY(0px);
            }
          }

          @media (prefers-reduced-motion: reduce) {
            img {
              animation: none !important;
            }
          }
        `}
      </style>
    </Box>
  );
}
