import React from 'react';
import variables from '../../../utils/variables';
import * as PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { ReactComponent as TwitterLogo } from '../../../assets/social/social-twitter.svg';
import { ReactComponent as TelegramLogo } from '../../../assets/social/Telegram.svg';
import { ReactComponent as DiscordLogo } from '../../../assets/social/Discord.svg';
import { ReactComponent as GithubLogo } from '../../../assets/social/social-github.svg';
import { ReactComponent as WebsiteLogo } from '../../../assets/social/website.svg';
import { ReactComponent as YoutubeLogo } from '../../../assets/social/youtube.svg';
import { Button } from '@mui/material';

const ConnectWithUs = (props) => {
    const handleClick = (url) => {
        window.open(url);
    };

    return (
        <div className="connect_with_us">
            <h2 className="header2_common"> {variables[props.lang]['connect_with_us']}</h2>
            <div className="social_icons">
                <Button onClick={() => handleClick('https://twitter.com/OmniFlixNetwork')}>
                    <TwitterLogo/>
                </Button>
                <Button onClick={() => handleClick('https://t.me/OmniFlixChat')}>
                    <TelegramLogo/>
                </Button>
                <Button onClick={() => handleClick('https://discord.com/invite/6gdQ4yZSTC')}>
                    <DiscordLogo/>
                </Button>
                <Button onClick={() => handleClick('https://github.com/OmniFlix')}>
                    <GithubLogo/>
                </Button>
                <Button onClick={() => handleClick('https://omniflix.network')}>
                    <WebsiteLogo/>
                </Button>
                <Button onClick={() => handleClick('https://youtube.com/OmniFlixNetwork')}>
                    <YoutubeLogo/>
                </Button>
            </div>
        </div>
    );
};

ConnectWithUs.propTypes = {
    lang: PropTypes.string.isRequired,
};

const stateToProps = (state) => {
    return {
        lang: state.language,
    };
};

export default connect(stateToProps)(ConnectWithUs);
