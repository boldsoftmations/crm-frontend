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
import InventoryServices from "../../../services/InventoryService";
import ProductService from "../../../services/ProductService";
import { styled } from "@mui/material/styles";
import { useSelector } from "react-redux";
import CloseIcon from "@mui/icons-material/Close";
const Root = styled("div")(({ theme }) => ({
  width: "100%",
  ...theme.typography.body2,
  "& > :not(style) + :not(style)": {
    marginTop: theme.spacing(2),
  },
}));

export const PackijngListUpdate = (props) => {
  const { setOpenPopup, getAllPackingListDetails, idForEdit } = props;
  const [PackingListDataByID, setPackingListDataByID] = useState([]);
  const [open, setOpen] = useState(false);
  const [vendorOption, setVendorOption] = useState([]);
  const [productOption, setProductOption] = useState([]);
  const [selectedSellerData, setSelectedSellerData] = useState(null);
  const [vendor, setVendor] = useState("");
  const data = useSelector((state) => state.auth);
  const sellerData = data.sellerAccount;
  const today = new Date().toISOString().slice(0, 10); // Get current date in YYYY-MM-DD format
  const [error, setError] = useState(null);
  const [products, setProducts] = useState([
    {
      product: "",
      quantity: "",
    },
  ]);
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
    };
    setProducts([...products, newfield]);
  };

  const removeFields = (index) => {
    let data = [...products];
    data.splice(index, 1);
    setProducts(data);
  };

  const handleInputChange = (event) => {
    const { name, value } = event.target;
    setPackingListDataByID({ ...PackingListDataByID, [name]: value });
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
      console.log("inputValue.vendor_name", PackingListDataByID.vendor_name);
      const response = await InventoryServices.getAllSearchVendorData(
        PackingListDataByID.vendor_name
      );
      setVendorOption(response.data.results);
      console.log("after api");
      setOpen(false);
    } catch (err) {
      setOpen(false);
      console.log("err all vendor", err);
    }
  };

  useEffect(() => {
    if (idForEdit) getAllPackingListDetailsByID();
  }, [idForEdit]);

  const getAllPackingListDetailsByID = async () => {
    try {
      setOpen(true);
      const response = await InventoryServices.getPackingListDataById(
        idForEdit
      );

      setPackingListDataByID(response.data);
      setSelectedSellerData(response.data.seller_account);
      var arr = response.data.products.map((fruit) => ({
        product: fruit.product,
        quantity: fruit.quantity,
      }));
      setProducts(arr);

      setOpen(false);
    } catch (err) {
      setOpen(false);
      console.log("company data by id error", err);
    }
  };

  const updateLeadProformaInvoiceDetails = async (e) => {
    try {
      e.preventDefault();
      setOpen(true);
      const req = {
        packing_list_no: PackingListDataByID.packing_list_no, //Normal text field
        invoice_date: PackingListDataByID.invoice_date
          ? PackingListDataByID.invoice_date
          : today,
        vendor: vendor.name ? vendor.name : PackingListDataByID.vendor,
        seller_account: selectedSellerData,
        products: products,
      };
      await InventoryServices.updatePackingListData(idForEdit, req);

      setOpenPopup(false);
      getAllPackingListDetails();
      setOpen(false);
    } catch (err) {
      console.log("err", err);
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
        onSubmit={(e) => updateLeadProformaInvoiceDetails(e)}
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
              fullWidth
              size="small"
              name="vendor"
              label="Vendor"
              variant="outlined"
              value={
                PackingListDataByID.vendor ? PackingListDataByID.vendor : ""
              }
              onChange={handleInputChange}
            />
          </Grid>
          <Grid item xs={12} sm={3}>
            <TextField
              sx={{ minWidth: "8rem" }}
              name="vendor_name"
              size="small"
              label="search By vendor_name"
              variant="outlined"
              onChange={handleInputChange}
              value={PackingListDataByID.vendor_name}
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
                sx={{ minWidth: 100 }}
                renderInput={(params) => (
                  <TextField {...params} label="Update Vendor" />
                )}
              />
            </Grid>
          )}

          <Grid item xs={12} sm={3}>
            <TextField
              fullWidth
              size="small"
              name="packing_list_no"
              label="Packing List No."
              variant="outlined"
              value={
                PackingListDataByID.packing_list_no
                  ? PackingListDataByID.packing_list_no
                  : ""
              }
              onChange={handleInputChange}
            />
          </Grid>
          <Grid item xs={12} sm={3}>
            <Autocomplete
              name="seller_account"
              size="small"
              disablePortal
              id="combo-box-demo"
              value={selectedSellerData}
              onChange={(event, value) => setSelectedSellerData(value)}
              options={sellerData.map((option) => option.state)}
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
              type="date"
              name="invoice_date"
              size="small"
              label="Invoice Date"
              variant="outlined"
              value={
                PackingListDataByID.invoice_date
                  ? PackingListDataByID.invoice_date
                  : today
              }
              onChange={handleInputChange}
              inputProps={{ max: today }}
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
                    onChange={(event, value) => handleFormChange(index, event)}
                    options={productOption.map((option) => option.name)}
                    getOptionLabel={(option) => option}
                    sx={{ minWidth: 300 }}
                    renderInput={(params) => (
                      <TextField {...params} label="Product Name" />
                    )}
                  />
                </Grid>
                <Grid item xs={12} sm={4}>
                  <TextField
                    fullWidth
                    name="quantity"
                    size="small"
                    label="Quantity"
                    variant="outlined"
                    value={input.quantity ? input.quantity : ""}
                    onChange={(event) => handleFormChange(index, event)}
                  />
                </Grid>

                <Grid item xs={12} sm={4} alignContent="right">
                  <Button
                    onClick={addFields}
                    variant="contained"
                    sx={{ marginRight: "1em" }}
                  >
                    Add More...
                  </Button>
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
