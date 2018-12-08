import React from "react";
import TableCell from "@material-ui/core/TableCell";
import TableRow from "@material-ui/core/TableRow";

const Error = props => (
  <React.Fragment>
    {props.error ? (
      <TableRow>
        <TableCell>{props.error}</TableCell>
        <TableCell />
        <TableCell />
        <TableCell />
        <TableCell />
      </TableRow>
    ) : null}
  </React.Fragment>
);

export default Error;
