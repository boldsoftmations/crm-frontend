import React, { useState, useEffect, useCallback } from "react";
import { Box, Button, Grid } from "@mui/material";
import { styled } from "@mui/material/styles";
import Chip from "@mui/material/Chip";
import Divider from "@mui/material/Divider";
import useDynamicFormFields from "./../../../Components/useDynamicFormFields ";
import InvoiceServices from "../../../services/InvoiceService";
import { CustomLoader } from "../../../Components/CustomLoader";
import CustomAutocomplete from "./../../../Components/CustomAutocomplete";
import CustomTextField from "../../../Components/CustomTextField";
import InventoryServices from "../../../services/InventoryService";
import CustomSnackbar from "../../../Components/CustomerSnackbar";

const Root = styled("div")(({ theme }) => ({
  width: "100%",
  ...theme.typography.body2,
  "& > :not(style) + :not(style)": {
    marginTop: theme.spacing(2),
  },
}));

const values = {
  someDate: new Date().toISOString().substring(0, 10),
};

const BranchInvoicesCreate = ({ getSalesInvoiceDetails, setOpenPopup }) => {
  const [productOption, setProductOption] = useState([]);
  const [alertmsg, setAlertMsg] = useState({
    message: "",
    severity: "",
    open: false,
  });

  const handleClose = () => {
    setAlertMsg({ open: false });
  };
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
        rate: "",
      },
    ],
    productOption,
    true,
  );
  const [open, setOpen] = useState(false);
  const [inputValue, setInputValue] = useState({
    from_unit: "",
    to_unit: "",
    generation_date: values.someDate,
    transport_cost: "",
    transporter_name: "",
  });
  const [sellerData, setSellerData] = useState([]);

  const handleInputChange = (event) => {
    const { name, value } = event.target;
    setInputValue({ ...inputValue, [name]: value });
  };

  const handleAutocompleteChangeForUnits = (name, value) => {
    const { unit } = value;
    if (inputValue.from_unit && inputValue.from_unit === unit) {
      setAlertMsg({
        message: "From unit and To Units should not be same!",
        severity: "warning",
        open: true,
      });
      return;
    }
    setInputValue({ ...inputValue, [name]: value ? unit : "" });
  };

  const getProduct = useCallback(async () => {
    try {
      const response = await InventoryServices.getAllConsStoresInventoryData();
      console.log("response product", response.data);
      setProductOption(response.data);
    } catch (err) {
      console.error("error potential", err);
    }
  }, []);

  const getAllSellerAccountsDetails = async () => {
    try {
      const response =
        await InvoiceServices.getAllPaginateSellerAccountData("all");
      setSellerData(response.data);
    } catch (error) {
      console.log("Error fetching seller account data:", error);
      console.log("error");
    }
  };

  useEffect(() => {
    getAllSellerAccountsDetails();
    getProduct();
  }, []);

  const createBranchInvoiceDetails = async (e) => {
    e.preventDefault();
    const formattedProducts = products.map((prod) => ({
      product: prod.product,
      quantity: prod.quantity,
      rate: parseFloat(prod.rate),
    }));

    const payload = {
      invoice_type: "unit",
      generation_date: inputValue.generation_date || values.someDate,
      to_unit: inputValue.to_unit,
      from_unit: inputValue.from_unit,
      transporter_name: inputValue.transporter_name,
      transport_cost: inputValue.transport_cost || 0,
      products: formattedProducts, // Now only sending product and quantity
    };

    try {
      setOpen(true);
      const response = await InvoiceServices.createBranchinvoiceData(payload);
      const successMessage =
        response.data.message || "Branch Invoice created successfully!";
      setAlertMsg({
        message: successMessage,
        severity: "success",
        open: true,
      });
      setTimeout(() => {
        setOpenPopup(false);
        getSalesInvoiceDetails();
      }, 400);
    } catch (error) {
      setAlertMsg({
        message: error.message || "Error: creating Branch Invoice!",
        severity: "error",
        open: true,
      });
      console.error("Creating BI error", error);
    } finally {
      setOpen(false); // Close the loading indicator
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

      <Box
        component="form"
        noValidate
        onSubmit={(e) => createBranchInvoiceDetails(e)}
      >
        <Grid container spacing={2}>
          <Grid item xs={12} sm={4}>
            <CustomAutocomplete
              name="from_unit"
              size="small"
              disablePortal
              id="combo-box-demo"
              onChange={(event, value) =>
                handleAutocompleteChangeForUnits("from_unit", value)
              }
              options={sellerData}
              getOptionLabel={(option) => option.unit}
              sx={{ minWidth: 300 }}
              label="From Unit"
            />
          </Grid>
          <Grid item xs={12} sm={4}>
            <CustomAutocomplete
              name="to_unit"
              size="small"
              disablePortal
              id="combo-box-demo"
              onChange={(event, value) =>
                handleAutocompleteChangeForUnits("to_unit", value)
              }
              options={sellerData}
              getOptionLabel={(option) => option.unit}
              sx={{ minWidth: 300 }}
              label="To Unit"
              error={
                inputValue.from_unit === inputValue.to_unit
                  ? "Cannot be same unit"
                  : ""
              }
            />
          </Grid>

          <Grid item xs={12} sm={4}>
            <CustomTextField
              fullWidth
              type={"date"}
              name="generation_date"
              size="small"
              label="Generation Date"
              variant="outlined"
              value={inputValue.generation_date || values.someDate}
              onChange={handleInputChange}
              InputLabelProps={{
                shrink: true,
              }}
            />
          </Grid>
          <Grid item xs={12} sm={4}>
            <CustomTextField
              fullWidth
              name="transport_cost"
              size="small"
              label="Transport Cost"
              variant="outlined"
              value={inputValue.transport_cost}
              onChange={handleInputChange}
            />
          </Grid>
          <Grid item xs={12} sm={4}>
            <CustomTextField
              fullWidth
              name="transporter_name"
              size="small"
              label="Transporter Name"
              variant="outlined"
              value={inputValue.transporter_name}
              onChange={handleInputChange}
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
              <React.Fragment key={index}>
                <Grid item xs={12} sm={4}>
                  <CustomAutocomplete
                    name="product"
                    size="small"
                    disablePortal
                    id="combo-box-demo"
                    onChange={(event, value) =>
                      handleAutocompleteChange(index, event, value)
                    }
                    options={productOption.map(
                      (option) => option.product__name,
                    )}
                    getOptionLabel={(option) => option}
                    sx={{ minWidth: 300 }}
                    label="Product Name"
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
                    onChange={(event) => handleFormChange(index, event)}
                  />
                </Grid>
                <Grid item xs={12} sm={3}>
                  <CustomTextField
                    fullWidth
                    name="rate"
                    size="small"
                    label="Rate"
                    variant="outlined"
                    value={input.rate}
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
              </React.Fragment>
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
    </div>
  );
};

export default BranchInvoicesCreate;
