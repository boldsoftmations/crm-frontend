import React, { useEffect, useState } from "react";
import {
  Avatar,
  Button,
  Divider,
  Grid,
  Paper,
  Typography,
  Box,
} from "@mui/material";
import { styled } from "@mui/material/styles";
import { Popup } from "../../Components/Popup";
import { UserProfileCreate } from "./UserProfile/UserProfileCreate";
import UserProfileService from "../../services/UserProfileService";
import { CustomLoader } from "../../Components/CustomLoader";
import { Link } from "react-router-dom";

export const Profile = () => {
  const [open, setOpen] = useState(false);
  const [openPopup, setOpenPopup] = useState(false);
  const [userData, setUserData] = useState([]);

  useEffect(() => {
    getUsers();
  }, []);

  const getUsers = async () => {
    try {
      setOpen(true);
      const response = await UserProfileService.getProfile();
      setUserData(response.data);
      setOpen(false);
    } catch (err) {
      console.error(err);
    } finally {
      setOpen(false);
    }
  };

  return (
    <Grid container justifyContent="center" sx={{ marginTop: "2em" }}>
      <CustomLoader open={open} />
      <Paper style={paperStyle} elevation={4}>
        <Box align="center" sx={{ paddingBottom: "1em" }}>
          <Avatar style={avatarStyle}>
            {(userData.first_name && userData.first_name.charAt(0)) || "U"}
          </Avatar>
          <Typography variant="h5" sx={{ marginTop: "0.3em" }}>
            {userData.first_name
              ? `${userData.first_name} ${userData.last_name}`
              : "User Profile"}
          </Typography>
        </Box>
        <Divider />
        <Grid container spacing={2} sx={{ marginTop: ".3em" }}>
          {/* User Information Section */}
          <Grid
            item
            xs={12}
            sx={{
              backgroundColor: "#f9f9f9",
              padding: 2,
              borderRadius: 2,
              gap: 1,
              marginX: 2,
              marginTop: 2,
              boxShadow: "0px 2px 5px rgba(0, 0, 0, 0.1)",
            }}
          >
            <Typography
              sx={{ fontSize: "1rem", marginBottom: "0.8rem", color: "#555" }}
            >
              <strong>Employee ID:</strong>{" "}
              <span style={{ fontWeight: "300" }}>
                {userData.employee_id || "N/A"}
              </span>
            </Typography>
            <Typography
              sx={{ fontSize: "1rem", marginBottom: "0.8rem", color: "#555" }}
            >
              <strong>Email:</strong>{" "}
              <span style={{ fontWeight: "300" }}>
                {userData.email || "N/A"}
              </span>
            </Typography>
            <Typography
              sx={{
                fontSize: "1rem",
                marginBottom: "0.8rem",
                color: "#555",
                display: "flex",
                alignItems: "center",
                gap: 1, // Spacing between label and value
              }}
            >
              <strong>Staff:</strong>
              <span
                style={{
                  fontWeight: "500", // Medium weight for better visibility
                  color: "white",
                  border: "1px solid #2e7d32", // Green border for emphasis
                  padding: "4px 12px", // Padding for consistent spacing
                  borderRadius: "8px", // Rounded corners
                  backgroundColor: "#1bbd7e", // Highlight background color
                  fontSize: "0.9rem", // Slightly smaller font size for the value
                  display: "inline-block", // Ensures proper alignment
                }}
              >
                {userData.groups || "N/A"}
              </span>
            </Typography>
          </Grid>

          {/* Complete Profile Section */}

          <Grid
            item
            xs={12}
            align="center"
            display="flex"
            flexDirection="column"
            justifyContent="center"
            alignItems="center"
            sx={{
              backgroundColor: "#f2f3fa",
              padding: 2,
              borderRadius: 2,
              gap: 1,
              marginX: 2,
              marginTop: 2,
              boxShadow: "0px 2px 5px rgba(0, 0, 0, 0.1)",
            }}
          >
            {!userData.is_created && (
              <Button
                variant="contained"
                color="primary"
                size="small"
                onClick={() => setOpenPopup(true)}
                sx={{
                  backgroundColor: "#1976d2",
                  "&:hover": {
                    backgroundColor: "#115293",
                  },
                  width: "80%",
                }}
              >
                Complete Profile
              </Button>
            )}
            <Link
              to="/reset-password"
              style={{ textDecoration: "none", width: "80%" }}
            >
              <Button
                variant="outlined"
                size="small"
                sx={{
                  borderColor: "#269435",
                  backgroundColor: "#269435",
                  color: "white",
                  "&:hover": {
                    borderColor: "#388e3c",
                    backgroundColor: "#114217",
                    color: "white",
                  },
                  width: "100%",
                }}
              >
                Reset Password
              </Button>
            </Link>
          </Grid>
        </Grid>
      </Paper>
      <Popup
        fullScreen={true}
        title={"Create User Profile"}
        openPopup={openPopup}
        setOpenPopup={setOpenPopup}
      >
        <UserProfileCreate setOpenPopup={setOpenPopup} getUsers={getUsers} />
      </Popup>
    </Grid>
  );
};

// Styling
const paperStyle = {
  padding: 20,
  width: 350,
  borderRadius: 15,
  backgroundColor: "#f9f9f9",
};
const avatarStyle = {
  backgroundColor: "#1bbd7e",
  width: 60,
  height: 60,
  fontSize: "1.7rem",
};
const InfoText = styled(Typography)(() => ({
  fontSize: "1rem",
  marginBottom: "0.5em",
}));
