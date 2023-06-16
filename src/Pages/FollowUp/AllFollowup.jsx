import React, { useState, useEffect } from "react";
import {
  Grid,
  Paper,
  Box,
  TextField,
  FormControl,
  InputLabel,
  Select,
  IconButton,
  MenuItem,
} from "@mui/material";
import ClearIcon from "@mui/icons-material/Clear";
import LeadServices from "../../services/LeadService";
import moment from "moment";
import { Popup } from "../../Components/Popup";
import { UpdateLeads } from "../Leads/UpdateLeads";
import { CustomLoader } from "../../Components/CustomLoader";
import { CustomTable } from "../../Components/CustomTable";
import { CustomPagination } from "../../Components/CustomPagination";

export const AllFollowup = (props) => {
  const { assigned, descriptionMenuData, product } = props;
  const [open, setOpen] = useState(false);
  const [allFollowupData, setAllFollowupData] = useState([]);
  const [openPopup, setOpenPopup] = useState(false);
  const [leadsByID, setLeadsByID] = useState(null);
  const [pageCount, setpageCount] = useState(0);
  const [currentPage, setCurrentPage] = useState(0);
  const [endDate, setEndDate] = useState(new Date());
  const [startDate, setStartDate] = useState(new Date());
  const minDate = new Date().toISOString().split("T")[0];
  const maxDate = new Date("2030-12-31").toISOString().split("T")[0];
  const [filterBySalesperson, setFilterBySalesperson] = useState("");
  const [filterByActivity, setFilterByActivity] = useState("");

  const openInPopup = async (item) => {
    try {
      setOpen(true);
      setLeadsByID(item.lead);
      setOpen(false);
    } catch (err) {
      console.log("err", err);
      setOpen(false);
    }
  };

  const handleStartDateChange = (event) => {
    const date = new Date(event.target.value);
    setStartDate(date);
    setEndDate(new Date());
  };

  const handleEndDateChange = (event) => {
    const date = new Date(event.target.value);
    setEndDate(date);
  };

  const FilterBySalesPerson = (value) => {
    setFilterBySalesperson(value);
    getSearchData(value, filterByActivity);
  };

  const FilterByActivity = (value) => {
    setFilterByActivity(value);
    getSearchData(filterBySalesperson, value);
  };

  const getResetSalesPersonData = () => {
    setFilterBySalesperson("");
    getSearchData(null, filterByActivity);
  };

  const getResetActivityData = () => {
    setFilterByActivity("");
    getSearchData(filterBySalesperson, null);
  };

  useEffect(() => {
    getFollowup();
  }, [startDate, endDate]);

  const getFollowup = async () => {
    try {
      setOpen(true);
      const StartDate = startDate ? startDate.toISOString().split("T")[0] : "";
      const EndDate = endDate ? endDate.toISOString().split("T")[0] : "";
      if (currentPage) {
        const response = await LeadServices.getFollowupWithPagination(
          StartDate,
          EndDate,
          currentPage
        );
        setAllFollowupData(response.data.results);
        const total = response.data.count;
        setpageCount(Math.ceil(total / 25));
      } else {
        const response = await LeadServices.getAllFollowup(StartDate, EndDate);
        if (response) {
          setAllFollowupData(response.data.results);
          const total = response.data.count;
          setpageCount(Math.ceil(total / 25));
        }
      }
      setOpen(false);
    } catch (err) {
      setOpen(false);
      console.error("error all followup", err);
    }
  };

  const getSearchData = async (filterBySalesPerson, filterByActivity) => {
    try {
      setOpen(true);
      const StartDate = startDate ? startDate.toISOString().split("T")[0] : "";
      const EndDate = endDate ? endDate.toISOString().split("T")[0] : "";

      let response;

      if (filterBySalesPerson && filterByActivity) {
        response = await LeadServices.getFollowupWithSearch(
          StartDate,
          EndDate,
          "user_email",
          filterBySalesPerson,
          "activity",
          filterByActivity
        );
      } else if (filterBySalesPerson) {
        response = await LeadServices.getFollowupWithFilter(
          StartDate,
          EndDate,
          "user_email",
          filterBySalesPerson
        );
      } else if (filterByActivity) {
        response = await LeadServices.getFollowupWithFilter(
          StartDate,
          EndDate,
          "activity",
          filterByActivity
        );
      } else {
        response = await LeadServices.getAllFollowup(StartDate, EndDate);
      }

      setAllFollowupData(response.data.results);
      const total = response.data.count;
      setpageCount(Math.ceil(total / 25));
      setOpen(false);
    } catch (error) {
      console.log("error Search sale register", error);
      setOpen(false);
    }
  };

  const handlePageClick = async (event, value) => {
    try {
      const page = value;
      const StartDate = startDate ? startDate.toISOString().split("T")[0] : "";
      const EndDate = endDate ? endDate.toISOString().split("T")[0] : "";
      setCurrentPage(page);
      setOpen(true);
      if (filterBySalesperson) {
        const response = await LeadServices.getFollowupWithPaginationAndSearch(
          StartDate,
          EndDate,
          page,
          "user_email",
          filterBySalesperson
        );
        if (response) {
          setAllFollowupData(response.data.results);
          const total = response.data.count;
          setpageCount(Math.ceil(total / 25));
        } else {
          getFollowup();
          setFilterBySalesperson("");
        }
      } else {
        const response = await LeadServices.getFollowupWithPagination(
          StartDate,
          EndDate,
          page
        );
        setAllFollowupData(response.data.results);
        const total = response.data.count;
        setpageCount(Math.ceil(total / 25));
      }
      setOpen(false);
    } catch (error) {
      console.log("error", error);
      setOpen(false);
    }
  };

  const Tabledata = allFollowupData.map((row, i) => ({
    id: row.id,
    lead: row.leads,
    name: row.name,
    company: row.company,
    user: row.user,

    current_date: moment(row.current_date ? row.current_date : "-").format(
      "DD/MM/YYYY h:mm:ss"
    ),
    next_followup_date: moment(
      row.next_followup_date ? row.next_followup_date : "-"
    ).format("DD/MM/YYYY h:mm:ss"),
    notes: row.notes,
  }));

  const Tableheaders = [
    "ID",
    "LEADS",
    "NAME",
    "COMPANY",
    "USER",
    "CURRENT DATE",
    "NEXT FOLLOWUP DATE",
    "NOTE",
    "ACTION",
  ];

  return (
    <>
      <CustomLoader open={open} />

      {/* Pending FollowUp */}
      <Grid item xs={12}>
        <Paper sx={{ p: 2, m: 3, display: "flex", flexDirection: "column" }}>
          <Box display="flex" marginBottom="10px">
            <TextField
              sx={{ marginRight: 2 }}
              label="Start Date"
              variant="outlined"
              size="small"
              type="date"
              id="start-date"
              value={startDate ? startDate.toISOString().split("T")[0] : ""}
              min={minDate}
              max={maxDate}
              onChange={handleStartDateChange}
            />
            <TextField
              sx={{ marginRight: 2 }}
              label="End Date"
              variant="outlined"
              size="small"
              type="date"
              id="end-date"
              value={endDate ? endDate.toISOString().split("T")[0] : ""}
              min={startDate ? startDate.toISOString().split("T")[0] : minDate}
              max={maxDate}
              onChange={handleEndDateChange}
              disabled={!startDate}
            />
            <FormControl
              sx={{ minWidth: "200px", marginRight: "1em" }}
              size="small"
            >
              <InputLabel id="demo-simple-select-label">
                Filter By SalesPerson
              </InputLabel>
              <Select
                labelId="demo-simple-select-label"
                id="demo-simple-select"
                name="values"
                label="Filter By SalesPerson"
                value={filterBySalesperson}
                onChange={(event) => FilterBySalesPerson(event.target.value)}
                sx={{
                  "& .MuiSelect-iconOutlined": {
                    display: filterBySalesperson ? "none" : "",
                  },
                  "&.Mui-focused .MuiIconButton-root": {
                    color: "primary.main",
                  },
                }}
                endAdornment={
                  <IconButton
                    sx={{
                      visibility: filterBySalesperson ? "visible" : "hidden",
                    }}
                    onClick={getResetSalesPersonData}
                  >
                    <ClearIcon />
                  </IconButton>
                }
                MenuProps={{
                  PaperProps: {
                    style: {
                      maxHeight: 300,
                      width: 250,
                    },
                  },
                }}
              >
                {assigned.map((option, i) => (
                  <MenuItem key={i} value={option.email}>
                    {option.email}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
            <FormControl
              sx={{ minWidth: "200px", marginRight: "1em" }}
              size="small"
            >
              <InputLabel id="demo-simple-select-label">
                Filter By Activity
              </InputLabel>
              <Select
                labelId="demo-simple-select-label"
                id="demo-simple-select"
                name="values"
                label="Filter By Activity"
                value={filterByActivity}
                onChange={(event) => FilterByActivity(event.target.value)}
                sx={{
                  "& .MuiSelect-iconOutlined": {
                    display: filterByActivity ? "none" : "",
                  },
                  "&.Mui-focused .MuiIconButton-root": {
                    color: "primary.main",
                  },
                }}
                endAdornment={
                  <IconButton
                    sx={{
                      visibility: filterByActivity ? "visible" : "hidden",
                    }}
                    onClick={getResetActivityData}
                  >
                    <ClearIcon />
                  </IconButton>
                }
                MenuProps={{
                  PaperProps: {
                    style: {
                      maxHeight: 300,
                      width: 250,
                    },
                  },
                }}
              >
                {ActivityOption.map((option, i) => (
                  <MenuItem key={i} value={option.label}>
                    {option.label}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Box>
          <Box display="flex" alignItems="center" justifyContent="center">
            <h3
              style={{
                marginBottom: "1em",
                fontSize: "24px",
                color: "rgb(34, 34, 34)",
                fontWeight: 800,
              }}
            >
              All Followup
            </h3>
          </Box>
          <CustomTable
            headers={Tableheaders}
            data={Tabledata}
            openInPopup={openInPopup}
            openInPopup2={null}
          />
          <CustomPagination
            pageCount={pageCount}
            handlePageClick={handlePageClick}
          />
        </Paper>
      </Grid>
      <Popup
        maxWidth={"xl"}
        title={"Update Leads"}
        openPopup={openPopup}
        setOpenPopup={setOpenPopup}
      >
        <UpdateLeads
          assigned={assigned}
          descriptionMenuData={descriptionMenuData}
          leadsByID={leadsByID}
          product={product}
          setOpenPopup={setOpenPopup}
          getAllleadsData={getFollowup}
        />
      </Popup>
    </>
  );
};

const ActivityOption = [
  {
    id: 1,
    value: "Not answering/busy/disconnecting",
    label: "Not answering/busy/disconnecting",
  },

  {
    id: 2,
    value: "Having stock",
    label: "Having stock",
  },
  {
    id: 3,
    value: "Rate issue",
    label: "Rate issue",
  },
  {
    id: 4,
    value: "Send detail on whatsapp/sms/email",
    label: "Send detail on whatsapp/sms/email",
  },
  {
    id: 5,
    value: "Not buying from us due to product range",
    label: "Not buying from us due to product range",
  },
  {
    id: 6,
    value: "Dealing in other brand",
    label: "Dealing in other brand",
  },
  {
    id: 7,
    value: "Buying a different product from other company",
    label: "Buying a different product from other company",
  },
  {
    id: 8,
    value: "Size or quantity is unavailabe with us",
    label: "Size or quantity is unavailabe with us",
  },
  {
    id: 9,
    value: "Transportation cost issue",
    label: "Transportation cost issue",
  },
  {
    id: 10,
    value: "Required without bill",
    label: "Required without bill",
  },
  {
    id: 11,
    value: "Call me back",
    label: "Call me back",
  },
  {
    id: 12,
    value: "Send sample",
    label: "Send sample",
  },
  {
    id: 13,
    value: "Not a decision maker",
    label: "Not a decision maker",
  },
  {
    id: 14,
    value: "Require own branding",
    label: "Require own branding",
  },
  {
    id: 15,
    value: "Small buyer, moved to dealer/distributor",
    label: "Small buyer, moved to dealer/distributor",
  },
  {
    id: 16,
    value: "Require exclusive distributorship/dealership",
    label: "Require exclusive distributorship/dealership",
  },
  {
    id: 17,
    value: "Quality issue",
    label: "Quality issue",
  },
  {
    id: 18,
    value: "Small buyer, no dealer/distributor in that area",
    label: "Small buyer, no dealer/distributor in that area",
  },
  {
    id: 19,
    value: "Require credit",
    label: "Require credit",
  },
  {
    id: 20,
    value: "Wrong number",
    label: "Wrong number",
  },
  {
    id: 21,
    value: "Company shut down",
    label: "Company shut down",
  },
  {
    id: 22,
    value: "Order taken",
    label: "Order taken",
  },
  {
    id: 23,
    value: "Stock lot",
    label: "Stock lot",
  },
  {
    id: 24,
    value: "One time requirement",
    label: "One time requirement",
  },
  {
    id: 25,
    value: "Drop the lead",
    label: "Drop the lead",
  },
];
