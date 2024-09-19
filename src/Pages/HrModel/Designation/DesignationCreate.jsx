import React, { useEffect, useState, useCallback } from "react";
import { Box, TextField, Button, Grid } from "@mui/material";
import { CustomLoader } from "../../../Components/CustomLoader";
import Hr from "../../../services/Hr";
import CustomAutocomplete from "../../../Components/CustomAutocomplete";

export const DesignationCreate = ({
  setOpenCreatePopup,
  getDesignationsDetails,
}) => {
  const [open, setOpen] = useState(false);
  const [designation, setDesignation] = useState("");
  const [departmentList, setDepartmentList] = useState([]);
  const [department, setDepartment] = useState(null);

  // Fetch department list once on component mount
  useEffect(() => {
    const fetchDepartmentList = async () => {
      try {
        setOpen(true); // Start loading
        const response = await Hr.getDepartmentList();
        setDepartmentList(response.data);
      } catch (error) {
        console.error("Failed to fetch department list", error);
      } finally {
        setOpen(false); // Stop loading
      }
    };
    fetchDepartmentList();
  }, []);

  // Handle form submission
  const addNewDesignation = async (e) => {
    e.preventDefault();

    // Correctly structure the payload
    const payload = {
      designation: designation,
      department: department,
    };

    try {
      setOpen(true);
      await Hr.addDesignation(payload); // Use the correct payload structure
      getDesignationsDetails(); // Refetch the designations
      setOpenCreatePopup(false);
    } catch (error) {
      console.error("Failed to add designation", error);
    } finally {
      setOpen(false);
    }
  };

  // Handle department change
  const handleDepartmentChange = useCallback((event, newValue) => {
    setDepartment(newValue);
  }, []);

  // Clear form
  const clearForm = () => {
    setDesignation("");
    setDepartment(null);
  };

  return (
    <>
      <CustomLoader open={open} />
      <form
        onSubmit={(e) => {
          addNewDesignation(e);
          clearForm(); // Clear form on submit
        }}
      >
        <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
          <TextField
            label="Designation"
            variant="outlined"
            name="designation"
            value={designation}
            onChange={(e) => setDesignation(e.target.value)}
            required
          />
          <Grid item xs={12} sm={6}>
            <CustomAutocomplete
              size="small"
              style={{ minWidth: 220 }}
              onChange={handleDepartmentChange}
              options={departmentList.map((option) => option.department)}
              getOptionLabel={(option) => option || ""}
              label="Department"
              value={department || ""}
              required
            />
          </Grid>
          <Button type="submit" variant="contained" color="primary">
            Add Designation
          </Button>
        </Box>
      </form>
    </>
  );
};
