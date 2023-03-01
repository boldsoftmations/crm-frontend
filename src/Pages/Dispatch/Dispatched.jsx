import React, { useState, useEffect, useRef } from "react";
import {
  Table,
  Typography,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  Paper,
  styled,
  Box,
  TableContainer,
  IconButton,
  Collapse,
  Button,
} from "@mui/material";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import KeyboardArrowUpIcon from "@mui/icons-material/KeyboardArrowUp";
// import { saveAs } from "file-saver";
import FileSaver from "file-saver";
import { tableCellClasses } from "@mui/material/TableCell";
import InvoiceServices from "../../services/InvoiceService";
import { CustomLoader } from "./../../Components/CustomLoader";
import { Popup } from "./../../Components/Popup";
import { UpdateDispatch } from "./UpdateDispatch";
import { CustomPagination } from "./../../Components/CustomPagination";
import { useSelector } from "react-redux";
import { CustomSearch } from "./../../Components/CustomSearch";
export const Dispatched = () => {
  const [dispatchData, setDispatchData] = useState([]);
  const [open, setOpen] = useState(false);
  const errRef = useRef();
  const [errMsg, setErrMsg] = useState("");
  const [pageCount, setpageCount] = useState(0);
  const [currentPage, setCurrentPage] = useState(0);
  const [searchQuery, setSearchQuery] = useState("");
  const data = useSelector((state) => state.auth);
  const userData = data.profile;
  useEffect(() => {
    getAllDispatchDetails();
  }, []);
  const getAllDispatchDetails = async () => {
    try {
      setOpen(true);
      if (currentPage) {
        const response = await InvoiceServices.getDispatchDataWithPagination(
          "true",
          currentPage
        );
        setDispatchData(response.data.results);
        const total = response.data.count;
        setpageCount(Math.ceil(total / 25));
      } else {
        const response = await InvoiceServices.getDispatchData("true");
        setDispatchData(response.data.results);
        const total = response.data.count;
        setpageCount(Math.ceil(total / 25));
      }
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

  const handleInputChange = (event) => {
    setSearchQuery(event.target.value);
    getSearchData(event.target.value);
  };

  const getSearchData = async (value) => {
    try {
      setOpen(true);
      const filterSearch = value;
      const response = await InvoiceServices.getDispatchDataWithSearch(
        "true",
        filterSearch
      );
      if (response) {
        setDispatchData(response.data.results);
        const total = response.data.count;
        setpageCount(Math.ceil(total / 25));
      } else {
        getAllDispatchDetails();
        setSearchQuery("");
      }
      setOpen(false);
    } catch (error) {
      console.log("error Search leads", error);
      setOpen(false);
    }
  };

  const getResetData = () => {
    setSearchQuery("");
    getAllDispatchDetails();
  };

  const handlePageClick = async (event, value) => {
    try {
      const page = value;
      setCurrentPage(page);
      setOpen(true);
      if (searchQuery) {
        const response = await InvoiceServices.getDispatchSearchWithPagination(
          "true",
          page,
          searchQuery
        );
        if (response) {
          setDispatchData(response.data.results);
          const total = response.data.count;
          setpageCount(Math.ceil(total / 25));
        } else {
          getAllDispatchDetails();
          setSearchQuery("");
        }
      } else {
        const response = await InvoiceServices.getDispatchDataWithPagination(
          "true",
          page
        );
        setDispatchData(response.data.results);
        const total = response.data.count;
        setpageCount(Math.ceil(total / 25));
      }
      setOpen(false);
    } catch (error) {
      console.log("error", error);
      setOpen(false);
    }
  };

  return (
    <div>
      <CustomLoader open={open} />
      <Paper sx={{ p: 2, m: 3, display: "flex", flexDirection: "column" }}>
        <Box display="flex">
          <Box flexGrow={2}>
            {" "}
            <CustomSearch
              filterSelectedQuery={searchQuery}
              handleInputChange={handleInputChange}
              getResetData={getResetData}
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
              Dispatched
            </h3>
          </Box>
          <Box flexGrow={0.5}></Box>
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
          <Table sx={{ minWidth: 700 }} stickyHeader aria-label="sticky table">
            <TableHead>
              <TableRow>
                <StyledTableCell align="center"></StyledTableCell>
                <StyledTableCell align="center">Sales Invoice</StyledTableCell>
                <StyledTableCell align="center">Customer</StyledTableCell>
                <StyledTableCell align="center">Date</StyledTableCell>
                <StyledTableCell align="center">
                  Dispatch Location
                </StyledTableCell>
                {userData.groups.toString() === "Customer Service" && (
                  <StyledTableCell align="center">LR COPY</StyledTableCell>
                )}
                {/* {userData.groups.toString() === "Customer Service" && (
                  <StyledTableCell align="center">POD COPY</StyledTableCell>
                )} */}
                <StyledTableCell align="center">ACTION</StyledTableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {dispatchData.map((row) => (
                <Row
                  key={row.id}
                  row={row}
                  getAllDispatchDetails={getAllDispatchDetails}
                  userData={userData}
                />
              ))}
            </TableBody>
          </Table>
        </TableContainer>
        <CustomPagination
          pageCount={pageCount}
          handlePageClick={handlePageClick}
        />
      </Paper>
    </div>
  );
};

function Row(props) {
  const { row, getAllDispatchDetails, userData } = props;
  const [open, setOpen] = useState(false);
  const [openModal, setOpenModal] = useState(false);
  const [idData, setIdData] = useState("");

  const handleChange = (row) => {
    setIdData(row);
    setOpenModal(true);
  };

  const handleClickLRCOPY = async (data) => {
    let url = data.lr_copy ? data.lr_copy : "";
    FileSaver.saveAs(url, "image");
  };

  const handleClickPODCOPY = async (data) => {
    let url = data.pod_copy ? data.pod_copy : "";
    FileSaver.saveAs(url, "image");
  };
  return (
    <>
      <TableRow sx={{ "& > *": { borderBottom: "unset" } }}>
        <TableCell>
          <IconButton
            aria-label="expand row"
            size="small"
            align="center"
            onClick={() => setOpen(!open)}
          >
            {open ? <KeyboardArrowUpIcon /> : <KeyboardArrowDownIcon />}
          </IconButton>
        </TableCell>
        <TableCell align="center">{row.sales_invoice}</TableCell>
        <TableCell align="center">{row.customer}</TableCell>
        <TableCell align="center">{row.date}</TableCell>
        <TableCell align="center">{row.dispatch_location}</TableCell>
        {userData.groups.toString() === "Customer Service" && (
          <TableCell align="center">
            <Button
              color="success"
              variant="outlined"
              onClick={() => handleClickLRCOPY(row)}
            >
              Download
            </Button>
          </TableCell>
        )}
        {/* {userData.groups.toString() === "Customer Service" && (
          <TableCell align="center">
          <Button
              variant="outlined"
              onClick={() => handleClickPODCOPY(row)}
            >
              Download
            </Button>
          </TableCell>
        )} */}
        <TableCell align="center">
          <button
            type="button"
            class="btn btn-primary"
            onClick={() => handleChange(row)}
          >
            View
          </button>
        </TableCell>
      </TableRow>
      <TableRow>
        <TableCell style={{ paddingBottom: 0, paddingTop: 0 }} colSpan={6}>
          <Collapse in={open} timeout="auto" unmountOnExit>
            <Box sx={{ margin: 1 }}>
              <Typography variant="h6" gutterBottom component="div">
                Products
              </Typography>
              <Table size="small" aria-label="purchases">
                <TableHead>
                  <TableRow>
                    <TableCell align="center">DISPATCH ID</TableCell>
                    <TableCell align="center">PRODUCT</TableCell>
                    <TableCell align="center">QUANTITY</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {row.products.map((historyRow) => (
                    <TableRow key={historyRow.dispatch_book}>
                      <TableCell align="center">
                        {historyRow.dispatch_book}
                      </TableCell>
                      <TableCell align="center">{historyRow.product}</TableCell>
                      <TableCell align="center">
                        {historyRow.quantity}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </Box>
          </Collapse>
        </TableCell>
      </TableRow>
      <Popup
        maxWidth={"md"}
        title={"Update Dispatch"}
        openPopup={openModal}
        setOpenPopup={setOpenModal}
      >
        <UpdateDispatch
          idData={idData}
          getAllDispatchDetails={getAllDispatchDetails}
          setOpenPopup={setOpenModal}
          userData={userData}
        />
      </Popup>
    </>
  );
}

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
