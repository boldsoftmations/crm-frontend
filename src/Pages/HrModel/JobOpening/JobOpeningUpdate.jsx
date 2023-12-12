import React, { useState, useEffect } from "react";
import { Box, TextField, Button, Grid } from "@mui/material";

export const JobOpeningUpdate = ({ recordForEdit, updateJobOpening }) => {
  const [values, setValues] = useState(recordForEdit);

  useEffect(() => {
    if (recordForEdit != null) {
      setValues(recordForEdit);
    }
  }, [recordForEdit]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setValues({
      ...values,
      [name]: value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (values && values.id) {
        const response = await updateJobOpening(values.id, values);
      } else {
      }
    } catch (error) {
      console.error("Error updating job opening:", error);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <Grid container spacing={2}>
        <Grid item xs={12}>
          <TextField
            label="Date Of Closing"
            name="closing_date"
            fullWidth
            type="date"
            value={values.closing_date}
            onChange={handleInputChange}
            InputLabelProps={{
              shrink: true,
            }}
          />
        </Grid>
        <Grid item xs={12}>
          <Box display="flex" justifyContent="flex-end" mt={2}>
            <Button type="submit" variant="contained" color="primary">
              Update Job Opening
            </Button>
          </Box>
        </Grid>
      </Grid>
    </form>
  );
};
