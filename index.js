const express = require('express');
const dotenv = require('dotenv');
const connectDB = require('./config/db');
const cors = require('cors'); 

const childRoutes = require('./routes/childRoutes'); 
const dashboardRoutes = require('./routes/dashboardRoutes'); 
const growthRoutes = require('./routes/growthRoutes'); 

const { handleGiziChat } = require('./controllers/chatController'); 

dotenv.config();
connectDB();

const app = express();
const port = process.env.PORT || 3000;

app.use(cors()); 

app.use(express.json());

app.use('/api/children', childRoutes);
app.use('/api/auth', require('./routes/authRoutes'));
app.use('/api/nutrition', require('./routes/nutritionRoutes'));
app.use('/api/dashboard', dashboardRoutes); 
app.use('/api/growth', growthRoutes); 

app.post('/api/chat', handleGiziChat);

app.get('/', (req, res) => {
  res.send('Halo! Server backend NutriScan sudah menyala dan siap menerima data.');
});

module.exports = app;