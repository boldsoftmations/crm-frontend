import { Box, Button, Grid } from "@mui/material";
import React, { useState } from "react";
import ProductService from "../../../services/ProductService";
import CustomTextField from "../../../Components/CustomTextField";
import { CustomLoader } from "../../../Components/CustomLoader";
import { useNotificationHandling } from "../../../Components/useNotificationHandling ";
import { MessageAlert } from "../../../Components/MessageAlert";

export const UpdatePackingUnit = (props) => {
  const {
    recordForEdit,
    setOpenPopup,
    getPackingUnits,
    currentPage,
    searchQuery,
  } = props;
  const [open, setOpen] = useState(false);
  const [packingUnit, setPackingUnit] = useState(recordForEdit);
  const { handleSuccess, handleError, handleCloseSnackbar, alertInfo } =
    useNotificationHandling();

  const handleInputChange = (event) => {
    const { name, value } = event.target;
    setPackingUnit({ ...packingUnit, [name]: value });
  };

  const updatePackingUnits = async (e) => {
    try {
      e.preventDefault();
      setOpen(true);
      const data = {
        name: packingUnit.name,
        short_name: packingUnit.short_name,
      };
      if (recordForEdit) {
        const response = await ProductService.updatePackingUnit(
          packingUnit.id,
          data
        );
        const successMessage =
          response.data.message || "Packing Unit updated successfully";
        handleSuccess(successMessage);

        setTimeout(() => {
          setOpenPopup(false);
          getPackingUnits(currentPage, searchQuery);
        }, 300);
      }
    } catch (error) {
      handleError(error); // Handle errors from the API call
    } finally {
      setOpen(false); // Always close the loader
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
      <Box component="form" noValidate onSubmit={(e) => updatePackingUnits(e)}>
        <Grid container spacing={2}>
          <Grid item xs={12}>
            <CustomTextField
              fullWidth
              size="small"
              label="Id"
              variant="outlined"
              value={recordForEdit.id || ""}
            />
          </Grid>
          <Grid item xs={12}>
            <CustomTextField
              fullWidth
              name="name"
              size="small"
              label="Packing Unit"
              variant="outlined"
              value={packingUnit.name || ""}
              onChange={handleInputChange}
            />
          </Grid>
          <Grid item xs={12}>
            <CustomTextField
              fullWidth
              name="short_name"
              size="small"
              label="Short Name"
              variant="outlined"
              value={packingUnit.short_name || ""}
              onChange={handleInputChange}
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
};
