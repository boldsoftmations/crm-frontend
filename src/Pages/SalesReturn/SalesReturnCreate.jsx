import { Box, Button, Grid } from "@mui/material";
import React, { useEffect, useState } from "react";
import { styled } from "@mui/material/styles";
import Divider from "@mui/material/Divider";
import Chip from "@mui/material/Chip";
import { CustomLoader } from "../../Components/CustomLoader";
import CustomTextField from "../../Components/CustomTextField";
import InventoryServices from "../../services/InventoryService";
import { useNotificationHandling } from "../../Components/useNotificationHandling ";
import { MessageAlert } from "../../Components/MessageAlert";

const Root = styled("div")(({ theme }) => ({
  width: "100%",
  ...theme.typography.body2,
  "& > :not(style) + :not(style)": {
    marginTop: theme.spacing(2),
  },
}));

export const SalesReturnCreate = (props) => {
  const { idForEdit, setOpenPopup, getSalesInvoiceDetails } = props;
  const [open, setOpen] = useState(false);
  const [salesReturnData, setSalesReturnData] = useState();
  const [products, setProducts] = useState([
    {
      product: "",
      quantity: "",
      rate: "",
      amount: "",
    },
  ]);
  const { handleSuccess, handleError, handleCloseSnackbar, alertInfo } =
    useNotificationHandling();

  const handleFormChange = (index, event) => {
    let data = [...products];
    data[index][event.target.name] = parseFloat(event.target.value) || 0;
    setProducts(data);
  };

  const removeFields = (index) => {
    let data = [...products];
    data.splice(index, 1);
    setProducts(data);
  };

  useEffect(() => {
    getSalesReturnDatabyInvoiceNo();
  }, [idForEdit]);

  const getSalesReturnDatabyInvoiceNo = async () => {
    try {
      setOpen(true);
      const response = await InventoryServices.getSalesReturnByIDData(
        idForEdit
      );

      setSalesReturnData(response.data);
      setProducts(response.data.products_si);
      setOpen(false);
    } catch (error) {
      setOpen(false);
      console.log("error", error);
    }
  };
  console.log("salesreturn", salesReturnData);
  const createSalesInvoiceDetails = async (e) => {
    try {
      e.preventDefault();

      // Map through the products to include only specific details
      const formattedProducts = products.map((product) => ({
        product: product.product,
        quantity: product.quantity,
        rate: product.rate,
        amount: product.rate * product.quantity,
      }));

      const req = {
        invoice_type: "Sales Return",
        sales_invoive_no: salesReturnData.invoice_no,
        gst_number: salesReturnData.buyer_gst,
        pan_number: salesReturnData.buyer_pan,
        state: salesReturnData.billing_state,
        address: salesReturnData.billing_address,
        city: salesReturnData.billing_city,
        pincode: salesReturnData.billing_pincode,
        supplier_name: salesReturnData.company,
        country: salesReturnData.billing_country,
        name:
          salesReturnData && salesReturnData.seller_details
            ? salesReturnData.seller_details.name
            : "",
        seller_address: salesReturnData.seller_address,
        seller_city: salesReturnData.seller_city,
        seller_state: salesReturnData.seller_state,
        seller_gst: salesReturnData.seller_gst,
        seller_email: salesReturnData.seller_email,
        seller_pan: salesReturnData.seller_pan,
        seller_pincode: salesReturnData.seller_pincode,
        seller_contact: salesReturnData.seller_contact,
        seller_state_code: salesReturnData.seller_state_code,
        seller_unit: salesReturnData.seller_unit,
        products_data: formattedProducts,
      };

      setOpen(true);

      const response = await InventoryServices.createSalesReturn(req);
      const successMessage =
        response.data.message || "Sales Return Created successfully";
      handleSuccess(successMessage);

      setTimeout(() => {
        setOpenPopup(false);
        getSalesInvoiceDetails();
      }, 300);
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
        onSubmit={(e) => createSalesInvoiceDetails(e)}
      >
        <Grid container spacing={2}>
          <Grid item xs={12} sm={3}>
            <CustomTextField
              fullWidth
              size="small"
              label="Seller Unit"
              variant="outlined"
              value={salesReturnData ? salesReturnData.seller_unit : ""}
            />
          </Grid>
          <Grid item xs={12} sm={3}>
            <CustomTextField
              fullWidth
              size="small"
              label="Invoice No"
              variant="outlined"
              value={salesReturnData ? salesReturnData.invoice_no : ""}
            />
          </Grid>
          <Grid item xs={12} sm={3}>
            <CustomTextField
              fullWidth
              size="small"
              label="Supplier Name"
              variant="outlined"
              value={
                salesReturnData && salesReturnData.seller_details
                  ? salesReturnData.seller_details.name
                  : ""
              }
            />
          </Grid>
          <Grid item xs={12} sm={3}>
            <CustomTextField
              fullWidth
              name="seller_state"
              size="small"
              label="Seller State"
              variant="outlined"
              value={salesReturnData ? salesReturnData.seller_state : ""}
            />
          </Grid>
          <Grid item xs={12} sm={3}>
            <CustomTextField
              fullWidth
              name="company"
              size="small"
              label="Company"
              variant="outlined"
              value={salesReturnData ? salesReturnData.company : ""}
            />
          </Grid>
          <Grid item xs={12} sm={3}>
            <CustomTextField
              fullWidth
              multiline
              name="shipping_address"
              size="small"
              label="Shipping Address"
              variant="outlined"
              value={salesReturnData ? salesReturnData.shipping_address : ""}
            />
          </Grid>
          <Grid item xs={12} sm={3}>
            <CustomTextField
              fullWidth
              multiline
              name="shipping_state"
              size="small"
              label="Shipping State"
              variant="outlined"
              value={salesReturnData ? salesReturnData.shipping_state : ""}
            />
          </Grid>
          <Grid item xs={12} sm={3}>
            <CustomTextField
              fullWidth
              multiline
              name="shipping_city"
              size="small"
              label="Shipping City"
              variant="outlined"
              value={salesReturnData ? salesReturnData.shipping_city : ""}
            />
          </Grid>
          <Grid item xs={12} sm={3}>
            <CustomTextField
              fullWidth
              multiline
              name="shipping_pincode"
              size="small"
              label="Shipping Pincode"
              variant="outlined"
              value={salesReturnData ? salesReturnData.shipping_pincode : ""}
            />
          </Grid>
          <Grid item xs={12} sm={3}>
            <CustomTextField
              fullWidth
              multiline
              name="billing_address"
              size="small"
              label="Billing Address"
              variant="outlined"
              value={salesReturnData ? salesReturnData.billing_address : ""}
            />
          </Grid>
          <Grid item xs={12} sm={3}>
            <CustomTextField
              fullWidth
              multiline
              name="billing_state"
              size="small"
              label="Billing State"
              variant="outlined"
              value={salesReturnData ? salesReturnData.billing_state : ""}
            />
          </Grid>
          <Grid item xs={12} sm={3}>
            <CustomTextField
              fullWidth
              multiline
              name="billing_city"
              size="small"
              label="Billing City"
              variant="outlined"
              value={salesReturnData ? salesReturnData.billing_city : ""}
            />
          </Grid>
          <Grid item xs={12} sm={3}>
            <CustomTextField
              fullWidth
              multiline
              name="billing_pincode"
              size="small"
              label="Billing Pincode"
              variant="outlined"
              value={salesReturnData ? salesReturnData.billing_pincode : ""}
            />
          </Grid>

          <Grid item xs={12}>
            <Root>
              <Divider>
                <Chip label="PRODUCT" />
              </Divider>
            </Root>
          </Grid>
          {products &&
            products.length > 0 &&
            products.map((input, index) => {
              if (Number(input.pending_quantity) <= 0) {
                // If pending_quantity is not greater than 0, do not render this product
                return null;
              }

              const amount =
                (Number(input.quantity) || 0) * (Number(input.rate) || 0);

              return (
                <React.Fragment key={index}>
                  {" "}
                  {/* Use React.Fragment with a key for each item */}
                  <Grid item xs={12} sm={3}>
                    <CustomTextField
                      fullWidth
                      name="product"
                      size="small"
                      label="Product"
                      variant="outlined"
                      value={input.product}
                    />
                  </Grid>
                  <Grid item xs={12} sm={2}>
                    <CustomTextField
                      fullWidth
                      name="quantity"
                      size="small"
                      label="Quantity"
                      variant="outlined"
                      value={input.quantity}
                      onChange={(event) => handleFormChange(index, event)}
                      error={input.pending_quantity < input.quantity}
                      helperText={
                        input.pending_quantity < input.quantity
                          ? "Quantity must be less than or equal to pending quantity"
                          : ""
                      }
                    />
                  </Grid>
                  <Grid item xs={12} sm={2}>
                    <CustomTextField
                      fullWidth
                      name="rate"
                      size="small"
                      label="Rate"
                      variant="outlined"
                      value={input.rate}
                    />
                  </Grid>
                  <Grid item xs={12} sm={2}>
                    <CustomTextField
                      fullWidth
                      name="amount"
                      size="small"
                      label="Amount"
                      variant="outlined"
                      value={amount.toFixed(2)}
                      InputProps={{
                        readOnly: true,
                      }}
                    />
                  </Grid>
                  <Grid item xs={12} sm={1}>
                    <Button
                      onClick={() => removeFields(index)}
                      variant="contained"
                    >
                      Remove
                    </Button>
                  </Grid>
                </React.Fragment>
              );
            })}
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
};
