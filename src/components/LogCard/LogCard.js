import React from 'react';
import './LogCard.css';
import logRequests from '../../firebaseRequests/logs';
import authRequests from '../../firebaseRequests/auth';
import timeClockRequests from '../../firebaseRequests/timeClock';
import { Modal, Button } from 'react-bootstrap';
import moment from 'moment';

class LogCard extends React.Component {
  state = {
    logs: [],
    show: false,
    newLog: {
      title: '',
      summary: '',
      timeSpent:'',
      date:'',
      categoryId:'',
    },
    fromButton:'',
    logIdSelected:'',
    isClockedOut: false,
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

  
  handleClose = () => {
    this.setState({ show: false });
  }

  handleShow = () => {
    this.setState({ show: true });
  }

  titleChange = (e) => {
    const tempNewLog = {...this.state.newLog};
    tempNewLog.title = e.target.value;
    this.setState({newLog: tempNewLog});
  };

  summaryChange = (e) => {
    const tempNewLog = {...this.state.newLog};
    tempNewLog.summary = e.target.value;
    this.setState({newLog: tempNewLog});
  };

  timeSpentChange = (e) => {
    const tempNewLog = {...this.state.newLog};
    tempNewLog.timeSpent = e.target.value;
    this.setState({newLog: tempNewLog});
  };

  dateChange = (e) => {
    const tempNewLog = {...this.state.newLog};
    tempNewLog.date = e.target.value;
    this.setState({newLog: tempNewLog});
  };

  addNewLogEvent = () => {
    const newLog = this.state.newLog;
    const currentCategoryId = this.props.categoryId;
    newLog.categoryId = currentCategoryId;
    logRequests.postNewLog(newLog)
      .then(() => {
        // posted!
        this.handleClose();
        logRequests.getAllLogsForCurrentCategory(currentCategoryId)
          .then((logs) => {
            // pull all logs again!
            this.setState({logs});
          })
          .catch((err) => {
            console.error('Error with pulling all logs again: ',err);
          });
      })
      .catch((err) => {
        console.error('Error with posting new log: ', err);
      });
  };

  deleteLogEvent = (e) => {
    const logId = e.target.dataset.logDeleteId;
    const currentCategoryId = this.props.categoryId;
    logRequests.deleteLog(logId)
      .then(() => {
        // deleted!
        logRequests.getAllLogsForCurrentCategory(currentCategoryId)
          .then((logs) => {
            // pull all logs again!
            this.setState({logs});
          })
          .catch((err) => {
            console.error('Error with pulling all logs again: ',err);
          });        
      })
      .catch((err) => {
        console.error('Error with deleting log: ', err);
      });
  };

  populateExistingLog = (e) => {
    const fromButton = e.target.dataset.fromButton;
    const logId = e.target.dataset.logEditId;
    const currentDate = moment().format('l');

    this.setState({fromButton}, () => {
      if (logId) {
        logRequests.getSingleLog(logId)
          .then((log) => {
            this.setState({newLog: log});
          })
          .catch((err) => {
            console.error('Error with getting single log: ', err);
          });
        this.checkIsClockedOut();
      } else {
        this.setState({newLog: {title: '', summary: '', timeSpent:'', date:currentDate}});
        this.checkIsClockedOut();
      };
      // set the log id to the state for update function
      this.setState({logIdSelected: logId});
    });
  }

  updateLogEvent = () => {
    const updatedLog = this.state.newLog;
    const logId = this.state.logIdSelected;
    const currentCategoryId = this.props.categoryId;
    logRequests.updateLog(logId,updatedLog)
      .then(() => {
        // updated
        this.handleClose();
        logRequests.getAllLogsForCurrentCategory(currentCategoryId)
        .then((logs) => {
          // pull all logs again!
          this.setState({logs});
        })
        .catch((err) => {
          console.error('Error with pulling all logs again: ',err);
        }); 
      })
      .catch((err) => {
        console.error('Error with updating log: ', err);
      })
  };

  // if returns undefined, it means the user has clocked out
  checkIsClockedOut = () => {
    const userId = authRequests.getUserId();
    const userClockInStatusFlag = userId + '-' + 'true';
    timeClockRequests.getLatestTimeLogForCurrentUser(userClockInStatusFlag)
      .then((latestTimeLog) => {
        if (latestTimeLog === undefined) {
          this.setState({isClockedOut: true}, () => {
            this.handleShow();
          });
        } else {
          this.handleShow();
        }
      })
      .catch((err) => {
        console.error('Error with getting latest time log: ', err);
      })
  };

  printAlertForClockOut = () => {
    if (!this.state.isClockedOut) {
      return <p className="clock-out-alert">Please clock out!</p>
    };
  };

  renderSaveButtons = () => {
    if (this.state.fromButton === 'add-btn') {
      return <Button onClick={this.addNewLogEvent} disabled={!this.state.isClockedOut}>Save</Button>;
    } else {
      return <Button onClick={this.updateLogEvent}>Save</Button>
    }
  };

  render () {
    const image = require(`../../imgs/category-card-add.png`);
    const logComponent = this.state.logs.map((log) => {
      return (
        <div className="log-card-wrapper col-sm-3" key={log.id}>
          <div className="log-card-container">
            <div className="log-card-body">
              <h4>{log.title}</h4>
              <p>{log.date}</p>
              <p>{log.timeSpent}</p>
              <p>{log.summary}</p>
            </div>
            <div className="log-card-footer">
              <button 
                type="button" 
                className="btn btn-default" 
                data-log-edit-id={log.id}
                data-from-button="edit-btn"
                onClick={this.populateExistingLog}
              >Edit</button>
              <button 
                type="button" 
                className="btn btn-default"
                data-log-delete-id={log.id}
                onClick={this.deleteLogEvent}
              >Delete</button>
            </div>
          </div>
        </div>
      );
    })
    return (
      <div className="LogCard">
        <div 
          className="log-card-wrapper col-sm-3"
          onClick={this.populateExistingLog}  
        >
          <div className="log-card-container">
            <div className="log-card-body add-log-card">
              <h4></h4>
              <img 
                type="button" 
                className="add-btn" 
                data-from-button="add-btn"
                src={image}
              />
              <label>Add More Logs</label>  
            </div>
          </div>
        </div>

        {logComponent}

        <div>
          <Modal show={this.state.show} onHide={this.handleClose}>
            <Modal.Header closeButton>
            {
              this.state.fromButton === 'add-btn' ? 
              <Modal.Title>Add New Log</Modal.Title> :
              <Modal.Title>Edit Log</Modal.Title>
            }
            </Modal.Header>
            <Modal.Body>
              <form className="form-horizontal">
                <div className="form-group">
                  <label htmlFor="input-add-log-title" className="col-sm-2 control-label">Title</label>
                  <div className="col-sm-10">
                    <input 
                      type="text" 
                      className="form-control" 
                      id="input-add-log-title" 
                      value={this.state.newLog.title}
                      onChange={this.titleChange}
                    />
                  </div>
                </div>
                <div className="form-group">
                  <label htmlFor="input-add-log-date" className="col-sm-2 control-label">Date</label>
                  <div className="col-sm-10">
                    <input 
                      type="text" 
                      className="form-control" 
                      id="input-add-log-date" 
                      value={this.state.newLog.date}
                      onChange={this.dateChange}
                      disabled
                    />
                  </div>
                </div>
                <div className="form-group">
                  <label htmlFor="input-add-log-timeSpent" className="col-sm-2 control-label">Time Spent</label>
                  <div className="col-sm-10">
                    <input 
                      type="text" 
                      className="form-control" 
                      id="input-add-log-timeSpent" 
                      value={this.state.newLog.timeSpent}
                      onChange={this.timeSpentChange}
                    />
                  </div>
                </div>
                <div className="form-group">
                  <label htmlFor="input-add-log-summary" className="col-sm-2 control-label">Summary</label>
                  <div className="col-sm-10">
                    <textarea 
                      type="password" 
                      className="form-control" 
                      id="input-add-log-summary"
                      value={this.state.newLog.summary}
                      onChange={this.summaryChange}
                    >
                    </textarea>
                  </div>
                </div>
              </form>
            </Modal.Body>
            <Modal.Footer>
              {this.printAlertForClockOut()}
              {this.renderSaveButtons()}
              <Button onClick={this.handleClose}>Close</Button>
            </Modal.Footer>
          </Modal>
        </div>
      </div>
    );
  };
};

export default LogCard;