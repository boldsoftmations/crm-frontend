import React, { memo, useCallback, useMemo, useState } from "react";
import ProductService from "../../../services/ProductService";
import { Box, Grid, Button } from "@mui/material";
import { useSelector } from "react-redux";
import { CustomLoader } from "../../../Components/CustomLoader";
import CustomTextField from "../../../Components/CustomTextField";
import CustomAutocomplete from "../../../Components/CustomAutocomplete";
import { useNotificationHandling } from "../../../Components/useNotificationHandling ";
import { MessageAlert } from "../../../Components/MessageAlert";

function searchArrayByKey(array, key, searchValue, returnValue) {
  for (let i = 0; i < array.length; i++) {
    if (array[i][key] === searchValue) {
      return array[i][returnValue];
    }
  }
}

export const UpdateSampleProduct = memo((props) => {
  const { recordForEdit, setOpenPopup, getAllSampleProduct } = props;
  const [formData, setFormData] = useState(recordForEdit);
  const GST = JSON.stringify(formData.gst / 2);
  const [open, setOpen] = useState(false);
  const {
    brandAllData,
    colourAllData,
    packingunitAllData,
    productCodeAllData,
    basicunitAllData,
    unitAllData,
  } = useSelector((state) => state.auth);
  const { handleSuccess, handleError, handleCloseSnackbar, alertInfo } =
    useNotificationHandling();

  const shortName = searchArrayByKey(
    brandAllData,
    "name",
    formData.brand,
    "short_name"
  );
  const description = searchArrayByKey(
    productCodeAllData,
    "code",
    formData.productcode,
    "description"
  );
  const getPackingUnitShortName = searchArrayByKey(
    packingunitAllData,
    "name",
    formData.packing_unit,
    "short_name"
  );

  const productName = useMemo(() => {
    const productNameParts = [
      formData.productcode,
      formData.color,
      shortName,
      formData.size,
      formData.unit_quantity,
      getPackingUnitShortName,
    ];

    // Join the initial parts of the product name with dashes.
    let combinedName = productNameParts.filter((part) => part).join("-");

    // Append packing unit quantity directly without a preceding dash if it exists and other parts are present.
    if (formData.packing_unit_quantity && combinedName) {
      combinedName += formData.packing_unit_quantity;
    } else if (formData.packing_unit_quantity) {
      combinedName = formData.packing_unit_quantity;
    }

    return combinedName;
  }, [formData, shortName, getPackingUnitShortName]);
  const handleInputChange = useCallback((event) => {
    const { name, value } = event.target;
    setFormData((prevFormData) => ({ ...prevFormData, [name]: value }));
  }, []);

  const updateFinishGood = useCallback(
    async (e) => {
      try {
        e.preventDefault();
        setOpen(true);

        const data = {
          name: productName,
          size: formData.size,
          basic_unit: formData.basic_unit,
          unit: formData.unit,
          color: formData.color,
          brand: formData.brand,
          productcode: formData.productcode,
          description: description,
          hsn_code: formData.hsn_code,
          type: "Sample",
        };

        if (recordForEdit) {
          const response = await ProductService.updateSampleProduct(
            formData.id,
            data
          );
          const successMessage =
            response.data.message || "Finish Goods updated successfully";
          handleSuccess(successMessage);

          setTimeout(() => {
            setOpenPopup(false);
            getAllSampleProduct();
          }, 300);
        }
      } catch (error) {
        handleError(error); // Handle errors from the API call
      } finally {
        setOpen(false); // Always close the loader
      }
    },
    [formData, productName, GST]
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

      <Box component="form" noValidate onSubmit={updateFinishGood}>
        <Grid container spacing={2}>
          <Grid item xs={12} sm={4}>
            <CustomTextField
              fullWidth
              name="Name"
              size="small"
              label="Name"
              variant="outlined"
              value={productName}
            />
          </Grid>
          <Grid item xs={12} sm={4}>
            <CustomTextField
              fullWidth
              name="size"
              size="small"
              label="Size"
              variant="outlined"
              value={formData.size}
              onChange={handleInputChange}
            />
          </Grid>
          <Grid item xs={12} sm={4}>
            <CustomAutocomplete
              sx={{
                minWidth: 220,
              }}
              size="small"
              value={formData.unit || ""}
              onChange={(event, newValue) => {
                setFormData((prev) => ({ ...prev, unit: newValue }));
              }}
              options={unitAllData.map((option) => option.name)}
              getOptionLabel={(option) => `${option}`}
              label="Unit"
            />
          </Grid>

          <Grid item xs={12} sm={4}>
            <CustomAutocomplete
              sx={{
                minWidth: 220,
              }}
              size="small"
              value={formData.basic_unit || ""}
              onChange={(event, newValue) => {
                setFormData((prev) => ({ ...prev, basic_unit: newValue }));
              }}
              options={basicunitAllData.map((option) => option.name)}
              getOptionLabel={(option) => `${option}`}
              label="Basic Unit"
            />
          </Grid>
          <Grid item xs={12} sm={4}>
            <CustomAutocomplete
              sx={{
                minWidth: 220,
              }}
              size="small"
              value={formData.color || ""}
              onChange={(event, newValue) => {
                setFormData((prev) => ({ ...prev, color: newValue }));
              }}
              options={colourAllData.map((option) => option.name)}
              getOptionLabel={(option) => `${option}`}
              label="Colour"
            />
          </Grid>

          <Grid item xs={12} sm={4}>
            <CustomAutocomplete
              sx={{
                minWidth: 220,
              }}
              size="small"
              value={formData.brand || ""}
              onChange={(event, newValue) => {
                setFormData((prev) => ({ ...prev, brand: newValue }));
              }}
              options={brandAllData.map((option) => option.name)}
              getOptionLabel={(option) => `${option}`}
              label="brand"
            />
          </Grid>
          <Grid item xs={12} sm={4}>
            <CustomAutocomplete
              sx={{
                minWidth: 220,
              }}
              size="small"
              value={formData.productcode || ""}
              onChange={(event, newValue) => {
                setFormData((prev) => ({ ...prev, productcode: newValue }));
              }}
              options={productCodeAllData.map((option) => option.code)}
              getOptionLabel={(option) => `${option}`}
              label="Product Code"
            />
          </Grid>
          <Grid item xs={12} sm={4}>
            <CustomTextField
              fullWidth
              name="hsn_code"
              size="small"
              label="Hsn Code"
              variant="outlined"
              value={formData.hsn_code || ""}
              onChange={handleInputChange}
            />
          </Grid>
          <Grid item xs={12} sm={4}>
            <CustomTextField
              fullWidth
              size="small"
              label="Description"
              variant="outlined"
              value={description || ""}
            />
          </Grid>
        </Grid>
        <Button
          type="submit"
          fullWidth
          variant="contained"
          sx={{ mt: 3, mb: 2 }}
        >
          Submit
        </Button>
      </Box>
    </>
  );
});
