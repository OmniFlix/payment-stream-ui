import * as PropTypes from 'prop-types';
import React from 'react';
import { connect } from 'react-redux';
import TextField from '../../../components/TextField';
import variables from '../../../utils/variables';
import { setToAddress } from '../../../actions/streams';

const ToAddressTextField = (props) => {
    const disabled = props.address === '' && !localStorage.getItem('of_hAtom_address');
    return (
        <TextField
            disable={disabled}
            id="address"
            name="address"
            placeholder={variables[props.lang]['address_placeholder']}
            value={props.value}
            onChange={props.onChange}/>
    );
};

ToAddressTextField.propTypes = {
    address: PropTypes.string.isRequired,
    lang: PropTypes.string.isRequired,
    value: PropTypes.string.isRequired,
    onChange: PropTypes.func.isRequired,
};

const stateToProps = (state) => {
    return {
        lang: state.language,
        value: state.streams.toAddress,
        address: state.account.wallet.connection.address,
    };
};

const actionsToProps = {
    onChange: setToAddress,
};

export default connect(stateToProps, actionsToProps)(ToAddressTextField);
