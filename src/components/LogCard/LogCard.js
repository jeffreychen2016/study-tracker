import React from 'react';
import './LogCard.css';
import logRequests from '../../firebaseRequests/logs';

class LogCard extends React.Component {
  state = {
    logs: [],
  };

  componentDidMount () {
    const categoryId = this.props.categoryId;
    logRequests.getAllLogsForCurrentCategory(categoryId)
      .then((logs) => {
        this.setState({logs});
      })
      .catch((err) => {
        console.error('Error with getting all logs for the given category id: ', err);
      });
  };

  render () {
    const logComponent = this.state.logs.map((log) => {
      return (
        <div className="log-card-container col-sm-3" key={log.id}>
          <div className="log-card-body">
            <h4>{log.title}</h4>
            <p>{log.summary}</p>
          </div>
          <div className="log-card-footer">
            <button 
              type="button" 
              className="btn btn-default" 
              data-from-button="view-btn"
              // onClick={viewStudyLogsEvent}
            >Get In</button>
            <br />
            <button 
              type="button" 
              className="btn btn-default" 
              data-log-edit-id={log.id}
              data-from-button="edit-btn"
              // onClick={this.populateExistingCategory}
            >Edit</button>
            <button 
              type="button" 
              className="btn btn-default"
              data-log-delete-id={log.id}
              // onClick={this.deleteCategoryEvent}
            >Delete</button>
          </div>
        </div>
      );
    })
    return (
      <div className="LogCard">
        <h2>LogCard</h2>
        {logComponent}
      </div>
    );
  };
};

export default LogCard;