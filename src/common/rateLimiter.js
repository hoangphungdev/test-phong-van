const rateLimit = require('express-rate-limit');

// Cấu hình bộ lọc giới hạn tốc độ
const createRateLimiter = (enabled = true) => {
    if (!enabled) {
        // Nếu bộ lọc bị tắt, không áp dụng giới hạn
        return (req, res, next) => next();
    }

    return rateLimit({
        windowMs: 1000, // 1 giây
        max: 5, // Giới hạn 5 requests mỗi giây
        message: 'Too many requests from this IP, please try again later.',
    });
};

// Export hàm tạo rate limiter
module.exports = createRateLimiter;
