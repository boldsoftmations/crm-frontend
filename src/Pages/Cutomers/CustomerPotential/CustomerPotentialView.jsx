import React, { useEffect, useState } from "react";
import { Box, Button, Grid, Paper } from "@mui/material";
import { CustomerPotentialCreate } from "./CustomerPotentialCreate";
import { CustomerPotentialUpdate } from "./CustomerPotentialUpdate";
import { Popup } from "../../../Components/Popup";
import CustomerServices from "../../../services/CustomerService";
import { CustomTable } from "../../../Components/CustomTable";
import { CustomLoader } from "../../../Components/CustomLoader";

export const CustomerPotentialView = ({ recordForEdit }) => {
  const [open, setOpen] = useState(false);
  const [potential, setPotential] = useState([]);
  const [openPopupCreate, setOpenPopupCreate] = useState(false);
  const [openPopupUpdate, setOpenPopupUpdate] = useState(false);
  const [idForEdit, setIdForEdit] = useState(null);

  const formatDate = (dateString) => {
    if (!dateString) return "";

    const [day, month, year] = dateString.split("-");

    // Construct a date string that is understood by the Date constructor
    const formattedDateString = `${month}/${day}/${year}`;

    // Create a date object using the formatted date string
    const date = new Date(formattedDateString);

    // Options for toLocaleDateString() to only include date parts
    const options = {
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
    };

    // Return the formatted date string
    return date.toLocaleDateString("en-GB", options);
  };

  useEffect(() => {
    getCompanyDetailsByID();
  }, [recordForEdit]);

  // API call to fetch company details based on type
  const getCompanyDetailsByID = async () => {
    try {
      setOpen(true);
      const potentialResponse =
        await CustomerServices.getCompanyDataByIdWithType(
          recordForEdit,
          "potential"
        );
      setPotential(potentialResponse.data.potential);
      setOpen(false);
    } catch (err) {
      setOpen(false);
      console.log("company data by id error", err);
    }
  };

  const openInPopup = (item) => {
    const fullData = potential.find((p) => p.id === item.id);
    setIdForEdit(fullData);
    setOpenPopupUpdate(true);
  };

  const TableHeader = [
    "ID",
    "Created Date",
    "created By",
    "Description",
    "Product",
    "Current Buying Quantity(Monthly)",
    "Update Date",
    "Updated By",
    "Remark",
    "Action",
  ];

  const TableData =
    potential &&
    potential.map((value) => ({
      id: value.id,
      created_date: formatDate(value.created_date || ""), // Format the date here
      created_by: value.created_by,
      description: value.description,
      product: value.product,
      current_buying_quantity: value.current_buying_quantity,
      updated_date: formatDate(value.updated_date || ""), // Format the date here
      updated_by: value.updated_by,
      remark: value.is_remark,
    }));
  return (
    <>
      <CustomLoader open={open} />
      <Grid item xs={12}>
        <Paper sx={{ p: 2, m: 3, display: "flex", flexDirection: "column" }}>
          <Box
            display="flex"
            flexDirection="row"
            justifyContent="space-between"
            alignItems="center"
            marginBottom="1em"
          >
            <h3
              style={{
                textAlign: "left",
                marginBottom: "1em",
                fontSize: "24px",
                color: "rgb(34, 34, 34)",
                fontWeight: 800,
              }}
            >
              Customer Potential
            </h3>
            <Box>
              <Button
                variant="contained"
                onClick={() => setOpenPopupCreate(true)}
                sx={{ marginLeft: "10px", marginRight: "10px" }}
                size="small"
              >
                Add
              </Button>
            </Box>
          </Box>
          {TableData && (
            <CustomTable
              headers={TableHeader}
              data={TableData}
              openInPopup={openInPopup}
            />
          )}
        </Paper>
      </Grid>
      <Popup
        maxWidth="xl"
        title="Create Potential"
        openPopup={openPopupCreate}
        setOpenPopup={setOpenPopupCreate}
      >
        <CustomerPotentialCreate
          getCompanyDetailsByID={getCompanyDetailsByID}
          recordForEdit={recordForEdit}
          setOpenModal={setOpenPopupCreate}
        />
      </Popup>
      <Popup
        maxWidth="xl"
        title="Update Potential"
        openPopup={openPopupUpdate}
        setOpenPopup={setOpenPopupUpdate}
      >
        <CustomerPotentialUpdate
          getCompanyDetailsByID={getCompanyDetailsByID}
          idForEdit={idForEdit}
          setOpenModal={setOpenPopupUpdate}
        />
      </Popup>
    </>
  );
};
