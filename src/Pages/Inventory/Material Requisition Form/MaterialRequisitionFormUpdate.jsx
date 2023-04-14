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

import { styled } from "@mui/material/styles";
import { useSelector } from "react-redux";

const Root = styled("div")(({ theme }) => ({
  width: "100%",
  ...theme.typography.body2,
  "& > :not(style) + :not(style)": {
    marginTop: theme.spacing(2),
  },
}));

export const MaterialRequisitionFormUpdate = (props) => {
  const {
    setOpenPopup,
    getAllMaterialRequisitionFormDetails,
    idForEdit,
    storesInventoryData,
  } = props;
  const [materialRequisitionDataByID, setMaterialRequisitionDataByID] =
    useState([]);
  const [open, setOpen] = useState(false);
  const [error, setError] = useState(null);
  const data = useSelector((state) => state.auth);
  const users = data.profile;
  const [products, setProducts] = useState([
    {
      product: "",
      quantity: "",
      unit: "",
    },
  ]);

  const handleAutocompleteChange = (index, event, value) => {
    let data = [...products];
    const productObj = storesInventoryData.find(
      (item) => item.product__name === value
    );

    data[index]["product"] = value;
    data[index]["unit"] = productObj ? productObj.product__unit : "";
    setProducts(data);
  };

  const handleFormChange = (index, event) => {
    let data = [...products];
    data[index][event.target.name] = event.target.value;

    setProducts(data);
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
    if (idForEdit) getMaterialRequisitionFormDetailsByID();
  }, [idForEdit]);

  const getMaterialRequisitionFormDetailsByID = async () => {
    try {
      setOpen(true);
      const response =
        await InventoryServices.getMaterialRequisitionFormDataById(idForEdit);

      setMaterialRequisitionDataByID(response.data);
      var arr = response.data.products_data.map((fruit) => ({
        product: fruit.product,
        quantity: fruit.quantity,
        unit: fruit.unit,
      }));
      setProducts(arr);

      setOpen(false);
    } catch (err) {
      setOpen(false);
      console.log("company data by id error", err);
    }
  };

  const updateMaterialRequisitionFormDetails = async (e) => {
    try {
      e.preventDefault();
      setOpen(true);
      const req = {
        seller_account: users.groups.includes("Production Delhi")
          ? "Delhi"
          : "Maharashtra",
        user: materialRequisitionDataByID.user,
        products_data: products,
      };
      await InventoryServices.updateMaterialRequisitionFormData(idForEdit, req);

      setOpenPopup(false);
      getAllMaterialRequisitionFormDetails();
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
        onSubmit={(e) => updateMaterialRequisitionFormDetails(e)}
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
              name="packing_list_no"
              label="Packing List No."
              variant="outlined"
              value={
                materialRequisitionDataByID.user
                  ? materialRequisitionDataByID.user
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
                <Grid key={index} item xs={12} sm={3}>
                  <Autocomplete
                    name="product"
                    size="small"
                    disablePortal
                    id="combo-box-demo"
                    value={input.product ? input.product : ""}
                    onChange={(event, value) =>
                      handleAutocompleteChange(index, event, value)
                    }
                    options={storesInventoryData.map(
                      (option) => option.product__name
                    )}
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
                    value={input.quantity ? input.quantity : ""}
                    onChange={(event) => handleFormChange(index, event)}
                  />
                </Grid>

                <Grid item xs={12} sm={3} alignContent="right">
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
        {materialRequisitionDataByID.accepted === false ? (
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
