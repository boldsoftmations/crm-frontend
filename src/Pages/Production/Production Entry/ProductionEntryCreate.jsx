import {
  Box,
  Button,
  Checkbox,
  Chip,
  Divider,
  FormControlLabel,
  Grid,
} from "@mui/material";
import React, { memo, useState } from "react";
import { CustomLoader } from "../../../Components/CustomLoader";
import InventoryServices from "../../../services/InventoryService";
import { useSelector } from "react-redux";
import { styled } from "@mui/material/styles";
import CustomTextField from "../../../Components/CustomTextField";
import CustomAutocomplete from "../../../Components/CustomAutocomplete";
import { useNotificationHandling } from "../../../Components/useNotificationHandling ";
import { MessageAlert } from "../../../Components/MessageAlert";
import TrendingUpIcon from "@mui/icons-material/TrendingUp";
import WarningIcon from "@mui/icons-material/Warning";
import TrendingDownIcon from "@mui/icons-material/TrendingDown";
import { Popup } from "../../../Components/Popup";
const Root = styled("div")(({ theme }) => ({
  width: "100%",
  ...theme.typography.body2,
  "& > :not(style) + :not(style)": {
    marginTop: theme.spacing(2),
  },
}));
export const ProductionEntryCreate = memo((props) => {
  const {
    setOpenPopup,
    sellerOption,
    getAllProductionEntryDetails,
    currentPage,
    searchQuery,
  } = props;
  const [openPopup, setOpenPopup1] = useState(false);
  const [productvalidate, setProductvalidate] = useState("");
  const [icons, setIcons] = useState(null);
  const [productName, setProductName] = useState("");
  const [open, setOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState([]);
  const [selectedBOM, setSelectedBOM] = useState([]);
  const [quantity, setQuantity] = useState(0);
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
  const { handleSuccess, handleError, handleCloseSnackbar, alertInfo } =
    useNotificationHandling();
  const [remark, setRemark] = useState("");
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
  const title = (
    <span>
      <WarningIcon color="warning" />
      {" Rate Check Alert"}
    </span>
  );
  const fetchProductOptions = async (value) => {
    try {
      setOpen(true);
      setRemark("");
      const response = await InventoryServices.getAllBillofMaterialsData(
        "all",
        "true",
        false,
        value
      );
      setSelectedProduct(response.data);
      // setRemark(response.data.remark);
      // console.log(response.data.remark);
      setOpen(false);
    } catch (err) {
      setOpen(false);
      console.log("err all vendor", err);
    }
  };
  console.log("BOM");

  const getProductByBOM = (value) => {
    console.log("BOM");

    setSelectedBOM(value);
    console.log(value);
    console.log(value && value.remark);
    setRemark(value && value.remark);
    var arr = value.products_data.map((fruit) => ({
      product: fruit.product,
      unit: fruit.unit,
      quantity: fruit.quantity,
      expected_quantity: fruit.quantity,
      // remark: fruit.remark,
    }));
    setProducts(arr);
    console.log("BOM", arr);
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

      // ✅ Validation check
      if (checked) {
        let isInvalid = false;

        for (const product of products) {
          const totalQuantity = parseFloat(product.expected_quantity);
          const productQuantity = parseFloat(product.quantity) || 0;
          const tenPercentHigh = totalQuantity * 1.1;
          const tenPercentLow = totalQuantity * 0.9;

          if (productQuantity > tenPercentHigh) {
            setProductvalidate("quantity should be more than");
            setOpenPopup1(true);
            setProductName(product.product);
            setIcons(
              <span>
                <TrendingUpIcon sx={{ fontSize: "3rem" }} color="success" />
              </span>
            );
            console.log("Above 10% range");
            isInvalid = true;
            break; // ✅ stop checking further
          } else if (productQuantity < tenPercentLow) {
            setProductvalidate("quantity should be less than");
            setOpenPopup1(true);
            setProductName(product.product);
            setIcons(
              <span>
                <TrendingDownIcon sx={{ fontSize: "3rem" }} color="error" />
              </span>
            );
            console.log("Below 10% range");
            isInvalid = true;
            break; // ✅ stop checking further
          }
        }

        // ✅ Stop further API call if invalid
        if (isInvalid) {
          setOpen(false); // close loader if open
          return;
        }
      }

      // ✅ Proceed only if validation passed
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
      getAllProductionEntryDetails(currentPage, searchQuery);
      handleSuccess("Production Entry Created Successfully");

      setTimeout(() => {
        setOpen(false);
      }, 300);
    } catch (error) {
      handleError(error);
    } finally {
      setOpen(false);
    }
  };

  const handleSure = async (e) => {
    try {
      e.preventDefault();
      setOpen(true);
      setOpenPopup1(false);
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
            console.log(product);
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
      getAllProductionEntryDetails(currentPage, searchQuery);
      handleSuccess("Production Entry Created Successfully");
      setTimeout(() => {
        setOpen(false);
      }, 300);
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
        onSubmit={(e) => createMaterialRequisitionFormDetails(e)}
      >
        <Grid container spacing={2}>
          <Grid item xs={12} sm={4}>
            <CustomAutocomplete
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
              label="Seller Account"
            />
          </Grid>
          <Grid item xs={12} sm={4}>
            <CustomAutocomplete
              name="product"
              size="small"
              disablePortal
              id="combo-box-demo"
              onChange={(event, value) => fetchProductOptions(value)}
              options={
                FinishGoodsProduct
                  ? FinishGoodsProduct.map((option) => option)
                  : []
              }
              getOptionLabel={(option) => option}
              sx={{ minWidth: 300 }}
              label="Product Name"
            />
          </Grid>
          <Grid item xs={12} sm={4}>
            <CustomAutocomplete
              name="bom"
              size="small"
              disablePortal
              id="combo-box-demo"
              onChange={(event, value) => getProductByBOM(value)}
              options={selectedProduct}
              getOptionLabel={(option) => option.bom_id}
              sx={{ minWidth: 300 }}
              label="Bill of Material"
            />
          </Grid>

          <Grid item xs={12} sm={2}>
            <CustomTextField
              fullWidth
              size="small"
              label="Unit"
              variant="outlined"
              // value={input.remark ? input.remark : ""}
            />
          </Grid>

          <Grid item xs={12} sm={4}>
            <CustomTextField
              fullWidth
              name="quantity"
              size="small"
              label="Quantity"
              variant="outlined"
              value={quantity.quantity}
              onChange={(event) => handleQuantityChange(event)}
            />
          </Grid>
          <Grid item xs={12} sm={4}>
            <CustomTextField
              fullWidth
              size="small"
              label="Remark"
              variant="outlined"
              value={remark}
              InputLabelProps={{ shrink: true }}
              disabled
            />
          </Grid>
          {(users.email === "amol@glutape.com" ||
            users.groups.includes("Director")) && (
            <Grid item xs={12} sm={4}>
              <FormControlLabel
                label={"Gain And Loss"}
                control={
                  <Checkbox
                    checked={checked}
                    onChange={(e) => setChecked(e.target.checked)}
                    inputProps={{ "aria-label": "controlled" }}
                    disabled={checked}
                  />
                }
              />
            </Grid>
          )}

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
                  <CustomTextField
                    fullWidth
                    size="small"
                    label="Product"
                    variant="outlined"
                    value={input.product ? input.product : ""}
                  />
                </Grid>
                <Grid key={index} item xs={12} sm={2}>
                  <CustomTextField
                    fullWidth
                    size="small"
                    label="Unit"
                    variant="outlined"
                    value={input.unit ? input.unit : ""}
                  />
                </Grid>

                {checked === false ? (
                  <Grid item xs={12} sm={3}>
                    <CustomTextField
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
                    <CustomTextField
                      fullWidth
                      name="quantity"
                      size="small"
                      label="Quantity"
                      variant="outlined"
                      type="number"
                      value={
                        quantity.quantity && input.quantity && !checked
                          ? (
                              parseFloat(input.quantity) *
                              parseFloat(quantity.quantity)
                            ).toFixed(4)
                          : input.quantity || ""
                      }
                      onChange={(event) => handleFormChange(index, event)}
                    />
                  </Grid>
                )}
                {checked && (
                  <Grid item xs={12} sm={3}>
                    <CustomTextField
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
      <Popup openPopup={openPopup} setOpenPopup={setOpenPopup1} title={title}>
        <Box
          sx={{
            display: "flex",

            p: 0,
            flexDirection: "column",
            gap: 0,
            padding: ["0px", "10px"],
          }}
        >
          <span style={{ fontSize: "1.5rem" }}>{productName}</span>
          <span>{productvalidate}</span>
          <span style={{ fontSize: "2rem" }}>10% {icons}</span>
          <span style={{ opacity: 0.5, fontSize: "0.8rem" }}>
            Please verify the entered rate before Proceeding
          </span>
        </Box>
        <Box sx={{ display: "flex", mt: 2, justifyContent: "space-around " }}>
          <Button variant="contained" color="success" onClick={handleSure}>
            Proceed Anyway
          </Button>
          <Button
            variant="contained"
            color="error"
            onClick={() => setOpenPopup1(false)}
          >
            Recheck
          </Button>
        </Box>
      </Popup>
    </>
  );
});
