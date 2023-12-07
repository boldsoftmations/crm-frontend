import React, { useState } from "react";
import { Box, TextField, Button } from "@mui/material";
import { CustomLoader } from "../../../Components/CustomLoader";
import Hr from "../../../services/Hr";

export const DepartmentCreate = ({ addNewDepartment, setOpenCreatePopup }) => {
  const [open, setOpen] = useState(false);
  const [departmentName, setDepartmentName] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setOpen(true);
      await Hr.addDepartment(departmentName);
      addNewDepartment(); // Refetch the departments
      setOpenCreatePopup(false);
      setOpen(false);
    } catch (error) {
      console.error("Failed to add department", error);
      setOpen(false);
    }
  };

  return (
    <>
      <CustomLoader open={open} />
      <form onSubmit={handleSubmit}>
        <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
          <TextField
            label="Department Name"
            variant="outlined"
            value={departmentName}
            onChange={(e) => setDepartmentName(e.target.value)}
            required
          />
          <Button type="submit" variant="contained" color="primary">
            Add Department
          </Button>
        </Box>
      </form>
    </>
  );
};
