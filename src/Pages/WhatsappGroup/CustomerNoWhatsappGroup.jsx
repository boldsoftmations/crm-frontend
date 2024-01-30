import React, { useCallback, useEffect, useState } from "react";
import { CustomTable } from "../../Components/CustomTable";
import { Box, Button, Grid, Paper } from "@mui/material";
import CustomerServices from "../../services/CustomerService";
import { CustomPagination } from "../../Components/CustomPagination";
import { CustomLoader } from "../../Components/CustomLoader";
import KycUpdate from "../../Pages/Cutomers/KycDetails/KycUpdate";
import { Popup } from "../../Components/Popup";
import CustomTextField from "../../Components/CustomTextField";

export const CustomerNoWhatsappGroup = () => {
  const [open, setOpen] = useState(false);
  const [
    customerNotHavingWhatsappGroupData,
    setCustomerNotHavingWhatsappGroupData,
  ] = useState([]);
  const [pageCount, setPageCount] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [openPopupKycUpdate, setOpenPopupKycUpdate] = useState(false);
  const [selectedCustomerData, setSelectedCustomerData] = useState({});
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    getAllCustomerNotHavingWhatsappGroup(currentPage);
  }, [currentPage, getAllCustomerNotHavingWhatsappGroup]);

  const getAllCustomerNotHavingWhatsappGroup = useCallback(
    async (page = currentPage, searchValue = searchQuery) => {
      try {
        setOpen(true);
        const res = await CustomerServices.getCustomerNotHavingWhatsappGroup(
          page,
          searchValue
        );
        setCustomerNotHavingWhatsappGroupData(res.data.results);
        setPageCount(Math.ceil(res.data.count / 25));
        if (currentPage > Math.ceil(res.data.count / 25)) {
          setCurrentPage(1);
        }
      } catch (err) {
        console.error(err);
      } finally {
        setOpen(false);
      }
    },
    [searchQuery]
  );

  const handlePageClick = (event, value) => {
    setCurrentPage(value);
  };

  const handleSearchChange = (event) => {
    setSearchQuery(event.target.value);
  };

  const Tabledata = Array.isArray(customerNotHavingWhatsappGroupData)
    ? customerNotHavingWhatsappGroupData.map((row) => ({
        name: row.name,
        whatsapp_group: row.whatsapp_group,
      }))
    : [];

  const Tableheaders = ["Company ", "Group Name", "Action"];

  const handleKycUpdate = async (data) => {
    try {
      setOpen(true);
      const response = await CustomerServices.getAllCustomerData(
        "Active",
        "all",
        null,
        data.name
      );
      setSelectedCustomerData(response.data[0].id);
      setOpenPopupKycUpdate(true);
    } catch (error) {
      console.error("error while getting customer data", error);
    } finally {
      setOpen(false);
    }
  };

  return (
    <>
      <CustomLoader open={open} />
      <Grid item xs={12}>
        <Paper sx={{ p: 2, m: 3, display: "flex", flexDirection: "column" }}>
          <Box display="flex" marginBottom="10px">
            <Grid container spacing={2}>
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
                  onClick={() => {
                    setCurrentPage(1);
                    getAllCustomerNotHavingWhatsappGroup(1, searchQuery);
                  }}
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
                    setCurrentPage(1);
                    getAllCustomerNotHavingWhatsappGroup(1, "");
                  }}
                >
                  Reset
                </Button>
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
            pageCount={pageCount}
            handlePageClick={handlePageClick}
          />
          <Popup
            title={"Kyc Update"}
            openPopup={openPopupKycUpdate}
            setOpenPopup={setOpenPopupKycUpdate}
          >
            <KycUpdate
              setOpenPopup={setOpenPopupKycUpdate}
              getIncompleteKycCustomerData={
                getAllCustomerNotHavingWhatsappGroup
              }
              recordForEdit={selectedCustomerData}
            />
          </Popup>
        </Paper>
      </Grid>
    </>
  );
};
