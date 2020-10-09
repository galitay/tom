import './../assets/css/submitButton.css';
import moment from "moment";
import Logger from './Logger';
import SubmitButton from './SubmitButton';

export default class DeleteMailingListButton extends SubmitButton {
    
    onclickAction = () => {
        console.log("Deleting mailing list");
        this.deleteMailingList();
    };

    deleteMailingList = () => {
        if (this.props.isTokenExpired()){
            this.props.login();
        }
       
        var apiUrl = this.props.BASE_URL + "user/mailingLists/";
        const data = {
            "action": "DELETE", 
            "userId": localStorage.getItem('email'),
            "listName": this.props.mailingListName
        }
        fetch(apiUrl,{
            method: 'POST',
            headers: {
                'Content-Type':'application/json'
            },
            body: JSON.stringify(data)
        }).then(
            (data) => {
                this.props.getUserMailingLists();
                this.props.updateLoadingAnimationVisibility(false);
                const postData = {
                    username: localStorage.getItem('email'),
                    action: "Delete Mailing List",
                    success: true,
                    start: moment().format("YYYY-MM-DD"),
                    end: moment().format("YYYY-MM-DD")
                };
                Logger.log(postData);
            },
            (error) => {
                this.props.updateLoadingAnimationVisibility(false);
                const postData = {
                    username: localStorage.getItem('email'),
                    action: "Delete Mailing List",
                    success: false,
                    start: moment().format("YYYY-MM-DD"),
                    end: moment().format("YYYY-MM-DD")
                };
                Logger.log(postData);
            });
    };
}