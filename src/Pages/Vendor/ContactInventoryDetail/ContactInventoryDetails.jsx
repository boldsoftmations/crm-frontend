import React, { useState } from "react";

import { Box, Grid, Button } from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import { Popup } from "./../../../Components/Popup";

import { CustomLoader } from "../../../Components/CustomLoader";
import { CreateContactInventoryDetails } from "./CreateContactInventoryDetails";
import { UpdateContactInventoryDetails } from "./UpdateContactInventoryDetails";
import { CustomTable } from "../../../Components/CustomTable";

export const ContactInventoryDetails = (props) => {
  const { contactData, getAllVendorDetailsByID, open, vendorData } = props;
  const [openPopup, setOpenPopup] = useState(false);
  const [openPopup2, setOpenPopup2] = useState(false);
  const [IDForEdit, setIDForEdit] = useState();

  const openInPopup = (item) => {
    const matchedContact = contactData.find(
      (contact) => contact.id === item.id
    );
    setIDForEdit(matchedContact);
    setOpenPopup(true);
  };

  const Tabledata = contactData.map((row) => ({
    id: row.id,
    name: row.name,
    vendor: row.vendor,
    designation: row.designation,
    contact: row.contact,
    alternate_contact: row.alternate_contact,
  }));

  const Tableheaders = [
    "ID",
    "Name",
    "Company",
    "Designation",
    "Contact",
    "Alt. Contact",
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
              Contact Details
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
          data={Tabledata}
          openInPopup={openInPopup}
          openInPopup2={null}
          openInPopup3={null}
          openInPopup4={null}
        />
      </Grid>
      <Popup
        title={"Create Contact Details"}
        openPopup={openPopup2}
        setOpenPopup={setOpenPopup2}
      >
        <CreateContactInventoryDetails
          vendorData={vendorData}
          getAllVendorDetailsByID={getAllVendorDetailsByID}
          setOpenPopup={setOpenPopup2}
        />
      </Popup>
      <Popup
        title={"Update Contact Details"}
        openPopup={openPopup}
        setOpenPopup={setOpenPopup}
      >
        <UpdateContactInventoryDetails
          vendorData={vendorData}
          setOpenPopup={setOpenPopup}
          IDForEdit={IDForEdit}
          getAllVendorDetailsByID={getAllVendorDetailsByID}
        />
      </Popup>
    </>
  );
};
