import React, { useEffect, useState } from "react";
import {
  Box,
  Grid,
  Button,
  Paper,
  styled,
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
import SearchComponent from "../../Components/SearchComponent ";
import CustomAutocomplete from "../../Components/CustomAutocomplete";
import { Popup } from "../../Components/Popup";
import { UpdateAllCompanyDetails } from "../Cutomers/CompanyDetails/UpdateAllCompanyDetails";

export const CustomerNotInGroup = () => {
  const [open, setOpen] = useState(false);
  const [openPopupOfUpdateCustomer, setOpenPopupOfUpdateCustomer] =
    useState(false);
  const [selectedCustomers, setSelectedCustomers] = useState();
  const [recordForEdit, setRecordForEdit] = useState();
  const [whatsappGroupData, setWhatsappGroupData] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);
  const [searchQuery, setSearchQuery] = useState("");
  const [filterCustomer, setFilterCustomer] = useState("");
  useEffect(() => {
    getAllCustomerNotInGroupData();
  }, [currentPage, searchQuery, filterCustomer]);

  const getAllCustomerNotInGroupData = async () => {
    try {
      setOpen(true);
      const res = await CustomerServices.getCustomerNotInGroupData(
        currentPage,
        searchQuery,
        filterCustomer
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
        ({ id, name, whatsapp_group, assigned_to, member_details }) => ({
          company: name,
          whatsapp_group,
          id,
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

  const Tableheaders = ["Company ", "Group", "Assigned Sales Person", "Action"];

  const openInPopupOfUpdateCustomer = (item) => {
    setRecordForEdit(item.id);
    setSelectedCustomers(item);
    setOpenPopupOfUpdateCustomer(true);
  };
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
                    <StyledTableCell align="center">
                      {row.company}
                    </StyledTableCell>
                    <StyledTableCell align="center">
                      {row.whatsapp_group}
                    </StyledTableCell>
                    <StyledTableCell align="center">
                      {row.assigned_to}
                    </StyledTableCell>
                    <StyledTableCell align="center">
                      <Button
                        style={{ marginRight: "10px" }}
                        variant="outlined"
                        color="info"
                        size="small"
                        onClick={() => openInPopupOfUpdateCustomer(row)}
                      >
                        View
                      </Button>
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
        </Paper>
        <Popup
          fullScreen={true}
          title={"Update Customer"}
          openPopup={openPopupOfUpdateCustomer}
          setOpenPopup={setOpenPopupOfUpdateCustomer}
        >
          <UpdateAllCompanyDetails
            setOpenPopup={setOpenPopupOfUpdateCustomer}
            recordForEdit={recordForEdit}
            getAllCompanyDetails={getAllCustomerNotInGroupData}
            selectedCustomers={selectedCustomers}
          />
        </Popup>
      </Grid>
    </>
  );
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
