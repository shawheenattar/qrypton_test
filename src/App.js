import React, { useState, useEffect } from 'react';
import ReactDOM from 'react-dom';
import './App.css';
import Camera, { IMAGE_TYPES } from "react-html5-camera-photo";
import "react-html5-camera-photo/build/css/index.css";
import Webcam from "react-webcam";

class App extends React.Component {
  state = {
    loginStatus: 0,
    recognizedUsers: "NA",
    imgSrc: null,
  }

  setWebcamRef = webcam => {
    this.webcam = webcam;
  };

  setUsernameRef = name => {
    this.username = name;
  }

  setRecognizedUsers = (length, users) => {
    if (users.length > 0) {
      this.setState({
        ...this.state,
        recognizedUsers: users,
        loginStatus: length
      })
    } else {
      this.setState({
        ...this.state,
        recognizedUsers: "NA",
        loginStatus: length
      })
    }
  }

  setImgSrc = (img) => {
    if (img) {
      this.setState({
        imgSrc: img
      })
    }
  }

  handleTakePhoto(dataUri) {
    console.log(dataUri);
    fetch('/face', {
      method: "put",
      headers: {"Content-type": "application/json"},
      body: JSON.stringify({
        uri: dataUri
      })
    }).then(res => res.json()).then(data => {
      var usernames = "";
      for (var i = 0; i < data.users.length; i++) {
        usernames += data.users[i] + ", ";
      }
      this.setRecognizedUsers(data.users.length, usernames.slice(0, -2));
      // this.setImgSrc(data.users);
    }).catch(function() {
      console.log("failed connection");
    });
  }

  handleCapture() {
    const imageSrc = this.webcamRef.getScreenshot();
    this.setImgSrc(imageSrc);
  }

  // capture = () => {
  //   const imageSrc = this.webcam.getScreenshot();
  //   const username = this.username.value;
  //   this.handleTakePhoto(imageSrc);
  //   // this.setImgSrc(imageSrc);
  // };

  render() {
    return (
      <div className="App">
        <header className="App-header">
    
          <p>Current number of recognized users: {this.state.loginStatus}.</p>
          <p>Current recognized usernames: {this.state.recognizedUsers}.</p>


          <Camera
            onTakePhoto = { (dataUri) => { this.handleTakePhoto(dataUri); } }
            imageType = {IMAGE_TYPES.JPG}
            />

          {/* <Webcam
            audio={false}
            ref={this.setWebcamRef}
            screenshotFormat="image/jpeg"
          />
          <input type="text" name="username"/>
          <button onClick={this.capture}>Capture photo</button>
          {this.state.imgSrc && (
            <img
              src={this.state.imgSrc}
            />
          )} */}

        </header>
      </div>
    );
  }
  
}


// https://www.npmjs.com/package/react-webcam



export default App;
