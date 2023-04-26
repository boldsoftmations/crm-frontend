import React, { useEffect, useRef, useState } from "react";
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
  Switch,
  Snackbar,
} from "@mui/material";
import { tableCellClasses } from "@mui/material/TableCell";
import DownloadIcon from "@mui/icons-material/Download";
import jsPDF from "jspdf";
import CloseIcon from "@mui/icons-material/Close";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import KeyboardArrowUpIcon from "@mui/icons-material/KeyboardArrowUp";
import { CustomLoader } from "../../../Components/CustomLoader";
import { CustomSearch } from "../../../Components/CustomSearch";
import { ErrorMessage } from "../../../Components/ErrorMessage/ErrorMessage";
import { Popup } from "../../../Components/Popup";
import InventoryServices from "../../../services/InventoryService";
import { MaterialRequisitionFormCreate } from "./MaterialRequisitionFormCreate";
import { MaterialRequisitionFormUpdate } from "./MaterialRequisitionFormUpdate";
import { useSelector } from "react-redux";
import logo from "../../../Images/LOGOS3.png";
import {
  pdf,
  Image,
  Document,
  Page,
  View,
  Text,
  StyleSheet,
} from "@react-pdf/renderer";
import moment from "moment";
import InvoiceServices from "../../../services/InvoiceService";

