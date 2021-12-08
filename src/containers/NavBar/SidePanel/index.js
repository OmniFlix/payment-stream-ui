import React from 'react';
import { Button, Drawer, IconButton } from '@mui/material';
import './index.css';
import * as PropTypes from 'prop-types';
import { setDisconnect } from '../../../actions/account/wallet';
import { connect } from 'react-redux';
import variables from '../../../utils/variables';
import { config } from '../../../config';
import CopyButton from '../../../components/CopyButton';
import { commaSeparator, splitDecimals } from '../../../utils/numbers';
import IBCTokens from './IBCTokens';
import DepositDialog from './DepositeDialog';
import WithDrawDialog from './WithDrawDialog';
import { ReactComponent as RefreshIcon } from '../../../assets/tokens/refresh.svg';
import { connectIBCAccount, fetchIBCBalanceList, showFaucetDialog } from '../../../actions/account/IBCTokens';
import CancelIcon from '@mui/icons-material/Cancel';
import spayIcon from '../../../assets/spay.svg';
import { fetchBalance } from '../../../actions/account/BCDetails';

const SidePanel = (props) => {
    let balance = props.balance && props.balance.length && props.balance.find((val) => val.denom === config.COIN_MINIMAL_DENOM);
    balance = balance && balance.amount && splitDecimals(balance.amount / (10 ** config.COIN_DECIMALS));

    const handleDisconnect = () => {
        props.onClose();
        localStorage.removeItem('of_hAtom_address');
        props.setDisconnect();
    };

    const handleClaim = (e) => {
        const list = [{
            name: 'FLIX',
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

        if (props.balanceList && !props.balanceList.length && !props.balanceListInProgress) {
            list.map((value) => {
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

                props.connectIBCAccount(config, (address) => {
                    props.fetchIBCBalanceList(config.REST_URL, address[0].address);
                });

                return null;
            });
        }

        e.stopPropagation();
        props.onClose();
        props.showFaucetDialog();
    };

    const handleRefresh = () => {
        props.fetchBalance(props.address);
    };

    return (
        <Drawer
            anchor="right"
            className="side_panel"
            open={props.open}
            onClose={props.onClose}>
            <div className="side_panel_content scroll_bar">
                <div className="streaming_heading">
                    <div className="stream_header">
                        <p>
                            <img alt="spay" src={spayIcon}/>
                            {variables[props.lang]['stream_pay']}
                        </p>
                        <span>{variables[props.lang]['stream_pay_text']}</span>
                    </div>
                    <CancelIcon onClick={props.onClose}/>
                </div>
                <div className="heading">
                    <h2>{props.name || variables[props.lang]['active_account']}</h2>
                    <Button className="connect_button" onClick={(e) => handleClaim(e)}>
                        {variables[props.lang]['claim_test_tokens']}
                    </Button>
                </div>
                <div className="network">
                    <p className="balance">
                        <span>
                            {balance && balance.length
                                ? <>
                                    {balance.length && balance[0] && commaSeparator(balance[0])}
                                    {balance.length && balance[1] &&
                                    <span>.{balance.length && balance[1]}</span>}
                                </>
                                : 0}
                        </span>
                        &nbsp;{config.COIN_DENOM}
                    </p>
                    <div className="address">
                        <div className="copy_div">
                            <div className="hash_text" title={props.address}>
                                <p className="name">{props.address}</p>
                                {props.address.slice(props.address.length - 6, props.address.length)}
                            </div>
                            <CopyButton data={props.address}/>
                        </div>
                    </div>
                </div>
                <div className="recently_collected ibc_tokens">
                    <div className="header">
                        <p className="sub_heading">{variables[props.lang]['ibc_tokens']}</p>
                        <IconButton onClick={handleRefresh}>
                            <RefreshIcon/>
                        </IconButton>
                    </div>
                    <IBCTokens/>
                </div>
                <div className="footer">
                    <Button className="disconnect_button" onClick={handleDisconnect}>
                        {variables[props.lang].disconnect}
                    </Button>
                </div>
            </div>
            <DepositDialog/>
            <WithDrawDialog/>
        </Drawer>
    );
};

SidePanel.propTypes = {
    address: PropTypes.string.isRequired,
    balance: PropTypes.array.isRequired,
    balanceList: PropTypes.array.isRequired,
    balanceListInProgress: PropTypes.bool.isRequired,
    connectIBCAccount: PropTypes.func.isRequired,
    fetchBalance: PropTypes.func.isRequired,
    fetchIBCBalanceList: PropTypes.func.isRequired,
    lang: PropTypes.string.isRequired,
    name: PropTypes.string.isRequired,
    open: PropTypes.bool.isRequired,
    setDisconnect: PropTypes.func.isRequired,
    showFaucetDialog: PropTypes.func.isRequired,
    onClose: PropTypes.func.isRequired,
};

const stateToProps = (state) => {
    return {
        address: state.account.wallet.connection.address,
        balance: state.account.bc.balance.value,
        balanceList: state.account.ibc.balanceList.value,
        balanceListInProgress: state.account.ibc.balanceList.inProgress,
        lang: state.language,
    };
};

const actionToProps = {
    connectIBCAccount,
    fetchBalance,
    fetchIBCBalanceList,
    setDisconnect,
    showFaucetDialog,
};

export default connect(stateToProps, actionToProps)(SidePanel);
