import React, { useState, useEffect,useRef } from "react";

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
  Paper,
} from "@mui/material";
import { tableCellClasses } from "@mui/material/TableCell";
import { Popup } from "./../../../Components/Popup";
import { CreateSellerAccounts } from './CreateSellerAccounts';
import { UpdateSellerAccounts } from './UpdateSellerAccounts';
import InvoiceServices from './../../../services/InvoiceService';
import { ErrorMessage } from './../../../Components/ErrorMessage/ErrorMessage';

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
          <TableContainer sx={{ maxHeight: 440 }}>
            <Table sx={{ minWidth: 1200 }} stickyHeader aria-label="sticky table">
              <TableHead>
                <TableRow>
                  <StyledTableCell align="center">COMPANY NAME</StyledTableCell>
                  <StyledTableCell align="center">BANK</StyledTableCell>
                  <StyledTableCell align="center">ACCOUNT NO.</StyledTableCell>
                  <StyledTableCell align="center">IFSC CODE</StyledTableCell>
                  <StyledTableCell align="center">BRANCH</StyledTableCell>
                  <StyledTableCell align="center">GST NUMBER</StyledTableCell>
                  <StyledTableCell align="center">Action</StyledTableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {invoiceData.map((row, i) => {
                  return (
                    <StyledTableRow key={i}>
                      <StyledTableCell align="center">{row.name}</StyledTableCell>
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
                        {row.gst_number}
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
    </Paper>
    </Grid>
        <Popup
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
}
