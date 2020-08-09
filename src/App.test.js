import React from "react";
import {
  render,
  cleanup,
  fireEvent,
  waitForElement,
  act,
} from "@testing-library/react";
import App from "./app/app";
import { BrowserRouter, MemoryRouter } from "react-router-dom";
import axios from "axios";
import store from "./app/store";
import moxios from "moxios";
import "./index.scss";
import { list } from "./mock_data/list";

const renderComponent = () => {
  const comp = render(
    <BrowserRouter>
      <App />
    </BrowserRouter>
  );
  return comp;
};

describe("Tests document tab", function () {
  beforeEach(function () {
    moxios.install();
  });
  afterEach(function () {
    moxios.uninstall();
  });
  afterEach(cleanup);

  test("Renders document tab", () => {
    const { getByText } = renderComponent();
    const documentsTab = getByText(/Documents/i);
    const othersTab = getByText(/OTHER TAB/i);
    expect(documentsTab).toBeInTheDocument();
    expect(othersTab).toBeInTheDocument();
  });

  test("Next Page", async () => {
    const { getByLabelText, getByText } = renderComponent();

    const nextPageButton = getByLabelText(/next page/i);

    //Go to next page
    await act(async () => {
      fireEvent.click(nextPageButton);
    });

    moxios.stubRequest(/api\/list.*/, {
      status: 200,
      response: list,
    });
    moxios.wait(function () {
      const recordOnPage = getByText("test1.pdf");
      expect(recordOnPage).toBeInTheDocument();
    });
  });
});
