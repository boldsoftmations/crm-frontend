import {
  Autocomplete,
  Box,
  Button,
  Chip,
  Divider,
  Grid,
  TextField,
} from "@mui/material";
import React, { useState } from "react";

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
  const {
    setOpenPopup,
    getAllPurchaseInvoiceDetails,
    vendorOption,
    getGRNDetails,
  } = props;
  const [open, setOpen] = useState(false);
  const [purchaseInvoiceDataByID, setPurchaseInvoiceDataByID] = useState([]);
  const [products, setProducts] = useState([
    {
      product: "",
      quantity: "",
      rate: "",
      amount: "",
    },
  ]);

  const handleFormChange = (index, event) => {
    const { name, value } = event.target;
    const list = [...products];
    list[index][name] = value;

    // If quantity and rate values exist, update the amount value
    if (list[index].quantity !== "" && list[index].rate !== "") {
      list[index].amount = (list[index].quantity * list[index].rate).toFixed(2);
    }

    setProducts(list);
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
      getGRNDetails();
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
          {vendorOption && vendorOption.length > 0 && (
            <Grid item xs={12} sm={4}>
              <Autocomplete
                size="small"
                disablePortal
                id="combo-box-demo"
                onChange={(event, value) => {
                  if (value && value.grn_id) {
                    getPurchaseInvoiceDetailsByID(value.grn_no);
                  }
                }}
                options={vendorOption.map((option) => option)}
                getOptionLabel={(option) => option.grn_no}
                sx={{ minWidth: 300 }}
                renderInput={(params) => (
                  <TextField {...params} label="GRN No" />
                )}
              />
            </Grid>
          )}

          <Grid item xs={12} sm={4}>
            <TextField
              fullWidth
              size="small"
              label="Vendor"
              variant="outlined"
              value={
                purchaseInvoiceDataByID.vendor
                  ? purchaseInvoiceDataByID.vendor
                  : ""
              }
            />
          </Grid>
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
                        ? (input.quantity * input.rate).toFixed(2)
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
