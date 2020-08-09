import React from "react";
import { Route } from "react-router-dom";
import { Provider } from "react-redux";
import "./app.scss";
import store from "./store";
import { TabbedContainer } from "../uploader";
import { SnackbarProvider } from "notistack";

import CssBaseline from "@material-ui/core/CssBaseline";
import { ThemeProvider } from "@material-ui/core/styles";
import theme from "./theme";

function App() {
  return (
    <div>
      <ThemeProvider theme={theme}>
        <CssBaseline>
          <SnackbarProvider maxSnack={3}>
            <Provider store={store}>
              <Route
                path="/"
                exact
                render={(props) => <TabbedContainer {...props} />}
              />
            </Provider>
          </SnackbarProvider>
        </CssBaseline>
      </ThemeProvider>
    </div>
  );
}

export default App;
