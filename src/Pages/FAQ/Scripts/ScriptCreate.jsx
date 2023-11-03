import React, { useState } from "react";
import UserProfileService from "../../../services/UserProfileService";
import { Box, Button, Grid } from "@mui/material";
import { CustomLoader } from "../../../Components/CustomLoader";
import CustomTextField from "../../../Components/CustomTextField";

export const ScriptCreate = ({ getScriptDetails, setOpenPopup }) => {
  const [script, setScript] = useState([]);
  const [open, setOpen] = useState(false);

  const handleFormChange = (event) => {
    const { name, value } = event.target;
    setScript({ ...script, [name]: value });
  };

  const createScript = async (e) => {
    try {
      e.preventDefault();
      const req = {
        subject: script.subject,
        script: script.script,
      };

      setOpen(true);
      await UserProfileService.createScriptData(req);

      setOpenPopup(false);
      setOpen(false);
      getScriptDetails();
    } catch (error) {
      setOpen(false);
      console.log("error create scripts", error);
    }
  };

  return (
    <>
      <CustomLoader open={open} />
      <Box component="form" noValidate onSubmit={(e) => createScript(e)}>
        <Grid container spacing={2}>
          <Grid item xs={12}>
            <CustomTextField
              fullWidth
              name="subject"
              size="small"
              label="Subject"
              variant="outlined"
              value={script.subject || ""}
              onChange={handleFormChange}
            />
          </Grid>
          <Grid item xs={12}>
            <CustomTextField
              fullWidth
              multiline
              name="script"
              size="small"
              label="Script"
              variant="outlined"
              value={script.script || ""}
              onChange={handleFormChange}
            />
          </Grid>
        </Grid>
        <Button
          fullWidth
          type="submit"
          size="small"
          variant="contained"
          sx={{ mt: 3, mb: 2 }}
        >
          Submit
        </Button>
      </Box>
    </>
  );
};
