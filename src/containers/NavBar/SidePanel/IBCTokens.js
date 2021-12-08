import flixToken from '../../../assets/faucet/flix.svg';
import junoLogo from '../../../assets/tokens/juno.svg';
import React from 'react';
import * as PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { commaSeparator, splitDecimals } from '../../../utils/numbers';
import { IbcTokensList } from '../../../utils/ibcTokens';
import { showDepositDialog, showWithdrawDialog } from '../../../actions/account/IBCTokens';
import DotsLoading from '../../../components/DotsLoading';

const IBCTokens = (props) => {
    return (
        <div className="ibc_tokens_section">
            {IbcTokensList && IbcTokensList.length &&
            IbcTokensList.map((item, index) => {
                const name = item.network && item.network.display_denom;
                const denom = item && item.ibc_denom_hash;
                const decimals = item && item.network && item.network.decimals;

                let balance = props.balance && props.balance.length && props.balance.find((val) => val.denom === denom);
                balance = balance && balance.amount && splitDecimals(balance.amount / (10 ** decimals));

                if (index <= 4) {
                    return (
                        <div key={index} className="tokens_list">
                            <div className="token_info">
                                {name === 'FLIX'
                                    ? <img alt="icon" src={flixToken}/>
                                    : name === 'JUNOX'
                                        ? <img alt="icon" src={junoLogo}/>
                                        : null}
                                <span>{name}</span>
                            </div>
                            <span className="token_bal">
                                {props.balanceInProgress
                                    ? <DotsLoading/>
                                    : balance && balance.length
                                        ? <>
                                            {balance.length && balance[0] && commaSeparator(balance[0])}
                                            {balance.length && balance[1] &&
                                            <span>.{balance.length && balance[1]}</span>}
                                        </>
                                        : 0}
                            </span>
                            <div className="buttons_div">
                                <p onClick={() => props.showDepositDialog(item)}>Deposit</p>
                                <p onClick={() => props.showWithdrawDialog(item)}>Withdraw</p>
                            </div>
                        </div>
                    );
                }

                return null;
            },
            )}
        </div>
    );
};

IBCTokens.propTypes = {
    balance: PropTypes.array.isRequired,
    balanceInProgress: PropTypes.bool.isRequired,
    lang: PropTypes.string.isRequired,
    showDepositDialog: PropTypes.func.isRequired,
    showWithdrawDialog: PropTypes.func.isRequired,
};

const stateToProps = (state) => {
    return {
        balance: state.account.bc.balance.value,
        balanceInProgress: state.account.bc.balance.inProgress,
        lang: state.language,
    };
};

const actionToProps = {
    showDepositDialog,
    showWithdrawDialog,
};

export default connect(stateToProps, actionToProps)(IBCTokens);
