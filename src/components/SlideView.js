import React from 'react';
import Slider from 'react-slick';
import "../css/_slick.css";
import "../css/_slickTheme.css";
import MovieBlock from './MovieBlock';

export default class SlideView extends React.Component {
    render() {
        return(
            <div className="slider-fragment">
                <Slider className="slider-inner-slider"
                    speed={500}
                    slidesToShow={5}
                    slidesToScroll={3}
                    infinite={true}
                    arrows={true}
                    centerMode={true}
                    draggable={true}
                    focusOnSelect={true}
                    infinite={true}

                >
                {this.props.movie_names.map(key => (
                    <MovieBlock
                        key={key}
                        title={key}
                        updateVotes={this.updateVotes}
                        uid={this.props.uid}
                        userVoted={this.props.votes.includes(key) ? true : false}
                    />
                ))}
                </Slider>
            </div>
        );
    }
}