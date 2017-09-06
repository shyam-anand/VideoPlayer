import React, { Component } from 'react';
import logo from './logo.svg';
// import './App.css';
import 'bulma/css/bulma.css';
import VideoUploader from './videoupload/VideoUploader.js';
import VideoBrowser from './videoupload/VideoBrowser.js';

class App extends Component {

  constructor(props) {
    super(props);
    this.state = {
      video: '',
      title: ''
    }
    this.setVideo = this.setVideo.bind(this);
  }

  setVideo(url, title) {
    console.log(url, title, "setting url and title");
    this.setState({video: url, title: title});
  }

  render() {
    return (<div>
        <div className="container">
          <center><img src={logo} height="64px" width="64px" alt="logo"/></center>
          <h1 className="title has-text-centered">Video Player</h1>
        </div>
        <div className="section">
          <VideoUploader setVideo={this.setVideo} />
        </div>
        <VideoBrowser video={this.state.video} title={this.state.title} />
      </div>
    );
  }
}

export default App;
