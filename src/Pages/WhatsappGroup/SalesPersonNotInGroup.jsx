import React, { useEffect, useState } from "react";
import { CustomTable } from "../../Components/CustomTable";
import { Box, Grid, Paper } from "@mui/material";
import CustomerServices from "../../services/CustomerService";
import { CustomPagination } from "../../Components/CustomPagination";
import { CustomLoader } from "../../Components/CustomLoader";
import SearchComponent from "../../Components/SearchComponent ";

export const SalesPersonNotInGroup = () => {
  const [open, setOpen] = useState(false);
  const [whatsappGroupData, setWhatsappGroupData] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    getAllCustomerNotInGroupData(currentPage);
  }, [currentPage, searchQuery]);

  const getAllCustomerNotInGroupData = async () => {
    try {
      setOpen(true);
      const res = await CustomerServices.getSalesPersonNotInGroupData(
        currentPage,
        searchQuery
      );
      setWhatsappGroupData(res.data.results);
      setTotalPages(Math.ceil(res.data.count / 25));
    } catch (err) {
      console.error(err);
    } finally {
      setOpen(false);
    }
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

  const Tabledata = Array.isArray(whatsappGroupData)
    ? whatsappGroupData.map((row) => ({
        company: row.name,
        whatsapp_group: row.whatsapp_group,
        sales_person_not_in_group: Array.isArray(row.member_details) ? (
          row.member_details.map((assigned, id) => (
            <div
              key={id}
              style={{
                border: "1px solid #4caf50",
                borderRadius: "20px",
                color: "#4caf50",
              }}
            >
              {assigned}
            </div>
          ))
        ) : (
          <div
            style={{
              border: "1px solid #4caf50",
              borderRadius: "20px",
              color: "#4caf50",
            }}
          >
            row.member_details
          </div>
        ),
      }))
    : [];

  const Tableheaders = ["Company ", "Group ", "Sales Person Not In Group"];

  return (
    <>
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
                  Sales Person Not In Group
                </h3>
              </Grid>
            </Grid>
          </Box>
          <CustomTable headers={Tableheaders} data={Tabledata} />
          <CustomPagination
            currentPage={currentPage}
            totalPages={totalPages}
            handlePageChange={handlePageChange}
          />
        </Paper>
      </Grid>
    </>
  );
};
