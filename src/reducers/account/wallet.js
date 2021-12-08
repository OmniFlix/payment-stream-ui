import { combineReducers } from 'redux';
import {
    AMINO_SIGN_ERROR,
    AMINO_SIGN_IN_PROGRESS,
    AMINO_SIGN_SUCCESS,
    CONNECT_KEPLR_ACCOUNT_ERROR,
    CONNECT_KEPLR_ACCOUNT_IN_PROGRESS,
    CONNECT_KEPLR_ACCOUNT_SUCCESS,
    DISCONNECT_SET,
    TX_SIGN_AND_BROAD_CAST_ERROR,
    TX_SIGN_AND_BROAD_CAST_IN_PROGRESS,
    TX_SIGN_AND_BROAD_CAST_SUCCESS,
} from '../../constants/wallet';

const connection = (state = {
    inProgress: false,
    address: '',
}, action) => {
    switch (action.type) {
    case CONNECT_KEPLR_ACCOUNT_IN_PROGRESS:
        return {
            ...state,
            inProgress: true,
        };
    case CONNECT_KEPLR_ACCOUNT_SUCCESS:
        return {
            inProgress: false,
            address: action.value && action.value.length &&
                action.value[0] && action.value[0].address,
        };
    case CONNECT_KEPLR_ACCOUNT_ERROR:
    case AMINO_SIGN_SUCCESS:
        return {
            ...state,
            inProgress: false,
        };
    case DISCONNECT_SET:
        return {
            ...state,
            address: '',
        };
    default:
        return state;
    }
};

const aminoSign = (state = {
    inProgress: false,
    value: {},
}, action) => {
    switch (action.type) {
    case AMINO_SIGN_IN_PROGRESS:
        return {
            ...state,
            inProgress: true,
        };
    case AMINO_SIGN_SUCCESS:
        return {
            inProgress: false,
            value: action.value,
        };
    case AMINO_SIGN_ERROR:
        return {
            ...state,
            inProgress: false,
        };
    default:
        return state;
    }
};

const broadCast = (state = {
    inProgress: false,
    value: {},
}, action) => {
    switch (action.type) {
    case TX_SIGN_AND_BROAD_CAST_IN_PROGRESS:
        return {
            ...state,
            inProgress: true,
        };
    case TX_SIGN_AND_BROAD_CAST_SUCCESS:
        return {
            inProgress: false,
            value: action.value,
        };
    case TX_SIGN_AND_BROAD_CAST_ERROR:
        return {
            ...state,
            inProgress: false,
        };
    default:
        return state;
    }
};

export default combineReducers({
    broadCast,
    aminoSign,
    connection,
});
