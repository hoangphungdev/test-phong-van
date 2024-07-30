const connection = require('../config/database');
const { hashPassword } = require('../models/database');

// Hàm xử lý trang chủ
const getHomePage = (req, res) => {
    res.render('home_page.ejs')
}

// Hàm xử lý đăng nhập
const login = (req, res) => {
    const { username, password } = req.body;

    if (!username || !password) {
        return res.status(400).json({ result: 'failed', message: 'Username and password are required' });
    }

    const hashedPassword = hashPassword(password);
    const query = 'SELECT * FROM users WHERE username = ? AND password = ?';
    connection.query(query, [username, hashedPassword], (err, results) => {
        if (err) {
            console.error('Error querying the database:', err);
            return res.status(500).json({ result: 'failed', message: 'Internal server error' });
        }

        if (results.length > 0) {
            const userId = results[0].userId;

            const updateQuery = 'UPDATE users SET loggedIn = 1, loggedAt = NOW() WHERE userId = ?';
            connection.query(updateQuery, [userId], (updateErr) => {
                if (updateErr) {
                    console.error('Error updating the user:', updateErr);
                    return res.status(500).json({ result: 'failed', message: 'Internal server error' });
                }

                res.status(200).json({ result: 'success', userId });
            });
        } else {
            res.status(401).json({ result: 'failed', message: 'Invalid username or password' });
        }
    });
}

module.exports = {
    getHomePage,
    login
}
