import React, { useState, useRef } from "react";
import './MoodSongs.css';

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
    setProgress(prev => ({
      ...prev,
      [index]: audio.currentTime
    }));
    setDuration(prev => ({
      ...prev,
      [index]: audio.duration
    }));
  };

  const handleSliderChange = (index, value) => {
    const audio = audioRefs.current[index];
    audio.currentTime = value;
    setProgress(prev => ({
      ...prev,
      [index]: value
    }));
  };

  return (
    <div>
      <h2 className="text-2xl font-semibold mb-4">Recommended Songs</h2>
      <ul className="list-disc pl-5">
        {songs.map((song, index) => (
          <div className="mb-2 bg-gray-500 rounded-lg px-4 py-2 flex flex-col" key={index}>
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-xl font-bold">{song.title}</h1>
                <p className="text-sm">{song.artist}</p>
              </div>
              <div className="play-pause-center">
                <button
                  className={`play-pause-circle ${isPlaying === index ? "playing" : ""}`}
                  onClick={() => handlePlayPause(index)}
                >
                  {isPlaying === index ? (
                    <svg width="32" height="32" viewBox="0 0 32 32">
                      <circle cx="16" cy="16" r="16" fill="#22c55e"/>
                      <rect x="10" y="9" width="3" height="14" rx="1.5" fill="#fff"/>
                      <rect x="19" y="9" width="3" height="14" rx="1.5" fill="#fff"/>
                    </svg>
                  ) : (
                    <svg width="32" height="32" viewBox="0 0 32 32">
                      <circle cx="16" cy="16" r="16" fill="#3b82f6"/>
                      <polygon points="12,9 24,16 12,23" fill="#fff"/>
                    </svg>
                  )}
                </button>
                <audio
                  ref={el => audioRefs.current[index] = el}
                  src={song.audio}
                  onTimeUpdate={() => handleTimeUpdate(index)}
                  onLoadedMetadata={() => handleTimeUpdate(index)}
                  onEnded={() => setIsPlaying(null)}
                  style={{ display: 'none' }}
                />
              </div>
            </div>
            <div className="slider-row">
              <span className="slider-time-right">
                {`${Math.floor((progress[index] || 0) / 60)}:${String(Math.floor(progress[index] || 0) % 60).padStart(2, '0')} / ${Math.floor((duration[index] || 0) / 60)}:${String(Math.floor(duration[index] || 0) % 60).padStart(2, '0')}`}
              </span>
              <input
                type="range"
                min={0}
                max={duration[index] || 0}
                step={0.01}
                value={progress[index] || 0}
                onChange={e => handleSliderChange(index, parseFloat(e.target.value))}
                className="song-slider"
                disabled={!duration[index]}
              />
            </div>
          </div>
        ))}
      </ul>
    </div>
  );
}

export default MoodSongs;
