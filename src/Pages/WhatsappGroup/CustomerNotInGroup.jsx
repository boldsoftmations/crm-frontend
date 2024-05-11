import React, { useEffect, useState } from "react";
import { CustomTable } from "../../Components/CustomTable";
import { Box, Grid, Paper } from "@mui/material";
import CustomerServices from "../../services/CustomerService";
import { CustomPagination } from "../../Components/CustomPagination";
import { CustomLoader } from "../../Components/CustomLoader";
import SearchComponent from "../../Components/SearchComponent ";

export const CustomerNotInGroup = () => {
  const [open, setOpen] = useState(false);
  const [whatsappGroupData, setWhatsappGroupData] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    getAllCustomerNotInGroupData();
  }, [currentPage, searchQuery]);

  const getAllCustomerNotInGroupData = async () => {
    try {
      setOpen(true);
      const res = await CustomerServices.getCustomerNotInGroupData(
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
    ? whatsappGroupData.map(
        ({ name, whatsapp_group, assigned_to, member_details }) => ({
          company: name,
          whatsapp_group,
          assigned_to: Array.isArray(assigned_to) ? (
            assigned_to.map((assigned, id) => (
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
              assigned_to
            </div>
          ),
        })
      )
    : [];

  const Tableheaders = ["Company ", "Group", "Assigned Sales Person"];

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
                  Customer Not In Group
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
