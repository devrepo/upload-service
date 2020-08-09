import React from "react";
import { Snackbar, IconButton } from "@material-ui/core";
import CloseIcon from "@material-ui/icons/Close";

export default function CustomSnackbar(props) {
  const { open, message, handleClose } = props;
  return (
    <Snackbar
      anchorOrigin={{
        vertical: "bottom",
        horizontal: "left",
      }}
      open={open}
      autoHideDuration={6000}
      onClose={handleClose}
      message={message}
      action={
        <React.Fragment>
          <IconButton
            size="small"
            aria-label="close"
            color="inherit"
            onClick={handleClose}
          >
            <CloseIcon fontSize="small" />
          </IconButton>
        </React.Fragment>
      }
    />
  );
}
