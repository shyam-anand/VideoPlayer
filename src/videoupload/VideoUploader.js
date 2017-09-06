import React, { Component } from 'react';
import FileUploader from './FileUploader.js';
import formatBytes from './formatBytes';

import sha256 from 'js-sha256';

class VideoUploader extends Component {

	constructor(props) {
		super(props);

		this.state = {
			file: null,
			fileName: '',
			fileType: '',
			fileSize: '',
			fileSizeDisplay: "0 B",
			title: "",
			error: '',
			chunks: [],
			isUploading: false,
			uploadProgress: 0,
			creatingChecksum: false
		}
		this.setVideo = props.setVideo;
		this.fileSelected = this.fileSelected.bind(this);
		this.upload = this.upload.bind(this);
		this.handleChange = this.handleChange.bind(this);
	}

	handleChange(event) {
		const name = event.target.name;
		this.setState({[name]: event.target.value});
	}

	fileSelected(selectedFile) {
		let videoFile = selectedFile.target.files[0];
		console.log(videoFile, "file");

		if (videoFile.type.indexOf("video") !== -1) {

			var reader = new FileReader();
			reader.onload = function(event) {
				var checksum = sha256(event.target.result);
				console.log(checksum, "checksum");
				this.setState({
					error: '',
					checksum: checksum,
					creatingChecksum: false
				});
			}.bind(this);
			this.setState({creatingChecksum: true});
			reader.readAsText(videoFile);

			var genTitle = videoFile.name.substring(0, videoFile.name.lastIndexOf("."));
			genTitle = genTitle.replace(/-|_/g, " ");
			this.setState({
				title: genTitle,
				file: videoFile,
				fileName: videoFile.name,
				fileType: videoFile.type,
				fileSize: videoFile.size,
				fileSizeDisplay: formatBytes(videoFile.size, 3),
			});
			
		} else {
			this.setState({error: `Invalid file type '${videoFile.type}'`});
		}
	}

	upload() {
		this.setState({isUploading: true});

		new FileUploader(
			function(data) {
				if (data.status === true) {
					console.log(data.videoUrl, "video url");
					this.setVideo(data.videoUrl, this.state.title);
				} else {
					this.setState({error: data.error});
					console.error(data.error);
				}
				this.setState({isUploading: false});
			}.bind(this),
			function(progress) {
				this.setState({uploadProgress: progress});
			}.bind(this))
		.upload(this.state.file, this.state.checksum);
	}

	render() {
		return (<div className="columns">
			<div className="column is-4">
				<div className="field">
					<h2 className="subtitle">Upload new video</h2>
				</div>
				<div className="file field">
					<label className="file-label">
						<input className="file-input" type="file" name="video" id="fileInput" onChange={this.fileSelected} />
						<span className="file-cta">
							<span className="file-label">Select file</span>
						</span>
						{this.state.fileName ?
						<span className="file-name">{this.state.fileName}</span>
						: '' }
					</label>
				</div>
				
				<div className="field">
					<label className="label">Video Title</label>
					<div className="control">
						<input type="text" className="input" placeholder="Title" name="title" id="title" onChange={this.handleChange} value={this.state.title} disabled={this.state.file ? 'false' : 'true' } />
					</div>	
				</div>
				<div className="level">
					<div className="level-left">
						<div className="control">
						{this.state.creatingChecksum ? 
							<div className="level">
								<div className="level-left">
									<button className="button is-primary is-loading level-item" disabled>Upload</button> 
								</div>
								<div className="level-item column has-text-grey-light">Generating checksum</div>
							</div>
						: 
						<button className="button is-primary" onClick={this.upload} disabled={this.state.fileName && this.state.isUploading === false ? false : true}>Upload</button>
						}
						</div>
					</div>
					<div className="column level-item">
					{this.state.isUploading ? 
						<progress className="progress is-info" min="0" max="100" value="100">progress</progress>
						: ''
					}
					</div>
				</div>
			</div>
			<div className="column is-4">
				{this.state.error ? 
				<div className="notification has-text-centered is-danger">{this.state.error}</div>
				: this.state.file ? 
					<div className="column">
						<div className="container is-centered">
							<table className="table">
								<tbody>
									<tr>
										<th>Filename</th>
										<td>{this.state.file.name}</td>
									</tr>
									<tr>
										<th>Type</th>
										<td>{this.state.fileType}</td>
									</tr>
									<tr>
										<th>Size</th>
										<td>{this.state.fileSizeDisplay}</td>
									</tr>
								</tbody>
							</table>
						</div>
					</div>
				: this.state.uploadStatus === true ? <div className="notification is-success">File uploaded</div>
				: ''
			}
			</div>
		</div>);
	}	
}

export default VideoUploader;