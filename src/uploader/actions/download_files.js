import axios from "axios";
import * as types from "../action_types";

export const downloadFiles = (files) => {
  return (dispatch) => {
    dispatch(downloadDocumentsStarted());
    axios
      .post(
        process.env.REACT_APP_API_BASE_URL + "/download",
        {
          files: files,
        },
        {
          responseType: "blob",
          header: {
            "Content-Type": "multipart/form-data",
          },
        }
      )
      .then((res) => {
        dispatch(downloadDocumentsSuccess(res.data));
      })
      .catch((err) => {
        dispatch(downloadDocumentsFailure(err.message));
      });
  };
};

const downloadDocumentsStarted = () => ({
  type: types.DOWNLOAD_DOCUMENTS_STARTED,
});

const downloadDocumentsSuccess = (data) => {
  return {
    type: types.DOWNLOAD_DOCUMENTS_SUCCESS,
    payload: data,
  };
};

const downloadDocumentsFailure = (error) => ({
  type: types.DOWNLOAD_DOCUMENTS_FAILURE,
  payload: {
    error,
  },
});
