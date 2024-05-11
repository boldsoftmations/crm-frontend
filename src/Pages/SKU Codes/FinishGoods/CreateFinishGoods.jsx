import { Box, Button, Grid } from "@mui/material";
import React, { memo, useCallback, useMemo, useState } from "react";
import ProductService from "../../../services/ProductService";
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

export const CreateFinishGoods = memo((props) => {
  const { setOpenPopup, getFinishGoods, currentPage, searchQuery } = props;
  const [formData, setFormData] = useState([]);
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
    formData.brand || "",
    "short_name"
  );
  const description = searchArrayByKey(
    productCodeAllData,
    "code",
    formData.product_code || "",
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
      formData.product_code,
      formData.color,
      shortName,
      formData.size,
      formData.unit_quantity,
      getPackingUnitShortName,
      formData.packing_unit_quantity,
    ];

    return productNameParts.filter((part) => part).join("-");
  }, [formData, shortName, getPackingUnitShortName]); // Add dependencies as needed

  const handleInputChange = useCallback((event) => {
    const { name, value } = event.target;
    setFormData((prevFormData) => ({ ...prevFormData, [name]: value }));
  }, []);

  const createfinishGoods = useCallback(
    async (e) => {
      try {
        e.preventDefault();
        setOpen(true);
        const data = {
          name: productName,
          size: formData.size,
          basic_unit: formData.basic_unit,
          unit: formData.unit,
          unit_quantity: formData.unit_quantity,
          packing_unit: formData.packing_unit,
          packing_unit_quantity: formData.packing_unit_quantity,
          color: formData.color,
          brand: formData.brand,
          productcode: formData.product_code,
          description: description,
          shelf_life: formData.shelf_life,
          hsn_code: formData.hsn_code,
          gst: formData.gst,
          cgst: GST,
          sgst: GST,
          type: "finished-goods",
        };

        const response = await ProductService.createFinishGoods(data);

        const successMessage =
          response.data.message || "Finish Goods updated successfully";
        handleSuccess(successMessage);

        setTimeout(() => {
          setOpenPopup(false);
          getFinishGoods(currentPage, searchQuery);
        }, 300);
      } catch (error) {
        handleError(error); // Handle errors from the API call
      } finally {
        setOpen(false); // Always close the loader
      }
    },
    [formData, productName, GST, currentPage, searchQuery]
  );

  const GST = formData.gst / 2;

  return (
    <>
      <MessageAlert
        open={alertInfo.open}
        onClose={handleCloseSnackbar}
        severity={alertInfo.severity}
        message={alertInfo.message}
      />
      <CustomLoader open={open} />

      <Box component="form" noValidate onSubmit={(e) => createfinishGoods(e)}>
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
            <CustomTextField
              fullWidth
              name="unit_quantity"
              size="small"
              label="Unit Quantity"
              variant="outlined"
              value={formData.unit_quantity}
              onChange={handleInputChange}
            />
          </Grid>
          <Grid item xs={12} sm={4}>
            <CustomAutocomplete
              sx={{
                minWidth: 220,
              }}
              size="small"
              value={formData.packing_unit || ""}
              onChange={(event, newValue) => {
                setFormData((prev) => ({ ...prev, packing_unit: newValue }));
              }}
              options={packingunitAllData.map((option) => option.name)}
              getOptionLabel={(option) => `${option}`}
              label="Packing Unit"
            />
          </Grid>
          <Grid item xs={12} sm={4}>
            <CustomTextField
              fullWidth
              name="packing_unit_quantity"
              size="small"
              label="Packing Unit Quantity"
              variant="outlined"
              value={formData.packing_unit_quantity}
              onChange={handleInputChange}
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
              value={formData.product_code || ""}
              onChange={(event, newValue) => {
                setFormData((prev) => ({ ...prev, product_code: newValue }));
              }}
              options={productCodeAllData.map((option) => option.code)}
              getOptionLabel={(option) => `${option}`}
              label="Product Code"
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
          <Grid item xs={12} sm={4}>
            <CustomTextField
              fullWidth
              size="small"
              name="shelf_life"
              label="Shelf Life (Month)"
              variant="outlined"
              value={formData.shelf_life || ""}
              onChange={handleInputChange}
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
              name="gst"
              size="small"
              type={"number"}
              label="IGST %"
              variant="outlined"
              value={formData.gst}
              onChange={handleInputChange}
            />
          </Grid>
          <Grid item xs={12} sm={4}>
            <CustomTextField
              fullWidth
              size="small"
              label="CGST"
              variant="outlined"
              value={GST ? `${GST}%` : ""}
            />
          </Grid>
          <Grid item xs={12} sm={4}>
            <CustomTextField
              fullWidth
              size="small"
              label="SGST"
              variant="outlined"
              value={GST ? `${GST}%` : ""}
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
