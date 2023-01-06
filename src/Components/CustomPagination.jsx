import React from 'react'
import { Pagination, TableFooter } from '@mui/material'

export const CustomPagination = (props) => {
    const {pageCount,handlePageClick} = props
  return (
    <TableFooter
    sx={{ display: "flex", justifyContent: "center", marginTop: "2em" }}
  >
    <Pagination
    count={pageCount}
    onChange={handlePageClick}
    color={"primary"}
    variant="outlined"
    shape="circular"
  />
  </TableFooter>
  )
}
