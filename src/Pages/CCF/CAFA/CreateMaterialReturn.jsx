import { Autocomplete, Box, Button, Grid } from "@mui/material";
import React, { useEffect, useState } from "react";
import { styled } from "@mui/material/styles";
import Divider from "@mui/material/Divider";
import Chip from "@mui/material/Chip";
import { CustomLoader } from "../../../Components/CustomLoader";
import CustomTextField from "../../../Components/CustomTextField";
import InvoiceServices from "../../../services/InvoiceService";
import InventoryServices from "../../../services/InventoryService";
import CustomSnackbar from "../../../Components/CustomerSnackbar";
import { useNavigate } from "react-router-dom";

const Root = styled("div")(({ theme }) => ({
  width: "100%",
  ...theme.typography.body2,
  "& > :not(style) + :not(style)": {
    marginTop: theme.spacing(2),
  },
}));

export const CreateMaterialReturn = (props) => {
  const { recordForEdit } = props;
  console.log(recordForEdit);
  const [open, setOpen] = useState(false);
  const [salesReturnData, setSalesReturnData] = useState({});
  const [alertmsg, setAlertMsg] = useState({
    message: "",
    severity: "",
    open: false,
  });
  const navigate = useNavigate();
  const getsearchByCompany = async () => {
    if (!recordForEdit || !recordForEdit.ccf_details) {
      console.log("No record data available");
      return; // Prevents the API call if no data
    }

    try {
      setOpen(true);

      const complaintNo = recordForEdit.ccf_details.complain_no || null;

      if (complaintNo) {
        const response = await InvoiceServices.getSalesReturnByCCF(complaintNo);
        setSalesReturnData(response.data);
        console.log("res", response.data);
      } else {
        console.log("No complaint number provided");
      }
    } catch (error) {
      console.error("Error:", error);
    } finally {
      setOpen(false);
    }
  };

  // ✅ UseEffect with Dependency Array
  useEffect(() => {
    if (recordForEdit) {
      getsearchByCompany();
    }
  }, [recordForEdit]); // Added `recordForEdit` as a dependency

  const createSalesInvoiceDetails = async (e) => {
    e.preventDefault();
    setOpen(true);

    try {
      // ✅ Destructuring for readability
      const customer = salesReturnData.customer_details || {};
      const unit = salesReturnData.unit_details || {};
      const buyer = salesReturnData.buyer_details || {};
      const ccf = recordForEdit.ccf_details || {};
      const products = salesReturnData.ccf_products || [];

      const formatProductData = products.map((prod) => {
        return {
          product: prod.product__name,
          rate: prod.rate,
          cost: prod.cost,
          amount: prod.amount,
          quantity: prod.quantity,
        };
      });
      // ✅ Clean request object without optional chaining
      const req = {
        invoice_type: "Sales Return",
        capa: recordForEdit.id,
        sales_invoices: ccf.invoices ? ccf.invoices : "",
        gst_number: customer.gst_number ? customer.gst_number : "",
        pan_number: customer.pan_number ? customer.pan_number : "",
        address: customer.address ? customer.address : "",
        state: customer.state ? customer.state : "",
        city: customer.city ? customer.city : "",
        pincode: customer.pincode ? customer.pincode : "",
        country: buyer.country ? buyer.country : "",
        supplier_name: ccf.customer ? ccf.customer : "",
        seller_address: unit.seller_address ? unit.seller_address : "",
        seller_city: unit.seller_city ? unit.seller_city : "",
        seller_state: unit.seller_state ? unit.seller_state : "",
        seller_gst: unit.seller_gst ? unit.seller_gst : "",
        seller_email: unit.seller_email ? unit.seller_email : "",
        seller_pan: unit.seller_pan ? unit.seller_pan : "",
        seller_pincode: unit.seller_pincode ? unit.seller_pincode : "",
        seller_contact: unit.seller_contact ? unit.seller_contact : "",
        seller_state_code: unit.seller_state_code ? unit.seller_state_code : "",
        seller_unit: ccf.unit ? ccf.unit : "",
        products_data: formatProductData.length > 0 ? formatProductData : [],
        user: salesReturnData.user,
      };

      // ✅ API call with proper error handling
      const response = await InventoryServices.createSalesReturn(req);
      if (response.status === 201 || response.status === 200) {
        const successMessage =
          response.data && response.data.message
            ? response.data.message
            : "Sales Return Created successfully";
        setAlertMsg({
          message: successMessage,
          severity: "success",
          open: true,
        });
      }

      setTimeout(() => {
        navigate("/inventory/sales-return");
      }, 400);
    } catch (error) {
      const successMessage = error.response
        ? error.response.data.message
        : "Error creating sales return:";

      setAlertMsg({
        message: successMessage,
        severity: "error",
        open: true,
      });
    } finally {
      setOpen(false); // ✅ Always close loader in finally block
    }
  };

  return (
    <>
      <CustomSnackbar
        open={alertmsg.open}
        message={alertmsg.message}
        severity={alertmsg.severity}
      />
      <CustomLoader open={open} />
      <Box component="form" noValidate onSubmit={createSalesInvoiceDetails}>
        <Grid container spacing={2}>
          <Grid item xs={12} sm={3}>
            <CustomTextField
              fullWidth
              disabled
              size="small"
              label="Seller Account"
              variant="outlined"
              value={
                recordForEdit && recordForEdit.ccf_details.unit
                  ? recordForEdit.ccf_details.unit
                  : ""
              }
            />
          </Grid>
          <Grid item xs={12} sm={3}>
            <CustomTextField
              fullWidth
              disabled
              size="small"
              label="Customer"
              variant="outlined"
              value={
                recordForEdit && recordForEdit.ccf_details.customer
                  ? recordForEdit.ccf_details.customer
                  : ""
              }
            />
          </Grid>
          <Grid item xs={12} sm={3}>
            <Autocomplete
              fullWidth
              multiple
              size="small"
              disablePortal
              id="combo-box-demo"
              options={
                recordForEdit && recordForEdit.ccf_details.invoices
                  ? recordForEdit.ccf_details.invoices
                  : ""
              }
              value={
                recordForEdit && recordForEdit.ccf_details.invoices
                  ? recordForEdit.ccf_details.invoices
                  : ""
              }
              getOptionLabel={(option) => option || ""}
              renderInput={(params) => (
                <CustomTextField {...params} label="Invoice No" />
              )}
            />
          </Grid>
          <Grid item xs={12} sm={3}>
            <CustomTextField
              fullWidth
              disabled
              multiline
              size="small"
              label="Shipping Address"
              variant="outlined"
              value={
                salesReturnData &&
                salesReturnData.customer_details &&
                salesReturnData.customer_details.address
                  ? salesReturnData.customer_details.address
                  : ""
              }
            />
          </Grid>

          <Grid item xs={12} sm={3}>
            <CustomTextField
              fullWidth
              disabled
              size="small"
              label="Shipping State"
              variant="outlined"
              value={
                salesReturnData &&
                salesReturnData.customer_details &&
                salesReturnData.customer_details.state
                  ? salesReturnData.customer_details.state
                  : ""
              }
            />
          </Grid>

          <Grid item xs={12} sm={3}>
            <CustomTextField
              fullWidth
              disabled
              size="small"
              label="Shipping City"
              variant="outlined"
              value={
                salesReturnData &&
                salesReturnData.customer_details &&
                salesReturnData.customer_details.city
                  ? salesReturnData.customer_details.city
                  : ""
              }
            />
          </Grid>

          <Grid item xs={12} sm={3}>
            <CustomTextField
              fullWidth
              disabled
              size="small"
              label="Shipping Pincode"
              variant="outlined"
              value={
                salesReturnData &&
                salesReturnData.customer_details &&
                salesReturnData.customer_details.pincode
                  ? salesReturnData.customer_details.pincode
                  : ""
              }
            />
          </Grid>

          <Grid item xs={12}>
            <Root>
              <Divider>
                <Chip label="PRODUCT" />
              </Divider>
            </Root>
          </Grid>
          {salesReturnData.ccf_products &&
            salesReturnData.ccf_products.length > 0 &&
            salesReturnData.ccf_products.map((input, index) => {
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
                      disabled
                      name="product"
                      size="small"
                      label="Product"
                      variant="outlined"
                      value={input.product}
                    />
                  </Grid>
                  <Grid item xs={12} sm={3}>
                    <CustomTextField
                      fullWidth
                      name="quantity"
                      size="small"
                      label="Quantity"
                      variant="outlined"
                      value={input.quantity}
                    />
                  </Grid>
                  <Grid item xs={12} sm={3}>
                    <CustomTextField
                      fullWidth
                      disabled
                      name="rate"
                      size="small"
                      label="Rate"
                      variant="outlined"
                      value={input.rate}
                    />
                  </Grid>
                  <Grid item xs={12} sm={3}>
                    <CustomTextField
                      fullWidth
                      disabled
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
