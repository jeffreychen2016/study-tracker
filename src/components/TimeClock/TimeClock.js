import React from 'react';
import './TimeClock.css';
import timeClockRequests from '../../firebaseRequests/timeClock';
import authRequests from '../../firebaseRequests/auth';


class TimeClock extends React.Component {
  state = {
    time: "00:00:00",
    amPm: "am",
    timelogId:'',
  }
  
  componentDidMount () {
    this.loadInterval = setInterval(
      this.getTime, 0
    );
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
    const clockedIn = true;
    const uid = authRequests.getUserId();
    const clockedInAt = this.state.time + ' ' + this.state.amPm;
    const currentTimeAndUser = {
      clockedIn,
      uid,
      clockedInAt,
      clockedOutAt:'',
    };
    
    timeClockRequests.clockIn(currentTimeAndUser)
      .then((timelog) => {
        this.setState({timelogId: timelog.name});
      })
      .catch((err) => {
        console.error(`Error with clock in: `, err);
      });
  };

  clockOutevent = () => {
    const timelogId = this.state.timelogId;
    timeClockRequests.getSingleTimeLog(timelogId)
      .then((singleTimeLog) => {
        const tempTimeLog = singleTimeLog;
        const clockedOutAt = this.state.time + ' ' + this.state.amPm;
        tempTimeLog.clockedIn = false;
        tempTimeLog.clockedOutAt = clockedOutAt;
        
        timeClockRequests.clockOut(timelogId,tempTimeLog)
        .then(() => {
          console.error('clock out');
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
      <button
        onClick={this.clockInEvent}
      >
        Clock In
      </button>
      <button
        onClick={this.clockOutevent}
      >
        Clock Out
      </button>
      <div>You clocked in at {this.state.time}</div>
      </div>
    );
  }
};

export default TimeClock;
