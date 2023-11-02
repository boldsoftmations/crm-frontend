import React, { useEffect, useState } from "react";
import { Autocomplete, Box, Button, Grid } from "@mui/material";
import { CustomLoader } from "../../../Components/CustomLoader";
import CustomTextField from "../../../Components/CustomTextField";
import ProductService from "../../../services/ProductService";
import LeadServices from "../../../services/LeadService";

export const LeadPotentialCreate = (props) => {
  const { leadsByID, getLeadByID, setOpenModal } = props;
  const [open, setOpen] = useState(false);
  const [potential, setPotential] = useState([]);
  const [product, setProduct] = useState([]);
  const handleInputChange = (event) => {
    const { name, value } = event.target;
    setPotential({ ...potential, [name]: value });
  };

  const handleAutocompleteChange = (value) => {
    setPotential({ ...potential, ["product"]: value });
  };

  useEffect(() => {
    getProduct();
  }, []);

  const getProduct = async () => {
    try {
      setOpen(true);
      const res = await ProductService.getAllProduct();
      setProduct(res.data);
      setOpen(false);
    } catch (err) {
      console.error("error potential", err);
      setOpen(false);
    }
  };

  let handleSubmit = async (e) => {
    e.preventDefault();

    try {
      setOpen(true);

      const data = {
        lead: leadsByID,
        product: potential.product,
        current_brand: potential.current_brand,
        current_buying_price: potential.current_buying_price,
        current_buying_quantity: potential.current_buying_quantity,
        target_price: potential.target_price,
        quantity: potential.quantity,
      };

      await LeadServices.createPotentialLead(data);

      setOpenModal(false);
      await getLeadByID(leadsByID);
      setOpen(false);
    } catch (error) {
      console.log("error:", error);
      setOpen(false);
    }
  };
  const handleBrandChange = (event, value) => {
    setPotential({ ...potential, current_brand: value.value });
  };
  const MainDistribution = [
    { id: 1, label: "3M", value: "3M" },
    { id: 2, label: "Achem - Taiwan", value: "Achem - Taiwan" },
    { id: 3, label: "Aero", value: "Aero" },
    { id: 4, label: "AIPL ABRO", value: "AIPL ABRO" },
    { id: 5, label: "Airot", value: "Airot" },
    {
      id: 6,
      label: "Ajit Industries / AIPL / Sunsui",
      value: "Ajit Industries / AIPL / Sunsui",
    },
    { id: 7, label: "Amech Wonder", value: "Amech Wonder" },
    { id: 8, label: "Amro Wonder", value: "Amro Wonder" },
    { id: 9, label: "Anchor Electricals", value: "Anchor Electricals" },
    { id: 10, label: "ANNA - Drywall Tape", value: "ANNA - Drywall Tape" },
    { id: 11, label: "Arjun - Spray Paint", value: "Arjun - Spray Paint" },
    { id: 12, label: "ASD - Spray Paint", value: "ASD - Spray Paint" },
    { id: 13, label: "Asian Paints", value: "Asian Paints" },
    { id: 14, label: "Banna - Spray Paints", value: "Banna - Spray Paints" },
    { id: 15, label: "Berger Paints", value: "Berger Paints" },
    { id: 16, label: "Biocon Electricals", value: "Biocon Electricals" },
    { id: 17, label: "Bosny - Spray Paints", value: "Bosny - Spray Paints" },
    { id: 18, label: "Champion - PTFE Tape", value: "Champion - PTFE Tape" },
    { id: 19, label: "Cobb - Spray Paint", value: "Cobb - Spray Paint" },
    { id: 20, label: "Cooper - PTFE Tape", value: "Cooper - PTFE Tape" },
    { id: 21, label: "Cosmos - Spray Paints", value: "Cosmos - Spray Paints" },
    { id: 22, label: "CQL - Spray Paints", value: "CQL - Spray Paints" },
    {
      id: 23,
      label: "Craft Dev - Spray Paints",
      value: "Craft Dev - Spray Paints",
    },
    { id: 24, label: "Cube - Spray Paints", value: "Cube - Spray Paints" },
    { id: 25, label: "Diamond - PTFE Tape", value: "Diamond - PTFE Tape" },
    { id: 26, label: "Dinmo - Spray Paints", value: "Dinmo - Spray Paints" },
    { id: 27, label: "Dornet - Drywall Tape", value: "Dornet - Drywall Tape" },
    {
      id: 28,
      label: "Espark Wonder / Maruti Flex",
      value: "Espark Wonder / Maruti Flex",
    },
    { id: 29, label: "Essence Tapes", value: "Essence Tapes" },
    { id: 30, label: "Euro Tapes", value: "Euro Tapes" },
    { id: 31, label: "F1 - Spray Paints", value: "F1 - Spray Paints" },
    { id: 32, label: "G2 - Electricals", value: "G2 - Electricals" },
    { id: 33, label: "GM Electricals", value: "GM Electricals" },
    {
      id: 34,
      label: "Gomec Industries / Accent Wonder",
      value: "Gomec Industries / Accent Wonder",
    },
    { id: 35, label: "Great White", value: "Great White" },
    {
      id: 36,
      label: "Gree / Rajguru Adhesive Tapes",
      value: "Gree / Rajguru Adhesive Tapes",
    },
    { id: 37, label: "Gripking Tapes", value: "Gripking Tapes" },
    {
      id: 38,
      label: "Gypstar - Drywall Tape",
      value: "Gypstar - Drywall Tape",
    },
    {
      id: 39,
      label: "Gyptech - Drywall Tape",
      value: "Gyptech - Drywall Tape",
    },
    { id: 40, label: "Immortal Tapes", value: "Immortal Tapes" },
    { id: 41, label: "Instabiz / I-Stix", value: "Instabiz / I-Stix" },
    { id: 42, label: "I-tape", value: "I-tape" },
    { id: 43, label: "Kansuee Industries", value: "Kansuee Industries" },
    {
      id: 44,
      label: "Keval Industries - Tissue",
      value: "Keval Industries - Tissue",
    },
    { id: 45, label: "Kobe - Spray Paint", value: "Kobe - Spray Paint" },
    { id: 46, label: "Kohinoor - PTFE Tape", value: "Kohinoor - PTFE Tape" },
    {
      id: 47,
      label: "Kotadia Engineering / SHB",
      value: "Kotadia Engineering / SHB",
    },
    { id: 48, label: "k-rock", value: "k-rock" },
    { id: 49, label: "Lohmann Tapes", value: "Lohmann Tapes" },
    { id: 50, label: "Mario Industries", value: "Mario Industries" },
    { id: 51, label: "Mexico Wonder", value: "Mexico Wonder" },
    { id: 52, label: "Mexim Adhesive", value: "Mexim Adhesive" },
    { id: 53, label: "MNM Composites", value: "MNM Composites" },
    { id: 54, label: "Mseal", value: "Mseal" },
    { id: 55, label: "MST - Spray Paint", value: "MST - Spray Paint" },
    { id: 56, label: "Nitto - AFT", value: "Nitto - AFT" },
    { id: 57, label: "Oddy / Atul", value: "Oddy / Atul" },
    { id: 58, label: "One Tape", value: "One Tape" },
    { id: 59, label: "Panamax / THB", value: "Panamax / THB" },
    { id: 60, label: "Pidilite / SteelGrip", value: "Pidilite / SteelGrip" },
    { id: 61, label: "pioneer spray paint", value: "pioneer spray paint" },
    { id: 62, label: "Reva Gold", value: "Reva Gold" },
    { id: 63, label: "Saint Gobain - Gyproc", value: "Saint Gobain - Gyproc" },
    { id: 64, label: "Sampro - Spray Paint", value: "Sampro - Spray Paint" },
    {
      id: 65,
      label: "Samraj Polytex - 4S Spray",
      value: "Samraj Polytex - 4S Spray",
    },
    { id: 66, label: "Samurai - Spray Paint", value: "Samurai - Spray Paint" },
    { id: 67, label: "Saraswat / AFT", value: "Saraswat / AFT" },
    { id: 68, label: "Selmex Tapes", value: "Selmex Tapes" },
    { id: 69, label: "Signfix / AFT", value: "Signfix / AFT" },
    { id: 70, label: "Specialty Tapes", value: "Specialty Tapes" },
    { id: 71, label: "Sumax", value: "Sumax" },
    { id: 72, label: "Tesa Tapes", value: "Tesa Tapes" },
    {
      id: 73,
      label: "Touch Up - Spray Paints",
      value: "Touch Up - Spray Paints",
    },
    {
      id: 74,
      label: "Twin Tech - Spray Paint",
      value: "Twin Tech - Spray Paint",
    },
    { id: 75, label: "UCS - Drywall Tape", value: "UCS - Drywall Tape" },
    { id: 76, label: "USG - Drywall Tape", value: "USG - Drywall Tape" },
    {
      id: 77,
      label: "Vardhaman / Tiger Wonder",
      value: "Vardhaman / Tiger Wonder",
    },
    { id: 78, label: "Vista -  Spray Paint", value: "Vista -  Spray Paint" },
    { id: 79, label: "VST - Spray Paint", value: "VST - Spray Paint" },
  ];
  return (
    <>
      <CustomLoader open={open} />

      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
        }}
      >
        <Box
          component="form"
          noValidate
          sx={{ mt: 1 }}
          onSubmit={(e) => handleSubmit(e)}
        >
          <Grid container spacing={2}>
            <Grid item xs={24} sm={4}>
              <Autocomplete
                style={{
                  minWidth: 180,
                }}
                size="small"
                onChange={(e, value) => handleAutocompleteChange(value)}
                options={product.map((option) => option.name)}
                getOptionLabel={(option) => `${option ? option : "No Options"}`}
                renderInput={(params) => (
                  <CustomTextField {...params} label="Product Name" />
                )}
              />
            </Grid>
            <Grid item xs={24} sm={4}>
              <Autocomplete
                size="small"
                options={MainDistribution}
                getOptionLabel={(option) => option.label}
                onChange={handleBrandChange}
                renderInput={(params) => (
                  <CustomTextField {...params} label="Current Brand" />
                )}
              />
            </Grid>
            <Grid item xs={24} sm={4}>
              <CustomTextField
                fullWidth
                name="current_buying_price"
                size="small"
                label="Current Buying Price"
                variant="outlined"
                value={
                  potential.current_buying_price
                    ? potential.current_buying_price
                    : ""
                }
                onChange={handleInputChange}
              />
            </Grid>
            <Grid item xs={24} sm={4}>
              <CustomTextField
                fullWidth
                name="current_buying_quantity"
                size="small"
                label="Current Buying Quantity Monthly"
                variant="outlined"
                value={
                  potential.current_buying_quantity
                    ? potential.current_buying_quantity
                    : ""
                }
                onChange={handleInputChange}
              />
            </Grid>
            <Grid item xs={24} sm={4}>
              <CustomTextField
                fullWidth
                name="target_price"
                size="small"
                label="Target Price"
                variant="outlined"
                value={potential.target_price ? potential.target_price : ""}
                onChange={handleInputChange}
              />
            </Grid>
            {/* <Grid item xs={24} sm={4}>
              <CustomTextField
                fullWidth
                name="quantity"
                size="small"
                label="Quantity"
                variant="outlined"
                value={potential.quantity ? potential.quantity : ""}
                onChange={handleInputChange}
              />
            </Grid> */}
          </Grid>

          <Grid container justifyContent={"flex-end"}>
            <Button type="submit" variant="contained">
              Submit
            </Button>
          </Grid>
        </Box>
      </Box>
    </>
  );
};
