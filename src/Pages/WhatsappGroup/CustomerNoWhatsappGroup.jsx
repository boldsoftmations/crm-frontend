import React, { useCallback, useEffect, useState } from "react";
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
import KycUpdate from "../../Pages/Cutomers/KycDetails/KycUpdate";
import { Popup } from "../../Components/Popup";
import SearchComponent from "../../Components/SearchComponent ";
import { useNotificationHandling } from "../../Components/useNotificationHandling ";
import { MessageAlert } from "../../Components/MessageAlert";
import CustomAutocomplete from "../../Components/CustomAutocomplete";
import CustomSnackbar from "../../Components/CustomerSnackbar";
import { WhatsappServices } from "../../services/Whatsapp";

export const CustomerNoWhatsappGroup = () => {
  const [open, setOpen] = useState(false);
  const [
    customerNotHavingWhatsappGroupData,
    setCustomerNotHavingWhatsappGroupData,
  ] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);
  const [openPopupKycUpdate, setOpenPopupKycUpdate] = useState(false);
  const [selectedCustomerData, setSelectedCustomerData] = useState({});
  const [searchQuery, setSearchQuery] = useState("");
  const [filterCustomer, setFilterCustomer] = useState("");
  const { handleError, handleCloseSnackbar, alertInfo } =
    useNotificationHandling();

  const [alertmsg, setAlertMsg] = useState({
    message: "",
    severity: "",
    open: false,
  });

  const handleClose = () => {
    setAlertMsg({ open: false });
  };

  const getAllCustomerNotHavingWhatsappGroup = useCallback(
    async (page = currentPage, searchValue = searchQuery) => {
      try {
        setOpen(true);
        const res = await CustomerServices.getCustomerNotHavingWhatsappGroup(
          page,
          searchValue,
          filterCustomer
        );
        setCustomerNotHavingWhatsappGroupData(res.data.results);
        setTotalPages(Math.ceil(res.data.count / 25));
        if (currentPage > Math.ceil(res.data.count / 25)) {
          setCurrentPage(1);
        }
      } catch (err) {
        handleError(err);
        console.error(err);
      } finally {
        setOpen(false);
      }
    },
    [searchQuery, filterCustomer]
  );

  useEffect(() => {
    getAllCustomerNotHavingWhatsappGroup(currentPage);
  }, [
    currentPage,
    searchQuery,
    filterCustomer,
    getAllCustomerNotHavingWhatsappGroup,
  ]);

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

  const refreshData = async () => {
    await getAllCustomerNotHavingWhatsappGroup(currentPage, searchQuery);
  };

  const Tabledata = Array.isArray(customerNotHavingWhatsappGroupData)
    ? customerNotHavingWhatsappGroupData.map((row) => ({
      name: row.name,
      id: row.id,
    }))
    : [];

  const Tableheaders = ["Company", "Action"];

  const handleKycUpdate = (data) => {
    setSelectedCustomerData(data.id);
    setOpenPopupKycUpdate(true);
  };

  const handleCreateWhatsappGroup = async (data) => {
    try {
      setOpen(true);
      await WhatsappServices.createWhatsappGroup({ customer: data.name });
      setAlertMsg({
        message: "Whatsapp Group created successfully",
        severity: "success",
        open: true,
      });
      refreshData();
    } catch (err) {
      setAlertMsg({
        message: err.response.data.message || "Failed to create Whatsapp Group",
        severity: "error",
        open: true,
      });
    } finally {
      setOpen(false);
    }
  };

  return (
    <>
      <MessageAlert
        open={alertInfo.open}
        onClose={handleCloseSnackbar}
        severity={alertInfo.severity}
        message={alertInfo.message}
      />
      <CustomSnackbar
        open={alertmsg.open}
        message={alertmsg.message}
        severity={alertmsg.severity}
        onClose={handleClose}
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
                  Customer Not Having Whatsapp Group
                </h3>
              </Grid>
              <Grid item xs={12} sm={3}>
                <CustomAutocomplete
                  size="small"
                  fullWidth
                  value={
                    FilterOptions.find(
                      (option) => option.value === filterCustomer
                    ) || null
                  }
                  onChange={(event, value) =>
                    setFilterCustomer(value ? value.value : null)
                  }
                  options={FilterOptions}
                  getOptionLabel={(option) => option.label}
                  label="Filter By Type of Customer"
                />
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
                {Tabledata.map((row, i) => (
                  <StyledTableRow key={i}>
                    <StyledTableCell align="center">{row.name}</StyledTableCell>

                    <StyledTableCell align="center">
                      <Box
                        display="flex"
                        justifyContent="center"
                        alignItems="center"
                        gap={4}
                      >
                        <Button
                          variant="outlined"
                          color="info"
                          size="small"
                          onClick={() => handleKycUpdate(row)}
                        >
                          View
                        </Button>
                        <Button
                          variant="contained"
                          color="success"
                          size="small"
                          onClick={() => handleCreateWhatsappGroup(row)}
                        >
                          Create Group
                        </Button>
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
            title={"Kyc Update"}
            openPopup={openPopupKycUpdate}
            setOpenPopup={setOpenPopupKycUpdate}
          >
            <KycUpdate
              setOpenPopup={setOpenPopupKycUpdate}
              getIncompleteKycCustomerData={refreshData}
              recordForEdit={selectedCustomerData}
              onDataUpdated={refreshData}
            />
          </Popup>
        </Paper>
      </Grid>
    </>
  );
};

const FilterOptions = [
  {
    label: "Industrial Customer",
    value: "industrial_customer",
  },
  {
    label: "Distribution Customer",
    value: "distribution_customer",
  },
  {
    label: "Exclusive Distribution Customer",
    value: "Exclusive Distribution Customer",
  },
];

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
