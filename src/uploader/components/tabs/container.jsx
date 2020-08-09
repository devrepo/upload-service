import React, { useState, useEffect, useRef } from "react";
import { useSelector } from "react-redux";

import PropTypes from "prop-types";
import querySearch from "stringquery";
import { makeStyles } from "@material-ui/core/styles";

import TabsUI from "./ui.jsx";
import { Paper } from "@material-ui/core";
import { getDocuments } from "../../selectors";
import openSocket from "socket.io-client";
import { useSnackbar } from "notistack";

const useStyles = makeStyles((theme) => ({
  root: {
    flexGrow: 1,
    "& > *": {
      margin: theme.spacing(1),
    },
  },
}));
const Tabs = (props) => {
  const { location } = props;
  const classes = useStyles();
  const searchParams = querySearch(location.search);
  const tab = parseInt(searchParams.tab);
  const [currentTab, updateCurrentTab] = useState(tab || 0);
  const { uploadDone } = useSelector((state) => getDocuments(state));
  const { enqueueSnackbar, closeSnackbar } = useSnackbar();
  const socket = useRef();

  const onChangeTab = (tab) => {
    updateCurrentTab(tab);
    props.history.push(`/?tab=${tab}`);
  };

  useEffect(() => {
    if (uploadDone) {
      enqueueSnackbar("Files uploaded successfully!", {
        variant: "success",
      });
    }
    let currentSocket = socket.current;
    currentSocket = openSocket(process.env.REACT_APP_IO_SERVER_URL);
    currentSocket.on("upload_started", ({ user, files }) => {
      closeSnackbar();
      const msg = `${user} started uploading ${files} file(s).`;
      enqueueSnackbar(msg, {
        variant: "success",
      });
    });
    return function cleanup() {
      currentSocket.off("upload_started");
      currentSocket = null;
    };
  }, [enqueueSnackbar, uploadDone, socket, closeSnackbar]);

  return (
    <Paper square className={classes.root}>
      <TabsUI onChangeTab={onChangeTab} currentTab={currentTab} />
    </Paper>
  );
};

Tabs.propTypes = {
  location: PropTypes.object.isRequired,
  history: PropTypes.object.isRequired,
};

export default Tabs;
