import * as PropTypes from 'prop-types';
import React, { Component } from 'react';
import { fetchIncomingStreams, fetchOutgoingStreams } from '../../../actions/streams';
import NoData from '../../../components/NoData';
import variables from '../../../utils/variables';
import { config } from '../../../config';
import moment from 'moment';
import momentDurationFormatSetup from 'moment-duration-format';
import { IbcTokensList } from '../../../utils/ibcTokens';
import { connect } from 'react-redux';
import CircularProgress from '../../../components/CircularProgress';
import spayIcon from '../../../assets/spay.svg';
import flixToken from '../../../assets/faucet/flix.svg';
import junoLogo from '../../../assets/tokens/juno.svg';

momentDurationFormatSetup(moment);

class Card extends Component {
    componentDidMount () {
        if ((this.props.tabValue === 'outgoing') && this.props.address) {
            this.props.fetchOutgoingStreams(this.props.address);
        }
        if ((this.props.tabValue === 'incoming') && this.props.address) {
            this.props.fetchIncomingStreams(this.props.address);
        }
    }

    componentDidUpdate (pp, ps, ss) {
        if ((pp.address !== this.props.address) && (this.props.tabValue === 'outgoing') &&
            this.props.address && !this.props.outgoingInProgress) {
            this.props.fetchOutgoingStreams(this.props.address);
        }
        if ((pp.address !== this.props.address) && (this.props.tabValue === 'incoming') &&
            this.props.address && !this.props.incomingInProgress) {
            this.props.fetchIncomingStreams(this.props.address);
        }

        if ((pp.tabValue !== this.props.tabValue) && this.props.address) {
            if ((this.props.tabValue === 'outgoing') && this.props.outgoing && !this.props.outgoing.length) {
                this.props.fetchOutgoingStreams(this.props.address);
            }
            if ((this.props.tabValue === 'incoming') && this.props.incoming && !this.props.incoming.length) {
                this.props.fetchIncomingStreams(this.props.address);
            }
        }
    }

    handleTimeLoop (item) {
        const end = item.end_time && moment.utc(item.end_time);

        return moment.utc(end).fromNow('in');
    }

