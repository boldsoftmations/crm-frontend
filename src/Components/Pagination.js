import { Button } from "@mui/material";
import React from "react";

const Pagination = ({
  postsPerPage,
  totalPosts,
  paginate,
  setCurrentPage,
  currentPage,
}) => {
  const pageNumbers = [];

  for (let i = 1; i <= Math.ceil(totalPosts / postsPerPage); i++) {
    pageNumbers.push(i);
  }

  return (
    <nav>
      <ul className="pagination ">
        <li className="page-item">
          <Button
            className="page-link"
            disabled={currentPage === 1}
            onClick={() => setCurrentPage((prev) => prev - 1)}
            sx={{ mr: 4 }}
          >
            Previous
          </Button>
        </li>
        {/* {pageNumbers.map((number, i) => (
          <li key={i} className="page-item">
            <a href="#" onClick={() => paginate(number)} className="page-link">
              {number}
            </a>
          </li>
        ))} */}
        <li className="page-item">
          <Button
            className="page-link "
            disabled={currentPage === pageNumbers.length}
            onClick={() => setCurrentPage((prev) => prev + 1)}
            sx={{ mr: 4 }}
          >
            Next
          </Button>
        </li>
      </ul>
    </nav>
  );
};

export default Pagination;
