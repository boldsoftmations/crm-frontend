import React, { useCallback, useEffect, useState } from "react";
import { CustomTable } from "../../Components/CustomTable";
import { Box, Grid, Paper } from "@mui/material";
import CustomerServices from "../../services/CustomerService";
import { CustomPagination } from "../../Components/CustomPagination";
import { CustomLoader } from "../../Components/CustomLoader";
import KycUpdate from "../../Pages/Cutomers/KycDetails/KycUpdate";
import { Popup } from "../../Components/Popup";
import SearchComponent from "../../Components/SearchComponent ";
import { useNotificationHandling } from "../../Components/useNotificationHandling ";
import { MessageAlert } from "../../Components/MessageAlert";

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
  const { handleError, handleCloseSnackbar, alertInfo } =
    useNotificationHandling();

  const getAllCustomerNotHavingWhatsappGroup = useCallback(
    async (page = currentPage, searchValue = searchQuery) => {
      try {
        setOpen(true);
        const res = await CustomerServices.getCustomerNotHavingWhatsappGroup(
          page,
          searchValue
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
    [searchQuery]
  );

  useEffect(() => {
    getAllCustomerNotHavingWhatsappGroup(currentPage);
  }, [currentPage, searchQuery, getAllCustomerNotHavingWhatsappGroup]);

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
        id: row.id,
        name: row.name,
      }))
    : [];

  const Tableheaders = ["ID", "Company", "Action"];

  const handleKycUpdate = async (data) => {
    setSelectedCustomerData(data.id);
    setOpenPopupKycUpdate(true);
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
                  Customer Not Having Whatsapp Group
                </h3>
              </Grid>
            </Grid>
          </Box>
          <CustomTable
            headers={Tableheaders}
            data={Tabledata}
            openInPopup={handleKycUpdate}
          />
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
