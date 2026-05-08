import React, { useRef, useEffect } from "react";
import * as faceapi from "face-api.js";

function FaceMood({ onMoodDetected }) {
  const videoRef = useRef();

  useEffect(() => {
    loadModels();
    startVideo();
  }, []);

  const loadModels = async () => {
    const MODEL_URL = "/models";

    await faceapi.nets.tinyFaceDetector.loadFromUri(MODEL_URL);
    await faceapi.nets.faceExpressionNet.loadFromUri(MODEL_URL);
  };

  const startVideo = () => {
    navigator.mediaDevices
      .getUserMedia({ video: true })
      .then((stream) => {
        videoRef.current.srcObject = stream;
      })
      .catch((err) => console.error(err));
  };

  const detectMood = async () => {
    const detections = await faceapi
      .detectSingleFace(
        videoRef.current,
        new faceapi.TinyFaceDetectorOptions()
      )
      .withFaceExpressions();

    if (!detections) return;

    const expressions = detections.expressions;

    const mood = Object.keys(expressions).reduce((a, b) =>
      expressions[a] > expressions[b] ? a : b
    );

    console.log("Detected:", mood);

    onMoodDetected(mood);
  };

  return (
    <div className="face-box">
      <video ref={videoRef} autoPlay muted width="250" />
      <button onClick={detectMood}>📷 Detect Mood</button>
    </div>
  );
}

export default FaceMood;