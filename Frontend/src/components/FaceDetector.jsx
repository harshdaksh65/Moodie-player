import React, { useRef, useEffect, useState } from "react";
import * as faceapi from "face-api.js";
import { Brain, Sparkles } from "lucide-react";
import axios from "../api/axiosconfig"; // Adjust the import path as necessary



const FaceDetector = ({ setSongs }) => {
  const videoRef = useRef();
  const [expression, setExpression] = useState("");
  const [allExpressions, setAllExpressions] = useState({});

  // Load models
  const loadModels = async () => {
    const MODEL_URL = "/models";
    await faceapi.nets.tinyFaceDetector.loadFromUri(MODEL_URL);
    await faceapi.nets.faceExpressionNet.loadFromUri(MODEL_URL);
  };

  // Start video stream
  const startVideo = () => {
    navigator.mediaDevices
      .getUserMedia({ video: true })
      .then((stream) => {
        videoRef.current.srcObject = stream;
      })
      .catch((err) => console.error("Error accessing webcam: ", err));
  };

  // Detect expressions
  async function detectMood() {
    setExpression("Detecting...");
    setSongs([]); // Optionally clear songs while detecting

    setTimeout(async () => {
      const detections = await faceapi
        .detectAllFaces(videoRef.current, new faceapi.TinyFaceDetectorOptions())
        .withFaceExpressions();
      let mostProableExpression = 0;
      let _expression = "";

      // After detections
      if (!detections || detections.length === 0) {
        setExpression("No face detected");
        setAllExpressions({});
        setSongs([]);
        return;
      }

      // Save all expressions/confidence
      setAllExpressions(detections[0].expressions);

      for (const expression of Object.keys(detections[0].expressions)) {
        if (detections[0].expressions[expression] > mostProableExpression) {
          mostProableExpression = detections[0].expressions[expression];
          _expression = expression;
        }
      }
      // console.log("Detected expression: ", _expression);
      setExpression(_expression);

      axios
        .get(`/songs?mood=${_expression}`)
        .then((response) => {
          // console.log(response.data);
          setSongs(response.data.songs);
        });
    }, 2000);
  }

  useEffect(() => {
    loadModels().then(startVideo);
    // console.log("API base URL:", import.meta.env.VITE_API_URL);
  }, []);

  return (
    <div className="backdrop-blur-lg bg-white/10 rounded-2xl p-4 sm:p-6 border border-white/20 shadow-xl">
      <div className="flex flex-col lg:flex-row gap-6 lg:gap-8">
        {/* Camera Stream */}
        <div className="flex flex-col items-center">
          <video
            ref={videoRef}
            autoPlay
            muted
            className="
            w-full
            max-w-xs
            sm:max-w-md
            md:max-w-lg
            lg:w-[28rem]
            lg:h-auto
            aspect-square
            lg:aspect-[16/9]
            rounded-2xl
            mb-4
            shadow-lg
            object-cover
          "
          />
          {/* Detect Mood button for mobile only */}
          <button
            onClick={detectMood}
            disabled={
              expression === ""
                ? false
                : expression === "No face detected"
                ? false
                : false
            }
            className={`relative px-6 py-3 sm:px-8 sm:py-4 rounded-xl font-bold text-base sm:text-lg transition-all duration-300 my-6 block lg:hidden ${
              expression === "Detecting..."
                ? "bg-purple-500/30 text-purple-300 cursor-not-allowed"
                : "bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white shadow-lg hover:shadow-xl transform hover:scale-105"
            }`}
          >
            <div className="flex items-center justify-center space-x-2 sm:space-x-3">
              {expression === "Detecting..." ? (
                <>
                  <div className="animate-spin">
                    <Brain size={20} />
                  </div>
                  <span className="text-sm sm:text-base">
                    Analyzing Expression...
                  </span>
                </>
              ) : (
                <>
                  <span className="animate-bounce">
                    <Sparkles size={20} />
                  </span>
                  <span className="text-sm sm:text-base">Detect Mood</span>
                </>
              )}
            </div>
            {expression === "Detecting..." && (
              <div className="absolute inset-0 rounded-xl bg-gradient-to-r from-purple-500/20 to-pink-500/20 animate-pulse"></div>
            )}
          </button>
        </div>

        {/* Mood Detection Result */}
        <div className="flex-1 min-w-[180px] bg-white/10 rounded-xl p-3 sm:p-4 border border-white/20 shadow-lg h-fit">
          <h3 className="text-base sm:text-lg font-bold mb-3 sm:mb-4 text-white">
            Mood Detection Result
          </h3>
          {expression === "No face detected" ? (
            <div className="text-red-500 font-semibold">No face detected</div>
          ) : Object.keys(allExpressions).length > 0 ? (
            (() => {
              // Find the highest confidence expression
              const [maxMood, maxConfidence] = Object.entries(
                allExpressions
              ).reduce((max, curr) => (curr[1] > max[1] ? curr : max));
              return (
                <div className="space-y-3">
                  <div>
                    <div className="flex justify-between mb-1">
                      <span className="capitalize text-white text-sm sm:text-base">
                        {maxMood}
                      </span>
                      <span className="text-white text-sm sm:text-base">
                        {(maxConfidence * 100).toFixed(1)}%
                      </span>
                    </div>
                    <div className="w-full h-2 sm:h-3 bg-gray-300 rounded-full overflow-hidden">
                      <div
                        className="h-2 sm:h-3 bg-gradient-to-r from-purple-400 to-blue-700"
                        style={{ width: `${maxConfidence * 100}%` }}
                      ></div>
                    </div>
                  </div>
                </div>
              );
            })()
          ) : (
            <div className="text-gray-400">...</div>
          )}
          {/* Detect Mood button for desktop only, placed below the result */}
          <button
            onClick={detectMood}
            disabled={
              expression === ""
                ? false
                : expression === "No face detected"
                ? false
                : false
            }
            className={`relative px-6 py-3 sm:px-8 sm:py-4 rounded-xl font-bold text-base sm:text-lg transition-all duration-300 mt-6 hidden lg:block ${
              expression === "Detecting..."
                ? "bg-purple-500/30 text-purple-300 cursor-not-allowed"
                : "bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white shadow-lg hover:shadow-xl transform hover:scale-105"
            }`}
          >
            <div className="flex items-center justify-center space-x-2 sm:space-x-3">
              {expression === "Detecting..." ? (
                <>
                  <div className="animate-spin">
                    <Brain size={20} />
                  </div>
                  <span className="text-sm sm:text-base">
                    Analyzing Expression...
                  </span>
                </>
              ) : (
                <>
                  <span className="animate-bounce">
                    <Sparkles size={20} />
                  </span>
                  <span className="text-sm sm:text-base">Detect Mood</span>
                </>
              )}
            </div>
            {expression === "Detecting..." && (
              <div className="absolute inset-0 rounded-xl bg-gradient-to-r from-purple-500/20 to-pink-500/20 animate-pulse"></div>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

export default FaceDetector;
