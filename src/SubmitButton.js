import React from 'react';
import './submitButton.css';
import $ from 'jquery';
import 'jquery-ui-bundle';
import { connect } from 'react-redux';

class SubmitButton extends React.Component {

    submitClicked = (event) => {
        $("#button").addClass("onclic", 250, this.validate);
    };
    
    validate() {
        setTimeout(function() {
            $("#button").removeClass("onclic");
            $("#button").addClass("validate", 450, this.callback);
        }, 2250 );
    }
    
    callback() {
        setTimeout(function() {
            $("#button").removeClass("validate");
        }, 1250 );
    }
    
    render() {
        return (
            <div className="submit-container">
                <button id="button" onClick={(event) => this.submitClicked(event)}/>
            </div>
        )
    }
}


const mapStateToProps = (state) => {
    return { reasons: state.reasons};
};

const mapDispatchToProps = null;

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(SubmitButton);
