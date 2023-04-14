import React, { useState, useRef, useEffect } from "react";
import {
  Box,
  Grid,
  Paper,
  styled,
  Table,
  TableBody,
  TableContainer,
  TableHead,
  TableRow,
  TableCell,
  Button,
  TableFooter,
  Pagination,
  Chip,
} from "@mui/material";
import { tableCellClasses } from "@mui/material/TableCell";
import { Popup } from "../../../Components/Popup";
import { ErrorMessage } from "../../../Components/ErrorMessage/ErrorMessage";
import { CustomSearch } from "../../../Components/CustomSearch";
import { useDispatch } from "react-redux";
import { getSellerAccountData } from "../../../Redux/Action/Action";
import InvoiceServices from "../../../services/InvoiceService";
import { CustomLoader } from "../../../Components/CustomLoader";
import { CreateVendorDetails } from "./CreateVendorDetails";
import { UpdateAllVendorDetails } from "./UpdateAllVendorDetails";
import InventoryServices from "../../../services/InventoryService";
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

export const VendorView = () => {
  const dispatch = useDispatch();
  const [openPopup, setOpenPopup] = useState(false);
  const [openPopup2, setOpenPopup2] = useState(false);
  const [open, setOpen] = useState(false);
  const errRef = useRef();
  const [errMsg, setErrMsg] = useState("");
  const [vendorData, setVendorData] = useState([]);
  const [recordForEdit, setRecordForEdit] = useState();
  const [pageCount, setpageCount] = useState(0);
  const [currentPage, setCurrentPage] = useState(0);
  const [filterSelectedQuery, setFilterSelectedQuery] = useState("");

  const handleInputChange = (event) => {
    const inputValue = event.target.value;
    setFilterSelectedQuery(inputValue);
    getSearchData(inputValue);
  };

  useEffect(() => {
    getAllSellerAccountsDetails();
  }, []);

  const getAllSellerAccountsDetails = async () => {
    try {
      setOpen(true);
      const response = await InvoiceServices.getAllPaginateSellerAccountData(
        "all"
      );
      dispatch(getSellerAccountData(response.data));
      setOpen(false);
    } catch (err) {
      setOpen(false);
    }
  };

  useEffect(() => {
    getAllVendorDetails();
  }, []);

  const getAllVendorDetails = async () => {
    try {
      setOpen(true);
      const response = currentPage
        ? await InventoryServices.getVendorPaginateData(currentPage)
        : await InventoryServices.getAllVendorData();
      setVendorData(response.data.results);
      const total = response.data.count;
      setpageCount(Math.ceil(total / 25));
    } catch (err) {
      if (!err.response) {
        setErrMsg(
          "“Sorry, You Are Not Allowed to Access This Page” Please contact to admin"
        );
      } else if (err.response.status === 400) {
        setErrMsg(
          err.response.data.errors.name ||
            err.response.data.errors.non_field_errors
        );
      } else if (err.response.status === 401) {
        setErrMsg(err.response.data.errors.code);
      } else if (err.response.status === 404 || !err.response.data) {
        setErrMsg("Data not found or request was null/empty");
      } else {
        setErrMsg("Server Error");
      }
    } finally {
      setOpen(false);
    }
  };

  const getSearchData = async (value) => {
    try {
      setOpen(true);
      const filterSearch = value;
      if (filterSearch !== "") {
        const response = await InventoryServices.getAllSearchVendorData(
          filterSearch
        );
        setVendorData(response.data.results);
        const total = response.data.count;
        setpageCount(Math.ceil(total / 25));
      } else {
        await getAllVendorDetails();
        setFilterSelectedQuery("");
      }
    } catch (error) {
      console.log("error Search leads", error);
    } finally {
      setOpen(false);
    }
  };

  const handlePageClick = async (event, value) => {
    try {
      const page = value;
      setCurrentPage(page);
      setOpen(true);

      const response = filterSelectedQuery
        ? await InventoryServices.getAllVendorDataPaginate(
            page,
            filterSelectedQuery
          )
        : await InventoryServices.getVendorPaginateData(page);

      if (response) {
        setVendorData(response.data.results);
        const total = response.data.count;
        setpageCount(Math.ceil(total / 25));
      } else {
        await getAllVendorDetails();
        setFilterSelectedQuery("");
      }
    } catch (error) {
      console.log("error", error);
    } finally {
      setOpen(false);
    }
  };

  const getResetData = async () => {
    setFilterSelectedQuery("");
    await getAllVendorDetails();
  };

  const openInPopup = (item) => {
    setRecordForEdit(item);
    setOpenPopup(true);
  };

  return (
    <>
      <CustomLoader open={open} />

      <Grid item xs={12}>
        <ErrorMessage errRef={errRef} errMsg={errMsg} />
        <Paper sx={{ p: 2, m: 4, display: "flex", flexDirection: "column" }}>
          <Box display="flex">
            <Box flexGrow={0.9}>
              <CustomSearch
                filterSelectedQuery={filterSelectedQuery}
                handleInputChange={handleInputChange}
                getResetData={getResetData}
                HelperText={"Search By Vendor"}
              />
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
                Vendor Details
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
            <Table
              sx={{ minWidth: 700 }}
              stickyHeader
              aria-label="sticky table"
            >
              <TableHead>
                <TableRow>
                  <StyledTableCell align="center">VENDOR</StyledTableCell>
                  <StyledTableCell align="center">PAN NO.</StyledTableCell>
                  <StyledTableCell align="center">GST NO.</StyledTableCell>
                  <StyledTableCell align="center">CITY</StyledTableCell>
                  <StyledTableCell align="center">STATE</StyledTableCell>
                  {/* {users.groups.toString() !== "Sales" &&
                    users.groups.toString() !== "Customer Service" && ( */}
                  <StyledTableCell align="center">Action</StyledTableCell>
                  {/* )} */}
                </TableRow>
              </TableHead>
              <TableBody>
                {vendorData.map((row, i) => {
                  return (
                    <StyledTableRow key={i}>
                      <StyledTableCell align="center">
                        {row.name}
                      </StyledTableCell>
                      <StyledTableCell align="center">
                        {row.pan_number}
                      </StyledTableCell>
                      <StyledTableCell align="center">
                        {row.gst_number}
                      </StyledTableCell>
                      <StyledTableCell align="center">
                        {row.city}
                      </StyledTableCell>
                      <StyledTableCell align="center">
                        <Chip
                          label={row.state}
                          color="success"
                          variant="outlined"
                        />
                      </StyledTableCell>
                      {/* {users.groups.toString() !== "Sales" &&
                        users.groups.toString() !== "Customer Service" && ( */}
                      <StyledTableCell align="center">
                        <Button
                          variant="contained"
                          onClick={() => openInPopup(row.id)}
                        >
                          View
                        </Button>
                      </StyledTableCell>
                      {/* )} */}
                    </StyledTableRow>
                  );
                })}
              </TableBody>
            </Table>
          </TableContainer>
          <TableFooter
            sx={{ display: "flex", justifyContent: "center", marginTop: "2em" }}
          >
            <Pagination
              count={pageCount}
              onChange={handlePageClick}
              color={"primary"}
              variant="outlined"
              shape="circular"
            />
          </TableFooter>
        </Paper>
      </Grid>
      <Popup
        fullScreen={true}
        title={"Create Vendor Details"}
        openPopup={openPopup2}
        setOpenPopup={setOpenPopup2}
      >
        <CreateVendorDetails
          setOpenPopup={setOpenPopup2}
          getAllVendorDetails={getAllVendorDetails}
        />
      </Popup>
      <Popup
        fullScreen={true}
        title={"Update Vendor Details"}
        openPopup={openPopup}
        setOpenPopup={setOpenPopup}
      >
        <UpdateAllVendorDetails
          setOpenPopup={setOpenPopup}
          getAllVendorDetails={getAllVendorDetails}
          recordForEdit={recordForEdit}
        />
      </Popup>
    </>
  );
};
