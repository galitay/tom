import React from 'react';
import './reason.css';
import $ from 'jquery';
import 'jquery-ui-bundle';
import { connect } from 'react-redux';
import soldier from './soldier.png';
import baby from './baby.png';
import vacation from './vacation.png';
import early from './early.png';
import sick from './sick.png';
import {ReasonType} from './index';

class Reason extends React.Component {

    animateReasonSelected(selectedElement) {
        var relativeY = selectedElement.getBoundingClientRect().top - $(".menu-container").offset().top;
        $(selectedElement).addClass("selected");
        $(".item").css("top", relativeY);

        setTimeout(function(){
            $(".menu-container").addClass("menu-container-shrink");
            $(".item").addClass("toTop");
            $(".back-to-reason").removeClass("back-to-reason-shrink");
            $(".calendar").css("display", "block");
            $(".submit-container").css("display", "block");
        }, 300);
    };

    animateReasonDeselected() {
        $(".message-content-container").addClass("message-content-container-shrink");

        setTimeout(function(){
            $(".item").removeClass("selected");
        }, 300);

        setTimeout(function(){
            $(".menu-container").removeClass("menu-container-shrink");
            $(".back-to-reason").addClass("back-to-reason-shrink");
            $(".item").removeAttr("style");
            $(".item").removeClass("toTop");
            $(".calendar").css("display", "none");
            $(".submit-container").css("display", "none");
        }, 600);
    };

    reasonSelected = (event, id) => {
        this.props.selectReason(event, id);
        this.animateReasonSelected(event.currentTarget);
        setTimeout(function(){
            $(".message-content-container").removeClass("message-content-container-shrink");
        }, 600);
    };
    
    reasonDeselected = (event) => {
        event.stopPropagation();
        this.animateReasonDeselected();
    };
    
    
    
    render() {
        return (
            <div className="container">
                <div className="menu-container">
                    {Object.keys(ReasonType).map((reason) => {
                        console.log(ReasonType[reason].name);
                        if (ReasonType[reason].name !== ReasonType.NONE.name) {
                            return <div className="item" onClick={(event) => this.reasonSelected(event, ReasonType[reason].id)}>
                                <div className="item-text">{ReasonType[reason].name}</div>
                            </div>;
                        }
                    })}
                   
                </div>
                <div className="back-to-reason back-to-reason-shrink" onClick={(event) => this.reasonDeselected(event)}>&#9650;</div>
                <div className="message-content-container message-content-container-shrink">
                    <div className="desc-title">Description</div>
                    <textarea className="message-content"></textarea>
                </div>
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
)(Reason);
