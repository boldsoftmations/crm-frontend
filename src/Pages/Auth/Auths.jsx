import React, { useState } from "react";
import { Login } from "./Login";
import * as Components from "./Component";

export const Auths = () => {
  const [signIn] = useState(true);
  return (
    <Components.ParentContainer>
      <Components.Container>
        <Components.SignInContainer signinIn={signIn}>
          <Components.Form>
            <Login />
          </Components.Form>
        </Components.SignInContainer>

        <Components.OverlayContainer signinIn={signIn}>
          <Components.Overlay signinIn={signIn}>
            <Components.RightOverlayPanel signinIn={signIn}>
              <Components.Title>Hello, Team!</Components.Title>
              <Components.Paragraph>
                To keep connected with us please login with your personal info
              </Components.Paragraph>
            </Components.RightOverlayPanel>
          </Components.Overlay>
        </Components.OverlayContainer>
      </Components.Container>
    </Components.ParentContainer>
  );
};
