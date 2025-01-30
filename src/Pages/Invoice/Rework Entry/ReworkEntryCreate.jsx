import React, { useState, useEffect } from "react";
import { Box, Button, Grid } from "@mui/material";
import { styled } from "@mui/material/styles";
import Chip from "@mui/material/Chip";
import Divider from "@mui/material/Divider";
import { useNotificationHandling } from "../../../Components/useNotificationHandling ";
import { MessageAlert } from "../../../Components/MessageAlert";
import { CustomLoader } from "../../../Components/CustomLoader";
import CustomTextField from "../../../Components/CustomTextField";
import CustomAutocomplete from "../../../Components/CustomAutocomplete";
import InventoryServices from "../../../services/InventoryService";
import ProductService from "../../../services/ProductService";

const Root = styled("div")(({ theme }) => ({
  width: "100%",
  ...theme.typography.body2,
  "& > :not(style) + :not(style)": {
    marginTop: theme.spacing(2),
  },
}));

export const ReworkEntryCreate = ({
  getSalesReturnInventoryDetails,
  setOpenPopup,
  selectedRow,
}) => {
  console.log("selectedRow", selectedRow);
  const { handleSuccess, handleError, handleCloseSnackbar, alertInfo } =
    useNotificationHandling();
  const [productOption, setProductOption] = useState([]);
  const [open, setOpen] = useState(false);
  const [inputValue, setInputValue] = useState("");
  const [rawMaterials, setRawMaterials] = useState(
    selectedRow.products.map((product) => ({
      ...product,
      quantity: product.quantity || 0,
    }))
  );

  const [consumables, setConsumables] = useState([]);
  const [consumableOptions, setConsumableOptions] = useState([]);
  const getconsumables = async () => {
    try {
      setOpen(true);
      const response = await ProductService.getAllConsumable("all");
      console.log("consumable", response.data);
      var arr = response.data.map((ProductData) => ({
        product: ProductData.name,
        unit: ProductData.unit,
      }));
      setConsumableOptions(arr);
      setOpen(false);
    } catch (err) {
      handleError(err);
      setOpen(false);
      console.log("err", err);
    }
  };

  const getProduct = async () => {
    try {
      const res = await ProductService.getProductPriceList();
      setProductOption(res.data.products);
    } catch (err) {
      console.error("error potential", err);
    }
  };

  useEffect(() => {
    getconsumables();
    getProduct();
  }, []);

  const handleInputChange = (name, value) => {
    setInputValue({ ...inputValue, [name]: value });
  };

  const handleRawMaterialChange = (index, value) => {
    const updatedValue = Number(value); // Allow the quantity to be updated as entered by the user.

    setRawMaterials((current) =>
      current.map((material, idx) =>
        idx === index
          ? {
              ...material,
              quantity: updatedValue, // Only updating the quantity, no conditions here.
            }
          : material
      )
    );
  };

  const removeFields = (index) => {
    let data = [...rawMaterials];
    data.splice(index, 1);
    setRawMaterials(data);
  };

  const addConsumable = () => {
    setConsumables((prev) => [...prev, { product: "", quantity: 0 }]);
  };

  const removeConsumable = (index) => {
    setConsumables((prev) => prev.filter((_, i) => i !== index));
  };

  const handleConsumableChange = (index, event) => {
    const { name, value } = event.target;
    setConsumables((current) =>
      current.map((item, i) =>
        i === index ? { ...item, [name]: value } : item
      )
    );
  };

  const createReworkEntryDetails = async (e) => {
    e.preventDefault();

    const payload = {
      seller_account: selectedRow.unit,
      source_key: selectedRow.batch_no.join(", "),
      product: inputValue.product,
      quantity: inputValue.quantity,
      raw_materials: rawMaterials,
      consumable: consumables,
    };

    try {
      setOpen(true);
      const response = await InventoryServices.createReworkinvoiceData(payload);
      handleSuccess(
        response.data.message || "Rework Entry created successfully!"
      );
      setOpenPopup(false);
      getSalesReturnInventoryDetails();
    } catch (error) {
      handleError(error);
    } finally {
      setOpen(false);
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
        onSubmit={(e) => createReworkEntryDetails(e)}
      >
        <Grid container spacing={2}>
          <Grid item xs={12} sm={4}>
            <CustomTextField
              fullWidth
              multiline
              size="small"
              label="Batch No"
              variant="outlined"
              value={selectedRow.batch_no.join(", ")}
            />
          </Grid>
          <Grid item xs={12} sm={4}>
            <CustomTextField
              fullWidth
              size="small"
              label="Seller Unit"
              variant="outlined"
              value={selectedRow.unit}
            />
          </Grid>
          <Grid item xs={12} sm={4}>
            <CustomAutocomplete
              name="product"
              size="small"
              disablePortal
              id="combo-box-demo"
              onChange={(event, value) => handleInputChange("product", value)}
              options={productOption.map((option) => option.product__name)}
              getOptionLabel={(option) => option}
              fullWidth
              label="Product"
            />
          </Grid>
          <Grid item xs={12} sm={4}>
            <CustomTextField
              fullWidth
              name="quantity"
              size="small"
              label="Quantity"
              variant="outlined"
              value={inputValue.quantity}
              onChange={(event, value) =>
                handleInputChange("quantity", event.target.value)
              }
            />
          </Grid>
          <Grid item xs={12}>
            <Root>
              <Divider>
                <Chip label="RAW MATERIALS" />
              </Divider>
            </Root>
          </Grid>
          {rawMaterials.map((material, index) => (
            <React.Fragment key={index}>
              <Grid item xs={12} sm={5}>
                <CustomTextField
                  fullWidth
                  size="small"
                  label="Product"
                  variant="outlined"
                  value={material.product}
                  InputProps={{
                    readOnly: true,
                  }}
                />
              </Grid>
              <Grid item xs={12} sm={4}>
                <CustomTextField
                  fullWidth
                  name="quantity"
                  size="small"
                  label="Quantity"
                  variant="outlined"
                  type="number"
                  value={material.quantity.toString()}
                  onChange={(e) =>
                    handleRawMaterialChange(index, e.target.value)
                  }
                  helperText="Please ensure the quantity entered is available in stock."
                />
              </Grid>
              <Grid item xs={12} sm={2}>
                <Button onClick={() => removeFields(index)} variant="contained">
                  Remove
                </Button>
              </Grid>
            </React.Fragment>
          ))}

          <Grid item xs={12}>
            <Root>
              <Divider>
                <Chip label="CONSUMABLES" />
              </Divider>
            </Root>
          </Grid>
          {consumables.map((consumable, index) => (
            <React.Fragment key={index}>
              <Grid item xs={12} sm={5}>
                <CustomAutocomplete
                  options={consumableOptions}
                  getOptionLabel={(option) => option.product || ""}
                  value={
                    consumableOptions.find(
                      (opt) => opt.product === consumable.product
                    ) || null
                  }
                  onChange={(event, newValue) => {
                    handleConsumableChange(index, {
                      target: {
                        name: "product",
                        value: newValue ? newValue.product : "",
                      },
                    });
                    handleConsumableChange(index, {
                      target: {
                        name: "unit",
                        value: newValue ? newValue.unit : "",
                      },
                    });
                  }}
                  renderInput={(params) => (
                    <CustomTextField
                      {...params}
                      label="Consumable Product"
                      variant="outlined"
                      size="small"
                    />
                  )}
                />
              </Grid>
              <Grid item xs={12} sm={2}>
                <CustomTextField
                  fullWidth
                  name="unit"
                  size="small"
                  label="Unit"
                  variant="outlined"
                  value={consumable.unit || ""}
                  InputProps={{
                    readOnly: true,
                  }}
                />
              </Grid>

              <Grid item xs={12} sm={2}>
                <CustomTextField
                  fullWidth
                  name="quantity"
                  size="small"
                  label="Quantity"
                  variant="outlined"
                  value={consumable.quantity}
                  onChange={(event) => handleConsumableChange(index, event)}
                />
              </Grid>
              <Grid item xs={12} sm={1}>
                <Button
                  onClick={() => removeConsumable(index)}
                  variant="contained"
                >
                  Remove
                </Button>
              </Grid>
            </React.Fragment>
          ))}
          <Grid item xs={12}>
            <Button onClick={addConsumable} variant="contained">
              Add Consumable
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
};
