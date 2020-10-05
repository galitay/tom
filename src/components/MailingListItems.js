import React from 'react';
import './../assets/css/mailingListItems.css';

export default class MailingListItems extends React.Component {
    render() {
      return <div className="preview-mailing-list-container">
              <div key={"toluna-haifa-static"} className={"preview-mailing-list" + (this.props.haifaListState ? " selected-item": "")} 
                onClick={() => this.props.updateHaifaListState(!this.props.haifaListState)}>Toluna Haifa</div>
            {Array.from(this.props.mailingLists).map((item) => {
              return <div key={item.listName} className={"preview-mailing-list" + (item.selected ? " selected-item": "")} 
                onClick={() => this.props.updateSelectedMailingLists(item.listName)}>{item.listName}</div>
            })}
          </div>
    }
}