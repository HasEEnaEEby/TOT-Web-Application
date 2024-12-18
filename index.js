const express = require('express');
const http = require('http');
const dotenv = require('dotenv');
const socketIo = require('socket.io');
const colors = require('colors');
const connectDB = require('./config/db');
const errorHandler = require('./middleware/errorHandler'); 
const { protect } = require('./middleware/authMiddleware'); 
const guestRoutes = require('./routes/guestRoutes');  
const restaurantRoutes = require('./routes/restaurantRoutes');
const orderRoutes = require('./routes/orderRoutes');
const menuRoutes = require('./routes/menuRoutes'); 
const userRoutes = require('./routes/userRoutes');
const tableRoutes = require('./routes/tableRoutes');

dotenv.config();

const app = express();
const server = http.createServer(app);
const io = socketIo(server); 

connectDB();

app.use(express.json()); 

app.use('/api/guests', guestRoutes);

app.use('/api/users', userRoutes);  
app.use('/api/restaurants', restaurantRoutes);  
app.use('/api/orders', protect, orderRoutes); 
app.use('/api', protect, menuRoutes); 
app.use('/api/tables', tableRoutes);

app.get('/', (req, res) => {
  res.send('Welcome to the Restaurant Ordering API');
});

io.on('connection', (socket) => {
  console.log('A user connected: ' + socket.id);
  
  socket.on('joinSession', (guestSessionId) => {
    socket.join(guestSessionId); 
    console.log(`Customer joined the session: ${guestSessionId}`);
  });

  socket.on('disconnect', () => {
    console.log('User disconnected');
  });
});

app.use(errorHandler);

const PORT = process.env.PORT || 4000;
server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`.yellow);
});

module.exports = { io };
