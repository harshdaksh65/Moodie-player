import React from 'react'
import FaceDetector from './components/FaceDetector'
import MoodSongs from './components/MoodSongs'
import { useState } from 'react';

function App() {
  const [songs, setSongs] = useState([]);
  return (
    <div className='flex flex-col p-10 min-h-screen '>
      <h1 className='text-3xl font-bold mb-4'>Face Expression Detection</h1>
      <FaceDetector setSongs={setSongs} />
      <MoodSongs songs={songs} />
    </div>
  )
}

export default App