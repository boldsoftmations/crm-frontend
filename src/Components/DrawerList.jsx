import { List, ListItem, ListItemText } from "@mui/material";
import React from "react";

export const DrawerList = () => {
  return (
    <div>
      {" "}
      <ListItem button>
        <ListItemText primary="First Item" />
      </ListItem>
      <ListItem button>
        <ListItemText primary="Second Item" />
      </ListItem>
    </div>
  );
};
