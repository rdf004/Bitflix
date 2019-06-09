import React, { Component } from 'react';
import NavBar from './NavBar';
import MovieBlock from './MovieBlock';
import base, { firebaseApp } from '../base'
import Login from './Login';
import * as firebase from 'firebase';
import SlideView from './SlideView';
import { Progress } from 'react-sweet-progress';
import "react-sweet-progress/lib/style.css";

class App extends Component {
  constructor() {
    super();
    this.state = {
      isLoaded: false,
      uid: null,
      votes: null,
      loggedIn: false,
      movies: null
    }
    let thisdoc = firebaseApp.firestore().collection('movie_names').doc('movie_names');
  }

  updateVotes = (title, add) => {
    console.log(`update votes ${title}`)
    if(add === true) {
      let temp = this.state.votes.votes;
      temp.push(title);
      this.setState({
        votes: {votes: temp, total_spent: (this.state.votes.total_spent + this.state.movies[title])}
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
      let temp = this.state.votes.votes;
      temp.splice(temp.indexOf(title), 1);
      this.setState({
        votes: {votes: temp, total_spent: (this.state.votes.total_spent - this.state.movies[title])}
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
    base.removeBinding(this.moviesRef);
    // We stored reference to database in this.ref so we can remove it when we leave
  }


  authHandler = async (authData) => {
    this.setState({
      uid: authData.user.uid
    })
    // Look up current store in firebase database

    // As soon as the state changes, the render() is automatically called. I wonder if I can put the sync first?
    // Will setting votes re-call render and bring login page back? No.
  }

  authenticate = (provider) => {
    const authProvider = new firebase.auth[`${provider}AuthProvider`]();
    firebase
      .auth()
      .signInWithPopup(authProvider)
      .then(this.authHandler)
      .then(() => {
        console.log(this.state.uid);
        this.setup(this.state.uid);
      });
    firebase.auth().setPersistence(firebase.auth.Auth.Persistence.LOCAL);
    
  }

  logout = () => {
    this.setState({
      loggedIn: false
    });
    localStorage.removeItem('authUser');
    firebase.auth().signOut().then(function() {
      return true;
    }, function(error) {
      alert("Fuck you error");
    });
  }

  componentWillMount() {
    var user = firebase.auth().currentUser;
    firebase.auth().onAuthStateChanged(user => {
      if (user) {
        console.log("Fuq");
        console.log(user.uid);
        this.setup(user.uid);
      } else{ 
        console.log("Bruh");
      }
    });
  }

  componentDidMount() {
      // Set movies and prices in state
    /*
    if(user) {
      console.log("Fuq");
      this.setup(JSON.parse(user).user.uid);
    } else {
      console.log("Bruh");
    }
    */

    // This caused an error because there was no binding to remove
    /*
    if(localStorage.getItem('authUser')) {
      console.log("Shit");
      console.log(JSON.parse(localStorage.getItem('authUser')).user.uid)
      this.setState({
        loggedIn: true,
        uid: JSON.stringify(JSON.parse(localStorage.getItem('authUser')).user.uid)
      })
    } else {
      console.log("Fuck");
    }
    */
  }

  setup = (uid) => {
    var docExists = firebaseApp.firestore().collection('users').doc(uid).get()
      .then(doc => {
        console.log(uid);
        if(!doc.exists) {
          var data = {
            votes: [],
            total_spent: 0
          };
          base.addToCollection('users', data, uid)
            .then(() => {
              this.ref = base.syncDoc(`users/${uid}`, {
                context: this,
                state: 'votes'
              });
              console.log(`Success in adding ${uid} to users`)
              let thisdoc = firebaseApp.firestore().collection('users').doc(uid);
              thisdoc.get().then(mydoc => {
                  console.log("Low key tryna smash Emma Watson");
                  this.setState({
                    uid: uid,
                    votes: {votes: mydoc.data().votes, total_spent: mydoc.data().total_spent},
                    loggedIn: true
                     // I mispelled votes in both state one and data().votes
                  })
              })
            }).catch(err => {
              alert(err);
          });
        } else {
          console.log("Yite");
          this.ref = base.syncDoc(`users/${uid}`, {
            context: this,
            state: 'votes',
          });
          let thisdoc = firebaseApp.firestore().collection('users').doc(uid);
          thisdoc.get().then(mydoc => {
              this.setState({
                uid: uid,
                votes: {votes: mydoc.data().votes, total_spent: mydoc.data().total_spent}, // You have to redo it because syncState only mirrors the next movements
                loggedIn: true
                 // I mispelled votes in both state one and data().votes
              })
              console.log(this.state);
            })
        }
        console.log(this.state);
      });
    let moviesDoc = firebaseApp.firestore().collection('movie_names').doc('movie_names');
    moviesDoc.get().then(mydoc => {
      this.setState({
        movies: mydoc.data()
      });
      // console.log(`Did step, state.movies is ${this.state.movies}`);
    })
  }


  render() {
    if((!this.state.uid) || (this.state.loggedIn == false)) {
      return <Login authenticate={this.authenticate} />
    } 
   else {
    return (
      <React.Fragment>
        <NavBar logout={this.logout}/>
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
        <div className="available-vids-div">
          <h1 className="available-videos">
            Available Videos
          </h1>
          <div className="votes-left-in-available-vids">
            <h3 className="votes-left" >Votes Used:</h3>
            {console.log(this.state)}
            <Progress className="progress-available-movies" percent={Math.round( (this.state.votes.total_spent/600*100) * 10)/10 } status="active" />
          </div>
          <SlideView className="slideview-on-app"
            votes={this.state.votes}
            updateVotes={this.updateVotes}
            movie_names_votes={this.state.movies}
          />
        </div>
        
      </React.Fragment>
    );
  }
}
}

export default App;

/*

        <div className="votes-div">
          <h1 className="available-videos">
            Votes Used
          </h1>
          <div className="progressbar">
            {console.log(this.state)}
            <Progress percent={Math.round( (this.state.votes.total_spent/600*100) * 10)/10 } status="active" />
          </div>
        </div>

  render() {
    // console.log("App render");
    if((!this.state.uid) || (this.state.loggedIn == false)) {
      return <Login authenticate={this.authenticate} />
    } 

   else {
    return (
      <React.Fragment>
        <NavBar logout={this.logout}/>
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
        <div className="available-vids-div">
          <h1 className="available-videos">
            Available Videos
          </h1>
          <div className="votes-left-in-available-vids">
            <h3 className="votes-left" >Votes Left:</h3>
            <Progress className="progress-available-movies" percent={Math.round( (this.state.votes.total_spent/600*100) * 10)/10 } status="active" />
          </div>
          <SlideView className="slideview-on-app"
            votes={this.state.votes}
            updateVotes={this.updateVotes}
            movie_names_votes={this.state.movies}
          />
        </div>
        <div className="votes-div">
          <h1 className="available-videos">
            Votes Used
          </h1>
          <div className="progressbar">
            <Progress percent={Math.round( (this.state.votes.total_spent/600*100) * 10)/10 } status="active" />
          </div>
        </div>
        
      </React.Fragment>
    );
  }
}
}

*/