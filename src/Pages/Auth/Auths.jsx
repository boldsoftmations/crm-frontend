import { Paper, Box, Tab, Tabs } from "@mui/material";
import PropTypes from "prop-types";
import React, { useState } from "react";
import { Login } from "./Login";
import { SignUp } from "./SignUp";
import * as Components from "./Component";
const paperStyle = { width: 340, margin: "20px auto" };

export const Auths = () => {
  const [signIn, setSignIn] = useState(true);

  const handleToggle = (value) => {
    setSignIn(value);
  };

  return (
    <Components.ParentContainer>
      <Components.Container>
        <Components.SignUpContainer signinIn={signIn}>
          <Components.Form>
            <SignUp />
          </Components.Form>
        </Components.SignUpContainer>

        <Components.SignInContainer signinIn={signIn}>
          <Components.Form>
            <Login />
          </Components.Form>
        </Components.SignInContainer>

        <Components.OverlayContainer signinIn={signIn}>
          <Components.Overlay signinIn={signIn}>
            <Components.LeftOverlayPanel signinIn={signIn}>
              <Components.Title>Welcome to Glutape!</Components.Title>
              <Components.Paragraph>
                Enter your personal details and start your journey with us
              </Components.Paragraph>
              <Components.GhostButton onClick={() => handleToggle(true)}>
                Sign In
              </Components.GhostButton>
            </Components.LeftOverlayPanel>

            <Components.RightOverlayPanel signinIn={signIn}>
              <Components.Title>Hello, Team!</Components.Title>
              <Components.Paragraph>
                To keep connected with us please login with your personal info
              </Components.Paragraph>
              <Components.GhostButton onClick={() => handleToggle(false)}>
                Sign Up
              </Components.GhostButton>
            </Components.RightOverlayPanel>
          </Components.Overlay>
        </Components.OverlayContainer>
      </Components.Container>
    </Components.ParentContainer>
  );
};
