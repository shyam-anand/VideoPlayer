import React from 'react';

export default class VideoBrowser extends React.Component {

	constructor(props) {
		super(props);
		
		this.state = {
			videoUrl: this.props.video,
			videoTitle: this.props.title
		}
	}

	render() {
		return (
			<div className="section">
				{this.props.video ?
				<div className="sectioncontainer has-text-centered">
					<video src={this.props.video} autoPlay controls>
		            Sorry! Doesn't look like your browser supports embedded videos.
		            </video>
		            <h2 className="title is-4">{this.props.title}</h2>
				</div>
				: ''}
				<div className="section columns">
				{this.videoList ? 
					<div className="column">
						<div className="box">
							<article className="media">
								<div className="media-left">
									<figure className="image is-128x128">
										<img src="http://bulma.io/images/placeholders/128x128.png" alt="Thumbnail" />
									</figure>
								</div>
								<div className="media-content">
									<div className="content">
										<p>
											<strong>Video Title</strong>
											&nbsp;<small>tag1, tag2</small>
											<br/>
											This is the video's description.
										</p>
									</div>
								</div>
							</article>
						</div>
					</div>
					: '' }
				</div>
			</div>
			);
	}
}