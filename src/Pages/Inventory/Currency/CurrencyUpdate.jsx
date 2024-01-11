import React, { useState } from "react";
import { CustomButton } from "../../../Components/CustomButton";
import CustomTextField from "../../../Components/CustomTextField";
import { Box, Grid } from "@mui/material";
import InventoryServices from "../../../services/InventoryService";
import { CustomLoader } from "../../../Components/CustomLoader";

export const CurrencyUpdate = ({
  setOpenPopup,
  selectedRow,
  getCurrencyDetails,
}) => {
  const [isLoading, setIsLoading] = useState(false);
  const [currencyData, setCurrencyData] = useState(selectedRow);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setCurrencyData({ ...currencyData, [name]: value });
  };

  const updateCurrencyDetails = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      const response = await InventoryServices.updateCurrencyData(
        selectedRow.id,
        currencyData
      );
      if (response && response.data) {
        getCurrencyDetails();
        setOpenPopup(false);
      }
    } catch (err) {
      console.error("Error updating currency data", err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <CustomLoader open={isLoading} />
      <Box
        component="form"
        noValidate
        onSubmit={(e) => updateCurrencyDetails(e)}
        sx={{ mt: 1 }}
      >
        <Grid container spacing={2}>
          <Grid item xs={12} sm={6}>
            <CustomTextField
              fullWidth
              name="name"
              size="small"
              label="Currency"
              variant="outlined"
              value={currencyData.name || ""}
              onChange={handleInputChange}
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <CustomTextField
              fullWidth
              name="symbol"
              size="small"
              label="Symbol"
              variant="outlined"
              value={currencyData.symbol || ""}
              onChange={handleInputChange}
            />
          </Grid>
        </Grid>
        <CustomButton
          type="submit"
          fullWidth
          variant="contained"
          sx={{ mt: 3, mb: 2 }}
          text={"Sign In"}
        />
      </Box>
    </>
  );
};
