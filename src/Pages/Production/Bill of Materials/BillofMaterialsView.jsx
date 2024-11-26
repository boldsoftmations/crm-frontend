import React, { useCallback, useEffect, useRef, useState } from "react";
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
  Collapse,
  Typography,
  IconButton,
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
import { useNotificationHandling } from "../../../Components/useNotificationHandling ";
import { MessageAlert } from "../../../Components/MessageAlert";
import SearchComponent from "../../../Components/SearchComponent ";
import { CustomPagination } from "../../../Components/CustomPagination";
import { CSVLink } from "react-csv";

export const BillofMaterialsView = () => {
  const [openPopup, setOpenPopup] = useState(false);
  const [openPopup2, setOpenPopup2] = useState(false);
  const [open, setOpen] = useState(false);
  const [billofMaterials, setBillofMaterials] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);
  const [searchQuery, setSearchQuery] = useState("");
  const [idForEdit, setIDForEdit] = useState("");
  const dispatch = useDispatch();
  const [filterApproved, setFilterApproved] = useState(null);
  const users = useSelector((state) => state.auth.profile);
  const { handleSuccess, handleError, handleCloseSnackbar, alertInfo } =
    useNotificationHandling();

  useEffect(() => {
    getFinishGoods();
    getrawMaterials();
    getconsumables();
  }, []);

  const [exportData, setExportData] = useState([]);
  const csvLinkRef = useRef(null);

  const handleExport = async () => {
    try {
      setOpen(true);
      let response;
      if (searchQuery) {
        response = await InventoryServices.getAllBillofMaterialsData(
          "all",
          searchQuery
        );
      } else {
        response = await InventoryServices.getAllBillofMaterialsData("all");
      }
      const rawData = response.data;
      return rawData.flatMap((bom) => {
        const processedProducts = bom.products_data.map(
          (productData, index) => ({
            nameOfItem: index === 0 ? bom.product : "", // Show only for the first product
            unit: index === 0 ? bom.unit : "", // Show only for the first product
            nameOfBom: index === 0 ? bom.bom_id : "", // Example static data
            unitOfManufacture: index === 0 ? 1 : "", // Show only for the first product
            item: productData.product, // Product from products_data
            godown: "", // Example static data
            qty: productData.quantity, // Quantity from products_data
          })
        );
        return processedProducts;
      });
    } catch (err) {
      console.log(err);
    } finally {
      setOpen(false);
    }
  };

  const handleDownload = async () => {
    try {
      const data = await handleExport();
      setExportData(data);
      setTimeout(() => {
        csvLinkRef.current.link.click();
      });
      handleSuccess("CSV Downloaded Successfully");
    } catch (error) {
      console.log("CSVLink Download error", error);
    }
  };

  const headers = [
    { label: "Name Of Item", key: "nameOfItem" },
    { label: "Unit", key: "unit" },
    { label: "Name Of BOM", key: "nameOfBom" },
    { label: "Unit Of Manufacture", key: "unitOfManufacture" },
    { label: "Item", key: "item" },
    { label: "Godown", key: "godown" },
    { label: "Qty", key: "qty" },
  ];

  const getFinishGoods = async () => {
    try {
      setOpen(true);
      const response = await ProductService.getAllFinishGoodsProducts();
      dispatch(getFinishGoodProduct(response.data.data));
      setOpen(false);
    } catch (err) {
      handleError(err);
      setOpen(false);
      console.log("err", err);
    }
  };

  const getrawMaterials = async () => {
    try {
      setOpen(true);
      const response = await ProductService.getAllRawMaterials("all");
      var arr = response.data.map((ProductData) => ({
        product: ProductData.name,
        unit: ProductData.unit,
      }));
      dispatch(getRawMaterialProduct(arr));
      setOpen(false);
    } catch (err) {
      handleError(err);
      setOpen(false);
      console.log("err", err);
    }
  };

  const getconsumables = async () => {
    try {
      setOpen(true);
      const response = await ProductService.getAllConsumable("all");
      var arr = response.data.map((ProductData) => ({
        product: ProductData.name,
        unit: ProductData.unit,
      }));
      dispatch(getConsumableProduct(arr));
      setOpen(false);
    } catch (err) {
      handleError(err);
      setOpen(false);
      console.log("err", err);
    }
  };

  useEffect(() => {
    getAllBillofMaterialsDetails(currentPage);
  }, [currentPage, searchQuery]);

  const getAllBillofMaterialsDetails = useCallback(
    async (page, filter = filterApproved, search = searchQuery) => {
      try {
        setOpen(true);
        const response = await InventoryServices.getAllBillofMaterialsData(
          page,
          filter,
          null,
          search
        );
        setBillofMaterials(response.data.results);
        setTotalPages(Math.ceil(response.data.count / 25));
        setOpen(false);
      } catch (error) {
        handleError(error);
        setOpen(false);
        console.error("error", error);
      }
    },
    [filterApproved, searchQuery]
  );

  const handleSearch = (query) => {
    setSearchQuery(query);
    setCurrentPage(1);
  };

  const handleReset = () => {
    setSearchQuery("");
    setCurrentPage(1);
  };

  const handlePageChange = (event, value) => {
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
      handleSuccess("BOM Accepted Successfully");
      setTimeout(() => {
        setOpenPopup(false);
      }, 300);
      getAllBillofMaterialsDetails(currentPage, filterApproved, searchQuery);
      setOpen(false);
    } catch (error) {
      handleError(error);
      console.log("error Store Accepting", error);
      setOpen(false);
    }
  };

  const DeactivateBillofMaterialsDetails = async (data) => {
    try {
      setOpen(true);
      const req = {
        is_deactivated: true,
        product: data.product,
      };
      await InventoryServices.updateBillofMaterialsData(data.id, req);
      handleSuccess(`BOM Deactivated Activated Successfully !`);
      setTimeout(() => {
        setOpenPopup(false);
      }, 300);

      getAllBillofMaterialsDetails(currentPage, filterApproved, searchQuery);
    } catch (error) {
      handleError(error);
      console.log("Error in toggling BOM status:", error);
    } finally {
      setOpen(false);
    }
  };

  const openInPopup = (item) => {
    setIDForEdit(item);
    setOpenPopup(true);
  };

  return (
    <>
      <MessageAlert
        open={alertInfo.open}
        onClose={handleCloseSnackbar}
        severity={alertInfo.severity}
        message={alertInfo.message}
      />
      <CustomLoader open={open} />

      <Grid item xs={12}>
        <Paper sx={{ p: 2, m: 4, display: "flex", flexDirection: "column" }}>
          <Box sx={{ marginBottom: 2 }}>
            <Grid
              container
              spacing={2}
              alignItems="center"
              justifyContent="space-between"
            >
              {/* Left Section: Filter and Search */}
              <Grid
                item
                xs={12}
                sm={6}
                md={4}
                display="flex"
                alignItems="center"
              >
                <FormControl fullWidth size="small" sx={{ marginRight: 2 }}>
                  <InputLabel id="demo-simple-select-label">
                    Filter By Approved
                  </InputLabel>
                  <Select
                    labelId="demo-simple-select-label"
                    id="demo-simple-select"
                    name="status"
                    label="Filter By Approved"
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
                <SearchComponent
                  onSearch={handleSearch}
                  onReset={handleReset}
                />
              </Grid>

              {/* Center Section: Title */}
              <Grid
                item
                xs={12}
                sm={6}
                md={4}
                display="flex"
                justifyContent="center"
              >
                <h3
                  style={{
                    fontSize: "24px",
                    color: "rgb(34, 34, 34)",
                    fontWeight: 800,
                    textAlign: "center",
                  }}
                >
                  Bill of Materials
                </h3>
              </Grid>

              {/* Right Section: Add Button */}
              <Grid
                item
                xs={12}
                sm={6}
                md={4}
                display="flex"
                justifyContent="flex-end"
              >
                {(users.groups.includes("Accounts") ||
                  users.groups.includes("Director")) && (
                  <>
                    <Button onClick={handleDownload} variant="contained">
                      Download CSV
                    </Button>
                    {exportData.length > 0 && (
                      <CSVLink
                        data={[...exportData]}
                        headers={headers}
                        ref={csvLinkRef}
                        filename="BOM.csv"
                        target="_blank"
                        style={{
                          textDecoration: "none",
                          outline: "none",
                          height: "5vh",
                        }}
                      />
                    )}
                  </>
                )}
                <Button
                  onClick={() => setOpenPopup2(true)}
                  variant="contained"
                  color="success"
                >
                  Add
                </Button>
              </Grid>
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
            <Table
              sx={{ minWidth: 700 }}
              stickyHeader
              aria-label="sticky table"
            >
              <TableHead>
                <StyledTableRow>
                  <StyledTableCell align="center"></StyledTableCell>
                  <StyledTableCell align="center">ID</StyledTableCell>
                  <StyledTableCell align="center">BOM TYPE</StyledTableCell>
                  <StyledTableCell align="center">Remark</StyledTableCell>
                  <StyledTableCell align="center">PRODUCT</StyledTableCell>
                  <StyledTableCell align="center">QUANTITY</StyledTableCell>
                  <StyledTableCell align="center">DATE</StyledTableCell>
                  <StyledTableCell align="center">APPROVED</StyledTableCell>
                  {(users.groups.includes("Accounts") ||
                    users.groups.includes("Director") ||
                    users.email === "amol@glutape.com") && (
                    <StyledTableCell align="center">
                      DEACTIVATED
                    </StyledTableCell>
                  )}

                  <StyledTableCell align="center">ACTION</StyledTableCell>
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
                    DeactivateBillofMaterialsDetails={
                      DeactivateBillofMaterialsDetails
                    }
                  />
                ))}
              </TableBody>{" "}
            </Table>
          </TableContainer>
          <TableFooter
            sx={{ display: "flex", justifyContent: "center", marginTop: "2em" }}
          >
            <CustomPagination
              currentPage={currentPage}
              totalPages={totalPages}
              handlePageChange={handlePageChange}
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
          currentPage={currentPage}
          filterApproved={filterApproved}
          searchQuery={searchQuery}
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
          currentPage={currentPage}
          filterApproved={filterApproved}
          searchQuery={searchQuery}
          setOpenPopup={setOpenPopup}
          getAllBillofMaterialsDetails={getAllBillofMaterialsDetails}
          idForEdit={idForEdit}
        />
      </Popup>
    </>
  );
};

