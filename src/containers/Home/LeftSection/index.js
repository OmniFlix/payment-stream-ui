import React from 'react';
import './index.css';
import Tabs from './Tabs';
import * as PropTypes from 'prop-types';
import { connect } from 'react-redux';
import variables from '../../../utils/variables';
import Card from './Card';
import { Button, IconButton } from '@mui/material';
import { fetchKeplrAccountName } from '../../../helper';
import { initializeChain, setUserName } from '../../../actions/account/wallet';
import { fetchBalance } from '../../../actions/account/BCDetails';
import { ReactComponent as RefreshIcon } from '../../../assets/tokens/refresh.svg';
import { fetchIncomingStreams, fetchOutgoingStreams } from '../../../actions/streams';

const LeftSection = (props) => {
    const initializeKeplr = () => {
        props.initializeChain((address) => {
            if (!address) {
                window.onload = () => initializeKeplr();
                return;
            }

            localStorage.setItem('of_hAtom_address', address && address.length && address[0] && address[0].address);
            if ((address && address.length && address[0] && address[0].address) &&
                (props.balance.length === 0) && !props.balanceInProgress) {
                props.fetchBalance(address[0].address);
            }

            const accountStore = fetchKeplrAccountName();
            setTimeout(() => {
                props.setUserName(accountStore.name);
            }, 100);
        });
    };

    const handleRefresh = () => {
        if (props.tabValue === 'outgoing') {
            props.fetchOutgoingStreams(props.address);
        }
        if (props.tabValue === 'incoming') {
            props.fetchIncomingStreams(props.address);
        }
    };

    return (
        props.address === '' && !localStorage.getItem('of_hAtom_address')
            ? <div className="left_section disabled_left_section">
                <div className="header">
                    <h2 className="header2_common">{variables[props.lang].streams}</h2>
                </div>
                <Button
                    className="connect_button"
                    onClick={initializeKeplr}>
                    <p>{variables[props.lang].connect_keplr}</p>
                </Button>
            </div>
            : <div className="left_section">
                <div className="header">
                    <div className="header_div">
                        <h2 className="header2_common">{variables[props.lang].streams}</h2>
                        <IconButton onClick={handleRefresh}>
                            <RefreshIcon/>
                        </IconButton>
                    </div>
                    <Tabs/>
                </div>
                <div className="cards_list">
                    <Card/>
                </div>
            </div>
    );
};

LeftSection.propTypes = {
    address: PropTypes.string.isRequired,
    balance: PropTypes.array.isRequired,
    balanceInProgress: PropTypes.bool.isRequired,
    fetchBalance: PropTypes.func.isRequired,
    fetchIncomingStreams: PropTypes.func.isRequired,
    fetchOutgoingStreams: PropTypes.func.isRequired,
    initializeChain: PropTypes.func.isRequired,
    lang: PropTypes.string.isRequired,
    setUserName: PropTypes.func.isRequired,
    tabValue: PropTypes.string.isRequired,
};

const stateToProps = (state) => {
    return {
        address: state.account.wallet.connection.address,
        balance: state.account.bc.balance.value,
        balanceInProgress: state.account.bc.balance.inProgress,
        lang: state.language,
        tabValue: state.streams.streamsTab,
    };
};

const actionToProps = {
    initializeChain,
    fetchBalance,
    fetchIncomingStreams,
    fetchOutgoingStreams,
    setUserName,
};

export default connect(stateToProps, actionToProps)(LeftSection);
