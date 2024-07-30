const express = require('express');
const configViewEngine = require('./config/viewEngine');
const webRoutes = require('./routes/web')
const { hashPassword, createTableUsers, insertUsers } = require('./models/database');
const createRateLimiter = require('./common/rateLimiter');
require('dotenv').config()
const app = express();
const port = process.env.PORT || 3000;

//config req.body
app.use(express.urlencoded({ extended: true }));
app.use(express.json());


//config view engine
configViewEngine(app);

// Khai báo route
app.use('/', webRoutes);


// Có thể bật/tắt rate limiter ở đây
const isRateLimiterEnabled = true; // Đặt true để bật, false để tắt

// Sử dụng rate limiter
app.use(createRateLimiter(isRateLimiterEnabled));

// Tạo bảng users
// insertUsers();

// Khởi động server
app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});