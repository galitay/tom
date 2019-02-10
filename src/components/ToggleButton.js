import React from 'react';
import './../assets/css/toggleButton.css';

export default class ToggleButton extends React.Component {
    render() {
        return (
            <div className={"toggle-button-container " + (this.props.isOn ? "toggle-on" : "toggle-off")} onClick={() => this.props.toggleIsOn()}>
                <div className={"out-of-indicator-text " + (this.props.isOn ? "toggle-on" : "toggle-off")}>{!this.props.isOn ? "Half Day" : "All Day"}</div>
                <div className="toggle-indicator" >{this.props.isOn ? "Half Day" : "All Day"}</div>
            </div>
        )
    }
}