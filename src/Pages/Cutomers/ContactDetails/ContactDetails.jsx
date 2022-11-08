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
  TextField,
  TableCell,
  Button,
} from "@mui/material";
import { tableCellClasses } from "@mui/material/TableCell";

import { Popup } from "./../../../Components/Popup";
import { CreateContactDetails } from "./CreateContactDetails";
import { UpdateContactDetails } from "./UpdateContactDetails";
import CustomerServices from "../../../services/CustomerService";

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

export const ContactDetails = (props) => {
  const { recordForEdit } = props;
  const [openPopup, setOpenPopup] = useState(false);
  const [openPopup2, setOpenPopup2] = useState(false);
  const [open, setOpen] = useState(false);
  const [inputValue, setInputValue] = useState([]);
  const [IDForEdit, setIDForEdit] = useState(null);

  // const getResetData = () => {
  //   setSearchQuery("");
  //   // getUnits();
  // };

  const openInPopup = (item) => {
    setIDForEdit(item);
    setOpenPopup(true);
  };

  useEffect(() => {
    getAllContactDetailsByID();
  }, []);

  const getAllContactDetailsByID = async () => {
    try {
      setOpen(true);
      const response = await CustomerServices.getCompanyDataById(recordForEdit);
      console.log("response", response);
      setInputValue(response.data.contacts);

      setOpen(false);
    } catch (err) {
      setOpen(false);
      console.log("company data by id error", err);
    }
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
              Contact Details
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
                <StyledTableCell align="center">NAME</StyledTableCell>
                <StyledTableCell align="center">COMPANY NAME</StyledTableCell>
                <StyledTableCell align="center">DESIGNATION</StyledTableCell>
                <StyledTableCell align="center">CONTACT</StyledTableCell>
                <StyledTableCell align="center">ALT. CONTACT</StyledTableCell>
                <StyledTableCell align="center">Action</StyledTableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {inputValue.map((row, i) => {
                return (
                  <StyledTableRow>
                    <StyledTableCell align="center">{row.name}</StyledTableCell>
                    <StyledTableCell align="center">
                      {row.company}
                    </StyledTableCell>
                    <StyledTableCell align="center">
                      {row.designation}
                    </StyledTableCell>
                    <StyledTableCell align="center">
                      {row.contact}
                    </StyledTableCell>
                    <StyledTableCell align="center">
                      {row.alternate_contact}
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
        title={"Create Contact Details"}
        openPopup={openPopup2}
        setOpenPopup={setOpenPopup2}
      >
        <CreateContactDetails setOpenPopup={setOpenPopup2} />
      </Popup>
      <Popup
        title={"Update Contact Details"}
        openPopup={openPopup}
        setOpenPopup={setOpenPopup}
      >
        <UpdateContactDetails
          setOpenPopup={setOpenPopup}
          IDForEdit={IDForEdit || null}
          getAllContactDetailsByID={getAllContactDetailsByID}
        />
      </Popup>
    </>
  );
};
