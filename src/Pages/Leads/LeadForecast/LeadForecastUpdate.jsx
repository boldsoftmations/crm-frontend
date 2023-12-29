import React, { useEffect, useState } from "react";
import {
  Box,
  Button,
  TextField,
  Grid,
  Snackbar,
  Alert,
} from "@mui/material";
import LeadServices from "../../../services/LeadService";

export const LeadForecastUpdate = ({
  leadForecastId,
  onUpdateSuccess,
  initialQuantity,
  initialDate,
}) => {
  console.log("Lead Forecast ID:", leadForecastId);
  const [quantity, setQuantity] = useState("");
  const [anticipated_date, setEstimatedDate] = useState(initialDate || "");

  const [openSnackbar, setOpenSnackbar] = useState(false);

  useEffect(() => {
    setQuantity(initialQuantity);
    setEstimatedDate(initialDate);
  }, [initialQuantity, initialDate]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name === "quantity") {
      setQuantity(value);
    } else if (name === "anticipated_date") {
      console.log("Estimated Date:", value);

      setEstimatedDate(value);
    }
  };

  const handleSubmit = async () => {
    try {
      const data = { quantity, anticipated_date };
      await LeadServices.updateLeadForecast(leadForecastId, data);
      setOpenSnackbar(true);
      onUpdateSuccess();

      console.log("Lead Forecast Updated:", data);
    } catch (err) {
      console.error("Error updating lead forecast:", err);
    }
  };
  const handleCloseSnackbar = (event, reason) => {
    if (reason === "clickaway") {
      return;
    }
    setOpenSnackbar(false);
  };

  return (
    <form>
      <Grid container spacing={2}>
        <Grid item xs={12}>
          <TextField
            fullWidth
            label="Quantity"
            name="quantity"
            type="number"
            value={quantity}
            onChange={handleChange}
          />
        </Grid>
        <Grid item xs={12}>
          <TextField
            label="Anticipated Date"
            type="date"
            fullWidth
            InputLabelProps={{ shrink: true }}
            value={anticipated_date}
            onChange={handleChange}
            name="anticipated_date"
          />
        </Grid>
        <Grid item xs={12}>
          <Box display="flex" justifyContent="flex-end">
            <Button variant="contained" color="success" onClick={handleSubmit}>
              Update Lead Forecast
            </Button>
          </Box>
        </Grid>
      </Grid>
      <Snackbar
        open={openSnackbar}
        autoHideDuration={100000}
        onClose={handleCloseSnackbar}
        anchorOrigin={{ vertical: "center", horizontal: "center" }}
      >
        <Alert
          onClose={handleCloseSnackbar}
          severity="success"
          sx={{ width: "100%" }}
        >
          Lead Forecast successfully updated!
        </Alert>
      </Snackbar>
    </form>
  );
};
