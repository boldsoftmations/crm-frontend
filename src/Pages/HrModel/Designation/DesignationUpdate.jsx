import React, { useEffect, useState } from "react";
import { Box, TextField, Button, Grid } from "@mui/material";
import Hr from "../../../services/Hr";
import CustomAutocomplete from "../../../Components/CustomAutocomplete";
import CustomSnackbar from "../../../Components/CustomerSnackbar";

export const DesignationUpdate = ({
  designationId,
  setOpenUpdatePopup,
  getDesignationsDetails,
}) => {
  const [designation, setDesignation] = useState(designationId.designation);
  const [departmentList, setDepartmentList] = useState([]);
  const [department, setDepartment] = useState(designationId.department);
  const [alertmsg, setAlertMsg] = useState({
    message: "",
    severity: "",
    open: false,
  });

  const handleClose = () => {
    setAlertMsg({ open: false });
  };
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
      const res = await Hr.updateDesignations(designationId.id, payload);
      if (res.status === 200) {
        setAlertMsg({
          message: res.data.message || "Designation updated successfully",
          severity: "success",
          open: true,
        });
        setTimeout(() => {
          setOpenUpdatePopup(false);
          getDesignationsDetails();
        }, 600);
      }
    } catch (error) {
      console.error("Failed to update designation", error);
      setAlertMsg({
        message:
          error.response.data.designation.toString() ||
          "Failed to update designation",
        severity: "error",
        open: true,
      });
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <CustomSnackbar
        open={alertmsg.open}
        message={alertmsg.message}
        severity={alertmsg.severity}
        onClose={handleClose}
      />
      <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
        <TextField
          size="small"
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
