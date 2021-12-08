import React from 'react';
import './app.css';
import Router from './Router';
import Snackbar from './containers/Snackbar';
import Footer from './containers/Home/Footer';

const App = () => {
    return (
        <div className="app">
            <Router/>
            <Snackbar/>
            <Footer/>
        </div>
    );
};

export default App;
