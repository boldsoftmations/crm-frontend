import React from "react";
import {
  Card,
  CardContent,
  Typography,
  Grid,
  Container,
  Box,
  Stack,
} from "@mui/material";
import EmailIcon from "@mui/icons-material/Email";
import PhoneIcon from "@mui/icons-material/Phone";

const ContactList = ({ leadData }) => {
  const { contact_list, email_list } = leadData;
  return (
    <Container sx={{ mt: 2 }}>
      <Grid container spacing={2}>
        {/* Email List Box */}
        <Grid item xs={12} sm={6}>
          <Card elevation={4}>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Email List
              </Typography>
              <Stack spacing={1}>
                {email_list &&
                  email_list.map((email, index) => (
                    <Box key={index} display="flex" alignItems="center">
                      <EmailIcon sx={{ mr: 1, color: "primary.main" }} />
                      <Typography variant="body1">{email}</Typography>
                    </Box>
                  ))}
              </Stack>
            </CardContent>
          </Card>
        </Grid>

        {/* Contact List Box */}
        <Grid item xs={12} sm={6}>
          <Card elevation={4}>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Contact List
              </Typography>
              <Stack spacing={1}>
                {contact_list &&
                  contact_list.map((phone, index) => (
                    <Box key={index} display="flex" alignItems="center">
                      <PhoneIcon sx={{ mr: 1, color: "success.main" }} />
                      <Typography variant="body1">{phone}</Typography>
                    </Box>
                  ))}
              </Stack>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Container>
  );
};

export default ContactList;
