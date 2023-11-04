import React, { useState } from "react";
import UserProfileService from "../../../services/UserProfileService";
import { Box, Button, Grid, TextField } from "@mui/material";
import { CustomLoader } from "../../../Components/CustomLoader";

export const ObjectionsUpdate = ({
  getObjectionDetails,
  setOpenPopup,
  recordForEdit,
}) => {
  const [objection, setObjection] = useState(
    recordForEdit || { question: "", answer: "" }
  );
  const [open, setOpen] = useState(false);

  const handleFormChange = (event) => {
    const { name, value } = event.target;
    setObjection({ ...objection, [name]: value });
  };

  const updateObjection = async (e) => {
    e.preventDefault();
    setOpen(true);
    try {
      await UserProfileService.updateObjectionData(objection.id, {
        question: objection.question,
        answer: objection.answer,
      });
      getObjectionDetails();
      setOpenPopup(false);
    } catch (error) {
      console.error("Error updating Objection", error);
    } finally {
      setOpen(false);
    }
  };

  return (
    <>
      <CustomLoader open={open} />
      <Box
        component="form"
        noValidate
        onSubmit={updateObjection}
        sx={{ mt: 2 }}
      >
        <Grid container spacing={2}>
          <Grid item xs={12}>
            <TextField
              fullWidth
              multiline
              name="question"
              size="small"
              label="Question"
              variant="outlined"
              value={objection.question}
              onChange={handleFormChange}
              sx={{ mb: 2 }}
            />
          </Grid>
          <Grid item xs={12}>
            <TextField
              fullWidth
              multiline
              minRows={4}
              name="answer"
              label="Answer"
              variant="outlined"
              value={objection.answer}
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
          Update Objection
        </Button>
      </Box>
    </>
  );
};
