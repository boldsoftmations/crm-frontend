import React, { useEffect, useState } from "react";
import {
  Box,
  Grid,
  Paper,
  styled,
  TableCell,
  Button,
  TableContainer,
  TableHead,
  TableRow,
  TableBody,
  Table,
  tableCellClasses,
  Collapse,
  IconButton,
  Typography,
} from "@mui/material";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import KeyboardArrowUpIcon from "@mui/icons-material/KeyboardArrowUp";
import { CustomLoader } from "../../../Components/CustomLoader";
import SearchComponent from "../../../Components/SearchComponent ";
import { CustomPagination } from "../../../Components/CustomPagination";
import { Popup } from "../../../Components/Popup";
import { CreatePincode } from "./CreatePincode";
import CustomSnackbar from "../../../Components/CustomerSnackbar";
import MasterService from "../../../services/MasterService";
import { UpdatePincode } from "./UpdatePincode";
import { CreateAlias } from "./CreateAlias";
import MergePincodeCreate from "./MergePincodeCreate";
import CustomAutocomplete from "../../../Components/CustomAutocomplete";
import { useSelector } from "react-redux";
import { canEditPincode } from "../../../utility/masterAccess";

export const ViewPincode = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [pincode, setPincode] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);
  const [searchQuery, setSearchQuery] = useState("");
  const [recordForEdit, setRecordForEdit] = useState(null);
  const [openPopup, setOpenPopup] = useState(false);
  const [openUpdatePopup, setOpenUpdatePopup] = useState(false);
  const [openAlisaPopup, setOpenAlisaPopup] = useState(false);
  const [alertmsg, setAlertMsg] = useState({
    message: "",
    severity: "",
    open: false,
  });
  const [openMergePopup, setOpenMergePopup] = useState(false);
  const [status, setStatus] = useState("Active");

  const userData = useSelector((state) => state.auth.profile);
  const canAdmin = canEditPincode(userData);
  const handleClose = () => {
    setAlertMsg({ open: false });
  };

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
  const openInPopup = (data) => {
    setRecordForEdit(data);
    setOpenUpdatePopup(true);
  };
  const openAliasPopup = (data) => {
    setRecordForEdit(data);
    setOpenAlisaPopup(true);
  };
  const openMergePopupHandler = (data) => {
    setRecordForEdit(data);
    setOpenMergePopup(true);
  };
  const getMasterPincode = async () => {
    try {
      setIsLoading(true);
      const response = await MasterService.getMasterPincode(
        currentPage,
        searchQuery,
        status === "Active",
      );
      setPincode(response.data.results);
      setTotalPages(Math.ceil(response.data.count / 25));
    } catch (e) {
      setAlertMsg({
        message: e.response.data.message || "Error fetching countries",
        severity: "error",
        open: true,
      });
    } finally {
      setIsLoading(false);
    }
  };
  useEffect(() => {
    getMasterPincode();
  }, [currentPage, searchQuery, status]);

  return (
    <>
      <CustomSnackbar
        open={alertmsg.open}
        message={alertmsg.message}
        severity={alertmsg.severity}
        onClose={handleClose}
      />
      <CustomLoader open={isLoading} />
      <Grid item xs={12}>
        <Paper sx={{ p: 2, m: 3, display: "flex", flexDirection: "column" }}>
          <Box sx={{ marginBottom: 2, display: "flex", alignItems: "center" }}>
            <Grid container spacing={2} alignItems="center">
              <Grid item xs={12} sm={4}>
                <SearchComponent
                  onSearch={handleSearch}
                  onReset={handleReset}
                />
              </Grid>
              <Grid item xs={12} sm={4}>
                <Box display="flex" justifyContent="center">
                  <h3
                    style={{
                      fontSize: "24px",
                      color: "rgb(34, 34, 34)",
                      fontWeight: 800,
                      textAlign: "center",
                    }}
                  >
                    All Pin Code List
                  </h3>
                </Box>
              </Grid>
              <Grid item xs={12} sm={4}>
                <Box sx={{ display: "flex", gap: 2 }}>
                  <CustomAutocomplete
                    label="Status"
                    value={status}
                    options={["Active", "Inactive"]}
                    onChange={(event, newValue) => {
                      setStatus(newValue || "Active");
                      setCurrentPage(1);
                    }}
                    sx={{ width: "70%" }}
                  />
                  {canAdmin && (
                    <Button
                      variant="contained"
                      color="info"
                      size="small"
                      onClick={() => setOpenPopup(true)}
                    >
                      Add
                    </Button>
                  )}
                </Box>
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
              sx={{ minWidth: 1200 }}
              stickyHeader
              aria-label="sticky table"
            >
              <TableHead>
                <TableRow>
                  <StyledTableCell align="center"></StyledTableCell>
                  <StyledTableCell align="center">County </StyledTableCell>
                  <StyledTableCell align="center">Zone </StyledTableCell>
                  <StyledTableCell align="center">State </StyledTableCell>
                  <StyledTableCell align="center">City</StyledTableCell>
                  <StyledTableCell align="center">Pincode</StyledTableCell>
                  <StyledTableCell align="center">Action</StyledTableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {pincode &&
                  pincode.map((row, i) => (
                    <Row
                      key={i}
                      row={row}
                      openInPopup={openInPopup}
                      openAliasPopup={openAliasPopup}
                      openMergePopupHandler={openMergePopupHandler}
                      canAdmin={canAdmin}
                    />
                  ))}
              </TableBody>
            </Table>
          </TableContainer>
          <CustomPagination
            currentPage={currentPage}
            totalPages={totalPages}
            handlePageChange={handlePageChange}
          />
          <Popup
            title="Add Pincode"
            openPopup={openPopup}
            setOpenPopup={setOpenPopup}
          >
            <CreatePincode
              setOpenPopup={setOpenPopup}
              getMasterPincode={getMasterPincode}
            />
          </Popup>
          <Popup
            title="Create Alias"
            openPopup={openAlisaPopup}
            setOpenPopup={setOpenAlisaPopup}
          >
            <CreateAlias
              recordForEdit={recordForEdit}
              getMasterPincode={getMasterPincode}
              setOpenAlisaPopup={setOpenAlisaPopup}
            />
          </Popup>

          <Popup
            title="Merge Pincode"
            openPopup={openMergePopup}
            setOpenPopup={setOpenMergePopup}
          >
            <MergePincodeCreate
              recordForEdit={recordForEdit}
              getMasterPincode={getMasterPincode}
              setOpenMergePopup={setOpenMergePopup}
              PincodeData={pincode}
            />
          </Popup>

          <Popup
            title="Update Pin Code"
            openPopup={openUpdatePopup}
            setOpenPopup={setOpenUpdatePopup}
          >
            <UpdatePincode
              recordForEdit={recordForEdit}
              getMasterPincode={getMasterPincode}
              setOpenUpdatePopup={setOpenUpdatePopup}
            />
          </Popup>
        </Paper>
      </Grid>
    </>
  );
};

