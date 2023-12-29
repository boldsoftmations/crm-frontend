import React, { useEffect, useState } from "react";
import { Box, Button, Grid } from "@mui/material";
import { CustomLoader } from "../../../Components/CustomLoader";
import InventoryServices from "../../../services/InventoryService";
import { useSelector } from "react-redux";
import CustomTextField from "../../../Components/CustomTextField";
import CustomAutocomplete from "../../../Components/CustomAutocomplete";
export const MaterialTransferNoteUpdate = (props) => {
  const {
    setOpenUpdatePopup,
    getAllMaterialTransferNoteDetails,
    sellerOption,
    idForEdit,
  } = props;
  const [quantity, setQuantity] = useState(idForEdit.quantity);
  const [open, setOpen] = useState(false);
  const [productOption, setProductOption] = useState([]);
  const [error, setError] = useState(null);
  const [product, setProduct] = useState(idForEdit.product);
  const [unit, setUnit] = useState(idForEdit.unit);
  const [selectedSellerData, setSelectedSellerData] = useState(
    idForEdit.seller_account
  );
  const data = useSelector((state) => state.auth);
  const users = data.profile;

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

  const updateMaterialTransferNoteDetails = async (e) => {
    try {
      e.preventDefault();
      setOpen(true);
      const req = {
        seller_account: selectedSellerData,
        user: idForEdit.user,
        product: product ? product : "",
        quantity: quantity,
      };
      await InventoryServices.updateMaterialTransferNoteData(idForEdit, req);

      setOpenUpdatePopup(false);
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
        <div
          style={{
            position: "fixed",
            top: "20px",
            left: "50%",
            transform: "translateX(-50%)",
            backgroundColor: error ? "red" : "green",
            color: "white",
            padding: "10px",
            borderRadius: "4px",
            display: error ? "block" : "none",
            zIndex: 9999,
          }}
        >
          <span style={{ marginRight: "10px" }}>
            {error ? error : "Successfully Updated"}
          </span>
          <button
            style={{
              backgroundColor: "transparent",
              border: "none",
              color: "white",
              cursor: "pointer",
              padding: "0",
            }}
            onClick={handleCloseSnackbar}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="16"
              height="16"
              fill="currentColor"
              viewBox="0 0 16 16"
            >
              <path
                fillRule="evenodd"
                d="M8 7.293l2.146-2.147a.5.5 0 11.708.708L8.707 8l2.147 2.146a.5.5 0 01-.708.708L8 8.707l-2.146 2.147a.5.5 0 01-.708-.708L7.293 8 5.146 5.854a.5.5 0 01.708-.708L8 7.293z"
              />
            </svg>
          </button>
        </div>
        <Grid container spacing={2}>
          <Grid item xs={12} sm={3}>
            <CustomAutocomplete
              name="seller_account"
              size="small"
              disablePortal
              id="combo-box-demo"
              value={selectedSellerData}
              onChange={(event, value) => setSelectedSellerData(value)}
              options={
                sellerOption && sellerOption.map((option) => option.unit)
              }
              getOptionLabel={(option) => option}
              sx={{ minWidth: 300 }}
              label="Seller Account"
            />
          </Grid>
          <Grid item xs={12} sm={3}>
            <CustomAutocomplete
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
              label="Product Name"
            />
          </Grid>
          <Grid item xs={12} sm={3}>
            <CustomTextField
              fullWidth
              name="unit"
              size="small"
              label="Unit"
              variant="outlined"
              value={unit ? unit : ""}
            />
          </Grid>
          <Grid item xs={12} sm={3}>
            <CustomTextField
              fullWidth
              name="quantity"
              size="small"
              label="Quantity"
              variant="outlined"
              value={quantity ? quantity : ""}
              onChange={(event) => setQuantity(event.target.value)}
            />
          </Grid>
        </Grid>
        {idForEdit.accepted === false || users.groups.includes("Accounts") ? (
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
