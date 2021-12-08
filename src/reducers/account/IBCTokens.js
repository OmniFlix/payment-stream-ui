import {
    AMINO_SIGN_IBC_TX_ERROR,
    AMINO_SIGN_IBC_TX_IN_PROGRESS,
    AMINO_SIGN_IBC_TX_SUCCESS,
    AMOUNT_VALUE_SET,
    CONNECT_IBC_ACCOUNT_ERROR,
    CONNECT_IBC_ACCOUNT_IN_PROGRESS,
    CONNECT_IBC_ACCOUNT_SUCCESS,
    DEPOSIT_DIALOG_HIDE,
    DEPOSIT_DIALOG_SHOW,
    FAUCET_BALANCE_ADD_ERROR,
    FAUCET_BALANCE_ADD_IN_PROGRESS,
    FAUCET_BALANCE_ADD_SUCCESS,
    FAUCET_DIALOG_HIDE,
    FAUCET_DIALOG_SHOW,
    FAUCET_SUCCESS_SET,
    IBC_BALANCE_FETCH_ERROR,
    IBC_BALANCE_FETCH_IN_PROGRESS,
    IBC_BALANCE_FETCH_SUCCESS,
    IBC_BALANCE_LIST_FETCH_ERROR,
    IBC_BALANCE_LIST_FETCH_IN_PROGRESS,
    IBC_BALANCE_LIST_FETCH_SUCCESS,
    TIMEOUT_HEIGHT_FETCH_ERROR,
    TIMEOUT_HEIGHT_FETCH_IN_PROGRESS,
    TIMEOUT_HEIGHT_FETCH_SUCCESS,
    WITHDRAW_DIALOG_HIDE,
    WITHDRAW_DIALOG_SHOW,
} from '../../constants/IBCTokens';
import { combineReducers } from 'redux';
import { DISCONNECT_SET } from '../../constants/wallet';

const depositDialog = (state = {
    open: false,
    value: {},
}, action) => {
    switch (action.type) {
    case DEPOSIT_DIALOG_SHOW:
        return {
            open: true,
            value: action.value,
        };
    case DEPOSIT_DIALOG_HIDE:
        return {
            ...state,
            open: false,
        };
    default:
        return state;
    }
};

const withDrawDialog = (state = {
    open: false,
    value: {},
}, action) => {
    switch (action.type) {
    case WITHDRAW_DIALOG_SHOW:
        return {
            open: true,
            value: action.value,
        };
    case WITHDRAW_DIALOG_HIDE:
        return {
            ...state,
            open: false,
        };
    default:
        return state;
    }
};

const amountValue = (state = 0, action) => {
    switch (action.type) {
    case AMOUNT_VALUE_SET:
        return action.value;
    case DEPOSIT_DIALOG_HIDE:
    case WITHDRAW_DIALOG_HIDE:
        return 0;
    default:
        return state;
    }
};

const connection = (state = {
    inProgress: false,
    address: '',
    signInProgress: false,
}, action) => {
    switch (action.type) {
    case CONNECT_IBC_ACCOUNT_IN_PROGRESS:
        return {
            ...state,
            inProgress: true,
        };
    case CONNECT_IBC_ACCOUNT_SUCCESS:
        return {
            ...state,
            inProgress: false,
            address: action.value && action.value.length &&
                action.value[0] && action.value[0].address,
        };
    case CONNECT_IBC_ACCOUNT_ERROR:
        return {
            ...state,
            inProgress: false,
        };
    case AMINO_SIGN_IBC_TX_IN_PROGRESS:
        return {
            ...state,
            signInProgress: true,
        };
    case AMINO_SIGN_IBC_TX_SUCCESS:
    case AMINO_SIGN_IBC_TX_ERROR:
        return {
            ...state,
            signInProgress: false,
        };
    case DEPOSIT_DIALOG_HIDE:
        return {
            ...state,
            address: '',
        };
    default:
        return state;
    }
};

const balance = (state = {
    inProgress: false,
    value: [],
}, action) => {
    switch (action.type) {
    case IBC_BALANCE_FETCH_IN_PROGRESS:
        return {
            ...state,
            inProgress: true,
        };
    case IBC_BALANCE_FETCH_SUCCESS:
        return {
            inProgress: false,
            value: action.value,
        };
    case IBC_BALANCE_FETCH_ERROR:
        return {
            ...state,
            inProgress: false,
        };
    case DEPOSIT_DIALOG_HIDE:
        return {
            ...state,
            value: [],
        };
    default:
        return state;
    }
};

const timeoutHeight = (state = {
    inProgress: false,
    value: {},
}, action) => {
    switch (action.type) {
    case TIMEOUT_HEIGHT_FETCH_IN_PROGRESS:
        return {
            ...state,
            inProgress: true,
        };
    case TIMEOUT_HEIGHT_FETCH_SUCCESS:
        return {
            inProgress: false,
            value: action.value,
        };
    case TIMEOUT_HEIGHT_FETCH_ERROR:
        return {
            ...state,
            inProgress: false,
        };
    default:
        return state;
    }
};

const faucetDialog = (state = {
    open: false,
    success: false,
    inProgress: false,
}, action) => {
    switch (action.type) {
    case FAUCET_DIALOG_SHOW:
        return {
            ...state,
            open: true,
            success: false,
        };
    case FAUCET_DIALOG_HIDE:
        return {
            ...state,
            open: false,
        };
    case FAUCET_BALANCE_ADD_IN_PROGRESS:
        return {
            ...state,
            inProgress: true,
        };
    case FAUCET_BALANCE_ADD_SUCCESS:
    case FAUCET_BALANCE_ADD_ERROR:
        return {
            ...state,
            inProgress: false,
        };
    case FAUCET_SUCCESS_SET:
        return {
            ...state,
            success: true,
        };
    default:
        return state;
    }
};

const balanceList = (state = {
    inProgress: false,
    value: [],
}, action) => {
    switch (action.type) {
    case IBC_BALANCE_LIST_FETCH_IN_PROGRESS:
        return {
            ...state,
            inProgress: true,
        };
    case IBC_BALANCE_LIST_FETCH_SUCCESS: {
        const array = [...state.value, ...action.value];

        return {
            inProgress: false,
            value: array,
        };
    }
    case IBC_BALANCE_LIST_FETCH_ERROR:
        return {
            ...state,
            inProgress: false,
        };
    case DISCONNECT_SET:
        return {
            ...state,
            value: [],
        };
    default:
        return state;
    }
};

export default combineReducers({
    depositDialog,
    withDrawDialog,
    amountValue,
    connection,
    balance,
    timeoutHeight,
    faucetDialog,
    balanceList,
});
