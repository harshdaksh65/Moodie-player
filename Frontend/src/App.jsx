import React, { useState } from 'react'
import FaceDetector from './components/FaceDetector'
import MoodSongs from './components/MoodSongs'
import { Sparkles } from 'lucide-react';
import Orb from './components/Orb';

function App() {
  const [songs, setSongs] = useState([]);
  const [moodDetected, setMoodDetected] = useState(false);

  return (
    <div className="relative min-h-screen overflow-x-hidden">
      {/* Aurora as full-page background */}
      <div className="fixed  bg-[#060010] inset-0 -z-10 w-full h-full">
        <div style={{ width: '100%', height: '600px', position: 'relative' }}>
          <Orb
            hoverIntensity={0.5}
            rotateOnHover={true}
            hue={0}
            forceHoverState={false}
          />
        </div>
      </div>
      <div className='flex flex-col gap-4 w-[90%] mx-auto mb-6 pt-4'>
        <div className="flex items-center justify-center mb-2 ">
          <h1
            className="text-3xl xs:text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold bg-gradient-to-r from-purple-400 via-pink-400 to-yellow-400 bg-clip-text text-transparent text-center drop-shadow-lg relative transition-colors duration-1000 animate-gradient-x"
            style={{
              backgroundSize: '200% 200%',
              animation: 'gradient-move 3s ease-in-out infinite',
            }}
          >
            Moodify
            <span className="inline-block animate-bounce">
              <Sparkles size={24} className="text-purple-400 ml-2" />
            </span>
          </h1>
        </div>
        <FaceDetector
          setSongs={(songs) => {
            setSongs(songs);
            setMoodDetected(!!(songs && songs.length));
          }}
        />
        {moodDetected && <MoodSongs songs={songs} />}
      </div>
      {/* Add keyframes for gradient animation */}
      <style>
        {`
          @keyframes gradient-move {
            0% { background-position: 0% 50%; }
            50% { background-position: 100% 50%; }
            100% { background-position: 0% 50%; }
          }
        `}
      </style>
    </div>
  )
}

export default App