    render () {
        let list = [];
        let inProgress = false;
        if (this.props.tabValue === 'outgoing') {
            list = this.props.outgoing && this.props.outgoing.length ? this.props.outgoing : [];
            inProgress = this.props.outgoingInProgress;
        }
        if (this.props.tabValue === 'incoming') {
            list = this.props.incoming && this.props.incoming.length ? this.props.incoming : [];
            inProgress = this.props.incomingInProgress;
        }

        list.sort((a, b) => (a.start_time > b.start_time) ? -1 : ((a.start_time < b.start_time) ? 1 : 0));

        return (
            <>
                {inProgress
                    ? <CircularProgress/>
                    : list && list.length
                        ? list.map((item, index) => {
                            let denom = item && item.total_amount && item.total_amount.denom &&
                            (item.total_amount.denom !== config.COIN_MINIMAL_DENOM)
                                ? item.total_amount.denom
                                : config.COIN_DENOM;

                            const ibcFilter = IbcTokensList.find((val) => val.ibc_denom_hash === denom);

                            if (ibcFilter && ibcFilter.network && ibcFilter.network.display_denom) {
                                denom = ibcFilter.network.display_denom;
                            }

                            return (
                                <div
                                    key={index}
                                    className="stream_card">
                                    <div className="section1">
                                        <div className="stream_id">
                                            <span
                                                className="stream_key">{variables[this.props.lang]['stream_id']}</span>
                                            <div className="stream_value">{item.id}</div>
                                        </div>
                                        <div>
                                            <span className="stream_key">{variables[this.props.lang].type}</span>
                                            <div className="stream_value">
                                                {item.stream_type && (item.stream_type === 'PAYMENT_TYPE_CONTINUOUS')
                                                    ? 'Continuous'
                                                    : item.stream_type && (item.stream_type === 'PAYMENT_TYPE_DELAYED')
                                                        ? 'Delayed'
                                                        : null}
                                            </div>
                                        </div>
                                        <div className="status_section">
                                            <span className="stream_key">{variables[this.props.lang].status}</span>
                                            <div className={item.status === 'PAYMENT_STATUS_OPEN'
                                                ? 'open_status stream_value' : item.status === 'PAYMENT_STATUS_COMPLETED'
                                                    ? 'complete_status stream_value' : 'stream_value'
                                            }>
                                                {item.status && (item.status === 'PAYMENT_STATUS_OPEN')
                                                    ? 'open'
                                                    : item.status && (item.status === 'PAYMENT_STATUS_COMPLETED')
                                                        ? 'completed'
                                                        : null}
                                            </div>
                                        </div>
                                    </div>
                                    <div className="address_section">
                                        <div className="from_address">
                                            <span className="stream_key">{variables[this.props.lang].from}</span>
                                            <div className="stream_value hash_text" title={item.sender}>
                                                <p className="name">{item.sender}</p>
                                                {item.sender && item.sender.slice(item.sender.length - 6, item.sender.length)}
                                            </div>
                                        </div>
                                        <div className="to_address">
                                            <span className="stream_key">{variables[this.props.lang].to}</span>
                                            <div className="stream_value hash_text" title={item.recipient}>
                                                <p className="name">{item.recipient}</p>
                                                {item.recipient && item.recipient.slice(item.recipient.length - 6, item.recipient.length)}
                                            </div>
                                        </div>
                                    </div>
                                    <div className="stream_time">
                                        <div>
                                            <span
                                                className="stream_key">{variables[this.props.lang]['start_time']}</span>
                                            <div className="stream_value">
                                                {item.start_time &&
                                                moment(item.start_time).format('DD/MM/YYYY hh:mm a')}
                                            </div>
                                        </div>
                                        <div className="end_time">
                                            <span className="stream_key">{variables[this.props.lang]['end_time']}</span>
                                            <div className="stream_value">
                                                {item.end_time &&
                                                moment(item.end_time).format('DD/MM/YYYY hh:mm a')}
                                            </div>
                                        </div>
                                    </div>
                                    <div className={item.status && (item.status === 'PAYMENT_STATUS_OPEN') ? 'open_stream tokens_section' : 'tokens_section'}>
                                        <div className="stream_token">
                                            {denom === 'FLIX'
                                                ? <img alt="icon" src={flixToken}/>
                                                : denom === 'JUNOX'
                                                    ? <img alt="icon" src={junoLogo}/>
                                                    : denom === 'SPAY'
                                                        ? <img alt="icon" src={spayIcon}/>
                                                        : null}
                                            <span>{denom}</span>
                                        </div>
                                        <div className="stream_tokens">
                                            <div>
                                                <span className="stream_key">
                                                    {this.props.tabValue === 'incoming'
                                                        ? variables[this.props.lang].received
                                                        : variables[this.props.lang].sent}
                                                </span>
                                                <div className="stream_value transferred_value">
                                                    {item.total_transferred && item.total_transferred.amount &&
                                                    item.total_transferred.amount / (10 ** config.COIN_DECIMALS)}&nbsp;
                                                </div>
                                            </div>
                                            <div className="total_tokens">
                                                <span
                                                    className="stream_key">{
                                                        this.props.tabValue === 'incoming'
                                                            ? variables[this.props.lang]['to_receive']
                                                            : variables[this.props.lang]['to_send']}</span>
                                                <div className="stream_value">
                                                    {item.total_amount && item.total_amount.amount &&
                                                    item.total_amount.amount / (10 ** config.COIN_DECIMALS)}&nbsp;
                                                </div>
                                            </div>
                                            {item.status && (item.status === 'PAYMENT_STATUS_COMPLETED')
                                                ? <div className="completed_stream">
                                                    <span
                                                        className="stream_key">{variables[this.props.lang]['time_left']}</span>
                                                    <div className="stream_value">
                                                        {variables[this.props.lang].completed}
                                                    </div>
                                                </div>
                                                : <div className="remaining_time">
                                                    <span
                                                        className="stream_key">{variables[this.props.lang]['time_left']}</span>
                                                    <div className="stream_value">
                                                        {this.handleTimeLoop(item)}
                                                    </div>
                                                </div>}
                                        </div>
                                    </div>
                                    <div className="transferred_at">
                                        <span
                                            className="stream_key">{variables[this.props.lang]['last_transferred_at']}</span>
                                        <div className="stream_value">
                                            {item.status && (item.status === 'PAYMENT_STATUS_OPEN') &&
                                            item.stream_type && (item.stream_type === 'PAYMENT_TYPE_DELAYED')
                                                ? 'NA'
                                                : item.last_transferred_at &&
                                                moment(item.last_transferred_at).format('DD/MM/YYYY hh:mm a')}
                                        </div>
                                    </div>
                                </div>
                            );
                        })
                        : <NoData/>}
            </>
        );
    }
}

Card.propTypes = {
    address: PropTypes.string.isRequired,
    fetchIncomingStreams: PropTypes.func.isRequired,
    fetchOutgoingStreams: PropTypes.func.isRequired,
    incoming: PropTypes.array.isRequired,
    incomingInProgress: PropTypes.bool.isRequired,
    lang: PropTypes.string.isRequired,
    outgoing: PropTypes.array.isRequired,
    outgoingInProgress: PropTypes.bool.isRequired,
    tabValue: PropTypes.string.isRequired,
};

const stateToProps = (state) => {
    return {
        address: state.account.wallet.connection.address,
        lang: state.language,
        tabValue: state.streams.streamsTab,
        incomingInProgress: state.streams.incoming.inProgress,
        incoming: state.streams.incoming.value,
        outgoingInProgress: state.streams.outgoing.inProgress,
        outgoing: state.streams.outgoing.value,
    };
};

const actionToProps = {
    fetchIncomingStreams,
    fetchOutgoingStreams,
};

export default connect(stateToProps, actionToProps)(Card);
