import * as firebase from 'firebase';
import firestore from 'firebase/firestore';

const config = {
    apiKey: "AIzaSyDzWhS7MssURgSUqybkq5PEcgqGQWPOqgw",
    authDomain: "bitflix.firebaseapp.com",
    databaseURL: "https://bitflix.firebaseio.com",
    projectId: "bitflix",
    storageBucket: "bitflix.appspot.com",
    messagingSenderId: "711725853355"
  };
firebase.initializeApp(config);

export default firebase;