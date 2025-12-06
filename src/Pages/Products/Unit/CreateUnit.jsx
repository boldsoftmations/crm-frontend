import { Box, Button, Grid } from "@mui/material";
import { memo, useCallback, useState } from "react";
import React from "react";
import ProductService from "../../../services/ProductService";
import { CustomLoader } from "../../../Components/CustomLoader";
import CustomTextField from "../../../Components/CustomTextField";
import { useNotificationHandling } from "../../../Components/useNotificationHandling ";
import { MessageAlert } from "../../../Components/MessageAlert";
import CustomAutocomplete from "../../../Components/CustomAutocomplete";

export const CreateUnit = memo((props) => {
  const { setOpenPopup, getUnits, currentPage, searchQuery } = props;
  const [unit, setUnit] = useState({ digits: 0 });
  const [open, setOpen] = useState(false);
  const { handleSuccess, handleError, handleCloseSnackbar, alertInfo } =
    useNotificationHandling();
  const [isDecimal, setIsDecimal] = useState(true);

  const handleInputChange = (event) => {
    const { name, value } = event.target;
    setUnit({ ...unit, [name]: value });
  };
  const handleAutoCompleteChange = (event, value) => {
    setUnit({ ...unit, type_of_unit: value });
    if (value === "decimal") {
      setIsDecimal(false);
    }
  };

  const createunit = useCallback(
    async (e) => {
      try {
        e.preventDefault();
        setOpen(true);
        const data = {
          name: unit.name,
          short_name: unit.shortName,
          type_of_unit: unit.type_of_unit,
          max_decimal_digit: unit.max_decimal_digit,
        };
        if (unit.max_decimal_digit < 1) {
          handleError("Digits must be greater than 0");
          return;
        }
        if (unit.max_decimal_digit > 6) {
          handleError("Digits must be less than or equal to 6");
          return;
        }

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
          <Grid item xs={12} sm={6}>
            {/* <CustomAutoComplete
              fullWidth
              name="shortName"
              size="small"
              label="Type"
              variant="outlined"
              value={unit.type}
              onChange={handleInputChange}
            /> */}
            <CustomAutocomplete
              size="small"
              disablePortal
              id="type-selector"
              value={unit.type_of_unit}
              options={["number", "decimal"]}
              getOptionLabel={(option) => option}
              onChange={handleAutoCompleteChange}
              label="Type"
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <CustomTextField
              fullWidth
              type="number"
              name="max_decimal_digit"
              size="small"
              label="decimal digit"
              variant="outlined"
              value={unit.max_decimal_digit}
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
          Submit
        </Button>
      </Box>
    </>
  );
});
