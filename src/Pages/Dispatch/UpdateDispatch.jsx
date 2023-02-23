import React from "react";
import { Box, Grid, TextField } from "@mui/material";
import { useState } from "react";
import { CustomButton } from "./../../Components/CustomButton";
import InvoiceServices from "../../services/InvoiceService";
import { CustomLoader } from "./../../Components/CustomLoader";

export const UpdateDispatch = (props) => {
  const [open, setOpen] = useState(false);
  const { idData, getAllDispatchDetails, setOpenPopup, userData } = props;
  const [lrCopy, setLrCopy] = useState("");
  const [lrCopyImage, setLrCopyImage] = useState("");
  const [podCopy, setPodCopy] = useState("");
  const [podCopyImage, setPodCopyImage] = useState("");
  const [inputValue, setInputValue] = useState([]);

  const handleImageLRCopy = (event) => {
    console.log("event", event);
    setLrCopy(event.target.files[0]);
    setLrCopyImage(URL.createObjectURL(event.target.files[0]));
  };

  const handleImagePODCopy = (event) => {
    setPodCopy(event.target.files[0]);
    setPodCopyImage(URL.createObjectURL(event.target.files[0]));
  };

  const handleInputChange = (event) => {
    const { name, value } = event.target;
    setInputValue({ ...inputValue, [name]: value });
  };
  console.log("lrCopy ", lrCopy ? lrCopy : idData.lr_copy);

  const createLeadsData = async (e) => {
    try {
      e.preventDefault();

      const data = new FormData();
      if (userData.groups.toString() === "Customer Service") {
        data.append("sales_invoice", idData.sales_invoice);
        data.append(
          "transporter",
          inputValue.transporter ? inputValue.transporter : idData.transporter
        );
        data.append(
          "lr_number",
          inputValue.lr_number ? inputValue.lr_number : idData.lr_number
        );
        data.append(
          "lr_date",
          inputValue.lr_date ? inputValue.lr_date : idData.lr_date
        );
        if (lrCopy !== "") {
          data.append("lr_copy", lrCopy ? lrCopy : "");
        }
        if (podCopy !== "") {
          data.append("pod_copy", podCopy ? podCopy : "");
        }
        data.append("dispatched", true);
      } else {
        data.append("sales_invoice", idData.sales_invoice);
        data.append(
          "transporter",
          inputValue.transporter ? inputValue.transporter : idData.transporter
        );
        data.append(
          "lr_number",
          inputValue.lr_number ? inputValue.lr_number : idData.lr_number
        );
        data.append(
          "lr_date",
          inputValue.lr_date ? inputValue.lr_date : idData.lr_date
        );
        if (lrCopy !== "") {
          data.append("lr_copy", lrCopy ? lrCopy : "");
        }
        data.append("dispatched", true);
      }
      const LRDATE = inputValue.lr_date ? inputValue.lr_date : idData.lr_date;
      const LRNUMBER = inputValue.lr_number
        ? inputValue.lr_number
        : idData.lr_number;
      const TRANSPORTER = inputValue.transporter
        ? inputValue.transporter
        : idData.transporter;
      console.log("LRDATE", LRDATE);

      if (
        lrCopy !== "" ||
        podCopy !== "" ||
        (LRDATE !== null &&
          LRNUMBER !== null &&
          TRANSPORTER !== null &&
          userData.groups.toString() === "Customer Service")
      ) {
        setOpen(true);
        await InvoiceServices.updateDispatched(idData.id, data);

        setOpenPopup(false);

        getAllDispatchDetails();
        setOpen(false);
      } else {
        if (
          lrCopy !== "" ||
          (LRDATE !== null && LRNUMBER !== null && TRANSPORTER !== null)
        ) {
          setOpen(true);
          await InvoiceServices.updateDispatched(idData.id, data);

          setOpenPopup(false);

          getAllDispatchDetails();
          setOpen(false);
        }
      }
    } catch (error) {
      console.log("error :>> ", error);
      setOpen(false);
    }
  };

  return (
    <div>
      <CustomLoader open={open} />
      <Box component="form" noValidate onSubmit={(e) => createLeadsData(e)}>
        <Grid container spacing={2}>
          <Grid item xs={12}>
            <TextField
              fullWidth
              size="small"
              label="Sales Invoice"
              variant="outlined"
              value={idData.sales_invoice}
            />
          </Grid>
          <Grid item xs={12}>
            <TextField
              fullWidth
              size="small"
              label="Customer"
              variant="outlined"
              value={idData.customer}
            />
          </Grid>
          <Grid item xs={12}>
            <TextField
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
            <TextField
              fullWidth
              name="lr_number"
              size="small"
              label="LR Number"
              variant="outlined"
              value={
                inputValue.lr_number ? inputValue.lr_number : idData.lr_number
              }
              onChange={handleInputChange}
            />
          </Grid>
          <Grid item xs={12}>
            <TextField
              fullWidth
              type={"date"}
              name="lr_date"
              size="small"
              label="LR Date"
              variant="outlined"
              value={inputValue.lr_date ? inputValue.lr_date : idData.lr_date}
              onChange={handleInputChange}
              InputLabelProps={{
                shrink: true,
              }}
            />
          </Grid>
          {userData.groups.toString() !== "Customer Service" && (
            <Grid item xs={12}>
              <label>LR Copy : </label>
              <input
                type={"file"}
                name="file"
                // value={lrCopy ? lrCopy : idData.lr_copy}
                onChange={handleImageLRCopy}
              />
              <img
                src={lrCopyImage ? lrCopyImage : idData.lr_copy}
                alt="image"
                height="50px"
                width="50px"
              />
            </Grid>
          )}
          {userData.groups.toString() === "Customer Service" && (
            <Grid item xs={12}>
              <label>POD Copy : </label>
              <input
                type={"file"}
                name="file"
                // value={podCopy ? podCopy : idData.pod_copy}
                onChange={handleImagePODCopy}
              />
              <img
                src={podCopyImage ? podCopyImage : idData.pod_copy}
                alt="image"
                height="50px"
                width="50px"
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
    </div>
  );
};
