import React, { Component } from 'react';
import { Button, Dialog } from '@material-ui/core';
import * as PropTypes from 'prop-types';
import { connect } from 'react-redux';
import variables from '../../../utils/variables';
import AmountValueTextField from './AmountValueTextField';
import arrowIcon from '../../../assets/faucet/arrow.svg';
import {
    aminoSignIBCTx,
    connectIBCAccount,
    fetchIBCBalance,
    fetchTimeoutHeight,
    hideWithdrawDialog,
} from '../../../actions/account/IBCTokens';
import DotsLoading from '../../../components/DotsLoading';
import Long from 'long';
import { fetchBalance } from '../../../actions/account/BCDetails';
import { config } from '../../../config';

class WithDrawDialog extends Component {
    constructor (props) {
        super(props);

        this.state = {
            config: {},
        };
    }

    componentDidUpdate (pp, ps, ss) {
        if ((pp.open !== this.props.open) && this.props.open) {
            const config = {
                RPC_URL: this.props.value && this.props.value.network && this.props.value.network.rpc_address,
                REST_URL: this.props.value && this.props.value.network && this.props.value.network.api_address,
                CHAIN_ID: this.props.value && this.props.value.network && this.props.value.network.chain_id,
                CHAIN_NAME: this.props.value && this.props.value.network && this.props.value.network.name,
                COIN_DENOM: this.props.value && this.props.value.network && this.props.value.network.display_denom,
                COIN_MINIMAL_DENOM: this.props.value && this.props.value.network && this.props.value.network.denom,
                COIN_DECIMALS: this.props.value && this.props.value.network && this.props.value.network.decimals,
                PREFIX: this.props.value && this.props.value.network && this.props.value.network.address_prefix,
            };

            this.setState({
                config: config,
            });
            this.initKeplr(config);
        }
    }

    initKeplr (config) {
        this.props.connectIBCAccount(config, (address) => {
            this.props.fetchIBCBalance(config.REST_URL, address[0].address);
        });
    }

    handleWithdraw (decimals, denom) {
        this.props.fetchTimeoutHeight(this.state.config && this.state.config.REST_URL, this.props.value && this.props.value.destination_channel, (result) => {
            const revisionNumber = result && result.proof_height && result.proof_height.revision_number &&
                Long.fromNumber(result.proof_height.revision_number);
            const revisionHeight = result && result.proof_height && result.proof_height.revision_height;

            const data = {
                msg: {
                    typeUrl: '/ibc.applications.transfer.v1.MsgTransfer',
                    value: {
                        source_port: 'transfer',
                        source_channel: this.props.value && this.props.value.channel,
                        token: {
                            denom: denom,
                            amount: String(this.props.amountValue * (10 ** decimals)),
                        },
                        sender: this.props.address,
                        receiver: this.props.ibcAddress,
                        timeout_height: {
                            revisionNumber: revisionNumber || undefined,
                            revisionHeight: Long.fromNumber(parseInt(revisionHeight) + 150) || undefined,
                        },
                        timeout_timestamp: undefined,
                    },
                },
                fee: {
                    amount: [{
                        amount: String(225000),
                        denom: denom,
                    }],
                    gas: String(450000),
                },
                memo: '',
            };

            this.props.sign(config, data, (result) => {
                if (result) {
                    this.props.fetchIBCBalance(this.props.value && this.props.value.network && this.props.value.network.api_address,
                        this.props.ibcAddress);
                    this.props.fetchBalance(this.props.address);
                    this.props.handleClose();
                }
            });
        });
    }

