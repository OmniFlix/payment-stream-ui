import * as PropTypes from 'prop-types';
import React from 'react';
import { connect } from 'react-redux';
import TextField from '../../../components/TextField';
import variables from '../../../utils/variables';
import { setAmount } from '../../../actions/streams';
import { InputAdornment } from '@mui/material';
import { config } from '../../../config';

const AmountTextField = (props) => {
    let balance = props.token && props.token.denom && props.balance &&
        props.balance.length && props.balance.find((val) => val.denom === props.token.denom);
    balance = balance && balance.amount && balance.amount / (10 ** config.COIN_DECIMALS);
    const disabled = props.address === '' && !localStorage.getItem('of_hAtom_address');

    return (
        <TextField
            disable={disabled}
            id="price"
            inputProps={{
                endAdornment: (
                    props.token && <InputAdornment position="end" onClick={() => props.onChange(balance || 0)}>
                        <span className="amount_end"> {variables[props.lang].max} </span>
                    </InputAdornment>
                ),
            }}
            name="price"
            placeholder={variables[props.lang]['enter_tokens']}
            type="number"
            value={props.value}
            onChange={props.onChange}/>
    );
};

AmountTextField.propTypes = {
    address: PropTypes.string.isRequired,
    balance: PropTypes.array.isRequired,
    lang: PropTypes.string.isRequired,
    value: PropTypes.any.isRequired,
    onChange: PropTypes.func.isRequired,
    token: PropTypes.any,
};

const stateToProps = (state) => {
    return {
        balance: state.account.bc.balance.value,
        lang: state.language,
        value: state.streams.amount,
        token: state.streams.token,
        address: state.account.wallet.connection.address,
    };
};

const actionsToProps = {
    onChange: setAmount,
};

export default connect(stateToProps, actionsToProps)(AmountTextField);
