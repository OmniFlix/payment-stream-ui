import React from 'react';
import variables from '../../../utils/variables';
import * as PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { Button } from '@mui/material';
import { ReactComponent as VoteLogo } from '../../../assets/social/vote.svg';

const VoteUs = (props) => {
    const handleClick = (url) => {
        window.open(url);
    };

    return (
        <div className="vote_us">
            <h2 className="header2_common"> {variables[props.lang]['vote_us_info']}</h2>
            <Button onClick={() => handleClick('https://cosmos-hackatom-vi.devpost.com/project-gallery')}>
                <VoteLogo/>
                <p>{variables[props.lang]['vote_us']}</p>
            </Button>
        </div>
    );
};

VoteUs.propTypes = {
    lang: PropTypes.string.isRequired,
};

const stateToProps = (state) => {
    return {
        lang: state.language,
    };
};

export default connect(stateToProps)(VoteUs);
