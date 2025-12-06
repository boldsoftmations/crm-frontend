import React, { memo, useCallback, useEffect, useState } from "react";
import { Box, Button, Chip, Divider, Grid, Switch } from "@mui/material";
import { CustomLoader } from "../../../Components/CustomLoader";
import CustomTextField from "../../../Components/CustomTextField";
import InventoryServices from "../../../services/InventoryService";
import { styled } from "@mui/material/styles";
import { MessageAlert } from "../../../Components/MessageAlert";
import { useNotificationHandling } from "../../../Components/useNotificationHandling ";
import CustomAutocomplete from "../../../Components/CustomAutocomplete";
import ProductService from "../../../services/ProductService";
import { DecimalValidation } from "../../../Components/Header/DecimalValidation";
// import { DecimalValidation } from "../../../Components/Header/DecimalValidation";

const Root = styled("div")(({ theme }) => ({
  width: "100%",
  ...theme.typography.body2,
  "& > :not(style) + :not(style)": {
    marginTop: theme.spacing(2),
  },
}));

export const PurchaseOrderUpdate = memo(
  ({
    selectedRow,
    getAllPurchaseOrderDetails,
    setOpenPopup,
    currentPage,
    acceptedFilter,
    searchQuery,
  }) => {
    const [inputValues, setInputValues] = useState(selectedRow);
    const [loading, setLoading] = useState(false);
    const [productList, setProductList] = useState([]);
    const { handleSuccess, handleError, handleCloseSnackbar, alertInfo } =
      useNotificationHandling();

    // useEffect(() => {
    //   selectedRow = selectedRow.products.map((p) => ({
    //     ...p,
    //     quantity:
    //       p.type_of_unit === "decimal"
    //         ? p.quantity // keep as decimal
    //         : Math.floor(Number(p.quantity)),
    //   }));
    // });

    const createPurchaseOrderDetails = useCallback(
      async (e) => {
        try {
          e.preventDefault();
          setLoading(true);

          const numTypes = inputValues.products.map(
            (item) => item.type_of_unit
          );
          const quantities = inputValues.products.map((item) => item.quantity);
          const decimalCounts = inputValues.products.map((item) =>
            String(item.max_decimal_digit)
          );
          const unit = inputValues.products.map((item) => item.unit);
          console.log(numTypes);

          if (numTypes.includes("decimal")) {
            const isvalid = DecimalValidation({
              numTypes,
              quantities,
              decimalCounts,
              unit,
              handleError,
            });
            if (!isvalid) {
              setLoading(false);
              return;
            }
          }

          const req = {
            created_by: inputValues.created_by,
            vendor: inputValues.vendor,
            vendor_type: inputValues.vendor_type,
            vendor_email: inputValues.vendor_email,
            vendor_contact_person: inputValues.vendor_contact_person,
            vendor_contact: inputValues.vendor_contact,
            seller_account: inputValues.seller_account,
            payment_terms: inputValues.payment_terms,
            delivery_terms: inputValues.delivery_terms,
            schedule_date: inputValues.schedule_date,
            currency: inputValues.currency,
            po_no: inputValues.po_no,
            po_date: inputValues.po_date,
            close_short: inputValues.close_short,
            products: inputValues.products || [],
          };

          const response = await InventoryServices.updatePurchaseOrderData(
            inputValues.id,
            req
          );
          const successMessage =
            response.data.message || "Purchase Order updated successfully";
          handleSuccess(successMessage);

          setTimeout(() => {
            setOpenPopup(false);
            getAllPurchaseOrderDetails(
              currentPage,
              acceptedFilter,
              searchQuery
            );
          }, 300);
        } catch (error) {
          handleError(error);
          console.log(error); // Handle errors from the API call
        } finally {
          setLoading(false); // Always close the loader
        }
      },
      [inputValues, currentPage, acceptedFilter, searchQuery]
    );

    const handleProductChange = (newValue, index) => {
      const selectedProduct = productList.find(
        (product) => product.name === newValue
      );

      const newUnit = selectedProduct ? selectedProduct.unit : "";

      setInputValues((prev) => {
        const updatedProducts = [...prev.products];

        updatedProducts[index] = {
          ...updatedProducts[index],
          product: newValue,
          unit: newUnit,
          type_of_unit: selectedProduct ? selectedProduct.type_of_unit : "",
          max_decimal_digit: selectedProduct
            ? selectedProduct.max_decimal_digit
            : "",
        };

        return {
          ...prev,
          products: updatedProducts,
        };
      });
    };

    const productListData = async () => {
      try {
        const response = await ProductService.getAllProduct();
        setProductList(response.data);
        console.log(response.data);
      } catch (error) {
        handleError(error); // Handle errors from the API call
      }
    };

    useEffect(() => {
      console.log("Updated inputValues:", inputValues);
    }, [inputValues]);
    useEffect(() => {
      productListData();
      console.log(productList);
    }, []);

    return (
      <>
        <MessageAlert
          open={alertInfo.open}
          onClose={handleCloseSnackbar}
          severity={alertInfo.severity}
          message={alertInfo.message}
        />
        <CustomLoader open={loading} />

        <Box
          component="form"
          noValidate
          onSubmit={(e) => createPurchaseOrderDetails(e)}
        >
          <Grid container spacing={2}>
            <Grid item xs={12} sm={3}>
              <CustomTextField
                fullWidth
                size="small"
                label="Vendor"
                variant="outlined"
                value={inputValues.vendor || ""}
                disabled
              />
            </Grid>
            <Grid item xs={12} sm={3}>
              <CustomTextField
                fullWidth
                size="small"
                label="Vendor Contact Person"
                variant="outlined"
                value={inputValues.vendor_contact_person || ""}
                disabled
              />
            </Grid>
            <Grid item xs={12} sm={3}>
              <CustomTextField
                fullWidth
                size="small"
                label="Buyer Account"
                variant="outlined"
                value={inputValues.seller_account || ""}
                disabled
              />
            </Grid>

            <Grid item xs={12} sm={3}>
              <CustomTextField
                fullWidth
                size="small"
                label="Payment Terms"
                variant="outlined"
                value={inputValues.payment_terms || ""}
                disabled
              />
            </Grid>
            <Grid item xs={12} sm={3}>
              <CustomTextField
                fullWidth
                size="small"
                label="Delivery Terms"
                variant="outlined"
                value={inputValues.delivery_terms || ""}
                disabled
              />
            </Grid>
            <Grid item xs={12} sm={3}>
              <CustomTextField
                fullWidth
                size="small"
                name="po_no"
                label="Purchase Order No."
                variant="outlined"
                value={inputValues.po_no || ""}
                disabled
              />
            </Grid>
            <Grid item xs={12} sm={3}>
              <CustomTextField
                fullWidth
                name="po_date"
                size="small"
                label="Purchase Order Date"
                variant="outlined"
                value={inputValues.po_date}
                disabled
              />
            </Grid>
            <Grid item xs={12} sm={3}>
              <CustomTextField
                fullWidth
                size="small"
                label="Currency"
                x
                variant="outlined"
                value={inputValues.currency || ""}
                disabled
              />
            </Grid>
            <Grid item xs={12} sm={3}>
              <CustomTextField
                fullWidth
                name="schedule_date"
                size="small"
                label="Schedule Date"
                variant="outlined"
                value={inputValues.schedule_date}
                disabled
              />
            </Grid>
            <Grid item xs={12} sm={3}>
              <CustomTextField
                fullWidth
                size="small"
                label="Issued By"
                variant="outlined"
                value={inputValues.created_by || ""}
                disabled
              />
            </Grid>
            <Grid item xs={12} sm={3}>
              <Switch
                checked={inputValues.close_short}
                onChange={(event) =>
                  setInputValues({
                    ...inputValues,
                    close_short: event.target.checked,
                  })
                }
                name="close_short"
                inputProps={{ "aria-label": "controlled" }}
              />
              <span>Close Short</span>
            </Grid>
            <Grid item xs={12}>
              <Root>
                <Divider>
                  <Chip label="PRODUCT" />
                </Divider>
              </Root>
            </Grid>
            {inputValues.products.map((input, index) => {
              return (
                <React.Fragment key={index}>
                  <Grid item xs={12} sm={3}>
                    {/* <CustomTextField
                      fullWidth
                      size="small"
                      label="Product"
                      variant="outlined"
                      value={input.product || ""}
                      onChange={(event) =>
                        setInputValues({
                          ...inputValues,
                          product: event.target.value,
                        })
                      }
                      disabled={selectedRow.is_package_list}
                    /> */}
                    <CustomAutocomplete
                      fullWidth
                      size="small"
                      label="Product"
                      variant="outlined"
                      value={input.product || ""}
                      options={productList.map((product) => product.name)}
                      onChange={(event, newValue) =>
                        handleProductChange(newValue, index)
                      }
                      disabled={selectedRow && selectedRow.is_package_list}
                    />
                  </Grid>

                  <Grid item xs={12} sm={1}>
                    <CustomTextField
                      fullWidth
                      size="small"
                      label="Unit"
                      variant="outlined"
                      value={input.unit || ""}
                      disabled
                    />
                  </Grid>
                  <Grid item xs={12} sm={2}>
                    <CustomTextField
                      fullWidth
                      name="quantity"
                      type="number"
                      step={input.type_of_unit === "decimal" ? 0.01 : 1}
                      size="small"
                      label="Quantity"
                      variant="outlined"
                      value={
                        input.type_of_unit === "decimal"
                          ? input.quantity
                          : Math.floor(input.quantity)
                      }
                      onChange={(event) => {
                        setInputValues((prev) => {
                          const updatedProducts = [...prev.products];
                          updatedProducts[index] = {
                            ...updatedProducts[index],
                            quantity: event.target.value,
                          };
                          return {
                            ...prev,
                            products: updatedProducts,
                          };
                        });
                      }}
                      disabled={selectedRow && selectedRow.is_package_list}
                    />
                  </Grid>

                  <Grid item xs={12} sm={2}>
                    <CustomTextField
                      fullWidth
                      size="small"
                      type="number"
                      label="Pending Quantity"
                      variant="outlined"
                      value={
                        input.type_of_unit === "decimal"
                          ? input.pending_quantity
                          : Math.floor(input.pending_quantity || "")
                      }
                      disabled
                    />
                  </Grid>
                  <Grid item xs={12} sm={2}>
                    <CustomTextField
                      fullWidth
                      name="rate"
                      size="small"
                      label="Rate"
                      variant="outlined"
                      value={input.rate || ""}
                      onChange={(event) => {
                        setInputValues((prev) => {
                          const updatedProducts = [...prev.products];
                          updatedProducts[index] = {
                            ...updatedProducts[index],
                            rate: event.target.value,
                          };
                          return {
                            ...prev,
                            products: updatedProducts,
                          };
                        });
                      }}
                      disabled={selectedRow.is_package_list}
                    />
                  </Grid>
                  <Grid item xs={12} sm={2}>
                    <CustomTextField
                      fullWidth
                      name="amount"
                      size="small"
                      label="Amount"
                      variant="outlined"
                      value={input.amount || ""}
                      disabled
                    />
                  </Grid>
                  {/* <Grid item xs={12} sm={1} alignContent="right"></Grid> */}
                </React.Fragment>
              );
            })}

            {/* <Grid item xs={12} sm={2} alignContent="right"></Grid> */}
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
  }
);

// Data structure for Payment Terms
// const paymentTerms = [
//   "100% Advance against PI",
//   "50% Advance, Balance Before Dispatch",
//   "30% Advance, Balance Before Dispatch",
//   "15 days with PDC (Post-Dated Check)",
//   "30 days with PDC",
//   "45 days with PDC",
//   "60 days with PDC",
//   "15 days credit",
//   "30 days credit",
//   "45 days credit",
//   "60 days credit",
//   "90 days credit",
//   "120 days credit",
//   "TT in 100% advance against PI",
//   "10% Advance, balance against bill of lading",
//   "15% Advance, balance against bill of lading",
//   "20% Advance, balance against bill of lading",
//   "30% Advance, balance against bill of lading",
//   "50% Advance, balance against bill of lading",
//   "60 days against documents",
//   "90 days against documents",
//   "120 days against documents",
//   "LC at Sight",
//   "LC 45 days",
//   "LC 60 days",
// ];

// Data structure for Delivery Terms
// const deliveryTerms = [
//   "Ex-Work",
//   "FOB (Free On Board)",
//   "CIF (Cost, Insurance, and Freight)",
//   "C & F (Cost and Freight)",
//   "Door Delivery (Prepaid)",
//   "Door Delivery to pay",
//   "Transporter Warehouse (Prepaid)",
//   "Transporter Warehouse to pay",
//   "Add actual freight in invoice",
//   "Ex - warehouse",
// ];
