import React, { useState, useEffect } from "react";
import {
  Box,
  Grid,
  styled,
  Table,
  TableBody,
  TableContainer,
  TableHead,
  TableRow,
  TableCell,
  Button,
} from "@mui/material";
import { tableCellClasses } from "@mui/material/TableCell";
import { ForecastCreate } from "./ForecastCreate";
import { ForecastUpdate } from "./ForecastUpdate";
import { Popup } from "../../../Components/Popup";
import CustomerServices from "../../../services/CustomerService";

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

export const ForecastView = (props) => {
  const { forecastdata, getAllCompanyDetailsByID, open } = props;
  const [openPopup, setOpenPopup] = useState(false);
  const [openPopup2, setOpenPopup2] = useState(false);
  const [IDForEdit, setIDForEdit] = useState();
  const [forecastDataByID, setForecastDataByID] = useState([]);

  // Get the current date
  const currentDate = new Date();

  // Get the current month and year
  const currentMonth = currentDate.getMonth();
  const currentYear = currentDate.getFullYear();

  // Get the last 2 months
  const lastMonth1 = (currentMonth - 2 + 12) % 12;
  const lastMonth2 = (currentMonth - 1 + 12) % 12;

  // Get the next 2 months
  const nextMonth1 = (currentMonth + 1) % 12;
  const nextMonth2 = (currentMonth + 2) % 12;
  const nextMonth3 = (currentMonth + 3) % 12;
  // Convert month number to month name
  const months = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ];

  useEffect(() => {
    if (IDForEdit) getAllForecastDetailsByID();
  }, [IDForEdit]);

  const getAllForecastDetailsByID = async () => {
    try {
      // setOpen(true);
      const response = await CustomerServices.getForecastDataById(IDForEdit);
      console.log("response", response.data.product_forecast);
      setForecastDataByID(response.data.product_forecast);
      // setOpen(false);
    } catch (err) {
      // setOpen(false);
      console.log("company data by id error", err);
    }
  };

  return (
    <>
      <Grid item xs={12}>
        <Box display="flex">
          <Box flexGrow={2}></Box>
          <Box flexGrow={2}>
            <h3
              style={{
                textAlign: "left",
                marginBottom: "1em",
                fontSize: "24px",
                color: "rgb(34, 34, 34)",
                fontWeight: 800,
              }}
            >
              Forecast Details
            </h3>
          </Box>
          <Box flexGrow={0.5} align="right">
            <Button
              onClick={() => setOpenPopup2(true)}
              variant="contained"
              color="success"
            >
              Add
            </Button>
          </Box>
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
          <Table sx={{ minWidth: 700 }} stickyHeader aria-label="sticky table">
            <TableHead>
              <StyledTableRow>
                <StyledTableCell align="center">SALES PERSON</StyledTableCell>
                <StyledTableCell align="center">PRODUCT</StyledTableCell>
                <StyledTableCell align="center">
                  {` ${months[lastMonth1]} - ${
                    lastMonth1 < currentMonth ? currentYear : currentYear - 1
                  }`}
                  <br />
                  ACTUAL - FORECAST
                </StyledTableCell>
                <StyledTableCell align="center">
                  {` ${months[lastMonth2]} - ${
                    lastMonth2 < currentMonth ? currentYear : currentYear - 1
                  }`}{" "}
                  <br />
                  ACTUAL - FORECAST
                </StyledTableCell>
                <StyledTableCell align="center">
                  {`${months[currentMonth]} - ${currentYear}`} <br /> ACTUAL -
                  FORECAST
                </StyledTableCell>
                <StyledTableCell align="center">
                  {` ${months[nextMonth1]} - ${
                    nextMonth1 > currentMonth ? currentYear : currentYear + 1
                  }`}{" "}
                  <br />
                  FORECAST
                </StyledTableCell>
                <StyledTableCell align="center">
                  {` ${months[nextMonth2]} - ${
                    nextMonth2 > currentMonth ? currentYear : currentYear + 1
                  }`}{" "}
                  <br />
                  FORECAST
                </StyledTableCell>
                <StyledTableCell align="center">
                  {` ${months[nextMonth3]} - ${
                    nextMonth3 > currentMonth ? currentYear : currentYear + 1
                  }`}{" "}
                  <br />
                  FORECAST
                </StyledTableCell>
                <StyledTableCell align="center">Action</StyledTableCell>
              </StyledTableRow>
            </TableHead>
            <TableBody>
              {forecastdata.map((row) => (
                <StyledTableRow>
                  <StyledTableCell align="center">
                    {row.sales_person}
                  </StyledTableCell>
                  <StyledTableCell align="center">
                    {row.product}
                  </StyledTableCell>
                  {row.product_forecast.map((rowData) => {
                    return rowData.actual !== null ? (
                      <StyledTableCell align="center">
                        {rowData.actual} - {rowData.forecast}
                      </StyledTableCell>
                    ) : (
                      <StyledTableCell align="center">
                        - {rowData.forecast}
                      </StyledTableCell>
                    );
                  })}
                  {/* <StyledTableCell align="center"></StyledTableCell> */}
                  <StyledTableCell align="center">
                    <Button
                      variant="contained"
                      onClick={() => {
                        setOpenPopup(true);
                        setIDForEdit(row.id);
                      }}
                    >
                      View
                    </Button>
                  </StyledTableCell>
                </StyledTableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </Grid>
      <Popup
        title={"Create Forecast Details"}
        openPopup={openPopup2}
        setOpenPopup={setOpenPopup2}
      >
        <ForecastCreate
          getAllCompanyDetailsByID={getAllCompanyDetailsByID}
          setOpenPopup={setOpenPopup2}
        />
      </Popup>
      <Popup
        title={"Update Forecast Details"}
        openPopup={openPopup}
        setOpenPopup={setOpenPopup}
      >
        <ForecastUpdate
          IDForEdit={IDForEdit}
          getAllCompanyDetailsByID={getAllCompanyDetailsByID}
          forecastDataByID={forecastDataByID}
          setOpenPopup={setOpenPopup}
        />
      </Popup>
    </>
  );
};
