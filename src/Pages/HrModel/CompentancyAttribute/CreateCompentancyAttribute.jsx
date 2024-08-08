import React, { useEffect, useState } from "react";
import {
  Container,
  Button,
  Box,
  Grid,
  Paper,
  Autocomplete,
  TextField,
} from "@mui/material";
import Hr from "../../../services/Hr";
import CustomSnackbar from "../../../Components/CustomerSnackbar";
import CustomAutocomplete from "../../../Components/CustomAutocomplete";

const CreateCompetancyAttribute = ({
  getCompetancyData,
  setOpenAttributePopUp,
}) => {
  const [loading, setLoading] = useState(false);
  const [role, setRole] = useState([]);
  const [attributeData, setAttributeData] = useState({
    Skill: [],
    Knowledge: [],
    SelfImage: [],
    Trait: [],
    Motive: [],
  });
  const [formData, setFormData] = useState({
    role: "",
    skill: [],
    knowledge: [],
    self_image: [],
    trait: [],
    motive: [],
  });
  const [alertMsg, setAlertMsg] = useState({
    message: "",
    severity: "",
    open: false,
  });

  const handleClose = () => {
    setAlertMsg({ open: false });
  };

  const getAttributeCompetencyList = async () => {
    try {
      const response = await Hr.getAttributeList();
      setAttributeData({
        Skill: response.data.Skill || [],
        Knowledge: response.data.Knowledge || [],
        SelfImage: response.data["Self-Image"] || [],
        Trait: response.data.Trait || [],
        Motive: response.data.Motive || [],
      });
    } catch (error) {
      console.error("Error fetching attribute list:", error);
    }
  };

  const getUserRoleList = async () => {
    try {
      const response = await Hr.getUserGroupList();
      setRole(response.data.data || []);
    } catch (error) {
      console.error("Error fetching role list:", error);
      setRole([]); // Ensure role is always an array
    }
  };

  useEffect(() => {
    getAttributeCompetencyList();
    getUserRoleList();
  }, []);

  const handleInputChange = (name, value) => {
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  console.log(formData);

  const handleSubmit = async (event) => {
    event.preventDefault();
    setLoading(true);
    try {
      const response = await Hr.createCompetancyAttribute(formData);
      setAlertMsg({
        open: true,
        message: response.message || "Attribute Created Successfully",
        severity: "success",
      });
      setTimeout(() => {
        setOpenAttributePopUp(false);
        getCompetancyData();
      }, 1000);
    } catch (error) {
      setAlertMsg({
        open: true,
        message: error.message || "Error creating attribute",
        severity: "error",
      });
      console.error("Error creating attribute:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container>
      <CustomSnackbar
        open={alertMsg.open}
        message={alertMsg.message}
        severity={alertMsg.severity}
        onClose={handleClose}
      />
      <Paper sx={{ p: 3 }}>
        <form onSubmit={handleSubmit}>
          <Grid container spacing={2}>
            <Grid item xs={12}>
              <CustomAutocomplete
                options={role}
                value={formData.role}
                onChange={(e, value) =>
                  setFormData((prev) => ({ ...prev, role: value }))
                }
                label="Role"
                margin="dense"
                fullWidth
              />
            </Grid>
            <Grid item xs={12}>
              <Autocomplete
                fullWidth
                multiple
                size="small"
                disablePortal
                id="skill-autocomplete"
                options={attributeData.Skill}
                getOptionLabel={(option) => option}
                value={formData.skill}
                onChange={(event, newValue) =>
                  handleInputChange("skill", newValue)
                }
                renderInput={(params) => (
                  <TextField {...params} label="Skill" variant="outlined" />
                )}
              />
            </Grid>
            <Grid item xs={12}>
              <Autocomplete
                fullWidth
                multiple
                size="small"
                disablePortal
                id="knowledge-autocomplete"
                options={attributeData.Knowledge}
                getOptionLabel={(option) => option}
                value={formData.knowledge}
                onChange={(event, newValue) =>
                  handleInputChange("knowledge", newValue)
                }
                renderInput={(params) => (
                  <TextField {...params} label="Knowledge" variant="outlined" />
                )}
              />
            </Grid>
            <Grid item xs={12}>
              <Autocomplete
                fullWidth
                multiple
                size="small"
                disablePortal
                id="self-image-autocomplete"
                options={attributeData.SelfImage}
                getOptionLabel={(option) => option}
                value={formData.self_image}
                onChange={(event, newValue) =>
                  handleInputChange("self_image", newValue)
                }
                renderInput={(params) => (
                  <TextField
                    {...params}
                    label="Self Image"
                    variant="outlined"
                  />
                )}
              />
            </Grid>
            <Grid item xs={12}>
              <Autocomplete
                fullWidth
                multiple
                size="small"
                disablePortal
                id="trait-autocomplete"
                options={attributeData.Trait}
                getOptionLabel={(option) => option}
                value={formData.trait}
                onChange={(event, newValue) =>
                  handleInputChange("trait", newValue)
                }
                renderInput={(params) => (
                  <TextField {...params} label="Trait" variant="outlined" />
                )}
              />
            </Grid>
            <Grid item xs={12}>
              <Autocomplete
                fullWidth
                multiple
                size="small"
                disablePortal
                id="motive-autocomplete"
                options={attributeData.Motive}
                getOptionLabel={(option) => option}
                value={formData.motive}
                onChange={(event, newValue) =>
                  handleInputChange("motive", newValue)
                }
                renderInput={(params) => (
                  <TextField {...params} label="Motive" variant="outlined" />
                )}
              />
            </Grid>
            <Grid item xs={12}>
              <Box display="flex" justifyContent="flex-end">
                <Button
                  fullWidth
                  type="submit"
                  variant="contained"
                  color="primary"
                  disabled={loading}
                >
                  {loading ? "Submitting..." : "Submit"}
                </Button>
              </Box>
            </Grid>
          </Grid>
        </form>
      </Paper>
    </Container>
  );
};

export default CreateCompetancyAttribute;
