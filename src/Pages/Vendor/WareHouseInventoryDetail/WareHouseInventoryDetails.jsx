import React, { useState } from "react";

import { Box, Grid, Button } from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import { Popup } from "./../../../Components/Popup";
import { CustomLoader } from "../../../Components/CustomLoader";
import { CreateWareHouseInventoryDetails } from "./CreateWareHouseDetails";
import { UpdateWareHouseInventoryDetails } from "./UpdateWareHouseInventoryDetails";
import { CustomTable } from "../../../Components/CustomTable";

export const WareHouseInventoryDetails = (props) => {
  const {
    getAllVendorDetailsByID,
    wareHousedata,
    open,
    contactData,
    vendorData,
  } = props;
  const [openPopup, setOpenPopup] = useState(false);
  const [openPopup2, setOpenPopup2] = useState(false);

  const [IDForEdit, setIDForEdit] = useState();

  const openInPopup = (item) => {
    const matchedWarehouse = wareHousedata.find(
      (warehouse) => warehouse.id === item.id
    );
    setIDForEdit(matchedWarehouse);
    setOpenPopup(true);
  };

  const Tabledata = wareHousedata.map((row) => ({
    id: row.id,
    contact_number: row.contact_number,
    state: row.state,
    pincode: row.pincode,
  }));

  const Tableheaders = ["ID", "Contact", "State", "Pin Code", "Action"];
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
              WareHouse Details
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
        title={"Create WareHouse Details"}
        openPopup={openPopup2}
        setOpenPopup={setOpenPopup2}
      >
        <CreateWareHouseInventoryDetails
          vendorData={vendorData}
          getAllVendorDetailsByID={getAllVendorDetailsByID}
          setOpenPopup={setOpenPopup2}
          contactData={contactData}
        />
      </Popup>
      <Popup
        title={"Update WareHouse Details"}
        openPopup={openPopup}
        setOpenPopup={setOpenPopup}
      >
        <UpdateWareHouseInventoryDetails
          vendorData={vendorData}
          contactData={contactData}
          IDForEdit={IDForEdit}
          setOpenPopup={setOpenPopup}
          getAllVendorDetailsByID={getAllVendorDetailsByID}
        />
      </Popup>
    </>
  );
};
