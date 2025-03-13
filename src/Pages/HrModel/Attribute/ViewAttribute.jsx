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
import Hr from "../../../services/Hr";
import AttributeForm from "./CreateAttribute";
import { Popup } from "../../../Components/Popup";
import { CustomPagination } from "../../../Components/CustomPagination";
import { CustomLoader } from "../../../Components/CustomLoader";
import SearchComponent from "../../../Components/SearchComponent ";

const ViewAttribute = () => {
  const [attributes, setAttributes] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [loader, setLoader] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);
  const [openAttributePopUp, setOpenAttributePopUp] = useState(false);

  const fetchAttributes = async () => {
    try {
      setLoader(true);
      const response = await Hr.getAttribute(currentPage, searchQuery);
      setAttributes(response.data.results);
      const total = response.data.count;
      setTotalPages(Math.ceil(total / 25));
    } catch (error) {
      console.error("Error:", error);
    } finally {
      setLoader(false);
    }
  };

  useEffect(() => {
    fetchAttributes();
  }, [currentPage, searchQuery]);

  const handlePageChange = (event, value) => {
    setCurrentPage(value);
  };
  const handleSearch = (query) => {
    setSearchQuery(query);
    setCurrentPage(1); // Reset to first page with new search
  };

  const handleReset = () => {
    setSearchQuery("");
    setCurrentPage(1); // Reset to first page with no search query
  };
  return (
    <Container maxWidth="md" sx={{ mt: 5 }}>
      <CustomLoader open={loader} />
      <Paper sx={{ p: 4 }}>
        <Grid container spacing={2} alignItems="center">
          <Grid item xs={12} md={4}>
            <SearchComponent onSearch={handleSearch} onReset={handleReset} />
          </Grid>
          <Grid item xs={12} sm={4}>
            <Typography
              variant="h6"
              component="div"
              sx={{ textAlign: "center" }}
            >
              Attributes
            </Typography>
          </Grid>
          <Grid item xs={12} sm={4} sx={{ textAlign: "right" }}>
            <Button
              variant="contained"
              color="primary"
              onClick={() => setOpenAttributePopUp(true)}
            >
              Create Attributes
            </Button>
          </Grid>
        </Grid>

        <Box sx={{ p: 2 }}>
          <TableContainer>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>
                    <strong>Iceberg Element</strong>
                  </TableCell>
                  <TableCell align="center">
                    <strong>Name</strong>
                  </TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {attributes.map((attribute) => (
                  <TableRow key={attribute.id}>
                    <TableCell>{attribute.iceberg_element}</TableCell>
                    <TableCell align="center">{attribute.name}</TableCell>
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
          maxWidth="md"
          title="Create Attribute"
          openPopup={openAttributePopUp}
          setOpenPopup={setOpenAttributePopUp}
        >
          <AttributeForm
            setOpenAttributePopUp={setOpenAttributePopUp}
            fetchAttributes={fetchAttributes}
          />
        </Popup>
      </Paper>
    </Container>
  );
};

export default ViewAttribute;
