import { Button, Divider, Grid } from "@mui/material";
import React, { useState, useRef } from "react";
import ProductService from "../../services/ProductService";
import { useNotificationHandling } from "../../Components/useNotificationHandling ";
import { MessageAlert } from "../../Components/MessageAlert";
import { CustomLoader } from "../../Components/CustomLoader";

const UploadCSV = ({ setOpenCSVFile, getProduct }) => {
  const [open, setOpen] = useState(false);
  const fileInputRef = useRef(null);
  const [file, setFile] = useState(null);
  const { handleSuccess, handleError, handleCloseSnackbar, alertInfo } =
    useNotificationHandling();

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
      handleError("Please select a csv file");
      return false;
    }
    const formData = new FormData();
    formData.append("file", file);
    try {
      setOpen(true);
      await ProductService.uploadCSVFile(formData);
      handleSuccess("File uploaded successfully");
      setTimeout(() => {
        setOpenCSVFile(false);
        getProduct();
      }, 500);
    } catch (error) {
      console.error("Error uploading file:", error);
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

      <Grid item sx={12} width={{ width: "400px" }}>
        <form onSubmit={UploadCSVfile}>
          <Grid container spacing={2}>
            <Grid item xs={12} sm={12}>
              <Button
                variant="text"
                color="primary"
                onClick={handleButtonClick}
              >
                Choose the csv file
              </Button>
              {file && <storng>{file.name}</storng>}
              <input
                type="file"
                ref={fileInputRef}
                onChange={handleFileChange}
                accept=".csv"
                style={{ display: "none" }}
              />
              <Divider></Divider>
            </Grid>

            <Grid item xs={12} sm={12}>
              <Button type="submit" variant="contained" color="primary">
                Upload CSV
              </Button>
            </Grid>
          </Grid>
        </form>
      </Grid>
    </>
  );
};

export default UploadCSV;
