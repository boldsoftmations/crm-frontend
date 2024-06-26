import React, { useEffect, useRef, useState, useCallback } from "react";
import { Box, Paper, Grid, Button } from "@mui/material";
import { CSVLink } from "react-csv";
import { CustomPagination } from "../../Components/CustomPagination";
import { CustomLoader } from "../../Components/CustomLoader";
import ProductForecastService from "../../services/ProductForecastService";
import { Popup } from "../../Components/Popup";
import { UpdateAllCompanyDetails } from "../Cutomers/CompanyDetails/UpdateAllCompanyDetails";
import { CustomTable } from "../../Components/CustomTable";
import ProductService from "../../services/ProductService";
import { Helmet } from "react-helmet";
import { useSelector } from "react-redux";
import CustomAutocomplete from "../../Components/CustomAutocomplete";
import { useNotificationHandling } from "../../Components/useNotificationHandling ";
import { MessageAlert } from "../../Components/MessageAlert";
import SearchComponent from "../../Components/SearchComponent ";

export const DeadCustomerView = () => {
  const [open, setOpen] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);
  const [salesPersonByFilter, setSalesPersonByFilter] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [deadCustomer, setDeadCustomer] = useState([]);
  const [recordForEdit, setRecordForEdit] = useState(null);
  const [openPopup, setOpenPopup] = useState(false);
  const [exportData, setExportData] = useState([]);
  const [product, setProduct] = useState([]);
  const csvLinkRef = useRef(null);
  const [isPrinting, setIsPrinting] = useState(false);
  const UserData = useSelector((state) => state.auth.profile);
  const assignedOption = UserData.sales_users || [];
  const { handleSuccess, handleError, handleCloseSnackbar, alertInfo } =
    useNotificationHandling();

  useEffect(() => {
    const beforePrint = () => {
      setIsPrinting(true);
      setDeadCustomer([]);
    };

    const afterPrint = () => {
      setIsPrinting(false);
      // Fetch the data again and update the companyData state
      getAllDeadCustomerForecastDetails();
    };

    window.addEventListener("beforeprint", beforePrint);
    window.addEventListener("afterprint", afterPrint);

    return () => {
      window.removeEventListener("beforeprint", beforePrint);
      window.removeEventListener("afterprint", afterPrint);
    };
  }, []);

  const handleDownload = async () => {
    try {
      const data = await handleExport();
      setExportData(data);
      setTimeout(() => {
        csvLinkRef.current.link.click();
      });
      handleSuccess("CSV Download successfully");
    } catch (error) {
      handleError(error);
      console.error("CSVLink Download error", error);
    }
  };

  const headers = [
    { label: "Company", key: "company" },
    { label: "City", key: "city" },
    { label: "State", key: "state" },
    { label: "Sales Person 1", key: "sales_person_1" },
    { label: "Sales Person 2", key: "sales_person_2" },
    { label: "Sales Person 3", key: "sales_person_3" },
    { label: "Sales Person 4", key: "sales_person_4" },
    { label: "Contact Person Name", key: "contact_person_name" },
    { label: "Contact", key: "contact" },
  ];

  const handleExport = async () => {
    try {
      setOpen(true);
      const response = await ProductForecastService.getAllDeadCustomerData(
        "all",
        salesPersonByFilter,
        searchQuery
      );
      const data = response.data.map((row) => {
        const salesPersons = row.assigned_to.map((email, index) => ({
          [`sales_person_${index + 1}`]: email,
        }));
        const obj = {
          company: row.name,
          city: row.city,
          state: row.state,
          ...salesPersons.reduce((acc, sp) => ({ ...acc, ...sp }), {}),
          contact_person_name:
            row.contacts && row.contacts[0] ? row.contacts[0].name : "",
          contact:
            row.contacts && row.contacts[0] ? row.contacts[0].contact : "",
        };
        return obj;
      });
      console.log(data);

      return data;
    } catch (err) {
      console.log(err);
    } finally {
      setOpen(false);
    }
  };

  const getProduct = async () => {
    try {
      setOpen(true);
      const res = await ProductService.getAllProduct();
      setProduct(res.data);
    } catch (err) {
      console.error("error potential", err);
    } finally {
      setOpen(false);
    }
  };

  useEffect(() => {
    getProduct();
  }, []);

  const getAllDeadCustomerForecastDetails = useCallback(async () => {
    try {
      setOpen(true);
      const response = await ProductForecastService.getAllDeadCustomerData(
        currentPage,
        salesPersonByFilter,
        searchQuery
      );
      setDeadCustomer(response.data.results);
      const total = response.data.count;
      setTotalPages(Math.ceil(total / 25));
    } catch (error) {
      handleError(error);
      console.error("Error fetching Customer Having Forecast", error);
    } finally {
      setOpen(false);
    }
  }, [currentPage, salesPersonByFilter, searchQuery]);

  useEffect(() => {
    getAllDeadCustomerForecastDetails();
  }, [currentPage, salesPersonByFilter, searchQuery]);

  const handleSearch = (query) => {
    setSearchQuery(query);
    setCurrentPage(1); // Reset to first page with new search
  };

  const handleReset = () => {
    setSearchQuery("");
    setCurrentPage(1); // Reset to first page with no search query
  };

  const handlePageChange = (event, value) => {
    setCurrentPage(value);
  };

  const handleEditClick = useCallback(
    (item) => {
      setRecordForEdit(item.id);
      setOpenPopup(true);
    },
    [deadCustomer]
  );

  const handleFilterChange = (value) => {
    setSalesPersonByFilter(value);
    getAllDeadCustomerForecastDetails(currentPage, value, searchQuery);
  };

  const Tabledata = deadCustomer.map((row) => ({
    id: row.id,
    company: row.name,
    city: row.city,
    state: row.state,
    sales_person: row.assigned_to,
    contact_person_name:
      row.contacts && row.contacts[0] ? row.contacts[0].name : "",
    contact: row.contacts && row.contacts[0] ? row.contacts[0].contact : "",
  }));

  const Tableheaders = [
    "ID",
    "Company",
    "City",
    "State",
    "Sales Person",
    "Contact Person Name",
    "Contact",
    "Action",
  ];

  return (
    <div>
      <Helmet>
        <style>
          {`
            @media print {
              html, body {
                filter: ${isPrinting ? "blur(10px)" : "none"} !important;
              }
            }
          `}
        </style>
      </Helmet>
      <MessageAlert
        open={alertInfo.open}
        onClose={handleCloseSnackbar}
        severity={alertInfo.severity}
        message={alertInfo.message}
      />
      <CustomLoader open={open} />
      <Grid item xs={12}>
        <Paper sx={{ p: 2, m: 4, display: "flex", flexDirection: "column" }}>
          <Box sx={{ marginBottom: 2, display: "flex", alignItems: "center" }}>
            <Grid
              container
              spacing={2}
              alignItems="center"
              sx={{ marginRight: 5, marginLeft: 5 }}
            >
              <Grid item xs={12} sm={3}>
                <CustomAutocomplete
                  size="small"
                  sx={{ minWidth: 150 }}
                  onChange={(event, value) => handleFilterChange(value)}
                  value={salesPersonByFilter}
                  options={assignedOption.map((option) => option.email)}
                  getOptionLabel={(option) => option}
                  label="Filter By Sales Person"
                />
              </Grid>
              <Grid item xs={12} sm={3}>
                <SearchComponent
                  onSearch={handleSearch}
                  onReset={handleReset}
                />
              </Grid>

              <Grid item xs={12} sm={2}>
                <Button
                  variant="contained"
                  color="primary"
                  onClick={handleDownload}
                >
                  Download CSV
                </Button>
                {exportData.length > 0 && (
                  <CSVLink
                    data={exportData}
                    headers={headers}
                    ref={csvLinkRef}
                    filename={"Dead Customer forecast.csv"}
                    style={{ display: "none" }} // Hide the link
                  />
                )}
              </Grid>
            </Grid>
          </Box>
          <Box display="flex" justifyContent="center" marginBottom="10px">
            <h3
              style={{
                marginBottom: "1em",
                fontSize: "24px",
                color: "rgb(34, 34, 34)",
                fontWeight: 800,
                textAlign: "center",
              }}
            >
              Dead Customer Forecast
            </h3>
          </Box>
          <CustomTable
            headers={Tableheaders}
            data={Tabledata}
            openInPopup={handleEditClick}
            openInPopup2={null}
            openInPopup3={null}
            openInPopup4={null}
          />
          <CustomPagination
            totalPages={totalPages}
            currentPage={currentPage}
            handlePageChange={handlePageChange}
          />
        </Paper>
      </Grid>
      <Popup
        fullScreen={true}
        title={"Update Customer Details"}
        openPopup={openPopup}
        setOpenPopup={setOpenPopup}
      >
        <UpdateAllCompanyDetails
          setOpenPopup={setOpenPopup}
          getAllCompanyDetails={getAllDeadCustomerForecastDetails}
          recordForEdit={recordForEdit}
          product={product}
        />
      </Popup>
    </div>
  );
};
