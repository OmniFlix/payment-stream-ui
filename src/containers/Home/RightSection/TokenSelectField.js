import * as PropTypes from 'prop-types';
import React, { Component } from 'react';
import { connect } from 'react-redux';
import variables from '../../../utils/variables';
import SelectField from '../../../components/SelectField';
import { ReactComponent as FlixLogo } from '../../../assets/tokens/flix.svg';
import { ReactComponent as SpayLogo } from '../../../assets/spay.svg';
import { ReactComponent as JunoLogo } from '../../../assets/tokens/juno.svg';
import { setToken } from '../../../actions/streams';
import { config } from '../../../config';

class TokenSelectField extends Component {
    constructor (props) {
        super(props);

        this.handleChange = this.handleChange.bind(this);
    }

    handleChange (value) {
        this.props.onChange(value);
    }

    render () {
        const images = [{
            name: config.COIN_DENOM,
            image: <SpayLogo/>,
        }, {
            name: 'FLIX',
            image: <FlixLogo/>,
        }, {
            name: 'JUNOX',
            image: <JunoLogo/>,
        }];

        const options = [{
            name: config.COIN_DENOM,
            label: config.COIN_DENOM,
            denom: config.COIN_MINIMAL_DENOM,
        }, {
            name: 'FLIX',
            label: 'FLIX',
            denom: 'ibc/F1128F791BB70F817B21847B8FBC3FF965A1ADC86FE65D5EA43B52A490703179',
        }, {
            name: 'JUNOX',
            label: 'JUNOX',
            denom: 'ibc/8E2FEFCBD754FA3C97411F0126B9EC76191BAA1B3959CB73CECF396A4037BBF0',
        }];
        const disabled = this.props.address === '' && !localStorage.getItem('of_hAtom_address');

        return (
            <SelectField
                id="token"
                images={images}
                isDisabled={disabled}
                name="token"
                options={options}
                placeholder={variables[this.props.lang]['select_token']}
                value={this.props.value}
                onChange={this.handleChange}/>
        );
    }
}

TokenSelectField.propTypes = {
    address: PropTypes.string.isRequired,
    lang: PropTypes.string.isRequired,
    onChange: PropTypes.func.isRequired,
    value: PropTypes.any,
};

const stateToProps = (state) => {
    return {
        lang: state.language,
        value: state.streams.token,
        address: state.account.wallet.connection.address,
    };
};

const actionsToProps = {
    onChange: setToken,
};

export default connect(stateToProps, actionsToProps)(TokenSelectField);
