import * as React from "react";
import { HashRouter ,Route, Switch, Link } from 'react-router-dom';

import Header from './components/Header';
import AddCard from './components/Card/AddCard';
import EditCard from './components/Card/EditCard';
import Content from './components/Content';
import Category from './components/Category';

export default function App (props : any) {
  
    return (
        <>
            <Header />
            <HashRouter>
                <Switch>
                    <Route exact path="/" component={() => (<Content />)} />
                    <Route exact path="/home" component={() => (<Content />)} />
                    <Route exact path="/add" component={() => (<AddCard />)} />
                    <Route exact path="/edit/:id" component={(props : any) : any  => (<EditCard {...props} />)} />
                    <Route exact path="/category" component={(props : any) : any => (<Category {...props} />)} />
                </Switch>
            </HashRouter>
        </>
    )
}
