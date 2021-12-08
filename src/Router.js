import React from 'react';
import { Route, Switch } from 'react-router-dom';
import Home from './containers/Home';
import NavBar from './containers/NavBar';

const routes = [{
    path: '/',
    component: Home,
}];

const Router = () => {
    return (
        <div className="main_content">
            <NavBar/>
            <div className="content_div scroll_bar">
                <Switch>
                    {routes.map((route) =>
                        <Route
                            key={route.path}
                            exact
                            component={route.component}
                            path={route.path}/>,
                    )}
                    <Route
                        exact
                        component={Home}
                        path="*"/>
                </Switch>
            </div>
        </div>
    );
};

export default Router;
