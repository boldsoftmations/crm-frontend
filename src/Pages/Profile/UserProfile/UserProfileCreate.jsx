import React, { useCallback, useState } from "react";
import { Button, Container, Grid, Divider, Chip, Box } from "@mui/material";

import { styled } from "@mui/material/styles";
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
import CustomSnackbar from "../../../Components/CustomerSnackbar";

const Root = styled("div")(({ theme }) => ({
  width: "100%",
  ...theme.typography.body2,
  "& > :not(style) + :not(style)": {
    marginTop: theme.spacing(2),
  },
}));

export const UserProfileCreate = ({ setOpenPopup, getUsers }) => {
  const [open, setOpen] = useState(false);
  const [profilePic, setProfilePic] = useState(null);
  const [errorMessages, setErrorMessages] = useState(null);
  const auth = useSelector((state) => state.auth);
  const Profile = auth.profile ? auth.profile : [];
  const [formData, setFormData] = useState({
    user: Profile.emp_id,
    personal: {
      first_name: null,
      middle_name: null,
      last_name: null,
      email: null,
      gender: null,
      contact: null,
      religion: null,
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

  const [alertmsg, setAlertMsg] = useState({
    message: "",
    severity: "",
    open: false,
  });

  const handleClose = () => {
    setAlertMsg({ open: false });
  };

  const validateFormData = (formData) => {
    const errors = {};

    // Helper function to check if a value is null or empty
    const isEmpty = (value) =>
      value === null || value === "" || value === undefined;

    // Validate personal information
    const personalFields = [
      "first_name",
      "middle_name",
      "last_name",
      "email",
      "contact",
      "date_of_birth",
      "date_of_birth",
      "place_of_birth",
      "nationality",
      "marital_status",
      "date_of_joining",
      "blood_group",
      "gender",
      "religion",
    ];
    errors.personal = {};
    personalFields.forEach((field) => {
      if (isEmpty(formData.personal[field])) {
        errors.personal[field] = `${field.replace(/_/g, " ")} is required.`;
      }
    });

    // Validate current address
    errors.address = { current: {}, permanent: {} };
    const addressFields = ["address", "pin"];
    addressFields.forEach((field) => {
      if (isEmpty(formData.address.current[field])) {
        errors.address.current[field] = `Current ${field} is required.`;
      }
      if (
        !formData.address.current.is_permanent_same_as_current &&
        isEmpty(formData.address.permanent[field])
      ) {
        errors.address.permanent[field] = `Permanent ${field} is required.`;
      }
    });

    // Validate KYC details
    const kycFields = [
      "ifsc_code",
      "account_number",
      "pan_card_number",
      "aadhar_card_number",
    ];
    errors.kyc = {};
    kycFields.forEach((field) => {
      if (isEmpty(formData.kyc[field])) {
        errors.kyc[field] = `${field.replace(/_/g, " ")} is required.`;
      }
    });

    // Validate emergency contacts
    errors.emergency_contacts = [];
    formData.emergency_contacts.forEach((contact, index) => {
      const contactErrors = {};
      ["name", "relationship", "number"].forEach((field) => {
        if (isEmpty(contact[field])) {
          contactErrors[field] = `${field.replace(/_/g, " ")} is required.`;
        }
      });
      if (Object.keys(contactErrors).length > 0) {
        errors.emergency_contacts[index] = contactErrors;
      }
    });

    // Validate family details
    errors.family_details = [];
    formData.family_details.forEach((family, index) => {
      const familyErrors = {};
      ["name", "relationship", "blood_group", "contact_number"].forEach(
        (field) => {
          if (isEmpty(family[field])) {
            familyErrors[field] = `${field.replace(/_/g, " ")} is required.`;
          }
        }
      );
      if (Object.keys(familyErrors).length > 0) {
        errors.family_details[index] = familyErrors;
      }
    });

    // Validate medical details
    errors.medical = {};
    [
      "known_allergies",
      "diabetic",
      "vision",
      "surgery_type",
      "pregnancy",
      "previous_surgeries",
      "known_allergies",
      "diabetic",
      "hyper_tension",
      "heart_issues",
      "cancer",
      "high_blood_pressure",
      "low_blood_pressure",
      "asthama_respiratory",
      "vision",
      "hearing",
    ].forEach((field) => {
      if (isEmpty(formData.medical[field])) {
        errors.medical[field] = `${field.replace(/_/g, " ")} is required.`;
      }
    });
    // Validate addiction details
    errors.addiction = {};
    ["tobacco", "cigarettes", "alcohol"].forEach((field) => {
      if (isEmpty(formData.addiction[field])) {
        errors.addiction[field] = `${field.replace(/_/g, " ")} is required.`;
      }
    });

    return errors;
  };

  const handleProfilePicChange = (e) => {
    const file = e.target.files[0];
    if (file && file.size <= 100 * 1024) {
      // Check if file size is less than or equal to 100KB
      setProfilePic(file);
    } else {
      alert("Please select an image of size less than 100KB");
    }
  };

  const hasErrors = (obj) => {
    if (!obj) return false;

    if (Array.isArray(obj)) {
      return obj.some((item) => hasErrors(item)); // Check for errors in array elements
    }

    if (typeof obj === "object") {
      return Object.values(obj).some((value) => {
        if (typeof value === "object") {
          return hasErrors(value);
        }
        return value !== ""; // Check if value is not an empty string
      });
    }

    return false;
  };

  const CreateUserProfile = async (e) => {
    e.preventDefault();
    const errorList = validateFormData(formData);

    if (hasErrors(errorList)) {
      setErrorMessages(errorList);
      return; // Prevent form submission if there are errors
    }
    try {
      setOpen(true);
      const res = await UserProfileService.createUserProfileData(formData);
      if (res.status === 201) {
        setAlertMsg({
          message: "User profile created successfully",
          severity: "success",
          open: true,
        });
        setTimeout(() => {
          setOpenPopup(false);
          getUsers();
        }, 500);
      }
    } catch (error) {
      console.error("Error creating user profile:", error);
      setAlertMsg({
        message: "Error creating user profile",
        severity: "error",
        open: true,
      });
    } finally {
      setOpen(false);
    }
  };

  return (
    <Container>
      <CustomSnackbar
        open={alertmsg.open}
        message={alertmsg.message}
        severity={alertmsg.severity}
        onClose={handleClose}
      />
      <CustomLoader open={open} />
      {/* Display errors */}

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
          <PersonalFields
            formData={formData}
            setFormData={setFormData}
            error={errorMessages}
          />
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
            error={errorMessages}
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
            error={errorMessages}
          />

          {/* KYC Details */}
          <Grid item xs={12}>
            <Root>
              <Divider>
                <Chip label="KYC Details" />
              </Divider>
            </Root>
          </Grid>
          <KycFields
            formData={formData}
            setFormData={setFormData}
            error={errorMessages}
          />
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
            error={errorMessages}
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
          <FamilyFields
            formData={formData}
            setFormData={setFormData}
            error={errorMessages}
          />
          {/*Known Health Issues Details  */}
          <Grid item xs={12}>
            <Root>
              <Divider>
                <Chip label="Known Health Issues" />
              </Divider>
            </Root>
          </Grid>
          <MedicalFields
            formData={formData}
            setFormData={setFormData}
            error={errorMessages}
          />

          {/*Addiction Details  */}
          <Grid item xs={12}>
            <Root>
              <Divider>
                <Chip label="Addiction Details" />
              </Divider>
            </Root>
          </Grid>
          <AddictionFields
            formData={formData}
            setFormData={setFormData}
            error={errorMessages}
          />

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
