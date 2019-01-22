import React from 'react';
import './../assets/css/reason.css';
import $ from 'jquery';
import 'jquery-ui-bundle';
import ReasonType from './../ReasonType';

export default class Reason extends React.Component {

    componentWillMount(){
        this.props.toggleSubmit(false);
    }

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
            $(".preview").css("display", "block");
        }, 300);
    };

    animateReasonDeselected() {
        $(".message-content-container").addClass("message-content-container-shrink");

        setTimeout(function(){
            $(".menu-container").removeClass("menu-container-shrink");
            $(".back-to-reason").addClass("back-to-reason-shrink");
            $(".item").removeAttr("style");
            $(".item").removeClass("toTop");
            $(".calendar").css("display", "none");
            $(".submit-container").css("display", "none");
            $(".preview").css("display", "none");
        }, 300);

        setTimeout(function(){
            $(".item").removeClass("selected");
        }, 600);
    };

    reasonSelected = (event, reasonType) => {
        this.props.toggleSubmit(true);
        this.props.selectReason(event, reasonType);
        this.animateReasonSelected(event.currentTarget);
        setTimeout(function(){
            $(".message-content-container").removeClass("message-content-container-shrink");
        }, 600);
    };
    
    reasonDeselected = (event) => {
        this.props.toggleSubmit(false);
        this.props.deselectReason(event);
        event.stopPropagation();
        this.animateReasonDeselected();
    };
    
    handleDescriptionChange = (event) => {
        this.props.descriptionChanged(event);
    }
    
    render() {
        return (
            <div className="container">
                <div className="menu-container">
                    {Object.keys(ReasonType).map((reason) => {
                        if (ReasonType[reason].name !== ReasonType.NONE.name) {
                            return <div key={ReasonType[reason].name} className="item" onClick={(event) => this.reasonSelected(event, ReasonType[reason])}>
                                <img src={Object.values(ReasonType[reason].image)[0]} alt="{ReasonType[reason].name}" />
                                <div className="item-text">{ReasonType[reason].name}</div>
                            </div>;
                        }
                        return "";
                    })}
                </div>
                <div className="back-to-reason back-to-reason-shrink" onClick={(event) => this.reasonDeselected(event)}>&#9650;</div>
                <div className="message-content-container message-content-container-shrink">
                    <div className="desc-title">Description</div>
                    <textarea className="message-content" defaultValue={this.props.description} onChange={(event) => this.handleDescriptionChange(event)} />
                </div>
            </div>
        )
    }
}
