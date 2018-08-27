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

export default {clockIn, clockOut, getSingleTimeLog};