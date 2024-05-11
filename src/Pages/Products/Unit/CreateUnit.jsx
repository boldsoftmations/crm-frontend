import { Box, Button, Grid } from "@mui/material";
import { memo, useCallback, useState } from "react";
import React from "react";
import ProductService from "../../../services/ProductService";
import { CustomLoader } from "../../../Components/CustomLoader";
import CustomTextField from "../../../Components/CustomTextField";
import { useNotificationHandling } from "../../../Components/useNotificationHandling ";
import { MessageAlert } from "../../../Components/MessageAlert";

export const CreateUnit = memo((props) => {
  const { setOpenPopup, getUnits, currentPage, searchQuery } = props;
  const [unit, setUnit] = useState([]);
  const [open, setOpen] = useState(false);
  const { handleSuccess, handleError, handleCloseSnackbar, alertInfo } =
    useNotificationHandling();

  const handleInputChange = (event) => {
    const { name, value } = event.target;
    setUnit({ ...unit, [name]: value });
  };

  const createunit = useCallback(
    async (e) => {
      try {
        e.preventDefault();
        setOpen(true);
        const data = {
          name: unit.name,
          short_name: unit.shortName,
        };

        const response = await ProductService.createUnit(data);
        const successMessage =
          response.data.message || "Unit Created successfully";
        handleSuccess(successMessage);

        setTimeout(() => {
          setOpenPopup(false);
          getUnits(currentPage, searchQuery);
        }, 300);
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
      <Box component="form" noValidate onSubmit={(e) => createunit(e)}>
        <Grid container spacing={2}>
          <Grid item xs={12} sm={6}>
            <CustomTextField
              fullWidth
              name="name"
              size="small"
              label="Unit"
              variant="outlined"
              value={unit.name}
              onChange={handleInputChange}
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <CustomTextField
              fullWidth
              name="shortName"
              size="small"
              label="Short Name"
              variant="outlined"
              value={unit.shortName}
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
          Submit
        </Button>
      </Box>
    </>
  );
});
