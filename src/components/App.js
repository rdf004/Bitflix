import React, { Component } from 'react';
import NavBar from './NavBar';
import MovieBlock from './MovieBlock';
//import firebaseApp from '../base'
import firebase from './Firebase';
import Login from './Login';
//import firebase from 'firebase';

class App extends Component {
  constructor() {
    super();
    this.state = {
      votes: ["Voted for: "]
    }
  }

  ACCOUNT_NAME = "roshandf";

  django_summary = "Two years before the Civil War, Django (Jamie Foxx), a slave, finds himself accompanying an unorthodox German bounty hunter named Dr. King Schultz (Christoph Waltz) on a mission to capture the vicious Brittle brothers."
  pf_summary = "Vincent Vega (John Travolta) and Jules Winnfield (Samuel L. Jackson) are hitmen with a penchant for philosophical discussions.";

  updateVotes = (title, add) => {
    if(add === true) {
      let temp = this.state.votes;
      temp.push(title);
      this.setState({
        votes: temp
      })
      let movie_votes_temp = [];
      let thisdoc = firebase.firestore().collection('movie_votes').doc(title);
      thisdoc.get()
        .then(myDoc => {
          if(!myDoc.exists) {
            console.log('No such document!');
          } else {
            // console.log('Document data:', myDoc.data());
            movie_votes_temp = myDoc.data().voters;
            movie_votes_temp = movie_votes_temp.concat([this.ACCOUNT_NAME]);
            console.log(movie_votes_temp)
            thisdoc.set({
              voters: movie_votes_temp
            })
          }
        });

    } else {
      let temp = this.state.votes;
      temp.splice(temp.indexOf(title), 1);
      this.setState({
        votes: temp
      })
      let movie_votes_temp = [];
      let thisdoc = firebase.firestore().collection('movie_votes').doc(title);
      thisdoc.get()
        .then(myDoc => {
          if(!myDoc.exists) {
            console.log('No such document!');
          } else {
            // console.log('Document data:', myDoc.data());
            movie_votes_temp = myDoc.data().voters;
            let index = (movie_votes_temp.indexOf(this.ACCOUNT_NAME));
            movie_votes_temp.splice(index, 1)
            console.log(movie_votes_temp)
            thisdoc.set({
              voters: movie_votes_temp
            })
          }
        });

    }
  }

  authHandler = async (authData) => {
    console.log(authData);
  }
  /*
  authenticate = (provider) => {
    const authProvider = new firebase.auth[`${provider}AuthProvider`]();
    firebaseApp
      .auth()
      .signInWithPopup(authProvider)
      .then(this.authHandler);
  }
  */

  render() {
    return (
      <React.Fragment>
        <NavBar />
        <p>{this.state.votes}</p>
        <h1 className="available-videos">
          Available Videos
        </h1>
        <MovieBlock 
          title="Django: Unchained" 
          length="2 hr 45 min"
          summary={this.django_summary}
          updateVotes={this.updateVotes}
        />
        <MovieBlock 
          title="Pulp Fiction" 
          length="2 hr 58 min"
          summary={this.pf_summary}
          updateVotes={this.updateVotes}
        />
      </React.Fragment>
    );
  }
}

export default App;
