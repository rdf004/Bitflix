import React from 'react';
import { white } from 'ansi-colors';

class MovieBlock extends React.Component {
    constructor() {
        super();

        this.state = {
            voted: false,
            text: "Vote",
            color: white
        }
    }

    switchState = event => {
        if(this.state.voted === false) {
            this.setState({voted: true, text: "Voted!", color: "red"})
            this.props.updateVotes(this.props.title, true);
            
        } else {
            this.setState({voted: false, text: "Vote", color: "white"})
            this.props.updateVotes(this.props.title, false)
        }
    }

    render() {
        return (
            <div className="movieBlock-div">
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
                            {this.props.length}
                        </h4>
                    </li>
                    <li className="movieBlock-li">
                        <h4 className="movieBlock-summary">
                            {this.props.summary}
                        </h4>
                    </li>
                </ul>
            </div>
        );
    }
}

export default MovieBlock;