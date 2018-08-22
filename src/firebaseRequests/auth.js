import firebase from 'firebase';

const loginUser = (user) => {
  return firebase.auth().signInWithEmailAndPassword(user.email, user.password);
};

const logoutUser = () => {
  return firebase.auth().signOut();
}

const getUserId = () => {
  return firebase.auth().currentUser.uid;
};

export default {loginUser,logoutUser, getUserId};
