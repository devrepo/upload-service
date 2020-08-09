import React, { useEffect, useState, useRef } from "react";
import { useSelector, useDispatch } from "react-redux";
import actions from "../../actions";
import { getDocuments } from "../../selectors";
import {
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  IconButton,
  TextField,
  Input,
  Chip,
} from "@material-ui/core";
import PaddedButton from "../common/padded_button";
import { AgGridReact } from "ag-grid-react";
import "ag-grid-community/dist/styles/ag-grid.css";
import "ag-grid-community/dist/styles/ag-theme-material.css";
import FileViewer from "react-file-viewer";
import { fileType } from "../common/file_type";
import NavigateNextRoundedIcon from "@material-ui/icons/NavigateNextRounded";
import NavigateBeforeRoundedIcon from "@material-ui/icons/NavigateBeforeRounded";
import { useSnackbar } from "notistack";

function dateFormatter(params) {
  return new Date(params.value).toLocaleString();
}

function StatusRenderer(props) {
  if (props.value === 1) {
    return <Chip label="Uploaded" color="primary" />;
  } else {
    return <Chip label="Uploading" color="secondary" />;
  }
}

export default function Documents(props) {
  const dispatch = useDispatch();
  const { documents, lastPage, uploadDone } = useSelector((state) =>
    getDocuments(state)
  );
  const [pageNum, setPageNum] = useState(0);
  const [gridApi, setGridApi] = useState();
  const [preview, setPreview] = useState({
    type: "",
    file: "",
    index: 0,
    open: false,
  });
  const [previewUrl, setPreviewUrl] = useState("");
  const [upload, setUpload] = useState(false);
  const { enqueueSnackbar } = useSnackbar();

  const descRef = useRef();
  const filesRef = useRef();
  const nameRef = useRef();
  let dispatchAllowed = true;
  const [colDefs] = useState({
    columnDefs: [
      {
        headerName: "Select",
        checkboxSelection: true,
        width: 100,
      },
      {
        headerName: "File Name",
        field: "filename",
      },
      {
        headerName: "Description",
        field: "description",
      },
      {
        headerName: "Uploaded At",
        field: "uploadedAt",
        valueFormatter: dateFormatter,
        minWidth: 200,
      },
      {
        headerName: "Uploaded By",
        field: "user",
      },
      {
        headerName: "Status",
        field: "status",
        cellRendererFramework: StatusRenderer,
      },
    ],
  });
  const handleClickUpload = () => {
    setUpload(true);
  };
  const handleDownload = () => {
    console.log(gridApi.getSelectedRows());
    const rows = gridApi.getSelectedRows(),
      len = rows.length,
      files = [];
    for (let i = 0; i < len; i++) {
      const { path, filename } = rows[i];
      files.push({ path, name: filename });
    }
    dispatch(actions.downloadFiles(files));
  };
  const handleNavigatePreview = (files, index) => {
    const src = `${process.env.REACT_APP_SERVER_URL}${files[index].path}`;
    setPreview({
      type: fileType(files[index].mimetype),
      file: src,
      index: index,
      open: true,
    });
    setPreviewUrl(src);
  };
  const handlePreview = () => {
    const files = gridApi.getSelectedRows();
    console.log("File", files, preview);
    if (files.length === 0) {
      return enqueueSnackbar("Please select files to preview.", {
        variant: "error",
      });
    }
    handleNavigatePreview(files, 0);
  };
  const handleNextPreview = () => {
    const files = gridApi.getSelectedRows();
    let index = preview.index;
    if (index < files.length - 1) {
      index++;
    }
    handleNavigatePreview(files, index);
  };
  const handlePreviousPreview = () => {
    const files = gridApi.getSelectedRows();
    let index = preview.index;
    if (index > 0) {
      index--;
    }
    handleNavigatePreview(files, index);
  };
  const handleNextDocuments = () => {
    if (gridApi) gridApi.showLoadingOverlay();
    setPageNum(pageNum + 1);
  };
  const handlePreviousDocuments = () => {
    if (gridApi) gridApi.showLoadingOverlay();
    setPageNum(pageNum - 1);
  };
  const handleClose = () => {
    setPreview(false);
  };
  const handleUploadDialogClose = () => {
    setUpload(false);
  };
  const handleUploadFiles = () => {
    const formData = new FormData();
    const files = filesRef.current.files;
    const desc = descRef.current.value;
    console.log(files, desc);
    let filesSize = 0,
      fileSizeExceed;
    for (var i = 0; i < files.length; i++) {
      const file = files.item(i);
      console.log("File", file);
      if (file.size > 200000000) {
        fileSizeExceed = file;
      } else {
        filesSize += file.size;
      }
      formData.append("file" + i, file, file.name);
    }
    if (fileSizeExceed) {
      return enqueueSnackbar("Each file should be of less than 200MB.", {
        variant: "error",
      });
    }
    if (filesSize > 2000000000) {
      return enqueueSnackbar("Total size can not be more than 5GB.", {
        variant: "error",
      });
    }
    formData.append("description", desc);
    formData.append("user", nameRef.current.value);
    dispatch(actions.uploadDocuments(formData));
    setUpload(false);
    enqueueSnackbar("Upload started");
  };
  const onGridReady = (params) => {
    setGridApi(params.api);
    params.api.sizeColumnsToFit();
  };
  const onModelUpdated = () => {
    if (!gridApi) return;
    gridApi.hideOverlay();
    gridApi.sizeColumnsToFit();
  };
  const onError = (e) => {
    console.log("Error", e);
  };
  useEffect(() => {
    dispatch(actions.getDocuments(pageNum));
  }, [dispatch, uploadDone, pageNum]);
  return (
    <Box p={2}>
      <Box pb={2} justifyContent="flex-end" flexDirection="row" display="flex">
        <PaddedButton
          color="primary"
          variant="contained"
          onClick={handlePreview}
        >
          Preview
        </PaddedButton>
        <PaddedButton
          color="secondary"
          variant="contained"
          onClick={handleDownload}
        >
          Download
        </PaddedButton>
      </Box>
      <Box pb={2} flexDirection="row" display="flex">
        <div
          className="ag-theme-material"
          style={{
            height: "437px",
            width: "100%",
          }}
        >
          <AgGridReact
            rowSelection="multiple"
            rowMultiSelectWithClick="true"
            onGridReady={onGridReady}
            onModelUpdated={onModelUpdated}
            gridOptions={{
              columnDefs: colDefs.columnDefs,
              rowHeight: 76,
              overlayLoadingTemplate:
                '<span class="ag-overlay-loading-center">Please wait while your rows are loading</span>',
            }}
            rowData={documents}
          ></AgGridReact>
        </div>
      </Box>
      <Box
        pt={2}
        justifyContent="flex-end"
        alignContent="center"
        flexDirection="row"
        display="flex"
      >
        <Box m={2}>
          <IconButton
            color="primary"
            aria-label="previous page"
            component="span"
            disabled={pageNum === 0}
            onClick={handlePreviousDocuments}
          >
            <NavigateBeforeRoundedIcon />
          </IconButton>
        </Box>
        <Box m={2}>
          <IconButton
            color="primary"
            aria-label="next page"
            component="span"
            disabled={lastPage}
            onClick={handleNextDocuments}
          >
            <NavigateNextRoundedIcon />
          </IconButton>
        </Box>
        <Box m={2}>
          <Button
            color="primary"
            variant="contained"
            onClick={handleClickUpload}
          >
            Upload
          </Button>
        </Box>
      </Box>
      <Dialog
        fullWidth={true}
        maxWidth="md"
        open={preview.open}
        onClose={handleClose}
        aria-labelledby="max-width-dialog-title"
      >
        <DialogTitle id="max-width-dialog-title">Preview</DialogTitle>
        <DialogContent>
          <Box>
            <FileViewer
              fileType={preview.type}
              filePath={previewUrl}
              onError={onError}
            />
          </Box>
        </DialogContent>
        <DialogActions>
          <Box justifyContent="center" flexDirection="row" display="flex">
            <IconButton
              color="primary"
              aria-label="preview previous file"
              component="span"
              onClick={handlePreviousPreview}
            >
              <NavigateBeforeRoundedIcon />
            </IconButton>
            <IconButton
              color="primary"
              aria-label="preview next file"
              component="span"
              onClick={handleNextPreview}
            >
              <NavigateNextRoundedIcon />
            </IconButton>
          </Box>
        </DialogActions>
      </Dialog>
      {/* Upload Dialog */}
      <Dialog
        fullWidth={true}
        maxWidth="md"
        open={upload}
        onClose={handleUploadDialogClose}
        aria-labelledby="max-width-dialog-title"
      >
        <DialogTitle id="max-width-dialog-title">Upload</DialogTitle>
        <DialogContent>
          <Box
            justifyContent="space-between"
            flexDirection="column"
            display="flex"
          >
            <TextField
              autoFocus
              margin="dense"
              id="description"
              label="Description"
              type="text"
              fullWidth
              required={true}
              inputRef={descRef}
            />
            <br />
            <TextField
              autoFocus
              margin="dense"
              id="username"
              label="Your name"
              type="text"
              fullWidth
              required={true}
              inputRef={nameRef}
            />
            <br />
            <div>
              Only DOCX, XLSX, XLSM and PDFs are allowed. Individual file should
              not be more than 200MB and combined together should not exceed
              5GB.
            </div>
            <br />
            <Input
              type="file"
              id="files"
              name="files"
              label="Select Files"
              fullWidth={true}
              required={true}
              inputProps={{ multiple: true, accept: ".docx,.xlsx,.xlsm,.pdf" }}
              inputRef={filesRef}
            />
          </Box>
        </DialogContent>
        <DialogActions>
          <Box justifyContent="center" flexDirection="row" display="flex">
            <PaddedButton
              color="secondary"
              variant="outlined"
              onClick={handleUploadDialogClose}
            >
              Cancel
            </PaddedButton>
            <PaddedButton
              color="primary"
              variant="contained"
              onClick={handleUploadFiles}
            >
              Upload
            </PaddedButton>
          </Box>
        </DialogActions>
      </Dialog>
    </Box>
  );
}
