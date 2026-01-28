const express = require('express');
const cors = require('cors');
const { Sequelize, DataTypes } = require('sequelize');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

// Database Connection
const sequelize = new Sequelize(
  process.env.DB_NAME || 'students_db',
  process.env.DB_USER || 'user',
  process.env.DB_PASSWORD || 'password',
  {
    host: process.env.DB_HOST || 'localhost',
    dialect: 'postgres',
  }
);

// Student Model
const Student = sequelize.define('Student', {
  name: {
    type: DataTypes.STRING,
    allowNull: false
  },
  age: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  email: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true
  }
});

// Routes
app.get('/students', async (req, res) => {
  try {
    const students = await Student.findAll();
    res.json(students);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.post('/students', async (req, res) => {
  try {
    const student = await Student.create(req.body);
    res.status(201).json(student);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

app.put('/students/:id', async (req, res) => {
  try {
    const student = await Student.findByPk(req.params.id);
    if (student) {
      await student.update(req.body);
      res.json(student);
    } else {
      res.status(404).json({ error: 'Student not found' });
    }
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

app.delete('/students/:id', async (req, res) => {
  try {
    const student = await Student.findByPk(req.params.id);
    if (student) {
      await student.destroy();
      res.status(204).send();
    } else {
      res.status(404).json({ error: 'Student not found' });
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Sync DB and Start Server
const startServer = async () => {
    try {
        await sequelize.authenticate();
        console.log('Database connected...');
        await sequelize.sync(); // Create tables if not exist
        app.listen(PORT, () => {
            console.log(`Server running on port ${PORT}`);
        });
    } catch (err) {
        console.error('Unable to connect to the database:', err);
        // Retry logic for docker-compose startup delay could go here, 
        // but for now we'll rely on restarts or manual wait-for-it
        setTimeout(startServer, 5000); 
    }
};

startServer();
