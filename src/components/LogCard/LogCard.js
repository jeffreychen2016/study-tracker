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
      hours: 0,
      minutes:0,
      seconds:0,
      date:'',
      categoryId:'',
    },
    fromButton:'',
    logIdSelected:'',
    isClockedOut: false,
    totalSavedTime: 0,
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

  hourSpentChange = (e) => {
    const tempNewLog = {...this.state.newLog};
    tempNewLog.hours = e.target.value;
    this.setState({newLog: tempNewLog});
  };

  minuteSpentChange = (e) => {
    const tempNewLog = {...this.state.newLog};
    tempNewLog.minutes = e.target.value;
    this.setState({newLog: tempNewLog});
  };

  secondSpentChange = (e) => {
    const tempNewLog = {...this.state.newLog};
    tempNewLog.seconds = e.target.value;
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

            // deduct saved time after post a new log
            this.deductAllocatedTime();
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
    this.getAllSavedHoursForCurrentUserEvent();
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
        this.setState({newLog: {
          title: '', 
          summary: '', 
          hours: 0,
          minutes: 0,
          seconds: 0,
          date:currentDate}
        });
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

  getAllSavedHoursForCurrentUserEvent = () => {
    const uid = authRequests.getUserId();
    timeClockRequests.getAllsavedTimeForCurrentUser(uid)
      .then((savedTime) => {
        this.setState({totalSavedTime: savedTime.totalTime});
      })
      .catch((err) => {
        console.error('Error getting total saved hours: ',err);
      });
  };

  convertMillisecondToTimeFormat = () => {
    const tempTime = moment.duration(this.state.totalSavedTime);
    let hours,munites,seconds;

    if (tempTime.hours() < 10) {
      hours = '0' + tempTime.hours();
    } else {
      hours = tempTime.hours();
    };

    if (tempTime.minutes() < 10) {
      munites = '0' + tempTime.minutes();
    } else {
      munites = tempTime.minutes();
    };

    if (tempTime.seconds() < 10) {
      seconds = '0' + tempTime.seconds();
    } else {
      seconds = tempTime.seconds();
    }; 

    return hours + ':' + munites + ':' + seconds;
  }

  useAllSavedTimeEvent = (e) => {
    if (e.target.checked) {
      const tempTime = moment.duration(this.state.totalSavedTime);
      const tempNewLog = {...this.state.newLog};
      tempNewLog.hours = tempTime.hours();
      tempNewLog.minutes = tempTime.minutes();
      tempNewLog.seconds = tempTime.seconds();

      this.setState({newLog: tempNewLog});
    } else {
      const tempNewLog = {...this.state.newLog};
      tempNewLog.hours = 0;
      tempNewLog.minutes = 0;
      tempNewLog.seconds = 0;

      this.setState({newLog: tempNewLog});
    }
  }

  updateExistingTimeEvent = (savedtimeId,newTime) => {
    timeClockRequests.updateExistingTime(savedtimeId,newTime)
      .then(() => {
        // console.error('updated');
      })
      .catch((err) => {
        console.error('Error updating the existing time: ',err);
      });
  };

  convertTimeFormatToMillisecond = () => {
    const time = this.state.newLog;
    let hours,minutes,seconds;
    if (time.hours < 10) {
      hours = '0' + time.hours;
    } else {
      hours =  time.hours;
    }

    if (time.minutes < 10) {
      minutes = '0' + time.minutes;
    } else {
      minutes =  time.minutes;
    }

    if (time.seconds < 10) {
      seconds = '0' + time.seconds;
    } else {
      seconds =  time.seconds;
    }

    const totalTimeToDeduct = hours + ':' + minutes + ':' + seconds;
    return moment.duration(totalTimeToDeduct);
  };

  deductAllocatedTime = () => {
    const totalTimeToDeduct = this.convertTimeFormatToMillisecond();
    const newTimeForUpdate = this.state.totalSavedTime - totalTimeToDeduct;
    const uid = authRequests.getUserId();

    const objectToPost = {
      totalTime: newTimeForUpdate, 
      uid: uid
    };

    timeClockRequests.getAllsavedTimeForCurrentUser(uid)
    .then((savedtime) => {
      this.updateExistingTimeEvent(savedtime.id,objectToPost);
    });
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
                  <div className="col-sm-10 input-time-segment-container">
                    <div className="input-time-segment">
                      <input 
                        type="number" 
                        min={0}
                        className="form-control" 
                        id="input-add-log-timeSpent" 
                        value={this.state.newLog.hours}
                        onChange={this.hourSpentChange}
                      />
                    </div>
                    <div className="input-time-segment">
                      <input 
                        type="number" 
                        min={0}
                        className="form-control" 
                        id="input-add-log-timeSpent" 
                        value={this.state.newLog.minutes}
                        onChange={this.minuteSpentChange}
                      />
                    </div>
                    <div className="input-time-segment">
                      <input 
                        type="number" 
                        min={0}
                        className="form-control" 
                        id="input-add-log-timeSpent" 
                        value={this.state.newLog.seconds}
                        onChange={this.secondSpentChange}
                      />
                    </div>
                  </div>
                  <div className="col-sm-10">
                    <label htmlFor="input-add-log-timeSpent" className="control-label total-time-label">
                      <input
                        type="checkbox"
                        id="use-all-time-checkbox"
                        onChange={this.useAllSavedTimeEvent}
                      />
                    Use Total Unallocated Time: {this.convertMillisecondToTimeFormat()}
                    </label>
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