import axios from "axios";
import * as constants from "../constants";
import * as types from "../action_types";
const { NO_OF_FILES_PER_PAGE } = constants;

export const getDocuments = (pageNum = 0) => {
  return (dispatch) => {
    dispatch(getDocumentsStarted());
    axios
      .get(process.env.REACT_APP_API_BASE_URL + "/list", {
        params: {
          p: pageNum,
          l: NO_OF_FILES_PER_PAGE,
        },
      })
      .then((res) => {
        dispatch(getDocumentsSuccess(res.data));
      })
      .catch((err) => {
        dispatch(getDocumentsFailure(err.message));
      });
  };
};

const getDocumentsStarted = () => ({
  type: types.GET_DOCUMENTS_STARTED,
});

const getDocumentsSuccess = (data) => {
  return {
    type: types.GET_DOCUMENTS_SUCCESS,
    payload: data,
  };
};

const getDocumentsFailure = (error) => ({
  type: types.GET_DOCUMENTS_FAILURE,
  payload: {
    error,
  },
});
