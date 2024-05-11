import { Box, Button, Chip, Divider, Grid } from "@mui/material";
import React, { memo, useMemo, useState } from "react";
import { CustomLoader } from "../../../Components/CustomLoader";
import InventoryServices from "../../../services/InventoryService";
import CustomTextField from "../../../Components/CustomTextField";
import { styled } from "@mui/material/styles";
import { useSelector } from "react-redux";
import CustomAutocomplete from "../../../Components/CustomAutocomplete";
import { MessageAlert } from "../../../Components/MessageAlert";
import { useNotificationHandling } from "../../../Components/useNotificationHandling ";
import useDynamicFormFields from "../../../Components/useDynamicFormFields ";

const Root = styled("div")(({ theme }) => ({
  width: "100%",
  ...theme.typography.body2,
  "& > :not(style) + :not(style)": {
    marginTop: theme.spacing(2),
  },
}));

export const BillofMaterialsUpdate = memo((props) => {
  const {
    setOpenPopup,
    getAllBillofMaterialsDetails,
    idForEdit,
    currentPage,
    searchQuery,
    filterApproved,
  } = props;
  const [open, setOpen] = useState(false);
  const { consumableProduct, rawMaterialProduct } = useSelector(
    (state) => state.auth
  );
  const RawAndConsumableProduct = useMemo(
    () => [...(consumableProduct || []), ...(rawMaterialProduct || [])],
    [consumableProduct, rawMaterialProduct]
  );
  const productOption = useMemo(
    () =>
      RawAndConsumableProduct.map((data) => ({
        product: data.product,
        unit: data.unit,
        quantity: data.quantity,
      })),
    [RawAndConsumableProduct]
  );
  const initialFields = useMemo(
    () =>
      idForEdit.products_data.map((data) => ({
        product: data.product,
        unit: data.unit, // Assuming this correction is needed
        quantity: data.quantity, // Assuming this correction is needed
      })),
    [idForEdit]
  );
  const { handleSuccess, handleError, handleCloseSnackbar, alertInfo } =
    useNotificationHandling();
  const {
    handleAutocompleteChange,
    handleFormChange,
    addFields,
    removeFields,
    products,
  } = useDynamicFormFields(initialFields, productOption);

  const updateBillofMaterialsDetails = async (e) => {
    try {
      e.preventDefault();
      setOpen(true);
      const req = {
        product: idForEdit.product,
        approved: idForEdit.approved,
        products_data: products,
      };
      await InventoryServices.updateBillofMaterialsData(idForEdit.id, req);
      handleSuccess("BOM Updated Successfully");
      setTimeout(() => {
        setOpenPopup(false);
      }, 300);
      getAllBillofMaterialsDetails(currentPage, searchQuery, filterApproved);
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

      <Box
        component="form"
        noValidate
        onSubmit={(e) => updateBillofMaterialsDetails(e)}
      >
        <Grid container spacing={2}>
          <Grid item xs={12} sm={3}>
            <CustomTextField
              fullWidth
              size="small"
              label="Product"
              variant="outlined"
              value={idForEdit.product || ""}
            />
          </Grid>
          <Grid item xs={12}>
            <Root>
              <Divider>
                <Chip label="PRODUCT" />
              </Divider>
            </Root>
          </Grid>
          {products.map((input, index) => {
            return (
              <>
                <Grid key={index} item xs={12} sm={4}>
                  <CustomAutocomplete
                    name="product"
                    size="small"
                    disablePortal
                    id="combo-box-demo"
                    value={input.product || ""}
                    onChange={(event, value) =>
                      handleAutocompleteChange(index, event, value)
                    }
                    options={
                      RawAndConsumableProduct
                        ? RawAndConsumableProduct.map(
                            (option) => option.product
                          )
                        : []
                    }
                    getOptionLabel={(option) => option}
                    sx={{ minWidth: 300 }}
                    label="Product Name"
                  />
                </Grid>
                <Grid item xs={12} sm={3}>
                  <CustomTextField
                    fullWidth
                    name="unit"
                    size="small"
                    label="Unit"
                    variant="outlined"
                    value={input.unit || ""}
                  />
                </Grid>
                <Grid item xs={12} sm={3}>
                  <CustomTextField
                    fullWidth
                    name="quantity"
                    size="small"
                    label="Quantity"
                    variant="outlined"
                    value={input.quantity || ""}
                    onChange={(event) => handleFormChange(index, event)}
                  />
                </Grid>

                <Grid item xs={12} sm={1} alignContent="right">
                  {index !== 0 && (
                    <Button
                      disabled={index === 0}
                      onClick={() => removeFields(index)}
                      variant="contained"
                    >
                      Remove
                    </Button>
                  )}
                </Grid>
              </>
            );
          })}
          <Grid item xs={12} sm={4} alignContent="right">
            <Button
              onClick={addFields}
              variant="contained"
              sx={{ marginRight: "1em" }}
            >
              Add More...
            </Button>
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
