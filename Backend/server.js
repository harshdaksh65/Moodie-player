require('dotenv').config();
const connectDB = require('./db/db');
const app = require('./app');

connectDB();
const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});