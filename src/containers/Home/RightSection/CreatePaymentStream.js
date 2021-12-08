import React from 'react';
import './index.css';
import variables from '../../../utils/variables';
import * as PropTypes from 'prop-types';
import { connect } from 'react-redux';
import ToAddressTextField from './ToAddressTextField';
import TokenSelectField from './TokenSelectField';
import AmountTextField from './AmountTextField';
import { styled } from '@mui/material/styles';
import Button from '@mui/material/Button';
import Tooltip, { tooltipClasses } from '@mui/material/Tooltip';
import EndDateTextField from './EndDateTextField';
import { config } from '../../../config';
import { fetchIncomingStreams, fetchOutgoingStreams } from '../../../actions/streams';
import {
    aminoSignTx,
    fetchTxHash,
    setTxHashInProgressFalse,
    txSignAndBroadCast,
} from '../../../actions/account/wallet';
import { fetchBalance } from '../../../actions/account/BCDetails';
import moment from 'moment';

class CreatePaymentStream extends React.Component {
    constructor (props) {
        super(props);
        this.state = {
            type: 'continuous',
        };

        this.handleClick = this.handleClick.bind(this);
        this.handleStream = this.handleStream.bind(this);
    }

    handleClick (value) {
        this.setState({
            type: value,
        });
    }

    handleStream () {
        const data = {
            msg: {
                type: 'OmniFlix/payment-stream/MsgStreamSend',
                value: {
                    sender: this.props.address,
                    recipient: this.props.toAddress,
                    amount: {
                        amount: String(this.props.amount * (10 ** config.COIN_DECIMALS)),
                        denom: this.props.token && this.props.token.denom,
                    },
                    end_time: moment.utc(this.props.endDate).format(),
                },
            },
            fee: {
                amount: [{
                    amount: String(500),
                    denom: config.COIN_MINIMAL_DENOM,
                }],
                gas: String(200000),
            },
            memo: '',
        };

        if (this.state.type === 'continuous') {
            data.msg.value.stream_type = 1;
        }

        this.props.sign(data, this.props.address, (result) => {
            if (result) {
                const data = {
                    tx: result.signed,
                    mode: 'sync',
                };
                data.tx.msg = result.signed.msgs;
                data.tx.signatures = [result.signature];
                if (data.tx.msgs) {
                    delete data.tx.msgs;
                }

                this.props.txSignAndBroadCast(data, (res1) => {
                    if (res1 && res1.txhash) {
                        let counter = 0;
                        const time = setInterval(() => {
                            this.props.fetchTxHash(res1.txhash, (hashResult) => {
                                if (hashResult) {
                                    this.props.fetchBalance(this.props.address);
                                    this.props.setTxHashInProgressFalse();
                                    if (this.props.tabValue === 'outgoing') {
                                        this.props.fetchOutgoingStreams(this.props.address);
                                    }
                                    if (this.props.tabValue === 'incoming') {
                                        this.props.fetchIncomingStreams(this.props.address);
                                    }
                                    clearInterval(time);
                                }

                                counter++;
                                if (counter === 3) {
                                    this.props.fetchBalance(this.props.address);
                                    this.props.setTxHashInProgressFalse();
                                    if (this.props.tabValue === 'outgoing') {
                                        this.props.fetchOutgoingStreams(this.props.address);
                                    }
                                    if (this.props.tabValue === 'incoming') {
                                        this.props.fetchIncomingStreams(this.props.address);
                                    }
                                    clearInterval(time);
                                }
                            });
                        }, 5000);
                    }
                });
            }
        });
    }

