import React, { useState } from "react";
import { Box, TextField, Button } from "@mui/material";
import Hr from "../../../services/Hr";

export const DepartmentUpdate = ({
  departmentId,
  setOpenUpdatePopup,
  fetchDepartments,
}) => {
  const [department, setDepartment] = useState(departmentId.name);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await Hr.updateDepartment(departmentId.id, { department });
      fetchDepartments();
      setOpenUpdatePopup(false);
    } catch (error) {
      console.error("Failed to update department", error);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
        <TextField
          label="Department Name"
          variant="outlined"
          value={department}
          onChange={(e) => setDepartment(e.target.value)}
          required
        />
        <Button type="submit" variant="contained" color="primary">
          Update Department
        </Button>
      </Box>
    </form>
  );
};
