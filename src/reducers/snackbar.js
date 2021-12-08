import { MESSAGE_SHOW, SNACKBAR_HIDE } from '../constants/snackbar';
import {
    AMINO_SIGN_IBC_TX_ERROR,
    AMINO_SIGN_IBC_TX_SUCCESS,
    CONNECT_IBC_ACCOUNT_ERROR,
    FAUCET_BALANCE_ADD_ERROR,
    IBC_BALANCE_FETCH_ERROR,
    TIMEOUT_HEIGHT_FETCH_ERROR,
} from '../constants/IBCTokens';
import { CONNECT_KEPLR_ACCOUNT_ERROR, TX_HASH_FETCH_SUCCESS, TX_SIGN_AND_BROAD_CAST_ERROR } from '../constants/wallet';

const snackbar = (state = {
    open: false,
    message: '',
}, action) => {
    switch (action.type) {
    case CONNECT_KEPLR_ACCOUNT_ERROR:// BC Account
    case TX_SIGN_AND_BROAD_CAST_ERROR:
    case TX_HASH_FETCH_SUCCESS:
    case FAUCET_BALANCE_ADD_ERROR:
    case CONNECT_IBC_ACCOUNT_ERROR:// IBC Account
    case IBC_BALANCE_FETCH_ERROR:
    case AMINO_SIGN_IBC_TX_SUCCESS:
    case AMINO_SIGN_IBC_TX_ERROR:
    case TIMEOUT_HEIGHT_FETCH_ERROR:
    case MESSAGE_SHOW:
        return {
            open: true,
            message: action.message,
        };
    case SNACKBAR_HIDE:
        return {
            open: false,
            message: '',
        };
    default:
        return state;
    }
};

export default snackbar;
