import React, { useCallback, useEffect, useState } from "react";
import {
  Button,
  Container,
  Grid,
  Divider,
  Chip,
  Box,
  Snackbar,
} from "@mui/material";
import { styled } from "@mui/material/styles";
import Alert from "@mui/lab/Alert";
import UserProfileService from "../../../services/UserProfileService";
import { CustomLoader } from "../../../Components/CustomLoader";
import { PersonalFields } from "../Personal/PersonalFields";
import { AddressFields } from "../Address/AddressFields ";
import { EmergencyContactFields } from "../EmergencyContact/EmergencyContactFields";
import { PFAndESIFields } from "../PFAndESI/PFAndESIFields";
import { MedicalFields } from "../Medical/MedicalFields";
import { DocterFields } from "../Docter/DocterFields";
import { AddictionFields } from "../Addiction/AddictionFields";
import { EducationFields } from "../Education/EducationFields";
import { EmploymentFields } from "../Employment/EmploymentFields";
import { FamilyFields } from "../Family/FamilyFields";
import { KycFields } from "../Kyc/KycFields";
import { useSelector } from "react-redux";

const Root = styled("div")(({ theme }) => ({
  width: "100%",
  ...theme.typography.body2,
  "& > :not(style) + :not(style)": {
    marginTop: theme.spacing(2),
  },
}));

