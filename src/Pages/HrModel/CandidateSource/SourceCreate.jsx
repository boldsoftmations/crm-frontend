import React, { useState } from "react";
import { Box, Button, TextField, Grid } from "@mui/material";
import Hr from "../../../services/Hr";

export const SourceCreate = ({ setOpenCreatePopup, getSourcesDetails }) => {
  const [newSource, setNewSource] = useState("");

  const handleInputChange = (event) => {
    const { name, value } = event.target;
    setNewSource({ ...newSource, [name]: value });
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    try {
      await Hr.addSource(newSource);
      getSourcesDetails();
      setOpenCreatePopup(false);
    } catch (error) {
      console.error("Error creating new source", error);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <Box mb={2}>
        <TextField
          label="Source Name"
          variant="outlined"
          name="name"
          value={newSource.name}
          onChange={handleInputChange}
          fullWidth
        />
      </Box>
      <Grid container spacing={2}>
        <Grid item xs={6}>
          <Button type="submit" variant="contained" color="primary" fullWidth>
            Create
          </Button>
        </Grid>
        <Grid item xs={6}>
          <Button
            variant="contained"
            color="secondary"
            onClick={() => setOpenCreatePopup(false)}
            fullWidth
          >
            Cancel
          </Button>
        </Grid>
      </Grid>
    </form>
  );
};
