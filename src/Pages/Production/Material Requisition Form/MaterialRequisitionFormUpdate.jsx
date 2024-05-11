import { Box, Button, Chip, Divider, Grid } from "@mui/material";
import React, { memo, useMemo, useState } from "react";
import { CustomLoader } from "../../../Components/CustomLoader";
import InventoryServices from "../../../services/InventoryService";
import CustomTextField from "../../../Components/CustomTextField";
import { styled } from "@mui/material/styles";
import { useSelector } from "react-redux";
import CustomAutocomplete from "../../../Components/CustomAutocomplete";
import { useNotificationHandling } from "../../../Components/useNotificationHandling ";
import useDynamicFormFields from "../../../Components/useDynamicFormFields ";
import { MessageAlert } from "../../../Components/MessageAlert";

const Root = styled("div")(({ theme }) => ({
  width: "100%",
  ...theme.typography.body2,
  "& > :not(style) + :not(style)": {
    marginTop: theme.spacing(2),
  },
}));

export const MaterialRequisitionFormUpdate = memo((props) => {
  const {
    setOpenPopup,
    getAllMaterialRequisitionFormDetails,
    idForEdit,
    storesInventoryData,
    currentPage,
    searchQuery,
  } = props;
  const [open, setOpen] = useState(false);
  const data = useSelector((state) => state.auth);
  const users = data.profile;
  const productOption = useMemo(
    () =>
      storesInventoryData.map((data) => ({
        product: data.product__name,
        unit: data.product__unit,
        quantity: data.quantity,
      })),
    [storesInventoryData]
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

  const updateMaterialRequisitionFormDetails = async (e) => {
    try {
      e.preventDefault();
      setOpen(true);
      const payload = {
        seller_account: idForEdit.seller_account,
        user: idForEdit.user,
        products_data: products,
      };
      await InventoryServices.updateMaterialRequisitionFormData(
        idForEdit.id,
        payload
      );
      handleSuccess("Material Requisition Form Accepted");
      setTimeout(() => {
        setOpenPopup(false);
      }, 300);
      getAllMaterialRequisitionFormDetails(currentPage, searchQuery);
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
        onSubmit={(e) => updateMaterialRequisitionFormDetails(e)}
      >
        <Grid container spacing={2}>
          <Grid item xs={12} sm={6}>
            <CustomTextField
              fullWidth
              size="small"
              label="Seller Account"
              variant="outlined"
              value={idForEdit.seller_account || ""}
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <CustomTextField
              fullWidth
              size="small"
              label="User"
              variant="outlined"
              value={idForEdit.user || ""}
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
                <Grid key={index} item xs={12} sm={5}>
                  <CustomAutocomplete
                    name="product"
                    size="small"
                    disablePortal
                    id="combo-box-demo"
                    value={input.product || ""}
                    onChange={(event, value) =>
                      handleAutocompleteChange(index, event, value)
                    }
                    options={storesInventoryData.map(
                      (option) => option.product__name
                    )}
                    getOptionLabel={(option) => option}
                    sx={{ minWidth: 300 }}
                    label="Product Name"
                  />
                </Grid>
                <Grid item xs={12} sm={2}>
                  <CustomTextField
                    fullWidth
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

                <Grid item xs={12} sm={2} alignContent="right">
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

        {idForEdit.accepted === false || users.groups.includes("Accounts") ? (
          <Button
            type="submit"
            fullWidth
            variant="contained"
            sx={{ mt: 3, mb: 2 }}
          >
            Submit
          </Button>
        ) : null}
      </Box>
    </>
  );
});
