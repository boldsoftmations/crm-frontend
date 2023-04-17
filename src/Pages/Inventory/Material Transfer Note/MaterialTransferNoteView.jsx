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
  IconButton,
  Switch,
  Snackbar,
} from "@mui/material";
import { tableCellClasses } from "@mui/material/TableCell";
import CloseIcon from "@mui/icons-material/Close";
import DownloadIcon from "@mui/icons-material/Download";
import jsPDF from "jspdf";
import {
  pdf,
  Image,
  Document,
  Page,
  View,
  Text,
  StyleSheet,
} from "@react-pdf/renderer";
import logo from "../../../Images/LOGOS3.png";
import moment from "moment";
import { CustomLoader } from "../../../Components/CustomLoader";
import { CustomSearch } from "../../../Components/CustomSearch";
import { ErrorMessage } from "../../../Components/ErrorMessage/ErrorMessage";
import { Popup } from "../../../Components/Popup";
import InventoryServices from "../../../services/InventoryService";

import { useSelector } from "react-redux";
import { MaterialTransferNoteCreate } from "./MaterialTransferNoteCreate";
import { MaterialTransferNoteUpdate } from "./MaterialTransferNoteUpdate";

export const MaterialTransferNoteView = () => {
  const [openPopup, setOpenPopup] = useState(false);
  const [openPopup2, setOpenPopup2] = useState(false);
  const [openPopup3, setOpenPopup3] = useState(false);
  const [open, setOpen] = useState(false);
  const errRef = useRef();
  const [errMsg, setErrMsg] = useState("");
  const [materialTransferNote, setMaterialTransferNote] = useState([]);
  const [materialTransferNoteByID, setMaterialTransferNoteByID] = useState([]);
  const [pageCount, setpageCount] = useState(0);
  const [currentPage, setCurrentPage] = useState(0);
  const [filterSelectedQuery, setFilterSelectedQuery] = useState("");
  const [idForEdit, setIDForEdit] = useState("");
  const [openSnackbar, setOpenSnackbar] = useState(false);
  const users = useSelector((state) => state.auth.profile);
  const handleInputChange = (event) => {
    setFilterSelectedQuery(event.target.value);
    getSearchData(event.target.value);
  };

  useEffect(() => {
    getAllMaterialTransferNoteDetails();
  }, []);

  const getAllMaterialTransferNoteDetails = async () => {
    try {
      setOpen(true);
      const response = currentPage
        ? await InventoryServices.getMaterialTransferNotePaginateData(
            currentPage
          )
        : await InventoryServices.getAllMaterialTransferNoteData();
      setMaterialTransferNote(response.data.results);
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
          await InventoryServices.getAllSearchMaterialTransferNoteData(
            filterSearch
          );
        setMaterialTransferNote(response.data.results);
        const total = response.data.count;
        setpageCount(Math.ceil(total / 25));
      } else {
        await getAllMaterialTransferNoteDetails();
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
        ? await InventoryServices.getAllMaterialTransferNoteDataPaginate(
            page,
            filterSelectedQuery
          )
        : await InventoryServices.getMaterialTransferNotePaginateData(page);

      if (response) {
        setMaterialTransferNote(response.data.results);
        const total = response.data.count;
        setpageCount(Math.ceil(total / 25));
      } else {
        await getAllMaterialTransferNoteDetails();
        setFilterSelectedQuery("");
      }
    } catch (error) {
      console.log("error", error);
    } finally {
      setOpen(false);
    }
  };
  // Stores Accept Api
  const updateMaterialTransferNoteDetails = async (data) => {
    try {
      setOpen(true);
      const req = {
        seller_account: users.groups.includes("Stores Delhi")
          ? "Delhi"
          : "Maharashtra",
        user: data.user,
        accepted: true,
        product: data.product,
        quantity: data.quantity,
      };
      await InventoryServices.updateMaterialTransferNoteData(data.id, req);

      setOpenPopup(false);
      setOpenPopup3(false);
      getAllMaterialTransferNoteDetails();
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
    await getAllMaterialTransferNoteDetails();
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
        <MyDocument materialTransferNoteByID={data} />,
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
                Material Transfer Note
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
              message={"Materail Transfer Note details Accepted successfully!"}
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
                  <StyledTableCell align="center">USER</StyledTableCell>
                  <StyledTableCell align="center">SELLER STATE</StyledTableCell>
                  <StyledTableCell align="center">PRODUCT</StyledTableCell>
                  <StyledTableCell align="center">UNIT</StyledTableCell>
                  <StyledTableCell align="center">QUANTITY</StyledTableCell>
                  <StyledTableCell align="center">ACCEPTED</StyledTableCell>

                  <StyledTableCell align="center">Action</StyledTableCell>
                </StyledTableRow>
              </TableHead>
              <TableBody>
                {materialTransferNote.map((row, i) => (
                  <StyledTableRow>
                    <StyledTableCell align="center">{row.user}</StyledTableCell>
                    <StyledTableCell align="center">
                      {row.seller_account}
                    </StyledTableCell>
                    <StyledTableCell align="center">
                      {row.product}
                    </StyledTableCell>
                    <StyledTableCell align="center">{row.unit}</StyledTableCell>
                    <StyledTableCell align="center">
                      {row.quantity}
                    </StyledTableCell>
                    <StyledTableCell align="center">
                      <Switch
                        checked={row.accepted}
                        inputProps={{ "aria-label": "controlled" }}
                      />
                    </StyledTableCell>
                    <StyledTableCell align="center">
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
                          setMaterialTransferNoteByID(row);
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
                              setMaterialTransferNoteByID(row);
                            }}
                            variant="contained"
                            color="success"
                          >
                            View
                          </Button>
                        )}
                    </StyledTableCell>
                  </StyledTableRow>
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
        title={"Create Material Transfer Note"}
        openPopup={openPopup2}
        setOpenPopup={setOpenPopup2}
      >
        <MaterialTransferNoteCreate
          getAllMaterialTransferNoteDetails={getAllMaterialTransferNoteDetails}
          setOpenPopup={setOpenPopup2}
        />
      </Popup>
      <Popup
        fullScreen={true}
        title={"Update Material Transfer Note"}
        openPopup={openPopup}
        setOpenPopup={setOpenPopup}
      >
        <MaterialTransferNoteUpdate
          setOpenPopup={setOpenPopup}
          getAllMaterialTransferNoteDetails={getAllMaterialTransferNoteDetails}
          idForEdit={idForEdit}
        />
      </Popup>
      <Popup
        maxWidth="xl"
        title={"View Material Transfer Note"}
        openPopup={openPopup3}
        setOpenPopup={setOpenPopup3}
      >
        <div className="my-4">
          <table className="table table-bordered">
            <tbody>
              <tr>
                <td>
                  <strong>Date</strong>
                </td>
                <td>{materialTransferNoteByID.created_on}</td>
              </tr>
              <tr>
                <td>
                  <strong>Product</strong>
                </td>
                <td>{materialTransferNoteByID.product}</td>
              </tr>
              <tr>
                <td>
                  <strong>Quantity</strong>
                </td>
                <td>{materialTransferNoteByID.quantity}</td>
              </tr>
              <tr>
                <td>
                  <strong>User</strong>
                </td>
                <td>{materialTransferNoteByID.user}</td>
              </tr>
              <tr>
                <td>
                  <strong>Unit</strong>
                </td>
                <td>{materialTransferNoteByID.unit}</td>
              </tr>
            </tbody>
          </table>
          <Button
            onClick={() =>
              updateMaterialTransferNoteDetails(materialTransferNoteByID)
            }
            variant="contained"
            color="success"
          >
            Accept
          </Button>
        </div>
      </Popup>
    </>
  );
};

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

const MyDocument = ({ materialTransferNoteByID }) => (
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
                Material Transfer Note
              </Text>
            </View>
          </View>

          <View style={style.row}>
            <View style={style.cell}>
              <Text>Date</Text>
            </View>
            <View style={style.cell}>
              <Text style={style.lightText}>
                {moment(materialTransferNoteByID.created_on).format(
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
                {materialTransferNoteByID.user}
              </Text>
            </View>
          </View>
          <View style={style.row}>
            <View style={style.cell}>
              <Text>Accepted</Text>
            </View>
            <View style={style.cell}>
              <Text style={style.lightText}>
                {materialTransferNoteByID.accepted ? "Yes" : "No"}
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

          <View style={style.row}>
            <View style={style.cell}>
              <Text style={style.lightText}>
                {materialTransferNoteByID.product}
              </Text>
            </View>
            <View style={style.cell}>
              <Text style={style.lightText}>
                {materialTransferNoteByID.unit}
              </Text>
            </View>
            <View style={style.cell}>
              <Text style={style.lightText}>
                {materialTransferNoteByID.quantity}
              </Text>
            </View>
          </View>
        </View>
      </View>
    </Page>
  </Document>
);

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
