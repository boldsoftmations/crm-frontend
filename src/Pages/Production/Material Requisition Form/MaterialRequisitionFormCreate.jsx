import { Box, Button, Chip, Divider, Grid, styled } from "@mui/material";
import React, { memo, useEffect, useMemo, useState } from "react";
import { CustomLoader } from "../../../Components/CustomLoader";
import InventoryServices from "../../../services/InventoryService";
import { useSelector } from "react-redux";
import CustomTextField from "../../../Components/CustomTextField";
import CustomAutocomplete from "../../../Components/CustomAutocomplete";
import useDynamicFormFields from "../../../Components/useDynamicFormFields ";
import { useNotificationHandling } from "../../../Components/useNotificationHandling ";
import { MessageAlert } from "../../../Components/MessageAlert";
import InvoiceServices from "../../../services/InvoiceService";
// import { DecimalValidation } from "../../../Components/Header/DecimalValidation";
export const MaterialRequisitionFormCreate = memo((props) => {
  const {
    setOpenPopup,
    getAllMaterialRequisitionFormDetails,
    storesInventoryData,
    currentPage,
    searchQuery,
  } = props;
  const productOption = useMemo(
    () =>
      storesInventoryData.map((data) => ({
        product: data.product__name,
        unit: data.product__unit,
        quantity: data.quantity,
        type_of_unit: data.type_of_unit,
        max_decimal_digit: data.max_decimal_digit,
      })),
    [storesInventoryData]
  );
  const { handleSuccess, handleError, handleCloseSnackbar, alertInfo } =
    useNotificationHandling();
  const {
    handleAutocompleteChange,
    handleFormChange,
    addFields,
    removeFields,
    products,
  } = useDynamicFormFields(
    [
      {
        product: "",
        unit: "",
        quantity: "",
        max_decimal_digit: "",
        type_of_unit: "",
      },
    ],
    productOption
  );

  const [open, setOpen] = useState(false);
  const [selectedSellerData, setSelectedSellerData] = useState(null);
  const [sellerOption, setSellerOption] = useState(null);
  const { profile: users } = useSelector((state) => state.auth);

  useEffect(() => {
    getAllSellerAccountsDetails();
    // console.log(getAllMaterialRequisitionFormDetails);
  }, []);

  const getAllSellerAccountsDetails = async () => {
    try {
      const data = users.groups.includes("Production Delhi")
        ? "Delhi"
        : "Maharashtra";
      const response = await InvoiceServices.getfilterSellerAccountData(data);
      setSellerOption(response.data.results);
    } catch (err) {
      handleError(err);
      console.log("err", err);
    }
  };

  const createMaterialRequisitionFormDetails = async (e) => {
    try {
      e.preventDefault();

      setOpen(true);

      const payload = {
        seller_account: selectedSellerData,
        user: users.email,
        products_data: products,
      };
      // const quantities = products.map((item) => item.quantity);

      // const numTypes = products.map((item) => item.type_of_unit);
      // const unit = products.map((item) => item.unit);
      // const decimalCounts = products.map((item) =>
      //   String(item.max_decimal_digit)
      // );

      // console.log(products, "products");
      // console.log(productOption, "productiotio");
      // const isvalid = DecimalValidation({
      //   numTypes,
      //   quantities,
      //   decimalCounts,
      //   unit,
      //   handleError,
      // });
      // if (!isvalid) {
      //   setOpen(false);
      //   return;
      // }
      await InventoryServices.createMaterialRequisitionFormData(payload);
      handleSuccess("MRF Created Successfully");
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
        onSubmit={(e) => createMaterialRequisitionFormDetails(e)}
      >
        <Grid container spacing={2}>
          <Grid item xs={12} sm={6}>
            <CustomAutocomplete
              name="seller_account"
              size="small"
              disablePortal
              id="combo-box-demo"
              onChange={(event, value) => setSelectedSellerData(value)}
              options={
                sellerOption && sellerOption.map((option) => option.unit)
              }
              getOptionLabel={(option) => option}
              sx={{ minWidth: 300 }}
              label="Seller Account"
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
                    options={storesInventoryData.map(
                      (option) => option.product__name
                    )}
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
                    type="number"
                    name="quantity"
                    inputProps={{
                      step: input.type_of_unit === "decimal" ? 0.01 : 1,
                    }}
                    size="small"
                    label="Quantitys"
                    variant="outlined"
                    value={
                      (input.type_of_unit === "decimal"
                        ? input.quantity
                        : Math.floor(input.quantity)) || ""
                    }
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

const Root = styled("div")(({ theme }) => ({
  width: "100%",
  ...theme.typography.body2,
  "& > :not(style) + :not(style)": {
    marginTop: theme.spacing(2),
  },
}));
