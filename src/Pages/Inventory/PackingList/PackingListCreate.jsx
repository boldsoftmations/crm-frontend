import React, { useEffect, useState, useCallback, memo } from "react";
import { Box, Button, Grid } from "@mui/material";
import CustomTextField from "../../../Components/CustomTextField";
import InventoryServices from "../../../services/InventoryService";
import { CustomLoader } from "../../../Components/CustomLoader";
import { useNotificationHandling } from "../../../Components/useNotificationHandling ";
import { MessageAlert } from "../../../Components/MessageAlert";
import { Popup } from "../../../Components/Popup";
// import { DecimalValidation } from "../../../Components/Header/DecimalValidation";

export const PackingListCreate = memo(
  ({ selectedRow, setOpenPopup, getAllPurchaseOrderDetails }) => {
    console.log("selectedRow", selectedRow);
    const [openAlert, setOpenAlert] = useState(false);
    const [loading, setLoading] = useState(false);
    const today = new Date().toISOString().slice(0, 10);
    const [details, setDetails] = useState(() => ({
      seller_account: selectedRow.seller_account,
      vendor: selectedRow.vendor,
      purchase_order: [selectedRow.po_no],
      packing_list_no: "",
      invoice_date: today,
      products: selectedRow.products.map((product) => ({
        product: product.product,
        unit: product.unit,
        quantity: product.pending_quantity,
        max_decimal_digit: product.max_decimal_digit,
      })),
    }));
    const { handleSuccess, handleError, handleCloseSnackbar, alertInfo } =
      useNotificationHandling();

    useEffect(() => {
      setDetails({
        seller_account: selectedRow.seller_account,
        vendor: selectedRow.vendor,
        purchase_order: [selectedRow.po_no],
        packing_list_no: details.packing_list_no,
        invoice_date: details.invoice_date,
        products: selectedRow.products.map((product, index) => ({
          id: product.id,
          product: product.product,
          unit: product.unit,
          quantity:
            (details.products[index] && details.products[index].quantity) ||
            product.pending_quantity,
          type_of_unit: product.type_of_unit,
          // max_decimal_digit: product.max_decimal_digit
        })),
      });
    }, [selectedRow]);

    const handleInput = useCallback((e) => {
      const { name, value } = e.target;
      setDetails((current) => ({ ...current, [name]: value }));
    }, []);

    const handleQuantityChange = useCallback((index, newQuantity) => {
      setDetails((current) => ({
        ...current,
        products: current.products.map((product, idx) =>
          idx === index ? { ...product, quantity: newQuantity } : product,
        ),
      }));
    }, []);

    const OpeningAlert = (e) => {
      e.preventDefault();
      setOpenAlert(true);
    };

    const createPackingListDetails = async (e) => {
      e.preventDefault();
      try {
        // const numTypes = selectedRow.products.map((item) => item.type_of_unit);
        // const quantities = details.products.map((item) => item.quantity);
        // const decimalCounts = selectedRow.products.map((item) =>
        //   String(item.max_decimal_digit)
        // );
        // console.log(quantities);
        // const unit = selectedRow.products.map((item) => item.unit);

        // const isvalid = DecimalValidation({
        //   numTypes,
        //   quantities,
        //   decimalCounts,
        //   unit,
        //   handleError,
        // });
        // if (!isvalid) {
        //   setLoading(false);
        //   return;
        // }
        setLoading(true);
        const dataToSend = {
          ...details,
          purchase_order: details.purchase_order, // This is already an array
        };

        await InventoryServices.createPackingListData(dataToSend);
        handleSuccess("Packing list created successfully");
        setTimeout(() => {
          setOpenPopup(false);
        }, 300);
        getAllPurchaseOrderDetails();
      } catch (error) {
        handleError(error);
        console.error("Creating Packing list error", error);
      } finally {
        setLoading(false);
      }
    };
    console.log(details);

    return (
      <>
        <MessageAlert
          open={alertInfo.open}
          onClose={handleCloseSnackbar}
          severity={alertInfo.severity}
          message={alertInfo.message}
        />
        <CustomLoader open={loading} />
        <Box component="form" noValidate onSubmit={OpeningAlert}>
          <Grid container spacing={2}>
            <Grid item xs={12} sm={3}>
              <CustomTextField
                fullWidth
                size="small"
                name="seller_account"
                label="Buyer Account"
                variant="outlined"
                value={details.seller_account}
                disabled
              />
            </Grid>
            <Grid item xs={12} sm={3}>
              <CustomTextField
                fullWidth
                size="small"
                label="Purchase Order Number"
                variant="outlined"
                value={details.purchase_order || ""}
                disabled
              />
            </Grid>
            <Grid item xs={12} sm={3}>
              <CustomTextField
                fullWidth
                size="small"
                name="packing_list_no"
                label="Invoice No"
                variant="outlined"
                value={details.packing_list_no || ""}
                onChange={handleInput}
              />
            </Grid>
            <Grid item xs={12} sm={3}>
              <CustomTextField
                fullWidth
                type="date"
                size="small"
                name="invoice_date"
                label="Invoice Date"
                variant="outlined"
                value={details.invoice_date || ""}
                onChange={handleInput}
                InputProps={{ inputProps: { max: today } }}
              />
            </Grid>
            {details.products.map((product, index) => (
              <React.Fragment key={product.id || index}>
                <Grid item xs={12} sm={2}>
                  <CustomTextField
                    fullWidth
                    size="small"
                    label="Id"
                    variant="outlined"
                    value={product.id || ""}
                    disabled
                  />
                </Grid>
                <Grid item xs={12} sm={4}>
                  <CustomTextField
                    fullWidth
                    size="small"
                    label="Product"
                    variant="outlined"
                    value={product.product || ""}
                    disabled
                  />
                </Grid>
                <Grid item xs={12} sm={3}>
                  <CustomTextField
                    fullWidth
                    size="small"
                    label="Unit"
                    variant="outlined"
                    value={product.unit || ""}
                    disabled
                  />
                </Grid>
                <Grid item xs={12} sm={3}>
                  <CustomTextField
                    fullWidth
                    size="small"
                    name="quantity"
                    step={
                      selectedRow.products[index].type_of_unit === "decimal"
                        ? 0.01
                        : 1
                    }
                    label="Quantity"
                    variant="outlined"
                    type="number"
                    value={
                      product.type_of_unit === "decimal"
                        ? product.quantity
                        : Math.floor(product.quantity)
                    }
                    onChange={(e) =>
                      handleQuantityChange(index, e.target.value)
                    }
                  />
                </Grid>
              </React.Fragment>
            ))}
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

        <Popup
          setOpenPopup={setOpenAlert}
          openPopup={openAlert}
          title="Confirm Packing List Creation"
        >
          <Box sx={{ mb: 2 }}>
            <p style={{ fontWeight: 500, marginBottom: "10px", color: "#444" }}>
              Please review the following products before creating the packing
              list. Once submitted, the quantities will be processed.
            </p>

            {details.products.length > 0 ? (
              details.products.map((item) => (
                <Box
                  key={item.id}
                  sx={{
                    display: "flex",
                    justifyContent: "space-between",
                    padding: "8px 12px",
                    border: "1px solid #e0e0e0",
                    borderRadius: "6px",
                    mb: 1,
                    background: "#fafafa",
                  }}
                >
                  <span style={{ fontWeight: 500 }}>{item.product}</span>
                  <span style={{ color: "#1976d2", fontWeight: 600 }}>
                    Qty: {item.quantity}
                  </span>
                </Box>
              ))
            ) : (
              <p style={{ color: "red" }}>No products added.</p>
            )}
          </Box>

          <Box sx={{ display: "flex", justifyContent: "flex-end", gap: 2 }}>
            <Button
              variant="outlined"
              color="inherit"
              onClick={() => setOpenAlert(false)}
            >
              Cancel
            </Button>

            <Button
              variant="contained"
              color="primary"
              onClick={createPackingListDetails}
            >
              Confirm & Create
            </Button>
          </Box>
        </Popup>
      </>
    );
  },
);
