import React, { useEffect, useState } from "react";
import { Box, Typography, Grid, Button, TextField } from "@mui/material";
import Autocomplete from "@mui/material/Autocomplete";
import CustomAxios from "../../../services/api";
import CustomTextField from "../../../Components/CustomTextField";

export const JobOpeningCreate = ({ addNewJobOpening }) => {
  const [newJobOpening, setNewJobOpening] = useState({
    closing_date: null,
    designation: "",
    department: "",
    location: "",
    position: "",
    salary_ranges: "",
    notes: "",
  });
  const [designations, setDesignations] = useState([]);
  const [department, setDepartment] = useState([]);

  useEffect(() => {
    const fetchDesignations = async () => {
      try {
        const response = await CustomAxios.get(
          "/api/hr/designation/?type=list"
        );
        console.log("API Response:", response.data);
        setDesignations(response.data);
      } catch (error) {
        console.error("Error fetching designations:", error);
      }
    };

    const fetchDepartments = async () => {
      try {
        const response = await CustomAxios.get("/api/hr/department/");
        const validDepartments = response.data.filter(
          (d) => d.department != null
        );
        setDepartment(validDepartments);
      } catch (error) {
        console.error("Error fetching departments:", error);
      }
    };

    fetchDesignations();
    fetchDepartments();
  }, []);

  const locations = [
    "Andheri Head Office",
    "Andheri Sales Office",
    "Bhiwandi Factory",
    "Delhi Factory",
  ];

  const salaryRange = [
    "60,000 - 1,20,000.00",
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

  const handleInputChange = (event, newValue) => {
    const value = newValue || event.target.value; // Use logical OR instead of nullish coalescing
    const name = event.target.name || event.target.id.split("-")[0];
    setNewJobOpening({ ...newJobOpening, [name]: value });
  };

  const handleSubmit = () => {
    addNewJobOpening(newJobOpening);
  };

  return (
    <Box>
      <Typography variant="h6" gutterBottom>
        Add New Job Opening
      </Typography>
      <Grid container spacing={2}>
        {/* <Grid item xs={12}>
          <TextField
            label="Date Of Closing"
            name="closing_date"
            fullWidth
            type="date"
            value={newJobOpening.closing_date}
            onChange={handleInputChange}
            InputLabelProps={{
              shrink: true,
            }}
          />
        </Grid> */}

        <Grid item xs={12}>
          <Autocomplete
            style={{ minWidth: 220 }}
            size="small"
            onChange={(event, value) => {
              setNewJobOpening({ ...newJobOpening, designation: value });
            }}
            name="designation"
            options={designations.map((option) => option.designation)}
            getOptionLabel={(option) => option || ""}
            renderInput={(params) => (
              <CustomTextField {...params} label="Designation" />
            )}
            value={newJobOpening.designation}
          />
        </Grid>

        <Grid item xs={12}>
          {Array.isArray(department) && (
            <Autocomplete
              style={{ minWidth: 220 }}
              size="small"
              onChange={(event, value) => {
                setNewJobOpening({ ...newJobOpening, department: value });
              }}
              name="department"
              options={department.map((option) => option.department)}
              getOptionLabel={(option) => option || ""}
              renderInput={(params) => (
                <CustomTextField {...params} label="Department" />
              )}
              value={newJobOpening.department}
            />
          )}
        </Grid>

        <Grid item xs={12}>
          <Autocomplete
            id="location"
            options={locations}
            fullWidth
            renderInput={(params) => <TextField {...params} label="Location" />}
            value={newJobOpening.location}
            onChange={(event, newValue) => {
              handleInputChange(event, newValue);
            }}
          />
        </Grid>
        <Grid item xs={12}>
          <Autocomplete
            value={newJobOpening.position}
            onChange={(event, newValue) => {
              handleInputChange({
                target: { name: "position", value: newValue },
              });
            }}
            options={["New", "Replacement", "Backup"]}
            renderInput={(params) => (
              <TextField
                {...params}
                name="position"
                label="Position"
                fullWidth
              />
            )}
          />
        </Grid>

        <Grid item xs={12}>
          <Autocomplete
            id="salary_ranges"
            options={salaryRange}
            fullWidth
            renderInput={(params) => (
              <TextField {...params} label="Salary Range" />
            )}
            value={newJobOpening.salary_ranges}
            onChange={(event, newValue) => {
              handleInputChange(event, newValue);
            }}
          />
        </Grid>
        <Grid item xs={12}>
          <TextField
            label="Notes"
            name="notes"
            fullWidth
            multiline
            rows={4}
            value={newJobOpening.notes}
            onChange={handleInputChange}
          />
        </Grid>
        <Grid item xs={12}>
          <Button variant="contained" color="primary" onClick={handleSubmit}>
            Add Job Opening
          </Button>
        </Grid>
      </Grid>
    </Box>
  );
};
