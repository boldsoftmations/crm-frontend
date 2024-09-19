import React, { useEffect, useState } from "react";
import { Box, TextField, Button, Grid } from "@mui/material";
import Hr from "../../../services/Hr";
import CustomAutocomplete from "../../../Components/CustomAutocomplete";

export const DesignationUpdate = ({
  designationId,
  setOpenUpdatePopup,
  getDesignationsDetails,
}) => {
  const [designation, setDesignation] = useState(designationId.name);
  const [departmentList, setDepartmentList] = useState([]);
  const [department, setDepartment] = useState(designationId.department);

  useEffect(() => {
    const fetchDepartmentList = async () => {
      try {
        const response = await Hr.getDepartmentList();
        setDepartmentList(response.data);
      } catch (error) {
        console.error(error);
      }
    };
    fetchDepartmentList();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const payload = {
      department: department,
      designation: designation,
    };
    try {
      await Hr.updateDesignations(designationId.id, payload);
      getDesignationsDetails();
      setOpenUpdatePopup(false);
    } catch (error) {}
  };

  return (
    <form onSubmit={handleSubmit}>
      <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
        <TextField
          label="Designation"
          variant="outlined"
          value={designation}
          onChange={(e) => setDesignation(e.target.value)}
          required
        />
        <Grid item xs={12} sm={6}>
          <CustomAutocomplete
            size="small"
            style={{ minWidth: 220 }}
            onChange={(event, newValue) => setDepartment(newValue)}
            options={departmentList.map((option, i) => option.department)}
            getOptionLabel={(option) => `${option}`}
            label="Department"
            value={department}
          />
        </Grid>
        <Button type="submit" variant="contained" color="primary">
          Update Designation
        </Button>
      </Box>
    </form>
  );
};
