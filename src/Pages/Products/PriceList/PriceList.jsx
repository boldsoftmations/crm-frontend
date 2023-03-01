import React, { useEffect, useRef, useState } from "react";

import "../../CommonStyle.css";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  Grid,
  Button,
  Paper,
  styled,
  Box,
  TableContainer,
  Switch,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  IconButton,
} from "@mui/material";
import { tableCellClasses } from "@mui/material/TableCell";
import AddIcon from "@mui/icons-material/Add";

import ProductService from "../../../services/ProductService";
import SearchIcon from "@mui/icons-material/Search";
import ClearIcon from "@mui/icons-material/Clear";

import { Popup } from "../../../Components/Popup";
import { CreatePriceList } from "./CreatePriceList";
import { UpdatePriceList } from "./UpdatePriceList";
import { ErrorMessage } from "./../../../Components/ErrorMessage/ErrorMessage";
import { CustomLoader } from "./../../../Components/CustomLoader";
import { CustomSearch } from "./../../../Components/CustomSearch";
import { CustomPagination } from "./../../../Components/CustomPagination";

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

export const PriceList = () => {
  const [priceListData, setPriceListData] = useState([]);
  const [open, setOpen] = useState(false);
  const errRef = useRef();
  const [errMsg, setErrMsg] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [openPopup, setOpenPopup] = useState(false);
  const [openPopup2, setOpenPopup2] = useState(false);
  const [recordForEdit, setRecordForEdit] = useState(null);
  const [pageCount, setpageCount] = useState(0);
  const [currentPage, setCurrentPage] = useState(0);
  const [filterSelectedQuerys, setFilterSelectedQuerys] = useState("");

  const getPriceList = async () => {
    try {
      setOpen(true);
      if (currentPage) {
        const response = await ProductService.getPriceListPaginate(currentPage);
        setPriceListData(response.data.results);
        const total = response.data.count;
        setpageCount(Math.ceil(total / 25));
      } else {
        const response = await ProductService.getAllPriceList();
        setPriceListData(response.data.results);
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

  useEffect(() => {
    getPriceList();
  }, []);

  const handleInputChange = (event) => {
    setFilterSelectedQuerys(event.target.value);
    getFilterData(event.target.value);
  };

  const handleInputChanges = (event) => {
    setSearchQuery(event.target.value);
    getSearchData(event.target.value);
  };

  const getFilterData = async (value) => {
    try {
      setOpen(true);
      const filterSearch = value;
      const response = await ProductService.getAllPaginatePriceList(
        "validity",
        filterSearch
      );
      setPriceListData(response.data.results);
      const total = response.data.count;
      setpageCount(Math.ceil(total / 25));
      setOpen(false);
    } catch (error) {
      console.log("error Search leads", error);
      setOpen(false);
    }
  };

  const getSearchData = async (value) => {
    try {
      setOpen(true);
      const filterSearch = value;
      const response = await ProductService.getAllSearchPriceList(
        "search",
        filterSearch
      );
      if (response) {
        setPriceListData(response.data.results);
        const total = response.data.count;
        setpageCount(Math.ceil(total / 25));
      } else {
        getPriceList();
      }

      setOpen(false);
    } catch (error) {
      console.log("error Search leads", error);
      setOpen(false);
    }
  };
  console.log("filterSelectedQuerys", filterSelectedQuerys);
  const handlePageClick = async (event, value) => {
    try {
      const page = value;
      setCurrentPage(page);
      setOpen(true);

      if (searchQuery) {
        const response = await ProductService.getAllPriceListPaginate(
          page,
          "search",
          searchQuery
        );
        if (response) {
          setPriceListData(response.data.results);
          const total = response.data.count;
          setpageCount(Math.ceil(total / 25));
        } else {
          getPriceList();
          setFilterSelectedQuerys("");
        }
      } else if (filterSelectedQuerys !== "search") {
        const response = await ProductService.getAllPriceListPaginate(
          page,
          "validity",
          filterSelectedQuerys
        );
        setPriceListData(response.data.results);
        const total = response.data.count;
        setpageCount(Math.ceil(total / 25));
      } else {
        const response = await ProductService.getPriceListPaginate(page);
        setPriceListData(response.data.results);
        const total = response.data.count;
        setpageCount(Math.ceil(total / 25));
      }

      setOpen(false);
    } catch (error) {
      console.log("error", error);
      setOpen(false);
    }
  };

  const getResetData = () => {
    setFilterSelectedQuerys("");
    getPriceList();
  };

  const getResetDataSearch = () => {
    setSearchQuery("");
    getPriceList();
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
        <Paper sx={{ p: 2, m: 3, display: "flex", flexDirection: "column" }}>
          <Box display="flex">
            <Box flexGrow={0.9}>
              <FormControl
                sx={{ minWidth: "200px", marginLeft: "1em" }}
                size="small"
              >
                <InputLabel id="demo-simple-select-label">Filter By</InputLabel>
                <Select
                  labelId="demo-simple-select-label"
                  id="demo-simple-select"
                  name="values"
                  label="Filter By"
                  value={filterSelectedQuerys}
                  onChange={(event) => handleInputChange(event)}
                  sx={{
                    "& .MuiSelect-iconOutlined": {
                      display: filterSelectedQuerys ? "none" : "",
                    },
                    "&.Mui-focused .MuiIconButton-root": {
                      color: "primary.main",
                    },
                  }}
                  endAdornment={
                    <IconButton
                      sx={{
                        visibility: filterSelectedQuerys ? "visible" : "hidden",
                      }}
                      onClick={getResetData}
                    >
                      <ClearIcon />
                    </IconButton>
                  }
                >
                  <MenuItem value={"valid"}>valid</MenuItem>
                  <MenuItem value={"expired"}>expired</MenuItem>
                  {/* <MenuItem value={"search"}>Search</MenuItem> */}
                </Select>
              </FormControl>
              {filterSelectedQuerys !== "valid" &&
                filterSelectedQuerys !== "expired" && (
                  <CustomSearch
                    filterSelectedQuery={searchQuery}
                    handleInputChange={handleInputChanges}
                    getResetData={getResetDataSearch}
                  />
                )}
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
                Price List
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
            <Table
              sx={{ minWidth: 700 }}
              stickyHeader
              aria-label="sticky table"
            >
              <TableHead>
                <TableRow>
                  <StyledTableCell align="center">PRODUCT</StyledTableCell>
                  <StyledTableCell align="center">SLAB1</StyledTableCell>
                  <StyledTableCell align="center">SLAB1 PRICE</StyledTableCell>
                  <StyledTableCell align="center">SLAB2</StyledTableCell>
                  <StyledTableCell align="center">SLAB2 PRICE</StyledTableCell>
                  <StyledTableCell align="center">SLAB3 PRICE</StyledTableCell>
                  <StyledTableCell align="center">VALIDITY</StyledTableCell>
                  <StyledTableCell align="center">DISCONTINUED</StyledTableCell>
                  <StyledTableCell align="center">ACTION</StyledTableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {priceListData.map((row, i) => {
                  return (
                    <StyledTableRow key={i}>
                      <StyledTableCell align="center">
                        {row.product}
                      </StyledTableCell>

                      <StyledTableCell align="center">
                        {row.slab1}
                      </StyledTableCell>
                      <StyledTableCell align="center">
                        {row.slab1_price}
                      </StyledTableCell>
                      <StyledTableCell align="center">
                        {row.slab2}
                      </StyledTableCell>
                      <StyledTableCell align="center">
                        {row.slab2_price}
                      </StyledTableCell>
                      <StyledTableCell align="center">
                        {row.slab3_price}
                      </StyledTableCell>
                      <StyledTableCell align="center">
                        {row.validity}
                      </StyledTableCell>
                      <StyledTableCell align="center">
                        {/* {row.discontinued} */}
                        <Switch
                          checked={row.discontinued}
                          inputProps={{ "aria-label": "controlled" }}
                        />
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
          <CustomPagination
            pageCount={pageCount}
            handlePageClick={handlePageClick}
          />
        </Paper>
      </Grid>
      <Popup
        title={"Create Price List"}
        openPopup={openPopup2}
        setOpenPopup={setOpenPopup2}
      >
        <CreatePriceList
          getPriceList={getPriceList}
          setOpenPopup={setOpenPopup2}
        />
      </Popup>
      <Popup
        title={"Update Price List"}
        openPopup={openPopup}
        setOpenPopup={setOpenPopup}
      >
        <UpdatePriceList
          recordForEdit={recordForEdit}
          setOpenPopup={setOpenPopup}
          getPriceList={getPriceList}
        />
      </Popup>
    </>
  );
};
