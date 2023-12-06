import React, { useState } from "react";
import { Box, TextField, Button } from "@mui/material";
import { CustomLoader } from "../../../Components/CustomLoader";
import Hr from "../../../services/Hr";

export const DesignationCreate = ({
  setOpenCreatePopup,
  getDesignationsDetails,
}) => {
  const [open, setOpen] = useState(false);
  const [designation, setDesignation] = useState("");

  const addNewDesignation = async (e) => {
    e.preventDefault();
    try {
      setOpen(true);
      await Hr.addDesignation(designation);
      getDesignationsDetails(); // Refetch the designations
      setOpenCreatePopup(false);
      setOpen(false);
    } catch (error) {
      console.error("Failed to add designation", error);
      setOpen(false);
    }
  };

  return (
    <>
      <CustomLoader open={open} />
      <form onSubmit={addNewDesignation}>
        <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
          <TextField
            label="Designation"
            variant="outlined"
            name="designation"
            value={designation}
            onChange={(e) => setDesignation(e.target.value)}
            required
          />
          <Button type="submit" variant="contained" color="primary">
            Add Designation
          </Button>
        </Box>
      </form>
    </>
  );
};
