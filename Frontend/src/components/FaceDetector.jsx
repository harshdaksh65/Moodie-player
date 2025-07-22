import React, { useRef, useEffect, useState } from "react";
import * as faceapi from "face-api.js";
import axios from "axios";

const FaceDetector = ({ setSongs }) => {
  const videoRef = useRef();
 

  // Load models
  const loadModels = async () => {
        const MODEL_URL = '/models';
        await faceapi.nets.tinyFaceDetector.loadFromUri(MODEL_URL);
        await faceapi.nets.faceExpressionNet.loadFromUri(MODEL_URL);
    };

  // Start video stream
  const startVideo = () => {
        navigator.mediaDevices.getUserMedia({ video: true })
            .then((stream) => {
                videoRef.current.srcObject = stream;
            })
            .catch((err) => console.error("Error accessing webcam: ", err));
    };

    

  // Detect expressions
   async function detectMood() {

        const detections = await faceapi
            .detectAllFaces(videoRef.current, new faceapi.TinyFaceDetectorOptions())
            .withFaceExpressions();
        let mostProableExpression = 0
        let _expression = '';

        if (!detections || detections.length === 0) {
            console.log("No face detected");
            return;
        }

        for (const expression of Object.keys(detections[ 0 ].expressions)) {
            if (detections[ 0 ].expressions[ expression ] > mostProableExpression) {
                mostProableExpression = detections[ 0 ].expressions[ expression ]
                _expression = expression;
            }
        }
        console.log("Detected expression: ", _expression);

        axios.get(`http://localhost:3000/songs?mood=${_expression}`)
        .then(response=>{
            console.log(response.data);
            setSongs(response.data.songs);
        })
    }
    

  useEffect(() => {
    loadModels().then(startVideo);
  }, []);

  return (
    <div className='flex flex-col items-center gap-4 max-w-2xl mx-auto mb-6' >
            <video
                ref={videoRef}
                autoPlay
                muted
                className='w-[20rem] aspect-ratio[16/9] rounded-xl'
            />
            <button className="bg-gray-500 font-semibold text-white py-2 px-4 rounded-lg" onClick={detectMood}>Detect Mood</button>
        </div>
  );
};

export default FaceDetector;
