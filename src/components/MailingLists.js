import React from 'react';
import './../assets/css/mailingLists.css';
import CreateMailingListButton from './CreateMailingListButton';
import DeleteMailingListButton from './DeleteMailingListButton';

export default class MailingLists extends React.Component {
    
    render() {
        let data = Array.from(this.props.mailingLists);
        return <div className="mailing-lists-container">
                <div className="mailing-list-container">
                    <div className="mailing-list-name">Create New Mailing List</div>
                    <div className="mailing-list-emails">   
                        <div className="new-maling-list-section-container">
                            <div className="new-maling-list-section-title">Name</div>
                            <div className="new-mailing-list-name">
                                <input type="text" name="malingListName" placeholder="Mailing List Name..." onChange={(event) =>  this.props.updateMailingListName(event.target.value)} />
                            </div>
                        </div>
                        <div className="separator"></div>
                        <div className="new-maling-list-section-container">
                            <div className="new-maling-list-section-title">Emails</div>
                            <div className="new-maling-list-section-emails">
                                <textarea name="malingListEmails" placeholder="Emails separated with semicolons (;)" onChange={(event) =>  this.props.updateMailingListEmails(event.target.value)} />
                            </div>
                        </div>
                    </div>
                </div>
                <CreateMailingListButton 
                    newMailingListName={this.props.newMailingListName}
                    newMailingListEmails={this.props.newMailingListEmails}
                    updateLoadingAnimationVisibility={this.props.updateLoadingAnimationVisibility}
                    loadingAnimation={this.props.loadingAnimation}
                    isTokenExpired={this.props.isTokenExpired}
                    login={this.props.login} 
                    token={this.props.token}
                    getUserMailingLists={this.props.getUserMailingLists}
                    buttonStyle={"create-new-mailing-list-button"}
                    currentButtonClicked={this.props.currentButtonClicked}
                    updateCurrentButtonClicked={this.props.updateCurrentButtonClicked}
                    BASE_URL={this.props.BASE_URL} />
                {data.map((mList) => 
                    <div key={mList.listName} className="mailing-list-container">
                        <div className="mailing-list-name">{mList.listName}</div>
                        <div className="mailing-list-emails-content">{mList.emails}</div>
                        <div className="delete-mailing-list-button-container">
                            <DeleteMailingListButton
                                mailingListName={mList.listName}
                                updateLoadingAnimationVisibility={this.props.updateLoadingAnimationVisibility}
                                loadingAnimation={this.props.loadingAnimation}
                                isTokenExpired={this.props.isTokenExpired}
                                login={this.props.login} 
                                token={this.props.token}
                                getUserMailingLists={this.props.getUserMailingLists}
                                buttonStyle={"delete-mailing-list-button"}
                                currentButtonClicked={this.props.currentButtonClicked}
                                updateCurrentButtonClicked={this.props.updateCurrentButtonClicked}
                                BASE_URL={this.props.BASE_URL}  />
                        </div>
                    </div>     
                )}
            </div>
    }
}        