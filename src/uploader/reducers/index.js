import * as types from "../action_types";
import * as documentReducer from "./documents_reducer";

// Initial state of the application.
const initialState = {
  loading: false,
  documents: [],
  uploads: {},
  error: null,
  lastPage: false,
  uploadDone: false,
};

// action types
const {
  GET_DOCUMENTS_STARTED,
  GET_DOCUMENTS_SUCCESS,
  GET_DOCUMENTS_FAILURE,
  DOWNLOAD_DOCUMENTS_STARTED,
  DOWNLOAD_DOCUMENTS_SUCCESS,
  DOWNLOAD_DOCUMENTS_FAILURE,
  UPLOAD_DOCUMENTS_STARTED,
  UPLOAD_DOCUMENTS_SUCCESS,
  UPLOAD_DOCUMENTS_FAILURE,
} = types;

// Helper function to avoid switch cases and running the reducers
const createReducer = (initState, handlers) => {
  return function reducer(state = initState, action) {
    if (handlers.hasOwnProperty(action.type)) {
      return handlers[action.type](state, action);
    }
    return state;
  };
};

// Global handler for all the asynchronous actions to start loading
const startLoading = (state, action) => {
  return {
    ...state,
    loading: true,
  };
};

// Global handler to report all errors
const reportError = (state, action) => {
  return {
    ...state,
    loading: false,
    error: action.payload.error,
  };
};

// actual mapping the reducers to the respective slice reducers.
export default createReducer(initialState, {
  [GET_DOCUMENTS_STARTED]: startLoading,
  [GET_DOCUMENTS_SUCCESS]: documentReducer.getDocuments,
  [GET_DOCUMENTS_FAILURE]: reportError,
  [DOWNLOAD_DOCUMENTS_STARTED]: startLoading,
  [DOWNLOAD_DOCUMENTS_SUCCESS]: documentReducer.downloadDocuments,
  [DOWNLOAD_DOCUMENTS_FAILURE]: reportError,
  [UPLOAD_DOCUMENTS_STARTED]: documentReducer.uploadDocumentsStarted,
  [UPLOAD_DOCUMENTS_SUCCESS]: documentReducer.uploadDocuments,
  [UPLOAD_DOCUMENTS_FAILURE]: reportError,
});
