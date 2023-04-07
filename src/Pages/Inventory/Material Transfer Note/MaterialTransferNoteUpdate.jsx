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
import { CustomLoader } from "../../../Components/CustomLoader";
import InventoryServices from "../../../services/InventoryService";
import ProductService from "../../../services/ProductService";
import { styled } from "@mui/material/styles";

const Root = styled("div")(({ theme }) => ({
  width: "100%",
  ...theme.typography.body2,
  "& > :not(style) + :not(style)": {
    marginTop: theme.spacing(2),
  },
}));

export const MaterialTransferNoteUpdate = (props) => {
  const { setOpenPopup, getAllMaterialTransferNoteDetails, idForEdit } = props;
  const [inputValue, setInputValue] = useState([]);
  const [open, setOpen] = useState(false);
  const [productOption, setProductOption] = useState([]);
  const [error, setError] = useState(null);
  const [product, setProduct] = useState();
  const [unit, setUnit] = useState();
  const handleInputChange = (event) => {
    const { name, value } = event.target;
    console.log("name", name, value);
    setInputValue({ ...inputValue, [name]: value });
  };

  const handleAutocompleteChange = (event, value) => {
    setProduct(value);
    const productObj = productOption.find(
      (item) => item.product__name === value
    );

    let data = [...unit];
    data = productObj ? productObj.product__unit : "";
    setUnit(data);
  };

  useEffect(() => {
    getProduct();
  }, []);

  const getProduct = async () => {
    try {
      setOpen(true);
      const response =
        await InventoryServices.getAllConsProductionInventoryData();
      setProductOption(response.data);
      setOpen(false);
    } catch (err) {
      console.error("error potential", err);
      setOpen(false);
    }
  };

  useEffect(() => {
    if (idForEdit) getMaterialTransferNoteDetailsByID();
  }, [idForEdit]);

  const getMaterialTransferNoteDetailsByID = async () => {
    try {
      setOpen(true);
      const response = await InventoryServices.getMaterialTransferNoteDataById(
        idForEdit
      );

      setProduct(response.data.product);
      setUnit(response.data.unit);
      setInputValue(response.data);
      setOpen(false);
    } catch (err) {
      setOpen(false);
      console.log("company data by id error", err);
    }
  };

  const updateMaterialTransferNoteDetails = async (e) => {
    try {
      e.preventDefault();
      setOpen(true);
      const req = {
        user: inputValue.user,
        product: product ? product : "",
        quantity: inputValue.quantity,
      };
      await InventoryServices.updateMaterialTransferNoteData(idForEdit, req);

      setOpenPopup(false);
      getAllMaterialTransferNoteDetails();
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

  return (
    <div>
      <CustomLoader open={open} />

      <Box
        component="form"
        noValidate
        onSubmit={(e) => updateMaterialTransferNoteDetails(e)}
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
              value={product ? product : ""}
              onChange={(event, value) =>
                handleAutocompleteChange(event, value)
              }
              options={productOption.map((option) => option.product__name)}
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
              name="unit"
              size="small"
              label="Unit"
              variant="outlined"
              value={unit ? unit : ""}
            />
          </Grid>
          <Grid item xs={12} sm={4}>
            <TextField
              fullWidth
              name="quantity"
              size="small"
              label="Quantity"
              variant="outlined"
              value={inputValue.quantity ? inputValue.quantity : ""}
              onChange={(event) => handleInputChange(event)}
            />
          </Grid>
        </Grid>
        {inputValue.accepted === false ? (
          <Button
            type="submit"
            fullWidth
            variant="contained"
            sx={{ mt: 3, mb: 2 }}
          >
            Submit
          </Button>
        ) : null}
      </Box>
    </div>
  );
};
