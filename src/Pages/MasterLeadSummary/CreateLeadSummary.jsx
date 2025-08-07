import React, { useState } from "react";
import { Box, Button, Grid, TextField } from "@mui/material";
import MasterService from "../../services/MasterService";
import CustomSnackbar from "../../Components/CustomerSnackbar";
import { CustomLoader } from "../../Components/CustomLoader";

export const CreateLeadSummary = ({ setOpenPopup, getAllMasterBeat }) => {
  const [inputValue, setInputValue] = useState("");
  const [loading, setLoading] = useState(false);
  const [alertMsg, setAlertMsg] = useState({
    message: "",
    severity: "",
    open: false,
  });

  const handleCloseSnackbar = () => {
    setAlertMsg((prev) => ({ ...prev, open: false }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!inputValue.trim()) {
      setAlertMsg({
        message: "Beat name is required",
        severity: "warning",
        open: true,
      });
      return;
    }

    try {
      setLoading(true);
      const response = await MasterService.createLeadSummary({
        source: inputValue.trim(),
      });
      console.log(response);

      if (response.status === 201) {
        setAlertMsg({
          message: response.message || "Source created successfully",
          severity: "success",
          open: true,
        });
        setTimeout(() => {
          getAllMasterBeat();
          setOpenPopup(false);
        }, 500);
      } else {
        setAlertMsg({
          message: response.message || "Failed to create source",
          severity: "error",
          open: true,
        });
      }
    } catch (error) {
      setAlertMsg({
        message: error.response.data.message || "Something went wrong",
        severity: "error",
        open: true,
      });
    } finally {
      setLoading(false);
      setInputValue("");
    }
  };

  return (
    <>
      <CustomSnackbar
        open={alertMsg.open}
        message={alertMsg.message}
        severity={alertMsg.severity}
        onClose={handleCloseSnackbar}
      />
      <CustomLoader open={loading} />

      <Box component="form" onSubmit={handleSubmit} noValidate>
        <Grid container spacing={2}>
          <Grid item xs={12}>
            <TextField
              fullWidth
              label="lead Source Name"
              name="Source Name"
              size="small"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              required
            />
          </Grid>

          <Grid item xs={12}>
            <Button type="submit" fullWidth variant="contained" color="primary">
              Submit
            </Button>
          </Grid>
        </Grid>
      </Box>
    </>
  );
};
