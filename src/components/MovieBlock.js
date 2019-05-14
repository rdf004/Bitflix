import React from 'react';


class MovieBlock extends React.Component {
    constructor() {
        super();
        this.poster = '';
        this.summary = '';
        this.runtime = '';
        this.year = '';
        this.genre = '';
        console.log(`Constructor`);
    }

    componentWillMount() {
        console.log(`Component will mount ${this.props.title}`);
        if(this.props.userVoted === true) {
            let temp = {
                voted: true,
                text: "Voted",
                color: "red"
            }
            this.setState({
                voted: temp.voted,
                text: temp.text,
                color: temp.color
            })
        } else {
            let temp = {
                voted: false,
                text: "Vote",
                color: "white"
            }    
            this.setState({
                voted: temp.voted,
                text: temp.text,
                color: temp.color
            })      
        }
    }

    componentDidMount() {
        console.log(`Component did mount ${this.props.title}`);
        let url = `http://www.omdbapi.com/?apikey=a3e4e704&t=${this.props.title}`
        fetch(url)
            .then((resp) => resp.json())
            .then( (data) => {
                this.poster = data['Poster'];
                this.summary = data['Plot'];
                this.runtime = data['Runtime']
                this.year = data['Year']
                this.genre = data['Genre']
                this.setState({
                    loaded: true
                })
            })
            .catch(function(error) {
                console.log("Oopsie poopsie error");
            })
    }

    switchState = event => {
        event.preventDefault();
        console.log(`Switch state ${this.props.title}`);
        if(this.props.userVoted === false) {
            this.setState({voted: true, text: "Voted!", color: "red"})
            this.props.updateVotes(this.props.title, true, this.props.uid);
            
        } else {
            this.setState({voted: false, text: "Vote", color: "white"})
            this.props.updateVotes(this.props.title, false, this.props.uid)
        }
    }


    render() {
        console.log(`render ${this.props.title} ${(new Date).getSeconds()}`)
        if(this.state.loaded === false) {
            return <div>Loading!</div>
        } else {
        return (
            <div className="block-container">
            <div className="movieBlock-div">
                <img className="movieBlock-poster" src={`${this.poster}`} />
                <div className="overlay">
                    <div className="text">
                        <h2 className="hover-text">{this.props.title}</h2>
                        <h4 className="hover-text">{this.runtime}</h4>
                        <h4 className="hover-text">{this.genre}</h4>
                        <p className="hover-text-p">{this.summary}</p>
                    </div>
                </div>
            </div>
            <div className="vote-button-div">
                <button 
                    className="movieBlock-vote-button"
                    onClick={this.switchState}
                    style={this.props.userVoted ? {backgroundColor:"green"} : {backgroundColor:"black"}}
                >
                    {this.props.userVoted ? 'Voted!' : 'Vote'}
                </button>
            </div>
            </div>
        );
        }
    }
}

export default MovieBlock;
