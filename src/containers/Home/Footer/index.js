import * as PropTypes from 'prop-types';
import { connect } from 'react-redux';
import variables from '../../../utils/variables';
import React from 'react';
import './index.css';
import githubIcon from '../../../assets/github.svg';

const Footer = (props) => {
    const handleClick = () => {
        window.open('https://github.com/OmniFlix/payment-stream');
    };

    return (
        <div className="footer">
            <p className="text1">{variables[props.lang]['footer_text1']}</p>
            <p className="text2" onClick={handleClick}>
                <img alt="github" src={githubIcon} />
                <span>{variables[props.lang]['footer_text2']}</span>
            </p>
        </div>
    );
};

Footer.propTypes = {
    lang: PropTypes.string.isRequired,
};

const stateToProps = (state) => {
    return {
        lang: state.language,
    };
};

export default connect(stateToProps)(Footer);
