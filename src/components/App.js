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
            //console.log(movie_votes_temp); // logs "[]"
            //console.log(this.state.uid);
            movie_votes_temp.push(this.state.uid);
            //console.log("Saggy balls"); // logs "undefined" YOU DUMB BITCH ITS STATE NOT PROPS
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

  componentDidMount() {
    const { params } = this.props.match;
    //console.log(base.get(`users/${params.userId}/votes`));
    this.ref = base.syncDoc(`users/${params.userId}`, {
        context: this,
        state: 'votes'
    });
  }

  componentWillUnmount() {
    base.removeBinding(this.ref);
    // We stored reference to database in this.ref so we can remove it when we leave
  }


  authHandler = async (authData) => {
    // Look up current store in firebase database
    const user = await base.get(`users/${authData.user.uid}`, { context: this });
    //console.log(user)
    // Claim it if there is no owner
    // Set the state of the inventory component to reflect the current user
    //console.log(authData);
    // console.log(user.votes);
    this.setState({
      uid: authData.user.uid
    });
    //console.log("Monster");
    /*
    var movies = firebase.firestore().collection('movies').get().then((querySnapshot) => {
      querySnapshot.forEach((collection) => {
          console.log("Hey there delilah");
          this.movie_list.push(collection.id)
        });
    });
    */
  }

  authenticate = (provider) => {
    const authProvider = new firebase.auth[`${provider}AuthProvider`]();
    // WTF WHY DOES FIREBASE WORK BUT FIREBASEAPP NOT??? {firebaseApp} vs. firebaseApp...
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
          <p>{console.log(this.state.votes)}</p>
          <h1 className="available-videos">
            Available Videos
          </h1>
          <ul>
            {this.movie_list.map(key => (
              <MovieBlock
                title={key}
                length={"1 hour"}
                summary={"Fuck you"}
                updateVotes={this.updateVotes}
                uid={this.props.uid}
                userVoted={this.state.votes.votes.includes(key) ? true : false}
              />
            ))}
          </ul>
        </React.Fragment>
      );
    }
      /*
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
          userVoted={false}
        />
        <MovieBlock 
          title="Pulp Fiction" 
          length="2 hr 58 min"
          summary={this.pf_summary}
          updateVotes={this.updateVotes}
          userVoted={false}
        />
      </React.Fragment>
      */
  }
}

export default App;

/*

          <MovieBlock 
            title="Django: Unchained" 
            length="2 hr 45 min"
            summary={this.django_summary}
            updateVotes={this.updateVotes}
            userVoted={false}
          />
          <MovieBlock 
            title="Pulp Fiction" 
            length="2 hr 58 min"
            summary={this.pf_summary}
            updateVotes={this.updateVotes}
            userVoted={false}
          />



           <MovieBlock
                title={base.get(`movies/${currentValue}/title`, { context: this })}
                length={base.get(`movies/${currentValue}/length`, { context: this })}
                summary={base.get(`movies/${currentValue}/summary`, { context: this })}
                updateVotes={this.updateVotes}
                userVoted={this.state.votes.includes(currentValue) ? true : false}
              />
*/