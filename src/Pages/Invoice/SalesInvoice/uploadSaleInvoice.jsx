import { Button, Divider, Grid } from "@mui/material";
import React, { useState, useRef } from "react";
import CustomSnackbar from "../../../Components/CustomerSnackbar";
import { CustomLoader } from "../../../Components/CustomLoader";
import InvoiceServices from "../../../services/InvoiceService";

const UploadSalesInvoice = ({
  idForEdit,
  setOpenSalesPopUpFile,
  getProduct,
}) => {
  console.log("idForEdit", idForEdit);
  const [open, setOpen] = useState(false);
  const fileInputRef = useRef(null);
  const [file, setFile] = useState(null);

  const [alertmsg, setAlertMsg] = useState({
    message: "",
    severity: "",
    open: false,
  });
  const handleClose = () => {
    setAlertMsg({ open: false });
  };
  //function for choosing file
  const handleButtonClick = () => {
    fileInputRef.current.click();
  };
  //function for handling file change
  const handleFileChange = (event) => {
    setFile(event.target.files[0]);
    console.log(event.target.files[0]);
  };

  //function for submitting files
  const UploadCSVfile = async (e) => {
    e.preventDefault();
    if (!file) {
      setAlertMsg({
        message: "Please select a file to upload",
        severity: "error",
        open: true,
      });
      return false;
    }
    const formData = new FormData();
    formData.append("file", file);
    formData.append("invoice_no", idForEdit.invoice_no);
    formData.append("company", idForEdit.company);
    try {
      setOpen(true);
      await InvoiceServices.uploadSalesinvoice(formData);
      setAlertMsg({
        message: "Sales Invoice  uploaded successfully",
        severity: "success",
        open: true,
      });
      setTimeout(() => {
        setOpenSalesPopUpFile(false);
        getProduct();
      }, 500);
    } catch (error) {
      setAlertMsg({
        message: error.message || "Error uploading Sales Invoice",
        severity: "error",
        open: true,
      });
      console.error("Error uploading file:", error);
    } finally {
      setOpen(false);
    }
  };
  return (
    <>
      <CustomSnackbar
        open={alertmsg.open}
        message={alertmsg.message}
        severity={alertmsg.severity}
        onClose={handleClose}
      />
      <CustomLoader open={open} />

      <Grid item sx={12} width={{ width: "400px" }}>
        <form onSubmit={UploadCSVfile}>
          <Grid container spacing={2}>
            <Grid item xs={12} sm={12}>
              <Button
                variant="text"
                color="primary"
                onClick={handleButtonClick}
              >
                Choose the file
              </Button>
              {file && <storng>{file.name}</storng>}
              <input
                type="file"
                ref={fileInputRef}
                onChange={handleFileChange}
                accept=".pdf"
                style={{ display: "none" }}
              />
              <Divider></Divider>
            </Grid>

            <Grid item xs={12} sm={12}>
              <Button
                type="submit"
                size="small"
                variant="contained"
                color="primary"
              >
                Submit
              </Button>
            </Grid>
          </Grid>
        </form>
      </Grid>
    </>
  );
};

export default UploadSalesInvoice;
