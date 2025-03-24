import React, { useState, useEffect } from "react";
import {
  Container,
  Typography,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Grid,
  Button,
  Box,
} from "@mui/material";
import { CustomLoader } from "../../../Components/CustomLoader";
import { CustomPagination } from "../../../Components/CustomPagination";
import CreateCustomerScheme from "./CreateCustomerScheme";
import { Popup } from "../../../Components/Popup";
import CustomerServices from "../../../services/CustomerService";
import UpdateCustomerScheme from "./UpdateCustomerScheme";

const ViewCustomerScheme = () => {
  const [customerScheme, setCustomerScheme] = useState([]);
  const [loader, setLoader] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);
  const [opencustomerScheme, setOpencustomerScheme] = useState(false);
  const [opencustomerSchemeupdate, setOpencustomerSchemeupdate] =
    useState(false);
  const [DataById, setDataById] = useState(null);
  const getCustomerSchemeData = async () => {
    try {
      setLoader(true);
      const response = await CustomerServices.getCustomerScheme(currentPage);
      setCustomerScheme(response.data.results);
      const total = response.data.count;
      setTotalPages(Math.ceil(total / 25));
    } catch (error) {
      console.error("Error:", error);
    } finally {
      setLoader(false);
    }
  };

  useEffect(() => {
    getCustomerSchemeData();
  }, [currentPage]);

  const handlePageChange = (event, value) => {
    setCurrentPage(value);
  };

  const HandleUpdateScheme = (data) => {
    setOpencustomerSchemeupdate(true);
    setDataById(data);
  };
  return (
    <Container maxWidth="md" sx={{ mt: 5 }}>
      <CustomLoader open={loader} />
      <Paper sx={{ p: 4 }}>
        <Grid container spacing={2} alignItems="center">
          <Grid item xs={12} sm={4}></Grid>
          <Grid item xs={12} sm={4}>
            <Typography
              variant="h6"
              component="div"
              sx={{ textAlign: "center" }}
            >
              Customers Scheme
            </Typography>
          </Grid>
          <Grid item xs={12} sm={4} sx={{ textAlign: "right" }}>
            <Button
              variant="contained"
              color="primary"
              onClick={() => setOpencustomerScheme(true)}
            >
              Add
            </Button>
          </Grid>
        </Grid>

        <Box sx={{ p: 2 }}>
          <TableContainer>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell align="center">
                    <strong>Min Percent</strong>
                  </TableCell>
                  <TableCell align="center">
                    <strong>Max Percent</strong>
                  </TableCell>
                  <TableCell align="center">
                    <strong>Customer Scheme</strong>
                  </TableCell>
                  <TableCell align="center">
                    <strong>Validity</strong>
                  </TableCell>
                  <TableCell align="center">
                    {" "}
                    <strong>Action</strong>
                  </TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {customerScheme.map((customer) => (
                  <TableRow key={customer.id}>
                    <TableCell align="center">{customer.min_per}%</TableCell>
                    <TableCell align="center">{customer.max_per}%</TableCell>
                    <TableCell align="center">{customer.scheme_per}%</TableCell>
                    <TableCell align="center">
                      {customer.validity} (In Month)
                    </TableCell>
                    <TableCell align="center">
                      <Button
                        size="small"
                        variant="contained"
                        color="success"
                        onClick={() => HandleUpdateScheme(customer)}
                      >
                        Update
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </Box>
        <CustomPagination
          currentPage={currentPage}
          totalPages={totalPages}
          handlePageChange={handlePageChange}
        />
        <Popup
          maxWidth="sm"
          title="Create Customer Scheme"
          openPopup={opencustomerScheme}
          setOpenPopup={setOpencustomerScheme}
        >
          <CreateCustomerScheme
            setOpencustomerScheme={setOpencustomerScheme}
            getCustomerSchemeData={getCustomerSchemeData}
          />
        </Popup>
        <Popup
          maxWidth="sm"
          title="Update Customer Scheme"
          openPopup={opencustomerSchemeupdate}
          setOpenPopup={setOpencustomerSchemeupdate}
        >
          <UpdateCustomerScheme
            setOpencustomerSchemeupdate={setOpencustomerSchemeupdate}
            getCustomerSchemeData={getCustomerSchemeData}
            DataById={DataById}
          />
        </Popup>
      </Paper>
    </Container>
  );
};

export default ViewCustomerScheme;
