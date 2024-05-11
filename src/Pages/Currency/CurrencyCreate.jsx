import { Box, Grid } from "@mui/material";
import React, { useState } from "react";
import InventoryServices from "../../services/InventoryService";
import { CustomLoader } from "../../Components/CustomLoader";
import CustomTextField from "../../Components/CustomTextField";
import { CustomButton } from "../../Components/CustomButton";

export const CurrencyCreate = ({ setOpenPopup, getCurrencyDetails }) => {
  const [isLoading, setIsLoading] = useState(false);
  const [currencyData, setCurrencyData] = useState([]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setCurrencyData({ ...currencyData, [name]: value });
  };

  const createCurrencyDetails = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      const response = await InventoryServices.createCurrencyData(currencyData);
      if (response && response.data) {
        getCurrencyDetails();
        setOpenPopup(false);
      }
    } catch (err) {
      console.error("Error creating currency data", err);
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
        onSubmit={createCurrencyDetails}
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
