import {
  Autocomplete,
  Box,
  Button,
  Checkbox,
  Chip,
  Divider,
  FormControlLabel,
  Grid,
  IconButton,
  Snackbar,
  TextField,
} from "@mui/material";
import React, { useState } from "react";
import CloseIcon from "@mui/icons-material/Close";
import { CustomLoader } from "../../../Components/CustomLoader";
import InventoryServices from "../../../services/InventoryService";
import { useSelector } from "react-redux";
import { styled } from "@mui/material/styles";

const Root = styled("div")(({ theme }) => ({
  width: "100%",
  ...theme.typography.body2,
  "& > :not(style) + :not(style)": {
    marginTop: theme.spacing(2),
  },
}));
export const ProductionEntryCreate = (props) => {
  const { setOpenPopup, sellerOption, getAllProductionEntryDetails } = props;
  const [open, setOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState([]);
  const [selectedBOM, setSelectedBOM] = useState([]);
  const [quantity, setQuantity] = useState(0);
  const [error, setError] = useState(null);
  const [checked, setChecked] = useState(false);
  const data = useSelector((state) => state.auth);
  const [selectedSellerData, setSelectedSellerData] = useState(null);
  const users = data.profile;
  const FinishGoodsProduct = data.finishgoodsProduct;
  const [products, setProducts] = useState([
    {
      product: null,
      quantity: null,
      expected_quantity: null,
    },
  ]);

  const handleFormChange = (index, event) => {
    let data = [...products];
    let value = event.target.value;
    // check if the input is a valid number
    if (!isNaN(value)) {
      value = parseFloat(value);
    } else {
      value = 0; // set default value for non-numeric input
    }
    data[index][event.target.name] = value;
    setProducts(data);
  };

  const handleQuantityChange = (event) => {
    const { name, value } = event.target;
    setQuantity({ ...quantity, [name]: value });
  };
  const fetchProductOptions = async (value) => {
    try {
      setOpen(true);
      const response = await InventoryServices.getFilterhBillofMaterialsData(
        value,
        "true"
      );
      setSelectedProduct(response.data.results);
      setOpen(false);
    } catch (err) {
      setOpen(false);
      console.log("err all vendor", err);
    }
  };

  const getProductByBOM = (value) => {
    setSelectedBOM(value);
    var arr = value.products_data.map((fruit) => ({
      product: fruit.product,
      unit: fruit.unit,
      quantity: fruit.quantity,
      expected_quantity: fruit.quantity,
    }));
    setProducts(arr);
  };

  const createMaterialRequisitionFormDetails = async (e) => {
    try {
      e.preventDefault();
      setOpen(true);

      const productData = checked
        ? products.map((product) => ({
            product: product.product,
            quantity: parseFloat(product.quantity) || 0,
            expected_quantity: (
              parseFloat(product.expected_quantity) *
              parseFloat(quantity.quantity)
            ).toFixed(4),
          }))
        : products.map((product) => {
            const productQuantity = parseFloat(product.quantity);
            const totalQuantity = parseFloat(quantity.quantity) || 0;
            return {
              product: product.product,
              quantity:
                isNaN(productQuantity) || isNaN(totalQuantity)
                  ? 0
                  : (productQuantity * totalQuantity).toFixed(4),
              expected_quantity: (
                parseFloat(product.expected_quantity) *
                parseFloat(quantity.quantity)
              ).toFixed(4),
            };
          });

      const req = {
        seller_account: selectedSellerData,
        user: users.email,
        bom: selectedBOM.bom_id,
        product: selectedBOM.product,
        production_gnl: checked,

        quantity: quantity.quantity,
        products_data: productData,
      };
      await InventoryServices.createProductionEntryData(req);
      setOpenPopup(false);
      getAllProductionEntryDetails();
      setOpen(false);
    } catch (error) {
      if (error.response && error.response.data && error.response.data.errors) {
        setError(error.response.data.errors.non_field_errors);
      }

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
        onSubmit={(e) => createMaterialRequisitionFormDetails(e)}
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
          <Grid item xs={12} sm={6}>
            <Autocomplete
              name="seller_account"
              size="small"
              disablePortal
              id="combo-box-demo"
              onChange={(event, value) => setSelectedSellerData(value)}
              options={
                sellerOption && sellerOption.map((option) => option.unit)
              }
              getOptionLabel={(option) => option}
              sx={{ minWidth: 300 }}
              renderInput={(params) => (
                <TextField {...params} label="Seller Account" />
              )}
            />
          </Grid>
          <Grid item xs={12} sm={4}>
            <Autocomplete
              name="product"
              size="small"
              disablePortal
              id="combo-box-demo"
              onChange={(event, value) => fetchProductOptions(value)}
              options={
                FinishGoodsProduct
                  ? FinishGoodsProduct.map((option) => option.product)
                  : []
              }
              getOptionLabel={(option) => option}
              sx={{ minWidth: 300 }}
              renderInput={(params) => (
                <TextField {...params} label="Product Name" />
              )}
            />
          </Grid>
          <Grid item xs={12} sm={4}>
            <Autocomplete
              name="bom"
              size="small"
              disablePortal
              id="combo-box-demo"
              onChange={(event, value) => getProductByBOM(value)}
              options={selectedProduct}
              getOptionLabel={(option) => option.bom_id}
              sx={{ minWidth: 300 }}
              renderInput={(params) => (
                <TextField {...params} label="Bill of Material" />
              )}
            />
          </Grid>
          <Grid item xs={12} sm={4}>
            <FormControlLabel
              label={"Gain And Loss"}
              control={
                <Checkbox
                  checked={checked}
                  onChange={(e) => setChecked(e.target.checked)}
                  inputProps={{ "aria-label": "controlled" }}
                />
              }
            />
          </Grid>
          <Grid item xs={12} sm={4}>
            <TextField
              fullWidth
              name="quantity"
              size="small"
              label="Quantity"
              variant="outlined"
              value={quantity.quantity}
              onChange={(event) => handleQuantityChange(event)}
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
                    size="small"
                    label="Product"
                    variant="outlined"
                    value={input.product ? input.product : ""}
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
                {checked === false ? (
                  <Grid item xs={12} sm={3}>
                    <TextField
                      fullWidth
                      name="quantity"
                      size="small"
                      label="Quantity"
                      variant="outlined"
                      value={
                        quantity.quantity && input.quantity
                          ? (
                              parseFloat(input.quantity) *
                              parseFloat(quantity.quantity)
                            ).toFixed(4)
                          : input.quantity || ""
                      }
                      InputLabelProps={{
                        shrink: true,
                      }}
                      disabled
                    />
                  </Grid>
                ) : (
                  <Grid item xs={12} sm={3}>
                    <TextField
                      fullWidth
                      name="quantity"
                      size="small"
                      label="Quantity"
                      variant="outlined"
                      type="number"
                      value={input.quantity ? parseFloat(input.quantity) : ""}
                      onChange={(event) => handleFormChange(index, event)}
                    />
                  </Grid>
                )}
                {checked && (
                  <Grid item xs={12} sm={3}>
                    <TextField
                      fullWidth
                      name="expected_quantity"
                      size="small"
                      label="Expected Quantity"
                      variant="outlined"
                      value={
                        quantity.quantity && input.expected_quantity
                          ? (
                              parseFloat(input.expected_quantity) *
                              parseFloat(quantity.quantity)
                            ).toFixed(4)
                          : ""
                      }
                    />
                  </Grid>
                )}
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
