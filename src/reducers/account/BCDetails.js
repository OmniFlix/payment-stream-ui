import { combineReducers } from 'redux';
import {
    BALANCE_FETCH_ERROR,
    BALANCE_FETCH_IN_PROGRESS,
    BALANCE_FETCH_SUCCESS,
    TX_HASH_FETCH_IN_PROGRESS,
    TX_HASH_FETCH_SUCCESS,
    TX_HASH_IN_PROGRESS_FALSE_SET,
    TX_SIGN_AND_BROAD_CAST_SUCCESS,
} from '../../constants/wallet';

const balance = (state = {
    inProgress: false,
    value: [],
}, action) => {
    switch (action.type) {
    case BALANCE_FETCH_IN_PROGRESS:
        return {
            ...state,
            inProgress: true,
        };
    case BALANCE_FETCH_SUCCESS:
        return {
            inProgress: false,
            value: action.value,
        };
    case BALANCE_FETCH_ERROR:
        return {
            ...state,
            inProgress: false,
        };
    default:
        return state;
    }
};

const txHash = (state = {
    inProgress: false,
    value: {},
}, action) => {
    switch (action.type) {
    case TX_HASH_FETCH_IN_PROGRESS:
    case TX_SIGN_AND_BROAD_CAST_SUCCESS:
        return {
            ...state,
            inProgress: true,
        };
    case TX_HASH_FETCH_SUCCESS:
        return {
            inProgress: false,
            value: action.value,
        };
    case TX_HASH_IN_PROGRESS_FALSE_SET:
        return {
            ...state,
            inProgress: false,
        };
    default:
        return state;
    }
};

export default combineReducers({
    balance,
    txHash,
});
