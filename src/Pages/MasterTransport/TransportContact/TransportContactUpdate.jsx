// import React, { useEffect, useState } from "react";
// import { Box, Button, Grid, TextField } from "@mui/material";

// import MasterService from "../../../services/MasterService";
// import InvoiceServices from "../../../services/InvoiceService";
// import { useNotificationHandling } from "../../../Components/useNotificationHandling ";
// import { MessageAlert } from "../../../Components/MessageAlert";
// import { CustomLoader } from "../../../Components/CustomLoader";
// import CustomAutocomplete from "../../../Components/CustomAutocomplete";

// const initialFormState = {
//   transporter: "",
//   unit: "",
//   city: "",
//   contact_person: "",
//   designation_role: "",
//   mobile_number: "",
// };

// const TransportContactCreate = ({ getTransportContactData, setOpenPopup }) => {
//   const [formData, setFormData] = useState(initialFormState);
//   const [loading, setLoading] = useState(false);

//   const [transporterOptions, setTransporterOptions] = useState([]);
//   const [unitOptions, setUnitOptions] = useState([]);
//   const [cityOptions, setCityOptions] = useState([]);

//   const { handleError, handleCloseSnackbar, alertInfo, handleSuccess } =
//     useNotificationHandling();

//   const getTransportName = async () => {
//     try {
//       const response = await MasterService.getAllTransportMaster();
//       if (response && response.data && response.data.results) {
//         setTransporterOptions(response.data.results);
//       } else {
//         setTransporterOptions([]);
//       }
//     } catch (error) {
//       handleError(error);
//     }
//   };

//   const getAllSellerAccountsDetails = async () => {
//     try {
//       const response = await InvoiceServices.getAllSellerAccountData();
//       if (response && response.data && response.data.results) {
//         setUnitOptions(response.data.results);
//       } else {
//         setUnitOptions([]);
//       }
//     } catch (error) {
//       handleError(error);
//     }
//   };

//   const getMasterCities = async () => {
//     try {
//       const response = await MasterService.getMasterCities();
//       if (response && response.data && response.data.results) {
//         setCityOptions(response.data.results);
//       } else {
//         setCityOptions([]);
//       }
//     } catch (error) {
//       handleError(error);
//     }
//   };

//   useEffect(() => {
//     setLoading(true);
//     Promise.all([
//       getTransportName(),
//       getAllSellerAccountsDetails(),
//       getMasterCities(),
//     ]).finally(() => setLoading(false));
//   }, []);

//   const handleChange = (e) => {
//     const { name, value } = e.target;
//     setFormData((prev) => ({ ...prev, [name]: value }));
//   };

//   const handleAutocompleteChange = (name, value) => {
//     setFormData((prev) => ({ ...prev, [name]: value || "" }));
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();

//     try {
//       setLoading(true);

//       await MasterService.createTransportContact(formData);

//       handleSuccess("Transporter contact created successfully");

//       setTimeout(() => {
//         setOpenPopup(false);
//         getTransportContactData();
//       }, 1000);
//     } catch (error) {
//       handleError(error);
//     } finally {
//       setLoading(false);
//     }
//   };

//   const handleReset = () => setFormData(initialFormState);

//   return (
//     <>
//       <MessageAlert
//         open={alertInfo.open}
//         onClose={handleCloseSnackbar}
//         severity={alertInfo.severity}
//         message={alertInfo.message}
//       />

//       <CustomLoader open={loading} />

//       <Box component="form" onSubmit={handleSubmit} sx={{ p: 1 }}>
//         <Grid container spacing={2}>
//           {/* Transporter */}
//           <Grid item xs={12} sm={6}>
//             <CustomAutocomplete
//               fullWidth
//               size="small"
//               options={transporterOptions}
//               value={
//                 transporterOptions.find(
//                   (opt) => opt.transporter_name === formData.transporter,
//                 ) || null
//               }
//               getOptionLabel={(option) =>
//                 option.transporter_name ? option.transporter_name : option
//               }
//               onChange={(e, value) =>
//                 handleAutocompleteChange(
//                   "transporter",
//                   value ? value.transporter_name : "",
//                 )
//               }
//               label="Transporter"
//               required
//             />
//           </Grid>

//           {/* Unit */}
//           <Grid item xs={12} sm={6}>
//             <CustomAutocomplete
//               fullWidth
//               size="small"
//               options={unitOptions}
//               value={
//                 unitOptions.find((opt) => opt.unit === formData.unit) || null
//               }
//               getOptionLabel={(option) => (option.unit ? option.unit : option)}
//               onChange={(e, value) =>
//                 handleAutocompleteChange("unit", value ? value.unit : "")
//               }
//               label="Unit"
//               required
//             />
//           </Grid>

//           {/* City */}
//           <Grid item xs={12} sm={6}>
//             <CustomAutocomplete
//               fullWidth
//               size="small"
//               options={cityOptions}
//               value={
//                 cityOptions.find((opt) => opt.city === formData.city) || null
//               }
//               getOptionLabel={(option) => (option.city ? option.city : option)}
//               onChange={(e, value) =>
//                 handleAutocompleteChange("city", value ? value.city : "")
//               }
//               label="City"
//               required
//             />
//           </Grid>

//           {/* Contact Person */}
//           <Grid item xs={12} sm={6}>
//             <TextField
//               fullWidth
//               required
//               label="Contact Person"
//               name="contact_person"
//               value={formData.contact_person}
//               onChange={handleChange}
//               size="small"
//             />
//           </Grid>

//           {/* Designation / Role */}
//           <Grid item xs={12} sm={6}>
//             <TextField
//               fullWidth
//               required
//               label="Designation / Role"
//               name="designation_role"
//               value={formData.designation_role}
//               onChange={handleChange}
//               size="small"
//             />
//           </Grid>

//           {/* Mobile Number */}
//           <Grid item xs={12} sm={6}>
//             <TextField
//               fullWidth
//               required
//               label="Mobile Number"
//               name="mobile_number"
//               value={formData.mobile_number}
//               onChange={handleChange}
//               size="small"
//               placeholder="+919087675434"
//               inputProps={{ maxLength: 13 }}
//             />
//           </Grid>
//         </Grid>

//         {/* Action Buttons */}
//         <Box
//           sx={{ display: "flex", justifyContent: "flex-end", gap: 1, mt: 3 }}
//         >
//           <Button variant="outlined" color="error" onClick={handleReset}>
//             Reset
//           </Button>
//           <Button
//             type="submit"
//             variant="contained"
//             color="success"
//             disabled={loading}
//           >
//             Submit
//           </Button>
//         </Box>
//       </Box>
//     </>
//   );
// };

// export default TransportContactCreate;
