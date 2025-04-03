import React, { useState, useEffect, useCallback } from "react";
import { Box, Button, Chip, Divider, Grid, styled } from "@mui/material";
import InvoiceServices from "../../../services/InvoiceService";
import { CustomLoader } from "../../../Components/CustomLoader";
import CustomTextField from "../../../Components/CustomTextField";
import CustomAutocomplete from "../../../Components/CustomAutocomplete";
import ProductService from "../../../services/ProductService";
import useDynamicFormFields from "../../../Components/useDynamicFormFields ";
import CustomerServices from "../../../services/CustomerService";
import { useNavigate } from "react-router-dom";
import CustomSnackbar from "../../../Components/CustomerSnackbar";

const tfStyle = {
  "& .MuiButtonBase-root.MuiAutocomplete-clearIndicator": {
    color: "blue",
    visibility: "visible",
  },
};

const Root = styled("div")(({ theme }) => ({
  width: "100%",
  ...theme.typography.body2,
  "& > :not(style) + :not(style)": {
    marginTop: theme.spacing(2),
  },
}));
export const CreateSRF = (props) => {
  const { recordForEdit, setOpenModal, type } = props;
  const [productOption, setProductOption] = useState([]);
  const [filterSellerAcount, setFilterSellerAcount] = useState("");
  const [sellerData, setSellerData] = useState([]);
  const [open, setOpen] = useState(false);
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
        quantity: "",
        unit: "",
        special_instructions: "",
      },
    ],
    productOption,
    true
  );

  const navigate = useNavigate();
  const [alertmsg, setAlertMsg] = useState({
    message: "",
    severity: "",
    open: false,
  });
  const handleClose = () => {
    setAlertMsg({ open: false });
  };
  const getProduct = useCallback(async () => {
    try {
      const res = await ProductService.getProductPriceList();
      setProductOption(res.data.products);
    } catch (err) {
      console.error("error potential", err);
    }
  }, []);

  const getAllSellerAccountsDetails = async () => {
    try {
      const response = await InvoiceServices.getAllPaginateSellerAccountData(
        "all"
      );
      setSellerData(response.data);
    } catch (error) {
      console.log("Error fetching seller account data:", error);
    }
  };

  useEffect(() => {
    getAllSellerAccountsDetails();
    getProduct();
  }, []);
  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validate required fields for "lead" type
    if (
      type === "lead" &&
      (!recordForEdit ||
        !recordForEdit.name ||
        !recordForEdit.state ||
        !recordForEdit.city ||
        !recordForEdit.country ||
        !recordForEdit.pincode ||
        !recordForEdit.address)
    ) {
      setAlertMsg({
        open: true,
        message: "Please fill the customer address!",
        severity: "warning",
      });
      return;
    }

    // Prepare products data
    const modiFyProduct = products.map((pro) => ({
      product: pro.product,
      quantity: pro.quantity,
      special_instructions: pro.special_instructions,
    }));

    // Ensure recordForEdit exists before accessing its properties
    const customerId =
      type === "customer"
        ? recordForEdit
          ? recordForEdit.id
          : null
        : recordForEdit
        ? recordForEdit.lead_id
        : null;

    const payload = {
      unit: filterSellerAcount,
      type: type,
      customer_id: customerId,
      srf_products: modiFyProduct,
    };

    setOpen(true);

    try {
      const res = await CustomerServices.createCustomerSRF(payload);
      // Handle unexpected response data
      if (res.status !== 200 && res.status !== 201) {
        return setAlertMsg({
          open: true,
          message: `Unexpected status: ${res.status}`,
          severity: "error",
        });
      }

      if (res.data.error) {
        return setAlertMsg({
          open: true,
          message: res.data.error,
          severity: "error",
        });
      }

      setAlertMsg({
        open: true,
        message: res.data.message || "SRF created successfully!",
        severity: "success",
      });

      setOpenModal(false);
      navigate("/customer/srf");
    } catch (e) {
      console.error("API Error:", e); // Debugging

      const errorMessage =
        (e.response && e.response.data && e.response.data.message) ||
        (e.response && e.response.data && e.response.data.error) ||
        "Error while creating SRF";

      setAlertMsg({
        open: true,
        message: errorMessage,
        severity: "error",
      });
    } finally {
      setOpen(false);
    }
  };

  return (
    <div>
      <CustomSnackbar
        open={alertmsg.open}
        message={alertmsg.message}
        severity={alertmsg.severity}
        onClose={handleClose}
      />
      <CustomLoader open={open} />
      <Box component="form" noValidate onSubmit={handleSubmit}>
        <Grid container spacing={2}>
          <Grid item xs={12} sm={4}>
            <CustomAutocomplete
              name="seller_account"
              size="small"
              disablePortal
              id="combo-box-demo"
              onChange={(e, value) => setFilterSellerAcount(value.unit)}
              options={sellerData.map((option) => option)}
              getOptionLabel={(option) => option.unit}
              sx={{ minWidth: 300 }}
              label="Seller Account"
              style={tfStyle}
            />
          </Grid>
          <Grid item xs={12} sm={4}>
            <CustomTextField
              fullWidth
              size="small"
              label="Customer"
              variant="outlined"
              value={
                type === "lead"
                  ? recordForEdit.company
                  : recordForEdit.name || ""
              }
              disabled
            />
          </Grid>
          <Grid item xs={12} sm={4}>
            <CustomTextField
              fullWidth
              size="small"
              label="State"
              variant="outlined"
              value={recordForEdit.state || ""}
              disabled
            />
          </Grid>

          <Grid item xs={12} sm={4}>
            <CustomTextField
              fullWidth
              size="small"
              label="City"
              variant="outlined"
              value={recordForEdit.city || ""}
              disabled
            />
          </Grid>
          <Grid item xs={12} sm={4}>
            <CustomTextField
              fullWidth
              size="small"
              label="Country"
              variant="outlined"
              value={recordForEdit.country || ""}
              disabled
            />
          </Grid>
          <Grid item xs={12} sm={4}>
            <CustomTextField
              fullWidth
              size="small"
              label="Pincode"
              variant="outlined"
              value={recordForEdit.pincode || ""}
              disabled
            />
          </Grid>
          <Grid item xs={12} sm={12}>
            <CustomTextField
              fullWidth
              size="small"
              label="Address"
              variant="outlined"
              value={recordForEdit.address || ""}
              disabled
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
                    id={`combo-box-${index}`}
                    onChange={(e, value) =>
                      handleAutocompleteChange(index, e, value)
                    }
                    options={productOption.map(
                      (option) => option.product__name
                    )}
                    getOptionLabel={(option) => option}
                    sx={{ minWidth: 300 }}
                    label="Product Name"
                    style={tfStyle}
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

                <Grid item xs={12} sm={2}>
                  <CustomTextField
                    fullWidth
                    name="special_instructions"
                    size="small"
                    label="Special Instructions"
                    variant="outlined"
                    value={input.special_instructions || ""}
                    onChange={(event) => {
                      handleFormChange(index, event);
                    }}
                  />
                </Grid>

                <Grid item xs={12} sm={2} alignContent="right">
                  {index !== 0 && (
                    <Button
                      disabled={index === 0}
                      onClick={() => removeFields(index)}
                      variant="contained"
                      color="error"
                    >
                      Remove
                    </Button>
                  )}
                </Grid>
              </>
            );
          })}

          <Grid item xs={12} sm={4} alignContent="right">
            <Button onClick={addFields} variant="contained">
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
    </div>
  );
};
