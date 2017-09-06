# Video Player

React app for uploading videofile and playback.

### Usage

You will need [npm](https://www.npmjs.com/get-npm) for running the app.

1. Download the sources.
2. Run `npm install` to install the dependencies.
3. Run `npm start` to start in debug mode on localhost:3000.

For a production build, run the below commands.
`npm run build`
`npm install -g server`
`serve -s build`

By default this starts a server on localhost:5000. The settings can be changed in `package.json`.

### Configuration

By default, the host for backend server is set as 'localhost:8080'. This can be changed inside `src/videoupload/FileUploader.js'.