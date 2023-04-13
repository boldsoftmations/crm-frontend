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
  Snackbar,
  Switch,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
} from "@mui/material";
import { tableCellClasses } from "@mui/material/TableCell";
import CloseIcon from "@mui/icons-material/Close";
import React, { useEffect, useRef, useState } from "react";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import KeyboardArrowUpIcon from "@mui/icons-material/KeyboardArrowUp";
import { CustomLoader } from "../../../Components/CustomLoader";
import { CustomSearch } from "../../../Components/CustomSearch";
import { ErrorMessage } from "../../../Components/ErrorMessage/ErrorMessage";
import { Popup } from "../../../Components/Popup";
import InventoryServices from "../../../services/InventoryService";
import { BillofMaterialsCreate } from "./BillofMaterialsCreate";
import { BillofMaterialsUpdate } from "./BillofMaterialsUpdate";
import ProductService from "../../../services/ProductService";
import { useDispatch, useSelector } from "react-redux";
import {
  getConsumableProduct,
  getFinishGoodProduct,
  getRawMaterialProduct,
} from "../../../Redux/Action/Action";

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

export const BillofMaterialsView = () => {
  const [openPopup, setOpenPopup] = useState(false);
  const [openPopup2, setOpenPopup2] = useState(false);
  const [open, setOpen] = useState(false);
  const errRef = useRef();
  const [errMsg, setErrMsg] = useState("");
  const [billofMaterials, setBillofMaterials] = useState([]);
  const [pageCount, setpageCount] = useState(0);
  const [currentPage, setCurrentPage] = useState(0);
  const [filterSelectedQuery, setFilterSelectedQuery] = useState("");
  const [filterType, setFilterType] = useState("");
  const [idForEdit, setIDForEdit] = useState("");
  const dispatch = useDispatch();
  const [openSnackbar, setOpenSnackbar] = useState(false);
  const [filterApproved, setFilterApproved] = useState(null);
  const users = useSelector((state) => state.auth.profile);

  useEffect(() => {
    getFinishGoods();
  }, []);

  const getFinishGoods = async () => {
    try {
      setOpen(true);
      const response = await ProductService.getFinishGoodsPaginate("all");
      var arr = response.data.map((ProductData) => ({
        product: ProductData.name,
        unit: ProductData.unit,
      }));
      dispatch(getFinishGoodProduct(arr));
      setOpen(false);
    } catch (err) {
      setOpen(false);
      console.log("err", err);
    }
  };

  useEffect(() => {
    getrawMaterials();
  }, []);

  const getrawMaterials = async () => {
    try {
      setOpen(true);
      const response = await ProductService.getRawMaterialsPaginate("all");
      console.log("raw material", response.data);
      var arr = response.data.map((ProductData) => ({
        product: ProductData.name,
        unit: ProductData.unit,
      }));
      dispatch(getRawMaterialProduct(arr));
      setOpen(false);
    } catch (err) {
      setOpen(false);
      console.log("err", err);
    }
  };

  useEffect(() => {
    getconsumables();
  }, []);

  const getconsumables = async () => {
    try {
      setOpen(true);
      const response = await ProductService.getConsumablePaginate("all");
      console.log("consumable", response.data);
      var arr = response.data.map((ProductData) => ({
        product: ProductData.name,
        unit: ProductData.unit,
      }));
      dispatch(getConsumableProduct(arr));
      setOpen(false);
    } catch (err) {
      setOpen(false);
      console.log("err", err);
    }
  };

  useEffect(() => {
    getAllBillofMaterialsDetails();
  }, []);

  const handleInputChange = (event) => {
    setFilterSelectedQuery(event.target.value);
    getSearchData(event.target.value, filterApproved);
  };

  const handleApprovedFilterChange = (event) => {
    setFilterApproved(event.target.value);
    getSearchData(filterSelectedQuery, event.target.value);
  };

  const getAllBillofMaterialsDetails = async () => {
    try {
      setOpen(true);
      let response;
      response = currentPage
        ? await InventoryServices.getBillofMaterialsPaginateData(currentPage)
        : await InventoryServices.getAllBillofMaterialsData();

      setBillofMaterials(response.data.results);
      const total = response.data.count;
      setpageCount(Math.ceil(total / 25));
    } catch (err) {
      // handle error
    } finally {
      setOpen(false);
    }
  };

  const getSearchData = async (value, filterApproved) => {
    try {
      setOpen(true);
      if (filterApproved === null) {
        const response =
          await InventoryServices.getAllSearchBillofMaterialsData(value);
        setBillofMaterials(response.data.results);
        const total = response.data.count;
        setpageCount(Math.ceil(total / 25));
      } else {
        const response =
          await InventoryServices.getAllFilterBillofMaterialsData(
            filterApproved
          );
        setBillofMaterials(response.data.results);
        const total = response.data.count;
        setpageCount(Math.ceil(total / 25));
      }
    } catch (error) {
      // handle error
    } finally {
      setOpen(false);
    }
  };

  const handlePageClick = async (event, value) => {
    try {
      const page = value;
      setCurrentPage(page);
      setOpen(true);

      let response;
      if (filterSelectedQuery) {
        response = await InventoryServices.getAllBillofMaterialsDataPaginate(
          page,
          filterSelectedQuery
        );
      } else if (filterApproved === null) {
        response = await InventoryServices.getBillofMaterialsPaginateData(page);
      } else {
        response =
          await InventoryServices.getBillofMaterialsPaginateDataByApproval(
            page,
            filterApproved
          );
      }

      if (response) {
        setBillofMaterials(response.data.results);
        const total = response.data.count;
        setpageCount(Math.ceil(total / 25));
      } else {
        await getAllBillofMaterialsDetails();
        setFilterSelectedQuery("");
      }
    } catch (error) {
      // handle error
    } finally {
      setOpen(false);
    }
  };

  const updateBillofMaterialsDetails = async (data) => {
    try {
      setOpen(true);
      const req = {
        approved: true,
        product: data.product,
      };
      await InventoryServices.updateBillofMaterialsData(data.id, req);

      setOpenPopup(false);
      getAllBillofMaterialsDetails();
      setOpen(false);
      // Show success snackbar
      setOpenSnackbar(true);
    } catch (error) {
      console.log("error Store Accepting", error);
      setOpen(false);
    }
  };

  const getResetData = async () => {
    setFilterSelectedQuery("");
    setFilterType(null);
    await getAllBillofMaterialsDetails();
  };

  const openInPopup = (item) => {
    setIDForEdit(item);
    setOpenPopup(true);
  };

  const handleSnackbarClose = () => {
    setOpenSnackbar(false);
  };

  return (
    <>
      <CustomLoader open={open} />

      <Grid item xs={12}>
        <ErrorMessage errRef={errRef} errMsg={errMsg} />
        <Paper sx={{ p: 2, m: 4, display: "flex", flexDirection: "column" }}>
          <Box display="flex">
            <Box flexGrow={2}>
              <FormControl fullWidth size="small" style={{ maxWidth: 200 }}>
                <InputLabel id="demo-select-small">Filter By</InputLabel>
                <Select
                  labelId="demo-select-small"
                  id="demo-select-small"
                  value={filterType}
                  label="Filter By"
                  onChange={(event) => setFilterType(event.target.value)}
                >
                  <MenuItem value={"search"}>Search </MenuItem>
                  <MenuItem value={"approved"}>Approved</MenuItem>
                </Select>
              </FormControl>
              {filterType === "search" && (
                <CustomSearch
                  filterSelectedQuery={filterSelectedQuery}
                  handleInputChange={handleInputChange}
                  getResetData={getResetData}
                />
              )}
              {filterType === "approved" && (
                <FormControl
                  fullWidth
                  size="small"
                  style={{ maxWidth: 200, marginLeft: "1em" }}
                >
                  <InputLabel id="demo-select-small">
                    Filter By Approved
                  </InputLabel>
                  <Select
                    labelId="demo-select-small"
                    id="demo-select-small"
                    value={filterApproved}
                    label="Filter By Approved"
                    onChange={(event) => handleApprovedFilterChange(event)}
                    endAdornment={
                      filterApproved !== null && (
                        <IconButton
                          onClick={() => {
                            setFilterApproved(null);
                            getAllBillofMaterialsDetails();
                            setFilterType("");
                          }}
                        >
                          <CloseIcon />
                        </IconButton>
                      )
                    }
                  >
                    <MenuItem value={true}>True </MenuItem>
                    <MenuItem value={false}>False</MenuItem>
                  </Select>
                </FormControl>
              )}
            </Box>

            <Box flexGrow={1}>
              <h3
                style={{
                  textAlign: "left",
                  marginBottom: "1em",
                  fontSize: "24px",
                  color: "rgb(34, 34, 34)",
                  fontWeight: 800,
                }}
              >
                Bill of Materials Details
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
            <Snackbar
              open={openSnackbar}
              onClose={handleSnackbarClose}
              message={"Bill Of Material details Accepted successfully!"}
              anchorOrigin={{ vertical: "top", horizontal: "center" }}
              action={
                <IconButton
                  aria-label="close"
                  color="inherit"
                  sx={{ p: 0.5 }}
                  onClick={handleSnackbarClose}
                >
                  <CloseIcon />
                </IconButton>
              }
            />
            <Table
              sx={{ minWidth: 700 }}
              stickyHeader
              aria-label="sticky table"
            >
              <TableHead>
                <StyledTableRow>
                  <StyledTableCell align="center"></StyledTableCell>
                  <StyledTableCell align="center">ID</StyledTableCell>
                  <StyledTableCell align="center">PRODUCT</StyledTableCell>
                  <StyledTableCell align="center">QUANTITY</StyledTableCell>
                  <StyledTableCell align="center">DATE</StyledTableCell>
                  <StyledTableCell align="center">APPROVED</StyledTableCell>
                  <StyledTableCell align="center">Action</StyledTableCell>
                </StyledTableRow>
              </TableHead>
              <TableBody>
                {billofMaterials.map((row, i) => (
                  <Row
                    key={i}
                    row={row}
                    openInPopup={openInPopup}
                    users={users}
                    updateBillofMaterialsDetails={updateBillofMaterialsDetails}
                  />
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
        title={"Create Bill of Materials Details"}
        openPopup={openPopup2}
        setOpenPopup={setOpenPopup2}
      >
        <BillofMaterialsCreate
          getAllBillofMaterialsDetails={getAllBillofMaterialsDetails}
          setOpenPopup={setOpenPopup2}
        />
      </Popup>
      <Popup
        fullScreen={true}
        title={"Update Bill of Materials Details"}
        openPopup={openPopup}
        setOpenPopup={setOpenPopup}
      >
        <BillofMaterialsUpdate
          setOpenPopup={setOpenPopup}
          getAllBillofMaterialsDetails={getAllBillofMaterialsDetails}
          idForEdit={idForEdit}
        />
      </Popup>
    </>
  );
};

function Row(props) {
  const { row, openInPopup, users, updateBillofMaterialsDetails } = props;
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

        <TableCell align="center">{row.bom_id}</TableCell>
        <TableCell align="center">{row.product}</TableCell>
        <TableCell align="center">{row.quantity}</TableCell>
        <TableCell align="center">{row.created_on}</TableCell>
        <StyledTableCell align="center">
          <Switch
            checked={row.approved}
            inputProps={{ "aria-label": "controlled" }}
          />
        </StyledTableCell>
        <TableCell align="center">
          {users.groups.includes("Accounts") && row.approved === false ? (
            <Button
              onClick={() => updateBillofMaterialsDetails(row)}
              variant="contained"
              color="success"
            >
              Accept
            </Button>
          ) : null}
          {users.groups.includes("Production") && row.approved === false ? (
            <Button onClick={() => openInPopup(row.id)} variant="contained">
              Edit
            </Button>
          ) : null}
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
                    <TableCell align="center">SR.NO</TableCell>
                    <TableCell align="center">PRODUCT</TableCell>
                    <TableCell align="center">UNIT</TableCell>
                    <TableCell align="center">QUANTITY</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {row.products_data.map((historyRow, i) => (
                    <TableRow key={i}>
                      <TableCell align="center">{i + 1}</TableCell>
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