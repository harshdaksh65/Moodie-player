import React, { useState, useRef } from "react";
import BlurText from "./BlurText";

function MoodSongs({ songs }) {
  const [isPlaying, setIsPlaying] = useState(null);
  const [progress, setProgress] = useState({});
  const [duration, setDuration] = useState({});
  const audioRefs = useRef([]);

  const handlePlayPause = (index) => {
    if (isPlaying === index) {
      audioRefs.current[index].pause();
      setIsPlaying(null);
    } else {
      if (isPlaying !== null && audioRefs.current[isPlaying]) {
        audioRefs.current[isPlaying].pause();
      }
      audioRefs.current[index].play();
      setIsPlaying(index);
    }
  };

  const handleTimeUpdate = (index) => {
    const audio = audioRefs.current[index];
    setProgress((prev) => ({
      ...prev,
      [index]: audio.currentTime,
    }));
    setDuration((prev) => ({
      ...prev,
      [index]: audio.duration,
    }));
  };

  const handleSliderChange = (index, value) => {
    const audio = audioRefs.current[index];
    audio.currentTime = value;
    setProgress((prev) => ({
      ...prev,
      [index]: value,
    }));
  };

  const formatTime = (timeInSeconds) => {
    if (!timeInSeconds || isNaN(timeInSeconds)) return "0:00";
    const minutes = Math.floor(timeInSeconds / 60);
    const seconds = Math.floor(timeInSeconds % 60);
    return `${minutes}:${seconds.toString().padStart(2, "0")}`;
  };

  const getRemainingTime = (index) => {
    const currentTime = progress[index] || 0;
    const totalDuration = duration[index] || 0;
    const remaining = totalDuration - currentTime;
    return `-${formatTime(remaining)}`;
  };

  const getProgressPercentage = (index) => {
    const currentTime = progress[index] || 0;
    const totalDuration = duration[index] || 0;
    return totalDuration > 0 ? (currentTime / totalDuration) * 100 : 0;
  };

  

  return songs ? (
    <div className=" backdrop-blur-lg bg-white/10 rounded-2xl p-6 border border-white/20 shadow-xl">
      <div className="max-w-2xl mx-auto">
        <BlurText
          text="Recommended Songs"
          delay={150}
          animateBy="words"
          direction="top"
          
          className="text-4xl text-white text-center font-semibold mb-8"
        />
        <div className="space-y-4">
          {songs.map((song, index) => (
            <div
              key={index}
              className="backdrop-blur-lg bg-white/3 rounded-2xl p-4 sm:p-6 border border-white/20 shadow-xl">
              {/* Song Info and Controls */}
              <div className="flex items-center justify-between ">
                <div className="flex items-center mb-4">
                  <div className="w-16 h-16 rounded-full border-4 border-gray-300 bg-gray-500 flex items-center justify-center mr-4 shadow-lg overflow-hidden">
                    <img
                      src={song.cover}
                      alt="Album cover"
                      className="w-full h-full object-contain shadow-md"
                    />
                  </div>

                  {/* Song Details */}
                  <div className="flex-1">
                    <h2 className="text-lg font-bold text-gray-900">
                      {song.title}
                    </h2>
                    <p className="text-gray-900 text-sm mb-1">{song.artist}</p>
                  </div>
                </div>

                {/* Control Buttons */}
                <div className="flex items-center justify-center space-x-8 mb-6">
                  <button
                    onClick={() => handlePlayPause(index)}
                    className="transition-all duration-200 shadow-lg hover:shadow-xl">
                    {isPlaying === index ? (
                      <img
                        width="35"
                        height="50"
                        src="https://img.icons8.com/ios/50/circled-pause.png"
                        alt="circled-pause"
                      />
                    ) : (
                      <img
                        width="35"
                        height="50"
                        src="https://img.icons8.com/ios/50/circled-play.png"
                        alt="circled-play"
                      />
                    )}
                  </button>
                </div>
              </div>

              {/* Animated Progress Slider */}
              <div
                className={`transition-all duration-500 ease-in-out overflow-hidden ${
                  isPlaying === index
                    ? "max-h-20 opacity-100 transform translate-y-0"
                    : "max-h-0 opacity-0 transform translate-y-4"
                }`}>
                <div className="space-y-2">
                  {/* Progress Bar */}
                  <div className="relative">
                    <div className="w-full h-1 bg-gray-200 rounded-full">
                      <div
                        className="h-1 bg-gray-800 rounded-full transition-all duration-300 relative"
                        style={{
                          width: `${getProgressPercentage(index)}%`,
                        }}></div>
                    </div>
                    {/* Invisible range input for interaction */}
                    <input
                      type="range"
                      min={0}
                      max={duration[index] || 0}
                      step={0.01}
                      value={progress[index] || 0}
                      onChange={(e) =>
                        handleSliderChange(index, parseFloat(e.target.value))
                      }
                      className="absolute top-0 left-0 w-full h-1 opacity-0 cursor-pointer"
                      disabled={!duration[index]}
                    />
                  </div>

                  {/* Time Display */}
                  <div className="flex justify-between text-xs text-gray-900">
                    <span>{formatTime(progress[index])}</span>
                    <span>{getRemainingTime(index)}</span>
                  </div>
                </div>
              </div>

              {/* Static time display when not playing */}
              <div
                className={`transition-all duration-500 ease-in-out ${
                  isPlaying !== index
                    ? "opacity-100 transform translate-y-0"
                    : "opacity-0 transform -translate-y-4 absolute"
                }`}>
                <div className="flex justify-between text-xs text-gray-900">
                  <span>0:00</span>
                  <span>-{formatTime(duration[index])}</span>
                </div>
              </div>

              {/* Hidden Audio Element */}
              <audio
                ref={(el) => (audioRefs.current[index] = el)}
                src={song.audio}
                onTimeUpdate={() => handleTimeUpdate(index)}
                onLoadedMetadata={() => handleTimeUpdate(index)}
                onEnded={() => setIsPlaying(null)}
                style={{ display: "none" }}
              />
            </div>
          ))}
        </div>
      </div>
    </div>
  ) : (
    <div className="">
    </div>
  );
}

export default MoodSongs;
