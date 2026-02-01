// server.js

const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const dotenv = require('dotenv');
const connectDB = require('./config/db');
const authRoutes = require('./routes/authRoutes');
const projectRoutes=require('./routes/projectRoutes')
const taskRoutes=require('./routes/taskRoutes')


dotenv.config();

connectDB(); // Connect to MongoDB

const app = express();
const port = process.env.PORT || 5000;

app.use(cors());
app.use(bodyParser.json());

app.use('/api/auth', authRoutes);
app.use('/api/projects', projectRoutes);
app.use('/api', taskRoutes);
app.use('/api/tasks', taskRoutes); // This makes all routes start with /api/tasks


app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});