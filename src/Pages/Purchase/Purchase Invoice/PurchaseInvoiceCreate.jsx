import { Box, Button, Chip, Divider, Grid } from "@mui/material";
import React, { memo, useEffect, useState } from "react";
import CustomTextField from "../../../Components/CustomTextField";
import { CustomLoader } from "../../../Components/CustomLoader";
import InventoryServices from "../../../services/InventoryService";
import { styled } from "@mui/material/styles";
import { useNotificationHandling } from "../../../Components/useNotificationHandling ";
import { MessageAlert } from "../../../Components/MessageAlert";
import { Popup } from "../../../Components/Popup";
import TrendingUpIcon from "@mui/icons-material/TrendingUp";
import WarningIcon from "@mui/icons-material/Warning";
import TrendingDownIcon from "@mui/icons-material/TrendingDown";
const Root = styled("div")(({ theme }) => ({
  width: "100%",
  ...theme.typography.body2,
  "& > :not(style) + :not(style)": {
    marginTop: theme.spacing(2),
  },
}));

export const PurchaseInvoiceCreate = memo(
  ({ setOpenPopup, recordForEdit, getAllGRNDetails }) => {
    const [open, setOpen] = useState(false);
    const { handleSuccess, handleError, handleCloseSnackbar, alertInfo } =
      useNotificationHandling();
    const [productvalidate, setProductvalidate] = useState("");
    const [icons, setIcons] = useState(null);
    const [openPopup, setOpenPopup1] = useState(false);
    const [productname, setProductname] = useState("");
    const title = (
      <span>
        <WarningIcon color="warning" />
        {" Rate Check Alert"}
      </span>
    );
    const [products, setProducts] = useState(
      recordForEdit.products.map((product) => {
        // Log the rate of each product

        // Return the new product object
        return {
          product: product.products,
          quantity: product.qa_accepted,
          unit: product.unit,
          order_date: product.order_date,
          type_of_unit: product.type_of_unit,
          po_no: product.po_no,
          amount: "",
          rate: "",
        };
      })
    );
    console.log("recordForEdit", recordForEdit);
    console.log("products", products);

    const handleFormChange = (index, event) => {
      const { name, value } = event.target;
      const list = [...products];
      list[index][name] = value;
      if (list[index].quantity !== "" && list[index].rate !== "") {
        list[index].amount = (list[index].quantity * list[index].rate).toFixed(
          2
        );
      }

      setProducts(list);
    };
    console.log("recordForEdit", recordForEdit);
    let lastPurchase =
      (recordForEdit &&
        recordForEdit.products.map((pro) =>
          parseFloat(pro.last_purchase_rate)
        )) ||
      [];

    let minRate =
      (recordForEdit &&
        recordForEdit.products.map((pro) =>
          parseFloat(pro.min_validation_rate)
        )) ||
      [];

    let maxRate =
      (recordForEdit &&
        recordForEdit.products.map((pro) =>
          parseFloat(pro.max_validation_rate)
        )) ||
      [];

    const createPackingListDetails = async (e) => {
      try {
        e.preventDefault();

        // Validate all products before proceeding
        for (let i = 0; i < products.length; i++) {
          const product = products[i];
          const productRate = parseFloat(product.rate);
          const productName = product.product || `Product ${i + 1}`;

          const min = minRate[i];
          const max = maxRate[i];
          const price = lastPurchase[i];

          if (
            [min, max, price].some(
              (v) => isNaN(v) || v === null || v === undefined
            )
          ) {
            continue;
          }

          // --- Defensive checks ---
          if ([price, min, max].find((v) => v != null)) {
            if ([productRate, min, max].some((v) => isNaN(v))) {
              handleError(`Invalid rate value for ${productName}`);
              return;
            }
            // --- Validation check ---
            if (productRate < min) {
              setProductvalidate("rate should be less than ");
              setOpenPopup1(true);
              setProductname(productName);
              setIcons(
                <span>
                  <TrendingDownIcon sx={{ fontSize: "3rem" }} color="error" />
                </span>
              );
              console.log("Below minimum");
              return;
            }

            if (productRate > max) {
              setProductvalidate(`rate should be more than`);
              setOpenPopup1(true);
              setProductname(productName);
              setIcons(
                <span>
                  <TrendingUpIcon sx={{ fontSize: "3rem" }} color="success" />
                </span>
              );
              console.log(openPopup);
              console.log("Above maximum");
              return;
            }
          }
        }

        setOpen(true);

        const req = {
          grn: recordForEdit.grn_no,
          products_data: products,
          invoice_type: "Purchase",
        };

        await InventoryServices.createPurchaseInvoiceData(req);

        getAllGRNDetails();
        handleSuccess("Purchase Invoice created successfully");

        setTimeout(() => setOpenPopup(false), 300);
        setOpen(false);
      } catch (error) {
        handleError(error);
        console.log("Creating Packing list error", error);
        setOpen(false);
      }
    };
    console.log(products);

    const handleSure = async (e) => {
      e.preventDefault();
      setOpenPopup1(false);
      try {
        setOpen(true);

        const req = {
          grn: recordForEdit.grn_no,
          products_data: products,
          invoice_type: "Purchase",
        };

        await InventoryServices.createPurchaseInvoiceData(req);

        getAllGRNDetails();
        handleSuccess("Purchase Invoice created successfully");

        setTimeout(() => setOpenPopup(false), 300);
        setOpen(false);
      } catch (error) {
        handleError(error);
        console.log("Creating Packing list error", error);
        setOpen(false);
      }
    };
    useEffect(() => {
      if (openPopup) {
        console.log("openPopup", openPopup);
      }
    }, [openPopup]);

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
          onSubmit={(e) => createPackingListDetails(e)}
        >
          <Grid container spacing={2}>
            <Grid item xs={12} sm={4}>
              <CustomTextField
                fullWidth
                size="small"
                label="Vendor"
                variant="outlined"
                value={recordForEdit.vendor || ""}
                disabled
              />
            </Grid>
            <Grid item xs={12} sm={4}>
              <CustomTextField
                fullWidth
                size="small"
                label="Grn No"
                variant="outlined"
                value={recordForEdit.grn_no || ""}
                disabled
              />
            </Grid>
            <Grid item xs={12} sm={4}>
              <CustomTextField
                fullWidth
                size="small"
                label="Invoice No"
                variant="outlined"
                value={recordForEdit.packing_list_no || ""}
                disabled
              />
            </Grid>
            <Grid item xs={12} sm={4}>
              <CustomTextField
                fullWidth
                size="small"
                label="Invoice Date"
                variant="outlined"
                value={recordForEdit.created_on || ""}
                disabled
              />
            </Grid>
            <Grid item xs={12} sm={4}>
              <CustomTextField
                fullWidth
                size="small"
                label="Purchase Order No"
                variant="outlined"
                value={recordForEdit.po_no || ""}
                disabled
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
                    <CustomTextField
                      fullWidth
                      size="small"
                      label="Product"
                      variant="outlined"
                      value={input.product || ""}
                      disabled
                    />
                  </Grid>
                  <Grid key={index} item xs={12} sm={2}>
                    <CustomTextField
                      fullWidth
                      size="small"
                      label="Unit"
                      variant="outlined"
                      value={input.unit || ""}
                      disabled
                    />
                  </Grid>
                  <Grid item xs={12} sm={2}>
                    <CustomTextField
                      fullWidth
                      size="small"
                      label="Quantity"
                      variant="outlined"
                      value={
                        input.type_of_unit === "decimal"
                          ? input.quantity
                          : Math.floor(input.quantity) || ""
                      }
                      disabled
                    />
                  </Grid>
                  <Grid item xs={12} sm={2}>
                    <CustomTextField
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
                    <CustomTextField
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
            <span style={{ fontSize: "1.5rem" }}>{productname}</span>
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
              Edit Rate
            </Button>
          </Box>
        </Popup>
      </>
    );
  }
);
