import React from 'react';
import './TimeClock.css';

class TimeClock extends React.Component {
  state = {
    time: "00:00:00",
    amPm: "am",
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
      </div>
    );
  }
};

export default TimeClock;
