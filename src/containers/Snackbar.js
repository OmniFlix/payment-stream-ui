import React from 'react';
import { connect } from 'react-redux';
import * as PropTypes from 'prop-types';
import { hideSnackbar } from '../actions/snackbar';
import Snackbar from '../components/Snackbar';
import { withRouter } from 'react-router';

const SnackbarMessage = (props) => {
    return (
        <Snackbar
            message={props.message}
            open={props.open}
            onClose={props.onClose}/>
    );
};

SnackbarMessage.propTypes = {
    history: PropTypes.shape({
        push: PropTypes.func.isRequired,
    }).isRequired,
    message: PropTypes.string.isRequired,
    open: PropTypes.bool.isRequired,
    onClose: PropTypes.func.isRequired,
};

const stateToProps = (state) => {
    return {
        open: state.snackbar.open,
        message: state.snackbar.message,
    };
};

const actionsToProps = {
    onClose: hideSnackbar,
};

export default withRouter(connect(stateToProps, actionsToProps)(SnackbarMessage));
