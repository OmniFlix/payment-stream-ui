import { chainConfig, chainId } from './config';
import {
    AccountStore,
    AccountWithCosmos,
    ChainStore,
    getKeplrFromWindow,
    QueriesStore,
    QueriesWithCosmos,
} from '@keplr-wallet/stores';
import { MemoryKVStore } from '@keplr-wallet/common';

export const fetchKeplrAccountName = () => {
    const chainStore = new ChainStore([chainConfig]);
    const queriesStore = new QueriesStore(
        new MemoryKVStore('test_store_web_queries'),
        chainStore,
        getKeplrFromWindow,
        QueriesWithCosmos,
    );

    const accountStore = new AccountStore(
        window,
        AccountWithCosmos,
        chainStore,
        queriesStore,
        {
            defaultOpts: {
                prefetching: false,
                suggestChain: false,
                autoInit: true,
                getKeplr: getKeplrFromWindow,
            },
        },
    );

    return accountStore.getAccount(chainId);
};
