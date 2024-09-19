import React from "react";
import {
  Container,
  Divider,
  Grid,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  Paper,
  Typography,
  Box,
} from "@mui/material";
import CircleIcon from "@mui/icons-material/Circle";

const DetailView = ({ data }) => {
  return (
    <Container>
      <Paper sx={{ p: 3 }}>
        <Typography variant="h6" gutterBottom>
          Role : {data.designation}
        </Typography>
        <Divider sx={{ mb: 2 }} />
        <Grid container spacing={2}>
          <Grid item xs={12} sm={6} md={4}>
            <Box sx={{ p: 2, backgroundColor: "#f0f0f0", borderRadius: 1 }}>
              <Typography variant="subtitle1">Skill :</Typography>
              <List dense>
                {data.skill.map((skill, index) => (
                  <ListItem key={index}>
                    <ListItemIcon sx={{ minWidth: "auto", pr: 1 }}>
                      <CircleIcon fontSize="small" />
                    </ListItemIcon>
                    <ListItemText primary={skill} />
                  </ListItem>
                ))}
              </List>
            </Box>
          </Grid>
          <Grid item xs={12} sm={6} md={4}>
            <Box sx={{ p: 2, backgroundColor: "#e0f7fa", borderRadius: 1 }}>
              <Typography variant="subtitle1">Knowledge :</Typography>
              <List dense>
                {data.knowledge.map((knowledge, index) => (
                  <ListItem key={index}>
                    <ListItemIcon sx={{ minWidth: "auto", pr: 1 }}>
                      <CircleIcon fontSize="small" />
                    </ListItemIcon>
                    <ListItemText primary={knowledge} />
                  </ListItem>
                ))}
              </List>
            </Box>
          </Grid>
          <Grid item xs={12} sm={6} md={4}>
            <Box sx={{ p: 2, backgroundColor: "#ffecb3", borderRadius: 1 }}>
              <Typography variant="subtitle1">Self-Image :</Typography>
              <List dense>
                {data.self_image.map((selfImage, index) => (
                  <ListItem key={index}>
                    <ListItemIcon sx={{ minWidth: "auto", pr: 1 }}>
                      <CircleIcon fontSize="small" />
                    </ListItemIcon>
                    <ListItemText primary={selfImage} />
                  </ListItem>
                ))}
              </List>
            </Box>
          </Grid>
          <Grid item xs={12} sm={6} md={4}>
            <Box sx={{ p: 2, backgroundColor: "#dcedc8", borderRadius: 1 }}>
              <Typography variant="subtitle1">Trait :</Typography>
              <List dense>
                {data.trait.map((trait, index) => (
                  <ListItem key={index}>
                    <ListItemIcon sx={{ minWidth: "auto", pr: 1 }}>
                      <CircleIcon fontSize="small" />
                    </ListItemIcon>
                    <ListItemText primary={trait} />
                  </ListItem>
                ))}
              </List>
            </Box>
          </Grid>
          <Grid item xs={12} sm={6} md={4}>
            <Box sx={{ p: 2, backgroundColor: "#f8bbd0", borderRadius: 1 }}>
              <Typography variant="subtitle1">Motive :</Typography>
              <List dense>
                {data.motive.map((motive, index) => (
                  <ListItem key={index}>
                    <ListItemIcon sx={{ minWidth: "auto", pr: 1 }}>
                      <CircleIcon fontSize="small" />
                    </ListItemIcon>
                    <ListItemText primary={motive} />
                  </ListItem>
                ))}
              </List>
            </Box>
          </Grid>
        </Grid>
      </Paper>
    </Container>
  );
};

export default DetailView;
