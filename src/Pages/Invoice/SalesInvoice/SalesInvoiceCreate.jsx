import { Autocomplete, Box, Button, Grid, TextField } from "@mui/material";
import React, { useEffect, useRef, useState } from "react";
import InvoiceServices from "../../../services/InvoiceService";
import { CustomLoader } from "./../../../Components/CustomLoader";

export const SalesInvoiceCreate = (props) => {
  const { setOpenPopup, getSalesInvoiceDetails } = props;
  const errRef = useRef();
  const [open, setOpen] = useState(false);
  const [errMsg, setErrMsg] = useState("");
  const [customerorderBookData, setCustomerOrderBookData] = useState();
  const [customerorderBookOption, setCustomerOrderBookOption] = useState([]);
  const [products, setProducts] = useState([
    {
      product: "",
      pending_quantity: "",
      quantity: "",
    },
  ]);

  const handleFormChange = (index, event) => {
    let data = [...products];
    data[index][event.target.name] = event.target.value;

    setProducts(data);
  };

  const removeFields = (index) => {
    let data = [...products];
    data.splice(index, 1);
    setProducts(data);
  };

  useEffect(() => {
    getAllCustomerWiseOrderBook();
  }, []);

  const getAllCustomerWiseOrderBook = async () => {
    try {
      setOpen(true);
      const response = await InvoiceServices.getOrderBookCustomerData();
      setCustomerOrderBookOption(response.data.results);
      setProducts(response.data.results.products);
      setOpen(false);
    } catch (err) {
      setOpen(false);
      if (!err.response) {
        setErrMsg(
          "“Sorry, You Are Not Allowed to Access This Page” Please contact to admin"
        );
      } else if (err.response.status === 400) {
        setErrMsg(
          err.response.data.errors.name
            ? err.response.data.errors.name
            : err.response.data.errors.non_field_errors
        );
      } else if (err.response.status === 401) {
        setErrMsg(err.response.data.errors.code);
      } else {
        setErrMsg("Server Error");
      }
      errRef.current.focus();
    }
  };

  const handleProductValue = (value) => {
    console.log("value", value);
    const Data = value;
    const productData = Data.products.map((name) => name);
    var arr = [];
    var arr = productData.map((fruit) => ({
      product: fruit.product,
      pending_quantity: fruit.pending_quantity,
    }));
    setProducts(arr);
    setCustomerOrderBookData(value);
  };

  const createSalesInvoiceDetails = async (e) => {
    try {
      e.preventDefault();
      const req = {
        order_book: customerorderBookData.id,
        products: products,
      };
      setOpen(true);

      await InvoiceServices.createSalesnvoiceData(req);
      setOpenPopup(false);
      getSalesInvoiceDetails();
      setOpen(false);
    } catch (err) {
      setOpen(false);
      alert(err.response.data.errors.non_field_errors);
      if (err.response.status === 400) {
        setErrMsg(err.response.data.errors.non_field_errors);
      }
    }
  };
  return (
    <div>
      <CustomLoader open={open} />
      <Box
        component="form"
        noValidate
        onSubmit={(e) => createSalesInvoiceDetails(e)}
      >
        <Grid container spacing={2}>
          <Grid item xs={12}>
            <Autocomplete
              name="seller_account"
              size="small"
              disablePortal
              id="combo-box-demo"
              onChange={(event, value) => handleProductValue(value)}
              options={customerorderBookOption}
              getOptionLabel={(option) => option.proforma_invoice}
              sx={{ minWidth: 300 }}
              renderInput={(params) => (
                <TextField {...params} label="PI Number" sx={tfStyle} />
              )}
            />
          </Grid>
          {products && products.length > 0
            ? products.map((input, index) => {
                console.log(
                  "input :>> ",
                  products[index].pending_quantity >= input.quantity
                );
                return (
                  <>
                    <Grid key={index} item xs={12} sm={4}>
                      <TextField
                        fullWidth
                        name="product"
                        size="small"
                        label="Product"
                        variant="outlined"
                        value={input.product}
                      />
                    </Grid>
                    <Grid item xs={12} sm={3}>
                      <TextField
                        fullWidth
                        name="pending_quantity"
                        size="small"
                        label="Pending Quantity"
                        variant="outlined"
                        value={input.pending_quantity}
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
                        error={input.pending_quantity < input.quantity}
                        helperText={
                          input.pending_quantity < input.quantity
                            ? "qunatity will less than pending quantity"
                            : ""
                        }
                      />
                    </Grid>

                    <Grid item xs={12} sm={2}>
                      <Button
                        onClick={() => removeFields(index)}
                        variant="contained"
                      >
                        Remove
                      </Button>
                    </Grid>
                  </>
                );
              })
            : null}
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

const tfStyle = {
  "& .MuiButtonBase-root.MuiAutocomplete-clearIndicator": {
    color: "blue",
    visibility: "visible",
  },
};
