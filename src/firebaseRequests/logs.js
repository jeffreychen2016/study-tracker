import axios from 'axios';
import constants from '../constants';

const getAllLogsForCurrentCategory = (categoryId) => {
  return new Promise((resolve, reject) => {
    axios
      .get(`${constants.firebaseConfig.databaseURL}/logs.json?orderBy="categoryId"&equalTo="${categoryId}"`)
      .then(res => {
        const logs = [];
        if (res.data !== null) {
          Object.keys(res.data).forEach(fbKey => {
            res.data[fbKey].id = fbKey;
            logs.push(res.data[fbKey]);
          });
        }
        resolve(logs);
      })
      .catch(err => {
        reject(err);
      });
  });
};

const postNewLog = (newLog) => {
  return new Promise((resolve,reject) => {
    axios
      .post(`${constants.firebaseConfig.databaseURL}/logs.json`,newLog)
      .then((res) => {
        resolve(res);
      })
      .catch((err) => {
        reject(err);
      });
  });
}

const deleteLog = (logId) => {
  return new Promise((resolve,reject) => {
    axios
      .delete(`${constants.firebaseConfig.databaseURL}/logs/${logId}.json`)
      .then((res) => {
        resolve(res);
      })
      .catch((err) => {
        reject(err);
      });
  });
};

const getSingleLog = (logId) => {
  return new Promise((resolve, reject) => {
    axios
      .get(`${constants.firebaseConfig.databaseURL}/logs/${logId}.json`)
      .then(res => {
        resolve(res.data);
      })
      .catch(err => {
        reject(err);
      });
  });
};

const updateLog = (logId,updatedLog) => {
  return new Promise((resolve,reject) => {
    axios
      .put(`${constants.firebaseConfig.databaseURL}/logs/${logId}.json`,updatedLog)
      .then((res) => {
        resolve(res);
      })
      .catch((err) => {
        reject(err);
      });
  });
}


export default { getAllLogsForCurrentCategory,postNewLog,deleteLog,getSingleLog,updateLog };
