import React, { Component } from 'react';
import NavBar from './NavBar';
import MovieBlock from './MovieBlock';
import base, { firebaseApp } from '../base'
import Login from './Login';
import * as firebase from 'firebase';
import SlideView from './SlideView';

class App extends Component {
  movie_names = []
  constructor() {
    super();
    this.state = {
      isLoaded: false,
      uid: null,
      votes: null
    }
    let thisdoc = firebaseApp.firestore().collection('movie_names').doc('movie_names');
    thisdoc.get()
      .then(myDoc => {
        if(!myDoc.exists) {
          console.log("No such document");
        } else {
          this.movie_names = Object.keys(myDoc.data()).map(function(key) {
            return myDoc.data()[key];
          })
        }
        });
  }

  updateVotes = (title, add) => {
    console.log(`update votes ${title}`)
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
      let movie_votes_temp = [];
      let thisdoc = firebaseApp.firestore().collection('movie_votes').doc(title);
      thisdoc.get()
        .then(myDoc => {
          if(!myDoc.exists) {
            console.log('No such document!');
          } else {
            movie_votes_temp = myDoc.data().voters;
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
    var docExists = firebaseApp.firestore().collection('users').doc(authData.user.uid).get()
      .then(doc => {
        if(!doc.exists) {
          var data = {
            votes: []
          };
          base.addToCollection('users', data, authData.user.uid)
            .then(() => {
              console.log(`Success in adding ${authData.user.uid} to users`)
            }).catch(err => {
              alert(err);
          });
        }
      })
    // Look up current store in firebase database
    this.ref = base.syncDoc(`users/${authData.user.uid}`, {
      context: this,
      state: 'votes'
    });
    let thisdoc = firebaseApp.firestore().collection('users').doc(authData.user.uid);
    thisdoc.get().then(mydoc => {
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
    firebase
      .auth()
      .signInWithPopup(authProvider)
      .then(this.authHandler);
  }



  render() {
    console.log("App render");
    if(!this.state.uid) {
      return <Login authenticate={this.authenticate} />
    } else {
      return (
        <React.Fragment>
          <NavBar />
          <div className='video-div'>
            <video className="background-video" loop autoPlay muted>
              <source src={require("./borat_trailer1.mp4")} type="video/mp4" />
              Your browser does not support the video tag.
            </video>
          </div>
          <div className="video-overlay-div">
            <h1 className="home-featured-video">
              BitFlix Feature Movie
            </h1>
            <h1 className="home-featured-video-title">
              Borat
            </h1>
          </div>
          <h1 className="available-videos">
            Available Videos
          </h1>
          <SlideView 
            movie_names={this.movie_names}
            votes={this.state.votes.votes}
            updateVotes={this.updateVotes}
          />
        </React.Fragment>
      );
    }
  }
}

export default App;