    render () {
        let balance = this.props.token && this.props.token.denom && this.props.balance &&
            this.props.balance.length && this.props.balance.find((val) => val.denom === this.props.token.denom);
        balance = balance && balance.amount && balance.amount / (10 ** config.COIN_DECIMALS);

        const inProgress = this.props.signInProgress || this.props.broadCastInProgress || this.props.txHashInProgress;
        const disabled = this.props.address === '' && !localStorage.getItem('of_hAtom_address');
        const streamDisable = this.props.toAddress === '' || this.props.amount === '' || !this.props.token ||
            !this.props.endDate || inProgress || this.props.amount > balance;
        const TypeTooltip = styled(({ className, ...props }) => (
            <Tooltip {...props} classes={{ popper: className }} />
        ))(({ theme }) => ({
            [`& .${tooltipClasses.tooltip}`]: {
                backgroundColor: theme.palette.common.white,
                color: 'rgba(0, 0, 0, 0.87)',
                boxShadow: theme.shadows[1],
                fontSize: 11,
                margin: 0,
                padding: 0,
                borderRadius: '30px',
            },
        }));

        return (
            <div className={disabled ? 'create_payment disabled_create_payment' : 'create_payment'}>
                <div className="header">
                    <h2 className="header2_common"> {variables[this.props.lang]['create_payment_stream']}</h2>
                </div>
                <div className="create_payment_stream">
                    <div className="to_address_section">
                        <span>{variables[this.props.lang].to}</span>
                        <ToAddressTextField/>
                    </div>
                    <div className="type_section">
                        <span>{variables[this.props.lang].type}</span>
                        <div className="type_actions">
                            <TypeTooltip
                                className="tooltip_section"
                                title={<p className="tooltip_css">
                                    {variables[this.props.lang]['continuous_tooltip']}
                                </p>}>
                                <Button
                                    className={this.state.type === 'continuous' ? 'active_type' : 'default_type'}
                                    disabled={disabled}
                                    onClick={() => this.handleClick('continuous')}>
                                    {variables[this.props.lang].continuous}
                                </Button>
                            </TypeTooltip>
                            <TypeTooltip
                                className="tooltip_section"
                                title={<p className="tooltip_css">
                                    {variables[this.props.lang]['delayed_tooltip']}
                                </p>}>
                                <Button
                                    className={this.state.type === 'delayed' ? 'active_type' : 'default_type'}
                                    disabled={disabled}
                                    onClick={() => this.handleClick('delayed')}>
                                    {variables[this.props.lang].delayed}
                                </Button>
                            </TypeTooltip>
                        </div>
                    </div>
                    <div className="tokens_transfer">
                        <p>
                            <span>
                                {variables[this.props.lang]['tokens_to_transfer']}
                            </span>
                            {this.props.token && this.props.token.name &&
                            <span className="available_tokens">
                                {variables[this.props.lang].available} = {balance || 0} {this.props.token.name}
                            </span>}
                        </p>
                        <div>
                            <TokenSelectField/>
                            <AmountTextField/>
                        </div>
                    </div>
                    <div className="end_date">
                        <span>{variables[this.props.lang]['end_date']}</span>
                        <EndDateTextField/>
                    </div>
                </div>
                <Button className="start_payment_button" disabled={streamDisable} onClick={this.handleStream}>
                    {inProgress
                        ? variables[this.props.lang]['approval_pending'] + '...'
                        : variables[this.props.lang]['start_payment_stream']}
                </Button>
            </div>
        );
    }
}

CreatePaymentStream.propTypes = {
    address: PropTypes.string.isRequired,
    amount: PropTypes.any.isRequired,
    balance: PropTypes.array.isRequired,
    broadCastInProgress: PropTypes.bool.isRequired,
    fetchBalance: PropTypes.func.isRequired,
    fetchIncomingStreams: PropTypes.func.isRequired,
    fetchOutgoingStreams: PropTypes.func.isRequired,
    fetchTxHash: PropTypes.func.isRequired,
    lang: PropTypes.string.isRequired,
    setTxHashInProgressFalse: PropTypes.func.isRequired,
    sign: PropTypes.func.isRequired,
    signInProgress: PropTypes.bool.isRequired,
    tabValue: PropTypes.string.isRequired,
    toAddress: PropTypes.string.isRequired,
    txHashInProgress: PropTypes.bool.isRequired,
    txSignAndBroadCast: PropTypes.func.isRequired,
    endDate: PropTypes.any,
    token: PropTypes.any,
};

const stateToProps = (state) => {
    return {
        lang: state.language,
        address: state.account.wallet.connection.address,
        balance: state.account.bc.balance.value,
        amount: state.streams.amount,
        broadCastInProgress: state.account.wallet.broadCast.inProgress,
        token: state.streams.token,
        toAddress: state.streams.toAddress,
        endDate: state.streams.endDate,
        tabValue: state.streams.streamsTab,
        signInProgress: state.account.wallet.aminoSign.inProgress,
        txHashInProgress: state.account.bc.txHash.inProgress,
    };
};

const actionToProps = {
    fetchBalance,
    fetchIncomingStreams,
    fetchOutgoingStreams,
    fetchTxHash,
    sign: aminoSignTx,
    setTxHashInProgressFalse,
    txSignAndBroadCast,
};

export default connect(stateToProps, actionToProps)(CreatePaymentStream);
