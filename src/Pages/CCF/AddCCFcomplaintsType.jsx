import { Box, Button, Grid, Paper } from "@mui/material";
import React, { useState } from "react";
import CustomAutocomplete from "../../Components/CustomAutocomplete";
import CustomTextField from "../../Components/CustomTextField";
import CustomerServices from "../../services/CustomerService";
import { MessageAlert } from "../../Components/MessageAlert";
import { useNotificationHandling } from "../../Components/useNotificationHandling ";
import { CustomLoader } from "../../Components/CustomLoader";

const AddCCFcomplaintsType = ({
  setOpenAddComplainttype,
  getAllComplaintsList,
}) => {
  const [open, setOpen] = useState(false);
  const [inputData, setInputData] = useState({
    department: "",
    name: "",
  });
  const { handleSuccess, handleError, handleCloseSnackbar, alertInfo } =
    useNotificationHandling();

  const createComplaintpes = async (e) => {
    e.preventDefault();
    try {
      setOpen(true);
      const payload = { ...inputData };
      const response = await CustomerServices.createComplaintpes(payload);
      handleSuccess("CCF complaint type created successfully!");
      setTimeout(() => {
        getAllComplaintsList();
        setOpenAddComplainttype(false);
      }, 500);
    } catch (err) {
      console.log(err);
      handleError(err);
    } finally {
      setOpen(false);
    }
  };
  return (
    <>
      <MessageAlert
        open={alertInfo.open}
        onClose={handleCloseSnackbar}
        severity={alertInfo.severity}
        message={alertInfo.message}
      />
      <CustomLoader open={open} />
      <Grid container spacing={2}>
        <Paper
          sx={{
            p: 2,
            m: 4,
            display: "flex",
            flexDirection: "column",
            width: "100%",
          }}
        >
          <Box component="form" noValidate onSubmit={createComplaintpes}>
            <Grid container spacing={2}>
              <Grid item xs={12} sm={12}>
                <CustomAutocomplete
                  name="department"
                  size="small"
                  disablePortal
                  id="combo-box-demo"
                  options={ComplaintsOptions}
                  getOptionLabel={(option) => option}
                  fullWidth
                  label="CCF Choice"
                  onChange={(event, value) =>
                    setInputData((prev) => ({
                      ...prev,
                      department: value,
                    }))
                  }
                />
              </Grid>
              <Grid item xs={12} sm={12}>
                <CustomTextField
                  fullWidth
                  size="small"
                  label="Complaints"
                  name="name"
                  variant="outlined"
                  type="string"
                  onChange={(event) =>
                    setInputData((prev) => ({
                      ...prev,
                      name: event.target.value,
                    }))
                  }
                />
              </Grid>
              <Grid item xs={12}>
                <Button
                  variant="contained"
                  fullWidth
                  color="primary"
                  style={{ marginRight: "10px" }}
                  type="submit"
                >
                  Submit
                </Button>
              </Grid>
            </Grid>
          </Box>
        </Paper>
      </Grid>
    </>
  );
};

export default AddCCFcomplaintsType;
const ComplaintsOptions = [
  "Account",
  "Product",
  "Dispatch and Logistic",
  "Sales Person",
];
