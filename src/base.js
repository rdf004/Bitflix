import Rebase from 're-base';
import firebase from 'firebase';
import firestore from 'firebase/firestore'

const firebaseApp = firebase.initializeApp({
    apiKey: "AIzaSyDzWhS7MssURgSUqybkq5PEcgqGQWPOqgw",
    authDomain: "bitflix.firebaseapp.com",
    databaseURL: "https://bitflix.firebaseio.com",
    projectId: "bitflix",
    storageBucket: "bitflix.appspot.com",
    messagingSenderId: "711725853355"
});

const base = Rebase.createClass(firebaseApp.firestore());

export { firebaseApp };
export default base;