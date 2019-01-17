import React from 'react';
import './preview.css';
import 'jquery-ui-bundle';
import { connect } from 'react-redux';
import moment from "moment";

class Preview extends React.Component {
    render () {
        const startDate = moment(this.props.startDate).format("DD.MM.YY");
        const endDate = moment(this.props.endDate).format("DD.MM.YY");
        let dateText = startDate;
        if (startDate !== endDate) {
            dateText += "-" + endDate;
        }
        const reasonText = this.props.reasonType.name;
        const name = this.props.name;
        return (
            <div className="preview">
                <div className="preview-title">Preview</div>
                {name} - OOO - {dateText} - {reasonText}
            </div>  
        );
    }
}

const mapStateToProps = (state) => {
    return { startDate: state.startDate, reasonType: state.reasonType, name: state.name};
};

export default connect(
    mapStateToProps
)(Preview);