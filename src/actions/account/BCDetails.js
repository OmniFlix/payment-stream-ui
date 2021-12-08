import { BALANCE_FETCH_ERROR, BALANCE_FETCH_IN_PROGRESS, BALANCE_FETCH_SUCCESS } from '../../constants/wallet';
import Axios from 'axios';
import { urlFetchBalance } from '../../constants/restURL';

const fetchBalanceInProgress = () => {
    return {
        type: BALANCE_FETCH_IN_PROGRESS,
    };
};

const fetchBalanceSuccess = (value) => {
    return {
        type: BALANCE_FETCH_SUCCESS,
        value,
    };
};

const fetchBalanceError = (message) => {
    return {
        type: BALANCE_FETCH_ERROR,
        message,
    };
};

export const fetchBalance = (address) => (dispatch) => {
    dispatch(fetchBalanceInProgress());

    const url = urlFetchBalance(address);
    Axios.get(url, {
        headers: {
            Accept: 'application/json, text/plain, */*',
            Connection: 'keep-alive',
        },
    })
        .then((res) => {
            dispatch(fetchBalanceSuccess(res.data && res.data.result));
        })
        .catch((error) => {
            dispatch(fetchBalanceError(
                error.response &&
                error.response.data &&
                error.response.data.message
                    ? error.response.data.message
                    : 'Failed!',
            ));
        });
};
