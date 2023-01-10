import React from "react";
import { Avatar, Grid, Paper, Switch, Typography } from "@mui/material";
import { styled } from "@mui/material/styles";
import AccountCircleOutlinedIcon from "@mui/icons-material/AccountCircleOutlined";
import { useSelector } from 'react-redux';
export const Profile = () => {
    const data = useSelector((state) => state.auth);
    const userData = data.profile;

  return (
    <Grid sx={{ marginTop: "5em" }}>
      <Paper style={paperStyle}>
        <Grid align="center">
          <Avatar style={avatarStyle}>
            <AccountCircleOutlinedIcon />
          </Avatar>
          <h2>User Profile</h2>
        </Grid>
        <Grid container spacing={2}>
          <Grid item xs={12}>
            <Text>
              ID :- <span>{userData.emp_id}</span>
            </Text>
          </Grid>
          <Grid item xs={12}>
            <Text>
              Name :-{" "}
              <span>
                {userData.first_name}
                {userData.last_name}
              </span>
            </Text>
          </Grid>
          <Grid item xs={12}>
            <Text>
              Email :- <span>{userData.email}</span>
            </Text>
          </Grid>
          <Grid item xs={12}>
            {userData.is_staff === true ? (
              <Text>
                Staff :-{" "}
                <Switch
                  checked={userData.is_staff ? userData.is_staff : false}
                  inputProps={{ "aria-label": "controlled" }}
                />
              </Text>
            ) : (
              <Text>
                Staff :- <span>{userData.groups}</span>
              </Text>
            )}
          </Grid>
        </Grid>
      </Paper>
    </Grid>
  );
};

const paperStyle = {
  padding: 20,
  height: "50vh",
  width: 340,
  margin: "0 auto",
};
const avatarStyle = { backgroundColor: "#1bbd7e" };
const Text = styled(Typography)(() => ({
  padding: "0px",
}));
