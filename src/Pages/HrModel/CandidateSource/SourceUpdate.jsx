import React, { useState } from "react";
import { Button, Grid, TextField } from "@mui/material";
import Hr from "../../../services/Hr";

export const SourceUpdate = ({
  sourceId,
  setOpenUpdatePopup,
  getSourcesDetails,
}) => {
  const [source, setSource] = useState(sourceId.name);

  const handleInputChange = (event) => {
    const { value } = event.target;
    setSource(value);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await Hr.updateSource(sourceId.id, { name: source });
      getSourcesDetails();
      setOpenUpdatePopup(false);
    } catch (error) {
      console.error("Error updating source", error);
    }
  };
  return (
    <form>
      <Grid container spacing={2}>
        <Grid item xs={12}>
          <TextField
            label="Source Name"
            variant="outlined"
            name="name"
            value={source}
            onChange={handleInputChange}
            fullWidth
          />
        </Grid>
        <Grid item xs={12}>
          <Button variant="contained" color="primary" onClick={handleSubmit}>
            Update
          </Button>
        </Grid>
      </Grid>
    </form>
  );
};
