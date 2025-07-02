const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const db = require('./models');
const userRoutes = require('./routes/user.routes');
const studentRoutes = require("./routes/student.routes");
const path = require("path");

const app = express();

// Middlewares
app.use(cors());
app.use(express.json());
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

dotenv.config();

const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use('/api', userRoutes);
app.use('/api', studentRoutes);

// Test DB and Sync Models
db.sequelize.sync({ alter: true }).then(() => {
  console.log('Database synced');
  app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}).catch((err) => {
  console.error('Database connection error:', err);
});
