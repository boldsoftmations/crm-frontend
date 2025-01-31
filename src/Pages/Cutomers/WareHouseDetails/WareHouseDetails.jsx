import React, { useEffect, useState } from "react";

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
import { Popup } from "./../../../Components/Popup";
import { CreateWareHouseDetails } from "./CreateWareHouseDetails";
import { UpdateWareHouseDetails } from "./UpdateWareHouseDetails";
import { CustomLoader } from "../../../Components/CustomLoader";
import { useSelector } from "react-redux";
import CustomerServices from "../../../services/CustomerService";

const StyledTableCell = styled(TableCell)(({ theme }) => ({
  [`&.${tableCellClasses.head}`]: {
    fontSize: 12,
    backgroundColor: "#006BA1",
    color: theme.palette.common.white,
    fontWeight: "bold",
    textTransform: "uppercase",
    padding: 5,
  },
  [`&.${tableCellClasses.body}`]: {
    fontSize: 13,
    padding: 5,
  },
}));
const StyledTableRow = styled(TableRow)(({ theme }) => ({
  "&:nth-of-type(odd)": {
    backgroundColor: theme.palette.action.hover,
  },
  "&:last-child td, &:last-child th": {
    border: 0,
  },
}));
export const WareHouseDetails = ({ recordForEdit }) => {
  const [open, setOpen] = useState(false);
  const [openPopup, setOpenPopup] = useState(false);
  const [openPopup2, setOpenPopup2] = useState(false);
  const [wareHousedata, setWareHouseData] = useState([]);
  const [contactData, setContactData] = useState([]);
  const data = useSelector((state) => state.auth);
  const userData = data.profile;
  const [IDForEdit, setIDForEdit] = useState();

  // Fetch company details based on the active tab when the component mounts or the active tab changes
  useEffect(() => {
    if (recordForEdit) {
      getAllCompanyDetailsByID();
    }
  }, [recordForEdit]);

  // API call to fetch company details based on type
  const getAllCompanyDetailsByID = async () => {
    try {
      setOpen(true);
      const [contactResponse, warehouseResponse] = await Promise.all([
        CustomerServices.getCompanyDataByIdWithType(recordForEdit, "contacts"),
        CustomerServices.getCompanyDataByIdWithType(recordForEdit, "warehouse"),
      ]);
      setContactData(contactResponse.data.contacts);
      setWareHouseData(warehouseResponse.data.warehouse);

      setOpen(false);
    } catch (err) {
      setOpen(false);
      console.log("company data by id error", err);
    }
  };

  const openInPopup = (item) => {
    setIDForEdit(item);
    setOpenPopup(true);
  };

  return (
    <>
      <CustomLoader open={open} />

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
            {/* <CustomTextField
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
              WareHouse Details
            </h3>
          </Box>
          <Box flexGrow={0.5} align="right">
            {(userData.groups.includes("Accounts") ||
              userData.groups.includes("Director")) && (
              <Button
                onClick={() => setOpenPopup2(true)}
                variant="contained"
                color="success"
                // startIcon={<AddIcon />}
              >
                Add
              </Button>
            )}
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
              {wareHousedata &&
                wareHousedata.map((row, i) => {
                  return (
                    <StyledTableRow>
                      <StyledTableCell align="center">
                        {row.contact_number}
                      </StyledTableCell>

                      <StyledTableCell align="center">
                        {row.state}
                      </StyledTableCell>
                      <StyledTableCell align="center">
                        {row.city}
                      </StyledTableCell>
                      <StyledTableCell align="center">
                        {row.pincode}
                      </StyledTableCell>
                      <StyledTableCell align="center">
                        {(userData.groups.includes("Accounts") ||
                          userData.groups.includes("Director")) && (
                          <Button
                            variant="contained"
                            onClick={() => openInPopup(row.id)}
                          >
                            View
                          </Button>
                        )}
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
        <CreateWareHouseDetails
          getAllCompanyDetailsByID={getAllCompanyDetailsByID}
          setOpenPopup={setOpenPopup2}
          contactData={contactData}
        />
      </Popup>
      <Popup
        title={"Update WareHouse Details"}
        openPopup={openPopup}
        setOpenPopup={setOpenPopup}
      >
        <UpdateWareHouseDetails
          contactData={contactData}
          IDForEdit={IDForEdit}
          setOpenPopup={setOpenPopup}
          getAllCompanyDetailsByID={getAllCompanyDetailsByID}
        />
      </Popup>
    </>
  );
};