    render () {
        const denom = this.props.value && this.props.value.ibc_denom_hash;
        const decimals = this.props.value && this.props.value.network && this.props.value.network.decimals;

        let balance = this.props.balance && this.props.balance.length && this.props.balance.find((val) => val.denom === denom);
        balance = balance && balance.amount && balance.amount / (10 ** decimals);

        const inProgress = this.props.accountInProgress || this.props.timeoutHeightInProgress || this.props.signInProgress;
        const disable = this.props.amountValue < 1 || this.props.amountValue > balance || inProgress;

        return (
            <Dialog
                aria-describedby="verify-twitter-dialog-description"
                aria-labelledby="verify-twitter-dialog-title"
                className="dialog deposit_dialog"
                open={this.props.open}
                onClose={this.props.handleClose}>
                <div className="deposit_dialog_content">
                    <h2>{variables[this.props.lang]['withdraw_ibc_asset']}</h2>
                    <div className="deposit_section1">
                        <span>{variables[this.props.lang]['ibc_withdraw']}</span>
                        <div className="ibc_transfer_section">
                            <div>
                                <span>{variables[this.props.lang].from}</span>
                                <div className="hash_text" title={this.props.address}>
                                    <p className="name">{this.props.address}</p>
                                    {this.props.address.slice(this.props.address.length - 4, this.props.address.length)}
                                </div>
                            </div>
                            <img alt="icon" src={arrowIcon}/>
                            <div>
                                <span>{variables[this.props.lang].to}</span>
                                {this.props.inProgress
                                    ? <DotsLoading/>
                                    : <div className="hash_text" title={this.props.ibcAddress}>
                                        <p className="name">{this.props.ibcAddress}</p>
                                        {this.props.ibcAddress.slice(this.props.ibcAddress.length - 4, this.props.ibcAddress.length)}
                                    </div>}
                            </div>
                        </div>
                    </div>
                    <div className="deposit_section2">
                        <div className="deposit_section2_header">
                            <span>{variables[this.props.lang]['amount_withdraw']}</span>
                            <span className="balance"> Available = {this.props.balance && this.props.balance.length
                                ? <span>{balance} {this.props.value && this.props.value.network && this.props.value.network.display_denom}</span>
                                : `0 ${this.props.value && this.props.value.network && this.props.value.network.display_denom}`}</span>
                        </div>
                        <AmountValueTextField
                            balance={balance || 0}
                            denom={this.props.value && this.props.value.network && this.props.value.network.display_denom}/>
                    </div>
                    <Button
                        className="deposit_button"
                        disabled={disable}
                        onClick={() => this.handleWithdraw(decimals, denom)}>
                        {inProgress
                            ? variables[this.props.lang]['approval_pending'] + '...'
                            : variables[this.props.lang].withdraw}
                    </Button>
                </div>
            </Dialog>
        );
    }
}

WithDrawDialog.propTypes = {
    accountInProgress: PropTypes.bool.isRequired,
    address: PropTypes.string.isRequired,
    balance: PropTypes.array.isRequired,
    connectIBCAccount: PropTypes.func.isRequired,
    fetchBalance: PropTypes.func.isRequired,
    fetchIBCBalance: PropTypes.func.isRequired,
    fetchTimeoutHeight: PropTypes.func.isRequired,
    handleClose: PropTypes.func.isRequired,
    ibcAddress: PropTypes.string.isRequired,
    inProgress: PropTypes.bool.isRequired,
    lang: PropTypes.string.isRequired,
    open: PropTypes.bool.isRequired,
    sign: PropTypes.func.isRequired,
    signInProgress: PropTypes.bool.isRequired,
    timeoutHeightInProgress: PropTypes.bool.isRequired,
    value: PropTypes.object.isRequired,
    amountValue: PropTypes.any,
};

const stateToProps = (state) => {
    return {
        address: state.account.wallet.connection.address,
        accountInProgress: state.account.wallet.connection.inProgress,
        ibcAddress: state.account.ibc.connection.address,
        amountValue: state.account.ibc.amountValue,
        balance: state.account.bc.balance.value,
        inProgress: state.account.ibc.connection.inProgress,
        signInProgress: state.account.ibc.connection.signInProgress,
        lang: state.language,
        open: state.account.ibc.withDrawDialog.open,
        value: state.account.ibc.withDrawDialog.value,
        timeoutHeightInProgress: state.account.ibc.timeoutHeight.inProgress,
    };
};

const actionToProps = {
    connectIBCAccount,
    fetchBalance,
    fetchIBCBalance,
    fetchTimeoutHeight,
    handleClose: hideWithdrawDialog,
    sign: aminoSignIBCTx,
};

export default connect(stateToProps, actionToProps)(WithDrawDialog);
