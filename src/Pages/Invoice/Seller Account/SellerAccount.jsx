import React, { useState, useEffect, useRef } from "react";
import { Box, Grid, Button, Paper } from "@mui/material";
import { Popup } from "./../../../Components/Popup";
import { CreateSellerAccounts } from "./CreateSellerAccounts";
import { UpdateSellerAccounts } from "./UpdateSellerAccounts";
import InvoiceServices from "./../../../services/InvoiceService";
import { ErrorMessage } from "./../../../Components/ErrorMessage/ErrorMessage";
import { CustomTable } from "../../../Components/CustomTable";
import { CustomLoader } from "../../../Components/CustomLoader";

export const SellerAccount = () => {
  const [openPopup, setOpenPopup] = useState(false);
  const [openPopup2, setOpenPopup2] = useState(false);
  const [idForEdit, setIDForEdit] = useState();
  const errRef = useRef();
  const [open, setOpen] = useState(false);
  const [errMsg, setErrMsg] = useState("");
  const [invoiceData, setInvoiceData] = useState([]);
  useEffect(() => {
    getAllSellerAccountsDetails();
  }, []);

  const getAllSellerAccountsDetails = async () => {
    try {
      setOpen(true);
      const response = await InvoiceServices.getAllSellerAccountData();
      setInvoiceData(response.data.results);
      setOpen(false);
    } catch (err) {
      setOpen(false);
      if (!err.response) {
        setErrMsg(
          "“Sorry, You Are Not Allowed to Access This Page” Please contact to admin"
        );
      } else if (err.response.status === 400) {
        setErrMsg(
          err.response.data.errors.name
            ? err.response.data.errors.name
            : err.response.data.errors.non_field_errors
        );
      } else if (err.response.status === 401) {
        setErrMsg(err.response.data.errors.code);
      } else {
        setErrMsg("Server Error");
      }
      errRef.current.focus();
    }
  };

  // const getResetData = () => {
  //   setSearchQuery("");
  //   // getUnits();
  // };

  const openInPopup = (item) => {
    setIDForEdit(item.id);
    setOpenPopup(true);
  };

  const TableHeader = [
    "ID",
    "UNIT",
    "COMPANY",
    "BANK",
    "ACCOUNT NO.",
    "IFSC CODE",
    "BRANCH",
    "GST",
    "ACTION",
  ];

  const TableData = invoiceData.map((value) => ({
    id: value.id,
    unit: value.unit,
    company: value.name,
    bank: value.bank_name,
    current_account_no: value.current_account_no,
    ifsc_code: value.ifsc_code,
    branch: value.branch,
    gst_number: value.gst_number,
  }));

  return (
    <>
      <CustomLoader open={open} />

      <Grid item xs={12}>
        <ErrorMessage errRef={errRef} errMsg={errMsg} />
        <Paper sx={{ p: 2, m: 4, display: "flex", flexDirection: "column" }}>
          <Box display="flex">
            <Box flexGrow={2}>
              {/* <TextField
                // value={searchQuery}
                // onChange={(e) => setSearchQuery(e.target.value)}
                name="search"
                size="small"
                label="Search"
                variant="outlined"
                sx={{ backgroundColor: "#ffffff" }}
              />
  
              <Button
                // onClick={getSearchData}
                size="medium"
                sx={{ marginLeft: "1em" }}
                variant="contained"
                // startIcon={<SearchIcon />}
              >
                Search
              </Button> */}
              {/* <Button
                // onClick={getResetData}
                sx={{ marginLeft: "1em" }}
                size="medium"
                variant="contained"
              >
                Reset
              </Button> */}
            </Box>
            <Box flexGrow={2}>
              <h3
                style={{
                  textAlign: "left",
                  marginBottom: "1em",
                  fontSize: "24px",
                  color: "rgb(34, 34, 34)",
                  fontWeight: 800,
                }}
              >
                Seller Accounts Details
              </h3>
            </Box>
            <Box flexGrow={0.5} align="right">
              <Button
                onClick={() => setOpenPopup2(true)}
                variant="contained"
                color="success"
                // startIcon={<AddIcon />}
              >
                Add
              </Button>
            </Box>
          </Box>
          {/* CustomTable */}
          <CustomTable
            headers={TableHeader}
            data={TableData}
            openInPopup={openInPopup}
          />
        </Paper>
      </Grid>
      <Popup
        maxWidth={"xl"}
        title={"Create Seller Accounts Details"}
        openPopup={openPopup2}
        setOpenPopup={setOpenPopup2}
      >
        <CreateSellerAccounts
          setOpenPopup={setOpenPopup2}
          getAllSellerAccountsDetails={getAllSellerAccountsDetails}
        />
      </Popup>
      <Popup
        maxWidth={"xl"}
        title={"Update Seller Accounts Details"}
        openPopup={openPopup}
        setOpenPopup={setOpenPopup}
      >
        <UpdateSellerAccounts
          setOpenPopup={setOpenPopup}
          getAllSellerAccountsDetails={getAllSellerAccountsDetails}
          idForEdit={idForEdit}
        />
      </Popup>
    </>
  );
};
