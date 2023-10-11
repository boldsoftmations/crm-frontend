import React, { useEffect, useState } from "react";
import { Box, Button, Divider, Grid, Paper, Typography } from "@mui/material";
import { Popup } from "../../Components/Popup";
import { CustomerPotentialCreate } from "./CustomerPotentialCreate";
import CustomerServices from "../../services/CustomerService";

const PotentialDetail = ({ label, value }) => (
  <Grid item xs={24} sm={4}>
    {label} : {value || ""}
  </Grid>
);

export const CustomerAllPotential = ({ recordForEdit }) => {
  const [openModal, setOpenModal] = useState(false);
  const [open, setOpen] = useState(false);
  const [potential, setPotential] = useState([]);
  useEffect(() => {
    getCompanyDetailsByID();
  }, []);

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

  return (
    <>
      <Box component="form" noValidate sx={{ mt: 1 }}>
        <Paper
          sx={{
            p: 2,
            m: 4,
            display: "flex",
            flexDirection: "column",
            backgroundColor: "#F5F5F5",
          }}
        >
          <Box display="flex" justifyContent="space-around">
            <Typography variant="h5" align="center">
              View Potential
            </Typography>
            <Button
              variant="contained"
              color="success"
              onClick={() => setOpenModal(true)}
            >
              Create Potential
            </Button>
          </Box>

          {potential && (
            <Box
              sx={{
                display: "flex",
                flexDirection: "column",
                height: 260,
                overflow: "auto",
              }}
            >
              {potential.map((potentialInput, index) => (
                <Box key={index}>
                  <Grid container spacing={2}>
                    <PotentialDetail
                      label="ProductName"
                      value={potentialInput.product}
                    />
                    <PotentialDetail
                      label="Current Brand"
                      value={potentialInput.current_brand}
                    />
                    <PotentialDetail
                      label="Current Buying Price"
                      value={potentialInput.current_buying_price}
                    />
                    <PotentialDetail
                      label="Current Buying Quantity"
                      value={potentialInput.current_buying_quantity}
                    />
                    <PotentialDetail
                      label="Target Price"
                      value={potentialInput.target_price}
                    />
                    <PotentialDetail
                      label="Quantity"
                      value={potentialInput.quantity}
                    />
                  </Grid>
                  <Divider sx={{ my: 1 }} />
                </Box>
              ))}
            </Box>
          )}
        </Paper>
      </Box>
      <Popup
        maxWidth="xl"
        title="Create Potential"
        openPopup={openModal}
        setOpenPopup={setOpenModal}
      >
        <CustomerPotentialCreate
          getCompanyDetailsByID={getCompanyDetailsByID}
          recordForEdit={recordForEdit}
          setOpenModal={setOpenModal}
        />
      </Popup>
    </>
  );
};
