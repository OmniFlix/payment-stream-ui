import { combineReducers } from 'redux';
import {
    AMOUNT_SET,
    END_DATE_SET,
    INCOMING_STREAMS_FETCH_ERROR,
    INCOMING_STREAMS_FETCH_IN_PROGRESS,
    INCOMING_STREAMS_FETCH_SUCCESS,
    OUTGOING_STREAMS_FETCH_ERROR,
    OUTGOING_STREAMS_FETCH_IN_PROGRESS,
    OUTGOING_STREAMS_FETCH_SUCCESS,
    STREAMS_TAB_SET,
    TO_ADDRESS_SET,
    TOKEN_SET,
    TYPE_TAB_SET,
} from '../constants/streams';
import { TX_HASH_FETCH_SUCCESS } from '../constants/wallet';

const streamsTab = (state = 'outgoing', action) => {
    if (action.type === STREAMS_TAB_SET) {
        return action.value;
    }

    return state;
};

const toAddress = (state = '', action) => {
    switch (action.type) {
    case TO_ADDRESS_SET:
        return action.value;
    case TX_HASH_FETCH_SUCCESS:
        return '';
    default:
        return state;
    }
};

const typeTab = (state = '', action) => {
    if (action.type === TYPE_TAB_SET) {
        return action.value;
    }

    return state;
};

const amount = (state = '', action) => {
    switch (action.type) {
    case AMOUNT_SET:
        return action.value;
    case TX_HASH_FETCH_SUCCESS:
        return '';
    default:
        return state;
    }
};

const token = (state = '', action) => {
    switch (action.type) {
    case TOKEN_SET:
        return action.value;
    case TX_HASH_FETCH_SUCCESS:
        return '';
    default:
        return state;
    }
};

const endDate = (state = null, action) => {
    switch (action.type) {
    case END_DATE_SET:
        return action.value;
    case TX_HASH_FETCH_SUCCESS:
        return null;
    default:
        return state;
    }
};

const outgoing = (state = {
    inProgress: false,
    value: [],
}, action) => {
    switch (action.type) {
    case OUTGOING_STREAMS_FETCH_IN_PROGRESS:
        return {
            ...state,
            inProgress: true,
        };
    case OUTGOING_STREAMS_FETCH_SUCCESS:
        return {
            ...state,
            inProgress: false,
            value: action.value,
        };
    case OUTGOING_STREAMS_FETCH_ERROR:
        return {
            ...state,
            inProgress: false,
        };
    default:
        return state;
    }
};

const incoming = (state = {
    inProgress: false,
    value: [],
}, action) => {
    switch (action.type) {
    case INCOMING_STREAMS_FETCH_IN_PROGRESS:
        return {
            ...state,
            inProgress: true,
        };
    case INCOMING_STREAMS_FETCH_SUCCESS:
        return {
            ...state,
            inProgress: false,
            value: action.value,
        };
    case INCOMING_STREAMS_FETCH_ERROR:
        return {
            ...state,
            inProgress: false,
        };
    default:
        return state;
    }
};

export default combineReducers({
    streamsTab,
    toAddress,
    typeTab,
    amount,
    token,
    endDate,
    outgoing,
    incoming,
});
