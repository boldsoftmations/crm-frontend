import {
  Autocomplete,
  Box,
  Button,
  Chip,
  Divider,
  Grid,
  IconButton,
  Snackbar,
  TextField,
} from "@mui/material";
import React, { useEffect, useState } from "react";
import { CustomLoader } from "../../../Components/CustomLoader";
import CloseIcon from "@mui/icons-material/Close";

import InventoryServices from "../../../services/InventoryService";
import ProductService from "../../../services/ProductService";
import { styled } from "@mui/material/styles";
import { useSelector } from "react-redux";

const Root = styled("div")(({ theme }) => ({
  width: "100%",
  ...theme.typography.body2,
  "& > :not(style) + :not(style)": {
    marginTop: theme.spacing(2),
  },
}));

export const PackingListCreate = (props) => {
  const { setOpenPopup, getAllPackingListDetails } = props;
  const [inputValue, setInputValue] = useState([]);
  const [open, setOpen] = useState(false);
  const [vendorOption, setVendorOption] = useState([]);
  const [vendor, setVendor] = useState("");
  const [productOption, setProductOption] = useState([]);
  const [selectedSellerData, setSelectedSellerData] = useState("");
  const data = useSelector((state) => state.auth);
  const sellerData = data.sellerAccount;
  const today = new Date().toISOString().slice(0, 10); // Get current date in YYYY-MM-DD format
  const [error, setError] = useState(null);
  const [products, setProducts] = useState([
    {
      product: "",
      quantity: "",
      unit: "",
    },
  ]);
  const handleInputChange = (event) => {
    const { name, value } = event.target;
    setInputValue({ ...inputValue, [name]: value });
  };

  const handleAutocompleteChange = (index, event, value) => {
    let data = [...products];
    const productObj = productOption.find((item) => item.name === value);
    console.log("productObj", productObj);
    data[index]["product"] = value;
    data[index]["unit"] = productObj ? productObj.unit : "";
    setProducts(data);
  };

  const handleFormChange = (index, event) => {
    const selectedValue = event.target.value
      ? event.target.value
      : event.target.textContent;
    const data = [...products];
    data[index][event.target.name ? event.target.name : "product"] =
      selectedValue;

    // Check if the selected value already exists in the array of selected values
    const isValueDuplicate = data.some(
      (item, i) => item.product === selectedValue && i !== index
    );

    if (isValueDuplicate) {
      // If the selected value already exists, show an error message or handle it as desired
      setError(`Selected ${selectedValue} already exists!`);
    } else {
      // If the selected value is unique, update the products array as usual
      setProducts(data);
    }
  };

  const addFields = () => {
    let newfield = {
      product: "",
      quantity: "",
      unit: "",
    };
    setProducts([...products, newfield]);
  };

  const removeFields = (index) => {
    let data = [...products];
    data.splice(index, 1);
    setProducts(data);
  };

  useEffect(() => {
    getProduct();
  }, []);

  const getProduct = async () => {
    try {
      setOpen(true);
      const res = await ProductService.getAllProduct();
      setProductOption(res.data);
      setOpen(false);
    } catch (err) {
      console.error("error potential", err);
      setOpen(false);
    }
  };

  const fetchVendorOptions = async (e) => {
    try {
      e.preventDefault();
      setOpen(true);
      console.log("inputValue.vendor_name", inputValue.vendor_name);
      const response = await InventoryServices.getAllSearchVendorData(
        inputValue.vendor_name
      );
      setVendorOption(response.data.results);
      console.log("after api");
      setOpen(false);
    } catch (err) {
      setOpen(false);
      console.log("err all vendor", err);
    }
  };

  const createPackingListDetails = async (e) => {
    try {
      e.preventDefault();
      setOpen(true);
      const req = {
        packing_list_no: inputValue.packing_list_no, //Normal text field
        invoice_date: inputValue.invoice_date ? inputValue.invoice_date : today,
        vendor: vendor.name,
        seller_account: selectedSellerData,
        products: products,
      };
      await InventoryServices.createPackingListData(req);
      setOpenPopup(false);
      getAllPackingListDetails();
      setOpen(false);
    } catch (error) {
      console.log("createing Packing list error", error);
      setOpen(false);
    }
  };

  const handleCloseSnackbar = () => {
    setError(null);
  };

  return (
    <div>
      <CustomLoader open={open} />

      <Box
        component="form"
        noValidate
        onSubmit={(e) => createPackingListDetails(e)}
      >
        <Snackbar
          open={Boolean(error)}
          onClose={handleCloseSnackbar}
          message={error}
          anchorOrigin={{ vertical: "top", horizontal: "center" }}
          action={
            <IconButton
              aria-label="close"
              color="inherit"
              sx={{ p: 0.5 }}
              onClick={handleCloseSnackbar}
            >
              <CloseIcon />
            </IconButton>
          }
        />
        <Grid container spacing={2}>
          <Grid item xs={12} sm={3}>
            <TextField
              sx={{ minWidth: "8rem" }}
              name="vendor_name"
              size="small"
              label="search By Vendor Name"
              variant="outlined"
              onChange={handleInputChange}
              value={inputValue.vendor_name}
            />
            <Button onClick={(e) => fetchVendorOptions(e)} variant="contained">
              Submit
            </Button>
          </Grid>
          {vendorOption && vendorOption.length > 0 && (
            <Grid item xs={12} sm={3}>
              <Autocomplete
                name="vendor"
                size="small"
                disablePortal
                id="combo-box-demo"
                onChange={(event, value) => setVendor(value)}
                options={vendorOption}
                getOptionLabel={(option) => option.name}
                sx={{ minWidth: 300 }}
                renderInput={(params) => (
                  <TextField {...params} label="Vendor" />
                )}
              />
            </Grid>
          )}
          <Grid item xs={12} sm={3}>
            <Autocomplete
              name="seller_account"
              size="small"
              disablePortal
              id="combo-box-demo"
              onChange={(event, value) => setSelectedSellerData(value)}
              options={sellerData.map((option) => option.unit)}
              getOptionLabel={(option) => option}
              sx={{ minWidth: 300 }}
              renderInput={(params) => (
                <TextField {...params} label="Seller Account" />
              )}
            />
          </Grid>
          <Grid item xs={12} sm={3}>
            <TextField
              fullWidth
              size="small"
              name="packing_list_no"
              label="Invoice No."
              variant="outlined"
              value={inputValue.packing_list_no}
              onChange={handleInputChange}
            />
          </Grid>
          <Grid item xs={12} sm={3}>
            <TextField
              fullWidth
              type="date"
              name="invoice_date"
              size="small"
              label="Invoice Date"
              variant="outlined"
              value={inputValue.invoice_date ? inputValue.invoice_date : today}
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
              <>
                <Grid key={index} item xs={12} sm={4}>
                  <Autocomplete
                    name="product"
                    size="small"
                    disablePortal
                    id="combo-box-demo"
                    value={input.product ? input.product : ""}
                    onChange={(event, value) =>
                      handleAutocompleteChange(index, event, value)
                    }
                    options={productOption.map((option) => option.name)}
                    getOptionLabel={(option) => option}
                    sx={{ minWidth: 300 }}
                    renderInput={(params) => (
                      <TextField {...params} label="Product Name" />
                    )}
                  />
                </Grid>
                <Grid item xs={12} sm={3}>
                  <TextField
                    fullWidth
                    name="unit"
                    size="small"
                    label="Unit"
                    variant="outlined"
                    value={input.unit ? input.unit : ""}
                  />
                </Grid>
                <Grid item xs={12} sm={3}>
                  <TextField
                    fullWidth
                    name="quantity"
                    size="small"
                    label="Quantity"
                    variant="outlined"
                    value={input.quantity}
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

          <Grid item xs={12} sm={2} alignContent="right">
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
