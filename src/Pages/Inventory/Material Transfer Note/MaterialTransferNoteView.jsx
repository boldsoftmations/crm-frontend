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
import { CustomLoader } from "../../../Components/CustomLoader";
import { CustomSearch } from "../../../Components/CustomSearch";
import { ErrorMessage } from "../../../Components/ErrorMessage/ErrorMessage";
import { Popup } from "../../../Components/Popup";
import InventoryServices from "../../../services/InventoryService";

import { useSelector } from "react-redux";
import { MaterialTransferNoteCreate } from "./MaterialTransferNoteCreate";
import { MaterialTransferNoteUpdate } from "./MaterialTransferNoteUpdate";

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

export const MaterialTransferNoteView = () => {
  const [openPopup, setOpenPopup] = useState(false);
  const [openPopup2, setOpenPopup2] = useState(false);
  const [open, setOpen] = useState(false);
  const errRef = useRef();
  const [errMsg, setErrMsg] = useState("");
  const [materialTransferNote, setMaterialTransferNote] = useState([]);
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
        user: data.user,
        accepted: true,
        product: data.product,
        quantity: data.quantity,
      };
      await InventoryServices.updateMaterialTransferNoteData(data.id, req);

      setOpenPopup(false);
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
              {users.groups.toString() !== "Stores" ? (
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
                      {users.groups.toString() !== "Stores" ? (
                        <Button
                          onClick={() => openInPopup(row.id)}
                          variant="contained"
                          color="success"
                        >
                          Edit
                        </Button>
                      ) : (
                        <Button
                          onClick={() => updateMaterialTransferNoteDetails(row)}
                          variant="contained"
                          color="success"
                        >
                          Accept
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
    </>
  );
};
