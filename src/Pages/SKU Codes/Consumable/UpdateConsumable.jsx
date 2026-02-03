import { Box, Button, Grid } from "@mui/material";
import React, { memo, useCallback, useMemo, useState } from "react";
import ProductService from "../../../services/ProductService";
import { useSelector } from "react-redux";
import { CustomLoader } from "../../../Components/CustomLoader";
import CustomTextField from "../../../Components/CustomTextField";
import CustomAutocomplete from "../../../Components/CustomAutocomplete";
import { useNotificationHandling } from "../../../Components/useNotificationHandling ";
import { DecimalValidation } from "../../../Components/Header/DecimalValidation";
import { MessageAlert } from "../../../Components/MessageAlert";

// 🔍 Utility to search array objects
const searchArrayValue = (array, key, value, returnKey) => {
  const found = array.find((item) => item[key] === value);
  return found ? found[returnKey] : "";
};

export const UpdateConsumable = memo((props) => {
  const {
    recordForEdit,
    setOpenPopup,
    getconsumables,
    currentPage,
    searchQuery,
    descriptionOptions,
  } = props;

  const [open, setOpen] = useState(false);
  const [unitType, setUnitType] = useState(recordForEdit.unit);
  const [formData, setFormData] = useState(recordForEdit);
  console.log(recordForEdit);

  const { brandAllData, unitAllData } = useSelector((state) => state.auth);
  const productUnit = unitAllData;

  const userData = useSelector((state) => state.auth.profile || { groups: [] });
  const isInGroups = (...groups) =>
    groups.some((group) => userData.groups.includes(group));

  const { handleSuccess, handleError, handleCloseSnackbar, alertInfo } =
    useNotificationHandling();

  // 🔹 Description value
  const descriptionValue = useMemo(
    () => formData.description || "",
    [formData.description],
  );

  // 🔹 Short name of brand
  const shortName = useMemo(
    () => searchArrayValue(brandAllData, "name", formData.brand, "short_name"),
    [formData.brand, brandAllData],
  );

  // 🔹 Product Name
  const productName = useMemo(() => {
    const autoNo = formData.name || "";
    const first = autoNo.indexOf("-");
    const second = autoNo.indexOf("-", first + 1);
    const auto = autoNo.slice(first + 1, second);
    const parts = [descriptionValue, auto || "-", shortName || "-"];
    return parts.join("-");
  }, [descriptionValue, formData.name, shortName]);

  // 🔹 GST
  const GST = useMemo(
    () => (formData.gst ? formData.gst / 2 : 0),
    [formData.gst],
  );

  // 🔹 Handle normal text input changes
  const handleInputChange = useCallback((e) => {
    const { name, value } = e.target;

    // Ensure minimum_stock_limit is number
    if (name === "minimum_stock_limit") {
      setFormData((p) => ({
        ...p,
        minimum_stock_limit: value === "" ? 0 : Number(value),
      }));
      return;
    }

    setFormData((p) => ({ ...p, [name]: value }));
  }, []);

  // 🔹 Handle Autocomplete changes
  const handleAutoChange = useCallback((name, value) => {
    setFormData((p) => ({ ...p, [name]: value }));
  }, []);

  // 🔹 Submit handler
  const updatesconsumable = useCallback(
    async (e) => {
      e.preventDefault();
      try {
        setOpen(true);

        // 🔹 Unit validation
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

        // 🔹 Prepare payload
        const data = {
          name: productName,
          description: formData.description,
          unit: formData.unit,
          brand: formData.brand,
          size: formData.size,
          additional_description: formData.additional_description,
          shelf_life: formData.shelf_life,
          hsn_code: formData.hsn_code,
          gst: formData.gst,
          cgst: GST,
          sgst: GST,
          minimum_stock_limit:
            safeUnitType === "decimal"
              ? parseFloat(formData.minimum_stock_limit).toString()
              : parseInt(formData.minimum_stock_limit).toString(),
          type: "consumables",
        };

        if (recordForEdit) {
          const response = await ProductService.updateConsumable(
            formData.id,
            data,
          );
          handleSuccess(
            response.data.message || "Consumable updated successfully",
          );

          setTimeout(() => {
            setOpenPopup(false);
            getconsumables(currentPage, searchQuery);
          }, 300);
        }
      } catch (error) {
        handleError(error);
      } finally {
        setOpen(false);
      }
    },
    [
      formData,
      productName,
      GST,
      productUnit,
      currentPage,
      searchQuery,
      recordForEdit,
    ],
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

      <Box component="form" noValidate onSubmit={updatesconsumable}>
        <Grid container spacing={2}>
          {/* Name */}
          <Grid item xs={12} sm={4}>
            <CustomTextField
              fullWidth
              size="small"
              label="Name"
              value={formData.name || ""}
              disabled={isInGroups("Stores")}
            />
          </Grid>

          {/* Product Code */}
          <Grid item xs={12} sm={4}>
            <CustomTextField
              fullWidth
              size="small"
              label="Product Code"
              value={productName || ""}
              disabled={isInGroups("Stores")}
            />
          </Grid>

          {/* Size */}
          <Grid item xs={12} sm={4}>
            <CustomTextField
              fullWidth
              name="size"
              size="small"
              label="Size"
              value={formData.size || ""}
              onChange={handleInputChange}
              disabled={isInGroups("Stores")}
            />
          </Grid>

          {/* Unit */}
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

          {/* Description */}
          <Grid item xs={12} sm={4}>
            <CustomAutocomplete
              size="small"
              value={formData.description || ""}
              onChange={(e, v) =>
                setFormData((prev) => ({ ...prev, description: v }))
              }
              options={descriptionOptions.map((o) => o.name)}
              getOptionLabel={(option) => `${option}`}
              label="Description"
              disabled={isInGroups("Stores")}
            />
          </Grid>

          {/* Brand */}
          <Grid item xs={12} sm={4}>
            <CustomAutocomplete
              size="small"
              value={formData.brand || ""}
              options={brandAllData.map((o) => o.name)}
              label="Brand"
              onChange={(e, v) => handleAutoChange("brand", v)}
              // disabled={isInGroups("Stores")}
            />
          </Grid>

          {/* Additional Description */}
          <Grid item xs={12} sm={4}>
            <CustomTextField
              fullWidth
              name="additional_description"
              size="small"
              label="Additional Description"
              value={formData.additional_description || ""}
              onChange={handleInputChange}
              // disabled={isInGroups("Stores")}
            />
          </Grid>

          {/* Minimum Stock Limit */}
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

          {/* Shelf Life */}
          <Grid item xs={12} sm={4}>
            <CustomTextField
              fullWidth
              name="shelf_life"
              size="small"
              label="Shelf Life (Month)"
              value={formData.shelf_life || ""}
              onChange={handleInputChange}
              disabled={isInGroups("Stores")}
            />
          </Grid>

          {/* HSN Code */}
          <Grid item xs={12} sm={4}>
            <CustomTextField
              fullWidth
              name="hsn_code"
              size="small"
              label="HSN Code"
              value={formData.hsn_code || ""}
              onChange={handleInputChange}
              disabled={isInGroups("Stores")}
            />
          </Grid>

          {/* GST */}
          <Grid item xs={12} sm={4}>
            <CustomTextField
              fullWidth
              name="gst"
              type="number"
              size="small"
              label="IGST %"
              value={formData.gst || ""}
              onChange={handleInputChange}
              disabled={isInGroups("Stores")}
            />
          </Grid>

          {/* CGST */}
          <Grid item xs={12} sm={4}>
            <CustomTextField
              fullWidth
              size="small"
              label="CGST"
              value={`${GST}%`}
              disabled={isInGroups("Stores")}
            />
          </Grid>

          {/* SGST */}
          <Grid item xs={12} sm={4}>
            <CustomTextField
              fullWidth
              size="small"
              label="SGST"
              value={`${GST}%`}
              disabled={isInGroups("Stores")}
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
