import {
  Autocomplete,
  Box,
  Button,
  Chip,
  Divider,
  Grid,
  TextField,
} from "@mui/material";
import React, { useEffect, useState } from "react";
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

export const PurchaseInvoiceCreate = (props) => {
  const { setOpenPopup, getAllPurchaseInvoiceDetails } = props;
  const [inputValue, setInputValue] = useState([]);
  const [open, setOpen] = useState(false);
  const [vendorOption, setVendorOption] = useState([]);
  const [vendor, setVendor] = useState("");
  const [purchaseInvoiceDataByID, setPurchaseInvoiceDataByID] = useState([]);

  const [products, setProducts] = useState([
    {
      product: "",
      quantity: "",
      rate: "",
      amount: "",
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

    // If quantity and rate values exist, update the amount value
    if (list[index].quantity !== "" && list[index].rate !== "") {
      list[index].amount =
        parseInt(list[index].quantity) * parseInt(list[index].rate);
    }

    setProducts(list);
  };

  const fetchVendorOptions = async () => {
    try {
      setOpen(true);
      const response = await InventoryServices.getAllSearchWithFilterGRNData(
        false,
        inputValue.vendor_name
      );
      setVendorOption(response.data.results);
      setOpen(false);
    } catch (err) {
      setOpen(false);
      console.log("err all vendor", err);
    }
  };

  const getPurchaseInvoiceDetailsByID = async (value) => {
    try {
      setOpen(true);
      const response = await InventoryServices.getGRNDataById(value);
      setPurchaseInvoiceDataByID(response.data);
      var arr = response.data.products.map((fruit) => ({
        product: fruit.products,
        unit: fruit.unit,
        quantity: fruit.qa_accepted,
        rate: fruit.rate,
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
        grn: purchaseInvoiceDataByID.grn_no, //Normal text field
        products_data: products,
      };
      await InventoryServices.createPurchaseInvoiceData(req);
      setOpenPopup(false);
      getAllPurchaseInvoiceDetails();
      setOpen(false);
    } catch (error) {
      console.log("createing Packing list error", error);
      setOpen(false);
    }
  };

  return (
    <div>
      <CustomLoader open={open} />

      <Box
        component="form"
        noValidate
        onSubmit={(e) => createPackingListDetails(e)}
      >
        <Grid container spacing={2}>
          <Grid item xs={12} sm={4}>
            <TextField
              sx={{ minWidth: "12rem" }}
              name="vendor_name"
              size="small"
              label="search By vendor Name"
              variant="outlined"
              onChange={handleInputChange}
              value={inputValue.vendor_name}
            />

            <Button onClick={fetchVendorOptions} variant="contained">
              Submit
            </Button>
          </Grid>
          {vendorOption && vendorOption.length > 0 && (
            <Grid item xs={12} sm={4}>
              <Autocomplete
                name="vendor"
                size="small"
                disablePortal
                id="combo-box-demo"
                onChange={(event, value) => {
                  setVendor(value);
                  if (value && value.grn_id) {
                    getPurchaseInvoiceDetailsByID(value.grn_id);
                  }
                }}
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

          <Grid item xs={12} sm={4}>
            <TextField
              fullWidth
              size="small"
              label="GRN"
              variant="outlined"
              value={
                purchaseInvoiceDataByID.grn_id
                  ? purchaseInvoiceDataByID.grn_id
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
          {products.map((input, index) => {
            return (
              <>
                <Grid key={index} item xs={12} sm={4}>
                  <TextField
                    fullWidth
                    name="product"
                    size="small"
                    label="Product"
                    variant="outlined"
                    value={input.product ? input.product : ""}
                    onChange={(event) => handleFormChange(index, event)}
                  />
                </Grid>
                <Grid key={index} item xs={12} sm={2}>
                  <TextField
                    fullWidth
                    size="small"
                    label="Unit"
                    variant="outlined"
                    value={input.unit ? input.unit : ""}
                  />
                </Grid>
                <Grid item xs={12} sm={2}>
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
                <Grid item xs={12} sm={2}>
                  <TextField
                    fullWidth
                    name="rate"
                    size="small"
                    label="Rate"
                    variant="outlined"
                    value={input.rate}
                    onChange={(event) => handleFormChange(index, event)}
                  />
                </Grid>
                <Grid item xs={12} sm={2}>
                  <TextField
                    fullWidth
                    name="amount"
                    size="small"
                    label="Amount"
                    variant="outlined"
                    value={
                      input.quantity !== "" && input.rate !== ""
                        ? parseInt(input.quantity) * parseInt(input.rate)
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
