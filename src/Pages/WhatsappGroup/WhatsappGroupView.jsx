import React, { useEffect, useState } from "react";
import {
  Box,
  Grid,
  Paper,
  styled,
  Button,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TableBody,
  Table,
  tableCellClasses,
} from "@mui/material";
import CustomerServices from "../../services/CustomerService";
import { CustomPagination } from "../../Components/CustomPagination";
import { CustomLoader } from "../../Components/CustomLoader";
import { WhatsappGroupDelete } from "./WhatsappGroupDelete";
import { Popup } from "../../Components/Popup";
import SearchComponent from "../../Components/SearchComponent ";
import { useNotificationHandling } from "../../Components/useNotificationHandling ";
import { MessageAlert } from "../../Components/MessageAlert";
import { ViewParticipants } from "./ViewParticipants";
import { useSelector } from "react-redux";
import { UpdateAllCompanyDetails } from "../Cutomers/CompanyDetails/UpdateAllCompanyDetails";
export const WhatsappGroupView = () => {
  const userData = useSelector((state) => state.auth.profile);
  const [openPopupOfUpdateCustomer, setOpenPopupOfUpdateCustomer] =
    useState(false);
  const [open, setOpen] = useState(false);
  const [whatsappGroupData, setWhatsappGroupData] = useState([]);
  const [recordForEdit, setRecordForEdit] = useState();
  const [selectedCustomers, setSelectedCustomers] = useState();
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);
  const [searchQuery, setSearchQuery] = useState("");
  const [deletePopupOpen, setDeletePopupOpen] = useState(false);
  const [openParicipants, setOpenParicipants] = useState(false);
  const [selectedRow, setSelectedRow] = useState(null);
  const { handleError, handleCloseSnackbar, alertInfo } =
    useNotificationHandling();

  useEffect(() => {
    getAllWhatsappGroup();
  }, [currentPage, searchQuery]);

  const getAllWhatsappGroup = async (
    page = currentPage,
    searchValue = searchQuery
  ) => {
    try {
      setOpen(true);
      const res = await CustomerServices.getAllWhatsappGroupData(
        page,
        searchValue
      );
      setWhatsappGroupData(res.data.results);
      setTotalPages(Math.ceil(res.data.count / 25));
    } catch (err) {
      handleError(err);
      console.error(err);
    }
    setOpen(false);
  };


  const closeDeletePopup = () => {
    setDeletePopupOpen(false);
    getAllWhatsappGroup();
  };

  const handlePageChange = (event, value) => {
    setCurrentPage(value);
  };

  const handleSearch = (query) => {
    setSearchQuery(query);
    setCurrentPage(1);
  };

  const handleReset = () => {
    setSearchQuery("");
    setCurrentPage(1);
  };

  const ViewParticipant = (data) => {
    setOpenParicipants(true);
    setSelectedRow(data);
  };

  const Tableheaders = [
    "Company ",
    "Group Company",
    "Group Name",
    "Group ID",
    "Action",
  ];

  const openInPopupOfUpdateCustomer = (item) => {
    setRecordForEdit(item.id);
    setSelectedCustomers(item);
    setOpenPopupOfUpdateCustomer(true);
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
        <Paper sx={{ p: 2, m: 3, display: "flex", flexDirection: "column" }}>
          <Box display="flex" marginBottom="10px">
            <Grid container spacing={2}>
              <Grid item xs={12} sm={3}>
                <SearchComponent
                  onSearch={handleSearch}
                  onReset={handleReset}
                />
              </Grid>
              <Grid item xs={12} sm={6} alignItems={"center"}>
                <h3
                  style={{
                    textAlign: "center",
                    marginBottom: "1em",
                    fontSize: "24px",
                    color: "rgb(34, 34, 34)",
                    fontWeight: 800,
                  }}
                >
                  Whatsapp Group Information
                </h3>
              </Grid>
            </Grid>
          </Box>
          <TableContainer
            sx={{
              maxHeight: 450,
              "&::-webkit-scrollbar": {
                width: 15,
              },
              "&::-webkit-scrollbar-track": {
                backgroundColor: "#f2f2f2",
              },
              "&::-webkit-scrollbar-thumb": {
                backgroundColor: "#aaa9ac",
                borderRadius: 5,
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
                  {Tableheaders.map((header) => {
                    return (
                      <StyledTableCell align="center">{header}</StyledTableCell>
                    );
                  })}
                </TableRow>
              </TableHead>
              <TableBody>
                {whatsappGroupData &&
                  whatsappGroupData.map((row, i) => (
                    <StyledTableRow key={i}>
                      <StyledTableCell align="center">
                        {row.name}
                      </StyledTableCell>
                      <StyledTableCell align="center">
                        {row.ref_customer}
                      </StyledTableCell>
                      <StyledTableCell align="center">
                        {row.whatsapp_group}
                      </StyledTableCell>
                      {userData.groups.includes("Director") ? (
                        <StyledTableCell align="center">
                          {row.whatsapp_group_id}
                        </StyledTableCell>
                      ) : (
                        <StyledTableCell align="center">-</StyledTableCell>
                      )}
                      <StyledTableCell align="center">
                        <Box
                          display="flex"
                          justifyContent="center"
                          alignItems="center"
                        >
                          <Button
                            variant="text"
                            color="info"
                            size="small"
                            onClick={() => openInPopupOfUpdateCustomer(row)}
                          >
                            View company
                          </Button>
                          <Button
                            variant="text"
                            color="secondary"
                            size="small"
                            onClick={() => ViewParticipant(row)}
                          >
                            View participants
                          </Button>

                          {/* {userData.groups.includes("Director") && (
                            <Button
                              variant="text"
                              color="error"
                              size="small"
                              onClick={() => handleDelete(row)}
                            >
                              Delete
                            </Button>
                          )} */}
                        </Box>
                      </StyledTableCell>
                    </StyledTableRow>
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
            title={"Whatsapp Group Delete"}
            openPopup={deletePopupOpen}
            setOpenPopup={setDeletePopupOpen}
          >
            <WhatsappGroupDelete
              selectedData={selectedRow}
              onClose={closeDeletePopup}
            />
          </Popup>
          <Popup
            fullScreen={true}
            openPopup={openParicipants}
            setOpenPopup={setOpenParicipants}
          >
            <ViewParticipants selectedData={selectedRow} />
          </Popup>

          <Popup
            fullScreen={true}
            title={"Update Customer"}
            openPopup={openPopupOfUpdateCustomer}
            setOpenPopup={setOpenPopupOfUpdateCustomer}
          >
            <UpdateAllCompanyDetails
              setOpenPopup={setOpenPopupOfUpdateCustomer}
              getAllCompanyDetails={getAllWhatsappGroup}
              recordForEdit={recordForEdit}
              selectedCustomers={selectedCustomers}
            />
          </Popup>
        </Paper>
      </Grid>
    </>
  );
};

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
