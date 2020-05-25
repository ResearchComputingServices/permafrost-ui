import React, {Component} from 'react';

export default class Placeholder extends Component {
    render() {
        return (
            <div className={`h-100 d-flex justify-content-center align-items-center ${this.props.className || ''}`}>
                {this.props.message || 'Currently Unavailable'}
            </div>
        );
    }
}

