import React, { useState } from "react";
import UserProfileService from "../../../services/UserProfileService";
import { Box, Button, Grid } from "@mui/material";
import { CustomLoader } from "../../../Components/CustomLoader";
import CustomTextField from "../../../Components/CustomTextField";

export const ObjectionsCreate = ({ getObjectionDetails, setOpenPopup }) => {
  const [objection, setObjection] = useState([]);
  const [open, setOpen] = useState(false);

  const handleFormChange = (event) => {
    const { name, value } = event.target;
    setObjection({ ...objection, [name]: value });
  };

  const createObjection = async (e) => {
    try {
      e.preventDefault();
      const req = {
        question: objection.question,
        answer: objection.answer,
      };

      setOpen(true);
      await UserProfileService.createObjectionData(req);

      setOpenPopup(false);
      setOpen(false);
      getObjectionDetails();
    } catch (error) {
      setOpen(false);
      console.log("error create Objection", error);
    }
  };

  return (
    <>
      <CustomLoader open={open} />
      <Box component="form" noValidate onSubmit={(e) => createObjection(e)}>
        <Grid container spacing={2}>
          <Grid item xs={12}>
            <CustomTextField
              fullWidth
              multiline
              name="question"
              size="small"
              label="Question"
              variant="outlined"
              value={objection.question || ""}
              onChange={handleFormChange}
            />
          </Grid>
          <Grid item xs={12}>
            <CustomTextField
              fullWidth
              multiline
              name="answer"
              size="small"
              label="Answer"
              variant="outlined"
              value={objection.answer || ""}
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
