import { combineReducers } from 'redux';
import BCDetails from './BCDetails';
import wallet from './wallet';
import IBCTokens from './IBCTokens';

export default combineReducers({
    wallet,
    bc: BCDetails,
    ibc: IBCTokens,
});
