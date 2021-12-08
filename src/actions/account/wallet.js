import {
    AMINO_SIGN_ERROR,
    AMINO_SIGN_IN_PROGRESS,
    AMINO_SIGN_SUCCESS,
    CONNECT_KEPLR_ACCOUNT_ERROR,
    CONNECT_KEPLR_ACCOUNT_IN_PROGRESS,
    CONNECT_KEPLR_ACCOUNT_SUCCESS,
    DISCONNECT_SET,
    TX_HASH_FETCH_ERROR,
    TX_HASH_FETCH_IN_PROGRESS,
    TX_HASH_FETCH_SUCCESS,
    TX_HASH_IN_PROGRESS_FALSE_SET,
    TX_SIGN_AND_BROAD_CAST_ERROR,
    TX_SIGN_AND_BROAD_CAST_IN_PROGRESS,
    TX_SIGN_AND_BROAD_CAST_SUCCESS,
    USER_NAME_SET,
} from '../../constants/wallet';
import { chainConfig, chainId, config } from '../../config';
import { SigningStargateClient } from '@cosmjs/stargate';
import { makeSignDoc } from '@cosmjs/amino';
import Axios from 'axios';

const connectKeplrAccountInProgress = () => {
    return {
        type: CONNECT_KEPLR_ACCOUNT_IN_PROGRESS,
    };
};

const connectKeplrAccountSuccess = (value) => {
    return {
        type: CONNECT_KEPLR_ACCOUNT_SUCCESS,
        value,
    };
};

const connectKeplrAccountError = (message) => {
    return {
        type: CONNECT_KEPLR_ACCOUNT_ERROR,
        message,
    };
};

export const initializeChain = (cb) => (dispatch) => {
    dispatch(connectKeplrAccountInProgress());
    (async () => {
        if (!window.getOfflineSigner || !window.keplr) {
            const error = 'Please install keplr extension';
            dispatch(connectKeplrAccountError(error));
        } else {
            if (window.keplr.experimentalSuggestChain) {
                try {
                    await window.keplr.experimentalSuggestChain(chainConfig);
                } catch (error) {
                    const chainError = 'Failed to suggest the chain';
                    dispatch(connectKeplrAccountError(chainError));
                }
            } else {
                const versionError = 'Please use the recent version of keplr extension';
                dispatch(connectKeplrAccountError(versionError));
            }
        }

        if (window.keplr) {
            window.keplr.enable(chainId)
                .then(async () => {
                    const offlineSigner = window.getOfflineSigner(chainId);
                    const accounts = await offlineSigner.getAccounts();
                    dispatch(connectKeplrAccountSuccess(accounts));
                    cb(accounts);
                }).catch((error) => {
                    dispatch(connectKeplrAccountError(error.toString()));
                });
        } else {
            return null;
        }
    })();
};

const aminoSignInProgress = () => {
    return {
        type: AMINO_SIGN_IN_PROGRESS,
    };
};

const aminoSignSuccess = (value) => {
    return {
        type: AMINO_SIGN_SUCCESS,
        value,
    };
};

const aminoSignError = (message) => {
    return {
        type: AMINO_SIGN_ERROR,
        message,
    };
};

export const aminoSignTx = (tx, address, cb) => (dispatch) => {
    dispatch(aminoSignInProgress());
    (async () => {
        await window.keplr && window.keplr.enable(config.CHAIN_ID);
        const offlineSigner = window.getOfflineSigner && window.getOfflineSigner(config.CHAIN_ID);

        try {
            const client = await SigningStargateClient.connectWithSigner(
                config.RPC_URL,
                offlineSigner,
            );

            const account = {};
            try {
                const {
                    accountNumber,
                    sequence,
                } = await client.getSequence(address);
                account.accountNumber = accountNumber;
                account.sequence = sequence;
            } catch (e) {
                account.accountNumber = 0;
                account.sequence = 0;
            }

            const signDoc = makeSignDoc(
                tx.msgs ? tx.msgs : [tx.msg],
                tx.fee,
                config.CHAIN_ID,
                tx.memo,
                account.accountNumber,
                account.sequence,
            );

            offlineSigner.signAmino(address, signDoc).then((result) => {
                if (result && result.code !== undefined && result.code !== 0) {
                    dispatch(aminoSignError(result.log || result.rawLog));
                } else {
                    dispatch(aminoSignSuccess(result));
                    cb(result);
                }
            }).catch((error) => {
                dispatch(aminoSignError(error && error.message));
            });
        } catch (e) {
            dispatch(aminoSignError(e && e.message));
        }
    })();
};

const txSignAndBroadCastInProgress = () => {
    return {
        type: TX_SIGN_AND_BROAD_CAST_IN_PROGRESS,
    };
};

const txSignAndBroadCastSuccess = (value) => {
    return {
        type: TX_SIGN_AND_BROAD_CAST_SUCCESS,
        value,
    };
};

const txSignAndBroadCastError = (message) => {
    return {
        type: TX_SIGN_AND_BROAD_CAST_ERROR,
        message,
    };
};

export const txSignAndBroadCast = (data, cb) => (dispatch) => {
    dispatch(txSignAndBroadCastInProgress());

    const url = config.REST_URL + '/txs';
    Axios.post(url, data, {
        headers: {
            Accept: 'application/json, text/plain, */*',
            Connection: 'keep-alive',
        },
    })
        .then((res) => {
            if (res.data && res.data.code !== undefined && res.data.code !== 0) {
                dispatch(txSignAndBroadCastError(res.data.logs || res.data.raw_log));
                cb(null);
            } else {
                dispatch(txSignAndBroadCastSuccess(res.data));
                cb(res.data);
            }
        })
        .catch((error) => {
            dispatch(txSignAndBroadCastError(
                error.response &&
                error.response.data &&
                error.response.data.message
                    ? error.response.data.message
                    : 'Failed!',
            ));
            cb(null);
        });
};

const fetchTxHashInProgress = () => {
    return {
        type: TX_HASH_FETCH_IN_PROGRESS,
    };
};

const fetchTxHashSuccess = (message) => {
    return {
        type: TX_HASH_FETCH_SUCCESS,
        message,
    };
};

const fetchTxHashError = (message) => {
    return {
        type: TX_HASH_FETCH_ERROR,
        message,
    };
};

export const fetchTxHash = (hash, cb) => (dispatch) => {
    dispatch(fetchTxHashInProgress());

    const url = config.REST_URL + '/txs/' + hash;
    Axios.get(url, {
        headers: {
            Accept: 'application/json, text/plain, */*',
            Connection: 'keep-alive',
        },
    })
        .then((res) => {
            if (res.data && res.data.code !== undefined && res.data.code !== 0) {
                dispatch(fetchTxHashError(res.data.logs || res.data.raw_log));
                cb(res.data);
            } else {
                dispatch(fetchTxHashSuccess('success'));
                cb(res.data);
            }
        })
        .catch((error) => {
            dispatch(fetchTxHashError(
                error.response &&
                error.response.data &&
                error.response.data.message
                    ? error.response.data.message
                    : error.response &&
                    error.response.data &&
                    error.response.data.error
                        ? error.response.data.error
                        : 'Failed!',
            ));
            cb(null);
        });
};

export const setTxHashInProgressFalse = () => {
    return {
        type: TX_HASH_IN_PROGRESS_FALSE_SET,
    };
};

export const setDisconnect = () => {
    return {
        type: DISCONNECT_SET,
    };
};

export const setUserName = (value) => {
    return {
        type: USER_NAME_SET,
        value,
    };
};
