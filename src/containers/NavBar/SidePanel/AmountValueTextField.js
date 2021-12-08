import * as PropTypes from 'prop-types';
import React from 'react';
import { connect } from 'react-redux';
import TextField from '../../../components/TextField';
import variables from '../../../utils/variables';
import { InputAdornment } from '@mui/material';
import { setAmountValue } from '../../../actions/account/IBCTokens';
import flixToken from '../../../assets/faucet/flix.svg';
import junoLogo from '../../../assets/tokens/juno.svg';

const AmountValueTextField = (props) => {
    const handleChange = (value) => {
        props.onChange(value);
    };

    return (
        <TextField
            className="amount_field"
            id="amount-value"
            inputProps={{
                startAdornment: (
                    <InputAdornment position="start">
                        {props.denom === 'FLIX'
                            ? <img alt="flix" src={flixToken}/>
                            : props.denom === 'JUNOX'
                                ? <img alt="icon" src={junoLogo}/>
                                : null}
                        <span className="token_start">{props.denom}</span>
                    </InputAdornment>
                ),
                endAdornment: (
                    <InputAdornment position="end" onClick={() => props.onChange(props.balance)}>
                        <span className="amount_end"> {variables[props.lang].max} </span>
                    </InputAdornment>
                ),
            }}
            name="amount_value"
            type="number"
            value={props.value}
            onChange={handleChange}/>
    );
};

AmountValueTextField.propTypes = {
    lang: PropTypes.string.isRequired,
    onChange: PropTypes.func.isRequired,
    balance: PropTypes.number,
    denom: PropTypes.string,
    value: PropTypes.any,
};

const stateToProps = (state) => {
    return {
        lang: state.language,
        value: state.account.ibc.amountValue,
    };
};

const actionsToProps = {
    onChange: setAmountValue,
};

export default connect(stateToProps, actionsToProps)(AmountValueTextField);
