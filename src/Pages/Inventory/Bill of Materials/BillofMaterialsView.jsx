import React, { useCallback, useEffect, useState } from "react";
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
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import KeyboardArrowUpIcon from "@mui/icons-material/KeyboardArrowUp";
import { CustomLoader } from "../../../Components/CustomLoader";
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
import CustomTextField from "../../../Components/CustomTextField";

export const BillofMaterialsView = () => {
  const [openPopup, setOpenPopup] = useState(false);
  const [openPopup2, setOpenPopup2] = useState(false);
  const [open, setOpen] = useState(false);
  const [billofMaterials, setBillofMaterials] = useState([]);
  const [pageCount, setPageCount] = useState(0);
  const [currentPage, setCurrentPage] = useState(0);
  const [searchQuery, setSearchQuery] = useState("");
  const [idForEdit, setIDForEdit] = useState("");
  const dispatch = useDispatch();
  const [openSnackbar, setOpenSnackbar] = useState(false);
  const [filterApproved, setFilterApproved] = useState(null);
  const users = useSelector((state) => state.auth.profile);

  useEffect(() => {
    getFinishGoods();
    getrawMaterials();
    getconsumables();
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
    getAllBillofMaterialsDetails(currentPage);
  }, [currentPage, getAllBillofMaterialsDetails]);

  const getAllBillofMaterialsDetails = useCallback(
    async (page, filter = filterApproved, search = searchQuery) => {
      try {
        setOpen(true);
        const response = await InventoryServices.getAllBillofMaterialsData(
          page,
          filter,
          search
        );
        setBillofMaterials(response.data.results);
        setPageCount(Math.ceil(response.data.count / 25));
        setOpen(false);
      } catch (error) {
        setOpen(false);
        console.error("error", error);
      }
    },
    [filterApproved, searchQuery]
  );

  const handleSearchChange = (event) => {
    setSearchQuery(event.target.value);
  };

  const handlePageClick = (event, value) => {
    setCurrentPage(value);
  };

  const handleFilterChange = (event) => {
    const { value } = event.target;
    setFilterApproved(value);
    getAllBillofMaterialsDetails(currentPage, value, searchQuery);
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
        <Paper sx={{ p: 2, m: 4, display: "flex", flexDirection: "column" }}>
          <Box sx={{ marginBottom: 2, display: "flex", alignItems: "center" }}>
            <Grid container spacing={2} alignItems="center">
              <Grid item xs={12} sm={3}>
                <FormControl sx={{ minWidth: "100px" }} fullWidth size="small">
                  <InputLabel id="demo-simple-select-label">
                    Filter By Approved
                  </InputLabel>
                  <Select
                    labelId="demo-simple-select-label"
                    id="demo-simple-select"
                    name="status"
                    label="Filter By Accepted"
                    value={filterApproved}
                    onChange={handleFilterChange}
                  >
                    {ApprovedOption.map((option, i) => (
                      <MenuItem key={i} value={option.value}>
                        {option.label}
                      </MenuItem>
                    ))}
                  </Select>
                  {filterApproved && (
                    <IconButton
                      size="small"
                      onClick={() => {
                        setFilterApproved("");
                        getAllBillofMaterialsDetails(1, false, searchQuery);
                      }}
                      sx={{
                        position: "absolute",
                        right: 8,
                        top: "50%",
                        transform: "translateY(-50%)",
                      }}
                    >
                      <CloseIcon />
                    </IconButton>
                  )}
                </FormControl>
              </Grid>
              <Grid item xs={12} sm={3}>
                <CustomTextField
                  size="small"
                  label="Search"
                  variant="outlined"
                  value={searchQuery}
                  onChange={handleSearchChange}
                  fullWidth
                />
              </Grid>
              <Grid item xs={12} sm={1}>
                <Button
                  variant="contained"
                  color="primary"
                  onClick={() =>
                    getAllBillofMaterialsDetails(
                      currentPage,
                      filterApproved,
                      searchQuery
                    )
                  } // Call `handleSearch` when the button is clicked
                >
                  Search
                </Button>
              </Grid>
              <Grid item xs={12} sm={1}>
                <Button
                  variant="contained"
                  color="secondary"
                  onClick={() => {
                    setSearchQuery("");
                    getAllBillofMaterialsDetails(1, filterApproved, "");
                  }}
                >
                  Reset
                </Button>
              </Grid>
            </Grid>
          </Box>
          <Box sx={{ marginBottom: 2, display: "flex", alignItems: "center" }}>
            <Grid container spacing={2} alignItems="center">
              <Grid item xs={12} sm={6}></Grid>

              <Grid item xs={12} sm={3}>
                {/* Customer Header */}
                <h3
                  style={{
                    textAlign: "left",
                    fontSize: "24px",
                    color: "rgb(34, 34, 34)",
                    fontWeight: 800,
                  }}
                >
                  Bill of Materials
                </h3>
              </Grid>
              <Grid item xs={12} sm={3}></Grid>
            </Grid>
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
      <StyledTableRow sx={{ "& > *": { borderBottom: "unset" } }}>
        <StyledTableCell align="center">
          <IconButton
            aria-label="expand row"
            size="small"
            align="center"
            onClick={() => setOpen(!open)}
          >
            {open ? <KeyboardArrowUpIcon /> : <KeyboardArrowDownIcon />}
          </IconButton>
        </StyledTableCell>

        <StyledTableCell align="center">{row.bom_id}</StyledTableCell>
        <StyledTableCell align="center">{row.product}</StyledTableCell>
        <StyledTableCell align="center">{row.quantity}</StyledTableCell>
        <StyledTableCell align="center">{row.created_on}</StyledTableCell>
        <StyledTableCell align="center">
          <Switch
            checked={row.approved}
            inputProps={{ "aria-label": "controlled" }}
          />
        </StyledTableCell>
        <StyledTableCell align="center">
          {users.groups.includes("Accounts") && row.approved === false ? (
            <Button
              onClick={() => updateBillofMaterialsDetails(row)}
              color="success"
            >
              Accept
            </Button>
          ) : null}
          {users.groups.includes("Production") && row.approved === false ? (
            <Button onClick={() => openInPopup(row.id)}>Edit</Button>
          ) : null}
        </StyledTableCell>
      </StyledTableRow>
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
                    <StyledTableRow key={i}>
                      <StyledTableCell align="center">{i + 1}</StyledTableCell>
                      <StyledTableCell align="center">
                        {historyRow.product}
                      </StyledTableCell>
                      <StyledTableCell align="center">
                        {historyRow.unit}
                      </StyledTableCell>
                      <StyledTableCell align="center">
                        {historyRow.quantity}
                      </StyledTableCell>
                    </StyledTableRow>
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

const ApprovedOption = [
  { label: "approved", value: "true" },
  { label: "Not approved", value: "false" },
];

const StyledTableCell = styled(TableCell)(({ theme }) => ({
  [`&.${tableCellClasses.head}`]: {
    backgroundColor: theme.palette.common.black,
    color: theme.palette.common.white,
    padding: 0, // Remove padding from header cells
  },
  [`&.${tableCellClasses.body}`]: {
    fontSize: 14,
    padding: 0, // Remove padding from body cells
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
