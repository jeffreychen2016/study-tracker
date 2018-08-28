import React from 'react';
import './TimeClock.css';
import timeClockRequests from '../../firebaseRequests/timeClock';
import authRequests from '../../firebaseRequests/auth';
import moment from 'moment';

// the reason to store the isClockedIn status in database instead of just state
// is because i want the flag to be permantly stored until user changes the flag
// i only want an user to have only one imcomplete instance of timelog.
// the user has to clock out before he/she can clock in again
class TimeClock extends React.Component {
  state = {
    time: "00:00:00",
    amPm: "am",
    timelogId:'',
    isClockedIn: false,
  }
  
  componentDidMount () {
    this.loadInterval = setInterval(
      this.getTime, 0
    );

    const uid = authRequests.getUserId();
    const userClockInStatusFlag = uid + '-true';

    timeClockRequests.getLatestTimeLogForCurrentUser(userClockInStatusFlag)
      .then((userClockInStatus) => {
        // if user has not clocked in, then the userClockInStatus will be null
        this.setState({isClockedIn: userClockInStatus.isClockedIn})
      })
      .catch((err) => {
        console.error('Error getting lastest time log for current user: ', err);
      });
  };

  // need to tear down the timer to free up the memory after user leaves the page
  componentWillUnmount () {
    clearInterval(this.loadInterval);
  };
  
  getTime = () => { 
    const takeTwelve = n => n > 12 ? n  - 12 : n;
    const addZero = n => n < 10 ? "0" +  n : n;
       
    let d, h, m, s, t, amPm;
    
    d = new Date();
    h = addZero(takeTwelve(d.getHours())); 
    m = addZero(d.getMinutes()); 
    s = addZero(d.getSeconds());
    t = `${h}:${m}:${s}`;

    amPm = d.getHours() >= 12 ? "pm" : "am";
    
    this.setState({
      time: t, 
      amPm: amPm
    });
  }

  clockInEvent = () => {
    const currentDate = moment().format('l');
    const isClockedIn = true;
    const uid = authRequests.getUserId();
    const clockedInAt = currentDate + ' ' + this.state.time + ' ' + this.state.amPm;
    const userClockInStatusFlag = uid + '-' + isClockedIn;
    const currentTimeAndUser = {
      isClockedIn,
      uid,
      clockedInAt,
      clockedOutAt:'',
      userClockInStatusFlag,
    };
    
    timeClockRequests.clockIn(currentTimeAndUser)
      .then((timelog) => {
        this.setState({
          timelogId: timelog.name,
          isClockedIn: true,
        });
      })
      .catch((err) => {
        console.error(`Error with clock in: `, err);
      });
  };

  clockOutevent = () => {
    const currentDate = moment().format('l');
    const uid = authRequests.getUserId();
    const isClockedIn = true;
    const userClockInStatusFlag = uid + '-' + isClockedIn;

    timeClockRequests.getLatestTimeLogForCurrentUser(userClockInStatusFlag)
      .then((userClockInStatus) => {
        console.error('userClockInStatus:',userClockInStatus);
        const timelogId = userClockInStatus.id;
        const tempTimeLog = userClockInStatus;
        const clockedOutAt = currentDate + ' ' + this.state.time + ' ' + this.state.amPm;
        tempTimeLog.isClockedIn = false;
        tempTimeLog.clockedOutAt = clockedOutAt;
        tempTimeLog.userClockInStatusFlag = uid + '-' + 'false';
        
        timeClockRequests.clockOut(timelogId,tempTimeLog)
        .then(() => {
          this.setState({isClockedIn: false});
        })
        .catch((err) => {
          console.error('Error with clock out: ', err);
        })
      })
      .catch((err) => {
        console.error('Error getting single time log: ', err);
      });
  }
  
  render () {
    const renderClockButton = () => {
      if (this.state.isClockedIn) {
        return (
          <button
            onClick={this.clockOutevent}
          >
          Clock Out
          </button>
        );
      } else {
        return (
          <button
            onClick={this.clockInEvent}
          >
          Clock In
          </button>
        );
      };
    };
    return (
      <div className="TimeClock">
        <div className="outer">
          <div className="inner">
            <div className="most-inner">
              <span className={
                this.state.time === "00:00:00" 
                  ? "time blink" 
                  : "time"} 
              > {this.state.time}
              </span>
              <span className="amPm">
                {this.state.amPm}
              </span>
            </div>
          </div>
        </div>
      {renderClockButton()}
      </div>
    );
  }
};

export default TimeClock;
