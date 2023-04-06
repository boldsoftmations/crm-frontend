import React, { useState } from "react";

import {
  Box,
  Grid,
  styled,
  Table,
  TableBody,
  TableContainer,
  TableHead,
  TableRow,
  TableCell,
  Button,
} from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import { tableCellClasses } from "@mui/material/TableCell";
import { Popup } from "./../../../Components/Popup";

import { CustomLoader } from "../../../Components/CustomLoader";
import { CreateWareHouseInventoryDetails } from "./CreateWareHouseDetails";
import { UpdateWareHouseInventoryDetails } from "./UpdateWareHouseInventoryDetails";

const StyledTableCell = styled(TableCell)(({ theme }) => ({
  [`&.${tableCellClasses.head}`]: {
    backgroundColor: theme.palette.common.black,
    color: theme.palette.common.white,
  },
  [`&.${tableCellClasses.body}`]: {
    fontSize: 14,
  },
}));

const StyledTableRow = styled(TableRow)(({ theme }) => ({
  "&:nth-of-type(odd)": {
    backgroundColor: theme.palette.action.hover,
  },
  // hide last border
  "&:last-child td, &:last-child th": {
    border: 0,
  },
}));

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
    setIDForEdit(item);
    setOpenPopup(true);
  };

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
        <TableContainer
          sx={{
            maxHeight: 440,
            "&::-webkit-scrollbar": {
              width: 15,
            },
            "&::-webkit-scrollbar-track": {
              backgroundColor: "#f2f2f2",
            },
            "&::-webkit-scrollbar-thumb": {
              backgroundColor: "#aaa9ac",
            },
          }}
        >
          <Table sx={{ minWidth: 1200 }} stickyHeader aria-label="sticky table">
            <TableHead>
              <TableRow>
                <StyledTableCell align="center">CONTACT</StyledTableCell>
                <StyledTableCell align="center">STATE</StyledTableCell>
                <StyledTableCell align="center">CITY</StyledTableCell>
                <StyledTableCell align="center">PIN CODE</StyledTableCell>
                <StyledTableCell align="center">ACTION</StyledTableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {wareHousedata.map((row, i) => {
                return (
                  <StyledTableRow>
                    <StyledTableCell align="center">
                      {row.contact_number}
                    </StyledTableCell>

                    <StyledTableCell align="center">
                      {row.state}
                    </StyledTableCell>
                    <StyledTableCell align="center">{row.city}</StyledTableCell>
                    <StyledTableCell align="center">
                      {row.pincode}
                    </StyledTableCell>
                    <StyledTableCell align="center">
                      <Button
                        variant="contained"
                        onClick={() => openInPopup(row.id)}
                      >
                        View
                      </Button>
                    </StyledTableCell>
                  </StyledTableRow>
                );
              })}
            </TableBody>
          </Table>
        </TableContainer>
        {/* </Paper> */}
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
