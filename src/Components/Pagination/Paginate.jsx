import { Button } from "@mui/material";
import React from "react";

export const Paginate = ({
  prevPageUrl,
  gotoNextPage,
  gotoPrevPage,
  nextPageUrl,
}) => {
  return (
    <ul className="pagination ">
      <li className="page-item">
        <Button
          variant="outlined"
          disabled={prevPageUrl === null}
          className="page-link"
          onClick={() => gotoPrevPage()}
          sx={{ mr: 4 }}
        >
          Previous
        </Button>
      </li>

      <li className="page-item">
        <Button
          variant="outlined"
          disabled={nextPageUrl === null}
          className="page-link "
          onClick={() => gotoNextPage()}
          sx={{ mr: 4 }}
        >
          Next
        </Button>
      </li>
    </ul>
  );
};
