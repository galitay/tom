import './../assets/css/menu.css';
import React from "react";
import PageType from "../PageType";

export default class Menu extends React.Component {
    state = {
        isOpen: false
    };
    
    toggleMenu = () => {
        this.setState({
            isOpen: !this.state.isOpen
        });
    };
    
    onMenuItemSelected = (targetPage) => {
        this.toggleMenu();
        this.props.togglePages(targetPage);
    };   
    
    render () {
        return(
            <nav className="menu">
                <div className={"hamburger" + (this.state.isOpen ? " is-active" : "")} id="hamburger-9" onClick={() => this.toggleMenu()}>
                    <span className="line"></span>
                    <span className="line"></span>
                    <span className="line"></span>
                </div>
                <div className={"menu-content" + (this.state.isOpen ? " is-active" : "")}>
                    {Object.keys(PageType).filter((page) => {return PageType[page] !== PageType.LOGIN}).map((page) => {
                        return <div key={PageType[page].name} className="menu-item" onClick={() => this.onMenuItemSelected(PageType[page])}>{PageType[page].name}</div>
                    })}
                </div>
            </nav>
        )
    }
}