function Row(props) {
  const {
    row,
    openInPopup,
    users,
    updateBillofMaterialsDetails,
    DeactivateBillofMaterialsDetails,
  } = props;
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
        <StyledTableCell align="center">{row.bom_type}</StyledTableCell>
        <StyledTableCell align="center">{row.remark}</StyledTableCell>
        <StyledTableCell align="center">{row.product}</StyledTableCell>
        <StyledTableCell align="center">{row.quantity}</StyledTableCell>
        <StyledTableCell align="center">{row.created_on}</StyledTableCell>
        <StyledTableCell align="center">
          <Switch
            checked={row.approved}
            inputProps={{ "aria-label": "controlled" }}
          />
        </StyledTableCell>
        {(users.groups.includes("Accounts") ||
          users.groups.includes("Director") ||
          users.groups.includes("Factory-Mumbai-OrderBook")) && (
          <StyledTableCell align="center">
            <Switch
              checked={row.is_deactivated}
              inputProps={{ "aria-label": "controlled" }}
              onClick={() => {
                if (!row.is_deactivated) {
                  DeactivateBillofMaterialsDetails(row);
                }
              }}
            />
          </StyledTableCell>
        )}

        <StyledTableCell align="center">
          {(users.groups.includes("Accounts") ||
            users.groups.includes("Director")) &&
          row.approved === false ? (
            <Button
              onClick={() => updateBillofMaterialsDetails(row)}
              color="success"
            >
              Accept
            </Button>
          ) : null}
          {(users.groups.includes("Production") ||
            users.groups.includes("Director")) &&
          row.approved === false ? (
            <Button onClick={() => openInPopup(row)}>Edit</Button>
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
