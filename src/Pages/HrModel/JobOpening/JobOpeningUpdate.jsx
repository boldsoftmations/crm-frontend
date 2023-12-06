import React, { useState, useEffect } from "react";
import { Box, TextField, Button, Grid, Autocomplete } from "@mui/material";

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

  const locations = [
    "Andheri Head Office",
    "Andheri Sales Office",
    "Bhiwandi Factory",
    "Delhi Factory",
  ];

  const salaryRanges = [
    "60,000.00 - 1,20,000.00",
    "1,20,000.00 - 1,80,000.00",
    "1,80,000.00 - 2,40,000.00",
    "2,40,000.00 - 3,00,000.00",
    "3,00,000.00 - 3,60,000.00",
    "3,60,000.00 - 4,80,000.00",
    "4,80,000.00 - 6,00,000.00",
    "7,20,000.00 - 9,60,000.00",
    "9,60,000.00 - 12,00,000.00",
    "12,00,000.00 - 15,00,000.00",
    "15,00,000.00 - 18,00,000.00",
    "18,00,000.00 - 21,00,000.00",
    "21,00,000.00 - 24,00,000.00",
    "24,00,000.00 - Above",
  ];

  const positions = ["New", "Replacement", "Backup"];
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
          <TextField
            name="designation"
            label="Designation"
            value={values.designation || ""}
            onChange={handleInputChange}
            fullWidth
          />
        </Grid>
        <Grid item xs={12}>
          <TextField
            name="department"
            label="Department"
            value={values.department || ""}
            onChange={handleInputChange}
            fullWidth
          />
        </Grid>
        <Grid item xs={12}>
          <Autocomplete
            id="location"
            options={locations}
            fullWidth
            renderInput={(params) => <TextField {...params} label="Location" />}
            value={values.location || ""}
            onChange={(event, newValue) => {
              setValues({ ...values, location: newValue });
            }}
          />
        </Grid>
        <Grid item xs={12}>
          <Autocomplete
            id="Position"
            options={positions}
            fullWidth
            renderInput={(params) => <TextField {...params} label="Position" />}
            value={values.position || ""}
            onChange={(event, newValue) => {
              setValues({ ...values, position: newValue });
            }}
          />
        </Grid>
        <Grid item xs={12}>
          <Autocomplete
            id="salary_ranges"
            options={salaryRanges}
            fullWidth
            renderInput={(params) => (
              <TextField {...params} label="Salary Range" />
            )}
            value={values.salary_ranges || ""}
            onChange={(event, newValue) => {
              setValues({ ...values, salary_ranges: newValue });
            }}
          />
        </Grid>
        <Grid item xs={12}>
          <TextField
            name="notes"
            label="Notes"
            value={values.notes || ""}
            onChange={handleInputChange}
            fullWidth
            multiline
            rows={4}
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
