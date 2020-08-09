import axios from "axios";
import * as types from "../action_types";
export const uploadDocuments = (formData) => {
  return (dispatch) => {
    dispatch(uploadDocumentsStarted());
    axios
      .post(process.env.REACT_APP_API_BASE_URL + "/upload", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      })
      .then((res) => {
        if (res.data.success) {
          dispatch(uploadDocumentsSuccess());
        }
      })
      .catch((err) => {
        dispatch(uploadDocumentsFailure(err.message));
      });
  };
};

const uploadDocumentsStarted = () => ({
  type: types.UPLOAD_DOCUMENTS_STARTED,
});

const uploadDocumentsFailure = (error) => ({
  type: types.UPLOAD_DOCUMENTS_FAILURE,
  payload: {
    error,
  },
});

const uploadDocumentsSuccess = () => ({
  type: types.UPLOAD_DOCUMENTS_SUCCESS,
});
