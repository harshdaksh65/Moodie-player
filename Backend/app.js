const express = require('express');
const app = express();
const songRoutes = require('./Routes/song.routes');

const cors = require('cors');
app.use(cors());
app.use(express.json());

app.use('/', songRoutes);


module.exports = app;