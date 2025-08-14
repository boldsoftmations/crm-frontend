import { Box, CircularProgress, Grid, Typography } from "@mui/material";
import React, { useEffect, useState } from "react";
import DashboardService from "../../../services/DashboardService";
import { CustomLoader } from "../../../Components/CustomLoader";
// import CustomSelect from "../../../Components/CustomSelect";
// import CustomAutocomplete from "../../../Components/CustomAutocomplete";
// import CustomSnackbar from "../../../Components/CustomerSnackbar";

// import { CustomTable } from "../../../Components/CustomTable";
import ActiveEmplyeeLead from "./ActiveEmplyeeLead";
import InactiveEmplyeeLead from "./InactiveEmplyeeLead";

const EmployeeReport = () => {
  const [employeeReport, setEmployeeReport] = useState({});
  const [employeeStatus, setEmployeeStatus] = useState({});
  const [isLoading, setIsLoading] = useState(true);

  const getEmployeeReport = async () => {
    try {
      const response = await DashboardService.getActiveInactiveEmployees();
      let data = response.data;

      if (data) {
        setIsLoading(false);
        const employeeDetails = {
          total: data.total_leads,
          assigned_leads: data.assigned_leads,
          unassigned_leads: data.unassigned_leads,
          lead_without_contacts: data.lead_without_contacts,
          drop_leads: data.drop_leads,
          in_active_user_leads: data.in_active_user_leads,
        };

        const employeeStatusDetails = {
          in_active_user: data.in_active_user,
          active_user: data.active_user,
        };

        setEmployeeReport(employeeDetails);
        setEmployeeStatus(employeeStatusDetails);
      }
    } catch (error) {
      console.log(error);
      // handleError(error);
    } finally {
      // setOpen(false);
      console.log("done");
    }
  };

  useEffect(() => {
    getEmployeeReport();
  }, []);

  const COLORS = [
    "#8884d8",
    "#83a6ed",
    "#8dd1e1",
    "#82ca9d",
    "#ffbb00",
    "#ff7f50",
    "#ff69b4",
    "#ba55d3",
    "#cd5c5c",
    "#ffa500",
    "#adff2f",
    "#008080",
  ];

  function CircularProgressWithLabel(props) {
    return (
      <Box sx={{ position: "relative", display: "inline-flex" }}>
        <CircularProgress variant="indeterminate" {...props} size={60} />
        <Box
          sx={{
            top: 0,
            left: 0,
            bottom: 0,
            right: 0,
            position: "absolute",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <Typography variant="caption" component="div" color="#ffffff">
            {`${Math.round(props.value)}%`}
          </Typography>
        </Box>
      </Box>
    );
  }

  return (
    <>
      <CustomLoader open={isLoading} />

      <Grid
        container
        spacing={{ xs: 2, md: 3 }}
        columns={{ xs: 3, sm: 8, md: 12 }}
        sx={{ margin: "20px" }}
      >
        {employeeReport &&
          Object.keys(employeeReport).map((key, index) => {
            const value = employeeReport[key];
            const total = employeeReport.total || 1;
            console.log(total);

            const percentage = key === "total" ? 100 : (value / total) * 100;

            return (
              <Grid
                item
                xs={1}
                sm={2}
                md={3}
                lg={3}
                key={index}
                sx={{ marginTop: "20px" }}
              >
                <Box
                  sx={{
                    backgroundColor: COLORS[index % COLORS.length],
                    textAlign: "center",
                  }}
                >
                  <Box
                    display="flex"
                    flexDirection="row"
                    justifyContent="space-around"
                  >
                    <Box sx={{ marginTop: "10px" }}>
                      <CircularProgressWithLabel
                        variant="determinate"
                        value={percentage}
                        // sx={{ backgroundColor: "#ccc" }}
                      />
                    </Box>
                    <Box sx={{ marginTop: "10px" }}>
                      <Typography
                        variant="subtitle1"
                        sx={{ color: "white", fontWeight: "bold" }}
                      >
                        {key.replaceAll("_", " ").toUpperCase()}
                      </Typography>
                      <Typography
                        variant="h6"
                        sx={{ color: "white", fontWeight: "bold" }}
                      >
                        {key ? value : ""}
                      </Typography>
                    </Box>
                  </Box>
                </Box>
              </Grid>
            );
          })}
      </Grid>

      <Box
        sx={{
          display: isLoading ? "none" : "flex",
          flexDirection: "column",
          gap: "20px",
        }}
      >
        <ActiveEmplyeeLead
          employeeReport={employeeReport}
          employeeStatus={employeeStatus}
        />
        <InactiveEmplyeeLead
          employeeReport={employeeReport}
          employeeStatus={employeeStatus}
        />
      </Box>
    </>
  );
};

export default EmployeeReport;
// const StyledTableRow = styled(TableRow)(({ theme }) => ({
//   "&:nth-of-type(odd)": {
//     backgroundColor: theme.palette.action.hover,
//   },
//   "&:last-child td, &:last-child th": {
//     border: 0,
//   },
// }));
