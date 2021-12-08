import React from 'react';
import './index.css';
import LeftSection from './LeftSection';
import CreatePaymentStream from './RightSection/CreatePaymentStream';
import ConnectWithUs from './RightSection/ConnectWithUs';
import VoteUsCard from './RightSection/VoteUsCard';

const Home = () => {
    return (
        <div className="home">
            <div className="left_content">
                <LeftSection/>
            </div>
            <div className="right_content">
                <CreatePaymentStream/>
                <VoteUsCard/>
                <ConnectWithUs/>
            </div>
        </div>
    );
};

export default Home;
