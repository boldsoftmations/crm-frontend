import { Box, Button, Grid } from "@mui/material";
import React, { memo, useCallback, useEffect, useState } from "react";
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
  const [isDecimal, setIsDecimal] = useState(true);
  console.log(recordForEdit);
  useEffect(() => {
    if (recordForEdit.type_of_unit === "decimal") {
      setIsDecimal(false);
    } else {
      setIsDecimal(true);
    }
  }, [recordForEdit]);
  const handleInputChange = (event) => {
    const { name, value } = event.target;

    setUnit({ ...unit, [name]: value });
  };

  const updatesunit = useCallback(
    async (e) => {
      try {
        e.preventDefault();
        if (unit.max_decimal_digit < 1) {
          handleError("Digits must be greater than 0");
          return;
        }
        if (unit.max_decimal_digit > 6) {
          handleError("Digits must be less than or equal to 6");
          return;
        }
        if (
          Number(unit.max_decimal_digit) ===
          Number(recordForEdit.max_decimal_digit)
        ) {
          handleError("its equal to previous value");
          return;
        }
        setOpen(true);
        const data = {
          name: unit.name,
          short_name: unit.short_name,
          type_of_unit: unit.type_of_unit,
          max_decimal_digit: unit.max_decimal_digit,
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
          <Grid item xs={12}>
            <CustomTextField
              fullWidth
              name="type_of_unit"
              size="small"
              label="Type"
              variant="outlined"
              value={recordForEdit.type_of_unit || ""}
              onChange={handleInputChange}
              disabled={true}
            />
          </Grid>
          <Grid item xs={12}>
            <CustomTextField
              fullWidth
              type="number"
              name="max_decimal_digit"
              size="small"
              label="Decimal Digits"
              variant="outlined"
              value={
                recordForEdit.type_of_unit === "decimal"
                  ? unit.max_decimal_digit
                  : 0
              }
              onChange={handleInputChange}
              disabled={isDecimal}
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
