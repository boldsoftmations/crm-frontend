import { Box, Button, Chip, Divider, Grid } from "@mui/material";
import React, { memo, useMemo, useState } from "react";
import { CustomLoader } from "../../../Components/CustomLoader";
import InventoryServices from "../../../services/InventoryService";
import { useSelector } from "react-redux";
import { styled } from "@mui/material/styles";
import CustomTextField from "../../../Components/CustomTextField";
import CustomAutocomplete from "../../../Components/CustomAutocomplete";
import { useNotificationHandling } from "../../../Components/useNotificationHandling ";
import useDynamicFormFields from "../../../Components/useDynamicFormFields ";
import { MessageAlert } from "../../../Components/MessageAlert";
const Root = styled("div")(({ theme }) => ({
  width: "100%",
  ...theme.typography.body2,
  "& > :not(style) + :not(style)": {
    marginTop: theme.spacing(2),
  },
}));
export const BillofMaterialsCreate = memo((props) => {
  const {
    setOpenPopup,
    getAllBillofMaterialsDetails,
    currentPage,
    searchQuery,
    filterApproved,
  } = props;
  const [open, setOpen] = useState(false);
  const [inputChange, setInputChange] = useState([]);
  const data = useSelector((state) => state.auth);
  const FinishGoodsProduct = data.finishgoodsProduct;
  const ConsumableProduct = data.consumableProduct;
  const RawMaterialProduct = data.rawMaterialProduct;
  const RawAndConsumableProduct = [
    ...(ConsumableProduct || []),
    ...(RawMaterialProduct || []),
  ];
  const productOption = useMemo(
    () =>
      RawAndConsumableProduct.map((data) => ({
        product: data.product,
        unit: data.unit,
        quantity: data.quantity,
      })),
    [RawAndConsumableProduct]
  );
  const { handleSuccess, handleError, handleCloseSnackbar, alertInfo } =
    useNotificationHandling();

  const {
    handleAutocompleteChange,
    handleFormChange,
    addFields,
    removeFields,
    products,
  } = useDynamicFormFields(
    [
      {
        product: "",
        unit: "",
        quantity: "",
      },
    ],
    productOption
  );

  const handleSelectChanges = (name, value) => {
    setInputChange({
      ...inputChange,
      [name]: value,
    });
  };

  const createMaterialRequisitionFormDetails = async (e) => {
    try {
      e.preventDefault();
      setOpen(true);
      const req = {
        product: inputChange.product,
        bom_type: inputChange.bom_type,
        products_data: products,
      };
      await InventoryServices.createBillofMaterialsData(req);
      handleSuccess("BOM Created Successfully");
      setTimeout(() => {
        setOpenPopup(false);
      }, 300);
      getAllBillofMaterialsDetails(currentPage, searchQuery, filterApproved);
    } catch (error) {
      handleError(error); // Handle errors from the API call
    } finally {
      setOpen(false); // Always close the loader
    }
  };

  return (
    <>
      <MessageAlert
        open={alertInfo.open}
        onClose={handleCloseSnackbar}
        severity={alertInfo.severity}
        message={alertInfo.message}
      />
      <CustomLoader open={open} />

      <Box
        component="form"
        noValidate
        onSubmit={(e) => createMaterialRequisitionFormDetails(e)}
      >
        <Grid container spacing={2}>
          <Grid item xs={12} sm={4}>
            <CustomAutocomplete
              name="product"
              size="small"
              disablePortal
              id="combo-box-demo"
              onChange={(event, value) => handleSelectChanges("product", value)}
              options={
                FinishGoodsProduct
                  ? FinishGoodsProduct.map((option) => option.product)
                  : []
              }
              getOptionLabel={(option) => option}
              sx={{ minWidth: 300 }}
              label="Product Name"
            />
          </Grid>
          <Grid item xs={12} sm={4}>
            <CustomAutocomplete
              size="small"
              disablePortal
              id="combo-box-demo"
              onChange={(event, value) =>
                handleSelectChanges("bom_type", value)
              }
              options={BOM_CHOICE}
              getOptionLabel={(option) => option}
              sx={{ minWidth: 300 }}
              label="Bom Type"
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
            console.log("input", input);
            return (
              <>
                <Grid key={index} item xs={12} sm={4}>
                  <CustomAutocomplete
                    name="product"
                    size="small"
                    disablePortal
                    id="combo-box-demo"
                    value={input.product || ""}
                    onChange={(event, value) =>
                      handleAutocompleteChange(index, event, value)
                    }
                    options={
                      RawAndConsumableProduct
                        ? RawAndConsumableProduct.map(
                            (option) => option.product
                          )
                        : []
                    }
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
                    value={input.unit || ""}
                  />
                </Grid>
                <Grid item xs={12} sm={3}>
                  <CustomTextField
                    fullWidth
                    name="quantity"
                    size="small"
                    label="Quantity"
                    variant="outlined"
                    value={input.quantity || ""}
                    onChange={(event) => handleFormChange(index, event)}
                  />
                </Grid>

                <Grid item xs={12} sm={1} alignContent="right">
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
    </>
  );
});

const BOM_CHOICE = ["production", "job_worker"];
