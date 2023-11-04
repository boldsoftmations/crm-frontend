import React, { useState } from "react";
import UserProfileService from "../../../services/UserProfileService";
import { Box, Button, Grid } from "@mui/material";
import { CustomLoader } from "../../../Components/CustomLoader";
import CustomTextField from "../../../Components/CustomTextField";

export const ScriptUpdate = ({
  getScriptDetails,
  setOpenPopup,
  recordForEdit,
}) => {
  const [script, setScript] = useState(
    recordForEdit || { subject: "", script: "" }
  );
  const [open, setOpen] = useState(false);

  const handleFormChange = (event) => {
    const { name, value } = event.target;
    setScript({ ...script, [name]: value });
  };

  const updateScript = async (e) => {
    e.preventDefault();
    setOpen(true);
    try {
      await UserProfileService.updateScriptData(script.id, {
        subject: script.subject,
        script: script.script,
      });
      getScriptDetails();
      setOpenPopup(false);
    } catch (error) {
      console.error("Error updating scripts", error);
    } finally {
      setOpen(false);
    }
  };

  return (
    <>
      <CustomLoader open={open} />
      <Box component="form" noValidate onSubmit={updateScript} sx={{ mt: 2 }}>
        <Grid container spacing={2}>
          <Grid item xs={12}>
            <CustomTextField
              fullWidth
              name="subject"
              size="small"
              label="Subject"
              variant="outlined"
              value={script.subject}
              onChange={handleFormChange}
              sx={{ mb: 2 }}
            />
          </Grid>
          <Grid item xs={12}>
            <CustomTextField
              fullWidth
              multiline
              minRows={4}
              name="script"
              label="Script"
              variant="outlined"
              value={script.script}
              onChange={handleFormChange}
              sx={{ mb: 2 }}
            />
          </Grid>
        </Grid>
        <Button
          fullWidth
          type="submit"
          size="large"
          variant="contained"
          sx={{ mt: 2 }}
        >
          Update Script
        </Button>
      </Box>
    </>
  );
};
