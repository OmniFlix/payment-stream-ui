import React from 'react';
import { ReactComponent as Logo } from '../../assets/logo.svg';
import './index.css';
import ProfilePopover from './ProfilePopover';
import FaucetDialog from './SidePanel/FaucetDialog';
import * as PropTypes from 'prop-types';
import { connect } from 'react-redux';
import variables from '../../utils/variables';
import spayIcon from '../../assets/spay.svg';

const NavBar = (props) => {
    return (
        <div className="nav_bar_parent">
            <div className="nav_bar">
                <Logo/>
                <div className="nav_header">
                    <p>
                        <img alt="spay" src={spayIcon}/>
                        {variables[props.lang]['stream_pay']}
                    </p>
                    <span>{variables[props.lang]['stream_pay_text']}</span>
                </div>
                <ProfilePopover/>
            </div>
            <FaucetDialog/>
        </div>
    );
};

NavBar.propTypes = {
    lang: PropTypes.string.isRequired,
};

const stateToProps = (state) => {
    return {
        lang: state.language,
    };
};

export default connect(stateToProps)(NavBar);