export const UserProfileCreate = ({ setOpenPopup, getUsers }) => {
  const [open, setOpen] = useState(false);
  const [openSnackbar, setOpenSnackbar] = useState(false);
  const [profilePic, setProfilePic] = useState(null);

  const [errorMessages, setErrorMessages] = useState([]);
  const [currentErrorIndex, setCurrentErrorIndex] = useState(0);
  const auth = useSelector((state) => state.auth);
  const Profile = auth.profile ? auth.profile : [];
  const [formData, setFormData] = useState({
    user: Profile.emp_id,
    personal: {
      first_name: null,
      middle_name: null,
      last_name: null,
      email: null,
      // alternate_email: null,
      contact: null,
      // alternate_contact: null,
      date_of_birth: null,
      place_of_birth: null,
      nationality: null,
      marital_status: null,
      marriage_date: null,
      date_of_joining: null,
      blood_group: null,
    },
    address: {
      current: {
        address: null,
        city: null,
        state: null,
        pin: null,
        is_permanent_same_as_current: false,
      },
      permanent: {
        address: null,
        city: null,
        state: null,
        pin: null,
      },
    },
    kyc: {
      name: null,
      account_number: null,
      ifsc_code: null,
      branch: null,
      city: null,
      state: null,
      address: null,
      pan_card_number: null,
      aadhar_card_number: null,
      passport_number: null,
      dl_number: null,
    },
    emergency_contacts: [
      {
        name: null,
        relationship: null,
        number: null,
      },
    ],
    pf_esi_details: {
      has_pf_esi_account: null,
      uan_number: null,
      pf_number: null,
      esi_number: null,
    },
    employment_history: [
      {
        company_name: null,
        post_held: null,
        workedFrom: null,
        workedTill: null,
      },
    ],
    education: {
      school: {
        name: null,
        board: null,
        passout: null,
      },
      college: {
        name: null,
        board: null,
        passout: null,
      },
      diploma: {
        type: null,
        uni_name: null,
        passout: null,
      },
      graduation: {
        type: null,
        university: null,
        passout: null,
      },
      pg: {
        masters: null,
        passout: null,
      },
      additional_qualifiction: null,
    },
    medical: {
      surgery_type: null,
      pregnancy: null,
      previous_surgeries: null,
      known_allergies: null,
      diabetic: null,
      hyper_tension: null,
      heart_issues: null,
      cancer: null,
      high_blood_pressure: null,
      low_blood_pressure: null,
      asthama_respiratory: null,
      vision: null,
      hearing: null,
    },
    addiction: {
      tobacco: null,
      cigarettes: null,
      alcohol: null,
    },
    doctor: {
      name: null,
      phone_number: null,
    },
    family_details: [
      {
        name: null,
        relationship: null,
        blood_group: null,
        contact_number: null,
      },
    ],
  });

  const handleProfilePicChange = (e) => {
    const file = e.target.files[0];
    if (file && file.size <= 100 * 1024) {
      // Check if file size is less than or equal to 100KB
      setProfilePic(file);
    } else {
      alert("Please select an image of size less than 100KB");
    }
  };

  const handleCloseSnackbar = useCallback(() => {
    if (currentErrorIndex < errorMessages.length - 1) {
      setCurrentErrorIndex((prevIndex) => prevIndex + 1);
    } else {
      setOpenSnackbar(false);
      setCurrentErrorIndex(0); // Reset for any future errors
    }
  }, [currentErrorIndex, errorMessages.length]);

  const extractErrorMessages = (data) => {
    return Object.values(data).flatMap((errors) => errors);
  };

  const CreateUserProfile = async (e) => {
    e.preventDefault();
    setOpen(true);

    try {
      await UserProfileService.createUserProfileData(formData);
      setOpenPopup(false);
      getUsers();
    } catch (error) {
      console.error("Error creating user profile:", error);
      const newErrors = extractErrorMessages(error.response.data);
      setErrorMessages((prevErrors) => [...prevErrors, ...newErrors]);
      setCurrentErrorIndex(0); // Reset the error index when new errors arrive
      setOpenSnackbar((prevOpen) => !prevOpen);
    } finally {
      setOpen(false); // Close loader in either case (success or error)
    }
  };

  return (
    <Container>
      <CustomLoader open={open} />
      {/* Display errors */}
      <Snackbar
        open={openSnackbar}
        autoHideDuration={6000}
        onClose={handleCloseSnackbar}
        anchorOrigin={{ vertical: "top", horizontal: "right" }}
      >
        <Alert onClose={handleCloseSnackbar} severity="error">
          {errorMessages[currentErrorIndex]}
        </Alert>
      </Snackbar>

      <Box component="form" noValidate onSubmit={CreateUserProfile}>
        <Grid item xs={12} sx={{ marginTop: "20px", marginBottom: "20px" }}>
          <Root>
            <Divider>
              <Chip label="Upload Profile Picture" />
            </Divider>
            <input
              type="file"
              accept="image/*"
              onChange={handleProfilePicChange}
            />
            {profilePic && (
              <img
                src={URL.createObjectURL(profilePic)}
                alt="Profile"
                width="100"
              />
            )}{" "}
            {/* Display the selected image */}
          </Root>
        </Grid>
        <Grid container spacing={2}>
          {/* Personal Details */}
          <Grid item xs={12} sx={{ marginTop: "20px", marginBottom: "20px" }}>
            <Root>
              <Divider>
                <Chip label="Personal Details" />
              </Divider>
            </Root>
          </Grid>
          <PersonalFields formData={formData} setFormData={setFormData} />
          {/* Current And Permanent Address Details */}
          <Grid item xs={12}>
            <Root>
              <Divider>
                <Chip label="Current Address Details" />
              </Divider>
            </Root>
          </Grid>
          <AddressFields
            type="current"
            formData={formData}
            setFormData={setFormData}
          />
          <Grid item xs={12}>
            <Root>
              <Divider>
                <Chip label="Permanent Address Details" />
              </Divider>
            </Root>
          </Grid>
          <AddressFields
            type="permanent"
            formData={formData}
            setFormData={setFormData}
          />

          {/* KYC Details */}
          <Grid item xs={12}>
            <Root>
              <Divider>
                <Chip label="KYC Details" />
              </Divider>
            </Root>
          </Grid>
          <KycFields formData={formData} setFormData={setFormData} />
          <Grid item xs={12}>
            <Root>
              <Divider>
                <Chip label="Emergency Contact Details" />
              </Divider>
            </Root>
          </Grid>
          {/* Emergency Contact Details */}
          <EmergencyContactFields
            formData={formData}
            setFormData={setFormData}
          />
          {/* PF & ESI Details */}
          <Grid item xs={12}>
            <Root>
              <Divider>
                <Chip label="PF & ESI Details" />
              </Divider>
            </Root>
          </Grid>
          <PFAndESIFields formData={formData} setFormData={setFormData} />
          {/* Educational Details */}
          <Grid item xs={12}>
            <Root>
              <Divider>
                <Chip label="Educational Details" />
              </Divider>
            </Root>
          </Grid>
          <EducationFields formData={formData} setFormData={setFormData} />
          {/* Employment Details */}
          <Grid item xs={12}>
            <Root>
              <Divider>
                <Chip label="Employment Details" />
              </Divider>
            </Root>
          </Grid>
          <EmploymentFields formData={formData} setFormData={setFormData} />
          {/* Family Details */}
          <Grid item xs={12}>
            <Root>
              <Divider>
                <Chip label="Family Details" />
              </Divider>
            </Root>
          </Grid>
          <FamilyFields formData={formData} setFormData={setFormData} />
          {/*Known Health Issues Details  */}
          <Grid item xs={12}>
            <Root>
              <Divider>
                <Chip label="Known Health Issues" />
              </Divider>
            </Root>
          </Grid>
          <MedicalFields formData={formData} setFormData={setFormData} />

          {/*Addiction Details  */}
          <Grid item xs={12}>
            <Root>
              <Divider>
                <Chip label="Addiction Details" />
              </Divider>
            </Root>
          </Grid>
          <AddictionFields formData={formData} setFormData={setFormData} />

          {/*Family Doctor Details  */}
          <Grid item xs={12}>
            <Root>
              <Divider>
                <Chip label="Family Doctor Details" />
              </Divider>
            </Root>
          </Grid>
          <DocterFields formData={formData} setFormData={setFormData} />

          <Grid item xs={12}>
            <Button
              fullWidth
              type="submit"
              variant="contained"
              sx={{ marginBottom: "20px" }}
            >
              Submit
            </Button>
          </Grid>
        </Grid>
      </Box>
    </Container>
  );
};
