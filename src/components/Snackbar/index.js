import { Slide, Snackbar as MaterialSnackbar } from '@mui/material';
import * as PropTypes from 'prop-types';
import React from 'react';
import './index.css';

const TransitionUp = (props) => <Slide direction="up" {...props}/>;

const Snackbar = (props) => {
    return (
        <MaterialSnackbar
            ContentProps={{
                'aria-describedby': 'message-id',
            }}
            TransitionComponent={TransitionUp}
            autoHideDuration={5000}
            className="snackbar"
            message={<span id="message-id">{props.message}</span>}
            open={props.open}
            onClose={props.onClose}/>
    );
};

Snackbar.propTypes = {
    message: PropTypes.string.isRequired,
    open: PropTypes.bool.isRequired,
    onClose: PropTypes.func.isRequired,
};

export default Snackbar;
