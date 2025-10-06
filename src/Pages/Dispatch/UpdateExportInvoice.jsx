import React from "react";
import { Box, Grid } from "@mui/material";
import { useState } from "react";
import { CustomButton } from "./../../Components/CustomButton";
import InvoiceServices from "../../services/InvoiceService";
import { CustomLoader } from "./../../Components/CustomLoader";
import { useSelector } from "react-redux";
import CustomTextField from "../../Components/CustomTextField";
import { PreviewImage } from "./PreviewImage";
import { Popup } from "../../Components/Popup";
import CustomAutocomplete from "../../Components/CustomAutocomplete";

export const UpdateExportInvoice = (props) => {
  const [open, setOpen] = useState(false);
  const [close, setClose] = useState(false);
  const { idData, getAllDispatchDetails, setOpenPopup, handelError } = props;
  const [selectedFile, setSelectedFile] = useState("");
  const [selectedFileImage, setSelectedFileImage] = useState("");
  const [hideImage, setHideImage] = useState(false);
  const [inputValue, setInputValue] = useState([]);
  const [filterValue, setFilterValue] = useState(idData.dispatch_type);
  const data = useSelector((state) => state.auth);
  const users = data.profile;
  const handleImageLRCopy = (event) => {
    setSelectedFile(event.target.files[0]);
    setSelectedFileImage(URL.createObjectURL(event.target.files[0]));
  };

  const handleInputChange = (event) => {
    const { name, value } = event.target;
    setInputValue({ ...inputValue, [name]: value });
  };

  const createLeadsData = async (e) => {
    try {
      e.preventDefault();

      const data = new FormData();
      // Append common fields to form data
      data.append("sales_invoice", idData.sales_invoice);
      data.append("transporter", inputValue.transporter || idData.transporter);
      data.append("lr_number", inputValue.lr_number || idData.lr_number);
      data.append("lr_date", inputValue.lr_date || idData.lr_date);
      data.append("dispatched", true);
      data.append("dispatch_type", filterValue || idData.dispatch_type);
      if (selectedFile) {
        data.append("lr_copy", selectedFile);
      }
      if (filterValue === "Airway Bill") {
        data.append(
          "shipping_date",
          inputValue.shipping_date || idData.shipping_date
        );
        data.append(
          "shipping_number",
          inputValue.shipping_number || idData.shipping_number
        );
      }

      const LRDATE = inputValue.lr_date || idData.lr_date;
      const LRNUMBER = inputValue.lr_number || idData.lr_number;
      const TRANSPORTER = inputValue.transporter || idData.transporter;

      const shouldSubmit = selectedFile || (LRDATE && LRNUMBER && TRANSPORTER);

      if (shouldSubmit) {
        setOpen(true);

        await InvoiceServices.updateDispatched(idData.id, data);

        setOpenPopup(false);
        getAllDispatchDetails();
      }
    } catch (error) {
      console.log("Error:", error);
      handelError(error);
    } finally {
      setOpen(false); // Ensure setOpen(false) runs in both success and error cases
    }
  };

  const handleImageView = () => {
    setClose(true);
    setHideImage(!hideImage);
  };
  return (
    <div>
      <CustomLoader open={open} />
      <Box component="form" noValidate onSubmit={(e) => createLeadsData(e)}>
        <Grid container spacing={2}>
          <Grid item xs={12}>
            <CustomTextField
              fullWidth
              size="small"
              label="Sales Invoice"
              variant="outlined"
              value={idData.sales_invoice}
            />
          </Grid>
          <Grid item xs={12}>
            <CustomTextField
              fullWidth
              size="small"
              label="Customer"
              variant="outlined"
              value={idData.customer}
            />
          </Grid>
          <Grid item xs={12}>
            <CustomTextField
              fullWidth
              name="transporter"
              size="small"
              label="Transporter"
              variant="outlined"
              value={
                inputValue.transporter
                  ? inputValue.transporter
                  : idData.transporter
              }
              onChange={handleInputChange}
            />
          </Grid>
          <Grid item xs={12}>
            <CustomAutocomplete
              size="small"
              options={["Bill of Lading", "Airway Bill"]}
              label="Choose type of Bill"
              onChange={(e, value) => setFilterValue(value)}
              value={filterValue}
            />
          </Grid>
          <Grid item xs={12}>
            <CustomTextField
              fullWidth
              name="lr_number"
              size="small"
              label="Dispatch Document Number"
              variant="outlined"
              value={
                inputValue.lr_number ? inputValue.lr_number : idData.lr_number
              }
              onChange={handleInputChange}
            />
          </Grid>
          <Grid item xs={12}>
            <CustomTextField
              fullWidth
              type={"date"}
              name="lr_date"
              size="small"
              label="Dispatch Document Date"
              variant="outlined"
              value={inputValue.lr_date ? inputValue.lr_date : idData.lr_date}
              onChange={handleInputChange}
              InputLabelProps={{
                shrink: true,
              }}
            />
          </Grid>
          {filterValue === "Airway Bill" && (
            <>
              <Grid item xs={12}>
                <CustomTextField
                  fullWidth
                  type="number"
                  name="shipping_number"
                  size="small"
                  label="Shipping Number"
                  variant="outlined"
                  value={
                    inputValue.shipping_number
                      ? inputValue.shipping_number
                      : idData.shipping_number
                  }
                  onChange={handleInputChange}
                  InputLabelProps={{
                    shrink: true,
                  }}
                />
              </Grid>
              <Grid item xs={12}>
                <CustomTextField
                  fullWidth
                  type={"date"}
                  name="shipping_date"
                  size="small"
                  label="Shipping Date"
                  variant="outlined"
                  value={
                    inputValue.shipping_date
                      ? inputValue.shipping_date
                      : idData.shipping_date
                  }
                  onChange={handleInputChange}
                  InputLabelProps={{
                    shrink: true,
                  }}
                />
              </Grid>
            </>
          )}
          {filterValue &&
            (users.groups.includes("Factory-Mumbai-Dispatch") ||
              users.groups.includes("Factory-Delhi-Dispatch") ||
              users.groups.includes("Director")) && (
              <Grid item xs={12}>
                <label>
                  {filterValue === "Bill of Lading"
                    ? "Bill Of Lading :"
                    : filterValue === "Airway Bill"
                    ? "Airway Bill :"
                    : ""}
                </label>

                <input
                  type={"file"}
                  name="file"
                  // value={selectedFile ? selectedFile : idData.lr_copy}
                  onChange={handleImageLRCopy}
                />
                <img
                  src={selectedFileImage ? selectedFileImage : idData.lr_copy}
                  alt="Dispatch Document"
                  height="80px"
                  width="75px"
                  style={{
                    cursor: "pointer",
                  }}
                  onClick={handleImageView}
                />
              </Grid>
            )}
        </Grid>
        <CustomButton
          sx={{ marginTop: "1rem" }}
          type="submit"
          fullWidth
          variant="contained"
          text={"Submit"}
        />
      </Box>
      <Popup
        fullScreen={true}
        title={"Previw Image"}
        openPopup={close}
        setOpenPopup={setClose}
      >
        <PreviewImage
          lrCopyImage={selectedFileImage}
          setClose={setClose}
          hideImage={hideImage}
        />
      </Popup>
    </div>
  );
};
