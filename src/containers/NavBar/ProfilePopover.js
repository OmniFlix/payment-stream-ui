import React, { Component } from 'react';
import { Button } from '@mui/material';
import * as PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { initializeChain, setDisconnect, setUserName } from '../../actions/account/wallet';
import variables from '../../utils/variables';
import { fetchBalance } from '../../actions/account/BCDetails';
import DotsLoading from '../../components/DotsLoading';
import { config } from '../../config';
import { fetchKeplrAccountName } from '../../helper';
import SidePanel from './SidePanel';
import DehazeIcon from '@mui/icons-material/Dehaze';
import { connectIBCAccount, fetchIBCBalanceList } from '../../actions/account/IBCTokens';

class ProfilePopover extends Component {
    constructor (props) {
        super(props);
        this.state = {
            open: false,
            name: '',
        };

        this.handleOpen = this.handleOpen.bind(this);
        this.handleClose = this.handleClose.bind(this);
        this.initializeKeplr = this.initializeKeplr.bind(this);
        this.initKeplr = this.initKeplr.bind(this);
    }

    componentDidMount () {
        if (this.props.address === '' && localStorage.getItem('of_hAtom_address')) {
            // used set time out to omit the image loading issue with window.onload
            setTimeout(() => {
                this.initializeKeplr();
            }, 600);
        } else {
            if ((this.props.address) &&
                (this.props.balance.length === 0) && !this.props.balanceInProgress) {
                this.props.fetchBalance(this.props.address);
            }
        }

        window.addEventListener('keplr_keystorechange', () => {
            this.props.setDisconnect();
            this.initKeplr();
            if (this.props.faucetDialog) {
                this.handleIBCList();
            }
        });
    }

    componentWillUnmount () {
        window.removeEventListener('keplr_keystorechange', this.initKeplr);
    }

    initKeplr () {
        this.props.initializeChain((address) => {
            const accountStore = fetchKeplrAccountName();
            this.props.fetchBalance(address[0].address);
            setTimeout(() => {
                this.setState({
                    name: accountStore.name,
                });
                this.props.setUserName(accountStore.name);
            }, 100);
        });
    }

    initializeKeplr () {
        this.props.initializeChain((address) => {
            if (!address) {
                window.onload = () => this.initializeKeplr();
                return;
            }

            localStorage.setItem('of_hAtom_address', address && address.length && address[0] && address[0].address);
            if ((address && address.length && address[0] && address[0].address) &&
                (this.props.balance.length === 0) && !this.props.balanceInProgress) {
                this.props.fetchBalance(address[0].address);
            }

            const accountStore = fetchKeplrAccountName();
            setTimeout(() => {
                this.setState({
                    name: accountStore.name,
                });
                this.props.setUserName(accountStore.name);
            }, 100);
        });
    }

    handleIBCList () {
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

            this.props.connectIBCAccount(config, (address) => {
                this.props.fetchIBCBalanceList(config.REST_URL, address[0].address);
            });

            return null;
        });
    }

    handleOpen () {
        this.setState({
            open: true,
        });
    }

    handleClose () {
        this.setState({
            open: false,
        });
    }

    render () {
        const {
            address,
        } = this.props;
        let balance = this.props.balance && this.props.balance.length && this.props.balance.find((val) => val.denom === config.COIN_MINIMAL_DENOM);
        balance = balance && balance.amount && balance.amount / (10 ** config.COIN_DECIMALS);

        return (
            <div className="profile">
                {this.props.address === '' && !localStorage.getItem('of_hAtom_address')
                    ? <Button className="connect_button" onClick={this.initializeKeplr}>
                        <p>{variables[this.props.lang].connect}</p>
                    </Button>
                    : this.props.inProgress
                        ? <Button disabled className="connect_button">
                            <p>{variables[this.props.lang].connecting + '...'}</p>
                        </Button>
                        : <Button
                            className="profile_section"
                            variant="contained"
                            onClick={this.handleOpen}>
                            <div className="account">
                                {this.props.balanceInProgress
                                    ? <DotsLoading/>
                                    : balance
                                        ? <p className="balance">
                                            {parseFloat(balance).toFixed(2)}{' '}
                                            {config.COIN_DENOM}
                                        </p>
                                        : <p className="balance">
                                            0 {config.COIN_DENOM}
                                        </p>}
                                {this.props.inProgress && this.props.address === ''
                                    ? <DotsLoading/>
                                    : <div className="hash_text" title={address}>
                                        <p className="name">{address}</p>
                                        {address.slice(address.length - 6, address.length)}
                                    </div>}
                            </div>
                            <span className="profile_img"/>
                        </Button>}
                {
                    this.props.address === '' && !localStorage.getItem('of_hAtom_address')
                        ? null
                        : <Button
                            className="menu_section"
                            onClick={this.handleOpen}>
                            <DehazeIcon/>
                        </Button>
                }
                <SidePanel name={this.state.name} open={this.state.open} onClose={this.handleClose}/>
            </div>
        );
    }
}

ProfilePopover.propTypes = {
    address: PropTypes.string.isRequired,
    balance: PropTypes.array.isRequired,
    balanceInProgress: PropTypes.bool.isRequired,
    connectIBCAccount: PropTypes.func.isRequired,
    faucetDialog: PropTypes.bool.isRequired,
    fetchBalance: PropTypes.func.isRequired,
    fetchIBCBalanceList: PropTypes.func.isRequired,
    inProgress: PropTypes.bool.isRequired,
    initializeChain: PropTypes.func.isRequired,
    lang: PropTypes.string.isRequired,
    setDisconnect: PropTypes.func.isRequired,
    setUserName: PropTypes.func.isRequired,
};

const stateToProps = (state) => {
    return {
        address: state.account.wallet.connection.address,
        inProgress: state.account.wallet.connection.inProgress,
        balance: state.account.bc.balance.value,
        balanceInProgress: state.account.bc.balance.inProgress,
        faucetDialog: state.account.ibc.faucetDialog.open,
        lang: state.language,
    };
};

const actionToProps = {
    connectIBCAccount,
    fetchIBCBalanceList,
    setDisconnect,
    initializeChain,
    fetchBalance,
    setUserName,
};

export default connect(stateToProps, actionToProps)(ProfilePopover);
