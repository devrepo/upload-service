import React from "react";
import { Box, Button } from "@material-ui/core";

export default function PaddedButton(props) {
  const { children, ...other } = props;
  return (
    <Box p={1}>
      <Button {...other}>{children}</Button>
    </Box>
  );
}