export const MaterialRequisitionFormView = () => {
  const [openPopup, setOpenPopup] = useState(false);
  const [openPopup2, setOpenPopup2] = useState(false);
  const [openPopup3, setOpenPopup3] = useState(false);
  const [open, setOpen] = useState(false);
  const errRef = useRef();
  const [errMsg, setErrMsg] = useState("");
  const [materialRequisitionData, setMaterialRequisitionData] = useState([]);
  const [materialRequisitionDataByID, setMaterialRequisitionDataByID] =
    useState(null);
  const [pageCount, setpageCount] = useState(0);
  const [currentPage, setCurrentPage] = useState(0);
  const [filterSelectedQuery, setFilterSelectedQuery] = useState("");
  const [idForEdit, setIDForEdit] = useState("");
  const [storesInventoryData, setStoresInventoryData] = useState([]);
  const [openSnackbar, setOpenSnackbar] = useState(false);
  const [sellerOption, setSellerOption] = useState(null);
  const users = useSelector((state) => state.auth.profile);
  const handleInputChange = (event) => {
    setFilterSelectedQuery(event.target.value);
    getSearchData(event.target.value);
  };

  useEffect(() => {
    getAllSellerAccountsDetails();
  }, []);

  const getAllSellerAccountsDetails = async () => {
    try {
      setOpen(true);
      const data = users.groups.includes("Production Delhi")
        ? "Delhi"
        : "Maharashtra";
      const response = await InvoiceServices.getfilterSellerAccountData(data);
      setSellerOption(response.data.results);
      setOpen(false);
    } catch (err) {
      setOpen(false);
      console.log("err", err);
    }
  };

  useEffect(() => {
    getAllStoresInventoryDetails();
  }, []);

  const getAllStoresInventoryDetails = async () => {
    try {
      setOpen(true);
      const response = await InventoryServices.getAllConsStoresInventoryData();
      setStoresInventoryData(response.data);
    } catch (err) {
      console.log("err", err);
    } finally {
      setOpen(false);
    }
  };

  useEffect(() => {
    getAllMaterialRequisitionFormDetails();
  }, []);

  const getAllMaterialRequisitionFormDetails = async () => {
    try {
      setOpen(true);
      const response = currentPage
        ? await InventoryServices.getMaterialRequisitionFormPaginateData(
            currentPage
          )
        : await InventoryServices.getAllMaterialRequisitionFormData();
      setMaterialRequisitionData(response.data.results);
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
          await InventoryServices.getAllSearchMaterialRequisitionFormData(
            filterSearch
          );
        setMaterialRequisitionData(response.data.results);
        const total = response.data.count;
        setpageCount(Math.ceil(total / 25));
      } else {
        await getAllMaterialRequisitionFormDetails();
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
        ? await InventoryServices.getAllMaterialRequisitionFormDataPaginate(
            page,
            filterSelectedQuery
          )
        : await InventoryServices.getMaterialRequisitionFormPaginateData(page);

      if (response) {
        setMaterialRequisitionData(response.data.results);
        const total = response.data.count;
        setpageCount(Math.ceil(total / 25));
      } else {
        await getAllMaterialRequisitionFormDetails();
        setFilterSelectedQuery("");
      }
    } catch (error) {
      console.log("error", error);
    } finally {
      setOpen(false);
    }
  };
  // Stores Accept Api
  const updateMaterialRequisitionFormDetails = async (data) => {
    try {
      setOpen(true);
      const req = {
        seller_account: users.groups.includes("Stores Delhi")
          ? "Delhi"
          : "Maharashtra",
        user: data.user,
        accepted: true,
        products_data: data.products_data,
      };
      await InventoryServices.updateMaterialRequisitionFormData(data.id, req);

      setOpenPopup(false);
      setOpenPopup3(false);
      getAllMaterialRequisitionFormDetails();
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
    await getAllMaterialRequisitionFormDetails();
  };

  const openInPopup = (item) => {
    setIDForEdit(item);
    setOpenPopup(true);
  };

  const handleSnackbarClose = () => {
    setOpenSnackbar(false);
  };

  const handlePrint = async (data) => {
    try {
      setOpen(true);

      // create a new jsPDF instance
      const pdfDoc = new jsPDF();

      // generate the PDF document
      const pdfData = await pdf(
        <MyDocument materialRequisitionDataByID={data} />,
        pdfDoc,
        {
          // set options here if needed
        }
      ).toBlob();

      // create a temporary link element to trigger the download
      const link = document.createElement("a");
      link.href = URL.createObjectURL(pdfData);
      link.download = `ID Number ${data.id}.pdf`;
      document.body.appendChild(link);

      // trigger the download
      link.click();

      // clean up the temporary link element
      document.body.removeChild(link);

      setOpen(false);
    } catch (error) {
      console.log("error exporting pdf", error);
    } finally {
      setOpen(false);
    }
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
                Material Requisition Details
              </h3>
            </Box>
            <Box flexGrow={0.5} align="right">
              {users.groups.includes("Production") ||
              users.groups.includes("Production Delhi") ? (
                <Button
                  onClick={() => setOpenPopup2(true)}
                  variant="contained"
                  color="success"
                  // startIcon={<AddIcon />}
                >
                  Add
                </Button>
              ) : null}
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
              message={
                "Materail Requisition Form details Accepted successfully!"
              }
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
                  <StyledTableCell align="center">USER</StyledTableCell>
                  <StyledTableCell align="center">SELLER STATE</StyledTableCell>
                  <StyledTableCell align="center">DATE</StyledTableCell>
                  <StyledTableCell align="center">ACCEPTED</StyledTableCell>

                  <StyledTableCell align="center">Action</StyledTableCell>
                </StyledTableRow>
              </TableHead>
              <TableBody>
                {materialRequisitionData.map((row, i) => (
                  <Row
                    key={i}
                    row={row}
                    openInPopup={openInPopup}
                    users={users}
                    setOpenPopup3={setOpenPopup3}
                    handlePrint={handlePrint}
                    setMaterialRequisitionDataByID={
                      setMaterialRequisitionDataByID
                    }
                    updateMaterialRequisitionFormDetails={
                      updateMaterialRequisitionFormDetails
                    }
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
        title={"Create Material Requisition Details"}
        openPopup={openPopup2}
        setOpenPopup={setOpenPopup2}
      >
        <MaterialRequisitionFormCreate
          storesInventoryData={storesInventoryData}
          sellerOption={sellerOption}
          getAllMaterialRequisitionFormDetails={
            getAllMaterialRequisitionFormDetails
          }
          setOpenPopup={setOpenPopup2}
        />
      </Popup>
      <Popup
        fullScreen={true}
        title={"Update Material Requisition Details"}
        openPopup={openPopup}
        setOpenPopup={setOpenPopup}
      >
        <MaterialRequisitionFormUpdate
          setOpenPopup={setOpenPopup}
          sellerOption={sellerOption}
          storesInventoryData={storesInventoryData}
          getAllMaterialRequisitionFormDetails={
            getAllMaterialRequisitionFormDetails
          }
          idForEdit={idForEdit}
        />
      </Popup>
      <Popup
        maxWidth="xl"
        title={"View Material Transfer Note"}
        openPopup={openPopup3}
        setOpenPopup={setOpenPopup3}
      >
        {materialRequisitionDataByID !== null && (
          <>
            <div>
              <div style={style.container}>
                <div style={styles.row}>
                  <div id="invoice">
                    <Image style={style.logo} src={logo} />
                  </div>
                  <div style={{ ...styles.cell, textAlign: "left" }}>
                    <strong>Date</strong>
                  </div>
                  <div style={styles.cell}>
                    {materialRequisitionDataByID.created_on}
                  </div>
                </div>
                <div style={styles.row}>
                  <div style={{ ...styles.cell, textAlign: "left" }}>
                    <strong>User</strong>
                  </div>
                  <div style={styles.cell}>
                    {materialRequisitionDataByID.user}
                  </div>
                </div>
                <div style={{ ...styles.row, ...styles.header }}>
                  <div style={styles.cell}>PRODUCT</div>
                  <div style={styles.cell}>UNIT</div>
                  <div style={styles.cell}>QUANTITY</div>
                </div>
                {materialRequisitionDataByID &&
                  materialRequisitionDataByID.products_data.map(
                    (historyRow, i) => (
                      <div style={styles.row} key={i}>
                        <div style={styles.cell}>{historyRow.product}</div>
                        <div style={styles.cell}>{historyRow.unit}</div>
                        <div style={styles.cell}>{historyRow.quantity}</div>
                      </div>
                    )
                  )}
              </div>
            </div>
            <Button
              onClick={() =>
                updateMaterialRequisitionFormDetails(
                  materialRequisitionDataByID
                )
              }
              variant="contained"
              color="success"
            >
              Accept
            </Button>
          </>
        )}
      </Popup>
    </>
  );
};

function Row(props) {
  const {
    row,
    openInPopup,
    users,
    setOpenPopup3,
    setMaterialRequisitionDataByID,
    handlePrint,
  } = props;
  const [open, setOpen] = useState(false);

  return (
    <>
      {/* <CustomLoader open={open} /> */}
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
        <TableCell align="center">{row.id}</TableCell>
        <TableCell align="center">{row.user}</TableCell>
        <TableCell align="center">{row.seller_account}</TableCell>
        <TableCell align="center">{row.created_on}</TableCell>
        <TableCell align="center">
          <Switch
            checked={row.accepted}
            inputProps={{ "aria-label": "controlled" }}
          />
        </TableCell>

        <TableCell align="center">
          {(users.groups.includes("Accounts") ||
            users.groups.includes("Production") ||
            users.groups.includes("Production Delhi")) &&
            row.accepted === false && (
              <Button
                onClick={() => openInPopup(row.id)}
                variant="contained"
                color="success"
              >
                Edit
              </Button>
            )}

          <Button
            onClick={() => {
              handlePrint(row);
              setMaterialRequisitionDataByID(row);
            }}
            variant="contained"
            endIcon={<DownloadIcon />}
          >
            Download
          </Button>

          {(users.groups.includes("Stores") ||
            users.groups.includes("Stores Delhi")) &&
            row.accepted === false && (
              <Button
                onClick={() => {
                  setOpenPopup3(true);
                  setMaterialRequisitionDataByID(row);
                }}
                variant="contained"
                color="success"
              >
                View
              </Button>
            )}
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

const style = StyleSheet.create({
  container: {
    // margin: "50pt",
    // padding: "10pt",
    border: "1pt solid #ccc",
  },
  row: {
    display: "flex",
    flexDirection: "row",
    borderBottom: "1pt solid #ccc",
    padding: "5pt",
  },
  header: {
    backgroundColor: "#eee",
    fontWeight: "bold",
  },
  cell: {
    flex: 1,
    flexGrow: 1,
    textAlign: "center",
    padding: "5pt",
  },
  logo: {
    height: "auto",
    width: "100pt",
  },
  lightText: {
    color: "#777", // set the color to a light gray color
  },
});

const MyDocument = ({ materialRequisitionDataByID }) => (
  <Document>
    <Page style={{ fontFamily: "Helvetica", fontSize: "12pt" }}>
      <View style={{ padding: "20pt" }}>
        <View style={style.container}>
          <View style={style.row}>
            <View style={style.cell}>
              <Image style={style.logo} src={logo} />
            </View>
            <View
              style={{
                ...style.cell,
                justifyContent: "center",
                alignItems: "flex-start",
              }}
            >
              <Text style={{ fontSize: "18pt", fontWeight: "bold" }}>
                Material Requisition Form
              </Text>
            </View>
          </View>

          <View style={style.row}>
            <View style={style.cell}>
              <Text>Date</Text>
            </View>
            <View style={style.cell}>
              <Text style={style.lightText}>
                {moment(materialRequisitionDataByID.created_on).format(
                  "DD-MM-YYYY"
                )}
              </Text>
            </View>
          </View>
          <View style={style.row}>
            <View style={style.cell}>
              <Text>User</Text>
            </View>
            <View style={style.cell}>
              <Text style={style.lightText}>
                {materialRequisitionDataByID.user}
              </Text>
            </View>
          </View>
          <View style={style.row}>
            <View style={style.cell}>
              <Text>Accepted</Text>
            </View>
            <View style={style.cell}>
              <Text style={style.lightText}>
                {materialRequisitionDataByID.accepted ? "Yes" : "No"}
              </Text>
            </View>
          </View>
          {/* Empty row */}
          <View style={style.row}>
            <View style={style.cell}></View>
            <View style={style.cell}></View>
          </View>
          <View style={{ ...style.row, ...style.header }}>
            <View style={style.cell}>
              <Text>PRODUCT</Text>
            </View>
            <View style={style.cell}>
              <Text>UNIT</Text>
            </View>
            <View style={style.cell}>
              <Text>QUANTITY</Text>
            </View>
          </View>
          {materialRequisitionDataByID &&
            materialRequisitionDataByID.products_data.map((historyRow, i) => (
              <View style={style.row} key={i}>
                <View style={style.cell}>
                  <Text style={style.lightText}>{historyRow.product}</Text>
                </View>
                <View style={style.cell}>
                  <Text style={style.lightText}>{historyRow.unit}</Text>
                </View>
                <View style={style.cell}>
                  <Text style={style.lightText}>{historyRow.quantity}</Text>
                </View>
              </View>
            ))}
        </View>
      </View>
    </Page>
  </Document>
);

const styles = {
  container: {
    borderCollapse: "collapse",
    width: "100%",
    marginBottom: "1rem",
  },
  row: {
    display: "flex",
    borderBottom: "1px solid #dee2e6",
  },
  lastRow: {
    borderBottom: "none",
  },
  header: {
    fontWeight: "bold",
    backgroundColor: "#f2f2f2",
  },
  cell: {
    flexBasis: 0,
    flexGrow: 1,
    padding: "0.5rem",
    textAlign: "center",
  },
};

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
