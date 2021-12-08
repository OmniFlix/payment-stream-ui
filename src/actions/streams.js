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
import Axios from 'axios';
import { urlFetchIncomingStreams, urlFetchOutgoingStreams } from '../constants/restURL';

export const setStreamsTab = (value) => {
    return {
        type: STREAMS_TAB_SET,
        value,
    };
};

export const setToAddress = (value) => {
    return {
        type: TO_ADDRESS_SET,
        value,
    };
};

export const setTypeTab = (value) => {
    return {
        type: TYPE_TAB_SET,
        value,
    };
};

export const setAmount = (value) => {
    return {
        type: AMOUNT_SET,
        value,
    };
};

export const setToken = (value) => {
    return {
        type: TOKEN_SET,
        value,
    };
};

export const setEndDate = (value) => {
    return {
        type: END_DATE_SET,
        value,
    };
};

const fetchOutgoingStreamsInProgress = () => {
    return {
        type: OUTGOING_STREAMS_FETCH_IN_PROGRESS,
    };
};

const fetchOutgoingStreamsSuccess = (value) => {
    return {
        type: OUTGOING_STREAMS_FETCH_SUCCESS,
        value,
    };
};

const fetchOutgoingStreamsError = (message) => {
    return {
        type: OUTGOING_STREAMS_FETCH_ERROR,
        message,
    };
};

export const fetchOutgoingStreams = (address) => (dispatch) => {
    dispatch(fetchOutgoingStreamsInProgress());

    const url = urlFetchOutgoingStreams(address);
    Axios.get(url, {
        headers: {
            Accept: 'application/json, text/plain, */*',
            Connection: 'keep-alive',
        },
    })
        .then((res) => {
            dispatch(fetchOutgoingStreamsSuccess(res && res.data && res.data.payment_streams));
        })
        .catch((error) => {
            dispatch(fetchOutgoingStreamsError(
                error.response &&
                error.response.data &&
                error.response.data.message &&
                error.response.data.message.message
                    ? error.response.data.message.message
                    : error.response.data.message
                        ? error.response.data.message
                        : 'Failed!',
            ));
        });
};

const fetchIncomingStreamsInProgress = () => {
    return {
        type: INCOMING_STREAMS_FETCH_IN_PROGRESS,
    };
};

const fetchIncomingStreamsSuccess = (value) => {
    return {
        type: INCOMING_STREAMS_FETCH_SUCCESS,
        value,
    };
};

const fetchIncomingStreamsError = (message) => {
    return {
        type: INCOMING_STREAMS_FETCH_ERROR,
        message,
    };
};

export const fetchIncomingStreams = (address) => (dispatch) => {
    dispatch(fetchIncomingStreamsInProgress());

    const url = urlFetchIncomingStreams(address);
    Axios.get(url, {
        headers: {
            Accept: 'application/json, text/plain, */*',
            Connection: 'keep-alive',
        },
    })
        .then((res) => {
            dispatch(fetchIncomingStreamsSuccess(res && res.data && res.data.payment_streams));
        })
        .catch((error) => {
            dispatch(fetchIncomingStreamsError(
                error.response &&
                error.response.data &&
                error.response.data.message &&
                error.response.data.message.message
                    ? error.response.data.message.message
                    : error.response.data.message
                        ? error.response.data.message
                        : 'Failed!',
            ));
        });
};
