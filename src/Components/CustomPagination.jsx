import React from "react";
import { Box, Pagination } from "@mui/material";

export const CustomPagination = ({
  totalPages,
  currentPage,
  handlePageChange,
}) => {
  return (
    <Box sx={{ display: "flex", justifyContent: "center", marginTop: "2em" }}>
      <Pagination
        count={totalPages}
        page={currentPage}
        onChange={handlePageChange}
        color="primary"
        variant="outlined"
        shape="rounded"
      />
    </Box>
  );
};
