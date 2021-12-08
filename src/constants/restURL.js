import { config } from '../config';

const URL = config.REST_URL;

export const urlFetchBalance = (address) => `${URL}/bank/balances/${address}`;
export const urlFetchIBCBalance = (url, address) => `${url}/bank/balances/${address}`;
export const urlAddFaucet = (chain) => `${config.FAUCET_URL}/${chain}/claim`;

export const urlFetchOutgoingStreams = (address) => `${URL}/payment-out-streams/${address}`;
export const urlFetchIncomingStreams = (address) => `${URL}/payment-in-streams/${address}`;

export const urlFetchTimeoutHeight = (url, channel) => {
    return `${url}/ibc/core/channel/v1/channels/${channel}/ports/transfer`;
};
