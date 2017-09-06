# Video Player

React app for uploading video files and playback.

## Deployment

You will need [npm](https://www.npmjs.com/get-npm) for running the app.

1. Download the sources.
2. Run `npm install` to install the dependencies.
3. Run `npm start` to start in debug mode.

For a production build, run the below commands.

```
npm run build
npm install -g server
serve -s build
```

This starts a server on `localhost:5000` by default. The settings can be changed in `package.json`.

## Configuration

By default, the host for backend server is set as `localhost:8080`. This can be changed inside `src/videoupload/FileUploader.js`.

## Other Details

All the upload and playback related code is under `/src/videoupload`.

#### FileUploader

The `FileUploader` class is responsible for splitting and sending the files.
The video file will be split into CHUNK_SIZE sized chunks, and send to the server.
After all the chunks are sent, a GET request is made to get the video url, which
is used for playback

#### VideoUploader

This renders the UI component for selecting and uploading the file. It also creates the checksum as soon as a file is selected.

#### VideoBrowser

This class renders the `<video>` element for playback, with the video URL received after uploading.