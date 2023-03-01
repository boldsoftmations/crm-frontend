import React, { useState, useEffect } from "react";

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
import { tableCellClasses } from "@mui/material/TableCell";
import { Popup } from "../../../Components/Popup";
import { CreateSecurityChequesDetails } from "./CreateSecurityChequesDetails";
import { UpdateSecurityChequesDetails } from "./UpdateSecurityChequesDetails";
import { CustomLoader } from "../../../Components/CustomLoader";

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

export const SecurityChequesDetails = (props) => {
  const { securityChequedata, getAllCompanyDetailsByID, open } = props;
  const [openPopup, setOpenPopup] = useState(false);
  const [openPopup2, setOpenPopup2] = useState(false);
  const [IDForEdit, setIDForEdit] = useState();

  // const [recordForEdit, setRecordForEdit] = useState(null);

  // const getResetData = () => {
  //   setSearchQuery("");
  //   // getUnits();
  // };

  const openInPopup = (item) => {
    setIDForEdit(item);
    setOpenPopup(true);
  };

  return (
    <>
      <div>
        <CustomLoader open={open} />
      </div>

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
              Security Cheques Details
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
                <StyledTableCell align="center">COMPANY</StyledTableCell>
                <StyledTableCell align="center">BANK</StyledTableCell>
                <StyledTableCell align="center">CHEQUE NO.</StyledTableCell>
                <StyledTableCell align="center">MICR CODE.</StyledTableCell>
                <StyledTableCell align="center">ADDRESS</StyledTableCell>
                <StyledTableCell align="center">Action</StyledTableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {securityChequedata.map((row, i) => {
                return (
                  <StyledTableRow>
                    <StyledTableCell align="center">
                      {row.company}
                    </StyledTableCell>

                    <StyledTableCell align="center">
                      {row.bank_name}
                    </StyledTableCell>
                    <StyledTableCell align="center">
                      {row.cheque_no}
                    </StyledTableCell>
                    <StyledTableCell align="center">
                      {row.micr_code}
                    </StyledTableCell>
                    <StyledTableCell align="center">
                      {row.address}
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
        title={"Create Security Cheques Details"}
        openPopup={openPopup2}
        setOpenPopup={setOpenPopup2}
      >
        <CreateSecurityChequesDetails
          getAllCompanyDetailsByID={getAllCompanyDetailsByID}
          setOpenPopup={setOpenPopup2}
        />
      </Popup>
      <Popup
        title={"Update Security Cheques Details"}
        openPopup={openPopup}
        setOpenPopup={setOpenPopup}
      >
        <UpdateSecurityChequesDetails
          IDForEdit={IDForEdit}
          getAllCompanyDetailsByID={getAllCompanyDetailsByID}
          setOpenPopup={setOpenPopup}
        />
      </Popup>
    </>
  );
};
