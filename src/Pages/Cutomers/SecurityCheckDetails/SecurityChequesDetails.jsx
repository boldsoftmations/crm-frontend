import React, { useState, useEffect } from "react";

import {
  Backdrop,
  Box,
  CircularProgress,
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
  const { securityChequedata,getSecurityChequeDetailsByID,open } = props;
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
        <Backdrop
          sx={{ color: "#fff", zIndex: (theme) => theme.zIndex.drawer + 1 }}
          open={open}
        >
          <CircularProgress color="inherit" />
        </Backdrop>
      </div>

      <Grid item xs={12}>
        {/* <p
          style={{
            width: "100%",
            padding: 10,
            marginBottom: 10,
            borderRadius: 4,
            backgroundColor: errMsg ? "red" : "offscreen",
            textAlign: "center",
            color: "white",
            textTransform: "capitalize",
          }}
          ref={errRef}
          className={errMsg ? "errmsg" : "offscreen"}
          aria-live="assertive"
        >
          {errMsg}
        </p> */}
        {/* <Paper sx={{ p: 2, m: 4, display: "flex", flexDirection: "column" }}> */}
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
            </Button>
            <Button
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
        <TableContainer sx={{ maxHeight: 440 }}>
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
          getSecurityChequeDetailsByID={getSecurityChequeDetailsByID}
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
          getSecurityChequeDetailsByID={getSecurityChequeDetailsByID}
          setOpenPopup={setOpenPopup}
        />
      </Popup>
    </>
  );
};
