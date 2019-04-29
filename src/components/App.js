import React, { Component } from 'react';
import NavBar from './NavBar';
import MovieBlock from './MovieBlock';
import base, { firebaseApp } from '../base'
import Login from './Login';
import * as firebase from 'firebase';
import firestore from 'firebase/firestore';

class App extends Component {

  state = {
    uid: null,
    votes: null
  }

  movie_list = ["Django: Unchained", "Pulp Fiction"];

  ACCOUNT_NAME = "roshandf";

  django_summary = "Two years before the Civil War, Django (Jamie Foxx), a slave, finds himself accompanying an unorthodox German bounty hunter named Dr. King Schultz (Christoph Waltz) on a mission to capture the vicious Brittle brothers."
  pf_summary = "Vincent Vega (John Travolta) and Jules Winnfield (Samuel L. Jackson) are hitmen with a penchant for philosophical discussions.";

  updateVotes = (title, add) => {
    if(add === true) {
      let temp = this.state.votes;
      temp.votes.push(title);
      this.setState({
        votes:temp
      });
      //temp = this.state.votes.votes;
      let movie_votes_temp = [];
      let thisdoc = firebaseApp.firestore().collection('movie_votes').doc(title);
      thisdoc.get()
        .then(myDoc => {
          if(!myDoc.exists) {
            console.log('No such document!');
          } else {
            // console.log('Document data:', myDoc.data());
            movie_votes_temp = myDoc.data().voters;// movie_votes_temp is undefined for some reason
            movie_votes_temp.push(this.state.uid);
            thisdoc.set({
              voters: movie_votes_temp
            })
          }
        });
    } else {
      let temp = this.state.votes;
      temp.votes.splice(temp.votes.indexOf(title), 1);
      this.setState({
        votes:temp
      });
      //temp = this.state.votes.votes;
      let movie_votes_temp = [];
      let thisdoc = firebaseApp.firestore().collection('movie_votes').doc(title);
      thisdoc.get()
        .then(myDoc => {
          if(!myDoc.exists) {
            console.log('No such document!');
          } else {
            // console.log('Document data:', myDoc.data());
            movie_votes_temp = myDoc.data().voters;
            //console.log(this.state.uid);
            let index = (movie_votes_temp.indexOf(this.state.uid));
            //console.log(index);
            movie_votes_temp.splice(index, 1)
            //console.log(movie_votes_temp)
            thisdoc.set({
              voters: movie_votes_temp
            })
          }
        });
    }
  }

  componentWillUnmount() {
    base.removeBinding(this.ref);
    // We stored reference to database in this.ref so we can remove it when we leave
  }


  authHandler = async (authData) => {
    // Look up current store in firebase database
    this.ref = base.syncDoc(`users/${authData.user.uid}`, {
      context: this,
      state: 'votes'
    });
    /*
    this.setState({
      uid: authData.user.uid
    });
    */
    let thisdoc = firebaseApp.firestore().collection('users').doc(authData.user.uid);
    thisdoc.get().
      then(mydoc => {
        this.setState({
          uid: authData.user.uid,
          votes: {votes: mydoc.data().votes} // I mispelled votes in both state one and data().votes
        })
      })
    // As soon as the state changes, the render() is automatically called. I wonder if I can put the sync first?
    // Will setting votes re-call render and bring login page back? No.
  }

  authenticate = (provider) => {
    const authProvider = new firebase.auth[`${provider}AuthProvider`]();
    // WTF WHY DOES FIREBASE WORK BUT FIREBASEAPP NOT??? {firebaseApp} vs. firebaseApp...
    console.log("About to set votes");
    firebase
      .auth()
      .signInWithPopup(authProvider)
      .then(this.authHandler);
  }



  render() {
    if(!this.state.uid) {
      return <Login authenticate={this.authenticate} />
    } else {
      return (
        <React.Fragment>
          <NavBar />
          <h1 className="available-videos">
            Available Videos
          </h1>
          {console.log("stuff is rendering")}
          <ul className="app-movielist">
            {console.log(Array.isArray(this.state.votes))}
            {this.movie_list.map(key => (
              <MovieBlock
                title={key}
                length={"1 hour"}
                summary={"Summary"}
                updateVotes={this.updateVotes}
                uid={this.props.uid}
                userVoted={this.state.votes.votes.includes(key) ? true : false}
              />
            ))}
          </ul>
        </React.Fragment>
      );
    }
  }
}

export default App;