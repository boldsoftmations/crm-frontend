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
import React, { useState } from "react";
import CloseIcon from "@mui/icons-material/Close";
import { CustomLoader } from "../../../Components/CustomLoader";
import InventoryServices from "../../../services/InventoryService";
import { useSelector } from "react-redux";
import { styled } from "@mui/material/styles";
import { useEffect } from "react";

const Root = styled("div")(({ theme }) => ({
  width: "100%",
  ...theme.typography.body2,
  "& > :not(style) + :not(style)": {
    marginTop: theme.spacing(2),
  },
}));
export const ProductionEntryCreate = (props) => {
  const { setOpenPopup, getAllProductionEntryDetails } = props;
  const [open, setOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState([]);
  const [selectedBOM, setSelectedBOM] = useState([]);
  const [quantity, setQuantity] = useState(0);
  const [error, setError] = useState(null);
  const data = useSelector((state) => state.auth);
  const users = data.profile;
  const FinishGoodsProduct = data.finishgoodsProduct;
  const [products, setProducts] = useState([
    {
      product: null,
      quantity: null,
    },
  ]);

  const handleFormChange = (index, event) => {
    const { name, value } = event.target;
    const updatedProducts = [...products];
    updatedProducts[index].product = value;
    setProducts(updatedProducts);
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

  const fetchProductOptions = async (value) => {
    try {
      setOpen(true);
      const response = await InventoryServices.getAllSearchBillofMaterialsData(
        value
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
      quantity: fruit.quantity,
    }));
    setProducts(arr);
  };

  const createMaterialRequisitionFormDetails = async (e) => {
    try {
      e.preventDefault();

      setOpen(true);
      const productData = products.map((product) => ({
        product: product.product,
        quantity: (parseFloat(product.quantity) * parseFloat(quantity)).toFixed(
          2
        ),
      }));
      console.log("productData", productData);
      const req = {
        user: users.email,
        bom: selectedBOM.bom_id,
        product: selectedBOM.product,
        quantity: quantity,
        products_data: productData,
      };
      await InventoryServices.createProductionEntryData(req);
      setOpenPopup(false);
      getAllProductionEntryDetails();
      setOpen(false);
    } catch (error) {
      setError(
        error.response.data.errors
          ? error.response.data.errors.non_field_errors
          : ""
      );
      setOpen(false);
    }
  };

  const handleCloseSnackbar = () => {
    setError(null);
  };

  console.log(
    parseInt(products.quantity).toFixed(2) * parseInt(quantity).toFixed(2)
  );
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
          <Grid item xs={12} sm={4}>
            <Autocomplete
              name="product"
              size="small"
              disablePortal
              id="combo-box-demo"
              onChange={(event, value) => fetchProductOptions(value)}
              options={FinishGoodsProduct.map((option) => option.product)}
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
            <TextField
              fullWidth
              name="quantity"
              size="small"
              label="Quantity"
              variant="outlined"
              value={quantity}
              onChange={(event) => setQuantity(event.target.value)}
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
                <Grid item xs={12} sm={4}>
                  <TextField
                    fullWidth
                    name="quantity"
                    size="small"
                    label="Quantity"
                    variant="outlined"
                    value={
                      quantity && input.quantity
                        ? (
                            parseFloat(input.quantity) * parseFloat(quantity)
                          ).toFixed(2)
                        : input.quantity || ""
                    }
                    InputLabelProps={{
                      shrink: true,
                    }}
                  />
                </Grid>

                <Grid item xs={12} sm={4} alignContent="right">
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
