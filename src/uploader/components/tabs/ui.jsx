import React from "react";
import CloudUploadIcon from "@material-ui/icons/CloudUpload";
import AccountCircleIcon from "@material-ui/icons/AccountCircle";
import { AppBar, Tabs, Tab, Box } from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";
import TabPanel from "../common/tab_panel";
import Documents from "../documents";

const useStyles = makeStyles((theme) => {
  return {
    root: {
      flexGrow: 1,
      backgroundColor: theme.palette.background.paper,
    },
  };
});

const a11yProps = (index) => {
  return {
    id: `simple-tab-${index}`,
    "aria-controls": `simple-tabpanel-${index}`,
  };
};

const TabsUI = ({ onChangeTab, currentTab }) => {
  const classes = useStyles();
  const [tabValue, setTabValue] = React.useState(currentTab);

  const handleChange = (tab) => {
    setTabValue(tab);
    onChangeTab(tab);
  };

  return (
    <div className={classes.root}>
      <AppBar position="static">
        <Tabs
          value={tabValue}
          onChange={(event, tab) => handleChange(tab)}
          variant="fullWidth"
          indicatorColor="secondary"
          textColor="inherit"
          aria-label="tabs documents uploads others"
        >
          <Tab icon={<CloudUploadIcon />} label="DOCUMENTS" {...a11yProps(0)} />
          <Tab
            icon={<AccountCircleIcon />}
            label="OTHER TAB"
            {...a11yProps(1)}
          />
        </Tabs>
      </AppBar>
      <TabPanel value={tabValue} index={0}>
        <Documents />
      </TabPanel>
      <TabPanel value={tabValue} index={1}>
        <Box p={8} justifyContent="center" flexDirection="row" display="flex">
          OTHER TAB
        </Box>
      </TabPanel>
    </div>
  );
};

export default TabsUI;
