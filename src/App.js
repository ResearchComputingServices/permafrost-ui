import React, { Component } from 'react';
import './App.css';
import TopNavigation from './views/main/TopNavigation';

try {
    const req = require.context('./styles/', true);
    req.keys().forEach(key => req(key));
} catch(err) {}

export class App extends Component {
    render() {
        return (
            <div className="App">
                <TopNavigation></TopNavigation>
            </div>
        );
    }
}

