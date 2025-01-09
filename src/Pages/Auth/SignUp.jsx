import React, { useEffect, useState } from "react";
import { Box, Grid, Chip } from "@mui/material";
import * as Yup from "yup";
import { useFormik } from "formik";
import { CustomButton } from "./../../Components/CustomButton";
import { CustomLoader } from "../../Components/CustomLoader";
import CustomTextField from "../../Components/CustomTextField";
import UserProfileService from "../../services/UserProfileService";
import CustomAutocomplete from "../../Components/CustomAutocomplete";
import TaskService from "../../services/TaskService";
import CustomSnackbar from "../../Components/CustomerSnackbar";

export const SignUp = ({ setOpenAddEmployeesPopUp, refreshPageFunction }) => {
  const [open, setOpen] = useState(false);
  const [groupsData, setGroupsData] = useState([]);

  const [alertmsg, setAlertMsg] = useState({
    message: "",
    severity: "",
    open: false,
  });
  const handleClose = () => {
    setAlertMsg({ open: false });
  };

  const validationSchema = Yup.object().shape({
    first_name: Yup.string().required("first name is required"),
    last_name: Yup.string().required("last name is required"),
    email: Yup.string().required("Email is required").email("Email is invalid"),
    contact: Yup.string()
      .required("contact is required")
      .matches(phoneRegExp, "Phone number is not valid"),
    group_names: Yup.array()
      .min(1, "At least one group is required")
      .required("Groups name is required"),
  });

  const getAllUsersDetails = async () => {
    try {
      setOpen(true);
      const response = await TaskService.getAllUsers("True");
      setGroupsData(response.data.groups);
      setOpen(false);
    } catch (error) {
      console.log(error);
    } finally {
      setOpen(false);
    }
  };

  useEffect(() => {
    getAllUsersDetails();
  }, []);

  const formik = useFormik({
    initialValues: {
      first_name: "",
      last_name: "",
      email: "",
      contact: "",
      password: "",
      group_names: [],
    },
    validationSchema: validationSchema,

    onSubmit: async (values) => {
      try {
        setOpen(true);
        const req = { ...values };
        const res = await UserProfileService.register(req);
        if (res.statusCode === 200) {
          setOpenAddEmployeesPopUp(false);
          formik.resetForm();
          setAlertMsg({
            message: res.data.message || "Employees created successfully",
            severity: "success",
            open: true,
          });
          refreshPageFunction();
        }
      } catch (error) {
        setAlertMsg({
          message: error.response.data.message || "Failed to create employees",
          severity: "error",
          open: true,
        });
        setOpen(false);
      } finally {
        setOpen(false);
      }
    },
  });

  return (
    <div>
      <CustomSnackbar
        open={alertmsg.open}
        message={alertmsg.message}
        severity={alertmsg.severity}
        onClose={handleClose}
      />
      <CustomLoader open={open} />
      <Grid>
        <Box
          // className="Auth-form-content"
          component="form"
          noValidate
          onSubmit={formik.handleSubmit}
          sx={{ mt: "1em" }}
        >
          <Grid container spacing={2}>
            <Grid item xs={12} sm={12}>
              <CustomTextField
                required
                fullWidth
                name="first_name"
                size="small"
                label="First Name"
                variant="outlined"
                value={formik.values.first_name}
                onChange={formik.handleChange}
                error={
                  formik.touched.first_name && Boolean(formik.errors.first_name)
                }
                helperText={
                  formik.touched.first_name && formik.errors.first_name
                }
              />
            </Grid>
            <Grid item xs={12} sm={12}>
              <CustomTextField
                required
                fullWidth
                name="last_name"
                size="small"
                label="Last Name"
                variant="outlined"
                value={formik.values.last_name}
                onChange={formik.handleChange}
                error={
                  formik.touched.last_name && Boolean(formik.errors.last_name)
                }
                helperText={formik.touched.last_name && formik.errors.last_name}
              />
            </Grid>
            <Grid item xs={12}>
              <CustomTextField
                required
                name="email"
                fullWidth
                size="small"
                label="Email"
                variant="outlined"
                value={formik.values.email}
                onChange={formik.handleChange}
                error={formik.touched.email && Boolean(formik.errors.email)}
                helperText={formik.touched.email && formik.errors.email}
              />
            </Grid>
            <Grid item xs={12}>
              <CustomTextField
                required
                name="contact"
                fullWidth
                size="small"
                label="Contact No."
                type="phone"
                variant="outlined"
                value={formik.values.contact}
                onChange={formik.handleChange}
                error={formik.touched.contact && Boolean(formik.errors.contact)}
                helperText={formik.touched.contact && formik.errors.contact}
              />
            </Grid>

            <Grid item xs={12}>
              <CustomAutocomplete
                size="small"
                multiple
                required
                id="group_names"
                options={groupsData}
                value={formik.values.group_names}
                onChange={(event, value) =>
                  formik.setFieldValue("group_names", value)
                }
                renderTags={(value, getTagProps) =>
                  value.map((option, index) => (
                    <Chip
                      variant="outlined"
                      label={option}
                      {...getTagProps({ index })}
                    />
                  ))
                }
                renderInput={(params) => (
                  <CustomTextField
                    {...params}
                    label="Groups"
                    placeholder="Select groups"
                    error={
                      formik.touched.group_names &&
                      Boolean(formik.errors.group_names)
                    }
                    helperText={
                      formik.touched.group_names && formik.errors.group_names
                    }
                  />
                )}
              />
            </Grid>
          </Grid>
          <CustomButton
            type="submit"
            fullWidth
            variant="contained"
            sx={{ mt: 3, mb: 2 }}
            text={"Add"}
          />
        </Box>
      </Grid>
    </div>
  );
};

const phoneRegExp =
  /^((\\+[1-9]{1,4}[ \\-]*)|(\\([0-9]{2,3}\\)[ \\-]*)|([0-9]{2,4})[ \\-]*)*?[0-9]{3,4}?[ \\-]*[0-9]{3,4}?$/;
