import React, { useState, useRef, useEffect } from "react";
import { Grid, Button, TextField, Autocomplete, Chip } from "@mui/material";
import { Popup } from "./../../../Components/Popup";
import CustomerServices from "../../../services/CustomerService";
import { ErrorMessage } from "./../../../Components/ErrorMessage/ErrorMessage";
import { CustomLoader } from "../../../Components/CustomLoader";
import { CustomSearchWithButton } from "../../../Components/CustomSearchWithButton";
import { CustomTable } from "./../../../Components/CustomTable";
import { CustomPagination } from "../../../Components/CustomPagination";
import LeadServices from "../../../services/LeadService";

export const UnassignedCustomer = () => {
  const [openPopup, setOpenPopup] = useState(false);
  const [openSnackbar, setOpenSnackbar] = useState(false);
  const [open, setOpen] = useState(false);
  const errRef = useRef();
  const [errMsg, setErrMsg] = useState("");
  const [companyData, setCompanyData] = useState([]);
  const [recordForEdit, setRecordForEdit] = useState();
  const [pageCount, setpageCount] = useState(0);
  const [currentPage, setCurrentPage] = useState(0);
  const [filterSelectedQuery, setFilterSelectedQuery] = useState("");
  const [assigned, setAssigned] = useState([]);
  const [assign, setAssign] = useState([]);

  const getResetData = () => {
    setFilterSelectedQuery("");
    getUnassignedCompanyDetails();
  };

  const openInPopup = (item) => {
    const matchedCompany = companyData.find(
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
    getUnassignedCompanyDetails();
    getAssignedData();
  }, []);

  const getAssignedData = async (id) => {
    try {
      setOpen(true);
      const res = await LeadServices.getAllAssignedUser();
      setAssigned(res.data);
      setOpen(false);
    } catch (error) {
      console.log("error", error);
      setOpen(false);
    }
  };

  const getUnassignedCompanyDetails = async () => {
    try {
      setOpen(true);
      if (currentPage) {
        const response = await CustomerServices.getPaginationByUnassignedData(
          currentPage
        );
        setCompanyData(response.data.results);
        const total = response.data.count;
        setpageCount(Math.ceil(total / 25));
      } else {
        const response = await CustomerServices.getUnassignedData();
        setCompanyData(response.data.results);
        const total = response.data.count;
        setpageCount(Math.ceil(total / 25));
      }
      setOpen(false);
    } catch (err) {
      setOpen(false);
      if (!err.response) {
        setErrMsg(
          "“Sorry, You Are Not Allowed to Access This Page” Please contact to admin"
        );
      } else if (err.response.status === 400) {
        setErrMsg(
          err.response.data.errors.name
            ? err.response.data.errors.name
            : err.response.data.errors.non_field_errors
        );
      } else if (err.response.status === 401) {
        setErrMsg(err.response.data.errors.code);
      } else {
        setErrMsg("Server Error");
      }
      errRef.current.focus();
    }
  };

  const getSearchData = async (value) => {
    try {
      setOpen(true);
      const filterSearch = value;
      if (filterSearch !== "") {
        const response = await CustomerServices.getSearchByUnassignedData(
          filterSearch
        );
        setCompanyData(response.data.results);
        const total = response.data.count;
        setpageCount(Math.ceil(total / 25));
      } else {
        getUnassignedCompanyDetails();
        setFilterSelectedQuery("");
      }
      setOpen(false);
    } catch (error) {
      console.log("error Search leads", error);
      setOpen(false);
    }
  };
  const handlePageClick = async (event, value) => {
    try {
      const page = value;
      setCurrentPage(page);
      setOpen(true);

      if (filterSelectedQuery) {
        const response =
          await CustomerServices.getSearchandPaginationByUnassignedData(
            page,
            filterSelectedQuery
          );
        if (response) {
          setCompanyData(response.data.results);
          const total = response.data.count;
          setpageCount(Math.ceil(total / 25));
        } else {
          getUnassignedCompanyDetails();
          setFilterSelectedQuery("");
        }
      } else {
        const response = await CustomerServices.getPaginationByUnassignedData(
          page
        );
        setCompanyData(response.data.results);
      }

      setOpen(false);
    } catch (error) {
      console.log("error", error);
      setOpen(false);
    }
  };

  const UpdateCompanyDetails = async (e) => {
    try {
      e.preventDefault();
      setOpen(true);
      const req = {
        type: recordForEdit.type,
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
      getUnassignedCompanyDetails();
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
    "ACTION",
  ];

  const Tabledata = companyData.map((value) => ({
    id: value.id,
    name: value.name,
    pan_number: value.pan_number,
    gst_number: value.gst_number,
    city: value.city,
    state: value.state,
  }));
  return (
    <>
      <CustomLoader open={open} />
      <div>
        <ErrorMessage errRef={errRef} errMsg={errMsg} />
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
                Unassigned Customer
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
      </div>

      <Popup
        maxWidth={"lg"}
        title={"Assign To Customer"}
        openPopup={openPopup}
        setOpenPopup={setOpenPopup}
      >
        <Grid container spacing={2}>
          <Grid item xs={12}>
            <Autocomplete
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
              renderInput={(params) => (
                <TextField
                  {...params}
                  label="Assign To"
                  placeholder="Assign To"
                />
              )}
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
