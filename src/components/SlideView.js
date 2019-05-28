import React from 'react';
import Slider from 'react-slick';
import "../css/_slick.css";
import "../css/_slickTheme.css";
import MovieBlock from './MovieBlock';

export default class SlideView extends React.Component {

    createElements = () => {
        var elements = [];
        console.log(this.props.movie_names_votes);
        {console.log(this.props.votes);}
        for (let [movie_name, movie_votes] of Object.entries(this.props.movie_names_votes)) {
            elements.push(<MovieBlock
                key={movie_name}
                title={movie_name}
                updateVotes={this.props.updateVotes}
                uid={this.props.uid}
                userVoted={this.props.votes.votes.includes(movie_name) ? true : false}
            />);
        }
        return elements
    }

    render() {
        return(
            <div className="slider-fragment">
                <Slider className="slider-inner-slider"
                    speed={500}
                    slidesToShow={4}
                    slidesToScroll={1}
                    infinite={false}
                    arrows={true}
                    centerMode={false}
                    draggable={true}
                    focusOnSelect={true}

                >
                { this.createElements(this.props.movie_names_votes) }

                </Slider>
            </div>
        );
    }
}