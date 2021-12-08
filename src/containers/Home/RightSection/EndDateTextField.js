import * as PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { setEndDate } from '../../../actions/streams';
import MobileDateTimePicker from '@mui/lab/MobileDateTimePicker';
import LocalizationProvider from '@mui/lab/LocalizationProvider';
import * as React from 'react';
import TextField from '@mui/material/TextField';
import AdapterDateFns from '@mui/lab/AdapterDateFns';
import variables from '../../../utils/variables';

class EndDateTextField extends React.Component {
    render () {
        const disabled = this.props.address === '' && !localStorage.getItem('of_hAtom_address');
        return (
            <LocalizationProvider dateAdapter={AdapterDateFns}>
                <MobileDateTimePicker
                    disabled={disabled}
                    minDateTime={new Date()}
                    renderInput={(params) =>
                        <TextField
                            className="text_field"
                            disabled={disabled}
                            placeholder={variables[this.props.lang]['end_date_placeholder']}
                            {...params} />}
                    value={this.props.value}
                    onChange={(newValue) => {
                        this.props.onChange(newValue);
                    }}/>
            </LocalizationProvider>
        );
    }
}

EndDateTextField.propTypes = {
    address: PropTypes.string.isRequired,
    lang: PropTypes.string.isRequired,
    onChange: PropTypes.func.isRequired,
    value: PropTypes.any,
};

const stateToProps = (state) => {
    return {
        lang: state.language,
        value: state.streams.endDate,
        address: state.account.wallet.connection.address,
    };
};

const actionsToProps = {
    onChange: setEndDate,
};

export default connect(stateToProps, actionsToProps)(EndDateTextField);
