import Rebase from 're-base';
import firebase from 'firebase';

const firebaseApp = firebase.initializeApp({
    apiKey: "AIzaSyDzWhS7MssURgSUqybkq5PEcgqGQWPOqgw",
    authDomain: "bitflix.firebaseapp.com",
    databaseURL: "https://bitflix.firebaseio.com"
});

const base = Rebase.createClass(firebaseApp.database());

export { firebaseApp };
export default base;