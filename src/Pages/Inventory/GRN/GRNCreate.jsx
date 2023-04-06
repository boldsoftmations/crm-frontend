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
import CloseIcon from "@mui/icons-material/Close";
import { useSelector } from "react-redux";
import { CustomLoader } from "../../../Components/CustomLoader";
import InventoryServices from "../../../services/InventoryService";
import { styled } from "@mui/material/styles";
const Root = styled("div")(({ theme }) => ({
  width: "100%",
  ...theme.typography.body2,
  "& > :not(style) + :not(style)": {
    marginTop: theme.spacing(2),
  },
}));

export const GRNCreate = (props) => {
  const { setOpenPopup, getAllGRNDetails } = props;
  const [inputValue, setInputValue] = useState([]);
  const [open, setOpen] = useState(false);
  const [vendorOption, setVendorOption] = useState([]);
  const [vendor, setVendor] = useState("");
  const [grnDataByID, setGRNDataByID] = useState([]);

  const [error, setError] = useState(null);
  const data = useSelector((state) => state.auth);
  const sellerData = data.sellerAccount;

  const [products, setProducts] = useState([
    {
      products: "",
      order_quantity: "",
      qa_rejected: "",
      qa_accepted: "",
    },
  ]);
  // this is for search vendor name only
  const handleInputChange = (event) => {
    const { name, value } = event.target;
    setInputValue({ ...inputValue, [name]: value });
  };

  const handleFormChange = (index, event) => {
    const { name, value } = event.target;
    const list = [...products];
    list[index][name] = value;

    // If qa_rejected and quantity values exist, update the qa_accepted value
    if (list[index].qa_rejected !== "" && list[index].order_quantity !== "") {
      list[index].qa_accepted =
        parseInt(list[index].order_quantity) -
        parseInt(list[index].qa_rejected);
    }

    setProducts(list);
  };

  const fetchVendorOptions = async (e) => {
    try {
      e.preventDefault();
      setOpen(true);
      const response = await InventoryServices.getAllSearchPackingListData(
        inputValue.vendor_name
      );
      setVendorOption(response.data.results);
      setOpen(false);
    } catch (err) {
      setOpen(false);
      console.log("err all vendor", err);
    }
  };

  useEffect(() => {
    if (vendor.id) getGRNDetailsByID();
  }, [vendor.id]);

  const getGRNDetailsByID = async () => {
    try {
      setOpen(true);
      const response = await InventoryServices.getPackingListDataById(
        vendor.id
      );

      setGRNDataByID(response.data);
      var arr = response.data.products.map((fruit) => ({
        products: fruit.product,
        order_quantity: fruit.quantity,
      }));
      setProducts(arr);

      setOpen(false);
    } catch (err) {
      setOpen(false);
      console.log("company data by id error", err);
    }
  };

  const createPackingListDetails = async (e) => {
    try {
      e.preventDefault();
      setOpen(true);
      const req = {
        packing_list: grnDataByID.id, //Normal text field

        products: products,
      };
      await InventoryServices.createGRNData(req);
      setOpenPopup(false);
      getAllGRNDetails();
      setOpen(false);
    } catch (error) {
      console.log("createing Packing list error", error);
      setError(
        error.response.data.errors
          ? error.response.data.errors.packing_list
            ? "Packing List" + error.response.data.errors.packing_list
            : error.response.data.errors.seller_account
            ? "Seller Account" + error.response.data.errors.seller_account
            : ""
          : ""
      );
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
              label="search By vendor Name"
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
                options={vendorOption.map((option) => option)}
                getOptionLabel={(option) =>
                  `${option.vendor} ${option.packing_list_no}`
                }
                sx={{ minWidth: 300 }}
                renderInput={(params) => (
                  <TextField {...params} label="Vendor" />
                )}
              />
            </Grid>
          )}

          <Grid item xs={12} sm={3}>
            <TextField
              fullWidth
              size="small"
              name="packing_list"
              label="Packing List"
              variant="outlined"
              value={grnDataByID.id ? grnDataByID.id : ""}
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
                <Grid key={index} item xs={12} sm={3}>
                  <TextField
                    fullWidth
                    name="products"
                    size="small"
                    label="Products"
                    variant="outlined"
                    value={input.products ? input.products : ""}
                    onChange={(event) => handleFormChange(index, event)}
                  />
                </Grid>
                <Grid item xs={12} sm={3}>
                  <TextField
                    fullWidth
                    name="order_quantity"
                    size="small"
                    label="Quantity"
                    variant="outlined"
                    value={input.order_quantity ? input.order_quantity : ""}
                    onChange={(event) => handleFormChange(index, event)}
                  />
                </Grid>
                <Grid item xs={12} sm={3}>
                  <TextField
                    fullWidth
                    name="qa_rejected"
                    size="small"
                    label="QA Rejected"
                    variant="outlined"
                    value={input.qa_rejected}
                    onChange={(event) => handleFormChange(index, event)}
                  />
                </Grid>
                <Grid item xs={12} sm={3}>
                  <TextField
                    fullWidth
                    name="qa_accepted"
                    size="small"
                    label="QA Accepted"
                    variant="outlined"
                    value={
                      input.qa_rejected !== "" && input.order_quantity !== ""
                        ? parseInt(input.order_quantity) -
                          parseInt(input.qa_rejected)
                        : ""
                    }
                    onChange={(event) => handleFormChange(index, event)}
                  />
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
