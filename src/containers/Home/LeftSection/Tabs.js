import { AppBar, Tab } from '@mui/material';
import * as PropTypes from 'prop-types';
import React from 'react';
import { connect } from 'react-redux';
import variables from '../../../utils/variables';
import { setStreamsTab } from '../../../actions/streams';

const NavTabs = (props) => {
    const handleChange = (newValue) => {
        props.setStreamsTab(newValue);
    };

    const a11yProps = (index) => {
        return {
            id: `nav-tab-${index}`,
            'aria-controls': `nav-tabpanel-${index}`,
        };
    };

    return (
        <AppBar className="stream_tabs" position="static">
            <div className="stream_tabs_section">
                <Tab
                    className={'stream_tab ' + (props.tabValue === 'outgoing' ? 'active_tab' : '')}
                    label={<p className="text">
                        {variables[props.lang].outgoing}
                        <span className="border_bottom"/>
                    </p>}
                    value="outgoing"
                    onClick={() => handleChange('outgoing')}
                    {...a11yProps(0)} />
                <Tab
                    className={'stream_tab ' + (props.tabValue === 'incoming' ? 'active_tab' : '')}
                    label={<p className="text">
                        {variables[props.lang].incoming}
                        <span className="border_bottom"/>
                    </p>}
                    value="incoming"
                    onClick={() => handleChange('incoming')}
                    {...a11yProps(1)} />
            </div>
        </AppBar>
    );
};

NavTabs.propTypes = {
    lang: PropTypes.string.isRequired,
    setStreamsTab: PropTypes.func.isRequired,
    tabValue: PropTypes.string.isRequired,
};

const stateToProps = (state) => {
    return {
        lang: state.language,
        tabValue: state.streams.streamsTab,
    };
};

const actionToProps = {
    setStreamsTab,
};

export default connect(stateToProps, actionToProps)(NavTabs);
