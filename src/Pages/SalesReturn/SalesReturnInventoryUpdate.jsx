import React, { memo, useCallback, useState } from "react";
import { Box, Button, Grid } from "@mui/material";
import InventoryServices from "../../services/InventoryService";
import CustomAutocomplete from "../../Components/CustomAutocomplete";
import { CustomLoader } from "./../../Components/CustomLoader";
import CustomTextField from "../../Components/CustomTextField";
import { MessageAlert } from "./../../Components/MessageAlert";
import { useNotificationHandling } from "./../../Components/useNotificationHandling ";

const Inv_Type_Options = ["Fix", "Supplier", "Scrap"];

export const SalesReturnInventoryUpdate = memo((props) => {
  const {
    selectedRow,
    setOpenPopup,
    getSalesReturnInventoryDetails,
    currentPage,
    searchQuery,
  } = props;
  const [open, setOpen] = useState(false);
  const [salesReturnData, setSalesReturnData] = useState(selectedRow);
  const { handleSuccess, handleError, handleCloseSnackbar, alertInfo } =
    useNotificationHandling();

  const handleInputChanges = (name, value) => {
    setSalesReturnData((prev) => ({ ...prev, [name]: value }));
  };

  const updateSalesReturnInventory = useCallback(
    async (e) => {
      try {
        e.preventDefault();
        setOpen(true);
        const payload = {
          inv_type: salesReturnData.inv_type,
        };
        if (salesReturnData.id) {
          const response =
            await InventoryServices.updateSalesReturnInventoryData(
              salesReturnData.id,
              payload
            );
          const successMessage =
            response.data.message ||
            "Sales Return Inventory updated successfully";
          handleSuccess(successMessage);

          setTimeout(() => {
            setOpenPopup(false);
            getSalesReturnInventoryDetails(currentPage, searchQuery);
          }, 300);
        }
      } catch (error) {
        handleError(error); // Handle errors from the API call
      } finally {
        setOpen(false); // Always close the loader
      }
    },
    [salesReturnData, currentPage, searchQuery]
  );

  return (
    <>
      <MessageAlert
        open={alertInfo.open}
        onClose={handleCloseSnackbar}
        severity={alertInfo.severity}
        message={alertInfo.message}
      />
      <CustomLoader open={open} />
      <Box
        component="form"
        noValidate
        onSubmit={(e) => updateSalesReturnInventory(e)}
      >
        <Grid container spacing={2}>
          <Grid item xs={12}>
            <CustomTextField
              fullWidth
              size="small"
              label="Id"
              variant="outlined"
              value={salesReturnData.id || ""}
            />
          </Grid>
          <Grid item xs={12}>
            <CustomAutocomplete
              size="small"
              value={salesReturnData.inv_type || ""}
              onChange={(event, value) => handleInputChanges("inv_type", value)}
              options={Inv_Type_Options}
              getOptionLabel={(option) => option}
              label="Invoice Type"
            />
          </Grid>
        </Grid>
        <Button
          fullWidth
          type="submit"
          size="small"
          variant="contained"
          sx={{ mt: 3, mb: 2 }}
        >
          Update
        </Button>
      </Box>
    </>
  );
});
