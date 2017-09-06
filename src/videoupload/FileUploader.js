export const POST = 'POST';
export const GET = 'GET';
export const HOST = 'http://localhost:8080';
export const CHUNK_SIZE = 10 * 1024 * 1024; // 10 MB

/**
 * Class with methods for uploading the file.
 * The video file will be split into CHUNK_SIZE sized chunks, and send to the server.
 * After all the chunks are sent, a GET request is made to get the video url, which
 * is used for playback
 */
export default class FileUploader {
	
	constructor(onComplete, onProgress) {
		this.CHUNK_SIZE = CHUNK_SIZE;

		this.fileChecksum = '';
		this.chunkCount = 0;
		this.uploadProgress = 0;
		this.progresses = [];

		this.onComplete = onComplete;
		this.onProgress = onProgress;
	}

	getChunks(file) {
		console.log(file.size, " file size");
		let chunks = Math.ceil(file.size/this.CHUNK_SIZE, this.CHUNK_SIZE);
		console.log(chunks, "no. of chunks");
		let chunkArray = []
		for (var i = 0; i < chunks; i++) {
			var offset = i * this.CHUNK_SIZE;
			chunkArray.push(file.slice(offset, offset + this.CHUNK_SIZE));
		}
		this.chunkCount = chunkArray.length;
		console.log(this.chunkCount, `chunks for ${this.fileName}`);
		return chunkArray;
	}

	upload(file, checksum) {
		this.fileChecksum = checksum;
		console.log(this.fileChecksum, "this.fileChecksum");
		let chunks = this.getChunks(file);

		chunks.forEach((chunk, index) => {
			var formData = new FormData();
			formData.append('chunk', chunk, `${file.name}.part${index}`);
			formData.append('checksum', this.fileChecksum);
			this.post(formData, index);
		}, this);
	}

	post(data, index) {
		var request = new XMLHttpRequest();
		request.open(POST, `${HOST}/files/parts`, true);
		request.responseType = "json";
		request.upload.onprogress = function(e) {
			var progress = e.loaded / e.total;
			this.setProgress(progress, index);
		}.bind(this);
		request.send(data);
	}

	setProgress(progress, index) {
		this.progresses[index] = progress;
		var p = this.progresses.reduce((p1, p2) => p1 + p2, 0);
		this.uploadProgress = (p / this.chunkCount) * 100;
		this.onProgress(this.uploadProgress);
		if (this.uploadProgress === 100) {
			this.uploadComplete();
		}
	}

	uploadComplete() {
		var request = new XMLHttpRequest();
		request.open(GET, `${HOST}/files/${this.fileChecksum}`);
		request.responseType = "json";
		request.onload = function(e) {
			console.log(e.target, "e.target");
			var response = e.target.response;
			if (e.target.status === 200) {
				console.log(response, "response");
				var video = `${HOST}/files/play/${response.data}/`;
				this.onComplete({status: true, videoUrl: video});
			} else {
				if (typeof response.error === "object" && response.error.details) {
					this.onComplete({error: response.details});
				} else if (response.error) {
					this.onComplete({error: response.message})
				} else {
					this.onComplete({error: response});
				}
			}
		}.bind(this);
		request.send();
	}
}























