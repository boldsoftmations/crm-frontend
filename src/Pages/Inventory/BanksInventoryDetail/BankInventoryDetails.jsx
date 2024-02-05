import React, { useState } from "react";

import { Box, Grid, Button } from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import { Popup } from "./../../../Components/Popup";
import { CustomLoader } from "../../../Components/CustomLoader";
import { CreateBankInventoryDetails } from "./CreateBankInventoryDetails";
import { UpdateBankInventoryDetails } from "./UpdateBankInventoryDetails";
import { CustomTable } from "../../../Components/CustomTable";

export const BankInventoryDetails = (props) => {
  const { bankData, vendorData, open, getAllVendorDetailsByID } = props;
  const [openPopup, setOpenPopup] = useState(false);
  const [openPopup2, setOpenPopup2] = useState(false);
  const [idForEdit, setIDForEdit] = useState();

  const openInPopup = (item) => {
    const matchedBank = bankData.find((bank) => bank.id === item.id);
    setIDForEdit(matchedBank);
    setOpenPopup(true);
  };

  const Tabledata = bankData.map((row) => ({
    id: row.id,
    bank_name: row.bank_name,
    account_no:
      vendorData.type === "Domestic" ? row.current_account_no : row.int_ca_no,
    ifsc_code: row.ifsc_code,
    branch: row.branch,
  }));

  const Tableheaders = [
    "ID",
    "Bank",
    "ACCOUNT NO",
    vendorData.type === "Domestic" ? "IFSC CODE" : "SWIFT CODE",
    "BRANCH",
    "Action",
  ];

  return (
    <>
      <CustomLoader open={open} />

      <Grid item xs={12}>
        <Box display="flex">
          <Box flexGrow={2}></Box>
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
              Bank Details
            </h3>
          </Box>
          <Box flexGrow={0.5} align="right">
            <Button
              onClick={() => setOpenPopup2(true)}
              variant="contained"
              color="success"
              startIcon={<AddIcon />}
            >
              Add
            </Button>
          </Box>
        </Box>
        <CustomTable
          headers={Tableheaders}
          data={Tabledata.map((row) => ({
            ...row,
            account_no: row.account_no,
          }))}
          openInPopup={openInPopup}
          openInPopup2={null}
          openInPopup3={null}
          openInPopup4={null}
        />
      </Grid>
      <Popup
        title={"Create Bank Details"}
        openPopup={openPopup2}
        setOpenPopup={setOpenPopup2}
      >
        <CreateBankInventoryDetails
          setOpenPopup={setOpenPopup2}
          vendorData={vendorData}
          getAllVendorDetailsByID={getAllVendorDetailsByID}
        />
      </Popup>
      <Popup
        title={"Update Bank Details"}
        openPopup={openPopup}
        setOpenPopup={setOpenPopup}
      >
        <UpdateBankInventoryDetails
          setOpenPopup={setOpenPopup}
          vendorData={vendorData}
          getAllVendorDetailsByID={getAllVendorDetailsByID}
          idForEdit={idForEdit}
        />
      </Popup>
    </>
  );
};
