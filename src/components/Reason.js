import React from 'react';
import ReactDOM from 'react-dom';
import './../assets/css/reason.css';
import ReasonType from './../ReasonType';

export default class Reason extends React.Component {

    componentWillMount(){
        this.props.toggleSubmit(false);
    }

    animateReasonSelected(selectedElement, reasonType) {
        let relativeY = selectedElement.getBoundingClientRect().top -  ReactDOM.findDOMNode(this).getElementsByClassName("reason-container")[0].getBoundingClientRect().top;

        this.props.selectReason(reasonType);

        let items = ReactDOM.findDOMNode(this).getElementsByClassName("item");
        for (let item of items){
            item.setAttribute("style","top:" + relativeY + "px;");
        }
        setTimeout(() => {
            this.props.updateReasonFormVisibility(true);
        }, 300);
    };

    animateReasonDeselected() {
        this.props.updateMessageContainerVisibility(false);
        setTimeout(() => {
            this.props.toggleSubmit(false);
            this.props.updateReasonFormVisibility(false);
            let items = ReactDOM.findDOMNode(this).getElementsByClassName("item");
            for (let item of items){
                item.removeAttribute("style");
            }
        }, 300);

        setTimeout(() => {
            this.props.selectReason(ReasonType.NONE);
        }, 600);
    };

    reasonSelected = (event, reasonType) => {
        this.props.selectReason(reasonType);
        this.animateReasonSelected(event.currentTarget, reasonType);
        setTimeout(() => {
            this.props.toggleSubmit(true);
            this.props.updateMessageContainerVisibility(true);
        }, 600);
    };
    
    reasonDeselected = (event) => {
        this.props.deselectReason(event);
        event.stopPropagation();
        this.animateReasonDeselected();
    };
    
    handleDescriptionChange = (event) => {
        this.props.descriptionChanged(event);
    };
    
    render() {
        return (
            <div className="container">
                <div className={"reason-container" + (this.props.reasonFormVisible ? " reason-container-shrink" : "")}>
                    {Object.keys(ReasonType).map((reason) => {
                        if (ReasonType[reason].name !== ReasonType.NONE.name) {
                            return <div key={ReasonType[reason].name} className={"item" + (this.props.reasonFormVisible ? " toTop" : "") + (this.props.reasonType === ReasonType[reason] ? " selected" : "")} onClick={(event) => this.reasonSelected(event, ReasonType[reason])}>
                                <img src={Object.values(ReasonType[reason].image)[0]} alt="{ReasonType[reason].name}" />
                                <div className="item-text">{ReasonType[reason].name}</div>
                            </div>;
                        }
                        return "";
                    })}
                </div>
                <div className={"back-to-reason" + (!this.props.reasonFormVisible ? " back-to-reason-shrink" : "")} onClick={(event) => this.reasonDeselected(event)}>&#9650;</div>
                {/*
                    <div
                        className={"message-content-container" + (!this.props.messageContainerVisible ? " message-content-container-shrink" : "")}>
                        <div className="desc-title">Description</div>
                        <textarea className="message-content" placeholder="Enter your description here..."
                                  defaultValue={this.props.description}
                                  onChange={(event) => this.handleDescriptionChange(event)}/>
                    </div>
                */}
            </div>
        )
    }
}
