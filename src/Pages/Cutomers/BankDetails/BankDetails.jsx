import React, { useState } from "react";

import {
  Backdrop,
  Box,
  CircularProgress,
  Grid,
  Paper,
  styled,
  Table,
  TableBody,
  TableContainer,
  TableHead,
  TableRow,
  TextField,
  TableCell,
} from "@mui/material";
import { tableCellClasses } from "@mui/material/TableCell";

import { Button } from "@mui/material";
import { Popup } from "./../../../Components/Popup";
import { CreateBankDetails } from "./CreateBankDetails";
import { UpdateBankDetails } from "./UpdateBankDetails";

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

export const BankDetails = () => {
  const [openPopup, setOpenPopup] = useState(false);
  const [openPopup2, setOpenPopup2] = useState(false);
  const [open, setOpen] = useState(false);

  // const [recordForEdit, setRecordForEdit] = useState(null);

  // const getResetData = () => {
  //   setSearchQuery("");
  //   // getUnits();
  // };

  const openInPopup = (item) => {
    // setRecordForEdit(item);
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
        <Paper sx={{ p: 2, m: 4, display: "flex", flexDirection: "column" }}>
          <Box display="flex">
            <Box flexGrow={0.9}>
              <TextField
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
              </Button>
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
                Bank Details
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
            <Table
              sx={{ minWidth: 700 }}
              stickyHeader
              aria-label="sticky table"
            >
              <TableHead>
                <TableRow>
                  <StyledTableCell align="center">ID</StyledTableCell>
                  <StyledTableCell align="center">BANK</StyledTableCell>
                  <StyledTableCell align="center">BRANCH</StyledTableCell>
                  <StyledTableCell align="center">ACCOUNT NO.</StyledTableCell>
                  <StyledTableCell align="center">IFSC CODE</StyledTableCell>
                  <StyledTableCell align="center">Action</StyledTableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {/* {unit.map((row, i) => {
                  return ( */}
                <StyledTableRow>
                  <StyledTableCell align="center">1</StyledTableCell>
                  <StyledTableCell align="center">SBI Bank</StyledTableCell>
                  <StyledTableCell align="center">Andheri</StyledTableCell>
                  <StyledTableCell align="center">A1293238DHSA</StyledTableCell>
                  <StyledTableCell align="center">ABDS000021</StyledTableCell>

                  <StyledTableCell align="center">
                    <Button variant="contained" onClick={() => openInPopup(1)}>
                      View
                    </Button>
                  </StyledTableCell>
                </StyledTableRow>
                {/* );  })} */}
              </TableBody>
            </Table>
          </TableContainer>
        </Paper>
      </Grid>
      <Popup
        maxWidth={"lg"}
        title={"Create Bank Details"}
        openPopup={openPopup2}
        setOpenPopup={setOpenPopup2}
      >
        <CreateBankDetails setOpenPopup={setOpenPopup2} />
      </Popup>
      <Popup
        title={"Update Bank Details"}
        openPopup={openPopup}
        setOpenPopup={setOpenPopup}
      >
        <UpdateBankDetails setOpenPopup={setOpenPopup} />
      </Popup>
    </>
  );
};