function Row({
  row,
  openInPopup,
  openAliasPopup,
  openMergePopupHandler,
  canAdmin,
}) {
  const [open, setOpen] = useState(false);

  const aliases =
    row.pincode_aliases && row.pincode_aliases.length > 0
      ? row.pincode_aliases
      : [];

  return (
    <>
      <StyledTableRow sx={{ "& > *": { borderBottom: "unset" } }}>
        <StyledTableCell align="center">
          <IconButton
            aria-label="expand row"
            size="small"
            onClick={() => setOpen(!open)}
          >
            {open ? <KeyboardArrowUpIcon /> : <KeyboardArrowDownIcon />}
          </IconButton>
        </StyledTableCell>
        <StyledTableCell align="center">
          {row.country_name ? row.country_name : row.country}
        </StyledTableCell>
        <StyledTableCell align="center">{row.zone}</StyledTableCell>
        <StyledTableCell align="center">
          {row.state_name ? row.state_name : row.state}
        </StyledTableCell>
        <StyledTableCell align="center">{row.city_name}</StyledTableCell>
        <StyledTableCell align="center">{row.pincode}</StyledTableCell>
        <StyledTableCell align="center">
          <Box display="flex" justifyContent="center" gap={1}>
            {canAdmin && (
              <Button
                variant="contained"
                color="success"
                size="small"
                onClick={() => openInPopup(row)}
              >
                Edit
              </Button>
            )}
            {canAdmin && (
              <Button
                variant="contained"
                size="small"
                color="info"
                onClick={() => openAliasPopup(row)}
              >
                Create Alias
              </Button>
            )}
            {canAdmin && (
              <Button
                variant="contained"
                size="small"
                color="warning"
                onClick={() => openMergePopupHandler(row)}
              >
                Merge Pincode
              </Button>
            )}
          </Box>
        </StyledTableCell>
      </StyledTableRow>

      <TableRow>
        <TableCell style={{ paddingBottom: 0, paddingTop: 0 }} colSpan={7}>
          <Collapse in={open} timeout="auto" unmountOnExit>
            <Box sx={{ margin: 1 }}>
              <Typography variant="h6" gutterBottom component="div">
                Pincode Aliases
              </Typography>
              <Table size="small" aria-label="pincode-aliases">
                <TableHead>
                  <TableRow>
                    <TableCell align="center">SR.NO</TableCell>
                    <TableCell align="center">POSTAL CODE</TableCell>
                    <TableCell align="center">ALIAS NAME</TableCell>
                    <TableCell align="center">ALIAS TYPE</TableCell>
                    <TableCell align="center">PRIMARY</TableCell>
                    <TableCell align="center">ACTIVE</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {aliases.length > 0 ? (
                    aliases.map((alias, i) => (
                      <StyledTableRow key={alias.id ? alias.id : i}>
                        <StyledTableCell align="center">
                          {i + 1}
                        </StyledTableCell>
                        <StyledTableCell align="center">
                          {alias.postal_code}
                        </StyledTableCell>
                        <StyledTableCell align="center">
                          {alias.alias_name}
                        </StyledTableCell>
                        <StyledTableCell align="center">
                          {alias.alias_type}
                        </StyledTableCell>
                        <StyledTableCell align="center">
                          {alias.is_primary ? "Yes" : "No"}
                        </StyledTableCell>
                        <StyledTableCell align="center">
                          {alias.is_active ? "Yes" : "No"}
                        </StyledTableCell>
                      </StyledTableRow>
                    ))
                  ) : (
                    <TableRow>
                      <TableCell
                        colSpan={6}
                        align="center"
                        sx={{ color: "#999" }}
                      >
                        No aliases found
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </Box>
          </Collapse>
        </TableCell>
      </TableRow>
    </>
  );
}

const StyledTableCell = styled(TableCell)(({ theme }) => ({
  [`&.${tableCellClasses.head}`]: {
    fontSize: 12,
    backgroundColor: "#006BA1",
    color: theme.palette.common.white,
    fontWeight: "bold",
    textTransform: "uppercase",
  },
  [`&.${tableCellClasses.body}`]: {
    fontSize: 13,
  },
}));

const StyledTableRow = styled(TableRow)(({ theme }) => ({
  "&:nth-of-type(odd)": {
    backgroundColor: theme.palette.action.hover,
  },
  "&:last-child td, &:last-child th": {
    border: 0,
  },
}));
