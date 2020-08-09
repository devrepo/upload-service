import { createMuiTheme } from "@material-ui/core/styles";
import blue from "@material-ui/core/colors/blue";

// A custom theme for this app
const theme = createMuiTheme({
  palette: {
    primary: blue,
    background: {
      default: "#fff",
    },
  },
});

export default theme;
