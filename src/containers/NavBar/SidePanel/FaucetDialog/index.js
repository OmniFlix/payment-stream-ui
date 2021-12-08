import React, { useState } from 'react';
import './index.css';
import { Button, Dialog, DialogContent } from '@material-ui/core';
import variables from '../../../../utils/variables';
import flixToken from '../../../../assets/faucet/flix.svg';
import junoLogo from '../../../../assets/tokens/juno.svg';
import spayLogo from '../../../../assets/faucet/spay.svg';
import { config } from '../../../../config';
import DotsLoading from '../../../../components/DotsLoading';
import * as PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { fetchBalance } from '../../../../actions/account/BCDetails';
import {
    addFaucetBalance,
    connectIBCAccount,
    fetchIBCBalance,
    hideFaucetDialog,
    setFaucetSuccess,
} from '../../../../actions/account/IBCTokens';

const FaucetDialog = (props) => {
    const [name, setName] = useState(null);
    const [address, setAddress] = useState(null);

    const claimTokens = (value) => {
        setName(value.name);
        if (value.name === 'SPAY') {
            const data = {
                address: props.address,
            };

            props.addFaucetBalance(value.chain, data, (error) => {
                if (!error) {
                    props.fetchBalance(props.address);
                    props.setFaucetSuccess();
                }
            });

            return;
        }

        const config = {
            RPC_URL: value && value.network && value.network.rpc_address,
            REST_URL: value && value.network && value.network.api_address,
            CHAIN_ID: value && value.network && value.network.chain_id,
            CHAIN_NAME: value && value.network && value.network.name,
            COIN_DENOM: value && value.network && value.network.display_denom,
            COIN_MINIMAL_DENOM: value && value.network && value.network.denom,
            COIN_DECIMALS: value && value.network && value.network.decimals,
            PREFIX: value && value.network && value.network.address_prefix,
        };

        initKeplr(config, value);
    };

    const initKeplr = (config, value) => {
        props.connectIBCAccount(config, (address) => {
            setAddress(address[0].address);
            const data = {
                address: address[0].address,
            };

            props.addFaucetBalance(value.chain, data, (error) => {
                if (!error) {
                    props.fetchIBCBalance(config.REST_URL, address[0].address);
                    props.setFaucetSuccess();
                }
            });
        });
    };

    const list = [{
        name: 'SPAY',
        chain_id: 'streampay-1',
        chain: 'streampay-testnet',
        icon: spayLogo,
        denom: 'uspay',
    }, {
        name: 'FLIX',
        chain_id: 'omniflix-devnet-2',
        chain: 'omniflix-devnet',
        icon: flixToken,
        denom: 'ibc/F1128F791BB70F817B21847B8FBC3FF965A1ADC86FE65D5EA43B52A490703179',
        network: {
            address_prefix: 'omniflix',
            api_address: 'https://api.devnet.omniflix.network',
            chain_id: 'omniflix-devnet-2',
            decimals: 6,
            denom: 'uflix',
            display_denom: 'FLIX',
            name: 'OmniFlix Hub Devnet',
            rpc_address: 'https://rpc.devnet.omniflix.network',
        },
    }, {
        name: 'JUNOX',
        chain_id: 'uni',
        chain: 'juno-uni-testnet',
        icon: junoLogo,
        denom: 'ibc/8E2FEFCBD754FA3C97411F0126B9EC76191BAA1B3959CB73CECF396A4037BBF0',
        network: {
            address_prefix: 'juno',
            api_address: 'https://api.uni.kingnodes.com',
            chain_id: 'uni',
            decimals: 6,
            denom: 'ujunox',
            display_denom: 'JUNOX',
            name: 'Juno uni Testnet',
            rpc_address: 'https://rpc.uni.kingnodes.com',
        },
    }];

    const inProgress = props.inProgress;
    const selected = name && list.find((val) => val.name === name);
    const addressDisplay = address || props.address;

    return (
        <Dialog
            aria-describedby="verify-twitter-dialog-description"
            aria-labelledby="verify-twitter-dialog-title"
            className="dialog faucet_dialog"
            open={props.open}
            onClose={props.handleClose}>
            {props.success
                ? <DialogContent
                    className="faucet_dialog_content claimed_dialog">
                    <div className="claimed_tokens">
                        <span>{variables[props.lang].congrats}</span>
                        <div className="tokens_list">
                            <div className="token_details">
                                <div className="token_left">
                                    <img alt="icon" src={selected.icon}/>
                                    <div className="token_name">
                                        <span>{variables[props.lang].chain}{' : '}{selected && selected.chain_id}</span>
                                        <div className="stream_value hash_text" title={addressDisplay}>
                                            <p className="name">{addressDisplay}</p>
                                            {addressDisplay && addressDisplay.slice(addressDisplay.length - 6, addressDisplay.length)}
                                        </div>
                                    </div>
                                </div>
                                <Button disabled className="claimed_button">
                                    {variables[props.lang].claimed +
                                    (name === 'JUNOX' ? ' 10 ' : ' 100 ') + name}
                                </Button>
                            </div>
                        </div>
                        {name === 'SPAY'
                            ? <span>{variables[props.lang]['stream_msg']}</span>
                            : name
                                ? <span>{variables[props.lang]['deposit_msg_1'] + name + variables[props.lang]['deposit_msg_2']}</span>
                                : <span>{variables[props.lang].claimed_tokens}</span>}
                    </div>
                </DialogContent>
                : <DialogContent
                    className="faucet_dialog_content">
                    <h2> {variables[props.lang].faucet}</h2>
                    <div className="tokens_list">
                        {list && list.length &&
                        list.map((item, index) => {
                            let denom = item.denom;
                            let balance = null;

                            if (item.name !== 'SPAY') {
                                denom = item && item.network && item.network.denom;
                                balance = props.balanceList && props.balanceList.length && props.balanceList.find((val) => val.denom === denom);
                                balance = balance && balance.amount && balance.amount / (10 ** config.COIN_DECIMALS);
                            } else {
                                balance = props.balance && props.balance.length && props.balance.find((val) => val.denom === denom);
                                balance = balance && balance.amount && balance.amount / (10 ** config.COIN_DECIMALS);
                            }

                            return (
                                <div
                                    key={index}
                                    className="token_details">
                                    <div className="token_left">
                                        <img alt="icon" src={item.icon}/>
                                        <div className="token_name">
                                            <span>{item && item.name}</span>
                                            <span>{variables[props.lang].chain}{' : '}{item && item.chain_id}</span>
                                        </div>
                                    </div>
                                    {props.balanceListInProgress
                                        ? <DotsLoading/>
                                        : balance && balance > 0
                                            ? <Button disabled className="claimed_button">
                                                {variables[props.lang].claimed}
                                            </Button>
                                            : <Button
                                                disabled={(name === item.name) && inProgress}
                                                onClick={() => claimTokens(item)}>
                                                {(name === item.name) && inProgress
                                                    ? variables[props.lang].processing + '...'
                                                    : variables[props.lang]['claim_test_tokens']}
                                            </Button>}
                                </div>
                            );
                        })}
                    </div>
                </DialogContent>}
        </Dialog>
    );
};

