import { createStore, applyMiddleware, compose } from 'redux';
import thunk from 'redux-thunk';
import logger from 'redux-logger';

import rootReducer from './root_reducer';

let middleware = [];

if (process.env.NODE_ENV === 'development') {
    middleware = applyMiddleware(thunk, logger);
} else {
    middleware = applyMiddleware(thunk);
}

const store = createStore(rootReducer, compose(middleware));

export default store;
