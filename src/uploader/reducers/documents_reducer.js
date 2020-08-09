export const getDocuments = (state, action) => {
  const { data, lastPage } = action.payload;
  const newState = {
    ...state,
    loading: false,
    documents: data,
    error: null,
    lastPage: lastPage,
  };
  return newState;
};

export const downloadDocuments = (state, action) => {
  const blob = new Blob([action.payload.data], {
    type: "application/zip",
  });
  const link = document.createElement("a");
  link.href = window.URL.createObjectURL(blob);
  link.download = "download.zip";
  document.body.appendChild(link);
  link.click();
  return state;
};

export const uploadDocumentsStarted = (state, action) => {
  return {
    ...state,
    loading: true,
    uploadDone: false,
  };
};

export const uploadDocuments = (state, action) => {
  return {
    ...state,
    uploadDone: true,
  };
};
