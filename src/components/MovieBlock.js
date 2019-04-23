import React from 'react';

class MovieBlock extends React.Component {
    constructor() {
        super();
        this.state = {
            voted: false,
            text: "Vote",
            color: "white"
        }
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