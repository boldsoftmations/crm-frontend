import React, { useState, useEffect, memo } from "react";
import { Box, Button, Grid } from "@mui/material";
import InventoryServices from "../../../services/InventoryService";
import CustomTextField from "../../../Components/CustomTextField";
import { useNotificationHandling } from "../../../Components/useNotificationHandling ";
import { MessageAlert } from "../../../Components/MessageAlert";

export const SafetyStockUpdate = memo(
  ({ setOpenPopup, selectedRow, onUpdateSuccess, currentPage }) => {
    const [quantity, setQuantity] = useState(selectedRow.quantity);
    const [isLoading, setIsLoading] = useState(false);
    const { handleSuccess, handleError, handleCloseSnackbar, alertInfo } =
      useNotificationHandling();

    useEffect(() => {
      if (selectedRow) {
        setQuantity(selectedRow.quantity);
      }
    }, [selectedRow]);

    const handleUpdate = async () => {
      setIsLoading(true);
      try {
        await InventoryServices.updateSafetyStockData(selectedRow.id, {
          ...selectedRow,
          quantity,
        });
        onUpdateSuccess(currentPage);
        const successMessage = "Safety Stock Updated Successfully";
        handleSuccess(successMessage);
        setTimeout(() => {
          setOpenPopup(false);
        }, 300);
      } catch (error) {
        handleError(error);
        console.error("Error updating safety stock data:", error);
      } finally {
        setIsLoading(false);
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
        <Box p={3}>
          <Grid
            container
            spacing={2}
            alignItems="center"
            justifyContent="center"
          >
            <Grid item xs={12} sm={6}>
              <CustomTextField
                fullWidth
                size="small"
                label="Product"
                variant="outlined"
                value={selectedRow.product}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <CustomTextField
                fullWidth
                size="small"
                label="Quantity"
                variant="outlined"
                value={quantity}
                onChange={(e) => setQuantity(e.target.value)}
                type="number"
                disabled={isLoading}
              />
            </Grid>
            <Grid item xs={12}>
              <Button
                fullWidth
                variant="contained"
                color="primary"
                onClick={handleUpdate}
                disabled={isLoading}
              >
                Update
              </Button>
            </Grid>
          </Grid>
        </Box>
      </>
    );
  }
);
