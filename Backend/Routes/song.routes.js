const express = require('express');
const router = express.Router();

const multer = require('multer');
const songModel = require('../models/song.model');
const uploadFile = require('../service/storage.service');
const upload = multer({storage: multer.memoryStorage()});

router.post('/songs',upload.single("audio"),async (req,res)=>{
    console.log(req.body);
    console.log(req.file);
    const fileData  = await uploadFile(req.file);

    const song = await songModel.create({
        title:req.body.title,
        cover:req.body.cover,
        artist:req.body.artist,
        audio:fileData.url,
        mood:req.body.mood
    })
    
    res.status(201).json({
        message: 'Song created successfully',
        song: song
    });
    
})

router.get('/songs',async(req,res)=>{
    const {mood} = req.query; /* mood = sad */

    const songs = await songModel.find({
  mood: { $regex: new RegExp(`^${mood}$`, 'i') }
});

    res.status(200).json({
        message:"Songs fetched successfully",
        songs
    })
    
})



module.exports = router;