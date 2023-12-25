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
  const [emails, setEmails] = useState([]);
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

    const fetchEmails = async () => {
      try {
        const response = await CustomAxios.get(
          `/api/user/users/?is_active=True`
        );
        if (Array.isArray(response.data.users)) {
          setEmails(response.data.users.map((user) => user.email));
        }
      } catch (error) {
        console.error("Error fetching Emails:", error);
      }
    };
    fetchDesignations();
    fetchDepartments();
    fetchEmails();
  }, []);

  const locations = [
    "Andheri Head Office",
    "Andheri Sales Office",
    "Bhiwandi Factory",
    "Delhi Factory",
  ];

  const salaryRange = [
    "0.6 LPA - 1.2 LPA",
    "1.2 LPA - 1.8 LPA",
    "1.8 LPA - 2.4 LPA",
    "2.4 LPA - 3.0 LPA",
    "3.0 LPA - 3.6 LPA",
    "3.6 LPA - 4.2 LPA",
    "4.8 LPA - 6.0 LPA",
    "7.2 LPA - 9.6 LPA",
    "9.6 LPA - 12 LPA",
    "12 LPA - 15 LPA",
    "15 LPA - 18 LPA",
    "18 LPA - 21 LPA",
    "21 LPA - 24 LPA",
    "24 LPA - Above",
  ];

  const handleInputChange = (event, newValue) => {
    const value = newValue || event.target.value;
    const name = event.target.name || event.target.id.split("-")[0];
    setNewJobOpening({ ...newJobOpening, [name]: value });
  };

  const handleSubmit = () => {
    addNewJobOpening(newJobOpening);
  };

  return (
    <Box>
      {/* <Typography variant="h6" gutterBottom>
        Add New Job Opening
      </Typography> */}
      <Grid container spacing={2}>
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
            size="small"
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
            size="small"
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
        {newJobOpening.position === "Replacement" && (
          <Grid item xs={12}>
            <Autocomplete
              size="small"
              id="replacement_user"
              options={emails}
              fullWidth
              renderInput={(params) => (
                <TextField {...params} label="Replacement Email" />
              )}
              value={newJobOpening.replacement_user}
              onChange={(event, newValue) => {
                setNewJobOpening({
                  ...newJobOpening,
                  replacement_user: newValue,
                });
              }}
            />
          </Grid>
        )}
        <Grid item xs={12}>
          <TextField
            size="small"
            name="no_of_openings"
            label="No Of Vacancies"
            value={newJobOpening.no_of_openings || ""}
            onChange={handleInputChange}
            fullWidth
          />
        </Grid>
        <Grid item xs={12}>
          <Autocomplete
            size="small"
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
            size="small"
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
          <Button
            fullWidth
            variant="contained"
            color="primary"
            onClick={handleSubmit}
          >
            Add Job Opening
          </Button>
        </Grid>
      </Grid>
    </Box>
  );
};
