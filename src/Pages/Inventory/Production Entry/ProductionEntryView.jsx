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
  Collapse,
  Typography,
  IconButton,
} from "@mui/material";
import { tableCellClasses } from "@mui/material/TableCell";
import React, { useEffect, useRef, useState } from "react";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import KeyboardArrowUpIcon from "@mui/icons-material/KeyboardArrowUp";
import { CustomLoader } from "../../../Components/CustomLoader";
import { CustomSearch } from "../../../Components/CustomSearch";
import { ErrorMessage } from "../../../Components/ErrorMessage/ErrorMessage";
import { Popup } from "../../../Components/Popup";
import InventoryServices from "../../../services/InventoryService";
import ProductService from "../../../services/ProductService";
import { useDispatch } from "react-redux";
import { getFinishGoodProduct } from "../../../Redux/Action/Action";
import { ProductionEntryCreate } from "./ProductionEntryCreate";

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

export const ProductionEntryView = () => {
  const [openPopup2, setOpenPopup2] = useState(false);
  const [open, setOpen] = useState(false);
  const errRef = useRef();
  const [errMsg, setErrMsg] = useState("");
  const [productionEntry, setProductionEntry] = useState([]);
  const [pageCount, setpageCount] = useState(0);
  const [currentPage, setCurrentPage] = useState(0);
  const [filterSelectedQuery, setFilterSelectedQuery] = useState("");
  const dispatch = useDispatch();
  const handleInputChange = (event) => {
    setFilterSelectedQuery(event.target.value);
    getSearchData(event.target.value);
  };

  useEffect(() => {
    getFinishGoods();
  }, []);

  const getFinishGoods = async () => {
    try {
      setOpen(true);
      const response = await ProductService.getFinishGoodsPaginate("all");
      var arr = response.data.map((ProductData) => ({
        product: ProductData.name,
      }));
      dispatch(getFinishGoodProduct(arr));
      setOpen(false);
    } catch (err) {
      setOpen(false);
      console.log("err", err);
    }
  };

  useEffect(() => {
    getAllProductionEntryDetails();
  }, []);

  const getAllProductionEntryDetails = async () => {
    try {
      setOpen(true);
      const response = currentPage
        ? await InventoryServices.getProductionEntryPaginateData(currentPage)
        : await InventoryServices.getAllProductionEntryData();
      setProductionEntry(response.data.results);
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
        const response =
          await InventoryServices.getAllSearchProductionEntryData(filterSearch);
        setProductionEntry(response.data.results);
        const total = response.data.count;
        setpageCount(Math.ceil(total / 25));
      } else {
        await getAllProductionEntryDetails();
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
        ? await InventoryServices.getAllProductionEntryDataPaginate(
            page,
            filterSelectedQuery
          )
        : await InventoryServices.getProductionEntryPaginateData(page);

      if (response) {
        setProductionEntry(response.data.results);
        const total = response.data.count;
        setpageCount(Math.ceil(total / 25));
      } else {
        await getAllProductionEntryDetails();
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
    await getAllProductionEntryDetails();
  };

  // const openInPopup = (item) => {
  //   setIDForEdit(item);
  //   setOpenPopup(true);
  // };

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
                Production Entry Details
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
                <StyledTableRow>
                  <StyledTableCell align="center"></StyledTableCell>
                  <StyledTableCell align="center">ID</StyledTableCell>
                  <StyledTableCell align="center">SELLER STATE</StyledTableCell>
                  <StyledTableCell align="center">PRODUCT</StyledTableCell>

                  <StyledTableCell align="center">QUANTITY</StyledTableCell>
                  <StyledTableCell align="center">DATE</StyledTableCell>
                </StyledTableRow>
              </TableHead>
              <TableBody>
                {productionEntry.map((row, i) => (
                  <Row key={i} row={row} />
                ))}
              </TableBody>{" "}
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
        title={"Create Production Entry Details"}
        openPopup={openPopup2}
        setOpenPopup={setOpenPopup2}
      >
        <ProductionEntryCreate
          getAllProductionEntryDetails={getAllProductionEntryDetails}
          setOpenPopup={setOpenPopup2}
        />
      </Popup>
    </>
  );
};

function Row(props) {
  const { row } = props;
  const [open, setOpen] = useState(false);

  return (
    <>
      {/* <CustomLoader open={open} /> */}
      <TableRow sx={{ "& > *": { borderBottom: "unset" } }}>
        <TableCell align="center">
          <IconButton
            aria-label="expand row"
            size="small"
            align="center"
            onClick={() => setOpen(!open)}
          >
            {open ? <KeyboardArrowUpIcon /> : <KeyboardArrowDownIcon />}
          </IconButton>
        </TableCell>

        <TableCell align="center">{row.bom}</TableCell>
        <TableCell align="center">{row.seller_account}</TableCell>
        <TableCell align="center">{row.product}</TableCell>
        <TableCell align="center">{row.quantity}</TableCell>
        <TableCell align="center">{row.created_on}</TableCell>
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
                    <TableCell align="center">PRODUCT</TableCell>
                    <TableCell align="center">UNIT</TableCell>
                    <TableCell align="center">QUANTITY</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {row.products_data.map((historyRow, i) => (
                    <TableRow key={i}>
                      <TableCell align="center">{historyRow.product}</TableCell>
                      <TableCell align="center">{historyRow.unit}</TableCell>
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
    </>
  );
}
