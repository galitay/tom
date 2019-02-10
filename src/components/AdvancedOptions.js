import React from 'react';
import './../assets/css/advancedOptions.css';
import ToggleButton from "./ToggleButton";

export default class AdvancedOptions extends React.Component {
    
    render() {
        return (
            <div className={"advanced-options-container"}>
                <div className="advanced-options-title">Advanced Options</div>
                <ToggleButton toggleIsOn={this.props.toggleHalfDay} isOn={this.props.halfDay} />
                <div><input placeholder="Add title suffix here..." type="text" onChange={(event) => this.props.titleSuffixChange(event)} /></div>
            </div>
        )
    }
}