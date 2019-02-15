import * as React from "react";
import { HashRouter ,Route, Switch, Link } from 'react-router-dom';

import Header from './components/Header';
import AddCard from './components/Card/AddCard';
import Content from './components/Content';

export default function App (props : any) {
  
    return (
        <>
            <Header />
            <HashRouter>
                <Switch>
                    <Route exact path="/" component={() => (<Content />)} />
                    <Route exact path="/add-card" component={() => (<AddCard compiler="TypeScript" framework="React" />)} />
                </Switch>
            </HashRouter>
        </>
    )
}
