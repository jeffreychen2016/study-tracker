import axios from 'axios';
import constants from '../constants';

const clockIn = (currentTimeAndUser) => {
  return new Promise((resolve,reject) => {
    axios
      .post(`${constants.firebaseConfig.databaseURL}/timelogs.json`,currentTimeAndUser)
      .then((res) => {
        resolve(res.data);
      })
      .catch((err) => {
        reject(err);
      });
  });
};

const clockOut = (timelogId,updatedTimeLog) => {
  return new Promise((resolve,reject) => {
    axios
      .put(`${constants.firebaseConfig.databaseURL}/timelogs/${timelogId}.json`,updatedTimeLog)
      .then((res) => {
        resolve(res);
      })
      .catch((err) => {
        reject(err);
      });
  });
}

const getSingleTimeLog = (timelogId) => {
  return new Promise((resolve, reject) => {
    axios
      .get(`${constants.firebaseConfig.databaseURL}/timelogs/${timelogId}.json`)
      .then(res => {
        resolve(res.data);
      })
      .catch(err => {
        reject(err);
      });
  });
};

// use the returned value to determine if the user ever clock out after initally clock in
const getLatestTimeLogForCurrentUser = (userClockInStatusFlag) => {
  return new Promise((resolve, reject) => {
    axios
      .get(`${constants.firebaseConfig.databaseURL}/timelogs.json?orderBy="userClockInStatusFlag"&equalTo="${userClockInStatusFlag}"`)
      .then(res => {
        let logKey = {};
        // if (res.data !== null) {
        if (Object.keys(res.data).length > 0) {
          logKey = Object.keys(res.data)[0];  
          res.data[logKey].id = logKey; 
        } 
        resolve(res.data[logKey]);
      })
      .catch(err => {
        reject(err);
      });
  });
}

const getAllsavedTimeForCurrentUser = (uid) => {
  return new Promise((resolve, reject) => {
    axios
      .get(`${constants.firebaseConfig.databaseURL}/savedtime.json?orderBy="uid"&equalTo="${uid}"`)
      .then(res => {
        let logKey = {};
        if (Object.keys(res.data).length > 0) {
          logKey = Object.keys(res.data)[0];  
          res.data[logKey].id = logKey; 
        } 
        resolve(res.data[logKey]);    
      })
      .catch(err => {
        reject(err);
      });
  });
};

const postStudyHours = (hoursToPost) => {
  return new Promise((resolve,reject) => {
    axios
      .post(`${constants.firebaseConfig.databaseURL}/savedtime.json`,hoursToPost)
      .then((res) => {
        resolve(res.data);
      })
      .catch((err) => {
        reject(err);
      });
  });
};

const updateExistingTime = (savedtimeId,newTime) => {
  return new Promise((resolve,reject) => {
    axios
      .put(`${constants.firebaseConfig.databaseURL}/savedtime/${savedtimeId}.json`,newTime)
      .then((res) => {
        resolve(res);
      })
      .catch((err) => {
        reject(err);
      });
  });
}

export default {
  clockIn, 
  clockOut,
  getSingleTimeLog,
  getLatestTimeLogForCurrentUser,
  getAllsavedTimeForCurrentUser,
  postStudyHours,
  updateExistingTime,
};