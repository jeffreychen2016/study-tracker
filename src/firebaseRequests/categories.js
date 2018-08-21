import axios from 'axios';
import constants from '../constants';

const getAllCategoriesForCurrentUser = (uid) => {
  return new Promise((resolve, reject) => {
    axios
      .get(`${constants.firebaseConfig.databaseURL}/categories.json?orderBy="uid"&equalTo="${uid}"`)
      .then(res => {
        const categories = [];
        if (res.data !== null) {
          Object.keys(res.data).forEach(fbKey => {
            res.data[fbKey].id = fbKey;
            categories.push(res.data[fbKey]);
          });
        }
        resolve(categories);
      })
      .catch(err => {
        reject(err);
      });
  });
};

const postNewCategory = (newCategory) => {
  return new Promise((resolve,reject) => {
    axios
      .post(`${constants.firebaseConfig.databaseURL}/categories.json`,newCategory)
      .then((res) => {
        resolve(res);
      })
      .catch((err) => {
        reject(err);
      });
  });
}

export default {getAllCategoriesForCurrentUser, postNewCategory};
