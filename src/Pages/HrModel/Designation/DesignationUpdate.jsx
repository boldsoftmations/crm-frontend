import React, { useState } from "react";
import { Box, TextField, Button } from "@mui/material";
import Hr from "../../../services/Hr";

export const DesignationUpdate = ({
  designationId,
  setOpenUpdatePopup,
  getDesignationsDetails,
}) => {
  const [designation, setDesignation] = useState(designationId.name);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await Hr.updateDesignations(designationId.id, { designation });
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
        <Button type="submit" variant="contained" color="primary">
          Update Designation
        </Button>
      </Box>
    </form>
  );
};
