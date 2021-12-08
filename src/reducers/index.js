import { combineReducers } from 'redux';
import language from './language';
import snackbar from './snackbar';
import account from './account';
import streams from './streams';

export default combineReducers({
    account,
    language,
    snackbar,
    streams,
});
