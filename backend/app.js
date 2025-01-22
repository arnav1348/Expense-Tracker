const express = require('express');
const cors = require('cors');
const { db } = require('./db/db');
const { readdirSync } = require('fs');
const app = express();
require('dotenv').config();

const PORT = process.env.PORT || 5000;

// Middlewares
app.use(express.json());
app.use(cors());

// Dynamically Load Routes
readdirSync('./routes').forEach((routeFile) => {
  app.use('/api/v1', require('./routes/' + routeFile));
});

// Start Server
const server = () => {
  db(); // Connect to the database
  app.listen(PORT, () => {
    console.log(`Server running on port: ${PORT}`);
  });
};

server();
