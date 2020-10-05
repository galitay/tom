import './../assets/css/submitButton.css';
import moment from "moment";
import Logger from './Logger';
import SubmitButton from './SubmitButton';

export default class CreateMailingListButton extends SubmitButton {
    
    onclickAction = () => {
        console.log("Creating new mailing list");
        this.createMailingList();
    };

    createMailingList = () => {
        if (this.props.isTokenExpired()){
            this.props.login();
        }
       
        var apiUrl = "http://www.itayg.com/tom/mailingListController.php";
        const data = {
            "action": "INSERT", 
            "userId": localStorage.getItem('email'),
            "listName": this.props.newMailingListName,
            "emails": this.props.newMailingListEmails
        }
        console.log(JSON.stringify(data));
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
                    username: this.props.name,
                    action: "Create Mailing List",
                    success: true,
                    start: moment().format("YYYY-MM-DD"),
                    end: "-"
                };
                Logger.log(postData);
            },
            (error) => {
                this.props.updateLoadingAnimationVisibility(false);
                const postData = {
                    username: this.props.name,
                    action: "Create Mailing List",
                    success: false,
                    start: moment().format("YYYY-MM-DD"),
                    end: "-"
                };
                Logger.log(postData);
            });
    };
}