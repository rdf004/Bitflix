import React from 'react';


class MovieBlock extends React.Component {
    constructor() {
        super();
        this.state = {
            voted: false,
            text: "Vote",
            color: "white",
            loaded: false
        }
        this.poster = '';
        this.summary = '';
        this.runtime = '';
        this.year = '';
        this.genre = '';

    }

    componentWillMount() {
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
        let url = `http://www.omdbapi.com/?apikey=a3e4e704&t=${this.props.title}`
        fetch(url)
            .then((resp) => resp.json())
            .then( (data) => {
                console.log(data['Poster']);
                console.log(this);
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
        if(this.state.voted === false) {
            this.setState({voted: true, text: "Voted!", color: "red"})
            this.props.updateVotes(this.props.title, true, this.props.uid);
            
        } else {
            this.setState({voted: false, text: "Vote", color: "white"})
            this.props.updateVotes(this.props.title, false, this.props.uid)
        }
    }


    render() {
        if(this.state.loaded === false) {
            return <div>Loading!</div>
        } else {
        return (
            <div className="movieBlock-div">
                <img className="movieBlock-poster" src={`${this.poster}`} />
                {/*
                <ul className="movieBlock-ul">
                    <li className="movieBlock-li">
                        <button 
                            className="movieBlock-vote-button"
                            onClick={this.switchState}
                            style={{backgroundColor:this.state.color}}
                        >
                            {this.state.text}
                        </button>
                    </li>
                    <li className="movieBlock-li">
                        <h4 className="movieBlock-title">
                            {this.props.title}
                        </h4>
                    </li>
                    <li className="movieBlock-li">
                        <h4 className="movieBlock-length">
                            {this.runtime}
                        </h4>
                    </li>
                    <li className="movieBlock-li">
                        <h4 className="movieBlock-summary">
                            {this.summary}
                        </h4>
                    </li>
                </ul>
                */}
            </div>
        );
        }
    }
}

export default MovieBlock;