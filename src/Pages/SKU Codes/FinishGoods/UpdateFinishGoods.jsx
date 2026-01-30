import React, { memo, useCallback, useMemo, useState } from "react";
import ProductService from "../../../services/ProductService";
import { Box, Grid, Button } from "@mui/material";
import { useSelector } from "react-redux";
import { CustomLoader } from "../../../Components/CustomLoader";
import CustomTextField from "../../../Components/CustomTextField";
import CustomAutocomplete from "../../../Components/CustomAutocomplete";
import { useNotificationHandling } from "../../../Components/useNotificationHandling ";
import { MessageAlert } from "../../../Components/MessageAlert";
import { DecimalValidation } from "../../../Components/Header/DecimalValidation";
function searchArrayByKey(array, key, searchValue, returnValue) {
  if (!Array.isArray(array)) return null;

  for (let i = 0; i < array.length; i++) {
    if (array[i] && array[i][key] === searchValue) {
      return array[i][returnValue] || null;
    }
  }

  return null;
}

export const UpdateFinishGoods = memo((props) => {
  const {
    recordForEdit,
    setOpenPopup,
    getFinishGoods,
    currentPage,
    searchQuery,
  } = props;
  const [unitType, setUnitType] = useState(recordForEdit.unit);
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
  const productUnit = unitAllData;
  const { handleSuccess, handleError, handleCloseSnackbar, alertInfo } =
    useNotificationHandling();
  const userData = useSelector((state) => state.auth.profile);
  const isInGroups = (...groups) =>
    groups.some((group) => userData.groups.includes(group));
  const shortName = searchArrayByKey(
    brandAllData,
    "name",
    formData.brand,
    "short_name",
  );
  const description = searchArrayByKey(
    productCodeAllData,
    "code",
    formData.productcode,
    "description",
  );
  const getPackingUnitShortName = searchArrayByKey(
    packingunitAllData,
    "name",
    formData.packing_unit,
    "short_name",
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
        const selectedUnit = productUnit.find(
          (item) => item.name === formData.unit,
        );

        const safeUnitType = selectedUnit ? selectedUnit.type_of_unit : "";
        const maxDecimal = selectedUnit ? selectedUnit.max_decimal_digit : "";

        setUnitType(safeUnitType);

        if (safeUnitType === "decimal") {
          const isValid = DecimalValidation({
            numTypes: [safeUnitType],
            quantities: [formData.minimum_stock_limit],
            decimalCounts: [maxDecimal],
            unit: [formData.unit],
            handleError,
          });

          if (!isValid) {
            setOpen(false);
            return;
          }
        }

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
          minimum_stock_limit: formData.minimum_stock_limit,
          productcode: formData.productcode,
          description: description,
          shelf_life: formData.shelf_life,
          hsn_code: formData.hsn_code,
          gst: formData.gst,
          cgst: GST,
          sgst: GST,
          type: "finished-goods",
        };
        if (recordForEdit) {
          const response = await ProductService.updateFinishGoods(
            formData.id,
            data,
          );
          const successMessage =
            response.data.message || "Finish Goods updated successfully";
          handleSuccess(successMessage);

          setTimeout(() => {
            setOpenPopup(false);
            getFinishGoods(currentPage, searchQuery);
          }, 300);
        }
      } catch (error) {
        handleError(error); // Handle errors from the API call
      } finally {
        setOpen(false); // Always close the loader
      }
    },
    [formData, productName, GST, currentPage, searchQuery],
  );
  const handleAutoChange = useCallback((name, value) => {
    setFormData((p) => ({ ...p, [name]: value }));
  }, []);
  return (
    <>
      <MessageAlert
        open={alertInfo.open}
        onClose={handleCloseSnackbar}
        severity={alertInfo.severity}
        message={alertInfo.message}
      />
      <CustomLoader open={open} />

      <Box component="form" noValidate onSubmit={(e) => updateFinishGood(e)}>
        <Grid container spacing={2}>
          <Grid item xs={12} sm={4}>
            <CustomTextField
              fullWidth
              size="small"
              label="Name"
              variant="outlined"
              value={formData.name || ""}
              disabled={isInGroups("Stores")}
            />
          </Grid>
          <Grid item xs={12} sm={4}>
            <CustomTextField
              fullWidth
              name="Name"
              size="small"
              label="Update Name"
              variant="outlined"
              value={productName ? productName : ""}
              disabled={isInGroups("Stores")}
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
              options={
                basicunitAllData &&
                basicunitAllData.map((option) => option.name)
              }
              getOptionLabel={(option) => `${option}`}
              label="Basic Unit"
              disabled={isInGroups("Stores")}
            />
          </Grid>

          <Grid item xs={12} sm={4}>
            <CustomAutocomplete
              size="small"
              value={formData.unit || ""}
              options={unitAllData.map((o) => o.name)}
              label="Unit"
              onChange={(e, v) => {
                handleAutoChange("unit", v);
                const u = productUnit.find((item) => item.name === v);
                setUnitType(u ? u.type_of_unit : "");
              }}
              disabled={isInGroups("Stores")}
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
              options={
                packingunitAllData &&
                packingunitAllData.map((option) => option.name)
              }
              getOptionLabel={(option) => `${option}`}
              label={" Packing Unit"}
              disabled={isInGroups("Stores")}
            />
          </Grid>
          <Grid item xs={12} sm={4}>
            <CustomTextField
              fullWidth
              name="unit_quantity"
              size="small"
              label="Unit Quantity"
              variant="outlined"
              value={formData.unit_quantity || ""}
              onChange={handleInputChange}
              disabled={isInGroups("Stores")}
            />
          </Grid>

          <Grid item xs={12} sm={4}>
            <CustomTextField
              fullWidth
              name="minimum_stock_limit"
              size="small"
              label="Minimum Stock Limit"
              value={
                unitType === "decimal"
                  ? formData.minimum_stock_limit
                  : Math.round(formData.minimum_stock_limit) || "0"
              }
              onChange={handleInputChange}
            />
          </Grid>

          <Grid item xs={12} sm={4}>
            <CustomTextField
              fullWidth
              name="packing_unit_quantity"
              size="small"
              label="Packing Unit Quantity"
              variant="outlined"
              value={
                formData.packing_unit_quantity
                  ? formData.packing_unit_quantity
                  : ""
              }
              onChange={handleInputChange}
              disabled={isInGroups("Stores")}
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
              options={
                colourAllData && colourAllData.map((option) => option.name)
              }
              getOptionLabel={(option) => `${option}`}
              label={"Colour"}
              disabled={isInGroups("Stores")}
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
              options={
                brandAllData && brandAllData.map((option) => option.name)
              }
              getOptionLabel={(option) => `${option}`}
              label="Brand"
              disabled={isInGroups("Stores")}
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
              options={
                productCodeAllData &&
                productCodeAllData.map((option) => option.code)
              }
              getOptionLabel={(option) => `${option}`}
              label="Product Code"
              disabled={isInGroups("Stores")}
            />
          </Grid>
          <Grid item xs={12} sm={4}>
            <CustomTextField
              fullWidth
              size="small"
              label="Description"
              variant="outlined"
              value={description || ""}
              disabled={isInGroups("Stores")}
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
              disabled={isInGroups("Stores")}
            />
          </Grid>
          <Grid item xs={12} sm={4}>
            <CustomTextField
              fullWidth
              name="size"
              size="small"
              label="Size"
              variant="outlined"
              value={formData.size || ""}
              onChange={handleInputChange}
              disabled={isInGroups("Stores")}
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
              disabled={isInGroups("Stores")}
            />
          </Grid>
          <Grid item xs={12} sm={4}>
            <CustomTextField
              fullWidth
              name="gst"
              type={"number"}
              size="small"
              label="IGST %"
              variant="outlined"
              value={formData.gst || ""}
              onChange={handleInputChange}
              disabled={isInGroups("Stores")}
            />
          </Grid>
          <Grid item xs={12} sm={4}>
            <CustomTextField
              fullWidth
              size="small"
              label="CGST"
              variant="outlined"
              value={GST ? `${GST}%` : ""}
              disabled={isInGroups("Stores")}
            />
          </Grid>
          <Grid item xs={12} sm={4}>
            <CustomTextField
              fullWidth
              size="small"
              label="SGST"
              variant="outlined"
              value={GST ? `${GST}%` : ""}
              disabled={isInGroups("Stores")}
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
