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
import { CreateBankInventoryDetails } from "./CreateBankInventoryDetails";
import { UpdateBankInventoryDetails } from "./UpdateBankInventoryDetails";

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

export const BankInventoryDetails = (props) => {
  const { bankData, vendorData, open, getAllVendorDetailsByID } = props;
  const [openPopup, setOpenPopup] = useState(false);
  const [openPopup2, setOpenPopup2] = useState(false);
  const [idForEdit, setIDForEdit] = useState();

  const openInPopup = (item) => {
    setIDForEdit(item);
    setOpenPopup(true);
  };

  console.log("bankData :>> ", bankData);
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
                <StyledTableCell align="center">ID</StyledTableCell>
                <StyledTableCell align="center">BANK</StyledTableCell>
                <StyledTableCell align="center">ACCOUNT NO.</StyledTableCell>
                <StyledTableCell align="center">
                  {vendorData.type === "Domestic" ? "IFSC CODE" : "SWIFT CODE"}
                </StyledTableCell>
                <StyledTableCell align="center">BRANCH</StyledTableCell>
                <StyledTableCell align="center">Action</StyledTableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {bankData.map((row, i) => {
                return (
                  <StyledTableRow key={i}>
                    <StyledTableCell align="center">{row.id}</StyledTableCell>
                    <StyledTableCell align="center">
                      {row.bank_name}
                    </StyledTableCell>
                    <StyledTableCell align="center">
                      {row.current_account_no}
                    </StyledTableCell>
                    <StyledTableCell align="center">
                      {row.ifsc_code}
                    </StyledTableCell>
                    <StyledTableCell align="center">
                      {row.branch}
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
