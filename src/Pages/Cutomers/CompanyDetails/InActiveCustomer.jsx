import React, { useState, useEffect } from "react";
import { Grid, Button, Chip } from "@mui/material";
import { Popup } from "./../../../Components/Popup";
import CustomerServices from "../../../services/CustomerService";
import { CustomLoader } from "../../../Components/CustomLoader";
import { CustomSearchWithButton } from "../../../Components/CustomSearchWithButton";
import { CustomTable } from "./../../../Components/CustomTable";
import { CustomPagination } from "../../../Components/CustomPagination";
import LeadServices from "../../../services/LeadService";
import CustomTextField from "../../../Components/CustomTextField";
import CustomAutocomplete from "../../../Components/CustomAutocomplete";

export const InActiveCustomer = () => {
  const [openPopup, setOpenPopup] = useState(false);
  const [openSnackbar, setOpenSnackbar] = useState(false);
  const [open, setOpen] = useState(false);
  const [inActiveCustomerData, setInActiveCustomerData] = useState([]);
  const [recordForEdit, setRecordForEdit] = useState();
  const [pageCount, setpageCount] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [filterSelectedQuery, setFilterSelectedQuery] = useState("");
  const [assigned, setAssigned] = useState([]);
  const [assign, setAssign] = useState([]);

  const getResetData = () => {
    setFilterSelectedQuery("");
    getInActiveCustomerDetails();
  };

  const openInPopup = (item) => {
    const matchedCompany = inActiveCustomerData.find(
      (company) => company.id === item.id
    );
    setRecordForEdit(matchedCompany);
    setOpenPopup(true);
  };

  const handleSnackbarClose = () => {
    setOpenSnackbar(false);
  };

  const handleInputChange = () => {
    setFilterSelectedQuery(filterSelectedQuery);
    getSearchData(filterSelectedQuery);
  };

  useEffect(() => {
    getInActiveCustomerDetails();
    getAssignedData();
  }, []);

  const getAssignedData = async (id) => {
    try {
      setOpen(true);
      const ALLOWED_ROLES = [
        "Director",
        "Customer Service",
        "Sales Manager",
        "Sales Deputy Manager",
        "Sales Assistant Deputy Manager",
        "Sales Executive",
        "Sales Manager without Leads",
      ];
      const res = await LeadServices.getAllAssignedUser();
      // Filter the data based on the ALLOWED_ROLES
      const filteredData = res.data.filter((employee) =>
        employee.groups.some((group) => ALLOWED_ROLES.includes(group))
      );
      setAssigned(filteredData);
      setOpen(false);
    } catch (error) {
      console.log("error", error);
      setOpen(false);
    }
  };

  const getInActiveCustomerDetails = async () => {
    try {
      setOpen(true);
      console.log("api calling started");
      let response = await CustomerServices.getInActiveCustomerData({
        page: currentPage,
      });
      console.log("response inactive", response);
      console.log("api calling ended after response");
      setInActiveCustomerData(response.data.results);
      setpageCount(Math.ceil(response.data.count / 25));
    } catch (error) {
      setOpen(false);
      console.log("error InActive Customer Api", error);
    } finally {
      setOpen(false);
    }
  };

  const getSearchData = async (value) => {
    try {
      setOpen(true);
      if (value !== "") {
        const response = await CustomerServices.getInActiveCustomerData({
          searchValue: value,
        });
        setInActiveCustomerData(response.data.results);
        setpageCount(Math.ceil(response.data.count / 25));
      } else {
        getInActiveCustomerDetails();
      }
    } catch (error) {
      console.log("error Search leads", error);
    } finally {
      setOpen(false);
    }
  };

  const handlePageClick = async (event, value) => {
    try {
      setOpen(true);
      setCurrentPage(value);
      let response = await CustomerServices.getInActiveCustomerData({
        page: value,
        searchValue: filterSelectedQuery,
      });
      setInActiveCustomerData(response.data.results);
      setpageCount(Math.ceil(response.data.count / 25));
    } catch (error) {
      console.log("error", error);
    } finally {
      setOpen(false);
    }
  };

  console.log("recordForEdit", recordForEdit);
  const UpdateCompanyDetails = async (e) => {
    try {
      e.preventDefault();
      setOpen(true);
      const req = {
        type_of_customer: recordForEdit.type_of_customer,
        name: recordForEdit.name,
        address: recordForEdit.address,
        pincode: recordForEdit.pincode,
        state: recordForEdit.state,
        city: recordForEdit.city,
        website: recordForEdit.website,
        estd_date: recordForEdit.estd_date,
        gst_number: recordForEdit.gst_number || null,
        pan_number: recordForEdit.pan_number || null,
        business_type: recordForEdit.business_type,
        assigned_to: assign ? assign : "",
      };
      await CustomerServices.updateCompanyData(recordForEdit.id, req);
      setOpenPopup(false);
      getInActiveCustomerDetails();
      setAssign([]);
      setOpen(false);
    } catch (error) {
      console.log("createing Unassigned company detail error", error);

      setOpen(false);
    }
  };
  const Tableheaders = [
    "ID",
    "NAME",
    "PAN NO.",
    "GST NO.",
    "CITY",
    "STATE",
    "Assigned To",
    "ACTION",
  ];

  const Tabledata = inActiveCustomerData.map((value) => ({
    id: value.id,
    name: value.name,
    pan_number: value.pan_number,
    gst_number: value.gst_number,
    city: value.city,
    state: value.state,
    assigned_to: value.assigned_to,
  }));
  return (
    <>
      <CustomLoader open={open} />

      <div
        style={{
          padding: "16px",
          margin: "16px",
          boxShadow: "0px 3px 6px #00000029",
          borderRadius: "4px",
          display: "flex",
          flexDirection: "column",
          backgroundColor: "rgb(255, 255, 255)", // set background color to default Paper color
        }}
      >
        <div style={{ display: "flex" }}>
          <div style={{ flexGrow: 0.9 }}>
            <CustomSearchWithButton
              filterSelectedQuery={filterSelectedQuery}
              setFilterSelectedQuery={setFilterSelectedQuery}
              handleInputChange={handleInputChange}
              getResetData={getResetData}
            />
          </div>
          <div style={{ flexGrow: 2 }}>
            <h3
              style={{
                textAlign: "left",
                marginBottom: "1em",
                fontSize: "24px",
                color: "rgb(34, 34, 34)",
                fontWeight: 800,
              }}
            >
              Customers Assigned to InActive Employees
            </h3>
          </div>
          <div style={{ flexGrow: 0.5 }} align="right"></div>
        </div>
        <div
          style={{
            position: "fixed",
            top: "20px",
            left: "50%",
            transform: "translateX(-50%)",
            backgroundColor: "green",
            color: "white",
            padding: "10px",
            borderRadius: "4px",
            display: openSnackbar ? "block" : "none",
            zIndex: 9999,
          }}
        >
          <span style={{ marginRight: "10px" }}>
            Bulk Customer Assigned Successfully!
          </span>
          <button
            style={{
              backgroundColor: "transparent",
              border: "none",
              color: "white",
              cursor: "pointer",
              padding: "0",
            }}
            onClick={handleSnackbarClose}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="16"
              height="16"
              fill="currentColor"
              viewBox="0 0 16 16"
            >
              <path
                fillRule="evenodd"
                d="M8 7.293l2.146-2.147a.5.5 0 11.708.708L8.707 8l2.147 2.146a.5.5 0 01-.708.708L8 8.707l-2.146 2.147a.5.5 0 01-.708-.708L7.293 8 5.146 5.854a.5.5 0 01.708-.708L8 7.293z"
              />
            </svg>
          </button>
        </div>

        <CustomTable
          headers={Tableheaders}
          data={Tabledata}
          openInPopup={openInPopup}
        />

        <div
          style={{
            display: "flex",
            justifyContent: "center",
            // marginTop: "2em",
          }}
        >
          <CustomPagination
            currentPage={currentPage}
            pageCount={pageCount}
            handlePageClick={handlePageClick}
          />
        </div>
      </div>

      <Popup
        maxWidth={"lg"}
        title={"Assign To Customer"}
        openPopup={openPopup}
        setOpenPopup={setOpenPopup}
      >
        <Grid container spacing={2}>
          <Grid item xs={12}>
            <CustomAutocomplete
              size="small"
              value={assign}
              onChange={(event, newValue) => {
                setAssign(newValue);
              }}
              multiple
              limitTags={3}
              id="multiple-limit-tags"
              options={assigned.map((option) => option.email)}
              freeSolo
              renderTags={(value, getTagProps) =>
                value.map((option, index) => (
                  <Chip
                    variant="outlined"
                    label={option}
                    {...getTagProps({ index })}
                  />
                ))
              }
              label="Assign To"
              placeholder="Assign To"
            />
          </Grid>
          <Grid item xs={12}>
            <Button
              variant="contained"
              color="success"
              onClick={(e) => UpdateCompanyDetails(e)}
            >
              Submit
            </Button>
          </Grid>
        </Grid>
      </Popup>
    </>
  );
};