FaucetDialog.propTypes = {
    addFaucetBalance: PropTypes.func.isRequired,
    address: PropTypes.string.isRequired,
    balance: PropTypes.array.isRequired,
    balanceList: PropTypes.array.isRequired,
    balanceListInProgress: PropTypes.bool.isRequired,
    connectIBCAccount: PropTypes.func.isRequired,
    fetchBalance: PropTypes.func.isRequired,
    fetchIBCBalance: PropTypes.func.isRequired,
    handleClose: PropTypes.func.isRequired,
    inProgress: PropTypes.bool.isRequired,
    lang: PropTypes.string.isRequired,
    open: PropTypes.bool.isRequired,
    setFaucetSuccess: PropTypes.func.isRequired,
    success: PropTypes.bool.isRequired,
};

const stateToProps = (state) => {
    return {
        address: state.account.wallet.connection.address,
        balance: state.account.bc.balance.value,
        balanceList: state.account.ibc.balanceList.value,
        balanceListInProgress: state.account.ibc.balanceList.inProgress,
        lang: state.language,
        open: state.account.ibc.faucetDialog.open,
        success: state.account.ibc.faucetDialog.success,
        inProgress: state.account.ibc.faucetDialog.inProgress,
    };
};

const actionToProps = {
    connectIBCAccount,
    fetchBalance,
    fetchIBCBalance,
    handleClose: hideFaucetDialog,
    addFaucetBalance,
    setFaucetSuccess,
};

export default connect(stateToProps, actionToProps)(FaucetDialog);
