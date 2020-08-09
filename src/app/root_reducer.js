import { combineReducers } from "redux";
import { constants, reducers } from "../uploader";

export default combineReducers({
  [constants.NAME]: reducers,
});
