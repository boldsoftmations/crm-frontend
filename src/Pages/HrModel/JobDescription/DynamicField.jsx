import React, { useState } from "react";
import { TextField, Button, Grid, IconButton, Typography } from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import RemoveIcon from "@mui/icons-material/Remove";

const DynamiFileds = ({ label, values, onChange }) => {
  const handleAddField = () => {
    onChange([...values, ""]);
  };

  const handleRemoveField = (index) => {
    const updatedValues = values.filter((_, i) => i !== index);
    onChange(updatedValues);
  };

  const handleChangeField = (index, value) => {
    const updatedValues = values.map((item, i) => (i === index ? value : item));
    onChange(updatedValues);
  };

  return (
    <>
      <Grid container spacing={2}>
        <Grid item xs={12}>
          <Typography variant="subtitle1">{label}</Typography>
        </Grid>
        {values.map((value, index) => (
          <Grid item xs={12} key={index}>
            <TextField
              size="small"
              value={value}
              onChange={(e) => handleChangeField(index, e.target.value)}
              fullWidth
            />
            <IconButton onClick={() => handleRemoveField(index)}>
              <RemoveIcon size="small" />
            </IconButton>
          </Grid>
        ))}
        <Grid item xs={12}>
          <Button variant="contained" size="small" onClick={handleAddField}>
            <AddIcon size="small" /> Add More
          </Button>
        </Grid>
      </Grid>
    </>
  );
};

export default DynamiFileds;
