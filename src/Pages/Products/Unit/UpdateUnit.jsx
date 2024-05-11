import { Box, Button, Grid } from "@mui/material";
import React, { memo, useCallback, useState } from "react";
import ProductService from "../../../services/ProductService";
import CustomTextField from "../../../Components/CustomTextField";
import { CustomLoader } from "../../../Components/CustomLoader";
import { MessageAlert } from "../../../Components/MessageAlert";
import { useNotificationHandling } from "../../../Components/useNotificationHandling ";

export const UpdateUnit = memo((props) => {
  const { recordForEdit, setOpenPopup, getUnits, currentPage, searchQuery } =
    props;
  const [open, setOpen] = useState(false);
  const [unit, setUnit] = useState(recordForEdit);
  const { handleSuccess, handleError, handleCloseSnackbar, alertInfo } =
    useNotificationHandling();

  const handleInputChange = (event) => {
    const { name, value } = event.target;
    setUnit({ ...unit, [name]: value });
  };

  const updatesunit = useCallback(
    async (e) => {
      try {
        e.preventDefault();
        setOpen(true);
        const data = {
          name: unit.name,
          short_name: unit.short_name,
        };
        if (recordForEdit) {
          const response = await ProductService.updateUnit(unit.id, data);

          const successMessage =
            response.data.message || "Unit updated successfully";
          handleSuccess(successMessage);

          setTimeout(() => {
            setOpenPopup(false);
            getUnits(currentPage, searchQuery);
          }, 300);
        }
      } catch (error) {
        handleError(error); // Handle errors from the API call
      } finally {
        setOpen(false); // Always close the loader
      }
    },
    [unit, currentPage, searchQuery]
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
      <Box component="form" noValidate onSubmit={(e) => updatesunit(e)}>
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
              label="Unit"
              variant="outlined"
              value={unit.name || ""}
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
              value={unit.short_name || ""}
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
});
